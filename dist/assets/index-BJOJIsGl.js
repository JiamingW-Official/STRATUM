(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))n(s);new MutationObserver(s=>{for(const r of s)if(r.type==="childList")for(const a of r.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&n(a)}).observe(document,{childList:!0,subtree:!0});function t(s){const r={};return s.integrity&&(r.integrity=s.integrity),s.referrerPolicy&&(r.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?r.credentials="include":s.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function n(s){if(s.ep)return;s.ep=!0;const r=t(s);fetch(s.href,r)}})();const Vu="183",ks={ROTATE:0,DOLLY:1,PAN:2},Bs={ROTATE:0,PAN:1,DOLLY_PAN:2,DOLLY_ROTATE:3},Og=0,$h=1,Bg=2,No=1,Fg=2,Br=3,gi=0,Qt=1,wt=2,Jn=0,Hs=1,Ln=2,Jh=3,jh=4,zg=5,Ki=100,kg=101,Hg=102,Gg=103,Vg=104,Wg=200,Kg=201,Xg=202,Yg=203,Lc=204,Pc=205,qg=206,$g=207,Jg=208,jg=209,Zg=210,Qg=211,e0=212,t0=213,n0=214,Ic=0,Dc=1,Nc=2,Ys=3,Uc=4,Oc=5,Bc=6,Fc=7,Wu=0,i0=1,s0=2,jn=0,Ku=1,Xu=2,Yu=3,dl=4,qu=5,$u=6,Ju=7,Zh="attached",r0="detached",Cp=300,Ji=301,qs=302,wl=303,Cl=304,fl=306,$s=1e3,_n=1001,Zo=1002,Ct=1003,Rp=1004,Fr=1005,yt=1006,Uo=1007,Pn=1008,cn=1009,Lp=1010,Pp=1011,aa=1012,ju=1013,Zn=1014,yn=1015,hn=1016,Zu=1017,Qu=1018,oa=1020,Ip=35902,Dp=35899,Np=1021,Up=1022,xn=1023,_i=1026,qi=1027,eh=1028,th=1029,Js=1030,nh=1031,ih=1033,Oo=33776,Bo=33777,Fo=33778,zo=33779,zc=35840,kc=35841,Hc=35842,Gc=35843,Vc=36196,Wc=37492,Kc=37496,Xc=37488,Yc=37489,qc=37490,$c=37491,Jc=37808,jc=37809,Zc=37810,Qc=37811,eu=37812,tu=37813,nu=37814,iu=37815,su=37816,ru=37817,au=37818,ou=37819,lu=37820,cu=37821,uu=36492,hu=36494,du=36495,fu=36283,pu=36284,mu=36285,gu=36286,la=2300,ca=2301,Rl=2302,Qh=2303,ed=2400,td=2401,nd=2402,a0=2500,o0=0,Op=1,_u=2,l0=3200,sh=0,c0=1,Ri="",Ut="srgb",en="srgb-linear",Qo="linear",rt="srgb",cs=7680,id=519,u0=512,h0=513,d0=514,rh=515,f0=516,p0=517,ah=518,m0=519,yu=35044,sd="300 es",Yn=2e3,ua=2001;function g0(i){for(let e=i.length-1;e>=0;--e)if(i[e]>=65535)return!0;return!1}function _0(i){return ArrayBuffer.isView(i)&&!(i instanceof DataView)}function ha(i){return document.createElementNS("http://www.w3.org/1999/xhtml",i)}function y0(){const i=ha("canvas");return i.style.display="block",i}const rd={};function el(...i){const e="THREE."+i.shift();console.log(e,...i)}function Bp(i){const e=i[0];if(typeof e=="string"&&e.startsWith("TSL:")){const t=i[1];t&&t.isStackTrace?i[0]+=" "+t.getLocation():i[1]='Stack trace not available. Enable "THREE.Node.captureStackTrace" to capture stack traces.'}return i}function Re(...i){i=Bp(i);const e="THREE."+i.shift();{const t=i[0];t&&t.isStackTrace?console.warn(t.getError(e)):console.warn(e,...i)}}function ze(...i){i=Bp(i);const e="THREE."+i.shift();{const t=i[0];t&&t.isStackTrace?console.error(t.getError(e)):console.error(e,...i)}}function tl(...i){const e=i.join(" ");e in rd||(rd[e]=!0,Re(...i))}function x0(i,e,t){return new Promise(function(n,s){function r(){switch(i.clientWaitSync(e,i.SYNC_FLUSH_COMMANDS_BIT,0)){case i.WAIT_FAILED:s();break;case i.TIMEOUT_EXPIRED:setTimeout(r,t);break;default:n()}}setTimeout(r,t)})}const v0={[Ic]:Dc,[Nc]:Bc,[Uc]:Fc,[Ys]:Oc,[Dc]:Ic,[Bc]:Nc,[Fc]:Uc,[Oc]:Ys};class ts{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});const n=this._listeners;n[e]===void 0&&(n[e]=[]),n[e].indexOf(t)===-1&&n[e].push(t)}hasEventListener(e,t){const n=this._listeners;return n===void 0?!1:n[e]!==void 0&&n[e].indexOf(t)!==-1}removeEventListener(e,t){const n=this._listeners;if(n===void 0)return;const s=n[e];if(s!==void 0){const r=s.indexOf(t);r!==-1&&s.splice(r,1)}}dispatchEvent(e){const t=this._listeners;if(t===void 0)return;const n=t[e.type];if(n!==void 0){e.target=this;const s=n.slice(0);for(let r=0,a=s.length;r<a;r++)s[r].call(this,e);e.target=null}}}const Kt=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"];let ad=1234567;const Yr=Math.PI/180,js=180/Math.PI;function vn(){const i=Math.random()*4294967295|0,e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(Kt[i&255]+Kt[i>>8&255]+Kt[i>>16&255]+Kt[i>>24&255]+"-"+Kt[e&255]+Kt[e>>8&255]+"-"+Kt[e>>16&15|64]+Kt[e>>24&255]+"-"+Kt[t&63|128]+Kt[t>>8&255]+"-"+Kt[t>>16&255]+Kt[t>>24&255]+Kt[n&255]+Kt[n>>8&255]+Kt[n>>16&255]+Kt[n>>24&255]).toLowerCase()}function Ge(i,e,t){return Math.max(e,Math.min(t,i))}function oh(i,e){return(i%e+e)%e}function S0(i,e,t,n,s){return n+(i-e)*(s-n)/(t-e)}function M0(i,e,t){return i!==e?(t-i)/(e-i):0}function qr(i,e,t){return(1-t)*i+t*e}function A0(i,e,t,n){return qr(i,e,1-Math.exp(-t*n))}function b0(i,e=1){return e-Math.abs(oh(i,e*2)-e)}function E0(i,e,t){return i<=e?0:i>=t?1:(i=(i-e)/(t-e),i*i*(3-2*i))}function T0(i,e,t){return i<=e?0:i>=t?1:(i=(i-e)/(t-e),i*i*i*(i*(i*6-15)+10))}function w0(i,e){return i+Math.floor(Math.random()*(e-i+1))}function C0(i,e){return i+Math.random()*(e-i)}function R0(i){return i*(.5-Math.random())}function L0(i){i!==void 0&&(ad=i);let e=ad+=1831565813;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}function P0(i){return i*Yr}function I0(i){return i*js}function D0(i){return(i&i-1)===0&&i!==0}function N0(i){return Math.pow(2,Math.ceil(Math.log(i)/Math.LN2))}function U0(i){return Math.pow(2,Math.floor(Math.log(i)/Math.LN2))}function O0(i,e,t,n,s){const r=Math.cos,a=Math.sin,o=r(t/2),l=a(t/2),c=r((e+n)/2),u=a((e+n)/2),d=r((e-n)/2),h=a((e-n)/2),f=r((n-e)/2),p=a((n-e)/2);switch(s){case"XYX":i.set(o*u,l*d,l*h,o*c);break;case"YZY":i.set(l*h,o*u,l*d,o*c);break;case"ZXZ":i.set(l*d,l*h,o*u,o*c);break;case"XZX":i.set(o*u,l*p,l*f,o*c);break;case"YXY":i.set(l*f,o*u,l*p,o*c);break;case"ZYZ":i.set(l*p,l*f,o*u,o*c);break;default:Re("MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+s)}}function Rn(i,e){switch(e.constructor){case Float32Array:return i;case Uint32Array:return i/4294967295;case Uint16Array:return i/65535;case Uint8Array:return i/255;case Int32Array:return Math.max(i/2147483647,-1);case Int16Array:return Math.max(i/32767,-1);case Int8Array:return Math.max(i/127,-1);default:throw new Error("Invalid component type.")}}function ct(i,e){switch(e.constructor){case Float32Array:return i;case Uint32Array:return Math.round(i*4294967295);case Uint16Array:return Math.round(i*65535);case Uint8Array:return Math.round(i*255);case Int32Array:return Math.round(i*2147483647);case Int16Array:return Math.round(i*32767);case Int8Array:return Math.round(i*127);default:throw new Error("Invalid component type.")}}const lh={DEG2RAD:Yr,RAD2DEG:js,generateUUID:vn,clamp:Ge,euclideanModulo:oh,mapLinear:S0,inverseLerp:M0,lerp:qr,damp:A0,pingpong:b0,smoothstep:E0,smootherstep:T0,randInt:w0,randFloat:C0,randFloatSpread:R0,seededRandom:L0,degToRad:P0,radToDeg:I0,isPowerOfTwo:D0,ceilPowerOfTwo:N0,floorPowerOfTwo:U0,setQuaternionFromProperEuler:O0,normalize:ct,denormalize:Rn};class j{constructor(e=0,t=0){j.prototype.isVector2=!0,this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){const t=this.x,n=this.y,s=e.elements;return this.x=s[0]*t+s[3]*n+s[6],this.y=s[1]*t+s[4]*n+s[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=Ge(this.x,e.x,t.x),this.y=Ge(this.y,e.y,t.y),this}clampScalar(e,t){return this.x=Ge(this.x,e,t),this.y=Ge(this.y,e,t),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Ge(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const n=this.dot(e)/t;return Math.acos(Ge(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,n=this.y-e.y;return t*t+n*n}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){const n=Math.cos(t),s=Math.sin(t),r=this.x-e.x,a=this.y-e.y;return this.x=r*n-a*s+e.x,this.y=r*s+a*n+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class Un{constructor(e=0,t=0,n=0,s=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=n,this._w=s}static slerpFlat(e,t,n,s,r,a,o){let l=n[s+0],c=n[s+1],u=n[s+2],d=n[s+3],h=r[a+0],f=r[a+1],p=r[a+2],_=r[a+3];if(d!==_||l!==h||c!==f||u!==p){let m=l*h+c*f+u*p+d*_;m<0&&(h=-h,f=-f,p=-p,_=-_,m=-m);let g=1-o;if(m<.9995){const S=Math.acos(m),v=Math.sin(S);g=Math.sin(g*S)/v,o=Math.sin(o*S)/v,l=l*g+h*o,c=c*g+f*o,u=u*g+p*o,d=d*g+_*o}else{l=l*g+h*o,c=c*g+f*o,u=u*g+p*o,d=d*g+_*o;const S=1/Math.sqrt(l*l+c*c+u*u+d*d);l*=S,c*=S,u*=S,d*=S}}e[t]=l,e[t+1]=c,e[t+2]=u,e[t+3]=d}static multiplyQuaternionsFlat(e,t,n,s,r,a){const o=n[s],l=n[s+1],c=n[s+2],u=n[s+3],d=r[a],h=r[a+1],f=r[a+2],p=r[a+3];return e[t]=o*p+u*d+l*f-c*h,e[t+1]=l*p+u*h+c*d-o*f,e[t+2]=c*p+u*f+o*h-l*d,e[t+3]=u*p-o*d-l*h-c*f,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,n,s){return this._x=e,this._y=t,this._z=n,this._w=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){const n=e._x,s=e._y,r=e._z,a=e._order,o=Math.cos,l=Math.sin,c=o(n/2),u=o(s/2),d=o(r/2),h=l(n/2),f=l(s/2),p=l(r/2);switch(a){case"XYZ":this._x=h*u*d+c*f*p,this._y=c*f*d-h*u*p,this._z=c*u*p+h*f*d,this._w=c*u*d-h*f*p;break;case"YXZ":this._x=h*u*d+c*f*p,this._y=c*f*d-h*u*p,this._z=c*u*p-h*f*d,this._w=c*u*d+h*f*p;break;case"ZXY":this._x=h*u*d-c*f*p,this._y=c*f*d+h*u*p,this._z=c*u*p+h*f*d,this._w=c*u*d-h*f*p;break;case"ZYX":this._x=h*u*d-c*f*p,this._y=c*f*d+h*u*p,this._z=c*u*p-h*f*d,this._w=c*u*d+h*f*p;break;case"YZX":this._x=h*u*d+c*f*p,this._y=c*f*d+h*u*p,this._z=c*u*p-h*f*d,this._w=c*u*d-h*f*p;break;case"XZY":this._x=h*u*d-c*f*p,this._y=c*f*d-h*u*p,this._z=c*u*p+h*f*d,this._w=c*u*d+h*f*p;break;default:Re("Quaternion: .setFromEuler() encountered an unknown order: "+a)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){const n=t/2,s=Math.sin(n);return this._x=e.x*s,this._y=e.y*s,this._z=e.z*s,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(e){const t=e.elements,n=t[0],s=t[4],r=t[8],a=t[1],o=t[5],l=t[9],c=t[2],u=t[6],d=t[10],h=n+o+d;if(h>0){const f=.5/Math.sqrt(h+1);this._w=.25/f,this._x=(u-l)*f,this._y=(r-c)*f,this._z=(a-s)*f}else if(n>o&&n>d){const f=2*Math.sqrt(1+n-o-d);this._w=(u-l)/f,this._x=.25*f,this._y=(s+a)/f,this._z=(r+c)/f}else if(o>d){const f=2*Math.sqrt(1+o-n-d);this._w=(r-c)/f,this._x=(s+a)/f,this._y=.25*f,this._z=(l+u)/f}else{const f=2*Math.sqrt(1+d-n-o);this._w=(a-s)/f,this._x=(r+c)/f,this._y=(l+u)/f,this._z=.25*f}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let n=e.dot(t)+1;return n<1e-8?(n=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=n):(this._x=0,this._y=-e.z,this._z=e.y,this._w=n)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=n),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(Ge(this.dot(e),-1,1)))}rotateTowards(e,t){const n=this.angleTo(e);if(n===0)return this;const s=Math.min(1,t/n);return this.slerp(e,s),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){const n=e._x,s=e._y,r=e._z,a=e._w,o=t._x,l=t._y,c=t._z,u=t._w;return this._x=n*u+a*o+s*c-r*l,this._y=s*u+a*l+r*o-n*c,this._z=r*u+a*c+n*l-s*o,this._w=a*u-n*o-s*l-r*c,this._onChangeCallback(),this}slerp(e,t){let n=e._x,s=e._y,r=e._z,a=e._w,o=this.dot(e);o<0&&(n=-n,s=-s,r=-r,a=-a,o=-o);let l=1-t;if(o<.9995){const c=Math.acos(o),u=Math.sin(c);l=Math.sin(l*c)/u,t=Math.sin(t*c)/u,this._x=this._x*l+n*t,this._y=this._y*l+s*t,this._z=this._z*l+r*t,this._w=this._w*l+a*t,this._onChangeCallback()}else this._x=this._x*l+n*t,this._y=this._y*l+s*t,this._z=this._z*l+r*t,this._w=this._w*l+a*t,this.normalize();return this}slerpQuaternions(e,t,n){return this.copy(e).slerp(t,n)}random(){const e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),n=Math.random(),s=Math.sqrt(1-n),r=Math.sqrt(n);return this.set(s*Math.sin(e),s*Math.cos(e),r*Math.sin(t),r*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class P{constructor(e=0,t=0,n=0){P.prototype.isVector3=!0,this.x=e,this.y=t,this.z=n}set(e,t,n){return n===void 0&&(n=this.z),this.x=e,this.y=t,this.z=n,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(od.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(od.setFromAxisAngle(e,t))}applyMatrix3(e){const t=this.x,n=this.y,s=this.z,r=e.elements;return this.x=r[0]*t+r[3]*n+r[6]*s,this.y=r[1]*t+r[4]*n+r[7]*s,this.z=r[2]*t+r[5]*n+r[8]*s,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){const t=this.x,n=this.y,s=this.z,r=e.elements,a=1/(r[3]*t+r[7]*n+r[11]*s+r[15]);return this.x=(r[0]*t+r[4]*n+r[8]*s+r[12])*a,this.y=(r[1]*t+r[5]*n+r[9]*s+r[13])*a,this.z=(r[2]*t+r[6]*n+r[10]*s+r[14])*a,this}applyQuaternion(e){const t=this.x,n=this.y,s=this.z,r=e.x,a=e.y,o=e.z,l=e.w,c=2*(a*s-o*n),u=2*(o*t-r*s),d=2*(r*n-a*t);return this.x=t+l*c+a*d-o*u,this.y=n+l*u+o*c-r*d,this.z=s+l*d+r*u-a*c,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){const t=this.x,n=this.y,s=this.z,r=e.elements;return this.x=r[0]*t+r[4]*n+r[8]*s,this.y=r[1]*t+r[5]*n+r[9]*s,this.z=r[2]*t+r[6]*n+r[10]*s,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=Ge(this.x,e.x,t.x),this.y=Ge(this.y,e.y,t.y),this.z=Ge(this.z,e.z,t.z),this}clampScalar(e,t){return this.x=Ge(this.x,e,t),this.y=Ge(this.y,e,t),this.z=Ge(this.z,e,t),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Ge(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){const n=e.x,s=e.y,r=e.z,a=t.x,o=t.y,l=t.z;return this.x=s*l-r*o,this.y=r*a-n*l,this.z=n*o-s*a,this}projectOnVector(e){const t=e.lengthSq();if(t===0)return this.set(0,0,0);const n=e.dot(this)/t;return this.copy(e).multiplyScalar(n)}projectOnPlane(e){return Ll.copy(this).projectOnVector(e),this.sub(Ll)}reflect(e){return this.sub(Ll.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const n=this.dot(e)/t;return Math.acos(Ge(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,n=this.y-e.y,s=this.z-e.z;return t*t+n*n+s*s}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,n){const s=Math.sin(t)*e;return this.x=s*Math.sin(n),this.y=Math.cos(t)*e,this.z=s*Math.cos(n),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,n){return this.x=e*Math.sin(t),this.y=n,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){const t=this.setFromMatrixColumn(e,0).length(),n=this.setFromMatrixColumn(e,1).length(),s=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=n,this.z=s,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const e=Math.random()*Math.PI*2,t=Math.random()*2-1,n=Math.sqrt(1-t*t);return this.x=n*Math.cos(e),this.y=t,this.z=n*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const Ll=new P,od=new Un;class Ye{constructor(e,t,n,s,r,a,o,l,c){Ye.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,n,s,r,a,o,l,c)}set(e,t,n,s,r,a,o,l,c){const u=this.elements;return u[0]=e,u[1]=s,u[2]=o,u[3]=t,u[4]=r,u[5]=l,u[6]=n,u[7]=a,u[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){const t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],this}extractBasis(e,t,n){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(e){const t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const n=e.elements,s=t.elements,r=this.elements,a=n[0],o=n[3],l=n[6],c=n[1],u=n[4],d=n[7],h=n[2],f=n[5],p=n[8],_=s[0],m=s[3],g=s[6],S=s[1],v=s[4],M=s[7],T=s[2],E=s[5],R=s[8];return r[0]=a*_+o*S+l*T,r[3]=a*m+o*v+l*E,r[6]=a*g+o*M+l*R,r[1]=c*_+u*S+d*T,r[4]=c*m+u*v+d*E,r[7]=c*g+u*M+d*R,r[2]=h*_+f*S+p*T,r[5]=h*m+f*v+p*E,r[8]=h*g+f*M+p*R,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){const e=this.elements,t=e[0],n=e[1],s=e[2],r=e[3],a=e[4],o=e[5],l=e[6],c=e[7],u=e[8];return t*a*u-t*o*c-n*r*u+n*o*l+s*r*c-s*a*l}invert(){const e=this.elements,t=e[0],n=e[1],s=e[2],r=e[3],a=e[4],o=e[5],l=e[6],c=e[7],u=e[8],d=u*a-o*c,h=o*l-u*r,f=c*r-a*l,p=t*d+n*h+s*f;if(p===0)return this.set(0,0,0,0,0,0,0,0,0);const _=1/p;return e[0]=d*_,e[1]=(s*c-u*n)*_,e[2]=(o*n-s*a)*_,e[3]=h*_,e[4]=(u*t-s*l)*_,e[5]=(s*r-o*t)*_,e[6]=f*_,e[7]=(n*l-c*t)*_,e[8]=(a*t-n*r)*_,this}transpose(){let e;const t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){const t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,n,s,r,a,o){const l=Math.cos(r),c=Math.sin(r);return this.set(n*l,n*c,-n*(l*a+c*o)+a+e,-s*c,s*l,-s*(-c*a+l*o)+o+t,0,0,1),this}scale(e,t){return this.premultiply(Pl.makeScale(e,t)),this}rotate(e){return this.premultiply(Pl.makeRotation(-e)),this}translate(e,t){return this.premultiply(Pl.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){const t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,n,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){const t=this.elements,n=e.elements;for(let s=0;s<9;s++)if(t[s]!==n[s])return!1;return!0}fromArray(e,t=0){for(let n=0;n<9;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){const n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e}clone(){return new this.constructor().fromArray(this.elements)}}const Pl=new Ye,ld=new Ye().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),cd=new Ye().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function B0(){const i={enabled:!0,workingColorSpace:en,spaces:{},convert:function(s,r,a){return this.enabled===!1||r===a||!r||!a||(this.spaces[r].transfer===rt&&(s.r=mi(s.r),s.g=mi(s.g),s.b=mi(s.b)),this.spaces[r].primaries!==this.spaces[a].primaries&&(s.applyMatrix3(this.spaces[r].toXYZ),s.applyMatrix3(this.spaces[a].fromXYZ)),this.spaces[a].transfer===rt&&(s.r=Gs(s.r),s.g=Gs(s.g),s.b=Gs(s.b))),s},workingToColorSpace:function(s,r){return this.convert(s,this.workingColorSpace,r)},colorSpaceToWorking:function(s,r){return this.convert(s,r,this.workingColorSpace)},getPrimaries:function(s){return this.spaces[s].primaries},getTransfer:function(s){return s===Ri?Qo:this.spaces[s].transfer},getToneMappingMode:function(s){return this.spaces[s].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(s,r=this.workingColorSpace){return s.fromArray(this.spaces[r].luminanceCoefficients)},define:function(s){Object.assign(this.spaces,s)},_getMatrix:function(s,r,a){return s.copy(this.spaces[r].toXYZ).multiply(this.spaces[a].fromXYZ)},_getDrawingBufferColorSpace:function(s){return this.spaces[s].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(s=this.workingColorSpace){return this.spaces[s].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(s,r){return tl("ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace()."),i.workingToColorSpace(s,r)},toWorkingColorSpace:function(s,r){return tl("ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking()."),i.colorSpaceToWorking(s,r)}},e=[.64,.33,.3,.6,.15,.06],t=[.2126,.7152,.0722],n=[.3127,.329];return i.define({[en]:{primaries:e,whitePoint:n,transfer:Qo,toXYZ:ld,fromXYZ:cd,luminanceCoefficients:t,workingColorSpaceConfig:{unpackColorSpace:Ut},outputColorSpaceConfig:{drawingBufferColorSpace:Ut}},[Ut]:{primaries:e,whitePoint:n,transfer:rt,toXYZ:ld,fromXYZ:cd,luminanceCoefficients:t,outputColorSpaceConfig:{drawingBufferColorSpace:Ut}}}),i}const et=B0();function mi(i){return i<.04045?i*.0773993808:Math.pow(i*.9478672986+.0521327014,2.4)}function Gs(i){return i<.0031308?i*12.92:1.055*Math.pow(i,.41666)-.055}let us;class F0{static getDataURL(e,t="image/png"){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let n;if(e instanceof HTMLCanvasElement)n=e;else{us===void 0&&(us=ha("canvas")),us.width=e.width,us.height=e.height;const s=us.getContext("2d");e instanceof ImageData?s.putImageData(e,0,0):s.drawImage(e,0,0,e.width,e.height),n=us}return n.toDataURL(t)}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){const t=ha("canvas");t.width=e.width,t.height=e.height;const n=t.getContext("2d");n.drawImage(e,0,0,e.width,e.height);const s=n.getImageData(0,0,e.width,e.height),r=s.data;for(let a=0;a<r.length;a++)r[a]=mi(r[a]/255)*255;return n.putImageData(s,0,0),t}else if(e.data){const t=e.data.slice(0);for(let n=0;n<t.length;n++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[n]=Math.floor(mi(t[n]/255)*255):t[n]=mi(t[n]);return{data:t,width:e.width,height:e.height}}else return Re("ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}}let z0=0;class ch{constructor(e=null){this.isSource=!0,Object.defineProperty(this,"id",{value:z0++}),this.uuid=vn(),this.data=e,this.dataReady=!0,this.version=0}getSize(e){const t=this.data;return typeof HTMLVideoElement<"u"&&t instanceof HTMLVideoElement?e.set(t.videoWidth,t.videoHeight,0):typeof VideoFrame<"u"&&t instanceof VideoFrame?e.set(t.displayHeight,t.displayWidth,0):t!==null?e.set(t.width,t.height,t.depth||0):e.set(0,0,0),e}set needsUpdate(e){e===!0&&this.version++}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];const n={uuid:this.uuid,url:""},s=this.data;if(s!==null){let r;if(Array.isArray(s)){r=[];for(let a=0,o=s.length;a<o;a++)s[a].isDataTexture?r.push(Il(s[a].image)):r.push(Il(s[a]))}else r=Il(s);n.url=r}return t||(e.images[this.uuid]=n),n}}function Il(i){return typeof HTMLImageElement<"u"&&i instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&i instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&i instanceof ImageBitmap?F0.getDataURL(i):i.data?{data:Array.from(i.data),width:i.width,height:i.height,type:i.data.constructor.name}:(Re("Texture: Unable to serialize Texture."),{})}let k0=0;const Dl=new P;class Rt extends ts{constructor(e=Rt.DEFAULT_IMAGE,t=Rt.DEFAULT_MAPPING,n=_n,s=_n,r=yt,a=Pn,o=xn,l=cn,c=Rt.DEFAULT_ANISOTROPY,u=Ri){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:k0++}),this.uuid=vn(),this.name="",this.source=new ch(e),this.mipmaps=[],this.mapping=t,this.channel=0,this.wrapS=n,this.wrapT=s,this.magFilter=r,this.minFilter=a,this.anisotropy=c,this.format=o,this.internalFormat=null,this.type=l,this.offset=new j(0,0),this.repeat=new j(1,1),this.center=new j(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new Ye,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=u,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(e&&e.depth&&e.depth>1),this.pmremVersion=0}get width(){return this.source.getSize(Dl).x}get height(){return this.source.getSize(Dl).y}get depth(){return this.source.getSize(Dl).z}get image(){return this.source.data}set image(e=null){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.renderTarget=e.renderTarget,this.isRenderTargetTexture=e.isRenderTargetTexture,this.isArrayTexture=e.isArrayTexture,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}setValues(e){for(const t in e){const n=e[t];if(n===void 0){Re(`Texture.setValues(): parameter '${t}' has value of undefined.`);continue}const s=this[t];if(s===void 0){Re(`Texture.setValues(): property '${t}' does not exist.`);continue}s&&n&&s.isVector2&&n.isVector2||s&&n&&s.isVector3&&n.isVector3||s&&n&&s.isMatrix3&&n.isMatrix3?s.copy(n):this[t]=n}}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];const n={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),t||(e.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==Cp)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case $s:e.x=e.x-Math.floor(e.x);break;case _n:e.x=e.x<0?0:1;break;case Zo:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case $s:e.y=e.y-Math.floor(e.y);break;case _n:e.y=e.y<0?0:1;break;case Zo:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}}Rt.DEFAULT_IMAGE=null;Rt.DEFAULT_MAPPING=Cp;Rt.DEFAULT_ANISOTROPY=1;class at{constructor(e=0,t=0,n=0,s=1){at.prototype.isVector4=!0,this.x=e,this.y=t,this.z=n,this.w=s}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,n,s){return this.x=e,this.y=t,this.z=n,this.w=s,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){const t=this.x,n=this.y,s=this.z,r=this.w,a=e.elements;return this.x=a[0]*t+a[4]*n+a[8]*s+a[12]*r,this.y=a[1]*t+a[5]*n+a[9]*s+a[13]*r,this.z=a[2]*t+a[6]*n+a[10]*s+a[14]*r,this.w=a[3]*t+a[7]*n+a[11]*s+a[15]*r,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);const t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,n,s,r;const l=e.elements,c=l[0],u=l[4],d=l[8],h=l[1],f=l[5],p=l[9],_=l[2],m=l[6],g=l[10];if(Math.abs(u-h)<.01&&Math.abs(d-_)<.01&&Math.abs(p-m)<.01){if(Math.abs(u+h)<.1&&Math.abs(d+_)<.1&&Math.abs(p+m)<.1&&Math.abs(c+f+g-3)<.1)return this.set(1,0,0,0),this;t=Math.PI;const v=(c+1)/2,M=(f+1)/2,T=(g+1)/2,E=(u+h)/4,R=(d+_)/4,y=(p+m)/4;return v>M&&v>T?v<.01?(n=0,s=.707106781,r=.707106781):(n=Math.sqrt(v),s=E/n,r=R/n):M>T?M<.01?(n=.707106781,s=0,r=.707106781):(s=Math.sqrt(M),n=E/s,r=y/s):T<.01?(n=.707106781,s=.707106781,r=0):(r=Math.sqrt(T),n=R/r,s=y/r),this.set(n,s,r,t),this}let S=Math.sqrt((m-p)*(m-p)+(d-_)*(d-_)+(h-u)*(h-u));return Math.abs(S)<.001&&(S=1),this.x=(m-p)/S,this.y=(d-_)/S,this.z=(h-u)/S,this.w=Math.acos((c+f+g-1)/2),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this.w=t[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=Ge(this.x,e.x,t.x),this.y=Ge(this.y,e.y,t.y),this.z=Ge(this.z,e.z,t.z),this.w=Ge(this.w,e.w,t.w),this}clampScalar(e,t){return this.x=Ge(this.x,e,t),this.y=Ge(this.y,e,t),this.z=Ge(this.z,e,t),this.w=Ge(this.w,e,t),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Ge(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this.w=e.w+(t.w-e.w)*n,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class H0 extends ts{constructor(e=1,t=1,n={}){super(),n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:yt,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1},n),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=n.depth,this.scissor=new at(0,0,e,t),this.scissorTest=!1,this.viewport=new at(0,0,e,t),this.textures=[];const s={width:e,height:t,depth:n.depth},r=new Rt(s),a=n.count;for(let o=0;o<a;o++)this.textures[o]=r.clone(),this.textures[o].isRenderTargetTexture=!0,this.textures[o].renderTarget=this;this._setTextureOptions(n),this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this._depthTexture=null,this.depthTexture=n.depthTexture,this.samples=n.samples,this.multiview=n.multiview}_setTextureOptions(e={}){const t={minFilter:yt,generateMipmaps:!1,flipY:!1,internalFormat:null};e.mapping!==void 0&&(t.mapping=e.mapping),e.wrapS!==void 0&&(t.wrapS=e.wrapS),e.wrapT!==void 0&&(t.wrapT=e.wrapT),e.wrapR!==void 0&&(t.wrapR=e.wrapR),e.magFilter!==void 0&&(t.magFilter=e.magFilter),e.minFilter!==void 0&&(t.minFilter=e.minFilter),e.format!==void 0&&(t.format=e.format),e.type!==void 0&&(t.type=e.type),e.anisotropy!==void 0&&(t.anisotropy=e.anisotropy),e.colorSpace!==void 0&&(t.colorSpace=e.colorSpace),e.flipY!==void 0&&(t.flipY=e.flipY),e.generateMipmaps!==void 0&&(t.generateMipmaps=e.generateMipmaps),e.internalFormat!==void 0&&(t.internalFormat=e.internalFormat);for(let n=0;n<this.textures.length;n++)this.textures[n].setValues(t)}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}set depthTexture(e){this._depthTexture!==null&&(this._depthTexture.renderTarget=null),e!==null&&(e.renderTarget=this),this._depthTexture=e}get depthTexture(){return this._depthTexture}setSize(e,t,n=1){if(this.width!==e||this.height!==t||this.depth!==n){this.width=e,this.height=t,this.depth=n;for(let s=0,r=this.textures.length;s<r;s++)this.textures[s].image.width=e,this.textures[s].image.height=t,this.textures[s].image.depth=n,this.textures[s].isData3DTexture!==!0&&(this.textures[s].isArrayTexture=this.textures[s].image.depth>1);this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let t=0,n=e.textures.length;t<n;t++){this.textures[t]=e.textures[t].clone(),this.textures[t].isRenderTargetTexture=!0,this.textures[t].renderTarget=this;const s=Object.assign({},e.textures[t].image);this.textures[t].source=new ch(s)}return this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,e.depthTexture!==null&&(this.depthTexture=e.depthTexture.clone()),this.samples=e.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class rn extends H0{constructor(e=1,t=1,n={}){super(e,t,n),this.isWebGLRenderTarget=!0}}class Fp extends Rt{constructor(e=null,t=1,n=1,s=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:n,depth:s},this.magFilter=Ct,this.minFilter=Ct,this.wrapR=_n,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}}class G0 extends Rt{constructor(e=null,t=1,n=1,s=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:n,depth:s},this.magFilter=Ct,this.minFilter=Ct,this.wrapR=_n,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class Ke{constructor(e,t,n,s,r,a,o,l,c,u,d,h,f,p,_,m){Ke.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,n,s,r,a,o,l,c,u,d,h,f,p,_,m)}set(e,t,n,s,r,a,o,l,c,u,d,h,f,p,_,m){const g=this.elements;return g[0]=e,g[4]=t,g[8]=n,g[12]=s,g[1]=r,g[5]=a,g[9]=o,g[13]=l,g[2]=c,g[6]=u,g[10]=d,g[14]=h,g[3]=f,g[7]=p,g[11]=_,g[15]=m,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new Ke().fromArray(this.elements)}copy(e){const t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],t[9]=n[9],t[10]=n[10],t[11]=n[11],t[12]=n[12],t[13]=n[13],t[14]=n[14],t[15]=n[15],this}copyPosition(e){const t=this.elements,n=e.elements;return t[12]=n[12],t[13]=n[13],t[14]=n[14],this}setFromMatrix3(e){const t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,n){return this.determinant()===0?(e.set(1,0,0),t.set(0,1,0),n.set(0,0,1),this):(e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this)}makeBasis(e,t,n){return this.set(e.x,t.x,n.x,0,e.y,t.y,n.y,0,e.z,t.z,n.z,0,0,0,0,1),this}extractRotation(e){if(e.determinant()===0)return this.identity();const t=this.elements,n=e.elements,s=1/hs.setFromMatrixColumn(e,0).length(),r=1/hs.setFromMatrixColumn(e,1).length(),a=1/hs.setFromMatrixColumn(e,2).length();return t[0]=n[0]*s,t[1]=n[1]*s,t[2]=n[2]*s,t[3]=0,t[4]=n[4]*r,t[5]=n[5]*r,t[6]=n[6]*r,t[7]=0,t[8]=n[8]*a,t[9]=n[9]*a,t[10]=n[10]*a,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){const t=this.elements,n=e.x,s=e.y,r=e.z,a=Math.cos(n),o=Math.sin(n),l=Math.cos(s),c=Math.sin(s),u=Math.cos(r),d=Math.sin(r);if(e.order==="XYZ"){const h=a*u,f=a*d,p=o*u,_=o*d;t[0]=l*u,t[4]=-l*d,t[8]=c,t[1]=f+p*c,t[5]=h-_*c,t[9]=-o*l,t[2]=_-h*c,t[6]=p+f*c,t[10]=a*l}else if(e.order==="YXZ"){const h=l*u,f=l*d,p=c*u,_=c*d;t[0]=h+_*o,t[4]=p*o-f,t[8]=a*c,t[1]=a*d,t[5]=a*u,t[9]=-o,t[2]=f*o-p,t[6]=_+h*o,t[10]=a*l}else if(e.order==="ZXY"){const h=l*u,f=l*d,p=c*u,_=c*d;t[0]=h-_*o,t[4]=-a*d,t[8]=p+f*o,t[1]=f+p*o,t[5]=a*u,t[9]=_-h*o,t[2]=-a*c,t[6]=o,t[10]=a*l}else if(e.order==="ZYX"){const h=a*u,f=a*d,p=o*u,_=o*d;t[0]=l*u,t[4]=p*c-f,t[8]=h*c+_,t[1]=l*d,t[5]=_*c+h,t[9]=f*c-p,t[2]=-c,t[6]=o*l,t[10]=a*l}else if(e.order==="YZX"){const h=a*l,f=a*c,p=o*l,_=o*c;t[0]=l*u,t[4]=_-h*d,t[8]=p*d+f,t[1]=d,t[5]=a*u,t[9]=-o*u,t[2]=-c*u,t[6]=f*d+p,t[10]=h-_*d}else if(e.order==="XZY"){const h=a*l,f=a*c,p=o*l,_=o*c;t[0]=l*u,t[4]=-d,t[8]=c*u,t[1]=h*d+_,t[5]=a*u,t[9]=f*d-p,t[2]=p*d-f,t[6]=o*u,t[10]=_*d+h}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(V0,e,W0)}lookAt(e,t,n){const s=this.elements;return on.subVectors(e,t),on.lengthSq()===0&&(on.z=1),on.normalize(),vi.crossVectors(n,on),vi.lengthSq()===0&&(Math.abs(n.z)===1?on.x+=1e-4:on.z+=1e-4,on.normalize(),vi.crossVectors(n,on)),vi.normalize(),La.crossVectors(on,vi),s[0]=vi.x,s[4]=La.x,s[8]=on.x,s[1]=vi.y,s[5]=La.y,s[9]=on.y,s[2]=vi.z,s[6]=La.z,s[10]=on.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const n=e.elements,s=t.elements,r=this.elements,a=n[0],o=n[4],l=n[8],c=n[12],u=n[1],d=n[5],h=n[9],f=n[13],p=n[2],_=n[6],m=n[10],g=n[14],S=n[3],v=n[7],M=n[11],T=n[15],E=s[0],R=s[4],y=s[8],A=s[12],U=s[1],C=s[5],I=s[9],O=s[13],z=s[2],B=s[6],H=s[10],k=s[14],ie=s[3],G=s[7],Z=s[11],J=s[15];return r[0]=a*E+o*U+l*z+c*ie,r[4]=a*R+o*C+l*B+c*G,r[8]=a*y+o*I+l*H+c*Z,r[12]=a*A+o*O+l*k+c*J,r[1]=u*E+d*U+h*z+f*ie,r[5]=u*R+d*C+h*B+f*G,r[9]=u*y+d*I+h*H+f*Z,r[13]=u*A+d*O+h*k+f*J,r[2]=p*E+_*U+m*z+g*ie,r[6]=p*R+_*C+m*B+g*G,r[10]=p*y+_*I+m*H+g*Z,r[14]=p*A+_*O+m*k+g*J,r[3]=S*E+v*U+M*z+T*ie,r[7]=S*R+v*C+M*B+T*G,r[11]=S*y+v*I+M*H+T*Z,r[15]=S*A+v*O+M*k+T*J,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){const e=this.elements,t=e[0],n=e[4],s=e[8],r=e[12],a=e[1],o=e[5],l=e[9],c=e[13],u=e[2],d=e[6],h=e[10],f=e[14],p=e[3],_=e[7],m=e[11],g=e[15],S=l*f-c*h,v=o*f-c*d,M=o*h-l*d,T=a*f-c*u,E=a*h-l*u,R=a*d-o*u;return t*(_*S-m*v+g*M)-n*(p*S-m*T+g*E)+s*(p*v-_*T+g*R)-r*(p*M-_*E+m*R)}transpose(){const e=this.elements;let t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,n){const s=this.elements;return e.isVector3?(s[12]=e.x,s[13]=e.y,s[14]=e.z):(s[12]=e,s[13]=t,s[14]=n),this}invert(){const e=this.elements,t=e[0],n=e[1],s=e[2],r=e[3],a=e[4],o=e[5],l=e[6],c=e[7],u=e[8],d=e[9],h=e[10],f=e[11],p=e[12],_=e[13],m=e[14],g=e[15],S=t*o-n*a,v=t*l-s*a,M=t*c-r*a,T=n*l-s*o,E=n*c-r*o,R=s*c-r*l,y=u*_-d*p,A=u*m-h*p,U=u*g-f*p,C=d*m-h*_,I=d*g-f*_,O=h*g-f*m,z=S*O-v*I+M*C+T*U-E*A+R*y;if(z===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const B=1/z;return e[0]=(o*O-l*I+c*C)*B,e[1]=(s*I-n*O-r*C)*B,e[2]=(_*R-m*E+g*T)*B,e[3]=(h*E-d*R-f*T)*B,e[4]=(l*U-a*O-c*A)*B,e[5]=(t*O-s*U+r*A)*B,e[6]=(m*M-p*R-g*v)*B,e[7]=(u*R-h*M+f*v)*B,e[8]=(a*I-o*U+c*y)*B,e[9]=(n*U-t*I-r*y)*B,e[10]=(p*E-_*M+g*S)*B,e[11]=(d*M-u*E-f*S)*B,e[12]=(o*A-a*C-l*y)*B,e[13]=(t*C-n*A+s*y)*B,e[14]=(_*v-p*T-m*S)*B,e[15]=(u*T-d*v+h*S)*B,this}scale(e){const t=this.elements,n=e.x,s=e.y,r=e.z;return t[0]*=n,t[4]*=s,t[8]*=r,t[1]*=n,t[5]*=s,t[9]*=r,t[2]*=n,t[6]*=s,t[10]*=r,t[3]*=n,t[7]*=s,t[11]*=r,this}getMaxScaleOnAxis(){const e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],n=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],s=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,n,s))}makeTranslation(e,t,n){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,n,0,0,0,1),this}makeRotationX(e){const t=Math.cos(e),n=Math.sin(e);return this.set(1,0,0,0,0,t,-n,0,0,n,t,0,0,0,0,1),this}makeRotationY(e){const t=Math.cos(e),n=Math.sin(e);return this.set(t,0,n,0,0,1,0,0,-n,0,t,0,0,0,0,1),this}makeRotationZ(e){const t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,0,n,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){const n=Math.cos(t),s=Math.sin(t),r=1-n,a=e.x,o=e.y,l=e.z,c=r*a,u=r*o;return this.set(c*a+n,c*o-s*l,c*l+s*o,0,c*o+s*l,u*o+n,u*l-s*a,0,c*l-s*o,u*l+s*a,r*l*l+n,0,0,0,0,1),this}makeScale(e,t,n){return this.set(e,0,0,0,0,t,0,0,0,0,n,0,0,0,0,1),this}makeShear(e,t,n,s,r,a){return this.set(1,n,r,0,e,1,a,0,t,s,1,0,0,0,0,1),this}compose(e,t,n){const s=this.elements,r=t._x,a=t._y,o=t._z,l=t._w,c=r+r,u=a+a,d=o+o,h=r*c,f=r*u,p=r*d,_=a*u,m=a*d,g=o*d,S=l*c,v=l*u,M=l*d,T=n.x,E=n.y,R=n.z;return s[0]=(1-(_+g))*T,s[1]=(f+M)*T,s[2]=(p-v)*T,s[3]=0,s[4]=(f-M)*E,s[5]=(1-(h+g))*E,s[6]=(m+S)*E,s[7]=0,s[8]=(p+v)*R,s[9]=(m-S)*R,s[10]=(1-(h+_))*R,s[11]=0,s[12]=e.x,s[13]=e.y,s[14]=e.z,s[15]=1,this}decompose(e,t,n){const s=this.elements;e.x=s[12],e.y=s[13],e.z=s[14];const r=this.determinant();if(r===0)return n.set(1,1,1),t.identity(),this;let a=hs.set(s[0],s[1],s[2]).length();const o=hs.set(s[4],s[5],s[6]).length(),l=hs.set(s[8],s[9],s[10]).length();r<0&&(a=-a),bn.copy(this);const c=1/a,u=1/o,d=1/l;return bn.elements[0]*=c,bn.elements[1]*=c,bn.elements[2]*=c,bn.elements[4]*=u,bn.elements[5]*=u,bn.elements[6]*=u,bn.elements[8]*=d,bn.elements[9]*=d,bn.elements[10]*=d,t.setFromRotationMatrix(bn),n.x=a,n.y=o,n.z=l,this}makePerspective(e,t,n,s,r,a,o=Yn,l=!1){const c=this.elements,u=2*r/(t-e),d=2*r/(n-s),h=(t+e)/(t-e),f=(n+s)/(n-s);let p,_;if(l)p=r/(a-r),_=a*r/(a-r);else if(o===Yn)p=-(a+r)/(a-r),_=-2*a*r/(a-r);else if(o===ua)p=-a/(a-r),_=-a*r/(a-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+o);return c[0]=u,c[4]=0,c[8]=h,c[12]=0,c[1]=0,c[5]=d,c[9]=f,c[13]=0,c[2]=0,c[6]=0,c[10]=p,c[14]=_,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(e,t,n,s,r,a,o=Yn,l=!1){const c=this.elements,u=2/(t-e),d=2/(n-s),h=-(t+e)/(t-e),f=-(n+s)/(n-s);let p,_;if(l)p=1/(a-r),_=a/(a-r);else if(o===Yn)p=-2/(a-r),_=-(a+r)/(a-r);else if(o===ua)p=-1/(a-r),_=-r/(a-r);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+o);return c[0]=u,c[4]=0,c[8]=0,c[12]=h,c[1]=0,c[5]=d,c[9]=0,c[13]=f,c[2]=0,c[6]=0,c[10]=p,c[14]=_,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(e){const t=this.elements,n=e.elements;for(let s=0;s<16;s++)if(t[s]!==n[s])return!1;return!0}fromArray(e,t=0){for(let n=0;n<16;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){const n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e[t+9]=n[9],e[t+10]=n[10],e[t+11]=n[11],e[t+12]=n[12],e[t+13]=n[13],e[t+14]=n[14],e[t+15]=n[15],e}}const hs=new P,bn=new Ke,V0=new P(0,0,0),W0=new P(1,1,1),vi=new P,La=new P,on=new P,ud=new Ke,hd=new Un;class On{constructor(e=0,t=0,n=0,s=On.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=t,this._z=n,this._order=s}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,n,s=this._order){return this._x=e,this._y=t,this._z=n,this._order=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,n=!0){const s=e.elements,r=s[0],a=s[4],o=s[8],l=s[1],c=s[5],u=s[9],d=s[2],h=s[6],f=s[10];switch(t){case"XYZ":this._y=Math.asin(Ge(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-u,f),this._z=Math.atan2(-a,r)):(this._x=Math.atan2(h,c),this._z=0);break;case"YXZ":this._x=Math.asin(-Ge(u,-1,1)),Math.abs(u)<.9999999?(this._y=Math.atan2(o,f),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-d,r),this._z=0);break;case"ZXY":this._x=Math.asin(Ge(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(-d,f),this._z=Math.atan2(-a,c)):(this._y=0,this._z=Math.atan2(l,r));break;case"ZYX":this._y=Math.asin(-Ge(d,-1,1)),Math.abs(d)<.9999999?(this._x=Math.atan2(h,f),this._z=Math.atan2(l,r)):(this._x=0,this._z=Math.atan2(-a,c));break;case"YZX":this._z=Math.asin(Ge(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-u,c),this._y=Math.atan2(-d,r)):(this._x=0,this._y=Math.atan2(o,f));break;case"XZY":this._z=Math.asin(-Ge(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(h,c),this._y=Math.atan2(o,r)):(this._x=Math.atan2(-u,f),this._y=0);break;default:Re("Euler: .setFromRotationMatrix() encountered an unknown order: "+t)}return this._order=t,n===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,n){return ud.makeRotationFromQuaternion(e),this.setFromRotationMatrix(ud,t,n)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return hd.setFromEuler(this),this.setFromQuaternion(hd,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}On.DEFAULT_ORDER="XYZ";class uh{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}}let K0=0;const dd=new P,ds=new Un,ii=new Ke,Pa=new P,xr=new P,X0=new P,Y0=new Un,fd=new P(1,0,0),pd=new P(0,1,0),md=new P(0,0,1),gd={type:"added"},q0={type:"removed"},fs={type:"childadded",child:null},Nl={type:"childremoved",child:null};class xt extends ts{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:K0++}),this.uuid=vn(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=xt.DEFAULT_UP.clone();const e=new P,t=new On,n=new Un,s=new P(1,1,1);function r(){n.setFromEuler(t,!1)}function a(){t.setFromQuaternion(n,void 0,!1)}t._onChange(r),n._onChange(a),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:t},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:s},modelViewMatrix:{value:new Ke},normalMatrix:{value:new Ye}}),this.matrix=new Ke,this.matrixWorld=new Ke,this.matrixAutoUpdate=xt.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=xt.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new uh,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.static=!1,this.userData={},this.pivot=null}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return ds.setFromAxisAngle(e,t),this.quaternion.multiply(ds),this}rotateOnWorldAxis(e,t){return ds.setFromAxisAngle(e,t),this.quaternion.premultiply(ds),this}rotateX(e){return this.rotateOnAxis(fd,e)}rotateY(e){return this.rotateOnAxis(pd,e)}rotateZ(e){return this.rotateOnAxis(md,e)}translateOnAxis(e,t){return dd.copy(e).applyQuaternion(this.quaternion),this.position.add(dd.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(fd,e)}translateY(e){return this.translateOnAxis(pd,e)}translateZ(e){return this.translateOnAxis(md,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(ii.copy(this.matrixWorld).invert())}lookAt(e,t,n){e.isVector3?Pa.copy(e):Pa.set(e,t,n);const s=this.parent;this.updateWorldMatrix(!0,!1),xr.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?ii.lookAt(xr,Pa,this.up):ii.lookAt(Pa,xr,this.up),this.quaternion.setFromRotationMatrix(ii),s&&(ii.extractRotation(s.matrixWorld),ds.setFromRotationMatrix(ii),this.quaternion.premultiply(ds.invert()))}add(e){if(arguments.length>1){for(let t=0;t<arguments.length;t++)this.add(arguments[t]);return this}return e===this?(ze("Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(gd),fs.child=e,this.dispatchEvent(fs),fs.child=null):ze("Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}const t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(q0),Nl.child=e,this.dispatchEvent(Nl),Nl.child=null),this}removeFromParent(){const e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),ii.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),ii.multiply(e.parent.matrixWorld)),e.applyMatrix4(ii),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(gd),fs.child=e,this.dispatchEvent(fs),fs.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let n=0,s=this.children.length;n<s;n++){const a=this.children[n].getObjectByProperty(e,t);if(a!==void 0)return a}}getObjectsByProperty(e,t,n=[]){this[e]===t&&n.push(this);const s=this.children;for(let r=0,a=s.length;r<a;r++)s[r].getObjectsByProperty(e,t,n);return n}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(xr,e,X0),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(xr,Y0,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);const t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}traverse(e){e(this);const t=this.children;for(let n=0,s=t.length;n<s;n++)t[n].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);const t=this.children;for(let n=0,s=t.length;n<s;n++)t[n].traverseVisible(e)}traverseAncestors(e){const t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale);const e=this.pivot;if(e!==null){const t=e.x,n=e.y,s=e.z,r=this.matrix.elements;r[12]+=t-r[0]*t-r[4]*n-r[8]*s,r[13]+=n-r[1]*t-r[5]*n-r[9]*s,r[14]+=s-r[2]*t-r[6]*n-r[10]*s}this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);const t=this.children;for(let n=0,s=t.length;n<s;n++)t[n].updateMatrixWorld(e)}updateWorldMatrix(e,t){const n=this.parent;if(e===!0&&n!==null&&n.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),t===!0){const s=this.children;for(let r=0,a=s.length;r<a;r++)s[r].updateWorldMatrix(!1,!0)}}toJSON(e){const t=e===void 0||typeof e=="string",n={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});const s={};s.uuid=this.uuid,s.type=this.type,this.name!==""&&(s.name=this.name),this.castShadow===!0&&(s.castShadow=!0),this.receiveShadow===!0&&(s.receiveShadow=!0),this.visible===!1&&(s.visible=!1),this.frustumCulled===!1&&(s.frustumCulled=!1),this.renderOrder!==0&&(s.renderOrder=this.renderOrder),this.static!==!1&&(s.static=this.static),Object.keys(this.userData).length>0&&(s.userData=this.userData),s.layers=this.layers.mask,s.matrix=this.matrix.toArray(),s.up=this.up.toArray(),this.pivot!==null&&(s.pivot=this.pivot.toArray()),this.matrixAutoUpdate===!1&&(s.matrixAutoUpdate=!1),this.morphTargetDictionary!==void 0&&(s.morphTargetDictionary=Object.assign({},this.morphTargetDictionary)),this.morphTargetInfluences!==void 0&&(s.morphTargetInfluences=this.morphTargetInfluences.slice()),this.isInstancedMesh&&(s.type="InstancedMesh",s.count=this.count,s.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(s.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(s.type="BatchedMesh",s.perObjectFrustumCulled=this.perObjectFrustumCulled,s.sortObjects=this.sortObjects,s.drawRanges=this._drawRanges,s.reservedRanges=this._reservedRanges,s.geometryInfo=this._geometryInfo.map(o=>({...o,boundingBox:o.boundingBox?o.boundingBox.toJSON():void 0,boundingSphere:o.boundingSphere?o.boundingSphere.toJSON():void 0})),s.instanceInfo=this._instanceInfo.map(o=>({...o})),s.availableInstanceIds=this._availableInstanceIds.slice(),s.availableGeometryIds=this._availableGeometryIds.slice(),s.nextIndexStart=this._nextIndexStart,s.nextVertexStart=this._nextVertexStart,s.geometryCount=this._geometryCount,s.maxInstanceCount=this._maxInstanceCount,s.maxVertexCount=this._maxVertexCount,s.maxIndexCount=this._maxIndexCount,s.geometryInitialized=this._geometryInitialized,s.matricesTexture=this._matricesTexture.toJSON(e),s.indirectTexture=this._indirectTexture.toJSON(e),this._colorsTexture!==null&&(s.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(s.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(s.boundingBox=this.boundingBox.toJSON()));function r(o,l){return o[l.uuid]===void 0&&(o[l.uuid]=l.toJSON(e)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?s.background=this.background.toJSON():this.background.isTexture&&(s.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(s.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){s.geometry=r(e.geometries,this.geometry);const o=this.geometry.parameters;if(o!==void 0&&o.shapes!==void 0){const l=o.shapes;if(Array.isArray(l))for(let c=0,u=l.length;c<u;c++){const d=l[c];r(e.shapes,d)}else r(e.shapes,l)}}if(this.isSkinnedMesh&&(s.bindMode=this.bindMode,s.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(e.skeletons,this.skeleton),s.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const o=[];for(let l=0,c=this.material.length;l<c;l++)o.push(r(e.materials,this.material[l]));s.material=o}else s.material=r(e.materials,this.material);if(this.children.length>0){s.children=[];for(let o=0;o<this.children.length;o++)s.children.push(this.children[o].toJSON(e).object)}if(this.animations.length>0){s.animations=[];for(let o=0;o<this.animations.length;o++){const l=this.animations[o];s.animations.push(r(e.animations,l))}}if(t){const o=a(e.geometries),l=a(e.materials),c=a(e.textures),u=a(e.images),d=a(e.shapes),h=a(e.skeletons),f=a(e.animations),p=a(e.nodes);o.length>0&&(n.geometries=o),l.length>0&&(n.materials=l),c.length>0&&(n.textures=c),u.length>0&&(n.images=u),d.length>0&&(n.shapes=d),h.length>0&&(n.skeletons=h),f.length>0&&(n.animations=f),p.length>0&&(n.nodes=p)}return n.object=s,n;function a(o){const l=[];for(const c in o){const u=o[c];delete u.metadata,l.push(u)}return l}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),e.pivot!==null&&(this.pivot=e.pivot.clone()),this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.static=e.static,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let n=0;n<e.children.length;n++){const s=e.children[n];this.add(s.clone())}return this}}xt.DEFAULT_UP=new P(0,1,0);xt.DEFAULT_MATRIX_AUTO_UPDATE=!0;xt.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;class In extends xt{constructor(){super(),this.isGroup=!0,this.type="Group"}}const $0={type:"move"};class Ul{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new In,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new In,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new P,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new P),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new In,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new P,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new P),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){const t=this._hand;if(t)for(const n of e.hand.values())this._getHandJoint(t,n)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,n){let s=null,r=null,a=null;const o=this._targetRay,l=this._grip,c=this._hand;if(e&&t.session.visibilityState!=="visible-blurred"){if(c&&e.hand){a=!0;for(const _ of e.hand.values()){const m=t.getJointPose(_,n),g=this._getHandJoint(c,_);m!==null&&(g.matrix.fromArray(m.transform.matrix),g.matrix.decompose(g.position,g.rotation,g.scale),g.matrixWorldNeedsUpdate=!0,g.jointRadius=m.radius),g.visible=m!==null}const u=c.joints["index-finger-tip"],d=c.joints["thumb-tip"],h=u.position.distanceTo(d.position),f=.02,p=.005;c.inputState.pinching&&h>f+p?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!c.inputState.pinching&&h<=f-p&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else l!==null&&e.gripSpace&&(r=t.getPose(e.gripSpace,n),r!==null&&(l.matrix.fromArray(r.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,r.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(r.linearVelocity)):l.hasLinearVelocity=!1,r.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(r.angularVelocity)):l.hasAngularVelocity=!1));o!==null&&(s=t.getPose(e.targetRaySpace,n),s===null&&r!==null&&(s=r),s!==null&&(o.matrix.fromArray(s.transform.matrix),o.matrix.decompose(o.position,o.rotation,o.scale),o.matrixWorldNeedsUpdate=!0,s.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(s.linearVelocity)):o.hasLinearVelocity=!1,s.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(s.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent($0)))}return o!==null&&(o.visible=s!==null),l!==null&&(l.visible=r!==null),c!==null&&(c.visible=a!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){const n=new In;n.matrixAutoUpdate=!1,n.visible=!1,e.joints[t.jointName]=n,e.add(n)}return e.joints[t.jointName]}}const zp={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Si={h:0,s:0,l:0},Ia={h:0,s:0,l:0};function Ol(i,e,t){return t<0&&(t+=1),t>1&&(t-=1),t<1/6?i+(e-i)*6*t:t<1/2?e:t<2/3?i+(e-i)*6*(2/3-t):i}class ve{constructor(e,t,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,n)}set(e,t,n){if(t===void 0&&n===void 0){const s=e;s&&s.isColor?this.copy(s):typeof s=="number"?this.setHex(s):typeof s=="string"&&this.setStyle(s)}else this.setRGB(e,t,n);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=Ut){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,et.colorSpaceToWorking(this,t),this}setRGB(e,t,n,s=et.workingColorSpace){return this.r=e,this.g=t,this.b=n,et.colorSpaceToWorking(this,s),this}setHSL(e,t,n,s=et.workingColorSpace){if(e=oh(e,1),t=Ge(t,0,1),n=Ge(n,0,1),t===0)this.r=this.g=this.b=n;else{const r=n<=.5?n*(1+t):n+t-n*t,a=2*n-r;this.r=Ol(a,r,e+1/3),this.g=Ol(a,r,e),this.b=Ol(a,r,e-1/3)}return et.colorSpaceToWorking(this,s),this}setStyle(e,t=Ut){function n(r){r!==void 0&&parseFloat(r)<1&&Re("Color: Alpha component of "+e+" will be ignored.")}let s;if(s=/^(\w+)\(([^\)]*)\)/.exec(e)){let r;const a=s[1],o=s[2];switch(a){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,t);if(r=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setRGB(Math.min(100,parseInt(r[1],10))/100,Math.min(100,parseInt(r[2],10))/100,Math.min(100,parseInt(r[3],10))/100,t);break;case"hsl":case"hsla":if(r=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,t);break;default:Re("Color: Unknown color model "+e)}}else if(s=/^\#([A-Fa-f\d]+)$/.exec(e)){const r=s[1],a=r.length;if(a===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,t);if(a===6)return this.setHex(parseInt(r,16),t);Re("Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=Ut){const n=zp[e.toLowerCase()];return n!==void 0?this.setHex(n,t):Re("Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=mi(e.r),this.g=mi(e.g),this.b=mi(e.b),this}copyLinearToSRGB(e){return this.r=Gs(e.r),this.g=Gs(e.g),this.b=Gs(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=Ut){return et.workingToColorSpace(Xt.copy(this),e),Math.round(Ge(Xt.r*255,0,255))*65536+Math.round(Ge(Xt.g*255,0,255))*256+Math.round(Ge(Xt.b*255,0,255))}getHexString(e=Ut){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=et.workingColorSpace){et.workingToColorSpace(Xt.copy(this),t);const n=Xt.r,s=Xt.g,r=Xt.b,a=Math.max(n,s,r),o=Math.min(n,s,r);let l,c;const u=(o+a)/2;if(o===a)l=0,c=0;else{const d=a-o;switch(c=u<=.5?d/(a+o):d/(2-a-o),a){case n:l=(s-r)/d+(s<r?6:0);break;case s:l=(r-n)/d+2;break;case r:l=(n-s)/d+4;break}l/=6}return e.h=l,e.s=c,e.l=u,e}getRGB(e,t=et.workingColorSpace){return et.workingToColorSpace(Xt.copy(this),t),e.r=Xt.r,e.g=Xt.g,e.b=Xt.b,e}getStyle(e=Ut){et.workingToColorSpace(Xt.copy(this),e);const t=Xt.r,n=Xt.g,s=Xt.b;return e!==Ut?`color(${e} ${t.toFixed(3)} ${n.toFixed(3)} ${s.toFixed(3)})`:`rgb(${Math.round(t*255)},${Math.round(n*255)},${Math.round(s*255)})`}offsetHSL(e,t,n){return this.getHSL(Si),this.setHSL(Si.h+e,Si.s+t,Si.l+n)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,n){return this.r=e.r+(t.r-e.r)*n,this.g=e.g+(t.g-e.g)*n,this.b=e.b+(t.b-e.b)*n,this}lerpHSL(e,t){this.getHSL(Si),e.getHSL(Ia);const n=qr(Si.h,Ia.h,t),s=qr(Si.s,Ia.s,t),r=qr(Si.l,Ia.l,t);return this.setHSL(n,s,r),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){const t=this.r,n=this.g,s=this.b,r=e.elements;return this.r=r[0]*t+r[3]*n+r[6]*s,this.g=r[1]*t+r[4]*n+r[7]*s,this.b=r[2]*t+r[5]*n+r[8]*s,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const Xt=new ve;ve.NAMES=zp;class pl{constructor(e,t=25e-5){this.isFogExp2=!0,this.name="",this.color=new ve(e),this.density=t}clone(){return new pl(this.color,this.density)}toJSON(){return{type:"FogExp2",name:this.name,color:this.color.getHex(),density:this.density}}}class J0 extends xt{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new On,this.environmentIntensity=1,this.environmentRotation=new On,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,t){return super.copy(e,t),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){const t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(t.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(t.object.backgroundIntensity=this.backgroundIntensity),t.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(t.object.environmentIntensity=this.environmentIntensity),t.object.environmentRotation=this.environmentRotation.toArray(),t}}const En=new P,si=new P,Bl=new P,ri=new P,ps=new P,ms=new P,_d=new P,Fl=new P,zl=new P,kl=new P,Hl=new at,Gl=new at,Vl=new at;class gn{constructor(e=new P,t=new P,n=new P){this.a=e,this.b=t,this.c=n}static getNormal(e,t,n,s){s.subVectors(n,t),En.subVectors(e,t),s.cross(En);const r=s.lengthSq();return r>0?s.multiplyScalar(1/Math.sqrt(r)):s.set(0,0,0)}static getBarycoord(e,t,n,s,r){En.subVectors(s,t),si.subVectors(n,t),Bl.subVectors(e,t);const a=En.dot(En),o=En.dot(si),l=En.dot(Bl),c=si.dot(si),u=si.dot(Bl),d=a*c-o*o;if(d===0)return r.set(0,0,0),null;const h=1/d,f=(c*l-o*u)*h,p=(a*u-o*l)*h;return r.set(1-f-p,p,f)}static containsPoint(e,t,n,s){return this.getBarycoord(e,t,n,s,ri)===null?!1:ri.x>=0&&ri.y>=0&&ri.x+ri.y<=1}static getInterpolation(e,t,n,s,r,a,o,l){return this.getBarycoord(e,t,n,s,ri)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(r,ri.x),l.addScaledVector(a,ri.y),l.addScaledVector(o,ri.z),l)}static getInterpolatedAttribute(e,t,n,s,r,a){return Hl.setScalar(0),Gl.setScalar(0),Vl.setScalar(0),Hl.fromBufferAttribute(e,t),Gl.fromBufferAttribute(e,n),Vl.fromBufferAttribute(e,s),a.setScalar(0),a.addScaledVector(Hl,r.x),a.addScaledVector(Gl,r.y),a.addScaledVector(Vl,r.z),a}static isFrontFacing(e,t,n,s){return En.subVectors(n,t),si.subVectors(e,t),En.cross(si).dot(s)<0}set(e,t,n){return this.a.copy(e),this.b.copy(t),this.c.copy(n),this}setFromPointsAndIndices(e,t,n,s){return this.a.copy(e[t]),this.b.copy(e[n]),this.c.copy(e[s]),this}setFromAttributeAndIndices(e,t,n,s){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,n),this.c.fromBufferAttribute(e,s),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return En.subVectors(this.c,this.b),si.subVectors(this.a,this.b),En.cross(si).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return gn.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,t){return gn.getBarycoord(e,this.a,this.b,this.c,t)}getInterpolation(e,t,n,s,r){return gn.getInterpolation(e,this.a,this.b,this.c,t,n,s,r)}containsPoint(e){return gn.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return gn.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){const n=this.a,s=this.b,r=this.c;let a,o;ps.subVectors(s,n),ms.subVectors(r,n),Fl.subVectors(e,n);const l=ps.dot(Fl),c=ms.dot(Fl);if(l<=0&&c<=0)return t.copy(n);zl.subVectors(e,s);const u=ps.dot(zl),d=ms.dot(zl);if(u>=0&&d<=u)return t.copy(s);const h=l*d-u*c;if(h<=0&&l>=0&&u<=0)return a=l/(l-u),t.copy(n).addScaledVector(ps,a);kl.subVectors(e,r);const f=ps.dot(kl),p=ms.dot(kl);if(p>=0&&f<=p)return t.copy(r);const _=f*c-l*p;if(_<=0&&c>=0&&p<=0)return o=c/(c-p),t.copy(n).addScaledVector(ms,o);const m=u*p-f*d;if(m<=0&&d-u>=0&&f-p>=0)return _d.subVectors(r,s),o=(d-u)/(d-u+(f-p)),t.copy(s).addScaledVector(_d,o);const g=1/(m+_+h);return a=_*g,o=h*g,t.copy(n).addScaledVector(ps,a).addScaledVector(ms,o)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}}class dn{constructor(e=new P(1/0,1/0,1/0),t=new P(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t+=3)this.expandByPoint(Tn.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,n=e.count;t<n;t++)this.expandByPoint(Tn.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){const n=Tn.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(n),this.max.copy(e).add(n),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);const n=e.geometry;if(n!==void 0){const r=n.getAttribute("position");if(t===!0&&r!==void 0&&e.isInstancedMesh!==!0)for(let a=0,o=r.count;a<o;a++)e.isMesh===!0?e.getVertexPosition(a,Tn):Tn.fromBufferAttribute(r,a),Tn.applyMatrix4(e.matrixWorld),this.expandByPoint(Tn);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),Da.copy(e.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),Da.copy(n.boundingBox)),Da.applyMatrix4(e.matrixWorld),this.union(Da)}const s=e.children;for(let r=0,a=s.length;r<a;r++)this.expandByObject(s[r],t);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,Tn),Tn.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,n;return e.normal.x>0?(t=e.normal.x*this.min.x,n=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,n=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,n+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,n+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,n+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,n+=e.normal.z*this.min.z),t<=-e.constant&&n>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(vr),Na.subVectors(this.max,vr),gs.subVectors(e.a,vr),_s.subVectors(e.b,vr),ys.subVectors(e.c,vr),Mi.subVectors(_s,gs),Ai.subVectors(ys,_s),Bi.subVectors(gs,ys);let t=[0,-Mi.z,Mi.y,0,-Ai.z,Ai.y,0,-Bi.z,Bi.y,Mi.z,0,-Mi.x,Ai.z,0,-Ai.x,Bi.z,0,-Bi.x,-Mi.y,Mi.x,0,-Ai.y,Ai.x,0,-Bi.y,Bi.x,0];return!Wl(t,gs,_s,ys,Na)||(t=[1,0,0,0,1,0,0,0,1],!Wl(t,gs,_s,ys,Na))?!1:(Ua.crossVectors(Mi,Ai),t=[Ua.x,Ua.y,Ua.z],Wl(t,gs,_s,ys,Na))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,Tn).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(Tn).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(ai[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),ai[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),ai[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),ai[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),ai[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),ai[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),ai[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),ai[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(ai),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(e){return this.min.fromArray(e.min),this.max.fromArray(e.max),this}}const ai=[new P,new P,new P,new P,new P,new P,new P,new P],Tn=new P,Da=new dn,gs=new P,_s=new P,ys=new P,Mi=new P,Ai=new P,Bi=new P,vr=new P,Na=new P,Ua=new P,Fi=new P;function Wl(i,e,t,n,s){for(let r=0,a=i.length-3;r<=a;r+=3){Fi.fromArray(i,r);const o=s.x*Math.abs(Fi.x)+s.y*Math.abs(Fi.y)+s.z*Math.abs(Fi.z),l=e.dot(Fi),c=t.dot(Fi),u=n.dot(Fi);if(Math.max(-Math.max(l,c,u),Math.min(l,c,u))>o)return!1}return!0}const Et=new P,Oa=new j;let j0=0;class $t{constructor(e,t,n=!1){if(Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:j0++}),this.name="",this.array=e,this.itemSize=t,this.count=e!==void 0?e.length/t:0,this.normalized=n,this.usage=yu,this.updateRanges=[],this.gpuType=yn,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,t,n){e*=this.itemSize,n*=t.itemSize;for(let s=0,r=this.itemSize;s<r;s++)this.array[e+s]=t.array[n+s];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,n=this.count;t<n;t++)Oa.fromBufferAttribute(this,t),Oa.applyMatrix3(e),this.setXY(t,Oa.x,Oa.y);else if(this.itemSize===3)for(let t=0,n=this.count;t<n;t++)Et.fromBufferAttribute(this,t),Et.applyMatrix3(e),this.setXYZ(t,Et.x,Et.y,Et.z);return this}applyMatrix4(e){for(let t=0,n=this.count;t<n;t++)Et.fromBufferAttribute(this,t),Et.applyMatrix4(e),this.setXYZ(t,Et.x,Et.y,Et.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)Et.fromBufferAttribute(this,t),Et.applyNormalMatrix(e),this.setXYZ(t,Et.x,Et.y,Et.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)Et.fromBufferAttribute(this,t),Et.transformDirection(e),this.setXYZ(t,Et.x,Et.y,Et.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let n=this.array[e*this.itemSize+t];return this.normalized&&(n=Rn(n,this.array)),n}setComponent(e,t,n){return this.normalized&&(n=ct(n,this.array)),this.array[e*this.itemSize+t]=n,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=Rn(t,this.array)),t}setX(e,t){return this.normalized&&(t=ct(t,this.array)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=Rn(t,this.array)),t}setY(e,t){return this.normalized&&(t=ct(t,this.array)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=Rn(t,this.array)),t}setZ(e,t){return this.normalized&&(t=ct(t,this.array)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=Rn(t,this.array)),t}setW(e,t){return this.normalized&&(t=ct(t,this.array)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,n){return e*=this.itemSize,this.normalized&&(t=ct(t,this.array),n=ct(n,this.array)),this.array[e+0]=t,this.array[e+1]=n,this}setXYZ(e,t,n,s){return e*=this.itemSize,this.normalized&&(t=ct(t,this.array),n=ct(n,this.array),s=ct(s,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=s,this}setXYZW(e,t,n,s,r){return e*=this.itemSize,this.normalized&&(t=ct(t,this.array),n=ct(n,this.array),s=ct(s,this.array),r=ct(r,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=s,this.array[e+3]=r,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(e.name=this.name),this.usage!==yu&&(e.usage=this.usage),e}}class kp extends $t{constructor(e,t,n){super(new Uint16Array(e),t,n)}}class Hp extends $t{constructor(e,t,n){super(new Uint32Array(e),t,n)}}class ke extends $t{constructor(e,t,n){super(new Float32Array(e),t,n)}}const Z0=new dn,Sr=new P,Kl=new P;class Mn{constructor(e=new P,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){const n=this.center;t!==void 0?n.copy(t):Z0.setFromPoints(e).getCenter(n);let s=0;for(let r=0,a=e.length;r<a;r++)s=Math.max(s,n.distanceToSquared(e[r]));return this.radius=Math.sqrt(s),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){const t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){const n=this.center.distanceToSquared(e);return t.copy(e),n>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;Sr.subVectors(e,this.center);const t=Sr.lengthSq();if(t>this.radius*this.radius){const n=Math.sqrt(t),s=(n-this.radius)*.5;this.center.addScaledVector(Sr,s/n),this.radius+=s}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(Kl.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(Sr.copy(e.center).add(Kl)),this.expandByPoint(Sr.copy(e.center).sub(Kl))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(e){return this.radius=e.radius,this.center.fromArray(e.center),this}}let Q0=0;const fn=new Ke,Xl=new xt,xs=new P,ln=new dn,Mr=new dn,Nt=new P;class nt extends ts{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:Q0++}),this.uuid=vn(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.indirectOffset=0,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(g0(e)?Hp:kp)(e,1):this.index=e,this}setIndirect(e,t=0){return this.indirect=e,this.indirectOffset=t,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,n=0){this.groups.push({start:e,count:t,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){const t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);const n=this.attributes.normal;if(n!==void 0){const r=new Ye().getNormalMatrix(e);n.applyNormalMatrix(r),n.needsUpdate=!0}const s=this.attributes.tangent;return s!==void 0&&(s.transformDirection(e),s.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(e){return fn.makeRotationFromQuaternion(e),this.applyMatrix4(fn),this}rotateX(e){return fn.makeRotationX(e),this.applyMatrix4(fn),this}rotateY(e){return fn.makeRotationY(e),this.applyMatrix4(fn),this}rotateZ(e){return fn.makeRotationZ(e),this.applyMatrix4(fn),this}translate(e,t,n){return fn.makeTranslation(e,t,n),this.applyMatrix4(fn),this}scale(e,t,n){return fn.makeScale(e,t,n),this.applyMatrix4(fn),this}lookAt(e){return Xl.lookAt(e),Xl.updateMatrix(),this.applyMatrix4(Xl.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(xs).negate(),this.translate(xs.x,xs.y,xs.z),this}setFromPoints(e){const t=this.getAttribute("position");if(t===void 0){const n=[];for(let s=0,r=e.length;s<r;s++){const a=e[s];n.push(a.x,a.y,a.z||0)}this.setAttribute("position",new ke(n,3))}else{const n=Math.min(e.length,t.count);for(let s=0;s<n;s++){const r=e[s];t.setXYZ(s,r.x,r.y,r.z||0)}e.length>t.count&&Re("BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),t.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new dn);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){ze("BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new P(-1/0,-1/0,-1/0),new P(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let n=0,s=t.length;n<s;n++){const r=t[n];ln.setFromBufferAttribute(r),this.morphTargetsRelative?(Nt.addVectors(this.boundingBox.min,ln.min),this.boundingBox.expandByPoint(Nt),Nt.addVectors(this.boundingBox.max,ln.max),this.boundingBox.expandByPoint(Nt)):(this.boundingBox.expandByPoint(ln.min),this.boundingBox.expandByPoint(ln.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&ze('BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new Mn);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){ze("BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new P,1/0);return}if(e){const n=this.boundingSphere.center;if(ln.setFromBufferAttribute(e),t)for(let r=0,a=t.length;r<a;r++){const o=t[r];Mr.setFromBufferAttribute(o),this.morphTargetsRelative?(Nt.addVectors(ln.min,Mr.min),ln.expandByPoint(Nt),Nt.addVectors(ln.max,Mr.max),ln.expandByPoint(Nt)):(ln.expandByPoint(Mr.min),ln.expandByPoint(Mr.max))}ln.getCenter(n);let s=0;for(let r=0,a=e.count;r<a;r++)Nt.fromBufferAttribute(e,r),s=Math.max(s,n.distanceToSquared(Nt));if(t)for(let r=0,a=t.length;r<a;r++){const o=t[r],l=this.morphTargetsRelative;for(let c=0,u=o.count;c<u;c++)Nt.fromBufferAttribute(o,c),l&&(xs.fromBufferAttribute(e,c),Nt.add(xs)),s=Math.max(s,n.distanceToSquared(Nt))}this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&ze('BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){ze("BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const n=t.position,s=t.normal,r=t.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new $t(new Float32Array(4*n.count),4));const a=this.getAttribute("tangent"),o=[],l=[];for(let y=0;y<n.count;y++)o[y]=new P,l[y]=new P;const c=new P,u=new P,d=new P,h=new j,f=new j,p=new j,_=new P,m=new P;function g(y,A,U){c.fromBufferAttribute(n,y),u.fromBufferAttribute(n,A),d.fromBufferAttribute(n,U),h.fromBufferAttribute(r,y),f.fromBufferAttribute(r,A),p.fromBufferAttribute(r,U),u.sub(c),d.sub(c),f.sub(h),p.sub(h);const C=1/(f.x*p.y-p.x*f.y);isFinite(C)&&(_.copy(u).multiplyScalar(p.y).addScaledVector(d,-f.y).multiplyScalar(C),m.copy(d).multiplyScalar(f.x).addScaledVector(u,-p.x).multiplyScalar(C),o[y].add(_),o[A].add(_),o[U].add(_),l[y].add(m),l[A].add(m),l[U].add(m))}let S=this.groups;S.length===0&&(S=[{start:0,count:e.count}]);for(let y=0,A=S.length;y<A;++y){const U=S[y],C=U.start,I=U.count;for(let O=C,z=C+I;O<z;O+=3)g(e.getX(O+0),e.getX(O+1),e.getX(O+2))}const v=new P,M=new P,T=new P,E=new P;function R(y){T.fromBufferAttribute(s,y),E.copy(T);const A=o[y];v.copy(A),v.sub(T.multiplyScalar(T.dot(A))).normalize(),M.crossVectors(E,A);const C=M.dot(l[y])<0?-1:1;a.setXYZW(y,v.x,v.y,v.z,C)}for(let y=0,A=S.length;y<A;++y){const U=S[y],C=U.start,I=U.count;for(let O=C,z=C+I;O<z;O+=3)R(e.getX(O+0)),R(e.getX(O+1)),R(e.getX(O+2))}}computeVertexNormals(){const e=this.index,t=this.getAttribute("position");if(t!==void 0){let n=this.getAttribute("normal");if(n===void 0)n=new $t(new Float32Array(t.count*3),3),this.setAttribute("normal",n);else for(let h=0,f=n.count;h<f;h++)n.setXYZ(h,0,0,0);const s=new P,r=new P,a=new P,o=new P,l=new P,c=new P,u=new P,d=new P;if(e)for(let h=0,f=e.count;h<f;h+=3){const p=e.getX(h+0),_=e.getX(h+1),m=e.getX(h+2);s.fromBufferAttribute(t,p),r.fromBufferAttribute(t,_),a.fromBufferAttribute(t,m),u.subVectors(a,r),d.subVectors(s,r),u.cross(d),o.fromBufferAttribute(n,p),l.fromBufferAttribute(n,_),c.fromBufferAttribute(n,m),o.add(u),l.add(u),c.add(u),n.setXYZ(p,o.x,o.y,o.z),n.setXYZ(_,l.x,l.y,l.z),n.setXYZ(m,c.x,c.y,c.z)}else for(let h=0,f=t.count;h<f;h+=3)s.fromBufferAttribute(t,h+0),r.fromBufferAttribute(t,h+1),a.fromBufferAttribute(t,h+2),u.subVectors(a,r),d.subVectors(s,r),u.cross(d),n.setXYZ(h+0,u.x,u.y,u.z),n.setXYZ(h+1,u.x,u.y,u.z),n.setXYZ(h+2,u.x,u.y,u.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){const e=this.attributes.normal;for(let t=0,n=e.count;t<n;t++)Nt.fromBufferAttribute(e,t),Nt.normalize(),e.setXYZ(t,Nt.x,Nt.y,Nt.z)}toNonIndexed(){function e(o,l){const c=o.array,u=o.itemSize,d=o.normalized,h=new c.constructor(l.length*u);let f=0,p=0;for(let _=0,m=l.length;_<m;_++){o.isInterleavedBufferAttribute?f=l[_]*o.data.stride+o.offset:f=l[_]*u;for(let g=0;g<u;g++)h[p++]=c[f++]}return new $t(h,u,d)}if(this.index===null)return Re("BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const t=new nt,n=this.index.array,s=this.attributes;for(const o in s){const l=s[o],c=e(l,n);t.setAttribute(o,c)}const r=this.morphAttributes;for(const o in r){const l=[],c=r[o];for(let u=0,d=c.length;u<d;u++){const h=c[u],f=e(h,n);l.push(f)}t.morphAttributes[o]=l}t.morphTargetsRelative=this.morphTargetsRelative;const a=this.groups;for(let o=0,l=a.length;o<l;o++){const c=a[o];t.addGroup(c.start,c.count,c.materialIndex)}return t}toJSON(){const e={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.type,this.name!==""&&(e.name=this.name),Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0){const l=this.parameters;for(const c in l)l[c]!==void 0&&(e[c]=l[c]);return e}e.data={attributes:{}};const t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});const n=this.attributes;for(const l in n){const c=n[l];e.data.attributes[l]=c.toJSON(e.data)}const s={};let r=!1;for(const l in this.morphAttributes){const c=this.morphAttributes[l],u=[];for(let d=0,h=c.length;d<h;d++){const f=c[d];u.push(f.toJSON(e.data))}u.length>0&&(s[l]=u,r=!0)}r&&(e.data.morphAttributes=s,e.data.morphTargetsRelative=this.morphTargetsRelative);const a=this.groups;a.length>0&&(e.data.groups=JSON.parse(JSON.stringify(a)));const o=this.boundingSphere;return o!==null&&(e.data.boundingSphere=o.toJSON()),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const t={};this.name=e.name;const n=e.index;n!==null&&this.setIndex(n.clone());const s=e.attributes;for(const c in s){const u=s[c];this.setAttribute(c,u.clone(t))}const r=e.morphAttributes;for(const c in r){const u=[],d=r[c];for(let h=0,f=d.length;h<f;h++)u.push(d[h].clone(t));this.morphAttributes[c]=u}this.morphTargetsRelative=e.morphTargetsRelative;const a=e.groups;for(let c=0,u=a.length;c<u;c++){const d=a[c];this.addGroup(d.start,d.count,d.materialIndex)}const o=e.boundingBox;o!==null&&(this.boundingBox=o.clone());const l=e.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}class hh{constructor(e,t){this.isInterleavedBuffer=!0,this.array=e,this.stride=t,this.count=e!==void 0?e.length/t:0,this.usage=yu,this.updateRanges=[],this.version=0,this.uuid=vn()}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.array=new e.array.constructor(e.array),this.count=e.count,this.stride=e.stride,this.usage=e.usage,this}copyAt(e,t,n){e*=this.stride,n*=t.stride;for(let s=0,r=this.stride;s<r;s++)this.array[e+s]=t.array[n+s];return this}set(e,t=0){return this.array.set(e,t),this}clone(e){e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=vn()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=this.array.slice(0).buffer);const t=new this.array.constructor(e.arrayBuffers[this.array.buffer._uuid]),n=new this.constructor(t,this.stride);return n.setUsage(this.usage),n}onUpload(e){return this.onUploadCallback=e,this}toJSON(e){return e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=vn()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=Array.from(new Uint32Array(this.array.buffer))),{uuid:this.uuid,buffer:this.array.buffer._uuid,type:this.array.constructor.name,stride:this.stride}}}const Jt=new P;class Dn{constructor(e,t,n,s=!1){this.isInterleavedBufferAttribute=!0,this.name="",this.data=e,this.itemSize=t,this.offset=n,this.normalized=s}get count(){return this.data.count}get array(){return this.data.array}set needsUpdate(e){this.data.needsUpdate=e}applyMatrix4(e){for(let t=0,n=this.data.count;t<n;t++)Jt.fromBufferAttribute(this,t),Jt.applyMatrix4(e),this.setXYZ(t,Jt.x,Jt.y,Jt.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)Jt.fromBufferAttribute(this,t),Jt.applyNormalMatrix(e),this.setXYZ(t,Jt.x,Jt.y,Jt.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)Jt.fromBufferAttribute(this,t),Jt.transformDirection(e),this.setXYZ(t,Jt.x,Jt.y,Jt.z);return this}getComponent(e,t){let n=this.array[e*this.data.stride+this.offset+t];return this.normalized&&(n=Rn(n,this.array)),n}setComponent(e,t,n){return this.normalized&&(n=ct(n,this.array)),this.data.array[e*this.data.stride+this.offset+t]=n,this}setX(e,t){return this.normalized&&(t=ct(t,this.array)),this.data.array[e*this.data.stride+this.offset]=t,this}setY(e,t){return this.normalized&&(t=ct(t,this.array)),this.data.array[e*this.data.stride+this.offset+1]=t,this}setZ(e,t){return this.normalized&&(t=ct(t,this.array)),this.data.array[e*this.data.stride+this.offset+2]=t,this}setW(e,t){return this.normalized&&(t=ct(t,this.array)),this.data.array[e*this.data.stride+this.offset+3]=t,this}getX(e){let t=this.data.array[e*this.data.stride+this.offset];return this.normalized&&(t=Rn(t,this.array)),t}getY(e){let t=this.data.array[e*this.data.stride+this.offset+1];return this.normalized&&(t=Rn(t,this.array)),t}getZ(e){let t=this.data.array[e*this.data.stride+this.offset+2];return this.normalized&&(t=Rn(t,this.array)),t}getW(e){let t=this.data.array[e*this.data.stride+this.offset+3];return this.normalized&&(t=Rn(t,this.array)),t}setXY(e,t,n){return e=e*this.data.stride+this.offset,this.normalized&&(t=ct(t,this.array),n=ct(n,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this}setXYZ(e,t,n,s){return e=e*this.data.stride+this.offset,this.normalized&&(t=ct(t,this.array),n=ct(n,this.array),s=ct(s,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this.data.array[e+2]=s,this}setXYZW(e,t,n,s,r){return e=e*this.data.stride+this.offset,this.normalized&&(t=ct(t,this.array),n=ct(n,this.array),s=ct(s,this.array),r=ct(r,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this.data.array[e+2]=s,this.data.array[e+3]=r,this}clone(e){if(e===void 0){el("InterleavedBufferAttribute.clone(): Cloning an interleaved buffer attribute will de-interleave buffer data.");const t=[];for(let n=0;n<this.count;n++){const s=n*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)t.push(this.data.array[s+r])}return new $t(new this.array.constructor(t),this.itemSize,this.normalized)}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.clone(e)),new Dn(e.interleavedBuffers[this.data.uuid],this.itemSize,this.offset,this.normalized)}toJSON(e){if(e===void 0){el("InterleavedBufferAttribute.toJSON(): Serializing an interleaved buffer attribute will de-interleave buffer data.");const t=[];for(let n=0;n<this.count;n++){const s=n*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)t.push(this.data.array[s+r])}return{itemSize:this.itemSize,type:this.array.constructor.name,array:t,normalized:this.normalized}}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.toJSON(e)),{isInterleavedBufferAttribute:!0,itemSize:this.itemSize,data:this.data.uuid,offset:this.offset,normalized:this.normalized}}}let e_=0;class Sn extends ts{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:e_++}),this.uuid=vn(),this.name="",this.type="Material",this.blending=Hs,this.side=gi,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=Lc,this.blendDst=Pc,this.blendEquation=Ki,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new ve(0,0,0),this.blendAlpha=0,this.depthFunc=Ys,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=id,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=cs,this.stencilZFail=cs,this.stencilZPass=cs,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(const t in e){const n=e[t];if(n===void 0){Re(`Material: parameter '${t}' has value of undefined.`);continue}const s=this[t];if(s===void 0){Re(`Material: '${t}' is not a property of THREE.${this.type}.`);continue}s&&s.isColor?s.set(n):s&&s.isVector3&&n&&n.isVector3?s.copy(n):this[t]=n}}toJSON(e){const t=e===void 0||typeof e=="string";t&&(e={textures:{},images:{}});const n={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,this.name!==""&&(n.name=this.name),this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(n.sheenColorMap=this.sheenColorMap.toJSON(e).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(n.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(e).uuid),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(e).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(e).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(e).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(e).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(e).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.shadowSide!==null&&(n.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),this.blending!==Hs&&(n.blending=this.blending),this.side!==gi&&(n.side=this.side),this.vertexColors===!0&&(n.vertexColors=!0),this.opacity<1&&(n.opacity=this.opacity),this.transparent===!0&&(n.transparent=!0),this.blendSrc!==Lc&&(n.blendSrc=this.blendSrc),this.blendDst!==Pc&&(n.blendDst=this.blendDst),this.blendEquation!==Ki&&(n.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(n.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(n.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(n.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(n.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(n.blendAlpha=this.blendAlpha),this.depthFunc!==Ys&&(n.depthFunc=this.depthFunc),this.depthTest===!1&&(n.depthTest=this.depthTest),this.depthWrite===!1&&(n.depthWrite=this.depthWrite),this.colorWrite===!1&&(n.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(n.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==id&&(n.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(n.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(n.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==cs&&(n.stencilFail=this.stencilFail),this.stencilZFail!==cs&&(n.stencilZFail=this.stencilZFail),this.stencilZPass!==cs&&(n.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(n.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(n.rotation=this.rotation),this.polygonOffset===!0&&(n.polygonOffset=!0),this.polygonOffsetFactor!==0&&(n.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(n.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(n.linewidth=this.linewidth),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.dithering===!0&&(n.dithering=!0),this.alphaTest>0&&(n.alphaTest=this.alphaTest),this.alphaHash===!0&&(n.alphaHash=!0),this.alphaToCoverage===!0&&(n.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(n.premultipliedAlpha=!0),this.forceSinglePass===!0&&(n.forceSinglePass=!0),this.allowOverride===!1&&(n.allowOverride=!1),this.wireframe===!0&&(n.wireframe=!0),this.wireframeLinewidth>1&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(n.flatShading=!0),this.visible===!1&&(n.visible=!1),this.toneMapped===!1&&(n.toneMapped=!1),this.fog===!1&&(n.fog=!1),Object.keys(this.userData).length>0&&(n.userData=this.userData);function s(r){const a=[];for(const o in r){const l=r[o];delete l.metadata,a.push(l)}return a}if(t){const r=s(e.textures),a=s(e.images);r.length>0&&(n.textures=r),a.length>0&&(n.images=a)}return n}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;const t=e.clippingPlanes;let n=null;if(t!==null){const s=t.length;n=new Array(s);for(let r=0;r!==s;++r)n[r]=t[r].clone()}return this.clippingPlanes=n,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.allowOverride=e.allowOverride,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}}class Xi extends Sn{constructor(e){super(),this.isSpriteMaterial=!0,this.type="SpriteMaterial",this.color=new ve(16777215),this.map=null,this.alphaMap=null,this.rotation=0,this.sizeAttenuation=!0,this.transparent=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.rotation=e.rotation,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}}let vs;const Ar=new P,Ss=new P,Ms=new P,As=new j,br=new j,Gp=new Ke,Ba=new P,Er=new P,Fa=new P,yd=new j,Yl=new j,xd=new j;class Us extends xt{constructor(e=new Xi){if(super(),this.isSprite=!0,this.type="Sprite",vs===void 0){vs=new nt;const t=new Float32Array([-.5,-.5,0,0,0,.5,-.5,0,1,0,.5,.5,0,1,1,-.5,.5,0,0,1]),n=new hh(t,5);vs.setIndex([0,1,2,0,2,3]),vs.setAttribute("position",new Dn(n,3,0,!1)),vs.setAttribute("uv",new Dn(n,2,3,!1))}this.geometry=vs,this.material=e,this.center=new j(.5,.5),this.count=1}raycast(e,t){e.camera===null&&ze('Sprite: "Raycaster.camera" needs to be set in order to raycast against sprites.'),Ss.setFromMatrixScale(this.matrixWorld),Gp.copy(e.camera.matrixWorld),this.modelViewMatrix.multiplyMatrices(e.camera.matrixWorldInverse,this.matrixWorld),Ms.setFromMatrixPosition(this.modelViewMatrix),e.camera.isPerspectiveCamera&&this.material.sizeAttenuation===!1&&Ss.multiplyScalar(-Ms.z);const n=this.material.rotation;let s,r;n!==0&&(r=Math.cos(n),s=Math.sin(n));const a=this.center;za(Ba.set(-.5,-.5,0),Ms,a,Ss,s,r),za(Er.set(.5,-.5,0),Ms,a,Ss,s,r),za(Fa.set(.5,.5,0),Ms,a,Ss,s,r),yd.set(0,0),Yl.set(1,0),xd.set(1,1);let o=e.ray.intersectTriangle(Ba,Er,Fa,!1,Ar);if(o===null&&(za(Er.set(-.5,.5,0),Ms,a,Ss,s,r),Yl.set(0,1),o=e.ray.intersectTriangle(Ba,Fa,Er,!1,Ar),o===null))return;const l=e.ray.origin.distanceTo(Ar);l<e.near||l>e.far||t.push({distance:l,point:Ar.clone(),uv:gn.getInterpolation(Ar,Ba,Er,Fa,yd,Yl,xd,new j),face:null,object:this})}copy(e,t){return super.copy(e,t),e.center!==void 0&&this.center.copy(e.center),this.material=e.material,this}}function za(i,e,t,n,s,r){As.subVectors(i,t).addScalar(.5).multiply(n),s!==void 0?(br.x=r*As.x-s*As.y,br.y=s*As.x+r*As.y):br.copy(As),i.copy(e),i.x+=br.x,i.y+=br.y,i.applyMatrix4(Gp)}const oi=new P,ql=new P,ka=new P,bi=new P,$l=new P,Ha=new P,Jl=new P;class cr{constructor(e=new P,t=new P(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,oi)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);const n=t.dot(this.direction);return n<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){const t=oi.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(oi.copy(this.origin).addScaledVector(this.direction,t),oi.distanceToSquared(e))}distanceSqToSegment(e,t,n,s){ql.copy(e).add(t).multiplyScalar(.5),ka.copy(t).sub(e).normalize(),bi.copy(this.origin).sub(ql);const r=e.distanceTo(t)*.5,a=-this.direction.dot(ka),o=bi.dot(this.direction),l=-bi.dot(ka),c=bi.lengthSq(),u=Math.abs(1-a*a);let d,h,f,p;if(u>0)if(d=a*l-o,h=a*o-l,p=r*u,d>=0)if(h>=-p)if(h<=p){const _=1/u;d*=_,h*=_,f=d*(d+a*h+2*o)+h*(a*d+h+2*l)+c}else h=r,d=Math.max(0,-(a*h+o)),f=-d*d+h*(h+2*l)+c;else h=-r,d=Math.max(0,-(a*h+o)),f=-d*d+h*(h+2*l)+c;else h<=-p?(d=Math.max(0,-(-a*r+o)),h=d>0?-r:Math.min(Math.max(-r,-l),r),f=-d*d+h*(h+2*l)+c):h<=p?(d=0,h=Math.min(Math.max(-r,-l),r),f=h*(h+2*l)+c):(d=Math.max(0,-(a*r+o)),h=d>0?r:Math.min(Math.max(-r,-l),r),f=-d*d+h*(h+2*l)+c);else h=a>0?-r:r,d=Math.max(0,-(a*h+o)),f=-d*d+h*(h+2*l)+c;return n&&n.copy(this.origin).addScaledVector(this.direction,d),s&&s.copy(ql).addScaledVector(ka,h),f}intersectSphere(e,t){oi.subVectors(e.center,this.origin);const n=oi.dot(this.direction),s=oi.dot(oi)-n*n,r=e.radius*e.radius;if(s>r)return null;const a=Math.sqrt(r-s),o=n-a,l=n+a;return l<0?null:o<0?this.at(l,t):this.at(o,t)}intersectsSphere(e){return e.radius<0?!1:this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){const t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;const n=-(this.origin.dot(e.normal)+e.constant)/t;return n>=0?n:null}intersectPlane(e,t){const n=this.distanceToPlane(e);return n===null?null:this.at(n,t)}intersectsPlane(e){const t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let n,s,r,a,o,l;const c=1/this.direction.x,u=1/this.direction.y,d=1/this.direction.z,h=this.origin;return c>=0?(n=(e.min.x-h.x)*c,s=(e.max.x-h.x)*c):(n=(e.max.x-h.x)*c,s=(e.min.x-h.x)*c),u>=0?(r=(e.min.y-h.y)*u,a=(e.max.y-h.y)*u):(r=(e.max.y-h.y)*u,a=(e.min.y-h.y)*u),n>a||r>s||((r>n||isNaN(n))&&(n=r),(a<s||isNaN(s))&&(s=a),d>=0?(o=(e.min.z-h.z)*d,l=(e.max.z-h.z)*d):(o=(e.max.z-h.z)*d,l=(e.min.z-h.z)*d),n>l||o>s)||((o>n||n!==n)&&(n=o),(l<s||s!==s)&&(s=l),s<0)?null:this.at(n>=0?n:s,t)}intersectsBox(e){return this.intersectBox(e,oi)!==null}intersectTriangle(e,t,n,s,r){$l.subVectors(t,e),Ha.subVectors(n,e),Jl.crossVectors($l,Ha);let a=this.direction.dot(Jl),o;if(a>0){if(s)return null;o=1}else if(a<0)o=-1,a=-a;else return null;bi.subVectors(this.origin,e);const l=o*this.direction.dot(Ha.crossVectors(bi,Ha));if(l<0)return null;const c=o*this.direction.dot($l.cross(bi));if(c<0||l+c>a)return null;const u=-o*bi.dot(Jl);return u<0?null:this.at(u/a,r)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class Mt extends Sn{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new ve(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new On,this.combine=Wu,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}}const vd=new Ke,zi=new cr,Ga=new Mn,Sd=new P,Va=new P,Wa=new P,Ka=new P,jl=new P,Xa=new P,Md=new P,Ya=new P;class ot extends xt{constructor(e=new nt,t=new Mt){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){const t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){const s=t[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=s.length;r<a;r++){const o=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}getVertexPosition(e,t){const n=this.geometry,s=n.attributes.position,r=n.morphAttributes.position,a=n.morphTargetsRelative;t.fromBufferAttribute(s,e);const o=this.morphTargetInfluences;if(r&&o){Xa.set(0,0,0);for(let l=0,c=r.length;l<c;l++){const u=o[l],d=r[l];u!==0&&(jl.fromBufferAttribute(d,e),a?Xa.addScaledVector(jl,u):Xa.addScaledVector(jl.sub(t),u))}t.add(Xa)}return t}raycast(e,t){const n=this.geometry,s=this.material,r=this.matrixWorld;s!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),Ga.copy(n.boundingSphere),Ga.applyMatrix4(r),zi.copy(e.ray).recast(e.near),!(Ga.containsPoint(zi.origin)===!1&&(zi.intersectSphere(Ga,Sd)===null||zi.origin.distanceToSquared(Sd)>(e.far-e.near)**2))&&(vd.copy(r).invert(),zi.copy(e.ray).applyMatrix4(vd),!(n.boundingBox!==null&&zi.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(e,t,zi)))}_computeIntersections(e,t,n){let s;const r=this.geometry,a=this.material,o=r.index,l=r.attributes.position,c=r.attributes.uv,u=r.attributes.uv1,d=r.attributes.normal,h=r.groups,f=r.drawRange;if(o!==null)if(Array.isArray(a))for(let p=0,_=h.length;p<_;p++){const m=h[p],g=a[m.materialIndex],S=Math.max(m.start,f.start),v=Math.min(o.count,Math.min(m.start+m.count,f.start+f.count));for(let M=S,T=v;M<T;M+=3){const E=o.getX(M),R=o.getX(M+1),y=o.getX(M+2);s=qa(this,g,e,n,c,u,d,E,R,y),s&&(s.faceIndex=Math.floor(M/3),s.face.materialIndex=m.materialIndex,t.push(s))}}else{const p=Math.max(0,f.start),_=Math.min(o.count,f.start+f.count);for(let m=p,g=_;m<g;m+=3){const S=o.getX(m),v=o.getX(m+1),M=o.getX(m+2);s=qa(this,a,e,n,c,u,d,S,v,M),s&&(s.faceIndex=Math.floor(m/3),t.push(s))}}else if(l!==void 0)if(Array.isArray(a))for(let p=0,_=h.length;p<_;p++){const m=h[p],g=a[m.materialIndex],S=Math.max(m.start,f.start),v=Math.min(l.count,Math.min(m.start+m.count,f.start+f.count));for(let M=S,T=v;M<T;M+=3){const E=M,R=M+1,y=M+2;s=qa(this,g,e,n,c,u,d,E,R,y),s&&(s.faceIndex=Math.floor(M/3),s.face.materialIndex=m.materialIndex,t.push(s))}}else{const p=Math.max(0,f.start),_=Math.min(l.count,f.start+f.count);for(let m=p,g=_;m<g;m+=3){const S=m,v=m+1,M=m+2;s=qa(this,a,e,n,c,u,d,S,v,M),s&&(s.faceIndex=Math.floor(m/3),t.push(s))}}}}function t_(i,e,t,n,s,r,a,o){let l;if(e.side===Qt?l=n.intersectTriangle(a,r,s,!0,o):l=n.intersectTriangle(s,r,a,e.side===gi,o),l===null)return null;Ya.copy(o),Ya.applyMatrix4(i.matrixWorld);const c=t.ray.origin.distanceTo(Ya);return c<t.near||c>t.far?null:{distance:c,point:Ya.clone(),object:i}}function qa(i,e,t,n,s,r,a,o,l,c){i.getVertexPosition(o,Va),i.getVertexPosition(l,Wa),i.getVertexPosition(c,Ka);const u=t_(i,e,t,n,Va,Wa,Ka,Md);if(u){const d=new P;gn.getBarycoord(Md,Va,Wa,Ka,d),s&&(u.uv=gn.getInterpolatedAttribute(s,o,l,c,d,new j)),r&&(u.uv1=gn.getInterpolatedAttribute(r,o,l,c,d,new j)),a&&(u.normal=gn.getInterpolatedAttribute(a,o,l,c,d,new P),u.normal.dot(n.direction)>0&&u.normal.multiplyScalar(-1));const h={a:o,b:l,c,normal:new P,materialIndex:0};gn.getNormal(Va,Wa,Ka,h.normal),u.face=h,u.barycoord=d}return u}const Ad=new P,bd=new at,Ed=new at,n_=new P,Td=new Ke,$a=new P,Zl=new Mn,wd=new Ke,Ql=new cr;class i_ extends ot{constructor(e,t){super(e,t),this.isSkinnedMesh=!0,this.type="SkinnedMesh",this.bindMode=Zh,this.bindMatrix=new Ke,this.bindMatrixInverse=new Ke,this.boundingBox=null,this.boundingSphere=null}computeBoundingBox(){const e=this.geometry;this.boundingBox===null&&(this.boundingBox=new dn),this.boundingBox.makeEmpty();const t=e.getAttribute("position");for(let n=0;n<t.count;n++)this.getVertexPosition(n,$a),this.boundingBox.expandByPoint($a)}computeBoundingSphere(){const e=this.geometry;this.boundingSphere===null&&(this.boundingSphere=new Mn),this.boundingSphere.makeEmpty();const t=e.getAttribute("position");for(let n=0;n<t.count;n++)this.getVertexPosition(n,$a),this.boundingSphere.expandByPoint($a)}copy(e,t){return super.copy(e,t),this.bindMode=e.bindMode,this.bindMatrix.copy(e.bindMatrix),this.bindMatrixInverse.copy(e.bindMatrixInverse),this.skeleton=e.skeleton,e.boundingBox!==null&&(this.boundingBox=e.boundingBox.clone()),e.boundingSphere!==null&&(this.boundingSphere=e.boundingSphere.clone()),this}raycast(e,t){const n=this.material,s=this.matrixWorld;n!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),Zl.copy(this.boundingSphere),Zl.applyMatrix4(s),e.ray.intersectsSphere(Zl)!==!1&&(wd.copy(s).invert(),Ql.copy(e.ray).applyMatrix4(wd),!(this.boundingBox!==null&&Ql.intersectsBox(this.boundingBox)===!1)&&this._computeIntersections(e,t,Ql)))}getVertexPosition(e,t){return super.getVertexPosition(e,t),this.applyBoneTransform(e,t),t}bind(e,t){this.skeleton=e,t===void 0&&(this.updateMatrixWorld(!0),this.skeleton.calculateInverses(),t=this.matrixWorld),this.bindMatrix.copy(t),this.bindMatrixInverse.copy(t).invert()}pose(){this.skeleton.pose()}normalizeSkinWeights(){const e=new at,t=this.geometry.attributes.skinWeight;for(let n=0,s=t.count;n<s;n++){e.fromBufferAttribute(t,n);const r=1/e.manhattanLength();r!==1/0?e.multiplyScalar(r):e.set(1,0,0,0),t.setXYZW(n,e.x,e.y,e.z,e.w)}}updateMatrixWorld(e){super.updateMatrixWorld(e),this.bindMode===Zh?this.bindMatrixInverse.copy(this.matrixWorld).invert():this.bindMode===r0?this.bindMatrixInverse.copy(this.bindMatrix).invert():Re("SkinnedMesh: Unrecognized bindMode: "+this.bindMode)}applyBoneTransform(e,t){const n=this.skeleton,s=this.geometry;bd.fromBufferAttribute(s.attributes.skinIndex,e),Ed.fromBufferAttribute(s.attributes.skinWeight,e),Ad.copy(t).applyMatrix4(this.bindMatrix),t.set(0,0,0);for(let r=0;r<4;r++){const a=Ed.getComponent(r);if(a!==0){const o=bd.getComponent(r);Td.multiplyMatrices(n.bones[o].matrixWorld,n.boneInverses[o]),t.addScaledVector(n_.copy(Ad).applyMatrix4(Td),a)}}return t.applyMatrix4(this.bindMatrixInverse)}}class Vp extends xt{constructor(){super(),this.isBone=!0,this.type="Bone"}}class dh extends Rt{constructor(e=null,t=1,n=1,s,r,a,o,l,c=Ct,u=Ct,d,h){super(null,a,o,l,c,u,s,r,d,h),this.isDataTexture=!0,this.image={data:e,width:t,height:n},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}const Cd=new Ke,s_=new Ke;class fh{constructor(e=[],t=[]){this.uuid=vn(),this.bones=e.slice(0),this.boneInverses=t,this.boneMatrices=null,this.previousBoneMatrices=null,this.boneTexture=null,this.init()}init(){const e=this.bones,t=this.boneInverses;if(this.boneMatrices=new Float32Array(e.length*16),t.length===0)this.calculateInverses();else if(e.length!==t.length){Re("Skeleton: Number of inverse bone matrices does not match amount of bones."),this.boneInverses=[];for(let n=0,s=this.bones.length;n<s;n++)this.boneInverses.push(new Ke)}}calculateInverses(){this.boneInverses.length=0;for(let e=0,t=this.bones.length;e<t;e++){const n=new Ke;this.bones[e]&&n.copy(this.bones[e].matrixWorld).invert(),this.boneInverses.push(n)}}pose(){for(let e=0,t=this.bones.length;e<t;e++){const n=this.bones[e];n&&n.matrixWorld.copy(this.boneInverses[e]).invert()}for(let e=0,t=this.bones.length;e<t;e++){const n=this.bones[e];n&&(n.parent&&n.parent.isBone?(n.matrix.copy(n.parent.matrixWorld).invert(),n.matrix.multiply(n.matrixWorld)):n.matrix.copy(n.matrixWorld),n.matrix.decompose(n.position,n.quaternion,n.scale))}}update(){const e=this.bones,t=this.boneInverses,n=this.boneMatrices,s=this.boneTexture;for(let r=0,a=e.length;r<a;r++){const o=e[r]?e[r].matrixWorld:s_;Cd.multiplyMatrices(o,t[r]),Cd.toArray(n,r*16)}s!==null&&(s.needsUpdate=!0)}clone(){return new fh(this.bones,this.boneInverses)}computeBoneTexture(){let e=Math.sqrt(this.bones.length*4);e=Math.ceil(e/4)*4,e=Math.max(e,4);const t=new Float32Array(e*e*4);t.set(this.boneMatrices);const n=new dh(t,e,e,xn,yn);return n.needsUpdate=!0,this.boneMatrices=t,this.boneTexture=n,this}getBoneByName(e){for(let t=0,n=this.bones.length;t<n;t++){const s=this.bones[t];if(s.name===e)return s}}dispose(){this.boneTexture!==null&&(this.boneTexture.dispose(),this.boneTexture=null)}fromJSON(e,t){this.uuid=e.uuid;for(let n=0,s=e.bones.length;n<s;n++){const r=e.bones[n];let a=t[r];a===void 0&&(Re("Skeleton: No bone found with UUID:",r),a=new Vp),this.bones.push(a),this.boneInverses.push(new Ke().fromArray(e.boneInverses[n]))}return this.init(),this}toJSON(){const e={metadata:{version:4.7,type:"Skeleton",generator:"Skeleton.toJSON"},bones:[],boneInverses:[]};e.uuid=this.uuid;const t=this.bones,n=this.boneInverses;for(let s=0,r=t.length;s<r;s++){const a=t[s];e.bones.push(a.uuid);const o=n[s];e.boneInverses.push(o.toArray())}return e}}class xu extends $t{constructor(e,t,n,s=1){super(e,t,n),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=s}copy(e){return super.copy(e),this.meshPerAttribute=e.meshPerAttribute,this}toJSON(){const e=super.toJSON();return e.meshPerAttribute=this.meshPerAttribute,e.isInstancedBufferAttribute=!0,e}}const bs=new Ke,Rd=new Ke,Ja=[],Ld=new dn,r_=new Ke,Tr=new ot,wr=new Mn;class a_ extends ot{constructor(e,t,n){super(e,t),this.isInstancedMesh=!0,this.instanceMatrix=new xu(new Float32Array(n*16),16),this.previousInstanceMatrix=null,this.instanceColor=null,this.morphTexture=null,this.count=n,this.boundingBox=null,this.boundingSphere=null;for(let s=0;s<n;s++)this.setMatrixAt(s,r_)}computeBoundingBox(){const e=this.geometry,t=this.count;this.boundingBox===null&&(this.boundingBox=new dn),e.boundingBox===null&&e.computeBoundingBox(),this.boundingBox.makeEmpty();for(let n=0;n<t;n++)this.getMatrixAt(n,bs),Ld.copy(e.boundingBox).applyMatrix4(bs),this.boundingBox.union(Ld)}computeBoundingSphere(){const e=this.geometry,t=this.count;this.boundingSphere===null&&(this.boundingSphere=new Mn),e.boundingSphere===null&&e.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let n=0;n<t;n++)this.getMatrixAt(n,bs),wr.copy(e.boundingSphere).applyMatrix4(bs),this.boundingSphere.union(wr)}copy(e,t){return super.copy(e,t),this.instanceMatrix.copy(e.instanceMatrix),e.previousInstanceMatrix!==null&&(this.previousInstanceMatrix=e.previousInstanceMatrix.clone()),e.morphTexture!==null&&(this.morphTexture=e.morphTexture.clone()),e.instanceColor!==null&&(this.instanceColor=e.instanceColor.clone()),this.count=e.count,e.boundingBox!==null&&(this.boundingBox=e.boundingBox.clone()),e.boundingSphere!==null&&(this.boundingSphere=e.boundingSphere.clone()),this}getColorAt(e,t){t.fromArray(this.instanceColor.array,e*3)}getMatrixAt(e,t){t.fromArray(this.instanceMatrix.array,e*16)}getMorphAt(e,t){const n=t.morphTargetInfluences,s=this.morphTexture.source.data.data,r=n.length+1,a=e*r+1;for(let o=0;o<n.length;o++)n[o]=s[a+o]}raycast(e,t){const n=this.matrixWorld,s=this.count;if(Tr.geometry=this.geometry,Tr.material=this.material,Tr.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),wr.copy(this.boundingSphere),wr.applyMatrix4(n),e.ray.intersectsSphere(wr)!==!1))for(let r=0;r<s;r++){this.getMatrixAt(r,bs),Rd.multiplyMatrices(n,bs),Tr.matrixWorld=Rd,Tr.raycast(e,Ja);for(let a=0,o=Ja.length;a<o;a++){const l=Ja[a];l.instanceId=r,l.object=this,t.push(l)}Ja.length=0}}setColorAt(e,t){this.instanceColor===null&&(this.instanceColor=new xu(new Float32Array(this.instanceMatrix.count*3).fill(1),3)),t.toArray(this.instanceColor.array,e*3)}setMatrixAt(e,t){t.toArray(this.instanceMatrix.array,e*16)}setMorphAt(e,t){const n=t.morphTargetInfluences,s=n.length+1;this.morphTexture===null&&(this.morphTexture=new dh(new Float32Array(s*this.count),s,this.count,eh,yn));const r=this.morphTexture.source.data.data;let a=0;for(let c=0;c<n.length;c++)a+=n[c];const o=this.geometry.morphTargetsRelative?1:1-a,l=s*e;r[l]=o,r.set(n,l+1)}updateMorphTargets(){}dispose(){this.dispatchEvent({type:"dispose"}),this.morphTexture!==null&&(this.morphTexture.dispose(),this.morphTexture=null)}}const ec=new P,o_=new P,l_=new Ye;class Ci{constructor(e=new P(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,n,s){return this.normal.set(e,t,n),this.constant=s,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,n){const s=ec.subVectors(n,t).cross(o_.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(s,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){const e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t){const n=e.delta(ec),s=this.normal.dot(n);if(s===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;const r=-(e.start.dot(this.normal)+this.constant)/s;return r<0||r>1?null:t.copy(e.start).addScaledVector(n,r)}intersectsLine(e){const t=this.distanceToPoint(e.start),n=this.distanceToPoint(e.end);return t<0&&n>0||n<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){const n=t||l_.getNormalMatrix(e),s=this.coplanarPoint(ec).applyMatrix4(e),r=this.normal.applyMatrix3(n).normalize();return this.constant=-s.dot(r),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}}const ki=new Mn,c_=new j(.5,.5),ja=new P;class ph{constructor(e=new Ci,t=new Ci,n=new Ci,s=new Ci,r=new Ci,a=new Ci){this.planes=[e,t,n,s,r,a]}set(e,t,n,s,r,a){const o=this.planes;return o[0].copy(e),o[1].copy(t),o[2].copy(n),o[3].copy(s),o[4].copy(r),o[5].copy(a),this}copy(e){const t=this.planes;for(let n=0;n<6;n++)t[n].copy(e.planes[n]);return this}setFromProjectionMatrix(e,t=Yn,n=!1){const s=this.planes,r=e.elements,a=r[0],o=r[1],l=r[2],c=r[3],u=r[4],d=r[5],h=r[6],f=r[7],p=r[8],_=r[9],m=r[10],g=r[11],S=r[12],v=r[13],M=r[14],T=r[15];if(s[0].setComponents(c-a,f-u,g-p,T-S).normalize(),s[1].setComponents(c+a,f+u,g+p,T+S).normalize(),s[2].setComponents(c+o,f+d,g+_,T+v).normalize(),s[3].setComponents(c-o,f-d,g-_,T-v).normalize(),n)s[4].setComponents(l,h,m,M).normalize(),s[5].setComponents(c-l,f-h,g-m,T-M).normalize();else if(s[4].setComponents(c-l,f-h,g-m,T-M).normalize(),t===Yn)s[5].setComponents(c+l,f+h,g+m,T+M).normalize();else if(t===ua)s[5].setComponents(l,h,m,M).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),ki.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{const t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),ki.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(ki)}intersectsSprite(e){ki.center.set(0,0,0);const t=c_.distanceTo(e.center);return ki.radius=.7071067811865476+t,ki.applyMatrix4(e.matrixWorld),this.intersectsSphere(ki)}intersectsSphere(e){const t=this.planes,n=e.center,s=-e.radius;for(let r=0;r<6;r++)if(t[r].distanceToPoint(n)<s)return!1;return!0}intersectsBox(e){const t=this.planes;for(let n=0;n<6;n++){const s=t[n];if(ja.x=s.normal.x>0?e.max.x:e.min.x,ja.y=s.normal.y>0?e.max.y:e.min.y,ja.z=s.normal.z>0?e.max.z:e.min.z,s.distanceToPoint(ja)<0)return!1}return!0}containsPoint(e){const t=this.planes;for(let n=0;n<6;n++)if(t[n].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}class ns extends Sn{constructor(e){super(),this.isLineBasicMaterial=!0,this.type="LineBasicMaterial",this.color=new ve(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.linewidth=e.linewidth,this.linecap=e.linecap,this.linejoin=e.linejoin,this.fog=e.fog,this}}const nl=new P,il=new P,Pd=new Ke,Cr=new cr,Za=new Mn,tc=new P,Id=new P;class ml extends xt{constructor(e=new nt,t=new ns){super(),this.isLine=!0,this.type="Line",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}computeLineDistances(){const e=this.geometry;if(e.index===null){const t=e.attributes.position,n=[0];for(let s=1,r=t.count;s<r;s++)nl.fromBufferAttribute(t,s-1),il.fromBufferAttribute(t,s),n[s]=n[s-1],n[s]+=nl.distanceTo(il);e.setAttribute("lineDistance",new ke(n,1))}else Re("Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}raycast(e,t){const n=this.geometry,s=this.matrixWorld,r=e.params.Line.threshold,a=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),Za.copy(n.boundingSphere),Za.applyMatrix4(s),Za.radius+=r,e.ray.intersectsSphere(Za)===!1)return;Pd.copy(s).invert(),Cr.copy(e.ray).applyMatrix4(Pd);const o=r/((this.scale.x+this.scale.y+this.scale.z)/3),l=o*o,c=this.isLineSegments?2:1,u=n.index,h=n.attributes.position;if(u!==null){const f=Math.max(0,a.start),p=Math.min(u.count,a.start+a.count);for(let _=f,m=p-1;_<m;_+=c){const g=u.getX(_),S=u.getX(_+1),v=Qa(this,e,Cr,l,g,S,_);v&&t.push(v)}if(this.isLineLoop){const _=u.getX(p-1),m=u.getX(f),g=Qa(this,e,Cr,l,_,m,p-1);g&&t.push(g)}}else{const f=Math.max(0,a.start),p=Math.min(h.count,a.start+a.count);for(let _=f,m=p-1;_<m;_+=c){const g=Qa(this,e,Cr,l,_,_+1,_);g&&t.push(g)}if(this.isLineLoop){const _=Qa(this,e,Cr,l,p-1,f,p-1);_&&t.push(_)}}}updateMorphTargets(){const t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){const s=t[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=s.length;r<a;r++){const o=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}}function Qa(i,e,t,n,s,r,a){const o=i.geometry.attributes.position;if(nl.fromBufferAttribute(o,s),il.fromBufferAttribute(o,r),t.distanceSqToSegment(nl,il,tc,Id)>n)return;tc.applyMatrix4(i.matrixWorld);const c=e.ray.origin.distanceTo(tc);if(!(c<e.near||c>e.far))return{distance:c,point:Id.clone().applyMatrix4(i.matrixWorld),index:a,face:null,faceIndex:null,barycoord:null,object:i}}const Dd=new P,Nd=new P;class ji extends ml{constructor(e,t){super(e,t),this.isLineSegments=!0,this.type="LineSegments"}computeLineDistances(){const e=this.geometry;if(e.index===null){const t=e.attributes.position,n=[];for(let s=0,r=t.count;s<r;s+=2)Dd.fromBufferAttribute(t,s),Nd.fromBufferAttribute(t,s+1),n[s]=s===0?0:n[s-1],n[s+1]=n[s]+Dd.distanceTo(Nd);e.setAttribute("lineDistance",new ke(n,1))}else Re("LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}}class u_ extends ml{constructor(e,t){super(e,t),this.isLineLoop=!0,this.type="LineLoop"}}class is extends Sn{constructor(e){super(),this.isPointsMaterial=!0,this.type="PointsMaterial",this.color=new ve(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.size=e.size,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}}const Ud=new Ke,vu=new cr,eo=new Mn,to=new P;class ur extends xt{constructor(e=new nt,t=new is){super(),this.isPoints=!0,this.type="Points",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}raycast(e,t){const n=this.geometry,s=this.matrixWorld,r=e.params.Points.threshold,a=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),eo.copy(n.boundingSphere),eo.applyMatrix4(s),eo.radius+=r,e.ray.intersectsSphere(eo)===!1)return;Ud.copy(s).invert(),vu.copy(e.ray).applyMatrix4(Ud);const o=r/((this.scale.x+this.scale.y+this.scale.z)/3),l=o*o,c=n.index,d=n.attributes.position;if(c!==null){const h=Math.max(0,a.start),f=Math.min(c.count,a.start+a.count);for(let p=h,_=f;p<_;p++){const m=c.getX(p);to.fromBufferAttribute(d,m),Od(to,m,l,s,e,t,this)}}else{const h=Math.max(0,a.start),f=Math.min(d.count,a.start+a.count);for(let p=h,_=f;p<_;p++)to.fromBufferAttribute(d,p),Od(to,p,l,s,e,t,this)}}updateMorphTargets(){const t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){const s=t[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=s.length;r<a;r++){const o=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}}function Od(i,e,t,n,s,r,a){const o=vu.distanceSqToPoint(i);if(o<t){const l=new P;vu.closestPointToPoint(i,l),l.applyMatrix4(n);const c=s.ray.origin.distanceTo(l);if(c<s.near||c>s.far)return;r.push({distance:c,distanceToRay:Math.sqrt(o),point:l,index:e,face:null,faceIndex:null,barycoord:null,object:a})}}class Wp extends Rt{constructor(e=[],t=Ji,n,s,r,a,o,l,c,u){super(e,t,n,s,r,a,o,l,c,u),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}}class Ma extends Rt{constructor(e,t,n,s,r,a,o,l,c){super(e,t,n,s,r,a,o,l,c),this.isCanvasTexture=!0,this.needsUpdate=!0}}class da extends Rt{constructor(e,t,n=Zn,s,r,a,o=Ct,l=Ct,c,u=_i,d=1){if(u!==_i&&u!==qi)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");const h={width:e,height:t,depth:d};super(h,s,r,a,o,l,u,n,c),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.source=new ch(Object.assign({},e.image)),this.compareFunction=e.compareFunction,this}toJSON(e){const t=super.toJSON(e);return this.compareFunction!==null&&(t.compareFunction=this.compareFunction),t}}class h_ extends da{constructor(e,t=Zn,n=Ji,s,r,a=Ct,o=Ct,l,c=_i){const u={width:e,height:e,depth:1},d=[u,u,u,u,u,u];super(e,e,t,n,s,r,a,o,l,c),this.image=d,this.isCubeDepthTexture=!0,this.isCubeTexture=!0}get images(){return this.image}set images(e){this.image=e}}class Kp extends Rt{constructor(e=null){super(),this.sourceTexture=e,this.isExternalTexture=!0}copy(e){return super.copy(e),this.sourceTexture=e.sourceTexture,this}}class Aa extends nt{constructor(e=1,t=1,n=1,s=1,r=1,a=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:t,depth:n,widthSegments:s,heightSegments:r,depthSegments:a};const o=this;s=Math.floor(s),r=Math.floor(r),a=Math.floor(a);const l=[],c=[],u=[],d=[];let h=0,f=0;p("z","y","x",-1,-1,n,t,e,a,r,0),p("z","y","x",1,-1,n,t,-e,a,r,1),p("x","z","y",1,1,e,n,t,s,a,2),p("x","z","y",1,-1,e,n,-t,s,a,3),p("x","y","z",1,-1,e,t,n,s,r,4),p("x","y","z",-1,-1,e,t,-n,s,r,5),this.setIndex(l),this.setAttribute("position",new ke(c,3)),this.setAttribute("normal",new ke(u,3)),this.setAttribute("uv",new ke(d,2));function p(_,m,g,S,v,M,T,E,R,y,A){const U=M/R,C=T/y,I=M/2,O=T/2,z=E/2,B=R+1,H=y+1;let k=0,ie=0;const G=new P;for(let Z=0;Z<H;Z++){const J=Z*C-O;for(let Q=0;Q<B;Q++){const Le=Q*U-I;G[_]=Le*S,G[m]=J*v,G[g]=z,c.push(G.x,G.y,G.z),G[_]=0,G[m]=0,G[g]=E>0?1:-1,u.push(G.x,G.y,G.z),d.push(Q/R),d.push(1-Z/y),k+=1}}for(let Z=0;Z<y;Z++)for(let J=0;J<R;J++){const Q=h+J+B*Z,Le=h+J+B*(Z+1),Qe=h+(J+1)+B*(Z+1),tt=h+(J+1)+B*Z;l.push(Q,Le,tt),l.push(Le,Qe,tt),ie+=6}o.addGroup(f,ie,A),f+=ie,h+=k}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Aa(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}}class mh extends nt{constructor(e=1,t=32,n=0,s=Math.PI*2){super(),this.type="CircleGeometry",this.parameters={radius:e,segments:t,thetaStart:n,thetaLength:s},t=Math.max(3,t);const r=[],a=[],o=[],l=[],c=new P,u=new j;a.push(0,0,0),o.push(0,0,1),l.push(.5,.5);for(let d=0,h=3;d<=t;d++,h+=3){const f=n+d/t*s;c.x=e*Math.cos(f),c.y=e*Math.sin(f),a.push(c.x,c.y,c.z),o.push(0,0,1),u.x=(a[h]/e+1)/2,u.y=(a[h+1]/e+1)/2,l.push(u.x,u.y)}for(let d=1;d<=t;d++)r.push(d,d+1,0);this.setIndex(r),this.setAttribute("position",new ke(a,3)),this.setAttribute("normal",new ke(o,3)),this.setAttribute("uv",new ke(l,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new mh(e.radius,e.segments,e.thetaStart,e.thetaLength)}}class gh extends nt{constructor(e=1,t=1,n=1,s=32,r=1,a=!1,o=0,l=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:e,radiusBottom:t,height:n,radialSegments:s,heightSegments:r,openEnded:a,thetaStart:o,thetaLength:l};const c=this;s=Math.floor(s),r=Math.floor(r);const u=[],d=[],h=[],f=[];let p=0;const _=[],m=n/2;let g=0;S(),a===!1&&(e>0&&v(!0),t>0&&v(!1)),this.setIndex(u),this.setAttribute("position",new ke(d,3)),this.setAttribute("normal",new ke(h,3)),this.setAttribute("uv",new ke(f,2));function S(){const M=new P,T=new P;let E=0;const R=(t-e)/n;for(let y=0;y<=r;y++){const A=[],U=y/r,C=U*(t-e)+e;for(let I=0;I<=s;I++){const O=I/s,z=O*l+o,B=Math.sin(z),H=Math.cos(z);T.x=C*B,T.y=-U*n+m,T.z=C*H,d.push(T.x,T.y,T.z),M.set(B,R,H).normalize(),h.push(M.x,M.y,M.z),f.push(O,1-U),A.push(p++)}_.push(A)}for(let y=0;y<s;y++)for(let A=0;A<r;A++){const U=_[A][y],C=_[A+1][y],I=_[A+1][y+1],O=_[A][y+1];(e>0||A!==0)&&(u.push(U,C,O),E+=3),(t>0||A!==r-1)&&(u.push(C,I,O),E+=3)}c.addGroup(g,E,0),g+=E}function v(M){const T=p,E=new j,R=new P;let y=0;const A=M===!0?e:t,U=M===!0?1:-1;for(let I=1;I<=s;I++)d.push(0,m*U,0),h.push(0,U,0),f.push(.5,.5),p++;const C=p;for(let I=0;I<=s;I++){const z=I/s*l+o,B=Math.cos(z),H=Math.sin(z);R.x=A*H,R.y=m*U,R.z=A*B,d.push(R.x,R.y,R.z),h.push(0,U,0),E.x=B*.5+.5,E.y=H*.5*U+.5,f.push(E.x,E.y),p++}for(let I=0;I<s;I++){const O=T+I,z=C+I;M===!0?u.push(z,z+1,O):u.push(z+1,z,O),y+=3}c.addGroup(g,y,M===!0?1:2),g+=y}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new gh(e.radiusTop,e.radiusBottom,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}}class _h extends gh{constructor(e=1,t=1,n=32,s=1,r=!1,a=0,o=Math.PI*2){super(0,e,t,n,s,r,a,o),this.type="ConeGeometry",this.parameters={radius:e,height:t,radialSegments:n,heightSegments:s,openEnded:r,thetaStart:a,thetaLength:o}}static fromJSON(e){return new _h(e.radius,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}}class Qn{constructor(){this.type="Curve",this.arcLengthDivisions=200,this.needsUpdate=!1,this.cacheArcLengths=null}getPoint(){Re("Curve: .getPoint() not implemented.")}getPointAt(e,t){const n=this.getUtoTmapping(e);return this.getPoint(n,t)}getPoints(e=5){const t=[];for(let n=0;n<=e;n++)t.push(this.getPoint(n/e));return t}getSpacedPoints(e=5){const t=[];for(let n=0;n<=e;n++)t.push(this.getPointAt(n/e));return t}getLength(){const e=this.getLengths();return e[e.length-1]}getLengths(e=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===e+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;const t=[];let n,s=this.getPoint(0),r=0;t.push(0);for(let a=1;a<=e;a++)n=this.getPoint(a/e),r+=n.distanceTo(s),t.push(r),s=n;return this.cacheArcLengths=t,t}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(e,t=null){const n=this.getLengths();let s=0;const r=n.length;let a;t?a=t:a=e*n[r-1];let o=0,l=r-1,c;for(;o<=l;)if(s=Math.floor(o+(l-o)/2),c=n[s]-a,c<0)o=s+1;else if(c>0)l=s-1;else{l=s;break}if(s=l,n[s]===a)return s/(r-1);const u=n[s],h=n[s+1]-u,f=(a-u)/h;return(s+f)/(r-1)}getTangent(e,t){let s=e-1e-4,r=e+1e-4;s<0&&(s=0),r>1&&(r=1);const a=this.getPoint(s),o=this.getPoint(r),l=t||(a.isVector2?new j:new P);return l.copy(o).sub(a).normalize(),l}getTangentAt(e,t){const n=this.getUtoTmapping(e);return this.getTangent(n,t)}computeFrenetFrames(e,t=!1){const n=new P,s=[],r=[],a=[],o=new P,l=new Ke;for(let f=0;f<=e;f++){const p=f/e;s[f]=this.getTangentAt(p,new P)}r[0]=new P,a[0]=new P;let c=Number.MAX_VALUE;const u=Math.abs(s[0].x),d=Math.abs(s[0].y),h=Math.abs(s[0].z);u<=c&&(c=u,n.set(1,0,0)),d<=c&&(c=d,n.set(0,1,0)),h<=c&&n.set(0,0,1),o.crossVectors(s[0],n).normalize(),r[0].crossVectors(s[0],o),a[0].crossVectors(s[0],r[0]);for(let f=1;f<=e;f++){if(r[f]=r[f-1].clone(),a[f]=a[f-1].clone(),o.crossVectors(s[f-1],s[f]),o.length()>Number.EPSILON){o.normalize();const p=Math.acos(Ge(s[f-1].dot(s[f]),-1,1));r[f].applyMatrix4(l.makeRotationAxis(o,p))}a[f].crossVectors(s[f],r[f])}if(t===!0){let f=Math.acos(Ge(r[0].dot(r[e]),-1,1));f/=e,s[0].dot(o.crossVectors(r[0],r[e]))>0&&(f=-f);for(let p=1;p<=e;p++)r[p].applyMatrix4(l.makeRotationAxis(s[p],f*p)),a[p].crossVectors(s[p],r[p])}return{tangents:s,normals:r,binormals:a}}clone(){return new this.constructor().copy(this)}copy(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}toJSON(){const e={metadata:{version:4.7,type:"Curve",generator:"Curve.toJSON"}};return e.arcLengthDivisions=this.arcLengthDivisions,e.type=this.type,e}fromJSON(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}}class yh extends Qn{constructor(e=0,t=0,n=1,s=1,r=0,a=Math.PI*2,o=!1,l=0){super(),this.isEllipseCurve=!0,this.type="EllipseCurve",this.aX=e,this.aY=t,this.xRadius=n,this.yRadius=s,this.aStartAngle=r,this.aEndAngle=a,this.aClockwise=o,this.aRotation=l}getPoint(e,t=new j){const n=t,s=Math.PI*2;let r=this.aEndAngle-this.aStartAngle;const a=Math.abs(r)<Number.EPSILON;for(;r<0;)r+=s;for(;r>s;)r-=s;r<Number.EPSILON&&(a?r=0:r=s),this.aClockwise===!0&&!a&&(r===s?r=-s:r=r-s);const o=this.aStartAngle+e*r;let l=this.aX+this.xRadius*Math.cos(o),c=this.aY+this.yRadius*Math.sin(o);if(this.aRotation!==0){const u=Math.cos(this.aRotation),d=Math.sin(this.aRotation),h=l-this.aX,f=c-this.aY;l=h*u-f*d+this.aX,c=h*d+f*u+this.aY}return n.set(l,c)}copy(e){return super.copy(e),this.aX=e.aX,this.aY=e.aY,this.xRadius=e.xRadius,this.yRadius=e.yRadius,this.aStartAngle=e.aStartAngle,this.aEndAngle=e.aEndAngle,this.aClockwise=e.aClockwise,this.aRotation=e.aRotation,this}toJSON(){const e=super.toJSON();return e.aX=this.aX,e.aY=this.aY,e.xRadius=this.xRadius,e.yRadius=this.yRadius,e.aStartAngle=this.aStartAngle,e.aEndAngle=this.aEndAngle,e.aClockwise=this.aClockwise,e.aRotation=this.aRotation,e}fromJSON(e){return super.fromJSON(e),this.aX=e.aX,this.aY=e.aY,this.xRadius=e.xRadius,this.yRadius=e.yRadius,this.aStartAngle=e.aStartAngle,this.aEndAngle=e.aEndAngle,this.aClockwise=e.aClockwise,this.aRotation=e.aRotation,this}}class d_ extends yh{constructor(e,t,n,s,r,a){super(e,t,n,n,s,r,a),this.isArcCurve=!0,this.type="ArcCurve"}}function xh(){let i=0,e=0,t=0,n=0;function s(r,a,o,l){i=r,e=o,t=-3*r+3*a-2*o-l,n=2*r-2*a+o+l}return{initCatmullRom:function(r,a,o,l,c){s(a,o,c*(o-r),c*(l-a))},initNonuniformCatmullRom:function(r,a,o,l,c,u,d){let h=(a-r)/c-(o-r)/(c+u)+(o-a)/u,f=(o-a)/u-(l-a)/(u+d)+(l-o)/d;h*=u,f*=u,s(a,o,h,f)},calc:function(r){const a=r*r,o=a*r;return i+e*r+t*a+n*o}}}const no=new P,nc=new xh,ic=new xh,sc=new xh;class f_ extends Qn{constructor(e=[],t=!1,n="centripetal",s=.5){super(),this.isCatmullRomCurve3=!0,this.type="CatmullRomCurve3",this.points=e,this.closed=t,this.curveType=n,this.tension=s}getPoint(e,t=new P){const n=t,s=this.points,r=s.length,a=(r-(this.closed?0:1))*e;let o=Math.floor(a),l=a-o;this.closed?o+=o>0?0:(Math.floor(Math.abs(o)/r)+1)*r:l===0&&o===r-1&&(o=r-2,l=1);let c,u;this.closed||o>0?c=s[(o-1)%r]:(no.subVectors(s[0],s[1]).add(s[0]),c=no);const d=s[o%r],h=s[(o+1)%r];if(this.closed||o+2<r?u=s[(o+2)%r]:(no.subVectors(s[r-1],s[r-2]).add(s[r-1]),u=no),this.curveType==="centripetal"||this.curveType==="chordal"){const f=this.curveType==="chordal"?.5:.25;let p=Math.pow(c.distanceToSquared(d),f),_=Math.pow(d.distanceToSquared(h),f),m=Math.pow(h.distanceToSquared(u),f);_<1e-4&&(_=1),p<1e-4&&(p=_),m<1e-4&&(m=_),nc.initNonuniformCatmullRom(c.x,d.x,h.x,u.x,p,_,m),ic.initNonuniformCatmullRom(c.y,d.y,h.y,u.y,p,_,m),sc.initNonuniformCatmullRom(c.z,d.z,h.z,u.z,p,_,m)}else this.curveType==="catmullrom"&&(nc.initCatmullRom(c.x,d.x,h.x,u.x,this.tension),ic.initCatmullRom(c.y,d.y,h.y,u.y,this.tension),sc.initCatmullRom(c.z,d.z,h.z,u.z,this.tension));return n.set(nc.calc(l),ic.calc(l),sc.calc(l)),n}copy(e){super.copy(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){const s=e.points[t];this.points.push(s.clone())}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}toJSON(){const e=super.toJSON();e.points=[];for(let t=0,n=this.points.length;t<n;t++){const s=this.points[t];e.points.push(s.toArray())}return e.closed=this.closed,e.curveType=this.curveType,e.tension=this.tension,e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){const s=e.points[t];this.points.push(new P().fromArray(s))}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}}function Bd(i,e,t,n,s){const r=(n-e)*.5,a=(s-t)*.5,o=i*i,l=i*o;return(2*t-2*n+r+a)*l+(-3*t+3*n-2*r-a)*o+r*i+t}function p_(i,e){const t=1-i;return t*t*e}function m_(i,e){return 2*(1-i)*i*e}function g_(i,e){return i*i*e}function $r(i,e,t,n){return p_(i,e)+m_(i,t)+g_(i,n)}function __(i,e){const t=1-i;return t*t*t*e}function y_(i,e){const t=1-i;return 3*t*t*i*e}function x_(i,e){return 3*(1-i)*i*i*e}function v_(i,e){return i*i*i*e}function Jr(i,e,t,n,s){return __(i,e)+y_(i,t)+x_(i,n)+v_(i,s)}class Xp extends Qn{constructor(e=new j,t=new j,n=new j,s=new j){super(),this.isCubicBezierCurve=!0,this.type="CubicBezierCurve",this.v0=e,this.v1=t,this.v2=n,this.v3=s}getPoint(e,t=new j){const n=t,s=this.v0,r=this.v1,a=this.v2,o=this.v3;return n.set(Jr(e,s.x,r.x,a.x,o.x),Jr(e,s.y,r.y,a.y,o.y)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this.v3.copy(e.v3),this}toJSON(){const e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e.v3=this.v3.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this.v3.fromArray(e.v3),this}}class S_ extends Qn{constructor(e=new P,t=new P,n=new P,s=new P){super(),this.isCubicBezierCurve3=!0,this.type="CubicBezierCurve3",this.v0=e,this.v1=t,this.v2=n,this.v3=s}getPoint(e,t=new P){const n=t,s=this.v0,r=this.v1,a=this.v2,o=this.v3;return n.set(Jr(e,s.x,r.x,a.x,o.x),Jr(e,s.y,r.y,a.y,o.y),Jr(e,s.z,r.z,a.z,o.z)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this.v3.copy(e.v3),this}toJSON(){const e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e.v3=this.v3.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this.v3.fromArray(e.v3),this}}class Yp extends Qn{constructor(e=new j,t=new j){super(),this.isLineCurve=!0,this.type="LineCurve",this.v1=e,this.v2=t}getPoint(e,t=new j){const n=t;return e===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(e).add(this.v1)),n}getPointAt(e,t){return this.getPoint(e,t)}getTangent(e,t=new j){return t.subVectors(this.v2,this.v1).normalize()}getTangentAt(e,t){return this.getTangent(e,t)}copy(e){return super.copy(e),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){const e=super.toJSON();return e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}}class M_ extends Qn{constructor(e=new P,t=new P){super(),this.isLineCurve3=!0,this.type="LineCurve3",this.v1=e,this.v2=t}getPoint(e,t=new P){const n=t;return e===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(e).add(this.v1)),n}getPointAt(e,t){return this.getPoint(e,t)}getTangent(e,t=new P){return t.subVectors(this.v2,this.v1).normalize()}getTangentAt(e,t){return this.getTangent(e,t)}copy(e){return super.copy(e),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){const e=super.toJSON();return e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}}class qp extends Qn{constructor(e=new j,t=new j,n=new j){super(),this.isQuadraticBezierCurve=!0,this.type="QuadraticBezierCurve",this.v0=e,this.v1=t,this.v2=n}getPoint(e,t=new j){const n=t,s=this.v0,r=this.v1,a=this.v2;return n.set($r(e,s.x,r.x,a.x),$r(e,s.y,r.y,a.y)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){const e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}}class A_ extends Qn{constructor(e=new P,t=new P,n=new P){super(),this.isQuadraticBezierCurve3=!0,this.type="QuadraticBezierCurve3",this.v0=e,this.v1=t,this.v2=n}getPoint(e,t=new P){const n=t,s=this.v0,r=this.v1,a=this.v2;return n.set($r(e,s.x,r.x,a.x),$r(e,s.y,r.y,a.y),$r(e,s.z,r.z,a.z)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){const e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}}class $p extends Qn{constructor(e=[]){super(),this.isSplineCurve=!0,this.type="SplineCurve",this.points=e}getPoint(e,t=new j){const n=t,s=this.points,r=(s.length-1)*e,a=Math.floor(r),o=r-a,l=s[a===0?a:a-1],c=s[a],u=s[a>s.length-2?s.length-1:a+1],d=s[a>s.length-3?s.length-1:a+2];return n.set(Bd(o,l.x,c.x,u.x,d.x),Bd(o,l.y,c.y,u.y,d.y)),n}copy(e){super.copy(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){const s=e.points[t];this.points.push(s.clone())}return this}toJSON(){const e=super.toJSON();e.points=[];for(let t=0,n=this.points.length;t<n;t++){const s=this.points[t];e.points.push(s.toArray())}return e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){const s=e.points[t];this.points.push(new j().fromArray(s))}return this}}var Su=Object.freeze({__proto__:null,ArcCurve:d_,CatmullRomCurve3:f_,CubicBezierCurve:Xp,CubicBezierCurve3:S_,EllipseCurve:yh,LineCurve:Yp,LineCurve3:M_,QuadraticBezierCurve:qp,QuadraticBezierCurve3:A_,SplineCurve:$p});class b_ extends Qn{constructor(){super(),this.type="CurvePath",this.curves=[],this.autoClose=!1}add(e){this.curves.push(e)}closePath(){const e=this.curves[0].getPoint(0),t=this.curves[this.curves.length-1].getPoint(1);if(!e.equals(t)){const n=e.isVector2===!0?"LineCurve":"LineCurve3";this.curves.push(new Su[n](t,e))}return this}getPoint(e,t){const n=e*this.getLength(),s=this.getCurveLengths();let r=0;for(;r<s.length;){if(s[r]>=n){const a=s[r]-n,o=this.curves[r],l=o.getLength(),c=l===0?0:1-a/l;return o.getPointAt(c,t)}r++}return null}getLength(){const e=this.getCurveLengths();return e[e.length-1]}updateArcLengths(){this.needsUpdate=!0,this.cacheLengths=null,this.getCurveLengths()}getCurveLengths(){if(this.cacheLengths&&this.cacheLengths.length===this.curves.length)return this.cacheLengths;const e=[];let t=0;for(let n=0,s=this.curves.length;n<s;n++)t+=this.curves[n].getLength(),e.push(t);return this.cacheLengths=e,e}getSpacedPoints(e=40){const t=[];for(let n=0;n<=e;n++)t.push(this.getPoint(n/e));return this.autoClose&&t.push(t[0]),t}getPoints(e=12){const t=[];let n;for(let s=0,r=this.curves;s<r.length;s++){const a=r[s],o=a.isEllipseCurve?e*2:a.isLineCurve||a.isLineCurve3?1:a.isSplineCurve?e*a.points.length:e,l=a.getPoints(o);for(let c=0;c<l.length;c++){const u=l[c];n&&n.equals(u)||(t.push(u),n=u)}}return this.autoClose&&t.length>1&&!t[t.length-1].equals(t[0])&&t.push(t[0]),t}copy(e){super.copy(e),this.curves=[];for(let t=0,n=e.curves.length;t<n;t++){const s=e.curves[t];this.curves.push(s.clone())}return this.autoClose=e.autoClose,this}toJSON(){const e=super.toJSON();e.autoClose=this.autoClose,e.curves=[];for(let t=0,n=this.curves.length;t<n;t++){const s=this.curves[t];e.curves.push(s.toJSON())}return e}fromJSON(e){super.fromJSON(e),this.autoClose=e.autoClose,this.curves=[];for(let t=0,n=e.curves.length;t<n;t++){const s=e.curves[t];this.curves.push(new Su[s.type]().fromJSON(s))}return this}}class Fd extends b_{constructor(e){super(),this.type="Path",this.currentPoint=new j,e&&this.setFromPoints(e)}setFromPoints(e){this.moveTo(e[0].x,e[0].y);for(let t=1,n=e.length;t<n;t++)this.lineTo(e[t].x,e[t].y);return this}moveTo(e,t){return this.currentPoint.set(e,t),this}lineTo(e,t){const n=new Yp(this.currentPoint.clone(),new j(e,t));return this.curves.push(n),this.currentPoint.set(e,t),this}quadraticCurveTo(e,t,n,s){const r=new qp(this.currentPoint.clone(),new j(e,t),new j(n,s));return this.curves.push(r),this.currentPoint.set(n,s),this}bezierCurveTo(e,t,n,s,r,a){const o=new Xp(this.currentPoint.clone(),new j(e,t),new j(n,s),new j(r,a));return this.curves.push(o),this.currentPoint.set(r,a),this}splineThru(e){const t=[this.currentPoint.clone()].concat(e),n=new $p(t);return this.curves.push(n),this.currentPoint.copy(e[e.length-1]),this}arc(e,t,n,s,r,a){const o=this.currentPoint.x,l=this.currentPoint.y;return this.absarc(e+o,t+l,n,s,r,a),this}absarc(e,t,n,s,r,a){return this.absellipse(e,t,n,n,s,r,a),this}ellipse(e,t,n,s,r,a,o,l){const c=this.currentPoint.x,u=this.currentPoint.y;return this.absellipse(e+c,t+u,n,s,r,a,o,l),this}absellipse(e,t,n,s,r,a,o,l){const c=new yh(e,t,n,s,r,a,o,l);if(this.curves.length>0){const d=c.getPoint(0);d.equals(this.currentPoint)||this.lineTo(d.x,d.y)}this.curves.push(c);const u=c.getPoint(1);return this.currentPoint.copy(u),this}copy(e){return super.copy(e),this.currentPoint.copy(e.currentPoint),this}toJSON(){const e=super.toJSON();return e.currentPoint=this.currentPoint.toArray(),e}fromJSON(e){return super.fromJSON(e),this.currentPoint.fromArray(e.currentPoint),this}}class vh extends Fd{constructor(e){super(e),this.uuid=vn(),this.type="Shape",this.holes=[]}getPointsHoles(e){const t=[];for(let n=0,s=this.holes.length;n<s;n++)t[n]=this.holes[n].getPoints(e);return t}extractPoints(e){return{shape:this.getPoints(e),holes:this.getPointsHoles(e)}}copy(e){super.copy(e),this.holes=[];for(let t=0,n=e.holes.length;t<n;t++){const s=e.holes[t];this.holes.push(s.clone())}return this}toJSON(){const e=super.toJSON();e.uuid=this.uuid,e.holes=[];for(let t=0,n=this.holes.length;t<n;t++){const s=this.holes[t];e.holes.push(s.toJSON())}return e}fromJSON(e){super.fromJSON(e),this.uuid=e.uuid,this.holes=[];for(let t=0,n=e.holes.length;t<n;t++){const s=e.holes[t];this.holes.push(new Fd().fromJSON(s))}return this}}function E_(i,e,t=2){const n=e&&e.length,s=n?e[0]*t:i.length;let r=Jp(i,0,s,t,!0);const a=[];if(!r||r.next===r.prev)return a;let o,l,c;if(n&&(r=L_(i,e,r,t)),i.length>80*t){o=i[0],l=i[1];let u=o,d=l;for(let h=t;h<s;h+=t){const f=i[h],p=i[h+1];f<o&&(o=f),p<l&&(l=p),f>u&&(u=f),p>d&&(d=p)}c=Math.max(u-o,d-l),c=c!==0?32767/c:0}return fa(r,a,t,o,l,c,0),a}function Jp(i,e,t,n,s){let r;if(s===H_(i,e,t,n)>0)for(let a=e;a<t;a+=n)r=zd(a/n|0,i[a],i[a+1],r);else for(let a=t-n;a>=e;a-=n)r=zd(a/n|0,i[a],i[a+1],r);return r&&Zs(r,r.next)&&(ma(r),r=r.next),r}function Zi(i,e){if(!i)return i;e||(e=i);let t=i,n;do if(n=!1,!t.steiner&&(Zs(t,t.next)||vt(t.prev,t,t.next)===0)){if(ma(t),t=e=t.prev,t===t.next)break;n=!0}else t=t.next;while(n||t!==e);return e}function fa(i,e,t,n,s,r,a){if(!i)return;!a&&r&&U_(i,n,s,r);let o=i;for(;i.prev!==i.next;){const l=i.prev,c=i.next;if(r?w_(i,n,s,r):T_(i)){e.push(l.i,i.i,c.i),ma(i),i=c.next,o=c.next;continue}if(i=c,i===o){a?a===1?(i=C_(Zi(i),e),fa(i,e,t,n,s,r,2)):a===2&&R_(i,e,t,n,s,r):fa(Zi(i),e,t,n,s,r,1);break}}}function T_(i){const e=i.prev,t=i,n=i.next;if(vt(e,t,n)>=0)return!1;const s=e.x,r=t.x,a=n.x,o=e.y,l=t.y,c=n.y,u=Math.min(s,r,a),d=Math.min(o,l,c),h=Math.max(s,r,a),f=Math.max(o,l,c);let p=n.next;for(;p!==e;){if(p.x>=u&&p.x<=h&&p.y>=d&&p.y<=f&&zr(s,o,r,l,a,c,p.x,p.y)&&vt(p.prev,p,p.next)>=0)return!1;p=p.next}return!0}function w_(i,e,t,n){const s=i.prev,r=i,a=i.next;if(vt(s,r,a)>=0)return!1;const o=s.x,l=r.x,c=a.x,u=s.y,d=r.y,h=a.y,f=Math.min(o,l,c),p=Math.min(u,d,h),_=Math.max(o,l,c),m=Math.max(u,d,h),g=Mu(f,p,e,t,n),S=Mu(_,m,e,t,n);let v=i.prevZ,M=i.nextZ;for(;v&&v.z>=g&&M&&M.z<=S;){if(v.x>=f&&v.x<=_&&v.y>=p&&v.y<=m&&v!==s&&v!==a&&zr(o,u,l,d,c,h,v.x,v.y)&&vt(v.prev,v,v.next)>=0||(v=v.prevZ,M.x>=f&&M.x<=_&&M.y>=p&&M.y<=m&&M!==s&&M!==a&&zr(o,u,l,d,c,h,M.x,M.y)&&vt(M.prev,M,M.next)>=0))return!1;M=M.nextZ}for(;v&&v.z>=g;){if(v.x>=f&&v.x<=_&&v.y>=p&&v.y<=m&&v!==s&&v!==a&&zr(o,u,l,d,c,h,v.x,v.y)&&vt(v.prev,v,v.next)>=0)return!1;v=v.prevZ}for(;M&&M.z<=S;){if(M.x>=f&&M.x<=_&&M.y>=p&&M.y<=m&&M!==s&&M!==a&&zr(o,u,l,d,c,h,M.x,M.y)&&vt(M.prev,M,M.next)>=0)return!1;M=M.nextZ}return!0}function C_(i,e){let t=i;do{const n=t.prev,s=t.next.next;!Zs(n,s)&&Zp(n,t,t.next,s)&&pa(n,s)&&pa(s,n)&&(e.push(n.i,t.i,s.i),ma(t),ma(t.next),t=i=s),t=t.next}while(t!==i);return Zi(t)}function R_(i,e,t,n,s,r){let a=i;do{let o=a.next.next;for(;o!==a.prev;){if(a.i!==o.i&&F_(a,o)){let l=Qp(a,o);a=Zi(a,a.next),l=Zi(l,l.next),fa(a,e,t,n,s,r,0),fa(l,e,t,n,s,r,0);return}o=o.next}a=a.next}while(a!==i)}function L_(i,e,t,n){const s=[];for(let r=0,a=e.length;r<a;r++){const o=e[r]*n,l=r<a-1?e[r+1]*n:i.length,c=Jp(i,o,l,n,!1);c===c.next&&(c.steiner=!0),s.push(B_(c))}s.sort(P_);for(let r=0;r<s.length;r++)t=I_(s[r],t);return t}function P_(i,e){let t=i.x-e.x;if(t===0&&(t=i.y-e.y,t===0)){const n=(i.next.y-i.y)/(i.next.x-i.x),s=(e.next.y-e.y)/(e.next.x-e.x);t=n-s}return t}function I_(i,e){const t=D_(i,e);if(!t)return e;const n=Qp(t,i);return Zi(n,n.next),Zi(t,t.next)}function D_(i,e){let t=e;const n=i.x,s=i.y;let r=-1/0,a;if(Zs(i,t))return t;do{if(Zs(i,t.next))return t.next;if(s<=t.y&&s>=t.next.y&&t.next.y!==t.y){const d=t.x+(s-t.y)*(t.next.x-t.x)/(t.next.y-t.y);if(d<=n&&d>r&&(r=d,a=t.x<t.next.x?t:t.next,d===n))return a}t=t.next}while(t!==e);if(!a)return null;const o=a,l=a.x,c=a.y;let u=1/0;t=a;do{if(n>=t.x&&t.x>=l&&n!==t.x&&jp(s<c?n:r,s,l,c,s<c?r:n,s,t.x,t.y)){const d=Math.abs(s-t.y)/(n-t.x);pa(t,i)&&(d<u||d===u&&(t.x>a.x||t.x===a.x&&N_(a,t)))&&(a=t,u=d)}t=t.next}while(t!==o);return a}function N_(i,e){return vt(i.prev,i,e.prev)<0&&vt(e.next,i,i.next)<0}function U_(i,e,t,n){let s=i;do s.z===0&&(s.z=Mu(s.x,s.y,e,t,n)),s.prevZ=s.prev,s.nextZ=s.next,s=s.next;while(s!==i);s.prevZ.nextZ=null,s.prevZ=null,O_(s)}function O_(i){let e,t=1;do{let n=i,s;i=null;let r=null;for(e=0;n;){e++;let a=n,o=0;for(let c=0;c<t&&(o++,a=a.nextZ,!!a);c++);let l=t;for(;o>0||l>0&&a;)o!==0&&(l===0||!a||n.z<=a.z)?(s=n,n=n.nextZ,o--):(s=a,a=a.nextZ,l--),r?r.nextZ=s:i=s,s.prevZ=r,r=s;n=a}r.nextZ=null,t*=2}while(e>1);return i}function Mu(i,e,t,n,s){return i=(i-t)*s|0,e=(e-n)*s|0,i=(i|i<<8)&16711935,i=(i|i<<4)&252645135,i=(i|i<<2)&858993459,i=(i|i<<1)&1431655765,e=(e|e<<8)&16711935,e=(e|e<<4)&252645135,e=(e|e<<2)&858993459,e=(e|e<<1)&1431655765,i|e<<1}function B_(i){let e=i,t=i;do(e.x<t.x||e.x===t.x&&e.y<t.y)&&(t=e),e=e.next;while(e!==i);return t}function jp(i,e,t,n,s,r,a,o){return(s-a)*(e-o)>=(i-a)*(r-o)&&(i-a)*(n-o)>=(t-a)*(e-o)&&(t-a)*(r-o)>=(s-a)*(n-o)}function zr(i,e,t,n,s,r,a,o){return!(i===a&&e===o)&&jp(i,e,t,n,s,r,a,o)}function F_(i,e){return i.next.i!==e.i&&i.prev.i!==e.i&&!z_(i,e)&&(pa(i,e)&&pa(e,i)&&k_(i,e)&&(vt(i.prev,i,e.prev)||vt(i,e.prev,e))||Zs(i,e)&&vt(i.prev,i,i.next)>0&&vt(e.prev,e,e.next)>0)}function vt(i,e,t){return(e.y-i.y)*(t.x-e.x)-(e.x-i.x)*(t.y-e.y)}function Zs(i,e){return i.x===e.x&&i.y===e.y}function Zp(i,e,t,n){const s=so(vt(i,e,t)),r=so(vt(i,e,n)),a=so(vt(t,n,i)),o=so(vt(t,n,e));return!!(s!==r&&a!==o||s===0&&io(i,t,e)||r===0&&io(i,n,e)||a===0&&io(t,i,n)||o===0&&io(t,e,n))}function io(i,e,t){return e.x<=Math.max(i.x,t.x)&&e.x>=Math.min(i.x,t.x)&&e.y<=Math.max(i.y,t.y)&&e.y>=Math.min(i.y,t.y)}function so(i){return i>0?1:i<0?-1:0}function z_(i,e){let t=i;do{if(t.i!==i.i&&t.next.i!==i.i&&t.i!==e.i&&t.next.i!==e.i&&Zp(t,t.next,i,e))return!0;t=t.next}while(t!==i);return!1}function pa(i,e){return vt(i.prev,i,i.next)<0?vt(i,e,i.next)>=0&&vt(i,i.prev,e)>=0:vt(i,e,i.prev)<0||vt(i,i.next,e)<0}function k_(i,e){let t=i,n=!1;const s=(i.x+e.x)/2,r=(i.y+e.y)/2;do t.y>r!=t.next.y>r&&t.next.y!==t.y&&s<(t.next.x-t.x)*(r-t.y)/(t.next.y-t.y)+t.x&&(n=!n),t=t.next;while(t!==i);return n}function Qp(i,e){const t=Au(i.i,i.x,i.y),n=Au(e.i,e.x,e.y),s=i.next,r=e.prev;return i.next=e,e.prev=i,t.next=s,s.prev=t,n.next=t,t.prev=n,r.next=n,n.prev=r,n}function zd(i,e,t,n){const s=Au(i,e,t);return n?(s.next=n.next,s.prev=n,n.next.prev=s,n.next=s):(s.prev=s,s.next=s),s}function ma(i){i.next.prev=i.prev,i.prev.next=i.next,i.prevZ&&(i.prevZ.nextZ=i.nextZ),i.nextZ&&(i.nextZ.prevZ=i.prevZ)}function Au(i,e,t){return{i,x:e,y:t,prev:null,next:null,z:0,prevZ:null,nextZ:null,steiner:!1}}function H_(i,e,t,n){let s=0;for(let r=e,a=t-n;r<t;r+=n)s+=(i[a]-i[r])*(i[r+1]+i[a+1]),a=r;return s}class G_{static triangulate(e,t,n=2){return E_(e,t,n)}}class di{static area(e){const t=e.length;let n=0;for(let s=t-1,r=0;r<t;s=r++)n+=e[s].x*e[r].y-e[r].x*e[s].y;return n*.5}static isClockWise(e){return di.area(e)<0}static triangulateShape(e,t){const n=[],s=[],r=[];kd(e),Hd(n,e);let a=e.length;t.forEach(kd);for(let l=0;l<t.length;l++)s.push(a),a+=t[l].length,Hd(n,t[l]);const o=G_.triangulate(n,s);for(let l=0;l<o.length;l+=3)r.push(o.slice(l,l+3));return r}}function kd(i){const e=i.length;e>2&&i[e-1].equals(i[0])&&i.pop()}function Hd(i,e){for(let t=0;t<e.length;t++)i.push(e[t].x),i.push(e[t].y)}class Sh extends nt{constructor(e=new vh([new j(.5,.5),new j(-.5,.5),new j(-.5,-.5),new j(.5,-.5)]),t={}){super(),this.type="ExtrudeGeometry",this.parameters={shapes:e,options:t},e=Array.isArray(e)?e:[e];const n=this,s=[],r=[];for(let o=0,l=e.length;o<l;o++){const c=e[o];a(c)}this.setAttribute("position",new ke(s,3)),this.setAttribute("uv",new ke(r,2)),this.computeVertexNormals();function a(o){const l=[],c=t.curveSegments!==void 0?t.curveSegments:12,u=t.steps!==void 0?t.steps:1,d=t.depth!==void 0?t.depth:1;let h=t.bevelEnabled!==void 0?t.bevelEnabled:!0,f=t.bevelThickness!==void 0?t.bevelThickness:.2,p=t.bevelSize!==void 0?t.bevelSize:f-.1,_=t.bevelOffset!==void 0?t.bevelOffset:0,m=t.bevelSegments!==void 0?t.bevelSegments:3;const g=t.extrudePath,S=t.UVGenerator!==void 0?t.UVGenerator:V_;let v,M=!1,T,E,R,y;if(g){v=g.getSpacedPoints(u),M=!0,h=!1;const ee=g.isCatmullRomCurve3?g.closed:!1;T=g.computeFrenetFrames(u,ee),E=new P,R=new P,y=new P}h||(m=0,f=0,p=0,_=0);const A=o.extractPoints(c);let U=A.shape;const C=A.holes;if(!di.isClockWise(U)){U=U.reverse();for(let ee=0,re=C.length;ee<re;ee++){const ne=C[ee];di.isClockWise(ne)&&(C[ee]=ne.reverse())}}function O(ee){const ne=10000000000000001e-36;let me=ee[0];for(let L=1;L<=ee.length;L++){const Oe=L%ee.length,ye=ee[Oe],Be=ye.x-me.x,he=ye.y-me.y,w=Be*Be+he*he,x=Math.max(Math.abs(ye.x),Math.abs(ye.y),Math.abs(me.x),Math.abs(me.y)),N=ne*x*x;if(w<=N){ee.splice(Oe,1),L--;continue}me=ye}}O(U),C.forEach(O);const z=C.length,B=U;for(let ee=0;ee<z;ee++){const re=C[ee];U=U.concat(re)}function H(ee,re,ne){return re||ze("ExtrudeGeometry: vec does not exist"),ee.clone().addScaledVector(re,ne)}const k=U.length;function ie(ee,re,ne){let me,L,Oe;const ye=ee.x-re.x,Be=ee.y-re.y,he=ne.x-ee.x,w=ne.y-ee.y,x=ye*ye+Be*Be,N=ye*w-Be*he;if(Math.abs(N)>Number.EPSILON){const X=Math.sqrt(x),te=Math.sqrt(he*he+w*w),Y=re.x-Be/X,Ae=re.y+ye/X,de=ne.x-w/te,De=ne.y+he/te,Fe=((de-Y)*w-(De-Ae)*he)/(ye*w-Be*he);me=Y+ye*Fe-ee.x,L=Ae+Be*Fe-ee.y;const se=me*me+L*L;if(se<=2)return new j(me,L);Oe=Math.sqrt(se/2)}else{let X=!1;ye>Number.EPSILON?he>Number.EPSILON&&(X=!0):ye<-Number.EPSILON?he<-Number.EPSILON&&(X=!0):Math.sign(Be)===Math.sign(w)&&(X=!0),X?(me=-Be,L=ye,Oe=Math.sqrt(x)):(me=ye,L=Be,Oe=Math.sqrt(x/2))}return new j(me/Oe,L/Oe)}const G=[];for(let ee=0,re=B.length,ne=re-1,me=ee+1;ee<re;ee++,ne++,me++)ne===re&&(ne=0),me===re&&(me=0),G[ee]=ie(B[ee],B[ne],B[me]);const Z=[];let J,Q=G.concat();for(let ee=0,re=z;ee<re;ee++){const ne=C[ee];J=[];for(let me=0,L=ne.length,Oe=L-1,ye=me+1;me<L;me++,Oe++,ye++)Oe===L&&(Oe=0),ye===L&&(ye=0),J[me]=ie(ne[me],ne[Oe],ne[ye]);Z.push(J),Q=Q.concat(J)}let Le;if(m===0)Le=di.triangulateShape(B,C);else{const ee=[],re=[];for(let ne=0;ne<m;ne++){const me=ne/m,L=f*Math.cos(me*Math.PI/2),Oe=p*Math.sin(me*Math.PI/2)+_;for(let ye=0,Be=B.length;ye<Be;ye++){const he=H(B[ye],G[ye],Oe);Ue(he.x,he.y,-L),me===0&&ee.push(he)}for(let ye=0,Be=z;ye<Be;ye++){const he=C[ye];J=Z[ye];const w=[];for(let x=0,N=he.length;x<N;x++){const X=H(he[x],J[x],Oe);Ue(X.x,X.y,-L),me===0&&w.push(X)}me===0&&re.push(w)}}Le=di.triangulateShape(ee,re)}const Qe=Le.length,tt=p+_;for(let ee=0;ee<k;ee++){const re=h?H(U[ee],Q[ee],tt):U[ee];M?(R.copy(T.normals[0]).multiplyScalar(re.x),E.copy(T.binormals[0]).multiplyScalar(re.y),y.copy(v[0]).add(R).add(E),Ue(y.x,y.y,y.z)):Ue(re.x,re.y,0)}for(let ee=1;ee<=u;ee++)for(let re=0;re<k;re++){const ne=h?H(U[re],Q[re],tt):U[re];M?(R.copy(T.normals[ee]).multiplyScalar(ne.x),E.copy(T.binormals[ee]).multiplyScalar(ne.y),y.copy(v[ee]).add(R).add(E),Ue(y.x,y.y,y.z)):Ue(ne.x,ne.y,d/u*ee)}for(let ee=m-1;ee>=0;ee--){const re=ee/m,ne=f*Math.cos(re*Math.PI/2),me=p*Math.sin(re*Math.PI/2)+_;for(let L=0,Oe=B.length;L<Oe;L++){const ye=H(B[L],G[L],me);Ue(ye.x,ye.y,d+ne)}for(let L=0,Oe=C.length;L<Oe;L++){const ye=C[L];J=Z[L];for(let Be=0,he=ye.length;Be<he;Be++){const w=H(ye[Be],J[Be],me);M?Ue(w.x,w.y+v[u-1].y,v[u-1].x+ne):Ue(w.x,w.y,d+ne)}}}$(),oe();function $(){const ee=s.length/3;if(h){let re=0,ne=k*re;for(let me=0;me<Qe;me++){const L=Le[me];Pe(L[2]+ne,L[1]+ne,L[0]+ne)}re=u+m*2,ne=k*re;for(let me=0;me<Qe;me++){const L=Le[me];Pe(L[0]+ne,L[1]+ne,L[2]+ne)}}else{for(let re=0;re<Qe;re++){const ne=Le[re];Pe(ne[2],ne[1],ne[0])}for(let re=0;re<Qe;re++){const ne=Le[re];Pe(ne[0]+k*u,ne[1]+k*u,ne[2]+k*u)}}n.addGroup(ee,s.length/3-ee,0)}function oe(){const ee=s.length/3;let re=0;le(B,re),re+=B.length;for(let ne=0,me=C.length;ne<me;ne++){const L=C[ne];le(L,re),re+=L.length}n.addGroup(ee,s.length/3-ee,1)}function le(ee,re){let ne=ee.length;for(;--ne>=0;){const me=ne;let L=ne-1;L<0&&(L=ee.length-1);for(let Oe=0,ye=u+m*2;Oe<ye;Oe++){const Be=k*Oe,he=k*(Oe+1),w=re+me+Be,x=re+L+Be,N=re+L+he,X=re+me+he;He(w,x,N,X)}}}function Ue(ee,re,ne){l.push(ee),l.push(re),l.push(ne)}function Pe(ee,re,ne){it(ee),it(re),it(ne);const me=s.length/3,L=S.generateTopUV(n,s,me-3,me-2,me-1);Ve(L[0]),Ve(L[1]),Ve(L[2])}function He(ee,re,ne,me){it(ee),it(re),it(me),it(re),it(ne),it(me);const L=s.length/3,Oe=S.generateSideWallUV(n,s,L-6,L-3,L-2,L-1);Ve(Oe[0]),Ve(Oe[1]),Ve(Oe[3]),Ve(Oe[1]),Ve(Oe[2]),Ve(Oe[3])}function it(ee){s.push(l[ee*3+0]),s.push(l[ee*3+1]),s.push(l[ee*3+2])}function Ve(ee){r.push(ee.x),r.push(ee.y)}}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}toJSON(){const e=super.toJSON(),t=this.parameters.shapes,n=this.parameters.options;return W_(t,n,e)}static fromJSON(e,t){const n=[];for(let r=0,a=e.shapes.length;r<a;r++){const o=t[e.shapes[r]];n.push(o)}const s=e.options.extrudePath;return s!==void 0&&(e.options.extrudePath=new Su[s.type]().fromJSON(s)),new Sh(n,e.options)}}const V_={generateTopUV:function(i,e,t,n,s){const r=e[t*3],a=e[t*3+1],o=e[n*3],l=e[n*3+1],c=e[s*3],u=e[s*3+1];return[new j(r,a),new j(o,l),new j(c,u)]},generateSideWallUV:function(i,e,t,n,s,r){const a=e[t*3],o=e[t*3+1],l=e[t*3+2],c=e[n*3],u=e[n*3+1],d=e[n*3+2],h=e[s*3],f=e[s*3+1],p=e[s*3+2],_=e[r*3],m=e[r*3+1],g=e[r*3+2];return Math.abs(o-u)<Math.abs(a-c)?[new j(a,1-l),new j(c,1-d),new j(h,1-p),new j(_,1-g)]:[new j(o,1-l),new j(u,1-d),new j(f,1-p),new j(m,1-g)]}};function W_(i,e,t){if(t.shapes=[],Array.isArray(i))for(let n=0,s=i.length;n<s;n++){const r=i[n];t.shapes.push(r.uuid)}else t.shapes.push(i.uuid);return t.options=Object.assign({},e),e.extrudePath!==void 0&&(t.options.extrudePath=e.extrudePath.toJSON()),t}class Ni extends nt{constructor(e=1,t=1,n=1,s=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:t,widthSegments:n,heightSegments:s};const r=e/2,a=t/2,o=Math.floor(n),l=Math.floor(s),c=o+1,u=l+1,d=e/o,h=t/l,f=[],p=[],_=[],m=[];for(let g=0;g<u;g++){const S=g*h-a;for(let v=0;v<c;v++){const M=v*d-r;p.push(M,-S,0),_.push(0,0,1),m.push(v/o),m.push(1-g/l)}}for(let g=0;g<l;g++)for(let S=0;S<o;S++){const v=S+c*g,M=S+c*(g+1),T=S+1+c*(g+1),E=S+1+c*g;f.push(v,M,E),f.push(M,T,E)}this.setIndex(f),this.setAttribute("position",new ke(p,3)),this.setAttribute("normal",new ke(_,3)),this.setAttribute("uv",new ke(m,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Ni(e.width,e.height,e.widthSegments,e.heightSegments)}}class Qs extends nt{constructor(e=.5,t=1,n=32,s=1,r=0,a=Math.PI*2){super(),this.type="RingGeometry",this.parameters={innerRadius:e,outerRadius:t,thetaSegments:n,phiSegments:s,thetaStart:r,thetaLength:a},n=Math.max(3,n),s=Math.max(1,s);const o=[],l=[],c=[],u=[];let d=e;const h=(t-e)/s,f=new P,p=new j;for(let _=0;_<=s;_++){for(let m=0;m<=n;m++){const g=r+m/n*a;f.x=d*Math.cos(g),f.y=d*Math.sin(g),l.push(f.x,f.y,f.z),c.push(0,0,1),p.x=(f.x/t+1)/2,p.y=(f.y/t+1)/2,u.push(p.x,p.y)}d+=h}for(let _=0;_<s;_++){const m=_*(n+1);for(let g=0;g<n;g++){const S=g+m,v=S,M=S+n+1,T=S+n+2,E=S+1;o.push(v,M,E),o.push(M,T,E)}}this.setIndex(o),this.setAttribute("position",new ke(l,3)),this.setAttribute("normal",new ke(c,3)),this.setAttribute("uv",new ke(u,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Qs(e.innerRadius,e.outerRadius,e.thetaSegments,e.phiSegments,e.thetaStart,e.thetaLength)}}class Mh extends nt{constructor(e=new vh([new j(0,.5),new j(-.5,-.5),new j(.5,-.5)]),t=12){super(),this.type="ShapeGeometry",this.parameters={shapes:e,curveSegments:t};const n=[],s=[],r=[],a=[];let o=0,l=0;if(Array.isArray(e)===!1)c(e);else for(let u=0;u<e.length;u++)c(e[u]),this.addGroup(o,l,u),o+=l,l=0;this.setIndex(n),this.setAttribute("position",new ke(s,3)),this.setAttribute("normal",new ke(r,3)),this.setAttribute("uv",new ke(a,2));function c(u){const d=s.length/3,h=u.extractPoints(t);let f=h.shape;const p=h.holes;di.isClockWise(f)===!1&&(f=f.reverse());for(let m=0,g=p.length;m<g;m++){const S=p[m];di.isClockWise(S)===!0&&(p[m]=S.reverse())}const _=di.triangulateShape(f,p);for(let m=0,g=p.length;m<g;m++){const S=p[m];f=f.concat(S)}for(let m=0,g=f.length;m<g;m++){const S=f[m];s.push(S.x,S.y,0),r.push(0,0,1),a.push(S.x,S.y)}for(let m=0,g=_.length;m<g;m++){const S=_[m],v=S[0]+d,M=S[1]+d,T=S[2]+d;n.push(v,M,T),l+=3}}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}toJSON(){const e=super.toJSON(),t=this.parameters.shapes;return K_(t,e)}static fromJSON(e,t){const n=[];for(let s=0,r=e.shapes.length;s<r;s++){const a=t[e.shapes[s]];n.push(a)}return new Mh(n,e.curveSegments)}}function K_(i,e){if(e.shapes=[],Array.isArray(i))for(let t=0,n=i.length;t<n;t++){const s=i[t];e.shapes.push(s.uuid)}else e.shapes.push(i.uuid);return e}class ba extends nt{constructor(e=1,t=32,n=16,s=0,r=Math.PI*2,a=0,o=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:e,widthSegments:t,heightSegments:n,phiStart:s,phiLength:r,thetaStart:a,thetaLength:o},t=Math.max(3,Math.floor(t)),n=Math.max(2,Math.floor(n));const l=Math.min(a+o,Math.PI);let c=0;const u=[],d=new P,h=new P,f=[],p=[],_=[],m=[];for(let g=0;g<=n;g++){const S=[],v=g/n;let M=0;g===0&&a===0?M=.5/t:g===n&&l===Math.PI&&(M=-.5/t);for(let T=0;T<=t;T++){const E=T/t;d.x=-e*Math.cos(s+E*r)*Math.sin(a+v*o),d.y=e*Math.cos(a+v*o),d.z=e*Math.sin(s+E*r)*Math.sin(a+v*o),p.push(d.x,d.y,d.z),h.copy(d).normalize(),_.push(h.x,h.y,h.z),m.push(E+M,1-v),S.push(c++)}u.push(S)}for(let g=0;g<n;g++)for(let S=0;S<t;S++){const v=u[g][S+1],M=u[g][S],T=u[g+1][S],E=u[g+1][S+1];(g!==0||a>0)&&f.push(v,M,E),(g!==n-1||l<Math.PI)&&f.push(M,T,E)}this.setIndex(f),this.setAttribute("position",new ke(p,3)),this.setAttribute("normal",new ke(_,3)),this.setAttribute("uv",new ke(m,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new ba(e.radius,e.widthSegments,e.heightSegments,e.phiStart,e.phiLength,e.thetaStart,e.thetaLength)}}class X_ extends nt{constructor(e=null){if(super(),this.type="WireframeGeometry",this.parameters={geometry:e},e!==null){const t=[],n=new Set,s=new P,r=new P;if(e.index!==null){const a=e.attributes.position,o=e.index;let l=e.groups;l.length===0&&(l=[{start:0,count:o.count,materialIndex:0}]);for(let c=0,u=l.length;c<u;++c){const d=l[c],h=d.start,f=d.count;for(let p=h,_=h+f;p<_;p+=3)for(let m=0;m<3;m++){const g=o.getX(p+m),S=o.getX(p+(m+1)%3);s.fromBufferAttribute(a,g),r.fromBufferAttribute(a,S),Gd(s,r,n)===!0&&(t.push(s.x,s.y,s.z),t.push(r.x,r.y,r.z))}}}else{const a=e.attributes.position;for(let o=0,l=a.count/3;o<l;o++)for(let c=0;c<3;c++){const u=3*o+c,d=3*o+(c+1)%3;s.fromBufferAttribute(a,u),r.fromBufferAttribute(a,d),Gd(s,r,n)===!0&&(t.push(s.x,s.y,s.z),t.push(r.x,r.y,r.z))}}this.setAttribute("position",new ke(t,3))}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}}function Gd(i,e,t){const n=`${i.x},${i.y},${i.z}-${e.x},${e.y},${e.z}`,s=`${e.x},${e.y},${e.z}-${i.x},${i.y},${i.z}`;return t.has(n)===!0||t.has(s)===!0?!1:(t.add(n),t.add(s),!0)}function er(i){const e={};for(const t in i){e[t]={};for(const n in i[t]){const s=i[t][n];s&&(s.isColor||s.isMatrix3||s.isMatrix4||s.isVector2||s.isVector3||s.isVector4||s.isTexture||s.isQuaternion)?s.isRenderTargetTexture?(Re("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[t][n]=null):e[t][n]=s.clone():Array.isArray(s)?e[t][n]=s.slice():e[t][n]=s}}return e}function jt(i){const e={};for(let t=0;t<i.length;t++){const n=er(i[t]);for(const s in n)e[s]=n[s]}return e}function Y_(i){const e=[];for(let t=0;t<i.length;t++)e.push(i[t].clone());return e}function em(i){const e=i.getRenderTarget();return e===null?i.outputColorSpace:e.isXRRenderTarget===!0?e.texture.colorSpace:et.workingColorSpace}const Qi={clone:er,merge:jt};var q_=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,$_=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class Vt extends Sn{constructor(e){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=q_,this.fragmentShader=$_,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=er(e.uniforms),this.uniformsGroups=Y_(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this.defaultAttributeValues=Object.assign({},e.defaultAttributeValues),this.index0AttributeName=e.index0AttributeName,this.uniformsNeedUpdate=e.uniformsNeedUpdate,this}toJSON(e){const t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(const s in this.uniforms){const a=this.uniforms[s].value;a&&a.isTexture?t.uniforms[s]={type:"t",value:a.toJSON(e).uuid}:a&&a.isColor?t.uniforms[s]={type:"c",value:a.getHex()}:a&&a.isVector2?t.uniforms[s]={type:"v2",value:a.toArray()}:a&&a.isVector3?t.uniforms[s]={type:"v3",value:a.toArray()}:a&&a.isVector4?t.uniforms[s]={type:"v4",value:a.toArray()}:a&&a.isMatrix3?t.uniforms[s]={type:"m3",value:a.toArray()}:a&&a.isMatrix4?t.uniforms[s]={type:"m4",value:a.toArray()}:t.uniforms[s]={value:a}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;const n={};for(const s in this.extensions)this.extensions[s]===!0&&(n[s]=!0);return Object.keys(n).length>0&&(t.extensions=n),t}}class tm extends Vt{constructor(e){super(e),this.isRawShaderMaterial=!0,this.type="RawShaderMaterial"}}class Ah extends Sn{constructor(e){super(),this.isMeshStandardMaterial=!0,this.type="MeshStandardMaterial",this.defines={STANDARD:""},this.color=new ve(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new ve(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=sh,this.normalScale=new j(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new On,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.defines={STANDARD:""},this.color.copy(e.color),this.roughness=e.roughness,this.metalness=e.metalness,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.roughnessMap=e.roughnessMap,this.metalnessMap=e.metalnessMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.envMapIntensity=e.envMapIntensity,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}}class ei extends Ah{constructor(e){super(),this.isMeshPhysicalMaterial=!0,this.defines={STANDARD:"",PHYSICAL:""},this.type="MeshPhysicalMaterial",this.anisotropyRotation=0,this.anisotropyMap=null,this.clearcoatMap=null,this.clearcoatRoughness=0,this.clearcoatRoughnessMap=null,this.clearcoatNormalScale=new j(1,1),this.clearcoatNormalMap=null,this.ior=1.5,Object.defineProperty(this,"reflectivity",{get:function(){return Ge(2.5*(this.ior-1)/(this.ior+1),0,1)},set:function(t){this.ior=(1+.4*t)/(1-.4*t)}}),this.iridescenceMap=null,this.iridescenceIOR=1.3,this.iridescenceThicknessRange=[100,400],this.iridescenceThicknessMap=null,this.sheenColor=new ve(0),this.sheenColorMap=null,this.sheenRoughness=1,this.sheenRoughnessMap=null,this.transmissionMap=null,this.thickness=0,this.thicknessMap=null,this.attenuationDistance=1/0,this.attenuationColor=new ve(1,1,1),this.specularIntensity=1,this.specularIntensityMap=null,this.specularColor=new ve(1,1,1),this.specularColorMap=null,this._anisotropy=0,this._clearcoat=0,this._dispersion=0,this._iridescence=0,this._sheen=0,this._transmission=0,this.setValues(e)}get anisotropy(){return this._anisotropy}set anisotropy(e){this._anisotropy>0!=e>0&&this.version++,this._anisotropy=e}get clearcoat(){return this._clearcoat}set clearcoat(e){this._clearcoat>0!=e>0&&this.version++,this._clearcoat=e}get iridescence(){return this._iridescence}set iridescence(e){this._iridescence>0!=e>0&&this.version++,this._iridescence=e}get dispersion(){return this._dispersion}set dispersion(e){this._dispersion>0!=e>0&&this.version++,this._dispersion=e}get sheen(){return this._sheen}set sheen(e){this._sheen>0!=e>0&&this.version++,this._sheen=e}get transmission(){return this._transmission}set transmission(e){this._transmission>0!=e>0&&this.version++,this._transmission=e}copy(e){return super.copy(e),this.defines={STANDARD:"",PHYSICAL:""},this.anisotropy=e.anisotropy,this.anisotropyRotation=e.anisotropyRotation,this.anisotropyMap=e.anisotropyMap,this.clearcoat=e.clearcoat,this.clearcoatMap=e.clearcoatMap,this.clearcoatRoughness=e.clearcoatRoughness,this.clearcoatRoughnessMap=e.clearcoatRoughnessMap,this.clearcoatNormalMap=e.clearcoatNormalMap,this.clearcoatNormalScale.copy(e.clearcoatNormalScale),this.dispersion=e.dispersion,this.ior=e.ior,this.iridescence=e.iridescence,this.iridescenceMap=e.iridescenceMap,this.iridescenceIOR=e.iridescenceIOR,this.iridescenceThicknessRange=[...e.iridescenceThicknessRange],this.iridescenceThicknessMap=e.iridescenceThicknessMap,this.sheen=e.sheen,this.sheenColor.copy(e.sheenColor),this.sheenColorMap=e.sheenColorMap,this.sheenRoughness=e.sheenRoughness,this.sheenRoughnessMap=e.sheenRoughnessMap,this.transmission=e.transmission,this.transmissionMap=e.transmissionMap,this.thickness=e.thickness,this.thicknessMap=e.thicknessMap,this.attenuationDistance=e.attenuationDistance,this.attenuationColor.copy(e.attenuationColor),this.specularIntensity=e.specularIntensity,this.specularIntensityMap=e.specularIntensityMap,this.specularColor.copy(e.specularColor),this.specularColorMap=e.specularColorMap,this}}class J_ extends Sn{constructor(e){super(),this.isMeshPhongMaterial=!0,this.type="MeshPhongMaterial",this.color=new ve(16777215),this.specular=new ve(1118481),this.shininess=30,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new ve(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=sh,this.normalScale=new j(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new On,this.combine=Wu,this.reflectivity=1,this.envMapIntensity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.specular.copy(e.specular),this.shininess=e.shininess,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.envMapIntensity=e.envMapIntensity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}}class j_ extends Sn{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=l0,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}}class Z_ extends Sn{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}}class bu extends ns{constructor(e){super(),this.isLineDashedMaterial=!0,this.type="LineDashedMaterial",this.scale=1,this.dashSize=3,this.gapSize=1,this.setValues(e)}copy(e){return super.copy(e),this.scale=e.scale,this.dashSize=e.dashSize,this.gapSize=e.gapSize,this}}function ro(i,e){return!i||i.constructor===e?i:typeof e.BYTES_PER_ELEMENT=="number"?new e(i):Array.prototype.slice.call(i)}function Q_(i){function e(s,r){return i[s]-i[r]}const t=i.length,n=new Array(t);for(let s=0;s!==t;++s)n[s]=s;return n.sort(e),n}function Vd(i,e,t){const n=i.length,s=new i.constructor(n);for(let r=0,a=0;a!==n;++r){const o=t[r]*e;for(let l=0;l!==e;++l)s[a++]=i[o+l]}return s}function nm(i,e,t,n){let s=1,r=i[0];for(;r!==void 0&&r[n]===void 0;)r=i[s++];if(r===void 0)return;let a=r[n];if(a!==void 0)if(Array.isArray(a))do a=r[n],a!==void 0&&(e.push(r.time),t.push(...a)),r=i[s++];while(r!==void 0);else if(a.toArray!==void 0)do a=r[n],a!==void 0&&(e.push(r.time),a.toArray(t,t.length)),r=i[s++];while(r!==void 0);else do a=r[n],a!==void 0&&(e.push(r.time),t.push(a)),r=i[s++];while(r!==void 0)}class hr{constructor(e,t,n,s){this.parameterPositions=e,this._cachedIndex=0,this.resultBuffer=s!==void 0?s:new t.constructor(n),this.sampleValues=t,this.valueSize=n,this.settings=null,this.DefaultSettings_={}}evaluate(e){const t=this.parameterPositions;let n=this._cachedIndex,s=t[n],r=t[n-1];n:{e:{let a;t:{i:if(!(e<s)){for(let o=n+2;;){if(s===void 0){if(e<r)break i;return n=t.length,this._cachedIndex=n,this.copySampleValue_(n-1)}if(n===o)break;if(r=s,s=t[++n],e<s)break e}a=t.length;break t}if(!(e>=r)){const o=t[1];e<o&&(n=2,r=o);for(let l=n-2;;){if(r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(n===l)break;if(s=r,r=t[--n-1],e>=r)break e}a=n,n=0;break t}break n}for(;n<a;){const o=n+a>>>1;e<t[o]?a=o:n=o+1}if(s=t[n],r=t[n-1],r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(s===void 0)return n=t.length,this._cachedIndex=n,this.copySampleValue_(n-1)}this._cachedIndex=n,this.intervalChanged_(n,r,s)}return this.interpolate_(n,r,e,s)}getSettings_(){return this.settings||this.DefaultSettings_}copySampleValue_(e){const t=this.resultBuffer,n=this.sampleValues,s=this.valueSize,r=e*s;for(let a=0;a!==s;++a)t[a]=n[r+a];return t}interpolate_(){throw new Error("call to abstract method")}intervalChanged_(){}}class ey extends hr{constructor(e,t,n,s){super(e,t,n,s),this._weightPrev=-0,this._offsetPrev=-0,this._weightNext=-0,this._offsetNext=-0,this.DefaultSettings_={endingStart:ed,endingEnd:ed}}intervalChanged_(e,t,n){const s=this.parameterPositions;let r=e-2,a=e+1,o=s[r],l=s[a];if(o===void 0)switch(this.getSettings_().endingStart){case td:r=e,o=2*t-n;break;case nd:r=s.length-2,o=t+s[r]-s[r+1];break;default:r=e,o=n}if(l===void 0)switch(this.getSettings_().endingEnd){case td:a=e,l=2*n-t;break;case nd:a=1,l=n+s[1]-s[0];break;default:a=e-1,l=t}const c=(n-t)*.5,u=this.valueSize;this._weightPrev=c/(t-o),this._weightNext=c/(l-n),this._offsetPrev=r*u,this._offsetNext=a*u}interpolate_(e,t,n,s){const r=this.resultBuffer,a=this.sampleValues,o=this.valueSize,l=e*o,c=l-o,u=this._offsetPrev,d=this._offsetNext,h=this._weightPrev,f=this._weightNext,p=(n-t)/(s-t),_=p*p,m=_*p,g=-h*m+2*h*_-h*p,S=(1+h)*m+(-1.5-2*h)*_+(-.5+h)*p+1,v=(-1-f)*m+(1.5+f)*_+.5*p,M=f*m-f*_;for(let T=0;T!==o;++T)r[T]=g*a[u+T]+S*a[c+T]+v*a[l+T]+M*a[d+T];return r}}class ty extends hr{constructor(e,t,n,s){super(e,t,n,s)}interpolate_(e,t,n,s){const r=this.resultBuffer,a=this.sampleValues,o=this.valueSize,l=e*o,c=l-o,u=(n-t)/(s-t),d=1-u;for(let h=0;h!==o;++h)r[h]=a[c+h]*d+a[l+h]*u;return r}}class ny extends hr{constructor(e,t,n,s){super(e,t,n,s)}interpolate_(e){return this.copySampleValue_(e-1)}}class iy extends hr{interpolate_(e,t,n,s){const r=this.resultBuffer,a=this.sampleValues,o=this.valueSize,l=e*o,c=l-o,u=this.settings||this.DefaultSettings_,d=u.inTangents,h=u.outTangents;if(!d||!h){const _=(n-t)/(s-t),m=1-_;for(let g=0;g!==o;++g)r[g]=a[c+g]*m+a[l+g]*_;return r}const f=o*2,p=e-1;for(let _=0;_!==o;++_){const m=a[c+_],g=a[l+_],S=p*f+_*2,v=h[S],M=h[S+1],T=e*f+_*2,E=d[T],R=d[T+1];let y=(n-t)/(s-t),A,U,C,I,O;for(let z=0;z<8;z++){A=y*y,U=A*y,C=1-y,I=C*C,O=I*C;const H=O*t+3*I*y*v+3*C*A*E+U*s-n;if(Math.abs(H)<1e-10)break;const k=3*I*(v-t)+6*C*y*(E-v)+3*A*(s-E);if(Math.abs(k)<1e-10)break;y=y-H/k,y=Math.max(0,Math.min(1,y))}r[_]=O*m+3*I*y*M+3*C*A*R+U*g}return r}}class Bn{constructor(e,t,n,s){if(e===void 0)throw new Error("THREE.KeyframeTrack: track name is undefined");if(t===void 0||t.length===0)throw new Error("THREE.KeyframeTrack: no keyframes in track named "+e);this.name=e,this.times=ro(t,this.TimeBufferType),this.values=ro(n,this.ValueBufferType),this.setInterpolation(s||this.DefaultInterpolation)}static toJSON(e){const t=e.constructor;let n;if(t.toJSON!==this.toJSON)n=t.toJSON(e);else{n={name:e.name,times:ro(e.times,Array),values:ro(e.values,Array)};const s=e.getInterpolation();s!==e.DefaultInterpolation&&(n.interpolation=s)}return n.type=e.ValueTypeName,n}InterpolantFactoryMethodDiscrete(e){return new ny(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodLinear(e){return new ty(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodSmooth(e){return new ey(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodBezier(e){const t=new iy(this.times,this.values,this.getValueSize(),e);return this.settings&&(t.settings=this.settings),t}setInterpolation(e){let t;switch(e){case la:t=this.InterpolantFactoryMethodDiscrete;break;case ca:t=this.InterpolantFactoryMethodLinear;break;case Rl:t=this.InterpolantFactoryMethodSmooth;break;case Qh:t=this.InterpolantFactoryMethodBezier;break}if(t===void 0){const n="unsupported interpolation for "+this.ValueTypeName+" keyframe track named "+this.name;if(this.createInterpolant===void 0)if(e!==this.DefaultInterpolation)this.setInterpolation(this.DefaultInterpolation);else throw new Error(n);return Re("KeyframeTrack:",n),this}return this.createInterpolant=t,this}getInterpolation(){switch(this.createInterpolant){case this.InterpolantFactoryMethodDiscrete:return la;case this.InterpolantFactoryMethodLinear:return ca;case this.InterpolantFactoryMethodSmooth:return Rl;case this.InterpolantFactoryMethodBezier:return Qh}}getValueSize(){return this.values.length/this.times.length}shift(e){if(e!==0){const t=this.times;for(let n=0,s=t.length;n!==s;++n)t[n]+=e}return this}scale(e){if(e!==1){const t=this.times;for(let n=0,s=t.length;n!==s;++n)t[n]*=e}return this}trim(e,t){const n=this.times,s=n.length;let r=0,a=s-1;for(;r!==s&&n[r]<e;)++r;for(;a!==-1&&n[a]>t;)--a;if(++a,r!==0||a!==s){r>=a&&(a=Math.max(a,1),r=a-1);const o=this.getValueSize();this.times=n.slice(r,a),this.values=this.values.slice(r*o,a*o)}return this}validate(){let e=!0;const t=this.getValueSize();t-Math.floor(t)!==0&&(ze("KeyframeTrack: Invalid value size in track.",this),e=!1);const n=this.times,s=this.values,r=n.length;r===0&&(ze("KeyframeTrack: Track is empty.",this),e=!1);let a=null;for(let o=0;o!==r;o++){const l=n[o];if(typeof l=="number"&&isNaN(l)){ze("KeyframeTrack: Time is not a valid number.",this,o,l),e=!1;break}if(a!==null&&a>l){ze("KeyframeTrack: Out of order keys.",this,o,l,a),e=!1;break}a=l}if(s!==void 0&&_0(s))for(let o=0,l=s.length;o!==l;++o){const c=s[o];if(isNaN(c)){ze("KeyframeTrack: Value is not a valid number.",this,o,c),e=!1;break}}return e}optimize(){const e=this.times.slice(),t=this.values.slice(),n=this.getValueSize(),s=this.getInterpolation()===Rl,r=e.length-1;let a=1;for(let o=1;o<r;++o){let l=!1;const c=e[o],u=e[o+1];if(c!==u&&(o!==1||c!==e[0]))if(s)l=!0;else{const d=o*n,h=d-n,f=d+n;for(let p=0;p!==n;++p){const _=t[d+p];if(_!==t[h+p]||_!==t[f+p]){l=!0;break}}}if(l){if(o!==a){e[a]=e[o];const d=o*n,h=a*n;for(let f=0;f!==n;++f)t[h+f]=t[d+f]}++a}}if(r>0){e[a]=e[r];for(let o=r*n,l=a*n,c=0;c!==n;++c)t[l+c]=t[o+c];++a}return a!==e.length?(this.times=e.slice(0,a),this.values=t.slice(0,a*n)):(this.times=e,this.values=t),this}clone(){const e=this.times.slice(),t=this.values.slice(),n=this.constructor,s=new n(this.name,e,t);return s.createInterpolant=this.createInterpolant,s}}Bn.prototype.ValueTypeName="";Bn.prototype.TimeBufferType=Float32Array;Bn.prototype.ValueBufferType=Float32Array;Bn.prototype.DefaultInterpolation=ca;class dr extends Bn{constructor(e,t,n){super(e,t,n)}}dr.prototype.ValueTypeName="bool";dr.prototype.ValueBufferType=Array;dr.prototype.DefaultInterpolation=la;dr.prototype.InterpolantFactoryMethodLinear=void 0;dr.prototype.InterpolantFactoryMethodSmooth=void 0;class im extends Bn{constructor(e,t,n,s){super(e,t,n,s)}}im.prototype.ValueTypeName="color";class tr extends Bn{constructor(e,t,n,s){super(e,t,n,s)}}tr.prototype.ValueTypeName="number";class sy extends hr{constructor(e,t,n,s){super(e,t,n,s)}interpolate_(e,t,n,s){const r=this.resultBuffer,a=this.sampleValues,o=this.valueSize,l=(n-t)/(s-t);let c=e*o;for(let u=c+o;c!==u;c+=4)Un.slerpFlat(r,0,a,c-o,a,c,l);return r}}class nr extends Bn{constructor(e,t,n,s){super(e,t,n,s)}InterpolantFactoryMethodLinear(e){return new sy(this.times,this.values,this.getValueSize(),e)}}nr.prototype.ValueTypeName="quaternion";nr.prototype.InterpolantFactoryMethodSmooth=void 0;class fr extends Bn{constructor(e,t,n){super(e,t,n)}}fr.prototype.ValueTypeName="string";fr.prototype.ValueBufferType=Array;fr.prototype.DefaultInterpolation=la;fr.prototype.InterpolantFactoryMethodLinear=void 0;fr.prototype.InterpolantFactoryMethodSmooth=void 0;class ir extends Bn{constructor(e,t,n,s){super(e,t,n,s)}}ir.prototype.ValueTypeName="vector";class ry{constructor(e="",t=-1,n=[],s=a0){this.name=e,this.tracks=n,this.duration=t,this.blendMode=s,this.uuid=vn(),this.userData={},this.duration<0&&this.resetDuration()}static parse(e){const t=[],n=e.tracks,s=1/(e.fps||1);for(let a=0,o=n.length;a!==o;++a)t.push(oy(n[a]).scale(s));const r=new this(e.name,e.duration,t,e.blendMode);return r.uuid=e.uuid,r.userData=JSON.parse(e.userData||"{}"),r}static toJSON(e){const t=[],n=e.tracks,s={name:e.name,duration:e.duration,tracks:t,uuid:e.uuid,blendMode:e.blendMode,userData:JSON.stringify(e.userData)};for(let r=0,a=n.length;r!==a;++r)t.push(Bn.toJSON(n[r]));return s}static CreateFromMorphTargetSequence(e,t,n,s){const r=t.length,a=[];for(let o=0;o<r;o++){let l=[],c=[];l.push((o+r-1)%r,o,(o+1)%r),c.push(0,1,0);const u=Q_(l);l=Vd(l,1,u),c=Vd(c,1,u),!s&&l[0]===0&&(l.push(r),c.push(c[0])),a.push(new tr(".morphTargetInfluences["+t[o].name+"]",l,c).scale(1/n))}return new this(e,-1,a)}static findByName(e,t){let n=e;if(!Array.isArray(e)){const s=e;n=s.geometry&&s.geometry.animations||s.animations}for(let s=0;s<n.length;s++)if(n[s].name===t)return n[s];return null}static CreateClipsFromMorphTargetSequences(e,t,n){const s={},r=/^([\w-]*?)([\d]+)$/;for(let o=0,l=e.length;o<l;o++){const c=e[o],u=c.name.match(r);if(u&&u.length>1){const d=u[1];let h=s[d];h||(s[d]=h=[]),h.push(c)}}const a=[];for(const o in s)a.push(this.CreateFromMorphTargetSequence(o,s[o],t,n));return a}static parseAnimation(e,t){if(Re("AnimationClip: parseAnimation() is deprecated and will be removed with r185"),!e)return ze("AnimationClip: No animation in JSONLoader data."),null;const n=function(d,h,f,p,_){if(f.length!==0){const m=[],g=[];nm(f,m,g,p),m.length!==0&&_.push(new d(h,m,g))}},s=[],r=e.name||"default",a=e.fps||30,o=e.blendMode;let l=e.length||-1;const c=e.hierarchy||[];for(let d=0;d<c.length;d++){const h=c[d].keys;if(!(!h||h.length===0))if(h[0].morphTargets){const f={};let p;for(p=0;p<h.length;p++)if(h[p].morphTargets)for(let _=0;_<h[p].morphTargets.length;_++)f[h[p].morphTargets[_]]=-1;for(const _ in f){const m=[],g=[];for(let S=0;S!==h[p].morphTargets.length;++S){const v=h[p];m.push(v.time),g.push(v.morphTarget===_?1:0)}s.push(new tr(".morphTargetInfluence["+_+"]",m,g))}l=f.length*a}else{const f=".bones["+t[d].name+"]";n(ir,f+".position",h,"pos",s),n(nr,f+".quaternion",h,"rot",s),n(ir,f+".scale",h,"scl",s)}}return s.length===0?null:new this(r,l,s,o)}resetDuration(){const e=this.tracks;let t=0;for(let n=0,s=e.length;n!==s;++n){const r=this.tracks[n];t=Math.max(t,r.times[r.times.length-1])}return this.duration=t,this}trim(){for(let e=0;e<this.tracks.length;e++)this.tracks[e].trim(0,this.duration);return this}validate(){let e=!0;for(let t=0;t<this.tracks.length;t++)e=e&&this.tracks[t].validate();return e}optimize(){for(let e=0;e<this.tracks.length;e++)this.tracks[e].optimize();return this}clone(){const e=[];for(let n=0;n<this.tracks.length;n++)e.push(this.tracks[n].clone());const t=new this.constructor(this.name,this.duration,e,this.blendMode);return t.userData=JSON.parse(JSON.stringify(this.userData)),t}toJSON(){return this.constructor.toJSON(this)}}function ay(i){switch(i.toLowerCase()){case"scalar":case"double":case"float":case"number":case"integer":return tr;case"vector":case"vector2":case"vector3":case"vector4":return ir;case"color":return im;case"quaternion":return nr;case"bool":case"boolean":return dr;case"string":return fr}throw new Error("THREE.KeyframeTrack: Unsupported typeName: "+i)}function oy(i){if(i.type===void 0)throw new Error("THREE.KeyframeTrack: track type undefined, can not parse");const e=ay(i.type);if(i.times===void 0){const t=[],n=[];nm(i.keys,t,n,"value"),i.times=t,i.values=n}return e.parse!==void 0?e.parse(i):new e(i.name,i.times,i.values,i.interpolation)}const fi={enabled:!1,files:{},add:function(i,e){this.enabled!==!1&&(Wd(i)||(this.files[i]=e))},get:function(i){if(this.enabled!==!1&&!Wd(i))return this.files[i]},remove:function(i){delete this.files[i]},clear:function(){this.files={}}};function Wd(i){try{const e=i.slice(i.indexOf(":")+1);return new URL(e).protocol==="blob:"}catch{return!1}}class ly{constructor(e,t,n){const s=this;let r=!1,a=0,o=0,l;const c=[];this.onStart=void 0,this.onLoad=e,this.onProgress=t,this.onError=n,this._abortController=null,this.itemStart=function(u){o++,r===!1&&s.onStart!==void 0&&s.onStart(u,a,o),r=!0},this.itemEnd=function(u){a++,s.onProgress!==void 0&&s.onProgress(u,a,o),a===o&&(r=!1,s.onLoad!==void 0&&s.onLoad())},this.itemError=function(u){s.onError!==void 0&&s.onError(u)},this.resolveURL=function(u){return l?l(u):u},this.setURLModifier=function(u){return l=u,this},this.addHandler=function(u,d){return c.push(u,d),this},this.removeHandler=function(u){const d=c.indexOf(u);return d!==-1&&c.splice(d,2),this},this.getHandler=function(u){for(let d=0,h=c.length;d<h;d+=2){const f=c[d],p=c[d+1];if(f.global&&(f.lastIndex=0),f.test(u))return p}return null},this.abort=function(){return this.abortController.abort(),this._abortController=null,this}}get abortController(){return this._abortController||(this._abortController=new AbortController),this._abortController}}const cy=new ly;class pr{constructor(e){this.manager=e!==void 0?e:cy,this.crossOrigin="anonymous",this.withCredentials=!1,this.path="",this.resourcePath="",this.requestHeader={},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}load(){}loadAsync(e,t){const n=this;return new Promise(function(s,r){n.load(e,s,t,r)})}parse(){}setCrossOrigin(e){return this.crossOrigin=e,this}setWithCredentials(e){return this.withCredentials=e,this}setPath(e){return this.path=e,this}setResourcePath(e){return this.resourcePath=e,this}setRequestHeader(e){return this.requestHeader=e,this}abort(){return this}}pr.DEFAULT_MATERIAL_NAME="__DEFAULT";const li={};class uy extends Error{constructor(e,t){super(e),this.response=t}}class sm extends pr{constructor(e){super(e),this.mimeType="",this.responseType="",this._abortController=new AbortController}load(e,t,n,s){e===void 0&&(e=""),this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);const r=fi.get(`file:${e}`);if(r!==void 0)return this.manager.itemStart(e),setTimeout(()=>{t&&t(r),this.manager.itemEnd(e)},0),r;if(li[e]!==void 0){li[e].push({onLoad:t,onProgress:n,onError:s});return}li[e]=[],li[e].push({onLoad:t,onProgress:n,onError:s});const a=new Request(e,{headers:new Headers(this.requestHeader),credentials:this.withCredentials?"include":"same-origin",signal:typeof AbortSignal.any=="function"?AbortSignal.any([this._abortController.signal,this.manager.abortController.signal]):this._abortController.signal}),o=this.mimeType,l=this.responseType;fetch(a).then(c=>{if(c.status===200||c.status===0){if(c.status===0&&Re("FileLoader: HTTP Status 0 received."),typeof ReadableStream>"u"||c.body===void 0||c.body.getReader===void 0)return c;const u=li[e],d=c.body.getReader(),h=c.headers.get("X-File-Size")||c.headers.get("Content-Length"),f=h?parseInt(h):0,p=f!==0;let _=0;const m=new ReadableStream({start(g){S();function S(){d.read().then(({done:v,value:M})=>{if(v)g.close();else{_+=M.byteLength;const T=new ProgressEvent("progress",{lengthComputable:p,loaded:_,total:f});for(let E=0,R=u.length;E<R;E++){const y=u[E];y.onProgress&&y.onProgress(T)}g.enqueue(M),S()}},v=>{g.error(v)})}}});return new Response(m)}else throw new uy(`fetch for "${c.url}" responded with ${c.status}: ${c.statusText}`,c)}).then(c=>{switch(l){case"arraybuffer":return c.arrayBuffer();case"blob":return c.blob();case"document":return c.text().then(u=>new DOMParser().parseFromString(u,o));case"json":return c.json();default:if(o==="")return c.text();{const d=/charset="?([^;"\s]*)"?/i.exec(o),h=d&&d[1]?d[1].toLowerCase():void 0,f=new TextDecoder(h);return c.arrayBuffer().then(p=>f.decode(p))}}}).then(c=>{fi.add(`file:${e}`,c);const u=li[e];delete li[e];for(let d=0,h=u.length;d<h;d++){const f=u[d];f.onLoad&&f.onLoad(c)}}).catch(c=>{const u=li[e];if(u===void 0)throw this.manager.itemError(e),c;delete li[e];for(let d=0,h=u.length;d<h;d++){const f=u[d];f.onError&&f.onError(c)}this.manager.itemError(e)}).finally(()=>{this.manager.itemEnd(e)}),this.manager.itemStart(e)}setResponseType(e){return this.responseType=e,this}setMimeType(e){return this.mimeType=e,this}abort(){return this._abortController.abort(),this._abortController=new AbortController,this}}const Es=new WeakMap;class hy extends pr{constructor(e){super(e)}load(e,t,n,s){this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);const r=this,a=fi.get(`image:${e}`);if(a!==void 0){if(a.complete===!0)r.manager.itemStart(e),setTimeout(function(){t&&t(a),r.manager.itemEnd(e)},0);else{let d=Es.get(a);d===void 0&&(d=[],Es.set(a,d)),d.push({onLoad:t,onError:s})}return a}const o=ha("img");function l(){u(),t&&t(this);const d=Es.get(this)||[];for(let h=0;h<d.length;h++){const f=d[h];f.onLoad&&f.onLoad(this)}Es.delete(this),r.manager.itemEnd(e)}function c(d){u(),s&&s(d),fi.remove(`image:${e}`);const h=Es.get(this)||[];for(let f=0;f<h.length;f++){const p=h[f];p.onError&&p.onError(d)}Es.delete(this),r.manager.itemError(e),r.manager.itemEnd(e)}function u(){o.removeEventListener("load",l,!1),o.removeEventListener("error",c,!1)}return o.addEventListener("load",l,!1),o.addEventListener("error",c,!1),e.slice(0,5)!=="data:"&&this.crossOrigin!==void 0&&(o.crossOrigin=this.crossOrigin),fi.add(`image:${e}`,o),r.manager.itemStart(e),o.src=e,o}}class dy extends pr{constructor(e){super(e)}load(e,t,n,s){const r=new Rt,a=new hy(this.manager);return a.setCrossOrigin(this.crossOrigin),a.setPath(this.path),a.load(e,function(o){r.image=o,r.needsUpdate=!0,t!==void 0&&t(r)},n,s),r}}class gl extends xt{constructor(e,t=1){super(),this.isLight=!0,this.type="Light",this.color=new ve(e),this.intensity=t}dispose(){this.dispatchEvent({type:"dispose"})}copy(e,t){return super.copy(e,t),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){const t=super.toJSON(e);return t.object.color=this.color.getHex(),t.object.intensity=this.intensity,t}}const rc=new Ke,Kd=new P,Xd=new P;class bh{constructor(e){this.camera=e,this.intensity=1,this.bias=0,this.biasNode=null,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new j(512,512),this.mapType=cn,this.map=null,this.mapPass=null,this.matrix=new Ke,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new ph,this._frameExtents=new j(1,1),this._viewportCount=1,this._viewports=[new at(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(e){const t=this.camera,n=this.matrix;Kd.setFromMatrixPosition(e.matrixWorld),t.position.copy(Kd),Xd.setFromMatrixPosition(e.target.matrixWorld),t.lookAt(Xd),t.updateMatrixWorld(),rc.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),this._frustum.setFromProjectionMatrix(rc,t.coordinateSystem,t.reversedDepth),t.coordinateSystem===ua||t.reversedDepth?n.set(.5,0,0,.5,0,.5,0,.5,0,0,1,0,0,0,0,1):n.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),n.multiply(rc)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.intensity=e.intensity,this.bias=e.bias,this.radius=e.radius,this.autoUpdate=e.autoUpdate,this.needsUpdate=e.needsUpdate,this.normalBias=e.normalBias,this.blurSamples=e.blurSamples,this.mapSize.copy(e.mapSize),this.biasNode=e.biasNode,this}clone(){return new this.constructor().copy(this)}toJSON(){const e={};return this.intensity!==1&&(e.intensity=this.intensity),this.bias!==0&&(e.bias=this.bias),this.normalBias!==0&&(e.normalBias=this.normalBias),this.radius!==1&&(e.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(e.mapSize=this.mapSize.toArray()),e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}}const ao=new P,oo=new Un,zn=new P;class rm extends xt{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new Ke,this.projectionMatrix=new Ke,this.projectionMatrixInverse=new Ke,this.coordinateSystem=Yn,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorld.decompose(ao,oo,zn),zn.x===1&&zn.y===1&&zn.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(ao,oo,zn.set(1,1,1)).invert()}updateWorldMatrix(e,t){super.updateWorldMatrix(e,t),this.matrixWorld.decompose(ao,oo,zn),zn.x===1&&zn.y===1&&zn.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(ao,oo,zn.set(1,1,1)).invert()}clone(){return new this.constructor().copy(this)}}const Ei=new P,Yd=new j,qd=new j;class Zt extends rm{constructor(e=50,t=1,n=.1,s=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=n,this.far=s,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){const t=.5*this.getFilmHeight()/e;this.fov=js*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){const e=Math.tan(Yr*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return js*2*Math.atan(Math.tan(Yr*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,n){Ei.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set(Ei.x,Ei.y).multiplyScalar(-e/Ei.z),Ei.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(Ei.x,Ei.y).multiplyScalar(-e/Ei.z)}getViewSize(e,t){return this.getViewBounds(e,Yd,qd),t.subVectors(qd,Yd)}setViewOffset(e,t,n,s,r,a){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=this.near;let t=e*Math.tan(Yr*.5*this.fov)/this.zoom,n=2*t,s=this.aspect*n,r=-.5*s;const a=this.view;if(this.view!==null&&this.view.enabled){const l=a.fullWidth,c=a.fullHeight;r+=a.offsetX*s/l,t-=a.offsetY*n/c,s*=a.width/l,n*=a.height/c}const o=this.filmOffset;o!==0&&(r+=e*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+s,t,t-n,e,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}}class fy extends bh{constructor(){super(new Zt(50,1,.5,500)),this.isSpotLightShadow=!0,this.focus=1,this.aspect=1}updateMatrices(e){const t=this.camera,n=js*2*e.angle*this.focus,s=this.mapSize.width/this.mapSize.height*this.aspect,r=e.distance||t.far;(n!==t.fov||s!==t.aspect||r!==t.far)&&(t.fov=n,t.aspect=s,t.far=r,t.updateProjectionMatrix()),super.updateMatrices(e)}copy(e){return super.copy(e),this.focus=e.focus,this}}class py extends gl{constructor(e,t,n=0,s=Math.PI/3,r=0,a=2){super(e,t),this.isSpotLight=!0,this.type="SpotLight",this.position.copy(xt.DEFAULT_UP),this.updateMatrix(),this.target=new xt,this.distance=n,this.angle=s,this.penumbra=r,this.decay=a,this.map=null,this.shadow=new fy}get power(){return this.intensity*Math.PI}set power(e){this.intensity=e/Math.PI}dispose(){super.dispose(),this.shadow.dispose()}copy(e,t){return super.copy(e,t),this.distance=e.distance,this.angle=e.angle,this.penumbra=e.penumbra,this.decay=e.decay,this.target=e.target.clone(),this.map=e.map,this.shadow=e.shadow.clone(),this}toJSON(e){const t=super.toJSON(e);return t.object.distance=this.distance,t.object.angle=this.angle,t.object.decay=this.decay,t.object.penumbra=this.penumbra,t.object.target=this.target.uuid,this.map&&this.map.isTexture&&(t.object.map=this.map.toJSON(e).uuid),t.object.shadow=this.shadow.toJSON(),t}}class my extends bh{constructor(){super(new Zt(90,1,.5,500)),this.isPointLightShadow=!0}}class gy extends gl{constructor(e,t,n=0,s=2){super(e,t),this.isPointLight=!0,this.type="PointLight",this.distance=n,this.decay=s,this.shadow=new my}get power(){return this.intensity*4*Math.PI}set power(e){this.intensity=e/(4*Math.PI)}dispose(){super.dispose(),this.shadow.dispose()}copy(e,t){return super.copy(e,t),this.distance=e.distance,this.decay=e.decay,this.shadow=e.shadow.clone(),this}toJSON(e){const t=super.toJSON(e);return t.object.distance=this.distance,t.object.decay=this.decay,t.object.shadow=this.shadow.toJSON(),t}}class Ea extends rm{constructor(e=-1,t=1,n=1,s=-1,r=.1,a=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=n,this.bottom=s,this.near=r,this.far=a,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,n,s,r,a){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,s=(this.top+this.bottom)/2;let r=n-e,a=n+e,o=s+t,l=s-t;if(this.view!==null&&this.view.enabled){const c=(this.right-this.left)/this.view.fullWidth/this.zoom,u=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=c*this.view.offsetX,a=r+c*this.view.width,o-=u*this.view.offsetY,l=o-u*this.view.height}this.projectionMatrix.makeOrthographic(r,a,o,l,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}}class _y extends bh{constructor(){super(new Ea(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class am extends gl{constructor(e,t){super(e,t),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(xt.DEFAULT_UP),this.updateMatrix(),this.target=new xt,this.shadow=new _y}dispose(){super.dispose(),this.shadow.dispose()}copy(e){return super.copy(e),this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}toJSON(e){const t=super.toJSON(e);return t.object.shadow=this.shadow.toJSON(),t.object.target=this.target.uuid,t}}class yy extends gl{constructor(e,t){super(e,t),this.isAmbientLight=!0,this.type="AmbientLight"}}class jr{static extractUrlBase(e){const t=e.lastIndexOf("/");return t===-1?"./":e.slice(0,t+1)}static resolveURL(e,t){return typeof e!="string"||e===""?"":(/^https?:\/\//i.test(t)&&/^\//.test(e)&&(t=t.replace(/(^https?:\/\/[^\/]+).*/i,"$1")),/^(https?:)?\/\//i.test(e)||/^data:.*,.*$/i.test(e)||/^blob:.*$/i.test(e)?e:t+e)}}class xy extends nt{constructor(){super(),this.isInstancedBufferGeometry=!0,this.type="InstancedBufferGeometry",this.instanceCount=1/0}copy(e){return super.copy(e),this.instanceCount=e.instanceCount,this}toJSON(){const e=super.toJSON();return e.instanceCount=this.instanceCount,e.isInstancedBufferGeometry=!0,e}}const ac=new WeakMap;class vy extends pr{constructor(e){super(e),this.isImageBitmapLoader=!0,typeof createImageBitmap>"u"&&Re("ImageBitmapLoader: createImageBitmap() not supported."),typeof fetch>"u"&&Re("ImageBitmapLoader: fetch() not supported."),this.options={premultiplyAlpha:"none"},this._abortController=new AbortController}setOptions(e){return this.options=e,this}load(e,t,n,s){e===void 0&&(e=""),this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);const r=this,a=fi.get(`image-bitmap:${e}`);if(a!==void 0){if(r.manager.itemStart(e),a.then){a.then(c=>{if(ac.has(a)===!0)s&&s(ac.get(a)),r.manager.itemError(e),r.manager.itemEnd(e);else return t&&t(c),r.manager.itemEnd(e),c});return}return setTimeout(function(){t&&t(a),r.manager.itemEnd(e)},0),a}const o={};o.credentials=this.crossOrigin==="anonymous"?"same-origin":"include",o.headers=this.requestHeader,o.signal=typeof AbortSignal.any=="function"?AbortSignal.any([this._abortController.signal,this.manager.abortController.signal]):this._abortController.signal;const l=fetch(e,o).then(function(c){return c.blob()}).then(function(c){return createImageBitmap(c,Object.assign(r.options,{colorSpaceConversion:"none"}))}).then(function(c){return fi.add(`image-bitmap:${e}`,c),t&&t(c),r.manager.itemEnd(e),c}).catch(function(c){s&&s(c),ac.set(l,c),fi.remove(`image-bitmap:${e}`),r.manager.itemError(e),r.manager.itemEnd(e)});fi.add(`image-bitmap:${e}`,l),r.manager.itemStart(e)}abort(){return this._abortController.abort(),this._abortController=new AbortController,this}}const Ts=-90,ws=1;class Sy extends xt{constructor(e,t,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;const s=new Zt(Ts,ws,e,t);s.layers=this.layers,this.add(s);const r=new Zt(Ts,ws,e,t);r.layers=this.layers,this.add(r);const a=new Zt(Ts,ws,e,t);a.layers=this.layers,this.add(a);const o=new Zt(Ts,ws,e,t);o.layers=this.layers,this.add(o);const l=new Zt(Ts,ws,e,t);l.layers=this.layers,this.add(l);const c=new Zt(Ts,ws,e,t);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){const e=this.coordinateSystem,t=this.children.concat(),[n,s,r,a,o,l]=t;for(const c of t)this.remove(c);if(e===Yn)n.up.set(0,1,0),n.lookAt(1,0,0),s.up.set(0,1,0),s.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),a.up.set(0,0,1),a.lookAt(0,-1,0),o.up.set(0,1,0),o.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(e===ua)n.up.set(0,-1,0),n.lookAt(-1,0,0),s.up.set(0,-1,0),s.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),a.up.set(0,0,-1),a.lookAt(0,-1,0),o.up.set(0,-1,0),o.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(const c of t)this.add(c),c.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();const{renderTarget:n,activeMipmapLevel:s}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());const[r,a,o,l,c,u]=this.children,d=e.getRenderTarget(),h=e.getActiveCubeFace(),f=e.getActiveMipmapLevel(),p=e.xr.enabled;e.xr.enabled=!1;const _=n.texture.generateMipmaps;n.texture.generateMipmaps=!1;let m=!1;e.isWebGLRenderer===!0?m=e.state.buffers.depth.getReversed():m=e.reversedDepthBuffer,e.setRenderTarget(n,0,s),m&&e.autoClear===!1&&e.clearDepth(),e.render(t,r),e.setRenderTarget(n,1,s),m&&e.autoClear===!1&&e.clearDepth(),e.render(t,a),e.setRenderTarget(n,2,s),m&&e.autoClear===!1&&e.clearDepth(),e.render(t,o),e.setRenderTarget(n,3,s),m&&e.autoClear===!1&&e.clearDepth(),e.render(t,l),e.setRenderTarget(n,4,s),m&&e.autoClear===!1&&e.clearDepth(),e.render(t,c),n.texture.generateMipmaps=_,e.setRenderTarget(n,5,s),m&&e.autoClear===!1&&e.clearDepth(),e.render(t,u),e.setRenderTarget(d,h,f),e.xr.enabled=p,n.texture.needsPMREMUpdate=!0}}class My extends Zt{constructor(e=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=e}}class Ay{constructor(){this._previousTime=0,this._currentTime=0,this._startTime=performance.now(),this._delta=0,this._elapsed=0,this._timescale=1,this._document=null,this._pageVisibilityHandler=null}connect(e){this._document=e,e.hidden!==void 0&&(this._pageVisibilityHandler=by.bind(this),e.addEventListener("visibilitychange",this._pageVisibilityHandler,!1))}disconnect(){this._pageVisibilityHandler!==null&&(this._document.removeEventListener("visibilitychange",this._pageVisibilityHandler),this._pageVisibilityHandler=null),this._document=null}getDelta(){return this._delta/1e3}getElapsed(){return this._elapsed/1e3}getTimescale(){return this._timescale}setTimescale(e){return this._timescale=e,this}reset(){return this._currentTime=performance.now()-this._startTime,this}dispose(){this.disconnect()}update(e){return this._pageVisibilityHandler!==null&&this._document.hidden===!0?this._delta=0:(this._previousTime=this._currentTime,this._currentTime=(e!==void 0?e:performance.now())-this._startTime,this._delta=(this._currentTime-this._previousTime)*this._timescale,this._elapsed+=this._delta),this}}function by(){this._document.hidden===!1&&this.reset()}const Eh="\\[\\]\\.:\\/",Ey=new RegExp("["+Eh+"]","g"),Th="[^"+Eh+"]",Ty="[^"+Eh.replace("\\.","")+"]",wy=/((?:WC+[\/:])*)/.source.replace("WC",Th),Cy=/(WCOD+)?/.source.replace("WCOD",Ty),Ry=/(?:\.(WC+)(?:\[(.+)\])?)?/.source.replace("WC",Th),Ly=/\.(WC+)(?:\[(.+)\])?/.source.replace("WC",Th),Py=new RegExp("^"+wy+Cy+Ry+Ly+"$"),Iy=["material","materials","bones","map"];class Dy{constructor(e,t,n){const s=n||ut.parseTrackName(t);this._targetGroup=e,this._bindings=e.subscribe_(t,s)}getValue(e,t){this.bind();const n=this._targetGroup.nCachedObjects_,s=this._bindings[n];s!==void 0&&s.getValue(e,t)}setValue(e,t){const n=this._bindings;for(let s=this._targetGroup.nCachedObjects_,r=n.length;s!==r;++s)n[s].setValue(e,t)}bind(){const e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,n=e.length;t!==n;++t)e[t].bind()}unbind(){const e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,n=e.length;t!==n;++t)e[t].unbind()}}class ut{constructor(e,t,n){this.path=t,this.parsedPath=n||ut.parseTrackName(t),this.node=ut.findNode(e,this.parsedPath.nodeName),this.rootNode=e,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}static create(e,t,n){return e&&e.isAnimationObjectGroup?new ut.Composite(e,t,n):new ut(e,t,n)}static sanitizeNodeName(e){return e.replace(/\s/g,"_").replace(Ey,"")}static parseTrackName(e){const t=Py.exec(e);if(t===null)throw new Error("PropertyBinding: Cannot parse trackName: "+e);const n={nodeName:t[2],objectName:t[3],objectIndex:t[4],propertyName:t[5],propertyIndex:t[6]},s=n.nodeName&&n.nodeName.lastIndexOf(".");if(s!==void 0&&s!==-1){const r=n.nodeName.substring(s+1);Iy.indexOf(r)!==-1&&(n.nodeName=n.nodeName.substring(0,s),n.objectName=r)}if(n.propertyName===null||n.propertyName.length===0)throw new Error("PropertyBinding: can not parse propertyName from trackName: "+e);return n}static findNode(e,t){if(t===void 0||t===""||t==="."||t===-1||t===e.name||t===e.uuid)return e;if(e.skeleton){const n=e.skeleton.getBoneByName(t);if(n!==void 0)return n}if(e.children){const n=function(r){for(let a=0;a<r.length;a++){const o=r[a];if(o.name===t||o.uuid===t)return o;const l=n(o.children);if(l)return l}return null},s=n(e.children);if(s)return s}return null}_getValue_unavailable(){}_setValue_unavailable(){}_getValue_direct(e,t){e[t]=this.targetObject[this.propertyName]}_getValue_array(e,t){const n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)e[t++]=n[s]}_getValue_arrayElement(e,t){e[t]=this.resolvedProperty[this.propertyIndex]}_getValue_toArray(e,t){this.resolvedProperty.toArray(e,t)}_setValue_direct(e,t){this.targetObject[this.propertyName]=e[t]}_setValue_direct_setNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.needsUpdate=!0}_setValue_direct_setMatrixWorldNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_array(e,t){const n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)n[s]=e[t++]}_setValue_array_setNeedsUpdate(e,t){const n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)n[s]=e[t++];this.targetObject.needsUpdate=!0}_setValue_array_setMatrixWorldNeedsUpdate(e,t){const n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)n[s]=e[t++];this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_arrayElement(e,t){this.resolvedProperty[this.propertyIndex]=e[t]}_setValue_arrayElement_setNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.needsUpdate=!0}_setValue_arrayElement_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_fromArray(e,t){this.resolvedProperty.fromArray(e,t)}_setValue_fromArray_setNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.needsUpdate=!0}_setValue_fromArray_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.matrixWorldNeedsUpdate=!0}_getValue_unbound(e,t){this.bind(),this.getValue(e,t)}_setValue_unbound(e,t){this.bind(),this.setValue(e,t)}bind(){let e=this.node;const t=this.parsedPath,n=t.objectName,s=t.propertyName;let r=t.propertyIndex;if(e||(e=ut.findNode(this.rootNode,t.nodeName),this.node=e),this.getValue=this._getValue_unavailable,this.setValue=this._setValue_unavailable,!e){Re("PropertyBinding: No target node found for track: "+this.path+".");return}if(n){let c=t.objectIndex;switch(n){case"materials":if(!e.material){ze("PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!e.material.materials){ze("PropertyBinding: Can not bind to material.materials as node.material does not have a materials array.",this);return}e=e.material.materials;break;case"bones":if(!e.skeleton){ze("PropertyBinding: Can not bind to bones as node does not have a skeleton.",this);return}e=e.skeleton.bones;for(let u=0;u<e.length;u++)if(e[u].name===c){c=u;break}break;case"map":if("map"in e){e=e.map;break}if(!e.material){ze("PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!e.material.map){ze("PropertyBinding: Can not bind to material.map as node.material does not have a map.",this);return}e=e.material.map;break;default:if(e[n]===void 0){ze("PropertyBinding: Can not bind to objectName of node undefined.",this);return}e=e[n]}if(c!==void 0){if(e[c]===void 0){ze("PropertyBinding: Trying to bind to objectIndex of objectName, but is undefined.",this,e);return}e=e[c]}}const a=e[s];if(a===void 0){const c=t.nodeName;ze("PropertyBinding: Trying to update property for track: "+c+"."+s+" but it wasn't found.",e);return}let o=this.Versioning.None;this.targetObject=e,e.isMaterial===!0?o=this.Versioning.NeedsUpdate:e.isObject3D===!0&&(o=this.Versioning.MatrixWorldNeedsUpdate);let l=this.BindingType.Direct;if(r!==void 0){if(s==="morphTargetInfluences"){if(!e.geometry){ze("PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.",this);return}if(!e.geometry.morphAttributes){ze("PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.morphAttributes.",this);return}e.morphTargetDictionary[r]!==void 0&&(r=e.morphTargetDictionary[r])}l=this.BindingType.ArrayElement,this.resolvedProperty=a,this.propertyIndex=r}else a.fromArray!==void 0&&a.toArray!==void 0?(l=this.BindingType.HasFromToArray,this.resolvedProperty=a):Array.isArray(a)?(l=this.BindingType.EntireArray,this.resolvedProperty=a):this.propertyName=s;this.getValue=this.GetterByBindingType[l],this.setValue=this.SetterByBindingTypeAndVersioning[l][o]}unbind(){this.node=null,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}}ut.Composite=Dy;ut.prototype.BindingType={Direct:0,EntireArray:1,ArrayElement:2,HasFromToArray:3};ut.prototype.Versioning={None:0,NeedsUpdate:1,MatrixWorldNeedsUpdate:2};ut.prototype.GetterByBindingType=[ut.prototype._getValue_direct,ut.prototype._getValue_array,ut.prototype._getValue_arrayElement,ut.prototype._getValue_toArray];ut.prototype.SetterByBindingTypeAndVersioning=[[ut.prototype._setValue_direct,ut.prototype._setValue_direct_setNeedsUpdate,ut.prototype._setValue_direct_setMatrixWorldNeedsUpdate],[ut.prototype._setValue_array,ut.prototype._setValue_array_setNeedsUpdate,ut.prototype._setValue_array_setMatrixWorldNeedsUpdate],[ut.prototype._setValue_arrayElement,ut.prototype._setValue_arrayElement_setNeedsUpdate,ut.prototype._setValue_arrayElement_setMatrixWorldNeedsUpdate],[ut.prototype._setValue_fromArray,ut.prototype._setValue_fromArray_setNeedsUpdate,ut.prototype._setValue_fromArray_setMatrixWorldNeedsUpdate]];class Eu extends hh{constructor(e,t,n=1){super(e,t),this.isInstancedInterleavedBuffer=!0,this.meshPerAttribute=n}copy(e){return super.copy(e),this.meshPerAttribute=e.meshPerAttribute,this}clone(e){const t=super.clone(e);return t.meshPerAttribute=this.meshPerAttribute,t}toJSON(e){const t=super.toJSON(e);return t.isInstancedInterleavedBuffer=!0,t.meshPerAttribute=this.meshPerAttribute,t}}const $d=new Ke;class Ny{constructor(e,t,n=0,s=1/0){this.ray=new cr(e,t),this.near=n,this.far=s,this.camera=null,this.layers=new uh,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(e,t){this.ray.set(e,t)}setFromCamera(e,t){t.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(t.matrixWorld),this.ray.direction.set(e.x,e.y,.5).unproject(t).sub(this.ray.origin).normalize(),this.camera=t):t.isOrthographicCamera?(this.ray.origin.set(e.x,e.y,(t.near+t.far)/(t.near-t.far)).unproject(t),this.ray.direction.set(0,0,-1).transformDirection(t.matrixWorld),this.camera=t):ze("Raycaster: Unsupported camera type: "+t.type)}setFromXRController(e){return $d.identity().extractRotation(e.matrixWorld),this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(0,0,-1).applyMatrix4($d),this}intersectObject(e,t=!0,n=[]){return Tu(e,this,n,t),n.sort(Jd),n}intersectObjects(e,t=!0,n=[]){for(let s=0,r=e.length;s<r;s++)Tu(e[s],this,n,t);return n.sort(Jd),n}}function Jd(i,e){return i.distance-e.distance}function Tu(i,e,t,n){let s=!0;if(i.layers.test(e.layers)&&i.raycast(e,t)===!1&&(s=!1),s===!0&&n===!0){const r=i.children;for(let a=0,o=r.length;a<o;a++)Tu(r[a],e,t,!0)}}class Uy{constructor(e=!0){this.autoStart=e,this.startTime=0,this.oldTime=0,this.elapsedTime=0,this.running=!1,Re("THREE.Clock: This module has been deprecated. Please use THREE.Timer instead.")}start(){this.startTime=performance.now(),this.oldTime=this.startTime,this.elapsedTime=0,this.running=!0}stop(){this.getElapsedTime(),this.running=!1,this.autoStart=!1}getElapsedTime(){return this.getDelta(),this.elapsedTime}getDelta(){let e=0;if(this.autoStart&&!this.running)return this.start(),0;if(this.running){const t=performance.now();e=(t-this.oldTime)/1e3,this.oldTime=t,this.elapsedTime+=e}return e}}class jd{constructor(e=1,t=0,n=0){this.radius=e,this.phi=t,this.theta=n}set(e,t,n){return this.radius=e,this.phi=t,this.theta=n,this}copy(e){return this.radius=e.radius,this.phi=e.phi,this.theta=e.theta,this}makeSafe(){return this.phi=Ge(this.phi,1e-6,Math.PI-1e-6),this}setFromVector3(e){return this.setFromCartesianCoords(e.x,e.y,e.z)}setFromCartesianCoords(e,t,n){return this.radius=Math.sqrt(e*e+t*t+n*n),this.radius===0?(this.theta=0,this.phi=0):(this.theta=Math.atan2(e,n),this.phi=Math.acos(Ge(t/this.radius,-1,1))),this}clone(){return new this.constructor().copy(this)}}const Zd=new P,lo=new P,Cs=new P,Rs=new P,oc=new P,Oy=new P,By=new P;class Fy{constructor(e=new P,t=new P){this.start=e,this.end=t}set(e,t){return this.start.copy(e),this.end.copy(t),this}copy(e){return this.start.copy(e.start),this.end.copy(e.end),this}getCenter(e){return e.addVectors(this.start,this.end).multiplyScalar(.5)}delta(e){return e.subVectors(this.end,this.start)}distanceSq(){return this.start.distanceToSquared(this.end)}distance(){return this.start.distanceTo(this.end)}at(e,t){return this.delta(t).multiplyScalar(e).add(this.start)}closestPointToPointParameter(e,t){Zd.subVectors(e,this.start),lo.subVectors(this.end,this.start);const n=lo.dot(lo);let r=lo.dot(Zd)/n;return t&&(r=Ge(r,0,1)),r}closestPointToPoint(e,t,n){const s=this.closestPointToPointParameter(e,t);return this.delta(n).multiplyScalar(s).add(this.start)}distanceSqToLine3(e,t=Oy,n=By){const s=10000000000000001e-32;let r,a;const o=this.start,l=e.start,c=this.end,u=e.end;Cs.subVectors(c,o),Rs.subVectors(u,l),oc.subVectors(o,l);const d=Cs.dot(Cs),h=Rs.dot(Rs),f=Rs.dot(oc);if(d<=s&&h<=s)return t.copy(o),n.copy(l),t.sub(n),t.dot(t);if(d<=s)r=0,a=f/h,a=Ge(a,0,1);else{const p=Cs.dot(oc);if(h<=s)a=0,r=Ge(-p/d,0,1);else{const _=Cs.dot(Rs),m=d*h-_*_;m!==0?r=Ge((_*f-p*h)/m,0,1):r=0,a=(_*r+f)/h,a<0?(a=0,r=Ge(-p/d,0,1)):a>1&&(a=1,r=Ge((_-p)/d,0,1))}}return t.copy(o).addScaledVector(Cs,r),n.copy(l).addScaledVector(Rs,a),t.distanceToSquared(n)}applyMatrix4(e){return this.start.applyMatrix4(e),this.end.applyMatrix4(e),this}equals(e){return e.start.equals(this.start)&&e.end.equals(this.end)}clone(){return new this.constructor().copy(this)}}class zy extends ji{constructor(e=10,t=10,n=4473924,s=8947848){n=new ve(n),s=new ve(s);const r=t/2,a=e/t,o=e/2,l=[],c=[];for(let h=0,f=0,p=-o;h<=t;h++,p+=a){l.push(-o,0,p,o,0,p),l.push(p,0,-o,p,0,o);const _=h===r?n:s;_.toArray(c,f),f+=3,_.toArray(c,f),f+=3,_.toArray(c,f),f+=3,_.toArray(c,f),f+=3}const u=new nt;u.setAttribute("position",new ke(l,3)),u.setAttribute("color",new ke(c,3));const d=new ns({vertexColors:!0,toneMapped:!1});super(u,d),this.type="GridHelper"}dispose(){this.geometry.dispose(),this.material.dispose()}}class ky extends ts{constructor(e,t=null){super(),this.object=e,this.domElement=t,this.enabled=!0,this.state=-1,this.keys={},this.mouseButtons={LEFT:null,MIDDLE:null,RIGHT:null},this.touches={ONE:null,TWO:null}}connect(e){if(e===void 0){Re("Controls: connect() now requires an element.");return}this.domElement!==null&&this.disconnect(),this.domElement=e}disconnect(){}dispose(){}update(){}}function Qd(i,e,t,n){const s=Hy(n);switch(t){case Np:return i*e;case eh:return i*e/s.components*s.byteLength;case th:return i*e/s.components*s.byteLength;case Js:return i*e*2/s.components*s.byteLength;case nh:return i*e*2/s.components*s.byteLength;case Up:return i*e*3/s.components*s.byteLength;case xn:return i*e*4/s.components*s.byteLength;case ih:return i*e*4/s.components*s.byteLength;case Oo:case Bo:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*8;case Fo:case zo:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case kc:case Gc:return Math.max(i,16)*Math.max(e,8)/4;case zc:case Hc:return Math.max(i,8)*Math.max(e,8)/2;case Vc:case Wc:case Xc:case Yc:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*8;case Kc:case qc:case $c:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case Jc:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case jc:return Math.floor((i+4)/5)*Math.floor((e+3)/4)*16;case Zc:return Math.floor((i+4)/5)*Math.floor((e+4)/5)*16;case Qc:return Math.floor((i+5)/6)*Math.floor((e+4)/5)*16;case eu:return Math.floor((i+5)/6)*Math.floor((e+5)/6)*16;case tu:return Math.floor((i+7)/8)*Math.floor((e+4)/5)*16;case nu:return Math.floor((i+7)/8)*Math.floor((e+5)/6)*16;case iu:return Math.floor((i+7)/8)*Math.floor((e+7)/8)*16;case su:return Math.floor((i+9)/10)*Math.floor((e+4)/5)*16;case ru:return Math.floor((i+9)/10)*Math.floor((e+5)/6)*16;case au:return Math.floor((i+9)/10)*Math.floor((e+7)/8)*16;case ou:return Math.floor((i+9)/10)*Math.floor((e+9)/10)*16;case lu:return Math.floor((i+11)/12)*Math.floor((e+9)/10)*16;case cu:return Math.floor((i+11)/12)*Math.floor((e+11)/12)*16;case uu:case hu:case du:return Math.ceil(i/4)*Math.ceil(e/4)*16;case fu:case pu:return Math.ceil(i/4)*Math.ceil(e/4)*8;case mu:case gu:return Math.ceil(i/4)*Math.ceil(e/4)*16}throw new Error(`Unable to determine texture byte length for ${t} format.`)}function Hy(i){switch(i){case cn:case Lp:return{byteLength:1,components:1};case aa:case Pp:case hn:return{byteLength:2,components:1};case Zu:case Qu:return{byteLength:2,components:4};case Zn:case ju:case yn:return{byteLength:4,components:1};case Ip:case Dp:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${i}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:Vu}}));typeof window<"u"&&(window.__THREE__?Re("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=Vu);function om(){let i=null,e=!1,t=null,n=null;function s(r,a){t(r,a),n=i.requestAnimationFrame(s)}return{start:function(){e!==!0&&t!==null&&(n=i.requestAnimationFrame(s),e=!0)},stop:function(){i.cancelAnimationFrame(n),e=!1},setAnimationLoop:function(r){t=r},setContext:function(r){i=r}}}function Gy(i){const e=new WeakMap;function t(o,l){const c=o.array,u=o.usage,d=c.byteLength,h=i.createBuffer();i.bindBuffer(l,h),i.bufferData(l,c,u),o.onUploadCallback();let f;if(c instanceof Float32Array)f=i.FLOAT;else if(typeof Float16Array<"u"&&c instanceof Float16Array)f=i.HALF_FLOAT;else if(c instanceof Uint16Array)o.isFloat16BufferAttribute?f=i.HALF_FLOAT:f=i.UNSIGNED_SHORT;else if(c instanceof Int16Array)f=i.SHORT;else if(c instanceof Uint32Array)f=i.UNSIGNED_INT;else if(c instanceof Int32Array)f=i.INT;else if(c instanceof Int8Array)f=i.BYTE;else if(c instanceof Uint8Array)f=i.UNSIGNED_BYTE;else if(c instanceof Uint8ClampedArray)f=i.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+c);return{buffer:h,type:f,bytesPerElement:c.BYTES_PER_ELEMENT,version:o.version,size:d}}function n(o,l,c){const u=l.array,d=l.updateRanges;if(i.bindBuffer(c,o),d.length===0)i.bufferSubData(c,0,u);else{d.sort((f,p)=>f.start-p.start);let h=0;for(let f=1;f<d.length;f++){const p=d[h],_=d[f];_.start<=p.start+p.count+1?p.count=Math.max(p.count,_.start+_.count-p.start):(++h,d[h]=_)}d.length=h+1;for(let f=0,p=d.length;f<p;f++){const _=d[f];i.bufferSubData(c,_.start*u.BYTES_PER_ELEMENT,u,_.start,_.count)}l.clearUpdateRanges()}l.onUploadCallback()}function s(o){return o.isInterleavedBufferAttribute&&(o=o.data),e.get(o)}function r(o){o.isInterleavedBufferAttribute&&(o=o.data);const l=e.get(o);l&&(i.deleteBuffer(l.buffer),e.delete(o))}function a(o,l){if(o.isInterleavedBufferAttribute&&(o=o.data),o.isGLBufferAttribute){const u=e.get(o);(!u||u.version<o.version)&&e.set(o,{buffer:o.buffer,type:o.type,bytesPerElement:o.elementSize,version:o.version});return}const c=e.get(o);if(c===void 0)e.set(o,t(o,l));else if(c.version<o.version){if(c.size!==o.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");n(c.buffer,o,l),c.version=o.version}}return{get:s,remove:r,update:a}}var Vy=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,Wy=`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,Ky=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,Xy=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,Yy=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,qy=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,$y=`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,Jy=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,jy=`#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec4 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 );
	}
#endif`,Zy=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,Qy=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,ex=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,tx=`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,nx=`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,ix=`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,sx=`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,rx=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,ax=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,ox=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,lx=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#endif`,cx=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#endif`,ux=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec4 vColor;
#endif`,hx=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec4( 1.0 );
#endif
#ifdef USE_COLOR_ALPHA
	vColor *= color;
#elif defined( USE_COLOR )
	vColor.rgb *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.rgb *= instanceColor.rgb;
#endif
#ifdef USE_BATCHING_COLOR
	vColor *= getBatchingColor( getIndirectIndex( gl_DrawID ) );
#endif`,dx=`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
vec3 inverseTransformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( vec4( dir, 0.0 ) * matrix ).xyz );
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,fx=`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,px=`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
	#ifdef FLIP_SIDED
		transformedTangent = - transformedTangent;
	#endif
#endif`,mx=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,gx=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,_x=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,yx=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,xx="gl_FragColor = linearToOutputTexel( gl_FragColor );",vx=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,Sx=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * vec3( flipEnvMap * reflectVec.x, reflectVec.yz ) );
		#ifdef ENVMAP_BLENDING_MULTIPLY
			outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
		#elif defined( ENVMAP_BLENDING_MIX )
			outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
		#elif defined( ENVMAP_BLENDING_ADD )
			outgoingLight += envColor.xyz * specularStrength * reflectivity;
		#endif
	#endif
#endif`,Mx=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
#endif`,Ax=`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,bx=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,Ex=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,Tx=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,wx=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,Cx=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,Rx=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,Lx=`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,Px=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,Ix=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,Dx=`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,Nx=`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif`,Ux=`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, pow4( roughness ) ) );
			reflectVec = inverseTransformDirection( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
#endif`,Ox=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,Bx=`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,Fx=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,zx=`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,kx=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.diffuseContribution = diffuseColor.rgb * ( 1.0 - metalnessFactor );
material.metalness = metalnessFactor;
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor;
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = vec3( 0.04 );
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.0001, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,Hx=`uniform sampler2D dfgLUT;
struct PhysicalMaterial {
	vec3 diffuseColor;
	vec3 diffuseContribution;
	vec3 specularColor;
	vec3 specularColorBlended;
	float roughness;
	float metalness;
	float specularF90;
	float dispersion;
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0;
		vec3 iridescenceFresnelDielectric;
		vec3 iridescenceFresnelMetallic;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		float v = 0.5 / ( gv + gl );
		return v;
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColorBlended;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transpose( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float rInv = 1.0 / ( roughness + 0.1 );
	float a = -1.9362 + 1.0678 * roughness + 0.4573 * r2 - 0.8469 * rInv;
	float b = -0.6014 + 0.5538 * roughness - 0.4670 * r2 - 0.1255 * rInv;
	float DG = exp( a * dotNV + b );
	return saturate( DG );
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 fab = texture2D( dfgLUT, vec2( roughness, dotNV ) ).rg;
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 fab = texture2D( dfgLUT, vec2( roughness, dotNV ) ).rg;
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
vec3 BRDF_GGX_Multiscatter( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 singleScatter = BRDF_GGX( lightDir, viewDir, normal, material );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 dfgV = texture2D( dfgLUT, vec2( material.roughness, dotNV ) ).rg;
	vec2 dfgL = texture2D( dfgLUT, vec2( material.roughness, dotNL ) ).rg;
	vec3 FssEss_V = material.specularColorBlended * dfgV.x + material.specularF90 * dfgV.y;
	vec3 FssEss_L = material.specularColorBlended * dfgL.x + material.specularF90 * dfgL.y;
	float Ess_V = dfgV.x + dfgV.y;
	float Ess_L = dfgL.x + dfgL.y;
	float Ems_V = 1.0 - Ess_V;
	float Ems_L = 1.0 - Ess_L;
	vec3 Favg = material.specularColorBlended + ( 1.0 - material.specularColorBlended ) * 0.047619;
	vec3 Fms = FssEss_V * FssEss_L * Favg / ( 1.0 - Ems_V * Ems_L * Favg + EPSILON );
	float compensationFactor = Ems_V * Ems_L;
	vec3 multiScatter = Fms * compensationFactor;
	return singleScatter + multiScatter;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColorBlended * t2.x + ( material.specularF90 - material.specularColorBlended ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseContribution * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
		#ifdef USE_CLEARCOAT
			vec3 Ncc = geometryClearcoatNormal;
			vec2 uvClearcoat = LTC_Uv( Ncc, viewDir, material.clearcoatRoughness );
			vec4 t1Clearcoat = texture2D( ltc_1, uvClearcoat );
			vec4 t2Clearcoat = texture2D( ltc_2, uvClearcoat );
			mat3 mInvClearcoat = mat3(
				vec3( t1Clearcoat.x, 0, t1Clearcoat.y ),
				vec3(             0, 1,             0 ),
				vec3( t1Clearcoat.z, 0, t1Clearcoat.w )
			);
			vec3 fresnelClearcoat = material.clearcoatF0 * t2Clearcoat.x + ( material.clearcoatF90 - material.clearcoatF0 ) * t2Clearcoat.y;
			clearcoatSpecularDirect += lightColor * fresnelClearcoat * LTC_Evaluate( Ncc, viewDir, position, mInvClearcoat, rectCoords );
		#endif
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
 
 		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
 
 		float sheenAlbedoV = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
 		float sheenAlbedoL = IBLSheenBRDF( geometryNormal, directLight.direction, material.sheenRoughness );
 
 		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * max( sheenAlbedoV, sheenAlbedoL );
 
 		irradiance *= sheenEnergyComp;
 
 	#endif
	reflectedLight.directSpecular += irradiance * BRDF_GGX_Multiscatter( directLight.direction, geometryViewDir, geometryNormal, material );
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseContribution );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 diffuse = irradiance * BRDF_Lambert( material.diffuseContribution );
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		diffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectDiffuse += diffuse;
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness ) * RECIPROCAL_PI;
 	#endif
	vec3 singleScatteringDielectric = vec3( 0.0 );
	vec3 multiScatteringDielectric = vec3( 0.0 );
	vec3 singleScatteringMetallic = vec3( 0.0 );
	vec3 multiScatteringMetallic = vec3( 0.0 );
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.iridescence, material.iridescenceFresnelDielectric, material.roughness, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.diffuseColor, material.specularF90, material.iridescence, material.iridescenceFresnelMetallic, material.roughness, singleScatteringMetallic, multiScatteringMetallic );
	#else
		computeMultiscattering( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.roughness, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscattering( geometryNormal, geometryViewDir, material.diffuseColor, material.specularF90, material.roughness, singleScatteringMetallic, multiScatteringMetallic );
	#endif
	vec3 singleScattering = mix( singleScatteringDielectric, singleScatteringMetallic, material.metalness );
	vec3 multiScattering = mix( multiScatteringDielectric, multiScatteringMetallic, material.metalness );
	vec3 totalScatteringDielectric = singleScatteringDielectric + multiScatteringDielectric;
	vec3 diffuse = material.diffuseContribution * ( 1.0 - totalScatteringDielectric );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	vec3 indirectSpecular = radiance * singleScattering;
	indirectSpecular += multiScattering * cosineWeightedIrradiance;
	vec3 indirectDiffuse = diffuse * cosineWeightedIrradiance;
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		indirectSpecular *= sheenEnergyComp;
		indirectDiffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectSpecular += indirectSpecular;
	reflectedLight.indirectDiffuse += indirectDiffuse;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,Gx=`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		material.iridescenceFresnelDielectric = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		material.iridescenceFresnelMetallic = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.diffuseColor );
		material.iridescenceFresnel = mix( material.iridescenceFresnelDielectric, material.iridescenceFresnelMetallic, material.metalness );
		material.iridescenceF0 = Schlick_to_F0( material.iridescenceFresnel, 1.0, dotNVi );
	}
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS ) && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,Vx=`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( ENVMAP_TYPE_CUBE_UV )
		#if defined( STANDARD ) || defined( LAMBERT ) || defined( PHONG )
			iblIrradiance += getIBLIrradiance( geometryNormal );
		#endif
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		radiance += getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		radiance += getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,Wx=`#if defined( RE_IndirectDiffuse )
	#if defined( LAMBERT ) || defined( PHONG )
		irradiance += iblIrradiance;
	#endif
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,Kx=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,Xx=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Yx=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,qx=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,$x=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,Jx=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,jx=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,Zx=`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,Qx=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,ev=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,tv=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,nv=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,iv=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,sv=`#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`,rv=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,av=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,ov=`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,lv=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,cv=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,uv=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,hv=`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,dv=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,fv=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,pv=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,mv=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,gv=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,_v=`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	#ifdef USE_REVERSED_DEPTH_BUFFER
	
		return depth * ( far - near ) - far;
	#else
		return depth * ( near - far ) - near;
	#endif
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	
	#ifdef USE_REVERSED_DEPTH_BUFFER
		return ( near * far ) / ( ( near - far ) * depth - near );
	#else
		return ( near * far ) / ( ( far - near ) * depth - far );
	#endif
}`,yv=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,xv=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,vv=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,Sv=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,Mv=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,Av=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,bv=`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#else
			uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#endif
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#else
			uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#endif
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform samplerCubeShadow pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#elif defined( SHADOWMAP_TYPE_BASIC )
			uniform samplerCube pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#endif
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float interleavedGradientNoise( vec2 position ) {
			return fract( 52.9829189 * fract( dot( position, vec2( 0.06711056, 0.00583715 ) ) ) );
		}
		vec2 vogelDiskSample( int sampleIndex, int samplesCount, float phi ) {
			const float goldenAngle = 2.399963229728653;
			float r = sqrt( ( float( sampleIndex ) + 0.5 ) / float( samplesCount ) );
			float theta = float( sampleIndex ) * goldenAngle + phi;
			return vec2( cos( theta ), sin( theta ) ) * r;
		}
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float getShadow( sampler2DShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			shadowCoord.z += shadowBias;
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
				float radius = shadowRadius * texelSize.x;
				float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;
				shadow = (
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 0, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 1, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 2, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 3, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 4, 5, phi ) * radius, shadowCoord.z ) )
				) * 0.2;
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#elif defined( SHADOWMAP_TYPE_VSM )
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 distribution = texture2D( shadowMap, shadowCoord.xy ).rg;
				float mean = distribution.x;
				float variance = distribution.y * distribution.y;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					float hard_shadow = step( mean, shadowCoord.z );
				#else
					float hard_shadow = step( shadowCoord.z, mean );
				#endif
				
				if ( hard_shadow == 1.0 ) {
					shadow = 1.0;
				} else {
					variance = max( variance, 0.0000001 );
					float d = shadowCoord.z - mean;
					float p_max = variance / ( variance + d * d );
					p_max = clamp( ( p_max - 0.3 ) / 0.65, 0.0, 1.0 );
					shadow = max( hard_shadow, p_max );
				}
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#else
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				float depth = texture2D( shadowMap, shadowCoord.xy ).r;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					shadow = step( depth, shadowCoord.z );
				#else
					shadow = step( shadowCoord.z, depth );
				#endif
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	#if defined( SHADOWMAP_TYPE_PCF )
	float getPointShadow( samplerCubeShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 bd3D = normalize( lightToPosition );
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			#ifdef USE_REVERSED_DEPTH_BUFFER
				float dp = ( shadowCameraNear * ( shadowCameraFar - viewSpaceZ ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
				dp -= shadowBias;
			#else
				float dp = ( shadowCameraFar * ( viewSpaceZ - shadowCameraNear ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
				dp += shadowBias;
			#endif
			float texelSize = shadowRadius / shadowMapSize.x;
			vec3 absDir = abs( bd3D );
			vec3 tangent = absDir.x > absDir.z ? vec3( 0.0, 1.0, 0.0 ) : vec3( 1.0, 0.0, 0.0 );
			tangent = normalize( cross( bd3D, tangent ) );
			vec3 bitangent = cross( bd3D, tangent );
			float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;
			vec2 sample0 = vogelDiskSample( 0, 5, phi );
			vec2 sample1 = vogelDiskSample( 1, 5, phi );
			vec2 sample2 = vogelDiskSample( 2, 5, phi );
			vec2 sample3 = vogelDiskSample( 3, 5, phi );
			vec2 sample4 = vogelDiskSample( 4, 5, phi );
			shadow = (
				texture( shadowMap, vec4( bd3D + ( tangent * sample0.x + bitangent * sample0.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample1.x + bitangent * sample1.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample2.x + bitangent * sample2.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample3.x + bitangent * sample3.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample4.x + bitangent * sample4.y ) * texelSize, dp ) )
			) * 0.2;
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#elif defined( SHADOWMAP_TYPE_BASIC )
	float getPointShadow( samplerCube shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			float dp = ( shadowCameraFar * ( viewSpaceZ - shadowCameraNear ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			float depth = textureCube( shadowMap, bd3D ).r;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				depth = 1.0 - depth;
			#endif
			shadow = step( dp, depth );
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#endif
	#endif
#endif`,Ev=`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,Tv=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	vec3 shadowWorldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,wv=`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0 && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,Cv=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,Rv=`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,Lv=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,Pv=`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,Iv=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,Dv=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,Nv=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,Uv=`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 CineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,Ov=`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = inverseTransformDirection( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseContribution, material.specularColorBlended, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,Bv=`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		#else
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,Fv=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,zv=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,kv=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,Hv=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const Gv=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,Vv=`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Wv=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Kv=`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float flipEnvMap;
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, backgroundRotation * vec3( flipEnvMap * vWorldDirection.x, vWorldDirection.yz ) );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, backgroundRotation * vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Xv=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Yv=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,qv=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,$v=`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	#ifdef USE_REVERSED_DEPTH_BUFFER
		float fragCoordZ = vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ];
	#else
		float fragCoordZ = 0.5 * vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ] + 0.5;
	#endif
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,Jv=`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,jv=`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main () {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = vec4( dist, 0.0, 0.0, 1.0 );
}`,Zv=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,Qv=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,eS=`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,tS=`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,nS=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,iS=`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,sS=`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,rS=`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,aS=`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,oS=`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,lS=`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,cS=`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( normalize( normal ) * 0.5 + 0.5, diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,uS=`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,hS=`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,dS=`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,fS=`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
 
		outgoingLight = outgoingLight + sheenSpecularDirect + sheenSpecularIndirect;
 
 	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,pS=`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,mS=`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,gS=`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,_S=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,yS=`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,xS=`uniform vec3 color;
uniform float opacity;
#include <common>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,vS=`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix[ 3 ];
	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,SS=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,qe={alphahash_fragment:Vy,alphahash_pars_fragment:Wy,alphamap_fragment:Ky,alphamap_pars_fragment:Xy,alphatest_fragment:Yy,alphatest_pars_fragment:qy,aomap_fragment:$y,aomap_pars_fragment:Jy,batching_pars_vertex:jy,batching_vertex:Zy,begin_vertex:Qy,beginnormal_vertex:ex,bsdfs:tx,iridescence_fragment:nx,bumpmap_pars_fragment:ix,clipping_planes_fragment:sx,clipping_planes_pars_fragment:rx,clipping_planes_pars_vertex:ax,clipping_planes_vertex:ox,color_fragment:lx,color_pars_fragment:cx,color_pars_vertex:ux,color_vertex:hx,common:dx,cube_uv_reflection_fragment:fx,defaultnormal_vertex:px,displacementmap_pars_vertex:mx,displacementmap_vertex:gx,emissivemap_fragment:_x,emissivemap_pars_fragment:yx,colorspace_fragment:xx,colorspace_pars_fragment:vx,envmap_fragment:Sx,envmap_common_pars_fragment:Mx,envmap_pars_fragment:Ax,envmap_pars_vertex:bx,envmap_physical_pars_fragment:Ux,envmap_vertex:Ex,fog_vertex:Tx,fog_pars_vertex:wx,fog_fragment:Cx,fog_pars_fragment:Rx,gradientmap_pars_fragment:Lx,lightmap_pars_fragment:Px,lights_lambert_fragment:Ix,lights_lambert_pars_fragment:Dx,lights_pars_begin:Nx,lights_toon_fragment:Ox,lights_toon_pars_fragment:Bx,lights_phong_fragment:Fx,lights_phong_pars_fragment:zx,lights_physical_fragment:kx,lights_physical_pars_fragment:Hx,lights_fragment_begin:Gx,lights_fragment_maps:Vx,lights_fragment_end:Wx,logdepthbuf_fragment:Kx,logdepthbuf_pars_fragment:Xx,logdepthbuf_pars_vertex:Yx,logdepthbuf_vertex:qx,map_fragment:$x,map_pars_fragment:Jx,map_particle_fragment:jx,map_particle_pars_fragment:Zx,metalnessmap_fragment:Qx,metalnessmap_pars_fragment:ev,morphinstance_vertex:tv,morphcolor_vertex:nv,morphnormal_vertex:iv,morphtarget_pars_vertex:sv,morphtarget_vertex:rv,normal_fragment_begin:av,normal_fragment_maps:ov,normal_pars_fragment:lv,normal_pars_vertex:cv,normal_vertex:uv,normalmap_pars_fragment:hv,clearcoat_normal_fragment_begin:dv,clearcoat_normal_fragment_maps:fv,clearcoat_pars_fragment:pv,iridescence_pars_fragment:mv,opaque_fragment:gv,packing:_v,premultiplied_alpha_fragment:yv,project_vertex:xv,dithering_fragment:vv,dithering_pars_fragment:Sv,roughnessmap_fragment:Mv,roughnessmap_pars_fragment:Av,shadowmap_pars_fragment:bv,shadowmap_pars_vertex:Ev,shadowmap_vertex:Tv,shadowmask_pars_fragment:wv,skinbase_vertex:Cv,skinning_pars_vertex:Rv,skinning_vertex:Lv,skinnormal_vertex:Pv,specularmap_fragment:Iv,specularmap_pars_fragment:Dv,tonemapping_fragment:Nv,tonemapping_pars_fragment:Uv,transmission_fragment:Ov,transmission_pars_fragment:Bv,uv_pars_fragment:Fv,uv_pars_vertex:zv,uv_vertex:kv,worldpos_vertex:Hv,background_vert:Gv,background_frag:Vv,backgroundCube_vert:Wv,backgroundCube_frag:Kv,cube_vert:Xv,cube_frag:Yv,depth_vert:qv,depth_frag:$v,distance_vert:Jv,distance_frag:jv,equirect_vert:Zv,equirect_frag:Qv,linedashed_vert:eS,linedashed_frag:tS,meshbasic_vert:nS,meshbasic_frag:iS,meshlambert_vert:sS,meshlambert_frag:rS,meshmatcap_vert:aS,meshmatcap_frag:oS,meshnormal_vert:lS,meshnormal_frag:cS,meshphong_vert:uS,meshphong_frag:hS,meshphysical_vert:dS,meshphysical_frag:fS,meshtoon_vert:pS,meshtoon_frag:mS,points_vert:gS,points_frag:_S,shadow_vert:yS,shadow_frag:xS,sprite_vert:vS,sprite_frag:SS},pe={common:{diffuse:{value:new ve(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Ye},alphaMap:{value:null},alphaMapTransform:{value:new Ye},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Ye}},envmap:{envMap:{value:null},envMapRotation:{value:new Ye},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98},dfgLUT:{value:null}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Ye}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Ye}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Ye},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Ye},normalScale:{value:new j(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Ye},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Ye}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Ye}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Ye}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new ve(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new ve(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Ye},alphaTest:{value:0},uvTransform:{value:new Ye}},sprite:{diffuse:{value:new ve(16777215)},opacity:{value:1},center:{value:new j(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Ye},alphaMap:{value:null},alphaMapTransform:{value:new Ye},alphaTest:{value:0}}},sn={basic:{uniforms:jt([pe.common,pe.specularmap,pe.envmap,pe.aomap,pe.lightmap,pe.fog]),vertexShader:qe.meshbasic_vert,fragmentShader:qe.meshbasic_frag},lambert:{uniforms:jt([pe.common,pe.specularmap,pe.envmap,pe.aomap,pe.lightmap,pe.emissivemap,pe.bumpmap,pe.normalmap,pe.displacementmap,pe.fog,pe.lights,{emissive:{value:new ve(0)},envMapIntensity:{value:1}}]),vertexShader:qe.meshlambert_vert,fragmentShader:qe.meshlambert_frag},phong:{uniforms:jt([pe.common,pe.specularmap,pe.envmap,pe.aomap,pe.lightmap,pe.emissivemap,pe.bumpmap,pe.normalmap,pe.displacementmap,pe.fog,pe.lights,{emissive:{value:new ve(0)},specular:{value:new ve(1118481)},shininess:{value:30},envMapIntensity:{value:1}}]),vertexShader:qe.meshphong_vert,fragmentShader:qe.meshphong_frag},standard:{uniforms:jt([pe.common,pe.envmap,pe.aomap,pe.lightmap,pe.emissivemap,pe.bumpmap,pe.normalmap,pe.displacementmap,pe.roughnessmap,pe.metalnessmap,pe.fog,pe.lights,{emissive:{value:new ve(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:qe.meshphysical_vert,fragmentShader:qe.meshphysical_frag},toon:{uniforms:jt([pe.common,pe.aomap,pe.lightmap,pe.emissivemap,pe.bumpmap,pe.normalmap,pe.displacementmap,pe.gradientmap,pe.fog,pe.lights,{emissive:{value:new ve(0)}}]),vertexShader:qe.meshtoon_vert,fragmentShader:qe.meshtoon_frag},matcap:{uniforms:jt([pe.common,pe.bumpmap,pe.normalmap,pe.displacementmap,pe.fog,{matcap:{value:null}}]),vertexShader:qe.meshmatcap_vert,fragmentShader:qe.meshmatcap_frag},points:{uniforms:jt([pe.points,pe.fog]),vertexShader:qe.points_vert,fragmentShader:qe.points_frag},dashed:{uniforms:jt([pe.common,pe.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:qe.linedashed_vert,fragmentShader:qe.linedashed_frag},depth:{uniforms:jt([pe.common,pe.displacementmap]),vertexShader:qe.depth_vert,fragmentShader:qe.depth_frag},normal:{uniforms:jt([pe.common,pe.bumpmap,pe.normalmap,pe.displacementmap,{opacity:{value:1}}]),vertexShader:qe.meshnormal_vert,fragmentShader:qe.meshnormal_frag},sprite:{uniforms:jt([pe.sprite,pe.fog]),vertexShader:qe.sprite_vert,fragmentShader:qe.sprite_frag},background:{uniforms:{uvTransform:{value:new Ye},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:qe.background_vert,fragmentShader:qe.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new Ye}},vertexShader:qe.backgroundCube_vert,fragmentShader:qe.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:qe.cube_vert,fragmentShader:qe.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:qe.equirect_vert,fragmentShader:qe.equirect_frag},distance:{uniforms:jt([pe.common,pe.displacementmap,{referencePosition:{value:new P},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:qe.distance_vert,fragmentShader:qe.distance_frag},shadow:{uniforms:jt([pe.lights,pe.fog,{color:{value:new ve(0)},opacity:{value:1}}]),vertexShader:qe.shadow_vert,fragmentShader:qe.shadow_frag}};sn.physical={uniforms:jt([sn.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Ye},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Ye},clearcoatNormalScale:{value:new j(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Ye},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Ye},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Ye},sheen:{value:0},sheenColor:{value:new ve(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Ye},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Ye},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Ye},transmissionSamplerSize:{value:new j},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Ye},attenuationDistance:{value:0},attenuationColor:{value:new ve(0)},specularColor:{value:new ve(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Ye},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Ye},anisotropyVector:{value:new j},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Ye}}]),vertexShader:qe.meshphysical_vert,fragmentShader:qe.meshphysical_frag};const co={r:0,b:0,g:0},Hi=new On,MS=new Ke;function AS(i,e,t,n,s,r){const a=new ve(0);let o=s===!0?0:1,l,c,u=null,d=0,h=null;function f(S){let v=S.isScene===!0?S.background:null;if(v&&v.isTexture){const M=S.backgroundBlurriness>0;v=e.get(v,M)}return v}function p(S){let v=!1;const M=f(S);M===null?m(a,o):M&&M.isColor&&(m(M,1),v=!0);const T=i.xr.getEnvironmentBlendMode();T==="additive"?t.buffers.color.setClear(0,0,0,1,r):T==="alpha-blend"&&t.buffers.color.setClear(0,0,0,0,r),(i.autoClear||v)&&(t.buffers.depth.setTest(!0),t.buffers.depth.setMask(!0),t.buffers.color.setMask(!0),i.clear(i.autoClearColor,i.autoClearDepth,i.autoClearStencil))}function _(S,v){const M=f(v);M&&(M.isCubeTexture||M.mapping===fl)?(c===void 0&&(c=new ot(new Aa(1,1,1),new Vt({name:"BackgroundCubeMaterial",uniforms:er(sn.backgroundCube.uniforms),vertexShader:sn.backgroundCube.vertexShader,fragmentShader:sn.backgroundCube.fragmentShader,side:Qt,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),c.geometry.deleteAttribute("normal"),c.geometry.deleteAttribute("uv"),c.onBeforeRender=function(T,E,R){this.matrixWorld.copyPosition(R.matrixWorld)},Object.defineProperty(c.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),n.update(c)),Hi.copy(v.backgroundRotation),Hi.x*=-1,Hi.y*=-1,Hi.z*=-1,M.isCubeTexture&&M.isRenderTargetTexture===!1&&(Hi.y*=-1,Hi.z*=-1),c.material.uniforms.envMap.value=M,c.material.uniforms.flipEnvMap.value=M.isCubeTexture&&M.isRenderTargetTexture===!1?-1:1,c.material.uniforms.backgroundBlurriness.value=v.backgroundBlurriness,c.material.uniforms.backgroundIntensity.value=v.backgroundIntensity,c.material.uniforms.backgroundRotation.value.setFromMatrix4(MS.makeRotationFromEuler(Hi)),c.material.toneMapped=et.getTransfer(M.colorSpace)!==rt,(u!==M||d!==M.version||h!==i.toneMapping)&&(c.material.needsUpdate=!0,u=M,d=M.version,h=i.toneMapping),c.layers.enableAll(),S.unshift(c,c.geometry,c.material,0,0,null)):M&&M.isTexture&&(l===void 0&&(l=new ot(new Ni(2,2),new Vt({name:"BackgroundMaterial",uniforms:er(sn.background.uniforms),vertexShader:sn.background.vertexShader,fragmentShader:sn.background.fragmentShader,side:gi,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),l.geometry.deleteAttribute("normal"),Object.defineProperty(l.material,"map",{get:function(){return this.uniforms.t2D.value}}),n.update(l)),l.material.uniforms.t2D.value=M,l.material.uniforms.backgroundIntensity.value=v.backgroundIntensity,l.material.toneMapped=et.getTransfer(M.colorSpace)!==rt,M.matrixAutoUpdate===!0&&M.updateMatrix(),l.material.uniforms.uvTransform.value.copy(M.matrix),(u!==M||d!==M.version||h!==i.toneMapping)&&(l.material.needsUpdate=!0,u=M,d=M.version,h=i.toneMapping),l.layers.enableAll(),S.unshift(l,l.geometry,l.material,0,0,null))}function m(S,v){S.getRGB(co,em(i)),t.buffers.color.setClear(co.r,co.g,co.b,v,r)}function g(){c!==void 0&&(c.geometry.dispose(),c.material.dispose(),c=void 0),l!==void 0&&(l.geometry.dispose(),l.material.dispose(),l=void 0)}return{getClearColor:function(){return a},setClearColor:function(S,v=1){a.set(S),o=v,m(a,o)},getClearAlpha:function(){return o},setClearAlpha:function(S){o=S,m(a,o)},render:p,addToRenderList:_,dispose:g}}function bS(i,e){const t=i.getParameter(i.MAX_VERTEX_ATTRIBS),n={},s=h(null);let r=s,a=!1;function o(C,I,O,z,B){let H=!1;const k=d(C,z,O,I);r!==k&&(r=k,c(r.object)),H=f(C,z,O,B),H&&p(C,z,O,B),B!==null&&e.update(B,i.ELEMENT_ARRAY_BUFFER),(H||a)&&(a=!1,M(C,I,O,z),B!==null&&i.bindBuffer(i.ELEMENT_ARRAY_BUFFER,e.get(B).buffer))}function l(){return i.createVertexArray()}function c(C){return i.bindVertexArray(C)}function u(C){return i.deleteVertexArray(C)}function d(C,I,O,z){const B=z.wireframe===!0;let H=n[I.id];H===void 0&&(H={},n[I.id]=H);const k=C.isInstancedMesh===!0?C.id:0;let ie=H[k];ie===void 0&&(ie={},H[k]=ie);let G=ie[O.id];G===void 0&&(G={},ie[O.id]=G);let Z=G[B];return Z===void 0&&(Z=h(l()),G[B]=Z),Z}function h(C){const I=[],O=[],z=[];for(let B=0;B<t;B++)I[B]=0,O[B]=0,z[B]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:I,enabledAttributes:O,attributeDivisors:z,object:C,attributes:{},index:null}}function f(C,I,O,z){const B=r.attributes,H=I.attributes;let k=0;const ie=O.getAttributes();for(const G in ie)if(ie[G].location>=0){const J=B[G];let Q=H[G];if(Q===void 0&&(G==="instanceMatrix"&&C.instanceMatrix&&(Q=C.instanceMatrix),G==="instanceColor"&&C.instanceColor&&(Q=C.instanceColor)),J===void 0||J.attribute!==Q||Q&&J.data!==Q.data)return!0;k++}return r.attributesNum!==k||r.index!==z}function p(C,I,O,z){const B={},H=I.attributes;let k=0;const ie=O.getAttributes();for(const G in ie)if(ie[G].location>=0){let J=H[G];J===void 0&&(G==="instanceMatrix"&&C.instanceMatrix&&(J=C.instanceMatrix),G==="instanceColor"&&C.instanceColor&&(J=C.instanceColor));const Q={};Q.attribute=J,J&&J.data&&(Q.data=J.data),B[G]=Q,k++}r.attributes=B,r.attributesNum=k,r.index=z}function _(){const C=r.newAttributes;for(let I=0,O=C.length;I<O;I++)C[I]=0}function m(C){g(C,0)}function g(C,I){const O=r.newAttributes,z=r.enabledAttributes,B=r.attributeDivisors;O[C]=1,z[C]===0&&(i.enableVertexAttribArray(C),z[C]=1),B[C]!==I&&(i.vertexAttribDivisor(C,I),B[C]=I)}function S(){const C=r.newAttributes,I=r.enabledAttributes;for(let O=0,z=I.length;O<z;O++)I[O]!==C[O]&&(i.disableVertexAttribArray(O),I[O]=0)}function v(C,I,O,z,B,H,k){k===!0?i.vertexAttribIPointer(C,I,O,B,H):i.vertexAttribPointer(C,I,O,z,B,H)}function M(C,I,O,z){_();const B=z.attributes,H=O.getAttributes(),k=I.defaultAttributeValues;for(const ie in H){const G=H[ie];if(G.location>=0){let Z=B[ie];if(Z===void 0&&(ie==="instanceMatrix"&&C.instanceMatrix&&(Z=C.instanceMatrix),ie==="instanceColor"&&C.instanceColor&&(Z=C.instanceColor)),Z!==void 0){const J=Z.normalized,Q=Z.itemSize,Le=e.get(Z);if(Le===void 0)continue;const Qe=Le.buffer,tt=Le.type,$=Le.bytesPerElement,oe=tt===i.INT||tt===i.UNSIGNED_INT||Z.gpuType===ju;if(Z.isInterleavedBufferAttribute){const le=Z.data,Ue=le.stride,Pe=Z.offset;if(le.isInstancedInterleavedBuffer){for(let He=0;He<G.locationSize;He++)g(G.location+He,le.meshPerAttribute);C.isInstancedMesh!==!0&&z._maxInstanceCount===void 0&&(z._maxInstanceCount=le.meshPerAttribute*le.count)}else for(let He=0;He<G.locationSize;He++)m(G.location+He);i.bindBuffer(i.ARRAY_BUFFER,Qe);for(let He=0;He<G.locationSize;He++)v(G.location+He,Q/G.locationSize,tt,J,Ue*$,(Pe+Q/G.locationSize*He)*$,oe)}else{if(Z.isInstancedBufferAttribute){for(let le=0;le<G.locationSize;le++)g(G.location+le,Z.meshPerAttribute);C.isInstancedMesh!==!0&&z._maxInstanceCount===void 0&&(z._maxInstanceCount=Z.meshPerAttribute*Z.count)}else for(let le=0;le<G.locationSize;le++)m(G.location+le);i.bindBuffer(i.ARRAY_BUFFER,Qe);for(let le=0;le<G.locationSize;le++)v(G.location+le,Q/G.locationSize,tt,J,Q*$,Q/G.locationSize*le*$,oe)}}else if(k!==void 0){const J=k[ie];if(J!==void 0)switch(J.length){case 2:i.vertexAttrib2fv(G.location,J);break;case 3:i.vertexAttrib3fv(G.location,J);break;case 4:i.vertexAttrib4fv(G.location,J);break;default:i.vertexAttrib1fv(G.location,J)}}}}S()}function T(){A();for(const C in n){const I=n[C];for(const O in I){const z=I[O];for(const B in z){const H=z[B];for(const k in H)u(H[k].object),delete H[k];delete z[B]}}delete n[C]}}function E(C){if(n[C.id]===void 0)return;const I=n[C.id];for(const O in I){const z=I[O];for(const B in z){const H=z[B];for(const k in H)u(H[k].object),delete H[k];delete z[B]}}delete n[C.id]}function R(C){for(const I in n){const O=n[I];for(const z in O){const B=O[z];if(B[C.id]===void 0)continue;const H=B[C.id];for(const k in H)u(H[k].object),delete H[k];delete B[C.id]}}}function y(C){for(const I in n){const O=n[I],z=C.isInstancedMesh===!0?C.id:0,B=O[z];if(B!==void 0){for(const H in B){const k=B[H];for(const ie in k)u(k[ie].object),delete k[ie];delete B[H]}delete O[z],Object.keys(O).length===0&&delete n[I]}}}function A(){U(),a=!0,r!==s&&(r=s,c(r.object))}function U(){s.geometry=null,s.program=null,s.wireframe=!1}return{setup:o,reset:A,resetDefaultState:U,dispose:T,releaseStatesOfGeometry:E,releaseStatesOfObject:y,releaseStatesOfProgram:R,initAttributes:_,enableAttribute:m,disableUnusedAttributes:S}}function ES(i,e,t){let n;function s(c){n=c}function r(c,u){i.drawArrays(n,c,u),t.update(u,n,1)}function a(c,u,d){d!==0&&(i.drawArraysInstanced(n,c,u,d),t.update(u,n,d))}function o(c,u,d){if(d===0)return;e.get("WEBGL_multi_draw").multiDrawArraysWEBGL(n,c,0,u,0,d);let f=0;for(let p=0;p<d;p++)f+=u[p];t.update(f,n,1)}function l(c,u,d,h){if(d===0)return;const f=e.get("WEBGL_multi_draw");if(f===null)for(let p=0;p<c.length;p++)a(c[p],u[p],h[p]);else{f.multiDrawArraysInstancedWEBGL(n,c,0,u,0,h,0,d);let p=0;for(let _=0;_<d;_++)p+=u[_]*h[_];t.update(p,n,1)}}this.setMode=s,this.render=r,this.renderInstances=a,this.renderMultiDraw=o,this.renderMultiDrawInstances=l}function TS(i,e,t,n){let s;function r(){if(s!==void 0)return s;if(e.has("EXT_texture_filter_anisotropic")===!0){const R=e.get("EXT_texture_filter_anisotropic");s=i.getParameter(R.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else s=0;return s}function a(R){return!(R!==xn&&n.convert(R)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_FORMAT))}function o(R){const y=R===hn&&(e.has("EXT_color_buffer_half_float")||e.has("EXT_color_buffer_float"));return!(R!==cn&&n.convert(R)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_TYPE)&&R!==yn&&!y)}function l(R){if(R==="highp"){if(i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.HIGH_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.HIGH_FLOAT).precision>0)return"highp";R="mediump"}return R==="mediump"&&i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.MEDIUM_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let c=t.precision!==void 0?t.precision:"highp";const u=l(c);u!==c&&(Re("WebGLRenderer:",c,"not supported, using",u,"instead."),c=u);const d=t.logarithmicDepthBuffer===!0,h=t.reversedDepthBuffer===!0&&e.has("EXT_clip_control"),f=i.getParameter(i.MAX_TEXTURE_IMAGE_UNITS),p=i.getParameter(i.MAX_VERTEX_TEXTURE_IMAGE_UNITS),_=i.getParameter(i.MAX_TEXTURE_SIZE),m=i.getParameter(i.MAX_CUBE_MAP_TEXTURE_SIZE),g=i.getParameter(i.MAX_VERTEX_ATTRIBS),S=i.getParameter(i.MAX_VERTEX_UNIFORM_VECTORS),v=i.getParameter(i.MAX_VARYING_VECTORS),M=i.getParameter(i.MAX_FRAGMENT_UNIFORM_VECTORS),T=i.getParameter(i.MAX_SAMPLES),E=i.getParameter(i.SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:r,getMaxPrecision:l,textureFormatReadable:a,textureTypeReadable:o,precision:c,logarithmicDepthBuffer:d,reversedDepthBuffer:h,maxTextures:f,maxVertexTextures:p,maxTextureSize:_,maxCubemapSize:m,maxAttributes:g,maxVertexUniforms:S,maxVaryings:v,maxFragmentUniforms:M,maxSamples:T,samples:E}}function wS(i){const e=this;let t=null,n=0,s=!1,r=!1;const a=new Ci,o=new Ye,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(d,h){const f=d.length!==0||h||n!==0||s;return s=h,n=d.length,f},this.beginShadows=function(){r=!0,u(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(d,h){t=u(d,h,0)},this.setState=function(d,h,f){const p=d.clippingPlanes,_=d.clipIntersection,m=d.clipShadows,g=i.get(d);if(!s||p===null||p.length===0||r&&!m)r?u(null):c();else{const S=r?0:n,v=S*4;let M=g.clippingState||null;l.value=M,M=u(p,h,v,f);for(let T=0;T!==v;++T)M[T]=t[T];g.clippingState=M,this.numIntersection=_?this.numPlanes:0,this.numPlanes+=S}};function c(){l.value!==t&&(l.value=t,l.needsUpdate=n>0),e.numPlanes=n,e.numIntersection=0}function u(d,h,f,p){const _=d!==null?d.length:0;let m=null;if(_!==0){if(m=l.value,p!==!0||m===null){const g=f+_*4,S=h.matrixWorldInverse;o.getNormalMatrix(S),(m===null||m.length<g)&&(m=new Float32Array(g));for(let v=0,M=f;v!==_;++v,M+=4)a.copy(d[v]).applyMatrix4(S,o),a.normal.toArray(m,M),m[M+3]=a.constant}l.value=m,l.needsUpdate=!0}return e.numPlanes=_,e.numIntersection=0,m}}const Pi=4,ef=[.125,.215,.35,.446,.526,.582],Yi=20,CS=256,Rr=new Ea,tf=new ve;let lc=null,cc=0,uc=0,hc=!1;const RS=new P;class nf{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._sizeLods=[],this._sigmas=[],this._lodMeshes=[],this._backgroundBox=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._blurMaterial=null,this._ggxMaterial=null}fromScene(e,t=0,n=.1,s=100,r={}){const{size:a=256,position:o=RS}=r;lc=this._renderer.getRenderTarget(),cc=this._renderer.getActiveCubeFace(),uc=this._renderer.getActiveMipmapLevel(),hc=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(a);const l=this._allocateTargets();return l.depthBuffer=!0,this._sceneToCubeUV(e,n,s,l,o),t>0&&this._blur(l,0,0,t),this._applyPMREM(l),this._cleanup(l),l}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=af(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=rf(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose(),this._backgroundBox!==null&&(this._backgroundBox.geometry.dispose(),this._backgroundBox.material.dispose())}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._ggxMaterial!==null&&this._ggxMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodMeshes.length;e++)this._lodMeshes[e].geometry.dispose()}_cleanup(e){this._renderer.setRenderTarget(lc,cc,uc),this._renderer.xr.enabled=hc,e.scissorTest=!1,Ls(e,0,0,e.width,e.height)}_fromTexture(e,t){e.mapping===Ji||e.mapping===qs?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),lc=this._renderer.getRenderTarget(),cc=this._renderer.getActiveCubeFace(),uc=this._renderer.getActiveMipmapLevel(),hc=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const n=t||this._allocateTargets();return this._textureToCubeUV(e,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){const e=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,n={magFilter:yt,minFilter:yt,generateMipmaps:!1,type:hn,format:xn,colorSpace:en,depthBuffer:!1},s=sf(e,t,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=sf(e,t,n);const{_lodMax:r}=this;({lodMeshes:this._lodMeshes,sizeLods:this._sizeLods,sigmas:this._sigmas}=LS(r)),this._blurMaterial=IS(r,e,t),this._ggxMaterial=PS(r,e,t)}return s}_compileMaterial(e){const t=new ot(new nt,e);this._renderer.compile(t,Rr)}_sceneToCubeUV(e,t,n,s,r){const l=new Zt(90,1,t,n),c=[1,-1,1,1,1,1],u=[1,1,1,-1,-1,-1],d=this._renderer,h=d.autoClear,f=d.toneMapping;d.getClearColor(tf),d.toneMapping=jn,d.autoClear=!1,d.state.buffers.depth.getReversed()&&(d.setRenderTarget(s),d.clearDepth(),d.setRenderTarget(null)),this._backgroundBox===null&&(this._backgroundBox=new ot(new Aa,new Mt({name:"PMREM.Background",side:Qt,depthWrite:!1,depthTest:!1})));const _=this._backgroundBox,m=_.material;let g=!1;const S=e.background;S?S.isColor&&(m.color.copy(S),e.background=null,g=!0):(m.color.copy(tf),g=!0);for(let v=0;v<6;v++){const M=v%3;M===0?(l.up.set(0,c[v],0),l.position.set(r.x,r.y,r.z),l.lookAt(r.x+u[v],r.y,r.z)):M===1?(l.up.set(0,0,c[v]),l.position.set(r.x,r.y,r.z),l.lookAt(r.x,r.y+u[v],r.z)):(l.up.set(0,c[v],0),l.position.set(r.x,r.y,r.z),l.lookAt(r.x,r.y,r.z+u[v]));const T=this._cubeSize;Ls(s,M*T,v>2?T:0,T,T),d.setRenderTarget(s),g&&d.render(_,l),d.render(e,l)}d.toneMapping=f,d.autoClear=h,e.background=S}_textureToCubeUV(e,t){const n=this._renderer,s=e.mapping===Ji||e.mapping===qs;s?(this._cubemapMaterial===null&&(this._cubemapMaterial=af()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=rf());const r=s?this._cubemapMaterial:this._equirectMaterial,a=this._lodMeshes[0];a.material=r;const o=r.uniforms;o.envMap.value=e;const l=this._cubeSize;Ls(t,0,0,3*l,2*l),n.setRenderTarget(t),n.render(a,Rr)}_applyPMREM(e){const t=this._renderer,n=t.autoClear;t.autoClear=!1;const s=this._lodMeshes.length;for(let r=1;r<s;r++)this._applyGGXFilter(e,r-1,r);t.autoClear=n}_applyGGXFilter(e,t,n){const s=this._renderer,r=this._pingPongRenderTarget,a=this._ggxMaterial,o=this._lodMeshes[n];o.material=a;const l=a.uniforms,c=n/(this._lodMeshes.length-1),u=t/(this._lodMeshes.length-1),d=Math.sqrt(c*c-u*u),h=0+c*1.25,f=d*h,{_lodMax:p}=this,_=this._sizeLods[n],m=3*_*(n>p-Pi?n-p+Pi:0),g=4*(this._cubeSize-_);l.envMap.value=e.texture,l.roughness.value=f,l.mipInt.value=p-t,Ls(r,m,g,3*_,2*_),s.setRenderTarget(r),s.render(o,Rr),l.envMap.value=r.texture,l.roughness.value=0,l.mipInt.value=p-n,Ls(e,m,g,3*_,2*_),s.setRenderTarget(e),s.render(o,Rr)}_blur(e,t,n,s,r){const a=this._pingPongRenderTarget;this._halfBlur(e,a,t,n,s,"latitudinal",r),this._halfBlur(a,e,n,n,s,"longitudinal",r)}_halfBlur(e,t,n,s,r,a,o){const l=this._renderer,c=this._blurMaterial;a!=="latitudinal"&&a!=="longitudinal"&&ze("blur direction must be either latitudinal or longitudinal!");const u=3,d=this._lodMeshes[s];d.material=c;const h=c.uniforms,f=this._sizeLods[n]-1,p=isFinite(r)?Math.PI/(2*f):2*Math.PI/(2*Yi-1),_=r/p,m=isFinite(r)?1+Math.floor(u*_):Yi;m>Yi&&Re(`sigmaRadians, ${r}, is too large and will clip, as it requested ${m} samples when the maximum is set to ${Yi}`);const g=[];let S=0;for(let R=0;R<Yi;++R){const y=R/_,A=Math.exp(-y*y/2);g.push(A),R===0?S+=A:R<m&&(S+=2*A)}for(let R=0;R<g.length;R++)g[R]=g[R]/S;h.envMap.value=e.texture,h.samples.value=m,h.weights.value=g,h.latitudinal.value=a==="latitudinal",o&&(h.poleAxis.value=o);const{_lodMax:v}=this;h.dTheta.value=p,h.mipInt.value=v-n;const M=this._sizeLods[s],T=3*M*(s>v-Pi?s-v+Pi:0),E=4*(this._cubeSize-M);Ls(t,T,E,3*M,2*M),l.setRenderTarget(t),l.render(d,Rr)}}function LS(i){const e=[],t=[],n=[];let s=i;const r=i-Pi+1+ef.length;for(let a=0;a<r;a++){const o=Math.pow(2,s);e.push(o);let l=1/o;a>i-Pi?l=ef[a-i+Pi-1]:a===0&&(l=0),t.push(l);const c=1/(o-2),u=-c,d=1+c,h=[u,u,d,u,d,d,u,u,d,d,u,d],f=6,p=6,_=3,m=2,g=1,S=new Float32Array(_*p*f),v=new Float32Array(m*p*f),M=new Float32Array(g*p*f);for(let E=0;E<f;E++){const R=E%3*2/3-1,y=E>2?0:-1,A=[R,y,0,R+2/3,y,0,R+2/3,y+1,0,R,y,0,R+2/3,y+1,0,R,y+1,0];S.set(A,_*p*E),v.set(h,m*p*E);const U=[E,E,E,E,E,E];M.set(U,g*p*E)}const T=new nt;T.setAttribute("position",new $t(S,_)),T.setAttribute("uv",new $t(v,m)),T.setAttribute("faceIndex",new $t(M,g)),n.push(new ot(T,null)),s>Pi&&s--}return{lodMeshes:n,sizeLods:e,sigmas:t}}function sf(i,e,t){const n=new rn(i,e,t);return n.texture.mapping=fl,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function Ls(i,e,t,n,s){i.viewport.set(e,t,n,s),i.scissor.set(e,t,n,s)}function PS(i,e,t){return new Vt({name:"PMREMGGXConvolution",defines:{GGX_SAMPLES:CS,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${i}.0`},uniforms:{envMap:{value:null},roughness:{value:0},mipInt:{value:0}},vertexShader:_l(),fragmentShader:`

			precision highp float;
			precision highp int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform float roughness;
			uniform float mipInt;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			#define PI 3.14159265359

			// Van der Corput radical inverse
			float radicalInverse_VdC(uint bits) {
				bits = (bits << 16u) | (bits >> 16u);
				bits = ((bits & 0x55555555u) << 1u) | ((bits & 0xAAAAAAAAu) >> 1u);
				bits = ((bits & 0x33333333u) << 2u) | ((bits & 0xCCCCCCCCu) >> 2u);
				bits = ((bits & 0x0F0F0F0Fu) << 4u) | ((bits & 0xF0F0F0F0u) >> 4u);
				bits = ((bits & 0x00FF00FFu) << 8u) | ((bits & 0xFF00FF00u) >> 8u);
				return float(bits) * 2.3283064365386963e-10; // / 0x100000000
			}

			// Hammersley sequence
			vec2 hammersley(uint i, uint N) {
				return vec2(float(i) / float(N), radicalInverse_VdC(i));
			}

			// GGX VNDF importance sampling (Eric Heitz 2018)
			// "Sampling the GGX Distribution of Visible Normals"
			// https://jcgt.org/published/0007/04/01/
			vec3 importanceSampleGGX_VNDF(vec2 Xi, vec3 V, float roughness) {
				float alpha = roughness * roughness;

				// Section 4.1: Orthonormal basis
				vec3 T1 = vec3(1.0, 0.0, 0.0);
				vec3 T2 = cross(V, T1);

				// Section 4.2: Parameterization of projected area
				float r = sqrt(Xi.x);
				float phi = 2.0 * PI * Xi.y;
				float t1 = r * cos(phi);
				float t2 = r * sin(phi);
				float s = 0.5 * (1.0 + V.z);
				t2 = (1.0 - s) * sqrt(1.0 - t1 * t1) + s * t2;

				// Section 4.3: Reprojection onto hemisphere
				vec3 Nh = t1 * T1 + t2 * T2 + sqrt(max(0.0, 1.0 - t1 * t1 - t2 * t2)) * V;

				// Section 3.4: Transform back to ellipsoid configuration
				return normalize(vec3(alpha * Nh.x, alpha * Nh.y, max(0.0, Nh.z)));
			}

			void main() {
				vec3 N = normalize(vOutputDirection);
				vec3 V = N; // Assume view direction equals normal for pre-filtering

				vec3 prefilteredColor = vec3(0.0);
				float totalWeight = 0.0;

				// For very low roughness, just sample the environment directly
				if (roughness < 0.001) {
					gl_FragColor = vec4(bilinearCubeUV(envMap, N, mipInt), 1.0);
					return;
				}

				// Tangent space basis for VNDF sampling
				vec3 up = abs(N.z) < 0.999 ? vec3(0.0, 0.0, 1.0) : vec3(1.0, 0.0, 0.0);
				vec3 tangent = normalize(cross(up, N));
				vec3 bitangent = cross(N, tangent);

				for(uint i = 0u; i < uint(GGX_SAMPLES); i++) {
					vec2 Xi = hammersley(i, uint(GGX_SAMPLES));

					// For PMREM, V = N, so in tangent space V is always (0, 0, 1)
					vec3 H_tangent = importanceSampleGGX_VNDF(Xi, vec3(0.0, 0.0, 1.0), roughness);

					// Transform H back to world space
					vec3 H = normalize(tangent * H_tangent.x + bitangent * H_tangent.y + N * H_tangent.z);
					vec3 L = normalize(2.0 * dot(V, H) * H - V);

					float NdotL = max(dot(N, L), 0.0);

					if(NdotL > 0.0) {
						// Sample environment at fixed mip level
						// VNDF importance sampling handles the distribution filtering
						vec3 sampleColor = bilinearCubeUV(envMap, L, mipInt);

						// Weight by NdotL for the split-sum approximation
						// VNDF PDF naturally accounts for the visible microfacet distribution
						prefilteredColor += sampleColor * NdotL;
						totalWeight += NdotL;
					}
				}

				if (totalWeight > 0.0) {
					prefilteredColor = prefilteredColor / totalWeight;
				}

				gl_FragColor = vec4(prefilteredColor, 1.0);
			}
		`,blending:Jn,depthTest:!1,depthWrite:!1})}function IS(i,e,t){const n=new Float32Array(Yi),s=new P(0,1,0);return new Vt({name:"SphericalGaussianBlur",defines:{n:Yi,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${i}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:n},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:s}},vertexShader:_l(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform int samples;
			uniform float weights[ n ];
			uniform bool latitudinal;
			uniform float dTheta;
			uniform float mipInt;
			uniform vec3 poleAxis;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			vec3 getSample( float theta, vec3 axis ) {

				float cosTheta = cos( theta );
				// Rodrigues' axis-angle rotation
				vec3 sampleDirection = vOutputDirection * cosTheta
					+ cross( axis, vOutputDirection ) * sin( theta )
					+ axis * dot( axis, vOutputDirection ) * ( 1.0 - cosTheta );

				return bilinearCubeUV( envMap, sampleDirection, mipInt );

			}

			void main() {

				vec3 axis = latitudinal ? poleAxis : cross( poleAxis, vOutputDirection );

				if ( all( equal( axis, vec3( 0.0 ) ) ) ) {

					axis = vec3( vOutputDirection.z, 0.0, - vOutputDirection.x );

				}

				axis = normalize( axis );

				gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );
				gl_FragColor.rgb += weights[ 0 ] * getSample( 0.0, axis );

				for ( int i = 1; i < n; i++ ) {

					if ( i >= samples ) {

						break;

					}

					float theta = dTheta * float( i );
					gl_FragColor.rgb += weights[ i ] * getSample( -1.0 * theta, axis );
					gl_FragColor.rgb += weights[ i ] * getSample( theta, axis );

				}

			}
		`,blending:Jn,depthTest:!1,depthWrite:!1})}function rf(){return new Vt({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:_l(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,blending:Jn,depthTest:!1,depthWrite:!1})}function af(){return new Vt({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:_l(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:Jn,depthTest:!1,depthWrite:!1})}function _l(){return`

		precision mediump float;
		precision mediump int;

		attribute float faceIndex;

		varying vec3 vOutputDirection;

		// RH coordinate system; PMREM face-indexing convention
		vec3 getDirection( vec2 uv, float face ) {

			uv = 2.0 * uv - 1.0;

			vec3 direction = vec3( uv, 1.0 );

			if ( face == 0.0 ) {

				direction = direction.zyx; // ( 1, v, u ) pos x

			} else if ( face == 1.0 ) {

				direction = direction.xzy;
				direction.xz *= -1.0; // ( -u, 1, -v ) pos y

			} else if ( face == 2.0 ) {

				direction.x *= -1.0; // ( -u, v, 1 ) pos z

			} else if ( face == 3.0 ) {

				direction = direction.zyx;
				direction.xz *= -1.0; // ( -1, v, -u ) neg x

			} else if ( face == 4.0 ) {

				direction = direction.xzy;
				direction.xy *= -1.0; // ( -u, -1, v ) neg y

			} else if ( face == 5.0 ) {

				direction.z *= -1.0; // ( u, v, -1 ) neg z

			}

			return direction;

		}

		void main() {

			vOutputDirection = getDirection( uv, faceIndex );
			gl_Position = vec4( position, 1.0 );

		}
	`}class lm extends rn{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;const n={width:e,height:e,depth:1},s=[n,n,n,n,n,n];this.texture=new Wp(s),this._setTextureOptions(t),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;const n={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},s=new Aa(5,5,5),r=new Vt({name:"CubemapFromEquirect",uniforms:er(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:Qt,blending:Jn});r.uniforms.tEquirect.value=t;const a=new ot(s,r),o=t.minFilter;return t.minFilter===Pn&&(t.minFilter=yt),new Sy(1,10,this).update(e,a),t.minFilter=o,a.geometry.dispose(),a.material.dispose(),this}clear(e,t=!0,n=!0,s=!0){const r=e.getRenderTarget();for(let a=0;a<6;a++)e.setRenderTarget(this,a),e.clear(t,n,s);e.setRenderTarget(r)}}function DS(i){let e=new WeakMap,t=new WeakMap,n=null;function s(h,f=!1){return h==null?null:f?a(h):r(h)}function r(h){if(h&&h.isTexture){const f=h.mapping;if(f===wl||f===Cl)if(e.has(h)){const p=e.get(h).texture;return o(p,h.mapping)}else{const p=h.image;if(p&&p.height>0){const _=new lm(p.height);return _.fromEquirectangularTexture(i,h),e.set(h,_),h.addEventListener("dispose",c),o(_.texture,h.mapping)}else return null}}return h}function a(h){if(h&&h.isTexture){const f=h.mapping,p=f===wl||f===Cl,_=f===Ji||f===qs;if(p||_){let m=t.get(h);const g=m!==void 0?m.texture.pmremVersion:0;if(h.isRenderTargetTexture&&h.pmremVersion!==g)return n===null&&(n=new nf(i)),m=p?n.fromEquirectangular(h,m):n.fromCubemap(h,m),m.texture.pmremVersion=h.pmremVersion,t.set(h,m),m.texture;if(m!==void 0)return m.texture;{const S=h.image;return p&&S&&S.height>0||_&&S&&l(S)?(n===null&&(n=new nf(i)),m=p?n.fromEquirectangular(h):n.fromCubemap(h),m.texture.pmremVersion=h.pmremVersion,t.set(h,m),h.addEventListener("dispose",u),m.texture):null}}}return h}function o(h,f){return f===wl?h.mapping=Ji:f===Cl&&(h.mapping=qs),h}function l(h){let f=0;const p=6;for(let _=0;_<p;_++)h[_]!==void 0&&f++;return f===p}function c(h){const f=h.target;f.removeEventListener("dispose",c);const p=e.get(f);p!==void 0&&(e.delete(f),p.dispose())}function u(h){const f=h.target;f.removeEventListener("dispose",u);const p=t.get(f);p!==void 0&&(t.delete(f),p.dispose())}function d(){e=new WeakMap,t=new WeakMap,n!==null&&(n.dispose(),n=null)}return{get:s,dispose:d}}function NS(i){const e={};function t(n){if(e[n]!==void 0)return e[n];const s=i.getExtension(n);return e[n]=s,s}return{has:function(n){return t(n)!==null},init:function(){t("EXT_color_buffer_float"),t("WEBGL_clip_cull_distance"),t("OES_texture_float_linear"),t("EXT_color_buffer_half_float"),t("WEBGL_multisampled_render_to_texture"),t("WEBGL_render_shared_exponent")},get:function(n){const s=t(n);return s===null&&tl("WebGLRenderer: "+n+" extension not supported."),s}}}function US(i,e,t,n){const s={},r=new WeakMap;function a(d){const h=d.target;h.index!==null&&e.remove(h.index);for(const p in h.attributes)e.remove(h.attributes[p]);h.removeEventListener("dispose",a),delete s[h.id];const f=r.get(h);f&&(e.remove(f),r.delete(h)),n.releaseStatesOfGeometry(h),h.isInstancedBufferGeometry===!0&&delete h._maxInstanceCount,t.memory.geometries--}function o(d,h){return s[h.id]===!0||(h.addEventListener("dispose",a),s[h.id]=!0,t.memory.geometries++),h}function l(d){const h=d.attributes;for(const f in h)e.update(h[f],i.ARRAY_BUFFER)}function c(d){const h=[],f=d.index,p=d.attributes.position;let _=0;if(p===void 0)return;if(f!==null){const S=f.array;_=f.version;for(let v=0,M=S.length;v<M;v+=3){const T=S[v+0],E=S[v+1],R=S[v+2];h.push(T,E,E,R,R,T)}}else{const S=p.array;_=p.version;for(let v=0,M=S.length/3-1;v<M;v+=3){const T=v+0,E=v+1,R=v+2;h.push(T,E,E,R,R,T)}}const m=new(p.count>=65535?Hp:kp)(h,1);m.version=_;const g=r.get(d);g&&e.remove(g),r.set(d,m)}function u(d){const h=r.get(d);if(h){const f=d.index;f!==null&&h.version<f.version&&c(d)}else c(d);return r.get(d)}return{get:o,update:l,getWireframeAttribute:u}}function OS(i,e,t){let n;function s(h){n=h}let r,a;function o(h){r=h.type,a=h.bytesPerElement}function l(h,f){i.drawElements(n,f,r,h*a),t.update(f,n,1)}function c(h,f,p){p!==0&&(i.drawElementsInstanced(n,f,r,h*a,p),t.update(f,n,p))}function u(h,f,p){if(p===0)return;e.get("WEBGL_multi_draw").multiDrawElementsWEBGL(n,f,0,r,h,0,p);let m=0;for(let g=0;g<p;g++)m+=f[g];t.update(m,n,1)}function d(h,f,p,_){if(p===0)return;const m=e.get("WEBGL_multi_draw");if(m===null)for(let g=0;g<h.length;g++)c(h[g]/a,f[g],_[g]);else{m.multiDrawElementsInstancedWEBGL(n,f,0,r,h,0,_,0,p);let g=0;for(let S=0;S<p;S++)g+=f[S]*_[S];t.update(g,n,1)}}this.setMode=s,this.setIndex=o,this.render=l,this.renderInstances=c,this.renderMultiDraw=u,this.renderMultiDrawInstances=d}function BS(i){const e={geometries:0,textures:0},t={frame:0,calls:0,triangles:0,points:0,lines:0};function n(r,a,o){switch(t.calls++,a){case i.TRIANGLES:t.triangles+=o*(r/3);break;case i.LINES:t.lines+=o*(r/2);break;case i.LINE_STRIP:t.lines+=o*(r-1);break;case i.LINE_LOOP:t.lines+=o*r;break;case i.POINTS:t.points+=o*r;break;default:ze("WebGLInfo: Unknown draw mode:",a);break}}function s(){t.calls=0,t.triangles=0,t.points=0,t.lines=0}return{memory:e,render:t,programs:null,autoReset:!0,reset:s,update:n}}function FS(i,e,t){const n=new WeakMap,s=new at;function r(a,o,l){const c=a.morphTargetInfluences,u=o.morphAttributes.position||o.morphAttributes.normal||o.morphAttributes.color,d=u!==void 0?u.length:0;let h=n.get(o);if(h===void 0||h.count!==d){let U=function(){y.dispose(),n.delete(o),o.removeEventListener("dispose",U)};var f=U;h!==void 0&&h.texture.dispose();const p=o.morphAttributes.position!==void 0,_=o.morphAttributes.normal!==void 0,m=o.morphAttributes.color!==void 0,g=o.morphAttributes.position||[],S=o.morphAttributes.normal||[],v=o.morphAttributes.color||[];let M=0;p===!0&&(M=1),_===!0&&(M=2),m===!0&&(M=3);let T=o.attributes.position.count*M,E=1;T>e.maxTextureSize&&(E=Math.ceil(T/e.maxTextureSize),T=e.maxTextureSize);const R=new Float32Array(T*E*4*d),y=new Fp(R,T,E,d);y.type=yn,y.needsUpdate=!0;const A=M*4;for(let C=0;C<d;C++){const I=g[C],O=S[C],z=v[C],B=T*E*4*C;for(let H=0;H<I.count;H++){const k=H*A;p===!0&&(s.fromBufferAttribute(I,H),R[B+k+0]=s.x,R[B+k+1]=s.y,R[B+k+2]=s.z,R[B+k+3]=0),_===!0&&(s.fromBufferAttribute(O,H),R[B+k+4]=s.x,R[B+k+5]=s.y,R[B+k+6]=s.z,R[B+k+7]=0),m===!0&&(s.fromBufferAttribute(z,H),R[B+k+8]=s.x,R[B+k+9]=s.y,R[B+k+10]=s.z,R[B+k+11]=z.itemSize===4?s.w:1)}}h={count:d,texture:y,size:new j(T,E)},n.set(o,h),o.addEventListener("dispose",U)}if(a.isInstancedMesh===!0&&a.morphTexture!==null)l.getUniforms().setValue(i,"morphTexture",a.morphTexture,t);else{let p=0;for(let m=0;m<c.length;m++)p+=c[m];const _=o.morphTargetsRelative?1:1-p;l.getUniforms().setValue(i,"morphTargetBaseInfluence",_),l.getUniforms().setValue(i,"morphTargetInfluences",c)}l.getUniforms().setValue(i,"morphTargetsTexture",h.texture,t),l.getUniforms().setValue(i,"morphTargetsTextureSize",h.size)}return{update:r}}function zS(i,e,t,n,s){let r=new WeakMap;function a(c){const u=s.render.frame,d=c.geometry,h=e.get(c,d);if(r.get(h)!==u&&(e.update(h),r.set(h,u)),c.isInstancedMesh&&(c.hasEventListener("dispose",l)===!1&&c.addEventListener("dispose",l),r.get(c)!==u&&(t.update(c.instanceMatrix,i.ARRAY_BUFFER),c.instanceColor!==null&&t.update(c.instanceColor,i.ARRAY_BUFFER),r.set(c,u))),c.isSkinnedMesh){const f=c.skeleton;r.get(f)!==u&&(f.update(),r.set(f,u))}return h}function o(){r=new WeakMap}function l(c){const u=c.target;u.removeEventListener("dispose",l),n.releaseStatesOfObject(u),t.remove(u.instanceMatrix),u.instanceColor!==null&&t.remove(u.instanceColor)}return{update:a,dispose:o}}const kS={[Ku]:"LINEAR_TONE_MAPPING",[Xu]:"REINHARD_TONE_MAPPING",[Yu]:"CINEON_TONE_MAPPING",[dl]:"ACES_FILMIC_TONE_MAPPING",[$u]:"AGX_TONE_MAPPING",[Ju]:"NEUTRAL_TONE_MAPPING",[qu]:"CUSTOM_TONE_MAPPING"};function HS(i,e,t,n,s){const r=new rn(e,t,{type:i,depthBuffer:n,stencilBuffer:s}),a=new rn(e,t,{type:hn,depthBuffer:!1,stencilBuffer:!1}),o=new nt;o.setAttribute("position",new ke([-1,3,0,-1,-1,0,3,-1,0],3)),o.setAttribute("uv",new ke([0,2,0,0,2,0],2));const l=new tm({uniforms:{tDiffuse:{value:null}},vertexShader:`
			precision highp float;

			uniform mat4 modelViewMatrix;
			uniform mat4 projectionMatrix;

			attribute vec3 position;
			attribute vec2 uv;

			varying vec2 vUv;

			void main() {
				vUv = uv;
				gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
			}`,fragmentShader:`
			precision highp float;

			uniform sampler2D tDiffuse;

			varying vec2 vUv;

			#include <tonemapping_pars_fragment>
			#include <colorspace_pars_fragment>

			void main() {
				gl_FragColor = texture2D( tDiffuse, vUv );

				#ifdef LINEAR_TONE_MAPPING
					gl_FragColor.rgb = LinearToneMapping( gl_FragColor.rgb );
				#elif defined( REINHARD_TONE_MAPPING )
					gl_FragColor.rgb = ReinhardToneMapping( gl_FragColor.rgb );
				#elif defined( CINEON_TONE_MAPPING )
					gl_FragColor.rgb = CineonToneMapping( gl_FragColor.rgb );
				#elif defined( ACES_FILMIC_TONE_MAPPING )
					gl_FragColor.rgb = ACESFilmicToneMapping( gl_FragColor.rgb );
				#elif defined( AGX_TONE_MAPPING )
					gl_FragColor.rgb = AgXToneMapping( gl_FragColor.rgb );
				#elif defined( NEUTRAL_TONE_MAPPING )
					gl_FragColor.rgb = NeutralToneMapping( gl_FragColor.rgb );
				#elif defined( CUSTOM_TONE_MAPPING )
					gl_FragColor.rgb = CustomToneMapping( gl_FragColor.rgb );
				#endif

				#ifdef SRGB_TRANSFER
					gl_FragColor = sRGBTransferOETF( gl_FragColor );
				#endif
			}`,depthTest:!1,depthWrite:!1}),c=new ot(o,l),u=new Ea(-1,1,1,-1,0,1);let d=null,h=null,f=!1,p,_=null,m=[],g=!1;this.setSize=function(S,v){r.setSize(S,v),a.setSize(S,v);for(let M=0;M<m.length;M++){const T=m[M];T.setSize&&T.setSize(S,v)}},this.setEffects=function(S){m=S,g=m.length>0&&m[0].isRenderPass===!0;const v=r.width,M=r.height;for(let T=0;T<m.length;T++){const E=m[T];E.setSize&&E.setSize(v,M)}},this.begin=function(S,v){if(f||S.toneMapping===jn&&m.length===0)return!1;if(_=v,v!==null){const M=v.width,T=v.height;(r.width!==M||r.height!==T)&&this.setSize(M,T)}return g===!1&&S.setRenderTarget(r),p=S.toneMapping,S.toneMapping=jn,!0},this.hasRenderPass=function(){return g},this.end=function(S,v){S.toneMapping=p,f=!0;let M=r,T=a;for(let E=0;E<m.length;E++){const R=m[E];if(R.enabled!==!1&&(R.render(S,T,M,v),R.needsSwap!==!1)){const y=M;M=T,T=y}}if(d!==S.outputColorSpace||h!==S.toneMapping){d=S.outputColorSpace,h=S.toneMapping,l.defines={},et.getTransfer(d)===rt&&(l.defines.SRGB_TRANSFER="");const E=kS[h];E&&(l.defines[E]=""),l.needsUpdate=!0}l.uniforms.tDiffuse.value=M.texture,S.setRenderTarget(_),S.render(c,u),_=null,f=!1},this.isCompositing=function(){return f},this.dispose=function(){r.dispose(),a.dispose(),o.dispose(),l.dispose()}}const cm=new Rt,wu=new da(1,1),um=new Fp,hm=new G0,dm=new Wp,of=[],lf=[],cf=new Float32Array(16),uf=new Float32Array(9),hf=new Float32Array(4);function mr(i,e,t){const n=i[0];if(n<=0||n>0)return i;const s=e*t;let r=of[s];if(r===void 0&&(r=new Float32Array(s),of[s]=r),e!==0){n.toArray(r,0);for(let a=1,o=0;a!==e;++a)o+=t,i[a].toArray(r,o)}return r}function Pt(i,e){if(i.length!==e.length)return!1;for(let t=0,n=i.length;t<n;t++)if(i[t]!==e[t])return!1;return!0}function It(i,e){for(let t=0,n=e.length;t<n;t++)i[t]=e[t]}function yl(i,e){let t=lf[e];t===void 0&&(t=new Int32Array(e),lf[e]=t);for(let n=0;n!==e;++n)t[n]=i.allocateTextureUnit();return t}function GS(i,e){const t=this.cache;t[0]!==e&&(i.uniform1f(this.addr,e),t[0]=e)}function VS(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2f(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Pt(t,e))return;i.uniform2fv(this.addr,e),It(t,e)}}function WS(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3f(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else if(e.r!==void 0)(t[0]!==e.r||t[1]!==e.g||t[2]!==e.b)&&(i.uniform3f(this.addr,e.r,e.g,e.b),t[0]=e.r,t[1]=e.g,t[2]=e.b);else{if(Pt(t,e))return;i.uniform3fv(this.addr,e),It(t,e)}}function KS(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4f(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Pt(t,e))return;i.uniform4fv(this.addr,e),It(t,e)}}function XS(i,e){const t=this.cache,n=e.elements;if(n===void 0){if(Pt(t,e))return;i.uniformMatrix2fv(this.addr,!1,e),It(t,e)}else{if(Pt(t,n))return;hf.set(n),i.uniformMatrix2fv(this.addr,!1,hf),It(t,n)}}function YS(i,e){const t=this.cache,n=e.elements;if(n===void 0){if(Pt(t,e))return;i.uniformMatrix3fv(this.addr,!1,e),It(t,e)}else{if(Pt(t,n))return;uf.set(n),i.uniformMatrix3fv(this.addr,!1,uf),It(t,n)}}function qS(i,e){const t=this.cache,n=e.elements;if(n===void 0){if(Pt(t,e))return;i.uniformMatrix4fv(this.addr,!1,e),It(t,e)}else{if(Pt(t,n))return;cf.set(n),i.uniformMatrix4fv(this.addr,!1,cf),It(t,n)}}function $S(i,e){const t=this.cache;t[0]!==e&&(i.uniform1i(this.addr,e),t[0]=e)}function JS(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2i(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Pt(t,e))return;i.uniform2iv(this.addr,e),It(t,e)}}function jS(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3i(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(Pt(t,e))return;i.uniform3iv(this.addr,e),It(t,e)}}function ZS(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4i(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Pt(t,e))return;i.uniform4iv(this.addr,e),It(t,e)}}function QS(i,e){const t=this.cache;t[0]!==e&&(i.uniform1ui(this.addr,e),t[0]=e)}function eM(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2ui(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Pt(t,e))return;i.uniform2uiv(this.addr,e),It(t,e)}}function tM(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3ui(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(Pt(t,e))return;i.uniform3uiv(this.addr,e),It(t,e)}}function nM(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4ui(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Pt(t,e))return;i.uniform4uiv(this.addr,e),It(t,e)}}function iM(i,e,t){const n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s);let r;this.type===i.SAMPLER_2D_SHADOW?(wu.compareFunction=t.isReversedDepthBuffer()?ah:rh,r=wu):r=cm,t.setTexture2D(e||r,s)}function sM(i,e,t){const n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),t.setTexture3D(e||hm,s)}function rM(i,e,t){const n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),t.setTextureCube(e||dm,s)}function aM(i,e,t){const n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),t.setTexture2DArray(e||um,s)}function oM(i){switch(i){case 5126:return GS;case 35664:return VS;case 35665:return WS;case 35666:return KS;case 35674:return XS;case 35675:return YS;case 35676:return qS;case 5124:case 35670:return $S;case 35667:case 35671:return JS;case 35668:case 35672:return jS;case 35669:case 35673:return ZS;case 5125:return QS;case 36294:return eM;case 36295:return tM;case 36296:return nM;case 35678:case 36198:case 36298:case 36306:case 35682:return iM;case 35679:case 36299:case 36307:return sM;case 35680:case 36300:case 36308:case 36293:return rM;case 36289:case 36303:case 36311:case 36292:return aM}}function lM(i,e){i.uniform1fv(this.addr,e)}function cM(i,e){const t=mr(e,this.size,2);i.uniform2fv(this.addr,t)}function uM(i,e){const t=mr(e,this.size,3);i.uniform3fv(this.addr,t)}function hM(i,e){const t=mr(e,this.size,4);i.uniform4fv(this.addr,t)}function dM(i,e){const t=mr(e,this.size,4);i.uniformMatrix2fv(this.addr,!1,t)}function fM(i,e){const t=mr(e,this.size,9);i.uniformMatrix3fv(this.addr,!1,t)}function pM(i,e){const t=mr(e,this.size,16);i.uniformMatrix4fv(this.addr,!1,t)}function mM(i,e){i.uniform1iv(this.addr,e)}function gM(i,e){i.uniform2iv(this.addr,e)}function _M(i,e){i.uniform3iv(this.addr,e)}function yM(i,e){i.uniform4iv(this.addr,e)}function xM(i,e){i.uniform1uiv(this.addr,e)}function vM(i,e){i.uniform2uiv(this.addr,e)}function SM(i,e){i.uniform3uiv(this.addr,e)}function MM(i,e){i.uniform4uiv(this.addr,e)}function AM(i,e,t){const n=this.cache,s=e.length,r=yl(t,s);Pt(n,r)||(i.uniform1iv(this.addr,r),It(n,r));let a;this.type===i.SAMPLER_2D_SHADOW?a=wu:a=cm;for(let o=0;o!==s;++o)t.setTexture2D(e[o]||a,r[o])}function bM(i,e,t){const n=this.cache,s=e.length,r=yl(t,s);Pt(n,r)||(i.uniform1iv(this.addr,r),It(n,r));for(let a=0;a!==s;++a)t.setTexture3D(e[a]||hm,r[a])}function EM(i,e,t){const n=this.cache,s=e.length,r=yl(t,s);Pt(n,r)||(i.uniform1iv(this.addr,r),It(n,r));for(let a=0;a!==s;++a)t.setTextureCube(e[a]||dm,r[a])}function TM(i,e,t){const n=this.cache,s=e.length,r=yl(t,s);Pt(n,r)||(i.uniform1iv(this.addr,r),It(n,r));for(let a=0;a!==s;++a)t.setTexture2DArray(e[a]||um,r[a])}function wM(i){switch(i){case 5126:return lM;case 35664:return cM;case 35665:return uM;case 35666:return hM;case 35674:return dM;case 35675:return fM;case 35676:return pM;case 5124:case 35670:return mM;case 35667:case 35671:return gM;case 35668:case 35672:return _M;case 35669:case 35673:return yM;case 5125:return xM;case 36294:return vM;case 36295:return SM;case 36296:return MM;case 35678:case 36198:case 36298:case 36306:case 35682:return AM;case 35679:case 36299:case 36307:return bM;case 35680:case 36300:case 36308:case 36293:return EM;case 36289:case 36303:case 36311:case 36292:return TM}}class CM{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.setValue=oM(t.type)}}class RM{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=wM(t.type)}}class LM{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,n){const s=this.seq;for(let r=0,a=s.length;r!==a;++r){const o=s[r];o.setValue(e,t[o.id],n)}}}const dc=/(\w+)(\])?(\[|\.)?/g;function df(i,e){i.seq.push(e),i.map[e.id]=e}function PM(i,e,t){const n=i.name,s=n.length;for(dc.lastIndex=0;;){const r=dc.exec(n),a=dc.lastIndex;let o=r[1];const l=r[2]==="]",c=r[3];if(l&&(o=o|0),c===void 0||c==="["&&a+2===s){df(t,c===void 0?new CM(o,i,e):new RM(o,i,e));break}else{let d=t.map[o];d===void 0&&(d=new LM(o),df(t,d)),t=d}}}class ko{constructor(e,t){this.seq=[],this.map={};const n=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let a=0;a<n;++a){const o=e.getActiveUniform(t,a),l=e.getUniformLocation(t,o.name);PM(o,l,this)}const s=[],r=[];for(const a of this.seq)a.type===e.SAMPLER_2D_SHADOW||a.type===e.SAMPLER_CUBE_SHADOW||a.type===e.SAMPLER_2D_ARRAY_SHADOW?s.push(a):r.push(a);s.length>0&&(this.seq=s.concat(r))}setValue(e,t,n,s){const r=this.map[t];r!==void 0&&r.setValue(e,n,s)}setOptional(e,t,n){const s=t[n];s!==void 0&&this.setValue(e,n,s)}static upload(e,t,n,s){for(let r=0,a=t.length;r!==a;++r){const o=t[r],l=n[o.id];l.needsUpdate!==!1&&o.setValue(e,l.value,s)}}static seqWithValue(e,t){const n=[];for(let s=0,r=e.length;s!==r;++s){const a=e[s];a.id in t&&n.push(a)}return n}}function ff(i,e,t){const n=i.createShader(e);return i.shaderSource(n,t),i.compileShader(n),n}const IM=37297;let DM=0;function NM(i,e){const t=i.split(`
`),n=[],s=Math.max(e-6,0),r=Math.min(e+6,t.length);for(let a=s;a<r;a++){const o=a+1;n.push(`${o===e?">":" "} ${o}: ${t[a]}`)}return n.join(`
`)}const pf=new Ye;function UM(i){et._getMatrix(pf,et.workingColorSpace,i);const e=`mat3( ${pf.elements.map(t=>t.toFixed(4))} )`;switch(et.getTransfer(i)){case Qo:return[e,"LinearTransferOETF"];case rt:return[e,"sRGBTransferOETF"];default:return Re("WebGLProgram: Unsupported color space: ",i),[e,"LinearTransferOETF"]}}function mf(i,e,t){const n=i.getShaderParameter(e,i.COMPILE_STATUS),r=(i.getShaderInfoLog(e)||"").trim();if(n&&r==="")return"";const a=/ERROR: 0:(\d+)/.exec(r);if(a){const o=parseInt(a[1]);return t.toUpperCase()+`

`+r+`

`+NM(i.getShaderSource(e),o)}else return r}function OM(i,e){const t=UM(e);return[`vec4 ${i}( vec4 value ) {`,`	return ${t[1]}( vec4( value.rgb * ${t[0]}, value.a ) );`,"}"].join(`
`)}const BM={[Ku]:"Linear",[Xu]:"Reinhard",[Yu]:"Cineon",[dl]:"ACESFilmic",[$u]:"AgX",[Ju]:"Neutral",[qu]:"Custom"};function FM(i,e){const t=BM[e];return t===void 0?(Re("WebGLProgram: Unsupported toneMapping:",e),"vec3 "+i+"( vec3 color ) { return LinearToneMapping( color ); }"):"vec3 "+i+"( vec3 color ) { return "+t+"ToneMapping( color ); }"}const uo=new P;function zM(){et.getLuminanceCoefficients(uo);const i=uo.x.toFixed(4),e=uo.y.toFixed(4),t=uo.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${i}, ${e}, ${t} );`,"	return dot( weights, rgb );","}"].join(`
`)}function kM(i){return[i.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",i.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(kr).join(`
`)}function HM(i){const e=[];for(const t in i){const n=i[t];n!==!1&&e.push("#define "+t+" "+n)}return e.join(`
`)}function GM(i,e){const t={},n=i.getProgramParameter(e,i.ACTIVE_ATTRIBUTES);for(let s=0;s<n;s++){const r=i.getActiveAttrib(e,s),a=r.name;let o=1;r.type===i.FLOAT_MAT2&&(o=2),r.type===i.FLOAT_MAT3&&(o=3),r.type===i.FLOAT_MAT4&&(o=4),t[a]={type:r.type,location:i.getAttribLocation(e,a),locationSize:o}}return t}function kr(i){return i!==""}function gf(i,e){const t=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return i.replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,t).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function _f(i,e){return i.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}const VM=/^[ \t]*#include +<([\w\d./]+)>/gm;function Cu(i){return i.replace(VM,KM)}const WM=new Map;function KM(i,e){let t=qe[e];if(t===void 0){const n=WM.get(e);if(n!==void 0)t=qe[n],Re('WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,n);else throw new Error("Can not resolve #include <"+e+">")}return Cu(t)}const XM=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function yf(i){return i.replace(XM,YM)}function YM(i,e,t,n){let s="";for(let r=parseInt(e);r<parseInt(t);r++)s+=n.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return s}function xf(i){let e=`precision ${i.precision} float;
	precision ${i.precision} int;
	precision ${i.precision} sampler2D;
	precision ${i.precision} samplerCube;
	precision ${i.precision} sampler3D;
	precision ${i.precision} sampler2DArray;
	precision ${i.precision} sampler2DShadow;
	precision ${i.precision} samplerCubeShadow;
	precision ${i.precision} sampler2DArrayShadow;
	precision ${i.precision} isampler2D;
	precision ${i.precision} isampler3D;
	precision ${i.precision} isamplerCube;
	precision ${i.precision} isampler2DArray;
	precision ${i.precision} usampler2D;
	precision ${i.precision} usampler3D;
	precision ${i.precision} usamplerCube;
	precision ${i.precision} usampler2DArray;
	`;return i.precision==="highp"?e+=`
#define HIGH_PRECISION`:i.precision==="mediump"?e+=`
#define MEDIUM_PRECISION`:i.precision==="lowp"&&(e+=`
#define LOW_PRECISION`),e}const qM={[No]:"SHADOWMAP_TYPE_PCF",[Br]:"SHADOWMAP_TYPE_VSM"};function $M(i){return qM[i.shadowMapType]||"SHADOWMAP_TYPE_BASIC"}const JM={[Ji]:"ENVMAP_TYPE_CUBE",[qs]:"ENVMAP_TYPE_CUBE",[fl]:"ENVMAP_TYPE_CUBE_UV"};function jM(i){return i.envMap===!1?"ENVMAP_TYPE_CUBE":JM[i.envMapMode]||"ENVMAP_TYPE_CUBE"}const ZM={[qs]:"ENVMAP_MODE_REFRACTION"};function QM(i){return i.envMap===!1?"ENVMAP_MODE_REFLECTION":ZM[i.envMapMode]||"ENVMAP_MODE_REFLECTION"}const eA={[Wu]:"ENVMAP_BLENDING_MULTIPLY",[i0]:"ENVMAP_BLENDING_MIX",[s0]:"ENVMAP_BLENDING_ADD"};function tA(i){return i.envMap===!1?"ENVMAP_BLENDING_NONE":eA[i.combine]||"ENVMAP_BLENDING_NONE"}function nA(i){const e=i.envMapCubeUVHeight;if(e===null)return null;const t=Math.log2(e)-2,n=1/e;return{texelWidth:1/(3*Math.max(Math.pow(2,t),112)),texelHeight:n,maxMip:t}}function iA(i,e,t,n){const s=i.getContext(),r=t.defines;let a=t.vertexShader,o=t.fragmentShader;const l=$M(t),c=jM(t),u=QM(t),d=tA(t),h=nA(t),f=kM(t),p=HM(r),_=s.createProgram();let m,g,S=t.glslVersion?"#version "+t.glslVersion+`
`:"";t.isRawShaderMaterial?(m=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,p].filter(kr).join(`
`),m.length>0&&(m+=`
`),g=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,p].filter(kr).join(`
`),g.length>0&&(g+=`
`)):(m=[xf(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,p,t.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",t.batching?"#define USE_BATCHING":"",t.batchingColor?"#define USE_BATCHING_COLOR":"",t.instancing?"#define USE_INSTANCING":"",t.instancingColor?"#define USE_INSTANCING_COLOR":"",t.instancingMorph?"#define USE_INSTANCING_MORPH":"",t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+u:"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.displacementMap?"#define USE_DISPLACEMENTMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.mapUv?"#define MAP_UV "+t.mapUv:"",t.alphaMapUv?"#define ALPHAMAP_UV "+t.alphaMapUv:"",t.lightMapUv?"#define LIGHTMAP_UV "+t.lightMapUv:"",t.aoMapUv?"#define AOMAP_UV "+t.aoMapUv:"",t.emissiveMapUv?"#define EMISSIVEMAP_UV "+t.emissiveMapUv:"",t.bumpMapUv?"#define BUMPMAP_UV "+t.bumpMapUv:"",t.normalMapUv?"#define NORMALMAP_UV "+t.normalMapUv:"",t.displacementMapUv?"#define DISPLACEMENTMAP_UV "+t.displacementMapUv:"",t.metalnessMapUv?"#define METALNESSMAP_UV "+t.metalnessMapUv:"",t.roughnessMapUv?"#define ROUGHNESSMAP_UV "+t.roughnessMapUv:"",t.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+t.anisotropyMapUv:"",t.clearcoatMapUv?"#define CLEARCOATMAP_UV "+t.clearcoatMapUv:"",t.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+t.clearcoatNormalMapUv:"",t.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+t.clearcoatRoughnessMapUv:"",t.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+t.iridescenceMapUv:"",t.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+t.iridescenceThicknessMapUv:"",t.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+t.sheenColorMapUv:"",t.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+t.sheenRoughnessMapUv:"",t.specularMapUv?"#define SPECULARMAP_UV "+t.specularMapUv:"",t.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+t.specularColorMapUv:"",t.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+t.specularIntensityMapUv:"",t.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+t.transmissionMapUv:"",t.thicknessMapUv?"#define THICKNESSMAP_UV "+t.thicknessMapUv:"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.flatShading?"#define FLAT_SHADED":"",t.skinning?"#define USE_SKINNING":"",t.morphTargets?"#define USE_MORPHTARGETS":"",t.morphNormals&&t.flatShading===!1?"#define USE_MORPHNORMALS":"",t.morphColors?"#define USE_MORPHCOLORS":"",t.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+t.morphTextureStride:"",t.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+t.morphTargetsCount:"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.sizeAttenuation?"#define USE_SIZEATTENUATION":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(kr).join(`
`),g=[xf(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,p,t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",t.map?"#define USE_MAP":"",t.matcap?"#define USE_MATCAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+c:"",t.envMap?"#define "+u:"",t.envMap?"#define "+d:"",h?"#define CUBEUV_TEXEL_WIDTH "+h.texelWidth:"",h?"#define CUBEUV_TEXEL_HEIGHT "+h.texelHeight:"",h?"#define CUBEUV_MAX_MIP "+h.maxMip+".0":"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoat?"#define USE_CLEARCOAT":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.dispersion?"#define USE_DISPERSION":"",t.iridescence?"#define USE_IRIDESCENCE":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaTest?"#define USE_ALPHATEST":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.sheen?"#define USE_SHEEN":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors||t.instancingColor?"#define USE_COLOR":"",t.vertexAlphas||t.batchingColor?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.gradientMap?"#define USE_GRADIENTMAP":"",t.flatShading?"#define FLAT_SHADED":"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",t.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",t.toneMapping!==jn?"#define TONE_MAPPING":"",t.toneMapping!==jn?qe.tonemapping_pars_fragment:"",t.toneMapping!==jn?FM("toneMapping",t.toneMapping):"",t.dithering?"#define DITHERING":"",t.opaque?"#define OPAQUE":"",qe.colorspace_pars_fragment,OM("linearToOutputTexel",t.outputColorSpace),zM(),t.useDepthPacking?"#define DEPTH_PACKING "+t.depthPacking:"",`
`].filter(kr).join(`
`)),a=Cu(a),a=gf(a,t),a=_f(a,t),o=Cu(o),o=gf(o,t),o=_f(o,t),a=yf(a),o=yf(o),t.isRawShaderMaterial!==!0&&(S=`#version 300 es
`,m=[f,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+m,g=["#define varying in",t.glslVersion===sd?"":"layout(location = 0) out highp vec4 pc_fragColor;",t.glslVersion===sd?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+g);const v=S+m+a,M=S+g+o,T=ff(s,s.VERTEX_SHADER,v),E=ff(s,s.FRAGMENT_SHADER,M);s.attachShader(_,T),s.attachShader(_,E),t.index0AttributeName!==void 0?s.bindAttribLocation(_,0,t.index0AttributeName):t.morphTargets===!0&&s.bindAttribLocation(_,0,"position"),s.linkProgram(_);function R(C){if(i.debug.checkShaderErrors){const I=s.getProgramInfoLog(_)||"",O=s.getShaderInfoLog(T)||"",z=s.getShaderInfoLog(E)||"",B=I.trim(),H=O.trim(),k=z.trim();let ie=!0,G=!0;if(s.getProgramParameter(_,s.LINK_STATUS)===!1)if(ie=!1,typeof i.debug.onShaderError=="function")i.debug.onShaderError(s,_,T,E);else{const Z=mf(s,T,"vertex"),J=mf(s,E,"fragment");ze("THREE.WebGLProgram: Shader Error "+s.getError()+" - VALIDATE_STATUS "+s.getProgramParameter(_,s.VALIDATE_STATUS)+`

Material Name: `+C.name+`
Material Type: `+C.type+`

Program Info Log: `+B+`
`+Z+`
`+J)}else B!==""?Re("WebGLProgram: Program Info Log:",B):(H===""||k==="")&&(G=!1);G&&(C.diagnostics={runnable:ie,programLog:B,vertexShader:{log:H,prefix:m},fragmentShader:{log:k,prefix:g}})}s.deleteShader(T),s.deleteShader(E),y=new ko(s,_),A=GM(s,_)}let y;this.getUniforms=function(){return y===void 0&&R(this),y};let A;this.getAttributes=function(){return A===void 0&&R(this),A};let U=t.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return U===!1&&(U=s.getProgramParameter(_,IM)),U},this.destroy=function(){n.releaseStatesOfProgram(this),s.deleteProgram(_),this.program=void 0},this.type=t.shaderType,this.name=t.shaderName,this.id=DM++,this.cacheKey=e,this.usedTimes=1,this.program=_,this.vertexShader=T,this.fragmentShader=E,this}let sA=0;class rA{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e){const t=e.vertexShader,n=e.fragmentShader,s=this._getShaderStage(t),r=this._getShaderStage(n),a=this._getShaderCacheForMaterial(e);return a.has(s)===!1&&(a.add(s),s.usedTimes++),a.has(r)===!1&&(a.add(r),r.usedTimes++),this}remove(e){const t=this.materialCache.get(e);for(const n of t)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(e),this}getVertexShaderID(e){return this._getShaderStage(e.vertexShader).id}getFragmentShaderID(e){return this._getShaderStage(e.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){const t=this.materialCache;let n=t.get(e);return n===void 0&&(n=new Set,t.set(e,n)),n}_getShaderStage(e){const t=this.shaderCache;let n=t.get(e);return n===void 0&&(n=new aA(e),t.set(e,n)),n}}class aA{constructor(e){this.id=sA++,this.code=e,this.usedTimes=0}}function oA(i,e,t,n,s,r){const a=new uh,o=new rA,l=new Set,c=[],u=new Map,d=n.logarithmicDepthBuffer;let h=n.precision;const f={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distance",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function p(y){return l.add(y),y===0?"uv":`uv${y}`}function _(y,A,U,C,I){const O=C.fog,z=I.geometry,B=y.isMeshStandardMaterial||y.isMeshLambertMaterial||y.isMeshPhongMaterial?C.environment:null,H=y.isMeshStandardMaterial||y.isMeshLambertMaterial&&!y.envMap||y.isMeshPhongMaterial&&!y.envMap,k=e.get(y.envMap||B,H),ie=k&&k.mapping===fl?k.image.height:null,G=f[y.type];y.precision!==null&&(h=n.getMaxPrecision(y.precision),h!==y.precision&&Re("WebGLProgram.getParameters:",y.precision,"not supported, using",h,"instead."));const Z=z.morphAttributes.position||z.morphAttributes.normal||z.morphAttributes.color,J=Z!==void 0?Z.length:0;let Q=0;z.morphAttributes.position!==void 0&&(Q=1),z.morphAttributes.normal!==void 0&&(Q=2),z.morphAttributes.color!==void 0&&(Q=3);let Le,Qe,tt,$;if(G){const lt=sn[G];Le=lt.vertexShader,Qe=lt.fragmentShader}else Le=y.vertexShader,Qe=y.fragmentShader,o.update(y),tt=o.getVertexShaderID(y),$=o.getFragmentShaderID(y);const oe=i.getRenderTarget(),le=i.state.buffers.depth.getReversed(),Ue=I.isInstancedMesh===!0,Pe=I.isBatchedMesh===!0,He=!!y.map,it=!!y.matcap,Ve=!!k,ee=!!y.aoMap,re=!!y.lightMap,ne=!!y.bumpMap,me=!!y.normalMap,L=!!y.displacementMap,Oe=!!y.emissiveMap,ye=!!y.metalnessMap,Be=!!y.roughnessMap,he=y.anisotropy>0,w=y.clearcoat>0,x=y.dispersion>0,N=y.iridescence>0,X=y.sheen>0,te=y.transmission>0,Y=he&&!!y.anisotropyMap,Ae=w&&!!y.clearcoatMap,de=w&&!!y.clearcoatNormalMap,De=w&&!!y.clearcoatRoughnessMap,Fe=N&&!!y.iridescenceMap,se=N&&!!y.iridescenceThicknessMap,ce=X&&!!y.sheenColorMap,be=X&&!!y.sheenRoughnessMap,Te=!!y.specularMap,xe=!!y.specularColorMap,Je=!!y.specularIntensityMap,D=te&&!!y.transmissionMap,fe=te&&!!y.thicknessMap,ue=!!y.gradientMap,Me=!!y.alphaMap,ae=y.alphaTest>0,q=!!y.alphaHash,Ee=!!y.extensions;let We=jn;y.toneMapped&&(oe===null||oe.isXRRenderTarget===!0)&&(We=i.toneMapping);const _t={shaderID:G,shaderType:y.type,shaderName:y.name,vertexShader:Le,fragmentShader:Qe,defines:y.defines,customVertexShaderID:tt,customFragmentShaderID:$,isRawShaderMaterial:y.isRawShaderMaterial===!0,glslVersion:y.glslVersion,precision:h,batching:Pe,batchingColor:Pe&&I._colorsTexture!==null,instancing:Ue,instancingColor:Ue&&I.instanceColor!==null,instancingMorph:Ue&&I.morphTexture!==null,outputColorSpace:oe===null?i.outputColorSpace:oe.isXRRenderTarget===!0?oe.texture.colorSpace:en,alphaToCoverage:!!y.alphaToCoverage,map:He,matcap:it,envMap:Ve,envMapMode:Ve&&k.mapping,envMapCubeUVHeight:ie,aoMap:ee,lightMap:re,bumpMap:ne,normalMap:me,displacementMap:L,emissiveMap:Oe,normalMapObjectSpace:me&&y.normalMapType===c0,normalMapTangentSpace:me&&y.normalMapType===sh,metalnessMap:ye,roughnessMap:Be,anisotropy:he,anisotropyMap:Y,clearcoat:w,clearcoatMap:Ae,clearcoatNormalMap:de,clearcoatRoughnessMap:De,dispersion:x,iridescence:N,iridescenceMap:Fe,iridescenceThicknessMap:se,sheen:X,sheenColorMap:ce,sheenRoughnessMap:be,specularMap:Te,specularColorMap:xe,specularIntensityMap:Je,transmission:te,transmissionMap:D,thicknessMap:fe,gradientMap:ue,opaque:y.transparent===!1&&y.blending===Hs&&y.alphaToCoverage===!1,alphaMap:Me,alphaTest:ae,alphaHash:q,combine:y.combine,mapUv:He&&p(y.map.channel),aoMapUv:ee&&p(y.aoMap.channel),lightMapUv:re&&p(y.lightMap.channel),bumpMapUv:ne&&p(y.bumpMap.channel),normalMapUv:me&&p(y.normalMap.channel),displacementMapUv:L&&p(y.displacementMap.channel),emissiveMapUv:Oe&&p(y.emissiveMap.channel),metalnessMapUv:ye&&p(y.metalnessMap.channel),roughnessMapUv:Be&&p(y.roughnessMap.channel),anisotropyMapUv:Y&&p(y.anisotropyMap.channel),clearcoatMapUv:Ae&&p(y.clearcoatMap.channel),clearcoatNormalMapUv:de&&p(y.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:De&&p(y.clearcoatRoughnessMap.channel),iridescenceMapUv:Fe&&p(y.iridescenceMap.channel),iridescenceThicknessMapUv:se&&p(y.iridescenceThicknessMap.channel),sheenColorMapUv:ce&&p(y.sheenColorMap.channel),sheenRoughnessMapUv:be&&p(y.sheenRoughnessMap.channel),specularMapUv:Te&&p(y.specularMap.channel),specularColorMapUv:xe&&p(y.specularColorMap.channel),specularIntensityMapUv:Je&&p(y.specularIntensityMap.channel),transmissionMapUv:D&&p(y.transmissionMap.channel),thicknessMapUv:fe&&p(y.thicknessMap.channel),alphaMapUv:Me&&p(y.alphaMap.channel),vertexTangents:!!z.attributes.tangent&&(me||he),vertexColors:y.vertexColors,vertexAlphas:y.vertexColors===!0&&!!z.attributes.color&&z.attributes.color.itemSize===4,pointsUvs:I.isPoints===!0&&!!z.attributes.uv&&(He||Me),fog:!!O,useFog:y.fog===!0,fogExp2:!!O&&O.isFogExp2,flatShading:y.wireframe===!1&&(y.flatShading===!0||z.attributes.normal===void 0&&me===!1&&(y.isMeshLambertMaterial||y.isMeshPhongMaterial||y.isMeshStandardMaterial||y.isMeshPhysicalMaterial)),sizeAttenuation:y.sizeAttenuation===!0,logarithmicDepthBuffer:d,reversedDepthBuffer:le,skinning:I.isSkinnedMesh===!0,morphTargets:z.morphAttributes.position!==void 0,morphNormals:z.morphAttributes.normal!==void 0,morphColors:z.morphAttributes.color!==void 0,morphTargetsCount:J,morphTextureStride:Q,numDirLights:A.directional.length,numPointLights:A.point.length,numSpotLights:A.spot.length,numSpotLightMaps:A.spotLightMap.length,numRectAreaLights:A.rectArea.length,numHemiLights:A.hemi.length,numDirLightShadows:A.directionalShadowMap.length,numPointLightShadows:A.pointShadowMap.length,numSpotLightShadows:A.spotShadowMap.length,numSpotLightShadowsWithMaps:A.numSpotLightShadowsWithMaps,numLightProbes:A.numLightProbes,numClippingPlanes:r.numPlanes,numClipIntersection:r.numIntersection,dithering:y.dithering,shadowMapEnabled:i.shadowMap.enabled&&U.length>0,shadowMapType:i.shadowMap.type,toneMapping:We,decodeVideoTexture:He&&y.map.isVideoTexture===!0&&et.getTransfer(y.map.colorSpace)===rt,decodeVideoTextureEmissive:Oe&&y.emissiveMap.isVideoTexture===!0&&et.getTransfer(y.emissiveMap.colorSpace)===rt,premultipliedAlpha:y.premultipliedAlpha,doubleSided:y.side===wt,flipSided:y.side===Qt,useDepthPacking:y.depthPacking>=0,depthPacking:y.depthPacking||0,index0AttributeName:y.index0AttributeName,extensionClipCullDistance:Ee&&y.extensions.clipCullDistance===!0&&t.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(Ee&&y.extensions.multiDraw===!0||Pe)&&t.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:t.has("KHR_parallel_shader_compile"),customProgramCacheKey:y.customProgramCacheKey()};return _t.vertexUv1s=l.has(1),_t.vertexUv2s=l.has(2),_t.vertexUv3s=l.has(3),l.clear(),_t}function m(y){const A=[];if(y.shaderID?A.push(y.shaderID):(A.push(y.customVertexShaderID),A.push(y.customFragmentShaderID)),y.defines!==void 0)for(const U in y.defines)A.push(U),A.push(y.defines[U]);return y.isRawShaderMaterial===!1&&(g(A,y),S(A,y),A.push(i.outputColorSpace)),A.push(y.customProgramCacheKey),A.join()}function g(y,A){y.push(A.precision),y.push(A.outputColorSpace),y.push(A.envMapMode),y.push(A.envMapCubeUVHeight),y.push(A.mapUv),y.push(A.alphaMapUv),y.push(A.lightMapUv),y.push(A.aoMapUv),y.push(A.bumpMapUv),y.push(A.normalMapUv),y.push(A.displacementMapUv),y.push(A.emissiveMapUv),y.push(A.metalnessMapUv),y.push(A.roughnessMapUv),y.push(A.anisotropyMapUv),y.push(A.clearcoatMapUv),y.push(A.clearcoatNormalMapUv),y.push(A.clearcoatRoughnessMapUv),y.push(A.iridescenceMapUv),y.push(A.iridescenceThicknessMapUv),y.push(A.sheenColorMapUv),y.push(A.sheenRoughnessMapUv),y.push(A.specularMapUv),y.push(A.specularColorMapUv),y.push(A.specularIntensityMapUv),y.push(A.transmissionMapUv),y.push(A.thicknessMapUv),y.push(A.combine),y.push(A.fogExp2),y.push(A.sizeAttenuation),y.push(A.morphTargetsCount),y.push(A.morphAttributeCount),y.push(A.numDirLights),y.push(A.numPointLights),y.push(A.numSpotLights),y.push(A.numSpotLightMaps),y.push(A.numHemiLights),y.push(A.numRectAreaLights),y.push(A.numDirLightShadows),y.push(A.numPointLightShadows),y.push(A.numSpotLightShadows),y.push(A.numSpotLightShadowsWithMaps),y.push(A.numLightProbes),y.push(A.shadowMapType),y.push(A.toneMapping),y.push(A.numClippingPlanes),y.push(A.numClipIntersection),y.push(A.depthPacking)}function S(y,A){a.disableAll(),A.instancing&&a.enable(0),A.instancingColor&&a.enable(1),A.instancingMorph&&a.enable(2),A.matcap&&a.enable(3),A.envMap&&a.enable(4),A.normalMapObjectSpace&&a.enable(5),A.normalMapTangentSpace&&a.enable(6),A.clearcoat&&a.enable(7),A.iridescence&&a.enable(8),A.alphaTest&&a.enable(9),A.vertexColors&&a.enable(10),A.vertexAlphas&&a.enable(11),A.vertexUv1s&&a.enable(12),A.vertexUv2s&&a.enable(13),A.vertexUv3s&&a.enable(14),A.vertexTangents&&a.enable(15),A.anisotropy&&a.enable(16),A.alphaHash&&a.enable(17),A.batching&&a.enable(18),A.dispersion&&a.enable(19),A.batchingColor&&a.enable(20),A.gradientMap&&a.enable(21),y.push(a.mask),a.disableAll(),A.fog&&a.enable(0),A.useFog&&a.enable(1),A.flatShading&&a.enable(2),A.logarithmicDepthBuffer&&a.enable(3),A.reversedDepthBuffer&&a.enable(4),A.skinning&&a.enable(5),A.morphTargets&&a.enable(6),A.morphNormals&&a.enable(7),A.morphColors&&a.enable(8),A.premultipliedAlpha&&a.enable(9),A.shadowMapEnabled&&a.enable(10),A.doubleSided&&a.enable(11),A.flipSided&&a.enable(12),A.useDepthPacking&&a.enable(13),A.dithering&&a.enable(14),A.transmission&&a.enable(15),A.sheen&&a.enable(16),A.opaque&&a.enable(17),A.pointsUvs&&a.enable(18),A.decodeVideoTexture&&a.enable(19),A.decodeVideoTextureEmissive&&a.enable(20),A.alphaToCoverage&&a.enable(21),y.push(a.mask)}function v(y){const A=f[y.type];let U;if(A){const C=sn[A];U=Qi.clone(C.uniforms)}else U=y.uniforms;return U}function M(y,A){let U=u.get(A);return U!==void 0?++U.usedTimes:(U=new iA(i,A,y,s),c.push(U),u.set(A,U)),U}function T(y){if(--y.usedTimes===0){const A=c.indexOf(y);c[A]=c[c.length-1],c.pop(),u.delete(y.cacheKey),y.destroy()}}function E(y){o.remove(y)}function R(){o.dispose()}return{getParameters:_,getProgramCacheKey:m,getUniforms:v,acquireProgram:M,releaseProgram:T,releaseShaderCache:E,programs:c,dispose:R}}function lA(){let i=new WeakMap;function e(a){return i.has(a)}function t(a){let o=i.get(a);return o===void 0&&(o={},i.set(a,o)),o}function n(a){i.delete(a)}function s(a,o,l){i.get(a)[o]=l}function r(){i=new WeakMap}return{has:e,get:t,remove:n,update:s,dispose:r}}function cA(i,e){return i.groupOrder!==e.groupOrder?i.groupOrder-e.groupOrder:i.renderOrder!==e.renderOrder?i.renderOrder-e.renderOrder:i.material.id!==e.material.id?i.material.id-e.material.id:i.materialVariant!==e.materialVariant?i.materialVariant-e.materialVariant:i.z!==e.z?i.z-e.z:i.id-e.id}function vf(i,e){return i.groupOrder!==e.groupOrder?i.groupOrder-e.groupOrder:i.renderOrder!==e.renderOrder?i.renderOrder-e.renderOrder:i.z!==e.z?e.z-i.z:i.id-e.id}function Sf(){const i=[];let e=0;const t=[],n=[],s=[];function r(){e=0,t.length=0,n.length=0,s.length=0}function a(h){let f=0;return h.isInstancedMesh&&(f+=2),h.isSkinnedMesh&&(f+=1),f}function o(h,f,p,_,m,g){let S=i[e];return S===void 0?(S={id:h.id,object:h,geometry:f,material:p,materialVariant:a(h),groupOrder:_,renderOrder:h.renderOrder,z:m,group:g},i[e]=S):(S.id=h.id,S.object=h,S.geometry=f,S.material=p,S.materialVariant=a(h),S.groupOrder=_,S.renderOrder=h.renderOrder,S.z=m,S.group=g),e++,S}function l(h,f,p,_,m,g){const S=o(h,f,p,_,m,g);p.transmission>0?n.push(S):p.transparent===!0?s.push(S):t.push(S)}function c(h,f,p,_,m,g){const S=o(h,f,p,_,m,g);p.transmission>0?n.unshift(S):p.transparent===!0?s.unshift(S):t.unshift(S)}function u(h,f){t.length>1&&t.sort(h||cA),n.length>1&&n.sort(f||vf),s.length>1&&s.sort(f||vf)}function d(){for(let h=e,f=i.length;h<f;h++){const p=i[h];if(p.id===null)break;p.id=null,p.object=null,p.geometry=null,p.material=null,p.group=null}}return{opaque:t,transmissive:n,transparent:s,init:r,push:l,unshift:c,finish:d,sort:u}}function uA(){let i=new WeakMap;function e(n,s){const r=i.get(n);let a;return r===void 0?(a=new Sf,i.set(n,[a])):s>=r.length?(a=new Sf,r.push(a)):a=r[s],a}function t(){i=new WeakMap}return{get:e,dispose:t}}function hA(){const i={};return{get:function(e){if(i[e.id]!==void 0)return i[e.id];let t;switch(e.type){case"DirectionalLight":t={direction:new P,color:new ve};break;case"SpotLight":t={position:new P,direction:new P,color:new ve,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":t={position:new P,color:new ve,distance:0,decay:0};break;case"HemisphereLight":t={direction:new P,skyColor:new ve,groundColor:new ve};break;case"RectAreaLight":t={color:new ve,position:new P,halfWidth:new P,halfHeight:new P};break}return i[e.id]=t,t}}}function dA(){const i={};return{get:function(e){if(i[e.id]!==void 0)return i[e.id];let t;switch(e.type){case"DirectionalLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new j};break;case"SpotLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new j};break;case"PointLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new j,shadowCameraNear:1,shadowCameraFar:1e3};break}return i[e.id]=t,t}}}let fA=0;function pA(i,e){return(e.castShadow?2:0)-(i.castShadow?2:0)+(e.map?1:0)-(i.map?1:0)}function mA(i){const e=new hA,t=dA(),n={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let c=0;c<9;c++)n.probe.push(new P);const s=new P,r=new Ke,a=new Ke;function o(c){let u=0,d=0,h=0;for(let A=0;A<9;A++)n.probe[A].set(0,0,0);let f=0,p=0,_=0,m=0,g=0,S=0,v=0,M=0,T=0,E=0,R=0;c.sort(pA);for(let A=0,U=c.length;A<U;A++){const C=c[A],I=C.color,O=C.intensity,z=C.distance;let B=null;if(C.shadow&&C.shadow.map&&(C.shadow.map.texture.format===Js?B=C.shadow.map.texture:B=C.shadow.map.depthTexture||C.shadow.map.texture),C.isAmbientLight)u+=I.r*O,d+=I.g*O,h+=I.b*O;else if(C.isLightProbe){for(let H=0;H<9;H++)n.probe[H].addScaledVector(C.sh.coefficients[H],O);R++}else if(C.isDirectionalLight){const H=e.get(C);if(H.color.copy(C.color).multiplyScalar(C.intensity),C.castShadow){const k=C.shadow,ie=t.get(C);ie.shadowIntensity=k.intensity,ie.shadowBias=k.bias,ie.shadowNormalBias=k.normalBias,ie.shadowRadius=k.radius,ie.shadowMapSize=k.mapSize,n.directionalShadow[f]=ie,n.directionalShadowMap[f]=B,n.directionalShadowMatrix[f]=C.shadow.matrix,S++}n.directional[f]=H,f++}else if(C.isSpotLight){const H=e.get(C);H.position.setFromMatrixPosition(C.matrixWorld),H.color.copy(I).multiplyScalar(O),H.distance=z,H.coneCos=Math.cos(C.angle),H.penumbraCos=Math.cos(C.angle*(1-C.penumbra)),H.decay=C.decay,n.spot[_]=H;const k=C.shadow;if(C.map&&(n.spotLightMap[T]=C.map,T++,k.updateMatrices(C),C.castShadow&&E++),n.spotLightMatrix[_]=k.matrix,C.castShadow){const ie=t.get(C);ie.shadowIntensity=k.intensity,ie.shadowBias=k.bias,ie.shadowNormalBias=k.normalBias,ie.shadowRadius=k.radius,ie.shadowMapSize=k.mapSize,n.spotShadow[_]=ie,n.spotShadowMap[_]=B,M++}_++}else if(C.isRectAreaLight){const H=e.get(C);H.color.copy(I).multiplyScalar(O),H.halfWidth.set(C.width*.5,0,0),H.halfHeight.set(0,C.height*.5,0),n.rectArea[m]=H,m++}else if(C.isPointLight){const H=e.get(C);if(H.color.copy(C.color).multiplyScalar(C.intensity),H.distance=C.distance,H.decay=C.decay,C.castShadow){const k=C.shadow,ie=t.get(C);ie.shadowIntensity=k.intensity,ie.shadowBias=k.bias,ie.shadowNormalBias=k.normalBias,ie.shadowRadius=k.radius,ie.shadowMapSize=k.mapSize,ie.shadowCameraNear=k.camera.near,ie.shadowCameraFar=k.camera.far,n.pointShadow[p]=ie,n.pointShadowMap[p]=B,n.pointShadowMatrix[p]=C.shadow.matrix,v++}n.point[p]=H,p++}else if(C.isHemisphereLight){const H=e.get(C);H.skyColor.copy(C.color).multiplyScalar(O),H.groundColor.copy(C.groundColor).multiplyScalar(O),n.hemi[g]=H,g++}}m>0&&(i.has("OES_texture_float_linear")===!0?(n.rectAreaLTC1=pe.LTC_FLOAT_1,n.rectAreaLTC2=pe.LTC_FLOAT_2):(n.rectAreaLTC1=pe.LTC_HALF_1,n.rectAreaLTC2=pe.LTC_HALF_2)),n.ambient[0]=u,n.ambient[1]=d,n.ambient[2]=h;const y=n.hash;(y.directionalLength!==f||y.pointLength!==p||y.spotLength!==_||y.rectAreaLength!==m||y.hemiLength!==g||y.numDirectionalShadows!==S||y.numPointShadows!==v||y.numSpotShadows!==M||y.numSpotMaps!==T||y.numLightProbes!==R)&&(n.directional.length=f,n.spot.length=_,n.rectArea.length=m,n.point.length=p,n.hemi.length=g,n.directionalShadow.length=S,n.directionalShadowMap.length=S,n.pointShadow.length=v,n.pointShadowMap.length=v,n.spotShadow.length=M,n.spotShadowMap.length=M,n.directionalShadowMatrix.length=S,n.pointShadowMatrix.length=v,n.spotLightMatrix.length=M+T-E,n.spotLightMap.length=T,n.numSpotLightShadowsWithMaps=E,n.numLightProbes=R,y.directionalLength=f,y.pointLength=p,y.spotLength=_,y.rectAreaLength=m,y.hemiLength=g,y.numDirectionalShadows=S,y.numPointShadows=v,y.numSpotShadows=M,y.numSpotMaps=T,y.numLightProbes=R,n.version=fA++)}function l(c,u){let d=0,h=0,f=0,p=0,_=0;const m=u.matrixWorldInverse;for(let g=0,S=c.length;g<S;g++){const v=c[g];if(v.isDirectionalLight){const M=n.directional[d];M.direction.setFromMatrixPosition(v.matrixWorld),s.setFromMatrixPosition(v.target.matrixWorld),M.direction.sub(s),M.direction.transformDirection(m),d++}else if(v.isSpotLight){const M=n.spot[f];M.position.setFromMatrixPosition(v.matrixWorld),M.position.applyMatrix4(m),M.direction.setFromMatrixPosition(v.matrixWorld),s.setFromMatrixPosition(v.target.matrixWorld),M.direction.sub(s),M.direction.transformDirection(m),f++}else if(v.isRectAreaLight){const M=n.rectArea[p];M.position.setFromMatrixPosition(v.matrixWorld),M.position.applyMatrix4(m),a.identity(),r.copy(v.matrixWorld),r.premultiply(m),a.extractRotation(r),M.halfWidth.set(v.width*.5,0,0),M.halfHeight.set(0,v.height*.5,0),M.halfWidth.applyMatrix4(a),M.halfHeight.applyMatrix4(a),p++}else if(v.isPointLight){const M=n.point[h];M.position.setFromMatrixPosition(v.matrixWorld),M.position.applyMatrix4(m),h++}else if(v.isHemisphereLight){const M=n.hemi[_];M.direction.setFromMatrixPosition(v.matrixWorld),M.direction.transformDirection(m),_++}}}return{setup:o,setupView:l,state:n}}function Mf(i){const e=new mA(i),t=[],n=[];function s(u){c.camera=u,t.length=0,n.length=0}function r(u){t.push(u)}function a(u){n.push(u)}function o(){e.setup(t)}function l(u){e.setupView(t,u)}const c={lightsArray:t,shadowsArray:n,camera:null,lights:e,transmissionRenderTarget:{}};return{init:s,state:c,setupLights:o,setupLightsView:l,pushLight:r,pushShadow:a}}function gA(i){let e=new WeakMap;function t(s,r=0){const a=e.get(s);let o;return a===void 0?(o=new Mf(i),e.set(s,[o])):r>=a.length?(o=new Mf(i),a.push(o)):o=a[r],o}function n(){e=new WeakMap}return{get:t,dispose:n}}const _A=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,yA=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ).rg;
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ).r;
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( max( 0.0, squared_mean - mean * mean ) );
	gl_FragColor = vec4( mean, std_dev, 0.0, 1.0 );
}`,xA=[new P(1,0,0),new P(-1,0,0),new P(0,1,0),new P(0,-1,0),new P(0,0,1),new P(0,0,-1)],vA=[new P(0,-1,0),new P(0,-1,0),new P(0,0,1),new P(0,0,-1),new P(0,-1,0),new P(0,-1,0)],Af=new Ke,Lr=new P,fc=new P;function SA(i,e,t){let n=new ph;const s=new j,r=new j,a=new at,o=new j_,l=new Z_,c={},u=t.maxTextureSize,d={[gi]:Qt,[Qt]:gi,[wt]:wt},h=new Vt({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new j},radius:{value:4}},vertexShader:_A,fragmentShader:yA}),f=h.clone();f.defines.HORIZONTAL_PASS=1;const p=new nt;p.setAttribute("position",new $t(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const _=new ot(p,h),m=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=No;let g=this.type;this.render=function(E,R,y){if(m.enabled===!1||m.autoUpdate===!1&&m.needsUpdate===!1||E.length===0)return;this.type===Fg&&(Re("WebGLShadowMap: PCFSoftShadowMap has been deprecated. Using PCFShadowMap instead."),this.type=No);const A=i.getRenderTarget(),U=i.getActiveCubeFace(),C=i.getActiveMipmapLevel(),I=i.state;I.setBlending(Jn),I.buffers.depth.getReversed()===!0?I.buffers.color.setClear(0,0,0,0):I.buffers.color.setClear(1,1,1,1),I.buffers.depth.setTest(!0),I.setScissorTest(!1);const O=g!==this.type;O&&R.traverse(function(z){z.material&&(Array.isArray(z.material)?z.material.forEach(B=>B.needsUpdate=!0):z.material.needsUpdate=!0)});for(let z=0,B=E.length;z<B;z++){const H=E[z],k=H.shadow;if(k===void 0){Re("WebGLShadowMap:",H,"has no shadow.");continue}if(k.autoUpdate===!1&&k.needsUpdate===!1)continue;s.copy(k.mapSize);const ie=k.getFrameExtents();s.multiply(ie),r.copy(k.mapSize),(s.x>u||s.y>u)&&(s.x>u&&(r.x=Math.floor(u/ie.x),s.x=r.x*ie.x,k.mapSize.x=r.x),s.y>u&&(r.y=Math.floor(u/ie.y),s.y=r.y*ie.y,k.mapSize.y=r.y));const G=i.state.buffers.depth.getReversed();if(k.camera._reversedDepth=G,k.map===null||O===!0){if(k.map!==null&&(k.map.depthTexture!==null&&(k.map.depthTexture.dispose(),k.map.depthTexture=null),k.map.dispose()),this.type===Br){if(H.isPointLight){Re("WebGLShadowMap: VSM shadow maps are not supported for PointLights. Use PCF or BasicShadowMap instead.");continue}k.map=new rn(s.x,s.y,{format:Js,type:hn,minFilter:yt,magFilter:yt,generateMipmaps:!1}),k.map.texture.name=H.name+".shadowMap",k.map.depthTexture=new da(s.x,s.y,yn),k.map.depthTexture.name=H.name+".shadowMapDepth",k.map.depthTexture.format=_i,k.map.depthTexture.compareFunction=null,k.map.depthTexture.minFilter=Ct,k.map.depthTexture.magFilter=Ct}else H.isPointLight?(k.map=new lm(s.x),k.map.depthTexture=new h_(s.x,Zn)):(k.map=new rn(s.x,s.y),k.map.depthTexture=new da(s.x,s.y,Zn)),k.map.depthTexture.name=H.name+".shadowMap",k.map.depthTexture.format=_i,this.type===No?(k.map.depthTexture.compareFunction=G?ah:rh,k.map.depthTexture.minFilter=yt,k.map.depthTexture.magFilter=yt):(k.map.depthTexture.compareFunction=null,k.map.depthTexture.minFilter=Ct,k.map.depthTexture.magFilter=Ct);k.camera.updateProjectionMatrix()}const Z=k.map.isWebGLCubeRenderTarget?6:1;for(let J=0;J<Z;J++){if(k.map.isWebGLCubeRenderTarget)i.setRenderTarget(k.map,J),i.clear();else{J===0&&(i.setRenderTarget(k.map),i.clear());const Q=k.getViewport(J);a.set(r.x*Q.x,r.y*Q.y,r.x*Q.z,r.y*Q.w),I.viewport(a)}if(H.isPointLight){const Q=k.camera,Le=k.matrix,Qe=H.distance||Q.far;Qe!==Q.far&&(Q.far=Qe,Q.updateProjectionMatrix()),Lr.setFromMatrixPosition(H.matrixWorld),Q.position.copy(Lr),fc.copy(Q.position),fc.add(xA[J]),Q.up.copy(vA[J]),Q.lookAt(fc),Q.updateMatrixWorld(),Le.makeTranslation(-Lr.x,-Lr.y,-Lr.z),Af.multiplyMatrices(Q.projectionMatrix,Q.matrixWorldInverse),k._frustum.setFromProjectionMatrix(Af,Q.coordinateSystem,Q.reversedDepth)}else k.updateMatrices(H);n=k.getFrustum(),M(R,y,k.camera,H,this.type)}k.isPointLightShadow!==!0&&this.type===Br&&S(k,y),k.needsUpdate=!1}g=this.type,m.needsUpdate=!1,i.setRenderTarget(A,U,C)};function S(E,R){const y=e.update(_);h.defines.VSM_SAMPLES!==E.blurSamples&&(h.defines.VSM_SAMPLES=E.blurSamples,f.defines.VSM_SAMPLES=E.blurSamples,h.needsUpdate=!0,f.needsUpdate=!0),E.mapPass===null&&(E.mapPass=new rn(s.x,s.y,{format:Js,type:hn})),h.uniforms.shadow_pass.value=E.map.depthTexture,h.uniforms.resolution.value=E.mapSize,h.uniforms.radius.value=E.radius,i.setRenderTarget(E.mapPass),i.clear(),i.renderBufferDirect(R,null,y,h,_,null),f.uniforms.shadow_pass.value=E.mapPass.texture,f.uniforms.resolution.value=E.mapSize,f.uniforms.radius.value=E.radius,i.setRenderTarget(E.map),i.clear(),i.renderBufferDirect(R,null,y,f,_,null)}function v(E,R,y,A){let U=null;const C=y.isPointLight===!0?E.customDistanceMaterial:E.customDepthMaterial;if(C!==void 0)U=C;else if(U=y.isPointLight===!0?l:o,i.localClippingEnabled&&R.clipShadows===!0&&Array.isArray(R.clippingPlanes)&&R.clippingPlanes.length!==0||R.displacementMap&&R.displacementScale!==0||R.alphaMap&&R.alphaTest>0||R.map&&R.alphaTest>0||R.alphaToCoverage===!0){const I=U.uuid,O=R.uuid;let z=c[I];z===void 0&&(z={},c[I]=z);let B=z[O];B===void 0&&(B=U.clone(),z[O]=B,R.addEventListener("dispose",T)),U=B}if(U.visible=R.visible,U.wireframe=R.wireframe,A===Br?U.side=R.shadowSide!==null?R.shadowSide:R.side:U.side=R.shadowSide!==null?R.shadowSide:d[R.side],U.alphaMap=R.alphaMap,U.alphaTest=R.alphaToCoverage===!0?.5:R.alphaTest,U.map=R.map,U.clipShadows=R.clipShadows,U.clippingPlanes=R.clippingPlanes,U.clipIntersection=R.clipIntersection,U.displacementMap=R.displacementMap,U.displacementScale=R.displacementScale,U.displacementBias=R.displacementBias,U.wireframeLinewidth=R.wireframeLinewidth,U.linewidth=R.linewidth,y.isPointLight===!0&&U.isMeshDistanceMaterial===!0){const I=i.properties.get(U);I.light=y}return U}function M(E,R,y,A,U){if(E.visible===!1)return;if(E.layers.test(R.layers)&&(E.isMesh||E.isLine||E.isPoints)&&(E.castShadow||E.receiveShadow&&U===Br)&&(!E.frustumCulled||n.intersectsObject(E))){E.modelViewMatrix.multiplyMatrices(y.matrixWorldInverse,E.matrixWorld);const O=e.update(E),z=E.material;if(Array.isArray(z)){const B=O.groups;for(let H=0,k=B.length;H<k;H++){const ie=B[H],G=z[ie.materialIndex];if(G&&G.visible){const Z=v(E,G,A,U);E.onBeforeShadow(i,E,R,y,O,Z,ie),i.renderBufferDirect(y,null,O,Z,E,ie),E.onAfterShadow(i,E,R,y,O,Z,ie)}}}else if(z.visible){const B=v(E,z,A,U);E.onBeforeShadow(i,E,R,y,O,B,null),i.renderBufferDirect(y,null,O,B,E,null),E.onAfterShadow(i,E,R,y,O,B,null)}}const I=E.children;for(let O=0,z=I.length;O<z;O++)M(I[O],R,y,A,U)}function T(E){E.target.removeEventListener("dispose",T);for(const y in c){const A=c[y],U=E.target.uuid;U in A&&(A[U].dispose(),delete A[U])}}}function MA(i,e){function t(){let D=!1;const fe=new at;let ue=null;const Me=new at(0,0,0,0);return{setMask:function(ae){ue!==ae&&!D&&(i.colorMask(ae,ae,ae,ae),ue=ae)},setLocked:function(ae){D=ae},setClear:function(ae,q,Ee,We,_t){_t===!0&&(ae*=We,q*=We,Ee*=We),fe.set(ae,q,Ee,We),Me.equals(fe)===!1&&(i.clearColor(ae,q,Ee,We),Me.copy(fe))},reset:function(){D=!1,ue=null,Me.set(-1,0,0,0)}}}function n(){let D=!1,fe=!1,ue=null,Me=null,ae=null;return{setReversed:function(q){if(fe!==q){const Ee=e.get("EXT_clip_control");q?Ee.clipControlEXT(Ee.LOWER_LEFT_EXT,Ee.ZERO_TO_ONE_EXT):Ee.clipControlEXT(Ee.LOWER_LEFT_EXT,Ee.NEGATIVE_ONE_TO_ONE_EXT),fe=q;const We=ae;ae=null,this.setClear(We)}},getReversed:function(){return fe},setTest:function(q){q?oe(i.DEPTH_TEST):le(i.DEPTH_TEST)},setMask:function(q){ue!==q&&!D&&(i.depthMask(q),ue=q)},setFunc:function(q){if(fe&&(q=v0[q]),Me!==q){switch(q){case Ic:i.depthFunc(i.NEVER);break;case Dc:i.depthFunc(i.ALWAYS);break;case Nc:i.depthFunc(i.LESS);break;case Ys:i.depthFunc(i.LEQUAL);break;case Uc:i.depthFunc(i.EQUAL);break;case Oc:i.depthFunc(i.GEQUAL);break;case Bc:i.depthFunc(i.GREATER);break;case Fc:i.depthFunc(i.NOTEQUAL);break;default:i.depthFunc(i.LEQUAL)}Me=q}},setLocked:function(q){D=q},setClear:function(q){ae!==q&&(ae=q,fe&&(q=1-q),i.clearDepth(q))},reset:function(){D=!1,ue=null,Me=null,ae=null,fe=!1}}}function s(){let D=!1,fe=null,ue=null,Me=null,ae=null,q=null,Ee=null,We=null,_t=null;return{setTest:function(lt){D||(lt?oe(i.STENCIL_TEST):le(i.STENCIL_TEST))},setMask:function(lt){fe!==lt&&!D&&(i.stencilMask(lt),fe=lt)},setFunc:function(lt,ti,ni){(ue!==lt||Me!==ti||ae!==ni)&&(i.stencilFunc(lt,ti,ni),ue=lt,Me=ti,ae=ni)},setOp:function(lt,ti,ni){(q!==lt||Ee!==ti||We!==ni)&&(i.stencilOp(lt,ti,ni),q=lt,Ee=ti,We=ni)},setLocked:function(lt){D=lt},setClear:function(lt){_t!==lt&&(i.clearStencil(lt),_t=lt)},reset:function(){D=!1,fe=null,ue=null,Me=null,ae=null,q=null,Ee=null,We=null,_t=null}}}const r=new t,a=new n,o=new s,l=new WeakMap,c=new WeakMap;let u={},d={},h=new WeakMap,f=[],p=null,_=!1,m=null,g=null,S=null,v=null,M=null,T=null,E=null,R=new ve(0,0,0),y=0,A=!1,U=null,C=null,I=null,O=null,z=null;const B=i.getParameter(i.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let H=!1,k=0;const ie=i.getParameter(i.VERSION);ie.indexOf("WebGL")!==-1?(k=parseFloat(/^WebGL (\d)/.exec(ie)[1]),H=k>=1):ie.indexOf("OpenGL ES")!==-1&&(k=parseFloat(/^OpenGL ES (\d)/.exec(ie)[1]),H=k>=2);let G=null,Z={};const J=i.getParameter(i.SCISSOR_BOX),Q=i.getParameter(i.VIEWPORT),Le=new at().fromArray(J),Qe=new at().fromArray(Q);function tt(D,fe,ue,Me){const ae=new Uint8Array(4),q=i.createTexture();i.bindTexture(D,q),i.texParameteri(D,i.TEXTURE_MIN_FILTER,i.NEAREST),i.texParameteri(D,i.TEXTURE_MAG_FILTER,i.NEAREST);for(let Ee=0;Ee<ue;Ee++)D===i.TEXTURE_3D||D===i.TEXTURE_2D_ARRAY?i.texImage3D(fe,0,i.RGBA,1,1,Me,0,i.RGBA,i.UNSIGNED_BYTE,ae):i.texImage2D(fe+Ee,0,i.RGBA,1,1,0,i.RGBA,i.UNSIGNED_BYTE,ae);return q}const $={};$[i.TEXTURE_2D]=tt(i.TEXTURE_2D,i.TEXTURE_2D,1),$[i.TEXTURE_CUBE_MAP]=tt(i.TEXTURE_CUBE_MAP,i.TEXTURE_CUBE_MAP_POSITIVE_X,6),$[i.TEXTURE_2D_ARRAY]=tt(i.TEXTURE_2D_ARRAY,i.TEXTURE_2D_ARRAY,1,1),$[i.TEXTURE_3D]=tt(i.TEXTURE_3D,i.TEXTURE_3D,1,1),r.setClear(0,0,0,1),a.setClear(1),o.setClear(0),oe(i.DEPTH_TEST),a.setFunc(Ys),ne(!1),me($h),oe(i.CULL_FACE),ee(Jn);function oe(D){u[D]!==!0&&(i.enable(D),u[D]=!0)}function le(D){u[D]!==!1&&(i.disable(D),u[D]=!1)}function Ue(D,fe){return d[D]!==fe?(i.bindFramebuffer(D,fe),d[D]=fe,D===i.DRAW_FRAMEBUFFER&&(d[i.FRAMEBUFFER]=fe),D===i.FRAMEBUFFER&&(d[i.DRAW_FRAMEBUFFER]=fe),!0):!1}function Pe(D,fe){let ue=f,Me=!1;if(D){ue=h.get(fe),ue===void 0&&(ue=[],h.set(fe,ue));const ae=D.textures;if(ue.length!==ae.length||ue[0]!==i.COLOR_ATTACHMENT0){for(let q=0,Ee=ae.length;q<Ee;q++)ue[q]=i.COLOR_ATTACHMENT0+q;ue.length=ae.length,Me=!0}}else ue[0]!==i.BACK&&(ue[0]=i.BACK,Me=!0);Me&&i.drawBuffers(ue)}function He(D){return p!==D?(i.useProgram(D),p=D,!0):!1}const it={[Ki]:i.FUNC_ADD,[kg]:i.FUNC_SUBTRACT,[Hg]:i.FUNC_REVERSE_SUBTRACT};it[Gg]=i.MIN,it[Vg]=i.MAX;const Ve={[Wg]:i.ZERO,[Kg]:i.ONE,[Xg]:i.SRC_COLOR,[Lc]:i.SRC_ALPHA,[Zg]:i.SRC_ALPHA_SATURATE,[Jg]:i.DST_COLOR,[qg]:i.DST_ALPHA,[Yg]:i.ONE_MINUS_SRC_COLOR,[Pc]:i.ONE_MINUS_SRC_ALPHA,[jg]:i.ONE_MINUS_DST_COLOR,[$g]:i.ONE_MINUS_DST_ALPHA,[Qg]:i.CONSTANT_COLOR,[e0]:i.ONE_MINUS_CONSTANT_COLOR,[t0]:i.CONSTANT_ALPHA,[n0]:i.ONE_MINUS_CONSTANT_ALPHA};function ee(D,fe,ue,Me,ae,q,Ee,We,_t,lt){if(D===Jn){_===!0&&(le(i.BLEND),_=!1);return}if(_===!1&&(oe(i.BLEND),_=!0),D!==zg){if(D!==m||lt!==A){if((g!==Ki||M!==Ki)&&(i.blendEquation(i.FUNC_ADD),g=Ki,M=Ki),lt)switch(D){case Hs:i.blendFuncSeparate(i.ONE,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case Ln:i.blendFunc(i.ONE,i.ONE);break;case Jh:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case jh:i.blendFuncSeparate(i.DST_COLOR,i.ONE_MINUS_SRC_ALPHA,i.ZERO,i.ONE);break;default:ze("WebGLState: Invalid blending: ",D);break}else switch(D){case Hs:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case Ln:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE,i.ONE,i.ONE);break;case Jh:ze("WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case jh:ze("WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:ze("WebGLState: Invalid blending: ",D);break}S=null,v=null,T=null,E=null,R.set(0,0,0),y=0,m=D,A=lt}return}ae=ae||fe,q=q||ue,Ee=Ee||Me,(fe!==g||ae!==M)&&(i.blendEquationSeparate(it[fe],it[ae]),g=fe,M=ae),(ue!==S||Me!==v||q!==T||Ee!==E)&&(i.blendFuncSeparate(Ve[ue],Ve[Me],Ve[q],Ve[Ee]),S=ue,v=Me,T=q,E=Ee),(We.equals(R)===!1||_t!==y)&&(i.blendColor(We.r,We.g,We.b,_t),R.copy(We),y=_t),m=D,A=!1}function re(D,fe){D.side===wt?le(i.CULL_FACE):oe(i.CULL_FACE);let ue=D.side===Qt;fe&&(ue=!ue),ne(ue),D.blending===Hs&&D.transparent===!1?ee(Jn):ee(D.blending,D.blendEquation,D.blendSrc,D.blendDst,D.blendEquationAlpha,D.blendSrcAlpha,D.blendDstAlpha,D.blendColor,D.blendAlpha,D.premultipliedAlpha),a.setFunc(D.depthFunc),a.setTest(D.depthTest),a.setMask(D.depthWrite),r.setMask(D.colorWrite);const Me=D.stencilWrite;o.setTest(Me),Me&&(o.setMask(D.stencilWriteMask),o.setFunc(D.stencilFunc,D.stencilRef,D.stencilFuncMask),o.setOp(D.stencilFail,D.stencilZFail,D.stencilZPass)),Oe(D.polygonOffset,D.polygonOffsetFactor,D.polygonOffsetUnits),D.alphaToCoverage===!0?oe(i.SAMPLE_ALPHA_TO_COVERAGE):le(i.SAMPLE_ALPHA_TO_COVERAGE)}function ne(D){U!==D&&(D?i.frontFace(i.CW):i.frontFace(i.CCW),U=D)}function me(D){D!==Og?(oe(i.CULL_FACE),D!==C&&(D===$h?i.cullFace(i.BACK):D===Bg?i.cullFace(i.FRONT):i.cullFace(i.FRONT_AND_BACK))):le(i.CULL_FACE),C=D}function L(D){D!==I&&(H&&i.lineWidth(D),I=D)}function Oe(D,fe,ue){D?(oe(i.POLYGON_OFFSET_FILL),(O!==fe||z!==ue)&&(O=fe,z=ue,a.getReversed()&&(fe=-fe),i.polygonOffset(fe,ue))):le(i.POLYGON_OFFSET_FILL)}function ye(D){D?oe(i.SCISSOR_TEST):le(i.SCISSOR_TEST)}function Be(D){D===void 0&&(D=i.TEXTURE0+B-1),G!==D&&(i.activeTexture(D),G=D)}function he(D,fe,ue){ue===void 0&&(G===null?ue=i.TEXTURE0+B-1:ue=G);let Me=Z[ue];Me===void 0&&(Me={type:void 0,texture:void 0},Z[ue]=Me),(Me.type!==D||Me.texture!==fe)&&(G!==ue&&(i.activeTexture(ue),G=ue),i.bindTexture(D,fe||$[D]),Me.type=D,Me.texture=fe)}function w(){const D=Z[G];D!==void 0&&D.type!==void 0&&(i.bindTexture(D.type,null),D.type=void 0,D.texture=void 0)}function x(){try{i.compressedTexImage2D(...arguments)}catch(D){ze("WebGLState:",D)}}function N(){try{i.compressedTexImage3D(...arguments)}catch(D){ze("WebGLState:",D)}}function X(){try{i.texSubImage2D(...arguments)}catch(D){ze("WebGLState:",D)}}function te(){try{i.texSubImage3D(...arguments)}catch(D){ze("WebGLState:",D)}}function Y(){try{i.compressedTexSubImage2D(...arguments)}catch(D){ze("WebGLState:",D)}}function Ae(){try{i.compressedTexSubImage3D(...arguments)}catch(D){ze("WebGLState:",D)}}function de(){try{i.texStorage2D(...arguments)}catch(D){ze("WebGLState:",D)}}function De(){try{i.texStorage3D(...arguments)}catch(D){ze("WebGLState:",D)}}function Fe(){try{i.texImage2D(...arguments)}catch(D){ze("WebGLState:",D)}}function se(){try{i.texImage3D(...arguments)}catch(D){ze("WebGLState:",D)}}function ce(D){Le.equals(D)===!1&&(i.scissor(D.x,D.y,D.z,D.w),Le.copy(D))}function be(D){Qe.equals(D)===!1&&(i.viewport(D.x,D.y,D.z,D.w),Qe.copy(D))}function Te(D,fe){let ue=c.get(fe);ue===void 0&&(ue=new WeakMap,c.set(fe,ue));let Me=ue.get(D);Me===void 0&&(Me=i.getUniformBlockIndex(fe,D.name),ue.set(D,Me))}function xe(D,fe){const Me=c.get(fe).get(D);l.get(fe)!==Me&&(i.uniformBlockBinding(fe,Me,D.__bindingPointIndex),l.set(fe,Me))}function Je(){i.disable(i.BLEND),i.disable(i.CULL_FACE),i.disable(i.DEPTH_TEST),i.disable(i.POLYGON_OFFSET_FILL),i.disable(i.SCISSOR_TEST),i.disable(i.STENCIL_TEST),i.disable(i.SAMPLE_ALPHA_TO_COVERAGE),i.blendEquation(i.FUNC_ADD),i.blendFunc(i.ONE,i.ZERO),i.blendFuncSeparate(i.ONE,i.ZERO,i.ONE,i.ZERO),i.blendColor(0,0,0,0),i.colorMask(!0,!0,!0,!0),i.clearColor(0,0,0,0),i.depthMask(!0),i.depthFunc(i.LESS),a.setReversed(!1),i.clearDepth(1),i.stencilMask(4294967295),i.stencilFunc(i.ALWAYS,0,4294967295),i.stencilOp(i.KEEP,i.KEEP,i.KEEP),i.clearStencil(0),i.cullFace(i.BACK),i.frontFace(i.CCW),i.polygonOffset(0,0),i.activeTexture(i.TEXTURE0),i.bindFramebuffer(i.FRAMEBUFFER,null),i.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),i.bindFramebuffer(i.READ_FRAMEBUFFER,null),i.useProgram(null),i.lineWidth(1),i.scissor(0,0,i.canvas.width,i.canvas.height),i.viewport(0,0,i.canvas.width,i.canvas.height),u={},G=null,Z={},d={},h=new WeakMap,f=[],p=null,_=!1,m=null,g=null,S=null,v=null,M=null,T=null,E=null,R=new ve(0,0,0),y=0,A=!1,U=null,C=null,I=null,O=null,z=null,Le.set(0,0,i.canvas.width,i.canvas.height),Qe.set(0,0,i.canvas.width,i.canvas.height),r.reset(),a.reset(),o.reset()}return{buffers:{color:r,depth:a,stencil:o},enable:oe,disable:le,bindFramebuffer:Ue,drawBuffers:Pe,useProgram:He,setBlending:ee,setMaterial:re,setFlipSided:ne,setCullFace:me,setLineWidth:L,setPolygonOffset:Oe,setScissorTest:ye,activeTexture:Be,bindTexture:he,unbindTexture:w,compressedTexImage2D:x,compressedTexImage3D:N,texImage2D:Fe,texImage3D:se,updateUBOMapping:Te,uniformBlockBinding:xe,texStorage2D:de,texStorage3D:De,texSubImage2D:X,texSubImage3D:te,compressedTexSubImage2D:Y,compressedTexSubImage3D:Ae,scissor:ce,viewport:be,reset:Je}}function AA(i,e,t,n,s,r,a){const o=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),c=new j,u=new WeakMap;let d;const h=new WeakMap;let f=!1;try{f=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function p(w,x){return f?new OffscreenCanvas(w,x):ha("canvas")}function _(w,x,N){let X=1;const te=he(w);if((te.width>N||te.height>N)&&(X=N/Math.max(te.width,te.height)),X<1)if(typeof HTMLImageElement<"u"&&w instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&w instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&w instanceof ImageBitmap||typeof VideoFrame<"u"&&w instanceof VideoFrame){const Y=Math.floor(X*te.width),Ae=Math.floor(X*te.height);d===void 0&&(d=p(Y,Ae));const de=x?p(Y,Ae):d;return de.width=Y,de.height=Ae,de.getContext("2d").drawImage(w,0,0,Y,Ae),Re("WebGLRenderer: Texture has been resized from ("+te.width+"x"+te.height+") to ("+Y+"x"+Ae+")."),de}else return"data"in w&&Re("WebGLRenderer: Image in DataTexture is too big ("+te.width+"x"+te.height+")."),w;return w}function m(w){return w.generateMipmaps}function g(w){i.generateMipmap(w)}function S(w){return w.isWebGLCubeRenderTarget?i.TEXTURE_CUBE_MAP:w.isWebGL3DRenderTarget?i.TEXTURE_3D:w.isWebGLArrayRenderTarget||w.isCompressedArrayTexture?i.TEXTURE_2D_ARRAY:i.TEXTURE_2D}function v(w,x,N,X,te=!1){if(w!==null){if(i[w]!==void 0)return i[w];Re("WebGLRenderer: Attempt to use non-existing WebGL internal format '"+w+"'")}let Y=x;if(x===i.RED&&(N===i.FLOAT&&(Y=i.R32F),N===i.HALF_FLOAT&&(Y=i.R16F),N===i.UNSIGNED_BYTE&&(Y=i.R8)),x===i.RED_INTEGER&&(N===i.UNSIGNED_BYTE&&(Y=i.R8UI),N===i.UNSIGNED_SHORT&&(Y=i.R16UI),N===i.UNSIGNED_INT&&(Y=i.R32UI),N===i.BYTE&&(Y=i.R8I),N===i.SHORT&&(Y=i.R16I),N===i.INT&&(Y=i.R32I)),x===i.RG&&(N===i.FLOAT&&(Y=i.RG32F),N===i.HALF_FLOAT&&(Y=i.RG16F),N===i.UNSIGNED_BYTE&&(Y=i.RG8)),x===i.RG_INTEGER&&(N===i.UNSIGNED_BYTE&&(Y=i.RG8UI),N===i.UNSIGNED_SHORT&&(Y=i.RG16UI),N===i.UNSIGNED_INT&&(Y=i.RG32UI),N===i.BYTE&&(Y=i.RG8I),N===i.SHORT&&(Y=i.RG16I),N===i.INT&&(Y=i.RG32I)),x===i.RGB_INTEGER&&(N===i.UNSIGNED_BYTE&&(Y=i.RGB8UI),N===i.UNSIGNED_SHORT&&(Y=i.RGB16UI),N===i.UNSIGNED_INT&&(Y=i.RGB32UI),N===i.BYTE&&(Y=i.RGB8I),N===i.SHORT&&(Y=i.RGB16I),N===i.INT&&(Y=i.RGB32I)),x===i.RGBA_INTEGER&&(N===i.UNSIGNED_BYTE&&(Y=i.RGBA8UI),N===i.UNSIGNED_SHORT&&(Y=i.RGBA16UI),N===i.UNSIGNED_INT&&(Y=i.RGBA32UI),N===i.BYTE&&(Y=i.RGBA8I),N===i.SHORT&&(Y=i.RGBA16I),N===i.INT&&(Y=i.RGBA32I)),x===i.RGB&&(N===i.UNSIGNED_INT_5_9_9_9_REV&&(Y=i.RGB9_E5),N===i.UNSIGNED_INT_10F_11F_11F_REV&&(Y=i.R11F_G11F_B10F)),x===i.RGBA){const Ae=te?Qo:et.getTransfer(X);N===i.FLOAT&&(Y=i.RGBA32F),N===i.HALF_FLOAT&&(Y=i.RGBA16F),N===i.UNSIGNED_BYTE&&(Y=Ae===rt?i.SRGB8_ALPHA8:i.RGBA8),N===i.UNSIGNED_SHORT_4_4_4_4&&(Y=i.RGBA4),N===i.UNSIGNED_SHORT_5_5_5_1&&(Y=i.RGB5_A1)}return(Y===i.R16F||Y===i.R32F||Y===i.RG16F||Y===i.RG32F||Y===i.RGBA16F||Y===i.RGBA32F)&&e.get("EXT_color_buffer_float"),Y}function M(w,x){let N;return w?x===null||x===Zn||x===oa?N=i.DEPTH24_STENCIL8:x===yn?N=i.DEPTH32F_STENCIL8:x===aa&&(N=i.DEPTH24_STENCIL8,Re("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):x===null||x===Zn||x===oa?N=i.DEPTH_COMPONENT24:x===yn?N=i.DEPTH_COMPONENT32F:x===aa&&(N=i.DEPTH_COMPONENT16),N}function T(w,x){return m(w)===!0||w.isFramebufferTexture&&w.minFilter!==Ct&&w.minFilter!==yt?Math.log2(Math.max(x.width,x.height))+1:w.mipmaps!==void 0&&w.mipmaps.length>0?w.mipmaps.length:w.isCompressedTexture&&Array.isArray(w.image)?x.mipmaps.length:1}function E(w){const x=w.target;x.removeEventListener("dispose",E),y(x),x.isVideoTexture&&u.delete(x)}function R(w){const x=w.target;x.removeEventListener("dispose",R),U(x)}function y(w){const x=n.get(w);if(x.__webglInit===void 0)return;const N=w.source,X=h.get(N);if(X){const te=X[x.__cacheKey];te.usedTimes--,te.usedTimes===0&&A(w),Object.keys(X).length===0&&h.delete(N)}n.remove(w)}function A(w){const x=n.get(w);i.deleteTexture(x.__webglTexture);const N=w.source,X=h.get(N);delete X[x.__cacheKey],a.memory.textures--}function U(w){const x=n.get(w);if(w.depthTexture&&(w.depthTexture.dispose(),n.remove(w.depthTexture)),w.isWebGLCubeRenderTarget)for(let X=0;X<6;X++){if(Array.isArray(x.__webglFramebuffer[X]))for(let te=0;te<x.__webglFramebuffer[X].length;te++)i.deleteFramebuffer(x.__webglFramebuffer[X][te]);else i.deleteFramebuffer(x.__webglFramebuffer[X]);x.__webglDepthbuffer&&i.deleteRenderbuffer(x.__webglDepthbuffer[X])}else{if(Array.isArray(x.__webglFramebuffer))for(let X=0;X<x.__webglFramebuffer.length;X++)i.deleteFramebuffer(x.__webglFramebuffer[X]);else i.deleteFramebuffer(x.__webglFramebuffer);if(x.__webglDepthbuffer&&i.deleteRenderbuffer(x.__webglDepthbuffer),x.__webglMultisampledFramebuffer&&i.deleteFramebuffer(x.__webglMultisampledFramebuffer),x.__webglColorRenderbuffer)for(let X=0;X<x.__webglColorRenderbuffer.length;X++)x.__webglColorRenderbuffer[X]&&i.deleteRenderbuffer(x.__webglColorRenderbuffer[X]);x.__webglDepthRenderbuffer&&i.deleteRenderbuffer(x.__webglDepthRenderbuffer)}const N=w.textures;for(let X=0,te=N.length;X<te;X++){const Y=n.get(N[X]);Y.__webglTexture&&(i.deleteTexture(Y.__webglTexture),a.memory.textures--),n.remove(N[X])}n.remove(w)}let C=0;function I(){C=0}function O(){const w=C;return w>=s.maxTextures&&Re("WebGLTextures: Trying to use "+w+" texture units while this GPU supports only "+s.maxTextures),C+=1,w}function z(w){const x=[];return x.push(w.wrapS),x.push(w.wrapT),x.push(w.wrapR||0),x.push(w.magFilter),x.push(w.minFilter),x.push(w.anisotropy),x.push(w.internalFormat),x.push(w.format),x.push(w.type),x.push(w.generateMipmaps),x.push(w.premultiplyAlpha),x.push(w.flipY),x.push(w.unpackAlignment),x.push(w.colorSpace),x.join()}function B(w,x){const N=n.get(w);if(w.isVideoTexture&&ye(w),w.isRenderTargetTexture===!1&&w.isExternalTexture!==!0&&w.version>0&&N.__version!==w.version){const X=w.image;if(X===null)Re("WebGLRenderer: Texture marked for update but no image data found.");else if(X.complete===!1)Re("WebGLRenderer: Texture marked for update but image is incomplete");else{$(N,w,x);return}}else w.isExternalTexture&&(N.__webglTexture=w.sourceTexture?w.sourceTexture:null);t.bindTexture(i.TEXTURE_2D,N.__webglTexture,i.TEXTURE0+x)}function H(w,x){const N=n.get(w);if(w.isRenderTargetTexture===!1&&w.version>0&&N.__version!==w.version){$(N,w,x);return}else w.isExternalTexture&&(N.__webglTexture=w.sourceTexture?w.sourceTexture:null);t.bindTexture(i.TEXTURE_2D_ARRAY,N.__webglTexture,i.TEXTURE0+x)}function k(w,x){const N=n.get(w);if(w.isRenderTargetTexture===!1&&w.version>0&&N.__version!==w.version){$(N,w,x);return}t.bindTexture(i.TEXTURE_3D,N.__webglTexture,i.TEXTURE0+x)}function ie(w,x){const N=n.get(w);if(w.isCubeDepthTexture!==!0&&w.version>0&&N.__version!==w.version){oe(N,w,x);return}t.bindTexture(i.TEXTURE_CUBE_MAP,N.__webglTexture,i.TEXTURE0+x)}const G={[$s]:i.REPEAT,[_n]:i.CLAMP_TO_EDGE,[Zo]:i.MIRRORED_REPEAT},Z={[Ct]:i.NEAREST,[Rp]:i.NEAREST_MIPMAP_NEAREST,[Fr]:i.NEAREST_MIPMAP_LINEAR,[yt]:i.LINEAR,[Uo]:i.LINEAR_MIPMAP_NEAREST,[Pn]:i.LINEAR_MIPMAP_LINEAR},J={[u0]:i.NEVER,[m0]:i.ALWAYS,[h0]:i.LESS,[rh]:i.LEQUAL,[d0]:i.EQUAL,[ah]:i.GEQUAL,[f0]:i.GREATER,[p0]:i.NOTEQUAL};function Q(w,x){if(x.type===yn&&e.has("OES_texture_float_linear")===!1&&(x.magFilter===yt||x.magFilter===Uo||x.magFilter===Fr||x.magFilter===Pn||x.minFilter===yt||x.minFilter===Uo||x.minFilter===Fr||x.minFilter===Pn)&&Re("WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),i.texParameteri(w,i.TEXTURE_WRAP_S,G[x.wrapS]),i.texParameteri(w,i.TEXTURE_WRAP_T,G[x.wrapT]),(w===i.TEXTURE_3D||w===i.TEXTURE_2D_ARRAY)&&i.texParameteri(w,i.TEXTURE_WRAP_R,G[x.wrapR]),i.texParameteri(w,i.TEXTURE_MAG_FILTER,Z[x.magFilter]),i.texParameteri(w,i.TEXTURE_MIN_FILTER,Z[x.minFilter]),x.compareFunction&&(i.texParameteri(w,i.TEXTURE_COMPARE_MODE,i.COMPARE_REF_TO_TEXTURE),i.texParameteri(w,i.TEXTURE_COMPARE_FUNC,J[x.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){if(x.magFilter===Ct||x.minFilter!==Fr&&x.minFilter!==Pn||x.type===yn&&e.has("OES_texture_float_linear")===!1)return;if(x.anisotropy>1||n.get(x).__currentAnisotropy){const N=e.get("EXT_texture_filter_anisotropic");i.texParameterf(w,N.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(x.anisotropy,s.getMaxAnisotropy())),n.get(x).__currentAnisotropy=x.anisotropy}}}function Le(w,x){let N=!1;w.__webglInit===void 0&&(w.__webglInit=!0,x.addEventListener("dispose",E));const X=x.source;let te=h.get(X);te===void 0&&(te={},h.set(X,te));const Y=z(x);if(Y!==w.__cacheKey){te[Y]===void 0&&(te[Y]={texture:i.createTexture(),usedTimes:0},a.memory.textures++,N=!0),te[Y].usedTimes++;const Ae=te[w.__cacheKey];Ae!==void 0&&(te[w.__cacheKey].usedTimes--,Ae.usedTimes===0&&A(x)),w.__cacheKey=Y,w.__webglTexture=te[Y].texture}return N}function Qe(w,x,N){return Math.floor(Math.floor(w/N)/x)}function tt(w,x,N,X){const Y=w.updateRanges;if(Y.length===0)t.texSubImage2D(i.TEXTURE_2D,0,0,0,x.width,x.height,N,X,x.data);else{Y.sort((se,ce)=>se.start-ce.start);let Ae=0;for(let se=1;se<Y.length;se++){const ce=Y[Ae],be=Y[se],Te=ce.start+ce.count,xe=Qe(be.start,x.width,4),Je=Qe(ce.start,x.width,4);be.start<=Te+1&&xe===Je&&Qe(be.start+be.count-1,x.width,4)===xe?ce.count=Math.max(ce.count,be.start+be.count-ce.start):(++Ae,Y[Ae]=be)}Y.length=Ae+1;const de=i.getParameter(i.UNPACK_ROW_LENGTH),De=i.getParameter(i.UNPACK_SKIP_PIXELS),Fe=i.getParameter(i.UNPACK_SKIP_ROWS);i.pixelStorei(i.UNPACK_ROW_LENGTH,x.width);for(let se=0,ce=Y.length;se<ce;se++){const be=Y[se],Te=Math.floor(be.start/4),xe=Math.ceil(be.count/4),Je=Te%x.width,D=Math.floor(Te/x.width),fe=xe,ue=1;i.pixelStorei(i.UNPACK_SKIP_PIXELS,Je),i.pixelStorei(i.UNPACK_SKIP_ROWS,D),t.texSubImage2D(i.TEXTURE_2D,0,Je,D,fe,ue,N,X,x.data)}w.clearUpdateRanges(),i.pixelStorei(i.UNPACK_ROW_LENGTH,de),i.pixelStorei(i.UNPACK_SKIP_PIXELS,De),i.pixelStorei(i.UNPACK_SKIP_ROWS,Fe)}}function $(w,x,N){let X=i.TEXTURE_2D;(x.isDataArrayTexture||x.isCompressedArrayTexture)&&(X=i.TEXTURE_2D_ARRAY),x.isData3DTexture&&(X=i.TEXTURE_3D);const te=Le(w,x),Y=x.source;t.bindTexture(X,w.__webglTexture,i.TEXTURE0+N);const Ae=n.get(Y);if(Y.version!==Ae.__version||te===!0){t.activeTexture(i.TEXTURE0+N);const de=et.getPrimaries(et.workingColorSpace),De=x.colorSpace===Ri?null:et.getPrimaries(x.colorSpace),Fe=x.colorSpace===Ri||de===De?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,x.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,x.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,x.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,Fe);let se=_(x.image,!1,s.maxTextureSize);se=Be(x,se);const ce=r.convert(x.format,x.colorSpace),be=r.convert(x.type);let Te=v(x.internalFormat,ce,be,x.colorSpace,x.isVideoTexture);Q(X,x);let xe;const Je=x.mipmaps,D=x.isVideoTexture!==!0,fe=Ae.__version===void 0||te===!0,ue=Y.dataReady,Me=T(x,se);if(x.isDepthTexture)Te=M(x.format===qi,x.type),fe&&(D?t.texStorage2D(i.TEXTURE_2D,1,Te,se.width,se.height):t.texImage2D(i.TEXTURE_2D,0,Te,se.width,se.height,0,ce,be,null));else if(x.isDataTexture)if(Je.length>0){D&&fe&&t.texStorage2D(i.TEXTURE_2D,Me,Te,Je[0].width,Je[0].height);for(let ae=0,q=Je.length;ae<q;ae++)xe=Je[ae],D?ue&&t.texSubImage2D(i.TEXTURE_2D,ae,0,0,xe.width,xe.height,ce,be,xe.data):t.texImage2D(i.TEXTURE_2D,ae,Te,xe.width,xe.height,0,ce,be,xe.data);x.generateMipmaps=!1}else D?(fe&&t.texStorage2D(i.TEXTURE_2D,Me,Te,se.width,se.height),ue&&tt(x,se,ce,be)):t.texImage2D(i.TEXTURE_2D,0,Te,se.width,se.height,0,ce,be,se.data);else if(x.isCompressedTexture)if(x.isCompressedArrayTexture){D&&fe&&t.texStorage3D(i.TEXTURE_2D_ARRAY,Me,Te,Je[0].width,Je[0].height,se.depth);for(let ae=0,q=Je.length;ae<q;ae++)if(xe=Je[ae],x.format!==xn)if(ce!==null)if(D){if(ue)if(x.layerUpdates.size>0){const Ee=Qd(xe.width,xe.height,x.format,x.type);for(const We of x.layerUpdates){const _t=xe.data.subarray(We*Ee/xe.data.BYTES_PER_ELEMENT,(We+1)*Ee/xe.data.BYTES_PER_ELEMENT);t.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,ae,0,0,We,xe.width,xe.height,1,ce,_t)}x.clearLayerUpdates()}else t.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,ae,0,0,0,xe.width,xe.height,se.depth,ce,xe.data)}else t.compressedTexImage3D(i.TEXTURE_2D_ARRAY,ae,Te,xe.width,xe.height,se.depth,0,xe.data,0,0);else Re("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else D?ue&&t.texSubImage3D(i.TEXTURE_2D_ARRAY,ae,0,0,0,xe.width,xe.height,se.depth,ce,be,xe.data):t.texImage3D(i.TEXTURE_2D_ARRAY,ae,Te,xe.width,xe.height,se.depth,0,ce,be,xe.data)}else{D&&fe&&t.texStorage2D(i.TEXTURE_2D,Me,Te,Je[0].width,Je[0].height);for(let ae=0,q=Je.length;ae<q;ae++)xe=Je[ae],x.format!==xn?ce!==null?D?ue&&t.compressedTexSubImage2D(i.TEXTURE_2D,ae,0,0,xe.width,xe.height,ce,xe.data):t.compressedTexImage2D(i.TEXTURE_2D,ae,Te,xe.width,xe.height,0,xe.data):Re("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):D?ue&&t.texSubImage2D(i.TEXTURE_2D,ae,0,0,xe.width,xe.height,ce,be,xe.data):t.texImage2D(i.TEXTURE_2D,ae,Te,xe.width,xe.height,0,ce,be,xe.data)}else if(x.isDataArrayTexture)if(D){if(fe&&t.texStorage3D(i.TEXTURE_2D_ARRAY,Me,Te,se.width,se.height,se.depth),ue)if(x.layerUpdates.size>0){const ae=Qd(se.width,se.height,x.format,x.type);for(const q of x.layerUpdates){const Ee=se.data.subarray(q*ae/se.data.BYTES_PER_ELEMENT,(q+1)*ae/se.data.BYTES_PER_ELEMENT);t.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,q,se.width,se.height,1,ce,be,Ee)}x.clearLayerUpdates()}else t.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,0,se.width,se.height,se.depth,ce,be,se.data)}else t.texImage3D(i.TEXTURE_2D_ARRAY,0,Te,se.width,se.height,se.depth,0,ce,be,se.data);else if(x.isData3DTexture)D?(fe&&t.texStorage3D(i.TEXTURE_3D,Me,Te,se.width,se.height,se.depth),ue&&t.texSubImage3D(i.TEXTURE_3D,0,0,0,0,se.width,se.height,se.depth,ce,be,se.data)):t.texImage3D(i.TEXTURE_3D,0,Te,se.width,se.height,se.depth,0,ce,be,se.data);else if(x.isFramebufferTexture){if(fe)if(D)t.texStorage2D(i.TEXTURE_2D,Me,Te,se.width,se.height);else{let ae=se.width,q=se.height;for(let Ee=0;Ee<Me;Ee++)t.texImage2D(i.TEXTURE_2D,Ee,Te,ae,q,0,ce,be,null),ae>>=1,q>>=1}}else if(Je.length>0){if(D&&fe){const ae=he(Je[0]);t.texStorage2D(i.TEXTURE_2D,Me,Te,ae.width,ae.height)}for(let ae=0,q=Je.length;ae<q;ae++)xe=Je[ae],D?ue&&t.texSubImage2D(i.TEXTURE_2D,ae,0,0,ce,be,xe):t.texImage2D(i.TEXTURE_2D,ae,Te,ce,be,xe);x.generateMipmaps=!1}else if(D){if(fe){const ae=he(se);t.texStorage2D(i.TEXTURE_2D,Me,Te,ae.width,ae.height)}ue&&t.texSubImage2D(i.TEXTURE_2D,0,0,0,ce,be,se)}else t.texImage2D(i.TEXTURE_2D,0,Te,ce,be,se);m(x)&&g(X),Ae.__version=Y.version,x.onUpdate&&x.onUpdate(x)}w.__version=x.version}function oe(w,x,N){if(x.image.length!==6)return;const X=Le(w,x),te=x.source;t.bindTexture(i.TEXTURE_CUBE_MAP,w.__webglTexture,i.TEXTURE0+N);const Y=n.get(te);if(te.version!==Y.__version||X===!0){t.activeTexture(i.TEXTURE0+N);const Ae=et.getPrimaries(et.workingColorSpace),de=x.colorSpace===Ri?null:et.getPrimaries(x.colorSpace),De=x.colorSpace===Ri||Ae===de?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,x.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,x.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,x.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,De);const Fe=x.isCompressedTexture||x.image[0].isCompressedTexture,se=x.image[0]&&x.image[0].isDataTexture,ce=[];for(let q=0;q<6;q++)!Fe&&!se?ce[q]=_(x.image[q],!0,s.maxCubemapSize):ce[q]=se?x.image[q].image:x.image[q],ce[q]=Be(x,ce[q]);const be=ce[0],Te=r.convert(x.format,x.colorSpace),xe=r.convert(x.type),Je=v(x.internalFormat,Te,xe,x.colorSpace),D=x.isVideoTexture!==!0,fe=Y.__version===void 0||X===!0,ue=te.dataReady;let Me=T(x,be);Q(i.TEXTURE_CUBE_MAP,x);let ae;if(Fe){D&&fe&&t.texStorage2D(i.TEXTURE_CUBE_MAP,Me,Je,be.width,be.height);for(let q=0;q<6;q++){ae=ce[q].mipmaps;for(let Ee=0;Ee<ae.length;Ee++){const We=ae[Ee];x.format!==xn?Te!==null?D?ue&&t.compressedTexSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+q,Ee,0,0,We.width,We.height,Te,We.data):t.compressedTexImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+q,Ee,Je,We.width,We.height,0,We.data):Re("WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):D?ue&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+q,Ee,0,0,We.width,We.height,Te,xe,We.data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+q,Ee,Je,We.width,We.height,0,Te,xe,We.data)}}}else{if(ae=x.mipmaps,D&&fe){ae.length>0&&Me++;const q=he(ce[0]);t.texStorage2D(i.TEXTURE_CUBE_MAP,Me,Je,q.width,q.height)}for(let q=0;q<6;q++)if(se){D?ue&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+q,0,0,0,ce[q].width,ce[q].height,Te,xe,ce[q].data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+q,0,Je,ce[q].width,ce[q].height,0,Te,xe,ce[q].data);for(let Ee=0;Ee<ae.length;Ee++){const _t=ae[Ee].image[q].image;D?ue&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+q,Ee+1,0,0,_t.width,_t.height,Te,xe,_t.data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+q,Ee+1,Je,_t.width,_t.height,0,Te,xe,_t.data)}}else{D?ue&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+q,0,0,0,Te,xe,ce[q]):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+q,0,Je,Te,xe,ce[q]);for(let Ee=0;Ee<ae.length;Ee++){const We=ae[Ee];D?ue&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+q,Ee+1,0,0,Te,xe,We.image[q]):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+q,Ee+1,Je,Te,xe,We.image[q])}}}m(x)&&g(i.TEXTURE_CUBE_MAP),Y.__version=te.version,x.onUpdate&&x.onUpdate(x)}w.__version=x.version}function le(w,x,N,X,te,Y){const Ae=r.convert(N.format,N.colorSpace),de=r.convert(N.type),De=v(N.internalFormat,Ae,de,N.colorSpace),Fe=n.get(x),se=n.get(N);if(se.__renderTarget=x,!Fe.__hasExternalTextures){const ce=Math.max(1,x.width>>Y),be=Math.max(1,x.height>>Y);te===i.TEXTURE_3D||te===i.TEXTURE_2D_ARRAY?t.texImage3D(te,Y,De,ce,be,x.depth,0,Ae,de,null):t.texImage2D(te,Y,De,ce,be,0,Ae,de,null)}t.bindFramebuffer(i.FRAMEBUFFER,w),Oe(x)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,X,te,se.__webglTexture,0,L(x)):(te===i.TEXTURE_2D||te>=i.TEXTURE_CUBE_MAP_POSITIVE_X&&te<=i.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&i.framebufferTexture2D(i.FRAMEBUFFER,X,te,se.__webglTexture,Y),t.bindFramebuffer(i.FRAMEBUFFER,null)}function Ue(w,x,N){if(i.bindRenderbuffer(i.RENDERBUFFER,w),x.depthBuffer){const X=x.depthTexture,te=X&&X.isDepthTexture?X.type:null,Y=M(x.stencilBuffer,te),Ae=x.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;Oe(x)?o.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,L(x),Y,x.width,x.height):N?i.renderbufferStorageMultisample(i.RENDERBUFFER,L(x),Y,x.width,x.height):i.renderbufferStorage(i.RENDERBUFFER,Y,x.width,x.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,Ae,i.RENDERBUFFER,w)}else{const X=x.textures;for(let te=0;te<X.length;te++){const Y=X[te],Ae=r.convert(Y.format,Y.colorSpace),de=r.convert(Y.type),De=v(Y.internalFormat,Ae,de,Y.colorSpace);Oe(x)?o.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,L(x),De,x.width,x.height):N?i.renderbufferStorageMultisample(i.RENDERBUFFER,L(x),De,x.width,x.height):i.renderbufferStorage(i.RENDERBUFFER,De,x.width,x.height)}}i.bindRenderbuffer(i.RENDERBUFFER,null)}function Pe(w,x,N){const X=x.isWebGLCubeRenderTarget===!0;if(t.bindFramebuffer(i.FRAMEBUFFER,w),!(x.depthTexture&&x.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");const te=n.get(x.depthTexture);if(te.__renderTarget=x,(!te.__webglTexture||x.depthTexture.image.width!==x.width||x.depthTexture.image.height!==x.height)&&(x.depthTexture.image.width=x.width,x.depthTexture.image.height=x.height,x.depthTexture.needsUpdate=!0),X){if(te.__webglInit===void 0&&(te.__webglInit=!0,x.depthTexture.addEventListener("dispose",E)),te.__webglTexture===void 0){te.__webglTexture=i.createTexture(),t.bindTexture(i.TEXTURE_CUBE_MAP,te.__webglTexture),Q(i.TEXTURE_CUBE_MAP,x.depthTexture);const Fe=r.convert(x.depthTexture.format),se=r.convert(x.depthTexture.type);let ce;x.depthTexture.format===_i?ce=i.DEPTH_COMPONENT24:x.depthTexture.format===qi&&(ce=i.DEPTH24_STENCIL8);for(let be=0;be<6;be++)i.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+be,0,ce,x.width,x.height,0,Fe,se,null)}}else B(x.depthTexture,0);const Y=te.__webglTexture,Ae=L(x),de=X?i.TEXTURE_CUBE_MAP_POSITIVE_X+N:i.TEXTURE_2D,De=x.depthTexture.format===qi?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;if(x.depthTexture.format===_i)Oe(x)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,De,de,Y,0,Ae):i.framebufferTexture2D(i.FRAMEBUFFER,De,de,Y,0);else if(x.depthTexture.format===qi)Oe(x)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,De,de,Y,0,Ae):i.framebufferTexture2D(i.FRAMEBUFFER,De,de,Y,0);else throw new Error("Unknown depthTexture format")}function He(w){const x=n.get(w),N=w.isWebGLCubeRenderTarget===!0;if(x.__boundDepthTexture!==w.depthTexture){const X=w.depthTexture;if(x.__depthDisposeCallback&&x.__depthDisposeCallback(),X){const te=()=>{delete x.__boundDepthTexture,delete x.__depthDisposeCallback,X.removeEventListener("dispose",te)};X.addEventListener("dispose",te),x.__depthDisposeCallback=te}x.__boundDepthTexture=X}if(w.depthTexture&&!x.__autoAllocateDepthBuffer)if(N)for(let X=0;X<6;X++)Pe(x.__webglFramebuffer[X],w,X);else{const X=w.texture.mipmaps;X&&X.length>0?Pe(x.__webglFramebuffer[0],w,0):Pe(x.__webglFramebuffer,w,0)}else if(N){x.__webglDepthbuffer=[];for(let X=0;X<6;X++)if(t.bindFramebuffer(i.FRAMEBUFFER,x.__webglFramebuffer[X]),x.__webglDepthbuffer[X]===void 0)x.__webglDepthbuffer[X]=i.createRenderbuffer(),Ue(x.__webglDepthbuffer[X],w,!1);else{const te=w.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,Y=x.__webglDepthbuffer[X];i.bindRenderbuffer(i.RENDERBUFFER,Y),i.framebufferRenderbuffer(i.FRAMEBUFFER,te,i.RENDERBUFFER,Y)}}else{const X=w.texture.mipmaps;if(X&&X.length>0?t.bindFramebuffer(i.FRAMEBUFFER,x.__webglFramebuffer[0]):t.bindFramebuffer(i.FRAMEBUFFER,x.__webglFramebuffer),x.__webglDepthbuffer===void 0)x.__webglDepthbuffer=i.createRenderbuffer(),Ue(x.__webglDepthbuffer,w,!1);else{const te=w.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,Y=x.__webglDepthbuffer;i.bindRenderbuffer(i.RENDERBUFFER,Y),i.framebufferRenderbuffer(i.FRAMEBUFFER,te,i.RENDERBUFFER,Y)}}t.bindFramebuffer(i.FRAMEBUFFER,null)}function it(w,x,N){const X=n.get(w);x!==void 0&&le(X.__webglFramebuffer,w,w.texture,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,0),N!==void 0&&He(w)}function Ve(w){const x=w.texture,N=n.get(w),X=n.get(x);w.addEventListener("dispose",R);const te=w.textures,Y=w.isWebGLCubeRenderTarget===!0,Ae=te.length>1;if(Ae||(X.__webglTexture===void 0&&(X.__webglTexture=i.createTexture()),X.__version=x.version,a.memory.textures++),Y){N.__webglFramebuffer=[];for(let de=0;de<6;de++)if(x.mipmaps&&x.mipmaps.length>0){N.__webglFramebuffer[de]=[];for(let De=0;De<x.mipmaps.length;De++)N.__webglFramebuffer[de][De]=i.createFramebuffer()}else N.__webglFramebuffer[de]=i.createFramebuffer()}else{if(x.mipmaps&&x.mipmaps.length>0){N.__webglFramebuffer=[];for(let de=0;de<x.mipmaps.length;de++)N.__webglFramebuffer[de]=i.createFramebuffer()}else N.__webglFramebuffer=i.createFramebuffer();if(Ae)for(let de=0,De=te.length;de<De;de++){const Fe=n.get(te[de]);Fe.__webglTexture===void 0&&(Fe.__webglTexture=i.createTexture(),a.memory.textures++)}if(w.samples>0&&Oe(w)===!1){N.__webglMultisampledFramebuffer=i.createFramebuffer(),N.__webglColorRenderbuffer=[],t.bindFramebuffer(i.FRAMEBUFFER,N.__webglMultisampledFramebuffer);for(let de=0;de<te.length;de++){const De=te[de];N.__webglColorRenderbuffer[de]=i.createRenderbuffer(),i.bindRenderbuffer(i.RENDERBUFFER,N.__webglColorRenderbuffer[de]);const Fe=r.convert(De.format,De.colorSpace),se=r.convert(De.type),ce=v(De.internalFormat,Fe,se,De.colorSpace,w.isXRRenderTarget===!0),be=L(w);i.renderbufferStorageMultisample(i.RENDERBUFFER,be,ce,w.width,w.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+de,i.RENDERBUFFER,N.__webglColorRenderbuffer[de])}i.bindRenderbuffer(i.RENDERBUFFER,null),w.depthBuffer&&(N.__webglDepthRenderbuffer=i.createRenderbuffer(),Ue(N.__webglDepthRenderbuffer,w,!0)),t.bindFramebuffer(i.FRAMEBUFFER,null)}}if(Y){t.bindTexture(i.TEXTURE_CUBE_MAP,X.__webglTexture),Q(i.TEXTURE_CUBE_MAP,x);for(let de=0;de<6;de++)if(x.mipmaps&&x.mipmaps.length>0)for(let De=0;De<x.mipmaps.length;De++)le(N.__webglFramebuffer[de][De],w,x,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+de,De);else le(N.__webglFramebuffer[de],w,x,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+de,0);m(x)&&g(i.TEXTURE_CUBE_MAP),t.unbindTexture()}else if(Ae){for(let de=0,De=te.length;de<De;de++){const Fe=te[de],se=n.get(Fe);let ce=i.TEXTURE_2D;(w.isWebGL3DRenderTarget||w.isWebGLArrayRenderTarget)&&(ce=w.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),t.bindTexture(ce,se.__webglTexture),Q(ce,Fe),le(N.__webglFramebuffer,w,Fe,i.COLOR_ATTACHMENT0+de,ce,0),m(Fe)&&g(ce)}t.unbindTexture()}else{let de=i.TEXTURE_2D;if((w.isWebGL3DRenderTarget||w.isWebGLArrayRenderTarget)&&(de=w.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),t.bindTexture(de,X.__webglTexture),Q(de,x),x.mipmaps&&x.mipmaps.length>0)for(let De=0;De<x.mipmaps.length;De++)le(N.__webglFramebuffer[De],w,x,i.COLOR_ATTACHMENT0,de,De);else le(N.__webglFramebuffer,w,x,i.COLOR_ATTACHMENT0,de,0);m(x)&&g(de),t.unbindTexture()}w.depthBuffer&&He(w)}function ee(w){const x=w.textures;for(let N=0,X=x.length;N<X;N++){const te=x[N];if(m(te)){const Y=S(w),Ae=n.get(te).__webglTexture;t.bindTexture(Y,Ae),g(Y),t.unbindTexture()}}}const re=[],ne=[];function me(w){if(w.samples>0){if(Oe(w)===!1){const x=w.textures,N=w.width,X=w.height;let te=i.COLOR_BUFFER_BIT;const Y=w.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,Ae=n.get(w),de=x.length>1;if(de)for(let Fe=0;Fe<x.length;Fe++)t.bindFramebuffer(i.FRAMEBUFFER,Ae.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+Fe,i.RENDERBUFFER,null),t.bindFramebuffer(i.FRAMEBUFFER,Ae.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+Fe,i.TEXTURE_2D,null,0);t.bindFramebuffer(i.READ_FRAMEBUFFER,Ae.__webglMultisampledFramebuffer);const De=w.texture.mipmaps;De&&De.length>0?t.bindFramebuffer(i.DRAW_FRAMEBUFFER,Ae.__webglFramebuffer[0]):t.bindFramebuffer(i.DRAW_FRAMEBUFFER,Ae.__webglFramebuffer);for(let Fe=0;Fe<x.length;Fe++){if(w.resolveDepthBuffer&&(w.depthBuffer&&(te|=i.DEPTH_BUFFER_BIT),w.stencilBuffer&&w.resolveStencilBuffer&&(te|=i.STENCIL_BUFFER_BIT)),de){i.framebufferRenderbuffer(i.READ_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.RENDERBUFFER,Ae.__webglColorRenderbuffer[Fe]);const se=n.get(x[Fe]).__webglTexture;i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,se,0)}i.blitFramebuffer(0,0,N,X,0,0,N,X,te,i.NEAREST),l===!0&&(re.length=0,ne.length=0,re.push(i.COLOR_ATTACHMENT0+Fe),w.depthBuffer&&w.resolveDepthBuffer===!1&&(re.push(Y),ne.push(Y),i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,ne)),i.invalidateFramebuffer(i.READ_FRAMEBUFFER,re))}if(t.bindFramebuffer(i.READ_FRAMEBUFFER,null),t.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),de)for(let Fe=0;Fe<x.length;Fe++){t.bindFramebuffer(i.FRAMEBUFFER,Ae.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+Fe,i.RENDERBUFFER,Ae.__webglColorRenderbuffer[Fe]);const se=n.get(x[Fe]).__webglTexture;t.bindFramebuffer(i.FRAMEBUFFER,Ae.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+Fe,i.TEXTURE_2D,se,0)}t.bindFramebuffer(i.DRAW_FRAMEBUFFER,Ae.__webglMultisampledFramebuffer)}else if(w.depthBuffer&&w.resolveDepthBuffer===!1&&l){const x=w.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,[x])}}}function L(w){return Math.min(s.maxSamples,w.samples)}function Oe(w){const x=n.get(w);return w.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&x.__useRenderToTexture!==!1}function ye(w){const x=a.render.frame;u.get(w)!==x&&(u.set(w,x),w.update())}function Be(w,x){const N=w.colorSpace,X=w.format,te=w.type;return w.isCompressedTexture===!0||w.isVideoTexture===!0||N!==en&&N!==Ri&&(et.getTransfer(N)===rt?(X!==xn||te!==cn)&&Re("WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):ze("WebGLTextures: Unsupported texture color space:",N)),x}function he(w){return typeof HTMLImageElement<"u"&&w instanceof HTMLImageElement?(c.width=w.naturalWidth||w.width,c.height=w.naturalHeight||w.height):typeof VideoFrame<"u"&&w instanceof VideoFrame?(c.width=w.displayWidth,c.height=w.displayHeight):(c.width=w.width,c.height=w.height),c}this.allocateTextureUnit=O,this.resetTextureUnits=I,this.setTexture2D=B,this.setTexture2DArray=H,this.setTexture3D=k,this.setTextureCube=ie,this.rebindTextures=it,this.setupRenderTarget=Ve,this.updateRenderTargetMipmap=ee,this.updateMultisampleRenderTarget=me,this.setupDepthRenderbuffer=He,this.setupFrameBufferTexture=le,this.useMultisampledRTT=Oe,this.isReversedDepthBuffer=function(){return t.buffers.depth.getReversed()}}function bA(i,e){function t(n,s=Ri){let r;const a=et.getTransfer(s);if(n===cn)return i.UNSIGNED_BYTE;if(n===Zu)return i.UNSIGNED_SHORT_4_4_4_4;if(n===Qu)return i.UNSIGNED_SHORT_5_5_5_1;if(n===Ip)return i.UNSIGNED_INT_5_9_9_9_REV;if(n===Dp)return i.UNSIGNED_INT_10F_11F_11F_REV;if(n===Lp)return i.BYTE;if(n===Pp)return i.SHORT;if(n===aa)return i.UNSIGNED_SHORT;if(n===ju)return i.INT;if(n===Zn)return i.UNSIGNED_INT;if(n===yn)return i.FLOAT;if(n===hn)return i.HALF_FLOAT;if(n===Np)return i.ALPHA;if(n===Up)return i.RGB;if(n===xn)return i.RGBA;if(n===_i)return i.DEPTH_COMPONENT;if(n===qi)return i.DEPTH_STENCIL;if(n===eh)return i.RED;if(n===th)return i.RED_INTEGER;if(n===Js)return i.RG;if(n===nh)return i.RG_INTEGER;if(n===ih)return i.RGBA_INTEGER;if(n===Oo||n===Bo||n===Fo||n===zo)if(a===rt)if(r=e.get("WEBGL_compressed_texture_s3tc_srgb"),r!==null){if(n===Oo)return r.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===Bo)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===Fo)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===zo)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(r=e.get("WEBGL_compressed_texture_s3tc"),r!==null){if(n===Oo)return r.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===Bo)return r.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===Fo)return r.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===zo)return r.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(n===zc||n===kc||n===Hc||n===Gc)if(r=e.get("WEBGL_compressed_texture_pvrtc"),r!==null){if(n===zc)return r.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===kc)return r.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===Hc)return r.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===Gc)return r.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(n===Vc||n===Wc||n===Kc||n===Xc||n===Yc||n===qc||n===$c)if(r=e.get("WEBGL_compressed_texture_etc"),r!==null){if(n===Vc||n===Wc)return a===rt?r.COMPRESSED_SRGB8_ETC2:r.COMPRESSED_RGB8_ETC2;if(n===Kc)return a===rt?r.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:r.COMPRESSED_RGBA8_ETC2_EAC;if(n===Xc)return r.COMPRESSED_R11_EAC;if(n===Yc)return r.COMPRESSED_SIGNED_R11_EAC;if(n===qc)return r.COMPRESSED_RG11_EAC;if(n===$c)return r.COMPRESSED_SIGNED_RG11_EAC}else return null;if(n===Jc||n===jc||n===Zc||n===Qc||n===eu||n===tu||n===nu||n===iu||n===su||n===ru||n===au||n===ou||n===lu||n===cu)if(r=e.get("WEBGL_compressed_texture_astc"),r!==null){if(n===Jc)return a===rt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:r.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===jc)return a===rt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:r.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===Zc)return a===rt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:r.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===Qc)return a===rt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:r.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===eu)return a===rt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:r.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===tu)return a===rt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:r.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===nu)return a===rt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:r.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===iu)return a===rt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:r.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===su)return a===rt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:r.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===ru)return a===rt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:r.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===au)return a===rt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:r.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===ou)return a===rt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:r.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===lu)return a===rt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:r.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===cu)return a===rt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:r.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(n===uu||n===hu||n===du)if(r=e.get("EXT_texture_compression_bptc"),r!==null){if(n===uu)return a===rt?r.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:r.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===hu)return r.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===du)return r.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(n===fu||n===pu||n===mu||n===gu)if(r=e.get("EXT_texture_compression_rgtc"),r!==null){if(n===fu)return r.COMPRESSED_RED_RGTC1_EXT;if(n===pu)return r.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===mu)return r.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===gu)return r.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return n===oa?i.UNSIGNED_INT_24_8:i[n]!==void 0?i[n]:null}return{convert:t}}const EA=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,TA=`
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`;class wA{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t){if(this.texture===null){const n=new Kp(e.texture);(e.depthNear!==t.depthNear||e.depthFar!==t.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=n}}getMesh(e){if(this.texture!==null&&this.mesh===null){const t=e.cameras[0].viewport,n=new Vt({vertexShader:EA,fragmentShader:TA,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new ot(new Ni(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class CA extends ts{constructor(e,t){super();const n=this;let s=null,r=1,a=null,o="local-floor",l=1,c=null,u=null,d=null,h=null,f=null,p=null;const _=typeof XRWebGLBinding<"u",m=new wA,g={},S=t.getContextAttributes();let v=null,M=null;const T=[],E=[],R=new j;let y=null;const A=new Zt;A.viewport=new at;const U=new Zt;U.viewport=new at;const C=[A,U],I=new My;let O=null,z=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function($){let oe=T[$];return oe===void 0&&(oe=new Ul,T[$]=oe),oe.getTargetRaySpace()},this.getControllerGrip=function($){let oe=T[$];return oe===void 0&&(oe=new Ul,T[$]=oe),oe.getGripSpace()},this.getHand=function($){let oe=T[$];return oe===void 0&&(oe=new Ul,T[$]=oe),oe.getHandSpace()};function B($){const oe=E.indexOf($.inputSource);if(oe===-1)return;const le=T[oe];le!==void 0&&(le.update($.inputSource,$.frame,c||a),le.dispatchEvent({type:$.type,data:$.inputSource}))}function H(){s.removeEventListener("select",B),s.removeEventListener("selectstart",B),s.removeEventListener("selectend",B),s.removeEventListener("squeeze",B),s.removeEventListener("squeezestart",B),s.removeEventListener("squeezeend",B),s.removeEventListener("end",H),s.removeEventListener("inputsourceschange",k);for(let $=0;$<T.length;$++){const oe=E[$];oe!==null&&(E[$]=null,T[$].disconnect(oe))}O=null,z=null,m.reset();for(const $ in g)delete g[$];e.setRenderTarget(v),f=null,h=null,d=null,s=null,M=null,tt.stop(),n.isPresenting=!1,e.setPixelRatio(y),e.setSize(R.width,R.height,!1),n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function($){r=$,n.isPresenting===!0&&Re("WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function($){o=$,n.isPresenting===!0&&Re("WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||a},this.setReferenceSpace=function($){c=$},this.getBaseLayer=function(){return h!==null?h:f},this.getBinding=function(){return d===null&&_&&(d=new XRWebGLBinding(s,t)),d},this.getFrame=function(){return p},this.getSession=function(){return s},this.setSession=async function($){if(s=$,s!==null){if(v=e.getRenderTarget(),s.addEventListener("select",B),s.addEventListener("selectstart",B),s.addEventListener("selectend",B),s.addEventListener("squeeze",B),s.addEventListener("squeezestart",B),s.addEventListener("squeezeend",B),s.addEventListener("end",H),s.addEventListener("inputsourceschange",k),S.xrCompatible!==!0&&await t.makeXRCompatible(),y=e.getPixelRatio(),e.getSize(R),_&&"createProjectionLayer"in XRWebGLBinding.prototype){let le=null,Ue=null,Pe=null;S.depth&&(Pe=S.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,le=S.stencil?qi:_i,Ue=S.stencil?oa:Zn);const He={colorFormat:t.RGBA8,depthFormat:Pe,scaleFactor:r};d=this.getBinding(),h=d.createProjectionLayer(He),s.updateRenderState({layers:[h]}),e.setPixelRatio(1),e.setSize(h.textureWidth,h.textureHeight,!1),M=new rn(h.textureWidth,h.textureHeight,{format:xn,type:cn,depthTexture:new da(h.textureWidth,h.textureHeight,Ue,void 0,void 0,void 0,void 0,void 0,void 0,le),stencilBuffer:S.stencil,colorSpace:e.outputColorSpace,samples:S.antialias?4:0,resolveDepthBuffer:h.ignoreDepthValues===!1,resolveStencilBuffer:h.ignoreDepthValues===!1})}else{const le={antialias:S.antialias,alpha:!0,depth:S.depth,stencil:S.stencil,framebufferScaleFactor:r};f=new XRWebGLLayer(s,t,le),s.updateRenderState({baseLayer:f}),e.setPixelRatio(1),e.setSize(f.framebufferWidth,f.framebufferHeight,!1),M=new rn(f.framebufferWidth,f.framebufferHeight,{format:xn,type:cn,colorSpace:e.outputColorSpace,stencilBuffer:S.stencil,resolveDepthBuffer:f.ignoreDepthValues===!1,resolveStencilBuffer:f.ignoreDepthValues===!1})}M.isXRRenderTarget=!0,this.setFoveation(l),c=null,a=await s.requestReferenceSpace(o),tt.setContext(s),tt.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(s!==null)return s.environmentBlendMode},this.getDepthTexture=function(){return m.getDepthTexture()};function k($){for(let oe=0;oe<$.removed.length;oe++){const le=$.removed[oe],Ue=E.indexOf(le);Ue>=0&&(E[Ue]=null,T[Ue].disconnect(le))}for(let oe=0;oe<$.added.length;oe++){const le=$.added[oe];let Ue=E.indexOf(le);if(Ue===-1){for(let He=0;He<T.length;He++)if(He>=E.length){E.push(le),Ue=He;break}else if(E[He]===null){E[He]=le,Ue=He;break}if(Ue===-1)break}const Pe=T[Ue];Pe&&Pe.connect(le)}}const ie=new P,G=new P;function Z($,oe,le){ie.setFromMatrixPosition(oe.matrixWorld),G.setFromMatrixPosition(le.matrixWorld);const Ue=ie.distanceTo(G),Pe=oe.projectionMatrix.elements,He=le.projectionMatrix.elements,it=Pe[14]/(Pe[10]-1),Ve=Pe[14]/(Pe[10]+1),ee=(Pe[9]+1)/Pe[5],re=(Pe[9]-1)/Pe[5],ne=(Pe[8]-1)/Pe[0],me=(He[8]+1)/He[0],L=it*ne,Oe=it*me,ye=Ue/(-ne+me),Be=ye*-ne;if(oe.matrixWorld.decompose($.position,$.quaternion,$.scale),$.translateX(Be),$.translateZ(ye),$.matrixWorld.compose($.position,$.quaternion,$.scale),$.matrixWorldInverse.copy($.matrixWorld).invert(),Pe[10]===-1)$.projectionMatrix.copy(oe.projectionMatrix),$.projectionMatrixInverse.copy(oe.projectionMatrixInverse);else{const he=it+ye,w=Ve+ye,x=L-Be,N=Oe+(Ue-Be),X=ee*Ve/w*he,te=re*Ve/w*he;$.projectionMatrix.makePerspective(x,N,X,te,he,w),$.projectionMatrixInverse.copy($.projectionMatrix).invert()}}function J($,oe){oe===null?$.matrixWorld.copy($.matrix):$.matrixWorld.multiplyMatrices(oe.matrixWorld,$.matrix),$.matrixWorldInverse.copy($.matrixWorld).invert()}this.updateCamera=function($){if(s===null)return;let oe=$.near,le=$.far;m.texture!==null&&(m.depthNear>0&&(oe=m.depthNear),m.depthFar>0&&(le=m.depthFar)),I.near=U.near=A.near=oe,I.far=U.far=A.far=le,(O!==I.near||z!==I.far)&&(s.updateRenderState({depthNear:I.near,depthFar:I.far}),O=I.near,z=I.far),I.layers.mask=$.layers.mask|6,A.layers.mask=I.layers.mask&-5,U.layers.mask=I.layers.mask&-3;const Ue=$.parent,Pe=I.cameras;J(I,Ue);for(let He=0;He<Pe.length;He++)J(Pe[He],Ue);Pe.length===2?Z(I,A,U):I.projectionMatrix.copy(A.projectionMatrix),Q($,I,Ue)};function Q($,oe,le){le===null?$.matrix.copy(oe.matrixWorld):($.matrix.copy(le.matrixWorld),$.matrix.invert(),$.matrix.multiply(oe.matrixWorld)),$.matrix.decompose($.position,$.quaternion,$.scale),$.updateMatrixWorld(!0),$.projectionMatrix.copy(oe.projectionMatrix),$.projectionMatrixInverse.copy(oe.projectionMatrixInverse),$.isPerspectiveCamera&&($.fov=js*2*Math.atan(1/$.projectionMatrix.elements[5]),$.zoom=1)}this.getCamera=function(){return I},this.getFoveation=function(){if(!(h===null&&f===null))return l},this.setFoveation=function($){l=$,h!==null&&(h.fixedFoveation=$),f!==null&&f.fixedFoveation!==void 0&&(f.fixedFoveation=$)},this.hasDepthSensing=function(){return m.texture!==null},this.getDepthSensingMesh=function(){return m.getMesh(I)},this.getCameraTexture=function($){return g[$]};let Le=null;function Qe($,oe){if(u=oe.getViewerPose(c||a),p=oe,u!==null){const le=u.views;f!==null&&(e.setRenderTargetFramebuffer(M,f.framebuffer),e.setRenderTarget(M));let Ue=!1;le.length!==I.cameras.length&&(I.cameras.length=0,Ue=!0);for(let Ve=0;Ve<le.length;Ve++){const ee=le[Ve];let re=null;if(f!==null)re=f.getViewport(ee);else{const me=d.getViewSubImage(h,ee);re=me.viewport,Ve===0&&(e.setRenderTargetTextures(M,me.colorTexture,me.depthStencilTexture),e.setRenderTarget(M))}let ne=C[Ve];ne===void 0&&(ne=new Zt,ne.layers.enable(Ve),ne.viewport=new at,C[Ve]=ne),ne.matrix.fromArray(ee.transform.matrix),ne.matrix.decompose(ne.position,ne.quaternion,ne.scale),ne.projectionMatrix.fromArray(ee.projectionMatrix),ne.projectionMatrixInverse.copy(ne.projectionMatrix).invert(),ne.viewport.set(re.x,re.y,re.width,re.height),Ve===0&&(I.matrix.copy(ne.matrix),I.matrix.decompose(I.position,I.quaternion,I.scale)),Ue===!0&&I.cameras.push(ne)}const Pe=s.enabledFeatures;if(Pe&&Pe.includes("depth-sensing")&&s.depthUsage=="gpu-optimized"&&_){d=n.getBinding();const Ve=d.getDepthInformation(le[0]);Ve&&Ve.isValid&&Ve.texture&&m.init(Ve,s.renderState)}if(Pe&&Pe.includes("camera-access")&&_){e.state.unbindTexture(),d=n.getBinding();for(let Ve=0;Ve<le.length;Ve++){const ee=le[Ve].camera;if(ee){let re=g[ee];re||(re=new Kp,g[ee]=re);const ne=d.getCameraImage(ee);re.sourceTexture=ne}}}}for(let le=0;le<T.length;le++){const Ue=E[le],Pe=T[le];Ue!==null&&Pe!==void 0&&Pe.update(Ue,oe,c||a)}Le&&Le($,oe),oe.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:oe}),p=null}const tt=new om;tt.setAnimationLoop(Qe),this.setAnimationLoop=function($){Le=$},this.dispose=function(){}}}const Gi=new On,RA=new Ke;function LA(i,e){function t(m,g){m.matrixAutoUpdate===!0&&m.updateMatrix(),g.value.copy(m.matrix)}function n(m,g){g.color.getRGB(m.fogColor.value,em(i)),g.isFog?(m.fogNear.value=g.near,m.fogFar.value=g.far):g.isFogExp2&&(m.fogDensity.value=g.density)}function s(m,g,S,v,M){g.isMeshBasicMaterial?r(m,g):g.isMeshLambertMaterial?(r(m,g),g.envMap&&(m.envMapIntensity.value=g.envMapIntensity)):g.isMeshToonMaterial?(r(m,g),d(m,g)):g.isMeshPhongMaterial?(r(m,g),u(m,g),g.envMap&&(m.envMapIntensity.value=g.envMapIntensity)):g.isMeshStandardMaterial?(r(m,g),h(m,g),g.isMeshPhysicalMaterial&&f(m,g,M)):g.isMeshMatcapMaterial?(r(m,g),p(m,g)):g.isMeshDepthMaterial?r(m,g):g.isMeshDistanceMaterial?(r(m,g),_(m,g)):g.isMeshNormalMaterial?r(m,g):g.isLineBasicMaterial?(a(m,g),g.isLineDashedMaterial&&o(m,g)):g.isPointsMaterial?l(m,g,S,v):g.isSpriteMaterial?c(m,g):g.isShadowMaterial?(m.color.value.copy(g.color),m.opacity.value=g.opacity):g.isShaderMaterial&&(g.uniformsNeedUpdate=!1)}function r(m,g){m.opacity.value=g.opacity,g.color&&m.diffuse.value.copy(g.color),g.emissive&&m.emissive.value.copy(g.emissive).multiplyScalar(g.emissiveIntensity),g.map&&(m.map.value=g.map,t(g.map,m.mapTransform)),g.alphaMap&&(m.alphaMap.value=g.alphaMap,t(g.alphaMap,m.alphaMapTransform)),g.bumpMap&&(m.bumpMap.value=g.bumpMap,t(g.bumpMap,m.bumpMapTransform),m.bumpScale.value=g.bumpScale,g.side===Qt&&(m.bumpScale.value*=-1)),g.normalMap&&(m.normalMap.value=g.normalMap,t(g.normalMap,m.normalMapTransform),m.normalScale.value.copy(g.normalScale),g.side===Qt&&m.normalScale.value.negate()),g.displacementMap&&(m.displacementMap.value=g.displacementMap,t(g.displacementMap,m.displacementMapTransform),m.displacementScale.value=g.displacementScale,m.displacementBias.value=g.displacementBias),g.emissiveMap&&(m.emissiveMap.value=g.emissiveMap,t(g.emissiveMap,m.emissiveMapTransform)),g.specularMap&&(m.specularMap.value=g.specularMap,t(g.specularMap,m.specularMapTransform)),g.alphaTest>0&&(m.alphaTest.value=g.alphaTest);const S=e.get(g),v=S.envMap,M=S.envMapRotation;v&&(m.envMap.value=v,Gi.copy(M),Gi.x*=-1,Gi.y*=-1,Gi.z*=-1,v.isCubeTexture&&v.isRenderTargetTexture===!1&&(Gi.y*=-1,Gi.z*=-1),m.envMapRotation.value.setFromMatrix4(RA.makeRotationFromEuler(Gi)),m.flipEnvMap.value=v.isCubeTexture&&v.isRenderTargetTexture===!1?-1:1,m.reflectivity.value=g.reflectivity,m.ior.value=g.ior,m.refractionRatio.value=g.refractionRatio),g.lightMap&&(m.lightMap.value=g.lightMap,m.lightMapIntensity.value=g.lightMapIntensity,t(g.lightMap,m.lightMapTransform)),g.aoMap&&(m.aoMap.value=g.aoMap,m.aoMapIntensity.value=g.aoMapIntensity,t(g.aoMap,m.aoMapTransform))}function a(m,g){m.diffuse.value.copy(g.color),m.opacity.value=g.opacity,g.map&&(m.map.value=g.map,t(g.map,m.mapTransform))}function o(m,g){m.dashSize.value=g.dashSize,m.totalSize.value=g.dashSize+g.gapSize,m.scale.value=g.scale}function l(m,g,S,v){m.diffuse.value.copy(g.color),m.opacity.value=g.opacity,m.size.value=g.size*S,m.scale.value=v*.5,g.map&&(m.map.value=g.map,t(g.map,m.uvTransform)),g.alphaMap&&(m.alphaMap.value=g.alphaMap,t(g.alphaMap,m.alphaMapTransform)),g.alphaTest>0&&(m.alphaTest.value=g.alphaTest)}function c(m,g){m.diffuse.value.copy(g.color),m.opacity.value=g.opacity,m.rotation.value=g.rotation,g.map&&(m.map.value=g.map,t(g.map,m.mapTransform)),g.alphaMap&&(m.alphaMap.value=g.alphaMap,t(g.alphaMap,m.alphaMapTransform)),g.alphaTest>0&&(m.alphaTest.value=g.alphaTest)}function u(m,g){m.specular.value.copy(g.specular),m.shininess.value=Math.max(g.shininess,1e-4)}function d(m,g){g.gradientMap&&(m.gradientMap.value=g.gradientMap)}function h(m,g){m.metalness.value=g.metalness,g.metalnessMap&&(m.metalnessMap.value=g.metalnessMap,t(g.metalnessMap,m.metalnessMapTransform)),m.roughness.value=g.roughness,g.roughnessMap&&(m.roughnessMap.value=g.roughnessMap,t(g.roughnessMap,m.roughnessMapTransform)),g.envMap&&(m.envMapIntensity.value=g.envMapIntensity)}function f(m,g,S){m.ior.value=g.ior,g.sheen>0&&(m.sheenColor.value.copy(g.sheenColor).multiplyScalar(g.sheen),m.sheenRoughness.value=g.sheenRoughness,g.sheenColorMap&&(m.sheenColorMap.value=g.sheenColorMap,t(g.sheenColorMap,m.sheenColorMapTransform)),g.sheenRoughnessMap&&(m.sheenRoughnessMap.value=g.sheenRoughnessMap,t(g.sheenRoughnessMap,m.sheenRoughnessMapTransform))),g.clearcoat>0&&(m.clearcoat.value=g.clearcoat,m.clearcoatRoughness.value=g.clearcoatRoughness,g.clearcoatMap&&(m.clearcoatMap.value=g.clearcoatMap,t(g.clearcoatMap,m.clearcoatMapTransform)),g.clearcoatRoughnessMap&&(m.clearcoatRoughnessMap.value=g.clearcoatRoughnessMap,t(g.clearcoatRoughnessMap,m.clearcoatRoughnessMapTransform)),g.clearcoatNormalMap&&(m.clearcoatNormalMap.value=g.clearcoatNormalMap,t(g.clearcoatNormalMap,m.clearcoatNormalMapTransform),m.clearcoatNormalScale.value.copy(g.clearcoatNormalScale),g.side===Qt&&m.clearcoatNormalScale.value.negate())),g.dispersion>0&&(m.dispersion.value=g.dispersion),g.iridescence>0&&(m.iridescence.value=g.iridescence,m.iridescenceIOR.value=g.iridescenceIOR,m.iridescenceThicknessMinimum.value=g.iridescenceThicknessRange[0],m.iridescenceThicknessMaximum.value=g.iridescenceThicknessRange[1],g.iridescenceMap&&(m.iridescenceMap.value=g.iridescenceMap,t(g.iridescenceMap,m.iridescenceMapTransform)),g.iridescenceThicknessMap&&(m.iridescenceThicknessMap.value=g.iridescenceThicknessMap,t(g.iridescenceThicknessMap,m.iridescenceThicknessMapTransform))),g.transmission>0&&(m.transmission.value=g.transmission,m.transmissionSamplerMap.value=S.texture,m.transmissionSamplerSize.value.set(S.width,S.height),g.transmissionMap&&(m.transmissionMap.value=g.transmissionMap,t(g.transmissionMap,m.transmissionMapTransform)),m.thickness.value=g.thickness,g.thicknessMap&&(m.thicknessMap.value=g.thicknessMap,t(g.thicknessMap,m.thicknessMapTransform)),m.attenuationDistance.value=g.attenuationDistance,m.attenuationColor.value.copy(g.attenuationColor)),g.anisotropy>0&&(m.anisotropyVector.value.set(g.anisotropy*Math.cos(g.anisotropyRotation),g.anisotropy*Math.sin(g.anisotropyRotation)),g.anisotropyMap&&(m.anisotropyMap.value=g.anisotropyMap,t(g.anisotropyMap,m.anisotropyMapTransform))),m.specularIntensity.value=g.specularIntensity,m.specularColor.value.copy(g.specularColor),g.specularColorMap&&(m.specularColorMap.value=g.specularColorMap,t(g.specularColorMap,m.specularColorMapTransform)),g.specularIntensityMap&&(m.specularIntensityMap.value=g.specularIntensityMap,t(g.specularIntensityMap,m.specularIntensityMapTransform))}function p(m,g){g.matcap&&(m.matcap.value=g.matcap)}function _(m,g){const S=e.get(g).light;m.referencePosition.value.setFromMatrixPosition(S.matrixWorld),m.nearDistance.value=S.shadow.camera.near,m.farDistance.value=S.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:s}}function PA(i,e,t,n){let s={},r={},a=[];const o=i.getParameter(i.MAX_UNIFORM_BUFFER_BINDINGS);function l(S,v){const M=v.program;n.uniformBlockBinding(S,M)}function c(S,v){let M=s[S.id];M===void 0&&(p(S),M=u(S),s[S.id]=M,S.addEventListener("dispose",m));const T=v.program;n.updateUBOMapping(S,T);const E=e.render.frame;r[S.id]!==E&&(h(S),r[S.id]=E)}function u(S){const v=d();S.__bindingPointIndex=v;const M=i.createBuffer(),T=S.__size,E=S.usage;return i.bindBuffer(i.UNIFORM_BUFFER,M),i.bufferData(i.UNIFORM_BUFFER,T,E),i.bindBuffer(i.UNIFORM_BUFFER,null),i.bindBufferBase(i.UNIFORM_BUFFER,v,M),M}function d(){for(let S=0;S<o;S++)if(a.indexOf(S)===-1)return a.push(S),S;return ze("WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function h(S){const v=s[S.id],M=S.uniforms,T=S.__cache;i.bindBuffer(i.UNIFORM_BUFFER,v);for(let E=0,R=M.length;E<R;E++){const y=Array.isArray(M[E])?M[E]:[M[E]];for(let A=0,U=y.length;A<U;A++){const C=y[A];if(f(C,E,A,T)===!0){const I=C.__offset,O=Array.isArray(C.value)?C.value:[C.value];let z=0;for(let B=0;B<O.length;B++){const H=O[B],k=_(H);typeof H=="number"||typeof H=="boolean"?(C.__data[0]=H,i.bufferSubData(i.UNIFORM_BUFFER,I+z,C.__data)):H.isMatrix3?(C.__data[0]=H.elements[0],C.__data[1]=H.elements[1],C.__data[2]=H.elements[2],C.__data[3]=0,C.__data[4]=H.elements[3],C.__data[5]=H.elements[4],C.__data[6]=H.elements[5],C.__data[7]=0,C.__data[8]=H.elements[6],C.__data[9]=H.elements[7],C.__data[10]=H.elements[8],C.__data[11]=0):(H.toArray(C.__data,z),z+=k.storage/Float32Array.BYTES_PER_ELEMENT)}i.bufferSubData(i.UNIFORM_BUFFER,I,C.__data)}}}i.bindBuffer(i.UNIFORM_BUFFER,null)}function f(S,v,M,T){const E=S.value,R=v+"_"+M;if(T[R]===void 0)return typeof E=="number"||typeof E=="boolean"?T[R]=E:T[R]=E.clone(),!0;{const y=T[R];if(typeof E=="number"||typeof E=="boolean"){if(y!==E)return T[R]=E,!0}else if(y.equals(E)===!1)return y.copy(E),!0}return!1}function p(S){const v=S.uniforms;let M=0;const T=16;for(let R=0,y=v.length;R<y;R++){const A=Array.isArray(v[R])?v[R]:[v[R]];for(let U=0,C=A.length;U<C;U++){const I=A[U],O=Array.isArray(I.value)?I.value:[I.value];for(let z=0,B=O.length;z<B;z++){const H=O[z],k=_(H),ie=M%T,G=ie%k.boundary,Z=ie+G;M+=G,Z!==0&&T-Z<k.storage&&(M+=T-Z),I.__data=new Float32Array(k.storage/Float32Array.BYTES_PER_ELEMENT),I.__offset=M,M+=k.storage}}}const E=M%T;return E>0&&(M+=T-E),S.__size=M,S.__cache={},this}function _(S){const v={boundary:0,storage:0};return typeof S=="number"||typeof S=="boolean"?(v.boundary=4,v.storage=4):S.isVector2?(v.boundary=8,v.storage=8):S.isVector3||S.isColor?(v.boundary=16,v.storage=12):S.isVector4?(v.boundary=16,v.storage=16):S.isMatrix3?(v.boundary=48,v.storage=48):S.isMatrix4?(v.boundary=64,v.storage=64):S.isTexture?Re("WebGLRenderer: Texture samplers can not be part of an uniforms group."):Re("WebGLRenderer: Unsupported uniform value type.",S),v}function m(S){const v=S.target;v.removeEventListener("dispose",m);const M=a.indexOf(v.__bindingPointIndex);a.splice(M,1),i.deleteBuffer(s[v.id]),delete s[v.id],delete r[v.id]}function g(){for(const S in s)i.deleteBuffer(s[S]);a=[],s={},r={}}return{bind:l,update:c,dispose:g}}const IA=new Uint16Array([12469,15057,12620,14925,13266,14620,13807,14376,14323,13990,14545,13625,14713,13328,14840,12882,14931,12528,14996,12233,15039,11829,15066,11525,15080,11295,15085,10976,15082,10705,15073,10495,13880,14564,13898,14542,13977,14430,14158,14124,14393,13732,14556,13410,14702,12996,14814,12596,14891,12291,14937,11834,14957,11489,14958,11194,14943,10803,14921,10506,14893,10278,14858,9960,14484,14039,14487,14025,14499,13941,14524,13740,14574,13468,14654,13106,14743,12678,14818,12344,14867,11893,14889,11509,14893,11180,14881,10751,14852,10428,14812,10128,14765,9754,14712,9466,14764,13480,14764,13475,14766,13440,14766,13347,14769,13070,14786,12713,14816,12387,14844,11957,14860,11549,14868,11215,14855,10751,14825,10403,14782,10044,14729,9651,14666,9352,14599,9029,14967,12835,14966,12831,14963,12804,14954,12723,14936,12564,14917,12347,14900,11958,14886,11569,14878,11247,14859,10765,14828,10401,14784,10011,14727,9600,14660,9289,14586,8893,14508,8533,15111,12234,15110,12234,15104,12216,15092,12156,15067,12010,15028,11776,14981,11500,14942,11205,14902,10752,14861,10393,14812,9991,14752,9570,14682,9252,14603,8808,14519,8445,14431,8145,15209,11449,15208,11451,15202,11451,15190,11438,15163,11384,15117,11274,15055,10979,14994,10648,14932,10343,14871,9936,14803,9532,14729,9218,14645,8742,14556,8381,14461,8020,14365,7603,15273,10603,15272,10607,15267,10619,15256,10631,15231,10614,15182,10535,15118,10389,15042,10167,14963,9787,14883,9447,14800,9115,14710,8665,14615,8318,14514,7911,14411,7507,14279,7198,15314,9675,15313,9683,15309,9712,15298,9759,15277,9797,15229,9773,15166,9668,15084,9487,14995,9274,14898,8910,14800,8539,14697,8234,14590,7790,14479,7409,14367,7067,14178,6621,15337,8619,15337,8631,15333,8677,15325,8769,15305,8871,15264,8940,15202,8909,15119,8775,15022,8565,14916,8328,14804,8009,14688,7614,14569,7287,14448,6888,14321,6483,14088,6171,15350,7402,15350,7419,15347,7480,15340,7613,15322,7804,15287,7973,15229,8057,15148,8012,15046,7846,14933,7611,14810,7357,14682,7069,14552,6656,14421,6316,14251,5948,14007,5528,15356,5942,15356,5977,15353,6119,15348,6294,15332,6551,15302,6824,15249,7044,15171,7122,15070,7050,14949,6861,14818,6611,14679,6349,14538,6067,14398,5651,14189,5311,13935,4958,15359,4123,15359,4153,15356,4296,15353,4646,15338,5160,15311,5508,15263,5829,15188,6042,15088,6094,14966,6001,14826,5796,14678,5543,14527,5287,14377,4985,14133,4586,13869,4257,15360,1563,15360,1642,15358,2076,15354,2636,15341,3350,15317,4019,15273,4429,15203,4732,15105,4911,14981,4932,14836,4818,14679,4621,14517,4386,14359,4156,14083,3795,13808,3437,15360,122,15360,137,15358,285,15355,636,15344,1274,15322,2177,15281,2765,15215,3223,15120,3451,14995,3569,14846,3567,14681,3466,14511,3305,14344,3121,14037,2800,13753,2467,15360,0,15360,1,15359,21,15355,89,15346,253,15325,479,15287,796,15225,1148,15133,1492,15008,1749,14856,1882,14685,1886,14506,1783,14324,1608,13996,1398,13702,1183]);let kn=null;function DA(){return kn===null&&(kn=new dh(IA,16,16,Js,hn),kn.name="DFG_LUT",kn.minFilter=yt,kn.magFilter=yt,kn.wrapS=_n,kn.wrapT=_n,kn.generateMipmaps=!1,kn.needsUpdate=!0),kn}class NA{constructor(e={}){const{canvas:t=y0(),context:n=null,depth:s=!0,stencil:r=!1,alpha:a=!1,antialias:o=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:u="default",failIfMajorPerformanceCaveat:d=!1,reversedDepthBuffer:h=!1,outputBufferType:f=cn}=e;this.isWebGLRenderer=!0;let p;if(n!==null){if(typeof WebGLRenderingContext<"u"&&n instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");p=n.getContextAttributes().alpha}else p=a;const _=f,m=new Set([ih,nh,th]),g=new Set([cn,Zn,aa,oa,Zu,Qu]),S=new Uint32Array(4),v=new Int32Array(4);let M=null,T=null;const E=[],R=[];let y=null;this.domElement=t,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=jn,this.toneMappingExposure=1,this.transmissionResolutionScale=1;const A=this;let U=!1;this._outputColorSpace=Ut;let C=0,I=0,O=null,z=-1,B=null;const H=new at,k=new at;let ie=null;const G=new ve(0);let Z=0,J=t.width,Q=t.height,Le=1,Qe=null,tt=null;const $=new at(0,0,J,Q),oe=new at(0,0,J,Q);let le=!1;const Ue=new ph;let Pe=!1,He=!1;const it=new Ke,Ve=new P,ee=new at,re={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let ne=!1;function me(){return O===null?Le:1}let L=n;function Oe(b,F){return t.getContext(b,F)}try{const b={alpha:!0,depth:s,stencil:r,antialias:o,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:u,failIfMajorPerformanceCaveat:d};if("setAttribute"in t&&t.setAttribute("data-engine",`three.js r${Vu}`),t.addEventListener("webglcontextlost",Ee,!1),t.addEventListener("webglcontextrestored",We,!1),t.addEventListener("webglcontextcreationerror",_t,!1),L===null){const F="webgl2";if(L=Oe(F,b),L===null)throw Oe(F)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(b){throw ze("WebGLRenderer: "+b.message),b}let ye,Be,he,w,x,N,X,te,Y,Ae,de,De,Fe,se,ce,be,Te,xe,Je,D,fe,ue,Me;function ae(){ye=new NS(L),ye.init(),fe=new bA(L,ye),Be=new TS(L,ye,e,fe),he=new MA(L,ye),Be.reversedDepthBuffer&&h&&he.buffers.depth.setReversed(!0),w=new BS(L),x=new lA,N=new AA(L,ye,he,x,Be,fe,w),X=new DS(A),te=new Gy(L),ue=new bS(L,te),Y=new US(L,te,w,ue),Ae=new zS(L,Y,te,ue,w),xe=new FS(L,Be,N),ce=new wS(x),de=new oA(A,X,ye,Be,ue,ce),De=new LA(A,x),Fe=new uA,se=new gA(ye),Te=new AS(A,X,he,Ae,p,l),be=new SA(A,Ae,Be),Me=new PA(L,w,Be,he),Je=new ES(L,ye,w),D=new OS(L,ye,w),w.programs=de.programs,A.capabilities=Be,A.extensions=ye,A.properties=x,A.renderLists=Fe,A.shadowMap=be,A.state=he,A.info=w}ae(),_!==cn&&(y=new HS(_,t.width,t.height,s,r));const q=new CA(A,L);this.xr=q,this.getContext=function(){return L},this.getContextAttributes=function(){return L.getContextAttributes()},this.forceContextLoss=function(){const b=ye.get("WEBGL_lose_context");b&&b.loseContext()},this.forceContextRestore=function(){const b=ye.get("WEBGL_lose_context");b&&b.restoreContext()},this.getPixelRatio=function(){return Le},this.setPixelRatio=function(b){b!==void 0&&(Le=b,this.setSize(J,Q,!1))},this.getSize=function(b){return b.set(J,Q)},this.setSize=function(b,F,K=!0){if(q.isPresenting){Re("WebGLRenderer: Can't change size while VR device is presenting.");return}J=b,Q=F,t.width=Math.floor(b*Le),t.height=Math.floor(F*Le),K===!0&&(t.style.width=b+"px",t.style.height=F+"px"),y!==null&&y.setSize(t.width,t.height),this.setViewport(0,0,b,F)},this.getDrawingBufferSize=function(b){return b.set(J*Le,Q*Le).floor()},this.setDrawingBufferSize=function(b,F,K){J=b,Q=F,Le=K,t.width=Math.floor(b*K),t.height=Math.floor(F*K),this.setViewport(0,0,b,F)},this.setEffects=function(b){if(_===cn){console.error("THREE.WebGLRenderer: setEffects() requires outputBufferType set to HalfFloatType or FloatType.");return}if(b){for(let F=0;F<b.length;F++)if(b[F].isOutputPass===!0){console.warn("THREE.WebGLRenderer: OutputPass is not needed in setEffects(). Tone mapping and color space conversion are applied automatically.");break}}y.setEffects(b||[])},this.getCurrentViewport=function(b){return b.copy(H)},this.getViewport=function(b){return b.copy($)},this.setViewport=function(b,F,K,W){b.isVector4?$.set(b.x,b.y,b.z,b.w):$.set(b,F,K,W),he.viewport(H.copy($).multiplyScalar(Le).round())},this.getScissor=function(b){return b.copy(oe)},this.setScissor=function(b,F,K,W){b.isVector4?oe.set(b.x,b.y,b.z,b.w):oe.set(b,F,K,W),he.scissor(k.copy(oe).multiplyScalar(Le).round())},this.getScissorTest=function(){return le},this.setScissorTest=function(b){he.setScissorTest(le=b)},this.setOpaqueSort=function(b){Qe=b},this.setTransparentSort=function(b){tt=b},this.getClearColor=function(b){return b.copy(Te.getClearColor())},this.setClearColor=function(){Te.setClearColor(...arguments)},this.getClearAlpha=function(){return Te.getClearAlpha()},this.setClearAlpha=function(){Te.setClearAlpha(...arguments)},this.clear=function(b=!0,F=!0,K=!0){let W=0;if(b){let V=!1;if(O!==null){const ge=O.texture.format;V=m.has(ge)}if(V){const ge=O.texture.type,Se=g.has(ge),_e=Te.getClearColor(),we=Te.getClearAlpha(),Ie=_e.r,Xe=_e.g,je=_e.b;Se?(S[0]=Ie,S[1]=Xe,S[2]=je,S[3]=we,L.clearBufferuiv(L.COLOR,0,S)):(v[0]=Ie,v[1]=Xe,v[2]=je,v[3]=we,L.clearBufferiv(L.COLOR,0,v))}else W|=L.COLOR_BUFFER_BIT}F&&(W|=L.DEPTH_BUFFER_BIT),K&&(W|=L.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),W!==0&&L.clear(W)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){t.removeEventListener("webglcontextlost",Ee,!1),t.removeEventListener("webglcontextrestored",We,!1),t.removeEventListener("webglcontextcreationerror",_t,!1),Te.dispose(),Fe.dispose(),se.dispose(),x.dispose(),X.dispose(),Ae.dispose(),ue.dispose(),Me.dispose(),de.dispose(),q.dispose(),q.removeEventListener("sessionstart",Hh),q.removeEventListener("sessionend",Gh),Ui.stop()};function Ee(b){b.preventDefault(),el("WebGLRenderer: Context Lost."),U=!0}function We(){el("WebGLRenderer: Context Restored."),U=!1;const b=w.autoReset,F=be.enabled,K=be.autoUpdate,W=be.needsUpdate,V=be.type;ae(),w.autoReset=b,be.enabled=F,be.autoUpdate=K,be.needsUpdate=W,be.type=V}function _t(b){ze("WebGLRenderer: A WebGL context could not be created. Reason: ",b.statusMessage)}function lt(b){const F=b.target;F.removeEventListener("dispose",lt),ti(F)}function ti(b){ni(b),x.remove(b)}function ni(b){const F=x.get(b).programs;F!==void 0&&(F.forEach(function(K){de.releaseProgram(K)}),b.isShaderMaterial&&de.releaseShaderCache(b))}this.renderBufferDirect=function(b,F,K,W,V,ge){F===null&&(F=re);const Se=V.isMesh&&V.matrixWorld.determinant()<0,_e=Lg(b,F,K,W,V);he.setMaterial(W,Se);let we=K.index,Ie=1;if(W.wireframe===!0){if(we=Y.getWireframeAttribute(K),we===void 0)return;Ie=2}const Xe=K.drawRange,je=K.attributes.position;let Ne=Xe.start*Ie,ht=(Xe.start+Xe.count)*Ie;ge!==null&&(Ne=Math.max(Ne,ge.start*Ie),ht=Math.min(ht,(ge.start+ge.count)*Ie)),we!==null?(Ne=Math.max(Ne,0),ht=Math.min(ht,we.count)):je!=null&&(Ne=Math.max(Ne,0),ht=Math.min(ht,je.count));const At=ht-Ne;if(At<0||At===1/0)return;ue.setup(V,W,_e,K,we);let St,dt=Je;if(we!==null&&(St=te.get(we),dt=D,dt.setIndex(St)),V.isMesh)W.wireframe===!0?(he.setLineWidth(W.wireframeLinewidth*me()),dt.setMode(L.LINES)):dt.setMode(L.TRIANGLES);else if(V.isLine){let Wt=W.linewidth;Wt===void 0&&(Wt=1),he.setLineWidth(Wt*me()),V.isLineSegments?dt.setMode(L.LINES):V.isLineLoop?dt.setMode(L.LINE_LOOP):dt.setMode(L.LINE_STRIP)}else V.isPoints?dt.setMode(L.POINTS):V.isSprite&&dt.setMode(L.TRIANGLES);if(V.isBatchedMesh)if(V._multiDrawInstances!==null)tl("WebGLRenderer: renderMultiDrawInstances has been deprecated and will be removed in r184. Append to renderMultiDraw arguments and use indirection."),dt.renderMultiDrawInstances(V._multiDrawStarts,V._multiDrawCounts,V._multiDrawCount,V._multiDrawInstances);else if(ye.get("WEBGL_multi_draw"))dt.renderMultiDraw(V._multiDrawStarts,V._multiDrawCounts,V._multiDrawCount);else{const Wt=V._multiDrawStarts,Ce=V._multiDrawCounts,an=V._multiDrawCount,st=we?te.get(we).bytesPerElement:1,An=x.get(W).currentProgram.getUniforms();for(let Fn=0;Fn<an;Fn++)An.setValue(L,"_gl_DrawID",Fn),dt.render(Wt[Fn]/st,Ce[Fn])}else if(V.isInstancedMesh)dt.renderInstances(Ne,At,V.count);else if(K.isInstancedBufferGeometry){const Wt=K._maxInstanceCount!==void 0?K._maxInstanceCount:1/0,Ce=Math.min(K.instanceCount,Wt);dt.renderInstances(Ne,At,Ce)}else dt.render(Ne,At)};function kh(b,F,K){b.transparent===!0&&b.side===wt&&b.forceSinglePass===!1?(b.side=Qt,b.needsUpdate=!0,Ra(b,F,K),b.side=gi,b.needsUpdate=!0,Ra(b,F,K),b.side=wt):Ra(b,F,K)}this.compile=function(b,F,K=null){K===null&&(K=b),T=se.get(K),T.init(F),R.push(T),K.traverseVisible(function(V){V.isLight&&V.layers.test(F.layers)&&(T.pushLight(V),V.castShadow&&T.pushShadow(V))}),b!==K&&b.traverseVisible(function(V){V.isLight&&V.layers.test(F.layers)&&(T.pushLight(V),V.castShadow&&T.pushShadow(V))}),T.setupLights();const W=new Set;return b.traverse(function(V){if(!(V.isMesh||V.isPoints||V.isLine||V.isSprite))return;const ge=V.material;if(ge)if(Array.isArray(ge))for(let Se=0;Se<ge.length;Se++){const _e=ge[Se];kh(_e,K,V),W.add(_e)}else kh(ge,K,V),W.add(ge)}),T=R.pop(),W},this.compileAsync=function(b,F,K=null){const W=this.compile(b,F,K);return new Promise(V=>{function ge(){if(W.forEach(function(Se){x.get(Se).currentProgram.isReady()&&W.delete(Se)}),W.size===0){V(b);return}setTimeout(ge,10)}ye.get("KHR_parallel_shader_compile")!==null?ge():setTimeout(ge,10)})};let El=null;function Rg(b){El&&El(b)}function Hh(){Ui.stop()}function Gh(){Ui.start()}const Ui=new om;Ui.setAnimationLoop(Rg),typeof self<"u"&&Ui.setContext(self),this.setAnimationLoop=function(b){El=b,q.setAnimationLoop(b),b===null?Ui.stop():Ui.start()},q.addEventListener("sessionstart",Hh),q.addEventListener("sessionend",Gh),this.render=function(b,F){if(F!==void 0&&F.isCamera!==!0){ze("WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(U===!0)return;const K=q.enabled===!0&&q.isPresenting===!0,W=y!==null&&(O===null||K)&&y.begin(A,O);if(b.matrixWorldAutoUpdate===!0&&b.updateMatrixWorld(),F.parent===null&&F.matrixWorldAutoUpdate===!0&&F.updateMatrixWorld(),q.enabled===!0&&q.isPresenting===!0&&(y===null||y.isCompositing()===!1)&&(q.cameraAutoUpdate===!0&&q.updateCamera(F),F=q.getCamera()),b.isScene===!0&&b.onBeforeRender(A,b,F,O),T=se.get(b,R.length),T.init(F),R.push(T),it.multiplyMatrices(F.projectionMatrix,F.matrixWorldInverse),Ue.setFromProjectionMatrix(it,Yn,F.reversedDepth),He=this.localClippingEnabled,Pe=ce.init(this.clippingPlanes,He),M=Fe.get(b,E.length),M.init(),E.push(M),q.enabled===!0&&q.isPresenting===!0){const Se=A.xr.getDepthSensingMesh();Se!==null&&Tl(Se,F,-1/0,A.sortObjects)}Tl(b,F,0,A.sortObjects),M.finish(),A.sortObjects===!0&&M.sort(Qe,tt),ne=q.enabled===!1||q.isPresenting===!1||q.hasDepthSensing()===!1,ne&&Te.addToRenderList(M,b),this.info.render.frame++,Pe===!0&&ce.beginShadows();const V=T.state.shadowsArray;if(be.render(V,b,F),Pe===!0&&ce.endShadows(),this.info.autoReset===!0&&this.info.reset(),(W&&y.hasRenderPass())===!1){const Se=M.opaque,_e=M.transmissive;if(T.setupLights(),F.isArrayCamera){const we=F.cameras;if(_e.length>0)for(let Ie=0,Xe=we.length;Ie<Xe;Ie++){const je=we[Ie];Wh(Se,_e,b,je)}ne&&Te.render(b);for(let Ie=0,Xe=we.length;Ie<Xe;Ie++){const je=we[Ie];Vh(M,b,je,je.viewport)}}else _e.length>0&&Wh(Se,_e,b,F),ne&&Te.render(b),Vh(M,b,F)}O!==null&&I===0&&(N.updateMultisampleRenderTarget(O),N.updateRenderTargetMipmap(O)),W&&y.end(A),b.isScene===!0&&b.onAfterRender(A,b,F),ue.resetDefaultState(),z=-1,B=null,R.pop(),R.length>0?(T=R[R.length-1],Pe===!0&&ce.setGlobalState(A.clippingPlanes,T.state.camera)):T=null,E.pop(),E.length>0?M=E[E.length-1]:M=null};function Tl(b,F,K,W){if(b.visible===!1)return;if(b.layers.test(F.layers)){if(b.isGroup)K=b.renderOrder;else if(b.isLOD)b.autoUpdate===!0&&b.update(F);else if(b.isLight)T.pushLight(b),b.castShadow&&T.pushShadow(b);else if(b.isSprite){if(!b.frustumCulled||Ue.intersectsSprite(b)){W&&ee.setFromMatrixPosition(b.matrixWorld).applyMatrix4(it);const Se=Ae.update(b),_e=b.material;_e.visible&&M.push(b,Se,_e,K,ee.z,null)}}else if((b.isMesh||b.isLine||b.isPoints)&&(!b.frustumCulled||Ue.intersectsObject(b))){const Se=Ae.update(b),_e=b.material;if(W&&(b.boundingSphere!==void 0?(b.boundingSphere===null&&b.computeBoundingSphere(),ee.copy(b.boundingSphere.center)):(Se.boundingSphere===null&&Se.computeBoundingSphere(),ee.copy(Se.boundingSphere.center)),ee.applyMatrix4(b.matrixWorld).applyMatrix4(it)),Array.isArray(_e)){const we=Se.groups;for(let Ie=0,Xe=we.length;Ie<Xe;Ie++){const je=we[Ie],Ne=_e[je.materialIndex];Ne&&Ne.visible&&M.push(b,Se,Ne,K,ee.z,je)}}else _e.visible&&M.push(b,Se,_e,K,ee.z,null)}}const ge=b.children;for(let Se=0,_e=ge.length;Se<_e;Se++)Tl(ge[Se],F,K,W)}function Vh(b,F,K,W){const{opaque:V,transmissive:ge,transparent:Se}=b;T.setupLightsView(K),Pe===!0&&ce.setGlobalState(A.clippingPlanes,K),W&&he.viewport(H.copy(W)),V.length>0&&Ca(V,F,K),ge.length>0&&Ca(ge,F,K),Se.length>0&&Ca(Se,F,K),he.buffers.depth.setTest(!0),he.buffers.depth.setMask(!0),he.buffers.color.setMask(!0),he.setPolygonOffset(!1)}function Wh(b,F,K,W){if((K.isScene===!0?K.overrideMaterial:null)!==null)return;if(T.state.transmissionRenderTarget[W.id]===void 0){const Ne=ye.has("EXT_color_buffer_half_float")||ye.has("EXT_color_buffer_float");T.state.transmissionRenderTarget[W.id]=new rn(1,1,{generateMipmaps:!0,type:Ne?hn:cn,minFilter:Pn,samples:Math.max(4,Be.samples),stencilBuffer:r,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:et.workingColorSpace})}const ge=T.state.transmissionRenderTarget[W.id],Se=W.viewport||H;ge.setSize(Se.z*A.transmissionResolutionScale,Se.w*A.transmissionResolutionScale);const _e=A.getRenderTarget(),we=A.getActiveCubeFace(),Ie=A.getActiveMipmapLevel();A.setRenderTarget(ge),A.getClearColor(G),Z=A.getClearAlpha(),Z<1&&A.setClearColor(16777215,.5),A.clear(),ne&&Te.render(K);const Xe=A.toneMapping;A.toneMapping=jn;const je=W.viewport;if(W.viewport!==void 0&&(W.viewport=void 0),T.setupLightsView(W),Pe===!0&&ce.setGlobalState(A.clippingPlanes,W),Ca(b,K,W),N.updateMultisampleRenderTarget(ge),N.updateRenderTargetMipmap(ge),ye.has("WEBGL_multisampled_render_to_texture")===!1){let Ne=!1;for(let ht=0,At=F.length;ht<At;ht++){const St=F[ht],{object:dt,geometry:Wt,material:Ce,group:an}=St;if(Ce.side===wt&&dt.layers.test(W.layers)){const st=Ce.side;Ce.side=Qt,Ce.needsUpdate=!0,Kh(dt,K,W,Wt,Ce,an),Ce.side=st,Ce.needsUpdate=!0,Ne=!0}}Ne===!0&&(N.updateMultisampleRenderTarget(ge),N.updateRenderTargetMipmap(ge))}A.setRenderTarget(_e,we,Ie),A.setClearColor(G,Z),je!==void 0&&(W.viewport=je),A.toneMapping=Xe}function Ca(b,F,K){const W=F.isScene===!0?F.overrideMaterial:null;for(let V=0,ge=b.length;V<ge;V++){const Se=b[V],{object:_e,geometry:we,group:Ie}=Se;let Xe=Se.material;Xe.allowOverride===!0&&W!==null&&(Xe=W),_e.layers.test(K.layers)&&Kh(_e,F,K,we,Xe,Ie)}}function Kh(b,F,K,W,V,ge){b.onBeforeRender(A,F,K,W,V,ge),b.modelViewMatrix.multiplyMatrices(K.matrixWorldInverse,b.matrixWorld),b.normalMatrix.getNormalMatrix(b.modelViewMatrix),V.onBeforeRender(A,F,K,W,b,ge),V.transparent===!0&&V.side===wt&&V.forceSinglePass===!1?(V.side=Qt,V.needsUpdate=!0,A.renderBufferDirect(K,F,W,V,b,ge),V.side=gi,V.needsUpdate=!0,A.renderBufferDirect(K,F,W,V,b,ge),V.side=wt):A.renderBufferDirect(K,F,W,V,b,ge),b.onAfterRender(A,F,K,W,V,ge)}function Ra(b,F,K){F.isScene!==!0&&(F=re);const W=x.get(b),V=T.state.lights,ge=T.state.shadowsArray,Se=V.state.version,_e=de.getParameters(b,V.state,ge,F,K),we=de.getProgramCacheKey(_e);let Ie=W.programs;W.environment=b.isMeshStandardMaterial||b.isMeshLambertMaterial||b.isMeshPhongMaterial?F.environment:null,W.fog=F.fog;const Xe=b.isMeshStandardMaterial||b.isMeshLambertMaterial&&!b.envMap||b.isMeshPhongMaterial&&!b.envMap;W.envMap=X.get(b.envMap||W.environment,Xe),W.envMapRotation=W.environment!==null&&b.envMap===null?F.environmentRotation:b.envMapRotation,Ie===void 0&&(b.addEventListener("dispose",lt),Ie=new Map,W.programs=Ie);let je=Ie.get(we);if(je!==void 0){if(W.currentProgram===je&&W.lightsStateVersion===Se)return Yh(b,_e),je}else _e.uniforms=de.getUniforms(b),b.onBeforeCompile(_e,A),je=de.acquireProgram(_e,we),Ie.set(we,je),W.uniforms=_e.uniforms;const Ne=W.uniforms;return(!b.isShaderMaterial&&!b.isRawShaderMaterial||b.clipping===!0)&&(Ne.clippingPlanes=ce.uniform),Yh(b,_e),W.needsLights=Ig(b),W.lightsStateVersion=Se,W.needsLights&&(Ne.ambientLightColor.value=V.state.ambient,Ne.lightProbe.value=V.state.probe,Ne.directionalLights.value=V.state.directional,Ne.directionalLightShadows.value=V.state.directionalShadow,Ne.spotLights.value=V.state.spot,Ne.spotLightShadows.value=V.state.spotShadow,Ne.rectAreaLights.value=V.state.rectArea,Ne.ltc_1.value=V.state.rectAreaLTC1,Ne.ltc_2.value=V.state.rectAreaLTC2,Ne.pointLights.value=V.state.point,Ne.pointLightShadows.value=V.state.pointShadow,Ne.hemisphereLights.value=V.state.hemi,Ne.directionalShadowMatrix.value=V.state.directionalShadowMatrix,Ne.spotLightMatrix.value=V.state.spotLightMatrix,Ne.spotLightMap.value=V.state.spotLightMap,Ne.pointShadowMatrix.value=V.state.pointShadowMatrix),W.currentProgram=je,W.uniformsList=null,je}function Xh(b){if(b.uniformsList===null){const F=b.currentProgram.getUniforms();b.uniformsList=ko.seqWithValue(F.seq,b.uniforms)}return b.uniformsList}function Yh(b,F){const K=x.get(b);K.outputColorSpace=F.outputColorSpace,K.batching=F.batching,K.batchingColor=F.batchingColor,K.instancing=F.instancing,K.instancingColor=F.instancingColor,K.instancingMorph=F.instancingMorph,K.skinning=F.skinning,K.morphTargets=F.morphTargets,K.morphNormals=F.morphNormals,K.morphColors=F.morphColors,K.morphTargetsCount=F.morphTargetsCount,K.numClippingPlanes=F.numClippingPlanes,K.numIntersection=F.numClipIntersection,K.vertexAlphas=F.vertexAlphas,K.vertexTangents=F.vertexTangents,K.toneMapping=F.toneMapping}function Lg(b,F,K,W,V){F.isScene!==!0&&(F=re),N.resetTextureUnits();const ge=F.fog,Se=W.isMeshStandardMaterial||W.isMeshLambertMaterial||W.isMeshPhongMaterial?F.environment:null,_e=O===null?A.outputColorSpace:O.isXRRenderTarget===!0?O.texture.colorSpace:en,we=W.isMeshStandardMaterial||W.isMeshLambertMaterial&&!W.envMap||W.isMeshPhongMaterial&&!W.envMap,Ie=X.get(W.envMap||Se,we),Xe=W.vertexColors===!0&&!!K.attributes.color&&K.attributes.color.itemSize===4,je=!!K.attributes.tangent&&(!!W.normalMap||W.anisotropy>0),Ne=!!K.morphAttributes.position,ht=!!K.morphAttributes.normal,At=!!K.morphAttributes.color;let St=jn;W.toneMapped&&(O===null||O.isXRRenderTarget===!0)&&(St=A.toneMapping);const dt=K.morphAttributes.position||K.morphAttributes.normal||K.morphAttributes.color,Wt=dt!==void 0?dt.length:0,Ce=x.get(W),an=T.state.lights;if(Pe===!0&&(He===!0||b!==B)){const Dt=b===B&&W.id===z;ce.setState(W,b,Dt)}let st=!1;W.version===Ce.__version?(Ce.needsLights&&Ce.lightsStateVersion!==an.state.version||Ce.outputColorSpace!==_e||V.isBatchedMesh&&Ce.batching===!1||!V.isBatchedMesh&&Ce.batching===!0||V.isBatchedMesh&&Ce.batchingColor===!0&&V.colorTexture===null||V.isBatchedMesh&&Ce.batchingColor===!1&&V.colorTexture!==null||V.isInstancedMesh&&Ce.instancing===!1||!V.isInstancedMesh&&Ce.instancing===!0||V.isSkinnedMesh&&Ce.skinning===!1||!V.isSkinnedMesh&&Ce.skinning===!0||V.isInstancedMesh&&Ce.instancingColor===!0&&V.instanceColor===null||V.isInstancedMesh&&Ce.instancingColor===!1&&V.instanceColor!==null||V.isInstancedMesh&&Ce.instancingMorph===!0&&V.morphTexture===null||V.isInstancedMesh&&Ce.instancingMorph===!1&&V.morphTexture!==null||Ce.envMap!==Ie||W.fog===!0&&Ce.fog!==ge||Ce.numClippingPlanes!==void 0&&(Ce.numClippingPlanes!==ce.numPlanes||Ce.numIntersection!==ce.numIntersection)||Ce.vertexAlphas!==Xe||Ce.vertexTangents!==je||Ce.morphTargets!==Ne||Ce.morphNormals!==ht||Ce.morphColors!==At||Ce.toneMapping!==St||Ce.morphTargetsCount!==Wt)&&(st=!0):(st=!0,Ce.__version=W.version);let An=Ce.currentProgram;st===!0&&(An=Ra(W,F,V));let Fn=!1,Oi=!1,os=!1;const mt=An.getUniforms(),Ft=Ce.uniforms;if(he.useProgram(An.program)&&(Fn=!0,Oi=!0,os=!0),W.id!==z&&(z=W.id,Oi=!0),Fn||B!==b){he.buffers.depth.getReversed()&&b.reversedDepth!==!0&&(b._reversedDepth=!0,b.updateProjectionMatrix()),mt.setValue(L,"projectionMatrix",b.projectionMatrix),mt.setValue(L,"viewMatrix",b.matrixWorldInverse);const xi=mt.map.cameraPosition;xi!==void 0&&xi.setValue(L,Ve.setFromMatrixPosition(b.matrixWorld)),Be.logarithmicDepthBuffer&&mt.setValue(L,"logDepthBufFC",2/(Math.log(b.far+1)/Math.LN2)),(W.isMeshPhongMaterial||W.isMeshToonMaterial||W.isMeshLambertMaterial||W.isMeshBasicMaterial||W.isMeshStandardMaterial||W.isShaderMaterial)&&mt.setValue(L,"isOrthographic",b.isOrthographicCamera===!0),B!==b&&(B=b,Oi=!0,os=!0)}if(Ce.needsLights&&(an.state.directionalShadowMap.length>0&&mt.setValue(L,"directionalShadowMap",an.state.directionalShadowMap,N),an.state.spotShadowMap.length>0&&mt.setValue(L,"spotShadowMap",an.state.spotShadowMap,N),an.state.pointShadowMap.length>0&&mt.setValue(L,"pointShadowMap",an.state.pointShadowMap,N)),V.isSkinnedMesh){mt.setOptional(L,V,"bindMatrix"),mt.setOptional(L,V,"bindMatrixInverse");const Dt=V.skeleton;Dt&&(Dt.boneTexture===null&&Dt.computeBoneTexture(),mt.setValue(L,"boneTexture",Dt.boneTexture,N))}V.isBatchedMesh&&(mt.setOptional(L,V,"batchingTexture"),mt.setValue(L,"batchingTexture",V._matricesTexture,N),mt.setOptional(L,V,"batchingIdTexture"),mt.setValue(L,"batchingIdTexture",V._indirectTexture,N),mt.setOptional(L,V,"batchingColorTexture"),V._colorsTexture!==null&&mt.setValue(L,"batchingColorTexture",V._colorsTexture,N));const yi=K.morphAttributes;if((yi.position!==void 0||yi.normal!==void 0||yi.color!==void 0)&&xe.update(V,K,An),(Oi||Ce.receiveShadow!==V.receiveShadow)&&(Ce.receiveShadow=V.receiveShadow,mt.setValue(L,"receiveShadow",V.receiveShadow)),(W.isMeshStandardMaterial||W.isMeshLambertMaterial||W.isMeshPhongMaterial)&&W.envMap===null&&F.environment!==null&&(Ft.envMapIntensity.value=F.environmentIntensity),Ft.dfgLUT!==void 0&&(Ft.dfgLUT.value=DA()),Oi&&(mt.setValue(L,"toneMappingExposure",A.toneMappingExposure),Ce.needsLights&&Pg(Ft,os),ge&&W.fog===!0&&De.refreshFogUniforms(Ft,ge),De.refreshMaterialUniforms(Ft,W,Le,Q,T.state.transmissionRenderTarget[b.id]),ko.upload(L,Xh(Ce),Ft,N)),W.isShaderMaterial&&W.uniformsNeedUpdate===!0&&(ko.upload(L,Xh(Ce),Ft,N),W.uniformsNeedUpdate=!1),W.isSpriteMaterial&&mt.setValue(L,"center",V.center),mt.setValue(L,"modelViewMatrix",V.modelViewMatrix),mt.setValue(L,"normalMatrix",V.normalMatrix),mt.setValue(L,"modelMatrix",V.matrixWorld),W.isShaderMaterial||W.isRawShaderMaterial){const Dt=W.uniformsGroups;for(let xi=0,ls=Dt.length;xi<ls;xi++){const qh=Dt[xi];Me.update(qh,An),Me.bind(qh,An)}}return An}function Pg(b,F){b.ambientLightColor.needsUpdate=F,b.lightProbe.needsUpdate=F,b.directionalLights.needsUpdate=F,b.directionalLightShadows.needsUpdate=F,b.pointLights.needsUpdate=F,b.pointLightShadows.needsUpdate=F,b.spotLights.needsUpdate=F,b.spotLightShadows.needsUpdate=F,b.rectAreaLights.needsUpdate=F,b.hemisphereLights.needsUpdate=F}function Ig(b){return b.isMeshLambertMaterial||b.isMeshToonMaterial||b.isMeshPhongMaterial||b.isMeshStandardMaterial||b.isShadowMaterial||b.isShaderMaterial&&b.lights===!0}this.getActiveCubeFace=function(){return C},this.getActiveMipmapLevel=function(){return I},this.getRenderTarget=function(){return O},this.setRenderTargetTextures=function(b,F,K){const W=x.get(b);W.__autoAllocateDepthBuffer=b.resolveDepthBuffer===!1,W.__autoAllocateDepthBuffer===!1&&(W.__useRenderToTexture=!1),x.get(b.texture).__webglTexture=F,x.get(b.depthTexture).__webglTexture=W.__autoAllocateDepthBuffer?void 0:K,W.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(b,F){const K=x.get(b);K.__webglFramebuffer=F,K.__useDefaultFramebuffer=F===void 0};const Dg=L.createFramebuffer();this.setRenderTarget=function(b,F=0,K=0){O=b,C=F,I=K;let W=null,V=!1,ge=!1;if(b){const _e=x.get(b);if(_e.__useDefaultFramebuffer!==void 0){he.bindFramebuffer(L.FRAMEBUFFER,_e.__webglFramebuffer),H.copy(b.viewport),k.copy(b.scissor),ie=b.scissorTest,he.viewport(H),he.scissor(k),he.setScissorTest(ie),z=-1;return}else if(_e.__webglFramebuffer===void 0)N.setupRenderTarget(b);else if(_e.__hasExternalTextures)N.rebindTextures(b,x.get(b.texture).__webglTexture,x.get(b.depthTexture).__webglTexture);else if(b.depthBuffer){const Xe=b.depthTexture;if(_e.__boundDepthTexture!==Xe){if(Xe!==null&&x.has(Xe)&&(b.width!==Xe.image.width||b.height!==Xe.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");N.setupDepthRenderbuffer(b)}}const we=b.texture;(we.isData3DTexture||we.isDataArrayTexture||we.isCompressedArrayTexture)&&(ge=!0);const Ie=x.get(b).__webglFramebuffer;b.isWebGLCubeRenderTarget?(Array.isArray(Ie[F])?W=Ie[F][K]:W=Ie[F],V=!0):b.samples>0&&N.useMultisampledRTT(b)===!1?W=x.get(b).__webglMultisampledFramebuffer:Array.isArray(Ie)?W=Ie[K]:W=Ie,H.copy(b.viewport),k.copy(b.scissor),ie=b.scissorTest}else H.copy($).multiplyScalar(Le).floor(),k.copy(oe).multiplyScalar(Le).floor(),ie=le;if(K!==0&&(W=Dg),he.bindFramebuffer(L.FRAMEBUFFER,W)&&he.drawBuffers(b,W),he.viewport(H),he.scissor(k),he.setScissorTest(ie),V){const _e=x.get(b.texture);L.framebufferTexture2D(L.FRAMEBUFFER,L.COLOR_ATTACHMENT0,L.TEXTURE_CUBE_MAP_POSITIVE_X+F,_e.__webglTexture,K)}else if(ge){const _e=F;for(let we=0;we<b.textures.length;we++){const Ie=x.get(b.textures[we]);L.framebufferTextureLayer(L.FRAMEBUFFER,L.COLOR_ATTACHMENT0+we,Ie.__webglTexture,K,_e)}}else if(b!==null&&K!==0){const _e=x.get(b.texture);L.framebufferTexture2D(L.FRAMEBUFFER,L.COLOR_ATTACHMENT0,L.TEXTURE_2D,_e.__webglTexture,K)}z=-1},this.readRenderTargetPixels=function(b,F,K,W,V,ge,Se,_e=0){if(!(b&&b.isWebGLRenderTarget)){ze("WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let we=x.get(b).__webglFramebuffer;if(b.isWebGLCubeRenderTarget&&Se!==void 0&&(we=we[Se]),we){he.bindFramebuffer(L.FRAMEBUFFER,we);try{const Ie=b.textures[_e],Xe=Ie.format,je=Ie.type;if(b.textures.length>1&&L.readBuffer(L.COLOR_ATTACHMENT0+_e),!Be.textureFormatReadable(Xe)){ze("WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!Be.textureTypeReadable(je)){ze("WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}F>=0&&F<=b.width-W&&K>=0&&K<=b.height-V&&L.readPixels(F,K,W,V,fe.convert(Xe),fe.convert(je),ge)}finally{const Ie=O!==null?x.get(O).__webglFramebuffer:null;he.bindFramebuffer(L.FRAMEBUFFER,Ie)}}},this.readRenderTargetPixelsAsync=async function(b,F,K,W,V,ge,Se,_e=0){if(!(b&&b.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let we=x.get(b).__webglFramebuffer;if(b.isWebGLCubeRenderTarget&&Se!==void 0&&(we=we[Se]),we)if(F>=0&&F<=b.width-W&&K>=0&&K<=b.height-V){he.bindFramebuffer(L.FRAMEBUFFER,we);const Ie=b.textures[_e],Xe=Ie.format,je=Ie.type;if(b.textures.length>1&&L.readBuffer(L.COLOR_ATTACHMENT0+_e),!Be.textureFormatReadable(Xe))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!Be.textureTypeReadable(je))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");const Ne=L.createBuffer();L.bindBuffer(L.PIXEL_PACK_BUFFER,Ne),L.bufferData(L.PIXEL_PACK_BUFFER,ge.byteLength,L.STREAM_READ),L.readPixels(F,K,W,V,fe.convert(Xe),fe.convert(je),0);const ht=O!==null?x.get(O).__webglFramebuffer:null;he.bindFramebuffer(L.FRAMEBUFFER,ht);const At=L.fenceSync(L.SYNC_GPU_COMMANDS_COMPLETE,0);return L.flush(),await x0(L,At,4),L.bindBuffer(L.PIXEL_PACK_BUFFER,Ne),L.getBufferSubData(L.PIXEL_PACK_BUFFER,0,ge),L.deleteBuffer(Ne),L.deleteSync(At),ge}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(b,F=null,K=0){const W=Math.pow(2,-K),V=Math.floor(b.image.width*W),ge=Math.floor(b.image.height*W),Se=F!==null?F.x:0,_e=F!==null?F.y:0;N.setTexture2D(b,0),L.copyTexSubImage2D(L.TEXTURE_2D,K,0,0,Se,_e,V,ge),he.unbindTexture()};const Ng=L.createFramebuffer(),Ug=L.createFramebuffer();this.copyTextureToTexture=function(b,F,K=null,W=null,V=0,ge=0){let Se,_e,we,Ie,Xe,je,Ne,ht,At;const St=b.isCompressedTexture?b.mipmaps[ge]:b.image;if(K!==null)Se=K.max.x-K.min.x,_e=K.max.y-K.min.y,we=K.isBox3?K.max.z-K.min.z:1,Ie=K.min.x,Xe=K.min.y,je=K.isBox3?K.min.z:0;else{const Ft=Math.pow(2,-V);Se=Math.floor(St.width*Ft),_e=Math.floor(St.height*Ft),b.isDataArrayTexture?we=St.depth:b.isData3DTexture?we=Math.floor(St.depth*Ft):we=1,Ie=0,Xe=0,je=0}W!==null?(Ne=W.x,ht=W.y,At=W.z):(Ne=0,ht=0,At=0);const dt=fe.convert(F.format),Wt=fe.convert(F.type);let Ce;F.isData3DTexture?(N.setTexture3D(F,0),Ce=L.TEXTURE_3D):F.isDataArrayTexture||F.isCompressedArrayTexture?(N.setTexture2DArray(F,0),Ce=L.TEXTURE_2D_ARRAY):(N.setTexture2D(F,0),Ce=L.TEXTURE_2D),L.pixelStorei(L.UNPACK_FLIP_Y_WEBGL,F.flipY),L.pixelStorei(L.UNPACK_PREMULTIPLY_ALPHA_WEBGL,F.premultiplyAlpha),L.pixelStorei(L.UNPACK_ALIGNMENT,F.unpackAlignment);const an=L.getParameter(L.UNPACK_ROW_LENGTH),st=L.getParameter(L.UNPACK_IMAGE_HEIGHT),An=L.getParameter(L.UNPACK_SKIP_PIXELS),Fn=L.getParameter(L.UNPACK_SKIP_ROWS),Oi=L.getParameter(L.UNPACK_SKIP_IMAGES);L.pixelStorei(L.UNPACK_ROW_LENGTH,St.width),L.pixelStorei(L.UNPACK_IMAGE_HEIGHT,St.height),L.pixelStorei(L.UNPACK_SKIP_PIXELS,Ie),L.pixelStorei(L.UNPACK_SKIP_ROWS,Xe),L.pixelStorei(L.UNPACK_SKIP_IMAGES,je);const os=b.isDataArrayTexture||b.isData3DTexture,mt=F.isDataArrayTexture||F.isData3DTexture;if(b.isDepthTexture){const Ft=x.get(b),yi=x.get(F),Dt=x.get(Ft.__renderTarget),xi=x.get(yi.__renderTarget);he.bindFramebuffer(L.READ_FRAMEBUFFER,Dt.__webglFramebuffer),he.bindFramebuffer(L.DRAW_FRAMEBUFFER,xi.__webglFramebuffer);for(let ls=0;ls<we;ls++)os&&(L.framebufferTextureLayer(L.READ_FRAMEBUFFER,L.COLOR_ATTACHMENT0,x.get(b).__webglTexture,V,je+ls),L.framebufferTextureLayer(L.DRAW_FRAMEBUFFER,L.COLOR_ATTACHMENT0,x.get(F).__webglTexture,ge,At+ls)),L.blitFramebuffer(Ie,Xe,Se,_e,Ne,ht,Se,_e,L.DEPTH_BUFFER_BIT,L.NEAREST);he.bindFramebuffer(L.READ_FRAMEBUFFER,null),he.bindFramebuffer(L.DRAW_FRAMEBUFFER,null)}else if(V!==0||b.isRenderTargetTexture||x.has(b)){const Ft=x.get(b),yi=x.get(F);he.bindFramebuffer(L.READ_FRAMEBUFFER,Ng),he.bindFramebuffer(L.DRAW_FRAMEBUFFER,Ug);for(let Dt=0;Dt<we;Dt++)os?L.framebufferTextureLayer(L.READ_FRAMEBUFFER,L.COLOR_ATTACHMENT0,Ft.__webglTexture,V,je+Dt):L.framebufferTexture2D(L.READ_FRAMEBUFFER,L.COLOR_ATTACHMENT0,L.TEXTURE_2D,Ft.__webglTexture,V),mt?L.framebufferTextureLayer(L.DRAW_FRAMEBUFFER,L.COLOR_ATTACHMENT0,yi.__webglTexture,ge,At+Dt):L.framebufferTexture2D(L.DRAW_FRAMEBUFFER,L.COLOR_ATTACHMENT0,L.TEXTURE_2D,yi.__webglTexture,ge),V!==0?L.blitFramebuffer(Ie,Xe,Se,_e,Ne,ht,Se,_e,L.COLOR_BUFFER_BIT,L.NEAREST):mt?L.copyTexSubImage3D(Ce,ge,Ne,ht,At+Dt,Ie,Xe,Se,_e):L.copyTexSubImage2D(Ce,ge,Ne,ht,Ie,Xe,Se,_e);he.bindFramebuffer(L.READ_FRAMEBUFFER,null),he.bindFramebuffer(L.DRAW_FRAMEBUFFER,null)}else mt?b.isDataTexture||b.isData3DTexture?L.texSubImage3D(Ce,ge,Ne,ht,At,Se,_e,we,dt,Wt,St.data):F.isCompressedArrayTexture?L.compressedTexSubImage3D(Ce,ge,Ne,ht,At,Se,_e,we,dt,St.data):L.texSubImage3D(Ce,ge,Ne,ht,At,Se,_e,we,dt,Wt,St):b.isDataTexture?L.texSubImage2D(L.TEXTURE_2D,ge,Ne,ht,Se,_e,dt,Wt,St.data):b.isCompressedTexture?L.compressedTexSubImage2D(L.TEXTURE_2D,ge,Ne,ht,St.width,St.height,dt,St.data):L.texSubImage2D(L.TEXTURE_2D,ge,Ne,ht,Se,_e,dt,Wt,St);L.pixelStorei(L.UNPACK_ROW_LENGTH,an),L.pixelStorei(L.UNPACK_IMAGE_HEIGHT,st),L.pixelStorei(L.UNPACK_SKIP_PIXELS,An),L.pixelStorei(L.UNPACK_SKIP_ROWS,Fn),L.pixelStorei(L.UNPACK_SKIP_IMAGES,Oi),ge===0&&F.generateMipmaps&&L.generateMipmap(Ce),he.unbindTexture()},this.initRenderTarget=function(b){x.get(b).__webglFramebuffer===void 0&&N.setupRenderTarget(b)},this.initTexture=function(b){b.isCubeTexture?N.setTextureCube(b,0):b.isData3DTexture?N.setTexture3D(b,0):b.isDataArrayTexture||b.isCompressedArrayTexture?N.setTexture2DArray(b,0):N.setTexture2D(b,0),he.unbindTexture()},this.resetState=function(){C=0,I=0,O=null,he.reset(),ue.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return Yn}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;const t=this.getContext();t.drawingBufferColorSpace=et._getDrawingBufferColorSpace(e),t.unpackColorSpace=et._getUnpackColorSpace()}}const bf={type:"change"},wh={type:"start"},fm={type:"end"},ho=new cr,Ef=new Ci,UA=Math.cos(70*lh.DEG2RAD),Tt=new P,tn=2*Math.PI,pt={NONE:-1,ROTATE:0,DOLLY:1,PAN:2,TOUCH_ROTATE:3,TOUCH_PAN:4,TOUCH_DOLLY_PAN:5,TOUCH_DOLLY_ROTATE:6},pc=1e-6;class OA extends ky{constructor(e,t=null){super(e,t),this.state=pt.NONE,this.target=new P,this.cursor=new P,this.minDistance=0,this.maxDistance=1/0,this.minZoom=0,this.maxZoom=1/0,this.minTargetRadius=0,this.maxTargetRadius=1/0,this.minPolarAngle=0,this.maxPolarAngle=Math.PI,this.minAzimuthAngle=-1/0,this.maxAzimuthAngle=1/0,this.enableDamping=!1,this.dampingFactor=.05,this.enableZoom=!0,this.zoomSpeed=1,this.enableRotate=!0,this.rotateSpeed=1,this.keyRotateSpeed=1,this.enablePan=!0,this.panSpeed=1,this.screenSpacePanning=!0,this.keyPanSpeed=7,this.zoomToCursor=!1,this.autoRotate=!1,this.autoRotateSpeed=2,this.keys={LEFT:"ArrowLeft",UP:"ArrowUp",RIGHT:"ArrowRight",BOTTOM:"ArrowDown"},this.mouseButtons={LEFT:ks.ROTATE,MIDDLE:ks.DOLLY,RIGHT:ks.PAN},this.touches={ONE:Bs.ROTATE,TWO:Bs.DOLLY_PAN},this.target0=this.target.clone(),this.position0=this.object.position.clone(),this.zoom0=this.object.zoom,this._cursorStyle="auto",this._domElementKeyEvents=null,this._lastPosition=new P,this._lastQuaternion=new Un,this._lastTargetPosition=new P,this._quat=new Un().setFromUnitVectors(e.up,new P(0,1,0)),this._quatInverse=this._quat.clone().invert(),this._spherical=new jd,this._sphericalDelta=new jd,this._scale=1,this._panOffset=new P,this._rotateStart=new j,this._rotateEnd=new j,this._rotateDelta=new j,this._panStart=new j,this._panEnd=new j,this._panDelta=new j,this._dollyStart=new j,this._dollyEnd=new j,this._dollyDelta=new j,this._dollyDirection=new P,this._mouse=new j,this._performCursorZoom=!1,this._pointers=[],this._pointerPositions={},this._controlActive=!1,this._onPointerMove=FA.bind(this),this._onPointerDown=BA.bind(this),this._onPointerUp=zA.bind(this),this._onContextMenu=XA.bind(this),this._onMouseWheel=GA.bind(this),this._onKeyDown=VA.bind(this),this._onTouchStart=WA.bind(this),this._onTouchMove=KA.bind(this),this._onMouseDown=kA.bind(this),this._onMouseMove=HA.bind(this),this._interceptControlDown=YA.bind(this),this._interceptControlUp=qA.bind(this),this.domElement!==null&&this.connect(this.domElement),this.update()}set cursorStyle(e){this._cursorStyle=e,e==="grab"?this.domElement.style.cursor="grab":this.domElement.style.cursor="auto"}get cursorStyle(){return this._cursorStyle}connect(e){super.connect(e),this.domElement.addEventListener("pointerdown",this._onPointerDown),this.domElement.addEventListener("pointercancel",this._onPointerUp),this.domElement.addEventListener("contextmenu",this._onContextMenu),this.domElement.addEventListener("wheel",this._onMouseWheel,{passive:!1}),this.domElement.getRootNode().addEventListener("keydown",this._interceptControlDown,{passive:!0,capture:!0}),this.domElement.style.touchAction="none"}disconnect(){this.domElement.removeEventListener("pointerdown",this._onPointerDown),this.domElement.ownerDocument.removeEventListener("pointermove",this._onPointerMove),this.domElement.ownerDocument.removeEventListener("pointerup",this._onPointerUp),this.domElement.removeEventListener("pointercancel",this._onPointerUp),this.domElement.removeEventListener("wheel",this._onMouseWheel),this.domElement.removeEventListener("contextmenu",this._onContextMenu),this.stopListenToKeyEvents(),this.domElement.getRootNode().removeEventListener("keydown",this._interceptControlDown,{capture:!0}),this.domElement.style.touchAction="auto"}dispose(){this.disconnect()}getPolarAngle(){return this._spherical.phi}getAzimuthalAngle(){return this._spherical.theta}getDistance(){return this.object.position.distanceTo(this.target)}listenToKeyEvents(e){e.addEventListener("keydown",this._onKeyDown),this._domElementKeyEvents=e}stopListenToKeyEvents(){this._domElementKeyEvents!==null&&(this._domElementKeyEvents.removeEventListener("keydown",this._onKeyDown),this._domElementKeyEvents=null)}saveState(){this.target0.copy(this.target),this.position0.copy(this.object.position),this.zoom0=this.object.zoom}reset(){this.target.copy(this.target0),this.object.position.copy(this.position0),this.object.zoom=this.zoom0,this.object.updateProjectionMatrix(),this.dispatchEvent(bf),this.update(),this.state=pt.NONE}pan(e,t){this._pan(e,t),this.update()}dollyIn(e){this._dollyIn(e),this.update()}dollyOut(e){this._dollyOut(e),this.update()}rotateLeft(e){this._rotateLeft(e),this.update()}rotateUp(e){this._rotateUp(e),this.update()}update(e=null){const t=this.object.position;Tt.copy(t).sub(this.target),Tt.applyQuaternion(this._quat),this._spherical.setFromVector3(Tt),this.autoRotate&&this.state===pt.NONE&&this._rotateLeft(this._getAutoRotationAngle(e)),this.enableDamping?(this._spherical.theta+=this._sphericalDelta.theta*this.dampingFactor,this._spherical.phi+=this._sphericalDelta.phi*this.dampingFactor):(this._spherical.theta+=this._sphericalDelta.theta,this._spherical.phi+=this._sphericalDelta.phi);let n=this.minAzimuthAngle,s=this.maxAzimuthAngle;isFinite(n)&&isFinite(s)&&(n<-Math.PI?n+=tn:n>Math.PI&&(n-=tn),s<-Math.PI?s+=tn:s>Math.PI&&(s-=tn),n<=s?this._spherical.theta=Math.max(n,Math.min(s,this._spherical.theta)):this._spherical.theta=this._spherical.theta>(n+s)/2?Math.max(n,this._spherical.theta):Math.min(s,this._spherical.theta)),this._spherical.phi=Math.max(this.minPolarAngle,Math.min(this.maxPolarAngle,this._spherical.phi)),this._spherical.makeSafe(),this.enableDamping===!0?this.target.addScaledVector(this._panOffset,this.dampingFactor):this.target.add(this._panOffset),this.target.sub(this.cursor),this.target.clampLength(this.minTargetRadius,this.maxTargetRadius),this.target.add(this.cursor);let r=!1;if(this.zoomToCursor&&this._performCursorZoom||this.object.isOrthographicCamera)this._spherical.radius=this._clampDistance(this._spherical.radius);else{const a=this._spherical.radius;this._spherical.radius=this._clampDistance(this._spherical.radius*this._scale),r=a!=this._spherical.radius}if(Tt.setFromSpherical(this._spherical),Tt.applyQuaternion(this._quatInverse),t.copy(this.target).add(Tt),this.object.lookAt(this.target),this.enableDamping===!0?(this._sphericalDelta.theta*=1-this.dampingFactor,this._sphericalDelta.phi*=1-this.dampingFactor,this._panOffset.multiplyScalar(1-this.dampingFactor)):(this._sphericalDelta.set(0,0,0),this._panOffset.set(0,0,0)),this.zoomToCursor&&this._performCursorZoom){let a=null;if(this.object.isPerspectiveCamera){const o=Tt.length();a=this._clampDistance(o*this._scale);const l=o-a;this.object.position.addScaledVector(this._dollyDirection,l),this.object.updateMatrixWorld(),r=!!l}else if(this.object.isOrthographicCamera){const o=new P(this._mouse.x,this._mouse.y,0);o.unproject(this.object);const l=this.object.zoom;this.object.zoom=Math.max(this.minZoom,Math.min(this.maxZoom,this.object.zoom/this._scale)),this.object.updateProjectionMatrix(),r=l!==this.object.zoom;const c=new P(this._mouse.x,this._mouse.y,0);c.unproject(this.object),this.object.position.sub(c).add(o),this.object.updateMatrixWorld(),a=Tt.length()}else console.warn("WARNING: OrbitControls.js encountered an unknown camera type - zoom to cursor disabled."),this.zoomToCursor=!1;a!==null&&(this.screenSpacePanning?this.target.set(0,0,-1).transformDirection(this.object.matrix).multiplyScalar(a).add(this.object.position):(ho.origin.copy(this.object.position),ho.direction.set(0,0,-1).transformDirection(this.object.matrix),Math.abs(this.object.up.dot(ho.direction))<UA?this.object.lookAt(this.target):(Ef.setFromNormalAndCoplanarPoint(this.object.up,this.target),ho.intersectPlane(Ef,this.target))))}else if(this.object.isOrthographicCamera){const a=this.object.zoom;this.object.zoom=Math.max(this.minZoom,Math.min(this.maxZoom,this.object.zoom/this._scale)),a!==this.object.zoom&&(this.object.updateProjectionMatrix(),r=!0)}return this._scale=1,this._performCursorZoom=!1,r||this._lastPosition.distanceToSquared(this.object.position)>pc||8*(1-this._lastQuaternion.dot(this.object.quaternion))>pc||this._lastTargetPosition.distanceToSquared(this.target)>pc?(this.dispatchEvent(bf),this._lastPosition.copy(this.object.position),this._lastQuaternion.copy(this.object.quaternion),this._lastTargetPosition.copy(this.target),!0):!1}_getAutoRotationAngle(e){return e!==null?tn/60*this.autoRotateSpeed*e:tn/60/60*this.autoRotateSpeed}_getZoomScale(e){const t=Math.abs(e*.01);return Math.pow(.95,this.zoomSpeed*t)}_rotateLeft(e){this._sphericalDelta.theta-=e}_rotateUp(e){this._sphericalDelta.phi-=e}_panLeft(e,t){Tt.setFromMatrixColumn(t,0),Tt.multiplyScalar(-e),this._panOffset.add(Tt)}_panUp(e,t){this.screenSpacePanning===!0?Tt.setFromMatrixColumn(t,1):(Tt.setFromMatrixColumn(t,0),Tt.crossVectors(this.object.up,Tt)),Tt.multiplyScalar(e),this._panOffset.add(Tt)}_pan(e,t){const n=this.domElement;if(this.object.isPerspectiveCamera){const s=this.object.position;Tt.copy(s).sub(this.target);let r=Tt.length();r*=Math.tan(this.object.fov/2*Math.PI/180),this._panLeft(2*e*r/n.clientHeight,this.object.matrix),this._panUp(2*t*r/n.clientHeight,this.object.matrix)}else this.object.isOrthographicCamera?(this._panLeft(e*(this.object.right-this.object.left)/this.object.zoom/n.clientWidth,this.object.matrix),this._panUp(t*(this.object.top-this.object.bottom)/this.object.zoom/n.clientHeight,this.object.matrix)):(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - pan disabled."),this.enablePan=!1)}_dollyOut(e){this.object.isPerspectiveCamera||this.object.isOrthographicCamera?this._scale/=e:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),this.enableZoom=!1)}_dollyIn(e){this.object.isPerspectiveCamera||this.object.isOrthographicCamera?this._scale*=e:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),this.enableZoom=!1)}_updateZoomParameters(e,t){if(!this.zoomToCursor)return;this._performCursorZoom=!0;const n=this.domElement.getBoundingClientRect(),s=e-n.left,r=t-n.top,a=n.width,o=n.height;this._mouse.x=s/a*2-1,this._mouse.y=-(r/o)*2+1,this._dollyDirection.set(this._mouse.x,this._mouse.y,1).unproject(this.object).sub(this.object.position).normalize()}_clampDistance(e){return Math.max(this.minDistance,Math.min(this.maxDistance,e))}_handleMouseDownRotate(e){this._rotateStart.set(e.clientX,e.clientY)}_handleMouseDownDolly(e){this._updateZoomParameters(e.clientX,e.clientX),this._dollyStart.set(e.clientX,e.clientY)}_handleMouseDownPan(e){this._panStart.set(e.clientX,e.clientY)}_handleMouseMoveRotate(e){this._rotateEnd.set(e.clientX,e.clientY),this._rotateDelta.subVectors(this._rotateEnd,this._rotateStart).multiplyScalar(this.rotateSpeed);const t=this.domElement;this._rotateLeft(tn*this._rotateDelta.x/t.clientHeight),this._rotateUp(tn*this._rotateDelta.y/t.clientHeight),this._rotateStart.copy(this._rotateEnd),this.update()}_handleMouseMoveDolly(e){this._dollyEnd.set(e.clientX,e.clientY),this._dollyDelta.subVectors(this._dollyEnd,this._dollyStart),this._dollyDelta.y>0?this._dollyOut(this._getZoomScale(this._dollyDelta.y)):this._dollyDelta.y<0&&this._dollyIn(this._getZoomScale(this._dollyDelta.y)),this._dollyStart.copy(this._dollyEnd),this.update()}_handleMouseMovePan(e){this._panEnd.set(e.clientX,e.clientY),this._panDelta.subVectors(this._panEnd,this._panStart).multiplyScalar(this.panSpeed),this._pan(this._panDelta.x,this._panDelta.y),this._panStart.copy(this._panEnd),this.update()}_handleMouseWheel(e){this._updateZoomParameters(e.clientX,e.clientY),e.deltaY<0?this._dollyIn(this._getZoomScale(e.deltaY)):e.deltaY>0&&this._dollyOut(this._getZoomScale(e.deltaY)),this.update()}_handleKeyDown(e){let t=!1;switch(e.code){case this.keys.UP:e.ctrlKey||e.metaKey||e.shiftKey?this.enableRotate&&this._rotateUp(tn*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(0,this.keyPanSpeed),t=!0;break;case this.keys.BOTTOM:e.ctrlKey||e.metaKey||e.shiftKey?this.enableRotate&&this._rotateUp(-tn*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(0,-this.keyPanSpeed),t=!0;break;case this.keys.LEFT:e.ctrlKey||e.metaKey||e.shiftKey?this.enableRotate&&this._rotateLeft(tn*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(this.keyPanSpeed,0),t=!0;break;case this.keys.RIGHT:e.ctrlKey||e.metaKey||e.shiftKey?this.enableRotate&&this._rotateLeft(-tn*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(-this.keyPanSpeed,0),t=!0;break}t&&(e.preventDefault(),this.update())}_handleTouchStartRotate(e){if(this._pointers.length===1)this._rotateStart.set(e.pageX,e.pageY);else{const t=this._getSecondPointerPosition(e),n=.5*(e.pageX+t.x),s=.5*(e.pageY+t.y);this._rotateStart.set(n,s)}}_handleTouchStartPan(e){if(this._pointers.length===1)this._panStart.set(e.pageX,e.pageY);else{const t=this._getSecondPointerPosition(e),n=.5*(e.pageX+t.x),s=.5*(e.pageY+t.y);this._panStart.set(n,s)}}_handleTouchStartDolly(e){const t=this._getSecondPointerPosition(e),n=e.pageX-t.x,s=e.pageY-t.y,r=Math.sqrt(n*n+s*s);this._dollyStart.set(0,r)}_handleTouchStartDollyPan(e){this.enableZoom&&this._handleTouchStartDolly(e),this.enablePan&&this._handleTouchStartPan(e)}_handleTouchStartDollyRotate(e){this.enableZoom&&this._handleTouchStartDolly(e),this.enableRotate&&this._handleTouchStartRotate(e)}_handleTouchMoveRotate(e){if(this._pointers.length==1)this._rotateEnd.set(e.pageX,e.pageY);else{const n=this._getSecondPointerPosition(e),s=.5*(e.pageX+n.x),r=.5*(e.pageY+n.y);this._rotateEnd.set(s,r)}this._rotateDelta.subVectors(this._rotateEnd,this._rotateStart).multiplyScalar(this.rotateSpeed);const t=this.domElement;this._rotateLeft(tn*this._rotateDelta.x/t.clientHeight),this._rotateUp(tn*this._rotateDelta.y/t.clientHeight),this._rotateStart.copy(this._rotateEnd)}_handleTouchMovePan(e){if(this._pointers.length===1)this._panEnd.set(e.pageX,e.pageY);else{const t=this._getSecondPointerPosition(e),n=.5*(e.pageX+t.x),s=.5*(e.pageY+t.y);this._panEnd.set(n,s)}this._panDelta.subVectors(this._panEnd,this._panStart).multiplyScalar(this.panSpeed),this._pan(this._panDelta.x,this._panDelta.y),this._panStart.copy(this._panEnd)}_handleTouchMoveDolly(e){const t=this._getSecondPointerPosition(e),n=e.pageX-t.x,s=e.pageY-t.y,r=Math.sqrt(n*n+s*s);this._dollyEnd.set(0,r),this._dollyDelta.set(0,Math.pow(this._dollyEnd.y/this._dollyStart.y,this.zoomSpeed)),this._dollyOut(this._dollyDelta.y),this._dollyStart.copy(this._dollyEnd);const a=(e.pageX+t.x)*.5,o=(e.pageY+t.y)*.5;this._updateZoomParameters(a,o)}_handleTouchMoveDollyPan(e){this.enableZoom&&this._handleTouchMoveDolly(e),this.enablePan&&this._handleTouchMovePan(e)}_handleTouchMoveDollyRotate(e){this.enableZoom&&this._handleTouchMoveDolly(e),this.enableRotate&&this._handleTouchMoveRotate(e)}_addPointer(e){this._pointers.push(e.pointerId)}_removePointer(e){delete this._pointerPositions[e.pointerId];for(let t=0;t<this._pointers.length;t++)if(this._pointers[t]==e.pointerId){this._pointers.splice(t,1);return}}_isTrackingPointer(e){for(let t=0;t<this._pointers.length;t++)if(this._pointers[t]==e.pointerId)return!0;return!1}_trackPointer(e){let t=this._pointerPositions[e.pointerId];t===void 0&&(t=new j,this._pointerPositions[e.pointerId]=t),t.set(e.pageX,e.pageY)}_getSecondPointerPosition(e){const t=e.pointerId===this._pointers[0]?this._pointers[1]:this._pointers[0];return this._pointerPositions[t]}_customWheelEvent(e){const t=e.deltaMode,n={clientX:e.clientX,clientY:e.clientY,deltaY:e.deltaY};switch(t){case 1:n.deltaY*=16;break;case 2:n.deltaY*=100;break}return e.ctrlKey&&!this._controlActive&&(n.deltaY*=10),n}}function BA(i){this.enabled!==!1&&(this._pointers.length===0&&(this.domElement.setPointerCapture(i.pointerId),this.domElement.ownerDocument.addEventListener("pointermove",this._onPointerMove),this.domElement.ownerDocument.addEventListener("pointerup",this._onPointerUp)),!this._isTrackingPointer(i)&&(this._addPointer(i),i.pointerType==="touch"?this._onTouchStart(i):this._onMouseDown(i),this._cursorStyle==="grab"&&(this.domElement.style.cursor="grabbing")))}function FA(i){this.enabled!==!1&&(i.pointerType==="touch"?this._onTouchMove(i):this._onMouseMove(i))}function zA(i){switch(this._removePointer(i),this._pointers.length){case 0:this.domElement.releasePointerCapture(i.pointerId),this.domElement.ownerDocument.removeEventListener("pointermove",this._onPointerMove),this.domElement.ownerDocument.removeEventListener("pointerup",this._onPointerUp),this.dispatchEvent(fm),this.state=pt.NONE,this._cursorStyle==="grab"&&(this.domElement.style.cursor="grab");break;case 1:const e=this._pointers[0],t=this._pointerPositions[e];this._onTouchStart({pointerId:e,pageX:t.x,pageY:t.y});break}}function kA(i){let e;switch(i.button){case 0:e=this.mouseButtons.LEFT;break;case 1:e=this.mouseButtons.MIDDLE;break;case 2:e=this.mouseButtons.RIGHT;break;default:e=-1}switch(e){case ks.DOLLY:if(this.enableZoom===!1)return;this._handleMouseDownDolly(i),this.state=pt.DOLLY;break;case ks.ROTATE:if(i.ctrlKey||i.metaKey||i.shiftKey){if(this.enablePan===!1)return;this._handleMouseDownPan(i),this.state=pt.PAN}else{if(this.enableRotate===!1)return;this._handleMouseDownRotate(i),this.state=pt.ROTATE}break;case ks.PAN:if(i.ctrlKey||i.metaKey||i.shiftKey){if(this.enableRotate===!1)return;this._handleMouseDownRotate(i),this.state=pt.ROTATE}else{if(this.enablePan===!1)return;this._handleMouseDownPan(i),this.state=pt.PAN}break;default:this.state=pt.NONE}this.state!==pt.NONE&&this.dispatchEvent(wh)}function HA(i){switch(this.state){case pt.ROTATE:if(this.enableRotate===!1)return;this._handleMouseMoveRotate(i);break;case pt.DOLLY:if(this.enableZoom===!1)return;this._handleMouseMoveDolly(i);break;case pt.PAN:if(this.enablePan===!1)return;this._handleMouseMovePan(i);break}}function GA(i){this.enabled===!1||this.enableZoom===!1||this.state!==pt.NONE||(i.preventDefault(),this.dispatchEvent(wh),this._handleMouseWheel(this._customWheelEvent(i)),this.dispatchEvent(fm))}function VA(i){this.enabled!==!1&&this._handleKeyDown(i)}function WA(i){switch(this._trackPointer(i),this._pointers.length){case 1:switch(this.touches.ONE){case Bs.ROTATE:if(this.enableRotate===!1)return;this._handleTouchStartRotate(i),this.state=pt.TOUCH_ROTATE;break;case Bs.PAN:if(this.enablePan===!1)return;this._handleTouchStartPan(i),this.state=pt.TOUCH_PAN;break;default:this.state=pt.NONE}break;case 2:switch(this.touches.TWO){case Bs.DOLLY_PAN:if(this.enableZoom===!1&&this.enablePan===!1)return;this._handleTouchStartDollyPan(i),this.state=pt.TOUCH_DOLLY_PAN;break;case Bs.DOLLY_ROTATE:if(this.enableZoom===!1&&this.enableRotate===!1)return;this._handleTouchStartDollyRotate(i),this.state=pt.TOUCH_DOLLY_ROTATE;break;default:this.state=pt.NONE}break;default:this.state=pt.NONE}this.state!==pt.NONE&&this.dispatchEvent(wh)}function KA(i){switch(this._trackPointer(i),this.state){case pt.TOUCH_ROTATE:if(this.enableRotate===!1)return;this._handleTouchMoveRotate(i),this.update();break;case pt.TOUCH_PAN:if(this.enablePan===!1)return;this._handleTouchMovePan(i),this.update();break;case pt.TOUCH_DOLLY_PAN:if(this.enableZoom===!1&&this.enablePan===!1)return;this._handleTouchMoveDollyPan(i),this.update();break;case pt.TOUCH_DOLLY_ROTATE:if(this.enableZoom===!1&&this.enableRotate===!1)return;this._handleTouchMoveDollyRotate(i),this.update();break;default:this.state=pt.NONE}}function XA(i){this.enabled!==!1&&i.preventDefault()}function YA(i){i.key==="Control"&&(this._controlActive=!0,this.domElement.getRootNode().addEventListener("keyup",this._interceptControlUp,{passive:!0,capture:!0}))}function qA(i){i.key==="Control"&&(this._controlActive=!1,this.domElement.getRootNode().removeEventListener("keyup",this._interceptControlUp,{passive:!0,capture:!0}))}const Ho={name:"CopyShader",uniforms:{tDiffuse:{value:null},opacity:{value:1}},vertexShader:`

		varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		uniform float opacity;

		uniform sampler2D tDiffuse;

		varying vec2 vUv;

		void main() {

			vec4 texel = texture2D( tDiffuse, vUv );
			gl_FragColor = opacity * texel;


		}`};class gr{constructor(){this.isPass=!0,this.enabled=!0,this.needsSwap=!0,this.clear=!1,this.renderToScreen=!1}setSize(){}render(){console.error("THREE.Pass: .render() must be implemented in derived pass.")}dispose(){}}const $A=new Ea(-1,1,1,-1,0,1);class JA extends nt{constructor(){super(),this.setAttribute("position",new ke([-1,3,0,-1,-1,0,3,-1,0],3)),this.setAttribute("uv",new ke([0,2,0,0,2,0],2))}}const jA=new JA;class Ch{constructor(e){this._mesh=new ot(jA,e)}dispose(){this._mesh.geometry.dispose()}render(e){e.render(this._mesh,$A)}get material(){return this._mesh.material}set material(e){this._mesh.material=e}}class pm extends gr{constructor(e,t="tDiffuse"){super(),this.textureID=t,this.uniforms=null,this.material=null,e instanceof Vt?(this.uniforms=e.uniforms,this.material=e):e&&(this.uniforms=Qi.clone(e.uniforms),this.material=new Vt({name:e.name!==void 0?e.name:"unspecified",defines:Object.assign({},e.defines),uniforms:this.uniforms,vertexShader:e.vertexShader,fragmentShader:e.fragmentShader})),this._fsQuad=new Ch(this.material)}render(e,t,n){this.uniforms[this.textureID]&&(this.uniforms[this.textureID].value=n.texture),this._fsQuad.material=this.material,this.renderToScreen?(e.setRenderTarget(null),this._fsQuad.render(e)):(e.setRenderTarget(t),this.clear&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),this._fsQuad.render(e))}dispose(){this.material.dispose(),this._fsQuad.dispose()}}class Tf extends gr{constructor(e,t){super(),this.scene=e,this.camera=t,this.clear=!0,this.needsSwap=!1,this.inverse=!1}render(e,t,n){const s=e.getContext(),r=e.state;r.buffers.color.setMask(!1),r.buffers.depth.setMask(!1),r.buffers.color.setLocked(!0),r.buffers.depth.setLocked(!0);let a,o;this.inverse?(a=0,o=1):(a=1,o=0),r.buffers.stencil.setTest(!0),r.buffers.stencil.setOp(s.REPLACE,s.REPLACE,s.REPLACE),r.buffers.stencil.setFunc(s.ALWAYS,a,4294967295),r.buffers.stencil.setClear(o),r.buffers.stencil.setLocked(!0),e.setRenderTarget(n),this.clear&&e.clear(),e.render(this.scene,this.camera),e.setRenderTarget(t),this.clear&&e.clear(),e.render(this.scene,this.camera),r.buffers.color.setLocked(!1),r.buffers.depth.setLocked(!1),r.buffers.color.setMask(!0),r.buffers.depth.setMask(!0),r.buffers.stencil.setLocked(!1),r.buffers.stencil.setFunc(s.EQUAL,1,4294967295),r.buffers.stencil.setOp(s.KEEP,s.KEEP,s.KEEP),r.buffers.stencil.setLocked(!0)}}class ZA extends gr{constructor(){super(),this.needsSwap=!1}render(e){e.state.buffers.stencil.setLocked(!1),e.state.buffers.stencil.setTest(!1)}}class QA{constructor(e,t){if(this.renderer=e,this._pixelRatio=e.getPixelRatio(),t===void 0){const n=e.getSize(new j);this._width=n.width,this._height=n.height,t=new rn(this._width*this._pixelRatio,this._height*this._pixelRatio,{type:hn}),t.texture.name="EffectComposer.rt1"}else this._width=t.width,this._height=t.height;this.renderTarget1=t,this.renderTarget2=t.clone(),this.renderTarget2.texture.name="EffectComposer.rt2",this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2,this.renderToScreen=!0,this.passes=[],this.copyPass=new pm(Ho),this.copyPass.material.blending=Jn,this.timer=new Ay}swapBuffers(){const e=this.readBuffer;this.readBuffer=this.writeBuffer,this.writeBuffer=e}addPass(e){this.passes.push(e),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}insertPass(e,t){this.passes.splice(t,0,e),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}removePass(e){const t=this.passes.indexOf(e);t!==-1&&this.passes.splice(t,1)}isLastEnabledPass(e){for(let t=e+1;t<this.passes.length;t++)if(this.passes[t].enabled)return!1;return!0}render(e){this.timer.update(),e===void 0&&(e=this.timer.getDelta());const t=this.renderer.getRenderTarget();let n=!1;for(let s=0,r=this.passes.length;s<r;s++){const a=this.passes[s];if(a.enabled!==!1){if(a.renderToScreen=this.renderToScreen&&this.isLastEnabledPass(s),a.render(this.renderer,this.writeBuffer,this.readBuffer,e,n),a.needsSwap){if(n){const o=this.renderer.getContext(),l=this.renderer.state.buffers.stencil;l.setFunc(o.NOTEQUAL,1,4294967295),this.copyPass.render(this.renderer,this.writeBuffer,this.readBuffer,e),l.setFunc(o.EQUAL,1,4294967295)}this.swapBuffers()}Tf!==void 0&&(a instanceof Tf?n=!0:a instanceof ZA&&(n=!1))}}this.renderer.setRenderTarget(t)}reset(e){if(e===void 0){const t=this.renderer.getSize(new j);this._pixelRatio=this.renderer.getPixelRatio(),this._width=t.width,this._height=t.height,e=this.renderTarget1.clone(),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.renderTarget1=e,this.renderTarget2=e.clone(),this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2}setSize(e,t){this._width=e,this._height=t;const n=this._width*this._pixelRatio,s=this._height*this._pixelRatio;this.renderTarget1.setSize(n,s),this.renderTarget2.setSize(n,s);for(let r=0;r<this.passes.length;r++)this.passes[r].setSize(n,s)}setPixelRatio(e){this._pixelRatio=e,this.setSize(this._width,this._height)}dispose(){this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.copyPass.dispose()}}class e1 extends gr{constructor(e,t,n=null,s=null,r=null){super(),this.scene=e,this.camera=t,this.overrideMaterial=n,this.clearColor=s,this.clearAlpha=r,this.clear=!0,this.clearDepth=!1,this.needsSwap=!1,this.isRenderPass=!0,this._oldClearColor=new ve}render(e,t,n){const s=e.autoClear;e.autoClear=!1;let r,a;this.overrideMaterial!==null&&(a=this.scene.overrideMaterial,this.scene.overrideMaterial=this.overrideMaterial),this.clearColor!==null&&(e.getClearColor(this._oldClearColor),e.setClearColor(this.clearColor,e.getClearAlpha())),this.clearAlpha!==null&&(r=e.getClearAlpha(),e.setClearAlpha(this.clearAlpha)),this.clearDepth==!0&&e.clearDepth(),e.setRenderTarget(this.renderToScreen?null:n),this.clear===!0&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),e.render(this.scene,this.camera),this.clearColor!==null&&e.setClearColor(this._oldClearColor),this.clearAlpha!==null&&e.setClearAlpha(r),this.overrideMaterial!==null&&(this.scene.overrideMaterial=a),e.autoClear=s}}const t1={uniforms:{tDiffuse:{value:null},luminosityThreshold:{value:1},smoothWidth:{value:1},defaultColor:{value:new ve(0)},defaultOpacity:{value:0}},vertexShader:`

		varying vec2 vUv;

		void main() {

			vUv = uv;

			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		uniform sampler2D tDiffuse;
		uniform vec3 defaultColor;
		uniform float defaultOpacity;
		uniform float luminosityThreshold;
		uniform float smoothWidth;

		varying vec2 vUv;

		void main() {

			vec4 texel = texture2D( tDiffuse, vUv );

			float v = luminance( texel.xyz );

			vec4 outputColor = vec4( defaultColor.rgb, defaultOpacity );

			float alpha = smoothstep( luminosityThreshold, luminosityThreshold + smoothWidth, v );

			gl_FragColor = mix( outputColor, texel, alpha );

		}`};class sr extends gr{constructor(e,t=1,n,s){super(),this.strength=t,this.radius=n,this.threshold=s,this.resolution=e!==void 0?new j(e.x,e.y):new j(256,256),this.clearColor=new ve(0,0,0),this.needsSwap=!1,this.renderTargetsHorizontal=[],this.renderTargetsVertical=[],this.nMips=5;let r=Math.round(this.resolution.x/2),a=Math.round(this.resolution.y/2);this.renderTargetBright=new rn(r,a,{type:hn}),this.renderTargetBright.texture.name="UnrealBloomPass.bright",this.renderTargetBright.texture.generateMipmaps=!1;for(let u=0;u<this.nMips;u++){const d=new rn(r,a,{type:hn});d.texture.name="UnrealBloomPass.h"+u,d.texture.generateMipmaps=!1,this.renderTargetsHorizontal.push(d);const h=new rn(r,a,{type:hn});h.texture.name="UnrealBloomPass.v"+u,h.texture.generateMipmaps=!1,this.renderTargetsVertical.push(h),r=Math.round(r/2),a=Math.round(a/2)}const o=t1;this.highPassUniforms=Qi.clone(o.uniforms),this.highPassUniforms.luminosityThreshold.value=s,this.highPassUniforms.smoothWidth.value=.01,this.materialHighPassFilter=new Vt({uniforms:this.highPassUniforms,vertexShader:o.vertexShader,fragmentShader:o.fragmentShader}),this.separableBlurMaterials=[];const l=[6,10,14,18,22];r=Math.round(this.resolution.x/2),a=Math.round(this.resolution.y/2);for(let u=0;u<this.nMips;u++)this.separableBlurMaterials.push(this._getSeparableBlurMaterial(l[u])),this.separableBlurMaterials[u].uniforms.invSize.value=new j(1/r,1/a),r=Math.round(r/2),a=Math.round(a/2);this.compositeMaterial=this._getCompositeMaterial(this.nMips),this.compositeMaterial.uniforms.blurTexture1.value=this.renderTargetsVertical[0].texture,this.compositeMaterial.uniforms.blurTexture2.value=this.renderTargetsVertical[1].texture,this.compositeMaterial.uniforms.blurTexture3.value=this.renderTargetsVertical[2].texture,this.compositeMaterial.uniforms.blurTexture4.value=this.renderTargetsVertical[3].texture,this.compositeMaterial.uniforms.blurTexture5.value=this.renderTargetsVertical[4].texture,this.compositeMaterial.uniforms.bloomStrength.value=t,this.compositeMaterial.uniforms.bloomRadius.value=.1;const c=[1,.8,.6,.4,.2];this.compositeMaterial.uniforms.bloomFactors.value=c,this.bloomTintColors=[new P(1,1,1),new P(1,1,1),new P(1,1,1),new P(1,1,1),new P(1,1,1)],this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors,this.copyUniforms=Qi.clone(Ho.uniforms),this.blendMaterial=new Vt({uniforms:this.copyUniforms,vertexShader:Ho.vertexShader,fragmentShader:Ho.fragmentShader,premultipliedAlpha:!0,blending:Ln,depthTest:!1,depthWrite:!1,transparent:!0}),this._oldClearColor=new ve,this._oldClearAlpha=1,this._basic=new Mt,this._fsQuad=new Ch(null)}dispose(){for(let e=0;e<this.renderTargetsHorizontal.length;e++)this.renderTargetsHorizontal[e].dispose();for(let e=0;e<this.renderTargetsVertical.length;e++)this.renderTargetsVertical[e].dispose();this.renderTargetBright.dispose();for(let e=0;e<this.separableBlurMaterials.length;e++)this.separableBlurMaterials[e].dispose();this.compositeMaterial.dispose(),this.blendMaterial.dispose(),this._basic.dispose(),this._fsQuad.dispose()}setSize(e,t){let n=Math.round(e/2),s=Math.round(t/2);this.renderTargetBright.setSize(n,s);for(let r=0;r<this.nMips;r++)this.renderTargetsHorizontal[r].setSize(n,s),this.renderTargetsVertical[r].setSize(n,s),this.separableBlurMaterials[r].uniforms.invSize.value=new j(1/n,1/s),n=Math.round(n/2),s=Math.round(s/2)}render(e,t,n,s,r){e.getClearColor(this._oldClearColor),this._oldClearAlpha=e.getClearAlpha();const a=e.autoClear;e.autoClear=!1,e.setClearColor(this.clearColor,0),r&&e.state.buffers.stencil.setTest(!1),this.renderToScreen&&(this._fsQuad.material=this._basic,this._basic.map=n.texture,e.setRenderTarget(null),e.clear(),this._fsQuad.render(e)),this.highPassUniforms.tDiffuse.value=n.texture,this.highPassUniforms.luminosityThreshold.value=this.threshold,this._fsQuad.material=this.materialHighPassFilter,e.setRenderTarget(this.renderTargetBright),e.clear(),this._fsQuad.render(e);let o=this.renderTargetBright;for(let l=0;l<this.nMips;l++)this._fsQuad.material=this.separableBlurMaterials[l],this.separableBlurMaterials[l].uniforms.colorTexture.value=o.texture,this.separableBlurMaterials[l].uniforms.direction.value=sr.BlurDirectionX,e.setRenderTarget(this.renderTargetsHorizontal[l]),e.clear(),this._fsQuad.render(e),this.separableBlurMaterials[l].uniforms.colorTexture.value=this.renderTargetsHorizontal[l].texture,this.separableBlurMaterials[l].uniforms.direction.value=sr.BlurDirectionY,e.setRenderTarget(this.renderTargetsVertical[l]),e.clear(),this._fsQuad.render(e),o=this.renderTargetsVertical[l];this._fsQuad.material=this.compositeMaterial,this.compositeMaterial.uniforms.bloomStrength.value=this.strength,this.compositeMaterial.uniforms.bloomRadius.value=this.radius,this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors,e.setRenderTarget(this.renderTargetsHorizontal[0]),e.clear(),this._fsQuad.render(e),this._fsQuad.material=this.blendMaterial,this.copyUniforms.tDiffuse.value=this.renderTargetsHorizontal[0].texture,r&&e.state.buffers.stencil.setTest(!0),this.renderToScreen?(e.setRenderTarget(null),this._fsQuad.render(e)):(e.setRenderTarget(n),this._fsQuad.render(e)),e.setClearColor(this._oldClearColor,this._oldClearAlpha),e.autoClear=a}_getSeparableBlurMaterial(e){const t=[],n=e/3;for(let s=0;s<e;s++)t.push(.39894*Math.exp(-.5*s*s/(n*n))/n);return new Vt({defines:{KERNEL_RADIUS:e},uniforms:{colorTexture:{value:null},invSize:{value:new j(.5,.5)},direction:{value:new j(.5,.5)},gaussianCoefficients:{value:t}},vertexShader:`

				varying vec2 vUv;

				void main() {

					vUv = uv;
					gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

				}`,fragmentShader:`

				#include <common>

				varying vec2 vUv;

				uniform sampler2D colorTexture;
				uniform vec2 invSize;
				uniform vec2 direction;
				uniform float gaussianCoefficients[KERNEL_RADIUS];

				void main() {

					float weightSum = gaussianCoefficients[0];
					vec3 diffuseSum = texture2D( colorTexture, vUv ).rgb * weightSum;

					for ( int i = 1; i < KERNEL_RADIUS; i ++ ) {

						float x = float( i );
						float w = gaussianCoefficients[i];
						vec2 uvOffset = direction * invSize * x;
						vec3 sample1 = texture2D( colorTexture, vUv + uvOffset ).rgb;
						vec3 sample2 = texture2D( colorTexture, vUv - uvOffset ).rgb;
						diffuseSum += ( sample1 + sample2 ) * w;

					}

					gl_FragColor = vec4( diffuseSum, 1.0 );

				}`})}_getCompositeMaterial(e){return new Vt({defines:{NUM_MIPS:e},uniforms:{blurTexture1:{value:null},blurTexture2:{value:null},blurTexture3:{value:null},blurTexture4:{value:null},blurTexture5:{value:null},bloomStrength:{value:1},bloomFactors:{value:null},bloomTintColors:{value:null},bloomRadius:{value:0}},vertexShader:`

				varying vec2 vUv;

				void main() {

					vUv = uv;
					gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

				}`,fragmentShader:`

				varying vec2 vUv;

				uniform sampler2D blurTexture1;
				uniform sampler2D blurTexture2;
				uniform sampler2D blurTexture3;
				uniform sampler2D blurTexture4;
				uniform sampler2D blurTexture5;
				uniform float bloomStrength;
				uniform float bloomRadius;
				uniform float bloomFactors[NUM_MIPS];
				uniform vec3 bloomTintColors[NUM_MIPS];

				float lerpBloomFactor( const in float factor ) {

					float mirrorFactor = 1.2 - factor;
					return mix( factor, mirrorFactor, bloomRadius );

				}

				void main() {

					// 3.0 for backwards compatibility with previous alpha-based intensity
					vec3 bloom = 3.0 * bloomStrength * (
						lerpBloomFactor( bloomFactors[ 0 ] ) * bloomTintColors[ 0 ] * texture2D( blurTexture1, vUv ).rgb +
						lerpBloomFactor( bloomFactors[ 1 ] ) * bloomTintColors[ 1 ] * texture2D( blurTexture2, vUv ).rgb +
						lerpBloomFactor( bloomFactors[ 2 ] ) * bloomTintColors[ 2 ] * texture2D( blurTexture3, vUv ).rgb +
						lerpBloomFactor( bloomFactors[ 3 ] ) * bloomTintColors[ 3 ] * texture2D( blurTexture4, vUv ).rgb +
						lerpBloomFactor( bloomFactors[ 4 ] ) * bloomTintColors[ 4 ] * texture2D( blurTexture5, vUv ).rgb
					);

					float bloomAlpha = max( bloom.r, max( bloom.g, bloom.b ) );
					gl_FragColor = vec4( bloom, bloomAlpha );

				}`})}}sr.BlurDirectionX=new j(1,0);sr.BlurDirectionY=new j(0,1);const fo={name:"OutputShader",uniforms:{tDiffuse:{value:null},toneMappingExposure:{value:1}},vertexShader:`
		precision highp float;

		uniform mat4 modelViewMatrix;
		uniform mat4 projectionMatrix;

		attribute vec3 position;
		attribute vec2 uv;

		varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		precision highp float;

		uniform sampler2D tDiffuse;

		#include <tonemapping_pars_fragment>
		#include <colorspace_pars_fragment>

		varying vec2 vUv;

		void main() {

			gl_FragColor = texture2D( tDiffuse, vUv );

			// tone mapping

			#ifdef LINEAR_TONE_MAPPING

				gl_FragColor.rgb = LinearToneMapping( gl_FragColor.rgb );

			#elif defined( REINHARD_TONE_MAPPING )

				gl_FragColor.rgb = ReinhardToneMapping( gl_FragColor.rgb );

			#elif defined( CINEON_TONE_MAPPING )

				gl_FragColor.rgb = CineonToneMapping( gl_FragColor.rgb );

			#elif defined( ACES_FILMIC_TONE_MAPPING )

				gl_FragColor.rgb = ACESFilmicToneMapping( gl_FragColor.rgb );

			#elif defined( AGX_TONE_MAPPING )

				gl_FragColor.rgb = AgXToneMapping( gl_FragColor.rgb );

			#elif defined( NEUTRAL_TONE_MAPPING )

				gl_FragColor.rgb = NeutralToneMapping( gl_FragColor.rgb );

			#elif defined( CUSTOM_TONE_MAPPING )

				gl_FragColor.rgb = CustomToneMapping( gl_FragColor.rgb );

			#endif

			// color space

			#ifdef SRGB_TRANSFER

				gl_FragColor = sRGBTransferOETF( gl_FragColor );

			#endif

		}`};class n1 extends gr{constructor(){super(),this.isOutputPass=!0,this.uniforms=Qi.clone(fo.uniforms),this.material=new tm({name:fo.name,uniforms:this.uniforms,vertexShader:fo.vertexShader,fragmentShader:fo.fragmentShader}),this._fsQuad=new Ch(this.material),this._outputColorSpace=null,this._toneMapping=null}render(e,t,n){this.uniforms.tDiffuse.value=n.texture,this.uniforms.toneMappingExposure.value=e.toneMappingExposure,(this._outputColorSpace!==e.outputColorSpace||this._toneMapping!==e.toneMapping)&&(this._outputColorSpace=e.outputColorSpace,this._toneMapping=e.toneMapping,this.material.defines={},et.getTransfer(this._outputColorSpace)===rt&&(this.material.defines.SRGB_TRANSFER=""),this._toneMapping===Ku?this.material.defines.LINEAR_TONE_MAPPING="":this._toneMapping===Xu?this.material.defines.REINHARD_TONE_MAPPING="":this._toneMapping===Yu?this.material.defines.CINEON_TONE_MAPPING="":this._toneMapping===dl?this.material.defines.ACES_FILMIC_TONE_MAPPING="":this._toneMapping===$u?this.material.defines.AGX_TONE_MAPPING="":this._toneMapping===Ju?this.material.defines.NEUTRAL_TONE_MAPPING="":this._toneMapping===qu&&(this.material.defines.CUSTOM_TONE_MAPPING=""),this.material.needsUpdate=!0),this.renderToScreen===!0?(e.setRenderTarget(null),this._fsQuad.render(e)):(e.setRenderTarget(t),this.clear&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),this._fsQuad.render(e))}dispose(){this.material.dispose(),this._fsQuad.dispose()}}const Ps=256;function wf(i,e){return Math.floor((i+180)/360*(1<<e))}function Cf(i,e){const t=i*Math.PI/180;return Math.floor((1-Math.log(Math.tan(t)+1/Math.cos(t))/Math.PI)/2*(1<<e))}function Rf(i,e){return i/(1<<e)*360-180}function Lf(i,e){const t=Math.PI-2*Math.PI*i/(1<<e);return 180/Math.PI*Math.atan(Math.sinh(t))}function i1(i){return new Promise(e=>{const t=new Image;t.crossOrigin="anonymous",t.onload=()=>e(t),t.onerror=()=>e(null),t.src=i})}async function Hr(i,e,t,n,s=600){const r=e-t,a=e+t,o=i-t,l=i+t,c=wf(r,n),u=wf(a,n),d=Cf(l,n),h=Cf(o,n),f=u-c+1,p=h-d+1,_=f*p;if(_>s)return console.warn(`[MapTiles] Skipping zoom ${n}: ${_} tiles exceeds ${s}`),null;const m=f*Ps,g=p*Ps,S=document.createElement("canvas");S.width=m,S.height=g;const v=S.getContext("2d");v.fillStyle="#050d1a",v.fillRect(0,0,m,g);const M=[];for(let A=d;A<=h;A++)for(let U=c;U<=u;U++)M.push({tx:U,ty:A});await Promise.all(M.map(({tx:A,ty:U})=>{const C=(A-c)*Ps,I=(U-d)*Ps,z=`https://${"abcd"[(A+U)%4]}.basemaps.cartocdn.com/dark_all/${n}/${A}/${U}@2x.png`;return i1(z).then(B=>{B&&v.drawImage(B,C,I,Ps,Ps)})}));const T=Rf(c,n),E=Rf(u+1,n),R=Lf(d,n),y=Lf(h+1,n);return{canvas:S,canvasLonMin:T,canvasLonMax:E,canvasLatMin:y,canvasLatMax:R}}function Gr(i,e,t,n,s){const r=new Ma(i.canvas);r.generateMipmaps=!0,r.minFilter=Pn,r.magFilter=yt,r.colorSpace=Ut,r.anisotropy=16;const a=(e-i.canvasLonMin)/(i.canvasLonMax-i.canvasLonMin),o=(n-i.canvasLatMin)/(i.canvasLatMax-i.canvasLatMin),l=(t-e)/(i.canvasLonMax-i.canvasLonMin),c=(s-n)/(i.canvasLatMax-i.canvasLatMin);return r.offset.set(a,o),r.repeat.set(l,c),r.wrapS=_n,r.wrapT=_n,r}async function s1(i,e,t,n){const s=t/2,r=e-s,a=e+s,o=i-s,l=i+s,c=await Hr(i,e,s,10);if(!c)throw new Error("Failed to load base map tiles");const u=Gr(c,r,a,o,l);return n&&r1(i,e,s,r,a,o,l,n),u}async function r1(i,e,t,n,s,r,a,o){try{const l=Math.min(t,1),c=await Hr(i,e,l,12,1e3);c&&o(Gr(c,e-l,e+l,i-l,i+l),{lonMin:e-l,lonMax:e+l,latMin:i-l,latMax:i+l});const u=.55,d=await Hr(i,e,u,13,1e3);d&&o(Gr(d,e-u,e+u,i-u,i+u),{lonMin:e-u,lonMax:e+u,latMin:i-u,latMax:i+u});const h=.35,f=await Hr(i,e,h,14,2e3);f&&o(Gr(f,e-h,e+h,i-h,i+h),{lonMin:e-h,lonMax:e+h,latMin:i-h,latMax:i+h});const p=.12,_=await Hr(i,e,p,16,2e3);_&&o(Gr(_,e-p,e+p,i-p,i+p),{lonMin:e-p,lonMax:e+p,latMin:i-p,latMax:i+p})}catch(l){console.warn("[MapTiles] High-res load failed:",l.message)}}const a1=["/api/ovp-ru/api/interpreter","/api/ovp-de/api/interpreter","/api/ovp-kumi/api/interpreter"],Fs=Math.PI/180;let Go=null,Os=null,Vo=0;function o1(){Vo++,Go=null,Os=null}async function l1(i,e,t=1.5){if(Go)return Go;if(Os)return Os;const n=Vo;Os=c1(i,e,t);try{const s=await Os;return Vo===n&&(Go=s),s}finally{Vo===n&&(Os=null)}}async function c1(i,e,t){const n=(i-t).toFixed(4),s=(i+t).toFixed(4),r=(e-t).toFixed(4),a=(e+t).toFixed(4),o=`
[out:json][timeout:30];
(
  way["aeroway"="runway"](${n},${r},${s},${a});
  way["aeroway"="taxiway"](${n},${r},${s},${a});
  way["aeroway"="terminal"](${n},${r},${s},${a});
  way["building"]["aeroway"](${n},${r},${s},${a});
  node["aeroway"="aerodrome"](${n},${r},${s},${a});
  way["aeroway"="aerodrome"](${n},${r},${s},${a});
  relation["aeroway"="aerodrome"](${n},${r},${s},${a});
);
out body geom;
`;let l;for(const c of a1)try{console.log(`[STRATUM] Trying Overpass: ${c}`);const u=new AbortController,d=setTimeout(()=>u.abort(),15e3),h=await fetch(c,{method:"POST",body:`data=${encodeURIComponent(o)}`,headers:{"Content-Type":"application/x-www-form-urlencoded"},signal:u.signal});if(clearTimeout(d),!h.ok)throw new Error(`HTTP ${h.status}`);const f=await h.json();return console.log(`[STRATUM] Overpass OK from ${c}`),u1(f)}catch(u){console.warn(`[STRATUM] Overpass failed (${c}):`,u.message),l=u}throw l||new Error("All Overpass endpoints failed")}function u1(i){const e=new Map,t=[],n=[],s=[];for(const r of i.elements){if(r.tags?.aeroway==="aerodrome"){const a=r.tags?.iata||"",o=r.tags?.icao||r.tags?.["icao:code"]||"";if(!a&&!o)continue;let l,c;if(r.type==="node")l=r.lat,c=r.lon;else if(r.bounds)l=(r.bounds.minlat+r.bounds.maxlat)/2,c=(r.bounds.minlon+r.bounds.maxlon)/2;else if(r.geometry?.length>0)l=r.geometry.reduce((d,h)=>d+h.lat,0)/r.geometry.length,c=r.geometry.reduce((d,h)=>d+h.lon,0)/r.geometry.length;else continue;const u=a||o;e.has(u)||e.set(u,{lat:l,lon:c,name:r.tags?.name||"",iata:a,icao:o})}if(r.type==="way"&&r.tags?.aeroway==="runway"&&r.geometry?.length>=2){const a=r.geometry,o=a[0],l=a[a.length-1],c=(l.lon-o.lon)*Math.cos((o.lat+l.lat)/2*Fs),u=l.lat-o.lat;let d=Math.atan2(c,u)/Fs;d<0&&(d+=360);const h=Ru(o.lat,o.lon,l.lat,l.lon);t.push({lat:(o.lat+l.lat)/2,lon:(o.lon+l.lon)/2,startLat:o.lat,startLon:o.lon,endLat:l.lat,endLon:l.lon,heading:d,length:h,width:parseFloat(r.tags?.width)||45,ref:r.tags?.ref||h1(d),surface:r.tags?.surface||"asphalt"})}r.type==="way"&&r.tags?.aeroway==="taxiway"&&r.geometry?.length>=2&&n.push({ref:r.tags?.ref||"",width:parseFloat(r.tags?.width)||20,geometry:r.geometry.map(a=>({lat:a.lat,lon:a.lon}))}),r.type==="way"&&r.geometry?.length>=3&&(r.tags?.aeroway==="terminal"||r.tags?.building&&r.tags?.aeroway)&&s.push({name:r.tags?.name||"",geometry:r.geometry.map(a=>({lat:a.lat,lon:a.lon}))})}return{airports:[...e.values()],runways:t,taxiways:n,terminals:s}}function Ru(i,e,t,n){const r=(t-i)*Fs,a=(n-e)*Fs,o=Math.sin(r/2)**2+Math.cos(i*Fs)*Math.cos(t*Fs)*Math.sin(a/2)**2;return 6371e3*2*Math.atan2(Math.sqrt(o),Math.sqrt(1-o))}function h1(i){const e=Math.round(i/10)%36||36,t=(e+18-1)%36+1;return`${String(e).padStart(2,"0")}/${String(t).padStart(2,"0")}`}function d1(i,e,t){const n=[],s=[],r=t.filter(a=>Ru(a.lat,a.lon,e.lat,e.lon)<5e3);for(const a of i){if(a.latitude==null||a.longitude==null)continue;const o=Ru(a.latitude,a.longitude,e.lat,e.lon);if(o>55e3)continue;const l=a.verticalRate||0,c=a.baroAltitude||0;l<-.5&&c<4e3?n.push(a):l>.5&&c<5e3?s.push(a):o<15e3&&c<1e3&&(l>.3?s.push(a):n.push(a))}return{arrivals:n,departures:s,runways:r}}const Vs=160,qt=40;let Gt=null,Li=null,pi=1;const sl=[];function f1(i){i.fog=new pl(new ve(.008,.032,.068),.013);const e=new yy(3822967,.7);i.add(e);const t=new am(10075101,.35);t.position.set(20,60,30),i.add(t);const n=new Ni(Vs,Vs);Gt=new Mt({color:16777215,transparent:!0,opacity:.95}),Li=new ot(n,Gt),Li.rotation.x=-Math.PI/2,Li.position.y=0,Li.name="ground",Gt.__scene=i,i.add(Li);const s=new ba(185,64,16,0,Math.PI*2,0,Math.PI*.5),r=s.attributes.position,a=new Float32Array(r.count*3);for(let R=0;R<r.count;R++){const y=r.getY(R),A=Math.max(0,y/95);a[R*3]=.008+A*.012,a[R*3+1]=.035+A*.03,a[R*3+2]=.07+A*.06}s.setAttribute("color",new ke(a,3));const o=new Mt({vertexColors:!0,side:Qt,fog:!1,depthWrite:!1}),l=new ot(s,o);l.renderOrder=-100,i.add(l);const c=new zy(Vs,160,663098,663098);c.material.transparent=!0,c.material.opacity=.08,c.material.depthWrite=!1,c.position.y=.005,i.add(c);const u=new In;u.name="userPulse";const d=new mh(.04,24),h=new Mt({color:16777215,transparent:!0,opacity:.9,side:wt}),f=new ot(d,h);f.rotation.x=-Math.PI/2,f.position.y=.06,u.add(f);const p=new ns({color:16777215,transparent:!0,opacity:.25}),_=.2,m=.08,g=[m,0,0,_,0,0,-m,0,0,-_,0,0,0,0,m,0,0,_,0,0,-m,0,0,-_],S=new nt;S.setAttribute("position",new ke(g,3));const v=new ji(S,p);v.position.y=.05,u.add(v);const M=new Qs(.12,.14,48),T=new Mt({color:16777215,transparent:!0,opacity:.15,side:wt}),E=new ot(M,T);E.rotation.x=-Math.PI/2,E.position.y=.04,E.name="pulseRing",Wo=E,u.add(E),i.add(u)}async function mm(i,e){pi=Math.cos(i*Math.PI/180),Li&&(Li.geometry.dispose(),Li.geometry=new Ni(Vs*pi,Vs));const t=Vs/qt;try{const n=await s1(i,e,t,(s,r)=>{if(r){const a=Gt?.__scene;if(!a)return;const o=(r.lonMax-r.lonMin)*qt*pi,l=(r.latMax-r.latMin)*qt,c=((r.lonMin+r.lonMax)/2-e)*qt*pi,u=-((r.latMin+r.latMax)/2-i)*qt,d=.003+sl.length*.002,h=new Ni(o,l),f=new Mt({map:s,transparent:!0,opacity:.95,color:16777215,depthWrite:!1}),p=new ot(h,f);p.rotation.x=-Math.PI/2,p.position.set(c,d,u),a.add(p),sl.push(p)}else Gt&&(Gt.map&&Gt.map.dispose(),Gt.map=s,Gt.needsUpdate=!0)});Gt&&(Gt.map=n,Gt.needsUpdate=!0)}catch(n){console.warn("[STRATUM] Failed to load map tiles:",n.message)}}const Nn=111e3/qt;let Bt=null,Rh=[],nn=null,gm=0,_m=0,Lu=0,Ws=null,Vr=[],ga=[],_a=[],ya=null,xa=null,Wo=null;async function ym(i,e,t){const n=Lu;gm=e,_m=t,ga=[],_a=[],ya=null,xa=null;try{if(nn=await l1(e,t,1.2),Lu!==n)return;if(Bt=new In,Bt.name="airports",Bt.renderOrder=50,nn.terminals)for(const a of nn.terminals)v1(a,e,t);nn.taxiways&&y1(nn.taxiways,e,t);for(const a of nn.runways)p1(a,e,t),g1(a,e,t);_1(nn.runways,e,t);for(const a of nn.airports)S1(a,e,t);i.add(Bt);const s=nn.taxiways?.length||0,r=nn.terminals?.length||0;console.log(`[STRATUM] Loaded ${nn.airports.length} airports, ${nn.runways.length} runways, ${s} taxiways, ${r} terminals`)}catch(s){console.warn("[STRATUM] Airport data fetch failed:",s.message)}}function es(i,e,t,n){return{x:(e-n)*qt*pi,z:-(i-t)*qt}}function p1(i,e,t){const n=(i.startLon-t)*qt*pi,s=-(i.startLat-e)*qt,r=(i.endLon-t)*qt*pi,a=-(i.endLat-e)*qt,o=r-n,l=a-s,c=Math.sqrt(o*o+l*l),u=Math.max(i.width/Nn,.012),d=Math.atan2(-l,o),h=(n+r)/2,f=(s+a)/2,p=m1(i.ref,i.length,i.width),_=new Ma(p);_.minFilter=Pn,_.magFilter=yt,_.anisotropy=4;const m=new Ni(c,u),g=new Mt({map:_,transparent:!0,opacity:.85,side:wt,depthWrite:!1}),S=new ot(m,g);S.rotation.x=-Math.PI/2,S.rotation.z=d,S.position.set(h,.038,f),Bt.add(S)}function m1(i,e,t){const r=document.createElement("canvas");r.width=2048,r.height=160;const a=r.getContext("2d"),o=2048/e;a.clearRect(0,0,2048,160),a.fillStyle="rgba(18, 24, 36, 0.75)",a.fillRect(0,0,2048,160),a.fillStyle="rgba(255,255,255,0.015)";for(let A=0;A<200;A++){const U=Math.random()*2048,C=Math.random()*160;a.fillRect(U,C,2+Math.random()*4,1)}a.fillStyle="rgba(255,255,255,0.45)";const l=Math.max(160*.025,2);a.fillRect(0,2,2048,l),a.fillRect(0,158-l,2048,l);const c=t>=45?12:t>=30?8:6,u=Math.max(o*1.5,5),d=160*.06,h=160*.7/c,f=(160-c*h)/2,p=Math.max(o*12,30);a.fillStyle="rgba(255,255,255,0.6)";for(let A=0;A<c;A++){const U=f+A*h;a.fillRect(p,U,u*8,d),a.fillRect(2048-p-u*8,U,u*8,d)}const _=i.split("/"),m=Math.floor(160*.55);a.font=`bold ${m}px Arial, sans-serif`,a.textAlign="center",a.textBaseline="middle",a.fillStyle="rgba(255,255,255,0.45)";const g=p+u*10;_[0]&&a.fillText(_[0],g,160/2),_[1]&&(a.save(),a.translate(2048-g,160/2),a.rotate(Math.PI),a.fillText(_[1],0,0),a.restore());const S=Math.max(30*o,12),v=Math.max(20*o,8);a.strokeStyle="rgba(255,255,255,0.35)",a.lineWidth=Math.max(160*.02,2),a.setLineDash([S,v]),a.beginPath(),a.moveTo(2048*.14,160/2),a.lineTo(2048*.86,160/2),a.stroke(),a.setLineDash([]);const M=300*o,T=150*o,E=Math.max(22*o,14),R=160*.1;a.fillStyle="rgba(255,255,255,0.3)";for(let A=0;A<3;A++){const U=M+A*T;if(U+E>2048*.4)break;a.fillRect(U,160*.2,E,R),a.fillRect(U,160*.7,E,R);const C=2048-U-E;a.fillRect(C,160*.2,E,R),a.fillRect(C,160*.7,E,R)}const y=Math.max(300*o,60);if(y<2048*.35){const A=Math.min(45*o,55),U=160*.3;a.fillStyle="rgba(255,255,255,0.35)",a.fillRect(y,(160-U)/2,A,U),a.fillRect(2048-y-A,(160-U)/2,A,U)}return r}function g1(i,e,t){const n=es(i.startLat,i.startLon,e,t),s=es(i.endLat,i.endLon,e,t),r=s.x-n.x,a=s.z-n.z,o=Math.sqrt(r*r+a*a);if(o<.1)return;const l=r/o,c=a/o;Pf(n.x,n.z,-l,-c),Pf(s.x,s.z,l,c)}function Pf(i,e,t,n,s){const r=900/Nn,a=30/Nn,o=Math.floor(r/a),l=[],c=[],u=-n,d=t;for(let _=1;_<=o;_++){const m=_*a,g=i+t*m,S=e+n*m;l.push(g,.03,S);const v=m*Nn;if(v<300?c.push(1,.2,.2):c.push(1,1,.85),Math.abs(v-150)<20||Math.abs(v-300)<20){const M=27/Nn,T=4;for(let E=-T;E<=T;E++){if(E===0)continue;const R=g+u*E*(M/T),y=S+d*E*(M/T);l.push(R,.03,y),c.push(1,1,.85)}}}if(l.length===0)return;const h=new nt;h.setAttribute("position",new ke(l,3)),h.setAttribute("color",new ke(c,3));const f=new is({size:.012,transparent:!0,opacity:.6,vertexColors:!0,sizeAttenuation:!0,depthWrite:!1,blending:Ln}),p=new ur(h,f);p.name="approachLights",_a.push(p),Bt.add(p)}function _1(i,e,t){const n=[],s=[];for(const l of i){const c=es(l.startLat,l.startLon,e,t),u=es(l.endLat,l.endLon,e,t),d=u.x-c.x,h=u.z-c.z,f=Math.sqrt(d*d+h*h);if(f<.1)continue;const p=d/f,m=-(h/f),g=p,S=Math.max(l.width/Nn*.5,.006),v=60/Nn,M=Math.floor(f/v);for(let T=0;T<=M;T++){const E=T/M,R=c.x+d*E,y=c.z+h*E;n.push(R+m*S,.035,y+g*S),n.push(R-m*S,.035,y-g*S);const A=E*f*Nn,U=(1-E)*f*Nn,C=Math.min(A,U);let I,O,z;C<300?(I=1,O=.15,z=.1):C<600?(I=1,O=.8,z=.2):(I=.9,O=.95,z=1),s.push(I,O,z,I,O,z)}}if(n.length===0)return;const r=new nt;r.setAttribute("position",new ke(n,3)),r.setAttribute("color",new ke(s,3));const a=new is({size:.008,transparent:!0,opacity:.5,vertexColors:!0,sizeAttenuation:!0,depthWrite:!1,blending:Ln}),o=new ur(r,a);o.name="runwayEdgeLights",ya=o,Bt.add(o)}function y1(i,e,t){if(!i||i.length===0)return;const n=[],s=[];for(const l of i){if(l.geometry.length<2)continue;const c=l.geometry.map(d=>es(d.lat,d.lon,e,t)),u=Math.max(l.width/Nn,.008);for(let d=0;d<c.length-1;d++){const h=c[d],f=c[d+1],p=f.x-h.x,_=f.z-h.z,m=Math.sqrt(p*p+_*_);if(m<.001)continue;const g=p/m,v=-(_/m)*u*.5,M=g*u*.5;n.push(h.x+v,.025,h.z+M,h.x-v,.025,h.z-M,f.x+v,.025,f.z+M,f.x+v,.025,f.z+M,h.x-v,.025,h.z-M,f.x-v,.025,f.z-M);for(let T=0;T<6;T++)s.push(.08,.12,.18)}}if(n.length===0)return;const r=new nt;r.setAttribute("position",new ke(n,3)),r.setAttribute("color",new ke(s,3));const a=new Mt({vertexColors:!0,transparent:!0,opacity:.55,side:wt,depthWrite:!1}),o=new ot(r,a);Bt.add(o),x1(i,e,t)}function x1(i,e,t){const n=[];for(const o of i){if(o.geometry.length<2)continue;const l=o.geometry.map(d=>es(d.lat,d.lon,e,t)),c=30/Nn;let u=0;for(let d=0;d<l.length-1;d++){const h=l[d],f=l[d+1],p=f.x-h.x,_=f.z-h.z,m=Math.sqrt(p*p+_*_);if(!(m<.001)){for(;u<m;){const g=u/m;n.push(h.x+p*g,.028,h.z+_*g),u+=c}u-=m}}}if(n.length===0)return;const s=new nt;s.setAttribute("position",new ke(n,3));const r=new is({color:2280550,size:.006,transparent:!0,opacity:.35,sizeAttenuation:!0,depthWrite:!1,blending:Ln}),a=new ur(s,r);a.name="taxiwayLights",xa=a,Bt.add(a)}function v1(i,e,t){if(!i.geometry||i.geometry.length<3)return;const n=i.geometry.map(_=>es(_.lat,_.lon,e,t)),s=new vh;s.moveTo(n[0].x,-n[0].z);for(let _=1;_<n.length;_++)s.lineTo(n[_].x,-n[_].z);s.closePath();const r=new Mh(s),a=new Mt({color:1714240,transparent:!0,opacity:.6,side:wt,depthWrite:!1}),o=new ot(r,a);o.rotation.x=-Math.PI/2,o.position.y=.02,Bt.add(o);const l=new Sh(s,{depth:.04,bevelEnabled:!1}),c=new Mt({color:1978448,transparent:!0,opacity:.35,side:wt,depthWrite:!1}),u=new ot(l,c);u.rotation.x=-Math.PI/2,u.position.y=.02,Bt.add(u);const d=[];for(let _=0;_<n.length;_++){const m=n[_],g=n[(_+1)%n.length];d.push(m.x,.065,m.z,g.x,.065,g.z)}const h=new nt;h.setAttribute("position",new ke(d,3));const f=new ns({color:5605546,transparent:!0,opacity:.2,depthWrite:!1}),p=new ji(h,f);Bt.add(p)}function S1(i,e,t){const n=(i.lon-t)*qt*pi,s=-(i.lat-e)*qt,r=i.iata||i.icao;if(!r)return;const a=document.createElement("canvas");a.width=512,a.height=160;const o=a.getContext("2d");if(o.fillStyle="rgba(90,172,255,0.3)",o.fillRect(216,8,80,1),o.font="500 72px Inter, system-ui, sans-serif",o.textAlign="center",o.textBaseline="middle",o.fillStyle="rgba(255,255,255,0.75)",o.fillText(r,256,58),i.name&&i.name!==r){o.font="300 26px Inter, system-ui, sans-serif",o.fillStyle="rgba(255,255,255,0.2)";const S=i.name.length>24?i.name.substring(0,24)+"...":i.name;o.fillText(S,256,112)}const l=new Ma(a);l.minFilter=yt,l.magFilter=yt,l.anisotropy=4;const c=new Xi({map:l,transparent:!0,depthWrite:!1,depthTest:!1,sizeAttenuation:!1}),u=new Us(c);u.scale.set(.11,.035,1),u.position.set(n,.5,s-.15),u.renderOrder=100,u.center.set(.5,0),Bt.add(u);const d=.05,h=new nt;h.setAttribute("position",new ke([0,0,-d,d,0,0,d,0,0,0,0,d,0,0,d,-d,0,0,-d,0,0,0,0,-d],3));const f=new ns({color:16777215,transparent:!0,opacity:.2}),p=new ji(h,f);p.position.set(n,.04,s),p.name="aptBeacon",ga.push(p),Bt.add(p);const _=new ba(1.5,6,6),m=new Mt({visible:!1}),g=new ot(_,m);g.position.set(n,.3,s),g.userData.airport=i,Bt.add(g),Rh.push(g)}function M1(i,e){ss(i);const t=(e.lon-_m)*qt*pi,n=-(e.lat-gm)*qt;Vr=[];const s=new Qs(1.2,1.4,64),r=new Mt({color:5087231,transparent:!0,opacity:.5,side:wt,depthWrite:!1}),a=new ot(s,r);a.rotation.x=-Math.PI/2,a.position.set(t,.05,n),i.add(a),Vr.push(a);const o=new Qs(2,2.15,64),l=new Mt({color:5087231,transparent:!0,opacity:.2,side:wt,depthWrite:!1}),c=new ot(o,l);c.rotation.x=-Math.PI/2,c.position.set(t,.046,n),c.name="_selPulse",i.add(c),Vr.push(c),Ws={objects:Vr,cx:t,cz:n}}function ss(i){if(Ws){for(const e of Ws.objects)i.remove(e),e.geometry&&e.geometry.dispose(),e.material&&(e.material.map&&e.material.map.dispose(),e.material.dispose());Ws=null,Vr=[]}}function A1(i,e){if(Wo){const s=e%5/5,r=1+s*3;Wo.scale.set(r,r,1),Wo.material.opacity=.15*(1-s*s)}const t=.15+.1*Math.sin(e*1.5);for(let s=0;s<ga.length;s++)ga[s].material.opacity=t;const n=.4+.2*Math.sin(e*2);for(let s=0;s<_a.length;s++)_a[s].material.opacity=n;if(ya&&(ya.material.opacity=.35+.15*Math.sin(e*1.8+.5)),xa&&(xa.material.opacity=.25+.1*Math.sin(e*1.2+1)),Ws){for(const s of Ws.objects)if(s.name==="_selPulse"){const r=e%2/2;s.scale.set(1+r*.5,1,1+r*.5),s.material.opacity=.2*(1-r)}}}function b1(i){for(const e of sl)i.remove(e),e.geometry&&e.geometry.dispose(),e.material&&(e.material.map&&e.material.map.dispose(),e.material.dispose());sl.length=0,Gt&&Gt.map&&(Gt.map.dispose(),Gt.map=null,Gt.needsUpdate=!0)}function E1(i){Lu++,o1(),ss(i),Bt&&(i.remove(Bt),Bt=null),Rh.length=0,nn=null,ga.length=0,_a.length=0,ya=null,xa=null}function xm(){return Rh}function Lh(){return nn}const If=new dn,po=new P;class vm extends xy{constructor(){super(),this.isLineSegmentsGeometry=!0,this.type="LineSegmentsGeometry";const e=[-1,2,0,1,2,0,-1,1,0,1,1,0,-1,0,0,1,0,0,-1,-1,0,1,-1,0],t=[-1,2,1,2,-1,1,1,1,-1,-1,1,-1,-1,-2,1,-2],n=[0,2,1,2,3,1,2,4,3,4,5,3,4,6,5,6,7,5];this.setIndex(n),this.setAttribute("position",new ke(e,3)),this.setAttribute("uv",new ke(t,2))}applyMatrix4(e){const t=this.attributes.instanceStart,n=this.attributes.instanceEnd;return t!==void 0&&(t.applyMatrix4(e),n.applyMatrix4(e),t.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}setPositions(e){let t;e instanceof Float32Array?t=e:Array.isArray(e)&&(t=new Float32Array(e));const n=new Eu(t,6,1);return this.setAttribute("instanceStart",new Dn(n,3,0)),this.setAttribute("instanceEnd",new Dn(n,3,3)),this.instanceCount=this.attributes.instanceStart.count,this.computeBoundingBox(),this.computeBoundingSphere(),this}setColors(e){let t;e instanceof Float32Array?t=e:Array.isArray(e)&&(t=new Float32Array(e));const n=new Eu(t,6,1);return this.setAttribute("instanceColorStart",new Dn(n,3,0)),this.setAttribute("instanceColorEnd",new Dn(n,3,3)),this}fromWireframeGeometry(e){return this.setPositions(e.attributes.position.array),this}fromEdgesGeometry(e){return this.setPositions(e.attributes.position.array),this}fromMesh(e){return this.fromWireframeGeometry(new X_(e.geometry)),this}fromLineSegments(e){const t=e.geometry;return this.setPositions(t.attributes.position.array),this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new dn);const e=this.attributes.instanceStart,t=this.attributes.instanceEnd;e!==void 0&&t!==void 0&&(this.boundingBox.setFromBufferAttribute(e),If.setFromBufferAttribute(t),this.boundingBox.union(If))}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new Mn),this.boundingBox===null&&this.computeBoundingBox();const e=this.attributes.instanceStart,t=this.attributes.instanceEnd;if(e!==void 0&&t!==void 0){const n=this.boundingSphere.center;this.boundingBox.getCenter(n);let s=0;for(let r=0,a=e.count;r<a;r++)po.fromBufferAttribute(e,r),s=Math.max(s,n.distanceToSquared(po)),po.fromBufferAttribute(t,r),s=Math.max(s,n.distanceToSquared(po));this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&console.error("THREE.LineSegmentsGeometry.computeBoundingSphere(): Computed radius is NaN. The instanced position data is likely to have NaN values.",this)}}toJSON(){}}pe.line={worldUnits:{value:1},linewidth:{value:1},resolution:{value:new j(1,1)},dashOffset:{value:0},dashScale:{value:1},dashSize:{value:1},gapSize:{value:1}};sn.line={uniforms:Qi.merge([pe.common,pe.fog,pe.line]),vertexShader:`
		#include <common>
		#include <color_pars_vertex>
		#include <fog_pars_vertex>
		#include <logdepthbuf_pars_vertex>
		#include <clipping_planes_pars_vertex>

		uniform float linewidth;
		uniform vec2 resolution;

		attribute vec3 instanceStart;
		attribute vec3 instanceEnd;

		attribute vec3 instanceColorStart;
		attribute vec3 instanceColorEnd;

		#ifdef WORLD_UNITS

			varying vec4 worldPos;
			varying vec3 worldStart;
			varying vec3 worldEnd;

			#ifdef USE_DASH

				varying vec2 vUv;

			#endif

		#else

			varying vec2 vUv;

		#endif

		#ifdef USE_DASH

			uniform float dashScale;
			attribute float instanceDistanceStart;
			attribute float instanceDistanceEnd;
			varying float vLineDistance;

		#endif

		void trimSegment( const in vec4 start, inout vec4 end ) {

			// trim end segment so it terminates between the camera plane and the near plane

			// conservative estimate of the near plane
			float a = projectionMatrix[ 2 ][ 2 ]; // 3nd entry in 3th column
			float b = projectionMatrix[ 3 ][ 2 ]; // 3nd entry in 4th column
			float nearEstimate = - 0.5 * b / a;

			float alpha = ( nearEstimate - start.z ) / ( end.z - start.z );

			end.xyz = mix( start.xyz, end.xyz, alpha );

		}

		void main() {

			#ifdef USE_COLOR

				vColor.xyz = ( position.y < 0.5 ) ? instanceColorStart : instanceColorEnd;

			#endif

			#ifdef USE_DASH

				vLineDistance = ( position.y < 0.5 ) ? dashScale * instanceDistanceStart : dashScale * instanceDistanceEnd;
				vUv = uv;

			#endif

			float aspect = resolution.x / resolution.y;

			// camera space
			vec4 start = modelViewMatrix * vec4( instanceStart, 1.0 );
			vec4 end = modelViewMatrix * vec4( instanceEnd, 1.0 );

			#ifdef WORLD_UNITS

				worldStart = start.xyz;
				worldEnd = end.xyz;

			#else

				vUv = uv;

			#endif

			// special case for perspective projection, and segments that terminate either in, or behind, the camera plane
			// clearly the gpu firmware has a way of addressing this issue when projecting into ndc space
			// but we need to perform ndc-space calculations in the shader, so we must address this issue directly
			// perhaps there is a more elegant solution -- WestLangley

			bool perspective = ( projectionMatrix[ 2 ][ 3 ] == - 1.0 ); // 4th entry in the 3rd column

			if ( perspective ) {

				if ( start.z < 0.0 && end.z >= 0.0 ) {

					trimSegment( start, end );

				} else if ( end.z < 0.0 && start.z >= 0.0 ) {

					trimSegment( end, start );

				}

			}

			// clip space
			vec4 clipStart = projectionMatrix * start;
			vec4 clipEnd = projectionMatrix * end;

			// ndc space
			vec3 ndcStart = clipStart.xyz / clipStart.w;
			vec3 ndcEnd = clipEnd.xyz / clipEnd.w;

			// direction
			vec2 dir = ndcEnd.xy - ndcStart.xy;

			// account for clip-space aspect ratio
			dir.x *= aspect;
			dir = normalize( dir );

			#ifdef WORLD_UNITS

				vec3 worldDir = normalize( end.xyz - start.xyz );
				vec3 tmpFwd = normalize( mix( start.xyz, end.xyz, 0.5 ) );
				vec3 worldUp = normalize( cross( worldDir, tmpFwd ) );
				vec3 worldFwd = cross( worldDir, worldUp );
				worldPos = position.y < 0.5 ? start: end;

				// height offset
				float hw = linewidth * 0.5;
				worldPos.xyz += position.x < 0.0 ? hw * worldUp : - hw * worldUp;

				// don't extend the line if we're rendering dashes because we
				// won't be rendering the endcaps
				#ifndef USE_DASH

					// cap extension
					worldPos.xyz += position.y < 0.5 ? - hw * worldDir : hw * worldDir;

					// add width to the box
					worldPos.xyz += worldFwd * hw;

					// endcaps
					if ( position.y > 1.0 || position.y < 0.0 ) {

						worldPos.xyz -= worldFwd * 2.0 * hw;

					}

				#endif

				// project the worldpos
				vec4 clip = projectionMatrix * worldPos;

				// shift the depth of the projected points so the line
				// segments overlap neatly
				vec3 clipPose = ( position.y < 0.5 ) ? ndcStart : ndcEnd;
				clip.z = clipPose.z * clip.w;

			#else

				vec2 offset = vec2( dir.y, - dir.x );
				// undo aspect ratio adjustment
				dir.x /= aspect;
				offset.x /= aspect;

				// sign flip
				if ( position.x < 0.0 ) offset *= - 1.0;

				// endcaps
				if ( position.y < 0.0 ) {

					offset += - dir;

				} else if ( position.y > 1.0 ) {

					offset += dir;

				}

				// adjust for linewidth
				offset *= linewidth;

				// adjust for clip-space to screen-space conversion // maybe resolution should be based on viewport ...
				offset /= resolution.y;

				// select end
				vec4 clip = ( position.y < 0.5 ) ? clipStart : clipEnd;

				// back to clip space
				offset *= clip.w;

				clip.xy += offset;

			#endif

			gl_Position = clip;

			vec4 mvPosition = ( position.y < 0.5 ) ? start : end; // this is an approximation

			#include <logdepthbuf_vertex>
			#include <clipping_planes_vertex>
			#include <fog_vertex>

		}
		`,fragmentShader:`
		uniform vec3 diffuse;
		uniform float opacity;
		uniform float linewidth;

		#ifdef USE_DASH

			uniform float dashOffset;
			uniform float dashSize;
			uniform float gapSize;

		#endif

		varying float vLineDistance;

		#ifdef WORLD_UNITS

			varying vec4 worldPos;
			varying vec3 worldStart;
			varying vec3 worldEnd;

			#ifdef USE_DASH

				varying vec2 vUv;

			#endif

		#else

			varying vec2 vUv;

		#endif

		#include <common>
		#include <color_pars_fragment>
		#include <fog_pars_fragment>
		#include <logdepthbuf_pars_fragment>
		#include <clipping_planes_pars_fragment>

		vec2 closestLineToLine(vec3 p1, vec3 p2, vec3 p3, vec3 p4) {

			float mua;
			float mub;

			vec3 p13 = p1 - p3;
			vec3 p43 = p4 - p3;

			vec3 p21 = p2 - p1;

			float d1343 = dot( p13, p43 );
			float d4321 = dot( p43, p21 );
			float d1321 = dot( p13, p21 );
			float d4343 = dot( p43, p43 );
			float d2121 = dot( p21, p21 );

			float denom = d2121 * d4343 - d4321 * d4321;

			float numer = d1343 * d4321 - d1321 * d4343;

			mua = numer / denom;
			mua = clamp( mua, 0.0, 1.0 );
			mub = ( d1343 + d4321 * ( mua ) ) / d4343;
			mub = clamp( mub, 0.0, 1.0 );

			return vec2( mua, mub );

		}

		void main() {

			float alpha = opacity;
			vec4 diffuseColor = vec4( diffuse, alpha );

			#include <clipping_planes_fragment>

			#ifdef USE_DASH

				if ( vUv.y < - 1.0 || vUv.y > 1.0 ) discard; // discard endcaps

				if ( mod( vLineDistance + dashOffset, dashSize + gapSize ) > dashSize ) discard; // todo - FIX

			#endif

			#ifdef WORLD_UNITS

				// Find the closest points on the view ray and the line segment
				vec3 rayEnd = normalize( worldPos.xyz ) * 1e5;
				vec3 lineDir = worldEnd - worldStart;
				vec2 params = closestLineToLine( worldStart, worldEnd, vec3( 0.0, 0.0, 0.0 ), rayEnd );

				vec3 p1 = worldStart + lineDir * params.x;
				vec3 p2 = rayEnd * params.y;
				vec3 delta = p1 - p2;
				float len = length( delta );
				float norm = len / linewidth;

				#ifndef USE_DASH

					#ifdef USE_ALPHA_TO_COVERAGE

						float dnorm = fwidth( norm );
						alpha = 1.0 - smoothstep( 0.5 - dnorm, 0.5 + dnorm, norm );

					#else

						if ( norm > 0.5 ) {

							discard;

						}

					#endif

				#endif

			#else

				#ifdef USE_ALPHA_TO_COVERAGE

					// artifacts appear on some hardware if a derivative is taken within a conditional
					float a = vUv.x;
					float b = ( vUv.y > 0.0 ) ? vUv.y - 1.0 : vUv.y + 1.0;
					float len2 = a * a + b * b;
					float dlen = fwidth( len2 );

					if ( abs( vUv.y ) > 1.0 ) {

						alpha = 1.0 - smoothstep( 1.0 - dlen, 1.0 + dlen, len2 );

					}

				#else

					if ( abs( vUv.y ) > 1.0 ) {

						float a = vUv.x;
						float b = ( vUv.y > 0.0 ) ? vUv.y - 1.0 : vUv.y + 1.0;
						float len2 = a * a + b * b;

						if ( len2 > 1.0 ) discard;

					}

				#endif

			#endif

			#include <logdepthbuf_fragment>
			#include <color_fragment>

			gl_FragColor = vec4( diffuseColor.rgb, alpha );

			#include <tonemapping_fragment>
			#include <colorspace_fragment>
			#include <fog_fragment>
			#include <premultiplied_alpha_fragment>

		}
		`};class Ph extends Vt{constructor(e){super({type:"LineMaterial",uniforms:Qi.clone(sn.line.uniforms),vertexShader:sn.line.vertexShader,fragmentShader:sn.line.fragmentShader,clipping:!0}),this.isLineMaterial=!0,this.setValues(e)}get color(){return this.uniforms.diffuse.value}set color(e){this.uniforms.diffuse.value=e}get worldUnits(){return"WORLD_UNITS"in this.defines}set worldUnits(e){e===!0!==this.worldUnits&&(this.needsUpdate=!0),e===!0?this.defines.WORLD_UNITS="":delete this.defines.WORLD_UNITS}get linewidth(){return this.uniforms.linewidth.value}set linewidth(e){this.uniforms.linewidth&&(this.uniforms.linewidth.value=e)}get dashed(){return"USE_DASH"in this.defines}set dashed(e){e===!0!==this.dashed&&(this.needsUpdate=!0),e===!0?this.defines.USE_DASH="":delete this.defines.USE_DASH}get dashScale(){return this.uniforms.dashScale.value}set dashScale(e){this.uniforms.dashScale.value=e}get dashSize(){return this.uniforms.dashSize.value}set dashSize(e){this.uniforms.dashSize.value=e}get dashOffset(){return this.uniforms.dashOffset.value}set dashOffset(e){this.uniforms.dashOffset.value=e}get gapSize(){return this.uniforms.gapSize.value}set gapSize(e){this.uniforms.gapSize.value=e}get opacity(){return this.uniforms.opacity.value}set opacity(e){this.uniforms&&(this.uniforms.opacity.value=e)}get resolution(){return this.uniforms.resolution.value}set resolution(e){this.uniforms.resolution.value.copy(e)}get alphaToCoverage(){return"USE_ALPHA_TO_COVERAGE"in this.defines}set alphaToCoverage(e){this.defines&&(e===!0!==this.alphaToCoverage&&(this.needsUpdate=!0),e===!0?this.defines.USE_ALPHA_TO_COVERAGE="":delete this.defines.USE_ALPHA_TO_COVERAGE)}}const mc=new at,Df=new P,Nf=new P,zt=new at,kt=new at,Hn=new at,gc=new P,_c=new Ke,Ht=new Fy,Uf=new P,mo=new dn,go=new Mn,Gn=new at;let Xn,$i;function Of(i,e,t){return Gn.set(0,0,-e,1).applyMatrix4(i.projectionMatrix),Gn.multiplyScalar(1/Gn.w),Gn.x=$i/t.width,Gn.y=$i/t.height,Gn.applyMatrix4(i.projectionMatrixInverse),Gn.multiplyScalar(1/Gn.w),Math.abs(Math.max(Gn.x,Gn.y))}function T1(i,e){const t=i.matrixWorld,n=i.geometry,s=n.attributes.instanceStart,r=n.attributes.instanceEnd,a=Math.min(n.instanceCount,s.count);for(let o=0,l=a;o<l;o++){Ht.start.fromBufferAttribute(s,o),Ht.end.fromBufferAttribute(r,o),Ht.applyMatrix4(t);const c=new P,u=new P;Xn.distanceSqToSegment(Ht.start,Ht.end,u,c),u.distanceTo(c)<$i*.5&&e.push({point:u,pointOnLine:c,distance:Xn.origin.distanceTo(u),object:i,face:null,faceIndex:o,uv:null,uv1:null})}}function w1(i,e,t){const n=e.projectionMatrix,r=i.material.resolution,a=i.matrixWorld,o=i.geometry,l=o.attributes.instanceStart,c=o.attributes.instanceEnd,u=Math.min(o.instanceCount,l.count),d=-e.near;Xn.at(1,Hn),Hn.w=1,Hn.applyMatrix4(e.matrixWorldInverse),Hn.applyMatrix4(n),Hn.multiplyScalar(1/Hn.w),Hn.x*=r.x/2,Hn.y*=r.y/2,Hn.z=0,gc.copy(Hn),_c.multiplyMatrices(e.matrixWorldInverse,a);for(let h=0,f=u;h<f;h++){if(zt.fromBufferAttribute(l,h),kt.fromBufferAttribute(c,h),zt.w=1,kt.w=1,zt.applyMatrix4(_c),kt.applyMatrix4(_c),zt.z>d&&kt.z>d)continue;if(zt.z>d){const v=zt.z-kt.z,M=(zt.z-d)/v;zt.lerp(kt,M)}else if(kt.z>d){const v=kt.z-zt.z,M=(kt.z-d)/v;kt.lerp(zt,M)}zt.applyMatrix4(n),kt.applyMatrix4(n),zt.multiplyScalar(1/zt.w),kt.multiplyScalar(1/kt.w),zt.x*=r.x/2,zt.y*=r.y/2,kt.x*=r.x/2,kt.y*=r.y/2,Ht.start.copy(zt),Ht.start.z=0,Ht.end.copy(kt),Ht.end.z=0;const _=Ht.closestPointToPointParameter(gc,!0);Ht.at(_,Uf);const m=lh.lerp(zt.z,kt.z,_),g=m>=-1&&m<=1,S=gc.distanceTo(Uf)<$i*.5;if(g&&S){Ht.start.fromBufferAttribute(l,h),Ht.end.fromBufferAttribute(c,h),Ht.start.applyMatrix4(a),Ht.end.applyMatrix4(a);const v=new P,M=new P;Xn.distanceSqToSegment(Ht.start,Ht.end,M,v),t.push({point:M,pointOnLine:v,distance:Xn.origin.distanceTo(M),object:i,face:null,faceIndex:h,uv:null,uv1:null})}}}class C1 extends ot{constructor(e=new vm,t=new Ph({color:Math.random()*16777215})){super(e,t),this.isLineSegments2=!0,this.type="LineSegments2"}computeLineDistances(){const e=this.geometry,t=e.attributes.instanceStart,n=e.attributes.instanceEnd,s=new Float32Array(2*t.count);for(let a=0,o=0,l=t.count;a<l;a++,o+=2)Df.fromBufferAttribute(t,a),Nf.fromBufferAttribute(n,a),s[o]=o===0?0:s[o-1],s[o+1]=s[o]+Df.distanceTo(Nf);const r=new Eu(s,2,1);return e.setAttribute("instanceDistanceStart",new Dn(r,1,0)),e.setAttribute("instanceDistanceEnd",new Dn(r,1,1)),this}raycast(e,t){const n=this.material.worldUnits,s=e.camera;s===null&&!n&&console.error('LineSegments2: "Raycaster.camera" needs to be set in order to raycast against LineSegments2 while worldUnits is set to false.');const r=e.params.Line2!==void 0&&e.params.Line2.threshold||0;Xn=e.ray;const a=this.matrixWorld,o=this.geometry,l=this.material;$i=l.linewidth+r,o.boundingSphere===null&&o.computeBoundingSphere(),go.copy(o.boundingSphere).applyMatrix4(a);let c;if(n)c=$i*.5;else{const d=Math.max(s.near,go.distanceToPoint(Xn.origin));c=Of(s,d,l.resolution)}if(go.radius+=c,Xn.intersectsSphere(go)===!1)return;o.boundingBox===null&&o.computeBoundingBox(),mo.copy(o.boundingBox).applyMatrix4(a);let u;if(n)u=$i*.5;else{const d=Math.max(s.near,mo.distanceToPoint(Xn.origin));u=Of(s,d,l.resolution)}mo.expandByScalar(u),Xn.intersectsBox(mo)!==!1&&(n?T1(this,t):w1(this,s,t))}onBeforeRender(e){const t=this.material.uniforms;t&&t.resolution&&(e.getViewport(mc),this.material.uniforms.resolution.value.set(mc.z,mc.w))}}class Sm extends vm{constructor(){super(),this.isLineGeometry=!0,this.type="LineGeometry"}setPositions(e){const t=e.length-3,n=new Float32Array(2*t);for(let s=0;s<t;s+=3)n[2*s]=e[s],n[2*s+1]=e[s+1],n[2*s+2]=e[s+2],n[2*s+3]=e[s+3],n[2*s+4]=e[s+4],n[2*s+5]=e[s+5];return super.setPositions(n),this}setColors(e){const t=e.length-3,n=new Float32Array(2*t);for(let s=0;s<t;s+=3)n[2*s]=e[s],n[2*s+1]=e[s+1],n[2*s+2]=e[s+2],n[2*s+3]=e[s+3],n[2*s+4]=e[s+4],n[2*s+5]=e[s+5];return super.setColors(n),this}setFromPoints(e){const t=e.length-1,n=new Float32Array(6*t);for(let s=0;s<t;s++)n[6*s]=e[s].x,n[6*s+1]=e[s].y,n[6*s+2]=e[s].z||0,n[6*s+3]=e[s+1].x,n[6*s+4]=e[s+1].y,n[6*s+5]=e[s+1].z||0;return super.setPositions(n),this}fromLine(e){const t=e.geometry;return this.setPositions(t.attributes.position.array),this}}class R1 extends C1{constructor(e=new Sm,t=new Ph({color:Math.random()*16777215})){super(e,t),this.isLine2=!0,this.type="Line2"}}function Bf(i,e){if(e===o0)return console.warn("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Geometry already defined as triangles."),i;if(e===_u||e===Op){let t=i.getIndex();if(t===null){const a=[],o=i.getAttribute("position");if(o!==void 0){for(let l=0;l<o.count;l++)a.push(l);i.setIndex(a),t=i.getIndex()}else return console.error("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Undefined position attribute. Processing not possible."),i}const n=t.count-2,s=[];if(e===_u)for(let a=1;a<=n;a++)s.push(t.getX(0)),s.push(t.getX(a)),s.push(t.getX(a+1));else for(let a=0;a<n;a++)a%2===0?(s.push(t.getX(a)),s.push(t.getX(a+1)),s.push(t.getX(a+2))):(s.push(t.getX(a+2)),s.push(t.getX(a+1)),s.push(t.getX(a)));s.length/3!==n&&console.error("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Unable to generate correct amount of triangles.");const r=i.clone();return r.setIndex(s),r.clearGroups(),r}else return console.error("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Unknown draw mode:",e),i}function L1(i){const e=new Map,t=new Map,n=i.clone();return Mm(i,n,function(s,r){e.set(r,s),t.set(s,r)}),n.traverse(function(s){if(!s.isSkinnedMesh)return;const r=s,a=e.get(s),o=a.skeleton.bones;r.skeleton=a.skeleton.clone(),r.bindMatrix.copy(a.bindMatrix),r.skeleton.bones=o.map(function(l){return t.get(l)}),r.bind(r.skeleton,r.bindMatrix)}),n}function Mm(i,e,t){t(i,e);for(let n=0;n<i.children.length;n++)Mm(i.children[n],e.children[n],t)}class P1 extends pr{constructor(e){super(e),this.dracoLoader=null,this.ktx2Loader=null,this.meshoptDecoder=null,this.pluginCallbacks=[],this.register(function(t){return new O1(t)}),this.register(function(t){return new B1(t)}),this.register(function(t){return new X1(t)}),this.register(function(t){return new Y1(t)}),this.register(function(t){return new q1(t)}),this.register(function(t){return new z1(t)}),this.register(function(t){return new k1(t)}),this.register(function(t){return new H1(t)}),this.register(function(t){return new G1(t)}),this.register(function(t){return new U1(t)}),this.register(function(t){return new V1(t)}),this.register(function(t){return new F1(t)}),this.register(function(t){return new K1(t)}),this.register(function(t){return new W1(t)}),this.register(function(t){return new D1(t)}),this.register(function(t){return new Ff(t,Ze.EXT_MESHOPT_COMPRESSION)}),this.register(function(t){return new Ff(t,Ze.KHR_MESHOPT_COMPRESSION)}),this.register(function(t){return new $1(t)})}load(e,t,n,s){const r=this;let a;if(this.resourcePath!=="")a=this.resourcePath;else if(this.path!==""){const c=jr.extractUrlBase(e);a=jr.resolveURL(c,this.path)}else a=jr.extractUrlBase(e);this.manager.itemStart(e);const o=function(c){s?s(c):console.error(c),r.manager.itemError(e),r.manager.itemEnd(e)},l=new sm(this.manager);l.setPath(this.path),l.setResponseType("arraybuffer"),l.setRequestHeader(this.requestHeader),l.setWithCredentials(this.withCredentials),l.load(e,function(c){try{r.parse(c,a,function(u){t(u),r.manager.itemEnd(e)},o)}catch(u){o(u)}},n,o)}setDRACOLoader(e){return this.dracoLoader=e,this}setKTX2Loader(e){return this.ktx2Loader=e,this}setMeshoptDecoder(e){return this.meshoptDecoder=e,this}register(e){return this.pluginCallbacks.indexOf(e)===-1&&this.pluginCallbacks.push(e),this}unregister(e){return this.pluginCallbacks.indexOf(e)!==-1&&this.pluginCallbacks.splice(this.pluginCallbacks.indexOf(e),1),this}parse(e,t,n,s){let r;const a={},o={},l=new TextDecoder;if(typeof e=="string")r=JSON.parse(e);else if(e instanceof ArrayBuffer)if(l.decode(new Uint8Array(e,0,4))===Am){try{a[Ze.KHR_BINARY_GLTF]=new J1(e)}catch(d){s&&s(d);return}r=JSON.parse(a[Ze.KHR_BINARY_GLTF].content)}else r=JSON.parse(l.decode(e));else r=e;if(r.asset===void 0||r.asset.version[0]<2){s&&s(new Error("THREE.GLTFLoader: Unsupported asset. glTF versions >=2.0 are supported."));return}const c=new cb(r,{path:t||this.resourcePath||"",crossOrigin:this.crossOrigin,requestHeader:this.requestHeader,manager:this.manager,ktx2Loader:this.ktx2Loader,meshoptDecoder:this.meshoptDecoder});c.fileLoader.setRequestHeader(this.requestHeader);for(let u=0;u<this.pluginCallbacks.length;u++){const d=this.pluginCallbacks[u](c);d.name||console.error("THREE.GLTFLoader: Invalid plugin found: missing name"),o[d.name]=d,a[d.name]=!0}if(r.extensionsUsed)for(let u=0;u<r.extensionsUsed.length;++u){const d=r.extensionsUsed[u],h=r.extensionsRequired||[];switch(d){case Ze.KHR_MATERIALS_UNLIT:a[d]=new N1;break;case Ze.KHR_DRACO_MESH_COMPRESSION:a[d]=new j1(r,this.dracoLoader);break;case Ze.KHR_TEXTURE_TRANSFORM:a[d]=new Z1;break;case Ze.KHR_MESH_QUANTIZATION:a[d]=new Q1;break;default:h.indexOf(d)>=0&&o[d]===void 0&&console.warn('THREE.GLTFLoader: Unknown extension "'+d+'".')}}c.setExtensions(a),c.setPlugins(o),c.parse(n,s)}parseAsync(e,t){const n=this;return new Promise(function(s,r){n.parse(e,t,s,r)})}}function I1(){let i={};return{get:function(e){return i[e]},add:function(e,t){i[e]=t},remove:function(e){delete i[e]},removeAll:function(){i={}}}}function bt(i,e,t){const n=i.json.materials[e];return n.extensions&&n.extensions[t]?n.extensions[t]:null}const Ze={KHR_BINARY_GLTF:"KHR_binary_glTF",KHR_DRACO_MESH_COMPRESSION:"KHR_draco_mesh_compression",KHR_LIGHTS_PUNCTUAL:"KHR_lights_punctual",KHR_MATERIALS_CLEARCOAT:"KHR_materials_clearcoat",KHR_MATERIALS_DISPERSION:"KHR_materials_dispersion",KHR_MATERIALS_IOR:"KHR_materials_ior",KHR_MATERIALS_SHEEN:"KHR_materials_sheen",KHR_MATERIALS_SPECULAR:"KHR_materials_specular",KHR_MATERIALS_TRANSMISSION:"KHR_materials_transmission",KHR_MATERIALS_IRIDESCENCE:"KHR_materials_iridescence",KHR_MATERIALS_ANISOTROPY:"KHR_materials_anisotropy",KHR_MATERIALS_UNLIT:"KHR_materials_unlit",KHR_MATERIALS_VOLUME:"KHR_materials_volume",KHR_TEXTURE_BASISU:"KHR_texture_basisu",KHR_TEXTURE_TRANSFORM:"KHR_texture_transform",KHR_MESH_QUANTIZATION:"KHR_mesh_quantization",KHR_MATERIALS_EMISSIVE_STRENGTH:"KHR_materials_emissive_strength",EXT_MATERIALS_BUMP:"EXT_materials_bump",EXT_TEXTURE_WEBP:"EXT_texture_webp",EXT_TEXTURE_AVIF:"EXT_texture_avif",EXT_MESHOPT_COMPRESSION:"EXT_meshopt_compression",KHR_MESHOPT_COMPRESSION:"KHR_meshopt_compression",EXT_MESH_GPU_INSTANCING:"EXT_mesh_gpu_instancing"};class D1{constructor(e){this.parser=e,this.name=Ze.KHR_LIGHTS_PUNCTUAL,this.cache={refs:{},uses:{}}}_markDefs(){const e=this.parser,t=this.parser.json.nodes||[];for(let n=0,s=t.length;n<s;n++){const r=t[n];r.extensions&&r.extensions[this.name]&&r.extensions[this.name].light!==void 0&&e._addNodeRef(this.cache,r.extensions[this.name].light)}}_loadLight(e){const t=this.parser,n="light:"+e;let s=t.cache.get(n);if(s)return s;const r=t.json,l=((r.extensions&&r.extensions[this.name]||{}).lights||[])[e];let c;const u=new ve(16777215);l.color!==void 0&&u.setRGB(l.color[0],l.color[1],l.color[2],en);const d=l.range!==void 0?l.range:0;switch(l.type){case"directional":c=new am(u),c.target.position.set(0,0,-1),c.add(c.target);break;case"point":c=new gy(u),c.distance=d;break;case"spot":c=new py(u),c.distance=d,l.spot=l.spot||{},l.spot.innerConeAngle=l.spot.innerConeAngle!==void 0?l.spot.innerConeAngle:0,l.spot.outerConeAngle=l.spot.outerConeAngle!==void 0?l.spot.outerConeAngle:Math.PI/4,c.angle=l.spot.outerConeAngle,c.penumbra=1-l.spot.innerConeAngle/l.spot.outerConeAngle,c.target.position.set(0,0,-1),c.add(c.target);break;default:throw new Error("THREE.GLTFLoader: Unexpected light type: "+l.type)}return c.position.set(0,0,0),Wn(c,l),l.intensity!==void 0&&(c.intensity=l.intensity),c.name=t.createUniqueName(l.name||"light_"+e),s=Promise.resolve(c),t.cache.add(n,s),s}getDependency(e,t){if(e==="light")return this._loadLight(t)}createNodeAttachment(e){const t=this,n=this.parser,r=n.json.nodes[e],o=(r.extensions&&r.extensions[this.name]||{}).light;return o===void 0?null:this._loadLight(o).then(function(l){return n._getNodeRef(t.cache,o,l)})}}class N1{constructor(){this.name=Ze.KHR_MATERIALS_UNLIT}getMaterialType(){return Mt}extendParams(e,t,n){const s=[];e.color=new ve(1,1,1),e.opacity=1;const r=t.pbrMetallicRoughness;if(r){if(Array.isArray(r.baseColorFactor)){const a=r.baseColorFactor;e.color.setRGB(a[0],a[1],a[2],en),e.opacity=a[3]}r.baseColorTexture!==void 0&&s.push(n.assignTexture(e,"map",r.baseColorTexture,Ut))}return Promise.all(s)}}class U1{constructor(e){this.parser=e,this.name=Ze.KHR_MATERIALS_EMISSIVE_STRENGTH}extendMaterialParams(e,t){const n=bt(this.parser,e,this.name);return n===null||n.emissiveStrength!==void 0&&(t.emissiveIntensity=n.emissiveStrength),Promise.resolve()}}class O1{constructor(e){this.parser=e,this.name=Ze.KHR_MATERIALS_CLEARCOAT}getMaterialType(e){return bt(this.parser,e,this.name)!==null?ei:null}extendMaterialParams(e,t){const n=bt(this.parser,e,this.name);if(n===null)return Promise.resolve();const s=[];if(n.clearcoatFactor!==void 0&&(t.clearcoat=n.clearcoatFactor),n.clearcoatTexture!==void 0&&s.push(this.parser.assignTexture(t,"clearcoatMap",n.clearcoatTexture)),n.clearcoatRoughnessFactor!==void 0&&(t.clearcoatRoughness=n.clearcoatRoughnessFactor),n.clearcoatRoughnessTexture!==void 0&&s.push(this.parser.assignTexture(t,"clearcoatRoughnessMap",n.clearcoatRoughnessTexture)),n.clearcoatNormalTexture!==void 0&&(s.push(this.parser.assignTexture(t,"clearcoatNormalMap",n.clearcoatNormalTexture)),n.clearcoatNormalTexture.scale!==void 0)){const r=n.clearcoatNormalTexture.scale;t.clearcoatNormalScale=new j(r,r)}return Promise.all(s)}}class B1{constructor(e){this.parser=e,this.name=Ze.KHR_MATERIALS_DISPERSION}getMaterialType(e){return bt(this.parser,e,this.name)!==null?ei:null}extendMaterialParams(e,t){const n=bt(this.parser,e,this.name);return n===null||(t.dispersion=n.dispersion!==void 0?n.dispersion:0),Promise.resolve()}}class F1{constructor(e){this.parser=e,this.name=Ze.KHR_MATERIALS_IRIDESCENCE}getMaterialType(e){return bt(this.parser,e,this.name)!==null?ei:null}extendMaterialParams(e,t){const n=bt(this.parser,e,this.name);if(n===null)return Promise.resolve();const s=[];return n.iridescenceFactor!==void 0&&(t.iridescence=n.iridescenceFactor),n.iridescenceTexture!==void 0&&s.push(this.parser.assignTexture(t,"iridescenceMap",n.iridescenceTexture)),n.iridescenceIor!==void 0&&(t.iridescenceIOR=n.iridescenceIor),t.iridescenceThicknessRange===void 0&&(t.iridescenceThicknessRange=[100,400]),n.iridescenceThicknessMinimum!==void 0&&(t.iridescenceThicknessRange[0]=n.iridescenceThicknessMinimum),n.iridescenceThicknessMaximum!==void 0&&(t.iridescenceThicknessRange[1]=n.iridescenceThicknessMaximum),n.iridescenceThicknessTexture!==void 0&&s.push(this.parser.assignTexture(t,"iridescenceThicknessMap",n.iridescenceThicknessTexture)),Promise.all(s)}}class z1{constructor(e){this.parser=e,this.name=Ze.KHR_MATERIALS_SHEEN}getMaterialType(e){return bt(this.parser,e,this.name)!==null?ei:null}extendMaterialParams(e,t){const n=bt(this.parser,e,this.name);if(n===null)return Promise.resolve();const s=[];if(t.sheenColor=new ve(0,0,0),t.sheenRoughness=0,t.sheen=1,n.sheenColorFactor!==void 0){const r=n.sheenColorFactor;t.sheenColor.setRGB(r[0],r[1],r[2],en)}return n.sheenRoughnessFactor!==void 0&&(t.sheenRoughness=n.sheenRoughnessFactor),n.sheenColorTexture!==void 0&&s.push(this.parser.assignTexture(t,"sheenColorMap",n.sheenColorTexture,Ut)),n.sheenRoughnessTexture!==void 0&&s.push(this.parser.assignTexture(t,"sheenRoughnessMap",n.sheenRoughnessTexture)),Promise.all(s)}}class k1{constructor(e){this.parser=e,this.name=Ze.KHR_MATERIALS_TRANSMISSION}getMaterialType(e){return bt(this.parser,e,this.name)!==null?ei:null}extendMaterialParams(e,t){const n=bt(this.parser,e,this.name);if(n===null)return Promise.resolve();const s=[];return n.transmissionFactor!==void 0&&(t.transmission=n.transmissionFactor),n.transmissionTexture!==void 0&&s.push(this.parser.assignTexture(t,"transmissionMap",n.transmissionTexture)),Promise.all(s)}}class H1{constructor(e){this.parser=e,this.name=Ze.KHR_MATERIALS_VOLUME}getMaterialType(e){return bt(this.parser,e,this.name)!==null?ei:null}extendMaterialParams(e,t){const n=bt(this.parser,e,this.name);if(n===null)return Promise.resolve();const s=[];t.thickness=n.thicknessFactor!==void 0?n.thicknessFactor:0,n.thicknessTexture!==void 0&&s.push(this.parser.assignTexture(t,"thicknessMap",n.thicknessTexture)),t.attenuationDistance=n.attenuationDistance||1/0;const r=n.attenuationColor||[1,1,1];return t.attenuationColor=new ve().setRGB(r[0],r[1],r[2],en),Promise.all(s)}}class G1{constructor(e){this.parser=e,this.name=Ze.KHR_MATERIALS_IOR}getMaterialType(e){return bt(this.parser,e,this.name)!==null?ei:null}extendMaterialParams(e,t){const n=bt(this.parser,e,this.name);return n===null||(t.ior=n.ior!==void 0?n.ior:1.5),Promise.resolve()}}class V1{constructor(e){this.parser=e,this.name=Ze.KHR_MATERIALS_SPECULAR}getMaterialType(e){return bt(this.parser,e,this.name)!==null?ei:null}extendMaterialParams(e,t){const n=bt(this.parser,e,this.name);if(n===null)return Promise.resolve();const s=[];t.specularIntensity=n.specularFactor!==void 0?n.specularFactor:1,n.specularTexture!==void 0&&s.push(this.parser.assignTexture(t,"specularIntensityMap",n.specularTexture));const r=n.specularColorFactor||[1,1,1];return t.specularColor=new ve().setRGB(r[0],r[1],r[2],en),n.specularColorTexture!==void 0&&s.push(this.parser.assignTexture(t,"specularColorMap",n.specularColorTexture,Ut)),Promise.all(s)}}class W1{constructor(e){this.parser=e,this.name=Ze.EXT_MATERIALS_BUMP}getMaterialType(e){return bt(this.parser,e,this.name)!==null?ei:null}extendMaterialParams(e,t){const n=bt(this.parser,e,this.name);if(n===null)return Promise.resolve();const s=[];return t.bumpScale=n.bumpFactor!==void 0?n.bumpFactor:1,n.bumpTexture!==void 0&&s.push(this.parser.assignTexture(t,"bumpMap",n.bumpTexture)),Promise.all(s)}}class K1{constructor(e){this.parser=e,this.name=Ze.KHR_MATERIALS_ANISOTROPY}getMaterialType(e){return bt(this.parser,e,this.name)!==null?ei:null}extendMaterialParams(e,t){const n=bt(this.parser,e,this.name);if(n===null)return Promise.resolve();const s=[];return n.anisotropyStrength!==void 0&&(t.anisotropy=n.anisotropyStrength),n.anisotropyRotation!==void 0&&(t.anisotropyRotation=n.anisotropyRotation),n.anisotropyTexture!==void 0&&s.push(this.parser.assignTexture(t,"anisotropyMap",n.anisotropyTexture)),Promise.all(s)}}class X1{constructor(e){this.parser=e,this.name=Ze.KHR_TEXTURE_BASISU}loadTexture(e){const t=this.parser,n=t.json,s=n.textures[e];if(!s.extensions||!s.extensions[this.name])return null;const r=s.extensions[this.name],a=t.options.ktx2Loader;if(!a){if(n.extensionsRequired&&n.extensionsRequired.indexOf(this.name)>=0)throw new Error("THREE.GLTFLoader: setKTX2Loader must be called before loading KTX2 textures");return null}return t.loadTextureImage(e,r.source,a)}}class Y1{constructor(e){this.parser=e,this.name=Ze.EXT_TEXTURE_WEBP}loadTexture(e){const t=this.name,n=this.parser,s=n.json,r=s.textures[e];if(!r.extensions||!r.extensions[t])return null;const a=r.extensions[t],o=s.images[a.source];let l=n.textureLoader;if(o.uri){const c=n.options.manager.getHandler(o.uri);c!==null&&(l=c)}return n.loadTextureImage(e,a.source,l)}}class q1{constructor(e){this.parser=e,this.name=Ze.EXT_TEXTURE_AVIF}loadTexture(e){const t=this.name,n=this.parser,s=n.json,r=s.textures[e];if(!r.extensions||!r.extensions[t])return null;const a=r.extensions[t],o=s.images[a.source];let l=n.textureLoader;if(o.uri){const c=n.options.manager.getHandler(o.uri);c!==null&&(l=c)}return n.loadTextureImage(e,a.source,l)}}class Ff{constructor(e,t){this.name=t,this.parser=e}loadBufferView(e){const t=this.parser.json,n=t.bufferViews[e];if(n.extensions&&n.extensions[this.name]){const s=n.extensions[this.name],r=this.parser.getDependency("buffer",s.buffer),a=this.parser.options.meshoptDecoder;if(!a||!a.supported){if(t.extensionsRequired&&t.extensionsRequired.indexOf(this.name)>=0)throw new Error("THREE.GLTFLoader: setMeshoptDecoder must be called before loading compressed files");return null}return r.then(function(o){const l=s.byteOffset||0,c=s.byteLength||0,u=s.count,d=s.byteStride,h=new Uint8Array(o,l,c);return a.decodeGltfBufferAsync?a.decodeGltfBufferAsync(u,d,h,s.mode,s.filter).then(function(f){return f.buffer}):a.ready.then(function(){const f=new ArrayBuffer(u*d);return a.decodeGltfBuffer(new Uint8Array(f),u,d,h,s.mode,s.filter),f})})}else return null}}class $1{constructor(e){this.name=Ze.EXT_MESH_GPU_INSTANCING,this.parser=e}createNodeMesh(e){const t=this.parser.json,n=t.nodes[e];if(!n.extensions||!n.extensions[this.name]||n.mesh===void 0)return null;const s=t.meshes[n.mesh];for(const c of s.primitives)if(c.mode!==mn.TRIANGLES&&c.mode!==mn.TRIANGLE_STRIP&&c.mode!==mn.TRIANGLE_FAN&&c.mode!==void 0)return null;const a=n.extensions[this.name].attributes,o=[],l={};for(const c in a)o.push(this.parser.getDependency("accessor",a[c]).then(u=>(l[c]=u,l[c])));return o.length<1?null:(o.push(this.parser.createNodeMesh(e)),Promise.all(o).then(c=>{const u=c.pop(),d=u.isGroup?u.children:[u],h=c[0].count,f=[];for(const p of d){const _=new Ke,m=new P,g=new Un,S=new P(1,1,1),v=new a_(p.geometry,p.material,h);for(let M=0;M<h;M++)l.TRANSLATION&&m.fromBufferAttribute(l.TRANSLATION,M),l.ROTATION&&g.fromBufferAttribute(l.ROTATION,M),l.SCALE&&S.fromBufferAttribute(l.SCALE,M),v.setMatrixAt(M,_.compose(m,g,S));for(const M in l)if(M==="_COLOR_0"){const T=l[M];v.instanceColor=new xu(T.array,T.itemSize,T.normalized)}else M!=="TRANSLATION"&&M!=="ROTATION"&&M!=="SCALE"&&p.geometry.setAttribute(M,l[M]);xt.prototype.copy.call(v,p),this.parser.assignFinalMaterial(v),f.push(v)}return u.isGroup?(u.clear(),u.add(...f),u):f[0]}))}}const Am="glTF",Pr=12,zf={JSON:1313821514,BIN:5130562};class J1{constructor(e){this.name=Ze.KHR_BINARY_GLTF,this.content=null,this.body=null;const t=new DataView(e,0,Pr),n=new TextDecoder;if(this.header={magic:n.decode(new Uint8Array(e.slice(0,4))),version:t.getUint32(4,!0),length:t.getUint32(8,!0)},this.header.magic!==Am)throw new Error("THREE.GLTFLoader: Unsupported glTF-Binary header.");if(this.header.version<2)throw new Error("THREE.GLTFLoader: Legacy binary file detected.");const s=this.header.length-Pr,r=new DataView(e,Pr);let a=0;for(;a<s;){const o=r.getUint32(a,!0);a+=4;const l=r.getUint32(a,!0);if(a+=4,l===zf.JSON){const c=new Uint8Array(e,Pr+a,o);this.content=n.decode(c)}else if(l===zf.BIN){const c=Pr+a;this.body=e.slice(c,c+o)}a+=o}if(this.content===null)throw new Error("THREE.GLTFLoader: JSON content not found.")}}class j1{constructor(e,t){if(!t)throw new Error("THREE.GLTFLoader: No DRACOLoader instance provided.");this.name=Ze.KHR_DRACO_MESH_COMPRESSION,this.json=e,this.dracoLoader=t,this.dracoLoader.preload()}decodePrimitive(e,t){const n=this.json,s=this.dracoLoader,r=e.extensions[this.name].bufferView,a=e.extensions[this.name].attributes,o={},l={},c={};for(const u in a){const d=Pu[u]||u.toLowerCase();o[d]=a[u]}for(const u in e.attributes){const d=Pu[u]||u.toLowerCase();if(a[u]!==void 0){const h=n.accessors[e.attributes[u]],f=Ks[h.componentType];c[d]=f.name,l[d]=h.normalized===!0}}return t.getDependency("bufferView",r).then(function(u){return new Promise(function(d,h){s.decodeDracoFile(u,function(f){for(const p in f.attributes){const _=f.attributes[p],m=l[p];m!==void 0&&(_.normalized=m)}d(f)},o,c,en,h)})})}}class Z1{constructor(){this.name=Ze.KHR_TEXTURE_TRANSFORM}extendTexture(e,t){return(t.texCoord===void 0||t.texCoord===e.channel)&&t.offset===void 0&&t.rotation===void 0&&t.scale===void 0||(e=e.clone(),t.texCoord!==void 0&&(e.channel=t.texCoord),t.offset!==void 0&&e.offset.fromArray(t.offset),t.rotation!==void 0&&(e.rotation=t.rotation),t.scale!==void 0&&e.repeat.fromArray(t.scale),e.needsUpdate=!0),e}}class Q1{constructor(){this.name=Ze.KHR_MESH_QUANTIZATION}}class bm extends hr{constructor(e,t,n,s){super(e,t,n,s)}copySampleValue_(e){const t=this.resultBuffer,n=this.sampleValues,s=this.valueSize,r=e*s*3+s;for(let a=0;a!==s;a++)t[a]=n[r+a];return t}interpolate_(e,t,n,s){const r=this.resultBuffer,a=this.sampleValues,o=this.valueSize,l=o*2,c=o*3,u=s-t,d=(n-t)/u,h=d*d,f=h*d,p=e*c,_=p-c,m=-2*f+3*h,g=f-h,S=1-m,v=g-h+d;for(let M=0;M!==o;M++){const T=a[_+M+o],E=a[_+M+l]*u,R=a[p+M+o],y=a[p+M]*u;r[M]=S*T+v*E+m*R+g*y}return r}}const eb=new Un;class tb extends bm{interpolate_(e,t,n,s){const r=super.interpolate_(e,t,n,s);return eb.fromArray(r).normalize().toArray(r),r}}const mn={POINTS:0,LINES:1,LINE_LOOP:2,LINE_STRIP:3,TRIANGLES:4,TRIANGLE_STRIP:5,TRIANGLE_FAN:6},Ks={5120:Int8Array,5121:Uint8Array,5122:Int16Array,5123:Uint16Array,5125:Uint32Array,5126:Float32Array},kf={9728:Ct,9729:yt,9984:Rp,9985:Uo,9986:Fr,9987:Pn},Hf={33071:_n,33648:Zo,10497:$s},yc={SCALAR:1,VEC2:2,VEC3:3,VEC4:4,MAT2:4,MAT3:9,MAT4:16},Pu={POSITION:"position",NORMAL:"normal",TANGENT:"tangent",TEXCOORD_0:"uv",TEXCOORD_1:"uv1",TEXCOORD_2:"uv2",TEXCOORD_3:"uv3",COLOR_0:"color",WEIGHTS_0:"skinWeight",JOINTS_0:"skinIndex"},Ti={scale:"scale",translation:"position",rotation:"quaternion",weights:"morphTargetInfluences"},nb={CUBICSPLINE:void 0,LINEAR:ca,STEP:la},xc={OPAQUE:"OPAQUE",MASK:"MASK",BLEND:"BLEND"};function ib(i){return i.DefaultMaterial===void 0&&(i.DefaultMaterial=new Ah({color:16777215,emissive:0,metalness:1,roughness:1,transparent:!1,depthTest:!0,side:gi})),i.DefaultMaterial}function Vi(i,e,t){for(const n in t.extensions)i[n]===void 0&&(e.userData.gltfExtensions=e.userData.gltfExtensions||{},e.userData.gltfExtensions[n]=t.extensions[n])}function Wn(i,e){e.extras!==void 0&&(typeof e.extras=="object"?Object.assign(i.userData,e.extras):console.warn("THREE.GLTFLoader: Ignoring primitive type .extras, "+e.extras))}function sb(i,e,t){let n=!1,s=!1,r=!1;for(let c=0,u=e.length;c<u;c++){const d=e[c];if(d.POSITION!==void 0&&(n=!0),d.NORMAL!==void 0&&(s=!0),d.COLOR_0!==void 0&&(r=!0),n&&s&&r)break}if(!n&&!s&&!r)return Promise.resolve(i);const a=[],o=[],l=[];for(let c=0,u=e.length;c<u;c++){const d=e[c];if(n){const h=d.POSITION!==void 0?t.getDependency("accessor",d.POSITION):i.attributes.position;a.push(h)}if(s){const h=d.NORMAL!==void 0?t.getDependency("accessor",d.NORMAL):i.attributes.normal;o.push(h)}if(r){const h=d.COLOR_0!==void 0?t.getDependency("accessor",d.COLOR_0):i.attributes.color;l.push(h)}}return Promise.all([Promise.all(a),Promise.all(o),Promise.all(l)]).then(function(c){const u=c[0],d=c[1],h=c[2];return n&&(i.morphAttributes.position=u),s&&(i.morphAttributes.normal=d),r&&(i.morphAttributes.color=h),i.morphTargetsRelative=!0,i})}function rb(i,e){if(i.updateMorphTargets(),e.weights!==void 0)for(let t=0,n=e.weights.length;t<n;t++)i.morphTargetInfluences[t]=e.weights[t];if(e.extras&&Array.isArray(e.extras.targetNames)){const t=e.extras.targetNames;if(i.morphTargetInfluences.length===t.length){i.morphTargetDictionary={};for(let n=0,s=t.length;n<s;n++)i.morphTargetDictionary[t[n]]=n}else console.warn("THREE.GLTFLoader: Invalid extras.targetNames length. Ignoring names.")}}function ab(i){let e;const t=i.extensions&&i.extensions[Ze.KHR_DRACO_MESH_COMPRESSION];if(t?e="draco:"+t.bufferView+":"+t.indices+":"+vc(t.attributes):e=i.indices+":"+vc(i.attributes)+":"+i.mode,i.targets!==void 0)for(let n=0,s=i.targets.length;n<s;n++)e+=":"+vc(i.targets[n]);return e}function vc(i){let e="";const t=Object.keys(i).sort();for(let n=0,s=t.length;n<s;n++)e+=t[n]+":"+i[t[n]]+";";return e}function Iu(i){switch(i){case Int8Array:return 1/127;case Uint8Array:return 1/255;case Int16Array:return 1/32767;case Uint16Array:return 1/65535;default:throw new Error("THREE.GLTFLoader: Unsupported normalized accessor component type.")}}function ob(i){return i.search(/\.jpe?g($|\?)/i)>0||i.search(/^data\:image\/jpeg/)===0?"image/jpeg":i.search(/\.webp($|\?)/i)>0||i.search(/^data\:image\/webp/)===0?"image/webp":i.search(/\.ktx2($|\?)/i)>0||i.search(/^data\:image\/ktx2/)===0?"image/ktx2":"image/png"}const lb=new Ke;class cb{constructor(e={},t={}){this.json=e,this.extensions={},this.plugins={},this.options=t,this.cache=new I1,this.associations=new Map,this.primitiveCache={},this.nodeCache={},this.meshCache={refs:{},uses:{}},this.cameraCache={refs:{},uses:{}},this.lightCache={refs:{},uses:{}},this.sourceCache={},this.textureCache={},this.nodeNamesUsed={};let n=!1,s=-1,r=!1,a=-1;if(typeof navigator<"u"&&typeof navigator.userAgent<"u"){const o=navigator.userAgent;n=/^((?!chrome|android).)*safari/i.test(o)===!0;const l=o.match(/Version\/(\d+)/);s=n&&l?parseInt(l[1],10):-1,r=o.indexOf("Firefox")>-1,a=r?o.match(/Firefox\/([0-9]+)\./)[1]:-1}typeof createImageBitmap>"u"||n&&s<17||r&&a<98?this.textureLoader=new dy(this.options.manager):this.textureLoader=new vy(this.options.manager),this.textureLoader.setCrossOrigin(this.options.crossOrigin),this.textureLoader.setRequestHeader(this.options.requestHeader),this.fileLoader=new sm(this.options.manager),this.fileLoader.setResponseType("arraybuffer"),this.options.crossOrigin==="use-credentials"&&this.fileLoader.setWithCredentials(!0)}setExtensions(e){this.extensions=e}setPlugins(e){this.plugins=e}parse(e,t){const n=this,s=this.json,r=this.extensions;this.cache.removeAll(),this.nodeCache={},this._invokeAll(function(a){return a._markDefs&&a._markDefs()}),Promise.all(this._invokeAll(function(a){return a.beforeRoot&&a.beforeRoot()})).then(function(){return Promise.all([n.getDependencies("scene"),n.getDependencies("animation"),n.getDependencies("camera")])}).then(function(a){const o={scene:a[0][s.scene||0],scenes:a[0],animations:a[1],cameras:a[2],asset:s.asset,parser:n,userData:{}};return Vi(r,o,s),Wn(o,s),Promise.all(n._invokeAll(function(l){return l.afterRoot&&l.afterRoot(o)})).then(function(){for(const l of o.scenes)l.updateMatrixWorld();e(o)})}).catch(t)}_markDefs(){const e=this.json.nodes||[],t=this.json.skins||[],n=this.json.meshes||[];for(let s=0,r=t.length;s<r;s++){const a=t[s].joints;for(let o=0,l=a.length;o<l;o++)e[a[o]].isBone=!0}for(let s=0,r=e.length;s<r;s++){const a=e[s];a.mesh!==void 0&&(this._addNodeRef(this.meshCache,a.mesh),a.skin!==void 0&&(n[a.mesh].isSkinnedMesh=!0)),a.camera!==void 0&&this._addNodeRef(this.cameraCache,a.camera)}}_addNodeRef(e,t){t!==void 0&&(e.refs[t]===void 0&&(e.refs[t]=e.uses[t]=0),e.refs[t]++)}_getNodeRef(e,t,n){if(e.refs[t]<=1)return n;const s=n.clone(),r=(a,o)=>{const l=this.associations.get(a);l!=null&&this.associations.set(o,l);for(const[c,u]of a.children.entries())r(u,o.children[c])};return r(n,s),s.name+="_instance_"+e.uses[t]++,s}_invokeOne(e){const t=Object.values(this.plugins);t.push(this);for(let n=0;n<t.length;n++){const s=e(t[n]);if(s)return s}return null}_invokeAll(e){const t=Object.values(this.plugins);t.unshift(this);const n=[];for(let s=0;s<t.length;s++){const r=e(t[s]);r&&n.push(r)}return n}getDependency(e,t){const n=e+":"+t;let s=this.cache.get(n);if(!s){switch(e){case"scene":s=this.loadScene(t);break;case"node":s=this._invokeOne(function(r){return r.loadNode&&r.loadNode(t)});break;case"mesh":s=this._invokeOne(function(r){return r.loadMesh&&r.loadMesh(t)});break;case"accessor":s=this.loadAccessor(t);break;case"bufferView":s=this._invokeOne(function(r){return r.loadBufferView&&r.loadBufferView(t)});break;case"buffer":s=this.loadBuffer(t);break;case"material":s=this._invokeOne(function(r){return r.loadMaterial&&r.loadMaterial(t)});break;case"texture":s=this._invokeOne(function(r){return r.loadTexture&&r.loadTexture(t)});break;case"skin":s=this.loadSkin(t);break;case"animation":s=this._invokeOne(function(r){return r.loadAnimation&&r.loadAnimation(t)});break;case"camera":s=this.loadCamera(t);break;default:if(s=this._invokeOne(function(r){return r!=this&&r.getDependency&&r.getDependency(e,t)}),!s)throw new Error("Unknown type: "+e);break}this.cache.add(n,s)}return s}getDependencies(e){let t=this.cache.get(e);if(!t){const n=this,s=this.json[e+(e==="mesh"?"es":"s")]||[];t=Promise.all(s.map(function(r,a){return n.getDependency(e,a)})),this.cache.add(e,t)}return t}loadBuffer(e){const t=this.json.buffers[e],n=this.fileLoader;if(t.type&&t.type!=="arraybuffer")throw new Error("THREE.GLTFLoader: "+t.type+" buffer type is not supported.");if(t.uri===void 0&&e===0)return Promise.resolve(this.extensions[Ze.KHR_BINARY_GLTF].body);const s=this.options;return new Promise(function(r,a){n.load(jr.resolveURL(t.uri,s.path),r,void 0,function(){a(new Error('THREE.GLTFLoader: Failed to load buffer "'+t.uri+'".'))})})}loadBufferView(e){const t=this.json.bufferViews[e];return this.getDependency("buffer",t.buffer).then(function(n){const s=t.byteLength||0,r=t.byteOffset||0;return n.slice(r,r+s)})}loadAccessor(e){const t=this,n=this.json,s=this.json.accessors[e];if(s.bufferView===void 0&&s.sparse===void 0){const a=yc[s.type],o=Ks[s.componentType],l=s.normalized===!0,c=new o(s.count*a);return Promise.resolve(new $t(c,a,l))}const r=[];return s.bufferView!==void 0?r.push(this.getDependency("bufferView",s.bufferView)):r.push(null),s.sparse!==void 0&&(r.push(this.getDependency("bufferView",s.sparse.indices.bufferView)),r.push(this.getDependency("bufferView",s.sparse.values.bufferView))),Promise.all(r).then(function(a){const o=a[0],l=yc[s.type],c=Ks[s.componentType],u=c.BYTES_PER_ELEMENT,d=u*l,h=s.byteOffset||0,f=s.bufferView!==void 0?n.bufferViews[s.bufferView].byteStride:void 0,p=s.normalized===!0;let _,m;if(f&&f!==d){const g=Math.floor(h/f),S="InterleavedBuffer:"+s.bufferView+":"+s.componentType+":"+g+":"+s.count;let v=t.cache.get(S);v||(_=new c(o,g*f,s.count*f/u),v=new hh(_,f/u),t.cache.add(S,v)),m=new Dn(v,l,h%f/u,p)}else o===null?_=new c(s.count*l):_=new c(o,h,s.count*l),m=new $t(_,l,p);if(s.sparse!==void 0){const g=yc.SCALAR,S=Ks[s.sparse.indices.componentType],v=s.sparse.indices.byteOffset||0,M=s.sparse.values.byteOffset||0,T=new S(a[1],v,s.sparse.count*g),E=new c(a[2],M,s.sparse.count*l);o!==null&&(m=new $t(m.array.slice(),m.itemSize,m.normalized)),m.normalized=!1;for(let R=0,y=T.length;R<y;R++){const A=T[R];if(m.setX(A,E[R*l]),l>=2&&m.setY(A,E[R*l+1]),l>=3&&m.setZ(A,E[R*l+2]),l>=4&&m.setW(A,E[R*l+3]),l>=5)throw new Error("THREE.GLTFLoader: Unsupported itemSize in sparse BufferAttribute.")}m.normalized=p}return m})}loadTexture(e){const t=this.json,n=this.options,r=t.textures[e].source,a=t.images[r];let o=this.textureLoader;if(a.uri){const l=n.manager.getHandler(a.uri);l!==null&&(o=l)}return this.loadTextureImage(e,r,o)}loadTextureImage(e,t,n){const s=this,r=this.json,a=r.textures[e],o=r.images[t],l=(o.uri||o.bufferView)+":"+a.sampler;if(this.textureCache[l])return this.textureCache[l];const c=this.loadImageSource(t,n).then(function(u){u.flipY=!1,u.name=a.name||o.name||"",u.name===""&&typeof o.uri=="string"&&o.uri.startsWith("data:image/")===!1&&(u.name=o.uri);const h=(r.samplers||{})[a.sampler]||{};return u.magFilter=kf[h.magFilter]||yt,u.minFilter=kf[h.minFilter]||Pn,u.wrapS=Hf[h.wrapS]||$s,u.wrapT=Hf[h.wrapT]||$s,u.generateMipmaps=!u.isCompressedTexture&&u.minFilter!==Ct&&u.minFilter!==yt,s.associations.set(u,{textures:e}),u}).catch(function(){return null});return this.textureCache[l]=c,c}loadImageSource(e,t){const n=this,s=this.json,r=this.options;if(this.sourceCache[e]!==void 0)return this.sourceCache[e].then(d=>d.clone());const a=s.images[e],o=self.URL||self.webkitURL;let l=a.uri||"",c=!1;if(a.bufferView!==void 0)l=n.getDependency("bufferView",a.bufferView).then(function(d){c=!0;const h=new Blob([d],{type:a.mimeType});return l=o.createObjectURL(h),l});else if(a.uri===void 0)throw new Error("THREE.GLTFLoader: Image "+e+" is missing URI and bufferView");const u=Promise.resolve(l).then(function(d){return new Promise(function(h,f){let p=h;t.isImageBitmapLoader===!0&&(p=function(_){const m=new Rt(_);m.needsUpdate=!0,h(m)}),t.load(jr.resolveURL(d,r.path),p,void 0,f)})}).then(function(d){return c===!0&&o.revokeObjectURL(l),Wn(d,a),d.userData.mimeType=a.mimeType||ob(a.uri),d}).catch(function(d){throw console.error("THREE.GLTFLoader: Couldn't load texture",l),d});return this.sourceCache[e]=u,u}assignTexture(e,t,n,s){const r=this;return this.getDependency("texture",n.index).then(function(a){if(!a)return null;if(n.texCoord!==void 0&&n.texCoord>0&&(a=a.clone(),a.channel=n.texCoord),r.extensions[Ze.KHR_TEXTURE_TRANSFORM]){const o=n.extensions!==void 0?n.extensions[Ze.KHR_TEXTURE_TRANSFORM]:void 0;if(o){const l=r.associations.get(a);a=r.extensions[Ze.KHR_TEXTURE_TRANSFORM].extendTexture(a,o),r.associations.set(a,l)}}return s!==void 0&&(a.colorSpace=s),e[t]=a,a})}assignFinalMaterial(e){const t=e.geometry;let n=e.material;const s=t.attributes.tangent===void 0,r=t.attributes.color!==void 0,a=t.attributes.normal===void 0;if(e.isPoints){const o="PointsMaterial:"+n.uuid;let l=this.cache.get(o);l||(l=new is,Sn.prototype.copy.call(l,n),l.color.copy(n.color),l.map=n.map,l.sizeAttenuation=!1,this.cache.add(o,l)),n=l}else if(e.isLine){const o="LineBasicMaterial:"+n.uuid;let l=this.cache.get(o);l||(l=new ns,Sn.prototype.copy.call(l,n),l.color.copy(n.color),l.map=n.map,this.cache.add(o,l)),n=l}if(s||r||a){let o="ClonedMaterial:"+n.uuid+":";s&&(o+="derivative-tangents:"),r&&(o+="vertex-colors:"),a&&(o+="flat-shading:");let l=this.cache.get(o);l||(l=n.clone(),r&&(l.vertexColors=!0),a&&(l.flatShading=!0),s&&(l.normalScale&&(l.normalScale.y*=-1),l.clearcoatNormalScale&&(l.clearcoatNormalScale.y*=-1)),this.cache.add(o,l),this.associations.set(l,this.associations.get(n))),n=l}e.material=n}getMaterialType(){return Ah}loadMaterial(e){const t=this,n=this.json,s=this.extensions,r=n.materials[e];let a;const o={},l=r.extensions||{},c=[];if(l[Ze.KHR_MATERIALS_UNLIT]){const d=s[Ze.KHR_MATERIALS_UNLIT];a=d.getMaterialType(),c.push(d.extendParams(o,r,t))}else{const d=r.pbrMetallicRoughness||{};if(o.color=new ve(1,1,1),o.opacity=1,Array.isArray(d.baseColorFactor)){const h=d.baseColorFactor;o.color.setRGB(h[0],h[1],h[2],en),o.opacity=h[3]}d.baseColorTexture!==void 0&&c.push(t.assignTexture(o,"map",d.baseColorTexture,Ut)),o.metalness=d.metallicFactor!==void 0?d.metallicFactor:1,o.roughness=d.roughnessFactor!==void 0?d.roughnessFactor:1,d.metallicRoughnessTexture!==void 0&&(c.push(t.assignTexture(o,"metalnessMap",d.metallicRoughnessTexture)),c.push(t.assignTexture(o,"roughnessMap",d.metallicRoughnessTexture))),a=this._invokeOne(function(h){return h.getMaterialType&&h.getMaterialType(e)}),c.push(Promise.all(this._invokeAll(function(h){return h.extendMaterialParams&&h.extendMaterialParams(e,o)})))}r.doubleSided===!0&&(o.side=wt);const u=r.alphaMode||xc.OPAQUE;if(u===xc.BLEND?(o.transparent=!0,o.depthWrite=!1):(o.transparent=!1,u===xc.MASK&&(o.alphaTest=r.alphaCutoff!==void 0?r.alphaCutoff:.5)),r.normalTexture!==void 0&&a!==Mt&&(c.push(t.assignTexture(o,"normalMap",r.normalTexture)),o.normalScale=new j(1,1),r.normalTexture.scale!==void 0)){const d=r.normalTexture.scale;o.normalScale.set(d,d)}if(r.occlusionTexture!==void 0&&a!==Mt&&(c.push(t.assignTexture(o,"aoMap",r.occlusionTexture)),r.occlusionTexture.strength!==void 0&&(o.aoMapIntensity=r.occlusionTexture.strength)),r.emissiveFactor!==void 0&&a!==Mt){const d=r.emissiveFactor;o.emissive=new ve().setRGB(d[0],d[1],d[2],en)}return r.emissiveTexture!==void 0&&a!==Mt&&c.push(t.assignTexture(o,"emissiveMap",r.emissiveTexture,Ut)),Promise.all(c).then(function(){const d=new a(o);return r.name&&(d.name=r.name),Wn(d,r),t.associations.set(d,{materials:e}),r.extensions&&Vi(s,d,r),d})}createUniqueName(e){const t=ut.sanitizeNodeName(e||"");return t in this.nodeNamesUsed?t+"_"+ ++this.nodeNamesUsed[t]:(this.nodeNamesUsed[t]=0,t)}loadGeometries(e){const t=this,n=this.extensions,s=this.primitiveCache;function r(o){return n[Ze.KHR_DRACO_MESH_COMPRESSION].decodePrimitive(o,t).then(function(l){return Gf(l,o,t)})}const a=[];for(let o=0,l=e.length;o<l;o++){const c=e[o],u=ab(c),d=s[u];if(d)a.push(d.promise);else{let h;c.extensions&&c.extensions[Ze.KHR_DRACO_MESH_COMPRESSION]?h=r(c):h=Gf(new nt,c,t),s[u]={primitive:c,promise:h},a.push(h)}}return Promise.all(a)}loadMesh(e){const t=this,n=this.json,s=this.extensions,r=n.meshes[e],a=r.primitives,o=[];for(let l=0,c=a.length;l<c;l++){const u=a[l].material===void 0?ib(this.cache):this.getDependency("material",a[l].material);o.push(u)}return o.push(t.loadGeometries(a)),Promise.all(o).then(function(l){const c=l.slice(0,l.length-1),u=l[l.length-1],d=[];for(let f=0,p=u.length;f<p;f++){const _=u[f],m=a[f];let g;const S=c[f];if(m.mode===mn.TRIANGLES||m.mode===mn.TRIANGLE_STRIP||m.mode===mn.TRIANGLE_FAN||m.mode===void 0)g=r.isSkinnedMesh===!0?new i_(_,S):new ot(_,S),g.isSkinnedMesh===!0&&g.normalizeSkinWeights(),m.mode===mn.TRIANGLE_STRIP?g.geometry=Bf(g.geometry,Op):m.mode===mn.TRIANGLE_FAN&&(g.geometry=Bf(g.geometry,_u));else if(m.mode===mn.LINES)g=new ji(_,S);else if(m.mode===mn.LINE_STRIP)g=new ml(_,S);else if(m.mode===mn.LINE_LOOP)g=new u_(_,S);else if(m.mode===mn.POINTS)g=new ur(_,S);else throw new Error("THREE.GLTFLoader: Primitive mode unsupported: "+m.mode);Object.keys(g.geometry.morphAttributes).length>0&&rb(g,r),g.name=t.createUniqueName(r.name||"mesh_"+e),Wn(g,r),m.extensions&&Vi(s,g,m),t.assignFinalMaterial(g),d.push(g)}for(let f=0,p=d.length;f<p;f++)t.associations.set(d[f],{meshes:e,primitives:f});if(d.length===1)return r.extensions&&Vi(s,d[0],r),d[0];const h=new In;r.extensions&&Vi(s,h,r),t.associations.set(h,{meshes:e});for(let f=0,p=d.length;f<p;f++)h.add(d[f]);return h})}loadCamera(e){let t;const n=this.json.cameras[e],s=n[n.type];if(!s){console.warn("THREE.GLTFLoader: Missing camera parameters.");return}return n.type==="perspective"?t=new Zt(lh.radToDeg(s.yfov),s.aspectRatio||1,s.znear||1,s.zfar||2e6):n.type==="orthographic"&&(t=new Ea(-s.xmag,s.xmag,s.ymag,-s.ymag,s.znear,s.zfar)),n.name&&(t.name=this.createUniqueName(n.name)),Wn(t,n),Promise.resolve(t)}loadSkin(e){const t=this.json.skins[e],n=[];for(let s=0,r=t.joints.length;s<r;s++)n.push(this._loadNodeShallow(t.joints[s]));return t.inverseBindMatrices!==void 0?n.push(this.getDependency("accessor",t.inverseBindMatrices)):n.push(null),Promise.all(n).then(function(s){const r=s.pop(),a=s,o=[],l=[];for(let c=0,u=a.length;c<u;c++){const d=a[c];if(d){o.push(d);const h=new Ke;r!==null&&h.fromArray(r.array,c*16),l.push(h)}else console.warn('THREE.GLTFLoader: Joint "%s" could not be found.',t.joints[c])}return new fh(o,l)})}loadAnimation(e){const t=this.json,n=this,s=t.animations[e],r=s.name?s.name:"animation_"+e,a=[],o=[],l=[],c=[],u=[];for(let d=0,h=s.channels.length;d<h;d++){const f=s.channels[d],p=s.samplers[f.sampler],_=f.target,m=_.node,g=s.parameters!==void 0?s.parameters[p.input]:p.input,S=s.parameters!==void 0?s.parameters[p.output]:p.output;_.node!==void 0&&(a.push(this.getDependency("node",m)),o.push(this.getDependency("accessor",g)),l.push(this.getDependency("accessor",S)),c.push(p),u.push(_))}return Promise.all([Promise.all(a),Promise.all(o),Promise.all(l),Promise.all(c),Promise.all(u)]).then(function(d){const h=d[0],f=d[1],p=d[2],_=d[3],m=d[4],g=[];for(let v=0,M=h.length;v<M;v++){const T=h[v],E=f[v],R=p[v],y=_[v],A=m[v];if(T===void 0)continue;T.updateMatrix&&T.updateMatrix();const U=n._createAnimationTracks(T,E,R,y,A);if(U)for(let C=0;C<U.length;C++)g.push(U[C])}const S=new ry(r,void 0,g);return Wn(S,s),S})}createNodeMesh(e){const t=this.json,n=this,s=t.nodes[e];return s.mesh===void 0?null:n.getDependency("mesh",s.mesh).then(function(r){const a=n._getNodeRef(n.meshCache,s.mesh,r);return s.weights!==void 0&&a.traverse(function(o){if(o.isMesh)for(let l=0,c=s.weights.length;l<c;l++)o.morphTargetInfluences[l]=s.weights[l]}),a})}loadNode(e){const t=this.json,n=this,s=t.nodes[e],r=n._loadNodeShallow(e),a=[],o=s.children||[];for(let c=0,u=o.length;c<u;c++)a.push(n.getDependency("node",o[c]));const l=s.skin===void 0?Promise.resolve(null):n.getDependency("skin",s.skin);return Promise.all([r,Promise.all(a),l]).then(function(c){const u=c[0],d=c[1],h=c[2];h!==null&&u.traverse(function(f){f.isSkinnedMesh&&f.bind(h,lb)});for(let f=0,p=d.length;f<p;f++)u.add(d[f]);if(u.userData.pivot!==void 0&&d.length>0){const f=u.userData.pivot,p=d[0];u.pivot=new P().fromArray(f),u.position.x-=f[0],u.position.y-=f[1],u.position.z-=f[2],p.position.set(0,0,0),delete u.userData.pivot}return u})}_loadNodeShallow(e){const t=this.json,n=this.extensions,s=this;if(this.nodeCache[e]!==void 0)return this.nodeCache[e];const r=t.nodes[e],a=r.name?s.createUniqueName(r.name):"",o=[],l=s._invokeOne(function(c){return c.createNodeMesh&&c.createNodeMesh(e)});return l&&o.push(l),r.camera!==void 0&&o.push(s.getDependency("camera",r.camera).then(function(c){return s._getNodeRef(s.cameraCache,r.camera,c)})),s._invokeAll(function(c){return c.createNodeAttachment&&c.createNodeAttachment(e)}).forEach(function(c){o.push(c)}),this.nodeCache[e]=Promise.all(o).then(function(c){let u;if(r.isBone===!0?u=new Vp:c.length>1?u=new In:c.length===1?u=c[0]:u=new xt,u!==c[0])for(let d=0,h=c.length;d<h;d++)u.add(c[d]);if(r.name&&(u.userData.name=r.name,u.name=a),Wn(u,r),r.extensions&&Vi(n,u,r),r.matrix!==void 0){const d=new Ke;d.fromArray(r.matrix),u.applyMatrix4(d)}else r.translation!==void 0&&u.position.fromArray(r.translation),r.rotation!==void 0&&u.quaternion.fromArray(r.rotation),r.scale!==void 0&&u.scale.fromArray(r.scale);if(!s.associations.has(u))s.associations.set(u,{});else if(r.mesh!==void 0&&s.meshCache.refs[r.mesh]>1){const d=s.associations.get(u);s.associations.set(u,{...d})}return s.associations.get(u).nodes=e,u}),this.nodeCache[e]}loadScene(e){const t=this.extensions,n=this.json.scenes[e],s=this,r=new In;n.name&&(r.name=s.createUniqueName(n.name)),Wn(r,n),n.extensions&&Vi(t,r,n);const a=n.nodes||[],o=[];for(let l=0,c=a.length;l<c;l++)o.push(s.getDependency("node",a[l]));return Promise.all(o).then(function(l){for(let u=0,d=l.length;u<d;u++){const h=l[u];h.parent!==null?r.add(L1(h)):r.add(h)}const c=u=>{const d=new Map;for(const[h,f]of s.associations)(h instanceof Sn||h instanceof Rt)&&d.set(h,f);return u.traverse(h=>{const f=s.associations.get(h);f!=null&&d.set(h,f)}),d};return s.associations=c(r),r})}_createAnimationTracks(e,t,n,s,r){const a=[],o=e.name?e.name:e.uuid,l=[];Ti[r.path]===Ti.weights?e.traverse(function(h){h.morphTargetInfluences&&l.push(h.name?h.name:h.uuid)}):l.push(o);let c;switch(Ti[r.path]){case Ti.weights:c=tr;break;case Ti.rotation:c=nr;break;case Ti.translation:case Ti.scale:c=ir;break;default:n.itemSize===1?c=tr:c=ir;break}const u=s.interpolation!==void 0?nb[s.interpolation]:ca,d=this._getArrayFromAccessor(n);for(let h=0,f=l.length;h<f;h++){const p=new c(l[h]+"."+Ti[r.path],t.array,d,u);s.interpolation==="CUBICSPLINE"&&this._createCubicSplineTrackInterpolant(p),a.push(p)}return a}_getArrayFromAccessor(e){let t=e.array;if(e.normalized){const n=Iu(t.constructor),s=new Float32Array(t.length);for(let r=0,a=t.length;r<a;r++)s[r]=t[r]*n;t=s}return t}_createCubicSplineTrackInterpolant(e){e.createInterpolant=function(n){const s=this instanceof nr?tb:bm;return new s(this.times,this.values,this.getValueSize()/3,n)},e.createInterpolant.isInterpolantFactoryMethodGLTFCubicSpline=!0}}function ub(i,e,t){const n=e.attributes,s=new dn;if(n.POSITION!==void 0){const o=t.json.accessors[n.POSITION],l=o.min,c=o.max;if(l!==void 0&&c!==void 0){if(s.set(new P(l[0],l[1],l[2]),new P(c[0],c[1],c[2])),o.normalized){const u=Iu(Ks[o.componentType]);s.min.multiplyScalar(u),s.max.multiplyScalar(u)}}else{console.warn("THREE.GLTFLoader: Missing min/max properties for accessor POSITION.");return}}else return;const r=e.targets;if(r!==void 0){const o=new P,l=new P;for(let c=0,u=r.length;c<u;c++){const d=r[c];if(d.POSITION!==void 0){const h=t.json.accessors[d.POSITION],f=h.min,p=h.max;if(f!==void 0&&p!==void 0){if(l.setX(Math.max(Math.abs(f[0]),Math.abs(p[0]))),l.setY(Math.max(Math.abs(f[1]),Math.abs(p[1]))),l.setZ(Math.max(Math.abs(f[2]),Math.abs(p[2]))),h.normalized){const _=Iu(Ks[h.componentType]);l.multiplyScalar(_)}o.max(l)}else console.warn("THREE.GLTFLoader: Missing min/max properties for accessor POSITION.")}}s.expandByVector(o)}i.boundingBox=s;const a=new Mn;s.getCenter(a.center),a.radius=s.min.distanceTo(s.max)/2,i.boundingSphere=a}function Gf(i,e,t){const n=e.attributes,s=[];function r(a,o){return t.getDependency("accessor",a).then(function(l){i.setAttribute(o,l)})}for(const a in n){const o=Pu[a]||a.toLowerCase();o in i.attributes||s.push(r(n[a],o))}if(e.indices!==void 0&&!i.index){const a=t.getDependency("accessor",e.indices).then(function(o){i.setIndex(o)});s.push(a)}return et.workingColorSpace!==en&&"COLOR_0"in n&&console.warn(`THREE.GLTFLoader: Converting vertex colors from "srgb-linear" to "${et.workingColorSpace}" not supported.`),Wn(i,e),ub(i,e,t),Promise.all(s).then(function(){return e.targets!==void 0?sb(i,e.targets,t):i})}const hb={KATL:"Atlanta",KORD:"Chicago",KLAX:"Los Angeles",KDFW:"Dallas",KDEN:"Denver",KJFK:"New York",KSFO:"San Francisco",KSEA:"Seattle",KLAS:"Las Vegas",KMCO:"Orlando",KEWR:"Newark",KPHX:"Phoenix",KIAH:"Houston",KMIA:"Miami",KBOS:"Boston",KLGA:"New York",KDTW:"Detroit",KMSN:"Madison",KMSP:"Minneapolis",KPHL:"Philadelphia",KFLL:"Fort Lauderdale",KBWI:"Baltimore",KIAD:"Washington",KDCA:"Washington",KSLC:"Salt Lake City",KPDX:"Portland",KOAK:"Oakland",KSJC:"San Jose",KSNA:"Santa Ana",KHOU:"Houston",KMDW:"Chicago",KBNA:"Nashville",KCLT:"Charlotte",KMEM:"Memphis",KSTL:"St Louis",KRDU:"Raleigh",KSMF:"Sacramento",KTPA:"Tampa",KPBI:"Palm Beach",KABQ:"Albuquerque",KANC:"Anchorage",PHNL:"Honolulu",PHOG:"Maui",KOMA:"Omaha",KMCI:"Kansas City",KCVG:"Cincinnati",KCMH:"Columbus",KPIT:"Pittsburgh",KBUF:"Buffalo",KROC:"Rochester",KALB:"Albany",KBDL:"Hartford",KPVD:"Providence",KSYR:"Syracuse",KMHT:"Manchester",KBTV:"Burlington",KPWM:"Portland ME",KBGR:"Bangor",KRIC:"Richmond",KORF:"Norfolk",KCLT:"Charlotte",KGSO:"Greensboro",KCAE:"Columbia",KCHS:"Charleston",KSAV:"Savannah",KJAX:"Jacksonville",KPNS:"Pensacola",KMOB:"Mobile",KNEW:"New Orleans",KBTR:"Baton Rouge",KLIT:"Little Rock",KTUL:"Tulsa",KOKC:"Oklahoma City",KSAT:"San Antonio",KAUS:"Austin",KELP:"El Paso",KAMA:"Amarillo",KLBB:"Lubbock",KABI:"Abilene",KSJT:"San Angelo",KMAF:"Midland",KODQ:"Doha",KCOS:"Colorado Springs",KGJT:"Grand Junction",KBZN:"Bozeman",KBTM:"Butte",KGPI:"Kalispell",KFCA:"Kalispell",KSUN:"Sun Valley",KIDA:"Idaho Falls",KPSC:"Pasco",KYKM:"Yakima",KEAT:"Wenatchee",KBFI:"Seattle",KRNT:"Renton",KPAE:"Everett",KSFF:"Spokane",KGEG:"Spokane",KBOI:"Boise",KMFR:"Medford",KEUG:"Eugene",KRDM:"Redmond",KOTH:"North Bend",KCEC:"Crescent City",KRDD:"Redding",KFAT:"Fresno",KBFL:"Bakersfield",KSBP:"San Luis Obispo",KSMX:"Santa Maria",KSBA:"Santa Barbara",KONT:"Ontario",KPSP:"Palm Springs",KIPL:"El Centro",KSAN:"San Diego",KNKX:"San Diego",KMYF:"San Diego",KTOA:"Torrance",KBUR:"Burbank",KVNY:"Van Nuys",KLGB:"Long Beach",KFUL:"Fullerton",KSNA:"Orange County",KLAX:"Los Angeles",KHND:"Henderson",KVGT:"Las Vegas",KBAB:"Beale AFB",KRNO:"Reno",KTVL:"South Lake Tahoe",KMEV:"Minden",KMMH:"Mammoth Lakes",KSCK:"Stockton",KMOD:"Modesto",KMRY:"Monterey",KSNS:"Salinas",KWVI:"Watsonville",KSJC:"San Jose",KRHV:"San Jose",KNUQ:"Mountain View",KSQL:"San Carlos",KSFO:"San Francisco",KOAK:"Oakland",KCCR:"Concord",KLVK:"Livermore",KHWD:"Hayward",KAPC:"Napa",KSTS:"Santa Rosa",KUKI:"Ukiah",KACV:"Arcata",KMHS:"Auburn",KSAC:"Sacramento",KSMF:"Sacramento",KTRK:"Truckee",KTVL:"South Lake Tahoe",PANC:"Anchorage",PAFA:"Fairbanks",PAJN:"Juneau",PAKT:"Ketchikan",PASN:"St Paul",PADQ:"Kodiak",PHNL:"Honolulu",PHOG:"Maui",PHKO:"Kailua-Kona",PHLI:"Lihue",PHHI:"Oahu",CYYZ:"Toronto",CYVR:"Vancouver",CYUL:"Montreal",CYEG:"Edmonton",CYYC:"Calgary",CYOW:"Ottawa",CYHZ:"Halifax",CYWG:"Winnipeg",CYYJ:"Victoria",CYLW:"Kelowna",CYXE:"Saskatoon",CYQR:"Regina",CYQT:"Thunder Bay",CYAM:"Sault Ste Marie",CYWH:"Victoria",MMMX:"Mexico City",MMMY:"Monterrey",MMGL:"Guadalajara",MMTJ:"Tijuana",MMCU:"Chihuahua",MMCN:"Ciudad Obregon",MMMD:"Merida",MMUN:"Cancun",MMZT:"Mazatlan",MMPB:"Puebla",MROC:"San Jose",MGAS:"Tegucigalpa",MGGT:"Guatemala City",MNMG:"Managua",MPTO:"Panama City",MSSS:"San Salvador",TBPB:"Bridgetown",MKJP:"Kingston",MDSD:"Santo Domingo",TJSJ:"San Juan",MUVR:"Varadero",MUHA:"Havana",TNCM:"St Maarten",TFFR:"Pointe-a-Pitre",TFFF:"Fort-de-France",SBGR:"São Paulo",SBGL:"Rio de Janeiro",SBSP:"São Paulo",SBCF:"Belo Horizonte",SBBE:"Belém",SBMO:"Maceio",SBREC:"Recife",SBSV:"Salvador",SBFZ:"Fortaleza",SBMN:"Manaus",SBBV:"Boa Vista",SBRF:"Recife",SBPA:"Porto Alegre",SBFL:"Florianopolis",SBCT:"Curitiba",SBCY:"Cuiaba",SBPV:"Porto Velho",SBBH:"Belo Horizonte",SAEZ:"Buenos Aires",SABE:"Buenos Aires",SACO:"Cordoba",SAMM:"Mendoza",SASJ:"Salta",SCFA:"Antofagasta",SCEL:"Santiago",SPIM:"Lima",SKBO:"Bogota",SEQM:"Quito",SEGU:"Guayaquil",SVMI:"Caracas",SMJP:"Paramaribo",SYCJ:"Georgetown",SUAA:"Montevideo",SLVR:"La Paz",SPTU:"Puerto Maldonado",SPZO:"Cusco",EGLL:"London Heathrow",EGKK:"London Gatwick",EGSS:"London Stansted",EGGW:"London Luton",EGCC:"Manchester",EGPH:"Edinburgh",EGPF:"Glasgow",EGBB:"Birmingham",EGGD:"Bristol",EGNX:"East Midlands",EGNT:"Newcastle",EGNJ:"Humberside",EGAA:"Belfast",EGAC:"Belfast City",EIDW:"Dublin",EICK:"Cork",EINN:"Shannon",LFPG:"Paris CDG",LFPO:"Paris Orly",LFLY:"Lyon",LFMN:"Nice",LFLL:"Lyon",LFML:"Marseille",LFBD:"Bordeaux",LFBO:"Toulouse",LFRS:"Nantes",LFRN:"Rennes",LFST:"Strasbourg",EDDF:"Frankfurt",EDDL:"Düsseldorf",EDDM:"Munich",EDDB:"Berlin",EDDI:"Berlin",EDDH:"Hamburg",EDDS:"Stuttgart",EDDV:"Hanover",EDDN:"Nuremberg",EDDP:"Leipzig",EHAM:"Amsterdam",EHBK:"Maastricht",EHGG:"Groningen",EHRD:"Rotterdam",EBBR:"Brussels",EBCI:"Charleroi",ELLX:"Luxembourg",LEMD:"Madrid",LEBL:"Barcelona",LEPA:"Palma",LEAL:"Alicante",LEMG:"Malaga",LEBB:"Bilbao",LESO:"San Sebastian",LEVT:"Vitoria",LEZL:"Seville",LEGR:"Granada",LPPT:"Lisbon",LPPR:"Porto",LPFR:"Faro",LPLA:"Azores",LIRF:"Rome Fiumicino",LIML:"Milan Linate",LIME:"Bergamo",LIMC:"Milan Malpensa",LIPZ:"Venice",LIRQ:"Florence",LIRN:"Naples",LICJ:"Palermo",LICC:"Catania",LICA:"Lamezia Terme",LSZH:"Zurich",LSGG:"Geneva",LSZA:"Lugano",LSZB:"Bern",LOWI:"Innsbruck",LOWW:"Vienna",LOWS:"Salzburg",LOWK:"Klagenfurt",LHBP:"Budapest",LKPR:"Prague",EPWA:"Warsaw",EPKK:"Krakow",EPGD:"Gdansk",OKBK:"Kuwait",LEAL:"Alicante",EKCH:"Copenhagen",ESGG:"Gothenburg",ESSA:"Stockholm",ESKN:"Stockholm Skavsta",EFHK:"Helsinki",EFTP:"Tampere",EFTU:"Turku",ENGM:"Oslo",ENBR:"Bergen",ENVA:"Trondheim",EVRA:"Riga",EYVI:"Vilnius",EETN:"Tallinn",UUEE:"Moscow Sheremetyevo",UUDD:"Moscow Domodedovo",UUBW:"Moscow Zhukovsky",UKBB:"Kyiv Boryspil",UKLL:"Lviv",LROP:"Bucharest",LWSK:"Skopje",LBSF:"Sofia",LDZA:"Zagreb",LJLJ:"Ljubljana",LYBE:"Belgrade",LYNI:"Nis",LWOH:"Ohrid",LGAV:"Athens",LGTS:"Thessaloniki",LGKR:"Corfu",LGRP:"Rhodes",LGIR:"Heraklion",LTBA:"Istanbul Ataturk",LTFM:"Istanbul",LTAI:"Antalya",LTBJ:"Izmir",LTAC:"Ankara",OMDB:"Dubai",OMDW:"Dubai World Central",OMAA:"Abu Dhabi",OMSJ:"Sharjah",OERK:"Riyadh",OEDF:"Dammam",OEJN:"Jeddah",OEMD:"Madinah",OETF:"Taif",OKBK:"Kuwait City",OEAB:"Abha",OOMM:"Muscat",OIKB:"Bandar Abbas",OIII:"Tehran",OBBI:"Bahrain",OTHH:"Doha",OLBA:"Beirut",ORBI:"Baghdad",OSDI:"Damascus",HECA:"Cairo",LLBG:"Tel Aviv",OJAM:"Amman",HECA:"Cairo",HEAT:"Aswan",HELX:"Luxor",HESH:"Sharm el-Sheikh",HEAR:"El Arish",GMMN:"Casablanca",GMME:"Rabat",GMFM:"Marrakech",GMTT:"Tangier",DTTJ:"Djerba",DTTA:"Tunis",DAAG:"Algiers",DTMB:"Monastir",DTNH:"Enfidha",HAAB:"Addis Ababa",HKJK:"Nairobi",FMMI:"Antananarivo",FMCH:"Moroni",FAOR:"Johannesburg",FACT:"Cape Town",FALE:"Durban",FAGM:"Johannesburg Rand",FBSK:"Gaborone",FWKI:"Lilongwe",FQMA:"Maputo",FVHA:"Harare",FLLK:"Lusaka",FYWH:"Windhoek",FMCH:"Comoros",HLLT:"Tripoli",FSPP:"Mahé",DNMM:"Lagos",DNAS:"Abuja",DIKO:"Abidjan",DFFD:"Ouagadougou",DIAP:"Abidjan",GVNP:"Santiago (Cape Verde)",GOBD:"Dakar",GUCY:"Conakry",GBYD:"Banjul",VABB:"Mumbai",VIDP:"New Delhi",VOMM:"Chennai",VOHS:"Hyderabad",VOBL:"Bangalore",VECC:"Kolkata",VOMR:"Mumbai",VOCB:"Coimbatore",VOGO:"Goa",VIKN:"Lucknow",VOAT:"Pune",VIAR:"Amritsar",VIAI:"Ahmedabad",VIBR:"Bhopal",VEJH:"Jhansi",VNTC:"Kathmandu",VGHS:"Dhaka",VCBI:"Colombo",VRMM:"Malé",OPKC:"Karachi",OPLA:"Lahore",OPRN:"Islamabad",OPPS:"Peshawar",OPQT:"Quetta",VHHH:"Hong Kong",VMMC:"Macau",RCTP:"Taipei",RCSS:"Taipei Songshan",RCKH:"Kaohsiung",WSSS:"Singapore",WMKK:"Kuala Lumpur",VTBS:"Bangkok Suvarnabhumi",VTBD:"Bangkok Don Mueang",WMKP:"Penang",WMKD:"Kota Bahru",WBGG:"Kuching",WBKK:"Kota Kinabalu",WADD:"Bali",WIII:"Jakarta",WIDD:"Jakarta Halim",WRLL:"Balikpapan",WAMM:"Manado",WAPP:"Palu",RPLL:"Manila",RPLC:"Clark",RPMD:"Davao",RPMZ:"Zamboanga",RPLM:"Puerto Princesa",VDPP:"Phnom Penh",VVNB:"Hanoi",VVTS:"Ho Chi Minh City",VVDN:"Da Nang",VLVT:"Vientiane",VYYY:"Yangon",RKSI:"Seoul Incheon",RKSS:"Seoul Gimpo",RKPK:"Busan",RJTT:"Tokyo Haneda",RJAA:"Tokyo Narita",RJOO:"Osaka Itami",RJBB:"Osaka Kansai",RJCC:"Sapporo",RJFF:"Fukuoka",RJKK:"Jeju",RCBS:"Kinmen",ZBAA:"Beijing Capital",ZBAD:"Beijing Daxing",ZSPD:"Shanghai Pudong",ZSSS:"Shanghai Hongqiao",ZGGG:"Guangzhou",ZGSZ:"Shenzhen",ZUCK:"Chongqing",ZUUU:"Chengdu",ZLXY:"Xian",ZSNJ:"Nanjing",ZSHC:"Hangzhou",ZSFZ:"Fuzhou",ZSAM:"Xiamen",ZGHA:"Changsha",ZSQD:"Qingdao",ZYTX:"Shenyang",ZYHB:"Harbin",ZYCC:"Changchun",ZLLL:"Lanzhou",ZWWW:"Ürümqi",ZPPP:"Kunming",ZGNN:"Nanning",ZGOW:"Shantou",ZGZH:"Zhuhai",YSSY:"Sydney",YMML:"Melbourne",YBBN:"Brisbane",YPPH:"Perth",YPAD:"Adelaide",YBCG:"Gold Coast",YMHB:"Hobart",YMEN:"Melbourne Essendon",YCBR:"Canberra",YBCS:"Cairns",YBMK:"Mackay",YBRK:"Rockhampton",YPDN:"Darwin",YBTL:"Townsville",NZAA:"Auckland",NZCH:"Christchurch",NZWN:"Wellington",NZQN:"Queenstown",NFNA:"Suva",NTAA:"Papeete",NWWW:"Nouméa",AGGH:"Honiara",ANYN:"Nauru",PGUM:"Guam",PGSN:"Saipan",PHTO:"Hilo"};function Vf(i){return i&&hb[i.toUpperCase()]||null}const Kn=Math.PI/180,Em=3.28084,Tm=30,wm=50,Ih=8e3,Cm=12e3,Rm=2,Lm=-2,Pm=.35,db=3,Im=12*3600*1e3,Wf=120,fb=60*6e4;let Zr=[];const Wr=new Map,rl=1;function pb(i,e={}){Zr=i.map(t=>({code:t.code,icao:e[t.code]?.icao||t.code,lat:t.lat,lon:t.lon,name:t.name,country:t.country||""})),Wr.clear();for(let t=0;t<Zr.length;t++){const n=Zr[t],s=`${Math.floor(n.lat/rl)},${Math.floor(n.lon/rl)}`;Wr.has(s)||Wr.set(s,[]),Wr.get(s).push(t)}}function Dm(i,e,t){const n=[],s=Math.ceil(t/111)+1,r=Math.floor(i/rl),a=Math.floor(e/rl);for(let o=-s;o<=s;o++)for(let l=-s;l<=s;l++){const c=`${r+o},${a+l}`,u=Wr.get(c);if(u)for(const d of u){const h=Zr[d],f=Qr(i,e,h.lat,h.lon);f<=t&&n.push({airport:h,dist:f,idx:d})}}return n.sort((o,l)=>o.dist-l.dist),n}function Qr(i,e,t,n){const s=(t-i)*Kn,r=(n-e)*Kn,a=Math.sin(s/2)**2+Math.cos(i*Kn)*Math.cos(t*Kn)*Math.sin(r/2)**2;return 6371*2*Math.atan2(Math.sqrt(a),Math.sqrt(1-a))}function Nm(i,e,t,n){const s=(n-e)*Kn,r=Math.sin(s)*Math.cos(t*Kn),a=Math.cos(i*Kn)*Math.sin(t*Kn)-Math.sin(i*Kn)*Math.cos(t*Kn)*Math.cos(s);return(Math.atan2(r,a)*180/Math.PI+360)%360}function Um(i,e){let t=Math.abs(i-e)%360;return t>180?360-t:t}const mb={UAL:"Americas",AAL:"Americas",DAL:"Americas",SWA:"Americas",JBU:"Americas",NKS:"Americas",FFT:"Americas",ASA:"Americas",SKW:"Americas",RPA:"Americas",ENY:"Americas",PDT:"Americas",BAW:"Europe",EZY:"Europe",RYR:"Europe",DLH:"Europe",AFR:"Europe",KLM:"Europe",SAS:"Europe",FIN:"Europe",AZA:"Europe",IBE:"Europe",VLG:"Europe",SWR:"Europe",AUA:"Europe",TAP:"Europe",LOT:"Europe",WZZ:"Europe",THY:"Europe",AFL:"Europe",EIN:"Europe",UAE:"Middle East",QTR:"Middle East",ETD:"Middle East",SVA:"Middle East",MEA:"Middle East",GIA:"Middle East",SIA:"Asia",CPA:"Asia",ANA:"Asia",JAL:"Asia",KAL:"Asia",AAR:"Asia",CCA:"Asia",CES:"Asia",CSN:"Asia",HVN:"Asia",THA:"Asia",MAS:"Asia",AXM:"Asia",CEB:"Asia",IGO:"Asia",AIC:"Asia",QFA:"Pacific",ANZ:"Pacific",VOZ:"Pacific",JST:"Pacific",AVA:"Americas",LAN:"Americas",GLO:"Americas",AZU:"Americas",AMX:"Americas",CMP:"Americas",ETH:"Africa",SAA:"Africa",KQA:"Africa",MSR:"Africa",RAM:"Africa"};function Om(i){if(!i||i.length<4)return null;const e=i.match(/^([A-Z]{2,3})(\d{1,5})/);return e?{airline:e[1],flightNum:e[2],region:mb[e[1]]||null}:null}const rr=new Map;function gb(i,e){if(!e.latitude||!e.longitude)return;const t=e.baroAltitude!=null?e.baroAltitude*Em:null;let n=rr.get(i);n||(n={positions:[],callsign:e.callsign||null,originLocked:!1,destLocked:!1,destCandidateCode:null,destCandidateCount:0,lastInferTime:0},rr.set(i,n)),e.callsign&&e.callsign.length>=3&&(n.callsign=e.callsign),n.positions.push({lat:e.latitude,lon:e.longitude,altFt:t,vRate:e.verticalRate||0,heading:e.trueTrack!=null?e.trueTrack:null,gs:e.velocity||0,ts:Date.now()}),n.positions.length>Wf&&n.positions.splice(0,n.positions.length-Wf);const s=Date.now()-fb;for(;n.positions.length>0&&n.positions[0].ts<s;)n.positions.shift()}const va=new Map;function Bm(i,e){const t=new Date().toISOString().slice(0,10).replace(/-/g,"");return i&&i.length>=3?`${i}:${t}`:`${e}:${t}`}function Ko(i,e){const t=Bm(i,e),n=va.get(t);return n?Date.now()-n.ts>Im?(va.delete(t),null):n:null}function _b(i,e,t,n,s){const r=Bm(i,e);va.set(r,{origin:t,destination:n,confidence:s,estimated:!0,ts:Date.now()})}function yb(i,e,t){if(e.length===0)return 0;const n=e[0],s=Qr(n.lat,n.lon,i.lat,i.lon),r=Math.max(0,1-s/Tm);let a=.5;if(n.heading!=null){const f=Nm(n.lat,n.lon,i.lat,i.lon),p=Um(n.heading,f);a=p>90?.8+.2*((p-90)/90):.3}let o=.3;const c=e.filter(f=>f.vRate>Rm).length/e.length;o=Math.min(1,c*1.5);let u=.5;n.altFt!=null&&(n.altFt<2e3?u=1:n.altFt<5e3?u=.7:n.altFt<Ih?u=.4:u=.1);let d=0;t?.region&&i.country&&(d=.05);const h=r*.4+a*.15+o*.25+u*.2+d;return Math.min(1,h)}function xb(i,e,t){if(e.length===0)return 0;const n=e[e.length-1],s=Qr(n.lat,n.lon,i.lat,i.lon),r=Math.max(0,1-s/wm);let a=.5;if(n.heading!=null){const p=Nm(n.lat,n.lon,i.lat,i.lon),_=Um(n.heading,p);a=_<30?1:_<60?.7:_<90?.4:.1}let o=.5;if(e.length>=3){let p=0;for(let _=1;_<e.length;_++){const m=Qr(e[_-1].lat,e[_-1].lon,i.lat,i.lon);Qr(e[_].lat,e[_].lon,i.lat,i.lon)<m&&p++}o=p/(e.length-1)}let l=.3;const u=e.filter(p=>p.vRate<Lm).length/e.length;l=Math.min(1,u*1.5);let d=.5;if(e.length>=3){const p=e[0],_=e[e.length-1];if(p.altFt!=null&&_.altFt!=null&&_.altFt<p.altFt){const m=p.altFt-_.altFt;d=Math.min(1,m/5e3)}}let h=0;t?.region&&(h=.03);const f=r*.35+a*.2+o*.15+l*.15+d*.15+h;return Math.min(1,f)}function vb(i){const e=i.positions;if(e.length<3)return null;const t=[];for(const l of e)if(l.altFt!=null){if(l.altFt>Ih)break;l.vRate>0&&t.push(l)}if(t.length<2)return null;const n=t[0],s=Dm(n.lat,n.lon,Tm);if(s.length===0)return null;const r=Om(i.callsign),a=s.map(({airport:l,dist:c})=>({code:l.code,icao:l.icao,name:l.name,dist:Math.round(c*10)/10,score:yb(l,t,r)}));a.sort((l,c)=>c.score-l.score);const o=a[0];return o&&o.score>=Pm?{code:o.code,icao:o.icao,score:o.score,dist:o.dist}:null}function Sb(i){const e=i.positions;if(e.length<5)return null;const t=[];for(let l=e.length-1;l>=0;l--){const c=e[l];if(c.altFt!=null){if(c.altFt>Cm)break;c.vRate<0&&t.unshift(c)}}if(t.length<3)return null;const n=t[t.length-1],s=Dm(n.lat,n.lon,wm);if(s.length===0)return null;const r=Om(i.callsign),a=s.map(({airport:l,dist:c})=>({code:l.code,icao:l.icao,name:l.name,dist:Math.round(c*10)/10,score:xb(l,t,r)}));a.sort((l,c)=>c.score-l.score);const o=a[0];return!o||o.score<Pm?null:(i.destCandidateCode===o.code?i.destCandidateCount++:(i.destCandidateCode=o.code,i.destCandidateCount=1),i.destCandidateCount>=db?{code:o.code,icao:o.icao,score:o.score,dist:o.dist}:null)}function Fm(i,e){if(Zr.length===0)return null;const t=Ko(e,i);if(t&&(t.origin||t.destination))return t;const n=rr.get(i);if(!n||n.positions.length<3)return null;const s=Date.now();if(s-n.lastInferTime<1e4)return Ko(e,i);n.lastInferTime=s;let r=null,a=null,o="low";if(!n.originLocked){const c=vb(n);c&&(r=c.code,n.originLocked=!0)}if(!n.destLocked){const c=Sb(n);c&&(a=c.code,n.destLocked=!0)}const l=Ko(e,i);return!r&&l?.origin&&(r=l.origin),!a&&l?.destination&&(a=l.destination),r&&a?o="high":r||a?o="medium":o="low",(r||a)&&_b(e,i,r,a,o),!r&&!a?null:{origin:r,destination:a,confidence:o,estimated:!0}}function Mb(i,e){return Ko(e,i)}function Ab(i){for(const e of i){if(!e.icao24||!e.latitude||!e.longitude)continue;gb(e.icao24,e);const t=rr.get(e.icao24);if(!t||t.originLocked&&t.destLocked)continue;const n=e.baroAltitude!=null?e.baroAltitude*Em:null,s=e.verticalRate||0;(t.positions.length<=5||!t.originLocked&&n!=null&&n<Ih&&s>Rm||!t.destLocked&&n!=null&&n<Cm&&s<Lm)&&Fm(e.icao24,e.callsign||t.callsign)}}function bb(i){for(const t of rr.keys())i.has(t)||rr.delete(t);const e=Date.now();for(const[t,n]of va)e-n.ts>Im&&va.delete(t)}const Eb="/api/adsbfi/api/v2",Tb="/api/adsboe/v2",wb="/api/trace/data/traces",Cb=3500,zm=3e3,Kf=100;let Dh=40.7128,Nh=-74.006,km=0,Du=null,Nu=null,_o=0;const al=new Map,Rb=6e5,ar=new Map,Lb=9e5,Pb=18e5,ea=new Set;function Hm(i,e){Dh=i,Nh=e}function xl(){return{lat:Dh,lon:Nh}}function Ib(i){const e=i.alt_baro;return e==="ground"||e==null||i.lat==null||i.lon==null?null:{icao24:i.hex,callsign:(i.flight||"").trim(),originCountry:null,timePosition:Math.floor(Date.now()/1e3),lastContact:Math.floor(Date.now()/1e3),longitude:i.lon,latitude:i.lat,baroAltitude:typeof e=="number"?e*.3048:null,onGround:e==="ground",velocity:i.gs!=null?i.gs*.514444:null,trueTrack:i.track,verticalRate:i.baro_rate!=null?i.baro_rate*.00508:null,geoAltitude:i.alt_geom!=null?i.alt_geom*.3048:null,category:i.category,registration:i.r,aircraftType:i.t,origin:i.oa||null,destination:i.da||null,operator:i.ownOp||null,year:i.year||null,typeDesc:i.desc||null,squawk:i.squawk||null,rssi:i.rssi!=null?i.rssi:null,navAltitude:i.nav_altitude!=null?i.nav_altitude*.3048:null,navHeading:i.nav_heading!=null?i.nav_heading:null,ias:i.ias!=null?i.ias:null,tas:i.tas!=null?i.tas:null,mach:i.mach!=null?i.mach:null,emergency:i.emergency||null,groundSpeed:i.gs!=null?i.gs:null}}function Db(i){const e=i.ac||i.aircraft;return!e||!Array.isArray(e)?[]:e.map(Ib).filter(t=>t!=null&&t.baroAltitude!=null&&t.baroAltitude>100)}let Xo=0,Kr=0;async function Xf(i,e,t){const n=new AbortController,s=setTimeout(()=>n.abort(),Cb);try{const r=await fetch(i,{cache:"no-store",signal:n.signal});if(r.status===429)throw e.v=Date.now()+12e4,new Error(`${t} 429`);if(!r.ok)throw new Error(`${t} HTTP ${r.status}`);return Db(await r.json())}finally{clearTimeout(s)}}async function Nb(){const i=Dh.toFixed(4),e=Nh.toFixed(4),t=Math.floor(Date.now()/1e3),n={v:Kr};if(Date.now()>=Kr)try{const r=await Xf(`${Tb}/point/${i}/${e}/${Kf}?_t=${t}`,n,"adsb.one");return Kr=n.v,r}catch{Kr=n.v}const s={v:Xo};if(Date.now()>=Xo){const r=await Xf(`${Eb}/lat/${i}/lon/${e}/dist/${Kf}?_t=${t}`,s,"adsb.fi");return Xo=s.v,r}throw new Error("all sources rate-limited")}let Ir=!1,Yf=0;async function Gm(i){if(!ea.has(i)){ea.add(i);try{const e=i.slice(-2),t=`${wb}/${e}/trace_full_${i}.json`,n=await fetch(t);if(!n.ok)return;const s=await n.json();if(!s.trace||!Array.isArray(s.trace))return;const r=s.timestamp||0,o=Date.now()/1e3-1800,l=[];for(const c of s.trace){const u=r+c[0];if(u<o)continue;const d=c[1],h=c[2],f=c[3];d==null||h==null||f==null||f==="ground"||l.push({latitude:d,longitude:h,baroAltitude:f*.3048,time:u})}l.length>=1&&ar.set(i,{path:l,fetchedAt:Date.now()})}catch{}finally{ea.delete(i)}}}let ta=[],yo=null;function Ub(i){if(!(ar.has(i)||ea.has(i))&&!ta.includes(i)&&(ta.push(i),!yo)){const e=()=>{const t=ta.splice(0,8);if(t.length===0){clearInterval(yo),yo=null;return}for(const n of t)Gm(n)};e(),yo=setInterval(e,200)}}function Ob(i){if(!i||ea.has(i))return;const e=ta.indexOf(i);e!==-1&&ta.splice(e,1),Gm(i)}async function qf(){if(Ir&&Date.now()-Yf>5e3&&(Ir=!1),!Ir&&!(Date.now()<Xo&&Date.now()<Kr)){Ir=!0,Yf=Date.now();try{const i=await Nb();_o=0,km=Date.now(),Du&&Du(i);for(const t of i){const n=t.callsign;if(!n||n.length<3||n===t.icao24||!t.origin&&!t.destination)continue;const s=al.get(n);s&&(s.originCity||s.destCity)||al.set(n,{origin:t.origin||null,destination:t.destination||null,originCity:Vf(t.origin),destCity:Vf(t.destination),fetchedAt:Date.now()})}Ab(i);const e=new Set;for(const t of i)if(t.icao24){e.add(t.icao24);const n=ar.get(t.icao24);(!n||Date.now()-n.fetchedAt>Lb)&&Ub(t.icao24)}bb(e)}catch(i){_o++,console.error("[Data] Fetch error:",i.message,`(${_o})`),Nu&&Nu(i,_o)}finally{Ir=!1}}}function Bb(i,e){Du=i,Nu=e,qf(),setInterval(qf,zm)}function Fb(){return km}function zb(){return zm}function $f(i){if(!i)return null;const e=al.get(i);return e?Date.now()-e.fetchedAt>Rb?(al.delete(i),null):e:null}function Jf(i){if(!i)return null;const e=ar.get(i);return!e||!e.path?null:Date.now()-e.fetchedAt>Pb?(ar.delete(i),null):e.path}function jf(i){if(!i)return 0;const e=ar.get(i);return!e||!e.path?0:e.fetchedAt}const kb={A318:{pax:132,range:3100,mfr:"Airbus",name:"A318"},A319:{pax:156,range:3700,mfr:"Airbus",name:"A319"},A320:{pax:180,range:3300,mfr:"Airbus",name:"A320"},A20N:{pax:194,range:3500,mfr:"Airbus",name:"A320neo"},A321:{pax:220,range:3200,mfr:"Airbus",name:"A321"},A21N:{pax:244,range:4e3,mfr:"Airbus",name:"A321neo"},B737:{pax:162,range:3115,mfr:"Boeing",name:"737-800"},B738:{pax:189,range:3115,mfr:"Boeing",name:"737-800"},B739:{pax:220,range:3200,mfr:"Boeing",name:"737-900ER"},B38M:{pax:210,range:3550,mfr:"Boeing",name:"737 MAX 8"},B39M:{pax:230,range:3550,mfr:"Boeing",name:"737 MAX 9"},B3XM:{pax:230,range:3850,mfr:"Boeing",name:"737 MAX 10"},B752:{pax:200,range:3900,mfr:"Boeing",name:"757-200"},B753:{pax:280,range:3400,mfr:"Boeing",name:"757-300"},BCS1:{pax:133,range:3100,mfr:"Airbus",name:"A220-100"},BCS3:{pax:160,range:3350,mfr:"Airbus",name:"A220-300"},A332:{pax:277,range:6750,mfr:"Airbus",name:"A330-200"},A333:{pax:335,range:5750,mfr:"Airbus",name:"A330-300"},A338:{pax:287,range:7200,mfr:"Airbus",name:"A330-800neo"},A339:{pax:310,range:7200,mfr:"Airbus",name:"A330-900neo"},A359:{pax:325,range:8100,mfr:"Airbus",name:"A350-900"},A35K:{pax:369,range:8700,mfr:"Airbus",name:"A350-1000"},B762:{pax:255,range:6600,mfr:"Boeing",name:"767-200ER"},B763:{pax:290,range:5990,mfr:"Boeing",name:"767-300ER"},B764:{pax:375,range:5625,mfr:"Boeing",name:"767-400ER"},B772:{pax:314,range:5240,mfr:"Boeing",name:"777-200"},B77L:{pax:314,range:7700,mfr:"Boeing",name:"777-200LR"},B77W:{pax:365,range:7370,mfr:"Boeing",name:"777-300ER"},B778:{pax:384,range:8730,mfr:"Boeing",name:"777-8"},B779:{pax:426,range:7285,mfr:"Boeing",name:"777-9"},B788:{pax:242,range:7355,mfr:"Boeing",name:"787-8"},B789:{pax:290,range:7635,mfr:"Boeing",name:"787-9"},B78X:{pax:330,range:7635,mfr:"Boeing",name:"787-10"},A388:{pax:555,range:8e3,mfr:"Airbus",name:"A380-800"},B744:{pax:416,range:7260,mfr:"Boeing",name:"747-400"},B748:{pax:410,range:7730,mfr:"Boeing",name:"747-8i"},A342:{pax:253,range:6700,mfr:"Airbus",name:"A340-200"},A343:{pax:295,range:6700,mfr:"Airbus",name:"A340-300"},A345:{pax:313,range:8500,mfr:"Airbus",name:"A340-500"},A346:{pax:380,range:7900,mfr:"Airbus",name:"A340-600"},CRJ2:{pax:50,range:1700,mfr:"Bombardier",name:"CRJ-200"},CRJ7:{pax:70,range:1600,mfr:"Bombardier",name:"CRJ-700"},CRJ9:{pax:90,range:1550,mfr:"Bombardier",name:"CRJ-900"},CRJX:{pax:104,range:1600,mfr:"Bombardier",name:"CRJ-1000"},E170:{pax:72,range:2100,mfr:"Embraer",name:"E170"},E75L:{pax:88,range:2200,mfr:"Embraer",name:"E175"},E75S:{pax:88,range:2200,mfr:"Embraer",name:"E175"},E190:{pax:100,range:2450,mfr:"Embraer",name:"E190"},E195:{pax:124,range:2300,mfr:"Embraer",name:"E195"},E290:{pax:120,range:2600,mfr:"Embraer",name:"E190-E2"},E295:{pax:146,range:2600,mfr:"Embraer",name:"E195-E2"},AT72:{pax:72,range:825,mfr:"ATR",name:"ATR 72"},AT76:{pax:72,range:825,mfr:"ATR",name:"ATR 72-600"},DH8D:{pax:78,range:1100,mfr:"De Havilland",name:"Dash 8-400"},GL5T:{pax:16,range:5700,mfr:"Bombardier",name:"Global 5500"},GL7T:{pax:19,range:7700,mfr:"Bombardier",name:"Global 7500"},GLEX:{pax:19,range:6150,mfr:"Bombardier",name:"Global Express"},GLF4:{pax:14,range:4350,mfr:"Gulfstream",name:"G450"},GLF5:{pax:16,range:5800,mfr:"Gulfstream",name:"G550"},GLF6:{pax:19,range:6500,mfr:"Gulfstream",name:"G650"},C68A:{pax:12,range:3500,mfr:"Cessna",name:"Citation Longitude"},C700:{pax:12,range:3500,mfr:"Cessna",name:"Citation Latitude"},LJ45:{pax:9,range:2300,mfr:"Learjet",name:"Learjet 45"},B74S:{pax:0,range:4445,mfr:"Boeing",name:"747-400F",cargo:!0},B77F:{pax:0,range:4900,mfr:"Boeing",name:"777F",cargo:!0},A30B:{pax:0,range:2870,mfr:"Airbus",name:"A300-600F",cargo:!0}};function Hb(i){return i&&kb[i.toUpperCase()]||null}function Gb(){return null}const ui=3.28084,Vb=3.6,qn=Math.PI/180,Sa=40,Vm=111e3/Sa,Uh=.06;new ve(16777215);new ve(16751949);new ve(5093631);const Wb=[{speed:0,color:new ve(4882431)},{speed:80,color:new ve(4513211)},{speed:140,color:new ve(6745760)},{speed:200,color:new ve(15654229)},{speed:260,color:new ve(15632435)},{speed:310,color:new ve(14500949)}],Zf=1.5,Kb=.3,xo=6e3,Xb=120,Yb=.5,qb=1,$b=300,Jb=.25,jb=3,Sc={};let vo=null,Wm=new j(window.innerWidth,window.innerHeight);window.addEventListener("resize",()=>{Wm.set(window.innerWidth,window.innerHeight)});const Km="regional",na="narrow",Xm="wideTwin",Ym="wideQuad",qm="bizjet",$m="prop",Zb=new Set(["CRJ2","CRJ7","CRJ9","CRJX","E135","E145","E170","E75L","E75S","E190","E195","E290","E295","AT43","AT45","AT72","AT76","DH8A","DH8B","DH8C","DH8D","SF34"]),Qb=new Set(["A318","A319","A320","A20N","A321","A21N","B731","B732","B733","B734","B735","B736","B737","B738","B739","B38M","B39M","BCS1","BCS3","B752","B753","MD80","MD81","MD82","MD83","MD87","MD88","MD90","B712","C919"]),eE=new Set(["A332","A333","A338","A339","A359","A35K","B762","B763","B764","B772","B773","B77L","B77W","B788","B789","B78X"]),tE=new Set(["A380","A388","B741","B742","B743","B744","B748"]),nE=new Set(["GLF4","GLF5","GLF6","GL5T","GL7T","GLEX","C510","C525","C525","C550","C560","C56X","C680","C68A","C700","LJ35","LJ45","LJ60","LJ75","CL30","CL35","CL60","FA50","FA7X","FA8X","F900","F2TH","E35L","E50P","E545","E55P","H25B","H25C","ASTR","G150","G200","G280","GALX","PC12","PC24","PRM1"]);function iE(i){if(!i)return na;const e=i.toUpperCase();return Zb.has(e)?Km:Qb.has(e)?na:eE.has(e)?Xm:tE.has(e)?Ym:nE.has(e)?qm:e.startsWith("P")||e.startsWith("C1")||e.startsWith("C2")||e.startsWith("SR2")||e.startsWith("DA")?$m:na}const Uu=.25,sE=new P1,Ou={[na]:"/airplane_model/Airplane_Model_B737.glb",[Xm]:"/airplane_model/Airplane_Model_B777.glb",[Ym]:"/airplane_model/Airplane_Model_A340.glb",[Km]:"/airplane_model/Airplane_Model_Regional_CRJ.glb",[qm]:"/airplane_model/Airplane_Model_Regional_CRJ.glb",[$m]:"/airplane_model/Airplane_Model_Regional_CRJ.glb"},Bu={A318:"/airplane_model/Airplane_Model_A320.glb",A319:"/airplane_model/Airplane_Model_A320.glb",A320:"/airplane_model/Airplane_Model_A320.glb",A20N:"/airplane_model/Airplane_Model_A320.glb",A321:"/airplane_model/Airplane_Model_A320.glb",A21N:"/airplane_model/Airplane_Model_A320.glb",BCS1:"/airplane_model/Airplane_Model_A320.glb",BCS3:"/airplane_model/Airplane_Model_A320.glb",A332:"/airplane_model/Airplane_Model_A330.glb",A333:"/airplane_model/Airplane_Model_A330.glb",A338:"/airplane_model/Airplane_Model_A330.glb",A339:"/airplane_model/Airplane_Model_A330.glb",A359:"/airplane_model/Airplane_Model_A350.glb",A35K:"/airplane_model/Airplane_Model_A350.glb",A380:"/airplane_model/Airplane_Model_A340.glb",A388:"/airplane_model/Airplane_Model_A340.glb",B741:"/airplane_model/Airplane_Model_A340.glb",B742:"/airplane_model/Airplane_Model_A340.glb",B743:"/airplane_model/Airplane_Model_A340.glb",B744:"/airplane_model/Airplane_Model_A340.glb",B748:"/airplane_model/Airplane_Model_A340.glb",B772:"/airplane_model/Airplane_Model_B777.glb",B773:"/airplane_model/Airplane_Model_B777.glb",B77L:"/airplane_model/Airplane_Model_B777.glb",B77W:"/airplane_model/Airplane_Model_B777.glb",B788:"/airplane_model/Airplane_Model_A350.glb",B789:"/airplane_model/Airplane_Model_A350.glb",B78X:"/airplane_model/Airplane_Model_A350.glb"},So={},Oh={};function Jm(i){if(i){const t=i.toUpperCase();if(Bu[t])return Bu[t]}const e=iE(i);return Ou[e]||Ou[na]}function jm(i){return So[i]||(So[i]=new Promise(e=>{sE.load(i,t=>{const n=t.scene,s=new dn().setFromObject(n),r=new P;s.getSize(r);const a=Math.max(r.x,r.y,r.z),o=Uu/a;n.scale.set(o,o,o);const l=new P;s.getCenter(l),n.position.set(-l.x*o,-l.y*o,-l.z*o);const c=new In;c.add(n),c.rotation.y=-Math.PI/2,Oh[i]=c,console.log(`[STRATUM] Model loaded: ${i} (${r.x.toFixed(1)}x${r.y.toFixed(1)}x${r.z.toFixed(1)})`),e(n)},void 0,t=>{console.warn(`[STRATUM] Model load failed: ${i}`,t),e(null)})})),So[i]}const Zm=new Set(Object.values(Ou));for(const i of Object.values(Bu))Zm.add(i);for(const i of Zm)jm(i);function rE(i){const e=Jm(i),t=Oh[e];if(!t)return null;const n=t.clone();return n.traverse(s=>{s.isMesh&&(s.material=s.material.clone(),s.material.transparent=!0,s.material.opacity=0)}),n}function aE(){if(!Sc._fallback){const i=new _h(.015,.1,8);i.rotateZ(-Math.PI/2),Sc._fallback=i}return Sc._fallback}function oE(){if(vo)return vo;const i=64,e=document.createElement("canvas");e.width=i,e.height=i;const t=e.getContext("2d"),n=t.createRadialGradient(i/2,i/2,0,i/2,i/2,i/2);return n.addColorStop(0,"rgba(255,255,255,1)"),n.addColorStop(.15,"rgba(255,255,255,0.6)"),n.addColorStop(.4,"rgba(255,255,255,0.12)"),n.addColorStop(1,"rgba(255,255,255,0)"),t.fillStyle=n,t.fillRect(0,0,i,i),vo=new Ma(e),vo}const Mo=new ve;new ve;function Dr(i){i==null&&(i=0);const e=Wb;if(i<=e[0].speed)return Mo.copy(e[0].color);if(i>=e[e.length-1].speed)return Mo.copy(e[e.length-1].color);for(let t=0;t<e.length-1;t++)if(i<=e[t+1].speed){const n=(i-e[t].speed)/(e[t+1].speed-e[t].speed);return Mo.copy(e[t].color).lerp(e[t+1].color,n)}return Mo.copy(e[e.length-1].color)}function lE(i){return i==null?"CRUISE":i>Zf?"CLIMBING":i<-Zf?"DESCENDING":"CRUISE"}function Qf(i,e,t,n,s,r){if(e==null||t==null)return r.copy(i),r;const a=t*qn,o=e/Vm;return r.set(i.x+Math.sin(a)*o*s,i.y+(n||0)*ui/1e3*Uh*s,i.z-Math.cos(a)*o*s),r}function cE(i,e,t){const n=Math.cos(e*qn),s=(i.longitude-t)*Sa*n,r=-(i.latitude-e)*Sa,a=i.baroAltitude*ui/1e3*Uh;return new P(s,a,r)}function uE(i,e,t){const n=Math.cos(e*qn),s=(i.longitude-t)*Sa*n,r=-(i.latitude-e)*Sa,a=i.baroAltitude!=null?i.baroAltitude*ui/1e3*Uh:0;return new P(s,a,r)}class hE{constructor(e,t,n){this.scene=e,this.userLat=t,this.userLon=n,this.aircraft=new Map,this.raycasterTargets=[],this._highlightSet=null}updateUserLocation(e,t){this.userLat=e,this.userLon=t}update(e){const t=new Set;for(const n of e){t.add(n.icao24);const s=cE(n,this.userLat,this.userLon);if(this.aircraft.has(n.icao24))this.aircraft.get(n.icao24).setTarget(s,n);else try{const r=new dE(n,s,this.scene,this.userLat,this.userLon);this.aircraft.set(n.icao24,r),this.raycasterTargets.push(r.hitMesh),this.raycasterTargets.push(r.labelSprite)}catch(r){console.error("[STRATUM] Failed to create aircraft:",n.icao24,r)}}for(const[n,s]of this.aircraft)t.has(n)||s.startFadeOut();for(const[n,s]of this.aircraft)if(s.removed){s.dispose(this.scene),this.aircraft.delete(n);const r=this.raycasterTargets.indexOf(s.hitMesh);r!==-1&&this.raycasterTargets.splice(r,1);const a=this.raycasterTargets.indexOf(s.labelSprite);a!==-1&&this.raycasterTargets.splice(a,1)}}animate(e,t){for(const n of this.aircraft.values())n.animate(e,t,this._highlightSet)}setHighlight(e){this._highlightSet=e}clearHighlight(){this._highlightSet=null}clearAll(e){for(const t of this.aircraft.values())t.dispose(e);this.aircraft.clear(),this.raycasterTargets.length=0,this._highlightSet=null,this._selectedAc=null}getByHitMesh(e){for(const t of this.aircraft.values())if(t.hitMesh===e||t.labelSprite===e)return t;return null}getCount(){let e=0;for(const t of this.aircraft.values())t.fadingOut||e++;return e}getByIcao(e){return this.aircraft.get(e)||null}selectAircraft(e){if(this.deselectAircraft(),!e)return;this._selectedAc=e;const t=new Qs(.18,.22,48),n=new Mt({color:5942527,transparent:!0,opacity:.7,side:wt,depthWrite:!1,blending:Ln});this._selRing=new ot(t,n),this._selRing.rotation.x=-Math.PI/2,e.group.add(this._selRing),this._selRingMat=n,this._createPredictionLine(e)}_createPredictionLine(e){this._removePredictionLine();const t=e.data;if(t.trueTrack==null||t.velocity==null)return;const n=t.velocity*60/Vm,s=Math.min(n,12);if(s<.3)return;const r=24,a=[];for(let u=0;u<=r;u++){const d=u/r;a.push(d*s,0,0)}const o=new nt;o.setAttribute("position",new ke(a,3));const l=new bu({color:5942527,transparent:!0,opacity:.3,dashSize:.15,gapSize:.1,depthWrite:!1,fog:!1}),c=new ml(o,l);c.computeLineDistances(),e.group.add(c),this._predLine=c,this._predLineMat=l}_removePredictionLine(){this._predLine&&this._selectedAc&&(this._selectedAc.group.remove(this._predLine),this._predLine.geometry.dispose(),this._predLineMat.dispose()),this._predLine=null,this._predLineMat=null}deselectAircraft(){this._removePredictionLine(),this._selRing&&this._selectedAc&&(this._selectedAc.group.remove(this._selRing),this._selRing.geometry.dispose(),this._selRingMat.dispose()),this._selRing=null,this._selRingMat=null,this._selectedAc=null}animateSelection(e){if(this._selRing&&this._selRingMat){const t=.5+.4*Math.sin(e*3);this._selRingMat.opacity=t;const n=1+.15*Math.sin(e*2);this._selRing.scale.set(n,n,1)}this._predLineMat&&(this._predLineMat.opacity=.15+.15*Math.sin(e*2)),this._selectedAc&&e-(this._lastPredRebuild||0)>5&&(this._lastPredRebuild=e,this._createPredictionLine(this._selectedAc))}search(e,t=6){const n=[],s=e.toUpperCase();for(const r of this.aircraft.values()){if(r.fadingOut)continue;const a=r.data,o=(a.callsign||"").toUpperCase(),l=(a.registration||"").toUpperCase(),c=(a.aircraftType||"").toUpperCase(),u=(a.icao24||"").toUpperCase();if((o.includes(s)||l.includes(s)||c.includes(s)||u.includes(s))&&(n.push(r),n.length>=t))break}return n}}class dE{constructor(e,t,n,s,r){this.data=e,this.scene=n,this.userLat=s,this.userLon=r,this.lastApiPos=t.clone(),this.lastApiTime=performance.now()/1e3,this._extrapolatedPos=new P,this.fadingIn=!0,this.fadingOut=!1,this.removed=!1,this.fadeProgress=0,this._createdAt=Date.now(),this.trailPositions=[],this.lastTrailSampleTime=0,this.masterOpacity=0,this.hasRealTrack=!1,this._appliedTrackVersion=0,this._lastTrackCheckTime=0,this._liveStartIndex=0,this._gaps=[],this.group=new In,this.group.position.copy(t),this.group.renderOrder=1e3;const a=Dr(e.velocity);this._modelGroup=null,this._useGLB=!1,this._modelMeshes=[];const o=rE(e.aircraftType);if(o)this._modelGroup=o,this._useGLB=!0,this.group.add(o),o.traverse(_=>{_.isMesh&&this._modelMeshes.push(_)}),this._setModelColor(a);else{this.bodyMat=new J_({color:a,emissive:a,emissiveIntensity:1.5,transparent:!0,opacity:0}),this.bodyMesh=new ot(aE(),this.bodyMat),this.group.add(this.bodyMesh);const _=Jm(e.aircraftType);jm(_).then(()=>{const m=Oh[_];if(m&&!this.removed){const g=m.clone();g.traverse(S=>{S.isMesh&&(S.material=S.material.clone(),S.material.transparent=!0,S.material.opacity=this.masterOpacity)}),this.group.remove(this.bodyMesh),this._modelGroup=g,this._useGLB=!0,this._modelMeshes=[],g.traverse(S=>{S.isMesh&&this._modelMeshes.push(S)}),this.group.add(g),this._lastColorR=-1,this._setModelColor(Dr(this.data.velocity))}})}this.labelSprite=this._createInfoLabel(e),this.labelSprite.position.set(0,.18,0),this.group.add(this.labelSprite);const l=new ba(2,8,8),c=new Mt({visible:!1});this.hitMesh=new ot(l,c),this.hitMesh.userData.icao24=e.icao24,this.group.add(this.hitMesh);const u=oE(),d=Uu*.6;this._navLights=[];const h=new Us(new Xi({map:u,color:16720435,transparent:!0,opacity:0,depthWrite:!1,blending:Ln}));h.scale.set(.06,.06,1),h.position.set(0,0,d),this.group.add(h),this._navLights.push(h);const f=new Us(new Xi({map:u,color:2293572,transparent:!0,opacity:0,depthWrite:!1,blending:Ln}));f.scale.set(.06,.06,1),f.position.set(0,0,-d),this.group.add(f),this._navLights.push(f);const p=new Us(new Xi({map:u,color:16777215,transparent:!0,opacity:0,depthWrite:!1,blending:Ln}));p.scale.set(.04,.04,1),p.position.set(-Uu*.4,.02,0),this.group.add(p),this._navLights.push(p),this._tailStrobe=p,this._bodyGlowMat=new Xi({map:u,color:new ve(a.r,a.g,a.b),transparent:!0,opacity:0,depthWrite:!1,blending:Ln}),this._bodyGlow=new Us(this._bodyGlowMat),this._bodyGlow.scale.set(.45,.45,1),this._bodyGlow.position.set(0,.01,0),this.group.add(this._bodyGlow),e.trueTrack!=null&&(this.group.rotation.y=-Math.PI/2-e.trueTrack*qn),this.trailLine=null,this._trailDirty=!1,this._lastTrailRebuildTime=0,this.trailLineMat=new Ph({color:16777215,linewidth:1.5,vertexColors:!0,transparent:!0,opacity:0,depthWrite:!1,depthTest:!1,alphaToCoverage:!0,resolution:Wm}),this._dropPosArray=new Float32Array(6),this.dropGeometry=new nt,this.dropGeometry.setAttribute("position",new $t(this._dropPosArray,3)),this.dropMaterial=new bu({color:3828383,transparent:!0,opacity:0,dashSize:.15,gapSize:.25,depthTest:!1,depthWrite:!1}),this.dropLine=new ji(this.dropGeometry,this.dropMaterial),this.dropLine.renderOrder=998,this.dropLine.computeLineDistances(),this._gapLine=null,this.updateDropLine(t),n.add(this.dropLine),n.add(this.group),this._initTrail(t,e),this.rebuildTrail(),e.icao24}_initTrail(e,t){const n=Jf(t.icao24);n&&n.length>1?(this._applyRealTrack(n),this._appliedTrackVersion=jf(t.icao24)||Date.now()):this.trailPositions.push({pos:e.clone(),speed:t.velocity}),this._liveStartIndex=this.trailPositions.length}_applyRealTrack(e){const n=Math.floor(Date.now()/1e3)-1800;let s;const r=e.filter(u=>u.time>=n);r.length<2?s=e.slice(-400):s=r;const a=30,o=[];for(let u=0;u<s.length;u++){const d=s[u];let h=null,f=!1;if(u>0){const p=s[u-1],_=d.time-p.time;if(_>a&&(f=!0),_>0){const m=(d.latitude-p.latitude)*111e3,g=(d.longitude-p.longitude)*111e3*Math.cos(d.latitude*qn);h=Math.sqrt(m*m+g*g)/_}}o.push({pos:uE(d,this.userLat,this.userLon),speed:h,isGapStart:f})}const l=[[]];for(const u of o)u.isGapStart&&l[l.length-1].length>0&&l.push([]),l[l.length-1].push(u);this._gaps=[];for(let u=1;u<l.length;u++){const d=l[u-1],h=l[u];d.length>0&&h.length>0&&this._gaps.push({from:d[d.length-1].pos.clone(),to:h[0].pos.clone()})}const c=4;for(const u of l){if(u.length<2){for(const h of u)this.trailPositions.push(h);continue}const d=u.length;for(let h=0;h<d-1;h++){const f=u[Math.max(h-1,0)].pos,p=u[h].pos,_=u[h+1].pos,m=u[Math.min(h+2,d-1)].pos,g=u[h].speed,S=u[h+1].speed;for(let v=0;v<c;v++){const M=v/c,T=M*M,E=T*M,R=.5*(2*p.x+(-f.x+_.x)*M+(2*f.x-5*p.x+4*_.x-m.x)*T+(-f.x+3*p.x-3*_.x+m.x)*E),y=.5*(2*p.y+(-f.y+_.y)*M+(2*f.y-5*p.y+4*_.y-m.y)*T+(-f.y+3*p.y-3*_.y+m.y)*E),A=.5*(2*p.z+(-f.z+_.z)*M+(2*f.z-5*p.z+4*_.z-m.z)*T+(-f.z+3*p.z-3*_.z+m.z)*E),U=g!=null&&S!=null?g*(1-M)+S*M:g||S;this.trailPositions.push({pos:new P(R,y,A),speed:U})}}this.trailPositions.push(u[d-1])}this.hasRealTrack=!0}_synthesizeBackTrail(e,t){if(t.velocity==null||t.trueTrack==null){this.trailPositions.push({pos:e.clone(),speed:t.velocity});return}for(let n=Xb;n>=0;n-=Yb)this.trailPositions.push({pos:Qf(e,t.velocity,t.trueTrack,t.verticalRate||0,-n),speed:t.velocity});this.trailPositions.push({pos:e.clone(),speed:t.velocity})}_createInfoLabel(e){const t=document.createElement("canvas");t.width=1024,t.height=256,this._labelCanvas=t,this._labelCtx=t.getContext("2d"),this._labelDirty=!1,this._lastLabelUpdate=0,this._drawInfoLabel(e);const n=new Ma(t);n.minFilter=yt,n.magFilter=yt,n.anisotropy=4;const s=new Xi({map:n,transparent:!0,opacity:0,depthWrite:!1,sizeAttenuation:!0});this._labelMat=s;const r=new Us(s);return r.scale.set(2.2,.55,1),r}_drawInfoLabel(e){const t=this._labelCtx,n=this._labelCanvas.width,s=this._labelCanvas.height;t.clearRect(0,0,n,s);const r=e.baroAltitude!=null?Math.round(e.baroAltitude*ui):null,a=e.velocity!=null?Math.round(e.velocity*1.94384):null,o=e.trueTrack!=null?Math.round(e.trueTrack):null,l=e.verticalRate!=null?Math.round(e.verticalRate*ui*60):null;t.font="bold 44px JetBrains Mono, monospace",t.fillStyle="#ffffff",t.textAlign="left";let c=e.callsign||e.icao24;e.registration&&e.registration!==c&&(c+=` ${e.registration}`),e.aircraftType&&(c+=` ${e.aircraftType}`),t.fillText(c,16,52),t.font="38px JetBrains Mono, monospace",t.fillStyle="rgba(180,210,255,0.9)";let u="";const d=$f(e.callsign),h=e.origin||d&&d.origin||null,f=e.destination||d&&d.destination||null;if((h||f)&&(u+=`${h||"?"}→${f||"?"} `),r!=null&&(u+=r>=18e3?`FL${String(Math.round(r/100)).padStart(3,"0")}`:`${r.toLocaleString()}ft`),a!=null&&(u+=` ${a}kt`),o!=null&&(u+=` ${String(o).padStart(3,"0")}°`),t.fillText(u,16,112),l!=null&&Math.abs(l)>100){t.font="38px JetBrains Mono, monospace";const p=l>0?"↑":"↓";t.fillStyle=l>0?"#ff9d4d":"#4db8ff",t.fillText(`${p}${Math.abs(l).toLocaleString()} fpm`,16,168)}}_refreshInfoLabel(){this._drawInfoLabel(this.data),this._labelMat.map.needsUpdate=!0,this._labelDirty=!1}_setModelOpacity(e){if(this._useGLB&&this._modelMeshes.length>0)for(const t of this._modelMeshes)t.material.opacity=e;else this.bodyMat&&(this.bodyMat.opacity=e)}_setModelColor(e){if(!(this._lastColorR===e.r&&this._lastColorG===e.g&&this._lastColorB===e.b))if(this._lastColorR=e.r,this._lastColorG=e.g,this._lastColorB=e.b,this._useGLB&&this._modelMeshes.length>0)for(const t of this._modelMeshes)t.material.emissive=t.material.emissive||new ve,t.material.emissive.copy(e),t.material.emissiveIntensity=1.5,t.material.color.copy(e);else this.bodyMat&&(this.bodyMat.color.copy(e),this.bodyMat.emissive.copy(e))}setTarget(e,t){this.lastApiPos.copy(e),this.lastApiTime=performance.now()/1e3,this.data=t;const n=Dr(t.velocity);this._setModelColor(n),this._labelDirty=!0}_getExtrapolatedTarget(){const t=performance.now()/1e3-this.lastApiTime;return Qf(this.lastApiPos,this.data.velocity,this.data.trueTrack,this.data.verticalRate,t,this._extrapolatedPos)}_checkForTrackUpdate(e){const t=this.hasRealTrack?$b:Jb;if(e-this._lastTrackCheckTime<t)return;this._lastTrackCheckTime=e;const n=jf(this.data.icao24);if(!n||n<=this._appliedTrackVersion)return;const s=Jf(this.data.icao24);if(!s||s.length<2)return;this.trailPositions=[],this._applyRealTrack(s),this._appliedTrackVersion=n;const r=this.trailPositions.length,a=[];for(const o of a)this.trailPositions.push(o);if(this._liveStartIndex=r,this.trailPositions.length>xo){const o=this.trailPositions.length-xo;this.trailPositions.splice(0,o),this._liveStartIndex=Math.max(0,this._liveStartIndex-o)}this._trailDirty=!0}sampleTrailPoint(e,t){if(this.trailPositions.push({pos:e.clone(),speed:t}),this.trailPositions.length>xo){const n=this.trailPositions.length-xo;this.trailPositions.splice(0,n),this._liveStartIndex=Math.max(0,this._liveStartIndex-n)}this._trailDirty=!0}rebuildTrail(){const e=this.trailPositions;if(e.length<2)return;if(!this.hasRealTrack&&e.length<60){this.trailLine&&(this.trailLine.visible=!1);return}this.trailLine&&(this.trailLine.visible=!0);let t;if(e.length>600){t=[];const v=Math.max(Math.floor(e.length/400),1);for(let M=0;M<e.length-1;M+=v)t.push(e[M]);t.push(e[e.length-1])}else t=e;const n=t.length,s=new Array(n),r=this.hasRealTrack?2:5;for(let v=0;v<n;v++){let M=0,T=0,E=0,R=0,y=0;for(let A=Math.max(0,v-r);A<=Math.min(n-1,v+r);A++)M+=t[A].pos.x,T+=t[A].pos.y,E+=t[A].pos.z,t[A].speed!=null&&(R+=t[A].speed),y++;s[v]={pos:new P(M/y,T/y,E/y),speed:R/y}}s[0]=t[0],s[n-1]=t[n-1];let a=new Float64Array(s.length),o=new Float64Array(s.length),l=new Float64Array(s.length),c=new Float64Array(s.length);for(let v=0;v<s.length;v++)a[v]=s[v].pos.x,o[v]=s[v].pos.y,l[v]=s[v].pos.z,c[v]=s[v].speed||0;const u=this.hasRealTrack?2:4;for(let v=0;v<u;v++){const M=a.length;if(M<3||M>3e3)break;const T=(M-1)*2+2,E=new Float64Array(T),R=new Float64Array(T),y=new Float64Array(T),A=new Float64Array(T);E[0]=a[0],R[0]=o[0],y[0]=l[0],A[0]=c[0];for(let C=0;C<M-1;C++){const I=(c[C]+c[C+1])/2,O=C*2+1;E[O]=a[C]*.75+a[C+1]*.25,R[O]=o[C]*.75+o[C+1]*.25,y[O]=l[C]*.75+l[C+1]*.25,A[O]=I,E[O+1]=a[C]*.25+a[C+1]*.75,R[O+1]=o[C]*.25+o[C+1]*.75,y[O+1]=l[C]*.25+l[C+1]*.75,A[O+1]=I}const U=T-1;E[U]=a[M-1],R[U]=o[M-1],y[U]=l[M-1],A[U]=c[M-1],a=E,o=R,l=y,c=A}const d=[];for(let v=0;v<a.length;v++)d.push({pos:new P(a[v],o[v],l[v]),speed:c[v]});const h=d.map(v=>({x:v.pos.x,y:v.pos.y,z:v.pos.z,speed:v.speed})),f=h.length,p=Math.max(Math.floor(f*.06),3),_=new Float32Array(f);for(let v=0;v<f;v++){let M=0,T=0;for(let E=Math.max(0,v-p);E<=Math.min(f-1,v+p);E++)h[E].speed!=null&&(M+=h[E].speed,T++);_[v]=T>0?M/T:0}const m=new Float32Array(f*3),g=new Float32Array(f*3);for(let v=0;v<f;v++){const M=h[v],T=v*3;m[T]=M.x,m[T+1]=M.y,m[T+2]=M.z;const E=v/(f-1),R=.05+.95*(E*E*(3-2*E)),y=Dr(_[v]);g[T]=y.r*R,g[T+1]=y.g*R,g[T+2]=y.b*R}this.trailLine&&(this.scene.remove(this.trailLine),this.trailLine.geometry.dispose());const S=new Sm;S.setPositions(m),S.setColors(g),this.trailLine=new R1(S,this.trailLineMat),this.trailLine.computeLineDistances(),this.trailLine.renderOrder=999,this.trailLine.frustumCulled=!1,this.scene.add(this.trailLine),this._rebuildGapLines()}_rebuildGapLines(){if(this._gapLine&&(this.scene.remove(this._gapLine),this._gapLine.geometry.dispose(),this._gapLine.material.dispose(),this._gapLine=null),!this._gaps||this._gaps.length===0)return;const e=[];for(const s of this._gaps)e.push(s.from.x,s.from.y,s.from.z),e.push(s.to.x,s.to.y,s.to.z);const t=new nt;t.setAttribute("position",new ke(e,3));const n=new bu({color:6715272,transparent:!0,opacity:.3,dashSize:.15,gapSize:.2,depthTest:!1,depthWrite:!1});this._gapLine=new ji(t,n),this._gapLine.computeLineDistances(),this._gapLine.renderOrder=998,this._gapLine.frustumCulled=!1,this.scene.add(this._gapLine)}updateDropLine(e){const t=this._dropPosArray;t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.x,t[4]=0,t[5]=e.z,this.dropGeometry.getAttribute("position").needsUpdate=!0}startFadeOut(){this.fadingOut||(this.fadingOut=!0,this.fadeProgress=1)}animate(e,t,n){if(this.fadingIn&&(this.fadeProgress=Math.min(this.fadeProgress+e*1.2,1),this.fadeProgress>=1&&(this.fadingIn=!1)),this.fadingOut&&(this.fadeProgress=Math.max(this.fadeProgress-e*.6,0),this.fadeProgress<=0)){this.removed=!0;return}n&&!n.has(this.data.icao24)?this.masterOpacity=this.fadeProgress*.08:this.masterOpacity=this.fadeProgress,this._setModelOpacity(this.masterOpacity),this._labelMat.opacity=this.masterOpacity*.75,this.trailLineMat.opacity=this.masterOpacity*.85,this.dropMaterial.opacity=this.masterOpacity*.15,this._gapLine&&(this._gapLine.material.opacity=this.masterOpacity*.3);for(const a of this._navLights)a.material.opacity=this.masterOpacity*.8;if(this._tailStrobe){const a=(t*1.2+this.data.icao24.charCodeAt(0)*.1)%1;this._tailStrobe.material.opacity=a<.1?this.masterOpacity:0}const s=Dr(this.data.velocity);this._setModelColor(s),this._bodyGlow&&(this._bodyGlowMat.opacity=this.masterOpacity*.6,this._bodyGlowMat.color.copy(s));const r=this._getExtrapolatedTarget();if(this.group.position.lerp(r,Math.min(e*3,.3)),this.data.trueTrack!=null){const a=-Math.PI/2-this.data.trueTrack*qn;let o=a-this.group.rotation.y;for(;o>Math.PI;)o-=Math.PI*2;for(;o<-Math.PI;)o+=Math.PI*2;Math.abs(o)<.005?this.group.rotation.y=a:this.group.rotation.y+=o*Math.min(e*3,.25)}this._checkForTrackUpdate(t),t-this.lastTrailSampleTime>=Kb&&(this.lastTrailSampleTime=t,this.sampleTrailPoint(this.group.position,this.data.velocity)),this._trailDirty&&t-this._lastTrailRebuildTime>=qb&&(this._lastTrailRebuildTime=t,this._trailDirty=!1,this.rebuildTrail()),this._labelDirty&&t-this._lastLabelUpdate>=jb&&(this._lastLabelUpdate=t,this._refreshInfoLabel()),this.updateDropLine(this.group.position)}dispose(e){e.remove(this.group),this.trailLine&&(e.remove(this.trailLine),this.trailLine.geometry.dispose()),this.trailLineMat.dispose(),e.remove(this.dropLine),this.dropGeometry.dispose(),this.dropMaterial.dispose(),this._gapLine&&(e.remove(this._gapLine),this._gapLine.geometry.dispose(),this._gapLine.material.dispose()),this._useGLB&&this._modelGroup?this._modelGroup.traverse(t=>{t.isMesh&&(t.material.map&&t.material.map.dispose(),t.material.dispose(),t.geometry&&t.geometry.dispose())}):this.bodyMat&&this.bodyMat.dispose(),this._labelMat&&(this._labelMat.map&&this._labelMat.map.dispose(),this._labelMat.dispose());for(const t of this._navLights)t.material.dispose();this._bodyGlowMat&&this._bodyGlowMat.dispose()}getDisplayData(){const e=this.data.baroAltitude!=null?Math.round(this.data.baroAltitude*ui):null,t=this.data.geoAltitude!=null?Math.round(this.data.geoAltitude*ui):null,n=this.data.velocity!=null?Math.round(this.data.velocity*Vb):null,s=this.data.verticalRate!=null?Math.round(this.data.verticalRate*ui*60):null,r=this.data.trueTrack!=null?Math.round(this.data.trueTrack):null,a=Hb(this.data.aircraftType),o=Math.floor((Date.now()-this._createdAt)/6e4),l=Gb(this.data.icao24),c=this.data.year||null;let u=null;c&&(u=new Date().getFullYear()-c);const d=this.data.operator||l&&l.operator||null,h=$f(this.data.callsign);let f=this.data.origin||h&&h.origin||null,p=this.data.destination||h&&h.destination||null,_=h&&h.originCity||null,m=h&&h.destCity||null,g=!1;if(!f||!p){const z=Mb(this.data.icao24,this.data.callsign);if(z){if(!f&&z.origin&&(f=z.origin,g=!0,!_&&typeof window._findCityByCode=="function")){const B=window._findCityByCode(f);B&&(_=B.name)}if(!p&&z.destination&&(p=z.destination,g=!0,!m&&typeof window._findCityByCode=="function")){const B=window._findCityByCode(p);B&&(m=B.name)}}}const S=this.data.groundSpeed!=null?Math.round(this.data.groundSpeed):null,v=this.data.ias!=null?Math.round(this.data.ias):null,M=this.data.tas!=null?Math.round(this.data.tas):null,T=this.data.mach!=null?this.data.mach.toFixed(3):null,E=this.data.squawk||null,R=this.data.rssi!=null?this.data.rssi.toFixed(1):null,y=this.data.navAltitude!=null?Math.round(this.data.navAltitude*ui):null,A=this.data.navHeading!=null?Math.round(this.data.navHeading):null,U=this.data.emergency||null;let C=null;if(a)a.pax>=400||a.name==="A380-800"?C="SUPER":a.pax>=200||a.range>=5e3&&a.pax>=100?C="HEAVY":a.pax>=50?C="MEDIUM":C="LIGHT";else if(this.data.category){const z=this.data.category;z==="A5"||z==="A6"?C="HEAVY":z==="A3"||z==="A4"?C="MEDIUM":(z==="A1"||z==="A2")&&(C="LIGHT")}let I="EN ROUTE";this.data.onGround?I="ON GROUND":e!=null&&s!=null&&(e<500?I=s<-200?"LANDING":"TAKEOFF":e<3e3&&s>300?I="INITIAL CLIMB":e<1e4&&s>200?I="CLIMB":e<1e4&&s<-300?I="APPROACH":e>=1e4&&s>200?I="CLIMB":e>=1e4&&s<-200?I="DESCENT":I="CRUISE");let O=null;if(p&&this.data.latitude!=null&&this.data.longitude!=null){const z=typeof _findCityByCode=="function"?_findCityByCode(p):null;z&&(O=Math.round(Qm(this.data.latitude,this.data.longitude,z.lat,z.lon)))}return{callsign:this.data.callsign||this.data.icao24,icao24:this.data.icao24,originCountry:this.data.originCountry||"--",aircraftType:this.data.aircraftType||null,registration:this.data.registration||null,origin:f,destination:p,originCity:_,destCity:m,altitude:e!=null?`${e.toLocaleString()} ft`:"--",speed:n!=null?`${n} km/h`:"--",heading:r!=null?`${String(r).padStart(3,"0")}  ${fE(r)}`:"--",verticalSpeed:s!=null?`${s>0?"+":""}${s} ft/min`:"--",status:lE(this.data.verticalRate),latitude:this.data.latitude,longitude:this.data.longitude,specs:a,trackedTime:o<1?"Just now":o<60?`${o}m`:`${Math.floor(o/60)}h ${o%60}m`,operator:d,year:c,age:u,typeDesc:this.data.typeDesc||l&&l.typeName||null,_rawAlt:this.data.baroAltitude,_rawSpd:this.data.velocity,geoAltFt:t,gsKts:S,ias:v,tas:M,mach:T,squawk:E,rssi:R,navAlt:y,navHdg:A,emergency:U,wakeCat:C,flightPhase:I,distToDest:O,onGround:this.data.onGround,category:this.data.category,routeEstimated:g}}}function fE(i){return["N","NE","E","SE","S","SW","W","NW"][Math.round(i/45)%8]}function Qm(i,e,t,n){const r=(t-i)*qn,a=(n-e)*qn,o=Math.sin(r/2)**2+Math.cos(i*qn)*Math.cos(t*qn)*Math.sin(a/2)**2;return 6371*2*Math.atan2(Math.sqrt(o),Math.sqrt(1-o))}const pE=document.getElementById("hud-count"),Fu=document.getElementById("hud-location"),ep=document.getElementById("hud-updated"),tp=document.getElementById("hud-airports"),mE=document.querySelector(".hud-live-text"),np=document.querySelector(".hud-live-dot");let zu=null;function eg(i,e){zu=e?`${e}  ·  ${i}`:i,Fu&&(Fu.textContent=zu)}let Ao=0,ol=0,ll=null;function tg(){if(Ao===ol){ll=null;return}const i=ol-Ao,e=Math.ceil(Math.abs(i)*.2)||1;Ao+=i>0?Math.min(e,i):-Math.min(e,-i),pE.textContent=Ao,ll=requestAnimationFrame(tg)}function ng(i,e,t){i!==ol&&(ol=i,ll||(ll=requestAnimationFrame(tg))),zu||(Fu.textContent=`${e.toFixed(4)}N  ${t.toFixed(4)}${t>=0?"E":"W"}`),mE.textContent="LIVE",np.style.background="",np.style.boxShadow=""}function ku(i){tp&&(tp.textContent=i>0?i:"--")}function gE(){const i=Fb();if(!i){ep.textContent="Connecting...";return}const e=Math.floor((Date.now()-i)/1e3);ep.textContent=e<2?"Just now":`${e}s ago`}function ig(i){const e=document.getElementById("signal-lost");if(i){e.classList.remove("hidden");const t=document.getElementById("signal-lost-retry"),n=zb();t.textContent=`Retrying every ${Math.ceil(n/1e3)}s...`}else e.classList.add("hidden")}const sg=document.getElementById("detail-panel"),_E=document.getElementById("detail-callsign"),Mc=document.getElementById("detail-type"),ip=document.getElementById("detail-alt"),sp=document.getElementById("detail-spd"),yE=document.getElementById("detail-hdg"),bo=document.getElementById("detail-vs"),xE=document.getElementById("detail-icao"),vE=document.getElementById("detail-reg"),rp=document.getElementById("detail-distance"),ap=document.getElementById("detail-status"),SE=document.getElementById("detail-close"),op=document.getElementById("detail-operator-row"),ME=document.getElementById("detail-operator"),lp=document.getElementById("detail-age-row"),AE=document.getElementById("detail-age"),Ac=document.getElementById("detail-radio"),Is=document.getElementById("detail-route"),bE=document.getElementById("detail-origin-code"),EE=document.getElementById("detail-origin-city"),TE=document.getElementById("detail-dest-code"),wE=document.getElementById("detail-dest-city"),cp=document.getElementById("detail-position"),CE=document.getElementById("detail-pos"),RE=document.getElementById("detail-country"),up=document.getElementById("detail-specs"),hp=document.getElementById("detail-specs-divider"),LE=document.getElementById("detail-aircraft-name"),PE=document.getElementById("detail-mfr"),IE=document.getElementById("detail-pax"),DE=document.getElementById("detail-range"),NE=document.getElementById("detail-tracked"),Eo=document.getElementById("detail-ext-grid"),UE=document.getElementById("detail-ias"),OE=document.getElementById("detail-tas"),BE=document.getElementById("detail-mach"),dp=document.getElementById("detail-geoalt"),To=document.getElementById("detail-xpdr"),fp=document.getElementById("detail-xpdr-divider"),wn=document.getElementById("detail-squawk"),wo=document.getElementById("detail-wake-row"),FE=document.getElementById("detail-wake"),Co=document.getElementById("detail-phase-row"),Nr=document.getElementById("detail-phase"),Ro=document.getElementById("detail-navalt-row"),zE=document.getElementById("detail-navalt"),Lo=document.getElementById("detail-navhdg-row"),kE=document.getElementById("detail-navhdg"),Po=document.getElementById("detail-rssi-row"),HE=document.getElementById("detail-rssi"),Io=document.getElementById("detail-dtd-row"),GE=document.getElementById("detail-dtd");let ia=null;SE.addEventListener("click",()=>or());function Cn(i,e){i&&i.textContent!==e&&(i.textContent=e,i.classList.remove("flash"),i.offsetWidth,i.classList.add("flash"),i.addEventListener("animationend",()=>i.classList.remove("flash"),{once:!0}))}function vl(i,e,t){ia=i;const n=i.getDisplayData();if(_E.textContent=n.callsign||n.icao24,n.aircraftType?(Mc.textContent=n.aircraftType,Mc.style.display=""):Mc.style.display="none",n.origin||n.destination?(Is.classList.remove("hidden"),bE.textContent=n.origin||"---",TE.textContent=n.destination||"---",EE.textContent=n.originCity||"",wE.textContent=n.destCity||"",n.routeEstimated?(Is.classList.add("estimated"),Is.title="路由由本地轨迹推断 (estimated)"):(Is.classList.remove("estimated"),Is.title="")):Is.classList.add("hidden"),n._rawAlt!=null){const l=Math.round(n._rawAlt*3.28084),c=l>=18e3?`FL${Math.round(l/100)}`:`${l.toLocaleString()} ft`;Cn(ip,c)}else Cn(ip,"--");if(n._rawSpd!=null){Math.round(n._rawSpd*3.6);const l=n.gsKts!=null?n.gsKts:Math.round(n._rawSpd*1.94384);Cn(sp,`${l} kts`)}else Cn(sp,"--");Cn(yE,n.heading);const s=n.verticalSpeed;if(Cn(bo,s),n.status==="CLIMBING"?bo.style.color="var(--climb)":n.status==="DESCENDING"?bo.style.color="var(--descend)":bo.style.color="",(n.ias!=null||n.tas!=null||n.mach!=null||n.geoAltFt!=null)&&Eo)if(Eo.classList.remove("hidden"),Cn(UE,n.ias!=null?`${n.ias} kts`:"--"),Cn(OE,n.tas!=null?`${n.tas} kts`:"--"),Cn(BE,n.mach!=null?`M${n.mach}`:"--"),n.geoAltFt!=null){const l=n.geoAltFt>=18e3?`FL${Math.round(n.geoAltFt/100)}`:`${n.geoAltFt.toLocaleString()} ft`;Cn(dp,l)}else Cn(dp,"--");else Eo&&Eo.classList.add("hidden");xE.textContent=n.icao24||"--",vE.textContent=n.registration||"--",n.operator?(op.classList.remove("hidden"),ME.textContent=n.operator):op.classList.add("hidden"),n.age!=null?(lp.classList.remove("hidden"),AE.textContent=`${n.year} (${n.age}y)`):lp.classList.add("hidden");const a=n.origin||n.destination;if(a&&a.length>=3?(Ac.classList.remove("hidden"),Ac.onclick=()=>{window.open(`https://www.liveatc.net/search/?icao=${encodeURIComponent(a)}`,"_blank")}):Ac.classList.add("hidden"),n.specs?(up.classList.remove("hidden"),hp.classList.remove("hidden"),LE.textContent=n.specs.name,PE.textContent=n.specs.mfr,IE.textContent=n.specs.cargo?"CARGO":`${n.specs.pax} pax`,DE.textContent=`${n.specs.range.toLocaleString()} nm`,NE.textContent=n.trackedTime):(up.classList.add("hidden"),hp.classList.add("hidden")),(n.squawk||n.wakeCat||n.flightPhase||n.navAlt!=null||n.rssi!=null)&&To){if(To.classList.remove("hidden"),fp.classList.remove("hidden"),n.squawk?(wn.textContent=n.squawk,n.squawk==="7500"?(wn.style.color="var(--descend)",wn.title="HIJACK"):n.squawk==="7600"?(wn.style.color="#e8a84c",wn.title="COMM FAILURE"):n.squawk==="7700"?(wn.style.color="#ff4444",wn.title="EMERGENCY"):(wn.style.color="",wn.title="")):(wn.textContent="--",wn.style.color=""),n.wakeCat&&wo?(wo.classList.remove("hidden"),FE.textContent=n.wakeCat):wo&&wo.classList.add("hidden"),n.flightPhase&&Co?(Co.classList.remove("hidden"),Nr.textContent=n.flightPhase,n.flightPhase==="CLIMB"||n.flightPhase==="INITIAL CLIMB"||n.flightPhase==="TAKEOFF"?Nr.style.color="var(--climb)":n.flightPhase==="DESCENT"||n.flightPhase==="APPROACH"||n.flightPhase==="LANDING"?Nr.style.color="var(--descend)":n.flightPhase==="CRUISE"?Nr.style.color="rgba(196,160,88,0.9)":Nr.style.color=""):Co&&Co.classList.add("hidden"),n.navAlt!=null&&Ro){Ro.classList.remove("hidden");const l=n.navAlt>=18e3?`FL${Math.round(n.navAlt/100)}`:`${n.navAlt.toLocaleString()} ft`;zE.textContent=l}else Ro&&Ro.classList.add("hidden");n.navHdg!=null&&Lo?(Lo.classList.remove("hidden"),kE.textContent=`${String(n.navHdg).padStart(3,"0")}°`):Lo&&Lo.classList.add("hidden"),n.rssi!=null&&Po?(Po.classList.remove("hidden"),HE.textContent=`${n.rssi} dBFS`):Po&&Po.classList.add("hidden")}else To&&(To.classList.add("hidden"),fp.classList.add("hidden"));if(n.latitude!=null&&n.longitude!=null){const l=Qm(e,t,n.latitude,n.longitude);rp.textContent=`${Math.round(l)} km away`}else rp.textContent="-- km away";if(n.latitude!=null&&n.longitude!=null){cp.classList.remove("hidden");const l=`${Math.abs(n.latitude).toFixed(3)}°${n.latitude>=0?"N":"S"}`,c=`${Math.abs(n.longitude).toFixed(3)}°${n.longitude>=0?"E":"W"}`;if(CE.textContent=`${l}  ${c}`,RE.textContent=n.originCountry||"--",n.distToDest!=null&&Io){Io.classList.remove("hidden");const u=Math.round(n.distToDest*.539957);GE.textContent=`${n.distToDest} km (${u} nm)`}else Io&&Io.classList.add("hidden")}else cp.classList.add("hidden");ap.textContent=n.status,ap.className="detail-status "+n.status.toLowerCase(),sg.classList.remove("hidden")}function or(){ia=null,sg.classList.add("hidden")}function VE(i,e,t){if(ia){if(ia.removed){or();return}vl(ia,e,t)}}let Ii=null,Xr=null,bc=null,Ur=null,Wi=!1,sa=0,pp=!1;function WE(){const i=new Date;return`${String(i.getUTCHours()).padStart(2,"0")}${String(i.getUTCMinutes()).padStart(2,"0")}Z`}function rg(i,e){if(!Ii)return;const t=document.createElement("div");t.className="neko-row";const n=document.createElement("span");n.className="neko-zulu",n.textContent=WE();const s=document.createElement("span");s.className=i==="SYS"?"neko-cs neko-cs--sys":"neko-cs",s.textContent=i.slice(0,8);const r=document.createElement("span");r.className="neko-text",r.textContent=e,t.appendChild(n),t.appendChild(s),t.appendChild(r),Ii.appendChild(t),requestAnimationFrame(()=>{t.classList.add("squelch"),Ii.scrollTo({top:Ii.scrollHeight,behavior:"smooth"})}),setTimeout(()=>t.classList.remove("squelch"),700),Wi||(sa++,ag())}function ag(){Xr&&(sa>0?(Xr.textContent=sa>9?"9+":String(sa),Xr.classList.remove("hidden")):Xr.classList.add("hidden"))}function KE(){pp||(pp=!0,Ii=document.getElementById("neko-log"),Xr=document.getElementById("neko-badge"),bc=document.getElementById("neko-panel"),Ur=document.getElementById("neko-toggle"),!(!Ur||!bc)&&(Ur.addEventListener("click",()=>{Wi=!Wi,bc.classList.toggle("open",Wi),Ur.classList.toggle("active",Wi),Ur.setAttribute("aria-expanded",String(Wi)),Wi&&(sa=0,ag(),requestAnimationFrame(()=>{Ii&&(Ii.scrollTop=Ii.scrollHeight)}))}),setTimeout(()=>rg("CTR","Guard frequency 121.500 active. All stations, monitoring."),2e3)))}const XE=[i=>`Radar contact. ${i.altitude}${i.speed!=="--"?`, ${i.speed}`:""}.`,()=>"Maintain FL350 until advised.",()=>"Radar contact, squawk 4521.",()=>"Contact approach on 124.35.",()=>"Roger, heavy wake turbulence caution.",i=>`Radar contact, ${i.altitude!=="--"?i.altitude:"alt unknown"}. Squawk ident.`,()=>"Climb and maintain FL410, when able direct WOBUX."],YE=[(i,e,t,n)=>`Radar contact. ${e} / ${t}${n}.`,(i,e,t)=>`Cleared ${e} to ${t}. Squawk ident.`,(i,e,t)=>`${e} / ${t}. Maintain present heading.`],qE=[i=>`Climbing through ${i.altitude}, ${i.verticalSpeed}.`,i=>`Climb and maintain FL410. ${i.verticalSpeed}.`,i=>`Passing ${i.altitude}, climbing. When able direct.`],$E=[i=>`Descending through ${i.altitude}, ${i.verticalSpeed}.`,i=>`Descend via STAR, expect runway 25R. ${i.verticalSpeed}.`,i=>`Turn left heading 270, vectors ILS runway 28L. ${i.verticalSpeed}.`,i=>`Cleared ILS runway 09L approach. ${i.altitude}.`],JE=[i=>`Low altitude. ${i.altitude}. Traffic alert.`,i=>`Hold short runway 27, traffic on final. ${i.altitude}.`,i=>"Wind 280 at 12, cleared to land runway 28R."];function Or(i){return i[Math.floor(Math.random()*i.length)]}function jE(i){if(!i)return;const e=(i.callsign||i.icao24||"UNKNWN").trim(),t=i._rawAlt,n=i.status,s=i.originCity||i.origin,r=i.destCity||i.destination;let a;if(s&&r){const o=t!=null?`, ${i.altitude}`:"";a=Or(YE)(i,s,r,o)}else t!=null&&t<900&&t>10?a=Or(JE)(i):n==="CLIMBING"?a=Or(qE)(i):n==="DESCENDING"?a=Or($E)(i):a=Or(XE)(i);rg(e,a)}const ZE={name:"CinematicShader",uniforms:{tDiffuse:{value:null},time:{value:0},resolution:{value:new j}},vertexShader:`
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,fragmentShader:`
    uniform sampler2D tDiffuse;
    uniform float time;
    uniform vec2 resolution;
    varying vec2 vUv;

    float hash(vec2 p) {
      return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
    }

    void main() {
      vec2 uv = vUv;

      // Chromatic aberration — subtle lens effect at edges
      float d = distance(uv, vec2(0.5));
      float ca = d * d * 0.002;
      vec3 color;
      color.r = texture2D(tDiffuse, vec2(uv.x + ca, uv.y)).r;
      color.g = texture2D(tDiffuse, uv).g;
      color.b = texture2D(tDiffuse, vec2(uv.x - ca, uv.y)).b;

      // Color grading — teal shadows, warm highlights
      float lum = dot(color, vec3(0.2126, 0.7152, 0.0722));
      color.r += (1.0 - lum) * -0.012 + lum * 0.015;
      color.g += (1.0 - lum) * 0.018 + lum * 0.003;
      color.b += (1.0 - lum) * 0.035 + lum * -0.015;

      // Contrast — deepen blacks, gentle lift
      color = max(color - 0.004, 0.0);
      color = pow(color, vec3(0.97));

      // Saturation boost
      color = mix(vec3(lum), color, 1.15);

      // Vignette
      float vig = smoothstep(0.7, 0.2, d);
      color *= mix(0.55, 1.0, vig);

      // Film grain
      float grain = hash(uv * resolution + fract(time * 43.7) * 1000.0);
      color += (grain - 0.5) * 0.025;

      gl_FragColor = vec4(clamp(color, 0.0, 1.0), 1.0);
    }
  `},$n=document.getElementById("scene"),rs=new NA({canvas:$n,antialias:!0,alpha:!1});rs.setPixelRatio(Math.min(window.devicePixelRatio,2));rs.setSize(window.innerWidth,window.innerHeight);rs.setClearColor(592140,1);rs.toneMapping=dl;rs.toneMappingExposure=1.4;const Ot=new J0;Ot.fog=new pl(592140,.008);const _r=new QA(rs),og=new e1(Ot,null);_r.addPass(og);const lg=new sr(new j(window.innerWidth*.5,window.innerHeight*.5),.65,.4,.82);_r.addPass(lg);const Sl=new pm(ZE);Sl.uniforms.resolution.value.set(window.innerWidth,window.innerHeight);_r.addPass(Sl);_r.addPass(new n1);const Lt=new Zt(50,window.innerWidth/window.innerHeight,.1,200);Lt.position.set(0,35,.1);Lt.lookAt(0,0,0);og.camera=Lt;const gt=new OA(Lt,$n);gt.enableDamping=!0;gt.dampingFactor=.09;gt.target.set(0,0,0);gt.minDistance=.05;gt.maxDistance=60;gt.maxPolarAngle=Math.PI/2-20*Math.PI/180;gt.autoRotate=!1;gt.autoRotateSpeed=.3;gt.enabled=!1;let cg=!0;const QE=performance.now(),mp=3200,pn={x:0,y:35,z:.1,tx:0,ty:0,tz:0},Ds={x:8,y:9,z:12,tx:0,ty:1,tz:0};function eT(i){return i>=1?1:1-Math.pow(2,-10*i)}function Ec(i,e,t,n,s){n=Math.max(1e-4,n);const r=2/n,a=r*s,o=1/(1+a+.48*a*a+.235*a*a*a),l=i-e,c=(t+r*l)*s,u=(t-r*c)*o;return{value:e+(l+c)*o,vel:u}}function gp(i,e,t,n,s){const r=Ec(i.x,e.x,t.x,n,s),a=Ec(i.y,e.y,t.y,n,s),o=Ec(i.z,e.z,t.z,n,s);t.set(r.vel,a.vel,o.vel),i.set(r.value,a.value,o.value)}function tT(){const i=performance.now()-QE,e=eT(Math.min(i/mp,1));Lt.position.set(pn.x+(Ds.x-pn.x)*e,pn.y+(Ds.y-pn.y)*e,pn.z+(Ds.z-pn.z)*e),gt.target.set(pn.tx+(Ds.tx-pn.tx)*e,pn.ty+(Ds.ty-pn.ty)*e,pn.tz+(Ds.tz-pn.tz)*e),gt.update(),i>=mp&&(cg=!1,gt.enabled=!0)}const nT=7,iT=.28,sT=.45;document.getElementById("speed-lines");let Di=null,ug=new P,Yo=new P,hg=null,cl=!1;const lr=document.getElementById("follow-indicator"),rT=document.getElementById("follow-callsign");function Bh(i){if(Di=i,ug.set(0,0,0),Yo.set(0,0,0),cl=!0,gt.saveState(),gt.reset(),hg=new P().subVectors(Lt.position,i.group.position).normalize(),lr){const e=i.getDisplayData();rT.textContent=e.callsign||e.icao24,lr.classList.remove("hidden")}}function yr(){Di=null,cl=!1,lr&&lr.classList.add("hidden")}const _p=new P,yp=new P,Tc=new P;function aT(i){if(!Di||Di.removed){yr();return}const e=Di.group.position;_p.copy(gt.target),gp(gt.target,e,ug,iT,i),yp.subVectors(gt.target,_p),cl?(Tc.copy(e).addScaledVector(hg,nT),gp(Lt.position,Tc,Yo,sT,i),Yo.lengthSq()<4e-4&&(Lt.position.copy(Tc),Yo.set(0,0,0),cl=!1)):Lt.position.add(yp),gt.update()}const xp=document.getElementById("compass-needle"),vp=document.getElementById("compass-heading");let Sp=0;const wc=new P;function oT(){Lt.getWorldDirection(wc),Sp=Math.atan2(wc.x,wc.z);const i=(-Sp*180/Math.PI+360)%360;xp&&xp.setAttribute("transform",`rotate(${i}, 30, 30)`),vp&&(vp.textContent=`${Math.round(i)}°`)}f1(Ot);const Ml=400,dg=new nt,qo=new Float32Array(Ml*3),fg=new Float32Array(Ml);for(let i=0;i<Ml;i++)qo[i*3]=(Math.random()-.5)*60,qo[i*3+1]=Math.random()*5,qo[i*3+2]=(Math.random()-.5)*60,fg[i]=.02+Math.random()*.06;dg.setAttribute("position",new ke(qo,3));const pg=new is({color:12886104,size:.03,transparent:!0,opacity:.1,depthWrite:!1,sizeAttenuation:!0}),ul=new ur(dg,pg);ul.renderOrder=2e3;Ot.add(ul);const Fh=1200,zh=new nt,$o=new Float32Array(Fh*3),mg=new Float32Array(Fh);for(let i=0;i<Fh;i++){const e=Math.random()*Math.PI*2,t=Math.acos(2*Math.random()-1),n=80+Math.random()*40;$o[i*3]=n*Math.sin(t)*Math.cos(e),$o[i*3+1]=Math.abs(n*Math.cos(t))+5,$o[i*3+2]=n*Math.sin(t)*Math.sin(e),mg[i]=.3+Math.random()*.7}zh.setAttribute("position",new ke($o,3));zh.setAttribute("size",new ke(mg,1));const gg=new is({color:13687024,size:.15,transparent:!0,opacity:.4,depthWrite:!1,sizeAttenuation:!0,fog:!1}),_g=new ur(zh,gg);_g.renderOrder=-1;Ot.add(_g);let $e=null,Hu=Date.now();const lT=3e4;function Al(){Hu=Date.now(),gt.autoRotate=!1,as&&wa()}let yg=0,xg=0;$n.addEventListener("pointerdown",i=>{Al(),yg=i.clientX,xg=i.clientY});const zs=document.getElementById("aircraft-tooltip");function cT(i,e,t){if(!zs)return;const n=i.callsign||i.icao24||"",s=i.aircraftType||"",r=i.altitude&&i.altitude!=="--"?i.altitude:"";let a=`<span class="ttp-cs">${n}</span>`;s&&(a+=`<span class="ttp-sep">·</span><span class="ttp-type">${s}</span>`),r&&(a+=`<span class="ttp-sep">·</span><span class="ttp-alt">${r}</span>`),zs.innerHTML=a;const o=14;let l=e+o,c=t-40;l+200>window.innerWidth&&(l=e-o-200),c<8&&(c=t+o+4),zs.style.transform=`translate(${l}px, ${c}px)`,zs.classList.remove("hidden")}function Do(){zs&&zs.classList.add("hidden")}const Xs=new Ny,Cc=new j,Mp=new j;let Ap=0;$n.addEventListener("pointermove",i=>{i.buttons>0&&Al();const e=performance.now();if(e-Ap<16)return;if(Ap=e,!$e){Do();return}Mp.set(i.clientX/window.innerWidth*2-1,-(i.clientY/window.innerHeight)*2+1),Xs.setFromCamera(Mp,Lt);const t=Xs.intersectObjects($e.raycasterTargets,!1),n=xm(),s=n.length>0?Xs.intersectObjects(n,!1):[];if(t.length>0){$n.style.cursor="pointer";const r=$e.getByHitMesh(t[0].object);r?cT(r.getDisplayData(),i.clientX,i.clientY):Do()}else s.length>0?($n.style.cursor="pointer",Do()):($n.style.cursor="",Do())});$n.addEventListener("wheel",()=>{Al()},{passive:!0});let un=null;function vg(i){const{lat:e,lon:t}=xl();Fm(i.data.icao24,i.data.callsign),vl(i,e,t),$e.selectAircraft(i),Bh(i),jE(i.getDisplayData()),Ob(i.data.icao24),un&&(ss(Ot),$e.clearHighlight(),Ta(),un=null)}function Sg(i){Cc.x=i.clientX/window.innerWidth*2-1,Cc.y=-(i.clientY/window.innerHeight)*2+1,Xs.setFromCamera(Cc,Lt);const e=Xs.intersectObjects($e.raycasterTargets,!1);if(e.length===0)return null;for(const t of e){const n=$e.getByHitMesh(t.object);if(n&&n!==Di)return n}return $e.getByHitMesh(e[0].object)}$n.addEventListener("click",i=>{if(!$e)return;const e=i.clientX-yg,t=i.clientY-xg;if(e*e+t*t>25)return;const n=Sg(i);if(n){vg(n);return}const s=xm();if(s.length>0){const r=Xs.intersectObjects(s);if(r.length>0){const a=r[0].object.userData.airport;if(a){or(),hT(a);return}}}or(),$e&&$e.deselectAircraft(),yr(),un&&(ss(Ot),$e.clearHighlight(),Ta(),un=null)});$n.addEventListener("dblclick",i=>{if(!$e)return;i.preventDefault();const e=Sg(i);e&&vg(e)});function uT(i,e,t){const n=document.getElementById("airport-widget");if(!n)return;const s=i.iata||i.icao||"---";document.getElementById("aw-iata").textContent=s,document.getElementById("aw-icao").textContent=i.icao||"",document.getElementById("aw-name").textContent=i.name||s,document.getElementById("aw-arrivals").textContent=e.length,document.getElementById("aw-departures").textContent=t.length;const r=typeof hl<"u"?hl[s]:null;document.getElementById("aw-elev").textContent=r?.elev!=null?`${r.elev.toLocaleString()} ft`:"--",document.getElementById("aw-rwys").textContent=r?.rwys??"--";const a=document.getElementById("aw-hub");a&&(a.textContent=r?.hub||"--");const o=document.getElementById("aw-pax");o&&(o.textContent=r?.pax!=null?`${r.pax}M`:"--");const l=i.lat,c=i.lon;if(l!=null&&c!=null){const d=`${Math.abs(l).toFixed(2)}°${l>=0?"N":"S"}`,h=`${Math.abs(c).toFixed(2)}°${c>=0?"E":"W"}`;document.getElementById("aw-coord").textContent=`${d}  ${h}`}else document.getElementById("aw-coord").textContent="--";document.getElementById("aw-freq").textContent=r?.icao?`${r.icao} TWR`:`${s} INFO`;const u=document.getElementById("aw-fact");r?.fact?(u.textContent=r.fact,u.classList.remove("hidden")):u.classList.add("hidden"),n.classList.remove("hidden")}function Ta(){const i=document.getElementById("airport-widget");i&&i.classList.add("hidden")}document.getElementById("aw-close")?.addEventListener("click",()=>{Ta(),un&&(ss(Ot),$e?.clearHighlight(),un=null)});function hT(i){const e=Lh();if(!e)return;if(un&&un.iata===i.iata&&un.icao===i.icao){ss(Ot),$e.clearHighlight(),Ta(),un=null;return}un=i,M1(Ot,i);const{arrivals:t,departures:n}=d1(Mg,i,e.runways),s=new Set([...t.map(a=>a.icao24),...n.map(a=>a.icao24)]);s.size>0?$e.setHighlight(s):$e.clearHighlight();const r=i.iata||i.icao;console.log(`[STRATUM] ${r}: ${t.length} arrivals, ${n.length} departures`),uT(i,t,n)}let Mg=[];function dT(i){if(console.log("[STRATUM] Received",i.length,"aircraft"),ig(!1),Mg=i,$e){$e.update(i);const{lat:e,lon:t}=xl();ng($e.getCount(),e,t),VE($e,e,t)}}function fT(i,e){console.warn("[STRATUM] Data error:",i.message,`(${e} consecutive)`),e>=3&&ig(!0)}window.addEventListener("resize",()=>{Lt.aspect=window.innerWidth/window.innerHeight,Lt.updateProjectionMatrix(),rs.setSize(window.innerWidth,window.innerHeight),_r.setSize(window.innerWidth,window.innerHeight),lg.resolution.set(window.innerWidth*.5,window.innerHeight*.5),Sl.uniforms.resolution.value.set(window.innerWidth,window.innerHeight)});setInterval(gE,1e3);const hi=new Set,pT=10,mT=2.5,gT=9,_T=6;let ci=0,bl=!1,as=!1,Jo=null;const yT=6e3;function xT(){as=!0,yr(),Ag()}function wa(){as=!1,Jo&&(clearTimeout(Jo),Jo=null),lr&&lr.classList.add("hidden")}function Ag(){if(!as||!$e)return;const i=[...$e.aircraft.values()].filter(s=>!s.fadingOut);if(i.length===0){wa();return}const e=i[Math.floor(Math.random()*i.length)],{lat:t,lon:n}=xl();vl(e,t,n),$e.selectAircraft(e),Bh(e),Jo=setTimeout(Ag,yT)}const ra=document.getElementById("help-overlay");function bg(){ra&&ra.classList.toggle("hidden")}ra&&ra.addEventListener("click",i=>{i.target===ra&&bg()});document.addEventListener("keydown",i=>{if(document.activeElement.tagName==="INPUT")return;if(i.key==="?"||i.key==="/"&&i.shiftKey){i.preventDefault(),bg();return}if(i.key.toLowerCase()==="t"&&!i.ctrlKey&&!i.metaKey){as?wa():xT();return}if(i.key.toLowerCase()==="c"&&!i.ctrlKey&&!i.metaKey){i.preventDefault(),Gu();return}const e=i.key.toLowerCase();"wasdqe".includes(e)&&hi.add(e),i.key==="Shift"&&(bl=!0)});document.addEventListener("keyup",i=>{hi.delete(i.key.toLowerCase()),i.key==="Shift"&&(bl=!1)});window.addEventListener("blur",()=>{hi.clear(),bl=!1});const Ns=new P,Rc=new P,wi=new P;function Eg(){return Lt.getWorldDirection(Ns),Ns.y=0,Ns.normalize(),Rc.crossVectors(Ns,Lt.up).normalize(),wi.set(0,0,0),hi.has("w")&&wi.add(Ns),hi.has("s")&&wi.sub(Ns),hi.has("d")&&wi.add(Rc),hi.has("a")&&wi.sub(Rc),hi.has("q")&&(wi.y-=1),hi.has("e")&&(wi.y+=1),wi}function bp(i){const e=Eg(),t=e.lengthSq()>0;if(t)ci=Math.min(ci+gT*i,1);else if(ci=Math.max(ci-_T*i,0),ci<.001){ci=0;return}Al();const n=Math.max(.2,Math.min(3,Lt.position.y/8)),s=pT*n*(bl?mT:1),r=ci*ci*(3-2*ci);t&&e.normalize();const a=e.multiplyScalar(s*r*i);Lt.position.add(a),gt.target.add(a)}const Ep=new Uy;function Tg(){requestAnimationFrame(Tg);const i=Ep.getDelta(),e=Ep.getElapsedTime();Sl.uniforms.time.value=e,cg?tT():Di?Eg().lengthSq()>0?(yr(),or(),$e&&$e.deselectAircraft(),bp(i)):(aT(i),Hu=Date.now()):(bp(i),Date.now()-Hu>lT&&(gt.autoRotate=!0,gt.autoRotateSpeed=.3),gt.update()),A1(Ot,e),oT();const t=ul.geometry.attributes.position.array;for(let n=0;n<Ml;n++)t[n*3+1]+=fg[n]*i,t[n*3+1]>5&&(t[n*3+1]=0,t[n*3]=(Math.random()-.5)*60,t[n*3+2]=(Math.random()-.5)*60);ul.geometry.attributes.position.needsUpdate=!0,pg.opacity=.06+.04*Math.sin(e*.4),gg.opacity=.3+.14*Math.sin(e*.3),$e&&($e.animate(i,e),$e.animateSelection(e)),_r.render()}const ft=[{name:"Atlanta",code:"ATL",lat:33.6407,lon:-84.4277,region:"Americas",country:"USA"},{name:"Chicago O'Hare",code:"ORD",lat:41.9742,lon:-87.9073,region:"Americas",country:"USA"},{name:"Dallas/Fort Worth",code:"DFW",lat:32.8998,lon:-97.0403,region:"Americas",country:"USA"},{name:"Denver",code:"DEN",lat:39.8561,lon:-104.6737,region:"Americas",country:"USA"},{name:"Los Angeles",code:"LAX",lat:33.9425,lon:-118.4081,region:"Americas",country:"USA"},{name:"Charlotte",code:"CLT",lat:35.214,lon:-80.9431,region:"Americas",country:"USA"},{name:"Las Vegas",code:"LAS",lat:36.084,lon:-115.1537,region:"Americas",country:"USA"},{name:"Orlando",code:"MCO",lat:28.4294,lon:-81.3089,region:"Americas",country:"USA"},{name:"Phoenix",code:"PHX",lat:33.4373,lon:-112.0078,region:"Americas",country:"USA"},{name:"Miami",code:"MIA",lat:25.7959,lon:-80.287,region:"Americas",country:"USA"},{name:"San Francisco",code:"SFO",lat:37.6213,lon:-122.379,region:"Americas",country:"USA"},{name:"Seattle",code:"SEA",lat:47.4502,lon:-122.3088,region:"Americas",country:"USA"},{name:"Fort Lauderdale",code:"FLL",lat:26.0742,lon:-80.1506,region:"Americas",country:"USA"},{name:"Newark",code:"EWR",lat:40.6895,lon:-74.1745,region:"Americas",country:"USA"},{name:"New York JFK",code:"JFK",lat:40.6413,lon:-73.7781,region:"Americas",country:"USA"},{name:"Minneapolis",code:"MSP",lat:44.8848,lon:-93.2223,region:"Americas",country:"USA"},{name:"Detroit",code:"DTW",lat:42.2124,lon:-83.3534,region:"Americas",country:"USA"},{name:"Boston",code:"BOS",lat:42.3656,lon:-71.0096,region:"Americas",country:"USA"},{name:"Houston Bush",code:"IAH",lat:29.9902,lon:-95.3368,region:"Americas",country:"USA"},{name:"New York LaGuardia",code:"LGA",lat:40.7772,lon:-73.8726,region:"Americas",country:"USA"},{name:"Philadelphia",code:"PHL",lat:39.8719,lon:-75.2411,region:"Americas",country:"USA"},{name:"Washington Dulles",code:"IAD",lat:38.9531,lon:-77.4565,region:"Americas",country:"USA"},{name:"Washington Reagan",code:"DCA",lat:38.8521,lon:-77.0377,region:"Americas",country:"USA"},{name:"San Diego",code:"SAN",lat:32.7338,lon:-117.1933,region:"Americas",country:"USA"},{name:"Chicago Midway",code:"MDW",lat:41.7868,lon:-87.7522,region:"Americas",country:"USA"},{name:"Tampa",code:"TPA",lat:27.9755,lon:-82.5332,region:"Americas",country:"USA"},{name:"Fort Myers",code:"RSW",lat:26.5362,lon:-81.7552,region:"Americas",country:"USA"},{name:"Salt Lake City",code:"SLC",lat:40.7884,lon:-111.9778,region:"Americas",country:"USA"},{name:"Nashville",code:"BNA",lat:36.1245,lon:-86.6782,region:"Americas",country:"USA"},{name:"Austin",code:"AUS",lat:30.1975,lon:-97.6664,region:"Americas",country:"USA"},{name:"Honolulu",code:"HNL",lat:21.3187,lon:-157.9224,region:"Americas",country:"USA"},{name:"Portland",code:"PDX",lat:45.5898,lon:-122.5951,region:"Americas",country:"USA"},{name:"Raleigh-Durham",code:"RDU",lat:35.8776,lon:-78.7875,region:"Americas",country:"USA"},{name:"Orange County",code:"SNA",lat:33.6762,lon:-117.8674,region:"Americas",country:"USA"},{name:"Sacramento",code:"SMF",lat:38.6954,lon:-121.5908,region:"Americas",country:"USA"},{name:"San Jose",code:"SJC",lat:37.3626,lon:-121.929,region:"Americas",country:"USA"},{name:"Oakland",code:"OAK",lat:37.7213,lon:-122.2208,region:"Americas",country:"USA"},{name:"Cleveland",code:"CLE",lat:41.4117,lon:-81.8498,region:"Americas",country:"USA"},{name:"St. Louis",code:"STL",lat:38.7487,lon:-90.37,region:"Americas",country:"USA"},{name:"San Antonio",code:"SAT",lat:29.5337,lon:-98.4698,region:"Americas",country:"USA"},{name:"New Orleans",code:"MSY",lat:29.9934,lon:-90.258,region:"Americas",country:"USA"},{name:"Reno",code:"RNO",lat:39.4991,lon:-119.7681,region:"Americas",country:"USA"},{name:"Cincinnati",code:"CVG",lat:39.0488,lon:-84.6678,region:"Americas",country:"USA"},{name:"Kansas City",code:"MCI",lat:39.2976,lon:-94.7139,region:"Americas",country:"USA"},{name:"Jacksonville",code:"JAX",lat:30.4941,lon:-81.6879,region:"Americas",country:"USA"},{name:"Maui/Kahului",code:"OGG",lat:20.8986,lon:-156.4305,region:"Americas",country:"USA"},{name:"Columbus",code:"CMH",lat:39.998,lon:-82.8919,region:"Americas",country:"USA"},{name:"Milwaukee",code:"MKE",lat:42.9472,lon:-87.8966,region:"Americas",country:"USA"},{name:"Albuquerque",code:"ABQ",lat:35.0402,lon:-106.609,region:"Americas",country:"USA"},{name:"Indianapolis",code:"IND",lat:39.7173,lon:-86.2944,region:"Americas",country:"USA"},{name:"Boise",code:"BOI",lat:43.5644,lon:-116.2228,region:"Americas",country:"USA"},{name:"Memphis",code:"MEM",lat:35.0424,lon:-89.9767,region:"Americas",country:"USA"},{name:"Burbank",code:"BUR",lat:34.2007,lon:-118.3585,region:"Americas",country:"USA"},{name:"Ontario CA",code:"ONT",lat:34.056,lon:-117.6012,region:"Americas",country:"USA"},{name:"Richmond VA",code:"RIC",lat:37.5052,lon:-77.3197,region:"Americas",country:"USA"},{name:"Buffalo",code:"BUF",lat:42.9405,lon:-78.7322,region:"Americas",country:"USA"},{name:"Hartford",code:"BDL",lat:41.9389,lon:-72.6832,region:"Americas",country:"USA"},{name:"Pittsburgh",code:"PIT",lat:40.4915,lon:-80.2329,region:"Americas",country:"USA"},{name:"Oklahoma City",code:"OKC",lat:35.3931,lon:-97.6007,region:"Americas",country:"USA"},{name:"Tulsa",code:"TUL",lat:36.1984,lon:-95.8881,region:"Americas",country:"USA"},{name:"St. Pete/Clearwater",code:"PIE",lat:27.9102,lon:-82.6874,region:"Americas",country:"USA"},{name:"Sarasota",code:"SRQ",lat:27.3954,lon:-82.5544,region:"Americas",country:"USA"},{name:"El Paso",code:"ELP",lat:31.8072,lon:-106.3779,region:"Americas",country:"USA"},{name:"Knoxville",code:"TYS",lat:35.811,lon:-83.994,region:"Americas",country:"USA"},{name:"Savannah",code:"SAV",lat:32.1276,lon:-81.2021,region:"Americas",country:"USA"},{name:"Charleston SC",code:"CHS",lat:32.8986,lon:-80.0405,region:"Americas",country:"USA"},{name:"Norfolk",code:"ORF",lat:36.8976,lon:-76.0132,region:"Americas",country:"USA"},{name:"Birmingham AL",code:"BHM",lat:33.5629,lon:-86.7535,region:"Americas",country:"USA"},{name:"Grand Rapids",code:"GRR",lat:42.8808,lon:-85.5228,region:"Americas",country:"USA"},{name:"Fresno",code:"FAT",lat:36.7762,lon:-119.7182,region:"Americas",country:"USA"},{name:"Kona",code:"KOA",lat:19.7388,lon:-156.0456,region:"Americas",country:"USA"},{name:"Omaha",code:"OMA",lat:41.3032,lon:-95.894,region:"Americas",country:"USA"},{name:"Louisville",code:"SDF",lat:38.1744,lon:-85.736,region:"Americas",country:"USA"},{name:"Providence",code:"PVD",lat:41.7244,lon:-71.4328,region:"Americas",country:"USA"},{name:"Spokane",code:"GEG",lat:47.6199,lon:-117.5339,region:"Americas",country:"USA"},{name:"Greenville SC",code:"GSP",lat:34.8957,lon:-82.2189,region:"Americas",country:"USA"},{name:"Pensacola",code:"PNS",lat:30.4734,lon:-87.1866,region:"Americas",country:"USA"},{name:"Myrtle Beach",code:"MYR",lat:33.6797,lon:-78.9283,region:"Americas",country:"USA"},{name:"Asheville",code:"AVL",lat:35.4362,lon:-82.5418,region:"Americas",country:"USA"},{name:"Kauai/Lihue",code:"LIH",lat:21.9759,lon:-159.339,region:"Americas",country:"USA"},{name:"Midland/Odessa",code:"MAF",lat:31.9425,lon:-102.2019,region:"Americas",country:"USA"},{name:"Bozeman",code:"BZN",lat:45.7777,lon:-111.1503,region:"Americas",country:"USA"},{name:"Rochester NY",code:"ROC",lat:43.1189,lon:-77.6724,region:"Americas",country:"USA"},{name:"Syracuse",code:"SYR",lat:43.1112,lon:-76.1063,region:"Americas",country:"USA"},{name:"Albany",code:"ALB",lat:42.7483,lon:-73.8017,region:"Americas",country:"USA"},{name:"Des Moines",code:"DSM",lat:41.534,lon:-93.6631,region:"Americas",country:"USA"},{name:"Little Rock",code:"LIT",lat:34.7294,lon:-92.2243,region:"Americas",country:"USA"},{name:"Colorado Springs",code:"COS",lat:38.8058,lon:-104.7006,region:"Americas",country:"USA"},{name:"Fayetteville AR",code:"XNA",lat:36.2819,lon:-94.3068,region:"Americas",country:"USA"},{name:"Chattanooga",code:"CHA",lat:35.0353,lon:-85.2039,region:"Americas",country:"USA"},{name:"Huntsville",code:"HSV",lat:34.6372,lon:-86.7751,region:"Americas",country:"USA"},{name:"Anchorage",code:"ANC",lat:61.1743,lon:-149.9963,region:"Americas",country:"USA"},{name:"Eugene",code:"EUG",lat:44.1246,lon:-123.2119,region:"Americas",country:"USA"},{name:"Medford",code:"MFR",lat:42.3742,lon:-122.8735,region:"Americas",country:"USA"},{name:"Shreveport",code:"SHV",lat:32.4466,lon:-93.8257,region:"Americas",country:"USA"},{name:"Baton Rouge",code:"BTR",lat:30.5332,lon:-91.1496,region:"Americas",country:"USA"},{name:"Palm Springs",code:"PSP",lat:33.8297,lon:-116.5067,region:"Americas",country:"USA"},{name:"Santa Barbara",code:"SBA",lat:34.4262,lon:-119.8408,region:"Americas",country:"USA"},{name:"Cedar Rapids",code:"CID",lat:41.8847,lon:-91.7108,region:"Americas",country:"USA"},{name:"Fargo",code:"FAR",lat:46.9207,lon:-96.8158,region:"Americas",country:"USA"},{name:"Sioux Falls",code:"FSD",lat:43.582,lon:-96.7419,region:"Americas",country:"USA"},{name:"Bismarck",code:"BIS",lat:46.7727,lon:-100.7463,region:"Americas",country:"USA"},{name:"Billings",code:"BIL",lat:45.8077,lon:-108.5428,region:"Americas",country:"USA"},{name:"Dayton",code:"DAY",lat:39.9024,lon:-84.2194,region:"Americas",country:"USA"},{name:"Wichita",code:"ICT",lat:37.6499,lon:-97.4331,region:"Americas",country:"USA"},{name:"Wilmington NC",code:"ILM",lat:34.2706,lon:-77.9026,region:"Americas",country:"USA"},{name:"Fairbanks",code:"FAI",lat:64.8151,lon:-147.8561,region:"Americas",country:"USA"},{name:"Missoula",code:"MSO",lat:46.9163,lon:-114.0906,region:"Americas",country:"USA"},{name:"Jackson Hole",code:"JAC",lat:43.6073,lon:-110.7377,region:"Americas",country:"USA"},{name:"Burlington VT",code:"BTV",lat:44.4719,lon:-73.1533,region:"Americas",country:"USA"},{name:"Tallahassee",code:"TLH",lat:30.3965,lon:-84.3503,region:"Americas",country:"USA"},{name:"Gulfport",code:"GPT",lat:30.4073,lon:-89.0701,region:"Americas",country:"USA"},{name:"Jackson MS",code:"JAN",lat:32.3112,lon:-90.0759,region:"Americas",country:"USA"},{name:"Mobile",code:"MOB",lat:30.6913,lon:-88.2428,region:"Americas",country:"USA"},{name:"Lubbock",code:"LBB",lat:33.6636,lon:-101.8228,region:"Americas",country:"USA"},{name:"Corpus Christi",code:"CRP",lat:27.7704,lon:-97.5012,region:"Americas",country:"USA"},{name:"Harlingen",code:"HRL",lat:26.2285,lon:-97.6544,region:"Americas",country:"USA"},{name:"Allentown",code:"ABE",lat:40.6521,lon:-75.4408,region:"Americas",country:"USA"},{name:"Harrisburg",code:"MDT",lat:40.1935,lon:-76.7634,region:"Americas",country:"USA"},{name:"White Plains",code:"HPN",lat:41.067,lon:-73.7076,region:"Americas",country:"USA"},{name:"Long Island/Islip",code:"ISP",lat:40.7952,lon:-73.1002,region:"Americas",country:"USA"},{name:"Akron/Canton",code:"CAK",lat:40.9161,lon:-81.4422,region:"Americas",country:"USA"},{name:"Lincoln NE",code:"LNK",lat:40.851,lon:-96.7592,region:"Americas",country:"USA"},{name:"Newport News",code:"PHF",lat:37.1319,lon:-76.493,region:"Americas",country:"USA"},{name:"Roanoke",code:"ROA",lat:37.3255,lon:-79.9754,region:"Americas",country:"USA"},{name:"Great Falls",code:"GTF",lat:47.482,lon:-111.3707,region:"Americas",country:"USA"},{name:"Rapid City",code:"RAP",lat:44.0453,lon:-103.0574,region:"Americas",country:"USA"},{name:"Grand Forks",code:"GFK",lat:47.9493,lon:-97.1761,region:"Americas",country:"USA"},{name:"South Bend",code:"SBN",lat:41.7087,lon:-86.3172,region:"Americas",country:"USA"},{name:"Fort Wayne",code:"FWA",lat:40.9785,lon:-85.1951,region:"Americas",country:"USA"},{name:"Lafayette LA",code:"LFT",lat:30.2053,lon:-91.9875,region:"Americas",country:"USA"},{name:"Manchester NH",code:"MHT",lat:42.9326,lon:-71.4357,region:"Americas",country:"USA"},{name:"Portland ME",code:"PWM",lat:43.6462,lon:-70.3093,region:"Americas",country:"USA"},{name:"Juneau",code:"JNU",lat:58.355,lon:-134.5763,region:"Americas",country:"USA"},{name:"Tri-Cities TN",code:"TRI",lat:36.4752,lon:-82.4074,region:"Americas",country:"USA"},{name:"Panama City Beach",code:"ECP",lat:30.3581,lon:-85.7995,region:"Americas",country:"USA"},{name:"Fort Walton/Destin",code:"VPS",lat:30.4833,lon:-86.5253,region:"Americas",country:"USA"},{name:"Scranton",code:"AVP",lat:41.3385,lon:-75.7234,region:"Americas",country:"USA"},{name:"Gainesville FL",code:"GNV",lat:29.69,lon:-82.2717,region:"Americas",country:"USA"},{name:"Daytona Beach",code:"DAB",lat:29.1799,lon:-81.0581,region:"Americas",country:"USA"},{name:"Quad Cities",code:"MLI",lat:41.4485,lon:-90.5075,region:"Americas",country:"USA"},{name:"Monterey",code:"MRY",lat:36.587,lon:-121.8437,region:"Americas",country:"USA"},{name:"Houston Hobby",code:"HOU",lat:29.6454,lon:-95.2789,region:"Americas",country:"USA"},{name:"Greensboro",code:"GSO",lat:36.0978,lon:-79.9373,region:"Americas",country:"USA"},{name:"Tucson",code:"TUS",lat:32.1161,lon:-110.941,region:"Americas",country:"USA"},{name:"Spokane Felts",code:"SFF",lat:47.6828,lon:-117.3226,region:"Americas",country:"USA"},{name:"Redding",code:"RDD",lat:40.509,lon:-122.2932,region:"Americas",country:"USA"},{name:"Orlando Sanford",code:"SFB",lat:28.7776,lon:-81.2375,region:"Americas",country:"USA"},{name:"Toronto",code:"YYZ",lat:43.6777,lon:-79.6248,region:"Americas",country:"Canada"},{name:"Vancouver",code:"YVR",lat:49.1947,lon:-123.1792,region:"Americas",country:"Canada"},{name:"Montreal",code:"YUL",lat:45.4706,lon:-73.7408,region:"Americas",country:"Canada"},{name:"Calgary",code:"YYC",lat:51.1314,lon:-114.0125,region:"Americas",country:"Canada"},{name:"Edmonton",code:"YEG",lat:53.3097,lon:-113.5797,region:"Americas",country:"Canada"},{name:"Ottawa",code:"YOW",lat:45.3225,lon:-75.6692,region:"Americas",country:"Canada"},{name:"Winnipeg",code:"YWG",lat:49.91,lon:-97.2398,region:"Americas",country:"Canada"},{name:"Halifax",code:"YHZ",lat:44.8808,lon:-63.5086,region:"Americas",country:"Canada"},{name:"Quebec City",code:"YQB",lat:46.7911,lon:-71.3933,region:"Americas",country:"Canada"},{name:"Victoria",code:"YYJ",lat:48.6469,lon:-123.4258,region:"Americas",country:"Canada"},{name:"Saskatoon",code:"YXE",lat:52.1708,lon:-106.6997,region:"Americas",country:"Canada"},{name:"Kelowna",code:"YLW",lat:49.9561,lon:-119.3778,region:"Americas",country:"Canada"},{name:"Mexico City",code:"MEX",lat:19.4363,lon:-99.0721,region:"Americas",country:"Mexico"},{name:"Cancún",code:"CUN",lat:21.0365,lon:-86.8771,region:"Americas",country:"Mexico"},{name:"Guadalajara",code:"GDL",lat:20.5218,lon:-103.3107,region:"Americas",country:"Mexico"},{name:"Monterrey",code:"MTY",lat:25.7785,lon:-100.1069,region:"Americas",country:"Mexico"},{name:"Tijuana",code:"TIJ",lat:32.5411,lon:-116.97,region:"Americas",country:"Mexico"},{name:"Puerto Vallarta",code:"PVR",lat:20.6801,lon:-105.2544,region:"Americas",country:"Mexico"},{name:"Los Cabos",code:"SJD",lat:23.1518,lon:-109.721,region:"Americas",country:"Mexico"},{name:"Mérida",code:"MID",lat:20.937,lon:-89.6577,region:"Americas",country:"Mexico"},{name:"León",code:"BJX",lat:20.9935,lon:-101.4809,region:"Americas",country:"Mexico"},{name:"Hermosillo",code:"HMO",lat:29.0959,lon:-111.0479,region:"Americas",country:"Mexico"},{name:"Mazatlán",code:"MZT",lat:23.1614,lon:-106.2661,region:"Americas",country:"Mexico"},{name:"Acapulco",code:"ACA",lat:16.7574,lon:-99.754,region:"Americas",country:"Mexico"},{name:"San Juan",code:"SJU",lat:18.4394,lon:-66.0018,region:"Americas",country:"Puerto Rico"},{name:"Havana",code:"HAV",lat:22.9892,lon:-82.4091,region:"Americas",country:"Cuba"},{name:"Santo Domingo",code:"SDQ",lat:18.4297,lon:-69.6689,region:"Americas",country:"Dom. Rep."},{name:"Punta Cana",code:"PUJ",lat:18.5674,lon:-68.3634,region:"Americas",country:"Dom. Rep."},{name:"Kingston",code:"KIN",lat:17.9357,lon:-76.7875,region:"Americas",country:"Jamaica"},{name:"Montego Bay",code:"MBJ",lat:18.5037,lon:-77.9134,region:"Americas",country:"Jamaica"},{name:"Nassau",code:"NAS",lat:25.039,lon:-77.4662,region:"Americas",country:"Bahamas"},{name:"Bridgetown",code:"BGI",lat:13.0746,lon:-59.4925,region:"Americas",country:"Barbados"},{name:"Port of Spain",code:"POS",lat:10.5954,lon:-61.3372,region:"Americas",country:"Trinidad"},{name:"Willemstad",code:"CUR",lat:12.1889,lon:-68.9598,region:"Americas",country:"Curaçao"},{name:"Oranjestad",code:"AUA",lat:12.5014,lon:-70.0152,region:"Americas",country:"Aruba"},{name:"Sint Maarten",code:"SXM",lat:18.041,lon:-63.1089,region:"Americas",country:"Sint Maarten"},{name:"Guatemala City",code:"GUA",lat:14.5833,lon:-90.5275,region:"Americas",country:"Guatemala"},{name:"San José",code:"SJO",lat:9.9939,lon:-84.2088,region:"Americas",country:"Costa Rica"},{name:"Panama City",code:"PTY",lat:9.0714,lon:-79.3835,region:"Americas",country:"Panama"},{name:"Belize City",code:"BZE",lat:17.5391,lon:-88.3082,region:"Americas",country:"Belize"},{name:"Managua",code:"MGA",lat:12.1415,lon:-86.1682,region:"Americas",country:"Nicaragua"},{name:"San Salvador",code:"SAL",lat:13.4409,lon:-89.0558,region:"Americas",country:"El Salvador"},{name:"Tegucigalpa",code:"TGU",lat:14.0608,lon:-87.2172,region:"Americas",country:"Honduras"},{name:"Martinique",code:"FDF",lat:14.591,lon:-61.0032,region:"Americas",country:"Martinique"},{name:"Guadeloupe",code:"PTP",lat:16.2653,lon:-61.5318,region:"Americas",country:"Guadeloupe"},{name:"São Paulo GRU",code:"GRU",lat:-23.4356,lon:-46.4731,region:"Americas",country:"Brazil"},{name:"São Paulo Congonhas",code:"CGH",lat:-23.6261,lon:-46.6564,region:"Americas",country:"Brazil"},{name:"Rio de Janeiro",code:"GIG",lat:-22.8099,lon:-43.2505,region:"Americas",country:"Brazil"},{name:"Brasília",code:"BSB",lat:-15.8711,lon:-47.9186,region:"Americas",country:"Brazil"},{name:"Salvador",code:"SSA",lat:-12.9086,lon:-38.3225,region:"Americas",country:"Brazil"},{name:"Fortaleza",code:"FOR",lat:-3.7762,lon:-38.5326,region:"Americas",country:"Brazil"},{name:"Recife",code:"REC",lat:-8.1265,lon:-34.9237,region:"Americas",country:"Brazil"},{name:"Porto Alegre",code:"POA",lat:-29.9944,lon:-51.1714,region:"Americas",country:"Brazil"},{name:"Manaus",code:"MAO",lat:-3.0386,lon:-60.0497,region:"Americas",country:"Brazil"},{name:"Belém",code:"BEL",lat:-1.3792,lon:-48.4762,region:"Americas",country:"Brazil"},{name:"Belo Horizonte",code:"CNF",lat:-19.6244,lon:-43.9719,region:"Americas",country:"Brazil"},{name:"Natal",code:"NAT",lat:-5.9114,lon:-35.2478,region:"Americas",country:"Brazil"},{name:"Curitiba",code:"CWB",lat:-25.5285,lon:-49.1758,region:"Americas",country:"Brazil"},{name:"Buenos Aires",code:"EZE",lat:-34.8222,lon:-58.5358,region:"Americas",country:"Argentina"},{name:"Córdoba",code:"COR",lat:-31.3236,lon:-64.208,region:"Americas",country:"Argentina"},{name:"Mendoza",code:"MDZ",lat:-32.8317,lon:-68.7929,region:"Americas",country:"Argentina"},{name:"Bogotá",code:"BOG",lat:4.7016,lon:-74.1469,region:"Americas",country:"Colombia"},{name:"Medellín",code:"MDE",lat:6.1645,lon:-75.4231,region:"Americas",country:"Colombia"},{name:"Cartagena",code:"CTG",lat:10.4424,lon:-75.513,region:"Americas",country:"Colombia"},{name:"Cali",code:"CLO",lat:3.5432,lon:-76.3816,region:"Americas",country:"Colombia"},{name:"Lima",code:"LIM",lat:-12.0219,lon:-77.1143,region:"Americas",country:"Peru"},{name:"Santiago",code:"SCL",lat:-33.393,lon:-70.7858,region:"Americas",country:"Chile"},{name:"Quito",code:"UIO",lat:-.1292,lon:-78.3575,region:"Americas",country:"Ecuador"},{name:"Guayaquil",code:"GYE",lat:-2.1574,lon:-79.8836,region:"Americas",country:"Ecuador"},{name:"Montevideo",code:"MVD",lat:-34.8384,lon:-56.0308,region:"Americas",country:"Uruguay"},{name:"Asunción",code:"ASU",lat:-25.2399,lon:-57.5198,region:"Americas",country:"Paraguay"},{name:"La Paz",code:"LPB",lat:-16.5133,lon:-68.1923,region:"Americas",country:"Bolivia"},{name:"Santa Cruz",code:"VVI",lat:-17.6448,lon:-63.1354,region:"Americas",country:"Bolivia"},{name:"Caracas",code:"CCS",lat:10.6031,lon:-66.9913,region:"Americas",country:"Venezuela"},{name:"Arequipa",code:"AQP",lat:-16.3411,lon:-71.583,region:"Americas",country:"Peru"},{name:"Georgetown",code:"GEO",lat:6.4986,lon:-58.2541,region:"Americas",country:"Guyana"},{name:"Paramaribo",code:"PBM",lat:5.4528,lon:-55.1878,region:"Americas",country:"Suriname"},{name:"London Heathrow",code:"LHR",lat:51.4775,lon:-.4614,region:"Europe",country:"UK"},{name:"London Gatwick",code:"LGW",lat:51.1537,lon:-.1821,region:"Europe",country:"UK"},{name:"London Stansted",code:"STN",lat:51.885,lon:.235,region:"Europe",country:"UK"},{name:"Manchester",code:"MAN",lat:53.365,lon:-2.2729,region:"Europe",country:"UK"},{name:"London Luton",code:"LTN",lat:51.8747,lon:-.3683,region:"Europe",country:"UK"},{name:"Edinburgh",code:"EDI",lat:55.95,lon:-3.3725,region:"Europe",country:"UK"},{name:"Birmingham",code:"BHX",lat:52.4539,lon:-1.748,region:"Europe",country:"UK"},{name:"Glasgow",code:"GLA",lat:55.8719,lon:-4.4331,region:"Europe",country:"UK"},{name:"Bristol",code:"BRS",lat:51.3827,lon:-2.7191,region:"Europe",country:"UK"},{name:"Newcastle",code:"NCL",lat:55.0375,lon:-1.6917,region:"Europe",country:"UK"},{name:"Belfast",code:"BFS",lat:54.6575,lon:-6.2158,region:"Europe",country:"UK"},{name:"East Midlands",code:"EMA",lat:52.8311,lon:-1.3281,region:"Europe",country:"UK"},{name:"Aberdeen",code:"ABZ",lat:57.2019,lon:-2.1978,region:"Europe",country:"UK"},{name:"Southampton",code:"SOU",lat:50.9503,lon:-1.3568,region:"Europe",country:"UK"},{name:"Leeds Bradford",code:"LBA",lat:53.8659,lon:-1.6606,region:"Europe",country:"UK"},{name:"Liverpool",code:"LPL",lat:53.3336,lon:-2.8497,region:"Europe",country:"UK"},{name:"Frankfurt",code:"FRA",lat:50.0379,lon:8.5622,region:"Europe",country:"Germany"},{name:"Munich",code:"MUC",lat:48.3537,lon:11.775,region:"Europe",country:"Germany"},{name:"Berlin",code:"BER",lat:52.3667,lon:13.5033,region:"Europe",country:"Germany"},{name:"Düsseldorf",code:"DUS",lat:51.2895,lon:6.7668,region:"Europe",country:"Germany"},{name:"Hamburg",code:"HAM",lat:53.6304,lon:9.9882,region:"Europe",country:"Germany"},{name:"Cologne",code:"CGN",lat:50.8659,lon:7.1427,region:"Europe",country:"Germany"},{name:"Stuttgart",code:"STR",lat:48.6899,lon:9.222,region:"Europe",country:"Germany"},{name:"Nuremberg",code:"NUE",lat:49.4987,lon:11.0669,region:"Europe",country:"Germany"},{name:"Hannover",code:"HAJ",lat:52.4611,lon:9.685,region:"Europe",country:"Germany"},{name:"Leipzig",code:"LEJ",lat:51.4324,lon:12.2416,region:"Europe",country:"Germany"},{name:"Dresden",code:"DRS",lat:51.1328,lon:13.7672,region:"Europe",country:"Germany"},{name:"Bremen",code:"BRE",lat:53.0475,lon:8.7867,region:"Europe",country:"Germany"},{name:"Paris CDG",code:"CDG",lat:49.0097,lon:2.5479,region:"Europe",country:"France"},{name:"Paris Orly",code:"ORY",lat:48.7233,lon:2.3794,region:"Europe",country:"France"},{name:"Nice",code:"NCE",lat:43.6584,lon:7.2159,region:"Europe",country:"France"},{name:"Lyon",code:"LYS",lat:45.7256,lon:5.0811,region:"Europe",country:"France"},{name:"Marseille",code:"MRS",lat:43.4393,lon:5.2214,region:"Europe",country:"France"},{name:"Toulouse",code:"TLS",lat:43.6291,lon:1.3638,region:"Europe",country:"France"},{name:"Bordeaux",code:"BOD",lat:44.8283,lon:-.7156,region:"Europe",country:"France"},{name:"Nantes",code:"NTE",lat:47.1532,lon:-1.6108,region:"Europe",country:"France"},{name:"Strasbourg",code:"SXB",lat:48.5383,lon:7.6283,region:"Europe",country:"France"},{name:"Montpellier",code:"MPL",lat:43.5762,lon:3.963,region:"Europe",country:"France"},{name:"Bastia",code:"BIA",lat:42.5527,lon:9.4837,region:"Europe",country:"France"},{name:"Amsterdam",code:"AMS",lat:52.3105,lon:4.7683,region:"Europe",country:"Netherlands"},{name:"Eindhoven",code:"EIN",lat:51.4501,lon:5.3745,region:"Europe",country:"Netherlands"},{name:"Rotterdam",code:"RTM",lat:51.9569,lon:4.4372,region:"Europe",country:"Netherlands"},{name:"Brussels",code:"BRU",lat:50.9014,lon:4.4844,region:"Europe",country:"Belgium"},{name:"Brussels South",code:"CRL",lat:50.4592,lon:4.4528,region:"Europe",country:"Belgium"},{name:"Luxembourg",code:"LUX",lat:49.6233,lon:6.2044,region:"Europe",country:"Luxembourg"},{name:"Madrid",code:"MAD",lat:40.4983,lon:-3.5676,region:"Europe",country:"Spain"},{name:"Barcelona",code:"BCN",lat:41.2971,lon:2.0785,region:"Europe",country:"Spain"},{name:"Palma Mallorca",code:"PMI",lat:39.5517,lon:2.7388,region:"Europe",country:"Spain"},{name:"Málaga",code:"AGP",lat:36.6749,lon:-4.4991,region:"Europe",country:"Spain"},{name:"Alicante",code:"ALC",lat:38.2822,lon:-.5582,region:"Europe",country:"Spain"},{name:"Las Palmas",code:"LPA",lat:27.9319,lon:-15.3866,region:"Europe",country:"Spain"},{name:"Tenerife South",code:"TFS",lat:28.0445,lon:-16.5725,region:"Europe",country:"Spain"},{name:"Tenerife North",code:"TFN",lat:28.4827,lon:-16.3414,region:"Europe",country:"Spain"},{name:"Seville",code:"SVQ",lat:37.418,lon:-5.8931,region:"Europe",country:"Spain"},{name:"Valencia",code:"VLC",lat:39.4893,lon:-.4816,region:"Europe",country:"Spain"},{name:"Lanzarote",code:"ACE",lat:28.9455,lon:-13.6052,region:"Europe",country:"Spain"},{name:"Fuerteventura",code:"FUE",lat:28.4527,lon:-13.8638,region:"Europe",country:"Spain"},{name:"Ibiza",code:"IBZ",lat:38.8729,lon:1.3713,region:"Europe",country:"Spain"},{name:"Menorca",code:"MAH",lat:39.8626,lon:4.2186,region:"Europe",country:"Spain"},{name:"Bilbao",code:"BIO",lat:43.3011,lon:-2.9106,region:"Europe",country:"Spain"},{name:"Lisbon",code:"LIS",lat:38.7742,lon:-9.1342,region:"Europe",country:"Portugal"},{name:"Porto",code:"OPO",lat:41.2481,lon:-8.6814,region:"Europe",country:"Portugal"},{name:"Faro",code:"FAO",lat:37.0144,lon:-7.9659,region:"Europe",country:"Portugal"},{name:"Funchal/Madeira",code:"FNC",lat:32.6979,lon:-16.7745,region:"Europe",country:"Portugal"},{name:"Ponta Delgada",code:"PDL",lat:37.7412,lon:-25.6979,region:"Europe",country:"Portugal"},{name:"Rome Fiumicino",code:"FCO",lat:41.8003,lon:12.2389,region:"Europe",country:"Italy"},{name:"Milan Malpensa",code:"MXP",lat:45.6306,lon:8.7281,region:"Europe",country:"Italy"},{name:"Milan Linate",code:"LIN",lat:45.4455,lon:9.2773,region:"Europe",country:"Italy"},{name:"Venice",code:"VCE",lat:45.5053,lon:12.3519,region:"Europe",country:"Italy"},{name:"Naples",code:"NAP",lat:40.886,lon:14.2908,region:"Europe",country:"Italy"},{name:"Catania",code:"CTA",lat:37.4668,lon:15.0664,region:"Europe",country:"Italy"},{name:"Bologna",code:"BLQ",lat:44.5354,lon:11.2887,region:"Europe",country:"Italy"},{name:"Turin",code:"TRN",lat:45.2008,lon:7.6497,region:"Europe",country:"Italy"},{name:"Florence",code:"FLR",lat:43.81,lon:11.2051,region:"Europe",country:"Italy"},{name:"Palermo",code:"PMO",lat:38.176,lon:13.091,region:"Europe",country:"Italy"},{name:"Bari",code:"BRI",lat:41.1389,lon:16.7606,region:"Europe",country:"Italy"},{name:"Olbia",code:"OLB",lat:40.8987,lon:9.5177,region:"Europe",country:"Italy"},{name:"Cagliari",code:"CAG",lat:39.2515,lon:9.0543,region:"Europe",country:"Italy"},{name:"Zurich",code:"ZRH",lat:47.4647,lon:8.5492,region:"Europe",country:"Switzerland"},{name:"Geneva",code:"GVA",lat:46.238,lon:6.1089,region:"Europe",country:"Switzerland"},{name:"Basel/Mulhouse",code:"BSL",lat:47.5896,lon:7.5299,region:"Europe",country:"Switzerland"},{name:"Vienna",code:"VIE",lat:48.1103,lon:16.5697,region:"Europe",country:"Austria"},{name:"Salzburg",code:"SZG",lat:47.7933,lon:13.0043,region:"Europe",country:"Austria"},{name:"Innsbruck",code:"INN",lat:47.2602,lon:11.344,region:"Europe",country:"Austria"},{name:"Graz",code:"GRZ",lat:46.9911,lon:15.4396,region:"Europe",country:"Austria"},{name:"Copenhagen",code:"CPH",lat:55.6179,lon:12.656,region:"Europe",country:"Denmark"},{name:"Aalborg",code:"AAL",lat:57.0928,lon:9.8492,region:"Europe",country:"Denmark"},{name:"Billund",code:"BLL",lat:55.7403,lon:9.1518,region:"Europe",country:"Denmark"},{name:"Stockholm",code:"ARN",lat:59.6519,lon:17.9186,region:"Europe",country:"Sweden"},{name:"Gothenburg",code:"GOT",lat:57.6628,lon:12.2798,region:"Europe",country:"Sweden"},{name:"Malmö",code:"MMX",lat:55.5363,lon:13.3762,region:"Europe",country:"Sweden"},{name:"Oslo",code:"OSL",lat:60.1939,lon:11.1004,region:"Europe",country:"Norway"},{name:"Bergen",code:"BGO",lat:60.2934,lon:5.2181,region:"Europe",country:"Norway"},{name:"Stavanger",code:"SVG",lat:58.8768,lon:5.6378,region:"Europe",country:"Norway"},{name:"Trondheim",code:"TRD",lat:63.4578,lon:10.9239,region:"Europe",country:"Norway"},{name:"Helsinki",code:"HEL",lat:60.3172,lon:24.9633,region:"Europe",country:"Finland"},{name:"Oulu",code:"OUL",lat:64.9301,lon:25.3546,region:"Europe",country:"Finland"},{name:"Rovaniemi",code:"RVN",lat:66.5648,lon:25.8304,region:"Europe",country:"Finland"},{name:"Reykjavik",code:"KEF",lat:63.985,lon:-22.6056,region:"Europe",country:"Iceland"},{name:"Istanbul",code:"IST",lat:41.2608,lon:28.7418,region:"Europe",country:"Turkey"},{name:"Istanbul Sabiha",code:"SAW",lat:40.8985,lon:29.3092,region:"Europe",country:"Turkey"},{name:"Antalya",code:"AYT",lat:36.8987,lon:30.7992,region:"Europe",country:"Turkey"},{name:"Ankara",code:"ESB",lat:40.1281,lon:32.9951,region:"Europe",country:"Turkey"},{name:"Izmir",code:"ADB",lat:38.2924,lon:27.157,region:"Europe",country:"Turkey"},{name:"Gaziantep",code:"GZT",lat:36.9473,lon:37.4787,region:"Europe",country:"Turkey"},{name:"Trabzon",code:"TZX",lat:40.995,lon:39.7897,region:"Europe",country:"Turkey"},{name:"Warsaw",code:"WAW",lat:52.1657,lon:20.9671,region:"Europe",country:"Poland"},{name:"Kraków",code:"KRK",lat:50.0777,lon:19.7848,region:"Europe",country:"Poland"},{name:"Gdansk",code:"GDN",lat:54.3776,lon:18.4662,region:"Europe",country:"Poland"},{name:"Wroclaw",code:"WRO",lat:51.1027,lon:16.8858,region:"Europe",country:"Poland"},{name:"Katowice",code:"KTW",lat:50.4743,lon:19.08,region:"Europe",country:"Poland"},{name:"Poznan",code:"POZ",lat:52.421,lon:16.8263,region:"Europe",country:"Poland"},{name:"Prague",code:"PRG",lat:50.1008,lon:14.26,region:"Europe",country:"Czech Rep."},{name:"Brno",code:"BRQ",lat:49.1513,lon:16.6944,region:"Europe",country:"Czech Rep."},{name:"Budapest",code:"BUD",lat:47.4369,lon:19.2556,region:"Europe",country:"Hungary"},{name:"Bucharest",code:"OTP",lat:44.5722,lon:26.1022,region:"Europe",country:"Romania"},{name:"Cluj-Napoca",code:"CLJ",lat:46.7852,lon:23.6862,region:"Europe",country:"Romania"},{name:"Iași",code:"IAS",lat:47.1783,lon:27.6206,region:"Europe",country:"Romania"},{name:"Timișoara",code:"TSR",lat:45.8099,lon:21.3379,region:"Europe",country:"Romania"},{name:"Sofia",code:"SOF",lat:42.6967,lon:23.4114,region:"Europe",country:"Bulgaria"},{name:"Varna",code:"VAR",lat:43.2321,lon:27.8251,region:"Europe",country:"Bulgaria"},{name:"Burgas",code:"BOJ",lat:42.5696,lon:27.5152,region:"Europe",country:"Bulgaria"},{name:"Athens",code:"ATH",lat:37.9364,lon:23.9445,region:"Europe",country:"Greece"},{name:"Thessaloniki",code:"SKG",lat:40.5197,lon:22.9709,region:"Europe",country:"Greece"},{name:"Heraklion",code:"HER",lat:35.3397,lon:25.1803,region:"Europe",country:"Greece"},{name:"Rhodes",code:"RHO",lat:36.4054,lon:28.0862,region:"Europe",country:"Greece"},{name:"Corfu",code:"CFU",lat:39.6019,lon:19.9117,region:"Europe",country:"Greece"},{name:"Mykonos",code:"JMK",lat:37.4351,lon:25.3481,region:"Europe",country:"Greece"},{name:"Santorini",code:"JTR",lat:36.3992,lon:25.4793,region:"Europe",country:"Greece"},{name:"Kos",code:"KGS",lat:36.7934,lon:26.9173,region:"Europe",country:"Greece"},{name:"Larnaca",code:"LCA",lat:34.8751,lon:33.6249,region:"Europe",country:"Cyprus"},{name:"Malta",code:"MLA",lat:35.8574,lon:14.4775,region:"Europe",country:"Malta"},{name:"Dublin",code:"DUB",lat:53.4213,lon:-6.2701,region:"Europe",country:"Ireland"},{name:"Riga",code:"RIX",lat:56.9236,lon:23.9711,region:"Europe",country:"Latvia"},{name:"Tallinn",code:"TLL",lat:59.4133,lon:24.8328,region:"Europe",country:"Estonia"},{name:"Vilnius",code:"VNO",lat:54.6341,lon:25.2858,region:"Europe",country:"Lithuania"},{name:"Bratislava",code:"BTS",lat:48.1702,lon:17.2127,region:"Europe",country:"Slovakia"},{name:"Ljubljana",code:"LJU",lat:46.2237,lon:14.4576,region:"Europe",country:"Slovenia"},{name:"Zagreb",code:"ZAG",lat:45.7429,lon:16.0688,region:"Europe",country:"Croatia"},{name:"Split",code:"SPU",lat:43.5389,lon:16.298,region:"Europe",country:"Croatia"},{name:"Dubrovnik",code:"DBV",lat:42.5614,lon:18.2681,region:"Europe",country:"Croatia"},{name:"Zadar",code:"ZAD",lat:44.1083,lon:15.3467,region:"Europe",country:"Croatia"},{name:"Belgrade",code:"BEG",lat:44.8184,lon:20.3091,region:"Europe",country:"Serbia"},{name:"Sarajevo",code:"SJJ",lat:43.8246,lon:18.3315,region:"Europe",country:"Bosnia"},{name:"Tirana",code:"TIA",lat:41.4147,lon:19.7206,region:"Europe",country:"Albania"},{name:"Skopje",code:"SKP",lat:41.9614,lon:21.6214,region:"Europe",country:"N. Macedonia"},{name:"Pristina",code:"PRN",lat:42.5728,lon:21.0358,region:"Europe",country:"Kosovo"},{name:"Podgorica",code:"TGD",lat:42.3594,lon:19.2519,region:"Europe",country:"Montenegro"},{name:"Tbilisi",code:"TBS",lat:41.6692,lon:44.9547,region:"Europe",country:"Georgia"},{name:"Yerevan",code:"EVN",lat:40.1473,lon:44.3959,region:"Europe",country:"Armenia"},{name:"Baku",code:"GYD",lat:40.4675,lon:50.0467,region:"Europe",country:"Azerbaijan"},{name:"Chisinau",code:"KIV",lat:46.9277,lon:28.931,region:"Europe",country:"Moldova"},{name:"Moscow Sheremetyevo",code:"SVO",lat:55.9726,lon:37.4146,region:"Europe",country:"Russia"},{name:"Moscow Domodedovo",code:"DME",lat:55.4088,lon:37.9063,region:"Europe",country:"Russia"},{name:"Moscow Vnukovo",code:"VKO",lat:55.5915,lon:37.2615,region:"Europe",country:"Russia"},{name:"St Petersburg",code:"LED",lat:59.8003,lon:30.2625,region:"Europe",country:"Russia"},{name:"Yekaterinburg",code:"SVX",lat:56.8431,lon:60.8028,region:"Europe",country:"Russia"},{name:"Novosibirsk",code:"OVB",lat:54.9663,lon:82.9067,region:"Europe",country:"Russia"},{name:"Kazan",code:"KZN",lat:55.6063,lon:49.2787,region:"Europe",country:"Russia"},{name:"Sochi",code:"AER",lat:43.4499,lon:39.9566,region:"Europe",country:"Russia"},{name:"Krasnoyarsk",code:"KJA",lat:56.173,lon:92.4933,region:"Europe",country:"Russia"},{name:"Ufa",code:"UFA",lat:54.5575,lon:55.8744,region:"Europe",country:"Russia"},{name:"Samara",code:"KUF",lat:53.505,lon:50.1642,region:"Europe",country:"Russia"},{name:"Nizhny Novgorod",code:"GOJ",lat:56.2301,lon:43.784,region:"Europe",country:"Russia"},{name:"Omsk",code:"OMS",lat:54.967,lon:73.3105,region:"Europe",country:"Russia"},{name:"Dubai",code:"DXB",lat:25.2532,lon:55.3657,region:"Middle East",country:"UAE"},{name:"Dubai Al Maktoum",code:"DWC",lat:24.8963,lon:55.1611,region:"Middle East",country:"UAE"},{name:"Abu Dhabi",code:"AUH",lat:24.433,lon:54.6511,region:"Middle East",country:"UAE"},{name:"Sharjah",code:"SHJ",lat:25.3286,lon:55.5172,region:"Middle East",country:"UAE"},{name:"Doha",code:"DOH",lat:25.2731,lon:51.608,region:"Middle East",country:"Qatar"},{name:"Riyadh",code:"RUH",lat:24.9576,lon:46.6988,region:"Middle East",country:"Saudi Arabia"},{name:"Jeddah",code:"JED",lat:21.6796,lon:39.1565,region:"Middle East",country:"Saudi Arabia"},{name:"Dammam",code:"DMM",lat:26.4712,lon:49.7979,region:"Middle East",country:"Saudi Arabia"},{name:"Medina",code:"MED",lat:24.5534,lon:39.7051,region:"Middle East",country:"Saudi Arabia"},{name:"Abha",code:"AHB",lat:18.2404,lon:42.6566,region:"Middle East",country:"Saudi Arabia"},{name:"Tabuk",code:"TUU",lat:28.3654,lon:36.6189,region:"Middle East",country:"Saudi Arabia"},{name:"Bahrain",code:"BAH",lat:26.2708,lon:50.6336,region:"Middle East",country:"Bahrain"},{name:"Kuwait City",code:"KWI",lat:29.2267,lon:47.9689,region:"Middle East",country:"Kuwait"},{name:"Muscat",code:"MCT",lat:23.5933,lon:58.2844,region:"Middle East",country:"Oman"},{name:"Salalah",code:"SLL",lat:17.0387,lon:54.0913,region:"Middle East",country:"Oman"},{name:"Tehran",code:"IKA",lat:35.4161,lon:51.1522,region:"Middle East",country:"Iran"},{name:"Mashhad",code:"MHD",lat:36.2352,lon:59.641,region:"Middle East",country:"Iran"},{name:"Shiraz",code:"SYZ",lat:29.5392,lon:52.5898,region:"Middle East",country:"Iran"},{name:"Isfahan",code:"IFN",lat:32.7508,lon:51.8613,region:"Middle East",country:"Iran"},{name:"Tabriz",code:"TBZ",lat:38.1339,lon:46.235,region:"Middle East",country:"Iran"},{name:"Tel Aviv",code:"TLV",lat:32.0114,lon:34.8867,region:"Middle East",country:"Israel"},{name:"Amman",code:"AMM",lat:31.7226,lon:35.9932,region:"Middle East",country:"Jordan"},{name:"Aqaba",code:"AQJ",lat:29.6116,lon:35.0181,region:"Middle East",country:"Jordan"},{name:"Beirut",code:"BEY",lat:33.8209,lon:35.4884,region:"Middle East",country:"Lebanon"},{name:"Baghdad",code:"BGW",lat:33.2626,lon:44.2346,region:"Middle East",country:"Iraq"},{name:"Erbil",code:"EBL",lat:36.2376,lon:43.9632,region:"Middle East",country:"Iraq"},{name:"Cairo",code:"CAI",lat:30.1219,lon:31.4056,region:"Middle East",country:"Egypt"},{name:"Sharm el-Sheikh",code:"SSH",lat:27.9773,lon:34.395,region:"Middle East",country:"Egypt"},{name:"Hurghada",code:"HRG",lat:27.1783,lon:33.7994,region:"Middle East",country:"Egypt"},{name:"Luxor",code:"LXR",lat:25.671,lon:32.7066,region:"Middle East",country:"Egypt"},{name:"Alexandria",code:"HBE",lat:30.9177,lon:29.6963,region:"Middle East",country:"Egypt"},{name:"Casablanca",code:"CMN",lat:33.3675,lon:-7.5897,region:"Africa",country:"Morocco"},{name:"Marrakech",code:"RAK",lat:31.6069,lon:-8.0363,region:"Africa",country:"Morocco"},{name:"Agadir",code:"AGA",lat:30.325,lon:-9.413,region:"Africa",country:"Morocco"},{name:"Tangier",code:"TNG",lat:35.7269,lon:-5.9168,region:"Africa",country:"Morocco"},{name:"Fes",code:"FEZ",lat:33.9273,lon:-4.9779,region:"Africa",country:"Morocco"},{name:"Tunis",code:"TUN",lat:36.851,lon:10.2272,region:"Africa",country:"Tunisia"},{name:"Djerba",code:"DJE",lat:33.875,lon:10.7755,region:"Africa",country:"Tunisia"},{name:"Algiers",code:"ALG",lat:36.691,lon:3.2154,region:"Africa",country:"Algeria"},{name:"Oran",code:"ORN",lat:35.6239,lon:-.6212,region:"Africa",country:"Algeria"},{name:"Nairobi",code:"NBO",lat:-1.3192,lon:36.9275,region:"Africa",country:"Kenya"},{name:"Mombasa",code:"MBA",lat:-4.0348,lon:39.5942,region:"Africa",country:"Kenya"},{name:"Addis Ababa",code:"ADD",lat:8.9779,lon:38.7993,region:"Africa",country:"Ethiopia"},{name:"Dar es Salaam",code:"DAR",lat:-6.8781,lon:39.2026,region:"Africa",country:"Tanzania"},{name:"Kilimanjaro",code:"JRO",lat:-3.4294,lon:37.0745,region:"Africa",country:"Tanzania"},{name:"Zanzibar",code:"ZNZ",lat:-6.222,lon:39.2249,region:"Africa",country:"Tanzania"},{name:"Entebbe",code:"EBB",lat:.0424,lon:32.4435,region:"Africa",country:"Uganda"},{name:"Kigali",code:"KGL",lat:-1.9686,lon:30.1395,region:"Africa",country:"Rwanda"},{name:"Djibouti",code:"JIB",lat:11.5473,lon:43.1595,region:"Africa",country:"Djibouti"},{name:"Johannesburg",code:"JNB",lat:-26.1367,lon:28.2411,region:"Africa",country:"South Africa"},{name:"Cape Town",code:"CPT",lat:-33.9648,lon:18.6017,region:"Africa",country:"South Africa"},{name:"Durban",code:"DUR",lat:-29.6144,lon:31.1197,region:"Africa",country:"South Africa"},{name:"Port Elizabeth",code:"PLZ",lat:-33.9849,lon:25.6173,region:"Africa",country:"South Africa"},{name:"Harare",code:"HRE",lat:-17.9318,lon:31.0928,region:"Africa",country:"Zimbabwe"},{name:"Victoria Falls",code:"VFA",lat:-18.0959,lon:25.839,region:"Africa",country:"Zimbabwe"},{name:"Lusaka",code:"LUN",lat:-15.3308,lon:28.4526,region:"Africa",country:"Zambia"},{name:"Windhoek",code:"WDH",lat:-22.4799,lon:17.4709,region:"Africa",country:"Namibia"},{name:"Gaborone",code:"GBE",lat:-24.5552,lon:25.9182,region:"Africa",country:"Botswana"},{name:"Maputo",code:"MPM",lat:-25.9208,lon:32.5726,region:"Africa",country:"Mozambique"},{name:"Lilongwe",code:"LLW",lat:-13.7894,lon:33.781,region:"Africa",country:"Malawi"},{name:"Antananarivo",code:"TNR",lat:-18.7969,lon:47.4788,region:"Africa",country:"Madagascar"},{name:"Mauritius",code:"MRU",lat:-20.4302,lon:57.6836,region:"Africa",country:"Mauritius"},{name:"Réunion",code:"RUN",lat:-20.8871,lon:55.5103,region:"Africa",country:"Réunion"},{name:"Seychelles",code:"SEZ",lat:-4.6743,lon:55.5218,region:"Africa",country:"Seychelles"},{name:"Lagos",code:"LOS",lat:6.5774,lon:3.3214,region:"Africa",country:"Nigeria"},{name:"Abuja",code:"ABV",lat:9.0068,lon:7.2632,region:"Africa",country:"Nigeria"},{name:"Port Harcourt",code:"PHC",lat:5.0155,lon:6.9496,region:"Africa",country:"Nigeria"},{name:"Kano",code:"KAN",lat:12.0476,lon:8.5246,region:"Africa",country:"Nigeria"},{name:"Accra",code:"ACC",lat:5.6052,lon:-.1668,region:"Africa",country:"Ghana"},{name:"Abidjan",code:"ABJ",lat:5.2613,lon:-3.9262,region:"Africa",country:"Côte d'Ivoire"},{name:"Dakar",code:"DKR",lat:14.6705,lon:-17.4902,region:"Africa",country:"Senegal"},{name:"Bamako",code:"BKO",lat:12.5335,lon:-7.9499,region:"Africa",country:"Mali"},{name:"Ouagadougou",code:"OUA",lat:12.3532,lon:-1.5124,region:"Africa",country:"Burkina Faso"},{name:"Niamey",code:"NIM",lat:13.4815,lon:2.1836,region:"Africa",country:"Niger"},{name:"Conakry",code:"CKY",lat:9.5769,lon:-13.612,region:"Africa",country:"Guinea"},{name:"Freetown",code:"FNA",lat:8.6164,lon:-13.195,region:"Africa",country:"Sierra Leone"},{name:"Monrovia",code:"ROB",lat:6.2328,lon:-10.3623,region:"Africa",country:"Liberia"},{name:"Banjul",code:"BJL",lat:13.338,lon:-16.6522,region:"Africa",country:"Gambia"},{name:"N'Djamena",code:"NDJ",lat:12.1337,lon:15.034,region:"Africa",country:"Chad"},{name:"Kinshasa",code:"FIH",lat:-4.3858,lon:15.4446,region:"Africa",country:"DR Congo"},{name:"Brazzaville",code:"BZV",lat:-4.2517,lon:15.2531,region:"Africa",country:"Congo"},{name:"Douala",code:"DLA",lat:4.0061,lon:9.7195,region:"Africa",country:"Cameroon"},{name:"Libreville",code:"LBV",lat:.4586,lon:9.4122,region:"Africa",country:"Gabon"},{name:"Luanda",code:"LAD",lat:-8.8583,lon:13.2312,region:"Africa",country:"Angola"},{name:"Juba",code:"JUB",lat:4.872,lon:31.6011,region:"Africa",country:"South Sudan"},{name:"Tokyo Haneda",code:"HND",lat:35.5493,lon:139.7798,region:"Asia",country:"Japan"},{name:"Tokyo Narita",code:"NRT",lat:35.7653,lon:140.3856,region:"Asia",country:"Japan"},{name:"Osaka Kansai",code:"KIX",lat:34.4347,lon:135.244,region:"Asia",country:"Japan"},{name:"Osaka Itami",code:"ITM",lat:34.7855,lon:135.4381,region:"Asia",country:"Japan"},{name:"Fukuoka",code:"FUK",lat:33.5858,lon:130.4511,region:"Asia",country:"Japan"},{name:"Sapporo",code:"CTS",lat:42.7752,lon:141.6922,region:"Asia",country:"Japan"},{name:"Nagoya",code:"NGO",lat:34.8583,lon:136.805,region:"Asia",country:"Japan"},{name:"Okinawa",code:"OKA",lat:26.1958,lon:127.6461,region:"Asia",country:"Japan"},{name:"Kagoshima",code:"KOJ",lat:31.8034,lon:130.7194,region:"Asia",country:"Japan"},{name:"Sendai",code:"SDJ",lat:38.1397,lon:140.917,region:"Asia",country:"Japan"},{name:"Hiroshima",code:"HIJ",lat:34.4361,lon:132.9194,region:"Asia",country:"Japan"},{name:"Kumamoto",code:"KMJ",lat:32.8373,lon:130.8553,region:"Asia",country:"Japan"},{name:"Nagasaki",code:"NGS",lat:32.9169,lon:129.9139,region:"Asia",country:"Japan"},{name:"Miyazaki",code:"KMI",lat:31.8772,lon:131.4486,region:"Asia",country:"Japan"},{name:"Seoul Incheon",code:"ICN",lat:37.4602,lon:126.4407,region:"Asia",country:"South Korea"},{name:"Seoul Gimpo",code:"GMP",lat:37.5583,lon:126.7906,region:"Asia",country:"South Korea"},{name:"Busan",code:"PUS",lat:35.1795,lon:128.9382,region:"Asia",country:"South Korea"},{name:"Jeju",code:"CJU",lat:33.5113,lon:126.493,region:"Asia",country:"South Korea"},{name:"Daegu",code:"TAE",lat:35.8941,lon:128.6586,region:"Asia",country:"South Korea"},{name:"Taipei Taoyuan",code:"TPE",lat:25.0777,lon:121.2328,region:"Asia",country:"Taiwan"},{name:"Taipei Songshan",code:"TSA",lat:25.0694,lon:121.5522,region:"Asia",country:"Taiwan"},{name:"Kaohsiung",code:"KHH",lat:22.5771,lon:120.3499,region:"Asia",country:"Taiwan"},{name:"Hong Kong",code:"HKG",lat:22.308,lon:113.9185,region:"Asia",country:"Hong Kong"},{name:"Macau",code:"MFM",lat:22.1496,lon:113.5916,region:"Asia",country:"Macau"},{name:"Singapore",code:"SIN",lat:1.3644,lon:103.9915,region:"Asia",country:"Singapore"},{name:"Bangkok Suvarnabhumi",code:"BKK",lat:13.6811,lon:100.7472,region:"Asia",country:"Thailand"},{name:"Bangkok Don Mueang",code:"DMK",lat:13.9126,lon:100.6067,region:"Asia",country:"Thailand"},{name:"Phuket",code:"HKT",lat:8.1132,lon:98.3161,region:"Asia",country:"Thailand"},{name:"Chiang Mai",code:"CNX",lat:18.7668,lon:98.9628,region:"Asia",country:"Thailand"},{name:"Ko Samui",code:"USM",lat:9.5478,lon:100.063,region:"Asia",country:"Thailand"},{name:"Kuala Lumpur",code:"KUL",lat:2.7456,lon:101.7099,region:"Asia",country:"Malaysia"},{name:"Penang",code:"PEN",lat:5.2972,lon:100.2769,region:"Asia",country:"Malaysia"},{name:"Kota Kinabalu",code:"BKI",lat:5.9372,lon:116.0508,region:"Asia",country:"Malaysia"},{name:"Kuching",code:"KCH",lat:1.4847,lon:110.3469,region:"Asia",country:"Malaysia"},{name:"Johor Bahru",code:"JHB",lat:1.6413,lon:103.6698,region:"Asia",country:"Malaysia"},{name:"Langkawi",code:"LGK",lat:6.3297,lon:99.7286,region:"Asia",country:"Malaysia"},{name:"Jakarta",code:"CGK",lat:-6.1275,lon:106.6558,region:"Asia",country:"Indonesia"},{name:"Bali",code:"DPS",lat:-8.7481,lon:115.167,region:"Asia",country:"Indonesia"},{name:"Surabaya",code:"SUB",lat:-7.3798,lon:112.7869,region:"Asia",country:"Indonesia"},{name:"Medan",code:"KNO",lat:3.6422,lon:98.8853,region:"Asia",country:"Indonesia"},{name:"Makassar",code:"UPG",lat:-5.0616,lon:119.554,region:"Asia",country:"Indonesia"},{name:"Balikpapan",code:"BPN",lat:1.2683,lon:116.8944,region:"Asia",country:"Indonesia"},{name:"Yogyakarta",code:"JOG",lat:-7.7882,lon:110.4317,region:"Asia",country:"Indonesia"},{name:"Palembang",code:"PLM",lat:-2.8983,lon:104.6999,region:"Asia",country:"Indonesia"},{name:"Manado",code:"MDC",lat:1.5495,lon:124.926,region:"Asia",country:"Indonesia"},{name:"Batam",code:"BTH",lat:1.1213,lon:104.1192,region:"Asia",country:"Indonesia"},{name:"Manila",code:"MNL",lat:14.5086,lon:121.0197,region:"Asia",country:"Philippines"},{name:"Cebu",code:"CEB",lat:10.3075,lon:123.9789,region:"Asia",country:"Philippines"},{name:"Davao",code:"DVO",lat:7.1255,lon:125.6458,region:"Asia",country:"Philippines"},{name:"Iloilo",code:"ILO",lat:10.833,lon:122.4936,region:"Asia",country:"Philippines"},{name:"Ho Chi Minh City",code:"SGN",lat:10.8188,lon:106.652,region:"Asia",country:"Vietnam"},{name:"Hanoi",code:"HAN",lat:21.2212,lon:105.8072,region:"Asia",country:"Vietnam"},{name:"Da Nang",code:"DAD",lat:16.0439,lon:108.1992,region:"Asia",country:"Vietnam"},{name:"Nha Trang",code:"CXR",lat:11.9983,lon:109.2194,region:"Asia",country:"Vietnam"},{name:"Phnom Penh",code:"PNH",lat:11.5466,lon:104.844,region:"Asia",country:"Cambodia"},{name:"Siem Reap",code:"REP",lat:13.4107,lon:103.8127,region:"Asia",country:"Cambodia"},{name:"Yangon",code:"RGN",lat:16.9073,lon:96.1332,region:"Asia",country:"Myanmar"},{name:"Vientiane",code:"VTE",lat:17.9883,lon:102.5633,region:"Asia",country:"Laos"},{name:"Phu Quoc",code:"PQC",lat:10.227,lon:103.967,region:"Asia",country:"Vietnam"},{name:"Delhi",code:"DEL",lat:28.5562,lon:77.1,region:"Asia",country:"India"},{name:"Mumbai",code:"BOM",lat:19.0896,lon:72.8656,region:"Asia",country:"India"},{name:"Bangalore",code:"BLR",lat:13.1986,lon:77.7066,region:"Asia",country:"India"},{name:"Hyderabad",code:"HYD",lat:17.2313,lon:78.4298,region:"Asia",country:"India"},{name:"Chennai",code:"MAA",lat:12.99,lon:80.1693,region:"Asia",country:"India"},{name:"Kolkata",code:"CCU",lat:22.6547,lon:88.4467,region:"Asia",country:"India"},{name:"Kochi",code:"COK",lat:9.9952,lon:76.2699,region:"Asia",country:"India"},{name:"Ahmedabad",code:"AMD",lat:23.0772,lon:72.6347,region:"Asia",country:"India"},{name:"Pune",code:"PNQ",lat:18.5822,lon:73.9197,region:"Asia",country:"India"},{name:"Goa",code:"GOI",lat:15.3808,lon:73.8314,region:"Asia",country:"India"},{name:"Jaipur",code:"JAI",lat:26.8242,lon:75.8122,region:"Asia",country:"India"},{name:"Lucknow",code:"LKO",lat:26.7606,lon:80.8893,region:"Asia",country:"India"},{name:"Amritsar",code:"ATQ",lat:31.7096,lon:74.7973,region:"Asia",country:"India"},{name:"Bhubaneswar",code:"BBI",lat:20.2444,lon:85.8178,region:"Asia",country:"India"},{name:"Kozhikode",code:"CCJ",lat:11.1368,lon:75.9553,region:"Asia",country:"India"},{name:"Thiruvananthapuram",code:"TRV",lat:8.4821,lon:76.9201,region:"Asia",country:"India"},{name:"Nagpur",code:"NAG",lat:21.0922,lon:79.0472,region:"Asia",country:"India"},{name:"Coimbatore",code:"CJB",lat:11.03,lon:77.0434,region:"Asia",country:"India"},{name:"Varanasi",code:"VNS",lat:25.4524,lon:82.8593,region:"Asia",country:"India"},{name:"Guwahati",code:"GAU",lat:26.1061,lon:91.5859,region:"Asia",country:"India"},{name:"Patna",code:"PAT",lat:25.5913,lon:85.0879,region:"Asia",country:"India"},{name:"Indore",code:"IDR",lat:22.7218,lon:75.8011,region:"Asia",country:"India"},{name:"Chandigarh",code:"IXC",lat:30.6735,lon:76.7885,region:"Asia",country:"India"},{name:"Visakhapatnam",code:"VTZ",lat:17.7212,lon:83.2245,region:"Asia",country:"India"},{name:"Tiruchirappalli",code:"TRZ",lat:10.7654,lon:78.7097,region:"Asia",country:"India"},{name:"Srinagar",code:"SXR",lat:33.9871,lon:74.7742,region:"Asia",country:"India"},{name:"Karachi",code:"KHI",lat:24.9065,lon:67.1608,region:"Asia",country:"Pakistan"},{name:"Lahore",code:"LHE",lat:31.5216,lon:74.4036,region:"Asia",country:"Pakistan"},{name:"Islamabad",code:"ISB",lat:33.6169,lon:73.0993,region:"Asia",country:"Pakistan"},{name:"Peshawar",code:"PEW",lat:33.9939,lon:71.5146,region:"Asia",country:"Pakistan"},{name:"Multan",code:"MUX",lat:30.2032,lon:71.4192,region:"Asia",country:"Pakistan"},{name:"Dhaka",code:"DAC",lat:23.8433,lon:90.3978,region:"Asia",country:"Bangladesh"},{name:"Chittagong",code:"CGP",lat:22.2496,lon:91.8133,region:"Asia",country:"Bangladesh"},{name:"Colombo",code:"CMB",lat:7.1808,lon:79.8841,region:"Asia",country:"Sri Lanka"},{name:"Kathmandu",code:"KTM",lat:27.6966,lon:85.3591,region:"Asia",country:"Nepal"},{name:"Malé",code:"MLE",lat:4.1918,lon:73.529,region:"Asia",country:"Maldives"},{name:"Paro",code:"PBH",lat:27.4033,lon:89.4242,region:"Asia",country:"Bhutan"},{name:"Almaty",code:"ALA",lat:43.3521,lon:77.0405,region:"Asia",country:"Kazakhstan"},{name:"Astana",code:"TSE",lat:51.0222,lon:71.4669,region:"Asia",country:"Kazakhstan"},{name:"Tashkent",code:"TAS",lat:41.2579,lon:69.2812,region:"Asia",country:"Uzbekistan"},{name:"Samarkand",code:"SKD",lat:39.7005,lon:66.9838,region:"Asia",country:"Uzbekistan"},{name:"Bishkek",code:"FRU",lat:43.0612,lon:74.4776,region:"Asia",country:"Kyrgyzstan"},{name:"Dushanbe",code:"DYU",lat:38.5433,lon:68.775,region:"Asia",country:"Tajikistan"},{name:"Ashgabat",code:"ASB",lat:37.9868,lon:58.361,region:"Asia",country:"Turkmenistan"},{name:"Ulaanbaatar",code:"ULN",lat:47.8431,lon:106.7664,region:"Asia",country:"Mongolia"},{name:"Vladivostok",code:"VVO",lat:43.399,lon:132.1478,region:"Asia",country:"Russia"},{name:"Khabarovsk",code:"KHV",lat:48.528,lon:135.1883,region:"Asia",country:"Russia"},{name:"Irkutsk",code:"IKT",lat:52.268,lon:104.3889,region:"Asia",country:"Russia"},{name:"Yuzhno-Sakhalinsk",code:"UUS",lat:46.8887,lon:142.7183,region:"Asia",country:"Russia"},{name:"Sydney",code:"SYD",lat:-33.9399,lon:151.1753,region:"Pacific",country:"Australia"},{name:"Melbourne",code:"MEL",lat:-37.6733,lon:144.843,region:"Pacific",country:"Australia"},{name:"Brisbane",code:"BNE",lat:-27.3842,lon:153.1175,region:"Pacific",country:"Australia"},{name:"Perth",code:"PER",lat:-31.9403,lon:115.9669,region:"Pacific",country:"Australia"},{name:"Adelaide",code:"ADL",lat:-34.945,lon:138.5308,region:"Pacific",country:"Australia"},{name:"Gold Coast",code:"OOL",lat:-28.1644,lon:153.5047,region:"Pacific",country:"Australia"},{name:"Cairns",code:"CNS",lat:-16.8858,lon:145.7551,region:"Pacific",country:"Australia"},{name:"Sunshine Coast",code:"MCY",lat:-26.6033,lon:153.0891,region:"Pacific",country:"Australia"},{name:"Canberra",code:"CBR",lat:-35.3069,lon:149.195,region:"Pacific",country:"Australia"},{name:"Darwin",code:"DRW",lat:-12.4147,lon:130.8765,region:"Pacific",country:"Australia"},{name:"Hobart",code:"HBA",lat:-42.8361,lon:147.5078,region:"Pacific",country:"Australia"},{name:"Launceston",code:"LST",lat:-41.5453,lon:147.2143,region:"Pacific",country:"Australia"},{name:"Townsville",code:"TSV",lat:-19.2525,lon:146.7653,region:"Pacific",country:"Australia"},{name:"Alice Springs",code:"ASP",lat:-23.8067,lon:133.9022,region:"Pacific",country:"Australia"},{name:"Auckland",code:"AKL",lat:-37.0082,lon:174.785,region:"Pacific",country:"New Zealand"},{name:"Christchurch",code:"CHC",lat:-43.4894,lon:172.5322,region:"Pacific",country:"New Zealand"},{name:"Wellington",code:"WLG",lat:-41.3272,lon:174.805,region:"Pacific",country:"New Zealand"},{name:"Queenstown",code:"ZQN",lat:-45.0211,lon:168.7392,region:"Pacific",country:"New Zealand"},{name:"Dunedin",code:"DUD",lat:-45.9281,lon:170.1983,region:"Pacific",country:"New Zealand"},{name:"Nadi",code:"NAN",lat:-17.7554,lon:177.443,region:"Pacific",country:"Fiji"},{name:"Papeete",code:"PPT",lat:-17.5534,lon:-149.6067,region:"Pacific",country:"French Polynesia"},{name:"Port Moresby",code:"POM",lat:-9.4433,lon:147.22,region:"Pacific",country:"Papua New Guinea"},{name:"Guam",code:"GUM",lat:13.4834,lon:144.7961,region:"Pacific",country:"Guam (US)"},{name:"Honiara",code:"HIR",lat:-9.428,lon:160.0547,region:"Pacific",country:"Solomon Islands"},{name:"Nouméa",code:"NOU",lat:-22.0146,lon:166.2129,region:"Pacific",country:"New Caledonia"},{name:"Apia",code:"APW",lat:-13.83,lon:-172.0083,region:"Pacific",country:"Samoa"}],wg={};for(const i of ft)wg[i.code]=i;window._findCityByCode=i=>wg[i]||null;let jo=null;const Vn=document.getElementById("scene-transition"),Tp=document.getElementById("scene-trans-code"),wp=document.getElementById("scene-trans-name");async function vT(i){jo&&jo.code===i.code||(jo=i,Tp&&(Tp.textContent=i.code),wp&&(wp.textContent=i.name),Vn&&(Vn.style.transition="opacity 0.28s ease",Vn.style.opacity="1",Vn.style.pointerEvents="all",Vn.classList.add("loading")),await new Promise(e=>setTimeout(e,320)),or(),yr(),as&&wa(),un&&(ss(Ot),$e&&$e.clearHighlight(),Ta(),un=null),$e&&$e.clearAll(Ot),b1(Ot),E1(Ot),Hm(i.lat,i.lon),$e&&$e.updateUserLocation(i.lat,i.lon),eg(i.name,i.code),ku(0),gt.enabled=!1,Lt.position.set(8,9,12),gt.target.set(0,1,0),gt.update(),gt.enabled=!0,await mm(i.lat,i.lon),Vn&&(Vn.classList.remove("loading"),Vn.style.transition="opacity 0.9s ease",Vn.style.opacity="0",Vn.style.pointerEvents=""),ym(Ot,i.lat,i.lon).then(()=>{const e=Lh();e&&ku(e.airports.length)}))}function Cg(i,e,t,n){const r=Math.PI/180,a=(t-i)*r,o=(n-e)*r,l=Math.sin(a/2)**2+Math.cos(i*r)*Math.cos(t*r)*Math.sin(o/2)**2;return 6371*2*Math.atan2(Math.sqrt(l),Math.sqrt(1-l))}function ST(i,e,t,n,s=48){const r=Math.PI/180,a=f=>f*180/Math.PI,o=i*r,l=e*r,c=t*r,u=n*r,d=2*Math.asin(Math.sqrt(Math.sin((c-o)/2)**2+Math.cos(o)*Math.cos(c)*Math.sin((u-l)/2)**2));if(d<1e-4)return[];const h=[];for(let f=0;f<=s;f++){const p=f/s,_=Math.sin((1-p)*d)/Math.sin(d),m=Math.sin(p*d)/Math.sin(d),g=_*Math.cos(o)*Math.cos(l)+m*Math.cos(c)*Math.cos(u),S=_*Math.cos(o)*Math.sin(l)+m*Math.cos(c)*Math.sin(u),v=_*Math.sin(o)+m*Math.sin(c);h.push({lat:a(Math.atan2(v,Math.sqrt(g*g+S*S))),lon:a(Math.atan2(S,g))})}return h}class MT{constructor(e,t){this.canvas=e,this.ctx=e.getContext("2d"),this.onSelect=t,this.onHover=()=>{},this.focusedIdx=-1,this._pulsePhase=0,this._nearbyIdxs=[],this.viewLon=0,this.viewLat=20,this._tLon=0,this._tLat=20,this.activeRegion="All",this.searchQuery="",this.selectedIdx=-1,this.hoveredIdx=-1,this._dragging=!1,this._lastX=0,this._lastY=0,this._autoRotate=!0,this._paused=!0,this._raf=null,this.cx=0,this.cy=0,this.R=0,this._baseR=0,this._zoom=1,this._targetZoom=1,this._landRings=null,this._landGrid=null,this._coastGrid=null,this._landW=0,this._landH=0,this._landOC=null,this._landCacheLon=NaN,this._landCacheLat=NaN,this._landCacheR=NaN,this._dotSizes=null,this._sinLat=null,this._cosLat=null,this._sinLon=null,this._cosLon=null,this._bindEvents(),this._fetchLand(),this._computeDotSizes()}_resize(){const e=Math.min(window.devicePixelRatio||1,2),t=this.canvas.clientWidth,n=this.canvas.clientHeight;!t||!n||(this.canvas.width=Math.round(t*e),this.canvas.height=Math.round(n*e),this.ctx.setTransform(e,0,0,e,0,0),this.cx=t/2,this.cy=n/2,this._baseR=Math.min(t,n)*.48,this.R=this._baseR*this._zoom)}_proj(e,t){const n=Math.PI/180,s=e*n,r=this.viewLat*n,a=(t-this.viewLon)*n,o=Math.sin(r)*Math.sin(s)+Math.cos(r)*Math.cos(s)*Math.cos(a);return{x:this.cx+this.R*Math.cos(s)*Math.sin(a),y:this.cy-this.R*(Math.cos(r)*Math.sin(s)-Math.sin(r)*Math.cos(s)*Math.cos(a)),visible:o>=0,depth:o}}_draw(){const e=this.ctx,{cx:t,cy:n,R:s}=this;e.clearRect(0,0,this.canvas.clientWidth,this.canvas.clientHeight);const r=e.createRadialGradient(t,n,s*.92,t,n,s*1.15);r.addColorStop(0,"rgba(40,100,180,0)"),r.addColorStop(.5,"rgba(40,100,180,0.04)"),r.addColorStop(1,"rgba(40,100,180,0)"),e.beginPath(),e.arc(t,n,s*1.15,0,Math.PI*2),e.fillStyle=r,e.fill();const a=e.createRadialGradient(t-s*.3,n-s*.3,0,t,n,s);a.addColorStop(0,"#0a1a35"),a.addColorStop(.4,"#071428"),a.addColorStop(.8,"#040d1a"),a.addColorStop(1,"#020810"),e.beginPath(),e.arc(t,n,s,0,Math.PI*2),e.fillStyle=a,e.fill(),e.save(),e.beginPath(),e.arc(t,n,s,0,Math.PI*2),e.clip(),this._drawLand(),this._drawGrid(),this.focusedIdx>=0&&this._drawArcs(),this._drawDots(),this.focusedIdx>=0&&this._drawPulse(e),e.restore();const o=e.createRadialGradient(t-s*.35,n-s*.35,0,t-s*.35,n-s*.35,s*.5);o.addColorStop(0,"rgba(150,200,255,0.04)"),o.addColorStop(1,"rgba(150,200,255,0)"),e.beginPath(),e.arc(t,n,s,0,Math.PI*2),e.fillStyle=o,e.fill(),e.beginPath(),e.arc(t,n,s,0,Math.PI*2),e.strokeStyle="rgba(196,160,88,0.12)",e.lineWidth=1,e.stroke(),e.beginPath(),e.arc(t,n,s+2,0,Math.PI*2),e.strokeStyle="rgba(196,160,88,0.06)",e.lineWidth=.5,e.stroke()}_drawGrid(){const e=this.ctx;e.fillStyle="rgba(60,120,200,0.14)";for(let t=-180;t<180;t+=5){const n=this._proj(0,t);n.visible&&e.fillRect(n.x-.5,n.y-.5,1,1)}e.fillStyle="rgba(60,120,200,0.07)";for(let t=-60;t<=60;t+=30)if(t!==0)for(let n=-180;n<180;n+=8){const s=this._proj(t,n);s.visible&&e.fillRect(s.x-.3,s.y-.3,.6,.6)}e.fillStyle="rgba(60,120,200,0.05)";for(let t=-180;t<180;t+=30)for(let n=-80;n<=80;n+=8){const s=this._proj(n,t);s.visible&&e.fillRect(s.x-.3,s.y-.3,.6,.6)}}_drawArcs(){if(this._nearbyIdxs.length===0)return;const e=this.ctx,t=ft[this.focusedIdx];for(let n=0;n<this._nearbyIdxs.length;n++){const s=ft[this._nearbyIdxs[n]],a=ST(t.lat,t.lon,s.lat,s.lon,60).map(({lat:c,lon:u})=>this._proj(c,u)),o=n===0?.35:n===1?.22:n===2?.14:.08;for(let c=0;c<a.length-1;c++){const u=a[c],d=a[c+1];if(!u.visible||!d.visible)continue;const h=c/a.length,f=Math.sin(h*Math.PI),p=o*f*Math.min(u.depth,d.depth);p<.01||(e.beginPath(),e.moveTo(u.x,u.y),e.lineTo(d.x,d.y),e.strokeStyle=`rgba(196,160,88,${p})`,e.lineWidth=n===0?1.2:.7,e.stroke())}const l=this._proj(s.lat,s.lon);l.visible&&(e.beginPath(),e.arc(l.x,l.y,2.5,0,Math.PI*2),e.fillStyle=`rgba(196,160,88,${o*1.5*l.depth})`,e.fill())}}_drawPulse(e){this._pulsePhase+=.035;const t=ft[this.focusedIdx],n=this._proj(t.lat,t.lon);if(!n.visible)return;const s=this._pulsePhase;for(let o=0;o<2;o++){const c=(s*1.5+o*Math.PI)%(Math.PI*2)/(Math.PI*2),u=4+c*18,d=(1-c)*.4;d<.02||(e.beginPath(),e.arc(n.x,n.y,u,0,Math.PI*2),e.strokeStyle=`rgba(196,160,88,${d})`,e.lineWidth=.8,e.stroke())}const r=6,a=.3+Math.sin(s*2)*.1;e.strokeStyle=`rgba(196,160,88,${a})`,e.lineWidth=.5,e.beginPath(),e.moveTo(n.x-r,n.y),e.lineTo(n.x-3,n.y),e.stroke(),e.beginPath(),e.moveTo(n.x+3,n.y),e.lineTo(n.x+r,n.y),e.stroke(),e.beginPath(),e.moveTo(n.x,n.y-r),e.lineTo(n.x,n.y-3),e.stroke(),e.beginPath(),e.moveTo(n.x,n.y+3),e.lineTo(n.x,n.y+r),e.stroke(),e.beginPath(),e.arc(n.x,n.y,3,0,Math.PI*2),e.fillStyle="rgba(255,215,80,0.9)",e.fill(),e.beginPath(),e.arc(n.x,n.y,1.5,0,Math.PI*2),e.fillStyle="rgba(255,240,200,0.95)",e.fill()}_drawDots(){const e=this.ctx,t=this.searchQuery,n=this._zoom||1,s=new Array(ft.length);for(let r=0;r<ft.length;r++)s[r]=this._proj(ft[r].lat,ft[r].lon);for(let r=0;r<3;r++)for(let a=0;a<ft.length;a++){const o=s[a];if(!o.visible)continue;const l=ft[a],c=a===this.selectedIdx,u=a===this.hoveredIdx;if(r<2&&(c||u)||r===2&&!c&&!u)continue;const d=(this.activeRegion==="All"||l.region===this.activeRegion)&&(!t||l.name.toLowerCase().includes(t)||l.code.toLowerCase().startsWith(t));if(r===0&&d||r===1&&!d)continue;const h=Math.max(.2,o.depth);if(c){const f=e.createRadialGradient(o.x,o.y,0,o.x,o.y,14);f.addColorStop(0,"rgba(196,160,88,0.7)"),f.addColorStop(1,"rgba(196,160,88,0)"),e.beginPath(),e.arc(o.x,o.y,14,0,Math.PI*2),e.fillStyle=f,e.fill(),e.beginPath(),e.arc(o.x,o.y,4,0,Math.PI*2),e.fillStyle=`rgba(255,215,80,${h})`,e.fill(),e.beginPath(),e.arc(o.x,o.y,5.5,0,Math.PI*2),e.strokeStyle=`rgba(255,235,170,${.6*h})`,e.lineWidth=.8,e.stroke(),this._label(e,o,`${l.code}  ${l.name}`,"rgba(255,210,80,0.95)",!0)}else if(u){const f=e.createRadialGradient(o.x,o.y,0,o.x,o.y,10);f.addColorStop(0,"rgba(90,180,255,0.6)"),f.addColorStop(1,"rgba(90,180,255,0)"),e.beginPath(),e.arc(o.x,o.y,10,0,Math.PI*2),e.fillStyle=f,e.fill(),e.beginPath(),e.arc(o.x,o.y,3,0,Math.PI*2),e.fillStyle=`rgba(150,220,255,${h})`,e.fill(),e.beginPath(),e.arc(o.x,o.y,4.5,0,Math.PI*2),e.strokeStyle=`rgba(150,220,255,${.4*h})`,e.lineWidth=.7,e.stroke(),this._label(e,o,`${l.code}  ${l.name}`,"rgba(150,220,255,0.9)",!1)}else if(d){const f=this._dotSizes?this._dotSizes[a]:0;if(f===2){const p=7+n*1.5,_=e.createRadialGradient(o.x,o.y,0,o.x,o.y,p);_.addColorStop(0,`rgba(255,200,60,${.35*h})`),_.addColorStop(1,"rgba(255,200,60,0)"),e.beginPath(),e.arc(o.x,o.y,p,0,Math.PI*2),e.fillStyle=_,e.fill();const m=3+n*.4;e.beginPath(),e.arc(o.x,o.y,m,0,Math.PI*2),e.fillStyle=`rgba(255,220,100,${.75*h+.2})`,e.fill(),e.beginPath(),e.arc(o.x,o.y,m+1.2,0,Math.PI*2),e.strokeStyle=`rgba(255,235,170,${.45*h})`,e.lineWidth=.6,e.stroke(),n>1.2&&this._label(e,o,l.code,`rgba(255,220,120,${.7*h})`,!1)}else if(f===1){const p=2.2+n*.3,_=4.5+n,m=e.createRadialGradient(o.x,o.y,0,o.x,o.y,_);m.addColorStop(0,`rgba(196,170,88,${.18*h})`),m.addColorStop(1,"rgba(196,170,88,0)"),e.beginPath(),e.arc(o.x,o.y,_,0,Math.PI*2),e.fillStyle=m,e.fill(),e.beginPath(),e.arc(o.x,o.y,p,0,Math.PI*2),e.fillStyle=`rgba(220,190,100,${.55*h+.2})`,e.fill(),e.beginPath(),e.arc(o.x,o.y,p+1,0,Math.PI*2),e.strokeStyle=`rgba(220,200,130,${.3*h})`,e.lineWidth=.5,e.stroke(),n>1.5&&this._label(e,o,l.code,`rgba(220,200,130,${.55*h})`,!1)}else{const p=1.4+n*.2;e.beginPath(),e.arc(o.x,o.y,p,0,Math.PI*2),e.fillStyle=`rgba(210,185,120,${.4*h+.12})`,e.fill(),e.beginPath(),e.arc(o.x,o.y,p+.7,0,Math.PI*2),e.strokeStyle=`rgba(210,185,120,${.18*h})`,e.lineWidth=.4,e.stroke()}}else e.beginPath(),e.arc(o.x,o.y,.8,0,Math.PI*2),e.fillStyle=`rgba(30,50,80,${.4*h})`,e.fill()}}_label(e,t,n,s,r){e.font=`${r?"600":"400"} 9px Inter,system-ui,sans-serif`;const a=e.measureText(n).width;let o=t.x+10;o+a+10>this.cx+this.R&&(o=t.x-a-14);const l=t.y-4,c=4,u=3,d=o-c,h=l-12,f=a+c*2+2,p=16;e.beginPath(),e.roundRect?e.roundRect(d,h,f,p,u):e.rect(d,h,f,p),e.fillStyle="rgba(6,12,24,0.85)",e.fill(),e.strokeStyle="rgba(196,160,88,0.15)",e.lineWidth=.5,e.stroke(),e.fillStyle=s,e.fillText(n,o,l)}async _fetchLand(){try{const t=await(await fetch("https://cdn.jsdelivr.net/npm/world-atlas@2/land-110m.json")).json();this._landRings=this._decodeTopo(t);for(const h of this._landRings){let f=90,p=-90,_=180,m=-180;for(const{lat:g,lon:S}of h)g<f&&(f=g),g>p&&(p=g),S<_&&(_=S),S>m&&(m=S);h._bb=[f,p,_,m]}const n=720,s=342,r=new Uint8Array(n*s),a=new Uint8Array(n*s);for(let h=0;h<s;h++){const f=-85+h*.5;for(let p=0;p<n;p++){const _=-180+p*.5;this._pointInPoly(f,_)&&(r[h*n+p]=1)}}for(let h=0;h<s;h++)for(let f=0;f<n;f++){const p=h*n+f;if(!r[p])continue;const _=h>0?r[(h-1)*n+f]:0,m=h<s-1?r[(h+1)*n+f]:0,g=r[h*n+(f+1)%n],S=f>0?r[h*n+f-1]:r[h*n+n-1];(!_||!m||!g||!S)&&(a[p]=1)}this._landGrid=r,this._coastGrid=a,this._landW=n,this._landH=s;const o=new Float32Array(s),l=new Float32Array(s),c=new Float32Array(n),u=new Float32Array(n),d=Math.PI/180;for(let h=0;h<s;h++){const f=(-85+h*.5)*d;o[h]=Math.sin(f),l[h]=Math.cos(f)}for(let h=0;h<n;h++){const f=(-180+h*.5)*d;c[h]=Math.sin(f),u[h]=Math.cos(f)}this._sinLat=o,this._cosLat=l,this._sinLon=c,this._cosLon=u,this._landRings=null}catch(e){console.warn("[GlobeView] land fetch failed:",e.message)}}_decodeTopo(e){const{scale:t,translate:n}=e.transform,s=e.arcs.map(o=>{let l=0,c=0;return o.map(([u,d])=>(l+=u,c+=d,[l*t[0]+n[0],c*t[1]+n[1]]))}),r=[],a=o=>{if(o.type==="Polygon")for(const l of o.arcs){const c=[];for(const u of l){const d=u<0?s[~u].slice().reverse():s[u];for(const[h,f]of d)c.push({lat:f,lon:h})}r.push(c)}else if(o.type==="MultiPolygon")for(const l of o.arcs)for(const c of l){const u=[];for(const d of c){const h=d<0?s[~d].slice().reverse():s[d];for(const[f,p]of h)u.push({lat:p,lon:f})}r.push(u)}else if(o.type==="GeometryCollection")for(const l of o.geometries)a(l)};return a(e.objects.land),r}_pointInPoly(e,t){let n=!1;for(const s of this._landRings)if(!(s._bb&&(e<s._bb[0]||e>s._bb[1]||t<s._bb[2]||t>s._bb[3])))for(let r=0,a=s.length-1;r<s.length;a=r++){const o=s[r].lat,l=s[r].lon,c=s[a].lat,u=s[a].lon;o>e!=c>e&&t<(u-l)*(e-o)/(c-o)+l&&(n=!n)}return n}_drawLand(){if(!this._landGrid)return;const{R:e,cx:t,cy:n,viewLon:s,viewLat:r}=this;if(!this._landOC||Math.abs(s-this._landCacheLon)>.15||Math.abs(r-this._landCacheLat)>.15||Math.abs(e-this._landCacheR)>.5){const o=this.canvas.clientWidth,l=this.canvas.clientHeight;this._landOC||(this._landOC=document.createElement("canvas")),this._landOC.width=o,this._landOC.height=l;const c=this._landOC.getContext("2d"),u=c.createImageData(o,l),d=u.data,h=this._landW,f=this._landH,p=e<100?4:e<160?3:e<240?2:1,_=Math.PI/180,m=Math.sin(r*_),g=Math.cos(r*_),S=s*_;for(let v=0;v<f;v+=p){const M=this._sinLat[v],T=this._cosLat[v];for(let E=0;E<h;E+=p){const R=v*h+E;if(!this._landGrid[R])continue;const y=this._sinLon[E]*Math.cos(S)-this._cosLon[E]*Math.sin(S),A=this._cosLon[E]*Math.cos(S)+this._sinLon[E]*Math.sin(S),U=m*M+g*T*A;if(U<0)continue;const C=t+e*T*y,I=n-e*(g*M-m*T*A),O=Math.max(.15,U),z=this._coastGrid[R],B=z?p<=1?1:p===2||p===3?2:3:p<=1||p===2?1:2,H=Math.round(z?(.55*O+.2)*255:(.32*O+.06)*255),k=z?50:22,ie=z?135:72,G=z?72:40,Z=Math.round(C-B/2),J=Math.round(I-B/2);for(let Q=0;Q<B;Q++){const Le=J+Q;if(!(Le<0||Le>=l))for(let Qe=0;Qe<B;Qe++){const tt=Z+Qe;if(tt<0||tt>=o)continue;const $=(Le*o+tt)*4;d[$]=k,d[$+1]=ie,d[$+2]=G,d[$+3]=H}}}}c.putImageData(u,0,0),this._landCacheLon=s,this._landCacheLat=r,this._landCacheR=e}this.ctx.drawImage(this._landOC,0,0)}_computeDotSizes(){const e=new Set(["ATL","DFW","DEN","ORD","LAX","JFK","SFO","SEA","LAS","MCO","CLT","MIA","EWR","BOS","MSP","DTW","IAH","PHX","IAD","PHL","DCA","LHR","CDG","FRA","AMS","MAD","FCO","BCN","MUC","ZRH","VIE","IST","DME","DXB","DOH","RUH","SIN","PEK","PVG","HND","NRT","ICN","BKK","HKG","KUL","CAN","CTU","SZX","DEL","BOM","SYD","MEL","GRU","MEX"]),t=new Set(["PDX","SAN","SLC","TPA","RDU","BWI","MCI","OAK","MSY","AUS","SMF","SJC","CLE","CMH","OGG","FLL","MDW","HNL","STL","BNA","RSW","ORY","MXP","LGW","ARN","CPH","HEL","OSL","DUB","LIS","BRU","PRG","BUD","WAW","ATH","AUH","SVO","LED","CAI","CMN","JNB","CPT","NBO","ADD","LOS","ACC","DAR","CGK","MNL","TPE","KUL","CCU","KHI","LHE","AKL","PER","ADL","BNE","GRU","GIG","EZE","SCL","LIM","BOG"]);this._dotSizes=ft.map(n=>e.has(n.code)?2:t.has(n.code)?1:0)}_bindEvents(){const e=this.canvas;e.addEventListener("mousedown",t=>{this._dragging=!0,this._autoRotate=!1,this._lastX=t.clientX,this._lastY=t.clientY,t.preventDefault()}),window.addEventListener("mousemove",t=>{this._paused||this._onMove(t)}),window.addEventListener("mouseup",()=>{this._dragging=!1}),e.addEventListener("mouseleave",()=>{this._dragging||(this.hoveredIdx=-1,this.onHover(-1))}),e.addEventListener("click",()=>{this.hoveredIdx>=0&&(this.selectedIdx=this.hoveredIdx,this.onSelect(this.hoveredIdx))}),e.addEventListener("touchstart",t=>{this._dragging=!0,this._autoRotate=!1,this._lastX=t.touches[0].clientX,this._lastY=t.touches[0].clientY},{passive:!0}),e.addEventListener("touchmove",t=>{if(!this._dragging)return;const n=t.touches[0].clientX-this._lastX,s=t.touches[0].clientY-this._lastY;this.viewLon-=n*.5,this._tLon=this.viewLon,this.viewLat=Math.max(-85,Math.min(85,this.viewLat+s*.3)),this._tLat=this.viewLat,this._lastX=t.touches[0].clientX,this._lastY=t.touches[0].clientY,t.preventDefault()},{passive:!1}),e.addEventListener("touchend",()=>{this._dragging=!1}),e.addEventListener("wheel",t=>{t.preventDefault();const n=t.deltaY>0?.9:1.11;this._targetZoom=Math.max(.6,Math.min(2,this._targetZoom*n))},{passive:!1})}_onMove(e){if(this._dragging){const t=e.clientX-this._lastX,n=e.clientY-this._lastY;this.viewLon-=t*.5,this._tLon=this.viewLon,this.viewLat=Math.max(-85,Math.min(85,this.viewLat+n*.3)),this._tLat=this.viewLat,this._lastX=e.clientX,this._lastY=e.clientY,this.hoveredIdx=-1}else{const t=this.canvas.getBoundingClientRect(),n=e.clientX-t.left,s=e.clientY-t.top,r=n-this.cx,a=s-this.cy;if(r*r+a*a>this.R*this.R){this.hoveredIdx=-1;return}let o=-1,l=14;for(let c=0;c<ft.length;c++){const u=this._proj(ft[c].lat,ft[c].lon);if(!u.visible)continue;const d=Math.hypot(u.x-n,u.y-s);d<l&&(l=d,o=c)}o!==this.hoveredIdx&&(this.hoveredIdx=o,this.canvas.style.cursor=o>=0?"pointer":"grab",this.onHover(o))}}setFocused(e){if(this.focusedIdx=e,this._pulsePhase=0,e>=0){const t=ft[e];this._tLon=t.lon,this._tLat=Math.max(-70,Math.min(70,t.lat*.75)),this._autoRotate=!1,this._nearbyIdxs=ft.map((n,s)=>({i:s,d:Cg(t.lat,t.lon,n.lat,n.lon)})).filter(({i:n})=>n!==e).sort((n,s)=>n.d-s.d).slice(0,4).map(({i:n})=>n)}else this._nearbyIdxs=[]}_loop(){this._paused||(this._raf=requestAnimationFrame(()=>this._loop()),this._autoRotate&&!this._dragging&&(this.viewLon+=.05,this._tLon=this.viewLon),this._dragging||(this.viewLon+=(this._tLon-this.viewLon)*.1,this.viewLat+=(this._tLat-this.viewLat)*.1),this._zoom+=(this._targetZoom-this._zoom)*.12,this.R=this._baseR*this._zoom,this._draw())}setFilter(e,t){this.activeRegion=e,this.searchQuery=(t||"").toLowerCase()}flyTo(e,t){this._autoRotate=!1,this._tLat=e;let n=((t-this.viewLon)%360+540)%360-180;this._tLon=this.viewLon+n}setSelected(e){this.selectedIdx=e,e>=0&&this.flyTo(ft[e].lat,ft[e].lon)}resume(){this._paused&&(this._paused=!1,this._resize(),this._loop())}pause(){this._paused=!0,this._raf&&(cancelAnimationFrame(this._raf),this._raf=null)}}let Yt=null;const hl={ATL:{icao:"KATL",elev:1026,tz:"EST/EDT",rwys:5,pax:93.7,terminals:2,rwyLen:"12390 ft",hub:"Delta",fact:"World's busiest airport — #1 for over 22 consecutive years"},DFW:{icao:"KDFW",elev:603,tz:"CST/CDT",rwys:7,pax:73.4,terminals:5,rwyLen:"13401 ft",hub:"American",fact:"Larger than Manhattan Island at 69 km² — the world's 2nd largest airport campus"},DEN:{icao:"KDEN",elev:5431,tz:"MST/MDT",rwys:6,pax:69.3,terminals:1,rwyLen:"16000 ft",hub:"United/Frontier",fact:"At 5,431 ft — the highest major US airport. Its 16,000 ft runway can handle any aircraft"},ORD:{icao:"KORD",elev:672,tz:"CST/CDT",rwys:8,pax:83.3,terminals:4,rwyLen:"13000 ft",hub:"United/American",fact:"Has the most runways (8) of any US airport — was the world's busiest for over 30 years"},LAX:{icao:"KLAX",elev:128,tz:"PST/PDT",rwys:4,pax:88.1,terminals:9,rwyLen:"12091 ft",hub:"Delta/United/American",fact:"Gateway to the Pacific — the distinctive Theme Building opened in 1961, a Googie architecture icon"},JFK:{icao:"KJFK",elev:13,tz:"EST/EDT",rwys:4,pax:62.5,terminals:6,rwyLen:"14511 ft",hub:"Delta/JetBlue",fact:"Renamed for President Kennedy in 1963. The iconic TWA Flight Center by Eero Saarinen is now a hotel"},SFO:{icao:"KSFO",elev:13,tz:"PST/PDT",rwys:4,pax:57.5,terminals:4,rwyLen:"11870 ft",hub:"United",fact:"Built on San Francisco Bay landfill — two parallel runways are just 750 ft apart"},SEA:{icao:"KSEA",elev:433,tz:"PST/PDT",rwys:3,pax:50.6,terminals:2,rwyLen:"11901 ft",hub:"Alaska/Delta",fact:"Runs on 100% renewable energy — one of the greenest major airports in the US"},LAS:{icao:"KLAS",elev:2181,tz:"PST/PDT",rwys:4,pax:57.3,terminals:3,rwyLen:"14510 ft",hub:"Spirit/Frontier",fact:"The only major US airport with slot machines in the terminal — estimated 1,300 machines"},MCO:{icao:"KMCO",elev:96,tz:"EST/EDT",rwys:4,pax:58,terminals:2,rwyLen:"12005 ft",hub:"JetBlue/Southwest",fact:"Serves Walt Disney World, Universal and SeaWorld — the world's most visited tourist region"},CLT:{icao:"KCLT",elev:748,tz:"EST/EDT",rwys:4,pax:53,terminals:1,rwyLen:"10000 ft",hub:"American",fact:"American Airlines' largest hub by departures — a connection machine handling 1,500+ daily flights"},MIA:{icao:"KMIA",elev:9,tz:"EST/EDT",rwys:4,pax:52,terminals:3,rwyLen:"13016 ft",hub:"American",fact:"#1 US international gateway to Latin America, with non-stop service to 100+ countries"},EWR:{icao:"KEWR",elev:18,tz:"EST/EDT",rwys:3,pax:46.3,terminals:3,rwyLen:"11000 ft",hub:"United",fact:"America's first major commercial airport, opened in 1928 — predates both JFK and LaGuardia"},BOS:{icao:"KBOS",elev:19,tz:"EST/EDT",rwys:6,pax:42.5,terminals:4,rwyLen:"10083 ft",hub:"JetBlue/Delta",fact:"Named for General Edward Logan. Extension runways literally jut into Boston Harbor"},MSP:{icao:"KMSP",elev:841,tz:"CST/CDT",rwys:4,pax:39.6,terminals:2,rwyLen:"11006 ft",hub:"Delta/Sun Country",fact:"Delta's second-largest hub, designed for Minnesota winters — heated jet bridges throughout"},DTW:{icao:"KDTW",elev:645,tz:"EST/EDT",rwys:6,pax:36.4,terminals:2,rwyLen:"12003 ft",hub:"Delta/Spirit",fact:"Home to the world's longest airport tram tunnel — the McNamara Terminal's underground walkway"},IAH:{icao:"KIAH",elev:97,tz:"CST/CDT",rwys:5,pax:45.3,terminals:5,rwyLen:"12001 ft",hub:"United",fact:"United Airlines' largest international hub — a major gateway for Latin America routes"},PHX:{icao:"KPHX",elev:1135,tz:"MST",rwys:3,pax:46.3,terminals:3,rwyLen:"11489 ft",hub:"American/Southwest",fact:"Arizona observes no daylight saving time — PHX is the only US mega-hub in a single timezone year-round"},IAD:{icao:"KIAD",elev:313,tz:"EST/EDT",rwys:4,pax:27.6,terminals:1,rwyLen:"11501 ft",hub:"United",fact:"Designed by Eero Saarinen, opened 1962. The mobile lounges were futuristic for their era"},PHL:{icao:"KPHL",elev:36,tz:"EST/EDT",rwys:4,pax:33.4,terminals:7,rwyLen:"10506 ft",hub:"American",fact:"One of the original four American Airlines hubs from the hub-and-spoke era of the 1980s"},DCA:{icao:"KDCA",elev:15,tz:"EST/EDT",rwys:3,pax:25.5,terminals:3,rwyLen:"6869 ft",hub:"American",fact:"Subject to the strictest airspace restrictions in the US — the 30 nm SFRA around Washington DC"},SAN:{icao:"KSAN",elev:17,tz:"PST/PDT",rwys:1,pax:25.2,terminals:2,rwyLen:"9401 ft",hub:"Southwest",fact:"One of only a few major US airports with a single runway — approaches skim downtown rooftops"},PDX:{icao:"KPDX",elev:31,tz:"PST/PDT",rwys:3,pax:20.1,terminals:1,rwyLen:"11000 ft",hub:"Alaska",fact:"Famous for its carpet — replaced in 2015, the old pattern became a pop culture icon"},SLC:{icao:"KSLC",elev:4227,tz:"MST/MDT",rwys:4,pax:27,terminals:1,rwyLen:"12003 ft",hub:"Delta",fact:"Delta's western mountain hub at 4,227 ft — brand new terminal opened in 2020"},TPA:{icao:"KTPA",elev:26,tz:"EST/EDT",rwys:3,pax:23.3,terminals:1,rwyLen:"11002 ft",hub:"Breeze/Southwest",fact:"Known for its automated people mover shuttles between landside and airside since 1971"},RDU:{icao:"KRDU",elev:435,tz:"EST/EDT",rwys:3,pax:14.8,terminals:2,rwyLen:"10000 ft",hub:"Frontier",fact:"Named for both Raleigh and Durham — a gateway to the Research Triangle tech corridor"},BWI:{icao:"KBWI",elev:146,tz:"EST/EDT",rwys:3,pax:26.5,terminals:1,rwyLen:"10502 ft",hub:"Southwest",fact:"Southwest's largest East Coast operation — named for Thurgood Marshall since 2005"},MCI:{icao:"KMCI",elev:1026,tz:"CST/CDT",rwys:3,pax:13.4,terminals:1,rwyLen:"10801 ft",hub:"Southwest",fact:"New single terminal opened 2023, replacing the 1972 drive-to-your-gate design"},MSY:{icao:"KMSY",elev:4,tz:"CST/CDT",rwys:2,pax:14.5,terminals:1,rwyLen:"10104 ft",hub:"Southwest/Spirit",fact:"New $1.3B terminal opened 2019, replacing the 1959 original on the same site"},AUS:{icao:"KAUS",elev:542,tz:"CST/CDT",rwys:2,pax:21.7,terminals:1,rwyLen:"12250 ft",hub:"Southwest",fact:"One of the fastest-growing US airports, tripling traffic since 2010 with Austin's tech boom"},SMF:{icao:"KSMF",elev:27,tz:"PST/PDT",rwys:2,pax:14.4,terminals:2,rwyLen:"8601 ft",hub:"Southwest",fact:"Sacramento's gateway — the closest major airport to California's state capital"},SJC:{icao:"KSJC",elev:62,tz:"PST/PDT",rwys:2,pax:16,terminals:2,rwyLen:"11000 ft",hub:"Southwest/Alaska",fact:"Silicon Valley's airport — walking distance from many tech campuses"},FLL:{icao:"KFLL",elev:9,tz:"EST/EDT",rwys:2,pax:36,terminals:4,rwyLen:"9000 ft",hub:"JetBlue/Spirit",fact:"South Florida's low-cost carrier hub — within 30 miles of both Fort Lauderdale and Miami"},MDW:{icao:"KMDW",elev:620,tz:"CST/CDT",rwys:5,pax:23.4,terminals:1,rwyLen:"6522 ft",hub:"Southwest",fact:"Southwest Airlines' original home base — the airline was born here in 1971"},HNL:{icao:"PHNL",elev:13,tz:"HST",rwys:4,pax:21,terminals:3,rwyLen:"12300 ft",hub:"Hawaiian",fact:"The only major US airport with an outdoor terminal — reef runway built on a coral reef"},BNA:{icao:"KBNA",elev:599,tz:"CST/CDT",rwys:4,pax:22,terminals:1,rwyLen:"11030 ft",hub:"Southwest",fact:"Nashville's music city gateway — one of the fastest-growing airports in America"},STL:{icao:"KSTL",elev:618,tz:"CST/CDT",rwys:4,pax:16.5,terminals:2,rwyLen:"11019 ft",hub:"Southwest",fact:"Once TWA's fortress hub — its massive Terminal 2 now serves Southwest exclusively"},OAK:{icao:"KOAK",elev:9,tz:"PST/PDT",rwys:4,pax:14.1,terminals:2,rwyLen:"10520 ft",hub:"Southwest/Spirit",fact:"The affordable Bay Area alternative — a 25 minute BART ride from downtown San Francisco"},CLE:{icao:"KCLE",elev:791,tz:"EST/EDT",rwys:3,pax:10.6,terminals:1,rwyLen:"9956 ft",hub:"Spirit/Frontier",fact:"Former Continental hub — the Rock & Roll Hall of Fame is visible on approach to runway 6L"},CMH:{icao:"KCMH",elev:816,tz:"EST/EDT",rwys:3,pax:10.2,terminals:1,rwyLen:"10113 ft",hub:"Breeze",fact:"John Glenn Columbus — named for Ohio's astronaut-senator who orbited Earth in 1962"},RSW:{icao:"KRSW",elev:30,tz:"EST/EDT",rwys:2,pax:12.3,terminals:1,rwyLen:"12000 ft",hub:"Southwest",fact:"Southwest Florida International — gateway to Sanibel Island and Fort Myers beaches"},OGG:{icao:"PHOG",elev:54,tz:"HST",rwys:2,pax:8.4,terminals:1,rwyLen:"6995 ft",hub:"Hawaiian",fact:"Kahului Airport — Maui's gateway, with stunning views of Haleakala volcano on approach"},PIT:{icao:"KPIT",elev:1204,tz:"EST/EDT",rwys:4,pax:10.8,terminals:1,rwyLen:"11500 ft",hub:"Spirit",fact:"Former USAirways mega-hub — its landside terminal now houses offices and a hotel"},IND:{icao:"KIND",elev:797,tz:"EST/EDT",rwys:3,pax:10,terminals:1,rwyLen:"11200 ft",hub:"Allegiant",fact:"Indianapolis — home to the world's 2nd largest FedEx hub, processing 3M+ packages nightly"},CVG:{icao:"KCVG",elev:896,tz:"EST/EDT",rwys:4,pax:9.8,terminals:2,rwyLen:"12000 ft",hub:"DHL/Allegiant",fact:"DHL's Americas superhub — once Delta's largest hub, now a major cargo center"},JAX:{icao:"KJAX",elev:30,tz:"EST/EDT",rwys:2,pax:8,terminals:1,rwyLen:"10000 ft",hub:"Breeze",fact:"Jacksonville — one of the largest US cities by area, serving Northeast Florida's coastline"},ABQ:{icao:"KABQ",elev:5355,tz:"MST/MDT",rwys:3,pax:6.2,terminals:1,rwyLen:"13793 ft",hub:"Southwest",fact:"Albuquerque Sunport at 5,355 ft — the extra-long runway handles hot-and-high takeoffs"},ANC:{icao:"PANC",elev:152,tz:"AKST/AKDT",rwys:3,pax:5.5,terminals:2,rwyLen:"12400 ft",hub:"Alaska",fact:"Ted Stevens Anchorage — a critical refueling stop for Pacific cargo flights, top 5 US cargo airport"},MEM:{icao:"KMEM",elev:341,tz:"CST/CDT",rwys:4,pax:5.2,terminals:2,rwyLen:"11120 ft",hub:"FedEx",fact:"FedEx's global superhub — processes 4M+ packages per night, busiest cargo airport in the Americas"},LHR:{icao:"EGLL",elev:83,tz:"GMT/BST",rwys:2,pax:79.2,terminals:4,rwyLen:"12799 ft",hub:"British Airways",fact:"Europe's busiest at 80M+ passengers/year. A 3rd runway debate has lasted over 50 years"},CDG:{icao:"LFPG",elev:392,tz:"CET/CEST",rwys:4,pax:67.4,terminals:3,rwyLen:"13829 ft",hub:"Air France",fact:"Named for Charles de Gaulle, opened 1974. Terminal 1's satellite pods are iconic Brutalist architecture"},FRA:{icao:"EDDF",elev:364,tz:"CET/CEST",rwys:4,pax:59.4,terminals:2,rwyLen:"13123 ft",hub:"Lufthansa",fact:"Europe's largest cargo hub and a Lufthansa stronghold — its own on-airport train station since 1972"},AMS:{icao:"EHAM",elev:-11,tz:"CET/CEST",rwys:6,pax:61.7,terminals:1,rwyLen:"12467 ft",hub:"KLM",fact:"At -11 ft — one of the world's lowest airports, built on reclaimed Dutch polder land"},MAD:{icao:"LEMD",elev:2001,tz:"CET/CEST",rwys:4,pax:60.1,terminals:4,rwyLen:"13451 ft",hub:"Iberia",fact:"Highest capital-city airport in Europe at 2,001 ft. Terminal 4 by Richard Rogers spans 760,000 m²"},FCO:{icao:"LIRF",elev:14,tz:"CET/CEST",rwys:3,pax:40.4,terminals:3,rwyLen:"12795 ft",hub:"ITA Airways",fact:"Leonardo da Vinci International — Italy's busiest and gateway to ancient Rome"},BCN:{icao:"LEBL",elev:12,tz:"CET/CEST",rwys:3,pax:52.7,terminals:2,rwyLen:"10499 ft",hub:"Vueling",fact:"One runway extends over the Mediterranean Sea — the beach is just 500m from the terminal"},MUC:{icao:"EDDM",elev:1487,tz:"CET/CEST",rwys:2,pax:47.9,terminals:2,rwyLen:"13123 ft",hub:"Lufthansa",fact:"Consistently rated Europe's best airport — opened in 1992 replacing Riem after 60 years"},ZRH:{icao:"LSZH",elev:1416,tz:"CET/CEST",rwys:3,pax:31.5,terminals:3,rwyLen:"12139 ft",hub:"Swiss",fact:"Swiss precision — one of Europe's most punctual airports, pioneering airside transit zones"},VIE:{icao:"LOWW",elev:600,tz:"CET/CEST",rwys:3,pax:31.7,terminals:3,rwyLen:"11811 ft",hub:"Austrian",fact:"Eastern gateway to Western Europe — Austrian Airlines hub connecting Central and Eastern Europe"},IST:{icao:"LTFM",elev:325,tz:"TRT",rwys:5,pax:76.1,terminals:1,rwyLen:"13451 ft",hub:"Turkish Airlines",fact:"Istanbul Airport opened 2019 with planned ultimate capacity of 200 million passengers per year"},DME:{icao:"UUDD",elev:588,tz:"MSK",rwys:3,pax:22,terminals:2,rwyLen:"11484 ft",hub:"S7 Airlines",fact:"Russia's largest airport by passenger traffic, named Domodedovo after the surrounding district"},SVO:{icao:"UUEE",elev:630,tz:"MSK",rwys:3,pax:18,terminals:4,rwyLen:"12139 ft",hub:"Aeroflot",fact:"Sheremetyevo, formally named after Alexander Pushkin in 2019 — Aeroflot's primary hub"},ORY:{icao:"LFPO",elev:292,tz:"CET/CEST",rwys:3,pax:33.1,terminals:4,rwyLen:"11975 ft",hub:"Transavia",fact:"Paris Orly — originally the city's main airport before CDG opened in 1974"},MXP:{icao:"LIMC",elev:768,tz:"CET/CEST",rwys:2,pax:28.8,terminals:2,rwyLen:"12861 ft",hub:"Ryanair/EasyJet",fact:"Milan Malpensa — northern Italy's intercontinental gateway, 50 km from the city center"},LGW:{icao:"EGKK",elev:202,tz:"GMT/BST",rwys:2,pax:32.8,terminals:2,rwyLen:"10364 ft",hub:"EasyJet",fact:"London Gatwick — the world's busiest single-runway operation (the northern runway is standby only)"},ARN:{icao:"ESSA",elev:137,tz:"CET/CEST",rwys:3,pax:26.8,terminals:4,rwyLen:"10830 ft",hub:"SAS",fact:'Stockholm Arlanda — named from a combination of "Ärna" (the old air base) and "landa" (to land)'},CPH:{icao:"EKCH",elev:17,tz:"CET/CEST",rwys:3,pax:30.3,terminals:3,rwyLen:"11811 ft",hub:"SAS",fact:"Copenhagen Kastrup — the busiest airport in the Nordics, a 12-minute metro ride to city center"},HEL:{icao:"EFHK",elev:179,tz:"EET/EEST",rwys:3,pax:18,terminals:2,rwyLen:"11286 ft",hub:"Finnair",fact:"Helsinki-Vantaa — Finnair's hub for the fastest Europe-to-Asia routing via the Arctic"},OSL:{icao:"ENGM",elev:681,tz:"CET/CEST",rwys:2,pax:28.6,terminals:1,rwyLen:"11811 ft",hub:"SAS/Norwegian",fact:"Oslo Gardermoen — one of Europe's newest major airports, opened 1998 with a stunning timber terminal"},DUB:{icao:"EIDW",elev:242,tz:"GMT/IST",rwys:2,pax:32.9,terminals:2,rwyLen:"8652 ft",hub:"Ryanair/Aer Lingus",fact:"Dublin — one of few European airports offering US Customs preclearance before departure"},LIS:{icao:"LPPT",elev:374,tz:"WET/WEST",rwys:2,pax:31.2,terminals:2,rwyLen:"12484 ft",hub:"TAP Portugal",fact:"Lisbon Humberto Delgado — Europe's westernmost major airport, gateway to the Azores and Africa"},BRU:{icao:"EBBR",elev:184,tz:"CET/CEST",rwys:3,pax:22.2,terminals:1,rwyLen:"11936 ft",hub:"Brussels Airlines",fact:"Brussels Zaventem — headquarters of the European Union is just 12 km from the airport"},PRG:{icao:"LKPR",elev:1247,tz:"CET/CEST",rwys:2,pax:17.8,terminals:2,rwyLen:"12191 ft",hub:"Smartwings/Czech Airlines",fact:"Prague Václav Havel — named for the first Czech president, nestled in rolling Bohemian countryside"},BUD:{icao:"LHBP",elev:495,tz:"CET/CEST",rwys:2,pax:16.2,terminals:2,rwyLen:"12162 ft",hub:"Wizz Air",fact:"Budapest Liszt Ferenc — Wizz Air's original base, and the largest in Central Europe's LCC market"},WAW:{icao:"EPWA",elev:362,tz:"CET/CEST",rwys:2,pax:18.9,terminals:1,rwyLen:"11483 ft",hub:"LOT Polish",fact:"Warsaw Chopin — LOT Polish Airlines has operated from here since 1934, Poland's busiest"},ATH:{icao:"LGAV",elev:308,tz:"EET/EEST",rwys:2,pax:28.3,terminals:2,rwyLen:"13123 ft",hub:"Aegean Airlines",fact:"Athens Eleftherios Venizelos — opened 2001, replacing the legendary Hellinikon on the coast"},LED:{icao:"ULLI",elev:78,tz:"MSK",rwys:2,pax:19.6,terminals:2,rwyLen:"11483 ft",hub:"Rossiya Airlines",fact:"St. Petersburg Pulkovo — gateway to Russia's cultural capital and the Hermitage Museum"},EDI:{icao:"EGPH",elev:135,tz:"GMT/BST",rwys:1,pax:14.7,terminals:1,rwyLen:"8399 ft",hub:"Ryanair/EasyJet",fact:"Edinburgh — Scotland's busiest airport, with Edinburgh Castle visible from the apron"},GVA:{icao:"LSGG",elev:1411,tz:"CET/CEST",rwys:1,pax:17.9,terminals:1,rwyLen:"12795 ft",hub:"EasyJet/Swiss",fact:"Geneva — uniquely has a French-side entrance accessible without passing Swiss immigration"},AGP:{icao:"LEMG",elev:53,tz:"CET/CEST",rwys:2,pax:22,terminals:3,rwyLen:"10499 ft",hub:"Ryanair",fact:"Málaga Costa del Sol — southern Spain's beach gateway, busiest non-capital airport in Spain"},PMI:{icao:"LEPA",elev:27,tz:"CET/CEST",rwys:2,pax:31.1,terminals:1,rwyLen:"10728 ft",hub:"Ryanair/EasyJet",fact:"Palma de Mallorca — Europe's busiest seasonal airport, handling 35M+ in summer peak"},DXB:{icao:"OMDB",elev:62,tz:"GST+4",rwys:2,pax:87,terminals:3,rwyLen:"13124 ft",hub:"Emirates/flydubai",fact:"World's busiest international airport. Terminal 3 alone is one of the largest buildings on Earth"},DOH:{icao:"OTHH",elev:13,tz:"AST+3",rwys:2,pax:46.3,terminals:1,rwyLen:"15912 ft",hub:"Qatar Airways",fact:"Hamad International opened 2014, with a 23m bronze teddy bear sculpture in the concourse"},AUH:{icao:"OMAA",elev:88,tz:"GST+4",rwys:2,pax:24.3,terminals:3,rwyLen:"13451 ft",hub:"Etihad",fact:"Etihad's home — the Sheikh Zayed Grand Mosque is visible on approach to runway 31L"},RUH:{icao:"OERK",elev:2049,tz:"AST+3",rwys:4,pax:29.5,terminals:5,rwyLen:"13780 ft",hub:"Saudia/flynas",fact:"King Khalid — expanding under Vision 2030. New Riyadh airport will be one of world's largest"},JED:{icao:"OEJN",elev:48,tz:"AST+3",rwys:2,pax:40.2,terminals:2,rwyLen:"12467 ft",hub:"Saudia/flynas",fact:"King Abdulaziz — gateway for Hajj pilgrims, handling 2M+ pilgrims annually"},MCT:{icao:"OOMS",elev:48,tz:"GST+4",rwys:1,pax:14.5,terminals:1,rwyLen:"13123 ft",hub:"Oman Air",fact:"Muscat — opened a stunning new terminal in 2018, designed to resemble a Bedouin tent"},AMM:{icao:"OJAI",elev:2395,tz:"EET+2",rwys:2,pax:9.2,terminals:2,rwyLen:"12008 ft",hub:"Royal Jordanian",fact:"Queen Alia — gateway to Petra, the Dead Sea, and Wadi Rum, at 2,395 ft above sea level"},BAH:{icao:"OBBI",elev:6,tz:"AST+3",rwys:1,pax:11,terminals:1,rwyLen:"12927 ft",hub:"Gulf Air",fact:"Bahrain — one of the oldest airports in the Gulf, built on an island in the Persian Gulf"},KWI:{icao:"OKBK",elev:206,tz:"AST+3",rwys:2,pax:15.5,terminals:2,rwyLen:"11155 ft",hub:"Kuwait Airways",fact:"Kuwait — its new terminal by Foster+Partners features a 1.2 km roof inspired by a sail"},TLV:{icao:"LLBG",elev:135,tz:"IST+2",rwys:3,pax:25,terminals:3,rwyLen:"11998 ft",hub:"El Al",fact:"Ben Gurion — considered one of the world's most secure airports with multi-layer security"},SIN:{icao:"WSSS",elev:22,tz:"SGT+8",rwys:3,pax:62.6,terminals:4,rwyLen:"13123 ft",hub:"Singapore Airlines",fact:"Changi — voted world's best airport 12+ years running. Jewel Changi has a 40m indoor waterfall"},PEK:{icao:"ZBAA",elev:116,tz:"CST+8",rwys:3,pax:62,terminals:3,rwyLen:"12467 ft",hub:"Air China",fact:"Beijing Capital — one of the world's top 3 busiest. Terminal 3 is the world's 2nd largest building"},PVG:{icao:"ZSPD",elev:13,tz:"CST+8",rwys:4,pax:50.1,terminals:2,rwyLen:"12467 ft",hub:"China Eastern",fact:"Shanghai Pudong — China's largest cargo airport, opened 1999 on reclaimed Yangtze delta land"},HND:{icao:"RJTT",elev:35,tz:"JST+9",rwys:4,pax:87.1,terminals:3,rwyLen:"9843 ft",hub:"ANA/JAL",fact:"Tokyo Haneda — consistently the world's most punctual major airport, rebuilt after WWII"},NRT:{icao:"RJAA",elev:141,tz:"JST+9",rwys:2,pax:35.7,terminals:3,rwyLen:"13123 ft",hub:"ANA/JAL",fact:"Narita opened 1978 amid massive protests — the only Japanese airport with a curfew (23:00-06:00)"},ICN:{icao:"RKSI",elev:23,tz:"KST+9",rwys:4,pax:71.2,terminals:2,rwyLen:"12300 ft",hub:"Korean Air/Asiana",fact:"Seoul Incheon — built on reclaimed sea between two islands, rated world's best airport repeatedly"},BKK:{icao:"VTBS",elev:5,tz:"ICT+7",rwys:2,pax:60.9,terminals:1,rwyLen:"13123 ft",hub:"Thai Airways",fact:'Suvarnabhumi — "Golden Land" in Sanskrit. The terminal roof spans 563,000 m²'},HKG:{icao:"VHHH",elev:28,tz:"HKT+8",rwys:2,pax:39.8,terminals:2,rwyLen:"12467 ft",hub:"Cathay Pacific",fact:"Built on reclaimed Lantau Island land — the old Kai Tak runway 13 approach was legendary"},KUL:{icao:"WMKK",elev:69,tz:"MYT+8",rwys:2,pax:48,terminals:2,rwyLen:"13402 ft",hub:"AirAsia/Malaysia",fact:'KLIA — designed by Kisho Kurokawa with the "forest terminal" concept, connected by high-speed rail'},DEL:{icao:"VIDP",elev:777,tz:"IST+5:30",rwys:3,pax:72.3,terminals:3,rwyLen:"14534 ft",hub:"IndiGo/Air India",fact:"Indira Gandhi International — India's busiest, handling 72M+ passengers at South Asia's largest hub"},BOM:{icao:"VABB",elev:37,tz:"IST+5:30",rwys:2,pax:51.8,terminals:2,rwyLen:"12008 ft",hub:"IndiGo/Air India",fact:"Chhatrapati Shivaji Maharaj — sits between the Arabian Sea and the city, land is ultra-scarce"},CAN:{icao:"ZGGG",elev:46,tz:"CST+8",rwys:3,pax:63.4,terminals:2,rwyLen:"12467 ft",hub:"China Southern",fact:"Guangzhou Baiyun — China Southern's mega-hub, one of the world's fastest-growing airports"},CTU:{icao:"ZUUU",elev:1624,tz:"CST+8",rwys:3,pax:53,terminals:2,rwyLen:"11811 ft",hub:"Air China/Sichuan",fact:"Chengdu Shuangliu — in the Sichuan basin, with Chengdu Tianfu (TFU) as its newer partner"},SZX:{icao:"ZGSZ",elev:13,tz:"CST+8",rwys:2,pax:52.9,terminals:2,rwyLen:"11155 ft",hub:"Shenzhen Airlines",fact:"Shenzhen Bao'an — its futuristic terminal resembles a manta ray, designed by Studio Fuksas"},CGK:{icao:"WIII",elev:34,tz:"WIB+7",rwys:3,pax:54.2,terminals:3,rwyLen:"12008 ft",hub:"Garuda/Lion Air",fact:"Jakarta Soekarno-Hatta — serves the world's 4th most populous country, Indonesia's primary gateway"},MNL:{icao:"RPLL",elev:75,tz:"PHT+8",rwys:2,pax:49.8,terminals:4,rwyLen:"11004 ft",hub:"Philippine Airlines/Cebu",fact:"Ninoy Aquino — famously congested, this airport serves Metro Manila's 13 million residents"},TPE:{icao:"RCTP",elev:106,tz:"CST+8",rwys:2,pax:48.6,terminals:2,rwyLen:"12008 ft",hub:"EVA Air/China Airlines",fact:"Taiwan Taoyuan — known for exceptional transit facilities and award-winning airline lounges"},CCU:{icao:"VECC",elev:16,tz:"IST+5:30",rwys:2,pax:23.5,terminals:2,rwyLen:"11900 ft",hub:"IndiGo",fact:"Netaji Subhas Chandra Bose — Kolkata's gateway, serving eastern India and the Bay of Bengal"},KHI:{icao:"OPKC",elev:100,tz:"PKT+5",rwys:2,pax:12,terminals:3,rwyLen:"10500 ft",hub:"PIA",fact:"Jinnah International — Pakistan's busiest airport, named for the nation's founder"},SGN:{icao:"VVTS",elev:33,tz:"ICT+7",rwys:2,pax:41.2,terminals:2,rwyLen:"12468 ft",hub:"Vietnam Airlines/VietJet",fact:"Ho Chi Minh City Tan Son Nhat — one of the world's 50 busiest, surrounded entirely by urban sprawl"},HAN:{icao:"VVNB",elev:39,tz:"ICT+7",rwys:2,pax:28.9,terminals:2,rwyLen:"11811 ft",hub:"Vietnam Airlines/Bamboo",fact:"Hanoi Noi Bai — Vietnam's capital gateway, 35 km north of the ancient Old Quarter"},BLR:{icao:"VOBL",elev:3e3,tz:"IST+5:30",rwys:2,pax:37.6,terminals:2,rwyLen:"13120 ft",hub:"IndiGo/Air India",fact:"Kempegowda International — India's tech capital airport at 3,000 ft, opened 2008"},MAA:{icao:"VOMM",elev:52,tz:"IST+5:30",rwys:2,pax:22.5,terminals:2,rwyLen:"12001 ft",hub:"IndiGo/SpiceJet",fact:"Chennai — gateway to South India and the Bay of Bengal, India's 4th busiest airport"},HYD:{icao:"VOHS",elev:2024,tz:"IST+5:30",rwys:1,pax:25,terminals:1,rwyLen:"13976 ft",hub:"IndiGo",fact:"Rajiv Gandhi International — at 2,024 ft with one of India's longest runways for A380 operations"},PKX:{icao:"ZBAD",elev:102,tz:"CST+8",rwys:4,pax:26,terminals:1,rwyLen:"12467 ft",hub:"China Southern/China United",fact:"Beijing Daxing — the starfish terminal by Zaha Hadid is the world's largest single-structure airport"},KIX:{icao:"RJBB",elev:26,tz:"JST+9",rwys:2,pax:31,terminals:2,rwyLen:"13123 ft",hub:"Peach/ANA",fact:"Kansai — built on an artificial island in Osaka Bay by Renzo Piano, it never loses luggage"},JNB:{icao:"FAOR",elev:5558,tz:"SAST+2",rwys:2,pax:21,terminals:2,rwyLen:"14495 ft",hub:"South African",fact:"O.R. Tambo — Africa's busiest at 5,558 ft on the Highveld, handling 21M+ passengers"},CAI:{icao:"HECA",elev:382,tz:"EET+2",rwys:4,pax:22.7,terminals:3,rwyLen:"13124 ft",hub:"EgyptAir",fact:"Cairo International — gateway to 5,000 years of history, EgyptAir's hub since 1960"},CMN:{icao:"GMMN",elev:656,tz:"WET+1",rwys:2,pax:10.4,terminals:2,rwyLen:"12205 ft",hub:"Royal Air Maroc",fact:"Mohammed V — Africa's 3rd busiest and Royal Air Maroc's hub, a gateway between continents"},ADD:{icao:"HAAB",elev:7625,tz:"EAT+3",rwys:3,pax:13.2,terminals:2,rwyLen:"12468 ft",hub:"Ethiopian Airlines",fact:"Bole — Ethiopian Airlines' massive hub at 7,625 ft, Africa's fastest-growing carrier base"},NBO:{icao:"HKJK",elev:5327,tz:"EAT+3",rwys:2,pax:8.1,terminals:2,rwyLen:"13507 ft",hub:"Kenya Airways",fact:"Jomo Kenyatta — East Africa's hub at 5,327 ft, Kenya Airways' home and safari gateway"},CPT:{icao:"FACT",elev:151,tz:"SAST+2",rwys:2,pax:10.7,terminals:1,rwyLen:"10502 ft",hub:"FlySafair",fact:"Cape Town — Table Mountain is visible on approach, with stunning views of the Cape coastline"},LOS:{icao:"DNMM",elev:135,tz:"WAT+1",rwys:2,pax:9.1,terminals:2,rwyLen:"12795 ft",hub:"Air Peace",fact:"Murtala Muhammed — Nigeria's busiest, serving Lagos, Africa's most populous city (21M+)"},ACC:{icao:"DGAA",elev:205,tz:"GMT",rwys:1,pax:3.2,terminals:3,rwyLen:"11155 ft",hub:"Africa World Airlines",fact:"Kotoka — Ghana's primary gateway, a growing hub for West African travel and commerce"},DAR:{icao:"HTDA",elev:182,tz:"EAT+3",rwys:2,pax:3.8,terminals:3,rwyLen:"12008 ft",hub:"Air Tanzania",fact:"Julius Nyerere — gateway to Zanzibar and the Serengeti, Tanzania's busiest airport"},ALG:{icao:"DAAG",elev:82,tz:"CET",rwys:3,pax:10,terminals:3,rwyLen:"11483 ft",hub:"Air Algérie",fact:"Houari Boumediene — Algeria's largest airport, gateway to the Sahara and Casbah of Algiers"},DSS:{icao:"GOBD",elev:289,tz:"GMT",rwys:1,pax:3,terminals:1,rwyLen:"11483 ft",hub:"Air Sénégal",fact:"Blaise Diagne — Senegal's new airport, opened 2017 to replace the cramped Léopold Sédar Senghor"},TUN:{icao:"DTTA",elev:22,tz:"CET",rwys:2,pax:7.8,terminals:2,rwyLen:"10827 ft",hub:"Tunisair",fact:"Tunis-Carthage — named for the ancient city of Carthage, Tunisia's primary gateway"},SYD:{icao:"YSSY",elev:21,tz:"AEST+10",rwys:3,pax:44.4,terminals:3,rwyLen:"12999 ft",hub:"Qantas",fact:"Kingsford Smith — named for the aviator who crossed the Pacific in 1928, Qantas' home base"},MEL:{icao:"YMML",elev:434,tz:"AEST+10",rwys:2,pax:37.7,terminals:4,rwyLen:"11998 ft",hub:"Qantas/Jetstar",fact:"Melbourne Tullamarine — Australia's second busiest, with a unique cross-wind runway layout"},BNE:{icao:"YBBN",elev:13,tz:"AEST+10",rwys:2,pax:23.7,terminals:2,rwyLen:"11483 ft",hub:"Qantas/Virgin Australia",fact:"Brisbane — a massive new parallel runway opened 2020, making it Australia's best-equipped airport"},PER:{icao:"YPPH",elev:67,tz:"AWST+8",rwys:3,pax:15,terminals:4,rwyLen:"11299 ft",hub:"Qantas",fact:"Perth — Australia's western gateway, endpoint of the world's longest non-stop flight from London"},AKL:{icao:"NZAA",elev:7,tz:"NZST+12",rwys:1,pax:21.4,terminals:2,rwyLen:"11926 ft",hub:"Air New Zealand",fact:"Auckland — New Zealand's busiest, sitting on an isthmus between two harbours"},ADL:{icao:"YPAD",elev:20,tz:"ACST+9:30",rwys:2,pax:8.6,terminals:2,rwyLen:"10171 ft",hub:"Qantas/Rex",fact:"Adelaide — South Australia's gateway, known for its efficient single-terminal design"},NAN:{icao:"NFNA",elev:59,tz:"FJT+12",rwys:1,pax:2.5,terminals:1,rwyLen:"10502 ft",hub:"Fiji Airways",fact:"Nadi — Fiji's international gateway, the Pacific Islands' busiest airport by traffic"},GRU:{icao:"SBGR",elev:2459,tz:"BRT-3",rwys:2,pax:41.2,terminals:3,rwyLen:"12139 ft",hub:"LATAM/Gol/Azul",fact:"São Paulo Guarulhos — Latin America's busiest at 2,459 ft, LATAM's primary hub"},GIG:{icao:"SBGL",elev:28,tz:"BRT-3",rwys:2,pax:12.5,terminals:2,rwyLen:"13123 ft",hub:"LATAM/Gol",fact:"Rio Galeão — stunning approach over Guanabara Bay with Sugarloaf Mountain in view"},MEX:{icao:"MMMX",elev:7316,tz:"CST-6",rwys:2,pax:50.3,terminals:2,rwyLen:"12795 ft",hub:"Aeromexico/Volaris",fact:"Benito Juárez — one of the world's highest major airports at 7,316 ft elevation"},BOG:{icao:"SKBO",elev:8361,tz:"COT-5",rwys:2,pax:38,terminals:2,rwyLen:"12467 ft",hub:"Avianca/LATAM",fact:"El Dorado — world's highest-elevation major hub at 8,361 ft above sea level in the Andes"},EZE:{icao:"SAEZ",elev:67,tz:"ART-3",rwys:2,pax:14.3,terminals:3,rwyLen:"10827 ft",hub:"Aerolíneas Argentinas",fact:"Ezeiza — Buenos Aires' international gateway, 35 km from the city, named Ministro Pistarini"},SCL:{icao:"SCEL",elev:1555,tz:"CLT-4",rwys:2,pax:24.6,terminals:2,rwyLen:"12232 ft",hub:"LATAM/Sky",fact:"Santiago Arturo Merino Benítez — Chile's busiest, framed by the Andes on approach from the east"},LIM:{icao:"SPJC",elev:113,tz:"PET-5",rwys:2,pax:24.5,terminals:1,rwyLen:"11506 ft",hub:"LATAM Peru",fact:"Jorge Chávez — named for the Peruvian aviator who first flew over the Alps in 1910"},CUN:{icao:"MMUN",elev:22,tz:"EST-5",rwys:3,pax:31.4,terminals:4,rwyLen:"11484 ft",hub:"Volaris/VivaAerobus",fact:"Cancún — Mexico's busiest tourist airport, gateway to the Riviera Maya and Chichén Itzá"},PTY:{icao:"MPTO",elev:135,tz:"EST-5",rwys:2,pax:16.7,terminals:2,rwyLen:"10006 ft",hub:"Copa Airlines",fact:`Tocumen — Copa Airlines' hub, called the "Hub of the Americas" connecting North and South`},GDL:{icao:"MMGL",elev:5016,tz:"CST-6",rwys:2,pax:15.8,terminals:2,rwyLen:"13123 ft",hub:"Volaris",fact:"Guadalajara — Mexico's 2nd busiest airport at 5,016 ft, gateway to tequila country"},BSB:{icao:"SBBR",elev:3479,tz:"BRT-3",rwys:2,pax:15,terminals:1,rwyLen:"10827 ft",hub:"LATAM/Gol",fact:"Brasília — serves Brazil's planned capital city at 3,479 ft on the Central Plateau"},CNF:{icao:"SBCF",elev:2715,tz:"BRT-3",rwys:2,pax:10.8,terminals:1,rwyLen:"9843 ft",hub:"Azul",fact:"Confins — Belo Horizonte's airport, Azul Airlines' key hub in the Minas Gerais highlands"},MDE:{icao:"SKRG",elev:6955,tz:"COT-5",rwys:2,pax:11,terminals:2,rwyLen:"11480 ft",hub:"Avianca",fact:"José María Córdova — Medellín's airport at 6,955 ft in the Andes, with challenging approaches"},UIO:{icao:"SEQM",elev:7874,tz:"ECT-5",rwys:1,pax:5.4,terminals:1,rwyLen:"13451 ft",hub:"LATAM Ecuador",fact:"Quito Mariscal Sucre — at 7,874 ft with a 13,451 ft runway for high-altitude performance"},MVD:{icao:"SUMU",elev:105,tz:"UYT-3",rwys:2,pax:3.5,terminals:1,rwyLen:"10499 ft",hub:"Amaszonas",fact:"Carrasco — Uruguay's gateway, its award-winning Rafael Viñoly terminal opened in 2009"},SJO:{icao:"MROC",elev:3021,tz:"CST-6",rwys:1,pax:7.2,terminals:1,rwyLen:"9882 ft",hub:"Avianca CR",fact:"Juan Santamaría — Costa Rica's primary airport, gateway to biodiversity-rich rainforests"}};pb(ft,hl);function AT(){const i=document.getElementById("city-overlay"),e=document.getElementById("city-grid"),t=document.getElementById("city-overlay-close"),n=document.getElementById("hud-city-btn");if(!i||!e)return;const s={Americas:{lat:12,lon:-88},Europe:{lat:52,lon:12},"Middle East":{lat:26,lon:48},Africa:{lat:4,lon:22},Asia:{lat:22,lon:100},Pacific:{lat:-28,lon:148}},r=[],a={};for(const G of ft)a[G.region]||(a[G.region]=0,r.push(G.region)),a[G.region]++;const o=new Set(["ATL","DFW","DEN","ORD","LAX","JFK","SFO","SEA","LAS","MCO","CLT","MIA","EWR","BOS","MSP","DTW","IAH","PHX","IAD","PHL","DCA","LHR","CDG","FRA","AMS","MAD","FCO","BCN","MUC","ZRH","VIE","IST","DME","DXB","DOH","RUH","SIN","PEK","PVG","HND","NRT","ICN","BKK","HKG","KUL","CAN","CTU","SZX","DEL","BOM","SYD","MEL","GRU","MEX"]),l=new Set(["PDX","SAN","SLC","TPA","RDU","BWI","MCI","OAK","MSY","AUS","SMF","SJC","CLE","CMH","OGG","FLL","MDW","HNL","STL","BNA","RSW","ORY","MXP","LGW","ARN","CPH","HEL","OSL","DUB","LIS","BRU","PRG","BUD","WAW","ATH","AUH","SVO","LED","CAI","CMN","JNB","CPT","NBO","ADD","LOS","ACC","DAR","CGK","MNL","TPE","KUL","CCU","KHI","LHE","AKL","PER","ADL","BNE","GRU","GIG","EZE","SCL","LIM","BOG"]);function c(G){return o.has(G.code)?"MEGA HUB":l.has(G.code)?"MAJOR":"REGIONAL"}function u(G){const Z=Math.round(G/15);return Z>=0?`UTC+${Z}`:`UTC${Z}`}function d(G,Z){const J=`${Math.abs(G).toFixed(1)}°${G>=0?"N":"S"}`,Q=`${Math.abs(Z).toFixed(1)}°${Z>=0?"E":"W"}`;return`${J}  ${Q}`}const h=document.getElementById("airport-info-card");function f(G){if(!h)return;if(G<0){h.classList.add("hidden");return}const Z=ft[G];document.getElementById("aic-iata").textContent=Z.code,document.getElementById("aic-name").textContent=Z.name,document.getElementById("aic-country").textContent=Z.country||"",document.getElementById("aic-coord").textContent=d(Z.lat,Z.lon),document.getElementById("aic-utc").textContent=u(Z.lon);const J=c(Z),Q=document.getElementById("aic-tier");Q.textContent=J,Q.className="aic-tier-badge aic-tier-"+J.replace(" ","-").toLowerCase(),h.classList.remove("hidden")}const p=document.getElementById("city-globe-canvas");p&&(Yt=new MT(p,G=>{I(G)}),Yt.onHover=f);const _=document.createElement("div");_.className="city-search-wrap",_.innerHTML=`<input id="city-search-input" class="city-search-input" type="text"
       placeholder="Search city or IATA code..." autocomplete="off" spellcheck="false">`,e.parentElement.insertBefore(_,e);const m=document.getElementById("city-search-input");let g="regions",S="",v=-1,M=-1;const T=document.getElementById("city-detail-pane"),E=document.getElementById("cdp-select-btn"),R=document.getElementById("cdp-back");function y(G,Z=4){const J=ft[G];return ft.map((Q,Le)=>({c:Q,i:Le,d:Cg(J.lat,J.lon,Q.lat,Q.lon)})).filter(({i:Q})=>Q!==G).sort((Q,Le)=>Q.d-Le.d).slice(0,Z)}function A(G){if(!T)return;const Z=ft[G],J=hl[Z.code]||{},Q=c(Z),Le="cdp-tier-"+Q.replace(" ","-").toLowerCase();document.getElementById("cdp-iata").textContent=Z.code,document.getElementById("cdp-name").textContent=Z.name,document.getElementById("cdp-country-region").textContent=`${Z.country||""}  ·  ${Z.region}`;const Qe=document.getElementById("cdp-tier");Qe.textContent=Q,Qe.className="cdp-tier "+Le,document.getElementById("cdp-icao").textContent=J.icao||"—",document.getElementById("cdp-elev").textContent=J.elev!=null?`${J.elev.toLocaleString()} ft`:"—",document.getElementById("cdp-rwys").textContent=J.rwys!=null?J.rwys:"—",document.getElementById("cdp-tz").textContent=J.tz||u(Z.lon),document.getElementById("cdp-coord").textContent=d(Z.lat,Z.lon);const tt=document.getElementById("cdp-pax");tt&&(tt.textContent=J.pax!=null?`${J.pax}M/yr`:"—");const $=document.getElementById("cdp-hub");$&&($.textContent=J.hub||"—");const oe=document.getElementById("cdp-terminals");oe&&(oe.textContent=J.terminals!=null?J.terminals:"—");const le=document.getElementById("cdp-rwylen");le&&(le.textContent=J.rwyLen||"—");const Ue=document.getElementById("cdp-fact");J.fact?(Ue.textContent=`"${J.fact}"`,Ue.classList.remove("hidden")):Ue.classList.add("hidden");const Pe=document.getElementById("cdp-nearby"),He=y(G,4);Pe.innerHTML=He.map(({c:it,i:Ve,d:ee})=>`<div class="cdp-nearby-item" data-idx="${Ve}">
        <span class="cdp-nearby-code">${it.code}</span>
        <span class="cdp-nearby-name">${it.name}</span>
        <span class="cdp-nearby-dist">${Math.round(ee)} km</span>
      </div>`).join(""),Pe.querySelectorAll(".cdp-nearby-item").forEach(it=>{it.addEventListener("click",()=>I(+it.dataset.idx))})}function U(){T&&(_.style.display="none",e.style.display="none",T.classList.remove("hidden"))}function C(){T&&(T.classList.add("hidden"),_.style.display="",e.style.display="",Yt?.setFocused(-1),f(-1),M=-1)}function I(G){M=G,A(G),U(),Yt?.setFocused(G),f(G)}R&&R.addEventListener("click",C),E&&E.addEventListener("click",()=>{M>=0&&O(M)});function O(G){v=G,Yt?.setSelected(G),i.classList.add("hidden"),Yt?.pause(),localStorage.setItem("stratum:city-picked","1"),n&&n.classList.remove("nudge"),vT(ft[G])}function z(){g="regions",Yt?.setFilter("All",""),e.innerHTML='<div class="city-region-cards">'+r.map(G=>`<button type="button" class="city-region-card" data-region="${G}">
           <span class="crc-name">${G}</span>
           <div class="crc-bottom">
             <span class="crc-count">${a[G]}</span>
             <span class="crc-unit">airports</span>
           </div>
         </button>`).join("")+"</div>",e.querySelector(".city-region-cards").addEventListener("click",G=>{const Z=G.target.closest(".city-region-card");if(!Z)return;const J=Z.dataset.region,Q=s[J];Q&&Yt?.flyTo(Q.lat,Q.lon),B(J)})}function B(G){g="list",Yt?.setFilter(G,"");const Z=ft.map((J,Q)=>({c:J,i:Q})).filter(({c:J})=>J.region===G);e.innerHTML=`<div class="city-list-header">
         <button type="button" class="city-back-btn" id="city-back-btn">‹ Regions</button>
         <span class="city-list-region-label">${G}</span>
       </div>
       <div class="city-list-items" id="city-list-items">
         ${Z.map(({c:J,i:Q})=>`<div class="city-list-item${Q===v?" active":""}" data-idx="${Q}">
              <span class="cli-code">${J.code}</span>
              <div class="cli-info"><span class="cli-name">${J.name}</span><span class="cli-country">${J.country||""}</span></div>
              <span class="cli-chevron">›</span>
            </div>`).join("")}
       </div>`,document.getElementById("city-back-btn").addEventListener("click",()=>{m.value="",S="",z()}),k()}function H(G){g="search",Yt?.setFilter("All",G);const Z=ft.map((J,Q)=>({c:J,i:Q})).filter(({c:J})=>J.name.toLowerCase().includes(G)||J.code.toLowerCase().startsWith(G)||J.country&&J.country.toLowerCase().includes(G));if(!Z.length){e.innerHTML='<div class="city-no-results">No airports found</div>';return}e.innerHTML=`<div class="city-list-items" id="city-list-items">
         ${Z.map(({c:J,i:Q})=>`<div class="city-list-item${Q===v?" active":""}" data-idx="${Q}">
              <span class="cli-code">${J.code}</span>
              <div class="cli-info"><span class="cli-name">${J.name}</span><span class="cli-country">${J.country||""}</span></div>
              <span class="cli-chevron">›</span>
            </div>`).join("")}
       </div>`,k()}function k(){const G=document.getElementById("city-list-items");G&&(G.addEventListener("mouseover",Z=>{const J=Z.target.closest(".city-list-item");if(J){const Q=+J.dataset.idx;Yt&&(Yt.hoveredIdx=Q),f(Q)}}),G.addEventListener("mouseleave",()=>{Yt&&(Yt.hoveredIdx=-1),f(-1)}),G.addEventListener("click",Z=>{const J=Z.target.closest(".city-list-item");J&&I(+J.dataset.idx)}))}m.addEventListener("input",()=>{S=m.value.toLowerCase().trim(),S?H(S):g==="search"&&z()});const ie=()=>{i.classList.add("hidden"),Yt?.pause()};i.addEventListener("keydown",G=>{G.key==="Escape"&&(g==="list"?(m.value="",S="",z()):ie())}),t&&t.addEventListener("click",ie),i.addEventListener("click",G=>{G.target===i&&ie()}),n&&(n.addEventListener("click",()=>Gu()),localStorage.getItem("stratum:city-picked")||n.classList.add("nudge")),localStorage.getItem("stratum:city-picked")||setTimeout(()=>Gu(),1200),z()}function Gu(){const i=document.getElementById("city-overlay");i&&(i.classList.remove("hidden"),Yt?.resume(),setTimeout(()=>{const e=document.getElementById("city-search-input");e&&e.focus()},60))}function bT(){const i=document.getElementById("search-input"),e=document.getElementById("search-results");if(!i||!e)return;let t=null,n=-1;function s(){return[...e.querySelectorAll(".search-result")]}function r(l,c){c.forEach((u,d)=>{u.classList.toggle("selected",d===l),d===l&&u.scrollIntoView({block:"nearest"})}),n=l}function a(){e.innerHTML="",e.classList.remove("open"),n=-1}i.addEventListener("input",()=>{clearTimeout(t),t=setTimeout(()=>{const l=i.value.trim().toUpperCase();if(n=-1,l.length<2||!$e){a();return}const c=$e.search(l,8);if(c.length===0){e.innerHTML='<div class="search-result"><span class="search-result-info">No results</span></div>',e.classList.add("open");return}e.innerHTML=c.map(u=>{const d=u.getDisplayData(),h=d.callsign||d.icao24,f=[d.aircraftType,d.registration].filter(Boolean).join(" · ");return`<div class="search-result" role="option" data-icao="${d.icao24}">
          <span class="search-result-callsign">${h}</span>
          <span class="search-result-info">${f||d.icao24}</span>
        </div>`}).join(""),e.classList.add("open"),e.querySelectorAll(".search-result").forEach(u=>{u.addEventListener("click",()=>o(u.dataset.icao))})},150)});function o(l){const c=$e.getByIcao(l);if(c){const{lat:u,lon:d}=xl();vl(c,u,d),$e.selectAircraft(c),Bh(c),i.value="",a(),i.blur()}}i.addEventListener("keydown",l=>{const c=s();if(l.key==="ArrowDown")l.preventDefault(),r(Math.min(n+1,c.length-1),c);else if(l.key==="ArrowUp")l.preventDefault(),r(Math.max(n-1,0),c);else if(l.key==="Enter"&&(l.preventDefault(),n>=0&&c[n])){const u=c[n].dataset.icao;u&&o(u)}}),i.addEventListener("focus",()=>i.select()),i.addEventListener("blur",()=>{setTimeout(()=>a(),200)}),document.addEventListener("keydown",l=>{if(l.key==="/"&&document.activeElement!==i&&(l.preventDefault(),i.focus()),l.key==="Escape"){const c=document.getElementById("city-overlay");if(c&&!c.classList.contains("hidden")){c.classList.add("hidden");return}document.activeElement===i&&(i.blur(),i.value="",a()),as&&wa(),Di&&yr()}})}async function ET(){const i=ft[0];jo=i,Hm(i.lat,i.lon),eg(i.name,i.code),ng(0,i.lat,i.lon),$e=new hE(Ot,i.lat,i.lon),mm(i.lat,i.lon),ym(Ot,i.lat,i.lon).then(()=>{const e=Lh();e&&ku(e.airports.length)}),Bb(dT,fT),bT(),AT(),KE(),Tg()}ET();
