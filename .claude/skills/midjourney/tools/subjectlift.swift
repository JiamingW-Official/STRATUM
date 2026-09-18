// Lift the subject out of a photograph and write it as a PNG with an alpha
// channel. Uses Vision's foreground-instance mask, which is the same model
// the Photos app uses when you long-press a subject and drag it out — so it
// needs nothing installed and no model downloaded.
//
// Build:  swiftc -O -o subjectlift subjectlift.swift
// Run:    ./subjectlift in.png out.png [--edge 1.2]
//
// Exit codes: 0 wrote a cutout · 2 bad arguments · 3 no subject found
//             (the caller should fall back to keying a flat background)
//             4 could not read or write

import CoreImage
import Foundation
import Vision

func die(_ msg: String, _ code: Int32) -> Never {
  FileHandle.standardError.write((msg + "\n").data(using: .utf8)!)
  exit(code)
}

let args = CommandLine.arguments
guard args.count >= 3 else { die("usage: subjectlift <in> <out.png> [--edge n]", 2) }
let inURL = URL(fileURLWithPath: args[1])
let outURL = URL(fileURLWithPath: args[2])
// A slight blur on the mask only. Vision's edge is hard, and a hard edge on a
// cutout that will sit on a dark panel reads as a sticker.
var edge: Double = 1.0
if let i = args.firstIndex(of: "--edge"), i + 1 < args.count {
  edge = Double(args[i + 1]) ?? 1.0
}

guard let src = CIImage(contentsOf: inURL) else { die("cannot read \(inURL.path)", 4) }

let handler = VNImageRequestHandler(ciImage: src, options: [:])
let request = VNGenerateForegroundInstanceMaskRequest()
do {
  try handler.perform([request])
} catch {
  die("vision failed: \(error)", 4)
}
guard let result = request.results?.first, !result.allInstances.isEmpty else {
  die("no subject", 3)
}

var mask: CIImage
do {
  let buffer = try result.generateScaledMaskForImage(
    forInstances: result.allInstances, from: handler)
  mask = CIImage(cvPixelBuffer: buffer)
} catch {
  die("mask failed: \(error)", 4)
}

if edge > 0 {
  mask =
    mask
    .clampedToExtent()
    .applyingGaussianBlur(sigma: edge)
    .cropped(to: mask.extent)
}

guard
  let blend = CIFilter(
    name: "CIBlendWithMask",
    parameters: [
      kCIInputImageKey: src,
      kCIInputBackgroundImageKey: CIImage.empty(),
      kCIInputMaskImageKey: mask,
    ]),
  let out = blend.outputImage?.cropped(to: src.extent)
else { die("blend failed", 4) }

let ctx = CIContext(options: [.workingColorSpace: CGColorSpaceCreateDeviceRGB()])
do {
  try ctx.writePNGRepresentation(
    of: out, to: outURL, format: .RGBA8,
    colorSpace: CGColorSpaceCreateDeviceRGB())
} catch {
  die("cannot write \(outURL.path): \(error)", 4)
}
let w = Int(src.extent.width)
let h = Int(src.extent.height)
print("lifted \(result.allInstances.count) instance(s) · \(w)x\(h) · \(outURL.lastPathComponent)")
