# src/posters

One frame per film, carried on the aircraft.

None of these films has a poster — they are industrial and educational
shorts and somebody's home movie, shipped in a can with a typed label — so
the cover is a frame from the film. The frames come from the Internet
Archive's own thumbnail for each item, fetched once and written here as
WebP, named after the item's identifier so `stillUrl()` can find them by
glob. 28 files, 166 KB for the shelf.

They are here because asking for them at runtime was slow enough to be a
bug: measured against archive.org's `services/img` endpoint, the median
request took 8.6 seconds and the slowest 10.8, so the first poster appeared
5.2 seconds after Movies opened. A film with no file here still works — it
falls back to the archive's URL, and waits.

**Licence.** Twenty-four of the films are public domain, so their frames are
too. Four are Rick Prelinger's own, under Creative Commons licences that ask
for attribution: the creator and the licence are printed on each of those
films' own cards, which is what the licence asks for.

To refresh one:

    curl -sL https://archive.org/services/img/<identifier> | \
      python3 -c "import sys,io;from PIL import Image;\
      Image.open(io.BytesIO(sys.stdin.buffer.read())).convert('RGB')\
      .save('src/posters/<identifier>.webp','WEBP',quality=82,method=6)"
