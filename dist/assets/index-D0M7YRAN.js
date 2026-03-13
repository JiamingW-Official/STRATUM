(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))n(s);new MutationObserver(s=>{for(const r of s)if(r.type==="childList")for(const a of r.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&n(a)}).observe(document,{childList:!0,subtree:!0});function t(s){const r={};return s.integrity&&(r.integrity=s.integrity),s.referrerPolicy&&(r.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?r.credentials="include":s.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function n(s){if(s.ep)return;s.ep=!0;const r=t(s);fetch(s.href,r)}})();const yh="183",Us={ROTATE:0,DOLLY:1,PAN:2},Ds={ROTATE:0,PAN:1,DOLLY_PAN:2,DOLLY_ROTATE:3},Xm=0,Au=1,Km=2,mo=1,Ym=2,Pr=3,di=0,Jt=1,At=2,Yn=0,Os=1,Cn=2,wu=3,Cu=4,qm=5,Hi=100,jm=101,$m=102,Jm=103,Zm=104,Qm=200,eg=201,tg=202,ng=203,lc=204,cc=205,ig=206,sg=207,rg=208,ag=209,og=210,lg=211,cg=212,hg=213,ug=214,hc=0,uc=1,dc=2,Gs=3,fc=4,pc=5,mc=6,gc=7,Sh=0,dg=1,fg=2,qn=0,Eh=1,bh=2,Th=3,Wo=4,Ah=5,wh=6,Ch=7,Ru="attached",pg="detached",ep=300,Yi=301,Vs=302,rl=303,al=304,Xo=306,Ws=1e3,mn=1001,Do=1002,wt=1003,tp=1004,Lr=1005,_t=1006,go=1007,Rn=1008,on=1009,np=1010,ip=1011,$r=1012,Rh=1013,jn=1014,gn=1015,ln=1016,Ph=1017,Lh=1018,Jr=1020,sp=35902,rp=35899,ap=1021,op=1022,_n=1023,fi=1026,Wi=1027,Dh=1028,Ih=1029,Xs=1030,Nh=1031,Uh=1033,_o=33776,xo=33777,vo=33778,Mo=33779,_c=35840,xc=35841,vc=35842,Mc=35843,yc=36196,Sc=37492,Ec=37496,bc=37488,Tc=37489,Ac=37490,wc=37491,Cc=37808,Rc=37809,Pc=37810,Lc=37811,Dc=37812,Ic=37813,Nc=37814,Uc=37815,Oc=37816,Fc=37817,Bc=37818,zc=37819,kc=37820,Hc=37821,Gc=36492,Vc=36494,Wc=36495,Xc=36283,Kc=36284,Yc=36285,qc=36286,Zr=2300,Qr=2301,ol=2302,Pu=2303,Lu=2400,Du=2401,Iu=2402,mg=2500,gg=0,lp=1,jc=2,_g=3200,Oh=0,xg=1,Ti="",Nt="srgb",Zt="srgb-linear",Io="linear",nt="srgb",rs=7680,Nu=519,vg=512,Mg=513,yg=514,Fh=515,Sg=516,Eg=517,Bh=518,bg=519,$c=35044,Uu="300 es",Wn=2e3,ea=2001;function Tg(i){for(let e=i.length-1;e>=0;--e)if(i[e]>=65535)return!0;return!1}function Ag(i){return ArrayBuffer.isView(i)&&!(i instanceof DataView)}function ta(i){return document.createElementNS("http://www.w3.org/1999/xhtml",i)}function wg(){const i=ta("canvas");return i.style.display="block",i}const Ou={};function No(...i){const e="THREE."+i.shift();console.log(e,...i)}function cp(i){const e=i[0];if(typeof e=="string"&&e.startsWith("TSL:")){const t=i[1];t&&t.isStackTrace?i[0]+=" "+t.getLocation():i[1]='Stack trace not available. Enable "THREE.Node.captureStackTrace" to capture stack traces.'}return i}function Re(...i){i=cp(i);const e="THREE."+i.shift();{const t=i[0];t&&t.isStackTrace?console.warn(t.getError(e)):console.warn(e,...i)}}function Be(...i){i=cp(i);const e="THREE."+i.shift();{const t=i[0];t&&t.isStackTrace?console.error(t.getError(e)):console.error(e,...i)}}function Uo(...i){const e=i.join(" ");e in Ou||(Ou[e]=!0,Re(...i))}function Cg(i,e,t){return new Promise(function(n,s){function r(){switch(i.clientWaitSync(e,i.SYNC_FLUSH_COMMANDS_BIT,0)){case i.WAIT_FAILED:s();break;case i.TIMEOUT_EXPIRED:setTimeout(r,t);break;default:n()}}setTimeout(r,t)})}const Rg={[hc]:uc,[dc]:mc,[fc]:gc,[Gs]:pc,[uc]:hc,[mc]:dc,[gc]:fc,[pc]:Gs};class Zi{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});const n=this._listeners;n[e]===void 0&&(n[e]=[]),n[e].indexOf(t)===-1&&n[e].push(t)}hasEventListener(e,t){const n=this._listeners;return n===void 0?!1:n[e]!==void 0&&n[e].indexOf(t)!==-1}removeEventListener(e,t){const n=this._listeners;if(n===void 0)return;const s=n[e];if(s!==void 0){const r=s.indexOf(t);r!==-1&&s.splice(r,1)}}dispatchEvent(e){const t=this._listeners;if(t===void 0)return;const n=t[e.type];if(n!==void 0){e.target=this;const s=n.slice(0);for(let r=0,a=s.length;r<a;r++)s[r].call(this,e);e.target=null}}}const Wt=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"];let Fu=1234567;const zr=Math.PI/180,Ks=180/Math.PI;function xn(){const i=Math.random()*4294967295|0,e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(Wt[i&255]+Wt[i>>8&255]+Wt[i>>16&255]+Wt[i>>24&255]+"-"+Wt[e&255]+Wt[e>>8&255]+"-"+Wt[e>>16&15|64]+Wt[e>>24&255]+"-"+Wt[t&63|128]+Wt[t>>8&255]+"-"+Wt[t>>16&255]+Wt[t>>24&255]+Wt[n&255]+Wt[n>>8&255]+Wt[n>>16&255]+Wt[n>>24&255]).toLowerCase()}function Ge(i,e,t){return Math.max(e,Math.min(t,i))}function zh(i,e){return(i%e+e)%e}function Pg(i,e,t,n,s){return n+(i-e)*(s-n)/(t-e)}function Lg(i,e,t){return i!==e?(t-i)/(e-i):0}function kr(i,e,t){return(1-t)*i+t*e}function Dg(i,e,t,n){return kr(i,e,1-Math.exp(-t*n))}function Ig(i,e=1){return e-Math.abs(zh(i,e*2)-e)}function Ng(i,e,t){return i<=e?0:i>=t?1:(i=(i-e)/(t-e),i*i*(3-2*i))}function Ug(i,e,t){return i<=e?0:i>=t?1:(i=(i-e)/(t-e),i*i*i*(i*(i*6-15)+10))}function Og(i,e){return i+Math.floor(Math.random()*(e-i+1))}function Fg(i,e){return i+Math.random()*(e-i)}function Bg(i){return i*(.5-Math.random())}function zg(i){i!==void 0&&(Fu=i);let e=Fu+=1831565813;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}function kg(i){return i*zr}function Hg(i){return i*Ks}function Gg(i){return(i&i-1)===0&&i!==0}function Vg(i){return Math.pow(2,Math.ceil(Math.log(i)/Math.LN2))}function Wg(i){return Math.pow(2,Math.floor(Math.log(i)/Math.LN2))}function Xg(i,e,t,n,s){const r=Math.cos,a=Math.sin,o=r(t/2),l=a(t/2),c=r((e+n)/2),h=a((e+n)/2),u=r((e-n)/2),d=a((e-n)/2),f=r((n-e)/2),g=a((n-e)/2);switch(s){case"XYX":i.set(o*h,l*u,l*d,o*c);break;case"YZY":i.set(l*d,o*h,l*u,o*c);break;case"ZXZ":i.set(l*u,l*d,o*h,o*c);break;case"XZX":i.set(o*h,l*g,l*f,o*c);break;case"YXY":i.set(l*f,o*h,l*g,o*c);break;case"ZYZ":i.set(l*g,l*f,o*h,o*c);break;default:Re("MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+s)}}function An(i,e){switch(e.constructor){case Float32Array:return i;case Uint32Array:return i/4294967295;case Uint16Array:return i/65535;case Uint8Array:return i/255;case Int32Array:return Math.max(i/2147483647,-1);case Int16Array:return Math.max(i/32767,-1);case Int8Array:return Math.max(i/127,-1);default:throw new Error("Invalid component type.")}}function ot(i,e){switch(e.constructor){case Float32Array:return i;case Uint32Array:return Math.round(i*4294967295);case Uint16Array:return Math.round(i*65535);case Uint8Array:return Math.round(i*255);case Int32Array:return Math.round(i*2147483647);case Int16Array:return Math.round(i*32767);case Int8Array:return Math.round(i*127);default:throw new Error("Invalid component type.")}}const kh={DEG2RAD:zr,RAD2DEG:Ks,generateUUID:xn,clamp:Ge,euclideanModulo:zh,mapLinear:Pg,inverseLerp:Lg,lerp:kr,damp:Dg,pingpong:Ig,smoothstep:Ng,smootherstep:Ug,randInt:Og,randFloat:Fg,randFloatSpread:Bg,seededRandom:zg,degToRad:kg,radToDeg:Hg,isPowerOfTwo:Gg,ceilPowerOfTwo:Vg,floorPowerOfTwo:Wg,setQuaternionFromProperEuler:Xg,normalize:ot,denormalize:An};class j{constructor(e=0,t=0){j.prototype.isVector2=!0,this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){const t=this.x,n=this.y,s=e.elements;return this.x=s[0]*t+s[3]*n+s[6],this.y=s[1]*t+s[4]*n+s[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=Ge(this.x,e.x,t.x),this.y=Ge(this.y,e.y,t.y),this}clampScalar(e,t){return this.x=Ge(this.x,e,t),this.y=Ge(this.y,e,t),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Ge(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const n=this.dot(e)/t;return Math.acos(Ge(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,n=this.y-e.y;return t*t+n*n}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){const n=Math.cos(t),s=Math.sin(t),r=this.x-e.x,a=this.y-e.y;return this.x=r*n-a*s+e.x,this.y=r*s+a*n+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class In{constructor(e=0,t=0,n=0,s=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=n,this._w=s}static slerpFlat(e,t,n,s,r,a,o){let l=n[s+0],c=n[s+1],h=n[s+2],u=n[s+3],d=r[a+0],f=r[a+1],g=r[a+2],_=r[a+3];if(u!==_||l!==d||c!==f||h!==g){let p=l*d+c*f+h*g+u*_;p<0&&(d=-d,f=-f,g=-g,_=-_,p=-p);let m=1-o;if(p<.9995){const M=Math.acos(p),y=Math.sin(M);m=Math.sin(m*M)/y,o=Math.sin(o*M)/y,l=l*m+d*o,c=c*m+f*o,h=h*m+g*o,u=u*m+_*o}else{l=l*m+d*o,c=c*m+f*o,h=h*m+g*o,u=u*m+_*o;const M=1/Math.sqrt(l*l+c*c+h*h+u*u);l*=M,c*=M,h*=M,u*=M}}e[t]=l,e[t+1]=c,e[t+2]=h,e[t+3]=u}static multiplyQuaternionsFlat(e,t,n,s,r,a){const o=n[s],l=n[s+1],c=n[s+2],h=n[s+3],u=r[a],d=r[a+1],f=r[a+2],g=r[a+3];return e[t]=o*g+h*u+l*f-c*d,e[t+1]=l*g+h*d+c*u-o*f,e[t+2]=c*g+h*f+o*d-l*u,e[t+3]=h*g-o*u-l*d-c*f,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,n,s){return this._x=e,this._y=t,this._z=n,this._w=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){const n=e._x,s=e._y,r=e._z,a=e._order,o=Math.cos,l=Math.sin,c=o(n/2),h=o(s/2),u=o(r/2),d=l(n/2),f=l(s/2),g=l(r/2);switch(a){case"XYZ":this._x=d*h*u+c*f*g,this._y=c*f*u-d*h*g,this._z=c*h*g+d*f*u,this._w=c*h*u-d*f*g;break;case"YXZ":this._x=d*h*u+c*f*g,this._y=c*f*u-d*h*g,this._z=c*h*g-d*f*u,this._w=c*h*u+d*f*g;break;case"ZXY":this._x=d*h*u-c*f*g,this._y=c*f*u+d*h*g,this._z=c*h*g+d*f*u,this._w=c*h*u-d*f*g;break;case"ZYX":this._x=d*h*u-c*f*g,this._y=c*f*u+d*h*g,this._z=c*h*g-d*f*u,this._w=c*h*u+d*f*g;break;case"YZX":this._x=d*h*u+c*f*g,this._y=c*f*u+d*h*g,this._z=c*h*g-d*f*u,this._w=c*h*u-d*f*g;break;case"XZY":this._x=d*h*u-c*f*g,this._y=c*f*u-d*h*g,this._z=c*h*g+d*f*u,this._w=c*h*u+d*f*g;break;default:Re("Quaternion: .setFromEuler() encountered an unknown order: "+a)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){const n=t/2,s=Math.sin(n);return this._x=e.x*s,this._y=e.y*s,this._z=e.z*s,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(e){const t=e.elements,n=t[0],s=t[4],r=t[8],a=t[1],o=t[5],l=t[9],c=t[2],h=t[6],u=t[10],d=n+o+u;if(d>0){const f=.5/Math.sqrt(d+1);this._w=.25/f,this._x=(h-l)*f,this._y=(r-c)*f,this._z=(a-s)*f}else if(n>o&&n>u){const f=2*Math.sqrt(1+n-o-u);this._w=(h-l)/f,this._x=.25*f,this._y=(s+a)/f,this._z=(r+c)/f}else if(o>u){const f=2*Math.sqrt(1+o-n-u);this._w=(r-c)/f,this._x=(s+a)/f,this._y=.25*f,this._z=(l+h)/f}else{const f=2*Math.sqrt(1+u-n-o);this._w=(a-s)/f,this._x=(r+c)/f,this._y=(l+h)/f,this._z=.25*f}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let n=e.dot(t)+1;return n<1e-8?(n=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=n):(this._x=0,this._y=-e.z,this._z=e.y,this._w=n)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=n),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(Ge(this.dot(e),-1,1)))}rotateTowards(e,t){const n=this.angleTo(e);if(n===0)return this;const s=Math.min(1,t/n);return this.slerp(e,s),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){const n=e._x,s=e._y,r=e._z,a=e._w,o=t._x,l=t._y,c=t._z,h=t._w;return this._x=n*h+a*o+s*c-r*l,this._y=s*h+a*l+r*o-n*c,this._z=r*h+a*c+n*l-s*o,this._w=a*h-n*o-s*l-r*c,this._onChangeCallback(),this}slerp(e,t){let n=e._x,s=e._y,r=e._z,a=e._w,o=this.dot(e);o<0&&(n=-n,s=-s,r=-r,a=-a,o=-o);let l=1-t;if(o<.9995){const c=Math.acos(o),h=Math.sin(c);l=Math.sin(l*c)/h,t=Math.sin(t*c)/h,this._x=this._x*l+n*t,this._y=this._y*l+s*t,this._z=this._z*l+r*t,this._w=this._w*l+a*t,this._onChangeCallback()}else this._x=this._x*l+n*t,this._y=this._y*l+s*t,this._z=this._z*l+r*t,this._w=this._w*l+a*t,this.normalize();return this}slerpQuaternions(e,t,n){return this.copy(e).slerp(t,n)}random(){const e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),n=Math.random(),s=Math.sqrt(1-n),r=Math.sqrt(n);return this.set(s*Math.sin(e),s*Math.cos(e),r*Math.sin(t),r*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class P{constructor(e=0,t=0,n=0){P.prototype.isVector3=!0,this.x=e,this.y=t,this.z=n}set(e,t,n){return n===void 0&&(n=this.z),this.x=e,this.y=t,this.z=n,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(Bu.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(Bu.setFromAxisAngle(e,t))}applyMatrix3(e){const t=this.x,n=this.y,s=this.z,r=e.elements;return this.x=r[0]*t+r[3]*n+r[6]*s,this.y=r[1]*t+r[4]*n+r[7]*s,this.z=r[2]*t+r[5]*n+r[8]*s,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){const t=this.x,n=this.y,s=this.z,r=e.elements,a=1/(r[3]*t+r[7]*n+r[11]*s+r[15]);return this.x=(r[0]*t+r[4]*n+r[8]*s+r[12])*a,this.y=(r[1]*t+r[5]*n+r[9]*s+r[13])*a,this.z=(r[2]*t+r[6]*n+r[10]*s+r[14])*a,this}applyQuaternion(e){const t=this.x,n=this.y,s=this.z,r=e.x,a=e.y,o=e.z,l=e.w,c=2*(a*s-o*n),h=2*(o*t-r*s),u=2*(r*n-a*t);return this.x=t+l*c+a*u-o*h,this.y=n+l*h+o*c-r*u,this.z=s+l*u+r*h-a*c,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){const t=this.x,n=this.y,s=this.z,r=e.elements;return this.x=r[0]*t+r[4]*n+r[8]*s,this.y=r[1]*t+r[5]*n+r[9]*s,this.z=r[2]*t+r[6]*n+r[10]*s,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=Ge(this.x,e.x,t.x),this.y=Ge(this.y,e.y,t.y),this.z=Ge(this.z,e.z,t.z),this}clampScalar(e,t){return this.x=Ge(this.x,e,t),this.y=Ge(this.y,e,t),this.z=Ge(this.z,e,t),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Ge(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){const n=e.x,s=e.y,r=e.z,a=t.x,o=t.y,l=t.z;return this.x=s*l-r*o,this.y=r*a-n*l,this.z=n*o-s*a,this}projectOnVector(e){const t=e.lengthSq();if(t===0)return this.set(0,0,0);const n=e.dot(this)/t;return this.copy(e).multiplyScalar(n)}projectOnPlane(e){return ll.copy(this).projectOnVector(e),this.sub(ll)}reflect(e){return this.sub(ll.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const n=this.dot(e)/t;return Math.acos(Ge(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,n=this.y-e.y,s=this.z-e.z;return t*t+n*n+s*s}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,n){const s=Math.sin(t)*e;return this.x=s*Math.sin(n),this.y=Math.cos(t)*e,this.z=s*Math.cos(n),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,n){return this.x=e*Math.sin(t),this.y=n,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){const t=this.setFromMatrixColumn(e,0).length(),n=this.setFromMatrixColumn(e,1).length(),s=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=n,this.z=s,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const e=Math.random()*Math.PI*2,t=Math.random()*2-1,n=Math.sqrt(1-t*t);return this.x=n*Math.cos(e),this.y=t,this.z=n*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const ll=new P,Bu=new In;class Ye{constructor(e,t,n,s,r,a,o,l,c){Ye.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,n,s,r,a,o,l,c)}set(e,t,n,s,r,a,o,l,c){const h=this.elements;return h[0]=e,h[1]=s,h[2]=o,h[3]=t,h[4]=r,h[5]=l,h[6]=n,h[7]=a,h[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){const t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],this}extractBasis(e,t,n){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(e){const t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const n=e.elements,s=t.elements,r=this.elements,a=n[0],o=n[3],l=n[6],c=n[1],h=n[4],u=n[7],d=n[2],f=n[5],g=n[8],_=s[0],p=s[3],m=s[6],M=s[1],y=s[4],S=s[7],w=s[2],T=s[5],L=s[8];return r[0]=a*_+o*M+l*w,r[3]=a*p+o*y+l*T,r[6]=a*m+o*S+l*L,r[1]=c*_+h*M+u*w,r[4]=c*p+h*y+u*T,r[7]=c*m+h*S+u*L,r[2]=d*_+f*M+g*w,r[5]=d*p+f*y+g*T,r[8]=d*m+f*S+g*L,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){const e=this.elements,t=e[0],n=e[1],s=e[2],r=e[3],a=e[4],o=e[5],l=e[6],c=e[7],h=e[8];return t*a*h-t*o*c-n*r*h+n*o*l+s*r*c-s*a*l}invert(){const e=this.elements,t=e[0],n=e[1],s=e[2],r=e[3],a=e[4],o=e[5],l=e[6],c=e[7],h=e[8],u=h*a-o*c,d=o*l-h*r,f=c*r-a*l,g=t*u+n*d+s*f;if(g===0)return this.set(0,0,0,0,0,0,0,0,0);const _=1/g;return e[0]=u*_,e[1]=(s*c-h*n)*_,e[2]=(o*n-s*a)*_,e[3]=d*_,e[4]=(h*t-s*l)*_,e[5]=(s*r-o*t)*_,e[6]=f*_,e[7]=(n*l-c*t)*_,e[8]=(a*t-n*r)*_,this}transpose(){let e;const t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){const t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,n,s,r,a,o){const l=Math.cos(r),c=Math.sin(r);return this.set(n*l,n*c,-n*(l*a+c*o)+a+e,-s*c,s*l,-s*(-c*a+l*o)+o+t,0,0,1),this}scale(e,t){return this.premultiply(cl.makeScale(e,t)),this}rotate(e){return this.premultiply(cl.makeRotation(-e)),this}translate(e,t){return this.premultiply(cl.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){const t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,n,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){const t=this.elements,n=e.elements;for(let s=0;s<9;s++)if(t[s]!==n[s])return!1;return!0}fromArray(e,t=0){for(let n=0;n<9;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){const n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e}clone(){return new this.constructor().fromArray(this.elements)}}const cl=new Ye,zu=new Ye().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),ku=new Ye().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function Kg(){const i={enabled:!0,workingColorSpace:Zt,spaces:{},convert:function(s,r,a){return this.enabled===!1||r===a||!r||!a||(this.spaces[r].transfer===nt&&(s.r=ui(s.r),s.g=ui(s.g),s.b=ui(s.b)),this.spaces[r].primaries!==this.spaces[a].primaries&&(s.applyMatrix3(this.spaces[r].toXYZ),s.applyMatrix3(this.spaces[a].fromXYZ)),this.spaces[a].transfer===nt&&(s.r=Fs(s.r),s.g=Fs(s.g),s.b=Fs(s.b))),s},workingToColorSpace:function(s,r){return this.convert(s,this.workingColorSpace,r)},colorSpaceToWorking:function(s,r){return this.convert(s,r,this.workingColorSpace)},getPrimaries:function(s){return this.spaces[s].primaries},getTransfer:function(s){return s===Ti?Io:this.spaces[s].transfer},getToneMappingMode:function(s){return this.spaces[s].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(s,r=this.workingColorSpace){return s.fromArray(this.spaces[r].luminanceCoefficients)},define:function(s){Object.assign(this.spaces,s)},_getMatrix:function(s,r,a){return s.copy(this.spaces[r].toXYZ).multiply(this.spaces[a].fromXYZ)},_getDrawingBufferColorSpace:function(s){return this.spaces[s].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(s=this.workingColorSpace){return this.spaces[s].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(s,r){return Uo("ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace()."),i.workingToColorSpace(s,r)},toWorkingColorSpace:function(s,r){return Uo("ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking()."),i.colorSpaceToWorking(s,r)}},e=[.64,.33,.3,.6,.15,.06],t=[.2126,.7152,.0722],n=[.3127,.329];return i.define({[Zt]:{primaries:e,whitePoint:n,transfer:Io,toXYZ:zu,fromXYZ:ku,luminanceCoefficients:t,workingColorSpaceConfig:{unpackColorSpace:Nt},outputColorSpaceConfig:{drawingBufferColorSpace:Nt}},[Nt]:{primaries:e,whitePoint:n,transfer:nt,toXYZ:zu,fromXYZ:ku,luminanceCoefficients:t,outputColorSpaceConfig:{drawingBufferColorSpace:Nt}}}),i}const Qe=Kg();function ui(i){return i<.04045?i*.0773993808:Math.pow(i*.9478672986+.0521327014,2.4)}function Fs(i){return i<.0031308?i*12.92:1.055*Math.pow(i,.41666)-.055}let as;class Yg{static getDataURL(e,t="image/png"){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let n;if(e instanceof HTMLCanvasElement)n=e;else{as===void 0&&(as=ta("canvas")),as.width=e.width,as.height=e.height;const s=as.getContext("2d");e instanceof ImageData?s.putImageData(e,0,0):s.drawImage(e,0,0,e.width,e.height),n=as}return n.toDataURL(t)}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){const t=ta("canvas");t.width=e.width,t.height=e.height;const n=t.getContext("2d");n.drawImage(e,0,0,e.width,e.height);const s=n.getImageData(0,0,e.width,e.height),r=s.data;for(let a=0;a<r.length;a++)r[a]=ui(r[a]/255)*255;return n.putImageData(s,0,0),t}else if(e.data){const t=e.data.slice(0);for(let n=0;n<t.length;n++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[n]=Math.floor(ui(t[n]/255)*255):t[n]=ui(t[n]);return{data:t,width:e.width,height:e.height}}else return Re("ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}}let qg=0;class Hh{constructor(e=null){this.isSource=!0,Object.defineProperty(this,"id",{value:qg++}),this.uuid=xn(),this.data=e,this.dataReady=!0,this.version=0}getSize(e){const t=this.data;return typeof HTMLVideoElement<"u"&&t instanceof HTMLVideoElement?e.set(t.videoWidth,t.videoHeight,0):typeof VideoFrame<"u"&&t instanceof VideoFrame?e.set(t.displayHeight,t.displayWidth,0):t!==null?e.set(t.width,t.height,t.depth||0):e.set(0,0,0),e}set needsUpdate(e){e===!0&&this.version++}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];const n={uuid:this.uuid,url:""},s=this.data;if(s!==null){let r;if(Array.isArray(s)){r=[];for(let a=0,o=s.length;a<o;a++)s[a].isDataTexture?r.push(hl(s[a].image)):r.push(hl(s[a]))}else r=hl(s);n.url=r}return t||(e.images[this.uuid]=n),n}}function hl(i){return typeof HTMLImageElement<"u"&&i instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&i instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&i instanceof ImageBitmap?Yg.getDataURL(i):i.data?{data:Array.from(i.data),width:i.width,height:i.height,type:i.data.constructor.name}:(Re("Texture: Unable to serialize Texture."),{})}let jg=0;const ul=new P;class Ct extends Zi{constructor(e=Ct.DEFAULT_IMAGE,t=Ct.DEFAULT_MAPPING,n=mn,s=mn,r=_t,a=Rn,o=_n,l=on,c=Ct.DEFAULT_ANISOTROPY,h=Ti){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:jg++}),this.uuid=xn(),this.name="",this.source=new Hh(e),this.mipmaps=[],this.mapping=t,this.channel=0,this.wrapS=n,this.wrapT=s,this.magFilter=r,this.minFilter=a,this.anisotropy=c,this.format=o,this.internalFormat=null,this.type=l,this.offset=new j(0,0),this.repeat=new j(1,1),this.center=new j(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new Ye,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=h,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(e&&e.depth&&e.depth>1),this.pmremVersion=0}get width(){return this.source.getSize(ul).x}get height(){return this.source.getSize(ul).y}get depth(){return this.source.getSize(ul).z}get image(){return this.source.data}set image(e=null){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.renderTarget=e.renderTarget,this.isRenderTargetTexture=e.isRenderTargetTexture,this.isArrayTexture=e.isArrayTexture,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}setValues(e){for(const t in e){const n=e[t];if(n===void 0){Re(`Texture.setValues(): parameter '${t}' has value of undefined.`);continue}const s=this[t];if(s===void 0){Re(`Texture.setValues(): property '${t}' does not exist.`);continue}s&&n&&s.isVector2&&n.isVector2||s&&n&&s.isVector3&&n.isVector3||s&&n&&s.isMatrix3&&n.isMatrix3?s.copy(n):this[t]=n}}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];const n={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),t||(e.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==ep)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case Ws:e.x=e.x-Math.floor(e.x);break;case mn:e.x=e.x<0?0:1;break;case Do:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case Ws:e.y=e.y-Math.floor(e.y);break;case mn:e.y=e.y<0?0:1;break;case Do:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}}Ct.DEFAULT_IMAGE=null;Ct.DEFAULT_MAPPING=ep;Ct.DEFAULT_ANISOTROPY=1;class it{constructor(e=0,t=0,n=0,s=1){it.prototype.isVector4=!0,this.x=e,this.y=t,this.z=n,this.w=s}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,n,s){return this.x=e,this.y=t,this.z=n,this.w=s,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){const t=this.x,n=this.y,s=this.z,r=this.w,a=e.elements;return this.x=a[0]*t+a[4]*n+a[8]*s+a[12]*r,this.y=a[1]*t+a[5]*n+a[9]*s+a[13]*r,this.z=a[2]*t+a[6]*n+a[10]*s+a[14]*r,this.w=a[3]*t+a[7]*n+a[11]*s+a[15]*r,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);const t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,n,s,r;const l=e.elements,c=l[0],h=l[4],u=l[8],d=l[1],f=l[5],g=l[9],_=l[2],p=l[6],m=l[10];if(Math.abs(h-d)<.01&&Math.abs(u-_)<.01&&Math.abs(g-p)<.01){if(Math.abs(h+d)<.1&&Math.abs(u+_)<.1&&Math.abs(g+p)<.1&&Math.abs(c+f+m-3)<.1)return this.set(1,0,0,0),this;t=Math.PI;const y=(c+1)/2,S=(f+1)/2,w=(m+1)/2,T=(h+d)/4,L=(u+_)/4,x=(g+p)/4;return y>S&&y>w?y<.01?(n=0,s=.707106781,r=.707106781):(n=Math.sqrt(y),s=T/n,r=L/n):S>w?S<.01?(n=.707106781,s=0,r=.707106781):(s=Math.sqrt(S),n=T/s,r=x/s):w<.01?(n=.707106781,s=.707106781,r=0):(r=Math.sqrt(w),n=L/r,s=x/r),this.set(n,s,r,t),this}let M=Math.sqrt((p-g)*(p-g)+(u-_)*(u-_)+(d-h)*(d-h));return Math.abs(M)<.001&&(M=1),this.x=(p-g)/M,this.y=(u-_)/M,this.z=(d-h)/M,this.w=Math.acos((c+f+m-1)/2),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this.w=t[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=Ge(this.x,e.x,t.x),this.y=Ge(this.y,e.y,t.y),this.z=Ge(this.z,e.z,t.z),this.w=Ge(this.w,e.w,t.w),this}clampScalar(e,t){return this.x=Ge(this.x,e,t),this.y=Ge(this.y,e,t),this.z=Ge(this.z,e,t),this.w=Ge(this.w,e,t),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Ge(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this.w=e.w+(t.w-e.w)*n,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class $g extends Zi{constructor(e=1,t=1,n={}){super(),n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:_t,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1},n),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=n.depth,this.scissor=new it(0,0,e,t),this.scissorTest=!1,this.viewport=new it(0,0,e,t),this.textures=[];const s={width:e,height:t,depth:n.depth},r=new Ct(s),a=n.count;for(let o=0;o<a;o++)this.textures[o]=r.clone(),this.textures[o].isRenderTargetTexture=!0,this.textures[o].renderTarget=this;this._setTextureOptions(n),this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this._depthTexture=null,this.depthTexture=n.depthTexture,this.samples=n.samples,this.multiview=n.multiview}_setTextureOptions(e={}){const t={minFilter:_t,generateMipmaps:!1,flipY:!1,internalFormat:null};e.mapping!==void 0&&(t.mapping=e.mapping),e.wrapS!==void 0&&(t.wrapS=e.wrapS),e.wrapT!==void 0&&(t.wrapT=e.wrapT),e.wrapR!==void 0&&(t.wrapR=e.wrapR),e.magFilter!==void 0&&(t.magFilter=e.magFilter),e.minFilter!==void 0&&(t.minFilter=e.minFilter),e.format!==void 0&&(t.format=e.format),e.type!==void 0&&(t.type=e.type),e.anisotropy!==void 0&&(t.anisotropy=e.anisotropy),e.colorSpace!==void 0&&(t.colorSpace=e.colorSpace),e.flipY!==void 0&&(t.flipY=e.flipY),e.generateMipmaps!==void 0&&(t.generateMipmaps=e.generateMipmaps),e.internalFormat!==void 0&&(t.internalFormat=e.internalFormat);for(let n=0;n<this.textures.length;n++)this.textures[n].setValues(t)}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}set depthTexture(e){this._depthTexture!==null&&(this._depthTexture.renderTarget=null),e!==null&&(e.renderTarget=this),this._depthTexture=e}get depthTexture(){return this._depthTexture}setSize(e,t,n=1){if(this.width!==e||this.height!==t||this.depth!==n){this.width=e,this.height=t,this.depth=n;for(let s=0,r=this.textures.length;s<r;s++)this.textures[s].image.width=e,this.textures[s].image.height=t,this.textures[s].image.depth=n,this.textures[s].isData3DTexture!==!0&&(this.textures[s].isArrayTexture=this.textures[s].image.depth>1);this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let t=0,n=e.textures.length;t<n;t++){this.textures[t]=e.textures[t].clone(),this.textures[t].isRenderTargetTexture=!0,this.textures[t].renderTarget=this;const s=Object.assign({},e.textures[t].image);this.textures[t].source=new Hh(s)}return this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,e.depthTexture!==null&&(this.depthTexture=e.depthTexture.clone()),this.samples=e.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class nn extends $g{constructor(e=1,t=1,n={}){super(e,t,n),this.isWebGLRenderTarget=!0}}class hp extends Ct{constructor(e=null,t=1,n=1,s=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:n,depth:s},this.magFilter=wt,this.minFilter=wt,this.wrapR=mn,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}}class Jg extends Ct{constructor(e=null,t=1,n=1,s=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:n,depth:s},this.magFilter=wt,this.minFilter=wt,this.wrapR=mn,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class We{constructor(e,t,n,s,r,a,o,l,c,h,u,d,f,g,_,p){We.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,n,s,r,a,o,l,c,h,u,d,f,g,_,p)}set(e,t,n,s,r,a,o,l,c,h,u,d,f,g,_,p){const m=this.elements;return m[0]=e,m[4]=t,m[8]=n,m[12]=s,m[1]=r,m[5]=a,m[9]=o,m[13]=l,m[2]=c,m[6]=h,m[10]=u,m[14]=d,m[3]=f,m[7]=g,m[11]=_,m[15]=p,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new We().fromArray(this.elements)}copy(e){const t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],t[9]=n[9],t[10]=n[10],t[11]=n[11],t[12]=n[12],t[13]=n[13],t[14]=n[14],t[15]=n[15],this}copyPosition(e){const t=this.elements,n=e.elements;return t[12]=n[12],t[13]=n[13],t[14]=n[14],this}setFromMatrix3(e){const t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,n){return this.determinant()===0?(e.set(1,0,0),t.set(0,1,0),n.set(0,0,1),this):(e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this)}makeBasis(e,t,n){return this.set(e.x,t.x,n.x,0,e.y,t.y,n.y,0,e.z,t.z,n.z,0,0,0,0,1),this}extractRotation(e){if(e.determinant()===0)return this.identity();const t=this.elements,n=e.elements,s=1/os.setFromMatrixColumn(e,0).length(),r=1/os.setFromMatrixColumn(e,1).length(),a=1/os.setFromMatrixColumn(e,2).length();return t[0]=n[0]*s,t[1]=n[1]*s,t[2]=n[2]*s,t[3]=0,t[4]=n[4]*r,t[5]=n[5]*r,t[6]=n[6]*r,t[7]=0,t[8]=n[8]*a,t[9]=n[9]*a,t[10]=n[10]*a,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){const t=this.elements,n=e.x,s=e.y,r=e.z,a=Math.cos(n),o=Math.sin(n),l=Math.cos(s),c=Math.sin(s),h=Math.cos(r),u=Math.sin(r);if(e.order==="XYZ"){const d=a*h,f=a*u,g=o*h,_=o*u;t[0]=l*h,t[4]=-l*u,t[8]=c,t[1]=f+g*c,t[5]=d-_*c,t[9]=-o*l,t[2]=_-d*c,t[6]=g+f*c,t[10]=a*l}else if(e.order==="YXZ"){const d=l*h,f=l*u,g=c*h,_=c*u;t[0]=d+_*o,t[4]=g*o-f,t[8]=a*c,t[1]=a*u,t[5]=a*h,t[9]=-o,t[2]=f*o-g,t[6]=_+d*o,t[10]=a*l}else if(e.order==="ZXY"){const d=l*h,f=l*u,g=c*h,_=c*u;t[0]=d-_*o,t[4]=-a*u,t[8]=g+f*o,t[1]=f+g*o,t[5]=a*h,t[9]=_-d*o,t[2]=-a*c,t[6]=o,t[10]=a*l}else if(e.order==="ZYX"){const d=a*h,f=a*u,g=o*h,_=o*u;t[0]=l*h,t[4]=g*c-f,t[8]=d*c+_,t[1]=l*u,t[5]=_*c+d,t[9]=f*c-g,t[2]=-c,t[6]=o*l,t[10]=a*l}else if(e.order==="YZX"){const d=a*l,f=a*c,g=o*l,_=o*c;t[0]=l*h,t[4]=_-d*u,t[8]=g*u+f,t[1]=u,t[5]=a*h,t[9]=-o*h,t[2]=-c*h,t[6]=f*u+g,t[10]=d-_*u}else if(e.order==="XZY"){const d=a*l,f=a*c,g=o*l,_=o*c;t[0]=l*h,t[4]=-u,t[8]=c*h,t[1]=d*u+_,t[5]=a*h,t[9]=f*u-g,t[2]=g*u-f,t[6]=o*h,t[10]=_*u+d}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(Zg,e,Qg)}lookAt(e,t,n){const s=this.elements;return rn.subVectors(e,t),rn.lengthSq()===0&&(rn.z=1),rn.normalize(),gi.crossVectors(n,rn),gi.lengthSq()===0&&(Math.abs(n.z)===1?rn.x+=1e-4:rn.z+=1e-4,rn.normalize(),gi.crossVectors(n,rn)),gi.normalize(),xa.crossVectors(rn,gi),s[0]=gi.x,s[4]=xa.x,s[8]=rn.x,s[1]=gi.y,s[5]=xa.y,s[9]=rn.y,s[2]=gi.z,s[6]=xa.z,s[10]=rn.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const n=e.elements,s=t.elements,r=this.elements,a=n[0],o=n[4],l=n[8],c=n[12],h=n[1],u=n[5],d=n[9],f=n[13],g=n[2],_=n[6],p=n[10],m=n[14],M=n[3],y=n[7],S=n[11],w=n[15],T=s[0],L=s[4],x=s[8],E=s[12],N=s[1],C=s[5],O=s[9],F=s[13],V=s[2],z=s[6],H=s[10],B=s[14],ie=s[3],Q=s[7],me=s[11],_e=s[15];return r[0]=a*T+o*N+l*V+c*ie,r[4]=a*L+o*C+l*z+c*Q,r[8]=a*x+o*O+l*H+c*me,r[12]=a*E+o*F+l*B+c*_e,r[1]=h*T+u*N+d*V+f*ie,r[5]=h*L+u*C+d*z+f*Q,r[9]=h*x+u*O+d*H+f*me,r[13]=h*E+u*F+d*B+f*_e,r[2]=g*T+_*N+p*V+m*ie,r[6]=g*L+_*C+p*z+m*Q,r[10]=g*x+_*O+p*H+m*me,r[14]=g*E+_*F+p*B+m*_e,r[3]=M*T+y*N+S*V+w*ie,r[7]=M*L+y*C+S*z+w*Q,r[11]=M*x+y*O+S*H+w*me,r[15]=M*E+y*F+S*B+w*_e,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){const e=this.elements,t=e[0],n=e[4],s=e[8],r=e[12],a=e[1],o=e[5],l=e[9],c=e[13],h=e[2],u=e[6],d=e[10],f=e[14],g=e[3],_=e[7],p=e[11],m=e[15],M=l*f-c*d,y=o*f-c*u,S=o*d-l*u,w=a*f-c*h,T=a*d-l*h,L=a*u-o*h;return t*(_*M-p*y+m*S)-n*(g*M-p*w+m*T)+s*(g*y-_*w+m*L)-r*(g*S-_*T+p*L)}transpose(){const e=this.elements;let t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,n){const s=this.elements;return e.isVector3?(s[12]=e.x,s[13]=e.y,s[14]=e.z):(s[12]=e,s[13]=t,s[14]=n),this}invert(){const e=this.elements,t=e[0],n=e[1],s=e[2],r=e[3],a=e[4],o=e[5],l=e[6],c=e[7],h=e[8],u=e[9],d=e[10],f=e[11],g=e[12],_=e[13],p=e[14],m=e[15],M=t*o-n*a,y=t*l-s*a,S=t*c-r*a,w=n*l-s*o,T=n*c-r*o,L=s*c-r*l,x=h*_-u*g,E=h*p-d*g,N=h*m-f*g,C=u*p-d*_,O=u*m-f*_,F=d*m-f*p,V=M*F-y*O+S*C+w*N-T*E+L*x;if(V===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const z=1/V;return e[0]=(o*F-l*O+c*C)*z,e[1]=(s*O-n*F-r*C)*z,e[2]=(_*L-p*T+m*w)*z,e[3]=(d*T-u*L-f*w)*z,e[4]=(l*N-a*F-c*E)*z,e[5]=(t*F-s*N+r*E)*z,e[6]=(p*S-g*L-m*y)*z,e[7]=(h*L-d*S+f*y)*z,e[8]=(a*O-o*N+c*x)*z,e[9]=(n*N-t*O-r*x)*z,e[10]=(g*T-_*S+m*M)*z,e[11]=(u*S-h*T-f*M)*z,e[12]=(o*E-a*C-l*x)*z,e[13]=(t*C-n*E+s*x)*z,e[14]=(_*y-g*w-p*M)*z,e[15]=(h*w-u*y+d*M)*z,this}scale(e){const t=this.elements,n=e.x,s=e.y,r=e.z;return t[0]*=n,t[4]*=s,t[8]*=r,t[1]*=n,t[5]*=s,t[9]*=r,t[2]*=n,t[6]*=s,t[10]*=r,t[3]*=n,t[7]*=s,t[11]*=r,this}getMaxScaleOnAxis(){const e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],n=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],s=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,n,s))}makeTranslation(e,t,n){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,n,0,0,0,1),this}makeRotationX(e){const t=Math.cos(e),n=Math.sin(e);return this.set(1,0,0,0,0,t,-n,0,0,n,t,0,0,0,0,1),this}makeRotationY(e){const t=Math.cos(e),n=Math.sin(e);return this.set(t,0,n,0,0,1,0,0,-n,0,t,0,0,0,0,1),this}makeRotationZ(e){const t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,0,n,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){const n=Math.cos(t),s=Math.sin(t),r=1-n,a=e.x,o=e.y,l=e.z,c=r*a,h=r*o;return this.set(c*a+n,c*o-s*l,c*l+s*o,0,c*o+s*l,h*o+n,h*l-s*a,0,c*l-s*o,h*l+s*a,r*l*l+n,0,0,0,0,1),this}makeScale(e,t,n){return this.set(e,0,0,0,0,t,0,0,0,0,n,0,0,0,0,1),this}makeShear(e,t,n,s,r,a){return this.set(1,n,r,0,e,1,a,0,t,s,1,0,0,0,0,1),this}compose(e,t,n){const s=this.elements,r=t._x,a=t._y,o=t._z,l=t._w,c=r+r,h=a+a,u=o+o,d=r*c,f=r*h,g=r*u,_=a*h,p=a*u,m=o*u,M=l*c,y=l*h,S=l*u,w=n.x,T=n.y,L=n.z;return s[0]=(1-(_+m))*w,s[1]=(f+S)*w,s[2]=(g-y)*w,s[3]=0,s[4]=(f-S)*T,s[5]=(1-(d+m))*T,s[6]=(p+M)*T,s[7]=0,s[8]=(g+y)*L,s[9]=(p-M)*L,s[10]=(1-(d+_))*L,s[11]=0,s[12]=e.x,s[13]=e.y,s[14]=e.z,s[15]=1,this}decompose(e,t,n){const s=this.elements;e.x=s[12],e.y=s[13],e.z=s[14];const r=this.determinant();if(r===0)return n.set(1,1,1),t.identity(),this;let a=os.set(s[0],s[1],s[2]).length();const o=os.set(s[4],s[5],s[6]).length(),l=os.set(s[8],s[9],s[10]).length();r<0&&(a=-a),Sn.copy(this);const c=1/a,h=1/o,u=1/l;return Sn.elements[0]*=c,Sn.elements[1]*=c,Sn.elements[2]*=c,Sn.elements[4]*=h,Sn.elements[5]*=h,Sn.elements[6]*=h,Sn.elements[8]*=u,Sn.elements[9]*=u,Sn.elements[10]*=u,t.setFromRotationMatrix(Sn),n.x=a,n.y=o,n.z=l,this}makePerspective(e,t,n,s,r,a,o=Wn,l=!1){const c=this.elements,h=2*r/(t-e),u=2*r/(n-s),d=(t+e)/(t-e),f=(n+s)/(n-s);let g,_;if(l)g=r/(a-r),_=a*r/(a-r);else if(o===Wn)g=-(a+r)/(a-r),_=-2*a*r/(a-r);else if(o===ea)g=-a/(a-r),_=-a*r/(a-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+o);return c[0]=h,c[4]=0,c[8]=d,c[12]=0,c[1]=0,c[5]=u,c[9]=f,c[13]=0,c[2]=0,c[6]=0,c[10]=g,c[14]=_,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(e,t,n,s,r,a,o=Wn,l=!1){const c=this.elements,h=2/(t-e),u=2/(n-s),d=-(t+e)/(t-e),f=-(n+s)/(n-s);let g,_;if(l)g=1/(a-r),_=a/(a-r);else if(o===Wn)g=-2/(a-r),_=-(a+r)/(a-r);else if(o===ea)g=-1/(a-r),_=-r/(a-r);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+o);return c[0]=h,c[4]=0,c[8]=0,c[12]=d,c[1]=0,c[5]=u,c[9]=0,c[13]=f,c[2]=0,c[6]=0,c[10]=g,c[14]=_,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(e){const t=this.elements,n=e.elements;for(let s=0;s<16;s++)if(t[s]!==n[s])return!1;return!0}fromArray(e,t=0){for(let n=0;n<16;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){const n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e[t+9]=n[9],e[t+10]=n[10],e[t+11]=n[11],e[t+12]=n[12],e[t+13]=n[13],e[t+14]=n[14],e[t+15]=n[15],e}}const os=new P,Sn=new We,Zg=new P(0,0,0),Qg=new P(1,1,1),gi=new P,xa=new P,rn=new P,Hu=new We,Gu=new In;class Nn{constructor(e=0,t=0,n=0,s=Nn.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=t,this._z=n,this._order=s}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,n,s=this._order){return this._x=e,this._y=t,this._z=n,this._order=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,n=!0){const s=e.elements,r=s[0],a=s[4],o=s[8],l=s[1],c=s[5],h=s[9],u=s[2],d=s[6],f=s[10];switch(t){case"XYZ":this._y=Math.asin(Ge(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-h,f),this._z=Math.atan2(-a,r)):(this._x=Math.atan2(d,c),this._z=0);break;case"YXZ":this._x=Math.asin(-Ge(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(o,f),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-u,r),this._z=0);break;case"ZXY":this._x=Math.asin(Ge(d,-1,1)),Math.abs(d)<.9999999?(this._y=Math.atan2(-u,f),this._z=Math.atan2(-a,c)):(this._y=0,this._z=Math.atan2(l,r));break;case"ZYX":this._y=Math.asin(-Ge(u,-1,1)),Math.abs(u)<.9999999?(this._x=Math.atan2(d,f),this._z=Math.atan2(l,r)):(this._x=0,this._z=Math.atan2(-a,c));break;case"YZX":this._z=Math.asin(Ge(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-h,c),this._y=Math.atan2(-u,r)):(this._x=0,this._y=Math.atan2(o,f));break;case"XZY":this._z=Math.asin(-Ge(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(d,c),this._y=Math.atan2(o,r)):(this._x=Math.atan2(-h,f),this._y=0);break;default:Re("Euler: .setFromRotationMatrix() encountered an unknown order: "+t)}return this._order=t,n===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,n){return Hu.makeRotationFromQuaternion(e),this.setFromRotationMatrix(Hu,t,n)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return Gu.setFromEuler(this),this.setFromQuaternion(Gu,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}Nn.DEFAULT_ORDER="XYZ";class Gh{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}}let e0=0;const Vu=new P,ls=new In,ei=new We,va=new P,pr=new P,t0=new P,n0=new In,Wu=new P(1,0,0),Xu=new P(0,1,0),Ku=new P(0,0,1),Yu={type:"added"},i0={type:"removed"},cs={type:"childadded",child:null},dl={type:"childremoved",child:null};class xt extends Zi{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:e0++}),this.uuid=xn(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=xt.DEFAULT_UP.clone();const e=new P,t=new Nn,n=new In,s=new P(1,1,1);function r(){n.setFromEuler(t,!1)}function a(){t.setFromQuaternion(n,void 0,!1)}t._onChange(r),n._onChange(a),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:t},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:s},modelViewMatrix:{value:new We},normalMatrix:{value:new Ye}}),this.matrix=new We,this.matrixWorld=new We,this.matrixAutoUpdate=xt.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=xt.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new Gh,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.static=!1,this.userData={},this.pivot=null}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return ls.setFromAxisAngle(e,t),this.quaternion.multiply(ls),this}rotateOnWorldAxis(e,t){return ls.setFromAxisAngle(e,t),this.quaternion.premultiply(ls),this}rotateX(e){return this.rotateOnAxis(Wu,e)}rotateY(e){return this.rotateOnAxis(Xu,e)}rotateZ(e){return this.rotateOnAxis(Ku,e)}translateOnAxis(e,t){return Vu.copy(e).applyQuaternion(this.quaternion),this.position.add(Vu.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(Wu,e)}translateY(e){return this.translateOnAxis(Xu,e)}translateZ(e){return this.translateOnAxis(Ku,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(ei.copy(this.matrixWorld).invert())}lookAt(e,t,n){e.isVector3?va.copy(e):va.set(e,t,n);const s=this.parent;this.updateWorldMatrix(!0,!1),pr.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?ei.lookAt(pr,va,this.up):ei.lookAt(va,pr,this.up),this.quaternion.setFromRotationMatrix(ei),s&&(ei.extractRotation(s.matrixWorld),ls.setFromRotationMatrix(ei),this.quaternion.premultiply(ls.invert()))}add(e){if(arguments.length>1){for(let t=0;t<arguments.length;t++)this.add(arguments[t]);return this}return e===this?(Be("Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(Yu),cs.child=e,this.dispatchEvent(cs),cs.child=null):Be("Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}const t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(i0),dl.child=e,this.dispatchEvent(dl),dl.child=null),this}removeFromParent(){const e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),ei.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),ei.multiply(e.parent.matrixWorld)),e.applyMatrix4(ei),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(Yu),cs.child=e,this.dispatchEvent(cs),cs.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let n=0,s=this.children.length;n<s;n++){const a=this.children[n].getObjectByProperty(e,t);if(a!==void 0)return a}}getObjectsByProperty(e,t,n=[]){this[e]===t&&n.push(this);const s=this.children;for(let r=0,a=s.length;r<a;r++)s[r].getObjectsByProperty(e,t,n);return n}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(pr,e,t0),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(pr,n0,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);const t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}traverse(e){e(this);const t=this.children;for(let n=0,s=t.length;n<s;n++)t[n].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);const t=this.children;for(let n=0,s=t.length;n<s;n++)t[n].traverseVisible(e)}traverseAncestors(e){const t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale);const e=this.pivot;if(e!==null){const t=e.x,n=e.y,s=e.z,r=this.matrix.elements;r[12]+=t-r[0]*t-r[4]*n-r[8]*s,r[13]+=n-r[1]*t-r[5]*n-r[9]*s,r[14]+=s-r[2]*t-r[6]*n-r[10]*s}this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);const t=this.children;for(let n=0,s=t.length;n<s;n++)t[n].updateMatrixWorld(e)}updateWorldMatrix(e,t){const n=this.parent;if(e===!0&&n!==null&&n.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),t===!0){const s=this.children;for(let r=0,a=s.length;r<a;r++)s[r].updateWorldMatrix(!1,!0)}}toJSON(e){const t=e===void 0||typeof e=="string",n={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});const s={};s.uuid=this.uuid,s.type=this.type,this.name!==""&&(s.name=this.name),this.castShadow===!0&&(s.castShadow=!0),this.receiveShadow===!0&&(s.receiveShadow=!0),this.visible===!1&&(s.visible=!1),this.frustumCulled===!1&&(s.frustumCulled=!1),this.renderOrder!==0&&(s.renderOrder=this.renderOrder),this.static!==!1&&(s.static=this.static),Object.keys(this.userData).length>0&&(s.userData=this.userData),s.layers=this.layers.mask,s.matrix=this.matrix.toArray(),s.up=this.up.toArray(),this.pivot!==null&&(s.pivot=this.pivot.toArray()),this.matrixAutoUpdate===!1&&(s.matrixAutoUpdate=!1),this.morphTargetDictionary!==void 0&&(s.morphTargetDictionary=Object.assign({},this.morphTargetDictionary)),this.morphTargetInfluences!==void 0&&(s.morphTargetInfluences=this.morphTargetInfluences.slice()),this.isInstancedMesh&&(s.type="InstancedMesh",s.count=this.count,s.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(s.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(s.type="BatchedMesh",s.perObjectFrustumCulled=this.perObjectFrustumCulled,s.sortObjects=this.sortObjects,s.drawRanges=this._drawRanges,s.reservedRanges=this._reservedRanges,s.geometryInfo=this._geometryInfo.map(o=>({...o,boundingBox:o.boundingBox?o.boundingBox.toJSON():void 0,boundingSphere:o.boundingSphere?o.boundingSphere.toJSON():void 0})),s.instanceInfo=this._instanceInfo.map(o=>({...o})),s.availableInstanceIds=this._availableInstanceIds.slice(),s.availableGeometryIds=this._availableGeometryIds.slice(),s.nextIndexStart=this._nextIndexStart,s.nextVertexStart=this._nextVertexStart,s.geometryCount=this._geometryCount,s.maxInstanceCount=this._maxInstanceCount,s.maxVertexCount=this._maxVertexCount,s.maxIndexCount=this._maxIndexCount,s.geometryInitialized=this._geometryInitialized,s.matricesTexture=this._matricesTexture.toJSON(e),s.indirectTexture=this._indirectTexture.toJSON(e),this._colorsTexture!==null&&(s.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(s.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(s.boundingBox=this.boundingBox.toJSON()));function r(o,l){return o[l.uuid]===void 0&&(o[l.uuid]=l.toJSON(e)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?s.background=this.background.toJSON():this.background.isTexture&&(s.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(s.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){s.geometry=r(e.geometries,this.geometry);const o=this.geometry.parameters;if(o!==void 0&&o.shapes!==void 0){const l=o.shapes;if(Array.isArray(l))for(let c=0,h=l.length;c<h;c++){const u=l[c];r(e.shapes,u)}else r(e.shapes,l)}}if(this.isSkinnedMesh&&(s.bindMode=this.bindMode,s.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(e.skeletons,this.skeleton),s.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const o=[];for(let l=0,c=this.material.length;l<c;l++)o.push(r(e.materials,this.material[l]));s.material=o}else s.material=r(e.materials,this.material);if(this.children.length>0){s.children=[];for(let o=0;o<this.children.length;o++)s.children.push(this.children[o].toJSON(e).object)}if(this.animations.length>0){s.animations=[];for(let o=0;o<this.animations.length;o++){const l=this.animations[o];s.animations.push(r(e.animations,l))}}if(t){const o=a(e.geometries),l=a(e.materials),c=a(e.textures),h=a(e.images),u=a(e.shapes),d=a(e.skeletons),f=a(e.animations),g=a(e.nodes);o.length>0&&(n.geometries=o),l.length>0&&(n.materials=l),c.length>0&&(n.textures=c),h.length>0&&(n.images=h),u.length>0&&(n.shapes=u),d.length>0&&(n.skeletons=d),f.length>0&&(n.animations=f),g.length>0&&(n.nodes=g)}return n.object=s,n;function a(o){const l=[];for(const c in o){const h=o[c];delete h.metadata,l.push(h)}return l}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),e.pivot!==null&&(this.pivot=e.pivot.clone()),this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.static=e.static,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let n=0;n<e.children.length;n++){const s=e.children[n];this.add(s.clone())}return this}}xt.DEFAULT_UP=new P(0,1,0);xt.DEFAULT_MATRIX_AUTO_UPDATE=!0;xt.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;class Pn extends xt{constructor(){super(),this.isGroup=!0,this.type="Group"}}const s0={type:"move"};class fl{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new Pn,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new Pn,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new P,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new P),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new Pn,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new P,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new P),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){const t=this._hand;if(t)for(const n of e.hand.values())this._getHandJoint(t,n)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,n){let s=null,r=null,a=null;const o=this._targetRay,l=this._grip,c=this._hand;if(e&&t.session.visibilityState!=="visible-blurred"){if(c&&e.hand){a=!0;for(const _ of e.hand.values()){const p=t.getJointPose(_,n),m=this._getHandJoint(c,_);p!==null&&(m.matrix.fromArray(p.transform.matrix),m.matrix.decompose(m.position,m.rotation,m.scale),m.matrixWorldNeedsUpdate=!0,m.jointRadius=p.radius),m.visible=p!==null}const h=c.joints["index-finger-tip"],u=c.joints["thumb-tip"],d=h.position.distanceTo(u.position),f=.02,g=.005;c.inputState.pinching&&d>f+g?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!c.inputState.pinching&&d<=f-g&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else l!==null&&e.gripSpace&&(r=t.getPose(e.gripSpace,n),r!==null&&(l.matrix.fromArray(r.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,r.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(r.linearVelocity)):l.hasLinearVelocity=!1,r.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(r.angularVelocity)):l.hasAngularVelocity=!1));o!==null&&(s=t.getPose(e.targetRaySpace,n),s===null&&r!==null&&(s=r),s!==null&&(o.matrix.fromArray(s.transform.matrix),o.matrix.decompose(o.position,o.rotation,o.scale),o.matrixWorldNeedsUpdate=!0,s.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(s.linearVelocity)):o.hasLinearVelocity=!1,s.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(s.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent(s0)))}return o!==null&&(o.visible=s!==null),l!==null&&(l.visible=r!==null),c!==null&&(c.visible=a!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){const n=new Pn;n.matrixAutoUpdate=!1,n.visible=!1,e.joints[t.jointName]=n,e.add(n)}return e.joints[t.jointName]}}const up={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},_i={h:0,s:0,l:0},Ma={h:0,s:0,l:0};function pl(i,e,t){return t<0&&(t+=1),t>1&&(t-=1),t<1/6?i+(e-i)*6*t:t<1/2?e:t<2/3?i+(e-i)*6*(2/3-t):i}class Me{constructor(e,t,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,n)}set(e,t,n){if(t===void 0&&n===void 0){const s=e;s&&s.isColor?this.copy(s):typeof s=="number"?this.setHex(s):typeof s=="string"&&this.setStyle(s)}else this.setRGB(e,t,n);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=Nt){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,Qe.colorSpaceToWorking(this,t),this}setRGB(e,t,n,s=Qe.workingColorSpace){return this.r=e,this.g=t,this.b=n,Qe.colorSpaceToWorking(this,s),this}setHSL(e,t,n,s=Qe.workingColorSpace){if(e=zh(e,1),t=Ge(t,0,1),n=Ge(n,0,1),t===0)this.r=this.g=this.b=n;else{const r=n<=.5?n*(1+t):n+t-n*t,a=2*n-r;this.r=pl(a,r,e+1/3),this.g=pl(a,r,e),this.b=pl(a,r,e-1/3)}return Qe.colorSpaceToWorking(this,s),this}setStyle(e,t=Nt){function n(r){r!==void 0&&parseFloat(r)<1&&Re("Color: Alpha component of "+e+" will be ignored.")}let s;if(s=/^(\w+)\(([^\)]*)\)/.exec(e)){let r;const a=s[1],o=s[2];switch(a){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,t);if(r=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setRGB(Math.min(100,parseInt(r[1],10))/100,Math.min(100,parseInt(r[2],10))/100,Math.min(100,parseInt(r[3],10))/100,t);break;case"hsl":case"hsla":if(r=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,t);break;default:Re("Color: Unknown color model "+e)}}else if(s=/^\#([A-Fa-f\d]+)$/.exec(e)){const r=s[1],a=r.length;if(a===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,t);if(a===6)return this.setHex(parseInt(r,16),t);Re("Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=Nt){const n=up[e.toLowerCase()];return n!==void 0?this.setHex(n,t):Re("Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=ui(e.r),this.g=ui(e.g),this.b=ui(e.b),this}copyLinearToSRGB(e){return this.r=Fs(e.r),this.g=Fs(e.g),this.b=Fs(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=Nt){return Qe.workingToColorSpace(Xt.copy(this),e),Math.round(Ge(Xt.r*255,0,255))*65536+Math.round(Ge(Xt.g*255,0,255))*256+Math.round(Ge(Xt.b*255,0,255))}getHexString(e=Nt){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=Qe.workingColorSpace){Qe.workingToColorSpace(Xt.copy(this),t);const n=Xt.r,s=Xt.g,r=Xt.b,a=Math.max(n,s,r),o=Math.min(n,s,r);let l,c;const h=(o+a)/2;if(o===a)l=0,c=0;else{const u=a-o;switch(c=h<=.5?u/(a+o):u/(2-a-o),a){case n:l=(s-r)/u+(s<r?6:0);break;case s:l=(r-n)/u+2;break;case r:l=(n-s)/u+4;break}l/=6}return e.h=l,e.s=c,e.l=h,e}getRGB(e,t=Qe.workingColorSpace){return Qe.workingToColorSpace(Xt.copy(this),t),e.r=Xt.r,e.g=Xt.g,e.b=Xt.b,e}getStyle(e=Nt){Qe.workingToColorSpace(Xt.copy(this),e);const t=Xt.r,n=Xt.g,s=Xt.b;return e!==Nt?`color(${e} ${t.toFixed(3)} ${n.toFixed(3)} ${s.toFixed(3)})`:`rgb(${Math.round(t*255)},${Math.round(n*255)},${Math.round(s*255)})`}offsetHSL(e,t,n){return this.getHSL(_i),this.setHSL(_i.h+e,_i.s+t,_i.l+n)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,n){return this.r=e.r+(t.r-e.r)*n,this.g=e.g+(t.g-e.g)*n,this.b=e.b+(t.b-e.b)*n,this}lerpHSL(e,t){this.getHSL(_i),e.getHSL(Ma);const n=kr(_i.h,Ma.h,t),s=kr(_i.s,Ma.s,t),r=kr(_i.l,Ma.l,t);return this.setHSL(n,s,r),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){const t=this.r,n=this.g,s=this.b,r=e.elements;return this.r=r[0]*t+r[3]*n+r[6]*s,this.g=r[1]*t+r[4]*n+r[7]*s,this.b=r[2]*t+r[5]*n+r[8]*s,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const Xt=new Me;Me.NAMES=up;class Ko{constructor(e,t=25e-5){this.isFogExp2=!0,this.name="",this.color=new Me(e),this.density=t}clone(){return new Ko(this.color,this.density)}toJSON(){return{type:"FogExp2",name:this.name,color:this.color.getHex(),density:this.density}}}class r0 extends xt{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new Nn,this.environmentIntensity=1,this.environmentRotation=new Nn,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,t){return super.copy(e,t),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){const t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(t.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(t.object.backgroundIntensity=this.backgroundIntensity),t.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(t.object.environmentIntensity=this.environmentIntensity),t.object.environmentRotation=this.environmentRotation.toArray(),t}}const En=new P,ti=new P,ml=new P,ni=new P,hs=new P,us=new P,qu=new P,gl=new P,_l=new P,xl=new P,vl=new it,Ml=new it,yl=new it;class pn{constructor(e=new P,t=new P,n=new P){this.a=e,this.b=t,this.c=n}static getNormal(e,t,n,s){s.subVectors(n,t),En.subVectors(e,t),s.cross(En);const r=s.lengthSq();return r>0?s.multiplyScalar(1/Math.sqrt(r)):s.set(0,0,0)}static getBarycoord(e,t,n,s,r){En.subVectors(s,t),ti.subVectors(n,t),ml.subVectors(e,t);const a=En.dot(En),o=En.dot(ti),l=En.dot(ml),c=ti.dot(ti),h=ti.dot(ml),u=a*c-o*o;if(u===0)return r.set(0,0,0),null;const d=1/u,f=(c*l-o*h)*d,g=(a*h-o*l)*d;return r.set(1-f-g,g,f)}static containsPoint(e,t,n,s){return this.getBarycoord(e,t,n,s,ni)===null?!1:ni.x>=0&&ni.y>=0&&ni.x+ni.y<=1}static getInterpolation(e,t,n,s,r,a,o,l){return this.getBarycoord(e,t,n,s,ni)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(r,ni.x),l.addScaledVector(a,ni.y),l.addScaledVector(o,ni.z),l)}static getInterpolatedAttribute(e,t,n,s,r,a){return vl.setScalar(0),Ml.setScalar(0),yl.setScalar(0),vl.fromBufferAttribute(e,t),Ml.fromBufferAttribute(e,n),yl.fromBufferAttribute(e,s),a.setScalar(0),a.addScaledVector(vl,r.x),a.addScaledVector(Ml,r.y),a.addScaledVector(yl,r.z),a}static isFrontFacing(e,t,n,s){return En.subVectors(n,t),ti.subVectors(e,t),En.cross(ti).dot(s)<0}set(e,t,n){return this.a.copy(e),this.b.copy(t),this.c.copy(n),this}setFromPointsAndIndices(e,t,n,s){return this.a.copy(e[t]),this.b.copy(e[n]),this.c.copy(e[s]),this}setFromAttributeAndIndices(e,t,n,s){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,n),this.c.fromBufferAttribute(e,s),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return En.subVectors(this.c,this.b),ti.subVectors(this.a,this.b),En.cross(ti).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return pn.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,t){return pn.getBarycoord(e,this.a,this.b,this.c,t)}getInterpolation(e,t,n,s,r){return pn.getInterpolation(e,this.a,this.b,this.c,t,n,s,r)}containsPoint(e){return pn.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return pn.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){const n=this.a,s=this.b,r=this.c;let a,o;hs.subVectors(s,n),us.subVectors(r,n),gl.subVectors(e,n);const l=hs.dot(gl),c=us.dot(gl);if(l<=0&&c<=0)return t.copy(n);_l.subVectors(e,s);const h=hs.dot(_l),u=us.dot(_l);if(h>=0&&u<=h)return t.copy(s);const d=l*u-h*c;if(d<=0&&l>=0&&h<=0)return a=l/(l-h),t.copy(n).addScaledVector(hs,a);xl.subVectors(e,r);const f=hs.dot(xl),g=us.dot(xl);if(g>=0&&f<=g)return t.copy(r);const _=f*c-l*g;if(_<=0&&c>=0&&g<=0)return o=c/(c-g),t.copy(n).addScaledVector(us,o);const p=h*g-f*u;if(p<=0&&u-h>=0&&f-g>=0)return qu.subVectors(r,s),o=(u-h)/(u-h+(f-g)),t.copy(s).addScaledVector(qu,o);const m=1/(p+_+d);return a=_*m,o=d*m,t.copy(n).addScaledVector(hs,a).addScaledVector(us,o)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}}class cn{constructor(e=new P(1/0,1/0,1/0),t=new P(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t+=3)this.expandByPoint(bn.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,n=e.count;t<n;t++)this.expandByPoint(bn.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){const n=bn.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(n),this.max.copy(e).add(n),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);const n=e.geometry;if(n!==void 0){const r=n.getAttribute("position");if(t===!0&&r!==void 0&&e.isInstancedMesh!==!0)for(let a=0,o=r.count;a<o;a++)e.isMesh===!0?e.getVertexPosition(a,bn):bn.fromBufferAttribute(r,a),bn.applyMatrix4(e.matrixWorld),this.expandByPoint(bn);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),ya.copy(e.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),ya.copy(n.boundingBox)),ya.applyMatrix4(e.matrixWorld),this.union(ya)}const s=e.children;for(let r=0,a=s.length;r<a;r++)this.expandByObject(s[r],t);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,bn),bn.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,n;return e.normal.x>0?(t=e.normal.x*this.min.x,n=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,n=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,n+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,n+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,n+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,n+=e.normal.z*this.min.z),t<=-e.constant&&n>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(mr),Sa.subVectors(this.max,mr),ds.subVectors(e.a,mr),fs.subVectors(e.b,mr),ps.subVectors(e.c,mr),xi.subVectors(fs,ds),vi.subVectors(ps,fs),Ii.subVectors(ds,ps);let t=[0,-xi.z,xi.y,0,-vi.z,vi.y,0,-Ii.z,Ii.y,xi.z,0,-xi.x,vi.z,0,-vi.x,Ii.z,0,-Ii.x,-xi.y,xi.x,0,-vi.y,vi.x,0,-Ii.y,Ii.x,0];return!Sl(t,ds,fs,ps,Sa)||(t=[1,0,0,0,1,0,0,0,1],!Sl(t,ds,fs,ps,Sa))?!1:(Ea.crossVectors(xi,vi),t=[Ea.x,Ea.y,Ea.z],Sl(t,ds,fs,ps,Sa))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,bn).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(bn).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(ii[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),ii[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),ii[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),ii[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),ii[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),ii[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),ii[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),ii[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(ii),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(e){return this.min.fromArray(e.min),this.max.fromArray(e.max),this}}const ii=[new P,new P,new P,new P,new P,new P,new P,new P],bn=new P,ya=new cn,ds=new P,fs=new P,ps=new P,xi=new P,vi=new P,Ii=new P,mr=new P,Sa=new P,Ea=new P,Ni=new P;function Sl(i,e,t,n,s){for(let r=0,a=i.length-3;r<=a;r+=3){Ni.fromArray(i,r);const o=s.x*Math.abs(Ni.x)+s.y*Math.abs(Ni.y)+s.z*Math.abs(Ni.z),l=e.dot(Ni),c=t.dot(Ni),h=n.dot(Ni);if(Math.max(-Math.max(l,c,h),Math.min(l,c,h))>o)return!1}return!0}const bt=new P,ba=new j;let a0=0;class Yt{constructor(e,t,n=!1){if(Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:a0++}),this.name="",this.array=e,this.itemSize=t,this.count=e!==void 0?e.length/t:0,this.normalized=n,this.usage=$c,this.updateRanges=[],this.gpuType=gn,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,t,n){e*=this.itemSize,n*=t.itemSize;for(let s=0,r=this.itemSize;s<r;s++)this.array[e+s]=t.array[n+s];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,n=this.count;t<n;t++)ba.fromBufferAttribute(this,t),ba.applyMatrix3(e),this.setXY(t,ba.x,ba.y);else if(this.itemSize===3)for(let t=0,n=this.count;t<n;t++)bt.fromBufferAttribute(this,t),bt.applyMatrix3(e),this.setXYZ(t,bt.x,bt.y,bt.z);return this}applyMatrix4(e){for(let t=0,n=this.count;t<n;t++)bt.fromBufferAttribute(this,t),bt.applyMatrix4(e),this.setXYZ(t,bt.x,bt.y,bt.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)bt.fromBufferAttribute(this,t),bt.applyNormalMatrix(e),this.setXYZ(t,bt.x,bt.y,bt.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)bt.fromBufferAttribute(this,t),bt.transformDirection(e),this.setXYZ(t,bt.x,bt.y,bt.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let n=this.array[e*this.itemSize+t];return this.normalized&&(n=An(n,this.array)),n}setComponent(e,t,n){return this.normalized&&(n=ot(n,this.array)),this.array[e*this.itemSize+t]=n,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=An(t,this.array)),t}setX(e,t){return this.normalized&&(t=ot(t,this.array)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=An(t,this.array)),t}setY(e,t){return this.normalized&&(t=ot(t,this.array)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=An(t,this.array)),t}setZ(e,t){return this.normalized&&(t=ot(t,this.array)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=An(t,this.array)),t}setW(e,t){return this.normalized&&(t=ot(t,this.array)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,n){return e*=this.itemSize,this.normalized&&(t=ot(t,this.array),n=ot(n,this.array)),this.array[e+0]=t,this.array[e+1]=n,this}setXYZ(e,t,n,s){return e*=this.itemSize,this.normalized&&(t=ot(t,this.array),n=ot(n,this.array),s=ot(s,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=s,this}setXYZW(e,t,n,s,r){return e*=this.itemSize,this.normalized&&(t=ot(t,this.array),n=ot(n,this.array),s=ot(s,this.array),r=ot(r,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=s,this.array[e+3]=r,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(e.name=this.name),this.usage!==$c&&(e.usage=this.usage),e}}class dp extends Yt{constructor(e,t,n){super(new Uint16Array(e),t,n)}}class fp extends Yt{constructor(e,t,n){super(new Uint32Array(e),t,n)}}class ze extends Yt{constructor(e,t,n){super(new Float32Array(e),t,n)}}const o0=new cn,gr=new P,El=new P;class Mn{constructor(e=new P,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){const n=this.center;t!==void 0?n.copy(t):o0.setFromPoints(e).getCenter(n);let s=0;for(let r=0,a=e.length;r<a;r++)s=Math.max(s,n.distanceToSquared(e[r]));return this.radius=Math.sqrt(s),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){const t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){const n=this.center.distanceToSquared(e);return t.copy(e),n>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;gr.subVectors(e,this.center);const t=gr.lengthSq();if(t>this.radius*this.radius){const n=Math.sqrt(t),s=(n-this.radius)*.5;this.center.addScaledVector(gr,s/n),this.radius+=s}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(El.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(gr.copy(e.center).add(El)),this.expandByPoint(gr.copy(e.center).sub(El))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(e){return this.radius=e.radius,this.center.fromArray(e.center),this}}let l0=0;const hn=new We,bl=new xt,ms=new P,an=new cn,_r=new cn,It=new P;class et extends Zi{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:l0++}),this.uuid=xn(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.indirectOffset=0,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(Tg(e)?fp:dp)(e,1):this.index=e,this}setIndirect(e,t=0){return this.indirect=e,this.indirectOffset=t,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,n=0){this.groups.push({start:e,count:t,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){const t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);const n=this.attributes.normal;if(n!==void 0){const r=new Ye().getNormalMatrix(e);n.applyNormalMatrix(r),n.needsUpdate=!0}const s=this.attributes.tangent;return s!==void 0&&(s.transformDirection(e),s.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(e){return hn.makeRotationFromQuaternion(e),this.applyMatrix4(hn),this}rotateX(e){return hn.makeRotationX(e),this.applyMatrix4(hn),this}rotateY(e){return hn.makeRotationY(e),this.applyMatrix4(hn),this}rotateZ(e){return hn.makeRotationZ(e),this.applyMatrix4(hn),this}translate(e,t,n){return hn.makeTranslation(e,t,n),this.applyMatrix4(hn),this}scale(e,t,n){return hn.makeScale(e,t,n),this.applyMatrix4(hn),this}lookAt(e){return bl.lookAt(e),bl.updateMatrix(),this.applyMatrix4(bl.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(ms).negate(),this.translate(ms.x,ms.y,ms.z),this}setFromPoints(e){const t=this.getAttribute("position");if(t===void 0){const n=[];for(let s=0,r=e.length;s<r;s++){const a=e[s];n.push(a.x,a.y,a.z||0)}this.setAttribute("position",new ze(n,3))}else{const n=Math.min(e.length,t.count);for(let s=0;s<n;s++){const r=e[s];t.setXYZ(s,r.x,r.y,r.z||0)}e.length>t.count&&Re("BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),t.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new cn);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){Be("BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new P(-1/0,-1/0,-1/0),new P(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let n=0,s=t.length;n<s;n++){const r=t[n];an.setFromBufferAttribute(r),this.morphTargetsRelative?(It.addVectors(this.boundingBox.min,an.min),this.boundingBox.expandByPoint(It),It.addVectors(this.boundingBox.max,an.max),this.boundingBox.expandByPoint(It)):(this.boundingBox.expandByPoint(an.min),this.boundingBox.expandByPoint(an.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&Be('BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new Mn);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){Be("BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new P,1/0);return}if(e){const n=this.boundingSphere.center;if(an.setFromBufferAttribute(e),t)for(let r=0,a=t.length;r<a;r++){const o=t[r];_r.setFromBufferAttribute(o),this.morphTargetsRelative?(It.addVectors(an.min,_r.min),an.expandByPoint(It),It.addVectors(an.max,_r.max),an.expandByPoint(It)):(an.expandByPoint(_r.min),an.expandByPoint(_r.max))}an.getCenter(n);let s=0;for(let r=0,a=e.count;r<a;r++)It.fromBufferAttribute(e,r),s=Math.max(s,n.distanceToSquared(It));if(t)for(let r=0,a=t.length;r<a;r++){const o=t[r],l=this.morphTargetsRelative;for(let c=0,h=o.count;c<h;c++)It.fromBufferAttribute(o,c),l&&(ms.fromBufferAttribute(e,c),It.add(ms)),s=Math.max(s,n.distanceToSquared(It))}this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&Be('BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){Be("BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const n=t.position,s=t.normal,r=t.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new Yt(new Float32Array(4*n.count),4));const a=this.getAttribute("tangent"),o=[],l=[];for(let x=0;x<n.count;x++)o[x]=new P,l[x]=new P;const c=new P,h=new P,u=new P,d=new j,f=new j,g=new j,_=new P,p=new P;function m(x,E,N){c.fromBufferAttribute(n,x),h.fromBufferAttribute(n,E),u.fromBufferAttribute(n,N),d.fromBufferAttribute(r,x),f.fromBufferAttribute(r,E),g.fromBufferAttribute(r,N),h.sub(c),u.sub(c),f.sub(d),g.sub(d);const C=1/(f.x*g.y-g.x*f.y);isFinite(C)&&(_.copy(h).multiplyScalar(g.y).addScaledVector(u,-f.y).multiplyScalar(C),p.copy(u).multiplyScalar(f.x).addScaledVector(h,-g.x).multiplyScalar(C),o[x].add(_),o[E].add(_),o[N].add(_),l[x].add(p),l[E].add(p),l[N].add(p))}let M=this.groups;M.length===0&&(M=[{start:0,count:e.count}]);for(let x=0,E=M.length;x<E;++x){const N=M[x],C=N.start,O=N.count;for(let F=C,V=C+O;F<V;F+=3)m(e.getX(F+0),e.getX(F+1),e.getX(F+2))}const y=new P,S=new P,w=new P,T=new P;function L(x){w.fromBufferAttribute(s,x),T.copy(w);const E=o[x];y.copy(E),y.sub(w.multiplyScalar(w.dot(E))).normalize(),S.crossVectors(T,E);const C=S.dot(l[x])<0?-1:1;a.setXYZW(x,y.x,y.y,y.z,C)}for(let x=0,E=M.length;x<E;++x){const N=M[x],C=N.start,O=N.count;for(let F=C,V=C+O;F<V;F+=3)L(e.getX(F+0)),L(e.getX(F+1)),L(e.getX(F+2))}}computeVertexNormals(){const e=this.index,t=this.getAttribute("position");if(t!==void 0){let n=this.getAttribute("normal");if(n===void 0)n=new Yt(new Float32Array(t.count*3),3),this.setAttribute("normal",n);else for(let d=0,f=n.count;d<f;d++)n.setXYZ(d,0,0,0);const s=new P,r=new P,a=new P,o=new P,l=new P,c=new P,h=new P,u=new P;if(e)for(let d=0,f=e.count;d<f;d+=3){const g=e.getX(d+0),_=e.getX(d+1),p=e.getX(d+2);s.fromBufferAttribute(t,g),r.fromBufferAttribute(t,_),a.fromBufferAttribute(t,p),h.subVectors(a,r),u.subVectors(s,r),h.cross(u),o.fromBufferAttribute(n,g),l.fromBufferAttribute(n,_),c.fromBufferAttribute(n,p),o.add(h),l.add(h),c.add(h),n.setXYZ(g,o.x,o.y,o.z),n.setXYZ(_,l.x,l.y,l.z),n.setXYZ(p,c.x,c.y,c.z)}else for(let d=0,f=t.count;d<f;d+=3)s.fromBufferAttribute(t,d+0),r.fromBufferAttribute(t,d+1),a.fromBufferAttribute(t,d+2),h.subVectors(a,r),u.subVectors(s,r),h.cross(u),n.setXYZ(d+0,h.x,h.y,h.z),n.setXYZ(d+1,h.x,h.y,h.z),n.setXYZ(d+2,h.x,h.y,h.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){const e=this.attributes.normal;for(let t=0,n=e.count;t<n;t++)It.fromBufferAttribute(e,t),It.normalize(),e.setXYZ(t,It.x,It.y,It.z)}toNonIndexed(){function e(o,l){const c=o.array,h=o.itemSize,u=o.normalized,d=new c.constructor(l.length*h);let f=0,g=0;for(let _=0,p=l.length;_<p;_++){o.isInterleavedBufferAttribute?f=l[_]*o.data.stride+o.offset:f=l[_]*h;for(let m=0;m<h;m++)d[g++]=c[f++]}return new Yt(d,h,u)}if(this.index===null)return Re("BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const t=new et,n=this.index.array,s=this.attributes;for(const o in s){const l=s[o],c=e(l,n);t.setAttribute(o,c)}const r=this.morphAttributes;for(const o in r){const l=[],c=r[o];for(let h=0,u=c.length;h<u;h++){const d=c[h],f=e(d,n);l.push(f)}t.morphAttributes[o]=l}t.morphTargetsRelative=this.morphTargetsRelative;const a=this.groups;for(let o=0,l=a.length;o<l;o++){const c=a[o];t.addGroup(c.start,c.count,c.materialIndex)}return t}toJSON(){const e={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.type,this.name!==""&&(e.name=this.name),Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0){const l=this.parameters;for(const c in l)l[c]!==void 0&&(e[c]=l[c]);return e}e.data={attributes:{}};const t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});const n=this.attributes;for(const l in n){const c=n[l];e.data.attributes[l]=c.toJSON(e.data)}const s={};let r=!1;for(const l in this.morphAttributes){const c=this.morphAttributes[l],h=[];for(let u=0,d=c.length;u<d;u++){const f=c[u];h.push(f.toJSON(e.data))}h.length>0&&(s[l]=h,r=!0)}r&&(e.data.morphAttributes=s,e.data.morphTargetsRelative=this.morphTargetsRelative);const a=this.groups;a.length>0&&(e.data.groups=JSON.parse(JSON.stringify(a)));const o=this.boundingSphere;return o!==null&&(e.data.boundingSphere=o.toJSON()),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const t={};this.name=e.name;const n=e.index;n!==null&&this.setIndex(n.clone());const s=e.attributes;for(const c in s){const h=s[c];this.setAttribute(c,h.clone(t))}const r=e.morphAttributes;for(const c in r){const h=[],u=r[c];for(let d=0,f=u.length;d<f;d++)h.push(u[d].clone(t));this.morphAttributes[c]=h}this.morphTargetsRelative=e.morphTargetsRelative;const a=e.groups;for(let c=0,h=a.length;c<h;c++){const u=a[c];this.addGroup(u.start,u.count,u.materialIndex)}const o=e.boundingBox;o!==null&&(this.boundingBox=o.clone());const l=e.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}class Vh{constructor(e,t){this.isInterleavedBuffer=!0,this.array=e,this.stride=t,this.count=e!==void 0?e.length/t:0,this.usage=$c,this.updateRanges=[],this.version=0,this.uuid=xn()}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.array=new e.array.constructor(e.array),this.count=e.count,this.stride=e.stride,this.usage=e.usage,this}copyAt(e,t,n){e*=this.stride,n*=t.stride;for(let s=0,r=this.stride;s<r;s++)this.array[e+s]=t.array[n+s];return this}set(e,t=0){return this.array.set(e,t),this}clone(e){e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=xn()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=this.array.slice(0).buffer);const t=new this.array.constructor(e.arrayBuffers[this.array.buffer._uuid]),n=new this.constructor(t,this.stride);return n.setUsage(this.usage),n}onUpload(e){return this.onUploadCallback=e,this}toJSON(e){return e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=xn()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=Array.from(new Uint32Array(this.array.buffer))),{uuid:this.uuid,buffer:this.array.buffer._uuid,type:this.array.constructor.name,stride:this.stride}}}const qt=new P;class Ln{constructor(e,t,n,s=!1){this.isInterleavedBufferAttribute=!0,this.name="",this.data=e,this.itemSize=t,this.offset=n,this.normalized=s}get count(){return this.data.count}get array(){return this.data.array}set needsUpdate(e){this.data.needsUpdate=e}applyMatrix4(e){for(let t=0,n=this.data.count;t<n;t++)qt.fromBufferAttribute(this,t),qt.applyMatrix4(e),this.setXYZ(t,qt.x,qt.y,qt.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)qt.fromBufferAttribute(this,t),qt.applyNormalMatrix(e),this.setXYZ(t,qt.x,qt.y,qt.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)qt.fromBufferAttribute(this,t),qt.transformDirection(e),this.setXYZ(t,qt.x,qt.y,qt.z);return this}getComponent(e,t){let n=this.array[e*this.data.stride+this.offset+t];return this.normalized&&(n=An(n,this.array)),n}setComponent(e,t,n){return this.normalized&&(n=ot(n,this.array)),this.data.array[e*this.data.stride+this.offset+t]=n,this}setX(e,t){return this.normalized&&(t=ot(t,this.array)),this.data.array[e*this.data.stride+this.offset]=t,this}setY(e,t){return this.normalized&&(t=ot(t,this.array)),this.data.array[e*this.data.stride+this.offset+1]=t,this}setZ(e,t){return this.normalized&&(t=ot(t,this.array)),this.data.array[e*this.data.stride+this.offset+2]=t,this}setW(e,t){return this.normalized&&(t=ot(t,this.array)),this.data.array[e*this.data.stride+this.offset+3]=t,this}getX(e){let t=this.data.array[e*this.data.stride+this.offset];return this.normalized&&(t=An(t,this.array)),t}getY(e){let t=this.data.array[e*this.data.stride+this.offset+1];return this.normalized&&(t=An(t,this.array)),t}getZ(e){let t=this.data.array[e*this.data.stride+this.offset+2];return this.normalized&&(t=An(t,this.array)),t}getW(e){let t=this.data.array[e*this.data.stride+this.offset+3];return this.normalized&&(t=An(t,this.array)),t}setXY(e,t,n){return e=e*this.data.stride+this.offset,this.normalized&&(t=ot(t,this.array),n=ot(n,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this}setXYZ(e,t,n,s){return e=e*this.data.stride+this.offset,this.normalized&&(t=ot(t,this.array),n=ot(n,this.array),s=ot(s,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this.data.array[e+2]=s,this}setXYZW(e,t,n,s,r){return e=e*this.data.stride+this.offset,this.normalized&&(t=ot(t,this.array),n=ot(n,this.array),s=ot(s,this.array),r=ot(r,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this.data.array[e+2]=s,this.data.array[e+3]=r,this}clone(e){if(e===void 0){No("InterleavedBufferAttribute.clone(): Cloning an interleaved buffer attribute will de-interleave buffer data.");const t=[];for(let n=0;n<this.count;n++){const s=n*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)t.push(this.data.array[s+r])}return new Yt(new this.array.constructor(t),this.itemSize,this.normalized)}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.clone(e)),new Ln(e.interleavedBuffers[this.data.uuid],this.itemSize,this.offset,this.normalized)}toJSON(e){if(e===void 0){No("InterleavedBufferAttribute.toJSON(): Serializing an interleaved buffer attribute will de-interleave buffer data.");const t=[];for(let n=0;n<this.count;n++){const s=n*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)t.push(this.data.array[s+r])}return{itemSize:this.itemSize,type:this.array.constructor.name,array:t,normalized:this.normalized}}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.toJSON(e)),{isInterleavedBufferAttribute:!0,itemSize:this.itemSize,data:this.data.uuid,offset:this.offset,normalized:this.normalized}}}let c0=0;class vn extends Zi{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:c0++}),this.uuid=xn(),this.name="",this.type="Material",this.blending=Os,this.side=di,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=lc,this.blendDst=cc,this.blendEquation=Hi,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new Me(0,0,0),this.blendAlpha=0,this.depthFunc=Gs,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=Nu,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=rs,this.stencilZFail=rs,this.stencilZPass=rs,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(const t in e){const n=e[t];if(n===void 0){Re(`Material: parameter '${t}' has value of undefined.`);continue}const s=this[t];if(s===void 0){Re(`Material: '${t}' is not a property of THREE.${this.type}.`);continue}s&&s.isColor?s.set(n):s&&s.isVector3&&n&&n.isVector3?s.copy(n):this[t]=n}}toJSON(e){const t=e===void 0||typeof e=="string";t&&(e={textures:{},images:{}});const n={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,this.name!==""&&(n.name=this.name),this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(n.sheenColorMap=this.sheenColorMap.toJSON(e).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(n.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(e).uuid),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(e).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(e).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(e).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(e).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(e).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.shadowSide!==null&&(n.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),this.blending!==Os&&(n.blending=this.blending),this.side!==di&&(n.side=this.side),this.vertexColors===!0&&(n.vertexColors=!0),this.opacity<1&&(n.opacity=this.opacity),this.transparent===!0&&(n.transparent=!0),this.blendSrc!==lc&&(n.blendSrc=this.blendSrc),this.blendDst!==cc&&(n.blendDst=this.blendDst),this.blendEquation!==Hi&&(n.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(n.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(n.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(n.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(n.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(n.blendAlpha=this.blendAlpha),this.depthFunc!==Gs&&(n.depthFunc=this.depthFunc),this.depthTest===!1&&(n.depthTest=this.depthTest),this.depthWrite===!1&&(n.depthWrite=this.depthWrite),this.colorWrite===!1&&(n.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(n.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==Nu&&(n.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(n.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(n.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==rs&&(n.stencilFail=this.stencilFail),this.stencilZFail!==rs&&(n.stencilZFail=this.stencilZFail),this.stencilZPass!==rs&&(n.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(n.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(n.rotation=this.rotation),this.polygonOffset===!0&&(n.polygonOffset=!0),this.polygonOffsetFactor!==0&&(n.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(n.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(n.linewidth=this.linewidth),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.dithering===!0&&(n.dithering=!0),this.alphaTest>0&&(n.alphaTest=this.alphaTest),this.alphaHash===!0&&(n.alphaHash=!0),this.alphaToCoverage===!0&&(n.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(n.premultipliedAlpha=!0),this.forceSinglePass===!0&&(n.forceSinglePass=!0),this.allowOverride===!1&&(n.allowOverride=!1),this.wireframe===!0&&(n.wireframe=!0),this.wireframeLinewidth>1&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(n.flatShading=!0),this.visible===!1&&(n.visible=!1),this.toneMapped===!1&&(n.toneMapped=!1),this.fog===!1&&(n.fog=!1),Object.keys(this.userData).length>0&&(n.userData=this.userData);function s(r){const a=[];for(const o in r){const l=r[o];delete l.metadata,a.push(l)}return a}if(t){const r=s(e.textures),a=s(e.images);r.length>0&&(n.textures=r),a.length>0&&(n.images=a)}return n}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;const t=e.clippingPlanes;let n=null;if(t!==null){const s=t.length;n=new Array(s);for(let r=0;r!==s;++r)n[r]=t[r].clone()}return this.clippingPlanes=n,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.allowOverride=e.allowOverride,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}}class Gi extends vn{constructor(e){super(),this.isSpriteMaterial=!0,this.type="SpriteMaterial",this.color=new Me(16777215),this.map=null,this.alphaMap=null,this.rotation=0,this.sizeAttenuation=!0,this.transparent=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.rotation=e.rotation,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}}let gs;const xr=new P,_s=new P,xs=new P,vs=new j,vr=new j,pp=new We,Ta=new P,Mr=new P,Aa=new P,ju=new j,Tl=new j,$u=new j;class Ps extends xt{constructor(e=new Gi){if(super(),this.isSprite=!0,this.type="Sprite",gs===void 0){gs=new et;const t=new Float32Array([-.5,-.5,0,0,0,.5,-.5,0,1,0,.5,.5,0,1,1,-.5,.5,0,0,1]),n=new Vh(t,5);gs.setIndex([0,1,2,0,2,3]),gs.setAttribute("position",new Ln(n,3,0,!1)),gs.setAttribute("uv",new Ln(n,2,3,!1))}this.geometry=gs,this.material=e,this.center=new j(.5,.5),this.count=1}raycast(e,t){e.camera===null&&Be('Sprite: "Raycaster.camera" needs to be set in order to raycast against sprites.'),_s.setFromMatrixScale(this.matrixWorld),pp.copy(e.camera.matrixWorld),this.modelViewMatrix.multiplyMatrices(e.camera.matrixWorldInverse,this.matrixWorld),xs.setFromMatrixPosition(this.modelViewMatrix),e.camera.isPerspectiveCamera&&this.material.sizeAttenuation===!1&&_s.multiplyScalar(-xs.z);const n=this.material.rotation;let s,r;n!==0&&(r=Math.cos(n),s=Math.sin(n));const a=this.center;wa(Ta.set(-.5,-.5,0),xs,a,_s,s,r),wa(Mr.set(.5,-.5,0),xs,a,_s,s,r),wa(Aa.set(.5,.5,0),xs,a,_s,s,r),ju.set(0,0),Tl.set(1,0),$u.set(1,1);let o=e.ray.intersectTriangle(Ta,Mr,Aa,!1,xr);if(o===null&&(wa(Mr.set(-.5,.5,0),xs,a,_s,s,r),Tl.set(0,1),o=e.ray.intersectTriangle(Ta,Aa,Mr,!1,xr),o===null))return;const l=e.ray.origin.distanceTo(xr);l<e.near||l>e.far||t.push({distance:l,point:xr.clone(),uv:pn.getInterpolation(xr,Ta,Mr,Aa,ju,Tl,$u,new j),face:null,object:this})}copy(e,t){return super.copy(e,t),e.center!==void 0&&this.center.copy(e.center),this.material=e.material,this}}function wa(i,e,t,n,s,r){vs.subVectors(i,t).addScalar(.5).multiply(n),s!==void 0?(vr.x=r*vs.x-s*vs.y,vr.y=s*vs.x+r*vs.y):vr.copy(vs),i.copy(e),i.x+=vr.x,i.y+=vr.y,i.applyMatrix4(pp)}const si=new P,Al=new P,Ca=new P,Mi=new P,wl=new P,Ra=new P,Cl=new P;class ir{constructor(e=new P,t=new P(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,si)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);const n=t.dot(this.direction);return n<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){const t=si.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(si.copy(this.origin).addScaledVector(this.direction,t),si.distanceToSquared(e))}distanceSqToSegment(e,t,n,s){Al.copy(e).add(t).multiplyScalar(.5),Ca.copy(t).sub(e).normalize(),Mi.copy(this.origin).sub(Al);const r=e.distanceTo(t)*.5,a=-this.direction.dot(Ca),o=Mi.dot(this.direction),l=-Mi.dot(Ca),c=Mi.lengthSq(),h=Math.abs(1-a*a);let u,d,f,g;if(h>0)if(u=a*l-o,d=a*o-l,g=r*h,u>=0)if(d>=-g)if(d<=g){const _=1/h;u*=_,d*=_,f=u*(u+a*d+2*o)+d*(a*u+d+2*l)+c}else d=r,u=Math.max(0,-(a*d+o)),f=-u*u+d*(d+2*l)+c;else d=-r,u=Math.max(0,-(a*d+o)),f=-u*u+d*(d+2*l)+c;else d<=-g?(u=Math.max(0,-(-a*r+o)),d=u>0?-r:Math.min(Math.max(-r,-l),r),f=-u*u+d*(d+2*l)+c):d<=g?(u=0,d=Math.min(Math.max(-r,-l),r),f=d*(d+2*l)+c):(u=Math.max(0,-(a*r+o)),d=u>0?r:Math.min(Math.max(-r,-l),r),f=-u*u+d*(d+2*l)+c);else d=a>0?-r:r,u=Math.max(0,-(a*d+o)),f=-u*u+d*(d+2*l)+c;return n&&n.copy(this.origin).addScaledVector(this.direction,u),s&&s.copy(Al).addScaledVector(Ca,d),f}intersectSphere(e,t){si.subVectors(e.center,this.origin);const n=si.dot(this.direction),s=si.dot(si)-n*n,r=e.radius*e.radius;if(s>r)return null;const a=Math.sqrt(r-s),o=n-a,l=n+a;return l<0?null:o<0?this.at(l,t):this.at(o,t)}intersectsSphere(e){return e.radius<0?!1:this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){const t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;const n=-(this.origin.dot(e.normal)+e.constant)/t;return n>=0?n:null}intersectPlane(e,t){const n=this.distanceToPlane(e);return n===null?null:this.at(n,t)}intersectsPlane(e){const t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let n,s,r,a,o,l;const c=1/this.direction.x,h=1/this.direction.y,u=1/this.direction.z,d=this.origin;return c>=0?(n=(e.min.x-d.x)*c,s=(e.max.x-d.x)*c):(n=(e.max.x-d.x)*c,s=(e.min.x-d.x)*c),h>=0?(r=(e.min.y-d.y)*h,a=(e.max.y-d.y)*h):(r=(e.max.y-d.y)*h,a=(e.min.y-d.y)*h),n>a||r>s||((r>n||isNaN(n))&&(n=r),(a<s||isNaN(s))&&(s=a),u>=0?(o=(e.min.z-d.z)*u,l=(e.max.z-d.z)*u):(o=(e.max.z-d.z)*u,l=(e.min.z-d.z)*u),n>l||o>s)||((o>n||n!==n)&&(n=o),(l<s||s!==s)&&(s=l),s<0)?null:this.at(n>=0?n:s,t)}intersectsBox(e){return this.intersectBox(e,si)!==null}intersectTriangle(e,t,n,s,r){wl.subVectors(t,e),Ra.subVectors(n,e),Cl.crossVectors(wl,Ra);let a=this.direction.dot(Cl),o;if(a>0){if(s)return null;o=1}else if(a<0)o=-1,a=-a;else return null;Mi.subVectors(this.origin,e);const l=o*this.direction.dot(Ra.crossVectors(Mi,Ra));if(l<0)return null;const c=o*this.direction.dot(wl.cross(Mi));if(c<0||l+c>a)return null;const h=-o*Mi.dot(Cl);return h<0?null:this.at(h/a,r)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class yt extends vn{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new Me(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Nn,this.combine=Sh,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}}const Ju=new We,Ui=new ir,Pa=new Mn,Zu=new P,La=new P,Da=new P,Ia=new P,Rl=new P,Na=new P,Qu=new P,Ua=new P;class st extends xt{constructor(e=new et,t=new yt){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){const t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){const s=t[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=s.length;r<a;r++){const o=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}getVertexPosition(e,t){const n=this.geometry,s=n.attributes.position,r=n.morphAttributes.position,a=n.morphTargetsRelative;t.fromBufferAttribute(s,e);const o=this.morphTargetInfluences;if(r&&o){Na.set(0,0,0);for(let l=0,c=r.length;l<c;l++){const h=o[l],u=r[l];h!==0&&(Rl.fromBufferAttribute(u,e),a?Na.addScaledVector(Rl,h):Na.addScaledVector(Rl.sub(t),h))}t.add(Na)}return t}raycast(e,t){const n=this.geometry,s=this.material,r=this.matrixWorld;s!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),Pa.copy(n.boundingSphere),Pa.applyMatrix4(r),Ui.copy(e.ray).recast(e.near),!(Pa.containsPoint(Ui.origin)===!1&&(Ui.intersectSphere(Pa,Zu)===null||Ui.origin.distanceToSquared(Zu)>(e.far-e.near)**2))&&(Ju.copy(r).invert(),Ui.copy(e.ray).applyMatrix4(Ju),!(n.boundingBox!==null&&Ui.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(e,t,Ui)))}_computeIntersections(e,t,n){let s;const r=this.geometry,a=this.material,o=r.index,l=r.attributes.position,c=r.attributes.uv,h=r.attributes.uv1,u=r.attributes.normal,d=r.groups,f=r.drawRange;if(o!==null)if(Array.isArray(a))for(let g=0,_=d.length;g<_;g++){const p=d[g],m=a[p.materialIndex],M=Math.max(p.start,f.start),y=Math.min(o.count,Math.min(p.start+p.count,f.start+f.count));for(let S=M,w=y;S<w;S+=3){const T=o.getX(S),L=o.getX(S+1),x=o.getX(S+2);s=Oa(this,m,e,n,c,h,u,T,L,x),s&&(s.faceIndex=Math.floor(S/3),s.face.materialIndex=p.materialIndex,t.push(s))}}else{const g=Math.max(0,f.start),_=Math.min(o.count,f.start+f.count);for(let p=g,m=_;p<m;p+=3){const M=o.getX(p),y=o.getX(p+1),S=o.getX(p+2);s=Oa(this,a,e,n,c,h,u,M,y,S),s&&(s.faceIndex=Math.floor(p/3),t.push(s))}}else if(l!==void 0)if(Array.isArray(a))for(let g=0,_=d.length;g<_;g++){const p=d[g],m=a[p.materialIndex],M=Math.max(p.start,f.start),y=Math.min(l.count,Math.min(p.start+p.count,f.start+f.count));for(let S=M,w=y;S<w;S+=3){const T=S,L=S+1,x=S+2;s=Oa(this,m,e,n,c,h,u,T,L,x),s&&(s.faceIndex=Math.floor(S/3),s.face.materialIndex=p.materialIndex,t.push(s))}}else{const g=Math.max(0,f.start),_=Math.min(l.count,f.start+f.count);for(let p=g,m=_;p<m;p+=3){const M=p,y=p+1,S=p+2;s=Oa(this,a,e,n,c,h,u,M,y,S),s&&(s.faceIndex=Math.floor(p/3),t.push(s))}}}}function h0(i,e,t,n,s,r,a,o){let l;if(e.side===Jt?l=n.intersectTriangle(a,r,s,!0,o):l=n.intersectTriangle(s,r,a,e.side===di,o),l===null)return null;Ua.copy(o),Ua.applyMatrix4(i.matrixWorld);const c=t.ray.origin.distanceTo(Ua);return c<t.near||c>t.far?null:{distance:c,point:Ua.clone(),object:i}}function Oa(i,e,t,n,s,r,a,o,l,c){i.getVertexPosition(o,La),i.getVertexPosition(l,Da),i.getVertexPosition(c,Ia);const h=h0(i,e,t,n,La,Da,Ia,Qu);if(h){const u=new P;pn.getBarycoord(Qu,La,Da,Ia,u),s&&(h.uv=pn.getInterpolatedAttribute(s,o,l,c,u,new j)),r&&(h.uv1=pn.getInterpolatedAttribute(r,o,l,c,u,new j)),a&&(h.normal=pn.getInterpolatedAttribute(a,o,l,c,u,new P),h.normal.dot(n.direction)>0&&h.normal.multiplyScalar(-1));const d={a:o,b:l,c,normal:new P,materialIndex:0};pn.getNormal(La,Da,Ia,d.normal),h.face=d,h.barycoord=u}return h}const ed=new P,td=new it,nd=new it,u0=new P,id=new We,Fa=new P,Pl=new Mn,sd=new We,Ll=new ir;class d0 extends st{constructor(e,t){super(e,t),this.isSkinnedMesh=!0,this.type="SkinnedMesh",this.bindMode=Ru,this.bindMatrix=new We,this.bindMatrixInverse=new We,this.boundingBox=null,this.boundingSphere=null}computeBoundingBox(){const e=this.geometry;this.boundingBox===null&&(this.boundingBox=new cn),this.boundingBox.makeEmpty();const t=e.getAttribute("position");for(let n=0;n<t.count;n++)this.getVertexPosition(n,Fa),this.boundingBox.expandByPoint(Fa)}computeBoundingSphere(){const e=this.geometry;this.boundingSphere===null&&(this.boundingSphere=new Mn),this.boundingSphere.makeEmpty();const t=e.getAttribute("position");for(let n=0;n<t.count;n++)this.getVertexPosition(n,Fa),this.boundingSphere.expandByPoint(Fa)}copy(e,t){return super.copy(e,t),this.bindMode=e.bindMode,this.bindMatrix.copy(e.bindMatrix),this.bindMatrixInverse.copy(e.bindMatrixInverse),this.skeleton=e.skeleton,e.boundingBox!==null&&(this.boundingBox=e.boundingBox.clone()),e.boundingSphere!==null&&(this.boundingSphere=e.boundingSphere.clone()),this}raycast(e,t){const n=this.material,s=this.matrixWorld;n!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),Pl.copy(this.boundingSphere),Pl.applyMatrix4(s),e.ray.intersectsSphere(Pl)!==!1&&(sd.copy(s).invert(),Ll.copy(e.ray).applyMatrix4(sd),!(this.boundingBox!==null&&Ll.intersectsBox(this.boundingBox)===!1)&&this._computeIntersections(e,t,Ll)))}getVertexPosition(e,t){return super.getVertexPosition(e,t),this.applyBoneTransform(e,t),t}bind(e,t){this.skeleton=e,t===void 0&&(this.updateMatrixWorld(!0),this.skeleton.calculateInverses(),t=this.matrixWorld),this.bindMatrix.copy(t),this.bindMatrixInverse.copy(t).invert()}pose(){this.skeleton.pose()}normalizeSkinWeights(){const e=new it,t=this.geometry.attributes.skinWeight;for(let n=0,s=t.count;n<s;n++){e.fromBufferAttribute(t,n);const r=1/e.manhattanLength();r!==1/0?e.multiplyScalar(r):e.set(1,0,0,0),t.setXYZW(n,e.x,e.y,e.z,e.w)}}updateMatrixWorld(e){super.updateMatrixWorld(e),this.bindMode===Ru?this.bindMatrixInverse.copy(this.matrixWorld).invert():this.bindMode===pg?this.bindMatrixInverse.copy(this.bindMatrix).invert():Re("SkinnedMesh: Unrecognized bindMode: "+this.bindMode)}applyBoneTransform(e,t){const n=this.skeleton,s=this.geometry;td.fromBufferAttribute(s.attributes.skinIndex,e),nd.fromBufferAttribute(s.attributes.skinWeight,e),ed.copy(t).applyMatrix4(this.bindMatrix),t.set(0,0,0);for(let r=0;r<4;r++){const a=nd.getComponent(r);if(a!==0){const o=td.getComponent(r);id.multiplyMatrices(n.bones[o].matrixWorld,n.boneInverses[o]),t.addScaledVector(u0.copy(ed).applyMatrix4(id),a)}}return t.applyMatrix4(this.bindMatrixInverse)}}class mp extends xt{constructor(){super(),this.isBone=!0,this.type="Bone"}}class Wh extends Ct{constructor(e=null,t=1,n=1,s,r,a,o,l,c=wt,h=wt,u,d){super(null,a,o,l,c,h,s,r,u,d),this.isDataTexture=!0,this.image={data:e,width:t,height:n},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}const rd=new We,f0=new We;class Xh{constructor(e=[],t=[]){this.uuid=xn(),this.bones=e.slice(0),this.boneInverses=t,this.boneMatrices=null,this.previousBoneMatrices=null,this.boneTexture=null,this.init()}init(){const e=this.bones,t=this.boneInverses;if(this.boneMatrices=new Float32Array(e.length*16),t.length===0)this.calculateInverses();else if(e.length!==t.length){Re("Skeleton: Number of inverse bone matrices does not match amount of bones."),this.boneInverses=[];for(let n=0,s=this.bones.length;n<s;n++)this.boneInverses.push(new We)}}calculateInverses(){this.boneInverses.length=0;for(let e=0,t=this.bones.length;e<t;e++){const n=new We;this.bones[e]&&n.copy(this.bones[e].matrixWorld).invert(),this.boneInverses.push(n)}}pose(){for(let e=0,t=this.bones.length;e<t;e++){const n=this.bones[e];n&&n.matrixWorld.copy(this.boneInverses[e]).invert()}for(let e=0,t=this.bones.length;e<t;e++){const n=this.bones[e];n&&(n.parent&&n.parent.isBone?(n.matrix.copy(n.parent.matrixWorld).invert(),n.matrix.multiply(n.matrixWorld)):n.matrix.copy(n.matrixWorld),n.matrix.decompose(n.position,n.quaternion,n.scale))}}update(){const e=this.bones,t=this.boneInverses,n=this.boneMatrices,s=this.boneTexture;for(let r=0,a=e.length;r<a;r++){const o=e[r]?e[r].matrixWorld:f0;rd.multiplyMatrices(o,t[r]),rd.toArray(n,r*16)}s!==null&&(s.needsUpdate=!0)}clone(){return new Xh(this.bones,this.boneInverses)}computeBoneTexture(){let e=Math.sqrt(this.bones.length*4);e=Math.ceil(e/4)*4,e=Math.max(e,4);const t=new Float32Array(e*e*4);t.set(this.boneMatrices);const n=new Wh(t,e,e,_n,gn);return n.needsUpdate=!0,this.boneMatrices=t,this.boneTexture=n,this}getBoneByName(e){for(let t=0,n=this.bones.length;t<n;t++){const s=this.bones[t];if(s.name===e)return s}}dispose(){this.boneTexture!==null&&(this.boneTexture.dispose(),this.boneTexture=null)}fromJSON(e,t){this.uuid=e.uuid;for(let n=0,s=e.bones.length;n<s;n++){const r=e.bones[n];let a=t[r];a===void 0&&(Re("Skeleton: No bone found with UUID:",r),a=new mp),this.bones.push(a),this.boneInverses.push(new We().fromArray(e.boneInverses[n]))}return this.init(),this}toJSON(){const e={metadata:{version:4.7,type:"Skeleton",generator:"Skeleton.toJSON"},bones:[],boneInverses:[]};e.uuid=this.uuid;const t=this.bones,n=this.boneInverses;for(let s=0,r=t.length;s<r;s++){const a=t[s];e.bones.push(a.uuid);const o=n[s];e.boneInverses.push(o.toArray())}return e}}class Jc extends Yt{constructor(e,t,n,s=1){super(e,t,n),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=s}copy(e){return super.copy(e),this.meshPerAttribute=e.meshPerAttribute,this}toJSON(){const e=super.toJSON();return e.meshPerAttribute=this.meshPerAttribute,e.isInstancedBufferAttribute=!0,e}}const Ms=new We,ad=new We,Ba=[],od=new cn,p0=new We,yr=new st,Sr=new Mn;class m0 extends st{constructor(e,t,n){super(e,t),this.isInstancedMesh=!0,this.instanceMatrix=new Jc(new Float32Array(n*16),16),this.previousInstanceMatrix=null,this.instanceColor=null,this.morphTexture=null,this.count=n,this.boundingBox=null,this.boundingSphere=null;for(let s=0;s<n;s++)this.setMatrixAt(s,p0)}computeBoundingBox(){const e=this.geometry,t=this.count;this.boundingBox===null&&(this.boundingBox=new cn),e.boundingBox===null&&e.computeBoundingBox(),this.boundingBox.makeEmpty();for(let n=0;n<t;n++)this.getMatrixAt(n,Ms),od.copy(e.boundingBox).applyMatrix4(Ms),this.boundingBox.union(od)}computeBoundingSphere(){const e=this.geometry,t=this.count;this.boundingSphere===null&&(this.boundingSphere=new Mn),e.boundingSphere===null&&e.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let n=0;n<t;n++)this.getMatrixAt(n,Ms),Sr.copy(e.boundingSphere).applyMatrix4(Ms),this.boundingSphere.union(Sr)}copy(e,t){return super.copy(e,t),this.instanceMatrix.copy(e.instanceMatrix),e.previousInstanceMatrix!==null&&(this.previousInstanceMatrix=e.previousInstanceMatrix.clone()),e.morphTexture!==null&&(this.morphTexture=e.morphTexture.clone()),e.instanceColor!==null&&(this.instanceColor=e.instanceColor.clone()),this.count=e.count,e.boundingBox!==null&&(this.boundingBox=e.boundingBox.clone()),e.boundingSphere!==null&&(this.boundingSphere=e.boundingSphere.clone()),this}getColorAt(e,t){t.fromArray(this.instanceColor.array,e*3)}getMatrixAt(e,t){t.fromArray(this.instanceMatrix.array,e*16)}getMorphAt(e,t){const n=t.morphTargetInfluences,s=this.morphTexture.source.data.data,r=n.length+1,a=e*r+1;for(let o=0;o<n.length;o++)n[o]=s[a+o]}raycast(e,t){const n=this.matrixWorld,s=this.count;if(yr.geometry=this.geometry,yr.material=this.material,yr.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),Sr.copy(this.boundingSphere),Sr.applyMatrix4(n),e.ray.intersectsSphere(Sr)!==!1))for(let r=0;r<s;r++){this.getMatrixAt(r,Ms),ad.multiplyMatrices(n,Ms),yr.matrixWorld=ad,yr.raycast(e,Ba);for(let a=0,o=Ba.length;a<o;a++){const l=Ba[a];l.instanceId=r,l.object=this,t.push(l)}Ba.length=0}}setColorAt(e,t){this.instanceColor===null&&(this.instanceColor=new Jc(new Float32Array(this.instanceMatrix.count*3).fill(1),3)),t.toArray(this.instanceColor.array,e*3)}setMatrixAt(e,t){t.toArray(this.instanceMatrix.array,e*16)}setMorphAt(e,t){const n=t.morphTargetInfluences,s=n.length+1;this.morphTexture===null&&(this.morphTexture=new Wh(new Float32Array(s*this.count),s,this.count,Dh,gn));const r=this.morphTexture.source.data.data;let a=0;for(let c=0;c<n.length;c++)a+=n[c];const o=this.geometry.morphTargetsRelative?1:1-a,l=s*e;r[l]=o,r.set(n,l+1)}updateMorphTargets(){}dispose(){this.dispatchEvent({type:"dispose"}),this.morphTexture!==null&&(this.morphTexture.dispose(),this.morphTexture=null)}}const Dl=new P,g0=new P,_0=new Ye;class bi{constructor(e=new P(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,n,s){return this.normal.set(e,t,n),this.constant=s,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,n){const s=Dl.subVectors(n,t).cross(g0.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(s,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){const e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t){const n=e.delta(Dl),s=this.normal.dot(n);if(s===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;const r=-(e.start.dot(this.normal)+this.constant)/s;return r<0||r>1?null:t.copy(e.start).addScaledVector(n,r)}intersectsLine(e){const t=this.distanceToPoint(e.start),n=this.distanceToPoint(e.end);return t<0&&n>0||n<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){const n=t||_0.getNormalMatrix(e),s=this.coplanarPoint(Dl).applyMatrix4(e),r=this.normal.applyMatrix3(n).normalize();return this.constant=-s.dot(r),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}}const Oi=new Mn,x0=new j(.5,.5),za=new P;class Kh{constructor(e=new bi,t=new bi,n=new bi,s=new bi,r=new bi,a=new bi){this.planes=[e,t,n,s,r,a]}set(e,t,n,s,r,a){const o=this.planes;return o[0].copy(e),o[1].copy(t),o[2].copy(n),o[3].copy(s),o[4].copy(r),o[5].copy(a),this}copy(e){const t=this.planes;for(let n=0;n<6;n++)t[n].copy(e.planes[n]);return this}setFromProjectionMatrix(e,t=Wn,n=!1){const s=this.planes,r=e.elements,a=r[0],o=r[1],l=r[2],c=r[3],h=r[4],u=r[5],d=r[6],f=r[7],g=r[8],_=r[9],p=r[10],m=r[11],M=r[12],y=r[13],S=r[14],w=r[15];if(s[0].setComponents(c-a,f-h,m-g,w-M).normalize(),s[1].setComponents(c+a,f+h,m+g,w+M).normalize(),s[2].setComponents(c+o,f+u,m+_,w+y).normalize(),s[3].setComponents(c-o,f-u,m-_,w-y).normalize(),n)s[4].setComponents(l,d,p,S).normalize(),s[5].setComponents(c-l,f-d,m-p,w-S).normalize();else if(s[4].setComponents(c-l,f-d,m-p,w-S).normalize(),t===Wn)s[5].setComponents(c+l,f+d,m+p,w+S).normalize();else if(t===ea)s[5].setComponents(l,d,p,S).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),Oi.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{const t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),Oi.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(Oi)}intersectsSprite(e){Oi.center.set(0,0,0);const t=x0.distanceTo(e.center);return Oi.radius=.7071067811865476+t,Oi.applyMatrix4(e.matrixWorld),this.intersectsSphere(Oi)}intersectsSphere(e){const t=this.planes,n=e.center,s=-e.radius;for(let r=0;r<6;r++)if(t[r].distanceToPoint(n)<s)return!1;return!0}intersectsBox(e){const t=this.planes;for(let n=0;n<6;n++){const s=t[n];if(za.x=s.normal.x>0?e.max.x:e.min.x,za.y=s.normal.y>0?e.max.y:e.min.y,za.z=s.normal.z>0?e.max.z:e.min.z,s.distanceToPoint(za)<0)return!1}return!0}containsPoint(e){const t=this.planes;for(let n=0;n<6;n++)if(t[n].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}class Qi extends vn{constructor(e){super(),this.isLineBasicMaterial=!0,this.type="LineBasicMaterial",this.color=new Me(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.linewidth=e.linewidth,this.linecap=e.linecap,this.linejoin=e.linejoin,this.fog=e.fog,this}}const Oo=new P,Fo=new P,ld=new We,Er=new ir,ka=new Mn,Il=new P,cd=new P;class Yo extends xt{constructor(e=new et,t=new Qi){super(),this.isLine=!0,this.type="Line",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}computeLineDistances(){const e=this.geometry;if(e.index===null){const t=e.attributes.position,n=[0];for(let s=1,r=t.count;s<r;s++)Oo.fromBufferAttribute(t,s-1),Fo.fromBufferAttribute(t,s),n[s]=n[s-1],n[s]+=Oo.distanceTo(Fo);e.setAttribute("lineDistance",new ze(n,1))}else Re("Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}raycast(e,t){const n=this.geometry,s=this.matrixWorld,r=e.params.Line.threshold,a=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),ka.copy(n.boundingSphere),ka.applyMatrix4(s),ka.radius+=r,e.ray.intersectsSphere(ka)===!1)return;ld.copy(s).invert(),Er.copy(e.ray).applyMatrix4(ld);const o=r/((this.scale.x+this.scale.y+this.scale.z)/3),l=o*o,c=this.isLineSegments?2:1,h=n.index,d=n.attributes.position;if(h!==null){const f=Math.max(0,a.start),g=Math.min(h.count,a.start+a.count);for(let _=f,p=g-1;_<p;_+=c){const m=h.getX(_),M=h.getX(_+1),y=Ha(this,e,Er,l,m,M,_);y&&t.push(y)}if(this.isLineLoop){const _=h.getX(g-1),p=h.getX(f),m=Ha(this,e,Er,l,_,p,g-1);m&&t.push(m)}}else{const f=Math.max(0,a.start),g=Math.min(d.count,a.start+a.count);for(let _=f,p=g-1;_<p;_+=c){const m=Ha(this,e,Er,l,_,_+1,_);m&&t.push(m)}if(this.isLineLoop){const _=Ha(this,e,Er,l,g-1,f,g-1);_&&t.push(_)}}}updateMorphTargets(){const t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){const s=t[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=s.length;r<a;r++){const o=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}}function Ha(i,e,t,n,s,r,a){const o=i.geometry.attributes.position;if(Oo.fromBufferAttribute(o,s),Fo.fromBufferAttribute(o,r),t.distanceSqToSegment(Oo,Fo,Il,cd)>n)return;Il.applyMatrix4(i.matrixWorld);const c=e.ray.origin.distanceTo(Il);if(!(c<e.near||c>e.far))return{distance:c,point:cd.clone().applyMatrix4(i.matrixWorld),index:a,face:null,faceIndex:null,barycoord:null,object:i}}const hd=new P,ud=new P;class qi extends Yo{constructor(e,t){super(e,t),this.isLineSegments=!0,this.type="LineSegments"}computeLineDistances(){const e=this.geometry;if(e.index===null){const t=e.attributes.position,n=[];for(let s=0,r=t.count;s<r;s+=2)hd.fromBufferAttribute(t,s),ud.fromBufferAttribute(t,s+1),n[s]=s===0?0:n[s-1],n[s+1]=n[s]+hd.distanceTo(ud);e.setAttribute("lineDistance",new ze(n,1))}else Re("LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}}class v0 extends Yo{constructor(e,t){super(e,t),this.isLineLoop=!0,this.type="LineLoop"}}class es extends vn{constructor(e){super(),this.isPointsMaterial=!0,this.type="PointsMaterial",this.color=new Me(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.size=e.size,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}}const dd=new We,Zc=new ir,Ga=new Mn,Va=new P;class sr extends xt{constructor(e=new et,t=new es){super(),this.isPoints=!0,this.type="Points",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}raycast(e,t){const n=this.geometry,s=this.matrixWorld,r=e.params.Points.threshold,a=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),Ga.copy(n.boundingSphere),Ga.applyMatrix4(s),Ga.radius+=r,e.ray.intersectsSphere(Ga)===!1)return;dd.copy(s).invert(),Zc.copy(e.ray).applyMatrix4(dd);const o=r/((this.scale.x+this.scale.y+this.scale.z)/3),l=o*o,c=n.index,u=n.attributes.position;if(c!==null){const d=Math.max(0,a.start),f=Math.min(c.count,a.start+a.count);for(let g=d,_=f;g<_;g++){const p=c.getX(g);Va.fromBufferAttribute(u,p),fd(Va,p,l,s,e,t,this)}}else{const d=Math.max(0,a.start),f=Math.min(u.count,a.start+a.count);for(let g=d,_=f;g<_;g++)Va.fromBufferAttribute(u,g),fd(Va,g,l,s,e,t,this)}}updateMorphTargets(){const t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){const s=t[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=s.length;r<a;r++){const o=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}}function fd(i,e,t,n,s,r,a){const o=Zc.distanceSqToPoint(i);if(o<t){const l=new P;Zc.closestPointToPoint(i,l),l.applyMatrix4(n);const c=s.ray.origin.distanceTo(l);if(c<s.near||c>s.far)return;r.push({distance:c,distanceToRay:Math.sqrt(o),point:l,index:e,face:null,faceIndex:null,barycoord:null,object:a})}}class gp extends Ct{constructor(e=[],t=Yi,n,s,r,a,o,l,c,h){super(e,t,n,s,r,a,o,l,c,h),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}}class ua extends Ct{constructor(e,t,n,s,r,a,o,l,c){super(e,t,n,s,r,a,o,l,c),this.isCanvasTexture=!0,this.needsUpdate=!0}}class na extends Ct{constructor(e,t,n=jn,s,r,a,o=wt,l=wt,c,h=fi,u=1){if(h!==fi&&h!==Wi)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");const d={width:e,height:t,depth:u};super(d,s,r,a,o,l,h,n,c),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.source=new Hh(Object.assign({},e.image)),this.compareFunction=e.compareFunction,this}toJSON(e){const t=super.toJSON(e);return this.compareFunction!==null&&(t.compareFunction=this.compareFunction),t}}class M0 extends na{constructor(e,t=jn,n=Yi,s,r,a=wt,o=wt,l,c=fi){const h={width:e,height:e,depth:1},u=[h,h,h,h,h,h];super(e,e,t,n,s,r,a,o,l,c),this.image=u,this.isCubeDepthTexture=!0,this.isCubeTexture=!0}get images(){return this.image}set images(e){this.image=e}}class _p extends Ct{constructor(e=null){super(),this.sourceTexture=e,this.isExternalTexture=!0}copy(e){return super.copy(e),this.sourceTexture=e.sourceTexture,this}}class da extends et{constructor(e=1,t=1,n=1,s=1,r=1,a=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:t,depth:n,widthSegments:s,heightSegments:r,depthSegments:a};const o=this;s=Math.floor(s),r=Math.floor(r),a=Math.floor(a);const l=[],c=[],h=[],u=[];let d=0,f=0;g("z","y","x",-1,-1,n,t,e,a,r,0),g("z","y","x",1,-1,n,t,-e,a,r,1),g("x","z","y",1,1,e,n,t,s,a,2),g("x","z","y",1,-1,e,n,-t,s,a,3),g("x","y","z",1,-1,e,t,n,s,r,4),g("x","y","z",-1,-1,e,t,-n,s,r,5),this.setIndex(l),this.setAttribute("position",new ze(c,3)),this.setAttribute("normal",new ze(h,3)),this.setAttribute("uv",new ze(u,2));function g(_,p,m,M,y,S,w,T,L,x,E){const N=S/L,C=w/x,O=S/2,F=w/2,V=T/2,z=L+1,H=x+1;let B=0,ie=0;const Q=new P;for(let me=0;me<H;me++){const _e=me*C-F;for(let ge=0;ge<z;ge++){const ke=ge*N-O;Q[_]=ke*M,Q[p]=_e*y,Q[m]=V,c.push(Q.x,Q.y,Q.z),Q[_]=0,Q[p]=0,Q[m]=T>0?1:-1,h.push(Q.x,Q.y,Q.z),u.push(ge/L),u.push(1-me/x),B+=1}}for(let me=0;me<x;me++)for(let _e=0;_e<L;_e++){const ge=d+_e+z*me,ke=d+_e+z*(me+1),rt=d+(_e+1)+z*(me+1),ct=d+(_e+1)+z*me;l.push(ge,ke,ct),l.push(ke,rt,ct),ie+=6}o.addGroup(f,ie,E),f+=ie,d+=B}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new da(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}}class Yh extends et{constructor(e=1,t=32,n=0,s=Math.PI*2){super(),this.type="CircleGeometry",this.parameters={radius:e,segments:t,thetaStart:n,thetaLength:s},t=Math.max(3,t);const r=[],a=[],o=[],l=[],c=new P,h=new j;a.push(0,0,0),o.push(0,0,1),l.push(.5,.5);for(let u=0,d=3;u<=t;u++,d+=3){const f=n+u/t*s;c.x=e*Math.cos(f),c.y=e*Math.sin(f),a.push(c.x,c.y,c.z),o.push(0,0,1),h.x=(a[d]/e+1)/2,h.y=(a[d+1]/e+1)/2,l.push(h.x,h.y)}for(let u=1;u<=t;u++)r.push(u,u+1,0);this.setIndex(r),this.setAttribute("position",new ze(a,3)),this.setAttribute("normal",new ze(o,3)),this.setAttribute("uv",new ze(l,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Yh(e.radius,e.segments,e.thetaStart,e.thetaLength)}}class qh extends et{constructor(e=1,t=1,n=1,s=32,r=1,a=!1,o=0,l=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:e,radiusBottom:t,height:n,radialSegments:s,heightSegments:r,openEnded:a,thetaStart:o,thetaLength:l};const c=this;s=Math.floor(s),r=Math.floor(r);const h=[],u=[],d=[],f=[];let g=0;const _=[],p=n/2;let m=0;M(),a===!1&&(e>0&&y(!0),t>0&&y(!1)),this.setIndex(h),this.setAttribute("position",new ze(u,3)),this.setAttribute("normal",new ze(d,3)),this.setAttribute("uv",new ze(f,2));function M(){const S=new P,w=new P;let T=0;const L=(t-e)/n;for(let x=0;x<=r;x++){const E=[],N=x/r,C=N*(t-e)+e;for(let O=0;O<=s;O++){const F=O/s,V=F*l+o,z=Math.sin(V),H=Math.cos(V);w.x=C*z,w.y=-N*n+p,w.z=C*H,u.push(w.x,w.y,w.z),S.set(z,L,H).normalize(),d.push(S.x,S.y,S.z),f.push(F,1-N),E.push(g++)}_.push(E)}for(let x=0;x<s;x++)for(let E=0;E<r;E++){const N=_[E][x],C=_[E+1][x],O=_[E+1][x+1],F=_[E][x+1];(e>0||E!==0)&&(h.push(N,C,F),T+=3),(t>0||E!==r-1)&&(h.push(C,O,F),T+=3)}c.addGroup(m,T,0),m+=T}function y(S){const w=g,T=new j,L=new P;let x=0;const E=S===!0?e:t,N=S===!0?1:-1;for(let O=1;O<=s;O++)u.push(0,p*N,0),d.push(0,N,0),f.push(.5,.5),g++;const C=g;for(let O=0;O<=s;O++){const V=O/s*l+o,z=Math.cos(V),H=Math.sin(V);L.x=E*H,L.y=p*N,L.z=E*z,u.push(L.x,L.y,L.z),d.push(0,N,0),T.x=z*.5+.5,T.y=H*.5*N+.5,f.push(T.x,T.y),g++}for(let O=0;O<s;O++){const F=w+O,V=C+O;S===!0?h.push(V,V+1,F):h.push(V+1,V,F),x+=3}c.addGroup(m,x,S===!0?1:2),m+=x}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new qh(e.radiusTop,e.radiusBottom,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}}class jh extends qh{constructor(e=1,t=1,n=32,s=1,r=!1,a=0,o=Math.PI*2){super(0,e,t,n,s,r,a,o),this.type="ConeGeometry",this.parameters={radius:e,height:t,radialSegments:n,heightSegments:s,openEnded:r,thetaStart:a,thetaLength:o}}static fromJSON(e){return new jh(e.radius,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}}class $n{constructor(){this.type="Curve",this.arcLengthDivisions=200,this.needsUpdate=!1,this.cacheArcLengths=null}getPoint(){Re("Curve: .getPoint() not implemented.")}getPointAt(e,t){const n=this.getUtoTmapping(e);return this.getPoint(n,t)}getPoints(e=5){const t=[];for(let n=0;n<=e;n++)t.push(this.getPoint(n/e));return t}getSpacedPoints(e=5){const t=[];for(let n=0;n<=e;n++)t.push(this.getPointAt(n/e));return t}getLength(){const e=this.getLengths();return e[e.length-1]}getLengths(e=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===e+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;const t=[];let n,s=this.getPoint(0),r=0;t.push(0);for(let a=1;a<=e;a++)n=this.getPoint(a/e),r+=n.distanceTo(s),t.push(r),s=n;return this.cacheArcLengths=t,t}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(e,t=null){const n=this.getLengths();let s=0;const r=n.length;let a;t?a=t:a=e*n[r-1];let o=0,l=r-1,c;for(;o<=l;)if(s=Math.floor(o+(l-o)/2),c=n[s]-a,c<0)o=s+1;else if(c>0)l=s-1;else{l=s;break}if(s=l,n[s]===a)return s/(r-1);const h=n[s],d=n[s+1]-h,f=(a-h)/d;return(s+f)/(r-1)}getTangent(e,t){let s=e-1e-4,r=e+1e-4;s<0&&(s=0),r>1&&(r=1);const a=this.getPoint(s),o=this.getPoint(r),l=t||(a.isVector2?new j:new P);return l.copy(o).sub(a).normalize(),l}getTangentAt(e,t){const n=this.getUtoTmapping(e);return this.getTangent(n,t)}computeFrenetFrames(e,t=!1){const n=new P,s=[],r=[],a=[],o=new P,l=new We;for(let f=0;f<=e;f++){const g=f/e;s[f]=this.getTangentAt(g,new P)}r[0]=new P,a[0]=new P;let c=Number.MAX_VALUE;const h=Math.abs(s[0].x),u=Math.abs(s[0].y),d=Math.abs(s[0].z);h<=c&&(c=h,n.set(1,0,0)),u<=c&&(c=u,n.set(0,1,0)),d<=c&&n.set(0,0,1),o.crossVectors(s[0],n).normalize(),r[0].crossVectors(s[0],o),a[0].crossVectors(s[0],r[0]);for(let f=1;f<=e;f++){if(r[f]=r[f-1].clone(),a[f]=a[f-1].clone(),o.crossVectors(s[f-1],s[f]),o.length()>Number.EPSILON){o.normalize();const g=Math.acos(Ge(s[f-1].dot(s[f]),-1,1));r[f].applyMatrix4(l.makeRotationAxis(o,g))}a[f].crossVectors(s[f],r[f])}if(t===!0){let f=Math.acos(Ge(r[0].dot(r[e]),-1,1));f/=e,s[0].dot(o.crossVectors(r[0],r[e]))>0&&(f=-f);for(let g=1;g<=e;g++)r[g].applyMatrix4(l.makeRotationAxis(s[g],f*g)),a[g].crossVectors(s[g],r[g])}return{tangents:s,normals:r,binormals:a}}clone(){return new this.constructor().copy(this)}copy(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}toJSON(){const e={metadata:{version:4.7,type:"Curve",generator:"Curve.toJSON"}};return e.arcLengthDivisions=this.arcLengthDivisions,e.type=this.type,e}fromJSON(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}}class $h extends $n{constructor(e=0,t=0,n=1,s=1,r=0,a=Math.PI*2,o=!1,l=0){super(),this.isEllipseCurve=!0,this.type="EllipseCurve",this.aX=e,this.aY=t,this.xRadius=n,this.yRadius=s,this.aStartAngle=r,this.aEndAngle=a,this.aClockwise=o,this.aRotation=l}getPoint(e,t=new j){const n=t,s=Math.PI*2;let r=this.aEndAngle-this.aStartAngle;const a=Math.abs(r)<Number.EPSILON;for(;r<0;)r+=s;for(;r>s;)r-=s;r<Number.EPSILON&&(a?r=0:r=s),this.aClockwise===!0&&!a&&(r===s?r=-s:r=r-s);const o=this.aStartAngle+e*r;let l=this.aX+this.xRadius*Math.cos(o),c=this.aY+this.yRadius*Math.sin(o);if(this.aRotation!==0){const h=Math.cos(this.aRotation),u=Math.sin(this.aRotation),d=l-this.aX,f=c-this.aY;l=d*h-f*u+this.aX,c=d*u+f*h+this.aY}return n.set(l,c)}copy(e){return super.copy(e),this.aX=e.aX,this.aY=e.aY,this.xRadius=e.xRadius,this.yRadius=e.yRadius,this.aStartAngle=e.aStartAngle,this.aEndAngle=e.aEndAngle,this.aClockwise=e.aClockwise,this.aRotation=e.aRotation,this}toJSON(){const e=super.toJSON();return e.aX=this.aX,e.aY=this.aY,e.xRadius=this.xRadius,e.yRadius=this.yRadius,e.aStartAngle=this.aStartAngle,e.aEndAngle=this.aEndAngle,e.aClockwise=this.aClockwise,e.aRotation=this.aRotation,e}fromJSON(e){return super.fromJSON(e),this.aX=e.aX,this.aY=e.aY,this.xRadius=e.xRadius,this.yRadius=e.yRadius,this.aStartAngle=e.aStartAngle,this.aEndAngle=e.aEndAngle,this.aClockwise=e.aClockwise,this.aRotation=e.aRotation,this}}class y0 extends $h{constructor(e,t,n,s,r,a){super(e,t,n,n,s,r,a),this.isArcCurve=!0,this.type="ArcCurve"}}function Jh(){let i=0,e=0,t=0,n=0;function s(r,a,o,l){i=r,e=o,t=-3*r+3*a-2*o-l,n=2*r-2*a+o+l}return{initCatmullRom:function(r,a,o,l,c){s(a,o,c*(o-r),c*(l-a))},initNonuniformCatmullRom:function(r,a,o,l,c,h,u){let d=(a-r)/c-(o-r)/(c+h)+(o-a)/h,f=(o-a)/h-(l-a)/(h+u)+(l-o)/u;d*=h,f*=h,s(a,o,d,f)},calc:function(r){const a=r*r,o=a*r;return i+e*r+t*a+n*o}}}const Wa=new P,Nl=new Jh,Ul=new Jh,Ol=new Jh;class S0 extends $n{constructor(e=[],t=!1,n="centripetal",s=.5){super(),this.isCatmullRomCurve3=!0,this.type="CatmullRomCurve3",this.points=e,this.closed=t,this.curveType=n,this.tension=s}getPoint(e,t=new P){const n=t,s=this.points,r=s.length,a=(r-(this.closed?0:1))*e;let o=Math.floor(a),l=a-o;this.closed?o+=o>0?0:(Math.floor(Math.abs(o)/r)+1)*r:l===0&&o===r-1&&(o=r-2,l=1);let c,h;this.closed||o>0?c=s[(o-1)%r]:(Wa.subVectors(s[0],s[1]).add(s[0]),c=Wa);const u=s[o%r],d=s[(o+1)%r];if(this.closed||o+2<r?h=s[(o+2)%r]:(Wa.subVectors(s[r-1],s[r-2]).add(s[r-1]),h=Wa),this.curveType==="centripetal"||this.curveType==="chordal"){const f=this.curveType==="chordal"?.5:.25;let g=Math.pow(c.distanceToSquared(u),f),_=Math.pow(u.distanceToSquared(d),f),p=Math.pow(d.distanceToSquared(h),f);_<1e-4&&(_=1),g<1e-4&&(g=_),p<1e-4&&(p=_),Nl.initNonuniformCatmullRom(c.x,u.x,d.x,h.x,g,_,p),Ul.initNonuniformCatmullRom(c.y,u.y,d.y,h.y,g,_,p),Ol.initNonuniformCatmullRom(c.z,u.z,d.z,h.z,g,_,p)}else this.curveType==="catmullrom"&&(Nl.initCatmullRom(c.x,u.x,d.x,h.x,this.tension),Ul.initCatmullRom(c.y,u.y,d.y,h.y,this.tension),Ol.initCatmullRom(c.z,u.z,d.z,h.z,this.tension));return n.set(Nl.calc(l),Ul.calc(l),Ol.calc(l)),n}copy(e){super.copy(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){const s=e.points[t];this.points.push(s.clone())}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}toJSON(){const e=super.toJSON();e.points=[];for(let t=0,n=this.points.length;t<n;t++){const s=this.points[t];e.points.push(s.toArray())}return e.closed=this.closed,e.curveType=this.curveType,e.tension=this.tension,e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){const s=e.points[t];this.points.push(new P().fromArray(s))}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}}function pd(i,e,t,n,s){const r=(n-e)*.5,a=(s-t)*.5,o=i*i,l=i*o;return(2*t-2*n+r+a)*l+(-3*t+3*n-2*r-a)*o+r*i+t}function E0(i,e){const t=1-i;return t*t*e}function b0(i,e){return 2*(1-i)*i*e}function T0(i,e){return i*i*e}function Hr(i,e,t,n){return E0(i,e)+b0(i,t)+T0(i,n)}function A0(i,e){const t=1-i;return t*t*t*e}function w0(i,e){const t=1-i;return 3*t*t*i*e}function C0(i,e){return 3*(1-i)*i*i*e}function R0(i,e){return i*i*i*e}function Gr(i,e,t,n,s){return A0(i,e)+w0(i,t)+C0(i,n)+R0(i,s)}class xp extends $n{constructor(e=new j,t=new j,n=new j,s=new j){super(),this.isCubicBezierCurve=!0,this.type="CubicBezierCurve",this.v0=e,this.v1=t,this.v2=n,this.v3=s}getPoint(e,t=new j){const n=t,s=this.v0,r=this.v1,a=this.v2,o=this.v3;return n.set(Gr(e,s.x,r.x,a.x,o.x),Gr(e,s.y,r.y,a.y,o.y)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this.v3.copy(e.v3),this}toJSON(){const e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e.v3=this.v3.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this.v3.fromArray(e.v3),this}}class P0 extends $n{constructor(e=new P,t=new P,n=new P,s=new P){super(),this.isCubicBezierCurve3=!0,this.type="CubicBezierCurve3",this.v0=e,this.v1=t,this.v2=n,this.v3=s}getPoint(e,t=new P){const n=t,s=this.v0,r=this.v1,a=this.v2,o=this.v3;return n.set(Gr(e,s.x,r.x,a.x,o.x),Gr(e,s.y,r.y,a.y,o.y),Gr(e,s.z,r.z,a.z,o.z)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this.v3.copy(e.v3),this}toJSON(){const e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e.v3=this.v3.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this.v3.fromArray(e.v3),this}}class vp extends $n{constructor(e=new j,t=new j){super(),this.isLineCurve=!0,this.type="LineCurve",this.v1=e,this.v2=t}getPoint(e,t=new j){const n=t;return e===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(e).add(this.v1)),n}getPointAt(e,t){return this.getPoint(e,t)}getTangent(e,t=new j){return t.subVectors(this.v2,this.v1).normalize()}getTangentAt(e,t){return this.getTangent(e,t)}copy(e){return super.copy(e),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){const e=super.toJSON();return e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}}class L0 extends $n{constructor(e=new P,t=new P){super(),this.isLineCurve3=!0,this.type="LineCurve3",this.v1=e,this.v2=t}getPoint(e,t=new P){const n=t;return e===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(e).add(this.v1)),n}getPointAt(e,t){return this.getPoint(e,t)}getTangent(e,t=new P){return t.subVectors(this.v2,this.v1).normalize()}getTangentAt(e,t){return this.getTangent(e,t)}copy(e){return super.copy(e),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){const e=super.toJSON();return e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}}class Mp extends $n{constructor(e=new j,t=new j,n=new j){super(),this.isQuadraticBezierCurve=!0,this.type="QuadraticBezierCurve",this.v0=e,this.v1=t,this.v2=n}getPoint(e,t=new j){const n=t,s=this.v0,r=this.v1,a=this.v2;return n.set(Hr(e,s.x,r.x,a.x),Hr(e,s.y,r.y,a.y)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){const e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}}class D0 extends $n{constructor(e=new P,t=new P,n=new P){super(),this.isQuadraticBezierCurve3=!0,this.type="QuadraticBezierCurve3",this.v0=e,this.v1=t,this.v2=n}getPoint(e,t=new P){const n=t,s=this.v0,r=this.v1,a=this.v2;return n.set(Hr(e,s.x,r.x,a.x),Hr(e,s.y,r.y,a.y),Hr(e,s.z,r.z,a.z)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){const e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}}class yp extends $n{constructor(e=[]){super(),this.isSplineCurve=!0,this.type="SplineCurve",this.points=e}getPoint(e,t=new j){const n=t,s=this.points,r=(s.length-1)*e,a=Math.floor(r),o=r-a,l=s[a===0?a:a-1],c=s[a],h=s[a>s.length-2?s.length-1:a+1],u=s[a>s.length-3?s.length-1:a+2];return n.set(pd(o,l.x,c.x,h.x,u.x),pd(o,l.y,c.y,h.y,u.y)),n}copy(e){super.copy(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){const s=e.points[t];this.points.push(s.clone())}return this}toJSON(){const e=super.toJSON();e.points=[];for(let t=0,n=this.points.length;t<n;t++){const s=this.points[t];e.points.push(s.toArray())}return e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){const s=e.points[t];this.points.push(new j().fromArray(s))}return this}}var Qc=Object.freeze({__proto__:null,ArcCurve:y0,CatmullRomCurve3:S0,CubicBezierCurve:xp,CubicBezierCurve3:P0,EllipseCurve:$h,LineCurve:vp,LineCurve3:L0,QuadraticBezierCurve:Mp,QuadraticBezierCurve3:D0,SplineCurve:yp});class I0 extends $n{constructor(){super(),this.type="CurvePath",this.curves=[],this.autoClose=!1}add(e){this.curves.push(e)}closePath(){const e=this.curves[0].getPoint(0),t=this.curves[this.curves.length-1].getPoint(1);if(!e.equals(t)){const n=e.isVector2===!0?"LineCurve":"LineCurve3";this.curves.push(new Qc[n](t,e))}return this}getPoint(e,t){const n=e*this.getLength(),s=this.getCurveLengths();let r=0;for(;r<s.length;){if(s[r]>=n){const a=s[r]-n,o=this.curves[r],l=o.getLength(),c=l===0?0:1-a/l;return o.getPointAt(c,t)}r++}return null}getLength(){const e=this.getCurveLengths();return e[e.length-1]}updateArcLengths(){this.needsUpdate=!0,this.cacheLengths=null,this.getCurveLengths()}getCurveLengths(){if(this.cacheLengths&&this.cacheLengths.length===this.curves.length)return this.cacheLengths;const e=[];let t=0;for(let n=0,s=this.curves.length;n<s;n++)t+=this.curves[n].getLength(),e.push(t);return this.cacheLengths=e,e}getSpacedPoints(e=40){const t=[];for(let n=0;n<=e;n++)t.push(this.getPoint(n/e));return this.autoClose&&t.push(t[0]),t}getPoints(e=12){const t=[];let n;for(let s=0,r=this.curves;s<r.length;s++){const a=r[s],o=a.isEllipseCurve?e*2:a.isLineCurve||a.isLineCurve3?1:a.isSplineCurve?e*a.points.length:e,l=a.getPoints(o);for(let c=0;c<l.length;c++){const h=l[c];n&&n.equals(h)||(t.push(h),n=h)}}return this.autoClose&&t.length>1&&!t[t.length-1].equals(t[0])&&t.push(t[0]),t}copy(e){super.copy(e),this.curves=[];for(let t=0,n=e.curves.length;t<n;t++){const s=e.curves[t];this.curves.push(s.clone())}return this.autoClose=e.autoClose,this}toJSON(){const e=super.toJSON();e.autoClose=this.autoClose,e.curves=[];for(let t=0,n=this.curves.length;t<n;t++){const s=this.curves[t];e.curves.push(s.toJSON())}return e}fromJSON(e){super.fromJSON(e),this.autoClose=e.autoClose,this.curves=[];for(let t=0,n=e.curves.length;t<n;t++){const s=e.curves[t];this.curves.push(new Qc[s.type]().fromJSON(s))}return this}}class md extends I0{constructor(e){super(),this.type="Path",this.currentPoint=new j,e&&this.setFromPoints(e)}setFromPoints(e){this.moveTo(e[0].x,e[0].y);for(let t=1,n=e.length;t<n;t++)this.lineTo(e[t].x,e[t].y);return this}moveTo(e,t){return this.currentPoint.set(e,t),this}lineTo(e,t){const n=new vp(this.currentPoint.clone(),new j(e,t));return this.curves.push(n),this.currentPoint.set(e,t),this}quadraticCurveTo(e,t,n,s){const r=new Mp(this.currentPoint.clone(),new j(e,t),new j(n,s));return this.curves.push(r),this.currentPoint.set(n,s),this}bezierCurveTo(e,t,n,s,r,a){const o=new xp(this.currentPoint.clone(),new j(e,t),new j(n,s),new j(r,a));return this.curves.push(o),this.currentPoint.set(r,a),this}splineThru(e){const t=[this.currentPoint.clone()].concat(e),n=new yp(t);return this.curves.push(n),this.currentPoint.copy(e[e.length-1]),this}arc(e,t,n,s,r,a){const o=this.currentPoint.x,l=this.currentPoint.y;return this.absarc(e+o,t+l,n,s,r,a),this}absarc(e,t,n,s,r,a){return this.absellipse(e,t,n,n,s,r,a),this}ellipse(e,t,n,s,r,a,o,l){const c=this.currentPoint.x,h=this.currentPoint.y;return this.absellipse(e+c,t+h,n,s,r,a,o,l),this}absellipse(e,t,n,s,r,a,o,l){const c=new $h(e,t,n,s,r,a,o,l);if(this.curves.length>0){const u=c.getPoint(0);u.equals(this.currentPoint)||this.lineTo(u.x,u.y)}this.curves.push(c);const h=c.getPoint(1);return this.currentPoint.copy(h),this}copy(e){return super.copy(e),this.currentPoint.copy(e.currentPoint),this}toJSON(){const e=super.toJSON();return e.currentPoint=this.currentPoint.toArray(),e}fromJSON(e){return super.fromJSON(e),this.currentPoint.fromArray(e.currentPoint),this}}class Zh extends md{constructor(e){super(e),this.uuid=xn(),this.type="Shape",this.holes=[]}getPointsHoles(e){const t=[];for(let n=0,s=this.holes.length;n<s;n++)t[n]=this.holes[n].getPoints(e);return t}extractPoints(e){return{shape:this.getPoints(e),holes:this.getPointsHoles(e)}}copy(e){super.copy(e),this.holes=[];for(let t=0,n=e.holes.length;t<n;t++){const s=e.holes[t];this.holes.push(s.clone())}return this}toJSON(){const e=super.toJSON();e.uuid=this.uuid,e.holes=[];for(let t=0,n=this.holes.length;t<n;t++){const s=this.holes[t];e.holes.push(s.toJSON())}return e}fromJSON(e){super.fromJSON(e),this.uuid=e.uuid,this.holes=[];for(let t=0,n=e.holes.length;t<n;t++){const s=e.holes[t];this.holes.push(new md().fromJSON(s))}return this}}function N0(i,e,t=2){const n=e&&e.length,s=n?e[0]*t:i.length;let r=Sp(i,0,s,t,!0);const a=[];if(!r||r.next===r.prev)return a;let o,l,c;if(n&&(r=z0(i,e,r,t)),i.length>80*t){o=i[0],l=i[1];let h=o,u=l;for(let d=t;d<s;d+=t){const f=i[d],g=i[d+1];f<o&&(o=f),g<l&&(l=g),f>h&&(h=f),g>u&&(u=g)}c=Math.max(h-o,u-l),c=c!==0?32767/c:0}return ia(r,a,t,o,l,c,0),a}function Sp(i,e,t,n,s){let r;if(s===$0(i,e,t,n)>0)for(let a=e;a<t;a+=n)r=gd(a/n|0,i[a],i[a+1],r);else for(let a=t-n;a>=e;a-=n)r=gd(a/n|0,i[a],i[a+1],r);return r&&Ys(r,r.next)&&(ra(r),r=r.next),r}function ji(i,e){if(!i)return i;e||(e=i);let t=i,n;do if(n=!1,!t.steiner&&(Ys(t,t.next)||vt(t.prev,t,t.next)===0)){if(ra(t),t=e=t.prev,t===t.next)break;n=!0}else t=t.next;while(n||t!==e);return e}function ia(i,e,t,n,s,r,a){if(!i)return;!a&&r&&W0(i,n,s,r);let o=i;for(;i.prev!==i.next;){const l=i.prev,c=i.next;if(r?O0(i,n,s,r):U0(i)){e.push(l.i,i.i,c.i),ra(i),i=c.next,o=c.next;continue}if(i=c,i===o){a?a===1?(i=F0(ji(i),e),ia(i,e,t,n,s,r,2)):a===2&&B0(i,e,t,n,s,r):ia(ji(i),e,t,n,s,r,1);break}}}function U0(i){const e=i.prev,t=i,n=i.next;if(vt(e,t,n)>=0)return!1;const s=e.x,r=t.x,a=n.x,o=e.y,l=t.y,c=n.y,h=Math.min(s,r,a),u=Math.min(o,l,c),d=Math.max(s,r,a),f=Math.max(o,l,c);let g=n.next;for(;g!==e;){if(g.x>=h&&g.x<=d&&g.y>=u&&g.y<=f&&Dr(s,o,r,l,a,c,g.x,g.y)&&vt(g.prev,g,g.next)>=0)return!1;g=g.next}return!0}function O0(i,e,t,n){const s=i.prev,r=i,a=i.next;if(vt(s,r,a)>=0)return!1;const o=s.x,l=r.x,c=a.x,h=s.y,u=r.y,d=a.y,f=Math.min(o,l,c),g=Math.min(h,u,d),_=Math.max(o,l,c),p=Math.max(h,u,d),m=eh(f,g,e,t,n),M=eh(_,p,e,t,n);let y=i.prevZ,S=i.nextZ;for(;y&&y.z>=m&&S&&S.z<=M;){if(y.x>=f&&y.x<=_&&y.y>=g&&y.y<=p&&y!==s&&y!==a&&Dr(o,h,l,u,c,d,y.x,y.y)&&vt(y.prev,y,y.next)>=0||(y=y.prevZ,S.x>=f&&S.x<=_&&S.y>=g&&S.y<=p&&S!==s&&S!==a&&Dr(o,h,l,u,c,d,S.x,S.y)&&vt(S.prev,S,S.next)>=0))return!1;S=S.nextZ}for(;y&&y.z>=m;){if(y.x>=f&&y.x<=_&&y.y>=g&&y.y<=p&&y!==s&&y!==a&&Dr(o,h,l,u,c,d,y.x,y.y)&&vt(y.prev,y,y.next)>=0)return!1;y=y.prevZ}for(;S&&S.z<=M;){if(S.x>=f&&S.x<=_&&S.y>=g&&S.y<=p&&S!==s&&S!==a&&Dr(o,h,l,u,c,d,S.x,S.y)&&vt(S.prev,S,S.next)>=0)return!1;S=S.nextZ}return!0}function F0(i,e){let t=i;do{const n=t.prev,s=t.next.next;!Ys(n,s)&&bp(n,t,t.next,s)&&sa(n,s)&&sa(s,n)&&(e.push(n.i,t.i,s.i),ra(t),ra(t.next),t=i=s),t=t.next}while(t!==i);return ji(t)}function B0(i,e,t,n,s,r){let a=i;do{let o=a.next.next;for(;o!==a.prev;){if(a.i!==o.i&&Y0(a,o)){let l=Tp(a,o);a=ji(a,a.next),l=ji(l,l.next),ia(a,e,t,n,s,r,0),ia(l,e,t,n,s,r,0);return}o=o.next}a=a.next}while(a!==i)}function z0(i,e,t,n){const s=[];for(let r=0,a=e.length;r<a;r++){const o=e[r]*n,l=r<a-1?e[r+1]*n:i.length,c=Sp(i,o,l,n,!1);c===c.next&&(c.steiner=!0),s.push(K0(c))}s.sort(k0);for(let r=0;r<s.length;r++)t=H0(s[r],t);return t}function k0(i,e){let t=i.x-e.x;if(t===0&&(t=i.y-e.y,t===0)){const n=(i.next.y-i.y)/(i.next.x-i.x),s=(e.next.y-e.y)/(e.next.x-e.x);t=n-s}return t}function H0(i,e){const t=G0(i,e);if(!t)return e;const n=Tp(t,i);return ji(n,n.next),ji(t,t.next)}function G0(i,e){let t=e;const n=i.x,s=i.y;let r=-1/0,a;if(Ys(i,t))return t;do{if(Ys(i,t.next))return t.next;if(s<=t.y&&s>=t.next.y&&t.next.y!==t.y){const u=t.x+(s-t.y)*(t.next.x-t.x)/(t.next.y-t.y);if(u<=n&&u>r&&(r=u,a=t.x<t.next.x?t:t.next,u===n))return a}t=t.next}while(t!==e);if(!a)return null;const o=a,l=a.x,c=a.y;let h=1/0;t=a;do{if(n>=t.x&&t.x>=l&&n!==t.x&&Ep(s<c?n:r,s,l,c,s<c?r:n,s,t.x,t.y)){const u=Math.abs(s-t.y)/(n-t.x);sa(t,i)&&(u<h||u===h&&(t.x>a.x||t.x===a.x&&V0(a,t)))&&(a=t,h=u)}t=t.next}while(t!==o);return a}function V0(i,e){return vt(i.prev,i,e.prev)<0&&vt(e.next,i,i.next)<0}function W0(i,e,t,n){let s=i;do s.z===0&&(s.z=eh(s.x,s.y,e,t,n)),s.prevZ=s.prev,s.nextZ=s.next,s=s.next;while(s!==i);s.prevZ.nextZ=null,s.prevZ=null,X0(s)}function X0(i){let e,t=1;do{let n=i,s;i=null;let r=null;for(e=0;n;){e++;let a=n,o=0;for(let c=0;c<t&&(o++,a=a.nextZ,!!a);c++);let l=t;for(;o>0||l>0&&a;)o!==0&&(l===0||!a||n.z<=a.z)?(s=n,n=n.nextZ,o--):(s=a,a=a.nextZ,l--),r?r.nextZ=s:i=s,s.prevZ=r,r=s;n=a}r.nextZ=null,t*=2}while(e>1);return i}function eh(i,e,t,n,s){return i=(i-t)*s|0,e=(e-n)*s|0,i=(i|i<<8)&16711935,i=(i|i<<4)&252645135,i=(i|i<<2)&858993459,i=(i|i<<1)&1431655765,e=(e|e<<8)&16711935,e=(e|e<<4)&252645135,e=(e|e<<2)&858993459,e=(e|e<<1)&1431655765,i|e<<1}function K0(i){let e=i,t=i;do(e.x<t.x||e.x===t.x&&e.y<t.y)&&(t=e),e=e.next;while(e!==i);return t}function Ep(i,e,t,n,s,r,a,o){return(s-a)*(e-o)>=(i-a)*(r-o)&&(i-a)*(n-o)>=(t-a)*(e-o)&&(t-a)*(r-o)>=(s-a)*(n-o)}function Dr(i,e,t,n,s,r,a,o){return!(i===a&&e===o)&&Ep(i,e,t,n,s,r,a,o)}function Y0(i,e){return i.next.i!==e.i&&i.prev.i!==e.i&&!q0(i,e)&&(sa(i,e)&&sa(e,i)&&j0(i,e)&&(vt(i.prev,i,e.prev)||vt(i,e.prev,e))||Ys(i,e)&&vt(i.prev,i,i.next)>0&&vt(e.prev,e,e.next)>0)}function vt(i,e,t){return(e.y-i.y)*(t.x-e.x)-(e.x-i.x)*(t.y-e.y)}function Ys(i,e){return i.x===e.x&&i.y===e.y}function bp(i,e,t,n){const s=Ka(vt(i,e,t)),r=Ka(vt(i,e,n)),a=Ka(vt(t,n,i)),o=Ka(vt(t,n,e));return!!(s!==r&&a!==o||s===0&&Xa(i,t,e)||r===0&&Xa(i,n,e)||a===0&&Xa(t,i,n)||o===0&&Xa(t,e,n))}function Xa(i,e,t){return e.x<=Math.max(i.x,t.x)&&e.x>=Math.min(i.x,t.x)&&e.y<=Math.max(i.y,t.y)&&e.y>=Math.min(i.y,t.y)}function Ka(i){return i>0?1:i<0?-1:0}function q0(i,e){let t=i;do{if(t.i!==i.i&&t.next.i!==i.i&&t.i!==e.i&&t.next.i!==e.i&&bp(t,t.next,i,e))return!0;t=t.next}while(t!==i);return!1}function sa(i,e){return vt(i.prev,i,i.next)<0?vt(i,e,i.next)>=0&&vt(i,i.prev,e)>=0:vt(i,e,i.prev)<0||vt(i,i.next,e)<0}function j0(i,e){let t=i,n=!1;const s=(i.x+e.x)/2,r=(i.y+e.y)/2;do t.y>r!=t.next.y>r&&t.next.y!==t.y&&s<(t.next.x-t.x)*(r-t.y)/(t.next.y-t.y)+t.x&&(n=!n),t=t.next;while(t!==i);return n}function Tp(i,e){const t=th(i.i,i.x,i.y),n=th(e.i,e.x,e.y),s=i.next,r=e.prev;return i.next=e,e.prev=i,t.next=s,s.prev=t,n.next=t,t.prev=n,r.next=n,n.prev=r,n}function gd(i,e,t,n){const s=th(i,e,t);return n?(s.next=n.next,s.prev=n,n.next.prev=s,n.next=s):(s.prev=s,s.next=s),s}function ra(i){i.next.prev=i.prev,i.prev.next=i.next,i.prevZ&&(i.prevZ.nextZ=i.nextZ),i.nextZ&&(i.nextZ.prevZ=i.prevZ)}function th(i,e,t){return{i,x:e,y:t,prev:null,next:null,z:0,prevZ:null,nextZ:null,steiner:!1}}function $0(i,e,t,n){let s=0;for(let r=e,a=t-n;r<t;r+=n)s+=(i[a]-i[r])*(i[r+1]+i[a+1]),a=r;return s}class J0{static triangulate(e,t,n=2){return N0(e,t,n)}}class li{static area(e){const t=e.length;let n=0;for(let s=t-1,r=0;r<t;s=r++)n+=e[s].x*e[r].y-e[r].x*e[s].y;return n*.5}static isClockWise(e){return li.area(e)<0}static triangulateShape(e,t){const n=[],s=[],r=[];_d(e),xd(n,e);let a=e.length;t.forEach(_d);for(let l=0;l<t.length;l++)s.push(a),a+=t[l].length,xd(n,t[l]);const o=J0.triangulate(n,s);for(let l=0;l<o.length;l+=3)r.push(o.slice(l,l+3));return r}}function _d(i){const e=i.length;e>2&&i[e-1].equals(i[0])&&i.pop()}function xd(i,e){for(let t=0;t<e.length;t++)i.push(e[t].x),i.push(e[t].y)}class Qh extends et{constructor(e=new Zh([new j(.5,.5),new j(-.5,.5),new j(-.5,-.5),new j(.5,-.5)]),t={}){super(),this.type="ExtrudeGeometry",this.parameters={shapes:e,options:t},e=Array.isArray(e)?e:[e];const n=this,s=[],r=[];for(let o=0,l=e.length;o<l;o++){const c=e[o];a(c)}this.setAttribute("position",new ze(s,3)),this.setAttribute("uv",new ze(r,2)),this.computeVertexNormals();function a(o){const l=[],c=t.curveSegments!==void 0?t.curveSegments:12,h=t.steps!==void 0?t.steps:1,u=t.depth!==void 0?t.depth:1;let d=t.bevelEnabled!==void 0?t.bevelEnabled:!0,f=t.bevelThickness!==void 0?t.bevelThickness:.2,g=t.bevelSize!==void 0?t.bevelSize:f-.1,_=t.bevelOffset!==void 0?t.bevelOffset:0,p=t.bevelSegments!==void 0?t.bevelSegments:3;const m=t.extrudePath,M=t.UVGenerator!==void 0?t.UVGenerator:Z0;let y,S=!1,w,T,L,x;if(m){y=m.getSpacedPoints(h),S=!0,d=!1;const J=m.isCatmullRomCurve3?m.closed:!1;w=m.computeFrenetFrames(h,J),T=new P,L=new P,x=new P}d||(p=0,f=0,g=0,_=0);const E=o.extractPoints(c);let N=E.shape;const C=E.holes;if(!li.isClockWise(N)){N=N.reverse();for(let J=0,te=C.length;J<te;J++){const Z=C[J];li.isClockWise(Z)&&(C[J]=Z.reverse())}}function F(J){const Z=10000000000000001e-36;let de=J[0];for(let R=1;R<=J.length;R++){const Ne=R%J.length,xe=J[Ne],Oe=xe.x-de.x,le=xe.y-de.y,A=Oe*Oe+le*le,v=Math.max(Math.abs(xe.x),Math.abs(xe.y),Math.abs(de.x),Math.abs(de.y)),I=Z*v*v;if(A<=I){J.splice(Ne,1),R--;continue}de=xe}}F(N),C.forEach(F);const V=C.length,z=N;for(let J=0;J<V;J++){const te=C[J];N=N.concat(te)}function H(J,te,Z){return te||Be("ExtrudeGeometry: vec does not exist"),J.clone().addScaledVector(te,Z)}const B=N.length;function ie(J,te,Z){let de,R,Ne;const xe=J.x-te.x,Oe=J.y-te.y,le=Z.x-J.x,A=Z.y-J.y,v=xe*xe+Oe*Oe,I=xe*A-Oe*le;if(Math.abs(I)>Number.EPSILON){const X=Math.sqrt(v),$=Math.sqrt(le*le+A*A),K=te.x-Oe/X,Ee=te.y+xe/X,ce=Z.x-A/$,Le=Z.y+le/$,Fe=((ce-K)*A-(Le-Ee)*le)/(xe*A-Oe*le);de=K+xe*Fe-J.x,R=Ee+Oe*Fe-J.y;const ee=de*de+R*R;if(ee<=2)return new j(de,R);Ne=Math.sqrt(ee/2)}else{let X=!1;xe>Number.EPSILON?le>Number.EPSILON&&(X=!0):xe<-Number.EPSILON?le<-Number.EPSILON&&(X=!0):Math.sign(Oe)===Math.sign(A)&&(X=!0),X?(de=-Oe,R=xe,Ne=Math.sqrt(v)):(de=xe,R=Oe,Ne=Math.sqrt(v/2))}return new j(de/Ne,R/Ne)}const Q=[];for(let J=0,te=z.length,Z=te-1,de=J+1;J<te;J++,Z++,de++)Z===te&&(Z=0),de===te&&(de=0),Q[J]=ie(z[J],z[Z],z[de]);const me=[];let _e,ge=Q.concat();for(let J=0,te=V;J<te;J++){const Z=C[J];_e=[];for(let de=0,R=Z.length,Ne=R-1,xe=de+1;de<R;de++,Ne++,xe++)Ne===R&&(Ne=0),xe===R&&(xe=0),_e[de]=ie(Z[de],Z[Ne],Z[xe]);me.push(_e),ge=ge.concat(_e)}let ke;if(p===0)ke=li.triangulateShape(z,C);else{const J=[],te=[];for(let Z=0;Z<p;Z++){const de=Z/p,R=f*Math.cos(de*Math.PI/2),Ne=g*Math.sin(de*Math.PI/2)+_;for(let xe=0,Oe=z.length;xe<Oe;xe++){const le=H(z[xe],Q[xe],Ne);Ue(le.x,le.y,-R),de===0&&J.push(le)}for(let xe=0,Oe=V;xe<Oe;xe++){const le=C[xe];_e=me[xe];const A=[];for(let v=0,I=le.length;v<I;v++){const X=H(le[v],_e[v],Ne);Ue(X.x,X.y,-R),de===0&&A.push(X)}de===0&&te.push(A)}}ke=li.triangulateShape(J,te)}const rt=ke.length,ct=g+_;for(let J=0;J<B;J++){const te=d?H(N[J],ge[J],ct):N[J];S?(L.copy(w.normals[0]).multiplyScalar(te.x),T.copy(w.binormals[0]).multiplyScalar(te.y),x.copy(y[0]).add(L).add(T),Ue(x.x,x.y,x.z)):Ue(te.x,te.y,0)}for(let J=1;J<=h;J++)for(let te=0;te<B;te++){const Z=d?H(N[te],ge[te],ct):N[te];S?(L.copy(w.normals[J]).multiplyScalar(Z.x),T.copy(w.binormals[J]).multiplyScalar(Z.y),x.copy(y[J]).add(L).add(T),Ue(x.x,x.y,x.z)):Ue(Z.x,Z.y,u/h*J)}for(let J=p-1;J>=0;J--){const te=J/p,Z=f*Math.cos(te*Math.PI/2),de=g*Math.sin(te*Math.PI/2)+_;for(let R=0,Ne=z.length;R<Ne;R++){const xe=H(z[R],Q[R],de);Ue(xe.x,xe.y,u+Z)}for(let R=0,Ne=C.length;R<Ne;R++){const xe=C[R];_e=me[R];for(let Oe=0,le=xe.length;Oe<le;Oe++){const A=H(xe[Oe],_e[Oe],de);S?Ue(A.x,A.y+y[h-1].y,y[h-1].x+Z):Ue(A.x,A.y,u+Z)}}}q(),ae();function q(){const J=s.length/3;if(d){let te=0,Z=B*te;for(let de=0;de<rt;de++){const R=ke[de];Ie(R[2]+Z,R[1]+Z,R[0]+Z)}te=h+p*2,Z=B*te;for(let de=0;de<rt;de++){const R=ke[de];Ie(R[0]+Z,R[1]+Z,R[2]+Z)}}else{for(let te=0;te<rt;te++){const Z=ke[te];Ie(Z[2],Z[1],Z[0])}for(let te=0;te<rt;te++){const Z=ke[te];Ie(Z[0]+B*h,Z[1]+B*h,Z[2]+B*h)}}n.addGroup(J,s.length/3-J,0)}function ae(){const J=s.length/3;let te=0;oe(z,te),te+=z.length;for(let Z=0,de=C.length;Z<de;Z++){const R=C[Z];oe(R,te),te+=R.length}n.addGroup(J,s.length/3-J,1)}function oe(J,te){let Z=J.length;for(;--Z>=0;){const de=Z;let R=Z-1;R<0&&(R=J.length-1);for(let Ne=0,xe=h+p*2;Ne<xe;Ne++){const Oe=B*Ne,le=B*(Ne+1),A=te+de+Oe,v=te+R+Oe,I=te+R+le,X=te+de+le;He(A,v,I,X)}}}function Ue(J,te,Z){l.push(J),l.push(te),l.push(Z)}function Ie(J,te,Z){ht(J),ht(te),ht(Z);const de=s.length/3,R=M.generateTopUV(n,s,de-3,de-2,de-1);Xe(R[0]),Xe(R[1]),Xe(R[2])}function He(J,te,Z,de){ht(J),ht(te),ht(de),ht(te),ht(Z),ht(de);const R=s.length/3,Ne=M.generateSideWallUV(n,s,R-6,R-3,R-2,R-1);Xe(Ne[0]),Xe(Ne[1]),Xe(Ne[3]),Xe(Ne[1]),Xe(Ne[2]),Xe(Ne[3])}function ht(J){s.push(l[J*3+0]),s.push(l[J*3+1]),s.push(l[J*3+2])}function Xe(J){r.push(J.x),r.push(J.y)}}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}toJSON(){const e=super.toJSON(),t=this.parameters.shapes,n=this.parameters.options;return Q0(t,n,e)}static fromJSON(e,t){const n=[];for(let r=0,a=e.shapes.length;r<a;r++){const o=t[e.shapes[r]];n.push(o)}const s=e.options.extrudePath;return s!==void 0&&(e.options.extrudePath=new Qc[s.type]().fromJSON(s)),new Qh(n,e.options)}}const Z0={generateTopUV:function(i,e,t,n,s){const r=e[t*3],a=e[t*3+1],o=e[n*3],l=e[n*3+1],c=e[s*3],h=e[s*3+1];return[new j(r,a),new j(o,l),new j(c,h)]},generateSideWallUV:function(i,e,t,n,s,r){const a=e[t*3],o=e[t*3+1],l=e[t*3+2],c=e[n*3],h=e[n*3+1],u=e[n*3+2],d=e[s*3],f=e[s*3+1],g=e[s*3+2],_=e[r*3],p=e[r*3+1],m=e[r*3+2];return Math.abs(o-h)<Math.abs(a-c)?[new j(a,1-l),new j(c,1-u),new j(d,1-g),new j(_,1-m)]:[new j(o,1-l),new j(h,1-u),new j(f,1-g),new j(p,1-m)]}};function Q0(i,e,t){if(t.shapes=[],Array.isArray(i))for(let n=0,s=i.length;n<s;n++){const r=i[n];t.shapes.push(r.uuid)}else t.shapes.push(i.uuid);return t.options=Object.assign({},e),e.extrudePath!==void 0&&(t.options.extrudePath=e.extrudePath.toJSON()),t}class Pi extends et{constructor(e=1,t=1,n=1,s=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:t,widthSegments:n,heightSegments:s};const r=e/2,a=t/2,o=Math.floor(n),l=Math.floor(s),c=o+1,h=l+1,u=e/o,d=t/l,f=[],g=[],_=[],p=[];for(let m=0;m<h;m++){const M=m*d-a;for(let y=0;y<c;y++){const S=y*u-r;g.push(S,-M,0),_.push(0,0,1),p.push(y/o),p.push(1-m/l)}}for(let m=0;m<l;m++)for(let M=0;M<o;M++){const y=M+c*m,S=M+c*(m+1),w=M+1+c*(m+1),T=M+1+c*m;f.push(y,S,T),f.push(S,w,T)}this.setIndex(f),this.setAttribute("position",new ze(g,3)),this.setAttribute("normal",new ze(_,3)),this.setAttribute("uv",new ze(p,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Pi(e.width,e.height,e.widthSegments,e.heightSegments)}}class qs extends et{constructor(e=.5,t=1,n=32,s=1,r=0,a=Math.PI*2){super(),this.type="RingGeometry",this.parameters={innerRadius:e,outerRadius:t,thetaSegments:n,phiSegments:s,thetaStart:r,thetaLength:a},n=Math.max(3,n),s=Math.max(1,s);const o=[],l=[],c=[],h=[];let u=e;const d=(t-e)/s,f=new P,g=new j;for(let _=0;_<=s;_++){for(let p=0;p<=n;p++){const m=r+p/n*a;f.x=u*Math.cos(m),f.y=u*Math.sin(m),l.push(f.x,f.y,f.z),c.push(0,0,1),g.x=(f.x/t+1)/2,g.y=(f.y/t+1)/2,h.push(g.x,g.y)}u+=d}for(let _=0;_<s;_++){const p=_*(n+1);for(let m=0;m<n;m++){const M=m+p,y=M,S=M+n+1,w=M+n+2,T=M+1;o.push(y,S,T),o.push(S,w,T)}}this.setIndex(o),this.setAttribute("position",new ze(l,3)),this.setAttribute("normal",new ze(c,3)),this.setAttribute("uv",new ze(h,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new qs(e.innerRadius,e.outerRadius,e.thetaSegments,e.phiSegments,e.thetaStart,e.thetaLength)}}class eu extends et{constructor(e=new Zh([new j(0,.5),new j(-.5,-.5),new j(.5,-.5)]),t=12){super(),this.type="ShapeGeometry",this.parameters={shapes:e,curveSegments:t};const n=[],s=[],r=[],a=[];let o=0,l=0;if(Array.isArray(e)===!1)c(e);else for(let h=0;h<e.length;h++)c(e[h]),this.addGroup(o,l,h),o+=l,l=0;this.setIndex(n),this.setAttribute("position",new ze(s,3)),this.setAttribute("normal",new ze(r,3)),this.setAttribute("uv",new ze(a,2));function c(h){const u=s.length/3,d=h.extractPoints(t);let f=d.shape;const g=d.holes;li.isClockWise(f)===!1&&(f=f.reverse());for(let p=0,m=g.length;p<m;p++){const M=g[p];li.isClockWise(M)===!0&&(g[p]=M.reverse())}const _=li.triangulateShape(f,g);for(let p=0,m=g.length;p<m;p++){const M=g[p];f=f.concat(M)}for(let p=0,m=f.length;p<m;p++){const M=f[p];s.push(M.x,M.y,0),r.push(0,0,1),a.push(M.x,M.y)}for(let p=0,m=_.length;p<m;p++){const M=_[p],y=M[0]+u,S=M[1]+u,w=M[2]+u;n.push(y,S,w),l+=3}}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}toJSON(){const e=super.toJSON(),t=this.parameters.shapes;return e_(t,e)}static fromJSON(e,t){const n=[];for(let s=0,r=e.shapes.length;s<r;s++){const a=t[e.shapes[s]];n.push(a)}return new eu(n,e.curveSegments)}}function e_(i,e){if(e.shapes=[],Array.isArray(i))for(let t=0,n=i.length;t<n;t++){const s=i[t];e.shapes.push(s.uuid)}else e.shapes.push(i.uuid);return e}class fa extends et{constructor(e=1,t=32,n=16,s=0,r=Math.PI*2,a=0,o=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:e,widthSegments:t,heightSegments:n,phiStart:s,phiLength:r,thetaStart:a,thetaLength:o},t=Math.max(3,Math.floor(t)),n=Math.max(2,Math.floor(n));const l=Math.min(a+o,Math.PI);let c=0;const h=[],u=new P,d=new P,f=[],g=[],_=[],p=[];for(let m=0;m<=n;m++){const M=[],y=m/n;let S=0;m===0&&a===0?S=.5/t:m===n&&l===Math.PI&&(S=-.5/t);for(let w=0;w<=t;w++){const T=w/t;u.x=-e*Math.cos(s+T*r)*Math.sin(a+y*o),u.y=e*Math.cos(a+y*o),u.z=e*Math.sin(s+T*r)*Math.sin(a+y*o),g.push(u.x,u.y,u.z),d.copy(u).normalize(),_.push(d.x,d.y,d.z),p.push(T+S,1-y),M.push(c++)}h.push(M)}for(let m=0;m<n;m++)for(let M=0;M<t;M++){const y=h[m][M+1],S=h[m][M],w=h[m+1][M],T=h[m+1][M+1];(m!==0||a>0)&&f.push(y,S,T),(m!==n-1||l<Math.PI)&&f.push(S,w,T)}this.setIndex(f),this.setAttribute("position",new ze(g,3)),this.setAttribute("normal",new ze(_,3)),this.setAttribute("uv",new ze(p,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new fa(e.radius,e.widthSegments,e.heightSegments,e.phiStart,e.phiLength,e.thetaStart,e.thetaLength)}}class t_ extends et{constructor(e=null){if(super(),this.type="WireframeGeometry",this.parameters={geometry:e},e!==null){const t=[],n=new Set,s=new P,r=new P;if(e.index!==null){const a=e.attributes.position,o=e.index;let l=e.groups;l.length===0&&(l=[{start:0,count:o.count,materialIndex:0}]);for(let c=0,h=l.length;c<h;++c){const u=l[c],d=u.start,f=u.count;for(let g=d,_=d+f;g<_;g+=3)for(let p=0;p<3;p++){const m=o.getX(g+p),M=o.getX(g+(p+1)%3);s.fromBufferAttribute(a,m),r.fromBufferAttribute(a,M),vd(s,r,n)===!0&&(t.push(s.x,s.y,s.z),t.push(r.x,r.y,r.z))}}}else{const a=e.attributes.position;for(let o=0,l=a.count/3;o<l;o++)for(let c=0;c<3;c++){const h=3*o+c,u=3*o+(c+1)%3;s.fromBufferAttribute(a,h),r.fromBufferAttribute(a,u),vd(s,r,n)===!0&&(t.push(s.x,s.y,s.z),t.push(r.x,r.y,r.z))}}this.setAttribute("position",new ze(t,3))}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}}function vd(i,e,t){const n=`${i.x},${i.y},${i.z}-${e.x},${e.y},${e.z}`,s=`${e.x},${e.y},${e.z}-${i.x},${i.y},${i.z}`;return t.has(n)===!0||t.has(s)===!0?!1:(t.add(n),t.add(s),!0)}function js(i){const e={};for(const t in i){e[t]={};for(const n in i[t]){const s=i[t][n];s&&(s.isColor||s.isMatrix3||s.isMatrix4||s.isVector2||s.isVector3||s.isVector4||s.isTexture||s.isQuaternion)?s.isRenderTargetTexture?(Re("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[t][n]=null):e[t][n]=s.clone():Array.isArray(s)?e[t][n]=s.slice():e[t][n]=s}}return e}function jt(i){const e={};for(let t=0;t<i.length;t++){const n=js(i[t]);for(const s in n)e[s]=n[s]}return e}function n_(i){const e=[];for(let t=0;t<i.length;t++)e.push(i[t].clone());return e}function Ap(i){const e=i.getRenderTarget();return e===null?i.outputColorSpace:e.isXRRenderTarget===!0?e.texture.colorSpace:Qe.workingColorSpace}const $i={clone:js,merge:jt};var i_=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,s_=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class Gt extends vn{constructor(e){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=i_,this.fragmentShader=s_,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=js(e.uniforms),this.uniformsGroups=n_(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this.defaultAttributeValues=Object.assign({},e.defaultAttributeValues),this.index0AttributeName=e.index0AttributeName,this.uniformsNeedUpdate=e.uniformsNeedUpdate,this}toJSON(e){const t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(const s in this.uniforms){const a=this.uniforms[s].value;a&&a.isTexture?t.uniforms[s]={type:"t",value:a.toJSON(e).uuid}:a&&a.isColor?t.uniforms[s]={type:"c",value:a.getHex()}:a&&a.isVector2?t.uniforms[s]={type:"v2",value:a.toArray()}:a&&a.isVector3?t.uniforms[s]={type:"v3",value:a.toArray()}:a&&a.isVector4?t.uniforms[s]={type:"v4",value:a.toArray()}:a&&a.isMatrix3?t.uniforms[s]={type:"m3",value:a.toArray()}:a&&a.isMatrix4?t.uniforms[s]={type:"m4",value:a.toArray()}:t.uniforms[s]={value:a}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;const n={};for(const s in this.extensions)this.extensions[s]===!0&&(n[s]=!0);return Object.keys(n).length>0&&(t.extensions=n),t}}class wp extends Gt{constructor(e){super(e),this.isRawShaderMaterial=!0,this.type="RawShaderMaterial"}}class tu extends vn{constructor(e){super(),this.isMeshStandardMaterial=!0,this.type="MeshStandardMaterial",this.defines={STANDARD:""},this.color=new Me(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Me(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Oh,this.normalScale=new j(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Nn,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.defines={STANDARD:""},this.color.copy(e.color),this.roughness=e.roughness,this.metalness=e.metalness,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.roughnessMap=e.roughnessMap,this.metalnessMap=e.metalnessMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.envMapIntensity=e.envMapIntensity,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}}class Jn extends tu{constructor(e){super(),this.isMeshPhysicalMaterial=!0,this.defines={STANDARD:"",PHYSICAL:""},this.type="MeshPhysicalMaterial",this.anisotropyRotation=0,this.anisotropyMap=null,this.clearcoatMap=null,this.clearcoatRoughness=0,this.clearcoatRoughnessMap=null,this.clearcoatNormalScale=new j(1,1),this.clearcoatNormalMap=null,this.ior=1.5,Object.defineProperty(this,"reflectivity",{get:function(){return Ge(2.5*(this.ior-1)/(this.ior+1),0,1)},set:function(t){this.ior=(1+.4*t)/(1-.4*t)}}),this.iridescenceMap=null,this.iridescenceIOR=1.3,this.iridescenceThicknessRange=[100,400],this.iridescenceThicknessMap=null,this.sheenColor=new Me(0),this.sheenColorMap=null,this.sheenRoughness=1,this.sheenRoughnessMap=null,this.transmissionMap=null,this.thickness=0,this.thicknessMap=null,this.attenuationDistance=1/0,this.attenuationColor=new Me(1,1,1),this.specularIntensity=1,this.specularIntensityMap=null,this.specularColor=new Me(1,1,1),this.specularColorMap=null,this._anisotropy=0,this._clearcoat=0,this._dispersion=0,this._iridescence=0,this._sheen=0,this._transmission=0,this.setValues(e)}get anisotropy(){return this._anisotropy}set anisotropy(e){this._anisotropy>0!=e>0&&this.version++,this._anisotropy=e}get clearcoat(){return this._clearcoat}set clearcoat(e){this._clearcoat>0!=e>0&&this.version++,this._clearcoat=e}get iridescence(){return this._iridescence}set iridescence(e){this._iridescence>0!=e>0&&this.version++,this._iridescence=e}get dispersion(){return this._dispersion}set dispersion(e){this._dispersion>0!=e>0&&this.version++,this._dispersion=e}get sheen(){return this._sheen}set sheen(e){this._sheen>0!=e>0&&this.version++,this._sheen=e}get transmission(){return this._transmission}set transmission(e){this._transmission>0!=e>0&&this.version++,this._transmission=e}copy(e){return super.copy(e),this.defines={STANDARD:"",PHYSICAL:""},this.anisotropy=e.anisotropy,this.anisotropyRotation=e.anisotropyRotation,this.anisotropyMap=e.anisotropyMap,this.clearcoat=e.clearcoat,this.clearcoatMap=e.clearcoatMap,this.clearcoatRoughness=e.clearcoatRoughness,this.clearcoatRoughnessMap=e.clearcoatRoughnessMap,this.clearcoatNormalMap=e.clearcoatNormalMap,this.clearcoatNormalScale.copy(e.clearcoatNormalScale),this.dispersion=e.dispersion,this.ior=e.ior,this.iridescence=e.iridescence,this.iridescenceMap=e.iridescenceMap,this.iridescenceIOR=e.iridescenceIOR,this.iridescenceThicknessRange=[...e.iridescenceThicknessRange],this.iridescenceThicknessMap=e.iridescenceThicknessMap,this.sheen=e.sheen,this.sheenColor.copy(e.sheenColor),this.sheenColorMap=e.sheenColorMap,this.sheenRoughness=e.sheenRoughness,this.sheenRoughnessMap=e.sheenRoughnessMap,this.transmission=e.transmission,this.transmissionMap=e.transmissionMap,this.thickness=e.thickness,this.thicknessMap=e.thicknessMap,this.attenuationDistance=e.attenuationDistance,this.attenuationColor.copy(e.attenuationColor),this.specularIntensity=e.specularIntensity,this.specularIntensityMap=e.specularIntensityMap,this.specularColor.copy(e.specularColor),this.specularColorMap=e.specularColorMap,this}}class r_ extends vn{constructor(e){super(),this.isMeshPhongMaterial=!0,this.type="MeshPhongMaterial",this.color=new Me(16777215),this.specular=new Me(1118481),this.shininess=30,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Me(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Oh,this.normalScale=new j(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Nn,this.combine=Sh,this.reflectivity=1,this.envMapIntensity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.specular.copy(e.specular),this.shininess=e.shininess,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.envMapIntensity=e.envMapIntensity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}}class a_ extends vn{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=_g,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}}class o_ extends vn{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}}class nh extends Qi{constructor(e){super(),this.isLineDashedMaterial=!0,this.type="LineDashedMaterial",this.scale=1,this.dashSize=3,this.gapSize=1,this.setValues(e)}copy(e){return super.copy(e),this.scale=e.scale,this.dashSize=e.dashSize,this.gapSize=e.gapSize,this}}function Ya(i,e){return!i||i.constructor===e?i:typeof e.BYTES_PER_ELEMENT=="number"?new e(i):Array.prototype.slice.call(i)}function l_(i){function e(s,r){return i[s]-i[r]}const t=i.length,n=new Array(t);for(let s=0;s!==t;++s)n[s]=s;return n.sort(e),n}function Md(i,e,t){const n=i.length,s=new i.constructor(n);for(let r=0,a=0;a!==n;++r){const o=t[r]*e;for(let l=0;l!==e;++l)s[a++]=i[o+l]}return s}function Cp(i,e,t,n){let s=1,r=i[0];for(;r!==void 0&&r[n]===void 0;)r=i[s++];if(r===void 0)return;let a=r[n];if(a!==void 0)if(Array.isArray(a))do a=r[n],a!==void 0&&(e.push(r.time),t.push(...a)),r=i[s++];while(r!==void 0);else if(a.toArray!==void 0)do a=r[n],a!==void 0&&(e.push(r.time),a.toArray(t,t.length)),r=i[s++];while(r!==void 0);else do a=r[n],a!==void 0&&(e.push(r.time),t.push(a)),r=i[s++];while(r!==void 0)}class rr{constructor(e,t,n,s){this.parameterPositions=e,this._cachedIndex=0,this.resultBuffer=s!==void 0?s:new t.constructor(n),this.sampleValues=t,this.valueSize=n,this.settings=null,this.DefaultSettings_={}}evaluate(e){const t=this.parameterPositions;let n=this._cachedIndex,s=t[n],r=t[n-1];n:{e:{let a;t:{i:if(!(e<s)){for(let o=n+2;;){if(s===void 0){if(e<r)break i;return n=t.length,this._cachedIndex=n,this.copySampleValue_(n-1)}if(n===o)break;if(r=s,s=t[++n],e<s)break e}a=t.length;break t}if(!(e>=r)){const o=t[1];e<o&&(n=2,r=o);for(let l=n-2;;){if(r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(n===l)break;if(s=r,r=t[--n-1],e>=r)break e}a=n,n=0;break t}break n}for(;n<a;){const o=n+a>>>1;e<t[o]?a=o:n=o+1}if(s=t[n],r=t[n-1],r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(s===void 0)return n=t.length,this._cachedIndex=n,this.copySampleValue_(n-1)}this._cachedIndex=n,this.intervalChanged_(n,r,s)}return this.interpolate_(n,r,e,s)}getSettings_(){return this.settings||this.DefaultSettings_}copySampleValue_(e){const t=this.resultBuffer,n=this.sampleValues,s=this.valueSize,r=e*s;for(let a=0;a!==s;++a)t[a]=n[r+a];return t}interpolate_(){throw new Error("call to abstract method")}intervalChanged_(){}}class c_ extends rr{constructor(e,t,n,s){super(e,t,n,s),this._weightPrev=-0,this._offsetPrev=-0,this._weightNext=-0,this._offsetNext=-0,this.DefaultSettings_={endingStart:Lu,endingEnd:Lu}}intervalChanged_(e,t,n){const s=this.parameterPositions;let r=e-2,a=e+1,o=s[r],l=s[a];if(o===void 0)switch(this.getSettings_().endingStart){case Du:r=e,o=2*t-n;break;case Iu:r=s.length-2,o=t+s[r]-s[r+1];break;default:r=e,o=n}if(l===void 0)switch(this.getSettings_().endingEnd){case Du:a=e,l=2*n-t;break;case Iu:a=1,l=n+s[1]-s[0];break;default:a=e-1,l=t}const c=(n-t)*.5,h=this.valueSize;this._weightPrev=c/(t-o),this._weightNext=c/(l-n),this._offsetPrev=r*h,this._offsetNext=a*h}interpolate_(e,t,n,s){const r=this.resultBuffer,a=this.sampleValues,o=this.valueSize,l=e*o,c=l-o,h=this._offsetPrev,u=this._offsetNext,d=this._weightPrev,f=this._weightNext,g=(n-t)/(s-t),_=g*g,p=_*g,m=-d*p+2*d*_-d*g,M=(1+d)*p+(-1.5-2*d)*_+(-.5+d)*g+1,y=(-1-f)*p+(1.5+f)*_+.5*g,S=f*p-f*_;for(let w=0;w!==o;++w)r[w]=m*a[h+w]+M*a[c+w]+y*a[l+w]+S*a[u+w];return r}}class h_ extends rr{constructor(e,t,n,s){super(e,t,n,s)}interpolate_(e,t,n,s){const r=this.resultBuffer,a=this.sampleValues,o=this.valueSize,l=e*o,c=l-o,h=(n-t)/(s-t),u=1-h;for(let d=0;d!==o;++d)r[d]=a[c+d]*u+a[l+d]*h;return r}}class u_ extends rr{constructor(e,t,n,s){super(e,t,n,s)}interpolate_(e){return this.copySampleValue_(e-1)}}class d_ extends rr{interpolate_(e,t,n,s){const r=this.resultBuffer,a=this.sampleValues,o=this.valueSize,l=e*o,c=l-o,h=this.settings||this.DefaultSettings_,u=h.inTangents,d=h.outTangents;if(!u||!d){const _=(n-t)/(s-t),p=1-_;for(let m=0;m!==o;++m)r[m]=a[c+m]*p+a[l+m]*_;return r}const f=o*2,g=e-1;for(let _=0;_!==o;++_){const p=a[c+_],m=a[l+_],M=g*f+_*2,y=d[M],S=d[M+1],w=e*f+_*2,T=u[w],L=u[w+1];let x=(n-t)/(s-t),E,N,C,O,F;for(let V=0;V<8;V++){E=x*x,N=E*x,C=1-x,O=C*C,F=O*C;const H=F*t+3*O*x*y+3*C*E*T+N*s-n;if(Math.abs(H)<1e-10)break;const B=3*O*(y-t)+6*C*x*(T-y)+3*E*(s-T);if(Math.abs(B)<1e-10)break;x=x-H/B,x=Math.max(0,Math.min(1,x))}r[_]=F*p+3*O*x*S+3*C*E*L+N*m}return r}}class Un{constructor(e,t,n,s){if(e===void 0)throw new Error("THREE.KeyframeTrack: track name is undefined");if(t===void 0||t.length===0)throw new Error("THREE.KeyframeTrack: no keyframes in track named "+e);this.name=e,this.times=Ya(t,this.TimeBufferType),this.values=Ya(n,this.ValueBufferType),this.setInterpolation(s||this.DefaultInterpolation)}static toJSON(e){const t=e.constructor;let n;if(t.toJSON!==this.toJSON)n=t.toJSON(e);else{n={name:e.name,times:Ya(e.times,Array),values:Ya(e.values,Array)};const s=e.getInterpolation();s!==e.DefaultInterpolation&&(n.interpolation=s)}return n.type=e.ValueTypeName,n}InterpolantFactoryMethodDiscrete(e){return new u_(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodLinear(e){return new h_(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodSmooth(e){return new c_(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodBezier(e){const t=new d_(this.times,this.values,this.getValueSize(),e);return this.settings&&(t.settings=this.settings),t}setInterpolation(e){let t;switch(e){case Zr:t=this.InterpolantFactoryMethodDiscrete;break;case Qr:t=this.InterpolantFactoryMethodLinear;break;case ol:t=this.InterpolantFactoryMethodSmooth;break;case Pu:t=this.InterpolantFactoryMethodBezier;break}if(t===void 0){const n="unsupported interpolation for "+this.ValueTypeName+" keyframe track named "+this.name;if(this.createInterpolant===void 0)if(e!==this.DefaultInterpolation)this.setInterpolation(this.DefaultInterpolation);else throw new Error(n);return Re("KeyframeTrack:",n),this}return this.createInterpolant=t,this}getInterpolation(){switch(this.createInterpolant){case this.InterpolantFactoryMethodDiscrete:return Zr;case this.InterpolantFactoryMethodLinear:return Qr;case this.InterpolantFactoryMethodSmooth:return ol;case this.InterpolantFactoryMethodBezier:return Pu}}getValueSize(){return this.values.length/this.times.length}shift(e){if(e!==0){const t=this.times;for(let n=0,s=t.length;n!==s;++n)t[n]+=e}return this}scale(e){if(e!==1){const t=this.times;for(let n=0,s=t.length;n!==s;++n)t[n]*=e}return this}trim(e,t){const n=this.times,s=n.length;let r=0,a=s-1;for(;r!==s&&n[r]<e;)++r;for(;a!==-1&&n[a]>t;)--a;if(++a,r!==0||a!==s){r>=a&&(a=Math.max(a,1),r=a-1);const o=this.getValueSize();this.times=n.slice(r,a),this.values=this.values.slice(r*o,a*o)}return this}validate(){let e=!0;const t=this.getValueSize();t-Math.floor(t)!==0&&(Be("KeyframeTrack: Invalid value size in track.",this),e=!1);const n=this.times,s=this.values,r=n.length;r===0&&(Be("KeyframeTrack: Track is empty.",this),e=!1);let a=null;for(let o=0;o!==r;o++){const l=n[o];if(typeof l=="number"&&isNaN(l)){Be("KeyframeTrack: Time is not a valid number.",this,o,l),e=!1;break}if(a!==null&&a>l){Be("KeyframeTrack: Out of order keys.",this,o,l,a),e=!1;break}a=l}if(s!==void 0&&Ag(s))for(let o=0,l=s.length;o!==l;++o){const c=s[o];if(isNaN(c)){Be("KeyframeTrack: Value is not a valid number.",this,o,c),e=!1;break}}return e}optimize(){const e=this.times.slice(),t=this.values.slice(),n=this.getValueSize(),s=this.getInterpolation()===ol,r=e.length-1;let a=1;for(let o=1;o<r;++o){let l=!1;const c=e[o],h=e[o+1];if(c!==h&&(o!==1||c!==e[0]))if(s)l=!0;else{const u=o*n,d=u-n,f=u+n;for(let g=0;g!==n;++g){const _=t[u+g];if(_!==t[d+g]||_!==t[f+g]){l=!0;break}}}if(l){if(o!==a){e[a]=e[o];const u=o*n,d=a*n;for(let f=0;f!==n;++f)t[d+f]=t[u+f]}++a}}if(r>0){e[a]=e[r];for(let o=r*n,l=a*n,c=0;c!==n;++c)t[l+c]=t[o+c];++a}return a!==e.length?(this.times=e.slice(0,a),this.values=t.slice(0,a*n)):(this.times=e,this.values=t),this}clone(){const e=this.times.slice(),t=this.values.slice(),n=this.constructor,s=new n(this.name,e,t);return s.createInterpolant=this.createInterpolant,s}}Un.prototype.ValueTypeName="";Un.prototype.TimeBufferType=Float32Array;Un.prototype.ValueBufferType=Float32Array;Un.prototype.DefaultInterpolation=Qr;class ar extends Un{constructor(e,t,n){super(e,t,n)}}ar.prototype.ValueTypeName="bool";ar.prototype.ValueBufferType=Array;ar.prototype.DefaultInterpolation=Zr;ar.prototype.InterpolantFactoryMethodLinear=void 0;ar.prototype.InterpolantFactoryMethodSmooth=void 0;class Rp extends Un{constructor(e,t,n,s){super(e,t,n,s)}}Rp.prototype.ValueTypeName="color";class $s extends Un{constructor(e,t,n,s){super(e,t,n,s)}}$s.prototype.ValueTypeName="number";class f_ extends rr{constructor(e,t,n,s){super(e,t,n,s)}interpolate_(e,t,n,s){const r=this.resultBuffer,a=this.sampleValues,o=this.valueSize,l=(n-t)/(s-t);let c=e*o;for(let h=c+o;c!==h;c+=4)In.slerpFlat(r,0,a,c-o,a,c,l);return r}}class Js extends Un{constructor(e,t,n,s){super(e,t,n,s)}InterpolantFactoryMethodLinear(e){return new f_(this.times,this.values,this.getValueSize(),e)}}Js.prototype.ValueTypeName="quaternion";Js.prototype.InterpolantFactoryMethodSmooth=void 0;class or extends Un{constructor(e,t,n){super(e,t,n)}}or.prototype.ValueTypeName="string";or.prototype.ValueBufferType=Array;or.prototype.DefaultInterpolation=Zr;or.prototype.InterpolantFactoryMethodLinear=void 0;or.prototype.InterpolantFactoryMethodSmooth=void 0;class Zs extends Un{constructor(e,t,n,s){super(e,t,n,s)}}Zs.prototype.ValueTypeName="vector";class p_{constructor(e="",t=-1,n=[],s=mg){this.name=e,this.tracks=n,this.duration=t,this.blendMode=s,this.uuid=xn(),this.userData={},this.duration<0&&this.resetDuration()}static parse(e){const t=[],n=e.tracks,s=1/(e.fps||1);for(let a=0,o=n.length;a!==o;++a)t.push(g_(n[a]).scale(s));const r=new this(e.name,e.duration,t,e.blendMode);return r.uuid=e.uuid,r.userData=JSON.parse(e.userData||"{}"),r}static toJSON(e){const t=[],n=e.tracks,s={name:e.name,duration:e.duration,tracks:t,uuid:e.uuid,blendMode:e.blendMode,userData:JSON.stringify(e.userData)};for(let r=0,a=n.length;r!==a;++r)t.push(Un.toJSON(n[r]));return s}static CreateFromMorphTargetSequence(e,t,n,s){const r=t.length,a=[];for(let o=0;o<r;o++){let l=[],c=[];l.push((o+r-1)%r,o,(o+1)%r),c.push(0,1,0);const h=l_(l);l=Md(l,1,h),c=Md(c,1,h),!s&&l[0]===0&&(l.push(r),c.push(c[0])),a.push(new $s(".morphTargetInfluences["+t[o].name+"]",l,c).scale(1/n))}return new this(e,-1,a)}static findByName(e,t){let n=e;if(!Array.isArray(e)){const s=e;n=s.geometry&&s.geometry.animations||s.animations}for(let s=0;s<n.length;s++)if(n[s].name===t)return n[s];return null}static CreateClipsFromMorphTargetSequences(e,t,n){const s={},r=/^([\w-]*?)([\d]+)$/;for(let o=0,l=e.length;o<l;o++){const c=e[o],h=c.name.match(r);if(h&&h.length>1){const u=h[1];let d=s[u];d||(s[u]=d=[]),d.push(c)}}const a=[];for(const o in s)a.push(this.CreateFromMorphTargetSequence(o,s[o],t,n));return a}static parseAnimation(e,t){if(Re("AnimationClip: parseAnimation() is deprecated and will be removed with r185"),!e)return Be("AnimationClip: No animation in JSONLoader data."),null;const n=function(u,d,f,g,_){if(f.length!==0){const p=[],m=[];Cp(f,p,m,g),p.length!==0&&_.push(new u(d,p,m))}},s=[],r=e.name||"default",a=e.fps||30,o=e.blendMode;let l=e.length||-1;const c=e.hierarchy||[];for(let u=0;u<c.length;u++){const d=c[u].keys;if(!(!d||d.length===0))if(d[0].morphTargets){const f={};let g;for(g=0;g<d.length;g++)if(d[g].morphTargets)for(let _=0;_<d[g].morphTargets.length;_++)f[d[g].morphTargets[_]]=-1;for(const _ in f){const p=[],m=[];for(let M=0;M!==d[g].morphTargets.length;++M){const y=d[g];p.push(y.time),m.push(y.morphTarget===_?1:0)}s.push(new $s(".morphTargetInfluence["+_+"]",p,m))}l=f.length*a}else{const f=".bones["+t[u].name+"]";n(Zs,f+".position",d,"pos",s),n(Js,f+".quaternion",d,"rot",s),n(Zs,f+".scale",d,"scl",s)}}return s.length===0?null:new this(r,l,s,o)}resetDuration(){const e=this.tracks;let t=0;for(let n=0,s=e.length;n!==s;++n){const r=this.tracks[n];t=Math.max(t,r.times[r.times.length-1])}return this.duration=t,this}trim(){for(let e=0;e<this.tracks.length;e++)this.tracks[e].trim(0,this.duration);return this}validate(){let e=!0;for(let t=0;t<this.tracks.length;t++)e=e&&this.tracks[t].validate();return e}optimize(){for(let e=0;e<this.tracks.length;e++)this.tracks[e].optimize();return this}clone(){const e=[];for(let n=0;n<this.tracks.length;n++)e.push(this.tracks[n].clone());const t=new this.constructor(this.name,this.duration,e,this.blendMode);return t.userData=JSON.parse(JSON.stringify(this.userData)),t}toJSON(){return this.constructor.toJSON(this)}}function m_(i){switch(i.toLowerCase()){case"scalar":case"double":case"float":case"number":case"integer":return $s;case"vector":case"vector2":case"vector3":case"vector4":return Zs;case"color":return Rp;case"quaternion":return Js;case"bool":case"boolean":return ar;case"string":return or}throw new Error("THREE.KeyframeTrack: Unsupported typeName: "+i)}function g_(i){if(i.type===void 0)throw new Error("THREE.KeyframeTrack: track type undefined, can not parse");const e=m_(i.type);if(i.times===void 0){const t=[],n=[];Cp(i.keys,t,n,"value"),i.times=t,i.values=n}return e.parse!==void 0?e.parse(i):new e(i.name,i.times,i.values,i.interpolation)}const ci={enabled:!1,files:{},add:function(i,e){this.enabled!==!1&&(yd(i)||(this.files[i]=e))},get:function(i){if(this.enabled!==!1&&!yd(i))return this.files[i]},remove:function(i){delete this.files[i]},clear:function(){this.files={}}};function yd(i){try{const e=i.slice(i.indexOf(":")+1);return new URL(e).protocol==="blob:"}catch{return!1}}class __{constructor(e,t,n){const s=this;let r=!1,a=0,o=0,l;const c=[];this.onStart=void 0,this.onLoad=e,this.onProgress=t,this.onError=n,this._abortController=null,this.itemStart=function(h){o++,r===!1&&s.onStart!==void 0&&s.onStart(h,a,o),r=!0},this.itemEnd=function(h){a++,s.onProgress!==void 0&&s.onProgress(h,a,o),a===o&&(r=!1,s.onLoad!==void 0&&s.onLoad())},this.itemError=function(h){s.onError!==void 0&&s.onError(h)},this.resolveURL=function(h){return l?l(h):h},this.setURLModifier=function(h){return l=h,this},this.addHandler=function(h,u){return c.push(h,u),this},this.removeHandler=function(h){const u=c.indexOf(h);return u!==-1&&c.splice(u,2),this},this.getHandler=function(h){for(let u=0,d=c.length;u<d;u+=2){const f=c[u],g=c[u+1];if(f.global&&(f.lastIndex=0),f.test(h))return g}return null},this.abort=function(){return this.abortController.abort(),this._abortController=null,this}}get abortController(){return this._abortController||(this._abortController=new AbortController),this._abortController}}const x_=new __;class lr{constructor(e){this.manager=e!==void 0?e:x_,this.crossOrigin="anonymous",this.withCredentials=!1,this.path="",this.resourcePath="",this.requestHeader={},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}load(){}loadAsync(e,t){const n=this;return new Promise(function(s,r){n.load(e,s,t,r)})}parse(){}setCrossOrigin(e){return this.crossOrigin=e,this}setWithCredentials(e){return this.withCredentials=e,this}setPath(e){return this.path=e,this}setResourcePath(e){return this.resourcePath=e,this}setRequestHeader(e){return this.requestHeader=e,this}abort(){return this}}lr.DEFAULT_MATERIAL_NAME="__DEFAULT";const ri={};class v_ extends Error{constructor(e,t){super(e),this.response=t}}class Pp extends lr{constructor(e){super(e),this.mimeType="",this.responseType="",this._abortController=new AbortController}load(e,t,n,s){e===void 0&&(e=""),this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);const r=ci.get(`file:${e}`);if(r!==void 0)return this.manager.itemStart(e),setTimeout(()=>{t&&t(r),this.manager.itemEnd(e)},0),r;if(ri[e]!==void 0){ri[e].push({onLoad:t,onProgress:n,onError:s});return}ri[e]=[],ri[e].push({onLoad:t,onProgress:n,onError:s});const a=new Request(e,{headers:new Headers(this.requestHeader),credentials:this.withCredentials?"include":"same-origin",signal:typeof AbortSignal.any=="function"?AbortSignal.any([this._abortController.signal,this.manager.abortController.signal]):this._abortController.signal}),o=this.mimeType,l=this.responseType;fetch(a).then(c=>{if(c.status===200||c.status===0){if(c.status===0&&Re("FileLoader: HTTP Status 0 received."),typeof ReadableStream>"u"||c.body===void 0||c.body.getReader===void 0)return c;const h=ri[e],u=c.body.getReader(),d=c.headers.get("X-File-Size")||c.headers.get("Content-Length"),f=d?parseInt(d):0,g=f!==0;let _=0;const p=new ReadableStream({start(m){M();function M(){u.read().then(({done:y,value:S})=>{if(y)m.close();else{_+=S.byteLength;const w=new ProgressEvent("progress",{lengthComputable:g,loaded:_,total:f});for(let T=0,L=h.length;T<L;T++){const x=h[T];x.onProgress&&x.onProgress(w)}m.enqueue(S),M()}},y=>{m.error(y)})}}});return new Response(p)}else throw new v_(`fetch for "${c.url}" responded with ${c.status}: ${c.statusText}`,c)}).then(c=>{switch(l){case"arraybuffer":return c.arrayBuffer();case"blob":return c.blob();case"document":return c.text().then(h=>new DOMParser().parseFromString(h,o));case"json":return c.json();default:if(o==="")return c.text();{const u=/charset="?([^;"\s]*)"?/i.exec(o),d=u&&u[1]?u[1].toLowerCase():void 0,f=new TextDecoder(d);return c.arrayBuffer().then(g=>f.decode(g))}}}).then(c=>{ci.add(`file:${e}`,c);const h=ri[e];delete ri[e];for(let u=0,d=h.length;u<d;u++){const f=h[u];f.onLoad&&f.onLoad(c)}}).catch(c=>{const h=ri[e];if(h===void 0)throw this.manager.itemError(e),c;delete ri[e];for(let u=0,d=h.length;u<d;u++){const f=h[u];f.onError&&f.onError(c)}this.manager.itemError(e)}).finally(()=>{this.manager.itemEnd(e)}),this.manager.itemStart(e)}setResponseType(e){return this.responseType=e,this}setMimeType(e){return this.mimeType=e,this}abort(){return this._abortController.abort(),this._abortController=new AbortController,this}}const ys=new WeakMap;class M_ extends lr{constructor(e){super(e)}load(e,t,n,s){this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);const r=this,a=ci.get(`image:${e}`);if(a!==void 0){if(a.complete===!0)r.manager.itemStart(e),setTimeout(function(){t&&t(a),r.manager.itemEnd(e)},0);else{let u=ys.get(a);u===void 0&&(u=[],ys.set(a,u)),u.push({onLoad:t,onError:s})}return a}const o=ta("img");function l(){h(),t&&t(this);const u=ys.get(this)||[];for(let d=0;d<u.length;d++){const f=u[d];f.onLoad&&f.onLoad(this)}ys.delete(this),r.manager.itemEnd(e)}function c(u){h(),s&&s(u),ci.remove(`image:${e}`);const d=ys.get(this)||[];for(let f=0;f<d.length;f++){const g=d[f];g.onError&&g.onError(u)}ys.delete(this),r.manager.itemError(e),r.manager.itemEnd(e)}function h(){o.removeEventListener("load",l,!1),o.removeEventListener("error",c,!1)}return o.addEventListener("load",l,!1),o.addEventListener("error",c,!1),e.slice(0,5)!=="data:"&&this.crossOrigin!==void 0&&(o.crossOrigin=this.crossOrigin),ci.add(`image:${e}`,o),r.manager.itemStart(e),o.src=e,o}}class y_ extends lr{constructor(e){super(e)}load(e,t,n,s){const r=new Ct,a=new M_(this.manager);return a.setCrossOrigin(this.crossOrigin),a.setPath(this.path),a.load(e,function(o){r.image=o,r.needsUpdate=!0,t!==void 0&&t(r)},n,s),r}}class qo extends xt{constructor(e,t=1){super(),this.isLight=!0,this.type="Light",this.color=new Me(e),this.intensity=t}dispose(){this.dispatchEvent({type:"dispose"})}copy(e,t){return super.copy(e,t),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){const t=super.toJSON(e);return t.object.color=this.color.getHex(),t.object.intensity=this.intensity,t}}const Fl=new We,Sd=new P,Ed=new P;class nu{constructor(e){this.camera=e,this.intensity=1,this.bias=0,this.biasNode=null,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new j(512,512),this.mapType=on,this.map=null,this.mapPass=null,this.matrix=new We,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new Kh,this._frameExtents=new j(1,1),this._viewportCount=1,this._viewports=[new it(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(e){const t=this.camera,n=this.matrix;Sd.setFromMatrixPosition(e.matrixWorld),t.position.copy(Sd),Ed.setFromMatrixPosition(e.target.matrixWorld),t.lookAt(Ed),t.updateMatrixWorld(),Fl.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),this._frustum.setFromProjectionMatrix(Fl,t.coordinateSystem,t.reversedDepth),t.coordinateSystem===ea||t.reversedDepth?n.set(.5,0,0,.5,0,.5,0,.5,0,0,1,0,0,0,0,1):n.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),n.multiply(Fl)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.intensity=e.intensity,this.bias=e.bias,this.radius=e.radius,this.autoUpdate=e.autoUpdate,this.needsUpdate=e.needsUpdate,this.normalBias=e.normalBias,this.blurSamples=e.blurSamples,this.mapSize.copy(e.mapSize),this.biasNode=e.biasNode,this}clone(){return new this.constructor().copy(this)}toJSON(){const e={};return this.intensity!==1&&(e.intensity=this.intensity),this.bias!==0&&(e.bias=this.bias),this.normalBias!==0&&(e.normalBias=this.normalBias),this.radius!==1&&(e.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(e.mapSize=this.mapSize.toArray()),e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}}const qa=new P,ja=new In,Fn=new P;class Lp extends xt{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new We,this.projectionMatrix=new We,this.projectionMatrixInverse=new We,this.coordinateSystem=Wn,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorld.decompose(qa,ja,Fn),Fn.x===1&&Fn.y===1&&Fn.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(qa,ja,Fn.set(1,1,1)).invert()}updateWorldMatrix(e,t){super.updateWorldMatrix(e,t),this.matrixWorld.decompose(qa,ja,Fn),Fn.x===1&&Fn.y===1&&Fn.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(qa,ja,Fn.set(1,1,1)).invert()}clone(){return new this.constructor().copy(this)}}const yi=new P,bd=new j,Td=new j;class $t extends Lp{constructor(e=50,t=1,n=.1,s=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=n,this.far=s,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){const t=.5*this.getFilmHeight()/e;this.fov=Ks*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){const e=Math.tan(zr*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return Ks*2*Math.atan(Math.tan(zr*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,n){yi.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set(yi.x,yi.y).multiplyScalar(-e/yi.z),yi.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(yi.x,yi.y).multiplyScalar(-e/yi.z)}getViewSize(e,t){return this.getViewBounds(e,bd,Td),t.subVectors(Td,bd)}setViewOffset(e,t,n,s,r,a){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=this.near;let t=e*Math.tan(zr*.5*this.fov)/this.zoom,n=2*t,s=this.aspect*n,r=-.5*s;const a=this.view;if(this.view!==null&&this.view.enabled){const l=a.fullWidth,c=a.fullHeight;r+=a.offsetX*s/l,t-=a.offsetY*n/c,s*=a.width/l,n*=a.height/c}const o=this.filmOffset;o!==0&&(r+=e*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+s,t,t-n,e,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}}class S_ extends nu{constructor(){super(new $t(50,1,.5,500)),this.isSpotLightShadow=!0,this.focus=1,this.aspect=1}updateMatrices(e){const t=this.camera,n=Ks*2*e.angle*this.focus,s=this.mapSize.width/this.mapSize.height*this.aspect,r=e.distance||t.far;(n!==t.fov||s!==t.aspect||r!==t.far)&&(t.fov=n,t.aspect=s,t.far=r,t.updateProjectionMatrix()),super.updateMatrices(e)}copy(e){return super.copy(e),this.focus=e.focus,this}}class E_ extends qo{constructor(e,t,n=0,s=Math.PI/3,r=0,a=2){super(e,t),this.isSpotLight=!0,this.type="SpotLight",this.position.copy(xt.DEFAULT_UP),this.updateMatrix(),this.target=new xt,this.distance=n,this.angle=s,this.penumbra=r,this.decay=a,this.map=null,this.shadow=new S_}get power(){return this.intensity*Math.PI}set power(e){this.intensity=e/Math.PI}dispose(){super.dispose(),this.shadow.dispose()}copy(e,t){return super.copy(e,t),this.distance=e.distance,this.angle=e.angle,this.penumbra=e.penumbra,this.decay=e.decay,this.target=e.target.clone(),this.map=e.map,this.shadow=e.shadow.clone(),this}toJSON(e){const t=super.toJSON(e);return t.object.distance=this.distance,t.object.angle=this.angle,t.object.decay=this.decay,t.object.penumbra=this.penumbra,t.object.target=this.target.uuid,this.map&&this.map.isTexture&&(t.object.map=this.map.toJSON(e).uuid),t.object.shadow=this.shadow.toJSON(),t}}class b_ extends nu{constructor(){super(new $t(90,1,.5,500)),this.isPointLightShadow=!0}}class T_ extends qo{constructor(e,t,n=0,s=2){super(e,t),this.isPointLight=!0,this.type="PointLight",this.distance=n,this.decay=s,this.shadow=new b_}get power(){return this.intensity*4*Math.PI}set power(e){this.intensity=e/(4*Math.PI)}dispose(){super.dispose(),this.shadow.dispose()}copy(e,t){return super.copy(e,t),this.distance=e.distance,this.decay=e.decay,this.shadow=e.shadow.clone(),this}toJSON(e){const t=super.toJSON(e);return t.object.distance=this.distance,t.object.decay=this.decay,t.object.shadow=this.shadow.toJSON(),t}}class pa extends Lp{constructor(e=-1,t=1,n=1,s=-1,r=.1,a=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=n,this.bottom=s,this.near=r,this.far=a,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,n,s,r,a){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,s=(this.top+this.bottom)/2;let r=n-e,a=n+e,o=s+t,l=s-t;if(this.view!==null&&this.view.enabled){const c=(this.right-this.left)/this.view.fullWidth/this.zoom,h=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=c*this.view.offsetX,a=r+c*this.view.width,o-=h*this.view.offsetY,l=o-h*this.view.height}this.projectionMatrix.makeOrthographic(r,a,o,l,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}}class A_ extends nu{constructor(){super(new pa(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class Dp extends qo{constructor(e,t){super(e,t),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(xt.DEFAULT_UP),this.updateMatrix(),this.target=new xt,this.shadow=new A_}dispose(){super.dispose(),this.shadow.dispose()}copy(e){return super.copy(e),this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}toJSON(e){const t=super.toJSON(e);return t.object.shadow=this.shadow.toJSON(),t.object.target=this.target.uuid,t}}class w_ extends qo{constructor(e,t){super(e,t),this.isAmbientLight=!0,this.type="AmbientLight"}}class Vr{static extractUrlBase(e){const t=e.lastIndexOf("/");return t===-1?"./":e.slice(0,t+1)}static resolveURL(e,t){return typeof e!="string"||e===""?"":(/^https?:\/\//i.test(t)&&/^\//.test(e)&&(t=t.replace(/(^https?:\/\/[^\/]+).*/i,"$1")),/^(https?:)?\/\//i.test(e)||/^data:.*,.*$/i.test(e)||/^blob:.*$/i.test(e)?e:t+e)}}class C_ extends et{constructor(){super(),this.isInstancedBufferGeometry=!0,this.type="InstancedBufferGeometry",this.instanceCount=1/0}copy(e){return super.copy(e),this.instanceCount=e.instanceCount,this}toJSON(){const e=super.toJSON();return e.instanceCount=this.instanceCount,e.isInstancedBufferGeometry=!0,e}}const Bl=new WeakMap;class R_ extends lr{constructor(e){super(e),this.isImageBitmapLoader=!0,typeof createImageBitmap>"u"&&Re("ImageBitmapLoader: createImageBitmap() not supported."),typeof fetch>"u"&&Re("ImageBitmapLoader: fetch() not supported."),this.options={premultiplyAlpha:"none"},this._abortController=new AbortController}setOptions(e){return this.options=e,this}load(e,t,n,s){e===void 0&&(e=""),this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);const r=this,a=ci.get(`image-bitmap:${e}`);if(a!==void 0){if(r.manager.itemStart(e),a.then){a.then(c=>{if(Bl.has(a)===!0)s&&s(Bl.get(a)),r.manager.itemError(e),r.manager.itemEnd(e);else return t&&t(c),r.manager.itemEnd(e),c});return}return setTimeout(function(){t&&t(a),r.manager.itemEnd(e)},0),a}const o={};o.credentials=this.crossOrigin==="anonymous"?"same-origin":"include",o.headers=this.requestHeader,o.signal=typeof AbortSignal.any=="function"?AbortSignal.any([this._abortController.signal,this.manager.abortController.signal]):this._abortController.signal;const l=fetch(e,o).then(function(c){return c.blob()}).then(function(c){return createImageBitmap(c,Object.assign(r.options,{colorSpaceConversion:"none"}))}).then(function(c){return ci.add(`image-bitmap:${e}`,c),t&&t(c),r.manager.itemEnd(e),c}).catch(function(c){s&&s(c),Bl.set(l,c),ci.remove(`image-bitmap:${e}`),r.manager.itemError(e),r.manager.itemEnd(e)});ci.add(`image-bitmap:${e}`,l),r.manager.itemStart(e)}abort(){return this._abortController.abort(),this._abortController=new AbortController,this}}const Ss=-90,Es=1;class P_ extends xt{constructor(e,t,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;const s=new $t(Ss,Es,e,t);s.layers=this.layers,this.add(s);const r=new $t(Ss,Es,e,t);r.layers=this.layers,this.add(r);const a=new $t(Ss,Es,e,t);a.layers=this.layers,this.add(a);const o=new $t(Ss,Es,e,t);o.layers=this.layers,this.add(o);const l=new $t(Ss,Es,e,t);l.layers=this.layers,this.add(l);const c=new $t(Ss,Es,e,t);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){const e=this.coordinateSystem,t=this.children.concat(),[n,s,r,a,o,l]=t;for(const c of t)this.remove(c);if(e===Wn)n.up.set(0,1,0),n.lookAt(1,0,0),s.up.set(0,1,0),s.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),a.up.set(0,0,1),a.lookAt(0,-1,0),o.up.set(0,1,0),o.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(e===ea)n.up.set(0,-1,0),n.lookAt(-1,0,0),s.up.set(0,-1,0),s.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),a.up.set(0,0,-1),a.lookAt(0,-1,0),o.up.set(0,-1,0),o.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(const c of t)this.add(c),c.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();const{renderTarget:n,activeMipmapLevel:s}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());const[r,a,o,l,c,h]=this.children,u=e.getRenderTarget(),d=e.getActiveCubeFace(),f=e.getActiveMipmapLevel(),g=e.xr.enabled;e.xr.enabled=!1;const _=n.texture.generateMipmaps;n.texture.generateMipmaps=!1;let p=!1;e.isWebGLRenderer===!0?p=e.state.buffers.depth.getReversed():p=e.reversedDepthBuffer,e.setRenderTarget(n,0,s),p&&e.autoClear===!1&&e.clearDepth(),e.render(t,r),e.setRenderTarget(n,1,s),p&&e.autoClear===!1&&e.clearDepth(),e.render(t,a),e.setRenderTarget(n,2,s),p&&e.autoClear===!1&&e.clearDepth(),e.render(t,o),e.setRenderTarget(n,3,s),p&&e.autoClear===!1&&e.clearDepth(),e.render(t,l),e.setRenderTarget(n,4,s),p&&e.autoClear===!1&&e.clearDepth(),e.render(t,c),n.texture.generateMipmaps=_,e.setRenderTarget(n,5,s),p&&e.autoClear===!1&&e.clearDepth(),e.render(t,h),e.setRenderTarget(u,d,f),e.xr.enabled=g,n.texture.needsPMREMUpdate=!0}}class L_ extends $t{constructor(e=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=e}}class D_{constructor(){this._previousTime=0,this._currentTime=0,this._startTime=performance.now(),this._delta=0,this._elapsed=0,this._timescale=1,this._document=null,this._pageVisibilityHandler=null}connect(e){this._document=e,e.hidden!==void 0&&(this._pageVisibilityHandler=I_.bind(this),e.addEventListener("visibilitychange",this._pageVisibilityHandler,!1))}disconnect(){this._pageVisibilityHandler!==null&&(this._document.removeEventListener("visibilitychange",this._pageVisibilityHandler),this._pageVisibilityHandler=null),this._document=null}getDelta(){return this._delta/1e3}getElapsed(){return this._elapsed/1e3}getTimescale(){return this._timescale}setTimescale(e){return this._timescale=e,this}reset(){return this._currentTime=performance.now()-this._startTime,this}dispose(){this.disconnect()}update(e){return this._pageVisibilityHandler!==null&&this._document.hidden===!0?this._delta=0:(this._previousTime=this._currentTime,this._currentTime=(e!==void 0?e:performance.now())-this._startTime,this._delta=(this._currentTime-this._previousTime)*this._timescale,this._elapsed+=this._delta),this}}function I_(){this._document.hidden===!1&&this.reset()}const iu="\\[\\]\\.:\\/",N_=new RegExp("["+iu+"]","g"),su="[^"+iu+"]",U_="[^"+iu.replace("\\.","")+"]",O_=/((?:WC+[\/:])*)/.source.replace("WC",su),F_=/(WCOD+)?/.source.replace("WCOD",U_),B_=/(?:\.(WC+)(?:\[(.+)\])?)?/.source.replace("WC",su),z_=/\.(WC+)(?:\[(.+)\])?/.source.replace("WC",su),k_=new RegExp("^"+O_+F_+B_+z_+"$"),H_=["material","materials","bones","map"];class G_{constructor(e,t,n){const s=n||lt.parseTrackName(t);this._targetGroup=e,this._bindings=e.subscribe_(t,s)}getValue(e,t){this.bind();const n=this._targetGroup.nCachedObjects_,s=this._bindings[n];s!==void 0&&s.getValue(e,t)}setValue(e,t){const n=this._bindings;for(let s=this._targetGroup.nCachedObjects_,r=n.length;s!==r;++s)n[s].setValue(e,t)}bind(){const e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,n=e.length;t!==n;++t)e[t].bind()}unbind(){const e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,n=e.length;t!==n;++t)e[t].unbind()}}class lt{constructor(e,t,n){this.path=t,this.parsedPath=n||lt.parseTrackName(t),this.node=lt.findNode(e,this.parsedPath.nodeName),this.rootNode=e,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}static create(e,t,n){return e&&e.isAnimationObjectGroup?new lt.Composite(e,t,n):new lt(e,t,n)}static sanitizeNodeName(e){return e.replace(/\s/g,"_").replace(N_,"")}static parseTrackName(e){const t=k_.exec(e);if(t===null)throw new Error("PropertyBinding: Cannot parse trackName: "+e);const n={nodeName:t[2],objectName:t[3],objectIndex:t[4],propertyName:t[5],propertyIndex:t[6]},s=n.nodeName&&n.nodeName.lastIndexOf(".");if(s!==void 0&&s!==-1){const r=n.nodeName.substring(s+1);H_.indexOf(r)!==-1&&(n.nodeName=n.nodeName.substring(0,s),n.objectName=r)}if(n.propertyName===null||n.propertyName.length===0)throw new Error("PropertyBinding: can not parse propertyName from trackName: "+e);return n}static findNode(e,t){if(t===void 0||t===""||t==="."||t===-1||t===e.name||t===e.uuid)return e;if(e.skeleton){const n=e.skeleton.getBoneByName(t);if(n!==void 0)return n}if(e.children){const n=function(r){for(let a=0;a<r.length;a++){const o=r[a];if(o.name===t||o.uuid===t)return o;const l=n(o.children);if(l)return l}return null},s=n(e.children);if(s)return s}return null}_getValue_unavailable(){}_setValue_unavailable(){}_getValue_direct(e,t){e[t]=this.targetObject[this.propertyName]}_getValue_array(e,t){const n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)e[t++]=n[s]}_getValue_arrayElement(e,t){e[t]=this.resolvedProperty[this.propertyIndex]}_getValue_toArray(e,t){this.resolvedProperty.toArray(e,t)}_setValue_direct(e,t){this.targetObject[this.propertyName]=e[t]}_setValue_direct_setNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.needsUpdate=!0}_setValue_direct_setMatrixWorldNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_array(e,t){const n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)n[s]=e[t++]}_setValue_array_setNeedsUpdate(e,t){const n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)n[s]=e[t++];this.targetObject.needsUpdate=!0}_setValue_array_setMatrixWorldNeedsUpdate(e,t){const n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)n[s]=e[t++];this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_arrayElement(e,t){this.resolvedProperty[this.propertyIndex]=e[t]}_setValue_arrayElement_setNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.needsUpdate=!0}_setValue_arrayElement_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_fromArray(e,t){this.resolvedProperty.fromArray(e,t)}_setValue_fromArray_setNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.needsUpdate=!0}_setValue_fromArray_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.matrixWorldNeedsUpdate=!0}_getValue_unbound(e,t){this.bind(),this.getValue(e,t)}_setValue_unbound(e,t){this.bind(),this.setValue(e,t)}bind(){let e=this.node;const t=this.parsedPath,n=t.objectName,s=t.propertyName;let r=t.propertyIndex;if(e||(e=lt.findNode(this.rootNode,t.nodeName),this.node=e),this.getValue=this._getValue_unavailable,this.setValue=this._setValue_unavailable,!e){Re("PropertyBinding: No target node found for track: "+this.path+".");return}if(n){let c=t.objectIndex;switch(n){case"materials":if(!e.material){Be("PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!e.material.materials){Be("PropertyBinding: Can not bind to material.materials as node.material does not have a materials array.",this);return}e=e.material.materials;break;case"bones":if(!e.skeleton){Be("PropertyBinding: Can not bind to bones as node does not have a skeleton.",this);return}e=e.skeleton.bones;for(let h=0;h<e.length;h++)if(e[h].name===c){c=h;break}break;case"map":if("map"in e){e=e.map;break}if(!e.material){Be("PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!e.material.map){Be("PropertyBinding: Can not bind to material.map as node.material does not have a map.",this);return}e=e.material.map;break;default:if(e[n]===void 0){Be("PropertyBinding: Can not bind to objectName of node undefined.",this);return}e=e[n]}if(c!==void 0){if(e[c]===void 0){Be("PropertyBinding: Trying to bind to objectIndex of objectName, but is undefined.",this,e);return}e=e[c]}}const a=e[s];if(a===void 0){const c=t.nodeName;Be("PropertyBinding: Trying to update property for track: "+c+"."+s+" but it wasn't found.",e);return}let o=this.Versioning.None;this.targetObject=e,e.isMaterial===!0?o=this.Versioning.NeedsUpdate:e.isObject3D===!0&&(o=this.Versioning.MatrixWorldNeedsUpdate);let l=this.BindingType.Direct;if(r!==void 0){if(s==="morphTargetInfluences"){if(!e.geometry){Be("PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.",this);return}if(!e.geometry.morphAttributes){Be("PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.morphAttributes.",this);return}e.morphTargetDictionary[r]!==void 0&&(r=e.morphTargetDictionary[r])}l=this.BindingType.ArrayElement,this.resolvedProperty=a,this.propertyIndex=r}else a.fromArray!==void 0&&a.toArray!==void 0?(l=this.BindingType.HasFromToArray,this.resolvedProperty=a):Array.isArray(a)?(l=this.BindingType.EntireArray,this.resolvedProperty=a):this.propertyName=s;this.getValue=this.GetterByBindingType[l],this.setValue=this.SetterByBindingTypeAndVersioning[l][o]}unbind(){this.node=null,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}}lt.Composite=G_;lt.prototype.BindingType={Direct:0,EntireArray:1,ArrayElement:2,HasFromToArray:3};lt.prototype.Versioning={None:0,NeedsUpdate:1,MatrixWorldNeedsUpdate:2};lt.prototype.GetterByBindingType=[lt.prototype._getValue_direct,lt.prototype._getValue_array,lt.prototype._getValue_arrayElement,lt.prototype._getValue_toArray];lt.prototype.SetterByBindingTypeAndVersioning=[[lt.prototype._setValue_direct,lt.prototype._setValue_direct_setNeedsUpdate,lt.prototype._setValue_direct_setMatrixWorldNeedsUpdate],[lt.prototype._setValue_array,lt.prototype._setValue_array_setNeedsUpdate,lt.prototype._setValue_array_setMatrixWorldNeedsUpdate],[lt.prototype._setValue_arrayElement,lt.prototype._setValue_arrayElement_setNeedsUpdate,lt.prototype._setValue_arrayElement_setMatrixWorldNeedsUpdate],[lt.prototype._setValue_fromArray,lt.prototype._setValue_fromArray_setNeedsUpdate,lt.prototype._setValue_fromArray_setMatrixWorldNeedsUpdate]];class ih extends Vh{constructor(e,t,n=1){super(e,t),this.isInstancedInterleavedBuffer=!0,this.meshPerAttribute=n}copy(e){return super.copy(e),this.meshPerAttribute=e.meshPerAttribute,this}clone(e){const t=super.clone(e);return t.meshPerAttribute=this.meshPerAttribute,t}toJSON(e){const t=super.toJSON(e);return t.isInstancedInterleavedBuffer=!0,t.meshPerAttribute=this.meshPerAttribute,t}}const Ad=new We;class V_{constructor(e,t,n=0,s=1/0){this.ray=new ir(e,t),this.near=n,this.far=s,this.camera=null,this.layers=new Gh,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(e,t){this.ray.set(e,t)}setFromCamera(e,t){t.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(t.matrixWorld),this.ray.direction.set(e.x,e.y,.5).unproject(t).sub(this.ray.origin).normalize(),this.camera=t):t.isOrthographicCamera?(this.ray.origin.set(e.x,e.y,(t.near+t.far)/(t.near-t.far)).unproject(t),this.ray.direction.set(0,0,-1).transformDirection(t.matrixWorld),this.camera=t):Be("Raycaster: Unsupported camera type: "+t.type)}setFromXRController(e){return Ad.identity().extractRotation(e.matrixWorld),this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(0,0,-1).applyMatrix4(Ad),this}intersectObject(e,t=!0,n=[]){return sh(e,this,n,t),n.sort(wd),n}intersectObjects(e,t=!0,n=[]){for(let s=0,r=e.length;s<r;s++)sh(e[s],this,n,t);return n.sort(wd),n}}function wd(i,e){return i.distance-e.distance}function sh(i,e,t,n){let s=!0;if(i.layers.test(e.layers)&&i.raycast(e,t)===!1&&(s=!1),s===!0&&n===!0){const r=i.children;for(let a=0,o=r.length;a<o;a++)sh(r[a],e,t,!0)}}class W_{constructor(e=!0){this.autoStart=e,this.startTime=0,this.oldTime=0,this.elapsedTime=0,this.running=!1,Re("THREE.Clock: This module has been deprecated. Please use THREE.Timer instead.")}start(){this.startTime=performance.now(),this.oldTime=this.startTime,this.elapsedTime=0,this.running=!0}stop(){this.getElapsedTime(),this.running=!1,this.autoStart=!1}getElapsedTime(){return this.getDelta(),this.elapsedTime}getDelta(){let e=0;if(this.autoStart&&!this.running)return this.start(),0;if(this.running){const t=performance.now();e=(t-this.oldTime)/1e3,this.oldTime=t,this.elapsedTime+=e}return e}}class Cd{constructor(e=1,t=0,n=0){this.radius=e,this.phi=t,this.theta=n}set(e,t,n){return this.radius=e,this.phi=t,this.theta=n,this}copy(e){return this.radius=e.radius,this.phi=e.phi,this.theta=e.theta,this}makeSafe(){return this.phi=Ge(this.phi,1e-6,Math.PI-1e-6),this}setFromVector3(e){return this.setFromCartesianCoords(e.x,e.y,e.z)}setFromCartesianCoords(e,t,n){return this.radius=Math.sqrt(e*e+t*t+n*n),this.radius===0?(this.theta=0,this.phi=0):(this.theta=Math.atan2(e,n),this.phi=Math.acos(Ge(t/this.radius,-1,1))),this}clone(){return new this.constructor().copy(this)}}const Rd=new P,$a=new P,bs=new P,Ts=new P,zl=new P,X_=new P,K_=new P;class Y_{constructor(e=new P,t=new P){this.start=e,this.end=t}set(e,t){return this.start.copy(e),this.end.copy(t),this}copy(e){return this.start.copy(e.start),this.end.copy(e.end),this}getCenter(e){return e.addVectors(this.start,this.end).multiplyScalar(.5)}delta(e){return e.subVectors(this.end,this.start)}distanceSq(){return this.start.distanceToSquared(this.end)}distance(){return this.start.distanceTo(this.end)}at(e,t){return this.delta(t).multiplyScalar(e).add(this.start)}closestPointToPointParameter(e,t){Rd.subVectors(e,this.start),$a.subVectors(this.end,this.start);const n=$a.dot($a);let r=$a.dot(Rd)/n;return t&&(r=Ge(r,0,1)),r}closestPointToPoint(e,t,n){const s=this.closestPointToPointParameter(e,t);return this.delta(n).multiplyScalar(s).add(this.start)}distanceSqToLine3(e,t=X_,n=K_){const s=10000000000000001e-32;let r,a;const o=this.start,l=e.start,c=this.end,h=e.end;bs.subVectors(c,o),Ts.subVectors(h,l),zl.subVectors(o,l);const u=bs.dot(bs),d=Ts.dot(Ts),f=Ts.dot(zl);if(u<=s&&d<=s)return t.copy(o),n.copy(l),t.sub(n),t.dot(t);if(u<=s)r=0,a=f/d,a=Ge(a,0,1);else{const g=bs.dot(zl);if(d<=s)a=0,r=Ge(-g/u,0,1);else{const _=bs.dot(Ts),p=u*d-_*_;p!==0?r=Ge((_*f-g*d)/p,0,1):r=0,a=(_*r+f)/d,a<0?(a=0,r=Ge(-g/u,0,1)):a>1&&(a=1,r=Ge((_-g)/u,0,1))}}return t.copy(o).addScaledVector(bs,r),n.copy(l).addScaledVector(Ts,a),t.distanceToSquared(n)}applyMatrix4(e){return this.start.applyMatrix4(e),this.end.applyMatrix4(e),this}equals(e){return e.start.equals(this.start)&&e.end.equals(this.end)}clone(){return new this.constructor().copy(this)}}class q_ extends qi{constructor(e=10,t=10,n=4473924,s=8947848){n=new Me(n),s=new Me(s);const r=t/2,a=e/t,o=e/2,l=[],c=[];for(let d=0,f=0,g=-o;d<=t;d++,g+=a){l.push(-o,0,g,o,0,g),l.push(g,0,-o,g,0,o);const _=d===r?n:s;_.toArray(c,f),f+=3,_.toArray(c,f),f+=3,_.toArray(c,f),f+=3,_.toArray(c,f),f+=3}const h=new et;h.setAttribute("position",new ze(l,3)),h.setAttribute("color",new ze(c,3));const u=new Qi({vertexColors:!0,toneMapped:!1});super(h,u),this.type="GridHelper"}dispose(){this.geometry.dispose(),this.material.dispose()}}class j_ extends Zi{constructor(e,t=null){super(),this.object=e,this.domElement=t,this.enabled=!0,this.state=-1,this.keys={},this.mouseButtons={LEFT:null,MIDDLE:null,RIGHT:null},this.touches={ONE:null,TWO:null}}connect(e){if(e===void 0){Re("Controls: connect() now requires an element.");return}this.domElement!==null&&this.disconnect(),this.domElement=e}disconnect(){}dispose(){}update(){}}function Pd(i,e,t,n){const s=$_(n);switch(t){case ap:return i*e;case Dh:return i*e/s.components*s.byteLength;case Ih:return i*e/s.components*s.byteLength;case Xs:return i*e*2/s.components*s.byteLength;case Nh:return i*e*2/s.components*s.byteLength;case op:return i*e*3/s.components*s.byteLength;case _n:return i*e*4/s.components*s.byteLength;case Uh:return i*e*4/s.components*s.byteLength;case _o:case xo:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*8;case vo:case Mo:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case xc:case Mc:return Math.max(i,16)*Math.max(e,8)/4;case _c:case vc:return Math.max(i,8)*Math.max(e,8)/2;case yc:case Sc:case bc:case Tc:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*8;case Ec:case Ac:case wc:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case Cc:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case Rc:return Math.floor((i+4)/5)*Math.floor((e+3)/4)*16;case Pc:return Math.floor((i+4)/5)*Math.floor((e+4)/5)*16;case Lc:return Math.floor((i+5)/6)*Math.floor((e+4)/5)*16;case Dc:return Math.floor((i+5)/6)*Math.floor((e+5)/6)*16;case Ic:return Math.floor((i+7)/8)*Math.floor((e+4)/5)*16;case Nc:return Math.floor((i+7)/8)*Math.floor((e+5)/6)*16;case Uc:return Math.floor((i+7)/8)*Math.floor((e+7)/8)*16;case Oc:return Math.floor((i+9)/10)*Math.floor((e+4)/5)*16;case Fc:return Math.floor((i+9)/10)*Math.floor((e+5)/6)*16;case Bc:return Math.floor((i+9)/10)*Math.floor((e+7)/8)*16;case zc:return Math.floor((i+9)/10)*Math.floor((e+9)/10)*16;case kc:return Math.floor((i+11)/12)*Math.floor((e+9)/10)*16;case Hc:return Math.floor((i+11)/12)*Math.floor((e+11)/12)*16;case Gc:case Vc:case Wc:return Math.ceil(i/4)*Math.ceil(e/4)*16;case Xc:case Kc:return Math.ceil(i/4)*Math.ceil(e/4)*8;case Yc:case qc:return Math.ceil(i/4)*Math.ceil(e/4)*16}throw new Error(`Unable to determine texture byte length for ${t} format.`)}function $_(i){switch(i){case on:case np:return{byteLength:1,components:1};case $r:case ip:case ln:return{byteLength:2,components:1};case Ph:case Lh:return{byteLength:2,components:4};case jn:case Rh:case gn:return{byteLength:4,components:1};case sp:case rp:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${i}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:yh}}));typeof window<"u"&&(window.__THREE__?Re("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=yh);function Ip(){let i=null,e=!1,t=null,n=null;function s(r,a){t(r,a),n=i.requestAnimationFrame(s)}return{start:function(){e!==!0&&t!==null&&(n=i.requestAnimationFrame(s),e=!0)},stop:function(){i.cancelAnimationFrame(n),e=!1},setAnimationLoop:function(r){t=r},setContext:function(r){i=r}}}function J_(i){const e=new WeakMap;function t(o,l){const c=o.array,h=o.usage,u=c.byteLength,d=i.createBuffer();i.bindBuffer(l,d),i.bufferData(l,c,h),o.onUploadCallback();let f;if(c instanceof Float32Array)f=i.FLOAT;else if(typeof Float16Array<"u"&&c instanceof Float16Array)f=i.HALF_FLOAT;else if(c instanceof Uint16Array)o.isFloat16BufferAttribute?f=i.HALF_FLOAT:f=i.UNSIGNED_SHORT;else if(c instanceof Int16Array)f=i.SHORT;else if(c instanceof Uint32Array)f=i.UNSIGNED_INT;else if(c instanceof Int32Array)f=i.INT;else if(c instanceof Int8Array)f=i.BYTE;else if(c instanceof Uint8Array)f=i.UNSIGNED_BYTE;else if(c instanceof Uint8ClampedArray)f=i.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+c);return{buffer:d,type:f,bytesPerElement:c.BYTES_PER_ELEMENT,version:o.version,size:u}}function n(o,l,c){const h=l.array,u=l.updateRanges;if(i.bindBuffer(c,o),u.length===0)i.bufferSubData(c,0,h);else{u.sort((f,g)=>f.start-g.start);let d=0;for(let f=1;f<u.length;f++){const g=u[d],_=u[f];_.start<=g.start+g.count+1?g.count=Math.max(g.count,_.start+_.count-g.start):(++d,u[d]=_)}u.length=d+1;for(let f=0,g=u.length;f<g;f++){const _=u[f];i.bufferSubData(c,_.start*h.BYTES_PER_ELEMENT,h,_.start,_.count)}l.clearUpdateRanges()}l.onUploadCallback()}function s(o){return o.isInterleavedBufferAttribute&&(o=o.data),e.get(o)}function r(o){o.isInterleavedBufferAttribute&&(o=o.data);const l=e.get(o);l&&(i.deleteBuffer(l.buffer),e.delete(o))}function a(o,l){if(o.isInterleavedBufferAttribute&&(o=o.data),o.isGLBufferAttribute){const h=e.get(o);(!h||h.version<o.version)&&e.set(o,{buffer:o.buffer,type:o.type,bytesPerElement:o.elementSize,version:o.version});return}const c=e.get(o);if(c===void 0)e.set(o,t(o,l));else if(c.version<o.version){if(c.size!==o.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");n(c.buffer,o,l),c.version=o.version}}return{get:s,remove:r,update:a}}var Z_=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,Q_=`#ifdef USE_ALPHAHASH
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
#endif`,ex=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,tx=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,nx=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,ix=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,sx=`#ifdef USE_AOMAP
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
#endif`,rx=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,ax=`#ifdef USE_BATCHING
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
#endif`,ox=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,lx=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,cx=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,hx=`float G_BlinnPhong_Implicit( ) {
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
} // validated`,ux=`#ifdef USE_IRIDESCENCE
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
#endif`,dx=`#ifdef USE_BUMPMAP
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
#endif`,fx=`#if NUM_CLIPPING_PLANES > 0
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
#endif`,px=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,mx=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,gx=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,_x=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#endif`,xx=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#endif`,vx=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec4 vColor;
#endif`,Mx=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
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
#endif`,yx=`#define PI 3.141592653589793
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
} // validated`,Sx=`#ifdef ENVMAP_TYPE_CUBE_UV
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
#endif`,Ex=`vec3 transformedNormal = objectNormal;
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
#endif`,bx=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,Tx=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,Ax=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,wx=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,Cx="gl_FragColor = linearToOutputTexel( gl_FragColor );",Rx=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,Px=`#ifdef USE_ENVMAP
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
#endif`,Lx=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
#endif`,Dx=`#ifdef USE_ENVMAP
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
#endif`,Ix=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,Nx=`#ifdef USE_ENVMAP
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
#endif`,Ux=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,Ox=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,Fx=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,Bx=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,zx=`#ifdef USE_GRADIENTMAP
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
}`,kx=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,Hx=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,Gx=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,Vx=`uniform bool receiveShadow;
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
#endif`,Wx=`#ifdef USE_ENVMAP
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
#endif`,Xx=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,Kx=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,Yx=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,qx=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,jx=`PhysicalMaterial material;
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
#endif`,$x=`uniform sampler2D dfgLUT;
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
}`,Jx=`
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
#endif`,Zx=`#if defined( RE_IndirectDiffuse )
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
#endif`,Qx=`#if defined( RE_IndirectDiffuse )
	#if defined( LAMBERT ) || defined( PHONG )
		irradiance += iblIrradiance;
	#endif
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,ev=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,tv=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,nv=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,iv=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,sv=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,rv=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,av=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
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
#endif`,ov=`#if defined( USE_POINTS_UV )
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
#endif`,lv=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,cv=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,hv=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,uv=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,dv=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,fv=`#ifdef USE_MORPHTARGETS
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
#endif`,pv=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,mv=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
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
vec3 nonPerturbedNormal = normal;`,gv=`#ifdef USE_NORMALMAP_OBJECTSPACE
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
#endif`,_v=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,xv=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,vv=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,Mv=`#ifdef USE_NORMALMAP
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
#endif`,yv=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,Sv=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,Ev=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,bv=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,Tv=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,Av=`vec3 packNormalToRGB( const in vec3 normal ) {
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
}`,wv=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,Cv=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,Rv=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,Pv=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,Lv=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,Dv=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,Iv=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,Nv=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,Uv=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
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
#endif`,Ov=`float getShadowMask() {
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
}`,Fv=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,Bv=`#ifdef USE_SKINNING
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
#endif`,zv=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,kv=`#ifdef USE_SKINNING
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
#endif`,Hv=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,Gv=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,Vv=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,Wv=`#ifndef saturate
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
vec3 CustomToneMapping( vec3 color ) { return color; }`,Xv=`#ifdef USE_TRANSMISSION
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
#endif`,Kv=`#ifdef USE_TRANSMISSION
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
#endif`,Yv=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,qv=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,jv=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,$v=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const Jv=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,Zv=`uniform sampler2D t2D;
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
}`,Qv=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,eM=`#ifdef ENVMAP_TYPE_CUBE
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
}`,tM=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,nM=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,iM=`#include <common>
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
}`,sM=`#if DEPTH_PACKING == 3200
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
}`,rM=`#define DISTANCE
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
}`,aM=`#define DISTANCE
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
}`,oM=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,lM=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,cM=`uniform float scale;
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
}`,hM=`uniform vec3 diffuse;
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
}`,uM=`#include <common>
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
}`,dM=`uniform vec3 diffuse;
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
}`,fM=`#define LAMBERT
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
}`,pM=`#define LAMBERT
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
}`,mM=`#define MATCAP
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
}`,gM=`#define MATCAP
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
}`,_M=`#define NORMAL
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
}`,xM=`#define NORMAL
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
}`,vM=`#define PHONG
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
}`,MM=`#define PHONG
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
}`,yM=`#define STANDARD
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
}`,SM=`#define STANDARD
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
}`,EM=`#define TOON
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
}`,bM=`#define TOON
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
}`,TM=`uniform float size;
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
}`,AM=`uniform vec3 diffuse;
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
}`,wM=`#include <common>
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
}`,CM=`uniform vec3 color;
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
}`,RM=`uniform float rotation;
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
}`,PM=`uniform vec3 diffuse;
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
}`,qe={alphahash_fragment:Z_,alphahash_pars_fragment:Q_,alphamap_fragment:ex,alphamap_pars_fragment:tx,alphatest_fragment:nx,alphatest_pars_fragment:ix,aomap_fragment:sx,aomap_pars_fragment:rx,batching_pars_vertex:ax,batching_vertex:ox,begin_vertex:lx,beginnormal_vertex:cx,bsdfs:hx,iridescence_fragment:ux,bumpmap_pars_fragment:dx,clipping_planes_fragment:fx,clipping_planes_pars_fragment:px,clipping_planes_pars_vertex:mx,clipping_planes_vertex:gx,color_fragment:_x,color_pars_fragment:xx,color_pars_vertex:vx,color_vertex:Mx,common:yx,cube_uv_reflection_fragment:Sx,defaultnormal_vertex:Ex,displacementmap_pars_vertex:bx,displacementmap_vertex:Tx,emissivemap_fragment:Ax,emissivemap_pars_fragment:wx,colorspace_fragment:Cx,colorspace_pars_fragment:Rx,envmap_fragment:Px,envmap_common_pars_fragment:Lx,envmap_pars_fragment:Dx,envmap_pars_vertex:Ix,envmap_physical_pars_fragment:Wx,envmap_vertex:Nx,fog_vertex:Ux,fog_pars_vertex:Ox,fog_fragment:Fx,fog_pars_fragment:Bx,gradientmap_pars_fragment:zx,lightmap_pars_fragment:kx,lights_lambert_fragment:Hx,lights_lambert_pars_fragment:Gx,lights_pars_begin:Vx,lights_toon_fragment:Xx,lights_toon_pars_fragment:Kx,lights_phong_fragment:Yx,lights_phong_pars_fragment:qx,lights_physical_fragment:jx,lights_physical_pars_fragment:$x,lights_fragment_begin:Jx,lights_fragment_maps:Zx,lights_fragment_end:Qx,logdepthbuf_fragment:ev,logdepthbuf_pars_fragment:tv,logdepthbuf_pars_vertex:nv,logdepthbuf_vertex:iv,map_fragment:sv,map_pars_fragment:rv,map_particle_fragment:av,map_particle_pars_fragment:ov,metalnessmap_fragment:lv,metalnessmap_pars_fragment:cv,morphinstance_vertex:hv,morphcolor_vertex:uv,morphnormal_vertex:dv,morphtarget_pars_vertex:fv,morphtarget_vertex:pv,normal_fragment_begin:mv,normal_fragment_maps:gv,normal_pars_fragment:_v,normal_pars_vertex:xv,normal_vertex:vv,normalmap_pars_fragment:Mv,clearcoat_normal_fragment_begin:yv,clearcoat_normal_fragment_maps:Sv,clearcoat_pars_fragment:Ev,iridescence_pars_fragment:bv,opaque_fragment:Tv,packing:Av,premultiplied_alpha_fragment:wv,project_vertex:Cv,dithering_fragment:Rv,dithering_pars_fragment:Pv,roughnessmap_fragment:Lv,roughnessmap_pars_fragment:Dv,shadowmap_pars_fragment:Iv,shadowmap_pars_vertex:Nv,shadowmap_vertex:Uv,shadowmask_pars_fragment:Ov,skinbase_vertex:Fv,skinning_pars_vertex:Bv,skinning_vertex:zv,skinnormal_vertex:kv,specularmap_fragment:Hv,specularmap_pars_fragment:Gv,tonemapping_fragment:Vv,tonemapping_pars_fragment:Wv,transmission_fragment:Xv,transmission_pars_fragment:Kv,uv_pars_fragment:Yv,uv_pars_vertex:qv,uv_vertex:jv,worldpos_vertex:$v,background_vert:Jv,background_frag:Zv,backgroundCube_vert:Qv,backgroundCube_frag:eM,cube_vert:tM,cube_frag:nM,depth_vert:iM,depth_frag:sM,distance_vert:rM,distance_frag:aM,equirect_vert:oM,equirect_frag:lM,linedashed_vert:cM,linedashed_frag:hM,meshbasic_vert:uM,meshbasic_frag:dM,meshlambert_vert:fM,meshlambert_frag:pM,meshmatcap_vert:mM,meshmatcap_frag:gM,meshnormal_vert:_M,meshnormal_frag:xM,meshphong_vert:vM,meshphong_frag:MM,meshphysical_vert:yM,meshphysical_frag:SM,meshtoon_vert:EM,meshtoon_frag:bM,points_vert:TM,points_frag:AM,shadow_vert:wM,shadow_frag:CM,sprite_vert:RM,sprite_frag:PM},ue={common:{diffuse:{value:new Me(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Ye},alphaMap:{value:null},alphaMapTransform:{value:new Ye},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Ye}},envmap:{envMap:{value:null},envMapRotation:{value:new Ye},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98},dfgLUT:{value:null}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Ye}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Ye}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Ye},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Ye},normalScale:{value:new j(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Ye},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Ye}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Ye}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Ye}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new Me(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new Me(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Ye},alphaTest:{value:0},uvTransform:{value:new Ye}},sprite:{diffuse:{value:new Me(16777215)},opacity:{value:1},center:{value:new j(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Ye},alphaMap:{value:null},alphaMapTransform:{value:new Ye},alphaTest:{value:0}}},tn={basic:{uniforms:jt([ue.common,ue.specularmap,ue.envmap,ue.aomap,ue.lightmap,ue.fog]),vertexShader:qe.meshbasic_vert,fragmentShader:qe.meshbasic_frag},lambert:{uniforms:jt([ue.common,ue.specularmap,ue.envmap,ue.aomap,ue.lightmap,ue.emissivemap,ue.bumpmap,ue.normalmap,ue.displacementmap,ue.fog,ue.lights,{emissive:{value:new Me(0)},envMapIntensity:{value:1}}]),vertexShader:qe.meshlambert_vert,fragmentShader:qe.meshlambert_frag},phong:{uniforms:jt([ue.common,ue.specularmap,ue.envmap,ue.aomap,ue.lightmap,ue.emissivemap,ue.bumpmap,ue.normalmap,ue.displacementmap,ue.fog,ue.lights,{emissive:{value:new Me(0)},specular:{value:new Me(1118481)},shininess:{value:30},envMapIntensity:{value:1}}]),vertexShader:qe.meshphong_vert,fragmentShader:qe.meshphong_frag},standard:{uniforms:jt([ue.common,ue.envmap,ue.aomap,ue.lightmap,ue.emissivemap,ue.bumpmap,ue.normalmap,ue.displacementmap,ue.roughnessmap,ue.metalnessmap,ue.fog,ue.lights,{emissive:{value:new Me(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:qe.meshphysical_vert,fragmentShader:qe.meshphysical_frag},toon:{uniforms:jt([ue.common,ue.aomap,ue.lightmap,ue.emissivemap,ue.bumpmap,ue.normalmap,ue.displacementmap,ue.gradientmap,ue.fog,ue.lights,{emissive:{value:new Me(0)}}]),vertexShader:qe.meshtoon_vert,fragmentShader:qe.meshtoon_frag},matcap:{uniforms:jt([ue.common,ue.bumpmap,ue.normalmap,ue.displacementmap,ue.fog,{matcap:{value:null}}]),vertexShader:qe.meshmatcap_vert,fragmentShader:qe.meshmatcap_frag},points:{uniforms:jt([ue.points,ue.fog]),vertexShader:qe.points_vert,fragmentShader:qe.points_frag},dashed:{uniforms:jt([ue.common,ue.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:qe.linedashed_vert,fragmentShader:qe.linedashed_frag},depth:{uniforms:jt([ue.common,ue.displacementmap]),vertexShader:qe.depth_vert,fragmentShader:qe.depth_frag},normal:{uniforms:jt([ue.common,ue.bumpmap,ue.normalmap,ue.displacementmap,{opacity:{value:1}}]),vertexShader:qe.meshnormal_vert,fragmentShader:qe.meshnormal_frag},sprite:{uniforms:jt([ue.sprite,ue.fog]),vertexShader:qe.sprite_vert,fragmentShader:qe.sprite_frag},background:{uniforms:{uvTransform:{value:new Ye},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:qe.background_vert,fragmentShader:qe.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new Ye}},vertexShader:qe.backgroundCube_vert,fragmentShader:qe.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:qe.cube_vert,fragmentShader:qe.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:qe.equirect_vert,fragmentShader:qe.equirect_frag},distance:{uniforms:jt([ue.common,ue.displacementmap,{referencePosition:{value:new P},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:qe.distance_vert,fragmentShader:qe.distance_frag},shadow:{uniforms:jt([ue.lights,ue.fog,{color:{value:new Me(0)},opacity:{value:1}}]),vertexShader:qe.shadow_vert,fragmentShader:qe.shadow_frag}};tn.physical={uniforms:jt([tn.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Ye},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Ye},clearcoatNormalScale:{value:new j(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Ye},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Ye},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Ye},sheen:{value:0},sheenColor:{value:new Me(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Ye},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Ye},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Ye},transmissionSamplerSize:{value:new j},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Ye},attenuationDistance:{value:0},attenuationColor:{value:new Me(0)},specularColor:{value:new Me(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Ye},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Ye},anisotropyVector:{value:new j},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Ye}}]),vertexShader:qe.meshphysical_vert,fragmentShader:qe.meshphysical_frag};const Ja={r:0,b:0,g:0},Fi=new Nn,LM=new We;function DM(i,e,t,n,s,r){const a=new Me(0);let o=s===!0?0:1,l,c,h=null,u=0,d=null;function f(M){let y=M.isScene===!0?M.background:null;if(y&&y.isTexture){const S=M.backgroundBlurriness>0;y=e.get(y,S)}return y}function g(M){let y=!1;const S=f(M);S===null?p(a,o):S&&S.isColor&&(p(S,1),y=!0);const w=i.xr.getEnvironmentBlendMode();w==="additive"?t.buffers.color.setClear(0,0,0,1,r):w==="alpha-blend"&&t.buffers.color.setClear(0,0,0,0,r),(i.autoClear||y)&&(t.buffers.depth.setTest(!0),t.buffers.depth.setMask(!0),t.buffers.color.setMask(!0),i.clear(i.autoClearColor,i.autoClearDepth,i.autoClearStencil))}function _(M,y){const S=f(y);S&&(S.isCubeTexture||S.mapping===Xo)?(c===void 0&&(c=new st(new da(1,1,1),new Gt({name:"BackgroundCubeMaterial",uniforms:js(tn.backgroundCube.uniforms),vertexShader:tn.backgroundCube.vertexShader,fragmentShader:tn.backgroundCube.fragmentShader,side:Jt,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),c.geometry.deleteAttribute("normal"),c.geometry.deleteAttribute("uv"),c.onBeforeRender=function(w,T,L){this.matrixWorld.copyPosition(L.matrixWorld)},Object.defineProperty(c.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),n.update(c)),Fi.copy(y.backgroundRotation),Fi.x*=-1,Fi.y*=-1,Fi.z*=-1,S.isCubeTexture&&S.isRenderTargetTexture===!1&&(Fi.y*=-1,Fi.z*=-1),c.material.uniforms.envMap.value=S,c.material.uniforms.flipEnvMap.value=S.isCubeTexture&&S.isRenderTargetTexture===!1?-1:1,c.material.uniforms.backgroundBlurriness.value=y.backgroundBlurriness,c.material.uniforms.backgroundIntensity.value=y.backgroundIntensity,c.material.uniforms.backgroundRotation.value.setFromMatrix4(LM.makeRotationFromEuler(Fi)),c.material.toneMapped=Qe.getTransfer(S.colorSpace)!==nt,(h!==S||u!==S.version||d!==i.toneMapping)&&(c.material.needsUpdate=!0,h=S,u=S.version,d=i.toneMapping),c.layers.enableAll(),M.unshift(c,c.geometry,c.material,0,0,null)):S&&S.isTexture&&(l===void 0&&(l=new st(new Pi(2,2),new Gt({name:"BackgroundMaterial",uniforms:js(tn.background.uniforms),vertexShader:tn.background.vertexShader,fragmentShader:tn.background.fragmentShader,side:di,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),l.geometry.deleteAttribute("normal"),Object.defineProperty(l.material,"map",{get:function(){return this.uniforms.t2D.value}}),n.update(l)),l.material.uniforms.t2D.value=S,l.material.uniforms.backgroundIntensity.value=y.backgroundIntensity,l.material.toneMapped=Qe.getTransfer(S.colorSpace)!==nt,S.matrixAutoUpdate===!0&&S.updateMatrix(),l.material.uniforms.uvTransform.value.copy(S.matrix),(h!==S||u!==S.version||d!==i.toneMapping)&&(l.material.needsUpdate=!0,h=S,u=S.version,d=i.toneMapping),l.layers.enableAll(),M.unshift(l,l.geometry,l.material,0,0,null))}function p(M,y){M.getRGB(Ja,Ap(i)),t.buffers.color.setClear(Ja.r,Ja.g,Ja.b,y,r)}function m(){c!==void 0&&(c.geometry.dispose(),c.material.dispose(),c=void 0),l!==void 0&&(l.geometry.dispose(),l.material.dispose(),l=void 0)}return{getClearColor:function(){return a},setClearColor:function(M,y=1){a.set(M),o=y,p(a,o)},getClearAlpha:function(){return o},setClearAlpha:function(M){o=M,p(a,o)},render:g,addToRenderList:_,dispose:m}}function IM(i,e){const t=i.getParameter(i.MAX_VERTEX_ATTRIBS),n={},s=d(null);let r=s,a=!1;function o(C,O,F,V,z){let H=!1;const B=u(C,V,F,O);r!==B&&(r=B,c(r.object)),H=f(C,V,F,z),H&&g(C,V,F,z),z!==null&&e.update(z,i.ELEMENT_ARRAY_BUFFER),(H||a)&&(a=!1,S(C,O,F,V),z!==null&&i.bindBuffer(i.ELEMENT_ARRAY_BUFFER,e.get(z).buffer))}function l(){return i.createVertexArray()}function c(C){return i.bindVertexArray(C)}function h(C){return i.deleteVertexArray(C)}function u(C,O,F,V){const z=V.wireframe===!0;let H=n[O.id];H===void 0&&(H={},n[O.id]=H);const B=C.isInstancedMesh===!0?C.id:0;let ie=H[B];ie===void 0&&(ie={},H[B]=ie);let Q=ie[F.id];Q===void 0&&(Q={},ie[F.id]=Q);let me=Q[z];return me===void 0&&(me=d(l()),Q[z]=me),me}function d(C){const O=[],F=[],V=[];for(let z=0;z<t;z++)O[z]=0,F[z]=0,V[z]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:O,enabledAttributes:F,attributeDivisors:V,object:C,attributes:{},index:null}}function f(C,O,F,V){const z=r.attributes,H=O.attributes;let B=0;const ie=F.getAttributes();for(const Q in ie)if(ie[Q].location>=0){const _e=z[Q];let ge=H[Q];if(ge===void 0&&(Q==="instanceMatrix"&&C.instanceMatrix&&(ge=C.instanceMatrix),Q==="instanceColor"&&C.instanceColor&&(ge=C.instanceColor)),_e===void 0||_e.attribute!==ge||ge&&_e.data!==ge.data)return!0;B++}return r.attributesNum!==B||r.index!==V}function g(C,O,F,V){const z={},H=O.attributes;let B=0;const ie=F.getAttributes();for(const Q in ie)if(ie[Q].location>=0){let _e=H[Q];_e===void 0&&(Q==="instanceMatrix"&&C.instanceMatrix&&(_e=C.instanceMatrix),Q==="instanceColor"&&C.instanceColor&&(_e=C.instanceColor));const ge={};ge.attribute=_e,_e&&_e.data&&(ge.data=_e.data),z[Q]=ge,B++}r.attributes=z,r.attributesNum=B,r.index=V}function _(){const C=r.newAttributes;for(let O=0,F=C.length;O<F;O++)C[O]=0}function p(C){m(C,0)}function m(C,O){const F=r.newAttributes,V=r.enabledAttributes,z=r.attributeDivisors;F[C]=1,V[C]===0&&(i.enableVertexAttribArray(C),V[C]=1),z[C]!==O&&(i.vertexAttribDivisor(C,O),z[C]=O)}function M(){const C=r.newAttributes,O=r.enabledAttributes;for(let F=0,V=O.length;F<V;F++)O[F]!==C[F]&&(i.disableVertexAttribArray(F),O[F]=0)}function y(C,O,F,V,z,H,B){B===!0?i.vertexAttribIPointer(C,O,F,z,H):i.vertexAttribPointer(C,O,F,V,z,H)}function S(C,O,F,V){_();const z=V.attributes,H=F.getAttributes(),B=O.defaultAttributeValues;for(const ie in H){const Q=H[ie];if(Q.location>=0){let me=z[ie];if(me===void 0&&(ie==="instanceMatrix"&&C.instanceMatrix&&(me=C.instanceMatrix),ie==="instanceColor"&&C.instanceColor&&(me=C.instanceColor)),me!==void 0){const _e=me.normalized,ge=me.itemSize,ke=e.get(me);if(ke===void 0)continue;const rt=ke.buffer,ct=ke.type,q=ke.bytesPerElement,ae=ct===i.INT||ct===i.UNSIGNED_INT||me.gpuType===Rh;if(me.isInterleavedBufferAttribute){const oe=me.data,Ue=oe.stride,Ie=me.offset;if(oe.isInstancedInterleavedBuffer){for(let He=0;He<Q.locationSize;He++)m(Q.location+He,oe.meshPerAttribute);C.isInstancedMesh!==!0&&V._maxInstanceCount===void 0&&(V._maxInstanceCount=oe.meshPerAttribute*oe.count)}else for(let He=0;He<Q.locationSize;He++)p(Q.location+He);i.bindBuffer(i.ARRAY_BUFFER,rt);for(let He=0;He<Q.locationSize;He++)y(Q.location+He,ge/Q.locationSize,ct,_e,Ue*q,(Ie+ge/Q.locationSize*He)*q,ae)}else{if(me.isInstancedBufferAttribute){for(let oe=0;oe<Q.locationSize;oe++)m(Q.location+oe,me.meshPerAttribute);C.isInstancedMesh!==!0&&V._maxInstanceCount===void 0&&(V._maxInstanceCount=me.meshPerAttribute*me.count)}else for(let oe=0;oe<Q.locationSize;oe++)p(Q.location+oe);i.bindBuffer(i.ARRAY_BUFFER,rt);for(let oe=0;oe<Q.locationSize;oe++)y(Q.location+oe,ge/Q.locationSize,ct,_e,ge*q,ge/Q.locationSize*oe*q,ae)}}else if(B!==void 0){const _e=B[ie];if(_e!==void 0)switch(_e.length){case 2:i.vertexAttrib2fv(Q.location,_e);break;case 3:i.vertexAttrib3fv(Q.location,_e);break;case 4:i.vertexAttrib4fv(Q.location,_e);break;default:i.vertexAttrib1fv(Q.location,_e)}}}}M()}function w(){E();for(const C in n){const O=n[C];for(const F in O){const V=O[F];for(const z in V){const H=V[z];for(const B in H)h(H[B].object),delete H[B];delete V[z]}}delete n[C]}}function T(C){if(n[C.id]===void 0)return;const O=n[C.id];for(const F in O){const V=O[F];for(const z in V){const H=V[z];for(const B in H)h(H[B].object),delete H[B];delete V[z]}}delete n[C.id]}function L(C){for(const O in n){const F=n[O];for(const V in F){const z=F[V];if(z[C.id]===void 0)continue;const H=z[C.id];for(const B in H)h(H[B].object),delete H[B];delete z[C.id]}}}function x(C){for(const O in n){const F=n[O],V=C.isInstancedMesh===!0?C.id:0,z=F[V];if(z!==void 0){for(const H in z){const B=z[H];for(const ie in B)h(B[ie].object),delete B[ie];delete z[H]}delete F[V],Object.keys(F).length===0&&delete n[O]}}}function E(){N(),a=!0,r!==s&&(r=s,c(r.object))}function N(){s.geometry=null,s.program=null,s.wireframe=!1}return{setup:o,reset:E,resetDefaultState:N,dispose:w,releaseStatesOfGeometry:T,releaseStatesOfObject:x,releaseStatesOfProgram:L,initAttributes:_,enableAttribute:p,disableUnusedAttributes:M}}function NM(i,e,t){let n;function s(c){n=c}function r(c,h){i.drawArrays(n,c,h),t.update(h,n,1)}function a(c,h,u){u!==0&&(i.drawArraysInstanced(n,c,h,u),t.update(h,n,u))}function o(c,h,u){if(u===0)return;e.get("WEBGL_multi_draw").multiDrawArraysWEBGL(n,c,0,h,0,u);let f=0;for(let g=0;g<u;g++)f+=h[g];t.update(f,n,1)}function l(c,h,u,d){if(u===0)return;const f=e.get("WEBGL_multi_draw");if(f===null)for(let g=0;g<c.length;g++)a(c[g],h[g],d[g]);else{f.multiDrawArraysInstancedWEBGL(n,c,0,h,0,d,0,u);let g=0;for(let _=0;_<u;_++)g+=h[_]*d[_];t.update(g,n,1)}}this.setMode=s,this.render=r,this.renderInstances=a,this.renderMultiDraw=o,this.renderMultiDrawInstances=l}function UM(i,e,t,n){let s;function r(){if(s!==void 0)return s;if(e.has("EXT_texture_filter_anisotropic")===!0){const L=e.get("EXT_texture_filter_anisotropic");s=i.getParameter(L.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else s=0;return s}function a(L){return!(L!==_n&&n.convert(L)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_FORMAT))}function o(L){const x=L===ln&&(e.has("EXT_color_buffer_half_float")||e.has("EXT_color_buffer_float"));return!(L!==on&&n.convert(L)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_TYPE)&&L!==gn&&!x)}function l(L){if(L==="highp"){if(i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.HIGH_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.HIGH_FLOAT).precision>0)return"highp";L="mediump"}return L==="mediump"&&i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.MEDIUM_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let c=t.precision!==void 0?t.precision:"highp";const h=l(c);h!==c&&(Re("WebGLRenderer:",c,"not supported, using",h,"instead."),c=h);const u=t.logarithmicDepthBuffer===!0,d=t.reversedDepthBuffer===!0&&e.has("EXT_clip_control"),f=i.getParameter(i.MAX_TEXTURE_IMAGE_UNITS),g=i.getParameter(i.MAX_VERTEX_TEXTURE_IMAGE_UNITS),_=i.getParameter(i.MAX_TEXTURE_SIZE),p=i.getParameter(i.MAX_CUBE_MAP_TEXTURE_SIZE),m=i.getParameter(i.MAX_VERTEX_ATTRIBS),M=i.getParameter(i.MAX_VERTEX_UNIFORM_VECTORS),y=i.getParameter(i.MAX_VARYING_VECTORS),S=i.getParameter(i.MAX_FRAGMENT_UNIFORM_VECTORS),w=i.getParameter(i.MAX_SAMPLES),T=i.getParameter(i.SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:r,getMaxPrecision:l,textureFormatReadable:a,textureTypeReadable:o,precision:c,logarithmicDepthBuffer:u,reversedDepthBuffer:d,maxTextures:f,maxVertexTextures:g,maxTextureSize:_,maxCubemapSize:p,maxAttributes:m,maxVertexUniforms:M,maxVaryings:y,maxFragmentUniforms:S,maxSamples:w,samples:T}}function OM(i){const e=this;let t=null,n=0,s=!1,r=!1;const a=new bi,o=new Ye,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(u,d){const f=u.length!==0||d||n!==0||s;return s=d,n=u.length,f},this.beginShadows=function(){r=!0,h(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(u,d){t=h(u,d,0)},this.setState=function(u,d,f){const g=u.clippingPlanes,_=u.clipIntersection,p=u.clipShadows,m=i.get(u);if(!s||g===null||g.length===0||r&&!p)r?h(null):c();else{const M=r?0:n,y=M*4;let S=m.clippingState||null;l.value=S,S=h(g,d,y,f);for(let w=0;w!==y;++w)S[w]=t[w];m.clippingState=S,this.numIntersection=_?this.numPlanes:0,this.numPlanes+=M}};function c(){l.value!==t&&(l.value=t,l.needsUpdate=n>0),e.numPlanes=n,e.numIntersection=0}function h(u,d,f,g){const _=u!==null?u.length:0;let p=null;if(_!==0){if(p=l.value,g!==!0||p===null){const m=f+_*4,M=d.matrixWorldInverse;o.getNormalMatrix(M),(p===null||p.length<m)&&(p=new Float32Array(m));for(let y=0,S=f;y!==_;++y,S+=4)a.copy(u[y]).applyMatrix4(M,o),a.normal.toArray(p,S),p[S+3]=a.constant}l.value=p,l.needsUpdate=!0}return e.numPlanes=_,e.numIntersection=0,p}}const wi=4,Ld=[.125,.215,.35,.446,.526,.582],Vi=20,FM=256,br=new pa,Dd=new Me;let kl=null,Hl=0,Gl=0,Vl=!1;const BM=new P;class Id{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._sizeLods=[],this._sigmas=[],this._lodMeshes=[],this._backgroundBox=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._blurMaterial=null,this._ggxMaterial=null}fromScene(e,t=0,n=.1,s=100,r={}){const{size:a=256,position:o=BM}=r;kl=this._renderer.getRenderTarget(),Hl=this._renderer.getActiveCubeFace(),Gl=this._renderer.getActiveMipmapLevel(),Vl=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(a);const l=this._allocateTargets();return l.depthBuffer=!0,this._sceneToCubeUV(e,n,s,l,o),t>0&&this._blur(l,0,0,t),this._applyPMREM(l),this._cleanup(l),l}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=Od(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=Ud(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose(),this._backgroundBox!==null&&(this._backgroundBox.geometry.dispose(),this._backgroundBox.material.dispose())}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._ggxMaterial!==null&&this._ggxMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodMeshes.length;e++)this._lodMeshes[e].geometry.dispose()}_cleanup(e){this._renderer.setRenderTarget(kl,Hl,Gl),this._renderer.xr.enabled=Vl,e.scissorTest=!1,As(e,0,0,e.width,e.height)}_fromTexture(e,t){e.mapping===Yi||e.mapping===Vs?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),kl=this._renderer.getRenderTarget(),Hl=this._renderer.getActiveCubeFace(),Gl=this._renderer.getActiveMipmapLevel(),Vl=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const n=t||this._allocateTargets();return this._textureToCubeUV(e,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){const e=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,n={magFilter:_t,minFilter:_t,generateMipmaps:!1,type:ln,format:_n,colorSpace:Zt,depthBuffer:!1},s=Nd(e,t,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=Nd(e,t,n);const{_lodMax:r}=this;({lodMeshes:this._lodMeshes,sizeLods:this._sizeLods,sigmas:this._sigmas}=zM(r)),this._blurMaterial=HM(r,e,t),this._ggxMaterial=kM(r,e,t)}return s}_compileMaterial(e){const t=new st(new et,e);this._renderer.compile(t,br)}_sceneToCubeUV(e,t,n,s,r){const l=new $t(90,1,t,n),c=[1,-1,1,1,1,1],h=[1,1,1,-1,-1,-1],u=this._renderer,d=u.autoClear,f=u.toneMapping;u.getClearColor(Dd),u.toneMapping=qn,u.autoClear=!1,u.state.buffers.depth.getReversed()&&(u.setRenderTarget(s),u.clearDepth(),u.setRenderTarget(null)),this._backgroundBox===null&&(this._backgroundBox=new st(new da,new yt({name:"PMREM.Background",side:Jt,depthWrite:!1,depthTest:!1})));const _=this._backgroundBox,p=_.material;let m=!1;const M=e.background;M?M.isColor&&(p.color.copy(M),e.background=null,m=!0):(p.color.copy(Dd),m=!0);for(let y=0;y<6;y++){const S=y%3;S===0?(l.up.set(0,c[y],0),l.position.set(r.x,r.y,r.z),l.lookAt(r.x+h[y],r.y,r.z)):S===1?(l.up.set(0,0,c[y]),l.position.set(r.x,r.y,r.z),l.lookAt(r.x,r.y+h[y],r.z)):(l.up.set(0,c[y],0),l.position.set(r.x,r.y,r.z),l.lookAt(r.x,r.y,r.z+h[y]));const w=this._cubeSize;As(s,S*w,y>2?w:0,w,w),u.setRenderTarget(s),m&&u.render(_,l),u.render(e,l)}u.toneMapping=f,u.autoClear=d,e.background=M}_textureToCubeUV(e,t){const n=this._renderer,s=e.mapping===Yi||e.mapping===Vs;s?(this._cubemapMaterial===null&&(this._cubemapMaterial=Od()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=Ud());const r=s?this._cubemapMaterial:this._equirectMaterial,a=this._lodMeshes[0];a.material=r;const o=r.uniforms;o.envMap.value=e;const l=this._cubeSize;As(t,0,0,3*l,2*l),n.setRenderTarget(t),n.render(a,br)}_applyPMREM(e){const t=this._renderer,n=t.autoClear;t.autoClear=!1;const s=this._lodMeshes.length;for(let r=1;r<s;r++)this._applyGGXFilter(e,r-1,r);t.autoClear=n}_applyGGXFilter(e,t,n){const s=this._renderer,r=this._pingPongRenderTarget,a=this._ggxMaterial,o=this._lodMeshes[n];o.material=a;const l=a.uniforms,c=n/(this._lodMeshes.length-1),h=t/(this._lodMeshes.length-1),u=Math.sqrt(c*c-h*h),d=0+c*1.25,f=u*d,{_lodMax:g}=this,_=this._sizeLods[n],p=3*_*(n>g-wi?n-g+wi:0),m=4*(this._cubeSize-_);l.envMap.value=e.texture,l.roughness.value=f,l.mipInt.value=g-t,As(r,p,m,3*_,2*_),s.setRenderTarget(r),s.render(o,br),l.envMap.value=r.texture,l.roughness.value=0,l.mipInt.value=g-n,As(e,p,m,3*_,2*_),s.setRenderTarget(e),s.render(o,br)}_blur(e,t,n,s,r){const a=this._pingPongRenderTarget;this._halfBlur(e,a,t,n,s,"latitudinal",r),this._halfBlur(a,e,n,n,s,"longitudinal",r)}_halfBlur(e,t,n,s,r,a,o){const l=this._renderer,c=this._blurMaterial;a!=="latitudinal"&&a!=="longitudinal"&&Be("blur direction must be either latitudinal or longitudinal!");const h=3,u=this._lodMeshes[s];u.material=c;const d=c.uniforms,f=this._sizeLods[n]-1,g=isFinite(r)?Math.PI/(2*f):2*Math.PI/(2*Vi-1),_=r/g,p=isFinite(r)?1+Math.floor(h*_):Vi;p>Vi&&Re(`sigmaRadians, ${r}, is too large and will clip, as it requested ${p} samples when the maximum is set to ${Vi}`);const m=[];let M=0;for(let L=0;L<Vi;++L){const x=L/_,E=Math.exp(-x*x/2);m.push(E),L===0?M+=E:L<p&&(M+=2*E)}for(let L=0;L<m.length;L++)m[L]=m[L]/M;d.envMap.value=e.texture,d.samples.value=p,d.weights.value=m,d.latitudinal.value=a==="latitudinal",o&&(d.poleAxis.value=o);const{_lodMax:y}=this;d.dTheta.value=g,d.mipInt.value=y-n;const S=this._sizeLods[s],w=3*S*(s>y-wi?s-y+wi:0),T=4*(this._cubeSize-S);As(t,w,T,3*S,2*S),l.setRenderTarget(t),l.render(u,br)}}function zM(i){const e=[],t=[],n=[];let s=i;const r=i-wi+1+Ld.length;for(let a=0;a<r;a++){const o=Math.pow(2,s);e.push(o);let l=1/o;a>i-wi?l=Ld[a-i+wi-1]:a===0&&(l=0),t.push(l);const c=1/(o-2),h=-c,u=1+c,d=[h,h,u,h,u,u,h,h,u,u,h,u],f=6,g=6,_=3,p=2,m=1,M=new Float32Array(_*g*f),y=new Float32Array(p*g*f),S=new Float32Array(m*g*f);for(let T=0;T<f;T++){const L=T%3*2/3-1,x=T>2?0:-1,E=[L,x,0,L+2/3,x,0,L+2/3,x+1,0,L,x,0,L+2/3,x+1,0,L,x+1,0];M.set(E,_*g*T),y.set(d,p*g*T);const N=[T,T,T,T,T,T];S.set(N,m*g*T)}const w=new et;w.setAttribute("position",new Yt(M,_)),w.setAttribute("uv",new Yt(y,p)),w.setAttribute("faceIndex",new Yt(S,m)),n.push(new st(w,null)),s>wi&&s--}return{lodMeshes:n,sizeLods:e,sigmas:t}}function Nd(i,e,t){const n=new nn(i,e,t);return n.texture.mapping=Xo,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function As(i,e,t,n,s){i.viewport.set(e,t,n,s),i.scissor.set(e,t,n,s)}function kM(i,e,t){return new Gt({name:"PMREMGGXConvolution",defines:{GGX_SAMPLES:FM,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${i}.0`},uniforms:{envMap:{value:null},roughness:{value:0},mipInt:{value:0}},vertexShader:jo(),fragmentShader:`

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
		`,blending:Yn,depthTest:!1,depthWrite:!1})}function HM(i,e,t){const n=new Float32Array(Vi),s=new P(0,1,0);return new Gt({name:"SphericalGaussianBlur",defines:{n:Vi,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${i}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:n},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:s}},vertexShader:jo(),fragmentShader:`

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
		`,blending:Yn,depthTest:!1,depthWrite:!1})}function Ud(){return new Gt({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:jo(),fragmentShader:`

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
		`,blending:Yn,depthTest:!1,depthWrite:!1})}function Od(){return new Gt({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:jo(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:Yn,depthTest:!1,depthWrite:!1})}function jo(){return`

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
	`}class Np extends nn{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;const n={width:e,height:e,depth:1},s=[n,n,n,n,n,n];this.texture=new gp(s),this._setTextureOptions(t),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;const n={uniforms:{tEquirect:{value:null}},vertexShader:`

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
			`},s=new da(5,5,5),r=new Gt({name:"CubemapFromEquirect",uniforms:js(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:Jt,blending:Yn});r.uniforms.tEquirect.value=t;const a=new st(s,r),o=t.minFilter;return t.minFilter===Rn&&(t.minFilter=_t),new P_(1,10,this).update(e,a),t.minFilter=o,a.geometry.dispose(),a.material.dispose(),this}clear(e,t=!0,n=!0,s=!0){const r=e.getRenderTarget();for(let a=0;a<6;a++)e.setRenderTarget(this,a),e.clear(t,n,s);e.setRenderTarget(r)}}function GM(i){let e=new WeakMap,t=new WeakMap,n=null;function s(d,f=!1){return d==null?null:f?a(d):r(d)}function r(d){if(d&&d.isTexture){const f=d.mapping;if(f===rl||f===al)if(e.has(d)){const g=e.get(d).texture;return o(g,d.mapping)}else{const g=d.image;if(g&&g.height>0){const _=new Np(g.height);return _.fromEquirectangularTexture(i,d),e.set(d,_),d.addEventListener("dispose",c),o(_.texture,d.mapping)}else return null}}return d}function a(d){if(d&&d.isTexture){const f=d.mapping,g=f===rl||f===al,_=f===Yi||f===Vs;if(g||_){let p=t.get(d);const m=p!==void 0?p.texture.pmremVersion:0;if(d.isRenderTargetTexture&&d.pmremVersion!==m)return n===null&&(n=new Id(i)),p=g?n.fromEquirectangular(d,p):n.fromCubemap(d,p),p.texture.pmremVersion=d.pmremVersion,t.set(d,p),p.texture;if(p!==void 0)return p.texture;{const M=d.image;return g&&M&&M.height>0||_&&M&&l(M)?(n===null&&(n=new Id(i)),p=g?n.fromEquirectangular(d):n.fromCubemap(d),p.texture.pmremVersion=d.pmremVersion,t.set(d,p),d.addEventListener("dispose",h),p.texture):null}}}return d}function o(d,f){return f===rl?d.mapping=Yi:f===al&&(d.mapping=Vs),d}function l(d){let f=0;const g=6;for(let _=0;_<g;_++)d[_]!==void 0&&f++;return f===g}function c(d){const f=d.target;f.removeEventListener("dispose",c);const g=e.get(f);g!==void 0&&(e.delete(f),g.dispose())}function h(d){const f=d.target;f.removeEventListener("dispose",h);const g=t.get(f);g!==void 0&&(t.delete(f),g.dispose())}function u(){e=new WeakMap,t=new WeakMap,n!==null&&(n.dispose(),n=null)}return{get:s,dispose:u}}function VM(i){const e={};function t(n){if(e[n]!==void 0)return e[n];const s=i.getExtension(n);return e[n]=s,s}return{has:function(n){return t(n)!==null},init:function(){t("EXT_color_buffer_float"),t("WEBGL_clip_cull_distance"),t("OES_texture_float_linear"),t("EXT_color_buffer_half_float"),t("WEBGL_multisampled_render_to_texture"),t("WEBGL_render_shared_exponent")},get:function(n){const s=t(n);return s===null&&Uo("WebGLRenderer: "+n+" extension not supported."),s}}}function WM(i,e,t,n){const s={},r=new WeakMap;function a(u){const d=u.target;d.index!==null&&e.remove(d.index);for(const g in d.attributes)e.remove(d.attributes[g]);d.removeEventListener("dispose",a),delete s[d.id];const f=r.get(d);f&&(e.remove(f),r.delete(d)),n.releaseStatesOfGeometry(d),d.isInstancedBufferGeometry===!0&&delete d._maxInstanceCount,t.memory.geometries--}function o(u,d){return s[d.id]===!0||(d.addEventListener("dispose",a),s[d.id]=!0,t.memory.geometries++),d}function l(u){const d=u.attributes;for(const f in d)e.update(d[f],i.ARRAY_BUFFER)}function c(u){const d=[],f=u.index,g=u.attributes.position;let _=0;if(g===void 0)return;if(f!==null){const M=f.array;_=f.version;for(let y=0,S=M.length;y<S;y+=3){const w=M[y+0],T=M[y+1],L=M[y+2];d.push(w,T,T,L,L,w)}}else{const M=g.array;_=g.version;for(let y=0,S=M.length/3-1;y<S;y+=3){const w=y+0,T=y+1,L=y+2;d.push(w,T,T,L,L,w)}}const p=new(g.count>=65535?fp:dp)(d,1);p.version=_;const m=r.get(u);m&&e.remove(m),r.set(u,p)}function h(u){const d=r.get(u);if(d){const f=u.index;f!==null&&d.version<f.version&&c(u)}else c(u);return r.get(u)}return{get:o,update:l,getWireframeAttribute:h}}function XM(i,e,t){let n;function s(d){n=d}let r,a;function o(d){r=d.type,a=d.bytesPerElement}function l(d,f){i.drawElements(n,f,r,d*a),t.update(f,n,1)}function c(d,f,g){g!==0&&(i.drawElementsInstanced(n,f,r,d*a,g),t.update(f,n,g))}function h(d,f,g){if(g===0)return;e.get("WEBGL_multi_draw").multiDrawElementsWEBGL(n,f,0,r,d,0,g);let p=0;for(let m=0;m<g;m++)p+=f[m];t.update(p,n,1)}function u(d,f,g,_){if(g===0)return;const p=e.get("WEBGL_multi_draw");if(p===null)for(let m=0;m<d.length;m++)c(d[m]/a,f[m],_[m]);else{p.multiDrawElementsInstancedWEBGL(n,f,0,r,d,0,_,0,g);let m=0;for(let M=0;M<g;M++)m+=f[M]*_[M];t.update(m,n,1)}}this.setMode=s,this.setIndex=o,this.render=l,this.renderInstances=c,this.renderMultiDraw=h,this.renderMultiDrawInstances=u}function KM(i){const e={geometries:0,textures:0},t={frame:0,calls:0,triangles:0,points:0,lines:0};function n(r,a,o){switch(t.calls++,a){case i.TRIANGLES:t.triangles+=o*(r/3);break;case i.LINES:t.lines+=o*(r/2);break;case i.LINE_STRIP:t.lines+=o*(r-1);break;case i.LINE_LOOP:t.lines+=o*r;break;case i.POINTS:t.points+=o*r;break;default:Be("WebGLInfo: Unknown draw mode:",a);break}}function s(){t.calls=0,t.triangles=0,t.points=0,t.lines=0}return{memory:e,render:t,programs:null,autoReset:!0,reset:s,update:n}}function YM(i,e,t){const n=new WeakMap,s=new it;function r(a,o,l){const c=a.morphTargetInfluences,h=o.morphAttributes.position||o.morphAttributes.normal||o.morphAttributes.color,u=h!==void 0?h.length:0;let d=n.get(o);if(d===void 0||d.count!==u){let N=function(){x.dispose(),n.delete(o),o.removeEventListener("dispose",N)};var f=N;d!==void 0&&d.texture.dispose();const g=o.morphAttributes.position!==void 0,_=o.morphAttributes.normal!==void 0,p=o.morphAttributes.color!==void 0,m=o.morphAttributes.position||[],M=o.morphAttributes.normal||[],y=o.morphAttributes.color||[];let S=0;g===!0&&(S=1),_===!0&&(S=2),p===!0&&(S=3);let w=o.attributes.position.count*S,T=1;w>e.maxTextureSize&&(T=Math.ceil(w/e.maxTextureSize),w=e.maxTextureSize);const L=new Float32Array(w*T*4*u),x=new hp(L,w,T,u);x.type=gn,x.needsUpdate=!0;const E=S*4;for(let C=0;C<u;C++){const O=m[C],F=M[C],V=y[C],z=w*T*4*C;for(let H=0;H<O.count;H++){const B=H*E;g===!0&&(s.fromBufferAttribute(O,H),L[z+B+0]=s.x,L[z+B+1]=s.y,L[z+B+2]=s.z,L[z+B+3]=0),_===!0&&(s.fromBufferAttribute(F,H),L[z+B+4]=s.x,L[z+B+5]=s.y,L[z+B+6]=s.z,L[z+B+7]=0),p===!0&&(s.fromBufferAttribute(V,H),L[z+B+8]=s.x,L[z+B+9]=s.y,L[z+B+10]=s.z,L[z+B+11]=V.itemSize===4?s.w:1)}}d={count:u,texture:x,size:new j(w,T)},n.set(o,d),o.addEventListener("dispose",N)}if(a.isInstancedMesh===!0&&a.morphTexture!==null)l.getUniforms().setValue(i,"morphTexture",a.morphTexture,t);else{let g=0;for(let p=0;p<c.length;p++)g+=c[p];const _=o.morphTargetsRelative?1:1-g;l.getUniforms().setValue(i,"morphTargetBaseInfluence",_),l.getUniforms().setValue(i,"morphTargetInfluences",c)}l.getUniforms().setValue(i,"morphTargetsTexture",d.texture,t),l.getUniforms().setValue(i,"morphTargetsTextureSize",d.size)}return{update:r}}function qM(i,e,t,n,s){let r=new WeakMap;function a(c){const h=s.render.frame,u=c.geometry,d=e.get(c,u);if(r.get(d)!==h&&(e.update(d),r.set(d,h)),c.isInstancedMesh&&(c.hasEventListener("dispose",l)===!1&&c.addEventListener("dispose",l),r.get(c)!==h&&(t.update(c.instanceMatrix,i.ARRAY_BUFFER),c.instanceColor!==null&&t.update(c.instanceColor,i.ARRAY_BUFFER),r.set(c,h))),c.isSkinnedMesh){const f=c.skeleton;r.get(f)!==h&&(f.update(),r.set(f,h))}return d}function o(){r=new WeakMap}function l(c){const h=c.target;h.removeEventListener("dispose",l),n.releaseStatesOfObject(h),t.remove(h.instanceMatrix),h.instanceColor!==null&&t.remove(h.instanceColor)}return{update:a,dispose:o}}const jM={[Eh]:"LINEAR_TONE_MAPPING",[bh]:"REINHARD_TONE_MAPPING",[Th]:"CINEON_TONE_MAPPING",[Wo]:"ACES_FILMIC_TONE_MAPPING",[wh]:"AGX_TONE_MAPPING",[Ch]:"NEUTRAL_TONE_MAPPING",[Ah]:"CUSTOM_TONE_MAPPING"};function $M(i,e,t,n,s){const r=new nn(e,t,{type:i,depthBuffer:n,stencilBuffer:s}),a=new nn(e,t,{type:ln,depthBuffer:!1,stencilBuffer:!1}),o=new et;o.setAttribute("position",new ze([-1,3,0,-1,-1,0,3,-1,0],3)),o.setAttribute("uv",new ze([0,2,0,0,2,0],2));const l=new wp({uniforms:{tDiffuse:{value:null}},vertexShader:`
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
			}`,depthTest:!1,depthWrite:!1}),c=new st(o,l),h=new pa(-1,1,1,-1,0,1);let u=null,d=null,f=!1,g,_=null,p=[],m=!1;this.setSize=function(M,y){r.setSize(M,y),a.setSize(M,y);for(let S=0;S<p.length;S++){const w=p[S];w.setSize&&w.setSize(M,y)}},this.setEffects=function(M){p=M,m=p.length>0&&p[0].isRenderPass===!0;const y=r.width,S=r.height;for(let w=0;w<p.length;w++){const T=p[w];T.setSize&&T.setSize(y,S)}},this.begin=function(M,y){if(f||M.toneMapping===qn&&p.length===0)return!1;if(_=y,y!==null){const S=y.width,w=y.height;(r.width!==S||r.height!==w)&&this.setSize(S,w)}return m===!1&&M.setRenderTarget(r),g=M.toneMapping,M.toneMapping=qn,!0},this.hasRenderPass=function(){return m},this.end=function(M,y){M.toneMapping=g,f=!0;let S=r,w=a;for(let T=0;T<p.length;T++){const L=p[T];if(L.enabled!==!1&&(L.render(M,w,S,y),L.needsSwap!==!1)){const x=S;S=w,w=x}}if(u!==M.outputColorSpace||d!==M.toneMapping){u=M.outputColorSpace,d=M.toneMapping,l.defines={},Qe.getTransfer(u)===nt&&(l.defines.SRGB_TRANSFER="");const T=jM[d];T&&(l.defines[T]=""),l.needsUpdate=!0}l.uniforms.tDiffuse.value=S.texture,M.setRenderTarget(_),M.render(c,h),_=null,f=!1},this.isCompositing=function(){return f},this.dispose=function(){r.dispose(),a.dispose(),o.dispose(),l.dispose()}}const Up=new Ct,rh=new na(1,1),Op=new hp,Fp=new Jg,Bp=new gp,Fd=[],Bd=[],zd=new Float32Array(16),kd=new Float32Array(9),Hd=new Float32Array(4);function cr(i,e,t){const n=i[0];if(n<=0||n>0)return i;const s=e*t;let r=Fd[s];if(r===void 0&&(r=new Float32Array(s),Fd[s]=r),e!==0){n.toArray(r,0);for(let a=1,o=0;a!==e;++a)o+=t,i[a].toArray(r,o)}return r}function Pt(i,e){if(i.length!==e.length)return!1;for(let t=0,n=i.length;t<n;t++)if(i[t]!==e[t])return!1;return!0}function Lt(i,e){for(let t=0,n=e.length;t<n;t++)i[t]=e[t]}function $o(i,e){let t=Bd[e];t===void 0&&(t=new Int32Array(e),Bd[e]=t);for(let n=0;n!==e;++n)t[n]=i.allocateTextureUnit();return t}function JM(i,e){const t=this.cache;t[0]!==e&&(i.uniform1f(this.addr,e),t[0]=e)}function ZM(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2f(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Pt(t,e))return;i.uniform2fv(this.addr,e),Lt(t,e)}}function QM(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3f(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else if(e.r!==void 0)(t[0]!==e.r||t[1]!==e.g||t[2]!==e.b)&&(i.uniform3f(this.addr,e.r,e.g,e.b),t[0]=e.r,t[1]=e.g,t[2]=e.b);else{if(Pt(t,e))return;i.uniform3fv(this.addr,e),Lt(t,e)}}function ey(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4f(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Pt(t,e))return;i.uniform4fv(this.addr,e),Lt(t,e)}}function ty(i,e){const t=this.cache,n=e.elements;if(n===void 0){if(Pt(t,e))return;i.uniformMatrix2fv(this.addr,!1,e),Lt(t,e)}else{if(Pt(t,n))return;Hd.set(n),i.uniformMatrix2fv(this.addr,!1,Hd),Lt(t,n)}}function ny(i,e){const t=this.cache,n=e.elements;if(n===void 0){if(Pt(t,e))return;i.uniformMatrix3fv(this.addr,!1,e),Lt(t,e)}else{if(Pt(t,n))return;kd.set(n),i.uniformMatrix3fv(this.addr,!1,kd),Lt(t,n)}}function iy(i,e){const t=this.cache,n=e.elements;if(n===void 0){if(Pt(t,e))return;i.uniformMatrix4fv(this.addr,!1,e),Lt(t,e)}else{if(Pt(t,n))return;zd.set(n),i.uniformMatrix4fv(this.addr,!1,zd),Lt(t,n)}}function sy(i,e){const t=this.cache;t[0]!==e&&(i.uniform1i(this.addr,e),t[0]=e)}function ry(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2i(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Pt(t,e))return;i.uniform2iv(this.addr,e),Lt(t,e)}}function ay(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3i(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(Pt(t,e))return;i.uniform3iv(this.addr,e),Lt(t,e)}}function oy(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4i(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Pt(t,e))return;i.uniform4iv(this.addr,e),Lt(t,e)}}function ly(i,e){const t=this.cache;t[0]!==e&&(i.uniform1ui(this.addr,e),t[0]=e)}function cy(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2ui(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Pt(t,e))return;i.uniform2uiv(this.addr,e),Lt(t,e)}}function hy(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3ui(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(Pt(t,e))return;i.uniform3uiv(this.addr,e),Lt(t,e)}}function uy(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4ui(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Pt(t,e))return;i.uniform4uiv(this.addr,e),Lt(t,e)}}function dy(i,e,t){const n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s);let r;this.type===i.SAMPLER_2D_SHADOW?(rh.compareFunction=t.isReversedDepthBuffer()?Bh:Fh,r=rh):r=Up,t.setTexture2D(e||r,s)}function fy(i,e,t){const n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),t.setTexture3D(e||Fp,s)}function py(i,e,t){const n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),t.setTextureCube(e||Bp,s)}function my(i,e,t){const n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),t.setTexture2DArray(e||Op,s)}function gy(i){switch(i){case 5126:return JM;case 35664:return ZM;case 35665:return QM;case 35666:return ey;case 35674:return ty;case 35675:return ny;case 35676:return iy;case 5124:case 35670:return sy;case 35667:case 35671:return ry;case 35668:case 35672:return ay;case 35669:case 35673:return oy;case 5125:return ly;case 36294:return cy;case 36295:return hy;case 36296:return uy;case 35678:case 36198:case 36298:case 36306:case 35682:return dy;case 35679:case 36299:case 36307:return fy;case 35680:case 36300:case 36308:case 36293:return py;case 36289:case 36303:case 36311:case 36292:return my}}function _y(i,e){i.uniform1fv(this.addr,e)}function xy(i,e){const t=cr(e,this.size,2);i.uniform2fv(this.addr,t)}function vy(i,e){const t=cr(e,this.size,3);i.uniform3fv(this.addr,t)}function My(i,e){const t=cr(e,this.size,4);i.uniform4fv(this.addr,t)}function yy(i,e){const t=cr(e,this.size,4);i.uniformMatrix2fv(this.addr,!1,t)}function Sy(i,e){const t=cr(e,this.size,9);i.uniformMatrix3fv(this.addr,!1,t)}function Ey(i,e){const t=cr(e,this.size,16);i.uniformMatrix4fv(this.addr,!1,t)}function by(i,e){i.uniform1iv(this.addr,e)}function Ty(i,e){i.uniform2iv(this.addr,e)}function Ay(i,e){i.uniform3iv(this.addr,e)}function wy(i,e){i.uniform4iv(this.addr,e)}function Cy(i,e){i.uniform1uiv(this.addr,e)}function Ry(i,e){i.uniform2uiv(this.addr,e)}function Py(i,e){i.uniform3uiv(this.addr,e)}function Ly(i,e){i.uniform4uiv(this.addr,e)}function Dy(i,e,t){const n=this.cache,s=e.length,r=$o(t,s);Pt(n,r)||(i.uniform1iv(this.addr,r),Lt(n,r));let a;this.type===i.SAMPLER_2D_SHADOW?a=rh:a=Up;for(let o=0;o!==s;++o)t.setTexture2D(e[o]||a,r[o])}function Iy(i,e,t){const n=this.cache,s=e.length,r=$o(t,s);Pt(n,r)||(i.uniform1iv(this.addr,r),Lt(n,r));for(let a=0;a!==s;++a)t.setTexture3D(e[a]||Fp,r[a])}function Ny(i,e,t){const n=this.cache,s=e.length,r=$o(t,s);Pt(n,r)||(i.uniform1iv(this.addr,r),Lt(n,r));for(let a=0;a!==s;++a)t.setTextureCube(e[a]||Bp,r[a])}function Uy(i,e,t){const n=this.cache,s=e.length,r=$o(t,s);Pt(n,r)||(i.uniform1iv(this.addr,r),Lt(n,r));for(let a=0;a!==s;++a)t.setTexture2DArray(e[a]||Op,r[a])}function Oy(i){switch(i){case 5126:return _y;case 35664:return xy;case 35665:return vy;case 35666:return My;case 35674:return yy;case 35675:return Sy;case 35676:return Ey;case 5124:case 35670:return by;case 35667:case 35671:return Ty;case 35668:case 35672:return Ay;case 35669:case 35673:return wy;case 5125:return Cy;case 36294:return Ry;case 36295:return Py;case 36296:return Ly;case 35678:case 36198:case 36298:case 36306:case 35682:return Dy;case 35679:case 36299:case 36307:return Iy;case 35680:case 36300:case 36308:case 36293:return Ny;case 36289:case 36303:case 36311:case 36292:return Uy}}class Fy{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.setValue=gy(t.type)}}class By{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=Oy(t.type)}}class zy{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,n){const s=this.seq;for(let r=0,a=s.length;r!==a;++r){const o=s[r];o.setValue(e,t[o.id],n)}}}const Wl=/(\w+)(\])?(\[|\.)?/g;function Gd(i,e){i.seq.push(e),i.map[e.id]=e}function ky(i,e,t){const n=i.name,s=n.length;for(Wl.lastIndex=0;;){const r=Wl.exec(n),a=Wl.lastIndex;let o=r[1];const l=r[2]==="]",c=r[3];if(l&&(o=o|0),c===void 0||c==="["&&a+2===s){Gd(t,c===void 0?new Fy(o,i,e):new By(o,i,e));break}else{let u=t.map[o];u===void 0&&(u=new zy(o),Gd(t,u)),t=u}}}class yo{constructor(e,t){this.seq=[],this.map={};const n=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let a=0;a<n;++a){const o=e.getActiveUniform(t,a),l=e.getUniformLocation(t,o.name);ky(o,l,this)}const s=[],r=[];for(const a of this.seq)a.type===e.SAMPLER_2D_SHADOW||a.type===e.SAMPLER_CUBE_SHADOW||a.type===e.SAMPLER_2D_ARRAY_SHADOW?s.push(a):r.push(a);s.length>0&&(this.seq=s.concat(r))}setValue(e,t,n,s){const r=this.map[t];r!==void 0&&r.setValue(e,n,s)}setOptional(e,t,n){const s=t[n];s!==void 0&&this.setValue(e,n,s)}static upload(e,t,n,s){for(let r=0,a=t.length;r!==a;++r){const o=t[r],l=n[o.id];l.needsUpdate!==!1&&o.setValue(e,l.value,s)}}static seqWithValue(e,t){const n=[];for(let s=0,r=e.length;s!==r;++s){const a=e[s];a.id in t&&n.push(a)}return n}}function Vd(i,e,t){const n=i.createShader(e);return i.shaderSource(n,t),i.compileShader(n),n}const Hy=37297;let Gy=0;function Vy(i,e){const t=i.split(`
`),n=[],s=Math.max(e-6,0),r=Math.min(e+6,t.length);for(let a=s;a<r;a++){const o=a+1;n.push(`${o===e?">":" "} ${o}: ${t[a]}`)}return n.join(`
`)}const Wd=new Ye;function Wy(i){Qe._getMatrix(Wd,Qe.workingColorSpace,i);const e=`mat3( ${Wd.elements.map(t=>t.toFixed(4))} )`;switch(Qe.getTransfer(i)){case Io:return[e,"LinearTransferOETF"];case nt:return[e,"sRGBTransferOETF"];default:return Re("WebGLProgram: Unsupported color space: ",i),[e,"LinearTransferOETF"]}}function Xd(i,e,t){const n=i.getShaderParameter(e,i.COMPILE_STATUS),r=(i.getShaderInfoLog(e)||"").trim();if(n&&r==="")return"";const a=/ERROR: 0:(\d+)/.exec(r);if(a){const o=parseInt(a[1]);return t.toUpperCase()+`

`+r+`

`+Vy(i.getShaderSource(e),o)}else return r}function Xy(i,e){const t=Wy(e);return[`vec4 ${i}( vec4 value ) {`,`	return ${t[1]}( vec4( value.rgb * ${t[0]}, value.a ) );`,"}"].join(`
`)}const Ky={[Eh]:"Linear",[bh]:"Reinhard",[Th]:"Cineon",[Wo]:"ACESFilmic",[wh]:"AgX",[Ch]:"Neutral",[Ah]:"Custom"};function Yy(i,e){const t=Ky[e];return t===void 0?(Re("WebGLProgram: Unsupported toneMapping:",e),"vec3 "+i+"( vec3 color ) { return LinearToneMapping( color ); }"):"vec3 "+i+"( vec3 color ) { return "+t+"ToneMapping( color ); }"}const Za=new P;function qy(){Qe.getLuminanceCoefficients(Za);const i=Za.x.toFixed(4),e=Za.y.toFixed(4),t=Za.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${i}, ${e}, ${t} );`,"	return dot( weights, rgb );","}"].join(`
`)}function jy(i){return[i.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",i.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(Ir).join(`
`)}function $y(i){const e=[];for(const t in i){const n=i[t];n!==!1&&e.push("#define "+t+" "+n)}return e.join(`
`)}function Jy(i,e){const t={},n=i.getProgramParameter(e,i.ACTIVE_ATTRIBUTES);for(let s=0;s<n;s++){const r=i.getActiveAttrib(e,s),a=r.name;let o=1;r.type===i.FLOAT_MAT2&&(o=2),r.type===i.FLOAT_MAT3&&(o=3),r.type===i.FLOAT_MAT4&&(o=4),t[a]={type:r.type,location:i.getAttribLocation(e,a),locationSize:o}}return t}function Ir(i){return i!==""}function Kd(i,e){const t=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return i.replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,t).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function Yd(i,e){return i.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}const Zy=/^[ \t]*#include +<([\w\d./]+)>/gm;function ah(i){return i.replace(Zy,eS)}const Qy=new Map;function eS(i,e){let t=qe[e];if(t===void 0){const n=Qy.get(e);if(n!==void 0)t=qe[n],Re('WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,n);else throw new Error("Can not resolve #include <"+e+">")}return ah(t)}const tS=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function qd(i){return i.replace(tS,nS)}function nS(i,e,t,n){let s="";for(let r=parseInt(e);r<parseInt(t);r++)s+=n.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return s}function jd(i){let e=`precision ${i.precision} float;
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
#define LOW_PRECISION`),e}const iS={[mo]:"SHADOWMAP_TYPE_PCF",[Pr]:"SHADOWMAP_TYPE_VSM"};function sS(i){return iS[i.shadowMapType]||"SHADOWMAP_TYPE_BASIC"}const rS={[Yi]:"ENVMAP_TYPE_CUBE",[Vs]:"ENVMAP_TYPE_CUBE",[Xo]:"ENVMAP_TYPE_CUBE_UV"};function aS(i){return i.envMap===!1?"ENVMAP_TYPE_CUBE":rS[i.envMapMode]||"ENVMAP_TYPE_CUBE"}const oS={[Vs]:"ENVMAP_MODE_REFRACTION"};function lS(i){return i.envMap===!1?"ENVMAP_MODE_REFLECTION":oS[i.envMapMode]||"ENVMAP_MODE_REFLECTION"}const cS={[Sh]:"ENVMAP_BLENDING_MULTIPLY",[dg]:"ENVMAP_BLENDING_MIX",[fg]:"ENVMAP_BLENDING_ADD"};function hS(i){return i.envMap===!1?"ENVMAP_BLENDING_NONE":cS[i.combine]||"ENVMAP_BLENDING_NONE"}function uS(i){const e=i.envMapCubeUVHeight;if(e===null)return null;const t=Math.log2(e)-2,n=1/e;return{texelWidth:1/(3*Math.max(Math.pow(2,t),112)),texelHeight:n,maxMip:t}}function dS(i,e,t,n){const s=i.getContext(),r=t.defines;let a=t.vertexShader,o=t.fragmentShader;const l=sS(t),c=aS(t),h=lS(t),u=hS(t),d=uS(t),f=jy(t),g=$y(r),_=s.createProgram();let p,m,M=t.glslVersion?"#version "+t.glslVersion+`
`:"";t.isRawShaderMaterial?(p=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g].filter(Ir).join(`
`),p.length>0&&(p+=`
`),m=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g].filter(Ir).join(`
`),m.length>0&&(m+=`
`)):(p=[jd(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g,t.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",t.batching?"#define USE_BATCHING":"",t.batchingColor?"#define USE_BATCHING_COLOR":"",t.instancing?"#define USE_INSTANCING":"",t.instancingColor?"#define USE_INSTANCING_COLOR":"",t.instancingMorph?"#define USE_INSTANCING_MORPH":"",t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+h:"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.displacementMap?"#define USE_DISPLACEMENTMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.mapUv?"#define MAP_UV "+t.mapUv:"",t.alphaMapUv?"#define ALPHAMAP_UV "+t.alphaMapUv:"",t.lightMapUv?"#define LIGHTMAP_UV "+t.lightMapUv:"",t.aoMapUv?"#define AOMAP_UV "+t.aoMapUv:"",t.emissiveMapUv?"#define EMISSIVEMAP_UV "+t.emissiveMapUv:"",t.bumpMapUv?"#define BUMPMAP_UV "+t.bumpMapUv:"",t.normalMapUv?"#define NORMALMAP_UV "+t.normalMapUv:"",t.displacementMapUv?"#define DISPLACEMENTMAP_UV "+t.displacementMapUv:"",t.metalnessMapUv?"#define METALNESSMAP_UV "+t.metalnessMapUv:"",t.roughnessMapUv?"#define ROUGHNESSMAP_UV "+t.roughnessMapUv:"",t.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+t.anisotropyMapUv:"",t.clearcoatMapUv?"#define CLEARCOATMAP_UV "+t.clearcoatMapUv:"",t.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+t.clearcoatNormalMapUv:"",t.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+t.clearcoatRoughnessMapUv:"",t.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+t.iridescenceMapUv:"",t.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+t.iridescenceThicknessMapUv:"",t.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+t.sheenColorMapUv:"",t.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+t.sheenRoughnessMapUv:"",t.specularMapUv?"#define SPECULARMAP_UV "+t.specularMapUv:"",t.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+t.specularColorMapUv:"",t.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+t.specularIntensityMapUv:"",t.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+t.transmissionMapUv:"",t.thicknessMapUv?"#define THICKNESSMAP_UV "+t.thicknessMapUv:"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.flatShading?"#define FLAT_SHADED":"",t.skinning?"#define USE_SKINNING":"",t.morphTargets?"#define USE_MORPHTARGETS":"",t.morphNormals&&t.flatShading===!1?"#define USE_MORPHNORMALS":"",t.morphColors?"#define USE_MORPHCOLORS":"",t.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+t.morphTextureStride:"",t.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+t.morphTargetsCount:"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.sizeAttenuation?"#define USE_SIZEATTENUATION":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(Ir).join(`
`),m=[jd(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g,t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",t.map?"#define USE_MAP":"",t.matcap?"#define USE_MATCAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+c:"",t.envMap?"#define "+h:"",t.envMap?"#define "+u:"",d?"#define CUBEUV_TEXEL_WIDTH "+d.texelWidth:"",d?"#define CUBEUV_TEXEL_HEIGHT "+d.texelHeight:"",d?"#define CUBEUV_MAX_MIP "+d.maxMip+".0":"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoat?"#define USE_CLEARCOAT":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.dispersion?"#define USE_DISPERSION":"",t.iridescence?"#define USE_IRIDESCENCE":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaTest?"#define USE_ALPHATEST":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.sheen?"#define USE_SHEEN":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors||t.instancingColor?"#define USE_COLOR":"",t.vertexAlphas||t.batchingColor?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.gradientMap?"#define USE_GRADIENTMAP":"",t.flatShading?"#define FLAT_SHADED":"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",t.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",t.toneMapping!==qn?"#define TONE_MAPPING":"",t.toneMapping!==qn?qe.tonemapping_pars_fragment:"",t.toneMapping!==qn?Yy("toneMapping",t.toneMapping):"",t.dithering?"#define DITHERING":"",t.opaque?"#define OPAQUE":"",qe.colorspace_pars_fragment,Xy("linearToOutputTexel",t.outputColorSpace),qy(),t.useDepthPacking?"#define DEPTH_PACKING "+t.depthPacking:"",`
`].filter(Ir).join(`
`)),a=ah(a),a=Kd(a,t),a=Yd(a,t),o=ah(o),o=Kd(o,t),o=Yd(o,t),a=qd(a),o=qd(o),t.isRawShaderMaterial!==!0&&(M=`#version 300 es
`,p=[f,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+p,m=["#define varying in",t.glslVersion===Uu?"":"layout(location = 0) out highp vec4 pc_fragColor;",t.glslVersion===Uu?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+m);const y=M+p+a,S=M+m+o,w=Vd(s,s.VERTEX_SHADER,y),T=Vd(s,s.FRAGMENT_SHADER,S);s.attachShader(_,w),s.attachShader(_,T),t.index0AttributeName!==void 0?s.bindAttribLocation(_,0,t.index0AttributeName):t.morphTargets===!0&&s.bindAttribLocation(_,0,"position"),s.linkProgram(_);function L(C){if(i.debug.checkShaderErrors){const O=s.getProgramInfoLog(_)||"",F=s.getShaderInfoLog(w)||"",V=s.getShaderInfoLog(T)||"",z=O.trim(),H=F.trim(),B=V.trim();let ie=!0,Q=!0;if(s.getProgramParameter(_,s.LINK_STATUS)===!1)if(ie=!1,typeof i.debug.onShaderError=="function")i.debug.onShaderError(s,_,w,T);else{const me=Xd(s,w,"vertex"),_e=Xd(s,T,"fragment");Be("THREE.WebGLProgram: Shader Error "+s.getError()+" - VALIDATE_STATUS "+s.getProgramParameter(_,s.VALIDATE_STATUS)+`

Material Name: `+C.name+`
Material Type: `+C.type+`

Program Info Log: `+z+`
`+me+`
`+_e)}else z!==""?Re("WebGLProgram: Program Info Log:",z):(H===""||B==="")&&(Q=!1);Q&&(C.diagnostics={runnable:ie,programLog:z,vertexShader:{log:H,prefix:p},fragmentShader:{log:B,prefix:m}})}s.deleteShader(w),s.deleteShader(T),x=new yo(s,_),E=Jy(s,_)}let x;this.getUniforms=function(){return x===void 0&&L(this),x};let E;this.getAttributes=function(){return E===void 0&&L(this),E};let N=t.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return N===!1&&(N=s.getProgramParameter(_,Hy)),N},this.destroy=function(){n.releaseStatesOfProgram(this),s.deleteProgram(_),this.program=void 0},this.type=t.shaderType,this.name=t.shaderName,this.id=Gy++,this.cacheKey=e,this.usedTimes=1,this.program=_,this.vertexShader=w,this.fragmentShader=T,this}let fS=0;class pS{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e){const t=e.vertexShader,n=e.fragmentShader,s=this._getShaderStage(t),r=this._getShaderStage(n),a=this._getShaderCacheForMaterial(e);return a.has(s)===!1&&(a.add(s),s.usedTimes++),a.has(r)===!1&&(a.add(r),r.usedTimes++),this}remove(e){const t=this.materialCache.get(e);for(const n of t)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(e),this}getVertexShaderID(e){return this._getShaderStage(e.vertexShader).id}getFragmentShaderID(e){return this._getShaderStage(e.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){const t=this.materialCache;let n=t.get(e);return n===void 0&&(n=new Set,t.set(e,n)),n}_getShaderStage(e){const t=this.shaderCache;let n=t.get(e);return n===void 0&&(n=new mS(e),t.set(e,n)),n}}class mS{constructor(e){this.id=fS++,this.code=e,this.usedTimes=0}}function gS(i,e,t,n,s,r){const a=new Gh,o=new pS,l=new Set,c=[],h=new Map,u=n.logarithmicDepthBuffer;let d=n.precision;const f={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distance",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function g(x){return l.add(x),x===0?"uv":`uv${x}`}function _(x,E,N,C,O){const F=C.fog,V=O.geometry,z=x.isMeshStandardMaterial||x.isMeshLambertMaterial||x.isMeshPhongMaterial?C.environment:null,H=x.isMeshStandardMaterial||x.isMeshLambertMaterial&&!x.envMap||x.isMeshPhongMaterial&&!x.envMap,B=e.get(x.envMap||z,H),ie=B&&B.mapping===Xo?B.image.height:null,Q=f[x.type];x.precision!==null&&(d=n.getMaxPrecision(x.precision),d!==x.precision&&Re("WebGLProgram.getParameters:",x.precision,"not supported, using",d,"instead."));const me=V.morphAttributes.position||V.morphAttributes.normal||V.morphAttributes.color,_e=me!==void 0?me.length:0;let ge=0;V.morphAttributes.position!==void 0&&(ge=1),V.morphAttributes.normal!==void 0&&(ge=2),V.morphAttributes.color!==void 0&&(ge=3);let ke,rt,ct,q;if(Q){const at=tn[Q];ke=at.vertexShader,rt=at.fragmentShader}else ke=x.vertexShader,rt=x.fragmentShader,o.update(x),ct=o.getVertexShaderID(x),q=o.getFragmentShaderID(x);const ae=i.getRenderTarget(),oe=i.state.buffers.depth.getReversed(),Ue=O.isInstancedMesh===!0,Ie=O.isBatchedMesh===!0,He=!!x.map,ht=!!x.matcap,Xe=!!B,J=!!x.aoMap,te=!!x.lightMap,Z=!!x.bumpMap,de=!!x.normalMap,R=!!x.displacementMap,Ne=!!x.emissiveMap,xe=!!x.metalnessMap,Oe=!!x.roughnessMap,le=x.anisotropy>0,A=x.clearcoat>0,v=x.dispersion>0,I=x.iridescence>0,X=x.sheen>0,$=x.transmission>0,K=le&&!!x.anisotropyMap,Ee=A&&!!x.clearcoatMap,ce=A&&!!x.clearcoatNormalMap,Le=A&&!!x.clearcoatRoughnessMap,Fe=I&&!!x.iridescenceMap,ee=I&&!!x.iridescenceThicknessMap,se=X&&!!x.sheenColorMap,be=X&&!!x.sheenRoughnessMap,Ae=!!x.specularMap,ve=!!x.specularColorMap,je=!!x.specularIntensityMap,D=$&&!!x.transmissionMap,he=$&&!!x.thicknessMap,re=!!x.gradientMap,Se=!!x.alphaMap,ne=x.alphaTest>0,Y=!!x.alphaHash,Te=!!x.extensions;let Ve=qn;x.toneMapped&&(ae===null||ae.isXRRenderTarget===!0)&&(Ve=i.toneMapping);const gt={shaderID:Q,shaderType:x.type,shaderName:x.name,vertexShader:ke,fragmentShader:rt,defines:x.defines,customVertexShaderID:ct,customFragmentShaderID:q,isRawShaderMaterial:x.isRawShaderMaterial===!0,glslVersion:x.glslVersion,precision:d,batching:Ie,batchingColor:Ie&&O._colorsTexture!==null,instancing:Ue,instancingColor:Ue&&O.instanceColor!==null,instancingMorph:Ue&&O.morphTexture!==null,outputColorSpace:ae===null?i.outputColorSpace:ae.isXRRenderTarget===!0?ae.texture.colorSpace:Zt,alphaToCoverage:!!x.alphaToCoverage,map:He,matcap:ht,envMap:Xe,envMapMode:Xe&&B.mapping,envMapCubeUVHeight:ie,aoMap:J,lightMap:te,bumpMap:Z,normalMap:de,displacementMap:R,emissiveMap:Ne,normalMapObjectSpace:de&&x.normalMapType===xg,normalMapTangentSpace:de&&x.normalMapType===Oh,metalnessMap:xe,roughnessMap:Oe,anisotropy:le,anisotropyMap:K,clearcoat:A,clearcoatMap:Ee,clearcoatNormalMap:ce,clearcoatRoughnessMap:Le,dispersion:v,iridescence:I,iridescenceMap:Fe,iridescenceThicknessMap:ee,sheen:X,sheenColorMap:se,sheenRoughnessMap:be,specularMap:Ae,specularColorMap:ve,specularIntensityMap:je,transmission:$,transmissionMap:D,thicknessMap:he,gradientMap:re,opaque:x.transparent===!1&&x.blending===Os&&x.alphaToCoverage===!1,alphaMap:Se,alphaTest:ne,alphaHash:Y,combine:x.combine,mapUv:He&&g(x.map.channel),aoMapUv:J&&g(x.aoMap.channel),lightMapUv:te&&g(x.lightMap.channel),bumpMapUv:Z&&g(x.bumpMap.channel),normalMapUv:de&&g(x.normalMap.channel),displacementMapUv:R&&g(x.displacementMap.channel),emissiveMapUv:Ne&&g(x.emissiveMap.channel),metalnessMapUv:xe&&g(x.metalnessMap.channel),roughnessMapUv:Oe&&g(x.roughnessMap.channel),anisotropyMapUv:K&&g(x.anisotropyMap.channel),clearcoatMapUv:Ee&&g(x.clearcoatMap.channel),clearcoatNormalMapUv:ce&&g(x.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:Le&&g(x.clearcoatRoughnessMap.channel),iridescenceMapUv:Fe&&g(x.iridescenceMap.channel),iridescenceThicknessMapUv:ee&&g(x.iridescenceThicknessMap.channel),sheenColorMapUv:se&&g(x.sheenColorMap.channel),sheenRoughnessMapUv:be&&g(x.sheenRoughnessMap.channel),specularMapUv:Ae&&g(x.specularMap.channel),specularColorMapUv:ve&&g(x.specularColorMap.channel),specularIntensityMapUv:je&&g(x.specularIntensityMap.channel),transmissionMapUv:D&&g(x.transmissionMap.channel),thicknessMapUv:he&&g(x.thicknessMap.channel),alphaMapUv:Se&&g(x.alphaMap.channel),vertexTangents:!!V.attributes.tangent&&(de||le),vertexColors:x.vertexColors,vertexAlphas:x.vertexColors===!0&&!!V.attributes.color&&V.attributes.color.itemSize===4,pointsUvs:O.isPoints===!0&&!!V.attributes.uv&&(He||Se),fog:!!F,useFog:x.fog===!0,fogExp2:!!F&&F.isFogExp2,flatShading:x.wireframe===!1&&(x.flatShading===!0||V.attributes.normal===void 0&&de===!1&&(x.isMeshLambertMaterial||x.isMeshPhongMaterial||x.isMeshStandardMaterial||x.isMeshPhysicalMaterial)),sizeAttenuation:x.sizeAttenuation===!0,logarithmicDepthBuffer:u,reversedDepthBuffer:oe,skinning:O.isSkinnedMesh===!0,morphTargets:V.morphAttributes.position!==void 0,morphNormals:V.morphAttributes.normal!==void 0,morphColors:V.morphAttributes.color!==void 0,morphTargetsCount:_e,morphTextureStride:ge,numDirLights:E.directional.length,numPointLights:E.point.length,numSpotLights:E.spot.length,numSpotLightMaps:E.spotLightMap.length,numRectAreaLights:E.rectArea.length,numHemiLights:E.hemi.length,numDirLightShadows:E.directionalShadowMap.length,numPointLightShadows:E.pointShadowMap.length,numSpotLightShadows:E.spotShadowMap.length,numSpotLightShadowsWithMaps:E.numSpotLightShadowsWithMaps,numLightProbes:E.numLightProbes,numClippingPlanes:r.numPlanes,numClipIntersection:r.numIntersection,dithering:x.dithering,shadowMapEnabled:i.shadowMap.enabled&&N.length>0,shadowMapType:i.shadowMap.type,toneMapping:Ve,decodeVideoTexture:He&&x.map.isVideoTexture===!0&&Qe.getTransfer(x.map.colorSpace)===nt,decodeVideoTextureEmissive:Ne&&x.emissiveMap.isVideoTexture===!0&&Qe.getTransfer(x.emissiveMap.colorSpace)===nt,premultipliedAlpha:x.premultipliedAlpha,doubleSided:x.side===At,flipSided:x.side===Jt,useDepthPacking:x.depthPacking>=0,depthPacking:x.depthPacking||0,index0AttributeName:x.index0AttributeName,extensionClipCullDistance:Te&&x.extensions.clipCullDistance===!0&&t.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(Te&&x.extensions.multiDraw===!0||Ie)&&t.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:t.has("KHR_parallel_shader_compile"),customProgramCacheKey:x.customProgramCacheKey()};return gt.vertexUv1s=l.has(1),gt.vertexUv2s=l.has(2),gt.vertexUv3s=l.has(3),l.clear(),gt}function p(x){const E=[];if(x.shaderID?E.push(x.shaderID):(E.push(x.customVertexShaderID),E.push(x.customFragmentShaderID)),x.defines!==void 0)for(const N in x.defines)E.push(N),E.push(x.defines[N]);return x.isRawShaderMaterial===!1&&(m(E,x),M(E,x),E.push(i.outputColorSpace)),E.push(x.customProgramCacheKey),E.join()}function m(x,E){x.push(E.precision),x.push(E.outputColorSpace),x.push(E.envMapMode),x.push(E.envMapCubeUVHeight),x.push(E.mapUv),x.push(E.alphaMapUv),x.push(E.lightMapUv),x.push(E.aoMapUv),x.push(E.bumpMapUv),x.push(E.normalMapUv),x.push(E.displacementMapUv),x.push(E.emissiveMapUv),x.push(E.metalnessMapUv),x.push(E.roughnessMapUv),x.push(E.anisotropyMapUv),x.push(E.clearcoatMapUv),x.push(E.clearcoatNormalMapUv),x.push(E.clearcoatRoughnessMapUv),x.push(E.iridescenceMapUv),x.push(E.iridescenceThicknessMapUv),x.push(E.sheenColorMapUv),x.push(E.sheenRoughnessMapUv),x.push(E.specularMapUv),x.push(E.specularColorMapUv),x.push(E.specularIntensityMapUv),x.push(E.transmissionMapUv),x.push(E.thicknessMapUv),x.push(E.combine),x.push(E.fogExp2),x.push(E.sizeAttenuation),x.push(E.morphTargetsCount),x.push(E.morphAttributeCount),x.push(E.numDirLights),x.push(E.numPointLights),x.push(E.numSpotLights),x.push(E.numSpotLightMaps),x.push(E.numHemiLights),x.push(E.numRectAreaLights),x.push(E.numDirLightShadows),x.push(E.numPointLightShadows),x.push(E.numSpotLightShadows),x.push(E.numSpotLightShadowsWithMaps),x.push(E.numLightProbes),x.push(E.shadowMapType),x.push(E.toneMapping),x.push(E.numClippingPlanes),x.push(E.numClipIntersection),x.push(E.depthPacking)}function M(x,E){a.disableAll(),E.instancing&&a.enable(0),E.instancingColor&&a.enable(1),E.instancingMorph&&a.enable(2),E.matcap&&a.enable(3),E.envMap&&a.enable(4),E.normalMapObjectSpace&&a.enable(5),E.normalMapTangentSpace&&a.enable(6),E.clearcoat&&a.enable(7),E.iridescence&&a.enable(8),E.alphaTest&&a.enable(9),E.vertexColors&&a.enable(10),E.vertexAlphas&&a.enable(11),E.vertexUv1s&&a.enable(12),E.vertexUv2s&&a.enable(13),E.vertexUv3s&&a.enable(14),E.vertexTangents&&a.enable(15),E.anisotropy&&a.enable(16),E.alphaHash&&a.enable(17),E.batching&&a.enable(18),E.dispersion&&a.enable(19),E.batchingColor&&a.enable(20),E.gradientMap&&a.enable(21),x.push(a.mask),a.disableAll(),E.fog&&a.enable(0),E.useFog&&a.enable(1),E.flatShading&&a.enable(2),E.logarithmicDepthBuffer&&a.enable(3),E.reversedDepthBuffer&&a.enable(4),E.skinning&&a.enable(5),E.morphTargets&&a.enable(6),E.morphNormals&&a.enable(7),E.morphColors&&a.enable(8),E.premultipliedAlpha&&a.enable(9),E.shadowMapEnabled&&a.enable(10),E.doubleSided&&a.enable(11),E.flipSided&&a.enable(12),E.useDepthPacking&&a.enable(13),E.dithering&&a.enable(14),E.transmission&&a.enable(15),E.sheen&&a.enable(16),E.opaque&&a.enable(17),E.pointsUvs&&a.enable(18),E.decodeVideoTexture&&a.enable(19),E.decodeVideoTextureEmissive&&a.enable(20),E.alphaToCoverage&&a.enable(21),x.push(a.mask)}function y(x){const E=f[x.type];let N;if(E){const C=tn[E];N=$i.clone(C.uniforms)}else N=x.uniforms;return N}function S(x,E){let N=h.get(E);return N!==void 0?++N.usedTimes:(N=new dS(i,E,x,s),c.push(N),h.set(E,N)),N}function w(x){if(--x.usedTimes===0){const E=c.indexOf(x);c[E]=c[c.length-1],c.pop(),h.delete(x.cacheKey),x.destroy()}}function T(x){o.remove(x)}function L(){o.dispose()}return{getParameters:_,getProgramCacheKey:p,getUniforms:y,acquireProgram:S,releaseProgram:w,releaseShaderCache:T,programs:c,dispose:L}}function _S(){let i=new WeakMap;function e(a){return i.has(a)}function t(a){let o=i.get(a);return o===void 0&&(o={},i.set(a,o)),o}function n(a){i.delete(a)}function s(a,o,l){i.get(a)[o]=l}function r(){i=new WeakMap}return{has:e,get:t,remove:n,update:s,dispose:r}}function xS(i,e){return i.groupOrder!==e.groupOrder?i.groupOrder-e.groupOrder:i.renderOrder!==e.renderOrder?i.renderOrder-e.renderOrder:i.material.id!==e.material.id?i.material.id-e.material.id:i.materialVariant!==e.materialVariant?i.materialVariant-e.materialVariant:i.z!==e.z?i.z-e.z:i.id-e.id}function $d(i,e){return i.groupOrder!==e.groupOrder?i.groupOrder-e.groupOrder:i.renderOrder!==e.renderOrder?i.renderOrder-e.renderOrder:i.z!==e.z?e.z-i.z:i.id-e.id}function Jd(){const i=[];let e=0;const t=[],n=[],s=[];function r(){e=0,t.length=0,n.length=0,s.length=0}function a(d){let f=0;return d.isInstancedMesh&&(f+=2),d.isSkinnedMesh&&(f+=1),f}function o(d,f,g,_,p,m){let M=i[e];return M===void 0?(M={id:d.id,object:d,geometry:f,material:g,materialVariant:a(d),groupOrder:_,renderOrder:d.renderOrder,z:p,group:m},i[e]=M):(M.id=d.id,M.object=d,M.geometry=f,M.material=g,M.materialVariant=a(d),M.groupOrder=_,M.renderOrder=d.renderOrder,M.z=p,M.group=m),e++,M}function l(d,f,g,_,p,m){const M=o(d,f,g,_,p,m);g.transmission>0?n.push(M):g.transparent===!0?s.push(M):t.push(M)}function c(d,f,g,_,p,m){const M=o(d,f,g,_,p,m);g.transmission>0?n.unshift(M):g.transparent===!0?s.unshift(M):t.unshift(M)}function h(d,f){t.length>1&&t.sort(d||xS),n.length>1&&n.sort(f||$d),s.length>1&&s.sort(f||$d)}function u(){for(let d=e,f=i.length;d<f;d++){const g=i[d];if(g.id===null)break;g.id=null,g.object=null,g.geometry=null,g.material=null,g.group=null}}return{opaque:t,transmissive:n,transparent:s,init:r,push:l,unshift:c,finish:u,sort:h}}function vS(){let i=new WeakMap;function e(n,s){const r=i.get(n);let a;return r===void 0?(a=new Jd,i.set(n,[a])):s>=r.length?(a=new Jd,r.push(a)):a=r[s],a}function t(){i=new WeakMap}return{get:e,dispose:t}}function MS(){const i={};return{get:function(e){if(i[e.id]!==void 0)return i[e.id];let t;switch(e.type){case"DirectionalLight":t={direction:new P,color:new Me};break;case"SpotLight":t={position:new P,direction:new P,color:new Me,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":t={position:new P,color:new Me,distance:0,decay:0};break;case"HemisphereLight":t={direction:new P,skyColor:new Me,groundColor:new Me};break;case"RectAreaLight":t={color:new Me,position:new P,halfWidth:new P,halfHeight:new P};break}return i[e.id]=t,t}}}function yS(){const i={};return{get:function(e){if(i[e.id]!==void 0)return i[e.id];let t;switch(e.type){case"DirectionalLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new j};break;case"SpotLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new j};break;case"PointLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new j,shadowCameraNear:1,shadowCameraFar:1e3};break}return i[e.id]=t,t}}}let SS=0;function ES(i,e){return(e.castShadow?2:0)-(i.castShadow?2:0)+(e.map?1:0)-(i.map?1:0)}function bS(i){const e=new MS,t=yS(),n={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let c=0;c<9;c++)n.probe.push(new P);const s=new P,r=new We,a=new We;function o(c){let h=0,u=0,d=0;for(let E=0;E<9;E++)n.probe[E].set(0,0,0);let f=0,g=0,_=0,p=0,m=0,M=0,y=0,S=0,w=0,T=0,L=0;c.sort(ES);for(let E=0,N=c.length;E<N;E++){const C=c[E],O=C.color,F=C.intensity,V=C.distance;let z=null;if(C.shadow&&C.shadow.map&&(C.shadow.map.texture.format===Xs?z=C.shadow.map.texture:z=C.shadow.map.depthTexture||C.shadow.map.texture),C.isAmbientLight)h+=O.r*F,u+=O.g*F,d+=O.b*F;else if(C.isLightProbe){for(let H=0;H<9;H++)n.probe[H].addScaledVector(C.sh.coefficients[H],F);L++}else if(C.isDirectionalLight){const H=e.get(C);if(H.color.copy(C.color).multiplyScalar(C.intensity),C.castShadow){const B=C.shadow,ie=t.get(C);ie.shadowIntensity=B.intensity,ie.shadowBias=B.bias,ie.shadowNormalBias=B.normalBias,ie.shadowRadius=B.radius,ie.shadowMapSize=B.mapSize,n.directionalShadow[f]=ie,n.directionalShadowMap[f]=z,n.directionalShadowMatrix[f]=C.shadow.matrix,M++}n.directional[f]=H,f++}else if(C.isSpotLight){const H=e.get(C);H.position.setFromMatrixPosition(C.matrixWorld),H.color.copy(O).multiplyScalar(F),H.distance=V,H.coneCos=Math.cos(C.angle),H.penumbraCos=Math.cos(C.angle*(1-C.penumbra)),H.decay=C.decay,n.spot[_]=H;const B=C.shadow;if(C.map&&(n.spotLightMap[w]=C.map,w++,B.updateMatrices(C),C.castShadow&&T++),n.spotLightMatrix[_]=B.matrix,C.castShadow){const ie=t.get(C);ie.shadowIntensity=B.intensity,ie.shadowBias=B.bias,ie.shadowNormalBias=B.normalBias,ie.shadowRadius=B.radius,ie.shadowMapSize=B.mapSize,n.spotShadow[_]=ie,n.spotShadowMap[_]=z,S++}_++}else if(C.isRectAreaLight){const H=e.get(C);H.color.copy(O).multiplyScalar(F),H.halfWidth.set(C.width*.5,0,0),H.halfHeight.set(0,C.height*.5,0),n.rectArea[p]=H,p++}else if(C.isPointLight){const H=e.get(C);if(H.color.copy(C.color).multiplyScalar(C.intensity),H.distance=C.distance,H.decay=C.decay,C.castShadow){const B=C.shadow,ie=t.get(C);ie.shadowIntensity=B.intensity,ie.shadowBias=B.bias,ie.shadowNormalBias=B.normalBias,ie.shadowRadius=B.radius,ie.shadowMapSize=B.mapSize,ie.shadowCameraNear=B.camera.near,ie.shadowCameraFar=B.camera.far,n.pointShadow[g]=ie,n.pointShadowMap[g]=z,n.pointShadowMatrix[g]=C.shadow.matrix,y++}n.point[g]=H,g++}else if(C.isHemisphereLight){const H=e.get(C);H.skyColor.copy(C.color).multiplyScalar(F),H.groundColor.copy(C.groundColor).multiplyScalar(F),n.hemi[m]=H,m++}}p>0&&(i.has("OES_texture_float_linear")===!0?(n.rectAreaLTC1=ue.LTC_FLOAT_1,n.rectAreaLTC2=ue.LTC_FLOAT_2):(n.rectAreaLTC1=ue.LTC_HALF_1,n.rectAreaLTC2=ue.LTC_HALF_2)),n.ambient[0]=h,n.ambient[1]=u,n.ambient[2]=d;const x=n.hash;(x.directionalLength!==f||x.pointLength!==g||x.spotLength!==_||x.rectAreaLength!==p||x.hemiLength!==m||x.numDirectionalShadows!==M||x.numPointShadows!==y||x.numSpotShadows!==S||x.numSpotMaps!==w||x.numLightProbes!==L)&&(n.directional.length=f,n.spot.length=_,n.rectArea.length=p,n.point.length=g,n.hemi.length=m,n.directionalShadow.length=M,n.directionalShadowMap.length=M,n.pointShadow.length=y,n.pointShadowMap.length=y,n.spotShadow.length=S,n.spotShadowMap.length=S,n.directionalShadowMatrix.length=M,n.pointShadowMatrix.length=y,n.spotLightMatrix.length=S+w-T,n.spotLightMap.length=w,n.numSpotLightShadowsWithMaps=T,n.numLightProbes=L,x.directionalLength=f,x.pointLength=g,x.spotLength=_,x.rectAreaLength=p,x.hemiLength=m,x.numDirectionalShadows=M,x.numPointShadows=y,x.numSpotShadows=S,x.numSpotMaps=w,x.numLightProbes=L,n.version=SS++)}function l(c,h){let u=0,d=0,f=0,g=0,_=0;const p=h.matrixWorldInverse;for(let m=0,M=c.length;m<M;m++){const y=c[m];if(y.isDirectionalLight){const S=n.directional[u];S.direction.setFromMatrixPosition(y.matrixWorld),s.setFromMatrixPosition(y.target.matrixWorld),S.direction.sub(s),S.direction.transformDirection(p),u++}else if(y.isSpotLight){const S=n.spot[f];S.position.setFromMatrixPosition(y.matrixWorld),S.position.applyMatrix4(p),S.direction.setFromMatrixPosition(y.matrixWorld),s.setFromMatrixPosition(y.target.matrixWorld),S.direction.sub(s),S.direction.transformDirection(p),f++}else if(y.isRectAreaLight){const S=n.rectArea[g];S.position.setFromMatrixPosition(y.matrixWorld),S.position.applyMatrix4(p),a.identity(),r.copy(y.matrixWorld),r.premultiply(p),a.extractRotation(r),S.halfWidth.set(y.width*.5,0,0),S.halfHeight.set(0,y.height*.5,0),S.halfWidth.applyMatrix4(a),S.halfHeight.applyMatrix4(a),g++}else if(y.isPointLight){const S=n.point[d];S.position.setFromMatrixPosition(y.matrixWorld),S.position.applyMatrix4(p),d++}else if(y.isHemisphereLight){const S=n.hemi[_];S.direction.setFromMatrixPosition(y.matrixWorld),S.direction.transformDirection(p),_++}}}return{setup:o,setupView:l,state:n}}function Zd(i){const e=new bS(i),t=[],n=[];function s(h){c.camera=h,t.length=0,n.length=0}function r(h){t.push(h)}function a(h){n.push(h)}function o(){e.setup(t)}function l(h){e.setupView(t,h)}const c={lightsArray:t,shadowsArray:n,camera:null,lights:e,transmissionRenderTarget:{}};return{init:s,state:c,setupLights:o,setupLightsView:l,pushLight:r,pushShadow:a}}function TS(i){let e=new WeakMap;function t(s,r=0){const a=e.get(s);let o;return a===void 0?(o=new Zd(i),e.set(s,[o])):r>=a.length?(o=new Zd(i),a.push(o)):o=a[r],o}function n(){e=new WeakMap}return{get:t,dispose:n}}const AS=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,wS=`uniform sampler2D shadow_pass;
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
}`,CS=[new P(1,0,0),new P(-1,0,0),new P(0,1,0),new P(0,-1,0),new P(0,0,1),new P(0,0,-1)],RS=[new P(0,-1,0),new P(0,-1,0),new P(0,0,1),new P(0,0,-1),new P(0,-1,0),new P(0,-1,0)],Qd=new We,Tr=new P,Xl=new P;function PS(i,e,t){let n=new Kh;const s=new j,r=new j,a=new it,o=new a_,l=new o_,c={},h=t.maxTextureSize,u={[di]:Jt,[Jt]:di,[At]:At},d=new Gt({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new j},radius:{value:4}},vertexShader:AS,fragmentShader:wS}),f=d.clone();f.defines.HORIZONTAL_PASS=1;const g=new et;g.setAttribute("position",new Yt(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const _=new st(g,d),p=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=mo;let m=this.type;this.render=function(T,L,x){if(p.enabled===!1||p.autoUpdate===!1&&p.needsUpdate===!1||T.length===0)return;this.type===Ym&&(Re("WebGLShadowMap: PCFSoftShadowMap has been deprecated. Using PCFShadowMap instead."),this.type=mo);const E=i.getRenderTarget(),N=i.getActiveCubeFace(),C=i.getActiveMipmapLevel(),O=i.state;O.setBlending(Yn),O.buffers.depth.getReversed()===!0?O.buffers.color.setClear(0,0,0,0):O.buffers.color.setClear(1,1,1,1),O.buffers.depth.setTest(!0),O.setScissorTest(!1);const F=m!==this.type;F&&L.traverse(function(V){V.material&&(Array.isArray(V.material)?V.material.forEach(z=>z.needsUpdate=!0):V.material.needsUpdate=!0)});for(let V=0,z=T.length;V<z;V++){const H=T[V],B=H.shadow;if(B===void 0){Re("WebGLShadowMap:",H,"has no shadow.");continue}if(B.autoUpdate===!1&&B.needsUpdate===!1)continue;s.copy(B.mapSize);const ie=B.getFrameExtents();s.multiply(ie),r.copy(B.mapSize),(s.x>h||s.y>h)&&(s.x>h&&(r.x=Math.floor(h/ie.x),s.x=r.x*ie.x,B.mapSize.x=r.x),s.y>h&&(r.y=Math.floor(h/ie.y),s.y=r.y*ie.y,B.mapSize.y=r.y));const Q=i.state.buffers.depth.getReversed();if(B.camera._reversedDepth=Q,B.map===null||F===!0){if(B.map!==null&&(B.map.depthTexture!==null&&(B.map.depthTexture.dispose(),B.map.depthTexture=null),B.map.dispose()),this.type===Pr){if(H.isPointLight){Re("WebGLShadowMap: VSM shadow maps are not supported for PointLights. Use PCF or BasicShadowMap instead.");continue}B.map=new nn(s.x,s.y,{format:Xs,type:ln,minFilter:_t,magFilter:_t,generateMipmaps:!1}),B.map.texture.name=H.name+".shadowMap",B.map.depthTexture=new na(s.x,s.y,gn),B.map.depthTexture.name=H.name+".shadowMapDepth",B.map.depthTexture.format=fi,B.map.depthTexture.compareFunction=null,B.map.depthTexture.minFilter=wt,B.map.depthTexture.magFilter=wt}else H.isPointLight?(B.map=new Np(s.x),B.map.depthTexture=new M0(s.x,jn)):(B.map=new nn(s.x,s.y),B.map.depthTexture=new na(s.x,s.y,jn)),B.map.depthTexture.name=H.name+".shadowMap",B.map.depthTexture.format=fi,this.type===mo?(B.map.depthTexture.compareFunction=Q?Bh:Fh,B.map.depthTexture.minFilter=_t,B.map.depthTexture.magFilter=_t):(B.map.depthTexture.compareFunction=null,B.map.depthTexture.minFilter=wt,B.map.depthTexture.magFilter=wt);B.camera.updateProjectionMatrix()}const me=B.map.isWebGLCubeRenderTarget?6:1;for(let _e=0;_e<me;_e++){if(B.map.isWebGLCubeRenderTarget)i.setRenderTarget(B.map,_e),i.clear();else{_e===0&&(i.setRenderTarget(B.map),i.clear());const ge=B.getViewport(_e);a.set(r.x*ge.x,r.y*ge.y,r.x*ge.z,r.y*ge.w),O.viewport(a)}if(H.isPointLight){const ge=B.camera,ke=B.matrix,rt=H.distance||ge.far;rt!==ge.far&&(ge.far=rt,ge.updateProjectionMatrix()),Tr.setFromMatrixPosition(H.matrixWorld),ge.position.copy(Tr),Xl.copy(ge.position),Xl.add(CS[_e]),ge.up.copy(RS[_e]),ge.lookAt(Xl),ge.updateMatrixWorld(),ke.makeTranslation(-Tr.x,-Tr.y,-Tr.z),Qd.multiplyMatrices(ge.projectionMatrix,ge.matrixWorldInverse),B._frustum.setFromProjectionMatrix(Qd,ge.coordinateSystem,ge.reversedDepth)}else B.updateMatrices(H);n=B.getFrustum(),S(L,x,B.camera,H,this.type)}B.isPointLightShadow!==!0&&this.type===Pr&&M(B,x),B.needsUpdate=!1}m=this.type,p.needsUpdate=!1,i.setRenderTarget(E,N,C)};function M(T,L){const x=e.update(_);d.defines.VSM_SAMPLES!==T.blurSamples&&(d.defines.VSM_SAMPLES=T.blurSamples,f.defines.VSM_SAMPLES=T.blurSamples,d.needsUpdate=!0,f.needsUpdate=!0),T.mapPass===null&&(T.mapPass=new nn(s.x,s.y,{format:Xs,type:ln})),d.uniforms.shadow_pass.value=T.map.depthTexture,d.uniforms.resolution.value=T.mapSize,d.uniforms.radius.value=T.radius,i.setRenderTarget(T.mapPass),i.clear(),i.renderBufferDirect(L,null,x,d,_,null),f.uniforms.shadow_pass.value=T.mapPass.texture,f.uniforms.resolution.value=T.mapSize,f.uniforms.radius.value=T.radius,i.setRenderTarget(T.map),i.clear(),i.renderBufferDirect(L,null,x,f,_,null)}function y(T,L,x,E){let N=null;const C=x.isPointLight===!0?T.customDistanceMaterial:T.customDepthMaterial;if(C!==void 0)N=C;else if(N=x.isPointLight===!0?l:o,i.localClippingEnabled&&L.clipShadows===!0&&Array.isArray(L.clippingPlanes)&&L.clippingPlanes.length!==0||L.displacementMap&&L.displacementScale!==0||L.alphaMap&&L.alphaTest>0||L.map&&L.alphaTest>0||L.alphaToCoverage===!0){const O=N.uuid,F=L.uuid;let V=c[O];V===void 0&&(V={},c[O]=V);let z=V[F];z===void 0&&(z=N.clone(),V[F]=z,L.addEventListener("dispose",w)),N=z}if(N.visible=L.visible,N.wireframe=L.wireframe,E===Pr?N.side=L.shadowSide!==null?L.shadowSide:L.side:N.side=L.shadowSide!==null?L.shadowSide:u[L.side],N.alphaMap=L.alphaMap,N.alphaTest=L.alphaToCoverage===!0?.5:L.alphaTest,N.map=L.map,N.clipShadows=L.clipShadows,N.clippingPlanes=L.clippingPlanes,N.clipIntersection=L.clipIntersection,N.displacementMap=L.displacementMap,N.displacementScale=L.displacementScale,N.displacementBias=L.displacementBias,N.wireframeLinewidth=L.wireframeLinewidth,N.linewidth=L.linewidth,x.isPointLight===!0&&N.isMeshDistanceMaterial===!0){const O=i.properties.get(N);O.light=x}return N}function S(T,L,x,E,N){if(T.visible===!1)return;if(T.layers.test(L.layers)&&(T.isMesh||T.isLine||T.isPoints)&&(T.castShadow||T.receiveShadow&&N===Pr)&&(!T.frustumCulled||n.intersectsObject(T))){T.modelViewMatrix.multiplyMatrices(x.matrixWorldInverse,T.matrixWorld);const F=e.update(T),V=T.material;if(Array.isArray(V)){const z=F.groups;for(let H=0,B=z.length;H<B;H++){const ie=z[H],Q=V[ie.materialIndex];if(Q&&Q.visible){const me=y(T,Q,E,N);T.onBeforeShadow(i,T,L,x,F,me,ie),i.renderBufferDirect(x,null,F,me,T,ie),T.onAfterShadow(i,T,L,x,F,me,ie)}}}else if(V.visible){const z=y(T,V,E,N);T.onBeforeShadow(i,T,L,x,F,z,null),i.renderBufferDirect(x,null,F,z,T,null),T.onAfterShadow(i,T,L,x,F,z,null)}}const O=T.children;for(let F=0,V=O.length;F<V;F++)S(O[F],L,x,E,N)}function w(T){T.target.removeEventListener("dispose",w);for(const x in c){const E=c[x],N=T.target.uuid;N in E&&(E[N].dispose(),delete E[N])}}}function LS(i,e){function t(){let D=!1;const he=new it;let re=null;const Se=new it(0,0,0,0);return{setMask:function(ne){re!==ne&&!D&&(i.colorMask(ne,ne,ne,ne),re=ne)},setLocked:function(ne){D=ne},setClear:function(ne,Y,Te,Ve,gt){gt===!0&&(ne*=Ve,Y*=Ve,Te*=Ve),he.set(ne,Y,Te,Ve),Se.equals(he)===!1&&(i.clearColor(ne,Y,Te,Ve),Se.copy(he))},reset:function(){D=!1,re=null,Se.set(-1,0,0,0)}}}function n(){let D=!1,he=!1,re=null,Se=null,ne=null;return{setReversed:function(Y){if(he!==Y){const Te=e.get("EXT_clip_control");Y?Te.clipControlEXT(Te.LOWER_LEFT_EXT,Te.ZERO_TO_ONE_EXT):Te.clipControlEXT(Te.LOWER_LEFT_EXT,Te.NEGATIVE_ONE_TO_ONE_EXT),he=Y;const Ve=ne;ne=null,this.setClear(Ve)}},getReversed:function(){return he},setTest:function(Y){Y?ae(i.DEPTH_TEST):oe(i.DEPTH_TEST)},setMask:function(Y){re!==Y&&!D&&(i.depthMask(Y),re=Y)},setFunc:function(Y){if(he&&(Y=Rg[Y]),Se!==Y){switch(Y){case hc:i.depthFunc(i.NEVER);break;case uc:i.depthFunc(i.ALWAYS);break;case dc:i.depthFunc(i.LESS);break;case Gs:i.depthFunc(i.LEQUAL);break;case fc:i.depthFunc(i.EQUAL);break;case pc:i.depthFunc(i.GEQUAL);break;case mc:i.depthFunc(i.GREATER);break;case gc:i.depthFunc(i.NOTEQUAL);break;default:i.depthFunc(i.LEQUAL)}Se=Y}},setLocked:function(Y){D=Y},setClear:function(Y){ne!==Y&&(ne=Y,he&&(Y=1-Y),i.clearDepth(Y))},reset:function(){D=!1,re=null,Se=null,ne=null,he=!1}}}function s(){let D=!1,he=null,re=null,Se=null,ne=null,Y=null,Te=null,Ve=null,gt=null;return{setTest:function(at){D||(at?ae(i.STENCIL_TEST):oe(i.STENCIL_TEST))},setMask:function(at){he!==at&&!D&&(i.stencilMask(at),he=at)},setFunc:function(at,Zn,Qn){(re!==at||Se!==Zn||ne!==Qn)&&(i.stencilFunc(at,Zn,Qn),re=at,Se=Zn,ne=Qn)},setOp:function(at,Zn,Qn){(Y!==at||Te!==Zn||Ve!==Qn)&&(i.stencilOp(at,Zn,Qn),Y=at,Te=Zn,Ve=Qn)},setLocked:function(at){D=at},setClear:function(at){gt!==at&&(i.clearStencil(at),gt=at)},reset:function(){D=!1,he=null,re=null,Se=null,ne=null,Y=null,Te=null,Ve=null,gt=null}}}const r=new t,a=new n,o=new s,l=new WeakMap,c=new WeakMap;let h={},u={},d=new WeakMap,f=[],g=null,_=!1,p=null,m=null,M=null,y=null,S=null,w=null,T=null,L=new Me(0,0,0),x=0,E=!1,N=null,C=null,O=null,F=null,V=null;const z=i.getParameter(i.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let H=!1,B=0;const ie=i.getParameter(i.VERSION);ie.indexOf("WebGL")!==-1?(B=parseFloat(/^WebGL (\d)/.exec(ie)[1]),H=B>=1):ie.indexOf("OpenGL ES")!==-1&&(B=parseFloat(/^OpenGL ES (\d)/.exec(ie)[1]),H=B>=2);let Q=null,me={};const _e=i.getParameter(i.SCISSOR_BOX),ge=i.getParameter(i.VIEWPORT),ke=new it().fromArray(_e),rt=new it().fromArray(ge);function ct(D,he,re,Se){const ne=new Uint8Array(4),Y=i.createTexture();i.bindTexture(D,Y),i.texParameteri(D,i.TEXTURE_MIN_FILTER,i.NEAREST),i.texParameteri(D,i.TEXTURE_MAG_FILTER,i.NEAREST);for(let Te=0;Te<re;Te++)D===i.TEXTURE_3D||D===i.TEXTURE_2D_ARRAY?i.texImage3D(he,0,i.RGBA,1,1,Se,0,i.RGBA,i.UNSIGNED_BYTE,ne):i.texImage2D(he+Te,0,i.RGBA,1,1,0,i.RGBA,i.UNSIGNED_BYTE,ne);return Y}const q={};q[i.TEXTURE_2D]=ct(i.TEXTURE_2D,i.TEXTURE_2D,1),q[i.TEXTURE_CUBE_MAP]=ct(i.TEXTURE_CUBE_MAP,i.TEXTURE_CUBE_MAP_POSITIVE_X,6),q[i.TEXTURE_2D_ARRAY]=ct(i.TEXTURE_2D_ARRAY,i.TEXTURE_2D_ARRAY,1,1),q[i.TEXTURE_3D]=ct(i.TEXTURE_3D,i.TEXTURE_3D,1,1),r.setClear(0,0,0,1),a.setClear(1),o.setClear(0),ae(i.DEPTH_TEST),a.setFunc(Gs),Z(!1),de(Au),ae(i.CULL_FACE),J(Yn);function ae(D){h[D]!==!0&&(i.enable(D),h[D]=!0)}function oe(D){h[D]!==!1&&(i.disable(D),h[D]=!1)}function Ue(D,he){return u[D]!==he?(i.bindFramebuffer(D,he),u[D]=he,D===i.DRAW_FRAMEBUFFER&&(u[i.FRAMEBUFFER]=he),D===i.FRAMEBUFFER&&(u[i.DRAW_FRAMEBUFFER]=he),!0):!1}function Ie(D,he){let re=f,Se=!1;if(D){re=d.get(he),re===void 0&&(re=[],d.set(he,re));const ne=D.textures;if(re.length!==ne.length||re[0]!==i.COLOR_ATTACHMENT0){for(let Y=0,Te=ne.length;Y<Te;Y++)re[Y]=i.COLOR_ATTACHMENT0+Y;re.length=ne.length,Se=!0}}else re[0]!==i.BACK&&(re[0]=i.BACK,Se=!0);Se&&i.drawBuffers(re)}function He(D){return g!==D?(i.useProgram(D),g=D,!0):!1}const ht={[Hi]:i.FUNC_ADD,[jm]:i.FUNC_SUBTRACT,[$m]:i.FUNC_REVERSE_SUBTRACT};ht[Jm]=i.MIN,ht[Zm]=i.MAX;const Xe={[Qm]:i.ZERO,[eg]:i.ONE,[tg]:i.SRC_COLOR,[lc]:i.SRC_ALPHA,[og]:i.SRC_ALPHA_SATURATE,[rg]:i.DST_COLOR,[ig]:i.DST_ALPHA,[ng]:i.ONE_MINUS_SRC_COLOR,[cc]:i.ONE_MINUS_SRC_ALPHA,[ag]:i.ONE_MINUS_DST_COLOR,[sg]:i.ONE_MINUS_DST_ALPHA,[lg]:i.CONSTANT_COLOR,[cg]:i.ONE_MINUS_CONSTANT_COLOR,[hg]:i.CONSTANT_ALPHA,[ug]:i.ONE_MINUS_CONSTANT_ALPHA};function J(D,he,re,Se,ne,Y,Te,Ve,gt,at){if(D===Yn){_===!0&&(oe(i.BLEND),_=!1);return}if(_===!1&&(ae(i.BLEND),_=!0),D!==qm){if(D!==p||at!==E){if((m!==Hi||S!==Hi)&&(i.blendEquation(i.FUNC_ADD),m=Hi,S=Hi),at)switch(D){case Os:i.blendFuncSeparate(i.ONE,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case Cn:i.blendFunc(i.ONE,i.ONE);break;case wu:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case Cu:i.blendFuncSeparate(i.DST_COLOR,i.ONE_MINUS_SRC_ALPHA,i.ZERO,i.ONE);break;default:Be("WebGLState: Invalid blending: ",D);break}else switch(D){case Os:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case Cn:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE,i.ONE,i.ONE);break;case wu:Be("WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case Cu:Be("WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:Be("WebGLState: Invalid blending: ",D);break}M=null,y=null,w=null,T=null,L.set(0,0,0),x=0,p=D,E=at}return}ne=ne||he,Y=Y||re,Te=Te||Se,(he!==m||ne!==S)&&(i.blendEquationSeparate(ht[he],ht[ne]),m=he,S=ne),(re!==M||Se!==y||Y!==w||Te!==T)&&(i.blendFuncSeparate(Xe[re],Xe[Se],Xe[Y],Xe[Te]),M=re,y=Se,w=Y,T=Te),(Ve.equals(L)===!1||gt!==x)&&(i.blendColor(Ve.r,Ve.g,Ve.b,gt),L.copy(Ve),x=gt),p=D,E=!1}function te(D,he){D.side===At?oe(i.CULL_FACE):ae(i.CULL_FACE);let re=D.side===Jt;he&&(re=!re),Z(re),D.blending===Os&&D.transparent===!1?J(Yn):J(D.blending,D.blendEquation,D.blendSrc,D.blendDst,D.blendEquationAlpha,D.blendSrcAlpha,D.blendDstAlpha,D.blendColor,D.blendAlpha,D.premultipliedAlpha),a.setFunc(D.depthFunc),a.setTest(D.depthTest),a.setMask(D.depthWrite),r.setMask(D.colorWrite);const Se=D.stencilWrite;o.setTest(Se),Se&&(o.setMask(D.stencilWriteMask),o.setFunc(D.stencilFunc,D.stencilRef,D.stencilFuncMask),o.setOp(D.stencilFail,D.stencilZFail,D.stencilZPass)),Ne(D.polygonOffset,D.polygonOffsetFactor,D.polygonOffsetUnits),D.alphaToCoverage===!0?ae(i.SAMPLE_ALPHA_TO_COVERAGE):oe(i.SAMPLE_ALPHA_TO_COVERAGE)}function Z(D){N!==D&&(D?i.frontFace(i.CW):i.frontFace(i.CCW),N=D)}function de(D){D!==Xm?(ae(i.CULL_FACE),D!==C&&(D===Au?i.cullFace(i.BACK):D===Km?i.cullFace(i.FRONT):i.cullFace(i.FRONT_AND_BACK))):oe(i.CULL_FACE),C=D}function R(D){D!==O&&(H&&i.lineWidth(D),O=D)}function Ne(D,he,re){D?(ae(i.POLYGON_OFFSET_FILL),(F!==he||V!==re)&&(F=he,V=re,a.getReversed()&&(he=-he),i.polygonOffset(he,re))):oe(i.POLYGON_OFFSET_FILL)}function xe(D){D?ae(i.SCISSOR_TEST):oe(i.SCISSOR_TEST)}function Oe(D){D===void 0&&(D=i.TEXTURE0+z-1),Q!==D&&(i.activeTexture(D),Q=D)}function le(D,he,re){re===void 0&&(Q===null?re=i.TEXTURE0+z-1:re=Q);let Se=me[re];Se===void 0&&(Se={type:void 0,texture:void 0},me[re]=Se),(Se.type!==D||Se.texture!==he)&&(Q!==re&&(i.activeTexture(re),Q=re),i.bindTexture(D,he||q[D]),Se.type=D,Se.texture=he)}function A(){const D=me[Q];D!==void 0&&D.type!==void 0&&(i.bindTexture(D.type,null),D.type=void 0,D.texture=void 0)}function v(){try{i.compressedTexImage2D(...arguments)}catch(D){Be("WebGLState:",D)}}function I(){try{i.compressedTexImage3D(...arguments)}catch(D){Be("WebGLState:",D)}}function X(){try{i.texSubImage2D(...arguments)}catch(D){Be("WebGLState:",D)}}function $(){try{i.texSubImage3D(...arguments)}catch(D){Be("WebGLState:",D)}}function K(){try{i.compressedTexSubImage2D(...arguments)}catch(D){Be("WebGLState:",D)}}function Ee(){try{i.compressedTexSubImage3D(...arguments)}catch(D){Be("WebGLState:",D)}}function ce(){try{i.texStorage2D(...arguments)}catch(D){Be("WebGLState:",D)}}function Le(){try{i.texStorage3D(...arguments)}catch(D){Be("WebGLState:",D)}}function Fe(){try{i.texImage2D(...arguments)}catch(D){Be("WebGLState:",D)}}function ee(){try{i.texImage3D(...arguments)}catch(D){Be("WebGLState:",D)}}function se(D){ke.equals(D)===!1&&(i.scissor(D.x,D.y,D.z,D.w),ke.copy(D))}function be(D){rt.equals(D)===!1&&(i.viewport(D.x,D.y,D.z,D.w),rt.copy(D))}function Ae(D,he){let re=c.get(he);re===void 0&&(re=new WeakMap,c.set(he,re));let Se=re.get(D);Se===void 0&&(Se=i.getUniformBlockIndex(he,D.name),re.set(D,Se))}function ve(D,he){const Se=c.get(he).get(D);l.get(he)!==Se&&(i.uniformBlockBinding(he,Se,D.__bindingPointIndex),l.set(he,Se))}function je(){i.disable(i.BLEND),i.disable(i.CULL_FACE),i.disable(i.DEPTH_TEST),i.disable(i.POLYGON_OFFSET_FILL),i.disable(i.SCISSOR_TEST),i.disable(i.STENCIL_TEST),i.disable(i.SAMPLE_ALPHA_TO_COVERAGE),i.blendEquation(i.FUNC_ADD),i.blendFunc(i.ONE,i.ZERO),i.blendFuncSeparate(i.ONE,i.ZERO,i.ONE,i.ZERO),i.blendColor(0,0,0,0),i.colorMask(!0,!0,!0,!0),i.clearColor(0,0,0,0),i.depthMask(!0),i.depthFunc(i.LESS),a.setReversed(!1),i.clearDepth(1),i.stencilMask(4294967295),i.stencilFunc(i.ALWAYS,0,4294967295),i.stencilOp(i.KEEP,i.KEEP,i.KEEP),i.clearStencil(0),i.cullFace(i.BACK),i.frontFace(i.CCW),i.polygonOffset(0,0),i.activeTexture(i.TEXTURE0),i.bindFramebuffer(i.FRAMEBUFFER,null),i.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),i.bindFramebuffer(i.READ_FRAMEBUFFER,null),i.useProgram(null),i.lineWidth(1),i.scissor(0,0,i.canvas.width,i.canvas.height),i.viewport(0,0,i.canvas.width,i.canvas.height),h={},Q=null,me={},u={},d=new WeakMap,f=[],g=null,_=!1,p=null,m=null,M=null,y=null,S=null,w=null,T=null,L=new Me(0,0,0),x=0,E=!1,N=null,C=null,O=null,F=null,V=null,ke.set(0,0,i.canvas.width,i.canvas.height),rt.set(0,0,i.canvas.width,i.canvas.height),r.reset(),a.reset(),o.reset()}return{buffers:{color:r,depth:a,stencil:o},enable:ae,disable:oe,bindFramebuffer:Ue,drawBuffers:Ie,useProgram:He,setBlending:J,setMaterial:te,setFlipSided:Z,setCullFace:de,setLineWidth:R,setPolygonOffset:Ne,setScissorTest:xe,activeTexture:Oe,bindTexture:le,unbindTexture:A,compressedTexImage2D:v,compressedTexImage3D:I,texImage2D:Fe,texImage3D:ee,updateUBOMapping:Ae,uniformBlockBinding:ve,texStorage2D:ce,texStorage3D:Le,texSubImage2D:X,texSubImage3D:$,compressedTexSubImage2D:K,compressedTexSubImage3D:Ee,scissor:se,viewport:be,reset:je}}function DS(i,e,t,n,s,r,a){const o=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),c=new j,h=new WeakMap;let u;const d=new WeakMap;let f=!1;try{f=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function g(A,v){return f?new OffscreenCanvas(A,v):ta("canvas")}function _(A,v,I){let X=1;const $=le(A);if(($.width>I||$.height>I)&&(X=I/Math.max($.width,$.height)),X<1)if(typeof HTMLImageElement<"u"&&A instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&A instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&A instanceof ImageBitmap||typeof VideoFrame<"u"&&A instanceof VideoFrame){const K=Math.floor(X*$.width),Ee=Math.floor(X*$.height);u===void 0&&(u=g(K,Ee));const ce=v?g(K,Ee):u;return ce.width=K,ce.height=Ee,ce.getContext("2d").drawImage(A,0,0,K,Ee),Re("WebGLRenderer: Texture has been resized from ("+$.width+"x"+$.height+") to ("+K+"x"+Ee+")."),ce}else return"data"in A&&Re("WebGLRenderer: Image in DataTexture is too big ("+$.width+"x"+$.height+")."),A;return A}function p(A){return A.generateMipmaps}function m(A){i.generateMipmap(A)}function M(A){return A.isWebGLCubeRenderTarget?i.TEXTURE_CUBE_MAP:A.isWebGL3DRenderTarget?i.TEXTURE_3D:A.isWebGLArrayRenderTarget||A.isCompressedArrayTexture?i.TEXTURE_2D_ARRAY:i.TEXTURE_2D}function y(A,v,I,X,$=!1){if(A!==null){if(i[A]!==void 0)return i[A];Re("WebGLRenderer: Attempt to use non-existing WebGL internal format '"+A+"'")}let K=v;if(v===i.RED&&(I===i.FLOAT&&(K=i.R32F),I===i.HALF_FLOAT&&(K=i.R16F),I===i.UNSIGNED_BYTE&&(K=i.R8)),v===i.RED_INTEGER&&(I===i.UNSIGNED_BYTE&&(K=i.R8UI),I===i.UNSIGNED_SHORT&&(K=i.R16UI),I===i.UNSIGNED_INT&&(K=i.R32UI),I===i.BYTE&&(K=i.R8I),I===i.SHORT&&(K=i.R16I),I===i.INT&&(K=i.R32I)),v===i.RG&&(I===i.FLOAT&&(K=i.RG32F),I===i.HALF_FLOAT&&(K=i.RG16F),I===i.UNSIGNED_BYTE&&(K=i.RG8)),v===i.RG_INTEGER&&(I===i.UNSIGNED_BYTE&&(K=i.RG8UI),I===i.UNSIGNED_SHORT&&(K=i.RG16UI),I===i.UNSIGNED_INT&&(K=i.RG32UI),I===i.BYTE&&(K=i.RG8I),I===i.SHORT&&(K=i.RG16I),I===i.INT&&(K=i.RG32I)),v===i.RGB_INTEGER&&(I===i.UNSIGNED_BYTE&&(K=i.RGB8UI),I===i.UNSIGNED_SHORT&&(K=i.RGB16UI),I===i.UNSIGNED_INT&&(K=i.RGB32UI),I===i.BYTE&&(K=i.RGB8I),I===i.SHORT&&(K=i.RGB16I),I===i.INT&&(K=i.RGB32I)),v===i.RGBA_INTEGER&&(I===i.UNSIGNED_BYTE&&(K=i.RGBA8UI),I===i.UNSIGNED_SHORT&&(K=i.RGBA16UI),I===i.UNSIGNED_INT&&(K=i.RGBA32UI),I===i.BYTE&&(K=i.RGBA8I),I===i.SHORT&&(K=i.RGBA16I),I===i.INT&&(K=i.RGBA32I)),v===i.RGB&&(I===i.UNSIGNED_INT_5_9_9_9_REV&&(K=i.RGB9_E5),I===i.UNSIGNED_INT_10F_11F_11F_REV&&(K=i.R11F_G11F_B10F)),v===i.RGBA){const Ee=$?Io:Qe.getTransfer(X);I===i.FLOAT&&(K=i.RGBA32F),I===i.HALF_FLOAT&&(K=i.RGBA16F),I===i.UNSIGNED_BYTE&&(K=Ee===nt?i.SRGB8_ALPHA8:i.RGBA8),I===i.UNSIGNED_SHORT_4_4_4_4&&(K=i.RGBA4),I===i.UNSIGNED_SHORT_5_5_5_1&&(K=i.RGB5_A1)}return(K===i.R16F||K===i.R32F||K===i.RG16F||K===i.RG32F||K===i.RGBA16F||K===i.RGBA32F)&&e.get("EXT_color_buffer_float"),K}function S(A,v){let I;return A?v===null||v===jn||v===Jr?I=i.DEPTH24_STENCIL8:v===gn?I=i.DEPTH32F_STENCIL8:v===$r&&(I=i.DEPTH24_STENCIL8,Re("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):v===null||v===jn||v===Jr?I=i.DEPTH_COMPONENT24:v===gn?I=i.DEPTH_COMPONENT32F:v===$r&&(I=i.DEPTH_COMPONENT16),I}function w(A,v){return p(A)===!0||A.isFramebufferTexture&&A.minFilter!==wt&&A.minFilter!==_t?Math.log2(Math.max(v.width,v.height))+1:A.mipmaps!==void 0&&A.mipmaps.length>0?A.mipmaps.length:A.isCompressedTexture&&Array.isArray(A.image)?v.mipmaps.length:1}function T(A){const v=A.target;v.removeEventListener("dispose",T),x(v),v.isVideoTexture&&h.delete(v)}function L(A){const v=A.target;v.removeEventListener("dispose",L),N(v)}function x(A){const v=n.get(A);if(v.__webglInit===void 0)return;const I=A.source,X=d.get(I);if(X){const $=X[v.__cacheKey];$.usedTimes--,$.usedTimes===0&&E(A),Object.keys(X).length===0&&d.delete(I)}n.remove(A)}function E(A){const v=n.get(A);i.deleteTexture(v.__webglTexture);const I=A.source,X=d.get(I);delete X[v.__cacheKey],a.memory.textures--}function N(A){const v=n.get(A);if(A.depthTexture&&(A.depthTexture.dispose(),n.remove(A.depthTexture)),A.isWebGLCubeRenderTarget)for(let X=0;X<6;X++){if(Array.isArray(v.__webglFramebuffer[X]))for(let $=0;$<v.__webglFramebuffer[X].length;$++)i.deleteFramebuffer(v.__webglFramebuffer[X][$]);else i.deleteFramebuffer(v.__webglFramebuffer[X]);v.__webglDepthbuffer&&i.deleteRenderbuffer(v.__webglDepthbuffer[X])}else{if(Array.isArray(v.__webglFramebuffer))for(let X=0;X<v.__webglFramebuffer.length;X++)i.deleteFramebuffer(v.__webglFramebuffer[X]);else i.deleteFramebuffer(v.__webglFramebuffer);if(v.__webglDepthbuffer&&i.deleteRenderbuffer(v.__webglDepthbuffer),v.__webglMultisampledFramebuffer&&i.deleteFramebuffer(v.__webglMultisampledFramebuffer),v.__webglColorRenderbuffer)for(let X=0;X<v.__webglColorRenderbuffer.length;X++)v.__webglColorRenderbuffer[X]&&i.deleteRenderbuffer(v.__webglColorRenderbuffer[X]);v.__webglDepthRenderbuffer&&i.deleteRenderbuffer(v.__webglDepthRenderbuffer)}const I=A.textures;for(let X=0,$=I.length;X<$;X++){const K=n.get(I[X]);K.__webglTexture&&(i.deleteTexture(K.__webglTexture),a.memory.textures--),n.remove(I[X])}n.remove(A)}let C=0;function O(){C=0}function F(){const A=C;return A>=s.maxTextures&&Re("WebGLTextures: Trying to use "+A+" texture units while this GPU supports only "+s.maxTextures),C+=1,A}function V(A){const v=[];return v.push(A.wrapS),v.push(A.wrapT),v.push(A.wrapR||0),v.push(A.magFilter),v.push(A.minFilter),v.push(A.anisotropy),v.push(A.internalFormat),v.push(A.format),v.push(A.type),v.push(A.generateMipmaps),v.push(A.premultiplyAlpha),v.push(A.flipY),v.push(A.unpackAlignment),v.push(A.colorSpace),v.join()}function z(A,v){const I=n.get(A);if(A.isVideoTexture&&xe(A),A.isRenderTargetTexture===!1&&A.isExternalTexture!==!0&&A.version>0&&I.__version!==A.version){const X=A.image;if(X===null)Re("WebGLRenderer: Texture marked for update but no image data found.");else if(X.complete===!1)Re("WebGLRenderer: Texture marked for update but image is incomplete");else{q(I,A,v);return}}else A.isExternalTexture&&(I.__webglTexture=A.sourceTexture?A.sourceTexture:null);t.bindTexture(i.TEXTURE_2D,I.__webglTexture,i.TEXTURE0+v)}function H(A,v){const I=n.get(A);if(A.isRenderTargetTexture===!1&&A.version>0&&I.__version!==A.version){q(I,A,v);return}else A.isExternalTexture&&(I.__webglTexture=A.sourceTexture?A.sourceTexture:null);t.bindTexture(i.TEXTURE_2D_ARRAY,I.__webglTexture,i.TEXTURE0+v)}function B(A,v){const I=n.get(A);if(A.isRenderTargetTexture===!1&&A.version>0&&I.__version!==A.version){q(I,A,v);return}t.bindTexture(i.TEXTURE_3D,I.__webglTexture,i.TEXTURE0+v)}function ie(A,v){const I=n.get(A);if(A.isCubeDepthTexture!==!0&&A.version>0&&I.__version!==A.version){ae(I,A,v);return}t.bindTexture(i.TEXTURE_CUBE_MAP,I.__webglTexture,i.TEXTURE0+v)}const Q={[Ws]:i.REPEAT,[mn]:i.CLAMP_TO_EDGE,[Do]:i.MIRRORED_REPEAT},me={[wt]:i.NEAREST,[tp]:i.NEAREST_MIPMAP_NEAREST,[Lr]:i.NEAREST_MIPMAP_LINEAR,[_t]:i.LINEAR,[go]:i.LINEAR_MIPMAP_NEAREST,[Rn]:i.LINEAR_MIPMAP_LINEAR},_e={[vg]:i.NEVER,[bg]:i.ALWAYS,[Mg]:i.LESS,[Fh]:i.LEQUAL,[yg]:i.EQUAL,[Bh]:i.GEQUAL,[Sg]:i.GREATER,[Eg]:i.NOTEQUAL};function ge(A,v){if(v.type===gn&&e.has("OES_texture_float_linear")===!1&&(v.magFilter===_t||v.magFilter===go||v.magFilter===Lr||v.magFilter===Rn||v.minFilter===_t||v.minFilter===go||v.minFilter===Lr||v.minFilter===Rn)&&Re("WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),i.texParameteri(A,i.TEXTURE_WRAP_S,Q[v.wrapS]),i.texParameteri(A,i.TEXTURE_WRAP_T,Q[v.wrapT]),(A===i.TEXTURE_3D||A===i.TEXTURE_2D_ARRAY)&&i.texParameteri(A,i.TEXTURE_WRAP_R,Q[v.wrapR]),i.texParameteri(A,i.TEXTURE_MAG_FILTER,me[v.magFilter]),i.texParameteri(A,i.TEXTURE_MIN_FILTER,me[v.minFilter]),v.compareFunction&&(i.texParameteri(A,i.TEXTURE_COMPARE_MODE,i.COMPARE_REF_TO_TEXTURE),i.texParameteri(A,i.TEXTURE_COMPARE_FUNC,_e[v.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){if(v.magFilter===wt||v.minFilter!==Lr&&v.minFilter!==Rn||v.type===gn&&e.has("OES_texture_float_linear")===!1)return;if(v.anisotropy>1||n.get(v).__currentAnisotropy){const I=e.get("EXT_texture_filter_anisotropic");i.texParameterf(A,I.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(v.anisotropy,s.getMaxAnisotropy())),n.get(v).__currentAnisotropy=v.anisotropy}}}function ke(A,v){let I=!1;A.__webglInit===void 0&&(A.__webglInit=!0,v.addEventListener("dispose",T));const X=v.source;let $=d.get(X);$===void 0&&($={},d.set(X,$));const K=V(v);if(K!==A.__cacheKey){$[K]===void 0&&($[K]={texture:i.createTexture(),usedTimes:0},a.memory.textures++,I=!0),$[K].usedTimes++;const Ee=$[A.__cacheKey];Ee!==void 0&&($[A.__cacheKey].usedTimes--,Ee.usedTimes===0&&E(v)),A.__cacheKey=K,A.__webglTexture=$[K].texture}return I}function rt(A,v,I){return Math.floor(Math.floor(A/I)/v)}function ct(A,v,I,X){const K=A.updateRanges;if(K.length===0)t.texSubImage2D(i.TEXTURE_2D,0,0,0,v.width,v.height,I,X,v.data);else{K.sort((ee,se)=>ee.start-se.start);let Ee=0;for(let ee=1;ee<K.length;ee++){const se=K[Ee],be=K[ee],Ae=se.start+se.count,ve=rt(be.start,v.width,4),je=rt(se.start,v.width,4);be.start<=Ae+1&&ve===je&&rt(be.start+be.count-1,v.width,4)===ve?se.count=Math.max(se.count,be.start+be.count-se.start):(++Ee,K[Ee]=be)}K.length=Ee+1;const ce=i.getParameter(i.UNPACK_ROW_LENGTH),Le=i.getParameter(i.UNPACK_SKIP_PIXELS),Fe=i.getParameter(i.UNPACK_SKIP_ROWS);i.pixelStorei(i.UNPACK_ROW_LENGTH,v.width);for(let ee=0,se=K.length;ee<se;ee++){const be=K[ee],Ae=Math.floor(be.start/4),ve=Math.ceil(be.count/4),je=Ae%v.width,D=Math.floor(Ae/v.width),he=ve,re=1;i.pixelStorei(i.UNPACK_SKIP_PIXELS,je),i.pixelStorei(i.UNPACK_SKIP_ROWS,D),t.texSubImage2D(i.TEXTURE_2D,0,je,D,he,re,I,X,v.data)}A.clearUpdateRanges(),i.pixelStorei(i.UNPACK_ROW_LENGTH,ce),i.pixelStorei(i.UNPACK_SKIP_PIXELS,Le),i.pixelStorei(i.UNPACK_SKIP_ROWS,Fe)}}function q(A,v,I){let X=i.TEXTURE_2D;(v.isDataArrayTexture||v.isCompressedArrayTexture)&&(X=i.TEXTURE_2D_ARRAY),v.isData3DTexture&&(X=i.TEXTURE_3D);const $=ke(A,v),K=v.source;t.bindTexture(X,A.__webglTexture,i.TEXTURE0+I);const Ee=n.get(K);if(K.version!==Ee.__version||$===!0){t.activeTexture(i.TEXTURE0+I);const ce=Qe.getPrimaries(Qe.workingColorSpace),Le=v.colorSpace===Ti?null:Qe.getPrimaries(v.colorSpace),Fe=v.colorSpace===Ti||ce===Le?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,v.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,v.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,v.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,Fe);let ee=_(v.image,!1,s.maxTextureSize);ee=Oe(v,ee);const se=r.convert(v.format,v.colorSpace),be=r.convert(v.type);let Ae=y(v.internalFormat,se,be,v.colorSpace,v.isVideoTexture);ge(X,v);let ve;const je=v.mipmaps,D=v.isVideoTexture!==!0,he=Ee.__version===void 0||$===!0,re=K.dataReady,Se=w(v,ee);if(v.isDepthTexture)Ae=S(v.format===Wi,v.type),he&&(D?t.texStorage2D(i.TEXTURE_2D,1,Ae,ee.width,ee.height):t.texImage2D(i.TEXTURE_2D,0,Ae,ee.width,ee.height,0,se,be,null));else if(v.isDataTexture)if(je.length>0){D&&he&&t.texStorage2D(i.TEXTURE_2D,Se,Ae,je[0].width,je[0].height);for(let ne=0,Y=je.length;ne<Y;ne++)ve=je[ne],D?re&&t.texSubImage2D(i.TEXTURE_2D,ne,0,0,ve.width,ve.height,se,be,ve.data):t.texImage2D(i.TEXTURE_2D,ne,Ae,ve.width,ve.height,0,se,be,ve.data);v.generateMipmaps=!1}else D?(he&&t.texStorage2D(i.TEXTURE_2D,Se,Ae,ee.width,ee.height),re&&ct(v,ee,se,be)):t.texImage2D(i.TEXTURE_2D,0,Ae,ee.width,ee.height,0,se,be,ee.data);else if(v.isCompressedTexture)if(v.isCompressedArrayTexture){D&&he&&t.texStorage3D(i.TEXTURE_2D_ARRAY,Se,Ae,je[0].width,je[0].height,ee.depth);for(let ne=0,Y=je.length;ne<Y;ne++)if(ve=je[ne],v.format!==_n)if(se!==null)if(D){if(re)if(v.layerUpdates.size>0){const Te=Pd(ve.width,ve.height,v.format,v.type);for(const Ve of v.layerUpdates){const gt=ve.data.subarray(Ve*Te/ve.data.BYTES_PER_ELEMENT,(Ve+1)*Te/ve.data.BYTES_PER_ELEMENT);t.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,ne,0,0,Ve,ve.width,ve.height,1,se,gt)}v.clearLayerUpdates()}else t.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,ne,0,0,0,ve.width,ve.height,ee.depth,se,ve.data)}else t.compressedTexImage3D(i.TEXTURE_2D_ARRAY,ne,Ae,ve.width,ve.height,ee.depth,0,ve.data,0,0);else Re("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else D?re&&t.texSubImage3D(i.TEXTURE_2D_ARRAY,ne,0,0,0,ve.width,ve.height,ee.depth,se,be,ve.data):t.texImage3D(i.TEXTURE_2D_ARRAY,ne,Ae,ve.width,ve.height,ee.depth,0,se,be,ve.data)}else{D&&he&&t.texStorage2D(i.TEXTURE_2D,Se,Ae,je[0].width,je[0].height);for(let ne=0,Y=je.length;ne<Y;ne++)ve=je[ne],v.format!==_n?se!==null?D?re&&t.compressedTexSubImage2D(i.TEXTURE_2D,ne,0,0,ve.width,ve.height,se,ve.data):t.compressedTexImage2D(i.TEXTURE_2D,ne,Ae,ve.width,ve.height,0,ve.data):Re("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):D?re&&t.texSubImage2D(i.TEXTURE_2D,ne,0,0,ve.width,ve.height,se,be,ve.data):t.texImage2D(i.TEXTURE_2D,ne,Ae,ve.width,ve.height,0,se,be,ve.data)}else if(v.isDataArrayTexture)if(D){if(he&&t.texStorage3D(i.TEXTURE_2D_ARRAY,Se,Ae,ee.width,ee.height,ee.depth),re)if(v.layerUpdates.size>0){const ne=Pd(ee.width,ee.height,v.format,v.type);for(const Y of v.layerUpdates){const Te=ee.data.subarray(Y*ne/ee.data.BYTES_PER_ELEMENT,(Y+1)*ne/ee.data.BYTES_PER_ELEMENT);t.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,Y,ee.width,ee.height,1,se,be,Te)}v.clearLayerUpdates()}else t.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,0,ee.width,ee.height,ee.depth,se,be,ee.data)}else t.texImage3D(i.TEXTURE_2D_ARRAY,0,Ae,ee.width,ee.height,ee.depth,0,se,be,ee.data);else if(v.isData3DTexture)D?(he&&t.texStorage3D(i.TEXTURE_3D,Se,Ae,ee.width,ee.height,ee.depth),re&&t.texSubImage3D(i.TEXTURE_3D,0,0,0,0,ee.width,ee.height,ee.depth,se,be,ee.data)):t.texImage3D(i.TEXTURE_3D,0,Ae,ee.width,ee.height,ee.depth,0,se,be,ee.data);else if(v.isFramebufferTexture){if(he)if(D)t.texStorage2D(i.TEXTURE_2D,Se,Ae,ee.width,ee.height);else{let ne=ee.width,Y=ee.height;for(let Te=0;Te<Se;Te++)t.texImage2D(i.TEXTURE_2D,Te,Ae,ne,Y,0,se,be,null),ne>>=1,Y>>=1}}else if(je.length>0){if(D&&he){const ne=le(je[0]);t.texStorage2D(i.TEXTURE_2D,Se,Ae,ne.width,ne.height)}for(let ne=0,Y=je.length;ne<Y;ne++)ve=je[ne],D?re&&t.texSubImage2D(i.TEXTURE_2D,ne,0,0,se,be,ve):t.texImage2D(i.TEXTURE_2D,ne,Ae,se,be,ve);v.generateMipmaps=!1}else if(D){if(he){const ne=le(ee);t.texStorage2D(i.TEXTURE_2D,Se,Ae,ne.width,ne.height)}re&&t.texSubImage2D(i.TEXTURE_2D,0,0,0,se,be,ee)}else t.texImage2D(i.TEXTURE_2D,0,Ae,se,be,ee);p(v)&&m(X),Ee.__version=K.version,v.onUpdate&&v.onUpdate(v)}A.__version=v.version}function ae(A,v,I){if(v.image.length!==6)return;const X=ke(A,v),$=v.source;t.bindTexture(i.TEXTURE_CUBE_MAP,A.__webglTexture,i.TEXTURE0+I);const K=n.get($);if($.version!==K.__version||X===!0){t.activeTexture(i.TEXTURE0+I);const Ee=Qe.getPrimaries(Qe.workingColorSpace),ce=v.colorSpace===Ti?null:Qe.getPrimaries(v.colorSpace),Le=v.colorSpace===Ti||Ee===ce?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,v.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,v.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,v.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,Le);const Fe=v.isCompressedTexture||v.image[0].isCompressedTexture,ee=v.image[0]&&v.image[0].isDataTexture,se=[];for(let Y=0;Y<6;Y++)!Fe&&!ee?se[Y]=_(v.image[Y],!0,s.maxCubemapSize):se[Y]=ee?v.image[Y].image:v.image[Y],se[Y]=Oe(v,se[Y]);const be=se[0],Ae=r.convert(v.format,v.colorSpace),ve=r.convert(v.type),je=y(v.internalFormat,Ae,ve,v.colorSpace),D=v.isVideoTexture!==!0,he=K.__version===void 0||X===!0,re=$.dataReady;let Se=w(v,be);ge(i.TEXTURE_CUBE_MAP,v);let ne;if(Fe){D&&he&&t.texStorage2D(i.TEXTURE_CUBE_MAP,Se,je,be.width,be.height);for(let Y=0;Y<6;Y++){ne=se[Y].mipmaps;for(let Te=0;Te<ne.length;Te++){const Ve=ne[Te];v.format!==_n?Ae!==null?D?re&&t.compressedTexSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Y,Te,0,0,Ve.width,Ve.height,Ae,Ve.data):t.compressedTexImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Y,Te,je,Ve.width,Ve.height,0,Ve.data):Re("WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):D?re&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Y,Te,0,0,Ve.width,Ve.height,Ae,ve,Ve.data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Y,Te,je,Ve.width,Ve.height,0,Ae,ve,Ve.data)}}}else{if(ne=v.mipmaps,D&&he){ne.length>0&&Se++;const Y=le(se[0]);t.texStorage2D(i.TEXTURE_CUBE_MAP,Se,je,Y.width,Y.height)}for(let Y=0;Y<6;Y++)if(ee){D?re&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Y,0,0,0,se[Y].width,se[Y].height,Ae,ve,se[Y].data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Y,0,je,se[Y].width,se[Y].height,0,Ae,ve,se[Y].data);for(let Te=0;Te<ne.length;Te++){const gt=ne[Te].image[Y].image;D?re&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Y,Te+1,0,0,gt.width,gt.height,Ae,ve,gt.data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Y,Te+1,je,gt.width,gt.height,0,Ae,ve,gt.data)}}else{D?re&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Y,0,0,0,Ae,ve,se[Y]):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Y,0,je,Ae,ve,se[Y]);for(let Te=0;Te<ne.length;Te++){const Ve=ne[Te];D?re&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Y,Te+1,0,0,Ae,ve,Ve.image[Y]):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Y,Te+1,je,Ae,ve,Ve.image[Y])}}}p(v)&&m(i.TEXTURE_CUBE_MAP),K.__version=$.version,v.onUpdate&&v.onUpdate(v)}A.__version=v.version}function oe(A,v,I,X,$,K){const Ee=r.convert(I.format,I.colorSpace),ce=r.convert(I.type),Le=y(I.internalFormat,Ee,ce,I.colorSpace),Fe=n.get(v),ee=n.get(I);if(ee.__renderTarget=v,!Fe.__hasExternalTextures){const se=Math.max(1,v.width>>K),be=Math.max(1,v.height>>K);$===i.TEXTURE_3D||$===i.TEXTURE_2D_ARRAY?t.texImage3D($,K,Le,se,be,v.depth,0,Ee,ce,null):t.texImage2D($,K,Le,se,be,0,Ee,ce,null)}t.bindFramebuffer(i.FRAMEBUFFER,A),Ne(v)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,X,$,ee.__webglTexture,0,R(v)):($===i.TEXTURE_2D||$>=i.TEXTURE_CUBE_MAP_POSITIVE_X&&$<=i.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&i.framebufferTexture2D(i.FRAMEBUFFER,X,$,ee.__webglTexture,K),t.bindFramebuffer(i.FRAMEBUFFER,null)}function Ue(A,v,I){if(i.bindRenderbuffer(i.RENDERBUFFER,A),v.depthBuffer){const X=v.depthTexture,$=X&&X.isDepthTexture?X.type:null,K=S(v.stencilBuffer,$),Ee=v.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;Ne(v)?o.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,R(v),K,v.width,v.height):I?i.renderbufferStorageMultisample(i.RENDERBUFFER,R(v),K,v.width,v.height):i.renderbufferStorage(i.RENDERBUFFER,K,v.width,v.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,Ee,i.RENDERBUFFER,A)}else{const X=v.textures;for(let $=0;$<X.length;$++){const K=X[$],Ee=r.convert(K.format,K.colorSpace),ce=r.convert(K.type),Le=y(K.internalFormat,Ee,ce,K.colorSpace);Ne(v)?o.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,R(v),Le,v.width,v.height):I?i.renderbufferStorageMultisample(i.RENDERBUFFER,R(v),Le,v.width,v.height):i.renderbufferStorage(i.RENDERBUFFER,Le,v.width,v.height)}}i.bindRenderbuffer(i.RENDERBUFFER,null)}function Ie(A,v,I){const X=v.isWebGLCubeRenderTarget===!0;if(t.bindFramebuffer(i.FRAMEBUFFER,A),!(v.depthTexture&&v.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");const $=n.get(v.depthTexture);if($.__renderTarget=v,(!$.__webglTexture||v.depthTexture.image.width!==v.width||v.depthTexture.image.height!==v.height)&&(v.depthTexture.image.width=v.width,v.depthTexture.image.height=v.height,v.depthTexture.needsUpdate=!0),X){if($.__webglInit===void 0&&($.__webglInit=!0,v.depthTexture.addEventListener("dispose",T)),$.__webglTexture===void 0){$.__webglTexture=i.createTexture(),t.bindTexture(i.TEXTURE_CUBE_MAP,$.__webglTexture),ge(i.TEXTURE_CUBE_MAP,v.depthTexture);const Fe=r.convert(v.depthTexture.format),ee=r.convert(v.depthTexture.type);let se;v.depthTexture.format===fi?se=i.DEPTH_COMPONENT24:v.depthTexture.format===Wi&&(se=i.DEPTH24_STENCIL8);for(let be=0;be<6;be++)i.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+be,0,se,v.width,v.height,0,Fe,ee,null)}}else z(v.depthTexture,0);const K=$.__webglTexture,Ee=R(v),ce=X?i.TEXTURE_CUBE_MAP_POSITIVE_X+I:i.TEXTURE_2D,Le=v.depthTexture.format===Wi?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;if(v.depthTexture.format===fi)Ne(v)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,Le,ce,K,0,Ee):i.framebufferTexture2D(i.FRAMEBUFFER,Le,ce,K,0);else if(v.depthTexture.format===Wi)Ne(v)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,Le,ce,K,0,Ee):i.framebufferTexture2D(i.FRAMEBUFFER,Le,ce,K,0);else throw new Error("Unknown depthTexture format")}function He(A){const v=n.get(A),I=A.isWebGLCubeRenderTarget===!0;if(v.__boundDepthTexture!==A.depthTexture){const X=A.depthTexture;if(v.__depthDisposeCallback&&v.__depthDisposeCallback(),X){const $=()=>{delete v.__boundDepthTexture,delete v.__depthDisposeCallback,X.removeEventListener("dispose",$)};X.addEventListener("dispose",$),v.__depthDisposeCallback=$}v.__boundDepthTexture=X}if(A.depthTexture&&!v.__autoAllocateDepthBuffer)if(I)for(let X=0;X<6;X++)Ie(v.__webglFramebuffer[X],A,X);else{const X=A.texture.mipmaps;X&&X.length>0?Ie(v.__webglFramebuffer[0],A,0):Ie(v.__webglFramebuffer,A,0)}else if(I){v.__webglDepthbuffer=[];for(let X=0;X<6;X++)if(t.bindFramebuffer(i.FRAMEBUFFER,v.__webglFramebuffer[X]),v.__webglDepthbuffer[X]===void 0)v.__webglDepthbuffer[X]=i.createRenderbuffer(),Ue(v.__webglDepthbuffer[X],A,!1);else{const $=A.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,K=v.__webglDepthbuffer[X];i.bindRenderbuffer(i.RENDERBUFFER,K),i.framebufferRenderbuffer(i.FRAMEBUFFER,$,i.RENDERBUFFER,K)}}else{const X=A.texture.mipmaps;if(X&&X.length>0?t.bindFramebuffer(i.FRAMEBUFFER,v.__webglFramebuffer[0]):t.bindFramebuffer(i.FRAMEBUFFER,v.__webglFramebuffer),v.__webglDepthbuffer===void 0)v.__webglDepthbuffer=i.createRenderbuffer(),Ue(v.__webglDepthbuffer,A,!1);else{const $=A.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,K=v.__webglDepthbuffer;i.bindRenderbuffer(i.RENDERBUFFER,K),i.framebufferRenderbuffer(i.FRAMEBUFFER,$,i.RENDERBUFFER,K)}}t.bindFramebuffer(i.FRAMEBUFFER,null)}function ht(A,v,I){const X=n.get(A);v!==void 0&&oe(X.__webglFramebuffer,A,A.texture,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,0),I!==void 0&&He(A)}function Xe(A){const v=A.texture,I=n.get(A),X=n.get(v);A.addEventListener("dispose",L);const $=A.textures,K=A.isWebGLCubeRenderTarget===!0,Ee=$.length>1;if(Ee||(X.__webglTexture===void 0&&(X.__webglTexture=i.createTexture()),X.__version=v.version,a.memory.textures++),K){I.__webglFramebuffer=[];for(let ce=0;ce<6;ce++)if(v.mipmaps&&v.mipmaps.length>0){I.__webglFramebuffer[ce]=[];for(let Le=0;Le<v.mipmaps.length;Le++)I.__webglFramebuffer[ce][Le]=i.createFramebuffer()}else I.__webglFramebuffer[ce]=i.createFramebuffer()}else{if(v.mipmaps&&v.mipmaps.length>0){I.__webglFramebuffer=[];for(let ce=0;ce<v.mipmaps.length;ce++)I.__webglFramebuffer[ce]=i.createFramebuffer()}else I.__webglFramebuffer=i.createFramebuffer();if(Ee)for(let ce=0,Le=$.length;ce<Le;ce++){const Fe=n.get($[ce]);Fe.__webglTexture===void 0&&(Fe.__webglTexture=i.createTexture(),a.memory.textures++)}if(A.samples>0&&Ne(A)===!1){I.__webglMultisampledFramebuffer=i.createFramebuffer(),I.__webglColorRenderbuffer=[],t.bindFramebuffer(i.FRAMEBUFFER,I.__webglMultisampledFramebuffer);for(let ce=0;ce<$.length;ce++){const Le=$[ce];I.__webglColorRenderbuffer[ce]=i.createRenderbuffer(),i.bindRenderbuffer(i.RENDERBUFFER,I.__webglColorRenderbuffer[ce]);const Fe=r.convert(Le.format,Le.colorSpace),ee=r.convert(Le.type),se=y(Le.internalFormat,Fe,ee,Le.colorSpace,A.isXRRenderTarget===!0),be=R(A);i.renderbufferStorageMultisample(i.RENDERBUFFER,be,se,A.width,A.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+ce,i.RENDERBUFFER,I.__webglColorRenderbuffer[ce])}i.bindRenderbuffer(i.RENDERBUFFER,null),A.depthBuffer&&(I.__webglDepthRenderbuffer=i.createRenderbuffer(),Ue(I.__webglDepthRenderbuffer,A,!0)),t.bindFramebuffer(i.FRAMEBUFFER,null)}}if(K){t.bindTexture(i.TEXTURE_CUBE_MAP,X.__webglTexture),ge(i.TEXTURE_CUBE_MAP,v);for(let ce=0;ce<6;ce++)if(v.mipmaps&&v.mipmaps.length>0)for(let Le=0;Le<v.mipmaps.length;Le++)oe(I.__webglFramebuffer[ce][Le],A,v,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+ce,Le);else oe(I.__webglFramebuffer[ce],A,v,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+ce,0);p(v)&&m(i.TEXTURE_CUBE_MAP),t.unbindTexture()}else if(Ee){for(let ce=0,Le=$.length;ce<Le;ce++){const Fe=$[ce],ee=n.get(Fe);let se=i.TEXTURE_2D;(A.isWebGL3DRenderTarget||A.isWebGLArrayRenderTarget)&&(se=A.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),t.bindTexture(se,ee.__webglTexture),ge(se,Fe),oe(I.__webglFramebuffer,A,Fe,i.COLOR_ATTACHMENT0+ce,se,0),p(Fe)&&m(se)}t.unbindTexture()}else{let ce=i.TEXTURE_2D;if((A.isWebGL3DRenderTarget||A.isWebGLArrayRenderTarget)&&(ce=A.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),t.bindTexture(ce,X.__webglTexture),ge(ce,v),v.mipmaps&&v.mipmaps.length>0)for(let Le=0;Le<v.mipmaps.length;Le++)oe(I.__webglFramebuffer[Le],A,v,i.COLOR_ATTACHMENT0,ce,Le);else oe(I.__webglFramebuffer,A,v,i.COLOR_ATTACHMENT0,ce,0);p(v)&&m(ce),t.unbindTexture()}A.depthBuffer&&He(A)}function J(A){const v=A.textures;for(let I=0,X=v.length;I<X;I++){const $=v[I];if(p($)){const K=M(A),Ee=n.get($).__webglTexture;t.bindTexture(K,Ee),m(K),t.unbindTexture()}}}const te=[],Z=[];function de(A){if(A.samples>0){if(Ne(A)===!1){const v=A.textures,I=A.width,X=A.height;let $=i.COLOR_BUFFER_BIT;const K=A.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,Ee=n.get(A),ce=v.length>1;if(ce)for(let Fe=0;Fe<v.length;Fe++)t.bindFramebuffer(i.FRAMEBUFFER,Ee.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+Fe,i.RENDERBUFFER,null),t.bindFramebuffer(i.FRAMEBUFFER,Ee.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+Fe,i.TEXTURE_2D,null,0);t.bindFramebuffer(i.READ_FRAMEBUFFER,Ee.__webglMultisampledFramebuffer);const Le=A.texture.mipmaps;Le&&Le.length>0?t.bindFramebuffer(i.DRAW_FRAMEBUFFER,Ee.__webglFramebuffer[0]):t.bindFramebuffer(i.DRAW_FRAMEBUFFER,Ee.__webglFramebuffer);for(let Fe=0;Fe<v.length;Fe++){if(A.resolveDepthBuffer&&(A.depthBuffer&&($|=i.DEPTH_BUFFER_BIT),A.stencilBuffer&&A.resolveStencilBuffer&&($|=i.STENCIL_BUFFER_BIT)),ce){i.framebufferRenderbuffer(i.READ_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.RENDERBUFFER,Ee.__webglColorRenderbuffer[Fe]);const ee=n.get(v[Fe]).__webglTexture;i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,ee,0)}i.blitFramebuffer(0,0,I,X,0,0,I,X,$,i.NEAREST),l===!0&&(te.length=0,Z.length=0,te.push(i.COLOR_ATTACHMENT0+Fe),A.depthBuffer&&A.resolveDepthBuffer===!1&&(te.push(K),Z.push(K),i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,Z)),i.invalidateFramebuffer(i.READ_FRAMEBUFFER,te))}if(t.bindFramebuffer(i.READ_FRAMEBUFFER,null),t.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),ce)for(let Fe=0;Fe<v.length;Fe++){t.bindFramebuffer(i.FRAMEBUFFER,Ee.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+Fe,i.RENDERBUFFER,Ee.__webglColorRenderbuffer[Fe]);const ee=n.get(v[Fe]).__webglTexture;t.bindFramebuffer(i.FRAMEBUFFER,Ee.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+Fe,i.TEXTURE_2D,ee,0)}t.bindFramebuffer(i.DRAW_FRAMEBUFFER,Ee.__webglMultisampledFramebuffer)}else if(A.depthBuffer&&A.resolveDepthBuffer===!1&&l){const v=A.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,[v])}}}function R(A){return Math.min(s.maxSamples,A.samples)}function Ne(A){const v=n.get(A);return A.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&v.__useRenderToTexture!==!1}function xe(A){const v=a.render.frame;h.get(A)!==v&&(h.set(A,v),A.update())}function Oe(A,v){const I=A.colorSpace,X=A.format,$=A.type;return A.isCompressedTexture===!0||A.isVideoTexture===!0||I!==Zt&&I!==Ti&&(Qe.getTransfer(I)===nt?(X!==_n||$!==on)&&Re("WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):Be("WebGLTextures: Unsupported texture color space:",I)),v}function le(A){return typeof HTMLImageElement<"u"&&A instanceof HTMLImageElement?(c.width=A.naturalWidth||A.width,c.height=A.naturalHeight||A.height):typeof VideoFrame<"u"&&A instanceof VideoFrame?(c.width=A.displayWidth,c.height=A.displayHeight):(c.width=A.width,c.height=A.height),c}this.allocateTextureUnit=F,this.resetTextureUnits=O,this.setTexture2D=z,this.setTexture2DArray=H,this.setTexture3D=B,this.setTextureCube=ie,this.rebindTextures=ht,this.setupRenderTarget=Xe,this.updateRenderTargetMipmap=J,this.updateMultisampleRenderTarget=de,this.setupDepthRenderbuffer=He,this.setupFrameBufferTexture=oe,this.useMultisampledRTT=Ne,this.isReversedDepthBuffer=function(){return t.buffers.depth.getReversed()}}function IS(i,e){function t(n,s=Ti){let r;const a=Qe.getTransfer(s);if(n===on)return i.UNSIGNED_BYTE;if(n===Ph)return i.UNSIGNED_SHORT_4_4_4_4;if(n===Lh)return i.UNSIGNED_SHORT_5_5_5_1;if(n===sp)return i.UNSIGNED_INT_5_9_9_9_REV;if(n===rp)return i.UNSIGNED_INT_10F_11F_11F_REV;if(n===np)return i.BYTE;if(n===ip)return i.SHORT;if(n===$r)return i.UNSIGNED_SHORT;if(n===Rh)return i.INT;if(n===jn)return i.UNSIGNED_INT;if(n===gn)return i.FLOAT;if(n===ln)return i.HALF_FLOAT;if(n===ap)return i.ALPHA;if(n===op)return i.RGB;if(n===_n)return i.RGBA;if(n===fi)return i.DEPTH_COMPONENT;if(n===Wi)return i.DEPTH_STENCIL;if(n===Dh)return i.RED;if(n===Ih)return i.RED_INTEGER;if(n===Xs)return i.RG;if(n===Nh)return i.RG_INTEGER;if(n===Uh)return i.RGBA_INTEGER;if(n===_o||n===xo||n===vo||n===Mo)if(a===nt)if(r=e.get("WEBGL_compressed_texture_s3tc_srgb"),r!==null){if(n===_o)return r.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===xo)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===vo)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===Mo)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(r=e.get("WEBGL_compressed_texture_s3tc"),r!==null){if(n===_o)return r.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===xo)return r.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===vo)return r.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===Mo)return r.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(n===_c||n===xc||n===vc||n===Mc)if(r=e.get("WEBGL_compressed_texture_pvrtc"),r!==null){if(n===_c)return r.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===xc)return r.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===vc)return r.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===Mc)return r.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(n===yc||n===Sc||n===Ec||n===bc||n===Tc||n===Ac||n===wc)if(r=e.get("WEBGL_compressed_texture_etc"),r!==null){if(n===yc||n===Sc)return a===nt?r.COMPRESSED_SRGB8_ETC2:r.COMPRESSED_RGB8_ETC2;if(n===Ec)return a===nt?r.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:r.COMPRESSED_RGBA8_ETC2_EAC;if(n===bc)return r.COMPRESSED_R11_EAC;if(n===Tc)return r.COMPRESSED_SIGNED_R11_EAC;if(n===Ac)return r.COMPRESSED_RG11_EAC;if(n===wc)return r.COMPRESSED_SIGNED_RG11_EAC}else return null;if(n===Cc||n===Rc||n===Pc||n===Lc||n===Dc||n===Ic||n===Nc||n===Uc||n===Oc||n===Fc||n===Bc||n===zc||n===kc||n===Hc)if(r=e.get("WEBGL_compressed_texture_astc"),r!==null){if(n===Cc)return a===nt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:r.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===Rc)return a===nt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:r.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===Pc)return a===nt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:r.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===Lc)return a===nt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:r.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===Dc)return a===nt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:r.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===Ic)return a===nt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:r.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===Nc)return a===nt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:r.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===Uc)return a===nt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:r.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===Oc)return a===nt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:r.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===Fc)return a===nt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:r.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===Bc)return a===nt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:r.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===zc)return a===nt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:r.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===kc)return a===nt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:r.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===Hc)return a===nt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:r.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(n===Gc||n===Vc||n===Wc)if(r=e.get("EXT_texture_compression_bptc"),r!==null){if(n===Gc)return a===nt?r.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:r.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===Vc)return r.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===Wc)return r.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(n===Xc||n===Kc||n===Yc||n===qc)if(r=e.get("EXT_texture_compression_rgtc"),r!==null){if(n===Xc)return r.COMPRESSED_RED_RGTC1_EXT;if(n===Kc)return r.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===Yc)return r.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===qc)return r.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return n===Jr?i.UNSIGNED_INT_24_8:i[n]!==void 0?i[n]:null}return{convert:t}}const NS=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,US=`
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

}`;class OS{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t){if(this.texture===null){const n=new _p(e.texture);(e.depthNear!==t.depthNear||e.depthFar!==t.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=n}}getMesh(e){if(this.texture!==null&&this.mesh===null){const t=e.cameras[0].viewport,n=new Gt({vertexShader:NS,fragmentShader:US,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new st(new Pi(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class FS extends Zi{constructor(e,t){super();const n=this;let s=null,r=1,a=null,o="local-floor",l=1,c=null,h=null,u=null,d=null,f=null,g=null;const _=typeof XRWebGLBinding<"u",p=new OS,m={},M=t.getContextAttributes();let y=null,S=null;const w=[],T=[],L=new j;let x=null;const E=new $t;E.viewport=new it;const N=new $t;N.viewport=new it;const C=[E,N],O=new L_;let F=null,V=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(q){let ae=w[q];return ae===void 0&&(ae=new fl,w[q]=ae),ae.getTargetRaySpace()},this.getControllerGrip=function(q){let ae=w[q];return ae===void 0&&(ae=new fl,w[q]=ae),ae.getGripSpace()},this.getHand=function(q){let ae=w[q];return ae===void 0&&(ae=new fl,w[q]=ae),ae.getHandSpace()};function z(q){const ae=T.indexOf(q.inputSource);if(ae===-1)return;const oe=w[ae];oe!==void 0&&(oe.update(q.inputSource,q.frame,c||a),oe.dispatchEvent({type:q.type,data:q.inputSource}))}function H(){s.removeEventListener("select",z),s.removeEventListener("selectstart",z),s.removeEventListener("selectend",z),s.removeEventListener("squeeze",z),s.removeEventListener("squeezestart",z),s.removeEventListener("squeezeend",z),s.removeEventListener("end",H),s.removeEventListener("inputsourceschange",B);for(let q=0;q<w.length;q++){const ae=T[q];ae!==null&&(T[q]=null,w[q].disconnect(ae))}F=null,V=null,p.reset();for(const q in m)delete m[q];e.setRenderTarget(y),f=null,d=null,u=null,s=null,S=null,ct.stop(),n.isPresenting=!1,e.setPixelRatio(x),e.setSize(L.width,L.height,!1),n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(q){r=q,n.isPresenting===!0&&Re("WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(q){o=q,n.isPresenting===!0&&Re("WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||a},this.setReferenceSpace=function(q){c=q},this.getBaseLayer=function(){return d!==null?d:f},this.getBinding=function(){return u===null&&_&&(u=new XRWebGLBinding(s,t)),u},this.getFrame=function(){return g},this.getSession=function(){return s},this.setSession=async function(q){if(s=q,s!==null){if(y=e.getRenderTarget(),s.addEventListener("select",z),s.addEventListener("selectstart",z),s.addEventListener("selectend",z),s.addEventListener("squeeze",z),s.addEventListener("squeezestart",z),s.addEventListener("squeezeend",z),s.addEventListener("end",H),s.addEventListener("inputsourceschange",B),M.xrCompatible!==!0&&await t.makeXRCompatible(),x=e.getPixelRatio(),e.getSize(L),_&&"createProjectionLayer"in XRWebGLBinding.prototype){let oe=null,Ue=null,Ie=null;M.depth&&(Ie=M.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,oe=M.stencil?Wi:fi,Ue=M.stencil?Jr:jn);const He={colorFormat:t.RGBA8,depthFormat:Ie,scaleFactor:r};u=this.getBinding(),d=u.createProjectionLayer(He),s.updateRenderState({layers:[d]}),e.setPixelRatio(1),e.setSize(d.textureWidth,d.textureHeight,!1),S=new nn(d.textureWidth,d.textureHeight,{format:_n,type:on,depthTexture:new na(d.textureWidth,d.textureHeight,Ue,void 0,void 0,void 0,void 0,void 0,void 0,oe),stencilBuffer:M.stencil,colorSpace:e.outputColorSpace,samples:M.antialias?4:0,resolveDepthBuffer:d.ignoreDepthValues===!1,resolveStencilBuffer:d.ignoreDepthValues===!1})}else{const oe={antialias:M.antialias,alpha:!0,depth:M.depth,stencil:M.stencil,framebufferScaleFactor:r};f=new XRWebGLLayer(s,t,oe),s.updateRenderState({baseLayer:f}),e.setPixelRatio(1),e.setSize(f.framebufferWidth,f.framebufferHeight,!1),S=new nn(f.framebufferWidth,f.framebufferHeight,{format:_n,type:on,colorSpace:e.outputColorSpace,stencilBuffer:M.stencil,resolveDepthBuffer:f.ignoreDepthValues===!1,resolveStencilBuffer:f.ignoreDepthValues===!1})}S.isXRRenderTarget=!0,this.setFoveation(l),c=null,a=await s.requestReferenceSpace(o),ct.setContext(s),ct.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(s!==null)return s.environmentBlendMode},this.getDepthTexture=function(){return p.getDepthTexture()};function B(q){for(let ae=0;ae<q.removed.length;ae++){const oe=q.removed[ae],Ue=T.indexOf(oe);Ue>=0&&(T[Ue]=null,w[Ue].disconnect(oe))}for(let ae=0;ae<q.added.length;ae++){const oe=q.added[ae];let Ue=T.indexOf(oe);if(Ue===-1){for(let He=0;He<w.length;He++)if(He>=T.length){T.push(oe),Ue=He;break}else if(T[He]===null){T[He]=oe,Ue=He;break}if(Ue===-1)break}const Ie=w[Ue];Ie&&Ie.connect(oe)}}const ie=new P,Q=new P;function me(q,ae,oe){ie.setFromMatrixPosition(ae.matrixWorld),Q.setFromMatrixPosition(oe.matrixWorld);const Ue=ie.distanceTo(Q),Ie=ae.projectionMatrix.elements,He=oe.projectionMatrix.elements,ht=Ie[14]/(Ie[10]-1),Xe=Ie[14]/(Ie[10]+1),J=(Ie[9]+1)/Ie[5],te=(Ie[9]-1)/Ie[5],Z=(Ie[8]-1)/Ie[0],de=(He[8]+1)/He[0],R=ht*Z,Ne=ht*de,xe=Ue/(-Z+de),Oe=xe*-Z;if(ae.matrixWorld.decompose(q.position,q.quaternion,q.scale),q.translateX(Oe),q.translateZ(xe),q.matrixWorld.compose(q.position,q.quaternion,q.scale),q.matrixWorldInverse.copy(q.matrixWorld).invert(),Ie[10]===-1)q.projectionMatrix.copy(ae.projectionMatrix),q.projectionMatrixInverse.copy(ae.projectionMatrixInverse);else{const le=ht+xe,A=Xe+xe,v=R-Oe,I=Ne+(Ue-Oe),X=J*Xe/A*le,$=te*Xe/A*le;q.projectionMatrix.makePerspective(v,I,X,$,le,A),q.projectionMatrixInverse.copy(q.projectionMatrix).invert()}}function _e(q,ae){ae===null?q.matrixWorld.copy(q.matrix):q.matrixWorld.multiplyMatrices(ae.matrixWorld,q.matrix),q.matrixWorldInverse.copy(q.matrixWorld).invert()}this.updateCamera=function(q){if(s===null)return;let ae=q.near,oe=q.far;p.texture!==null&&(p.depthNear>0&&(ae=p.depthNear),p.depthFar>0&&(oe=p.depthFar)),O.near=N.near=E.near=ae,O.far=N.far=E.far=oe,(F!==O.near||V!==O.far)&&(s.updateRenderState({depthNear:O.near,depthFar:O.far}),F=O.near,V=O.far),O.layers.mask=q.layers.mask|6,E.layers.mask=O.layers.mask&-5,N.layers.mask=O.layers.mask&-3;const Ue=q.parent,Ie=O.cameras;_e(O,Ue);for(let He=0;He<Ie.length;He++)_e(Ie[He],Ue);Ie.length===2?me(O,E,N):O.projectionMatrix.copy(E.projectionMatrix),ge(q,O,Ue)};function ge(q,ae,oe){oe===null?q.matrix.copy(ae.matrixWorld):(q.matrix.copy(oe.matrixWorld),q.matrix.invert(),q.matrix.multiply(ae.matrixWorld)),q.matrix.decompose(q.position,q.quaternion,q.scale),q.updateMatrixWorld(!0),q.projectionMatrix.copy(ae.projectionMatrix),q.projectionMatrixInverse.copy(ae.projectionMatrixInverse),q.isPerspectiveCamera&&(q.fov=Ks*2*Math.atan(1/q.projectionMatrix.elements[5]),q.zoom=1)}this.getCamera=function(){return O},this.getFoveation=function(){if(!(d===null&&f===null))return l},this.setFoveation=function(q){l=q,d!==null&&(d.fixedFoveation=q),f!==null&&f.fixedFoveation!==void 0&&(f.fixedFoveation=q)},this.hasDepthSensing=function(){return p.texture!==null},this.getDepthSensingMesh=function(){return p.getMesh(O)},this.getCameraTexture=function(q){return m[q]};let ke=null;function rt(q,ae){if(h=ae.getViewerPose(c||a),g=ae,h!==null){const oe=h.views;f!==null&&(e.setRenderTargetFramebuffer(S,f.framebuffer),e.setRenderTarget(S));let Ue=!1;oe.length!==O.cameras.length&&(O.cameras.length=0,Ue=!0);for(let Xe=0;Xe<oe.length;Xe++){const J=oe[Xe];let te=null;if(f!==null)te=f.getViewport(J);else{const de=u.getViewSubImage(d,J);te=de.viewport,Xe===0&&(e.setRenderTargetTextures(S,de.colorTexture,de.depthStencilTexture),e.setRenderTarget(S))}let Z=C[Xe];Z===void 0&&(Z=new $t,Z.layers.enable(Xe),Z.viewport=new it,C[Xe]=Z),Z.matrix.fromArray(J.transform.matrix),Z.matrix.decompose(Z.position,Z.quaternion,Z.scale),Z.projectionMatrix.fromArray(J.projectionMatrix),Z.projectionMatrixInverse.copy(Z.projectionMatrix).invert(),Z.viewport.set(te.x,te.y,te.width,te.height),Xe===0&&(O.matrix.copy(Z.matrix),O.matrix.decompose(O.position,O.quaternion,O.scale)),Ue===!0&&O.cameras.push(Z)}const Ie=s.enabledFeatures;if(Ie&&Ie.includes("depth-sensing")&&s.depthUsage=="gpu-optimized"&&_){u=n.getBinding();const Xe=u.getDepthInformation(oe[0]);Xe&&Xe.isValid&&Xe.texture&&p.init(Xe,s.renderState)}if(Ie&&Ie.includes("camera-access")&&_){e.state.unbindTexture(),u=n.getBinding();for(let Xe=0;Xe<oe.length;Xe++){const J=oe[Xe].camera;if(J){let te=m[J];te||(te=new _p,m[J]=te);const Z=u.getCameraImage(J);te.sourceTexture=Z}}}}for(let oe=0;oe<w.length;oe++){const Ue=T[oe],Ie=w[oe];Ue!==null&&Ie!==void 0&&Ie.update(Ue,ae,c||a)}ke&&ke(q,ae),ae.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:ae}),g=null}const ct=new Ip;ct.setAnimationLoop(rt),this.setAnimationLoop=function(q){ke=q},this.dispose=function(){}}}const Bi=new Nn,BS=new We;function zS(i,e){function t(p,m){p.matrixAutoUpdate===!0&&p.updateMatrix(),m.value.copy(p.matrix)}function n(p,m){m.color.getRGB(p.fogColor.value,Ap(i)),m.isFog?(p.fogNear.value=m.near,p.fogFar.value=m.far):m.isFogExp2&&(p.fogDensity.value=m.density)}function s(p,m,M,y,S){m.isMeshBasicMaterial?r(p,m):m.isMeshLambertMaterial?(r(p,m),m.envMap&&(p.envMapIntensity.value=m.envMapIntensity)):m.isMeshToonMaterial?(r(p,m),u(p,m)):m.isMeshPhongMaterial?(r(p,m),h(p,m),m.envMap&&(p.envMapIntensity.value=m.envMapIntensity)):m.isMeshStandardMaterial?(r(p,m),d(p,m),m.isMeshPhysicalMaterial&&f(p,m,S)):m.isMeshMatcapMaterial?(r(p,m),g(p,m)):m.isMeshDepthMaterial?r(p,m):m.isMeshDistanceMaterial?(r(p,m),_(p,m)):m.isMeshNormalMaterial?r(p,m):m.isLineBasicMaterial?(a(p,m),m.isLineDashedMaterial&&o(p,m)):m.isPointsMaterial?l(p,m,M,y):m.isSpriteMaterial?c(p,m):m.isShadowMaterial?(p.color.value.copy(m.color),p.opacity.value=m.opacity):m.isShaderMaterial&&(m.uniformsNeedUpdate=!1)}function r(p,m){p.opacity.value=m.opacity,m.color&&p.diffuse.value.copy(m.color),m.emissive&&p.emissive.value.copy(m.emissive).multiplyScalar(m.emissiveIntensity),m.map&&(p.map.value=m.map,t(m.map,p.mapTransform)),m.alphaMap&&(p.alphaMap.value=m.alphaMap,t(m.alphaMap,p.alphaMapTransform)),m.bumpMap&&(p.bumpMap.value=m.bumpMap,t(m.bumpMap,p.bumpMapTransform),p.bumpScale.value=m.bumpScale,m.side===Jt&&(p.bumpScale.value*=-1)),m.normalMap&&(p.normalMap.value=m.normalMap,t(m.normalMap,p.normalMapTransform),p.normalScale.value.copy(m.normalScale),m.side===Jt&&p.normalScale.value.negate()),m.displacementMap&&(p.displacementMap.value=m.displacementMap,t(m.displacementMap,p.displacementMapTransform),p.displacementScale.value=m.displacementScale,p.displacementBias.value=m.displacementBias),m.emissiveMap&&(p.emissiveMap.value=m.emissiveMap,t(m.emissiveMap,p.emissiveMapTransform)),m.specularMap&&(p.specularMap.value=m.specularMap,t(m.specularMap,p.specularMapTransform)),m.alphaTest>0&&(p.alphaTest.value=m.alphaTest);const M=e.get(m),y=M.envMap,S=M.envMapRotation;y&&(p.envMap.value=y,Bi.copy(S),Bi.x*=-1,Bi.y*=-1,Bi.z*=-1,y.isCubeTexture&&y.isRenderTargetTexture===!1&&(Bi.y*=-1,Bi.z*=-1),p.envMapRotation.value.setFromMatrix4(BS.makeRotationFromEuler(Bi)),p.flipEnvMap.value=y.isCubeTexture&&y.isRenderTargetTexture===!1?-1:1,p.reflectivity.value=m.reflectivity,p.ior.value=m.ior,p.refractionRatio.value=m.refractionRatio),m.lightMap&&(p.lightMap.value=m.lightMap,p.lightMapIntensity.value=m.lightMapIntensity,t(m.lightMap,p.lightMapTransform)),m.aoMap&&(p.aoMap.value=m.aoMap,p.aoMapIntensity.value=m.aoMapIntensity,t(m.aoMap,p.aoMapTransform))}function a(p,m){p.diffuse.value.copy(m.color),p.opacity.value=m.opacity,m.map&&(p.map.value=m.map,t(m.map,p.mapTransform))}function o(p,m){p.dashSize.value=m.dashSize,p.totalSize.value=m.dashSize+m.gapSize,p.scale.value=m.scale}function l(p,m,M,y){p.diffuse.value.copy(m.color),p.opacity.value=m.opacity,p.size.value=m.size*M,p.scale.value=y*.5,m.map&&(p.map.value=m.map,t(m.map,p.uvTransform)),m.alphaMap&&(p.alphaMap.value=m.alphaMap,t(m.alphaMap,p.alphaMapTransform)),m.alphaTest>0&&(p.alphaTest.value=m.alphaTest)}function c(p,m){p.diffuse.value.copy(m.color),p.opacity.value=m.opacity,p.rotation.value=m.rotation,m.map&&(p.map.value=m.map,t(m.map,p.mapTransform)),m.alphaMap&&(p.alphaMap.value=m.alphaMap,t(m.alphaMap,p.alphaMapTransform)),m.alphaTest>0&&(p.alphaTest.value=m.alphaTest)}function h(p,m){p.specular.value.copy(m.specular),p.shininess.value=Math.max(m.shininess,1e-4)}function u(p,m){m.gradientMap&&(p.gradientMap.value=m.gradientMap)}function d(p,m){p.metalness.value=m.metalness,m.metalnessMap&&(p.metalnessMap.value=m.metalnessMap,t(m.metalnessMap,p.metalnessMapTransform)),p.roughness.value=m.roughness,m.roughnessMap&&(p.roughnessMap.value=m.roughnessMap,t(m.roughnessMap,p.roughnessMapTransform)),m.envMap&&(p.envMapIntensity.value=m.envMapIntensity)}function f(p,m,M){p.ior.value=m.ior,m.sheen>0&&(p.sheenColor.value.copy(m.sheenColor).multiplyScalar(m.sheen),p.sheenRoughness.value=m.sheenRoughness,m.sheenColorMap&&(p.sheenColorMap.value=m.sheenColorMap,t(m.sheenColorMap,p.sheenColorMapTransform)),m.sheenRoughnessMap&&(p.sheenRoughnessMap.value=m.sheenRoughnessMap,t(m.sheenRoughnessMap,p.sheenRoughnessMapTransform))),m.clearcoat>0&&(p.clearcoat.value=m.clearcoat,p.clearcoatRoughness.value=m.clearcoatRoughness,m.clearcoatMap&&(p.clearcoatMap.value=m.clearcoatMap,t(m.clearcoatMap,p.clearcoatMapTransform)),m.clearcoatRoughnessMap&&(p.clearcoatRoughnessMap.value=m.clearcoatRoughnessMap,t(m.clearcoatRoughnessMap,p.clearcoatRoughnessMapTransform)),m.clearcoatNormalMap&&(p.clearcoatNormalMap.value=m.clearcoatNormalMap,t(m.clearcoatNormalMap,p.clearcoatNormalMapTransform),p.clearcoatNormalScale.value.copy(m.clearcoatNormalScale),m.side===Jt&&p.clearcoatNormalScale.value.negate())),m.dispersion>0&&(p.dispersion.value=m.dispersion),m.iridescence>0&&(p.iridescence.value=m.iridescence,p.iridescenceIOR.value=m.iridescenceIOR,p.iridescenceThicknessMinimum.value=m.iridescenceThicknessRange[0],p.iridescenceThicknessMaximum.value=m.iridescenceThicknessRange[1],m.iridescenceMap&&(p.iridescenceMap.value=m.iridescenceMap,t(m.iridescenceMap,p.iridescenceMapTransform)),m.iridescenceThicknessMap&&(p.iridescenceThicknessMap.value=m.iridescenceThicknessMap,t(m.iridescenceThicknessMap,p.iridescenceThicknessMapTransform))),m.transmission>0&&(p.transmission.value=m.transmission,p.transmissionSamplerMap.value=M.texture,p.transmissionSamplerSize.value.set(M.width,M.height),m.transmissionMap&&(p.transmissionMap.value=m.transmissionMap,t(m.transmissionMap,p.transmissionMapTransform)),p.thickness.value=m.thickness,m.thicknessMap&&(p.thicknessMap.value=m.thicknessMap,t(m.thicknessMap,p.thicknessMapTransform)),p.attenuationDistance.value=m.attenuationDistance,p.attenuationColor.value.copy(m.attenuationColor)),m.anisotropy>0&&(p.anisotropyVector.value.set(m.anisotropy*Math.cos(m.anisotropyRotation),m.anisotropy*Math.sin(m.anisotropyRotation)),m.anisotropyMap&&(p.anisotropyMap.value=m.anisotropyMap,t(m.anisotropyMap,p.anisotropyMapTransform))),p.specularIntensity.value=m.specularIntensity,p.specularColor.value.copy(m.specularColor),m.specularColorMap&&(p.specularColorMap.value=m.specularColorMap,t(m.specularColorMap,p.specularColorMapTransform)),m.specularIntensityMap&&(p.specularIntensityMap.value=m.specularIntensityMap,t(m.specularIntensityMap,p.specularIntensityMapTransform))}function g(p,m){m.matcap&&(p.matcap.value=m.matcap)}function _(p,m){const M=e.get(m).light;p.referencePosition.value.setFromMatrixPosition(M.matrixWorld),p.nearDistance.value=M.shadow.camera.near,p.farDistance.value=M.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:s}}function kS(i,e,t,n){let s={},r={},a=[];const o=i.getParameter(i.MAX_UNIFORM_BUFFER_BINDINGS);function l(M,y){const S=y.program;n.uniformBlockBinding(M,S)}function c(M,y){let S=s[M.id];S===void 0&&(g(M),S=h(M),s[M.id]=S,M.addEventListener("dispose",p));const w=y.program;n.updateUBOMapping(M,w);const T=e.render.frame;r[M.id]!==T&&(d(M),r[M.id]=T)}function h(M){const y=u();M.__bindingPointIndex=y;const S=i.createBuffer(),w=M.__size,T=M.usage;return i.bindBuffer(i.UNIFORM_BUFFER,S),i.bufferData(i.UNIFORM_BUFFER,w,T),i.bindBuffer(i.UNIFORM_BUFFER,null),i.bindBufferBase(i.UNIFORM_BUFFER,y,S),S}function u(){for(let M=0;M<o;M++)if(a.indexOf(M)===-1)return a.push(M),M;return Be("WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function d(M){const y=s[M.id],S=M.uniforms,w=M.__cache;i.bindBuffer(i.UNIFORM_BUFFER,y);for(let T=0,L=S.length;T<L;T++){const x=Array.isArray(S[T])?S[T]:[S[T]];for(let E=0,N=x.length;E<N;E++){const C=x[E];if(f(C,T,E,w)===!0){const O=C.__offset,F=Array.isArray(C.value)?C.value:[C.value];let V=0;for(let z=0;z<F.length;z++){const H=F[z],B=_(H);typeof H=="number"||typeof H=="boolean"?(C.__data[0]=H,i.bufferSubData(i.UNIFORM_BUFFER,O+V,C.__data)):H.isMatrix3?(C.__data[0]=H.elements[0],C.__data[1]=H.elements[1],C.__data[2]=H.elements[2],C.__data[3]=0,C.__data[4]=H.elements[3],C.__data[5]=H.elements[4],C.__data[6]=H.elements[5],C.__data[7]=0,C.__data[8]=H.elements[6],C.__data[9]=H.elements[7],C.__data[10]=H.elements[8],C.__data[11]=0):(H.toArray(C.__data,V),V+=B.storage/Float32Array.BYTES_PER_ELEMENT)}i.bufferSubData(i.UNIFORM_BUFFER,O,C.__data)}}}i.bindBuffer(i.UNIFORM_BUFFER,null)}function f(M,y,S,w){const T=M.value,L=y+"_"+S;if(w[L]===void 0)return typeof T=="number"||typeof T=="boolean"?w[L]=T:w[L]=T.clone(),!0;{const x=w[L];if(typeof T=="number"||typeof T=="boolean"){if(x!==T)return w[L]=T,!0}else if(x.equals(T)===!1)return x.copy(T),!0}return!1}function g(M){const y=M.uniforms;let S=0;const w=16;for(let L=0,x=y.length;L<x;L++){const E=Array.isArray(y[L])?y[L]:[y[L]];for(let N=0,C=E.length;N<C;N++){const O=E[N],F=Array.isArray(O.value)?O.value:[O.value];for(let V=0,z=F.length;V<z;V++){const H=F[V],B=_(H),ie=S%w,Q=ie%B.boundary,me=ie+Q;S+=Q,me!==0&&w-me<B.storage&&(S+=w-me),O.__data=new Float32Array(B.storage/Float32Array.BYTES_PER_ELEMENT),O.__offset=S,S+=B.storage}}}const T=S%w;return T>0&&(S+=w-T),M.__size=S,M.__cache={},this}function _(M){const y={boundary:0,storage:0};return typeof M=="number"||typeof M=="boolean"?(y.boundary=4,y.storage=4):M.isVector2?(y.boundary=8,y.storage=8):M.isVector3||M.isColor?(y.boundary=16,y.storage=12):M.isVector4?(y.boundary=16,y.storage=16):M.isMatrix3?(y.boundary=48,y.storage=48):M.isMatrix4?(y.boundary=64,y.storage=64):M.isTexture?Re("WebGLRenderer: Texture samplers can not be part of an uniforms group."):Re("WebGLRenderer: Unsupported uniform value type.",M),y}function p(M){const y=M.target;y.removeEventListener("dispose",p);const S=a.indexOf(y.__bindingPointIndex);a.splice(S,1),i.deleteBuffer(s[y.id]),delete s[y.id],delete r[y.id]}function m(){for(const M in s)i.deleteBuffer(s[M]);a=[],s={},r={}}return{bind:l,update:c,dispose:m}}const HS=new Uint16Array([12469,15057,12620,14925,13266,14620,13807,14376,14323,13990,14545,13625,14713,13328,14840,12882,14931,12528,14996,12233,15039,11829,15066,11525,15080,11295,15085,10976,15082,10705,15073,10495,13880,14564,13898,14542,13977,14430,14158,14124,14393,13732,14556,13410,14702,12996,14814,12596,14891,12291,14937,11834,14957,11489,14958,11194,14943,10803,14921,10506,14893,10278,14858,9960,14484,14039,14487,14025,14499,13941,14524,13740,14574,13468,14654,13106,14743,12678,14818,12344,14867,11893,14889,11509,14893,11180,14881,10751,14852,10428,14812,10128,14765,9754,14712,9466,14764,13480,14764,13475,14766,13440,14766,13347,14769,13070,14786,12713,14816,12387,14844,11957,14860,11549,14868,11215,14855,10751,14825,10403,14782,10044,14729,9651,14666,9352,14599,9029,14967,12835,14966,12831,14963,12804,14954,12723,14936,12564,14917,12347,14900,11958,14886,11569,14878,11247,14859,10765,14828,10401,14784,10011,14727,9600,14660,9289,14586,8893,14508,8533,15111,12234,15110,12234,15104,12216,15092,12156,15067,12010,15028,11776,14981,11500,14942,11205,14902,10752,14861,10393,14812,9991,14752,9570,14682,9252,14603,8808,14519,8445,14431,8145,15209,11449,15208,11451,15202,11451,15190,11438,15163,11384,15117,11274,15055,10979,14994,10648,14932,10343,14871,9936,14803,9532,14729,9218,14645,8742,14556,8381,14461,8020,14365,7603,15273,10603,15272,10607,15267,10619,15256,10631,15231,10614,15182,10535,15118,10389,15042,10167,14963,9787,14883,9447,14800,9115,14710,8665,14615,8318,14514,7911,14411,7507,14279,7198,15314,9675,15313,9683,15309,9712,15298,9759,15277,9797,15229,9773,15166,9668,15084,9487,14995,9274,14898,8910,14800,8539,14697,8234,14590,7790,14479,7409,14367,7067,14178,6621,15337,8619,15337,8631,15333,8677,15325,8769,15305,8871,15264,8940,15202,8909,15119,8775,15022,8565,14916,8328,14804,8009,14688,7614,14569,7287,14448,6888,14321,6483,14088,6171,15350,7402,15350,7419,15347,7480,15340,7613,15322,7804,15287,7973,15229,8057,15148,8012,15046,7846,14933,7611,14810,7357,14682,7069,14552,6656,14421,6316,14251,5948,14007,5528,15356,5942,15356,5977,15353,6119,15348,6294,15332,6551,15302,6824,15249,7044,15171,7122,15070,7050,14949,6861,14818,6611,14679,6349,14538,6067,14398,5651,14189,5311,13935,4958,15359,4123,15359,4153,15356,4296,15353,4646,15338,5160,15311,5508,15263,5829,15188,6042,15088,6094,14966,6001,14826,5796,14678,5543,14527,5287,14377,4985,14133,4586,13869,4257,15360,1563,15360,1642,15358,2076,15354,2636,15341,3350,15317,4019,15273,4429,15203,4732,15105,4911,14981,4932,14836,4818,14679,4621,14517,4386,14359,4156,14083,3795,13808,3437,15360,122,15360,137,15358,285,15355,636,15344,1274,15322,2177,15281,2765,15215,3223,15120,3451,14995,3569,14846,3567,14681,3466,14511,3305,14344,3121,14037,2800,13753,2467,15360,0,15360,1,15359,21,15355,89,15346,253,15325,479,15287,796,15225,1148,15133,1492,15008,1749,14856,1882,14685,1886,14506,1783,14324,1608,13996,1398,13702,1183]);let Bn=null;function GS(){return Bn===null&&(Bn=new Wh(HS,16,16,Xs,ln),Bn.name="DFG_LUT",Bn.minFilter=_t,Bn.magFilter=_t,Bn.wrapS=mn,Bn.wrapT=mn,Bn.generateMipmaps=!1,Bn.needsUpdate=!0),Bn}class VS{constructor(e={}){const{canvas:t=wg(),context:n=null,depth:s=!0,stencil:r=!1,alpha:a=!1,antialias:o=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:h="default",failIfMajorPerformanceCaveat:u=!1,reversedDepthBuffer:d=!1,outputBufferType:f=on}=e;this.isWebGLRenderer=!0;let g;if(n!==null){if(typeof WebGLRenderingContext<"u"&&n instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");g=n.getContextAttributes().alpha}else g=a;const _=f,p=new Set([Uh,Nh,Ih]),m=new Set([on,jn,$r,Jr,Ph,Lh]),M=new Uint32Array(4),y=new Int32Array(4);let S=null,w=null;const T=[],L=[];let x=null;this.domElement=t,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=qn,this.toneMappingExposure=1,this.transmissionResolutionScale=1;const E=this;let N=!1;this._outputColorSpace=Nt;let C=0,O=0,F=null,V=-1,z=null;const H=new it,B=new it;let ie=null;const Q=new Me(0);let me=0,_e=t.width,ge=t.height,ke=1,rt=null,ct=null;const q=new it(0,0,_e,ge),ae=new it(0,0,_e,ge);let oe=!1;const Ue=new Kh;let Ie=!1,He=!1;const ht=new We,Xe=new P,J=new it,te={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let Z=!1;function de(){return F===null?ke:1}let R=n;function Ne(b,U){return t.getContext(b,U)}try{const b={alpha:!0,depth:s,stencil:r,antialias:o,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:h,failIfMajorPerformanceCaveat:u};if("setAttribute"in t&&t.setAttribute("data-engine",`three.js r${yh}`),t.addEventListener("webglcontextlost",Te,!1),t.addEventListener("webglcontextrestored",Ve,!1),t.addEventListener("webglcontextcreationerror",gt,!1),R===null){const U="webgl2";if(R=Ne(U,b),R===null)throw Ne(U)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(b){throw Be("WebGLRenderer: "+b.message),b}let xe,Oe,le,A,v,I,X,$,K,Ee,ce,Le,Fe,ee,se,be,Ae,ve,je,D,he,re,Se;function ne(){xe=new VM(R),xe.init(),he=new IS(R,xe),Oe=new UM(R,xe,e,he),le=new LS(R,xe),Oe.reversedDepthBuffer&&d&&le.buffers.depth.setReversed(!0),A=new KM(R),v=new _S,I=new DS(R,xe,le,v,Oe,he,A),X=new GM(E),$=new J_(R),re=new IM(R,$),K=new WM(R,$,A,re),Ee=new qM(R,K,$,re,A),ve=new YM(R,Oe,I),se=new OM(v),ce=new gS(E,X,xe,Oe,re,se),Le=new zS(E,v),Fe=new vS,ee=new TS(xe),Ae=new DM(E,X,le,Ee,g,l),be=new PS(E,Ee,Oe),Se=new kS(R,A,Oe,le),je=new NM(R,xe,A),D=new XM(R,xe,A),A.programs=ce.programs,E.capabilities=Oe,E.extensions=xe,E.properties=v,E.renderLists=Fe,E.shadowMap=be,E.state=le,E.info=A}ne(),_!==on&&(x=new $M(_,t.width,t.height,s,r));const Y=new FS(E,R);this.xr=Y,this.getContext=function(){return R},this.getContextAttributes=function(){return R.getContextAttributes()},this.forceContextLoss=function(){const b=xe.get("WEBGL_lose_context");b&&b.loseContext()},this.forceContextRestore=function(){const b=xe.get("WEBGL_lose_context");b&&b.restoreContext()},this.getPixelRatio=function(){return ke},this.setPixelRatio=function(b){b!==void 0&&(ke=b,this.setSize(_e,ge,!1))},this.getSize=function(b){return b.set(_e,ge)},this.setSize=function(b,U,W=!0){if(Y.isPresenting){Re("WebGLRenderer: Can't change size while VR device is presenting.");return}_e=b,ge=U,t.width=Math.floor(b*ke),t.height=Math.floor(U*ke),W===!0&&(t.style.width=b+"px",t.style.height=U+"px"),x!==null&&x.setSize(t.width,t.height),this.setViewport(0,0,b,U)},this.getDrawingBufferSize=function(b){return b.set(_e*ke,ge*ke).floor()},this.setDrawingBufferSize=function(b,U,W){_e=b,ge=U,ke=W,t.width=Math.floor(b*W),t.height=Math.floor(U*W),this.setViewport(0,0,b,U)},this.setEffects=function(b){if(_===on){console.error("THREE.WebGLRenderer: setEffects() requires outputBufferType set to HalfFloatType or FloatType.");return}if(b){for(let U=0;U<b.length;U++)if(b[U].isOutputPass===!0){console.warn("THREE.WebGLRenderer: OutputPass is not needed in setEffects(). Tone mapping and color space conversion are applied automatically.");break}}x.setEffects(b||[])},this.getCurrentViewport=function(b){return b.copy(H)},this.getViewport=function(b){return b.copy(q)},this.setViewport=function(b,U,W,G){b.isVector4?q.set(b.x,b.y,b.z,b.w):q.set(b,U,W,G),le.viewport(H.copy(q).multiplyScalar(ke).round())},this.getScissor=function(b){return b.copy(ae)},this.setScissor=function(b,U,W,G){b.isVector4?ae.set(b.x,b.y,b.z,b.w):ae.set(b,U,W,G),le.scissor(B.copy(ae).multiplyScalar(ke).round())},this.getScissorTest=function(){return oe},this.setScissorTest=function(b){le.setScissorTest(oe=b)},this.setOpaqueSort=function(b){rt=b},this.setTransparentSort=function(b){ct=b},this.getClearColor=function(b){return b.copy(Ae.getClearColor())},this.setClearColor=function(){Ae.setClearColor(...arguments)},this.getClearAlpha=function(){return Ae.getClearAlpha()},this.setClearAlpha=function(){Ae.setClearAlpha(...arguments)},this.clear=function(b=!0,U=!0,W=!0){let G=0;if(b){let k=!1;if(F!==null){const fe=F.texture.format;k=p.has(fe)}if(k){const fe=F.texture.type,ye=m.has(fe),pe=Ae.getClearColor(),we=Ae.getClearAlpha(),Pe=pe.r,Ke=pe.g,$e=pe.b;ye?(M[0]=Pe,M[1]=Ke,M[2]=$e,M[3]=we,R.clearBufferuiv(R.COLOR,0,M)):(y[0]=Pe,y[1]=Ke,y[2]=$e,y[3]=we,R.clearBufferiv(R.COLOR,0,y))}else G|=R.COLOR_BUFFER_BIT}U&&(G|=R.DEPTH_BUFFER_BIT),W&&(G|=R.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),G!==0&&R.clear(G)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){t.removeEventListener("webglcontextlost",Te,!1),t.removeEventListener("webglcontextrestored",Ve,!1),t.removeEventListener("webglcontextcreationerror",gt,!1),Ae.dispose(),Fe.dispose(),ee.dispose(),v.dispose(),X.dispose(),Ee.dispose(),re.dispose(),Se.dispose(),ce.dispose(),Y.dispose(),Y.removeEventListener("sessionstart",xu),Y.removeEventListener("sessionend",vu),Li.stop()};function Te(b){b.preventDefault(),No("WebGLRenderer: Context Lost."),N=!0}function Ve(){No("WebGLRenderer: Context Restored."),N=!1;const b=A.autoReset,U=be.enabled,W=be.autoUpdate,G=be.needsUpdate,k=be.type;ne(),A.autoReset=b,be.enabled=U,be.autoUpdate=W,be.needsUpdate=G,be.type=k}function gt(b){Be("WebGLRenderer: A WebGL context could not be created. Reason: ",b.statusMessage)}function at(b){const U=b.target;U.removeEventListener("dispose",at),Zn(U)}function Zn(b){Qn(b),v.remove(b)}function Qn(b){const U=v.get(b).programs;U!==void 0&&(U.forEach(function(W){ce.releaseProgram(W)}),b.isShaderMaterial&&ce.releaseShaderCache(b))}this.renderBufferDirect=function(b,U,W,G,k,fe){U===null&&(U=te);const ye=k.isMesh&&k.matrixWorld.determinant()<0,pe=zm(b,U,W,G,k);le.setMaterial(G,ye);let we=W.index,Pe=1;if(G.wireframe===!0){if(we=K.getWireframeAttribute(W),we===void 0)return;Pe=2}const Ke=W.drawRange,$e=W.attributes.position;let De=Ke.start*Pe,ut=(Ke.start+Ke.count)*Pe;fe!==null&&(De=Math.max(De,fe.start*Pe),ut=Math.min(ut,(fe.start+fe.count)*Pe)),we!==null?(De=Math.max(De,0),ut=Math.min(ut,we.count)):$e!=null&&(De=Math.max(De,0),ut=Math.min(ut,$e.count));const St=ut-De;if(St<0||St===1/0)return;re.setup(k,G,pe,W,we);let Mt,dt=je;if(we!==null&&(Mt=$.get(we),dt=D,dt.setIndex(Mt)),k.isMesh)G.wireframe===!0?(le.setLineWidth(G.wireframeLinewidth*de()),dt.setMode(R.LINES)):dt.setMode(R.TRIANGLES);else if(k.isLine){let Vt=G.linewidth;Vt===void 0&&(Vt=1),le.setLineWidth(Vt*de()),k.isLineSegments?dt.setMode(R.LINES):k.isLineLoop?dt.setMode(R.LINE_LOOP):dt.setMode(R.LINE_STRIP)}else k.isPoints?dt.setMode(R.POINTS):k.isSprite&&dt.setMode(R.TRIANGLES);if(k.isBatchedMesh)if(k._multiDrawInstances!==null)Uo("WebGLRenderer: renderMultiDrawInstances has been deprecated and will be removed in r184. Append to renderMultiDraw arguments and use indirection."),dt.renderMultiDrawInstances(k._multiDrawStarts,k._multiDrawCounts,k._multiDrawCount,k._multiDrawInstances);else if(xe.get("WEBGL_multi_draw"))dt.renderMultiDraw(k._multiDrawStarts,k._multiDrawCounts,k._multiDrawCount);else{const Vt=k._multiDrawStarts,Ce=k._multiDrawCounts,sn=k._multiDrawCount,tt=we?$.get(we).bytesPerElement:1,yn=v.get(G).currentProgram.getUniforms();for(let On=0;On<sn;On++)yn.setValue(R,"_gl_DrawID",On),dt.render(Vt[On]/tt,Ce[On])}else if(k.isInstancedMesh)dt.renderInstances(De,St,k.count);else if(W.isInstancedBufferGeometry){const Vt=W._maxInstanceCount!==void 0?W._maxInstanceCount:1/0,Ce=Math.min(W.instanceCount,Vt);dt.renderInstances(De,St,Ce)}else dt.render(De,St)};function _u(b,U,W){b.transparent===!0&&b.side===At&&b.forceSinglePass===!1?(b.side=Jt,b.needsUpdate=!0,_a(b,U,W),b.side=di,b.needsUpdate=!0,_a(b,U,W),b.side=At):_a(b,U,W)}this.compile=function(b,U,W=null){W===null&&(W=b),w=ee.get(W),w.init(U),L.push(w),W.traverseVisible(function(k){k.isLight&&k.layers.test(U.layers)&&(w.pushLight(k),k.castShadow&&w.pushShadow(k))}),b!==W&&b.traverseVisible(function(k){k.isLight&&k.layers.test(U.layers)&&(w.pushLight(k),k.castShadow&&w.pushShadow(k))}),w.setupLights();const G=new Set;return b.traverse(function(k){if(!(k.isMesh||k.isPoints||k.isLine||k.isSprite))return;const fe=k.material;if(fe)if(Array.isArray(fe))for(let ye=0;ye<fe.length;ye++){const pe=fe[ye];_u(pe,W,k),G.add(pe)}else _u(fe,W,k),G.add(fe)}),w=L.pop(),G},this.compileAsync=function(b,U,W=null){const G=this.compile(b,U,W);return new Promise(k=>{function fe(){if(G.forEach(function(ye){v.get(ye).currentProgram.isReady()&&G.delete(ye)}),G.size===0){k(b);return}setTimeout(fe,10)}xe.get("KHR_parallel_shader_compile")!==null?fe():setTimeout(fe,10)})};let il=null;function Bm(b){il&&il(b)}function xu(){Li.stop()}function vu(){Li.start()}const Li=new Ip;Li.setAnimationLoop(Bm),typeof self<"u"&&Li.setContext(self),this.setAnimationLoop=function(b){il=b,Y.setAnimationLoop(b),b===null?Li.stop():Li.start()},Y.addEventListener("sessionstart",xu),Y.addEventListener("sessionend",vu),this.render=function(b,U){if(U!==void 0&&U.isCamera!==!0){Be("WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(N===!0)return;const W=Y.enabled===!0&&Y.isPresenting===!0,G=x!==null&&(F===null||W)&&x.begin(E,F);if(b.matrixWorldAutoUpdate===!0&&b.updateMatrixWorld(),U.parent===null&&U.matrixWorldAutoUpdate===!0&&U.updateMatrixWorld(),Y.enabled===!0&&Y.isPresenting===!0&&(x===null||x.isCompositing()===!1)&&(Y.cameraAutoUpdate===!0&&Y.updateCamera(U),U=Y.getCamera()),b.isScene===!0&&b.onBeforeRender(E,b,U,F),w=ee.get(b,L.length),w.init(U),L.push(w),ht.multiplyMatrices(U.projectionMatrix,U.matrixWorldInverse),Ue.setFromProjectionMatrix(ht,Wn,U.reversedDepth),He=this.localClippingEnabled,Ie=se.init(this.clippingPlanes,He),S=Fe.get(b,T.length),S.init(),T.push(S),Y.enabled===!0&&Y.isPresenting===!0){const ye=E.xr.getDepthSensingMesh();ye!==null&&sl(ye,U,-1/0,E.sortObjects)}sl(b,U,0,E.sortObjects),S.finish(),E.sortObjects===!0&&S.sort(rt,ct),Z=Y.enabled===!1||Y.isPresenting===!1||Y.hasDepthSensing()===!1,Z&&Ae.addToRenderList(S,b),this.info.render.frame++,Ie===!0&&se.beginShadows();const k=w.state.shadowsArray;if(be.render(k,b,U),Ie===!0&&se.endShadows(),this.info.autoReset===!0&&this.info.reset(),(G&&x.hasRenderPass())===!1){const ye=S.opaque,pe=S.transmissive;if(w.setupLights(),U.isArrayCamera){const we=U.cameras;if(pe.length>0)for(let Pe=0,Ke=we.length;Pe<Ke;Pe++){const $e=we[Pe];yu(ye,pe,b,$e)}Z&&Ae.render(b);for(let Pe=0,Ke=we.length;Pe<Ke;Pe++){const $e=we[Pe];Mu(S,b,$e,$e.viewport)}}else pe.length>0&&yu(ye,pe,b,U),Z&&Ae.render(b),Mu(S,b,U)}F!==null&&O===0&&(I.updateMultisampleRenderTarget(F),I.updateRenderTargetMipmap(F)),G&&x.end(E),b.isScene===!0&&b.onAfterRender(E,b,U),re.resetDefaultState(),V=-1,z=null,L.pop(),L.length>0?(w=L[L.length-1],Ie===!0&&se.setGlobalState(E.clippingPlanes,w.state.camera)):w=null,T.pop(),T.length>0?S=T[T.length-1]:S=null};function sl(b,U,W,G){if(b.visible===!1)return;if(b.layers.test(U.layers)){if(b.isGroup)W=b.renderOrder;else if(b.isLOD)b.autoUpdate===!0&&b.update(U);else if(b.isLight)w.pushLight(b),b.castShadow&&w.pushShadow(b);else if(b.isSprite){if(!b.frustumCulled||Ue.intersectsSprite(b)){G&&J.setFromMatrixPosition(b.matrixWorld).applyMatrix4(ht);const ye=Ee.update(b),pe=b.material;pe.visible&&S.push(b,ye,pe,W,J.z,null)}}else if((b.isMesh||b.isLine||b.isPoints)&&(!b.frustumCulled||Ue.intersectsObject(b))){const ye=Ee.update(b),pe=b.material;if(G&&(b.boundingSphere!==void 0?(b.boundingSphere===null&&b.computeBoundingSphere(),J.copy(b.boundingSphere.center)):(ye.boundingSphere===null&&ye.computeBoundingSphere(),J.copy(ye.boundingSphere.center)),J.applyMatrix4(b.matrixWorld).applyMatrix4(ht)),Array.isArray(pe)){const we=ye.groups;for(let Pe=0,Ke=we.length;Pe<Ke;Pe++){const $e=we[Pe],De=pe[$e.materialIndex];De&&De.visible&&S.push(b,ye,De,W,J.z,$e)}}else pe.visible&&S.push(b,ye,pe,W,J.z,null)}}const fe=b.children;for(let ye=0,pe=fe.length;ye<pe;ye++)sl(fe[ye],U,W,G)}function Mu(b,U,W,G){const{opaque:k,transmissive:fe,transparent:ye}=b;w.setupLightsView(W),Ie===!0&&se.setGlobalState(E.clippingPlanes,W),G&&le.viewport(H.copy(G)),k.length>0&&ga(k,U,W),fe.length>0&&ga(fe,U,W),ye.length>0&&ga(ye,U,W),le.buffers.depth.setTest(!0),le.buffers.depth.setMask(!0),le.buffers.color.setMask(!0),le.setPolygonOffset(!1)}function yu(b,U,W,G){if((W.isScene===!0?W.overrideMaterial:null)!==null)return;if(w.state.transmissionRenderTarget[G.id]===void 0){const De=xe.has("EXT_color_buffer_half_float")||xe.has("EXT_color_buffer_float");w.state.transmissionRenderTarget[G.id]=new nn(1,1,{generateMipmaps:!0,type:De?ln:on,minFilter:Rn,samples:Math.max(4,Oe.samples),stencilBuffer:r,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:Qe.workingColorSpace})}const fe=w.state.transmissionRenderTarget[G.id],ye=G.viewport||H;fe.setSize(ye.z*E.transmissionResolutionScale,ye.w*E.transmissionResolutionScale);const pe=E.getRenderTarget(),we=E.getActiveCubeFace(),Pe=E.getActiveMipmapLevel();E.setRenderTarget(fe),E.getClearColor(Q),me=E.getClearAlpha(),me<1&&E.setClearColor(16777215,.5),E.clear(),Z&&Ae.render(W);const Ke=E.toneMapping;E.toneMapping=qn;const $e=G.viewport;if(G.viewport!==void 0&&(G.viewport=void 0),w.setupLightsView(G),Ie===!0&&se.setGlobalState(E.clippingPlanes,G),ga(b,W,G),I.updateMultisampleRenderTarget(fe),I.updateRenderTargetMipmap(fe),xe.has("WEBGL_multisampled_render_to_texture")===!1){let De=!1;for(let ut=0,St=U.length;ut<St;ut++){const Mt=U[ut],{object:dt,geometry:Vt,material:Ce,group:sn}=Mt;if(Ce.side===At&&dt.layers.test(G.layers)){const tt=Ce.side;Ce.side=Jt,Ce.needsUpdate=!0,Su(dt,W,G,Vt,Ce,sn),Ce.side=tt,Ce.needsUpdate=!0,De=!0}}De===!0&&(I.updateMultisampleRenderTarget(fe),I.updateRenderTargetMipmap(fe))}E.setRenderTarget(pe,we,Pe),E.setClearColor(Q,me),$e!==void 0&&(G.viewport=$e),E.toneMapping=Ke}function ga(b,U,W){const G=U.isScene===!0?U.overrideMaterial:null;for(let k=0,fe=b.length;k<fe;k++){const ye=b[k],{object:pe,geometry:we,group:Pe}=ye;let Ke=ye.material;Ke.allowOverride===!0&&G!==null&&(Ke=G),pe.layers.test(W.layers)&&Su(pe,U,W,we,Ke,Pe)}}function Su(b,U,W,G,k,fe){b.onBeforeRender(E,U,W,G,k,fe),b.modelViewMatrix.multiplyMatrices(W.matrixWorldInverse,b.matrixWorld),b.normalMatrix.getNormalMatrix(b.modelViewMatrix),k.onBeforeRender(E,U,W,G,b,fe),k.transparent===!0&&k.side===At&&k.forceSinglePass===!1?(k.side=Jt,k.needsUpdate=!0,E.renderBufferDirect(W,U,G,k,b,fe),k.side=di,k.needsUpdate=!0,E.renderBufferDirect(W,U,G,k,b,fe),k.side=At):E.renderBufferDirect(W,U,G,k,b,fe),b.onAfterRender(E,U,W,G,k,fe)}function _a(b,U,W){U.isScene!==!0&&(U=te);const G=v.get(b),k=w.state.lights,fe=w.state.shadowsArray,ye=k.state.version,pe=ce.getParameters(b,k.state,fe,U,W),we=ce.getProgramCacheKey(pe);let Pe=G.programs;G.environment=b.isMeshStandardMaterial||b.isMeshLambertMaterial||b.isMeshPhongMaterial?U.environment:null,G.fog=U.fog;const Ke=b.isMeshStandardMaterial||b.isMeshLambertMaterial&&!b.envMap||b.isMeshPhongMaterial&&!b.envMap;G.envMap=X.get(b.envMap||G.environment,Ke),G.envMapRotation=G.environment!==null&&b.envMap===null?U.environmentRotation:b.envMapRotation,Pe===void 0&&(b.addEventListener("dispose",at),Pe=new Map,G.programs=Pe);let $e=Pe.get(we);if($e!==void 0){if(G.currentProgram===$e&&G.lightsStateVersion===ye)return bu(b,pe),$e}else pe.uniforms=ce.getUniforms(b),b.onBeforeCompile(pe,E),$e=ce.acquireProgram(pe,we),Pe.set(we,$e),G.uniforms=pe.uniforms;const De=G.uniforms;return(!b.isShaderMaterial&&!b.isRawShaderMaterial||b.clipping===!0)&&(De.clippingPlanes=se.uniform),bu(b,pe),G.needsLights=Hm(b),G.lightsStateVersion=ye,G.needsLights&&(De.ambientLightColor.value=k.state.ambient,De.lightProbe.value=k.state.probe,De.directionalLights.value=k.state.directional,De.directionalLightShadows.value=k.state.directionalShadow,De.spotLights.value=k.state.spot,De.spotLightShadows.value=k.state.spotShadow,De.rectAreaLights.value=k.state.rectArea,De.ltc_1.value=k.state.rectAreaLTC1,De.ltc_2.value=k.state.rectAreaLTC2,De.pointLights.value=k.state.point,De.pointLightShadows.value=k.state.pointShadow,De.hemisphereLights.value=k.state.hemi,De.directionalShadowMatrix.value=k.state.directionalShadowMatrix,De.spotLightMatrix.value=k.state.spotLightMatrix,De.spotLightMap.value=k.state.spotLightMap,De.pointShadowMatrix.value=k.state.pointShadowMatrix),G.currentProgram=$e,G.uniformsList=null,$e}function Eu(b){if(b.uniformsList===null){const U=b.currentProgram.getUniforms();b.uniformsList=yo.seqWithValue(U.seq,b.uniforms)}return b.uniformsList}function bu(b,U){const W=v.get(b);W.outputColorSpace=U.outputColorSpace,W.batching=U.batching,W.batchingColor=U.batchingColor,W.instancing=U.instancing,W.instancingColor=U.instancingColor,W.instancingMorph=U.instancingMorph,W.skinning=U.skinning,W.morphTargets=U.morphTargets,W.morphNormals=U.morphNormals,W.morphColors=U.morphColors,W.morphTargetsCount=U.morphTargetsCount,W.numClippingPlanes=U.numClippingPlanes,W.numIntersection=U.numClipIntersection,W.vertexAlphas=U.vertexAlphas,W.vertexTangents=U.vertexTangents,W.toneMapping=U.toneMapping}function zm(b,U,W,G,k){U.isScene!==!0&&(U=te),I.resetTextureUnits();const fe=U.fog,ye=G.isMeshStandardMaterial||G.isMeshLambertMaterial||G.isMeshPhongMaterial?U.environment:null,pe=F===null?E.outputColorSpace:F.isXRRenderTarget===!0?F.texture.colorSpace:Zt,we=G.isMeshStandardMaterial||G.isMeshLambertMaterial&&!G.envMap||G.isMeshPhongMaterial&&!G.envMap,Pe=X.get(G.envMap||ye,we),Ke=G.vertexColors===!0&&!!W.attributes.color&&W.attributes.color.itemSize===4,$e=!!W.attributes.tangent&&(!!G.normalMap||G.anisotropy>0),De=!!W.morphAttributes.position,ut=!!W.morphAttributes.normal,St=!!W.morphAttributes.color;let Mt=qn;G.toneMapped&&(F===null||F.isXRRenderTarget===!0)&&(Mt=E.toneMapping);const dt=W.morphAttributes.position||W.morphAttributes.normal||W.morphAttributes.color,Vt=dt!==void 0?dt.length:0,Ce=v.get(G),sn=w.state.lights;if(Ie===!0&&(He===!0||b!==z)){const Dt=b===z&&G.id===V;se.setState(G,b,Dt)}let tt=!1;G.version===Ce.__version?(Ce.needsLights&&Ce.lightsStateVersion!==sn.state.version||Ce.outputColorSpace!==pe||k.isBatchedMesh&&Ce.batching===!1||!k.isBatchedMesh&&Ce.batching===!0||k.isBatchedMesh&&Ce.batchingColor===!0&&k.colorTexture===null||k.isBatchedMesh&&Ce.batchingColor===!1&&k.colorTexture!==null||k.isInstancedMesh&&Ce.instancing===!1||!k.isInstancedMesh&&Ce.instancing===!0||k.isSkinnedMesh&&Ce.skinning===!1||!k.isSkinnedMesh&&Ce.skinning===!0||k.isInstancedMesh&&Ce.instancingColor===!0&&k.instanceColor===null||k.isInstancedMesh&&Ce.instancingColor===!1&&k.instanceColor!==null||k.isInstancedMesh&&Ce.instancingMorph===!0&&k.morphTexture===null||k.isInstancedMesh&&Ce.instancingMorph===!1&&k.morphTexture!==null||Ce.envMap!==Pe||G.fog===!0&&Ce.fog!==fe||Ce.numClippingPlanes!==void 0&&(Ce.numClippingPlanes!==se.numPlanes||Ce.numIntersection!==se.numIntersection)||Ce.vertexAlphas!==Ke||Ce.vertexTangents!==$e||Ce.morphTargets!==De||Ce.morphNormals!==ut||Ce.morphColors!==St||Ce.toneMapping!==Mt||Ce.morphTargetsCount!==Vt)&&(tt=!0):(tt=!0,Ce.__version=G.version);let yn=Ce.currentProgram;tt===!0&&(yn=_a(G,U,k));let On=!1,Di=!1,is=!1;const pt=yn.getUniforms(),Ot=Ce.uniforms;if(le.useProgram(yn.program)&&(On=!0,Di=!0,is=!0),G.id!==V&&(V=G.id,Di=!0),On||z!==b){le.buffers.depth.getReversed()&&b.reversedDepth!==!0&&(b._reversedDepth=!0,b.updateProjectionMatrix()),pt.setValue(R,"projectionMatrix",b.projectionMatrix),pt.setValue(R,"viewMatrix",b.matrixWorldInverse);const mi=pt.map.cameraPosition;mi!==void 0&&mi.setValue(R,Xe.setFromMatrixPosition(b.matrixWorld)),Oe.logarithmicDepthBuffer&&pt.setValue(R,"logDepthBufFC",2/(Math.log(b.far+1)/Math.LN2)),(G.isMeshPhongMaterial||G.isMeshToonMaterial||G.isMeshLambertMaterial||G.isMeshBasicMaterial||G.isMeshStandardMaterial||G.isShaderMaterial)&&pt.setValue(R,"isOrthographic",b.isOrthographicCamera===!0),z!==b&&(z=b,Di=!0,is=!0)}if(Ce.needsLights&&(sn.state.directionalShadowMap.length>0&&pt.setValue(R,"directionalShadowMap",sn.state.directionalShadowMap,I),sn.state.spotShadowMap.length>0&&pt.setValue(R,"spotShadowMap",sn.state.spotShadowMap,I),sn.state.pointShadowMap.length>0&&pt.setValue(R,"pointShadowMap",sn.state.pointShadowMap,I)),k.isSkinnedMesh){pt.setOptional(R,k,"bindMatrix"),pt.setOptional(R,k,"bindMatrixInverse");const Dt=k.skeleton;Dt&&(Dt.boneTexture===null&&Dt.computeBoneTexture(),pt.setValue(R,"boneTexture",Dt.boneTexture,I))}k.isBatchedMesh&&(pt.setOptional(R,k,"batchingTexture"),pt.setValue(R,"batchingTexture",k._matricesTexture,I),pt.setOptional(R,k,"batchingIdTexture"),pt.setValue(R,"batchingIdTexture",k._indirectTexture,I),pt.setOptional(R,k,"batchingColorTexture"),k._colorsTexture!==null&&pt.setValue(R,"batchingColorTexture",k._colorsTexture,I));const pi=W.morphAttributes;if((pi.position!==void 0||pi.normal!==void 0||pi.color!==void 0)&&ve.update(k,W,yn),(Di||Ce.receiveShadow!==k.receiveShadow)&&(Ce.receiveShadow=k.receiveShadow,pt.setValue(R,"receiveShadow",k.receiveShadow)),(G.isMeshStandardMaterial||G.isMeshLambertMaterial||G.isMeshPhongMaterial)&&G.envMap===null&&U.environment!==null&&(Ot.envMapIntensity.value=U.environmentIntensity),Ot.dfgLUT!==void 0&&(Ot.dfgLUT.value=GS()),Di&&(pt.setValue(R,"toneMappingExposure",E.toneMappingExposure),Ce.needsLights&&km(Ot,is),fe&&G.fog===!0&&Le.refreshFogUniforms(Ot,fe),Le.refreshMaterialUniforms(Ot,G,ke,ge,w.state.transmissionRenderTarget[b.id]),yo.upload(R,Eu(Ce),Ot,I)),G.isShaderMaterial&&G.uniformsNeedUpdate===!0&&(yo.upload(R,Eu(Ce),Ot,I),G.uniformsNeedUpdate=!1),G.isSpriteMaterial&&pt.setValue(R,"center",k.center),pt.setValue(R,"modelViewMatrix",k.modelViewMatrix),pt.setValue(R,"normalMatrix",k.normalMatrix),pt.setValue(R,"modelMatrix",k.matrixWorld),G.isShaderMaterial||G.isRawShaderMaterial){const Dt=G.uniformsGroups;for(let mi=0,ss=Dt.length;mi<ss;mi++){const Tu=Dt[mi];Se.update(Tu,yn),Se.bind(Tu,yn)}}return yn}function km(b,U){b.ambientLightColor.needsUpdate=U,b.lightProbe.needsUpdate=U,b.directionalLights.needsUpdate=U,b.directionalLightShadows.needsUpdate=U,b.pointLights.needsUpdate=U,b.pointLightShadows.needsUpdate=U,b.spotLights.needsUpdate=U,b.spotLightShadows.needsUpdate=U,b.rectAreaLights.needsUpdate=U,b.hemisphereLights.needsUpdate=U}function Hm(b){return b.isMeshLambertMaterial||b.isMeshToonMaterial||b.isMeshPhongMaterial||b.isMeshStandardMaterial||b.isShadowMaterial||b.isShaderMaterial&&b.lights===!0}this.getActiveCubeFace=function(){return C},this.getActiveMipmapLevel=function(){return O},this.getRenderTarget=function(){return F},this.setRenderTargetTextures=function(b,U,W){const G=v.get(b);G.__autoAllocateDepthBuffer=b.resolveDepthBuffer===!1,G.__autoAllocateDepthBuffer===!1&&(G.__useRenderToTexture=!1),v.get(b.texture).__webglTexture=U,v.get(b.depthTexture).__webglTexture=G.__autoAllocateDepthBuffer?void 0:W,G.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(b,U){const W=v.get(b);W.__webglFramebuffer=U,W.__useDefaultFramebuffer=U===void 0};const Gm=R.createFramebuffer();this.setRenderTarget=function(b,U=0,W=0){F=b,C=U,O=W;let G=null,k=!1,fe=!1;if(b){const pe=v.get(b);if(pe.__useDefaultFramebuffer!==void 0){le.bindFramebuffer(R.FRAMEBUFFER,pe.__webglFramebuffer),H.copy(b.viewport),B.copy(b.scissor),ie=b.scissorTest,le.viewport(H),le.scissor(B),le.setScissorTest(ie),V=-1;return}else if(pe.__webglFramebuffer===void 0)I.setupRenderTarget(b);else if(pe.__hasExternalTextures)I.rebindTextures(b,v.get(b.texture).__webglTexture,v.get(b.depthTexture).__webglTexture);else if(b.depthBuffer){const Ke=b.depthTexture;if(pe.__boundDepthTexture!==Ke){if(Ke!==null&&v.has(Ke)&&(b.width!==Ke.image.width||b.height!==Ke.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");I.setupDepthRenderbuffer(b)}}const we=b.texture;(we.isData3DTexture||we.isDataArrayTexture||we.isCompressedArrayTexture)&&(fe=!0);const Pe=v.get(b).__webglFramebuffer;b.isWebGLCubeRenderTarget?(Array.isArray(Pe[U])?G=Pe[U][W]:G=Pe[U],k=!0):b.samples>0&&I.useMultisampledRTT(b)===!1?G=v.get(b).__webglMultisampledFramebuffer:Array.isArray(Pe)?G=Pe[W]:G=Pe,H.copy(b.viewport),B.copy(b.scissor),ie=b.scissorTest}else H.copy(q).multiplyScalar(ke).floor(),B.copy(ae).multiplyScalar(ke).floor(),ie=oe;if(W!==0&&(G=Gm),le.bindFramebuffer(R.FRAMEBUFFER,G)&&le.drawBuffers(b,G),le.viewport(H),le.scissor(B),le.setScissorTest(ie),k){const pe=v.get(b.texture);R.framebufferTexture2D(R.FRAMEBUFFER,R.COLOR_ATTACHMENT0,R.TEXTURE_CUBE_MAP_POSITIVE_X+U,pe.__webglTexture,W)}else if(fe){const pe=U;for(let we=0;we<b.textures.length;we++){const Pe=v.get(b.textures[we]);R.framebufferTextureLayer(R.FRAMEBUFFER,R.COLOR_ATTACHMENT0+we,Pe.__webglTexture,W,pe)}}else if(b!==null&&W!==0){const pe=v.get(b.texture);R.framebufferTexture2D(R.FRAMEBUFFER,R.COLOR_ATTACHMENT0,R.TEXTURE_2D,pe.__webglTexture,W)}V=-1},this.readRenderTargetPixels=function(b,U,W,G,k,fe,ye,pe=0){if(!(b&&b.isWebGLRenderTarget)){Be("WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let we=v.get(b).__webglFramebuffer;if(b.isWebGLCubeRenderTarget&&ye!==void 0&&(we=we[ye]),we){le.bindFramebuffer(R.FRAMEBUFFER,we);try{const Pe=b.textures[pe],Ke=Pe.format,$e=Pe.type;if(b.textures.length>1&&R.readBuffer(R.COLOR_ATTACHMENT0+pe),!Oe.textureFormatReadable(Ke)){Be("WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!Oe.textureTypeReadable($e)){Be("WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}U>=0&&U<=b.width-G&&W>=0&&W<=b.height-k&&R.readPixels(U,W,G,k,he.convert(Ke),he.convert($e),fe)}finally{const Pe=F!==null?v.get(F).__webglFramebuffer:null;le.bindFramebuffer(R.FRAMEBUFFER,Pe)}}},this.readRenderTargetPixelsAsync=async function(b,U,W,G,k,fe,ye,pe=0){if(!(b&&b.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let we=v.get(b).__webglFramebuffer;if(b.isWebGLCubeRenderTarget&&ye!==void 0&&(we=we[ye]),we)if(U>=0&&U<=b.width-G&&W>=0&&W<=b.height-k){le.bindFramebuffer(R.FRAMEBUFFER,we);const Pe=b.textures[pe],Ke=Pe.format,$e=Pe.type;if(b.textures.length>1&&R.readBuffer(R.COLOR_ATTACHMENT0+pe),!Oe.textureFormatReadable(Ke))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!Oe.textureTypeReadable($e))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");const De=R.createBuffer();R.bindBuffer(R.PIXEL_PACK_BUFFER,De),R.bufferData(R.PIXEL_PACK_BUFFER,fe.byteLength,R.STREAM_READ),R.readPixels(U,W,G,k,he.convert(Ke),he.convert($e),0);const ut=F!==null?v.get(F).__webglFramebuffer:null;le.bindFramebuffer(R.FRAMEBUFFER,ut);const St=R.fenceSync(R.SYNC_GPU_COMMANDS_COMPLETE,0);return R.flush(),await Cg(R,St,4),R.bindBuffer(R.PIXEL_PACK_BUFFER,De),R.getBufferSubData(R.PIXEL_PACK_BUFFER,0,fe),R.deleteBuffer(De),R.deleteSync(St),fe}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(b,U=null,W=0){const G=Math.pow(2,-W),k=Math.floor(b.image.width*G),fe=Math.floor(b.image.height*G),ye=U!==null?U.x:0,pe=U!==null?U.y:0;I.setTexture2D(b,0),R.copyTexSubImage2D(R.TEXTURE_2D,W,0,0,ye,pe,k,fe),le.unbindTexture()};const Vm=R.createFramebuffer(),Wm=R.createFramebuffer();this.copyTextureToTexture=function(b,U,W=null,G=null,k=0,fe=0){let ye,pe,we,Pe,Ke,$e,De,ut,St;const Mt=b.isCompressedTexture?b.mipmaps[fe]:b.image;if(W!==null)ye=W.max.x-W.min.x,pe=W.max.y-W.min.y,we=W.isBox3?W.max.z-W.min.z:1,Pe=W.min.x,Ke=W.min.y,$e=W.isBox3?W.min.z:0;else{const Ot=Math.pow(2,-k);ye=Math.floor(Mt.width*Ot),pe=Math.floor(Mt.height*Ot),b.isDataArrayTexture?we=Mt.depth:b.isData3DTexture?we=Math.floor(Mt.depth*Ot):we=1,Pe=0,Ke=0,$e=0}G!==null?(De=G.x,ut=G.y,St=G.z):(De=0,ut=0,St=0);const dt=he.convert(U.format),Vt=he.convert(U.type);let Ce;U.isData3DTexture?(I.setTexture3D(U,0),Ce=R.TEXTURE_3D):U.isDataArrayTexture||U.isCompressedArrayTexture?(I.setTexture2DArray(U,0),Ce=R.TEXTURE_2D_ARRAY):(I.setTexture2D(U,0),Ce=R.TEXTURE_2D),R.pixelStorei(R.UNPACK_FLIP_Y_WEBGL,U.flipY),R.pixelStorei(R.UNPACK_PREMULTIPLY_ALPHA_WEBGL,U.premultiplyAlpha),R.pixelStorei(R.UNPACK_ALIGNMENT,U.unpackAlignment);const sn=R.getParameter(R.UNPACK_ROW_LENGTH),tt=R.getParameter(R.UNPACK_IMAGE_HEIGHT),yn=R.getParameter(R.UNPACK_SKIP_PIXELS),On=R.getParameter(R.UNPACK_SKIP_ROWS),Di=R.getParameter(R.UNPACK_SKIP_IMAGES);R.pixelStorei(R.UNPACK_ROW_LENGTH,Mt.width),R.pixelStorei(R.UNPACK_IMAGE_HEIGHT,Mt.height),R.pixelStorei(R.UNPACK_SKIP_PIXELS,Pe),R.pixelStorei(R.UNPACK_SKIP_ROWS,Ke),R.pixelStorei(R.UNPACK_SKIP_IMAGES,$e);const is=b.isDataArrayTexture||b.isData3DTexture,pt=U.isDataArrayTexture||U.isData3DTexture;if(b.isDepthTexture){const Ot=v.get(b),pi=v.get(U),Dt=v.get(Ot.__renderTarget),mi=v.get(pi.__renderTarget);le.bindFramebuffer(R.READ_FRAMEBUFFER,Dt.__webglFramebuffer),le.bindFramebuffer(R.DRAW_FRAMEBUFFER,mi.__webglFramebuffer);for(let ss=0;ss<we;ss++)is&&(R.framebufferTextureLayer(R.READ_FRAMEBUFFER,R.COLOR_ATTACHMENT0,v.get(b).__webglTexture,k,$e+ss),R.framebufferTextureLayer(R.DRAW_FRAMEBUFFER,R.COLOR_ATTACHMENT0,v.get(U).__webglTexture,fe,St+ss)),R.blitFramebuffer(Pe,Ke,ye,pe,De,ut,ye,pe,R.DEPTH_BUFFER_BIT,R.NEAREST);le.bindFramebuffer(R.READ_FRAMEBUFFER,null),le.bindFramebuffer(R.DRAW_FRAMEBUFFER,null)}else if(k!==0||b.isRenderTargetTexture||v.has(b)){const Ot=v.get(b),pi=v.get(U);le.bindFramebuffer(R.READ_FRAMEBUFFER,Vm),le.bindFramebuffer(R.DRAW_FRAMEBUFFER,Wm);for(let Dt=0;Dt<we;Dt++)is?R.framebufferTextureLayer(R.READ_FRAMEBUFFER,R.COLOR_ATTACHMENT0,Ot.__webglTexture,k,$e+Dt):R.framebufferTexture2D(R.READ_FRAMEBUFFER,R.COLOR_ATTACHMENT0,R.TEXTURE_2D,Ot.__webglTexture,k),pt?R.framebufferTextureLayer(R.DRAW_FRAMEBUFFER,R.COLOR_ATTACHMENT0,pi.__webglTexture,fe,St+Dt):R.framebufferTexture2D(R.DRAW_FRAMEBUFFER,R.COLOR_ATTACHMENT0,R.TEXTURE_2D,pi.__webglTexture,fe),k!==0?R.blitFramebuffer(Pe,Ke,ye,pe,De,ut,ye,pe,R.COLOR_BUFFER_BIT,R.NEAREST):pt?R.copyTexSubImage3D(Ce,fe,De,ut,St+Dt,Pe,Ke,ye,pe):R.copyTexSubImage2D(Ce,fe,De,ut,Pe,Ke,ye,pe);le.bindFramebuffer(R.READ_FRAMEBUFFER,null),le.bindFramebuffer(R.DRAW_FRAMEBUFFER,null)}else pt?b.isDataTexture||b.isData3DTexture?R.texSubImage3D(Ce,fe,De,ut,St,ye,pe,we,dt,Vt,Mt.data):U.isCompressedArrayTexture?R.compressedTexSubImage3D(Ce,fe,De,ut,St,ye,pe,we,dt,Mt.data):R.texSubImage3D(Ce,fe,De,ut,St,ye,pe,we,dt,Vt,Mt):b.isDataTexture?R.texSubImage2D(R.TEXTURE_2D,fe,De,ut,ye,pe,dt,Vt,Mt.data):b.isCompressedTexture?R.compressedTexSubImage2D(R.TEXTURE_2D,fe,De,ut,Mt.width,Mt.height,dt,Mt.data):R.texSubImage2D(R.TEXTURE_2D,fe,De,ut,ye,pe,dt,Vt,Mt);R.pixelStorei(R.UNPACK_ROW_LENGTH,sn),R.pixelStorei(R.UNPACK_IMAGE_HEIGHT,tt),R.pixelStorei(R.UNPACK_SKIP_PIXELS,yn),R.pixelStorei(R.UNPACK_SKIP_ROWS,On),R.pixelStorei(R.UNPACK_SKIP_IMAGES,Di),fe===0&&U.generateMipmaps&&R.generateMipmap(Ce),le.unbindTexture()},this.initRenderTarget=function(b){v.get(b).__webglFramebuffer===void 0&&I.setupRenderTarget(b)},this.initTexture=function(b){b.isCubeTexture?I.setTextureCube(b,0):b.isData3DTexture?I.setTexture3D(b,0):b.isDataArrayTexture||b.isCompressedArrayTexture?I.setTexture2DArray(b,0):I.setTexture2D(b,0),le.unbindTexture()},this.resetState=function(){C=0,O=0,F=null,le.reset(),re.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return Wn}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;const t=this.getContext();t.drawingBufferColorSpace=Qe._getDrawingBufferColorSpace(e),t.unpackColorSpace=Qe._getUnpackColorSpace()}}const ef={type:"change"},ru={type:"start"},zp={type:"end"},Qa=new ir,tf=new bi,WS=Math.cos(70*kh.DEG2RAD),Tt=new P,Qt=2*Math.PI,ft={NONE:-1,ROTATE:0,DOLLY:1,PAN:2,TOUCH_ROTATE:3,TOUCH_PAN:4,TOUCH_DOLLY_PAN:5,TOUCH_DOLLY_ROTATE:6},Kl=1e-6;class XS extends j_{constructor(e,t=null){super(e,t),this.state=ft.NONE,this.target=new P,this.cursor=new P,this.minDistance=0,this.maxDistance=1/0,this.minZoom=0,this.maxZoom=1/0,this.minTargetRadius=0,this.maxTargetRadius=1/0,this.minPolarAngle=0,this.maxPolarAngle=Math.PI,this.minAzimuthAngle=-1/0,this.maxAzimuthAngle=1/0,this.enableDamping=!1,this.dampingFactor=.05,this.enableZoom=!0,this.zoomSpeed=1,this.enableRotate=!0,this.rotateSpeed=1,this.keyRotateSpeed=1,this.enablePan=!0,this.panSpeed=1,this.screenSpacePanning=!0,this.keyPanSpeed=7,this.zoomToCursor=!1,this.autoRotate=!1,this.autoRotateSpeed=2,this.keys={LEFT:"ArrowLeft",UP:"ArrowUp",RIGHT:"ArrowRight",BOTTOM:"ArrowDown"},this.mouseButtons={LEFT:Us.ROTATE,MIDDLE:Us.DOLLY,RIGHT:Us.PAN},this.touches={ONE:Ds.ROTATE,TWO:Ds.DOLLY_PAN},this.target0=this.target.clone(),this.position0=this.object.position.clone(),this.zoom0=this.object.zoom,this._cursorStyle="auto",this._domElementKeyEvents=null,this._lastPosition=new P,this._lastQuaternion=new In,this._lastTargetPosition=new P,this._quat=new In().setFromUnitVectors(e.up,new P(0,1,0)),this._quatInverse=this._quat.clone().invert(),this._spherical=new Cd,this._sphericalDelta=new Cd,this._scale=1,this._panOffset=new P,this._rotateStart=new j,this._rotateEnd=new j,this._rotateDelta=new j,this._panStart=new j,this._panEnd=new j,this._panDelta=new j,this._dollyStart=new j,this._dollyEnd=new j,this._dollyDelta=new j,this._dollyDirection=new P,this._mouse=new j,this._performCursorZoom=!1,this._pointers=[],this._pointerPositions={},this._controlActive=!1,this._onPointerMove=YS.bind(this),this._onPointerDown=KS.bind(this),this._onPointerUp=qS.bind(this),this._onContextMenu=tE.bind(this),this._onMouseWheel=JS.bind(this),this._onKeyDown=ZS.bind(this),this._onTouchStart=QS.bind(this),this._onTouchMove=eE.bind(this),this._onMouseDown=jS.bind(this),this._onMouseMove=$S.bind(this),this._interceptControlDown=nE.bind(this),this._interceptControlUp=iE.bind(this),this.domElement!==null&&this.connect(this.domElement),this.update()}set cursorStyle(e){this._cursorStyle=e,e==="grab"?this.domElement.style.cursor="grab":this.domElement.style.cursor="auto"}get cursorStyle(){return this._cursorStyle}connect(e){super.connect(e),this.domElement.addEventListener("pointerdown",this._onPointerDown),this.domElement.addEventListener("pointercancel",this._onPointerUp),this.domElement.addEventListener("contextmenu",this._onContextMenu),this.domElement.addEventListener("wheel",this._onMouseWheel,{passive:!1}),this.domElement.getRootNode().addEventListener("keydown",this._interceptControlDown,{passive:!0,capture:!0}),this.domElement.style.touchAction="none"}disconnect(){this.domElement.removeEventListener("pointerdown",this._onPointerDown),this.domElement.ownerDocument.removeEventListener("pointermove",this._onPointerMove),this.domElement.ownerDocument.removeEventListener("pointerup",this._onPointerUp),this.domElement.removeEventListener("pointercancel",this._onPointerUp),this.domElement.removeEventListener("wheel",this._onMouseWheel),this.domElement.removeEventListener("contextmenu",this._onContextMenu),this.stopListenToKeyEvents(),this.domElement.getRootNode().removeEventListener("keydown",this._interceptControlDown,{capture:!0}),this.domElement.style.touchAction="auto"}dispose(){this.disconnect()}getPolarAngle(){return this._spherical.phi}getAzimuthalAngle(){return this._spherical.theta}getDistance(){return this.object.position.distanceTo(this.target)}listenToKeyEvents(e){e.addEventListener("keydown",this._onKeyDown),this._domElementKeyEvents=e}stopListenToKeyEvents(){this._domElementKeyEvents!==null&&(this._domElementKeyEvents.removeEventListener("keydown",this._onKeyDown),this._domElementKeyEvents=null)}saveState(){this.target0.copy(this.target),this.position0.copy(this.object.position),this.zoom0=this.object.zoom}reset(){this.target.copy(this.target0),this.object.position.copy(this.position0),this.object.zoom=this.zoom0,this.object.updateProjectionMatrix(),this.dispatchEvent(ef),this.update(),this.state=ft.NONE}pan(e,t){this._pan(e,t),this.update()}dollyIn(e){this._dollyIn(e),this.update()}dollyOut(e){this._dollyOut(e),this.update()}rotateLeft(e){this._rotateLeft(e),this.update()}rotateUp(e){this._rotateUp(e),this.update()}update(e=null){const t=this.object.position;Tt.copy(t).sub(this.target),Tt.applyQuaternion(this._quat),this._spherical.setFromVector3(Tt),this.autoRotate&&this.state===ft.NONE&&this._rotateLeft(this._getAutoRotationAngle(e)),this.enableDamping?(this._spherical.theta+=this._sphericalDelta.theta*this.dampingFactor,this._spherical.phi+=this._sphericalDelta.phi*this.dampingFactor):(this._spherical.theta+=this._sphericalDelta.theta,this._spherical.phi+=this._sphericalDelta.phi);let n=this.minAzimuthAngle,s=this.maxAzimuthAngle;isFinite(n)&&isFinite(s)&&(n<-Math.PI?n+=Qt:n>Math.PI&&(n-=Qt),s<-Math.PI?s+=Qt:s>Math.PI&&(s-=Qt),n<=s?this._spherical.theta=Math.max(n,Math.min(s,this._spherical.theta)):this._spherical.theta=this._spherical.theta>(n+s)/2?Math.max(n,this._spherical.theta):Math.min(s,this._spherical.theta)),this._spherical.phi=Math.max(this.minPolarAngle,Math.min(this.maxPolarAngle,this._spherical.phi)),this._spherical.makeSafe(),this.enableDamping===!0?this.target.addScaledVector(this._panOffset,this.dampingFactor):this.target.add(this._panOffset),this.target.sub(this.cursor),this.target.clampLength(this.minTargetRadius,this.maxTargetRadius),this.target.add(this.cursor);let r=!1;if(this.zoomToCursor&&this._performCursorZoom||this.object.isOrthographicCamera)this._spherical.radius=this._clampDistance(this._spherical.radius);else{const a=this._spherical.radius;this._spherical.radius=this._clampDistance(this._spherical.radius*this._scale),r=a!=this._spherical.radius}if(Tt.setFromSpherical(this._spherical),Tt.applyQuaternion(this._quatInverse),t.copy(this.target).add(Tt),this.object.lookAt(this.target),this.enableDamping===!0?(this._sphericalDelta.theta*=1-this.dampingFactor,this._sphericalDelta.phi*=1-this.dampingFactor,this._panOffset.multiplyScalar(1-this.dampingFactor)):(this._sphericalDelta.set(0,0,0),this._panOffset.set(0,0,0)),this.zoomToCursor&&this._performCursorZoom){let a=null;if(this.object.isPerspectiveCamera){const o=Tt.length();a=this._clampDistance(o*this._scale);const l=o-a;this.object.position.addScaledVector(this._dollyDirection,l),this.object.updateMatrixWorld(),r=!!l}else if(this.object.isOrthographicCamera){const o=new P(this._mouse.x,this._mouse.y,0);o.unproject(this.object);const l=this.object.zoom;this.object.zoom=Math.max(this.minZoom,Math.min(this.maxZoom,this.object.zoom/this._scale)),this.object.updateProjectionMatrix(),r=l!==this.object.zoom;const c=new P(this._mouse.x,this._mouse.y,0);c.unproject(this.object),this.object.position.sub(c).add(o),this.object.updateMatrixWorld(),a=Tt.length()}else console.warn("WARNING: OrbitControls.js encountered an unknown camera type - zoom to cursor disabled."),this.zoomToCursor=!1;a!==null&&(this.screenSpacePanning?this.target.set(0,0,-1).transformDirection(this.object.matrix).multiplyScalar(a).add(this.object.position):(Qa.origin.copy(this.object.position),Qa.direction.set(0,0,-1).transformDirection(this.object.matrix),Math.abs(this.object.up.dot(Qa.direction))<WS?this.object.lookAt(this.target):(tf.setFromNormalAndCoplanarPoint(this.object.up,this.target),Qa.intersectPlane(tf,this.target))))}else if(this.object.isOrthographicCamera){const a=this.object.zoom;this.object.zoom=Math.max(this.minZoom,Math.min(this.maxZoom,this.object.zoom/this._scale)),a!==this.object.zoom&&(this.object.updateProjectionMatrix(),r=!0)}return this._scale=1,this._performCursorZoom=!1,r||this._lastPosition.distanceToSquared(this.object.position)>Kl||8*(1-this._lastQuaternion.dot(this.object.quaternion))>Kl||this._lastTargetPosition.distanceToSquared(this.target)>Kl?(this.dispatchEvent(ef),this._lastPosition.copy(this.object.position),this._lastQuaternion.copy(this.object.quaternion),this._lastTargetPosition.copy(this.target),!0):!1}_getAutoRotationAngle(e){return e!==null?Qt/60*this.autoRotateSpeed*e:Qt/60/60*this.autoRotateSpeed}_getZoomScale(e){const t=Math.abs(e*.01);return Math.pow(.95,this.zoomSpeed*t)}_rotateLeft(e){this._sphericalDelta.theta-=e}_rotateUp(e){this._sphericalDelta.phi-=e}_panLeft(e,t){Tt.setFromMatrixColumn(t,0),Tt.multiplyScalar(-e),this._panOffset.add(Tt)}_panUp(e,t){this.screenSpacePanning===!0?Tt.setFromMatrixColumn(t,1):(Tt.setFromMatrixColumn(t,0),Tt.crossVectors(this.object.up,Tt)),Tt.multiplyScalar(e),this._panOffset.add(Tt)}_pan(e,t){const n=this.domElement;if(this.object.isPerspectiveCamera){const s=this.object.position;Tt.copy(s).sub(this.target);let r=Tt.length();r*=Math.tan(this.object.fov/2*Math.PI/180),this._panLeft(2*e*r/n.clientHeight,this.object.matrix),this._panUp(2*t*r/n.clientHeight,this.object.matrix)}else this.object.isOrthographicCamera?(this._panLeft(e*(this.object.right-this.object.left)/this.object.zoom/n.clientWidth,this.object.matrix),this._panUp(t*(this.object.top-this.object.bottom)/this.object.zoom/n.clientHeight,this.object.matrix)):(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - pan disabled."),this.enablePan=!1)}_dollyOut(e){this.object.isPerspectiveCamera||this.object.isOrthographicCamera?this._scale/=e:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),this.enableZoom=!1)}_dollyIn(e){this.object.isPerspectiveCamera||this.object.isOrthographicCamera?this._scale*=e:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),this.enableZoom=!1)}_updateZoomParameters(e,t){if(!this.zoomToCursor)return;this._performCursorZoom=!0;const n=this.domElement.getBoundingClientRect(),s=e-n.left,r=t-n.top,a=n.width,o=n.height;this._mouse.x=s/a*2-1,this._mouse.y=-(r/o)*2+1,this._dollyDirection.set(this._mouse.x,this._mouse.y,1).unproject(this.object).sub(this.object.position).normalize()}_clampDistance(e){return Math.max(this.minDistance,Math.min(this.maxDistance,e))}_handleMouseDownRotate(e){this._rotateStart.set(e.clientX,e.clientY)}_handleMouseDownDolly(e){this._updateZoomParameters(e.clientX,e.clientX),this._dollyStart.set(e.clientX,e.clientY)}_handleMouseDownPan(e){this._panStart.set(e.clientX,e.clientY)}_handleMouseMoveRotate(e){this._rotateEnd.set(e.clientX,e.clientY),this._rotateDelta.subVectors(this._rotateEnd,this._rotateStart).multiplyScalar(this.rotateSpeed);const t=this.domElement;this._rotateLeft(Qt*this._rotateDelta.x/t.clientHeight),this._rotateUp(Qt*this._rotateDelta.y/t.clientHeight),this._rotateStart.copy(this._rotateEnd),this.update()}_handleMouseMoveDolly(e){this._dollyEnd.set(e.clientX,e.clientY),this._dollyDelta.subVectors(this._dollyEnd,this._dollyStart),this._dollyDelta.y>0?this._dollyOut(this._getZoomScale(this._dollyDelta.y)):this._dollyDelta.y<0&&this._dollyIn(this._getZoomScale(this._dollyDelta.y)),this._dollyStart.copy(this._dollyEnd),this.update()}_handleMouseMovePan(e){this._panEnd.set(e.clientX,e.clientY),this._panDelta.subVectors(this._panEnd,this._panStart).multiplyScalar(this.panSpeed),this._pan(this._panDelta.x,this._panDelta.y),this._panStart.copy(this._panEnd),this.update()}_handleMouseWheel(e){this._updateZoomParameters(e.clientX,e.clientY),e.deltaY<0?this._dollyIn(this._getZoomScale(e.deltaY)):e.deltaY>0&&this._dollyOut(this._getZoomScale(e.deltaY)),this.update()}_handleKeyDown(e){let t=!1;switch(e.code){case this.keys.UP:e.ctrlKey||e.metaKey||e.shiftKey?this.enableRotate&&this._rotateUp(Qt*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(0,this.keyPanSpeed),t=!0;break;case this.keys.BOTTOM:e.ctrlKey||e.metaKey||e.shiftKey?this.enableRotate&&this._rotateUp(-Qt*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(0,-this.keyPanSpeed),t=!0;break;case this.keys.LEFT:e.ctrlKey||e.metaKey||e.shiftKey?this.enableRotate&&this._rotateLeft(Qt*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(this.keyPanSpeed,0),t=!0;break;case this.keys.RIGHT:e.ctrlKey||e.metaKey||e.shiftKey?this.enableRotate&&this._rotateLeft(-Qt*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(-this.keyPanSpeed,0),t=!0;break}t&&(e.preventDefault(),this.update())}_handleTouchStartRotate(e){if(this._pointers.length===1)this._rotateStart.set(e.pageX,e.pageY);else{const t=this._getSecondPointerPosition(e),n=.5*(e.pageX+t.x),s=.5*(e.pageY+t.y);this._rotateStart.set(n,s)}}_handleTouchStartPan(e){if(this._pointers.length===1)this._panStart.set(e.pageX,e.pageY);else{const t=this._getSecondPointerPosition(e),n=.5*(e.pageX+t.x),s=.5*(e.pageY+t.y);this._panStart.set(n,s)}}_handleTouchStartDolly(e){const t=this._getSecondPointerPosition(e),n=e.pageX-t.x,s=e.pageY-t.y,r=Math.sqrt(n*n+s*s);this._dollyStart.set(0,r)}_handleTouchStartDollyPan(e){this.enableZoom&&this._handleTouchStartDolly(e),this.enablePan&&this._handleTouchStartPan(e)}_handleTouchStartDollyRotate(e){this.enableZoom&&this._handleTouchStartDolly(e),this.enableRotate&&this._handleTouchStartRotate(e)}_handleTouchMoveRotate(e){if(this._pointers.length==1)this._rotateEnd.set(e.pageX,e.pageY);else{const n=this._getSecondPointerPosition(e),s=.5*(e.pageX+n.x),r=.5*(e.pageY+n.y);this._rotateEnd.set(s,r)}this._rotateDelta.subVectors(this._rotateEnd,this._rotateStart).multiplyScalar(this.rotateSpeed);const t=this.domElement;this._rotateLeft(Qt*this._rotateDelta.x/t.clientHeight),this._rotateUp(Qt*this._rotateDelta.y/t.clientHeight),this._rotateStart.copy(this._rotateEnd)}_handleTouchMovePan(e){if(this._pointers.length===1)this._panEnd.set(e.pageX,e.pageY);else{const t=this._getSecondPointerPosition(e),n=.5*(e.pageX+t.x),s=.5*(e.pageY+t.y);this._panEnd.set(n,s)}this._panDelta.subVectors(this._panEnd,this._panStart).multiplyScalar(this.panSpeed),this._pan(this._panDelta.x,this._panDelta.y),this._panStart.copy(this._panEnd)}_handleTouchMoveDolly(e){const t=this._getSecondPointerPosition(e),n=e.pageX-t.x,s=e.pageY-t.y,r=Math.sqrt(n*n+s*s);this._dollyEnd.set(0,r),this._dollyDelta.set(0,Math.pow(this._dollyEnd.y/this._dollyStart.y,this.zoomSpeed)),this._dollyOut(this._dollyDelta.y),this._dollyStart.copy(this._dollyEnd);const a=(e.pageX+t.x)*.5,o=(e.pageY+t.y)*.5;this._updateZoomParameters(a,o)}_handleTouchMoveDollyPan(e){this.enableZoom&&this._handleTouchMoveDolly(e),this.enablePan&&this._handleTouchMovePan(e)}_handleTouchMoveDollyRotate(e){this.enableZoom&&this._handleTouchMoveDolly(e),this.enableRotate&&this._handleTouchMoveRotate(e)}_addPointer(e){this._pointers.push(e.pointerId)}_removePointer(e){delete this._pointerPositions[e.pointerId];for(let t=0;t<this._pointers.length;t++)if(this._pointers[t]==e.pointerId){this._pointers.splice(t,1);return}}_isTrackingPointer(e){for(let t=0;t<this._pointers.length;t++)if(this._pointers[t]==e.pointerId)return!0;return!1}_trackPointer(e){let t=this._pointerPositions[e.pointerId];t===void 0&&(t=new j,this._pointerPositions[e.pointerId]=t),t.set(e.pageX,e.pageY)}_getSecondPointerPosition(e){const t=e.pointerId===this._pointers[0]?this._pointers[1]:this._pointers[0];return this._pointerPositions[t]}_customWheelEvent(e){const t=e.deltaMode,n={clientX:e.clientX,clientY:e.clientY,deltaY:e.deltaY};switch(t){case 1:n.deltaY*=16;break;case 2:n.deltaY*=100;break}return e.ctrlKey&&!this._controlActive&&(n.deltaY*=10),n}}function KS(i){this.enabled!==!1&&(this._pointers.length===0&&(this.domElement.setPointerCapture(i.pointerId),this.domElement.ownerDocument.addEventListener("pointermove",this._onPointerMove),this.domElement.ownerDocument.addEventListener("pointerup",this._onPointerUp)),!this._isTrackingPointer(i)&&(this._addPointer(i),i.pointerType==="touch"?this._onTouchStart(i):this._onMouseDown(i),this._cursorStyle==="grab"&&(this.domElement.style.cursor="grabbing")))}function YS(i){this.enabled!==!1&&(i.pointerType==="touch"?this._onTouchMove(i):this._onMouseMove(i))}function qS(i){switch(this._removePointer(i),this._pointers.length){case 0:this.domElement.releasePointerCapture(i.pointerId),this.domElement.ownerDocument.removeEventListener("pointermove",this._onPointerMove),this.domElement.ownerDocument.removeEventListener("pointerup",this._onPointerUp),this.dispatchEvent(zp),this.state=ft.NONE,this._cursorStyle==="grab"&&(this.domElement.style.cursor="grab");break;case 1:const e=this._pointers[0],t=this._pointerPositions[e];this._onTouchStart({pointerId:e,pageX:t.x,pageY:t.y});break}}function jS(i){let e;switch(i.button){case 0:e=this.mouseButtons.LEFT;break;case 1:e=this.mouseButtons.MIDDLE;break;case 2:e=this.mouseButtons.RIGHT;break;default:e=-1}switch(e){case Us.DOLLY:if(this.enableZoom===!1)return;this._handleMouseDownDolly(i),this.state=ft.DOLLY;break;case Us.ROTATE:if(i.ctrlKey||i.metaKey||i.shiftKey){if(this.enablePan===!1)return;this._handleMouseDownPan(i),this.state=ft.PAN}else{if(this.enableRotate===!1)return;this._handleMouseDownRotate(i),this.state=ft.ROTATE}break;case Us.PAN:if(i.ctrlKey||i.metaKey||i.shiftKey){if(this.enableRotate===!1)return;this._handleMouseDownRotate(i),this.state=ft.ROTATE}else{if(this.enablePan===!1)return;this._handleMouseDownPan(i),this.state=ft.PAN}break;default:this.state=ft.NONE}this.state!==ft.NONE&&this.dispatchEvent(ru)}function $S(i){switch(this.state){case ft.ROTATE:if(this.enableRotate===!1)return;this._handleMouseMoveRotate(i);break;case ft.DOLLY:if(this.enableZoom===!1)return;this._handleMouseMoveDolly(i);break;case ft.PAN:if(this.enablePan===!1)return;this._handleMouseMovePan(i);break}}function JS(i){this.enabled===!1||this.enableZoom===!1||this.state!==ft.NONE||(i.preventDefault(),this.dispatchEvent(ru),this._handleMouseWheel(this._customWheelEvent(i)),this.dispatchEvent(zp))}function ZS(i){this.enabled!==!1&&this._handleKeyDown(i)}function QS(i){switch(this._trackPointer(i),this._pointers.length){case 1:switch(this.touches.ONE){case Ds.ROTATE:if(this.enableRotate===!1)return;this._handleTouchStartRotate(i),this.state=ft.TOUCH_ROTATE;break;case Ds.PAN:if(this.enablePan===!1)return;this._handleTouchStartPan(i),this.state=ft.TOUCH_PAN;break;default:this.state=ft.NONE}break;case 2:switch(this.touches.TWO){case Ds.DOLLY_PAN:if(this.enableZoom===!1&&this.enablePan===!1)return;this._handleTouchStartDollyPan(i),this.state=ft.TOUCH_DOLLY_PAN;break;case Ds.DOLLY_ROTATE:if(this.enableZoom===!1&&this.enableRotate===!1)return;this._handleTouchStartDollyRotate(i),this.state=ft.TOUCH_DOLLY_ROTATE;break;default:this.state=ft.NONE}break;default:this.state=ft.NONE}this.state!==ft.NONE&&this.dispatchEvent(ru)}function eE(i){switch(this._trackPointer(i),this.state){case ft.TOUCH_ROTATE:if(this.enableRotate===!1)return;this._handleTouchMoveRotate(i),this.update();break;case ft.TOUCH_PAN:if(this.enablePan===!1)return;this._handleTouchMovePan(i),this.update();break;case ft.TOUCH_DOLLY_PAN:if(this.enableZoom===!1&&this.enablePan===!1)return;this._handleTouchMoveDollyPan(i),this.update();break;case ft.TOUCH_DOLLY_ROTATE:if(this.enableZoom===!1&&this.enableRotate===!1)return;this._handleTouchMoveDollyRotate(i),this.update();break;default:this.state=ft.NONE}}function tE(i){this.enabled!==!1&&i.preventDefault()}function nE(i){i.key==="Control"&&(this._controlActive=!0,this.domElement.getRootNode().addEventListener("keyup",this._interceptControlUp,{passive:!0,capture:!0}))}function iE(i){i.key==="Control"&&(this._controlActive=!1,this.domElement.getRootNode().removeEventListener("keyup",this._interceptControlUp,{passive:!0,capture:!0}))}const So={name:"CopyShader",uniforms:{tDiffuse:{value:null},opacity:{value:1}},vertexShader:`

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


		}`};class hr{constructor(){this.isPass=!0,this.enabled=!0,this.needsSwap=!0,this.clear=!1,this.renderToScreen=!1}setSize(){}render(){console.error("THREE.Pass: .render() must be implemented in derived pass.")}dispose(){}}const sE=new pa(-1,1,1,-1,0,1);class rE extends et{constructor(){super(),this.setAttribute("position",new ze([-1,3,0,-1,-1,0,3,-1,0],3)),this.setAttribute("uv",new ze([0,2,0,0,2,0],2))}}const aE=new rE;class au{constructor(e){this._mesh=new st(aE,e)}dispose(){this._mesh.geometry.dispose()}render(e){e.render(this._mesh,sE)}get material(){return this._mesh.material}set material(e){this._mesh.material=e}}class kp extends hr{constructor(e,t="tDiffuse"){super(),this.textureID=t,this.uniforms=null,this.material=null,e instanceof Gt?(this.uniforms=e.uniforms,this.material=e):e&&(this.uniforms=$i.clone(e.uniforms),this.material=new Gt({name:e.name!==void 0?e.name:"unspecified",defines:Object.assign({},e.defines),uniforms:this.uniforms,vertexShader:e.vertexShader,fragmentShader:e.fragmentShader})),this._fsQuad=new au(this.material)}render(e,t,n){this.uniforms[this.textureID]&&(this.uniforms[this.textureID].value=n.texture),this._fsQuad.material=this.material,this.renderToScreen?(e.setRenderTarget(null),this._fsQuad.render(e)):(e.setRenderTarget(t),this.clear&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),this._fsQuad.render(e))}dispose(){this.material.dispose(),this._fsQuad.dispose()}}class nf extends hr{constructor(e,t){super(),this.scene=e,this.camera=t,this.clear=!0,this.needsSwap=!1,this.inverse=!1}render(e,t,n){const s=e.getContext(),r=e.state;r.buffers.color.setMask(!1),r.buffers.depth.setMask(!1),r.buffers.color.setLocked(!0),r.buffers.depth.setLocked(!0);let a,o;this.inverse?(a=0,o=1):(a=1,o=0),r.buffers.stencil.setTest(!0),r.buffers.stencil.setOp(s.REPLACE,s.REPLACE,s.REPLACE),r.buffers.stencil.setFunc(s.ALWAYS,a,4294967295),r.buffers.stencil.setClear(o),r.buffers.stencil.setLocked(!0),e.setRenderTarget(n),this.clear&&e.clear(),e.render(this.scene,this.camera),e.setRenderTarget(t),this.clear&&e.clear(),e.render(this.scene,this.camera),r.buffers.color.setLocked(!1),r.buffers.depth.setLocked(!1),r.buffers.color.setMask(!0),r.buffers.depth.setMask(!0),r.buffers.stencil.setLocked(!1),r.buffers.stencil.setFunc(s.EQUAL,1,4294967295),r.buffers.stencil.setOp(s.KEEP,s.KEEP,s.KEEP),r.buffers.stencil.setLocked(!0)}}class oE extends hr{constructor(){super(),this.needsSwap=!1}render(e){e.state.buffers.stencil.setLocked(!1),e.state.buffers.stencil.setTest(!1)}}class lE{constructor(e,t){if(this.renderer=e,this._pixelRatio=e.getPixelRatio(),t===void 0){const n=e.getSize(new j);this._width=n.width,this._height=n.height,t=new nn(this._width*this._pixelRatio,this._height*this._pixelRatio,{type:ln}),t.texture.name="EffectComposer.rt1"}else this._width=t.width,this._height=t.height;this.renderTarget1=t,this.renderTarget2=t.clone(),this.renderTarget2.texture.name="EffectComposer.rt2",this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2,this.renderToScreen=!0,this.passes=[],this.copyPass=new kp(So),this.copyPass.material.blending=Yn,this.timer=new D_}swapBuffers(){const e=this.readBuffer;this.readBuffer=this.writeBuffer,this.writeBuffer=e}addPass(e){this.passes.push(e),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}insertPass(e,t){this.passes.splice(t,0,e),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}removePass(e){const t=this.passes.indexOf(e);t!==-1&&this.passes.splice(t,1)}isLastEnabledPass(e){for(let t=e+1;t<this.passes.length;t++)if(this.passes[t].enabled)return!1;return!0}render(e){this.timer.update(),e===void 0&&(e=this.timer.getDelta());const t=this.renderer.getRenderTarget();let n=!1;for(let s=0,r=this.passes.length;s<r;s++){const a=this.passes[s];if(a.enabled!==!1){if(a.renderToScreen=this.renderToScreen&&this.isLastEnabledPass(s),a.render(this.renderer,this.writeBuffer,this.readBuffer,e,n),a.needsSwap){if(n){const o=this.renderer.getContext(),l=this.renderer.state.buffers.stencil;l.setFunc(o.NOTEQUAL,1,4294967295),this.copyPass.render(this.renderer,this.writeBuffer,this.readBuffer,e),l.setFunc(o.EQUAL,1,4294967295)}this.swapBuffers()}nf!==void 0&&(a instanceof nf?n=!0:a instanceof oE&&(n=!1))}}this.renderer.setRenderTarget(t)}reset(e){if(e===void 0){const t=this.renderer.getSize(new j);this._pixelRatio=this.renderer.getPixelRatio(),this._width=t.width,this._height=t.height,e=this.renderTarget1.clone(),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.renderTarget1=e,this.renderTarget2=e.clone(),this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2}setSize(e,t){this._width=e,this._height=t;const n=this._width*this._pixelRatio,s=this._height*this._pixelRatio;this.renderTarget1.setSize(n,s),this.renderTarget2.setSize(n,s);for(let r=0;r<this.passes.length;r++)this.passes[r].setSize(n,s)}setPixelRatio(e){this._pixelRatio=e,this.setSize(this._width,this._height)}dispose(){this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.copyPass.dispose()}}class cE extends hr{constructor(e,t,n=null,s=null,r=null){super(),this.scene=e,this.camera=t,this.overrideMaterial=n,this.clearColor=s,this.clearAlpha=r,this.clear=!0,this.clearDepth=!1,this.needsSwap=!1,this.isRenderPass=!0,this._oldClearColor=new Me}render(e,t,n){const s=e.autoClear;e.autoClear=!1;let r,a;this.overrideMaterial!==null&&(a=this.scene.overrideMaterial,this.scene.overrideMaterial=this.overrideMaterial),this.clearColor!==null&&(e.getClearColor(this._oldClearColor),e.setClearColor(this.clearColor,e.getClearAlpha())),this.clearAlpha!==null&&(r=e.getClearAlpha(),e.setClearAlpha(this.clearAlpha)),this.clearDepth==!0&&e.clearDepth(),e.setRenderTarget(this.renderToScreen?null:n),this.clear===!0&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),e.render(this.scene,this.camera),this.clearColor!==null&&e.setClearColor(this._oldClearColor),this.clearAlpha!==null&&e.setClearAlpha(r),this.overrideMaterial!==null&&(this.scene.overrideMaterial=a),e.autoClear=s}}const hE={uniforms:{tDiffuse:{value:null},luminosityThreshold:{value:1},smoothWidth:{value:1},defaultColor:{value:new Me(0)},defaultOpacity:{value:0}},vertexShader:`

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

		}`};class Qs extends hr{constructor(e,t=1,n,s){super(),this.strength=t,this.radius=n,this.threshold=s,this.resolution=e!==void 0?new j(e.x,e.y):new j(256,256),this.clearColor=new Me(0,0,0),this.needsSwap=!1,this.renderTargetsHorizontal=[],this.renderTargetsVertical=[],this.nMips=5;let r=Math.round(this.resolution.x/2),a=Math.round(this.resolution.y/2);this.renderTargetBright=new nn(r,a,{type:ln}),this.renderTargetBright.texture.name="UnrealBloomPass.bright",this.renderTargetBright.texture.generateMipmaps=!1;for(let h=0;h<this.nMips;h++){const u=new nn(r,a,{type:ln});u.texture.name="UnrealBloomPass.h"+h,u.texture.generateMipmaps=!1,this.renderTargetsHorizontal.push(u);const d=new nn(r,a,{type:ln});d.texture.name="UnrealBloomPass.v"+h,d.texture.generateMipmaps=!1,this.renderTargetsVertical.push(d),r=Math.round(r/2),a=Math.round(a/2)}const o=hE;this.highPassUniforms=$i.clone(o.uniforms),this.highPassUniforms.luminosityThreshold.value=s,this.highPassUniforms.smoothWidth.value=.01,this.materialHighPassFilter=new Gt({uniforms:this.highPassUniforms,vertexShader:o.vertexShader,fragmentShader:o.fragmentShader}),this.separableBlurMaterials=[];const l=[6,10,14,18,22];r=Math.round(this.resolution.x/2),a=Math.round(this.resolution.y/2);for(let h=0;h<this.nMips;h++)this.separableBlurMaterials.push(this._getSeparableBlurMaterial(l[h])),this.separableBlurMaterials[h].uniforms.invSize.value=new j(1/r,1/a),r=Math.round(r/2),a=Math.round(a/2);this.compositeMaterial=this._getCompositeMaterial(this.nMips),this.compositeMaterial.uniforms.blurTexture1.value=this.renderTargetsVertical[0].texture,this.compositeMaterial.uniforms.blurTexture2.value=this.renderTargetsVertical[1].texture,this.compositeMaterial.uniforms.blurTexture3.value=this.renderTargetsVertical[2].texture,this.compositeMaterial.uniforms.blurTexture4.value=this.renderTargetsVertical[3].texture,this.compositeMaterial.uniforms.blurTexture5.value=this.renderTargetsVertical[4].texture,this.compositeMaterial.uniforms.bloomStrength.value=t,this.compositeMaterial.uniforms.bloomRadius.value=.1;const c=[1,.8,.6,.4,.2];this.compositeMaterial.uniforms.bloomFactors.value=c,this.bloomTintColors=[new P(1,1,1),new P(1,1,1),new P(1,1,1),new P(1,1,1),new P(1,1,1)],this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors,this.copyUniforms=$i.clone(So.uniforms),this.blendMaterial=new Gt({uniforms:this.copyUniforms,vertexShader:So.vertexShader,fragmentShader:So.fragmentShader,premultipliedAlpha:!0,blending:Cn,depthTest:!1,depthWrite:!1,transparent:!0}),this._oldClearColor=new Me,this._oldClearAlpha=1,this._basic=new yt,this._fsQuad=new au(null)}dispose(){for(let e=0;e<this.renderTargetsHorizontal.length;e++)this.renderTargetsHorizontal[e].dispose();for(let e=0;e<this.renderTargetsVertical.length;e++)this.renderTargetsVertical[e].dispose();this.renderTargetBright.dispose();for(let e=0;e<this.separableBlurMaterials.length;e++)this.separableBlurMaterials[e].dispose();this.compositeMaterial.dispose(),this.blendMaterial.dispose(),this._basic.dispose(),this._fsQuad.dispose()}setSize(e,t){let n=Math.round(e/2),s=Math.round(t/2);this.renderTargetBright.setSize(n,s);for(let r=0;r<this.nMips;r++)this.renderTargetsHorizontal[r].setSize(n,s),this.renderTargetsVertical[r].setSize(n,s),this.separableBlurMaterials[r].uniforms.invSize.value=new j(1/n,1/s),n=Math.round(n/2),s=Math.round(s/2)}render(e,t,n,s,r){e.getClearColor(this._oldClearColor),this._oldClearAlpha=e.getClearAlpha();const a=e.autoClear;e.autoClear=!1,e.setClearColor(this.clearColor,0),r&&e.state.buffers.stencil.setTest(!1),this.renderToScreen&&(this._fsQuad.material=this._basic,this._basic.map=n.texture,e.setRenderTarget(null),e.clear(),this._fsQuad.render(e)),this.highPassUniforms.tDiffuse.value=n.texture,this.highPassUniforms.luminosityThreshold.value=this.threshold,this._fsQuad.material=this.materialHighPassFilter,e.setRenderTarget(this.renderTargetBright),e.clear(),this._fsQuad.render(e);let o=this.renderTargetBright;for(let l=0;l<this.nMips;l++)this._fsQuad.material=this.separableBlurMaterials[l],this.separableBlurMaterials[l].uniforms.colorTexture.value=o.texture,this.separableBlurMaterials[l].uniforms.direction.value=Qs.BlurDirectionX,e.setRenderTarget(this.renderTargetsHorizontal[l]),e.clear(),this._fsQuad.render(e),this.separableBlurMaterials[l].uniforms.colorTexture.value=this.renderTargetsHorizontal[l].texture,this.separableBlurMaterials[l].uniforms.direction.value=Qs.BlurDirectionY,e.setRenderTarget(this.renderTargetsVertical[l]),e.clear(),this._fsQuad.render(e),o=this.renderTargetsVertical[l];this._fsQuad.material=this.compositeMaterial,this.compositeMaterial.uniforms.bloomStrength.value=this.strength,this.compositeMaterial.uniforms.bloomRadius.value=this.radius,this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors,e.setRenderTarget(this.renderTargetsHorizontal[0]),e.clear(),this._fsQuad.render(e),this._fsQuad.material=this.blendMaterial,this.copyUniforms.tDiffuse.value=this.renderTargetsHorizontal[0].texture,r&&e.state.buffers.stencil.setTest(!0),this.renderToScreen?(e.setRenderTarget(null),this._fsQuad.render(e)):(e.setRenderTarget(n),this._fsQuad.render(e)),e.setClearColor(this._oldClearColor,this._oldClearAlpha),e.autoClear=a}_getSeparableBlurMaterial(e){const t=[],n=e/3;for(let s=0;s<e;s++)t.push(.39894*Math.exp(-.5*s*s/(n*n))/n);return new Gt({defines:{KERNEL_RADIUS:e},uniforms:{colorTexture:{value:null},invSize:{value:new j(.5,.5)},direction:{value:new j(.5,.5)},gaussianCoefficients:{value:t}},vertexShader:`

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

				}`})}_getCompositeMaterial(e){return new Gt({defines:{NUM_MIPS:e},uniforms:{blurTexture1:{value:null},blurTexture2:{value:null},blurTexture3:{value:null},blurTexture4:{value:null},blurTexture5:{value:null},bloomStrength:{value:1},bloomFactors:{value:null},bloomTintColors:{value:null},bloomRadius:{value:0}},vertexShader:`

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

				}`})}}Qs.BlurDirectionX=new j(1,0);Qs.BlurDirectionY=new j(0,1);const eo={name:"OutputShader",uniforms:{tDiffuse:{value:null},toneMappingExposure:{value:1}},vertexShader:`
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

		}`};class uE extends hr{constructor(){super(),this.isOutputPass=!0,this.uniforms=$i.clone(eo.uniforms),this.material=new wp({name:eo.name,uniforms:this.uniforms,vertexShader:eo.vertexShader,fragmentShader:eo.fragmentShader}),this._fsQuad=new au(this.material),this._outputColorSpace=null,this._toneMapping=null}render(e,t,n){this.uniforms.tDiffuse.value=n.texture,this.uniforms.toneMappingExposure.value=e.toneMappingExposure,(this._outputColorSpace!==e.outputColorSpace||this._toneMapping!==e.toneMapping)&&(this._outputColorSpace=e.outputColorSpace,this._toneMapping=e.toneMapping,this.material.defines={},Qe.getTransfer(this._outputColorSpace)===nt&&(this.material.defines.SRGB_TRANSFER=""),this._toneMapping===Eh?this.material.defines.LINEAR_TONE_MAPPING="":this._toneMapping===bh?this.material.defines.REINHARD_TONE_MAPPING="":this._toneMapping===Th?this.material.defines.CINEON_TONE_MAPPING="":this._toneMapping===Wo?this.material.defines.ACES_FILMIC_TONE_MAPPING="":this._toneMapping===wh?this.material.defines.AGX_TONE_MAPPING="":this._toneMapping===Ch?this.material.defines.NEUTRAL_TONE_MAPPING="":this._toneMapping===Ah&&(this.material.defines.CUSTOM_TONE_MAPPING=""),this.material.needsUpdate=!0),this.renderToScreen===!0?(e.setRenderTarget(null),this._fsQuad.render(e)):(e.setRenderTarget(t),this.clear&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),this._fsQuad.render(e))}dispose(){this.material.dispose(),this._fsQuad.dispose()}}const ws=256;function sf(i,e){return Math.floor((i+180)/360*(1<<e))}function rf(i,e){const t=i*Math.PI/180;return Math.floor((1-Math.log(Math.tan(t)+1/Math.cos(t))/Math.PI)/2*(1<<e))}function af(i,e){return i/(1<<e)*360-180}function of(i,e){const t=Math.PI-2*Math.PI*i/(1<<e);return 180/Math.PI*Math.atan(Math.sinh(t))}function dE(i){return new Promise(e=>{const t=new Image;t.crossOrigin="anonymous",t.onload=()=>e(t),t.onerror=()=>e(null),t.src=i})}async function Nr(i,e,t,n,s=600){const r=e-t,a=e+t,o=i-t,l=i+t,c=sf(r,n),h=sf(a,n),u=rf(l,n),d=rf(o,n),f=h-c+1,g=d-u+1,_=f*g;if(_>s)return console.warn(`[MapTiles] Skipping zoom ${n}: ${_} tiles exceeds ${s}`),null;const p=f*ws,m=g*ws,M=document.createElement("canvas");M.width=p,M.height=m;const y=M.getContext("2d");y.fillStyle="#050d1a",y.fillRect(0,0,p,m);const S=[];for(let E=u;E<=d;E++)for(let N=c;N<=h;N++)S.push({tx:N,ty:E});await Promise.all(S.map(({tx:E,ty:N})=>{const C=(E-c)*ws,O=(N-u)*ws,V=`https://${"abcd"[(E+N)%4]}.basemaps.cartocdn.com/dark_all/${n}/${E}/${N}@2x.png`;return dE(V).then(z=>{z&&y.drawImage(z,C,O,ws,ws)})}));const w=af(c,n),T=af(h+1,n),L=of(u,n),x=of(d+1,n);return{canvas:M,canvasLonMin:w,canvasLonMax:T,canvasLatMin:x,canvasLatMax:L}}function Ur(i,e,t,n,s){const r=new ua(i.canvas);r.generateMipmaps=!0,r.minFilter=Rn,r.magFilter=_t,r.colorSpace=Nt,r.anisotropy=16;const a=(e-i.canvasLonMin)/(i.canvasLonMax-i.canvasLonMin),o=(n-i.canvasLatMin)/(i.canvasLatMax-i.canvasLatMin),l=(t-e)/(i.canvasLonMax-i.canvasLonMin),c=(s-n)/(i.canvasLatMax-i.canvasLatMin);return r.offset.set(a,o),r.repeat.set(l,c),r.wrapS=mn,r.wrapT=mn,r}async function fE(i,e,t,n){const s=t/2,r=e-s,a=e+s,o=i-s,l=i+s,c=await Nr(i,e,s,10);if(!c)throw new Error("Failed to load base map tiles");const h=Ur(c,r,a,o,l);return n&&pE(i,e,s,r,a,o,l,n),h}async function pE(i,e,t,n,s,r,a,o){try{const l=Math.min(t,1),c=await Nr(i,e,l,12,1e3);c&&o(Ur(c,e-l,e+l,i-l,i+l),{lonMin:e-l,lonMax:e+l,latMin:i-l,latMax:i+l});const h=.55,u=await Nr(i,e,h,13,1e3);u&&o(Ur(u,e-h,e+h,i-h,i+h),{lonMin:e-h,lonMax:e+h,latMin:i-h,latMax:i+h});const d=.35,f=await Nr(i,e,d,14,2e3);f&&o(Ur(f,e-d,e+d,i-d,i+d),{lonMin:e-d,lonMax:e+d,latMin:i-d,latMax:i+d});const g=.12,_=await Nr(i,e,g,16,2e3);_&&o(Ur(_,e-g,e+g,i-g,i+g),{lonMin:e-g,lonMax:e+g,latMin:i-g,latMax:i+g})}catch(l){console.warn("[MapTiles] High-res load failed:",l.message)}}const mE=["/api/ovp-ru/api/interpreter","/api/ovp-de/api/interpreter","/api/ovp-kumi/api/interpreter"],Is=Math.PI/180;let Eo=null,Ls=null,bo=0;function gE(){bo++,Eo=null,Ls=null}async function _E(i,e,t=1.5){if(Eo)return Eo;if(Ls)return Ls;const n=bo;Ls=xE(i,e,t);try{const s=await Ls;return bo===n&&(Eo=s),s}finally{bo===n&&(Ls=null)}}async function xE(i,e,t){const n=(i-t).toFixed(4),s=(i+t).toFixed(4),r=(e-t).toFixed(4),a=(e+t).toFixed(4),o=`
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
`;let l;for(const c of mE)try{console.log(`[STRATUM] Trying Overpass: ${c}`);const h=new AbortController,u=setTimeout(()=>h.abort(),15e3),d=await fetch(c,{method:"POST",body:`data=${encodeURIComponent(o)}`,headers:{"Content-Type":"application/x-www-form-urlencoded"},signal:h.signal});if(clearTimeout(u),!d.ok)throw new Error(`HTTP ${d.status}`);const f=await d.json();return console.log(`[STRATUM] Overpass OK from ${c}`),vE(f)}catch(h){console.warn(`[STRATUM] Overpass failed (${c}):`,h.message),l=h}throw l||new Error("All Overpass endpoints failed")}function vE(i){const e=new Map,t=[],n=[],s=[];for(const r of i.elements){if(r.tags?.aeroway==="aerodrome"){const a=r.tags?.iata||"",o=r.tags?.icao||r.tags?.["icao:code"]||"";if(!a&&!o)continue;let l,c;if(r.type==="node")l=r.lat,c=r.lon;else if(r.bounds)l=(r.bounds.minlat+r.bounds.maxlat)/2,c=(r.bounds.minlon+r.bounds.maxlon)/2;else if(r.geometry?.length>0)l=r.geometry.reduce((u,d)=>u+d.lat,0)/r.geometry.length,c=r.geometry.reduce((u,d)=>u+d.lon,0)/r.geometry.length;else continue;const h=a||o;e.has(h)||e.set(h,{lat:l,lon:c,name:r.tags?.name||"",iata:a,icao:o})}if(r.type==="way"&&r.tags?.aeroway==="runway"&&r.geometry?.length>=2){const a=r.geometry,o=a[0],l=a[a.length-1],c=(l.lon-o.lon)*Math.cos((o.lat+l.lat)/2*Is),h=l.lat-o.lat;let u=Math.atan2(c,h)/Is;u<0&&(u+=360);const d=oh(o.lat,o.lon,l.lat,l.lon);t.push({lat:(o.lat+l.lat)/2,lon:(o.lon+l.lon)/2,startLat:o.lat,startLon:o.lon,endLat:l.lat,endLon:l.lon,heading:u,length:d,width:parseFloat(r.tags?.width)||45,ref:r.tags?.ref||ME(u),surface:r.tags?.surface||"asphalt"})}r.type==="way"&&r.tags?.aeroway==="taxiway"&&r.geometry?.length>=2&&n.push({ref:r.tags?.ref||"",width:parseFloat(r.tags?.width)||20,geometry:r.geometry.map(a=>({lat:a.lat,lon:a.lon}))}),r.type==="way"&&r.geometry?.length>=3&&(r.tags?.aeroway==="terminal"||r.tags?.building&&r.tags?.aeroway)&&s.push({name:r.tags?.name||"",geometry:r.geometry.map(a=>({lat:a.lat,lon:a.lon}))})}return{airports:[...e.values()],runways:t,taxiways:n,terminals:s}}function oh(i,e,t,n){const r=(t-i)*Is,a=(n-e)*Is,o=Math.sin(r/2)**2+Math.cos(i*Is)*Math.cos(t*Is)*Math.sin(a/2)**2;return 6371e3*2*Math.atan2(Math.sqrt(o),Math.sqrt(1-o))}function ME(i){const e=Math.round(i/10)%36||36,t=(e+18-1)%36+1;return`${String(e).padStart(2,"0")}/${String(t).padStart(2,"0")}`}function yE(i,e,t){const n=[],s=[],r=t.filter(a=>oh(a.lat,a.lon,e.lat,e.lon)<5e3);for(const a of i){if(a.latitude==null||a.longitude==null)continue;const o=oh(a.latitude,a.longitude,e.lat,e.lon);if(o>55e3)continue;const l=a.verticalRate||0,c=a.baroAltitude||0;l<-.5&&c<4e3?n.push(a):l>.5&&c<5e3?s.push(a):o<15e3&&c<1e3&&(l>.3?s.push(a):n.push(a))}return{arrivals:n,departures:s,runways:r}}const Bs=160,Kt=40;let kt=null,Ai=null,hi=1;const Bo=[];function SE(i){i.fog=new Ko(new Me(.008,.032,.068),.013);const e=new w_(3822967,.7);i.add(e);const t=new Dp(10075101,.35);t.position.set(20,60,30),i.add(t);const n=new Pi(Bs,Bs);kt=new yt({color:16777215,transparent:!0,opacity:.95}),Ai=new st(n,kt),Ai.rotation.x=-Math.PI/2,Ai.position.y=0,Ai.name="ground",kt.__scene=i,i.add(Ai);const s=new fa(185,64,16,0,Math.PI*2,0,Math.PI*.5),r=s.attributes.position,a=new Float32Array(r.count*3);for(let L=0;L<r.count;L++){const x=r.getY(L),E=Math.max(0,x/95);a[L*3]=.008+E*.012,a[L*3+1]=.035+E*.03,a[L*3+2]=.07+E*.06}s.setAttribute("color",new ze(a,3));const o=new yt({vertexColors:!0,side:Jt,fog:!1,depthWrite:!1}),l=new st(s,o);l.renderOrder=-100,i.add(l);const c=new q_(Bs,160,663098,663098);c.material.transparent=!0,c.material.opacity=.08,c.material.depthWrite=!1,c.position.y=.005,i.add(c);const h=new Pn;h.name="userPulse";const u=new Yh(.04,24),d=new yt({color:16777215,transparent:!0,opacity:.9,side:At}),f=new st(u,d);f.rotation.x=-Math.PI/2,f.position.y=.06,h.add(f);const g=new Qi({color:16777215,transparent:!0,opacity:.25}),_=.2,p=.08,m=[p,0,0,_,0,0,-p,0,0,-_,0,0,0,0,p,0,0,_,0,0,-p,0,0,-_],M=new et;M.setAttribute("position",new ze(m,3));const y=new qi(M,g);y.position.y=.05,h.add(y);const S=new qs(.12,.14,48),w=new yt({color:16777215,transparent:!0,opacity:.15,side:At}),T=new st(S,w);T.rotation.x=-Math.PI/2,T.position.y=.04,T.name="pulseRing",To=T,h.add(T),i.add(h)}async function Hp(i,e){hi=Math.cos(i*Math.PI/180),Ai&&(Ai.geometry.dispose(),Ai.geometry=new Pi(Bs*hi,Bs));const t=Bs/Kt;try{const n=await fE(i,e,t,(s,r)=>{if(r){const a=kt?.__scene;if(!a)return;const o=(r.lonMax-r.lonMin)*Kt*hi,l=(r.latMax-r.latMin)*Kt,c=((r.lonMin+r.lonMax)/2-e)*Kt*hi,h=-((r.latMin+r.latMax)/2-i)*Kt,u=.003+Bo.length*.002,d=new Pi(o,l),f=new yt({map:s,transparent:!0,opacity:.95,color:16777215,depthWrite:!1}),g=new st(d,f);g.rotation.x=-Math.PI/2,g.position.set(c,u,h),a.add(g),Bo.push(g)}else kt&&(kt.map&&kt.map.dispose(),kt.map=s,kt.needsUpdate=!0)});kt&&(kt.map=n,kt.needsUpdate=!0)}catch(n){console.warn("[STRATUM] Failed to load map tiles:",n.message)}}const Dn=111e3/Kt;let Ut=null,ou=[],en=null,Gp=0,Vp=0,lh=0,zs=null,Or=[],aa=[],oa=[],la=null,ca=null,To=null;async function Wp(i,e,t){const n=lh;Gp=e,Vp=t,aa=[],oa=[],la=null,ca=null;try{if(en=await _E(e,t,1.2),lh!==n)return;if(Ut=new Pn,Ut.name="airports",Ut.renderOrder=50,en.terminals)for(const a of en.terminals)RE(a,e,t);en.taxiways&&wE(en.taxiways,e,t);for(const a of en.runways)EE(a,e,t),TE(a,e,t);AE(en.runways,e,t);for(const a of en.airports)PE(a,e,t);i.add(Ut);const s=en.taxiways?.length||0,r=en.terminals?.length||0;console.log(`[STRATUM] Loaded ${en.airports.length} airports, ${en.runways.length} runways, ${s} taxiways, ${r} terminals`)}catch(s){console.warn("[STRATUM] Airport data fetch failed:",s.message)}}function Ji(i,e,t,n){return{x:(e-n)*Kt*hi,z:-(i-t)*Kt}}function EE(i,e,t){const n=(i.startLon-t)*Kt*hi,s=-(i.startLat-e)*Kt,r=(i.endLon-t)*Kt*hi,a=-(i.endLat-e)*Kt,o=r-n,l=a-s,c=Math.sqrt(o*o+l*l),h=Math.max(i.width/Dn,.012),u=Math.atan2(-l,o),d=(n+r)/2,f=(s+a)/2,g=bE(i.ref,i.length,i.width),_=new ua(g);_.minFilter=Rn,_.magFilter=_t,_.anisotropy=4;const p=new Pi(c,h),m=new yt({map:_,transparent:!0,opacity:.85,side:At,depthWrite:!1}),M=new st(p,m);M.rotation.x=-Math.PI/2,M.rotation.z=u,M.position.set(d,.038,f),Ut.add(M)}function bE(i,e,t){const r=document.createElement("canvas");r.width=2048,r.height=160;const a=r.getContext("2d"),o=2048/e;a.clearRect(0,0,2048,160),a.fillStyle="rgba(18, 24, 36, 0.75)",a.fillRect(0,0,2048,160),a.fillStyle="rgba(255,255,255,0.015)";for(let E=0;E<200;E++){const N=Math.random()*2048,C=Math.random()*160;a.fillRect(N,C,2+Math.random()*4,1)}a.fillStyle="rgba(255,255,255,0.45)";const l=Math.max(160*.025,2);a.fillRect(0,2,2048,l),a.fillRect(0,158-l,2048,l);const c=t>=45?12:t>=30?8:6,h=Math.max(o*1.5,5),u=160*.06,d=160*.7/c,f=(160-c*d)/2,g=Math.max(o*12,30);a.fillStyle="rgba(255,255,255,0.6)";for(let E=0;E<c;E++){const N=f+E*d;a.fillRect(g,N,h*8,u),a.fillRect(2048-g-h*8,N,h*8,u)}const _=i.split("/"),p=Math.floor(160*.55);a.font=`bold ${p}px Arial, sans-serif`,a.textAlign="center",a.textBaseline="middle",a.fillStyle="rgba(255,255,255,0.45)";const m=g+h*10;_[0]&&a.fillText(_[0],m,160/2),_[1]&&(a.save(),a.translate(2048-m,160/2),a.rotate(Math.PI),a.fillText(_[1],0,0),a.restore());const M=Math.max(30*o,12),y=Math.max(20*o,8);a.strokeStyle="rgba(255,255,255,0.35)",a.lineWidth=Math.max(160*.02,2),a.setLineDash([M,y]),a.beginPath(),a.moveTo(2048*.14,160/2),a.lineTo(2048*.86,160/2),a.stroke(),a.setLineDash([]);const S=300*o,w=150*o,T=Math.max(22*o,14),L=160*.1;a.fillStyle="rgba(255,255,255,0.3)";for(let E=0;E<3;E++){const N=S+E*w;if(N+T>2048*.4)break;a.fillRect(N,160*.2,T,L),a.fillRect(N,160*.7,T,L);const C=2048-N-T;a.fillRect(C,160*.2,T,L),a.fillRect(C,160*.7,T,L)}const x=Math.max(300*o,60);if(x<2048*.35){const E=Math.min(45*o,55),N=160*.3;a.fillStyle="rgba(255,255,255,0.35)",a.fillRect(x,(160-N)/2,E,N),a.fillRect(2048-x-E,(160-N)/2,E,N)}return r}function TE(i,e,t){const n=Ji(i.startLat,i.startLon,e,t),s=Ji(i.endLat,i.endLon,e,t),r=s.x-n.x,a=s.z-n.z,o=Math.sqrt(r*r+a*a);if(o<.1)return;const l=r/o,c=a/o;lf(n.x,n.z,-l,-c),lf(s.x,s.z,l,c)}function lf(i,e,t,n,s){const r=900/Dn,a=30/Dn,o=Math.floor(r/a),l=[],c=[],h=-n,u=t;for(let _=1;_<=o;_++){const p=_*a,m=i+t*p,M=e+n*p;l.push(m,.03,M);const y=p*Dn;if(y<300?c.push(1,.2,.2):c.push(1,1,.85),Math.abs(y-150)<20||Math.abs(y-300)<20){const S=27/Dn,w=4;for(let T=-w;T<=w;T++){if(T===0)continue;const L=m+h*T*(S/w),x=M+u*T*(S/w);l.push(L,.03,x),c.push(1,1,.85)}}}if(l.length===0)return;const d=new et;d.setAttribute("position",new ze(l,3)),d.setAttribute("color",new ze(c,3));const f=new es({size:.012,transparent:!0,opacity:.6,vertexColors:!0,sizeAttenuation:!0,depthWrite:!1,blending:Cn}),g=new sr(d,f);g.name="approachLights",oa.push(g),Ut.add(g)}function AE(i,e,t){const n=[],s=[];for(const l of i){const c=Ji(l.startLat,l.startLon,e,t),h=Ji(l.endLat,l.endLon,e,t),u=h.x-c.x,d=h.z-c.z,f=Math.sqrt(u*u+d*d);if(f<.1)continue;const g=u/f,p=-(d/f),m=g,M=Math.max(l.width/Dn*.5,.006),y=60/Dn,S=Math.floor(f/y);for(let w=0;w<=S;w++){const T=w/S,L=c.x+u*T,x=c.z+d*T;n.push(L+p*M,.035,x+m*M),n.push(L-p*M,.035,x-m*M);const E=T*f*Dn,N=(1-T)*f*Dn,C=Math.min(E,N);let O,F,V;C<300?(O=1,F=.15,V=.1):C<600?(O=1,F=.8,V=.2):(O=.9,F=.95,V=1),s.push(O,F,V,O,F,V)}}if(n.length===0)return;const r=new et;r.setAttribute("position",new ze(n,3)),r.setAttribute("color",new ze(s,3));const a=new es({size:.008,transparent:!0,opacity:.5,vertexColors:!0,sizeAttenuation:!0,depthWrite:!1,blending:Cn}),o=new sr(r,a);o.name="runwayEdgeLights",la=o,Ut.add(o)}function wE(i,e,t){if(!i||i.length===0)return;const n=[],s=[];for(const l of i){if(l.geometry.length<2)continue;const c=l.geometry.map(u=>Ji(u.lat,u.lon,e,t)),h=Math.max(l.width/Dn,.008);for(let u=0;u<c.length-1;u++){const d=c[u],f=c[u+1],g=f.x-d.x,_=f.z-d.z,p=Math.sqrt(g*g+_*_);if(p<.001)continue;const m=g/p,y=-(_/p)*h*.5,S=m*h*.5;n.push(d.x+y,.025,d.z+S,d.x-y,.025,d.z-S,f.x+y,.025,f.z+S,f.x+y,.025,f.z+S,d.x-y,.025,d.z-S,f.x-y,.025,f.z-S);for(let w=0;w<6;w++)s.push(.08,.12,.18)}}if(n.length===0)return;const r=new et;r.setAttribute("position",new ze(n,3)),r.setAttribute("color",new ze(s,3));const a=new yt({vertexColors:!0,transparent:!0,opacity:.55,side:At,depthWrite:!1}),o=new st(r,a);Ut.add(o),CE(i,e,t)}function CE(i,e,t){const n=[];for(const o of i){if(o.geometry.length<2)continue;const l=o.geometry.map(u=>Ji(u.lat,u.lon,e,t)),c=30/Dn;let h=0;for(let u=0;u<l.length-1;u++){const d=l[u],f=l[u+1],g=f.x-d.x,_=f.z-d.z,p=Math.sqrt(g*g+_*_);if(!(p<.001)){for(;h<p;){const m=h/p;n.push(d.x+g*m,.028,d.z+_*m),h+=c}h-=p}}}if(n.length===0)return;const s=new et;s.setAttribute("position",new ze(n,3));const r=new es({color:2280550,size:.006,transparent:!0,opacity:.35,sizeAttenuation:!0,depthWrite:!1,blending:Cn}),a=new sr(s,r);a.name="taxiwayLights",ca=a,Ut.add(a)}function RE(i,e,t){if(!i.geometry||i.geometry.length<3)return;const n=i.geometry.map(_=>Ji(_.lat,_.lon,e,t)),s=new Zh;s.moveTo(n[0].x,-n[0].z);for(let _=1;_<n.length;_++)s.lineTo(n[_].x,-n[_].z);s.closePath();const r=new eu(s),a=new yt({color:1714240,transparent:!0,opacity:.6,side:At,depthWrite:!1}),o=new st(r,a);o.rotation.x=-Math.PI/2,o.position.y=.02,Ut.add(o);const l=new Qh(s,{depth:.04,bevelEnabled:!1}),c=new yt({color:1978448,transparent:!0,opacity:.35,side:At,depthWrite:!1}),h=new st(l,c);h.rotation.x=-Math.PI/2,h.position.y=.02,Ut.add(h);const u=[];for(let _=0;_<n.length;_++){const p=n[_],m=n[(_+1)%n.length];u.push(p.x,.065,p.z,m.x,.065,m.z)}const d=new et;d.setAttribute("position",new ze(u,3));const f=new Qi({color:5605546,transparent:!0,opacity:.2,depthWrite:!1}),g=new qi(d,f);Ut.add(g)}function PE(i,e,t){const n=(i.lon-t)*Kt*hi,s=-(i.lat-e)*Kt,r=i.iata||i.icao;if(!r)return;const a=document.createElement("canvas");a.width=512,a.height=160;const o=a.getContext("2d");if(o.fillStyle="rgba(90,172,255,0.3)",o.fillRect(216,8,80,1),o.font="500 72px Inter, system-ui, sans-serif",o.textAlign="center",o.textBaseline="middle",o.fillStyle="rgba(255,255,255,0.75)",o.fillText(r,256,58),i.name&&i.name!==r){o.font="300 26px Inter, system-ui, sans-serif",o.fillStyle="rgba(255,255,255,0.2)";const M=i.name.length>24?i.name.substring(0,24)+"...":i.name;o.fillText(M,256,112)}const l=new ua(a);l.minFilter=_t,l.magFilter=_t,l.anisotropy=4;const c=new Gi({map:l,transparent:!0,depthWrite:!1,depthTest:!1,sizeAttenuation:!1}),h=new Ps(c);h.scale.set(.11,.035,1),h.position.set(n,.5,s-.15),h.renderOrder=100,h.center.set(.5,0),Ut.add(h);const u=.05,d=new et;d.setAttribute("position",new ze([0,0,-u,u,0,0,u,0,0,0,0,u,0,0,u,-u,0,0,-u,0,0,0,0,-u],3));const f=new Qi({color:16777215,transparent:!0,opacity:.2}),g=new qi(d,f);g.position.set(n,.04,s),g.name="aptBeacon",aa.push(g),Ut.add(g);const _=new fa(1.5,6,6),p=new yt({visible:!1}),m=new st(_,p);m.position.set(n,.3,s),m.userData.airport=i,Ut.add(m),ou.push(m)}function LE(i,e){ur(i);const t=(e.lon-Vp)*Kt*hi,n=-(e.lat-Gp)*Kt;Or=[];const s=new qs(1.2,1.4,64),r=new yt({color:5087231,transparent:!0,opacity:.5,side:At,depthWrite:!1}),a=new st(s,r);a.rotation.x=-Math.PI/2,a.position.set(t,.05,n),i.add(a),Or.push(a);const o=new qs(2,2.15,64),l=new yt({color:5087231,transparent:!0,opacity:.2,side:At,depthWrite:!1}),c=new st(o,l);c.rotation.x=-Math.PI/2,c.position.set(t,.046,n),c.name="_selPulse",i.add(c),Or.push(c),zs={objects:Or,cx:t,cz:n}}function ur(i){if(zs){for(const e of zs.objects)i.remove(e),e.geometry&&e.geometry.dispose(),e.material&&(e.material.map&&e.material.map.dispose(),e.material.dispose());zs=null,Or=[]}}function DE(i,e){if(To){const s=e%5/5,r=1+s*3;To.scale.set(r,r,1),To.material.opacity=.15*(1-s*s)}const t=.15+.1*Math.sin(e*1.5);for(let s=0;s<aa.length;s++)aa[s].material.opacity=t;const n=.4+.2*Math.sin(e*2);for(let s=0;s<oa.length;s++)oa[s].material.opacity=n;if(la&&(la.material.opacity=.35+.15*Math.sin(e*1.8+.5)),ca&&(ca.material.opacity=.25+.1*Math.sin(e*1.2+1)),zs){for(const s of zs.objects)if(s.name==="_selPulse"){const r=e%2/2;s.scale.set(1+r*.5,1,1+r*.5),s.material.opacity=.2*(1-r)}}}function IE(i){for(const e of Bo)i.remove(e),e.geometry&&e.geometry.dispose(),e.material&&(e.material.map&&e.material.map.dispose(),e.material.dispose());Bo.length=0,kt&&kt.map&&(kt.map.dispose(),kt.map=null,kt.needsUpdate=!0)}function NE(i){lh++,gE(),ur(i),Ut&&(i.remove(Ut),Ut=null),ou.length=0,en=null,aa.length=0,oa.length=0,la=null,ca=null}function Xp(){return ou}function lu(){return en}const cf=new cn,to=new P;class Kp extends C_{constructor(){super(),this.isLineSegmentsGeometry=!0,this.type="LineSegmentsGeometry";const e=[-1,2,0,1,2,0,-1,1,0,1,1,0,-1,0,0,1,0,0,-1,-1,0,1,-1,0],t=[-1,2,1,2,-1,1,1,1,-1,-1,1,-1,-1,-2,1,-2],n=[0,2,1,2,3,1,2,4,3,4,5,3,4,6,5,6,7,5];this.setIndex(n),this.setAttribute("position",new ze(e,3)),this.setAttribute("uv",new ze(t,2))}applyMatrix4(e){const t=this.attributes.instanceStart,n=this.attributes.instanceEnd;return t!==void 0&&(t.applyMatrix4(e),n.applyMatrix4(e),t.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}setPositions(e){let t;e instanceof Float32Array?t=e:Array.isArray(e)&&(t=new Float32Array(e));const n=new ih(t,6,1);return this.setAttribute("instanceStart",new Ln(n,3,0)),this.setAttribute("instanceEnd",new Ln(n,3,3)),this.instanceCount=this.attributes.instanceStart.count,this.computeBoundingBox(),this.computeBoundingSphere(),this}setColors(e){let t;e instanceof Float32Array?t=e:Array.isArray(e)&&(t=new Float32Array(e));const n=new ih(t,6,1);return this.setAttribute("instanceColorStart",new Ln(n,3,0)),this.setAttribute("instanceColorEnd",new Ln(n,3,3)),this}fromWireframeGeometry(e){return this.setPositions(e.attributes.position.array),this}fromEdgesGeometry(e){return this.setPositions(e.attributes.position.array),this}fromMesh(e){return this.fromWireframeGeometry(new t_(e.geometry)),this}fromLineSegments(e){const t=e.geometry;return this.setPositions(t.attributes.position.array),this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new cn);const e=this.attributes.instanceStart,t=this.attributes.instanceEnd;e!==void 0&&t!==void 0&&(this.boundingBox.setFromBufferAttribute(e),cf.setFromBufferAttribute(t),this.boundingBox.union(cf))}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new Mn),this.boundingBox===null&&this.computeBoundingBox();const e=this.attributes.instanceStart,t=this.attributes.instanceEnd;if(e!==void 0&&t!==void 0){const n=this.boundingSphere.center;this.boundingBox.getCenter(n);let s=0;for(let r=0,a=e.count;r<a;r++)to.fromBufferAttribute(e,r),s=Math.max(s,n.distanceToSquared(to)),to.fromBufferAttribute(t,r),s=Math.max(s,n.distanceToSquared(to));this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&console.error("THREE.LineSegmentsGeometry.computeBoundingSphere(): Computed radius is NaN. The instanced position data is likely to have NaN values.",this)}}toJSON(){}}ue.line={worldUnits:{value:1},linewidth:{value:1},resolution:{value:new j(1,1)},dashOffset:{value:0},dashScale:{value:1},dashSize:{value:1},gapSize:{value:1}};tn.line={uniforms:$i.merge([ue.common,ue.fog,ue.line]),vertexShader:`
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
		`};class cu extends Gt{constructor(e){super({type:"LineMaterial",uniforms:$i.clone(tn.line.uniforms),vertexShader:tn.line.vertexShader,fragmentShader:tn.line.fragmentShader,clipping:!0}),this.isLineMaterial=!0,this.setValues(e)}get color(){return this.uniforms.diffuse.value}set color(e){this.uniforms.diffuse.value=e}get worldUnits(){return"WORLD_UNITS"in this.defines}set worldUnits(e){e===!0!==this.worldUnits&&(this.needsUpdate=!0),e===!0?this.defines.WORLD_UNITS="":delete this.defines.WORLD_UNITS}get linewidth(){return this.uniforms.linewidth.value}set linewidth(e){this.uniforms.linewidth&&(this.uniforms.linewidth.value=e)}get dashed(){return"USE_DASH"in this.defines}set dashed(e){e===!0!==this.dashed&&(this.needsUpdate=!0),e===!0?this.defines.USE_DASH="":delete this.defines.USE_DASH}get dashScale(){return this.uniforms.dashScale.value}set dashScale(e){this.uniforms.dashScale.value=e}get dashSize(){return this.uniforms.dashSize.value}set dashSize(e){this.uniforms.dashSize.value=e}get dashOffset(){return this.uniforms.dashOffset.value}set dashOffset(e){this.uniforms.dashOffset.value=e}get gapSize(){return this.uniforms.gapSize.value}set gapSize(e){this.uniforms.gapSize.value=e}get opacity(){return this.uniforms.opacity.value}set opacity(e){this.uniforms&&(this.uniforms.opacity.value=e)}get resolution(){return this.uniforms.resolution.value}set resolution(e){this.uniforms.resolution.value.copy(e)}get alphaToCoverage(){return"USE_ALPHA_TO_COVERAGE"in this.defines}set alphaToCoverage(e){this.defines&&(e===!0!==this.alphaToCoverage&&(this.needsUpdate=!0),e===!0?this.defines.USE_ALPHA_TO_COVERAGE="":delete this.defines.USE_ALPHA_TO_COVERAGE)}}const Yl=new it,hf=new P,uf=new P,Ft=new it,Bt=new it,zn=new it,ql=new P,jl=new We,zt=new Y_,df=new P,no=new cn,io=new Mn,kn=new it;let Vn,Ki;function ff(i,e,t){return kn.set(0,0,-e,1).applyMatrix4(i.projectionMatrix),kn.multiplyScalar(1/kn.w),kn.x=Ki/t.width,kn.y=Ki/t.height,kn.applyMatrix4(i.projectionMatrixInverse),kn.multiplyScalar(1/kn.w),Math.abs(Math.max(kn.x,kn.y))}function UE(i,e){const t=i.matrixWorld,n=i.geometry,s=n.attributes.instanceStart,r=n.attributes.instanceEnd,a=Math.min(n.instanceCount,s.count);for(let o=0,l=a;o<l;o++){zt.start.fromBufferAttribute(s,o),zt.end.fromBufferAttribute(r,o),zt.applyMatrix4(t);const c=new P,h=new P;Vn.distanceSqToSegment(zt.start,zt.end,h,c),h.distanceTo(c)<Ki*.5&&e.push({point:h,pointOnLine:c,distance:Vn.origin.distanceTo(h),object:i,face:null,faceIndex:o,uv:null,uv1:null})}}function OE(i,e,t){const n=e.projectionMatrix,r=i.material.resolution,a=i.matrixWorld,o=i.geometry,l=o.attributes.instanceStart,c=o.attributes.instanceEnd,h=Math.min(o.instanceCount,l.count),u=-e.near;Vn.at(1,zn),zn.w=1,zn.applyMatrix4(e.matrixWorldInverse),zn.applyMatrix4(n),zn.multiplyScalar(1/zn.w),zn.x*=r.x/2,zn.y*=r.y/2,zn.z=0,ql.copy(zn),jl.multiplyMatrices(e.matrixWorldInverse,a);for(let d=0,f=h;d<f;d++){if(Ft.fromBufferAttribute(l,d),Bt.fromBufferAttribute(c,d),Ft.w=1,Bt.w=1,Ft.applyMatrix4(jl),Bt.applyMatrix4(jl),Ft.z>u&&Bt.z>u)continue;if(Ft.z>u){const y=Ft.z-Bt.z,S=(Ft.z-u)/y;Ft.lerp(Bt,S)}else if(Bt.z>u){const y=Bt.z-Ft.z,S=(Bt.z-u)/y;Bt.lerp(Ft,S)}Ft.applyMatrix4(n),Bt.applyMatrix4(n),Ft.multiplyScalar(1/Ft.w),Bt.multiplyScalar(1/Bt.w),Ft.x*=r.x/2,Ft.y*=r.y/2,Bt.x*=r.x/2,Bt.y*=r.y/2,zt.start.copy(Ft),zt.start.z=0,zt.end.copy(Bt),zt.end.z=0;const _=zt.closestPointToPointParameter(ql,!0);zt.at(_,df);const p=kh.lerp(Ft.z,Bt.z,_),m=p>=-1&&p<=1,M=ql.distanceTo(df)<Ki*.5;if(m&&M){zt.start.fromBufferAttribute(l,d),zt.end.fromBufferAttribute(c,d),zt.start.applyMatrix4(a),zt.end.applyMatrix4(a);const y=new P,S=new P;Vn.distanceSqToSegment(zt.start,zt.end,S,y),t.push({point:S,pointOnLine:y,distance:Vn.origin.distanceTo(S),object:i,face:null,faceIndex:d,uv:null,uv1:null})}}}class FE extends st{constructor(e=new Kp,t=new cu({color:Math.random()*16777215})){super(e,t),this.isLineSegments2=!0,this.type="LineSegments2"}computeLineDistances(){const e=this.geometry,t=e.attributes.instanceStart,n=e.attributes.instanceEnd,s=new Float32Array(2*t.count);for(let a=0,o=0,l=t.count;a<l;a++,o+=2)hf.fromBufferAttribute(t,a),uf.fromBufferAttribute(n,a),s[o]=o===0?0:s[o-1],s[o+1]=s[o]+hf.distanceTo(uf);const r=new ih(s,2,1);return e.setAttribute("instanceDistanceStart",new Ln(r,1,0)),e.setAttribute("instanceDistanceEnd",new Ln(r,1,1)),this}raycast(e,t){const n=this.material.worldUnits,s=e.camera;s===null&&!n&&console.error('LineSegments2: "Raycaster.camera" needs to be set in order to raycast against LineSegments2 while worldUnits is set to false.');const r=e.params.Line2!==void 0&&e.params.Line2.threshold||0;Vn=e.ray;const a=this.matrixWorld,o=this.geometry,l=this.material;Ki=l.linewidth+r,o.boundingSphere===null&&o.computeBoundingSphere(),io.copy(o.boundingSphere).applyMatrix4(a);let c;if(n)c=Ki*.5;else{const u=Math.max(s.near,io.distanceToPoint(Vn.origin));c=ff(s,u,l.resolution)}if(io.radius+=c,Vn.intersectsSphere(io)===!1)return;o.boundingBox===null&&o.computeBoundingBox(),no.copy(o.boundingBox).applyMatrix4(a);let h;if(n)h=Ki*.5;else{const u=Math.max(s.near,no.distanceToPoint(Vn.origin));h=ff(s,u,l.resolution)}no.expandByScalar(h),Vn.intersectsBox(no)!==!1&&(n?UE(this,t):OE(this,s,t))}onBeforeRender(e){const t=this.material.uniforms;t&&t.resolution&&(e.getViewport(Yl),this.material.uniforms.resolution.value.set(Yl.z,Yl.w))}}class Yp extends Kp{constructor(){super(),this.isLineGeometry=!0,this.type="LineGeometry"}setPositions(e){const t=e.length-3,n=new Float32Array(2*t);for(let s=0;s<t;s+=3)n[2*s]=e[s],n[2*s+1]=e[s+1],n[2*s+2]=e[s+2],n[2*s+3]=e[s+3],n[2*s+4]=e[s+4],n[2*s+5]=e[s+5];return super.setPositions(n),this}setColors(e){const t=e.length-3,n=new Float32Array(2*t);for(let s=0;s<t;s+=3)n[2*s]=e[s],n[2*s+1]=e[s+1],n[2*s+2]=e[s+2],n[2*s+3]=e[s+3],n[2*s+4]=e[s+4],n[2*s+5]=e[s+5];return super.setColors(n),this}setFromPoints(e){const t=e.length-1,n=new Float32Array(6*t);for(let s=0;s<t;s++)n[6*s]=e[s].x,n[6*s+1]=e[s].y,n[6*s+2]=e[s].z||0,n[6*s+3]=e[s+1].x,n[6*s+4]=e[s+1].y,n[6*s+5]=e[s+1].z||0;return super.setPositions(n),this}fromLine(e){const t=e.geometry;return this.setPositions(t.attributes.position.array),this}}class BE extends FE{constructor(e=new Yp,t=new cu({color:Math.random()*16777215})){super(e,t),this.isLine2=!0,this.type="Line2"}}function pf(i,e){if(e===gg)return console.warn("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Geometry already defined as triangles."),i;if(e===jc||e===lp){let t=i.getIndex();if(t===null){const a=[],o=i.getAttribute("position");if(o!==void 0){for(let l=0;l<o.count;l++)a.push(l);i.setIndex(a),t=i.getIndex()}else return console.error("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Undefined position attribute. Processing not possible."),i}const n=t.count-2,s=[];if(e===jc)for(let a=1;a<=n;a++)s.push(t.getX(0)),s.push(t.getX(a)),s.push(t.getX(a+1));else for(let a=0;a<n;a++)a%2===0?(s.push(t.getX(a)),s.push(t.getX(a+1)),s.push(t.getX(a+2))):(s.push(t.getX(a+2)),s.push(t.getX(a+1)),s.push(t.getX(a)));s.length/3!==n&&console.error("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Unable to generate correct amount of triangles.");const r=i.clone();return r.setIndex(s),r.clearGroups(),r}else return console.error("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Unknown draw mode:",e),i}function zE(i){const e=new Map,t=new Map,n=i.clone();return qp(i,n,function(s,r){e.set(r,s),t.set(s,r)}),n.traverse(function(s){if(!s.isSkinnedMesh)return;const r=s,a=e.get(s),o=a.skeleton.bones;r.skeleton=a.skeleton.clone(),r.bindMatrix.copy(a.bindMatrix),r.skeleton.bones=o.map(function(l){return t.get(l)}),r.bind(r.skeleton,r.bindMatrix)}),n}function qp(i,e,t){t(i,e);for(let n=0;n<i.children.length;n++)qp(i.children[n],e.children[n],t)}class kE extends lr{constructor(e){super(e),this.dracoLoader=null,this.ktx2Loader=null,this.meshoptDecoder=null,this.pluginCallbacks=[],this.register(function(t){return new XE(t)}),this.register(function(t){return new KE(t)}),this.register(function(t){return new tb(t)}),this.register(function(t){return new nb(t)}),this.register(function(t){return new ib(t)}),this.register(function(t){return new qE(t)}),this.register(function(t){return new jE(t)}),this.register(function(t){return new $E(t)}),this.register(function(t){return new JE(t)}),this.register(function(t){return new WE(t)}),this.register(function(t){return new ZE(t)}),this.register(function(t){return new YE(t)}),this.register(function(t){return new eb(t)}),this.register(function(t){return new QE(t)}),this.register(function(t){return new GE(t)}),this.register(function(t){return new mf(t,Ze.EXT_MESHOPT_COMPRESSION)}),this.register(function(t){return new mf(t,Ze.KHR_MESHOPT_COMPRESSION)}),this.register(function(t){return new sb(t)})}load(e,t,n,s){const r=this;let a;if(this.resourcePath!=="")a=this.resourcePath;else if(this.path!==""){const c=Vr.extractUrlBase(e);a=Vr.resolveURL(c,this.path)}else a=Vr.extractUrlBase(e);this.manager.itemStart(e);const o=function(c){s?s(c):console.error(c),r.manager.itemError(e),r.manager.itemEnd(e)},l=new Pp(this.manager);l.setPath(this.path),l.setResponseType("arraybuffer"),l.setRequestHeader(this.requestHeader),l.setWithCredentials(this.withCredentials),l.load(e,function(c){try{r.parse(c,a,function(h){t(h),r.manager.itemEnd(e)},o)}catch(h){o(h)}},n,o)}setDRACOLoader(e){return this.dracoLoader=e,this}setKTX2Loader(e){return this.ktx2Loader=e,this}setMeshoptDecoder(e){return this.meshoptDecoder=e,this}register(e){return this.pluginCallbacks.indexOf(e)===-1&&this.pluginCallbacks.push(e),this}unregister(e){return this.pluginCallbacks.indexOf(e)!==-1&&this.pluginCallbacks.splice(this.pluginCallbacks.indexOf(e),1),this}parse(e,t,n,s){let r;const a={},o={},l=new TextDecoder;if(typeof e=="string")r=JSON.parse(e);else if(e instanceof ArrayBuffer)if(l.decode(new Uint8Array(e,0,4))===jp){try{a[Ze.KHR_BINARY_GLTF]=new rb(e)}catch(u){s&&s(u);return}r=JSON.parse(a[Ze.KHR_BINARY_GLTF].content)}else r=JSON.parse(l.decode(e));else r=e;if(r.asset===void 0||r.asset.version[0]<2){s&&s(new Error("THREE.GLTFLoader: Unsupported asset. glTF versions >=2.0 are supported."));return}const c=new xb(r,{path:t||this.resourcePath||"",crossOrigin:this.crossOrigin,requestHeader:this.requestHeader,manager:this.manager,ktx2Loader:this.ktx2Loader,meshoptDecoder:this.meshoptDecoder});c.fileLoader.setRequestHeader(this.requestHeader);for(let h=0;h<this.pluginCallbacks.length;h++){const u=this.pluginCallbacks[h](c);u.name||console.error("THREE.GLTFLoader: Invalid plugin found: missing name"),o[u.name]=u,a[u.name]=!0}if(r.extensionsUsed)for(let h=0;h<r.extensionsUsed.length;++h){const u=r.extensionsUsed[h],d=r.extensionsRequired||[];switch(u){case Ze.KHR_MATERIALS_UNLIT:a[u]=new VE;break;case Ze.KHR_DRACO_MESH_COMPRESSION:a[u]=new ab(r,this.dracoLoader);break;case Ze.KHR_TEXTURE_TRANSFORM:a[u]=new ob;break;case Ze.KHR_MESH_QUANTIZATION:a[u]=new lb;break;default:d.indexOf(u)>=0&&o[u]===void 0&&console.warn('THREE.GLTFLoader: Unknown extension "'+u+'".')}}c.setExtensions(a),c.setPlugins(o),c.parse(n,s)}parseAsync(e,t){const n=this;return new Promise(function(s,r){n.parse(e,t,s,r)})}}function HE(){let i={};return{get:function(e){return i[e]},add:function(e,t){i[e]=t},remove:function(e){delete i[e]},removeAll:function(){i={}}}}function Et(i,e,t){const n=i.json.materials[e];return n.extensions&&n.extensions[t]?n.extensions[t]:null}const Ze={KHR_BINARY_GLTF:"KHR_binary_glTF",KHR_DRACO_MESH_COMPRESSION:"KHR_draco_mesh_compression",KHR_LIGHTS_PUNCTUAL:"KHR_lights_punctual",KHR_MATERIALS_CLEARCOAT:"KHR_materials_clearcoat",KHR_MATERIALS_DISPERSION:"KHR_materials_dispersion",KHR_MATERIALS_IOR:"KHR_materials_ior",KHR_MATERIALS_SHEEN:"KHR_materials_sheen",KHR_MATERIALS_SPECULAR:"KHR_materials_specular",KHR_MATERIALS_TRANSMISSION:"KHR_materials_transmission",KHR_MATERIALS_IRIDESCENCE:"KHR_materials_iridescence",KHR_MATERIALS_ANISOTROPY:"KHR_materials_anisotropy",KHR_MATERIALS_UNLIT:"KHR_materials_unlit",KHR_MATERIALS_VOLUME:"KHR_materials_volume",KHR_TEXTURE_BASISU:"KHR_texture_basisu",KHR_TEXTURE_TRANSFORM:"KHR_texture_transform",KHR_MESH_QUANTIZATION:"KHR_mesh_quantization",KHR_MATERIALS_EMISSIVE_STRENGTH:"KHR_materials_emissive_strength",EXT_MATERIALS_BUMP:"EXT_materials_bump",EXT_TEXTURE_WEBP:"EXT_texture_webp",EXT_TEXTURE_AVIF:"EXT_texture_avif",EXT_MESHOPT_COMPRESSION:"EXT_meshopt_compression",KHR_MESHOPT_COMPRESSION:"KHR_meshopt_compression",EXT_MESH_GPU_INSTANCING:"EXT_mesh_gpu_instancing"};class GE{constructor(e){this.parser=e,this.name=Ze.KHR_LIGHTS_PUNCTUAL,this.cache={refs:{},uses:{}}}_markDefs(){const e=this.parser,t=this.parser.json.nodes||[];for(let n=0,s=t.length;n<s;n++){const r=t[n];r.extensions&&r.extensions[this.name]&&r.extensions[this.name].light!==void 0&&e._addNodeRef(this.cache,r.extensions[this.name].light)}}_loadLight(e){const t=this.parser,n="light:"+e;let s=t.cache.get(n);if(s)return s;const r=t.json,l=((r.extensions&&r.extensions[this.name]||{}).lights||[])[e];let c;const h=new Me(16777215);l.color!==void 0&&h.setRGB(l.color[0],l.color[1],l.color[2],Zt);const u=l.range!==void 0?l.range:0;switch(l.type){case"directional":c=new Dp(h),c.target.position.set(0,0,-1),c.add(c.target);break;case"point":c=new T_(h),c.distance=u;break;case"spot":c=new E_(h),c.distance=u,l.spot=l.spot||{},l.spot.innerConeAngle=l.spot.innerConeAngle!==void 0?l.spot.innerConeAngle:0,l.spot.outerConeAngle=l.spot.outerConeAngle!==void 0?l.spot.outerConeAngle:Math.PI/4,c.angle=l.spot.outerConeAngle,c.penumbra=1-l.spot.innerConeAngle/l.spot.outerConeAngle,c.target.position.set(0,0,-1),c.add(c.target);break;default:throw new Error("THREE.GLTFLoader: Unexpected light type: "+l.type)}return c.position.set(0,0,0),Gn(c,l),l.intensity!==void 0&&(c.intensity=l.intensity),c.name=t.createUniqueName(l.name||"light_"+e),s=Promise.resolve(c),t.cache.add(n,s),s}getDependency(e,t){if(e==="light")return this._loadLight(t)}createNodeAttachment(e){const t=this,n=this.parser,r=n.json.nodes[e],o=(r.extensions&&r.extensions[this.name]||{}).light;return o===void 0?null:this._loadLight(o).then(function(l){return n._getNodeRef(t.cache,o,l)})}}class VE{constructor(){this.name=Ze.KHR_MATERIALS_UNLIT}getMaterialType(){return yt}extendParams(e,t,n){const s=[];e.color=new Me(1,1,1),e.opacity=1;const r=t.pbrMetallicRoughness;if(r){if(Array.isArray(r.baseColorFactor)){const a=r.baseColorFactor;e.color.setRGB(a[0],a[1],a[2],Zt),e.opacity=a[3]}r.baseColorTexture!==void 0&&s.push(n.assignTexture(e,"map",r.baseColorTexture,Nt))}return Promise.all(s)}}class WE{constructor(e){this.parser=e,this.name=Ze.KHR_MATERIALS_EMISSIVE_STRENGTH}extendMaterialParams(e,t){const n=Et(this.parser,e,this.name);return n===null||n.emissiveStrength!==void 0&&(t.emissiveIntensity=n.emissiveStrength),Promise.resolve()}}class XE{constructor(e){this.parser=e,this.name=Ze.KHR_MATERIALS_CLEARCOAT}getMaterialType(e){return Et(this.parser,e,this.name)!==null?Jn:null}extendMaterialParams(e,t){const n=Et(this.parser,e,this.name);if(n===null)return Promise.resolve();const s=[];if(n.clearcoatFactor!==void 0&&(t.clearcoat=n.clearcoatFactor),n.clearcoatTexture!==void 0&&s.push(this.parser.assignTexture(t,"clearcoatMap",n.clearcoatTexture)),n.clearcoatRoughnessFactor!==void 0&&(t.clearcoatRoughness=n.clearcoatRoughnessFactor),n.clearcoatRoughnessTexture!==void 0&&s.push(this.parser.assignTexture(t,"clearcoatRoughnessMap",n.clearcoatRoughnessTexture)),n.clearcoatNormalTexture!==void 0&&(s.push(this.parser.assignTexture(t,"clearcoatNormalMap",n.clearcoatNormalTexture)),n.clearcoatNormalTexture.scale!==void 0)){const r=n.clearcoatNormalTexture.scale;t.clearcoatNormalScale=new j(r,r)}return Promise.all(s)}}class KE{constructor(e){this.parser=e,this.name=Ze.KHR_MATERIALS_DISPERSION}getMaterialType(e){return Et(this.parser,e,this.name)!==null?Jn:null}extendMaterialParams(e,t){const n=Et(this.parser,e,this.name);return n===null||(t.dispersion=n.dispersion!==void 0?n.dispersion:0),Promise.resolve()}}class YE{constructor(e){this.parser=e,this.name=Ze.KHR_MATERIALS_IRIDESCENCE}getMaterialType(e){return Et(this.parser,e,this.name)!==null?Jn:null}extendMaterialParams(e,t){const n=Et(this.parser,e,this.name);if(n===null)return Promise.resolve();const s=[];return n.iridescenceFactor!==void 0&&(t.iridescence=n.iridescenceFactor),n.iridescenceTexture!==void 0&&s.push(this.parser.assignTexture(t,"iridescenceMap",n.iridescenceTexture)),n.iridescenceIor!==void 0&&(t.iridescenceIOR=n.iridescenceIor),t.iridescenceThicknessRange===void 0&&(t.iridescenceThicknessRange=[100,400]),n.iridescenceThicknessMinimum!==void 0&&(t.iridescenceThicknessRange[0]=n.iridescenceThicknessMinimum),n.iridescenceThicknessMaximum!==void 0&&(t.iridescenceThicknessRange[1]=n.iridescenceThicknessMaximum),n.iridescenceThicknessTexture!==void 0&&s.push(this.parser.assignTexture(t,"iridescenceThicknessMap",n.iridescenceThicknessTexture)),Promise.all(s)}}class qE{constructor(e){this.parser=e,this.name=Ze.KHR_MATERIALS_SHEEN}getMaterialType(e){return Et(this.parser,e,this.name)!==null?Jn:null}extendMaterialParams(e,t){const n=Et(this.parser,e,this.name);if(n===null)return Promise.resolve();const s=[];if(t.sheenColor=new Me(0,0,0),t.sheenRoughness=0,t.sheen=1,n.sheenColorFactor!==void 0){const r=n.sheenColorFactor;t.sheenColor.setRGB(r[0],r[1],r[2],Zt)}return n.sheenRoughnessFactor!==void 0&&(t.sheenRoughness=n.sheenRoughnessFactor),n.sheenColorTexture!==void 0&&s.push(this.parser.assignTexture(t,"sheenColorMap",n.sheenColorTexture,Nt)),n.sheenRoughnessTexture!==void 0&&s.push(this.parser.assignTexture(t,"sheenRoughnessMap",n.sheenRoughnessTexture)),Promise.all(s)}}class jE{constructor(e){this.parser=e,this.name=Ze.KHR_MATERIALS_TRANSMISSION}getMaterialType(e){return Et(this.parser,e,this.name)!==null?Jn:null}extendMaterialParams(e,t){const n=Et(this.parser,e,this.name);if(n===null)return Promise.resolve();const s=[];return n.transmissionFactor!==void 0&&(t.transmission=n.transmissionFactor),n.transmissionTexture!==void 0&&s.push(this.parser.assignTexture(t,"transmissionMap",n.transmissionTexture)),Promise.all(s)}}class $E{constructor(e){this.parser=e,this.name=Ze.KHR_MATERIALS_VOLUME}getMaterialType(e){return Et(this.parser,e,this.name)!==null?Jn:null}extendMaterialParams(e,t){const n=Et(this.parser,e,this.name);if(n===null)return Promise.resolve();const s=[];t.thickness=n.thicknessFactor!==void 0?n.thicknessFactor:0,n.thicknessTexture!==void 0&&s.push(this.parser.assignTexture(t,"thicknessMap",n.thicknessTexture)),t.attenuationDistance=n.attenuationDistance||1/0;const r=n.attenuationColor||[1,1,1];return t.attenuationColor=new Me().setRGB(r[0],r[1],r[2],Zt),Promise.all(s)}}class JE{constructor(e){this.parser=e,this.name=Ze.KHR_MATERIALS_IOR}getMaterialType(e){return Et(this.parser,e,this.name)!==null?Jn:null}extendMaterialParams(e,t){const n=Et(this.parser,e,this.name);return n===null||(t.ior=n.ior!==void 0?n.ior:1.5),Promise.resolve()}}class ZE{constructor(e){this.parser=e,this.name=Ze.KHR_MATERIALS_SPECULAR}getMaterialType(e){return Et(this.parser,e,this.name)!==null?Jn:null}extendMaterialParams(e,t){const n=Et(this.parser,e,this.name);if(n===null)return Promise.resolve();const s=[];t.specularIntensity=n.specularFactor!==void 0?n.specularFactor:1,n.specularTexture!==void 0&&s.push(this.parser.assignTexture(t,"specularIntensityMap",n.specularTexture));const r=n.specularColorFactor||[1,1,1];return t.specularColor=new Me().setRGB(r[0],r[1],r[2],Zt),n.specularColorTexture!==void 0&&s.push(this.parser.assignTexture(t,"specularColorMap",n.specularColorTexture,Nt)),Promise.all(s)}}class QE{constructor(e){this.parser=e,this.name=Ze.EXT_MATERIALS_BUMP}getMaterialType(e){return Et(this.parser,e,this.name)!==null?Jn:null}extendMaterialParams(e,t){const n=Et(this.parser,e,this.name);if(n===null)return Promise.resolve();const s=[];return t.bumpScale=n.bumpFactor!==void 0?n.bumpFactor:1,n.bumpTexture!==void 0&&s.push(this.parser.assignTexture(t,"bumpMap",n.bumpTexture)),Promise.all(s)}}class eb{constructor(e){this.parser=e,this.name=Ze.KHR_MATERIALS_ANISOTROPY}getMaterialType(e){return Et(this.parser,e,this.name)!==null?Jn:null}extendMaterialParams(e,t){const n=Et(this.parser,e,this.name);if(n===null)return Promise.resolve();const s=[];return n.anisotropyStrength!==void 0&&(t.anisotropy=n.anisotropyStrength),n.anisotropyRotation!==void 0&&(t.anisotropyRotation=n.anisotropyRotation),n.anisotropyTexture!==void 0&&s.push(this.parser.assignTexture(t,"anisotropyMap",n.anisotropyTexture)),Promise.all(s)}}class tb{constructor(e){this.parser=e,this.name=Ze.KHR_TEXTURE_BASISU}loadTexture(e){const t=this.parser,n=t.json,s=n.textures[e];if(!s.extensions||!s.extensions[this.name])return null;const r=s.extensions[this.name],a=t.options.ktx2Loader;if(!a){if(n.extensionsRequired&&n.extensionsRequired.indexOf(this.name)>=0)throw new Error("THREE.GLTFLoader: setKTX2Loader must be called before loading KTX2 textures");return null}return t.loadTextureImage(e,r.source,a)}}class nb{constructor(e){this.parser=e,this.name=Ze.EXT_TEXTURE_WEBP}loadTexture(e){const t=this.name,n=this.parser,s=n.json,r=s.textures[e];if(!r.extensions||!r.extensions[t])return null;const a=r.extensions[t],o=s.images[a.source];let l=n.textureLoader;if(o.uri){const c=n.options.manager.getHandler(o.uri);c!==null&&(l=c)}return n.loadTextureImage(e,a.source,l)}}class ib{constructor(e){this.parser=e,this.name=Ze.EXT_TEXTURE_AVIF}loadTexture(e){const t=this.name,n=this.parser,s=n.json,r=s.textures[e];if(!r.extensions||!r.extensions[t])return null;const a=r.extensions[t],o=s.images[a.source];let l=n.textureLoader;if(o.uri){const c=n.options.manager.getHandler(o.uri);c!==null&&(l=c)}return n.loadTextureImage(e,a.source,l)}}class mf{constructor(e,t){this.name=t,this.parser=e}loadBufferView(e){const t=this.parser.json,n=t.bufferViews[e];if(n.extensions&&n.extensions[this.name]){const s=n.extensions[this.name],r=this.parser.getDependency("buffer",s.buffer),a=this.parser.options.meshoptDecoder;if(!a||!a.supported){if(t.extensionsRequired&&t.extensionsRequired.indexOf(this.name)>=0)throw new Error("THREE.GLTFLoader: setMeshoptDecoder must be called before loading compressed files");return null}return r.then(function(o){const l=s.byteOffset||0,c=s.byteLength||0,h=s.count,u=s.byteStride,d=new Uint8Array(o,l,c);return a.decodeGltfBufferAsync?a.decodeGltfBufferAsync(h,u,d,s.mode,s.filter).then(function(f){return f.buffer}):a.ready.then(function(){const f=new ArrayBuffer(h*u);return a.decodeGltfBuffer(new Uint8Array(f),h,u,d,s.mode,s.filter),f})})}else return null}}class sb{constructor(e){this.name=Ze.EXT_MESH_GPU_INSTANCING,this.parser=e}createNodeMesh(e){const t=this.parser.json,n=t.nodes[e];if(!n.extensions||!n.extensions[this.name]||n.mesh===void 0)return null;const s=t.meshes[n.mesh];for(const c of s.primitives)if(c.mode!==dn.TRIANGLES&&c.mode!==dn.TRIANGLE_STRIP&&c.mode!==dn.TRIANGLE_FAN&&c.mode!==void 0)return null;const a=n.extensions[this.name].attributes,o=[],l={};for(const c in a)o.push(this.parser.getDependency("accessor",a[c]).then(h=>(l[c]=h,l[c])));return o.length<1?null:(o.push(this.parser.createNodeMesh(e)),Promise.all(o).then(c=>{const h=c.pop(),u=h.isGroup?h.children:[h],d=c[0].count,f=[];for(const g of u){const _=new We,p=new P,m=new In,M=new P(1,1,1),y=new m0(g.geometry,g.material,d);for(let S=0;S<d;S++)l.TRANSLATION&&p.fromBufferAttribute(l.TRANSLATION,S),l.ROTATION&&m.fromBufferAttribute(l.ROTATION,S),l.SCALE&&M.fromBufferAttribute(l.SCALE,S),y.setMatrixAt(S,_.compose(p,m,M));for(const S in l)if(S==="_COLOR_0"){const w=l[S];y.instanceColor=new Jc(w.array,w.itemSize,w.normalized)}else S!=="TRANSLATION"&&S!=="ROTATION"&&S!=="SCALE"&&g.geometry.setAttribute(S,l[S]);xt.prototype.copy.call(y,g),this.parser.assignFinalMaterial(y),f.push(y)}return h.isGroup?(h.clear(),h.add(...f),h):f[0]}))}}const jp="glTF",Ar=12,gf={JSON:1313821514,BIN:5130562};class rb{constructor(e){this.name=Ze.KHR_BINARY_GLTF,this.content=null,this.body=null;const t=new DataView(e,0,Ar),n=new TextDecoder;if(this.header={magic:n.decode(new Uint8Array(e.slice(0,4))),version:t.getUint32(4,!0),length:t.getUint32(8,!0)},this.header.magic!==jp)throw new Error("THREE.GLTFLoader: Unsupported glTF-Binary header.");if(this.header.version<2)throw new Error("THREE.GLTFLoader: Legacy binary file detected.");const s=this.header.length-Ar,r=new DataView(e,Ar);let a=0;for(;a<s;){const o=r.getUint32(a,!0);a+=4;const l=r.getUint32(a,!0);if(a+=4,l===gf.JSON){const c=new Uint8Array(e,Ar+a,o);this.content=n.decode(c)}else if(l===gf.BIN){const c=Ar+a;this.body=e.slice(c,c+o)}a+=o}if(this.content===null)throw new Error("THREE.GLTFLoader: JSON content not found.")}}class ab{constructor(e,t){if(!t)throw new Error("THREE.GLTFLoader: No DRACOLoader instance provided.");this.name=Ze.KHR_DRACO_MESH_COMPRESSION,this.json=e,this.dracoLoader=t,this.dracoLoader.preload()}decodePrimitive(e,t){const n=this.json,s=this.dracoLoader,r=e.extensions[this.name].bufferView,a=e.extensions[this.name].attributes,o={},l={},c={};for(const h in a){const u=ch[h]||h.toLowerCase();o[u]=a[h]}for(const h in e.attributes){const u=ch[h]||h.toLowerCase();if(a[h]!==void 0){const d=n.accessors[e.attributes[h]],f=ks[d.componentType];c[u]=f.name,l[u]=d.normalized===!0}}return t.getDependency("bufferView",r).then(function(h){return new Promise(function(u,d){s.decodeDracoFile(h,function(f){for(const g in f.attributes){const _=f.attributes[g],p=l[g];p!==void 0&&(_.normalized=p)}u(f)},o,c,Zt,d)})})}}class ob{constructor(){this.name=Ze.KHR_TEXTURE_TRANSFORM}extendTexture(e,t){return(t.texCoord===void 0||t.texCoord===e.channel)&&t.offset===void 0&&t.rotation===void 0&&t.scale===void 0||(e=e.clone(),t.texCoord!==void 0&&(e.channel=t.texCoord),t.offset!==void 0&&e.offset.fromArray(t.offset),t.rotation!==void 0&&(e.rotation=t.rotation),t.scale!==void 0&&e.repeat.fromArray(t.scale),e.needsUpdate=!0),e}}class lb{constructor(){this.name=Ze.KHR_MESH_QUANTIZATION}}class $p extends rr{constructor(e,t,n,s){super(e,t,n,s)}copySampleValue_(e){const t=this.resultBuffer,n=this.sampleValues,s=this.valueSize,r=e*s*3+s;for(let a=0;a!==s;a++)t[a]=n[r+a];return t}interpolate_(e,t,n,s){const r=this.resultBuffer,a=this.sampleValues,o=this.valueSize,l=o*2,c=o*3,h=s-t,u=(n-t)/h,d=u*u,f=d*u,g=e*c,_=g-c,p=-2*f+3*d,m=f-d,M=1-p,y=m-d+u;for(let S=0;S!==o;S++){const w=a[_+S+o],T=a[_+S+l]*h,L=a[g+S+o],x=a[g+S]*h;r[S]=M*w+y*T+p*L+m*x}return r}}const cb=new In;class hb extends $p{interpolate_(e,t,n,s){const r=super.interpolate_(e,t,n,s);return cb.fromArray(r).normalize().toArray(r),r}}const dn={POINTS:0,LINES:1,LINE_LOOP:2,LINE_STRIP:3,TRIANGLES:4,TRIANGLE_STRIP:5,TRIANGLE_FAN:6},ks={5120:Int8Array,5121:Uint8Array,5122:Int16Array,5123:Uint16Array,5125:Uint32Array,5126:Float32Array},_f={9728:wt,9729:_t,9984:tp,9985:go,9986:Lr,9987:Rn},xf={33071:mn,33648:Do,10497:Ws},$l={SCALAR:1,VEC2:2,VEC3:3,VEC4:4,MAT2:4,MAT3:9,MAT4:16},ch={POSITION:"position",NORMAL:"normal",TANGENT:"tangent",TEXCOORD_0:"uv",TEXCOORD_1:"uv1",TEXCOORD_2:"uv2",TEXCOORD_3:"uv3",COLOR_0:"color",WEIGHTS_0:"skinWeight",JOINTS_0:"skinIndex"},Si={scale:"scale",translation:"position",rotation:"quaternion",weights:"morphTargetInfluences"},ub={CUBICSPLINE:void 0,LINEAR:Qr,STEP:Zr},Jl={OPAQUE:"OPAQUE",MASK:"MASK",BLEND:"BLEND"};function db(i){return i.DefaultMaterial===void 0&&(i.DefaultMaterial=new tu({color:16777215,emissive:0,metalness:1,roughness:1,transparent:!1,depthTest:!0,side:di})),i.DefaultMaterial}function zi(i,e,t){for(const n in t.extensions)i[n]===void 0&&(e.userData.gltfExtensions=e.userData.gltfExtensions||{},e.userData.gltfExtensions[n]=t.extensions[n])}function Gn(i,e){e.extras!==void 0&&(typeof e.extras=="object"?Object.assign(i.userData,e.extras):console.warn("THREE.GLTFLoader: Ignoring primitive type .extras, "+e.extras))}function fb(i,e,t){let n=!1,s=!1,r=!1;for(let c=0,h=e.length;c<h;c++){const u=e[c];if(u.POSITION!==void 0&&(n=!0),u.NORMAL!==void 0&&(s=!0),u.COLOR_0!==void 0&&(r=!0),n&&s&&r)break}if(!n&&!s&&!r)return Promise.resolve(i);const a=[],o=[],l=[];for(let c=0,h=e.length;c<h;c++){const u=e[c];if(n){const d=u.POSITION!==void 0?t.getDependency("accessor",u.POSITION):i.attributes.position;a.push(d)}if(s){const d=u.NORMAL!==void 0?t.getDependency("accessor",u.NORMAL):i.attributes.normal;o.push(d)}if(r){const d=u.COLOR_0!==void 0?t.getDependency("accessor",u.COLOR_0):i.attributes.color;l.push(d)}}return Promise.all([Promise.all(a),Promise.all(o),Promise.all(l)]).then(function(c){const h=c[0],u=c[1],d=c[2];return n&&(i.morphAttributes.position=h),s&&(i.morphAttributes.normal=u),r&&(i.morphAttributes.color=d),i.morphTargetsRelative=!0,i})}function pb(i,e){if(i.updateMorphTargets(),e.weights!==void 0)for(let t=0,n=e.weights.length;t<n;t++)i.morphTargetInfluences[t]=e.weights[t];if(e.extras&&Array.isArray(e.extras.targetNames)){const t=e.extras.targetNames;if(i.morphTargetInfluences.length===t.length){i.morphTargetDictionary={};for(let n=0,s=t.length;n<s;n++)i.morphTargetDictionary[t[n]]=n}else console.warn("THREE.GLTFLoader: Invalid extras.targetNames length. Ignoring names.")}}function mb(i){let e;const t=i.extensions&&i.extensions[Ze.KHR_DRACO_MESH_COMPRESSION];if(t?e="draco:"+t.bufferView+":"+t.indices+":"+Zl(t.attributes):e=i.indices+":"+Zl(i.attributes)+":"+i.mode,i.targets!==void 0)for(let n=0,s=i.targets.length;n<s;n++)e+=":"+Zl(i.targets[n]);return e}function Zl(i){let e="";const t=Object.keys(i).sort();for(let n=0,s=t.length;n<s;n++)e+=t[n]+":"+i[t[n]]+";";return e}function hh(i){switch(i){case Int8Array:return 1/127;case Uint8Array:return 1/255;case Int16Array:return 1/32767;case Uint16Array:return 1/65535;default:throw new Error("THREE.GLTFLoader: Unsupported normalized accessor component type.")}}function gb(i){return i.search(/\.jpe?g($|\?)/i)>0||i.search(/^data\:image\/jpeg/)===0?"image/jpeg":i.search(/\.webp($|\?)/i)>0||i.search(/^data\:image\/webp/)===0?"image/webp":i.search(/\.ktx2($|\?)/i)>0||i.search(/^data\:image\/ktx2/)===0?"image/ktx2":"image/png"}const _b=new We;class xb{constructor(e={},t={}){this.json=e,this.extensions={},this.plugins={},this.options=t,this.cache=new HE,this.associations=new Map,this.primitiveCache={},this.nodeCache={},this.meshCache={refs:{},uses:{}},this.cameraCache={refs:{},uses:{}},this.lightCache={refs:{},uses:{}},this.sourceCache={},this.textureCache={},this.nodeNamesUsed={};let n=!1,s=-1,r=!1,a=-1;if(typeof navigator<"u"&&typeof navigator.userAgent<"u"){const o=navigator.userAgent;n=/^((?!chrome|android).)*safari/i.test(o)===!0;const l=o.match(/Version\/(\d+)/);s=n&&l?parseInt(l[1],10):-1,r=o.indexOf("Firefox")>-1,a=r?o.match(/Firefox\/([0-9]+)\./)[1]:-1}typeof createImageBitmap>"u"||n&&s<17||r&&a<98?this.textureLoader=new y_(this.options.manager):this.textureLoader=new R_(this.options.manager),this.textureLoader.setCrossOrigin(this.options.crossOrigin),this.textureLoader.setRequestHeader(this.options.requestHeader),this.fileLoader=new Pp(this.options.manager),this.fileLoader.setResponseType("arraybuffer"),this.options.crossOrigin==="use-credentials"&&this.fileLoader.setWithCredentials(!0)}setExtensions(e){this.extensions=e}setPlugins(e){this.plugins=e}parse(e,t){const n=this,s=this.json,r=this.extensions;this.cache.removeAll(),this.nodeCache={},this._invokeAll(function(a){return a._markDefs&&a._markDefs()}),Promise.all(this._invokeAll(function(a){return a.beforeRoot&&a.beforeRoot()})).then(function(){return Promise.all([n.getDependencies("scene"),n.getDependencies("animation"),n.getDependencies("camera")])}).then(function(a){const o={scene:a[0][s.scene||0],scenes:a[0],animations:a[1],cameras:a[2],asset:s.asset,parser:n,userData:{}};return zi(r,o,s),Gn(o,s),Promise.all(n._invokeAll(function(l){return l.afterRoot&&l.afterRoot(o)})).then(function(){for(const l of o.scenes)l.updateMatrixWorld();e(o)})}).catch(t)}_markDefs(){const e=this.json.nodes||[],t=this.json.skins||[],n=this.json.meshes||[];for(let s=0,r=t.length;s<r;s++){const a=t[s].joints;for(let o=0,l=a.length;o<l;o++)e[a[o]].isBone=!0}for(let s=0,r=e.length;s<r;s++){const a=e[s];a.mesh!==void 0&&(this._addNodeRef(this.meshCache,a.mesh),a.skin!==void 0&&(n[a.mesh].isSkinnedMesh=!0)),a.camera!==void 0&&this._addNodeRef(this.cameraCache,a.camera)}}_addNodeRef(e,t){t!==void 0&&(e.refs[t]===void 0&&(e.refs[t]=e.uses[t]=0),e.refs[t]++)}_getNodeRef(e,t,n){if(e.refs[t]<=1)return n;const s=n.clone(),r=(a,o)=>{const l=this.associations.get(a);l!=null&&this.associations.set(o,l);for(const[c,h]of a.children.entries())r(h,o.children[c])};return r(n,s),s.name+="_instance_"+e.uses[t]++,s}_invokeOne(e){const t=Object.values(this.plugins);t.push(this);for(let n=0;n<t.length;n++){const s=e(t[n]);if(s)return s}return null}_invokeAll(e){const t=Object.values(this.plugins);t.unshift(this);const n=[];for(let s=0;s<t.length;s++){const r=e(t[s]);r&&n.push(r)}return n}getDependency(e,t){const n=e+":"+t;let s=this.cache.get(n);if(!s){switch(e){case"scene":s=this.loadScene(t);break;case"node":s=this._invokeOne(function(r){return r.loadNode&&r.loadNode(t)});break;case"mesh":s=this._invokeOne(function(r){return r.loadMesh&&r.loadMesh(t)});break;case"accessor":s=this.loadAccessor(t);break;case"bufferView":s=this._invokeOne(function(r){return r.loadBufferView&&r.loadBufferView(t)});break;case"buffer":s=this.loadBuffer(t);break;case"material":s=this._invokeOne(function(r){return r.loadMaterial&&r.loadMaterial(t)});break;case"texture":s=this._invokeOne(function(r){return r.loadTexture&&r.loadTexture(t)});break;case"skin":s=this.loadSkin(t);break;case"animation":s=this._invokeOne(function(r){return r.loadAnimation&&r.loadAnimation(t)});break;case"camera":s=this.loadCamera(t);break;default:if(s=this._invokeOne(function(r){return r!=this&&r.getDependency&&r.getDependency(e,t)}),!s)throw new Error("Unknown type: "+e);break}this.cache.add(n,s)}return s}getDependencies(e){let t=this.cache.get(e);if(!t){const n=this,s=this.json[e+(e==="mesh"?"es":"s")]||[];t=Promise.all(s.map(function(r,a){return n.getDependency(e,a)})),this.cache.add(e,t)}return t}loadBuffer(e){const t=this.json.buffers[e],n=this.fileLoader;if(t.type&&t.type!=="arraybuffer")throw new Error("THREE.GLTFLoader: "+t.type+" buffer type is not supported.");if(t.uri===void 0&&e===0)return Promise.resolve(this.extensions[Ze.KHR_BINARY_GLTF].body);const s=this.options;return new Promise(function(r,a){n.load(Vr.resolveURL(t.uri,s.path),r,void 0,function(){a(new Error('THREE.GLTFLoader: Failed to load buffer "'+t.uri+'".'))})})}loadBufferView(e){const t=this.json.bufferViews[e];return this.getDependency("buffer",t.buffer).then(function(n){const s=t.byteLength||0,r=t.byteOffset||0;return n.slice(r,r+s)})}loadAccessor(e){const t=this,n=this.json,s=this.json.accessors[e];if(s.bufferView===void 0&&s.sparse===void 0){const a=$l[s.type],o=ks[s.componentType],l=s.normalized===!0,c=new o(s.count*a);return Promise.resolve(new Yt(c,a,l))}const r=[];return s.bufferView!==void 0?r.push(this.getDependency("bufferView",s.bufferView)):r.push(null),s.sparse!==void 0&&(r.push(this.getDependency("bufferView",s.sparse.indices.bufferView)),r.push(this.getDependency("bufferView",s.sparse.values.bufferView))),Promise.all(r).then(function(a){const o=a[0],l=$l[s.type],c=ks[s.componentType],h=c.BYTES_PER_ELEMENT,u=h*l,d=s.byteOffset||0,f=s.bufferView!==void 0?n.bufferViews[s.bufferView].byteStride:void 0,g=s.normalized===!0;let _,p;if(f&&f!==u){const m=Math.floor(d/f),M="InterleavedBuffer:"+s.bufferView+":"+s.componentType+":"+m+":"+s.count;let y=t.cache.get(M);y||(_=new c(o,m*f,s.count*f/h),y=new Vh(_,f/h),t.cache.add(M,y)),p=new Ln(y,l,d%f/h,g)}else o===null?_=new c(s.count*l):_=new c(o,d,s.count*l),p=new Yt(_,l,g);if(s.sparse!==void 0){const m=$l.SCALAR,M=ks[s.sparse.indices.componentType],y=s.sparse.indices.byteOffset||0,S=s.sparse.values.byteOffset||0,w=new M(a[1],y,s.sparse.count*m),T=new c(a[2],S,s.sparse.count*l);o!==null&&(p=new Yt(p.array.slice(),p.itemSize,p.normalized)),p.normalized=!1;for(let L=0,x=w.length;L<x;L++){const E=w[L];if(p.setX(E,T[L*l]),l>=2&&p.setY(E,T[L*l+1]),l>=3&&p.setZ(E,T[L*l+2]),l>=4&&p.setW(E,T[L*l+3]),l>=5)throw new Error("THREE.GLTFLoader: Unsupported itemSize in sparse BufferAttribute.")}p.normalized=g}return p})}loadTexture(e){const t=this.json,n=this.options,r=t.textures[e].source,a=t.images[r];let o=this.textureLoader;if(a.uri){const l=n.manager.getHandler(a.uri);l!==null&&(o=l)}return this.loadTextureImage(e,r,o)}loadTextureImage(e,t,n){const s=this,r=this.json,a=r.textures[e],o=r.images[t],l=(o.uri||o.bufferView)+":"+a.sampler;if(this.textureCache[l])return this.textureCache[l];const c=this.loadImageSource(t,n).then(function(h){h.flipY=!1,h.name=a.name||o.name||"",h.name===""&&typeof o.uri=="string"&&o.uri.startsWith("data:image/")===!1&&(h.name=o.uri);const d=(r.samplers||{})[a.sampler]||{};return h.magFilter=_f[d.magFilter]||_t,h.minFilter=_f[d.minFilter]||Rn,h.wrapS=xf[d.wrapS]||Ws,h.wrapT=xf[d.wrapT]||Ws,h.generateMipmaps=!h.isCompressedTexture&&h.minFilter!==wt&&h.minFilter!==_t,s.associations.set(h,{textures:e}),h}).catch(function(){return null});return this.textureCache[l]=c,c}loadImageSource(e,t){const n=this,s=this.json,r=this.options;if(this.sourceCache[e]!==void 0)return this.sourceCache[e].then(u=>u.clone());const a=s.images[e],o=self.URL||self.webkitURL;let l=a.uri||"",c=!1;if(a.bufferView!==void 0)l=n.getDependency("bufferView",a.bufferView).then(function(u){c=!0;const d=new Blob([u],{type:a.mimeType});return l=o.createObjectURL(d),l});else if(a.uri===void 0)throw new Error("THREE.GLTFLoader: Image "+e+" is missing URI and bufferView");const h=Promise.resolve(l).then(function(u){return new Promise(function(d,f){let g=d;t.isImageBitmapLoader===!0&&(g=function(_){const p=new Ct(_);p.needsUpdate=!0,d(p)}),t.load(Vr.resolveURL(u,r.path),g,void 0,f)})}).then(function(u){return c===!0&&o.revokeObjectURL(l),Gn(u,a),u.userData.mimeType=a.mimeType||gb(a.uri),u}).catch(function(u){throw console.error("THREE.GLTFLoader: Couldn't load texture",l),u});return this.sourceCache[e]=h,h}assignTexture(e,t,n,s){const r=this;return this.getDependency("texture",n.index).then(function(a){if(!a)return null;if(n.texCoord!==void 0&&n.texCoord>0&&(a=a.clone(),a.channel=n.texCoord),r.extensions[Ze.KHR_TEXTURE_TRANSFORM]){const o=n.extensions!==void 0?n.extensions[Ze.KHR_TEXTURE_TRANSFORM]:void 0;if(o){const l=r.associations.get(a);a=r.extensions[Ze.KHR_TEXTURE_TRANSFORM].extendTexture(a,o),r.associations.set(a,l)}}return s!==void 0&&(a.colorSpace=s),e[t]=a,a})}assignFinalMaterial(e){const t=e.geometry;let n=e.material;const s=t.attributes.tangent===void 0,r=t.attributes.color!==void 0,a=t.attributes.normal===void 0;if(e.isPoints){const o="PointsMaterial:"+n.uuid;let l=this.cache.get(o);l||(l=new es,vn.prototype.copy.call(l,n),l.color.copy(n.color),l.map=n.map,l.sizeAttenuation=!1,this.cache.add(o,l)),n=l}else if(e.isLine){const o="LineBasicMaterial:"+n.uuid;let l=this.cache.get(o);l||(l=new Qi,vn.prototype.copy.call(l,n),l.color.copy(n.color),l.map=n.map,this.cache.add(o,l)),n=l}if(s||r||a){let o="ClonedMaterial:"+n.uuid+":";s&&(o+="derivative-tangents:"),r&&(o+="vertex-colors:"),a&&(o+="flat-shading:");let l=this.cache.get(o);l||(l=n.clone(),r&&(l.vertexColors=!0),a&&(l.flatShading=!0),s&&(l.normalScale&&(l.normalScale.y*=-1),l.clearcoatNormalScale&&(l.clearcoatNormalScale.y*=-1)),this.cache.add(o,l),this.associations.set(l,this.associations.get(n))),n=l}e.material=n}getMaterialType(){return tu}loadMaterial(e){const t=this,n=this.json,s=this.extensions,r=n.materials[e];let a;const o={},l=r.extensions||{},c=[];if(l[Ze.KHR_MATERIALS_UNLIT]){const u=s[Ze.KHR_MATERIALS_UNLIT];a=u.getMaterialType(),c.push(u.extendParams(o,r,t))}else{const u=r.pbrMetallicRoughness||{};if(o.color=new Me(1,1,1),o.opacity=1,Array.isArray(u.baseColorFactor)){const d=u.baseColorFactor;o.color.setRGB(d[0],d[1],d[2],Zt),o.opacity=d[3]}u.baseColorTexture!==void 0&&c.push(t.assignTexture(o,"map",u.baseColorTexture,Nt)),o.metalness=u.metallicFactor!==void 0?u.metallicFactor:1,o.roughness=u.roughnessFactor!==void 0?u.roughnessFactor:1,u.metallicRoughnessTexture!==void 0&&(c.push(t.assignTexture(o,"metalnessMap",u.metallicRoughnessTexture)),c.push(t.assignTexture(o,"roughnessMap",u.metallicRoughnessTexture))),a=this._invokeOne(function(d){return d.getMaterialType&&d.getMaterialType(e)}),c.push(Promise.all(this._invokeAll(function(d){return d.extendMaterialParams&&d.extendMaterialParams(e,o)})))}r.doubleSided===!0&&(o.side=At);const h=r.alphaMode||Jl.OPAQUE;if(h===Jl.BLEND?(o.transparent=!0,o.depthWrite=!1):(o.transparent=!1,h===Jl.MASK&&(o.alphaTest=r.alphaCutoff!==void 0?r.alphaCutoff:.5)),r.normalTexture!==void 0&&a!==yt&&(c.push(t.assignTexture(o,"normalMap",r.normalTexture)),o.normalScale=new j(1,1),r.normalTexture.scale!==void 0)){const u=r.normalTexture.scale;o.normalScale.set(u,u)}if(r.occlusionTexture!==void 0&&a!==yt&&(c.push(t.assignTexture(o,"aoMap",r.occlusionTexture)),r.occlusionTexture.strength!==void 0&&(o.aoMapIntensity=r.occlusionTexture.strength)),r.emissiveFactor!==void 0&&a!==yt){const u=r.emissiveFactor;o.emissive=new Me().setRGB(u[0],u[1],u[2],Zt)}return r.emissiveTexture!==void 0&&a!==yt&&c.push(t.assignTexture(o,"emissiveMap",r.emissiveTexture,Nt)),Promise.all(c).then(function(){const u=new a(o);return r.name&&(u.name=r.name),Gn(u,r),t.associations.set(u,{materials:e}),r.extensions&&zi(s,u,r),u})}createUniqueName(e){const t=lt.sanitizeNodeName(e||"");return t in this.nodeNamesUsed?t+"_"+ ++this.nodeNamesUsed[t]:(this.nodeNamesUsed[t]=0,t)}loadGeometries(e){const t=this,n=this.extensions,s=this.primitiveCache;function r(o){return n[Ze.KHR_DRACO_MESH_COMPRESSION].decodePrimitive(o,t).then(function(l){return vf(l,o,t)})}const a=[];for(let o=0,l=e.length;o<l;o++){const c=e[o],h=mb(c),u=s[h];if(u)a.push(u.promise);else{let d;c.extensions&&c.extensions[Ze.KHR_DRACO_MESH_COMPRESSION]?d=r(c):d=vf(new et,c,t),s[h]={primitive:c,promise:d},a.push(d)}}return Promise.all(a)}loadMesh(e){const t=this,n=this.json,s=this.extensions,r=n.meshes[e],a=r.primitives,o=[];for(let l=0,c=a.length;l<c;l++){const h=a[l].material===void 0?db(this.cache):this.getDependency("material",a[l].material);o.push(h)}return o.push(t.loadGeometries(a)),Promise.all(o).then(function(l){const c=l.slice(0,l.length-1),h=l[l.length-1],u=[];for(let f=0,g=h.length;f<g;f++){const _=h[f],p=a[f];let m;const M=c[f];if(p.mode===dn.TRIANGLES||p.mode===dn.TRIANGLE_STRIP||p.mode===dn.TRIANGLE_FAN||p.mode===void 0)m=r.isSkinnedMesh===!0?new d0(_,M):new st(_,M),m.isSkinnedMesh===!0&&m.normalizeSkinWeights(),p.mode===dn.TRIANGLE_STRIP?m.geometry=pf(m.geometry,lp):p.mode===dn.TRIANGLE_FAN&&(m.geometry=pf(m.geometry,jc));else if(p.mode===dn.LINES)m=new qi(_,M);else if(p.mode===dn.LINE_STRIP)m=new Yo(_,M);else if(p.mode===dn.LINE_LOOP)m=new v0(_,M);else if(p.mode===dn.POINTS)m=new sr(_,M);else throw new Error("THREE.GLTFLoader: Primitive mode unsupported: "+p.mode);Object.keys(m.geometry.morphAttributes).length>0&&pb(m,r),m.name=t.createUniqueName(r.name||"mesh_"+e),Gn(m,r),p.extensions&&zi(s,m,p),t.assignFinalMaterial(m),u.push(m)}for(let f=0,g=u.length;f<g;f++)t.associations.set(u[f],{meshes:e,primitives:f});if(u.length===1)return r.extensions&&zi(s,u[0],r),u[0];const d=new Pn;r.extensions&&zi(s,d,r),t.associations.set(d,{meshes:e});for(let f=0,g=u.length;f<g;f++)d.add(u[f]);return d})}loadCamera(e){let t;const n=this.json.cameras[e],s=n[n.type];if(!s){console.warn("THREE.GLTFLoader: Missing camera parameters.");return}return n.type==="perspective"?t=new $t(kh.radToDeg(s.yfov),s.aspectRatio||1,s.znear||1,s.zfar||2e6):n.type==="orthographic"&&(t=new pa(-s.xmag,s.xmag,s.ymag,-s.ymag,s.znear,s.zfar)),n.name&&(t.name=this.createUniqueName(n.name)),Gn(t,n),Promise.resolve(t)}loadSkin(e){const t=this.json.skins[e],n=[];for(let s=0,r=t.joints.length;s<r;s++)n.push(this._loadNodeShallow(t.joints[s]));return t.inverseBindMatrices!==void 0?n.push(this.getDependency("accessor",t.inverseBindMatrices)):n.push(null),Promise.all(n).then(function(s){const r=s.pop(),a=s,o=[],l=[];for(let c=0,h=a.length;c<h;c++){const u=a[c];if(u){o.push(u);const d=new We;r!==null&&d.fromArray(r.array,c*16),l.push(d)}else console.warn('THREE.GLTFLoader: Joint "%s" could not be found.',t.joints[c])}return new Xh(o,l)})}loadAnimation(e){const t=this.json,n=this,s=t.animations[e],r=s.name?s.name:"animation_"+e,a=[],o=[],l=[],c=[],h=[];for(let u=0,d=s.channels.length;u<d;u++){const f=s.channels[u],g=s.samplers[f.sampler],_=f.target,p=_.node,m=s.parameters!==void 0?s.parameters[g.input]:g.input,M=s.parameters!==void 0?s.parameters[g.output]:g.output;_.node!==void 0&&(a.push(this.getDependency("node",p)),o.push(this.getDependency("accessor",m)),l.push(this.getDependency("accessor",M)),c.push(g),h.push(_))}return Promise.all([Promise.all(a),Promise.all(o),Promise.all(l),Promise.all(c),Promise.all(h)]).then(function(u){const d=u[0],f=u[1],g=u[2],_=u[3],p=u[4],m=[];for(let y=0,S=d.length;y<S;y++){const w=d[y],T=f[y],L=g[y],x=_[y],E=p[y];if(w===void 0)continue;w.updateMatrix&&w.updateMatrix();const N=n._createAnimationTracks(w,T,L,x,E);if(N)for(let C=0;C<N.length;C++)m.push(N[C])}const M=new p_(r,void 0,m);return Gn(M,s),M})}createNodeMesh(e){const t=this.json,n=this,s=t.nodes[e];return s.mesh===void 0?null:n.getDependency("mesh",s.mesh).then(function(r){const a=n._getNodeRef(n.meshCache,s.mesh,r);return s.weights!==void 0&&a.traverse(function(o){if(o.isMesh)for(let l=0,c=s.weights.length;l<c;l++)o.morphTargetInfluences[l]=s.weights[l]}),a})}loadNode(e){const t=this.json,n=this,s=t.nodes[e],r=n._loadNodeShallow(e),a=[],o=s.children||[];for(let c=0,h=o.length;c<h;c++)a.push(n.getDependency("node",o[c]));const l=s.skin===void 0?Promise.resolve(null):n.getDependency("skin",s.skin);return Promise.all([r,Promise.all(a),l]).then(function(c){const h=c[0],u=c[1],d=c[2];d!==null&&h.traverse(function(f){f.isSkinnedMesh&&f.bind(d,_b)});for(let f=0,g=u.length;f<g;f++)h.add(u[f]);if(h.userData.pivot!==void 0&&u.length>0){const f=h.userData.pivot,g=u[0];h.pivot=new P().fromArray(f),h.position.x-=f[0],h.position.y-=f[1],h.position.z-=f[2],g.position.set(0,0,0),delete h.userData.pivot}return h})}_loadNodeShallow(e){const t=this.json,n=this.extensions,s=this;if(this.nodeCache[e]!==void 0)return this.nodeCache[e];const r=t.nodes[e],a=r.name?s.createUniqueName(r.name):"",o=[],l=s._invokeOne(function(c){return c.createNodeMesh&&c.createNodeMesh(e)});return l&&o.push(l),r.camera!==void 0&&o.push(s.getDependency("camera",r.camera).then(function(c){return s._getNodeRef(s.cameraCache,r.camera,c)})),s._invokeAll(function(c){return c.createNodeAttachment&&c.createNodeAttachment(e)}).forEach(function(c){o.push(c)}),this.nodeCache[e]=Promise.all(o).then(function(c){let h;if(r.isBone===!0?h=new mp:c.length>1?h=new Pn:c.length===1?h=c[0]:h=new xt,h!==c[0])for(let u=0,d=c.length;u<d;u++)h.add(c[u]);if(r.name&&(h.userData.name=r.name,h.name=a),Gn(h,r),r.extensions&&zi(n,h,r),r.matrix!==void 0){const u=new We;u.fromArray(r.matrix),h.applyMatrix4(u)}else r.translation!==void 0&&h.position.fromArray(r.translation),r.rotation!==void 0&&h.quaternion.fromArray(r.rotation),r.scale!==void 0&&h.scale.fromArray(r.scale);if(!s.associations.has(h))s.associations.set(h,{});else if(r.mesh!==void 0&&s.meshCache.refs[r.mesh]>1){const u=s.associations.get(h);s.associations.set(h,{...u})}return s.associations.get(h).nodes=e,h}),this.nodeCache[e]}loadScene(e){const t=this.extensions,n=this.json.scenes[e],s=this,r=new Pn;n.name&&(r.name=s.createUniqueName(n.name)),Gn(r,n),n.extensions&&zi(t,r,n);const a=n.nodes||[],o=[];for(let l=0,c=a.length;l<c;l++)o.push(s.getDependency("node",a[l]));return Promise.all(o).then(function(l){for(let h=0,u=l.length;h<u;h++){const d=l[h];d.parent!==null?r.add(zE(d)):r.add(d)}const c=h=>{const u=new Map;for(const[d,f]of s.associations)(d instanceof vn||d instanceof Ct)&&u.set(d,f);return h.traverse(d=>{const f=s.associations.get(d);f!=null&&u.set(d,f)}),u};return s.associations=c(r),r})}_createAnimationTracks(e,t,n,s,r){const a=[],o=e.name?e.name:e.uuid,l=[];Si[r.path]===Si.weights?e.traverse(function(d){d.morphTargetInfluences&&l.push(d.name?d.name:d.uuid)}):l.push(o);let c;switch(Si[r.path]){case Si.weights:c=$s;break;case Si.rotation:c=Js;break;case Si.translation:case Si.scale:c=Zs;break;default:n.itemSize===1?c=$s:c=Zs;break}const h=s.interpolation!==void 0?ub[s.interpolation]:Qr,u=this._getArrayFromAccessor(n);for(let d=0,f=l.length;d<f;d++){const g=new c(l[d]+"."+Si[r.path],t.array,u,h);s.interpolation==="CUBICSPLINE"&&this._createCubicSplineTrackInterpolant(g),a.push(g)}return a}_getArrayFromAccessor(e){let t=e.array;if(e.normalized){const n=hh(t.constructor),s=new Float32Array(t.length);for(let r=0,a=t.length;r<a;r++)s[r]=t[r]*n;t=s}return t}_createCubicSplineTrackInterpolant(e){e.createInterpolant=function(n){const s=this instanceof Js?hb:$p;return new s(this.times,this.values,this.getValueSize()/3,n)},e.createInterpolant.isInterpolantFactoryMethodGLTFCubicSpline=!0}}function vb(i,e,t){const n=e.attributes,s=new cn;if(n.POSITION!==void 0){const o=t.json.accessors[n.POSITION],l=o.min,c=o.max;if(l!==void 0&&c!==void 0){if(s.set(new P(l[0],l[1],l[2]),new P(c[0],c[1],c[2])),o.normalized){const h=hh(ks[o.componentType]);s.min.multiplyScalar(h),s.max.multiplyScalar(h)}}else{console.warn("THREE.GLTFLoader: Missing min/max properties for accessor POSITION.");return}}else return;const r=e.targets;if(r!==void 0){const o=new P,l=new P;for(let c=0,h=r.length;c<h;c++){const u=r[c];if(u.POSITION!==void 0){const d=t.json.accessors[u.POSITION],f=d.min,g=d.max;if(f!==void 0&&g!==void 0){if(l.setX(Math.max(Math.abs(f[0]),Math.abs(g[0]))),l.setY(Math.max(Math.abs(f[1]),Math.abs(g[1]))),l.setZ(Math.max(Math.abs(f[2]),Math.abs(g[2]))),d.normalized){const _=hh(ks[d.componentType]);l.multiplyScalar(_)}o.max(l)}else console.warn("THREE.GLTFLoader: Missing min/max properties for accessor POSITION.")}}s.expandByVector(o)}i.boundingBox=s;const a=new Mn;s.getCenter(a.center),a.radius=s.min.distanceTo(s.max)/2,i.boundingSphere=a}function vf(i,e,t){const n=e.attributes,s=[];function r(a,o){return t.getDependency("accessor",a).then(function(l){i.setAttribute(o,l)})}for(const a in n){const o=ch[a]||a.toLowerCase();o in i.attributes||s.push(r(n[a],o))}if(e.indices!==void 0&&!i.index){const a=t.getDependency("accessor",e.indices).then(function(o){i.setIndex(o)});s.push(a)}return Qe.workingColorSpace!==Zt&&"COLOR_0"in n&&console.warn(`THREE.GLTFLoader: Converting vertex colors from "srgb-linear" to "${Qe.workingColorSpace}" not supported.`),Gn(i,e),vb(i,e,t),Promise.all(s).then(function(){return e.targets!==void 0?fb(i,e.targets,t):i})}const Mb={KATL:"Atlanta",KORD:"Chicago",KLAX:"Los Angeles",KDFW:"Dallas",KDEN:"Denver",KJFK:"New York",KSFO:"San Francisco",KSEA:"Seattle",KLAS:"Las Vegas",KMCO:"Orlando",KEWR:"Newark",KPHX:"Phoenix",KIAH:"Houston",KMIA:"Miami",KBOS:"Boston",KLGA:"New York",KDTW:"Detroit",KMSN:"Madison",KMSP:"Minneapolis",KPHL:"Philadelphia",KFLL:"Fort Lauderdale",KBWI:"Baltimore",KIAD:"Washington",KDCA:"Washington",KSLC:"Salt Lake City",KPDX:"Portland",KOAK:"Oakland",KSJC:"San Jose",KSNA:"Santa Ana",KHOU:"Houston",KMDW:"Chicago",KBNA:"Nashville",KCLT:"Charlotte",KMEM:"Memphis",KSTL:"St Louis",KRDU:"Raleigh",KSMF:"Sacramento",KTPA:"Tampa",KPBI:"Palm Beach",KABQ:"Albuquerque",KANC:"Anchorage",PHNL:"Honolulu",PHOG:"Maui",KOMA:"Omaha",KMCI:"Kansas City",KCVG:"Cincinnati",KCMH:"Columbus",KPIT:"Pittsburgh",KBUF:"Buffalo",KROC:"Rochester",KALB:"Albany",KBDL:"Hartford",KPVD:"Providence",KSYR:"Syracuse",KMHT:"Manchester",KBTV:"Burlington",KPWM:"Portland ME",KBGR:"Bangor",KRIC:"Richmond",KORF:"Norfolk",KCLT:"Charlotte",KGSO:"Greensboro",KCAE:"Columbia",KCHS:"Charleston",KSAV:"Savannah",KJAX:"Jacksonville",KPNS:"Pensacola",KMOB:"Mobile",KNEW:"New Orleans",KBTR:"Baton Rouge",KLIT:"Little Rock",KTUL:"Tulsa",KOKC:"Oklahoma City",KSAT:"San Antonio",KAUS:"Austin",KELP:"El Paso",KAMA:"Amarillo",KLBB:"Lubbock",KABI:"Abilene",KSJT:"San Angelo",KMAF:"Midland",KODQ:"Doha",KCOS:"Colorado Springs",KGJT:"Grand Junction",KBZN:"Bozeman",KBTM:"Butte",KGPI:"Kalispell",KFCA:"Kalispell",KSUN:"Sun Valley",KIDA:"Idaho Falls",KPSC:"Pasco",KYKM:"Yakima",KEAT:"Wenatchee",KBFI:"Seattle",KRNT:"Renton",KPAE:"Everett",KSFF:"Spokane",KGEG:"Spokane",KBOI:"Boise",KMFR:"Medford",KEUG:"Eugene",KRDM:"Redmond",KOTH:"North Bend",KCEC:"Crescent City",KRDD:"Redding",KFAT:"Fresno",KBFL:"Bakersfield",KSBP:"San Luis Obispo",KSMX:"Santa Maria",KSBA:"Santa Barbara",KONT:"Ontario",KPSP:"Palm Springs",KIPL:"El Centro",KSAN:"San Diego",KNKX:"San Diego",KMYF:"San Diego",KTOA:"Torrance",KBUR:"Burbank",KVNY:"Van Nuys",KLGB:"Long Beach",KFUL:"Fullerton",KSNA:"Orange County",KLAX:"Los Angeles",KHND:"Henderson",KVGT:"Las Vegas",KBAB:"Beale AFB",KRNO:"Reno",KTVL:"South Lake Tahoe",KMEV:"Minden",KMMH:"Mammoth Lakes",KSCK:"Stockton",KMOD:"Modesto",KMRY:"Monterey",KSNS:"Salinas",KWVI:"Watsonville",KSJC:"San Jose",KRHV:"San Jose",KNUQ:"Mountain View",KSQL:"San Carlos",KSFO:"San Francisco",KOAK:"Oakland",KCCR:"Concord",KLVK:"Livermore",KHWD:"Hayward",KAPC:"Napa",KSTS:"Santa Rosa",KUKI:"Ukiah",KACV:"Arcata",KMHS:"Auburn",KSAC:"Sacramento",KSMF:"Sacramento",KTRK:"Truckee",KTVL:"South Lake Tahoe",PANC:"Anchorage",PAFA:"Fairbanks",PAJN:"Juneau",PAKT:"Ketchikan",PASN:"St Paul",PADQ:"Kodiak",PHNL:"Honolulu",PHOG:"Maui",PHKO:"Kailua-Kona",PHLI:"Lihue",PHHI:"Oahu",CYYZ:"Toronto",CYVR:"Vancouver",CYUL:"Montreal",CYEG:"Edmonton",CYYC:"Calgary",CYOW:"Ottawa",CYHZ:"Halifax",CYWG:"Winnipeg",CYYJ:"Victoria",CYLW:"Kelowna",CYXE:"Saskatoon",CYQR:"Regina",CYQT:"Thunder Bay",CYAM:"Sault Ste Marie",CYWH:"Victoria",MMMX:"Mexico City",MMMY:"Monterrey",MMGL:"Guadalajara",MMTJ:"Tijuana",MMCU:"Chihuahua",MMCN:"Ciudad Obregon",MMMD:"Merida",MMUN:"Cancun",MMZT:"Mazatlan",MMPB:"Puebla",MROC:"San Jose",MGAS:"Tegucigalpa",MGGT:"Guatemala City",MNMG:"Managua",MPTO:"Panama City",MSSS:"San Salvador",TBPB:"Bridgetown",MKJP:"Kingston",MDSD:"Santo Domingo",TJSJ:"San Juan",MUVR:"Varadero",MUHA:"Havana",TNCM:"St Maarten",TFFR:"Pointe-a-Pitre",TFFF:"Fort-de-France",SBGR:"São Paulo",SBGL:"Rio de Janeiro",SBSP:"São Paulo",SBCF:"Belo Horizonte",SBBE:"Belém",SBMO:"Maceio",SBREC:"Recife",SBSV:"Salvador",SBFZ:"Fortaleza",SBMN:"Manaus",SBBV:"Boa Vista",SBRF:"Recife",SBPA:"Porto Alegre",SBFL:"Florianopolis",SBCT:"Curitiba",SBCY:"Cuiaba",SBPV:"Porto Velho",SBBH:"Belo Horizonte",SAEZ:"Buenos Aires",SABE:"Buenos Aires",SACO:"Cordoba",SAMM:"Mendoza",SASJ:"Salta",SCFA:"Antofagasta",SCEL:"Santiago",SPIM:"Lima",SKBO:"Bogota",SEQM:"Quito",SEGU:"Guayaquil",SVMI:"Caracas",SMJP:"Paramaribo",SYCJ:"Georgetown",SUAA:"Montevideo",SLVR:"La Paz",SPTU:"Puerto Maldonado",SPZO:"Cusco",EGLL:"London Heathrow",EGKK:"London Gatwick",EGSS:"London Stansted",EGGW:"London Luton",EGCC:"Manchester",EGPH:"Edinburgh",EGPF:"Glasgow",EGBB:"Birmingham",EGGD:"Bristol",EGNX:"East Midlands",EGNT:"Newcastle",EGNJ:"Humberside",EGAA:"Belfast",EGAC:"Belfast City",EIDW:"Dublin",EICK:"Cork",EINN:"Shannon",LFPG:"Paris CDG",LFPO:"Paris Orly",LFLY:"Lyon",LFMN:"Nice",LFLL:"Lyon",LFML:"Marseille",LFBD:"Bordeaux",LFBO:"Toulouse",LFRS:"Nantes",LFRN:"Rennes",LFST:"Strasbourg",EDDF:"Frankfurt",EDDL:"Düsseldorf",EDDM:"Munich",EDDB:"Berlin",EDDI:"Berlin",EDDH:"Hamburg",EDDS:"Stuttgart",EDDV:"Hanover",EDDN:"Nuremberg",EDDP:"Leipzig",EHAM:"Amsterdam",EHBK:"Maastricht",EHGG:"Groningen",EHRD:"Rotterdam",EBBR:"Brussels",EBCI:"Charleroi",ELLX:"Luxembourg",LEMD:"Madrid",LEBL:"Barcelona",LEPA:"Palma",LEAL:"Alicante",LEMG:"Malaga",LEBB:"Bilbao",LESO:"San Sebastian",LEVT:"Vitoria",LEZL:"Seville",LEGR:"Granada",LPPT:"Lisbon",LPPR:"Porto",LPFR:"Faro",LPLA:"Azores",LIRF:"Rome Fiumicino",LIML:"Milan Linate",LIME:"Bergamo",LIMC:"Milan Malpensa",LIPZ:"Venice",LIRQ:"Florence",LIRN:"Naples",LICJ:"Palermo",LICC:"Catania",LICA:"Lamezia Terme",LSZH:"Zurich",LSGG:"Geneva",LSZA:"Lugano",LSZB:"Bern",LOWI:"Innsbruck",LOWW:"Vienna",LOWS:"Salzburg",LOWK:"Klagenfurt",LHBP:"Budapest",LKPR:"Prague",EPWA:"Warsaw",EPKK:"Krakow",EPGD:"Gdansk",OKBK:"Kuwait",LEAL:"Alicante",EKCH:"Copenhagen",ESGG:"Gothenburg",ESSA:"Stockholm",ESKN:"Stockholm Skavsta",EFHK:"Helsinki",EFTP:"Tampere",EFTU:"Turku",ENGM:"Oslo",ENBR:"Bergen",ENVA:"Trondheim",EVRA:"Riga",EYVI:"Vilnius",EETN:"Tallinn",UUEE:"Moscow Sheremetyevo",UUDD:"Moscow Domodedovo",UUBW:"Moscow Zhukovsky",UKBB:"Kyiv Boryspil",UKLL:"Lviv",LROP:"Bucharest",LWSK:"Skopje",LBSF:"Sofia",LDZA:"Zagreb",LJLJ:"Ljubljana",LYBE:"Belgrade",LYNI:"Nis",LWOH:"Ohrid",LGAV:"Athens",LGTS:"Thessaloniki",LGKR:"Corfu",LGRP:"Rhodes",LGIR:"Heraklion",LTBA:"Istanbul Ataturk",LTFM:"Istanbul",LTAI:"Antalya",LTBJ:"Izmir",LTAC:"Ankara",OMDB:"Dubai",OMDW:"Dubai World Central",OMAA:"Abu Dhabi",OMSJ:"Sharjah",OERK:"Riyadh",OEDF:"Dammam",OEJN:"Jeddah",OEMD:"Madinah",OETF:"Taif",OKBK:"Kuwait City",OEAB:"Abha",OOMM:"Muscat",OIKB:"Bandar Abbas",OIII:"Tehran",OBBI:"Bahrain",OTHH:"Doha",OLBA:"Beirut",ORBI:"Baghdad",OSDI:"Damascus",HECA:"Cairo",LLBG:"Tel Aviv",OJAM:"Amman",HECA:"Cairo",HEAT:"Aswan",HELX:"Luxor",HESH:"Sharm el-Sheikh",HEAR:"El Arish",GMMN:"Casablanca",GMME:"Rabat",GMFM:"Marrakech",GMTT:"Tangier",DTTJ:"Djerba",DTTA:"Tunis",DAAG:"Algiers",DTMB:"Monastir",DTNH:"Enfidha",HAAB:"Addis Ababa",HKJK:"Nairobi",FMMI:"Antananarivo",FMCH:"Moroni",FAOR:"Johannesburg",FACT:"Cape Town",FALE:"Durban",FAGM:"Johannesburg Rand",FBSK:"Gaborone",FWKI:"Lilongwe",FQMA:"Maputo",FVHA:"Harare",FLLK:"Lusaka",FYWH:"Windhoek",FMCH:"Comoros",HLLT:"Tripoli",FSPP:"Mahé",DNMM:"Lagos",DNAS:"Abuja",DIKO:"Abidjan",DFFD:"Ouagadougou",DIAP:"Abidjan",GVNP:"Santiago (Cape Verde)",GOBD:"Dakar",GUCY:"Conakry",GBYD:"Banjul",VABB:"Mumbai",VIDP:"New Delhi",VOMM:"Chennai",VOHS:"Hyderabad",VOBL:"Bangalore",VECC:"Kolkata",VOMR:"Mumbai",VOCB:"Coimbatore",VOGO:"Goa",VIKN:"Lucknow",VOAT:"Pune",VIAR:"Amritsar",VIAI:"Ahmedabad",VIBR:"Bhopal",VEJH:"Jhansi",VNTC:"Kathmandu",VGHS:"Dhaka",VCBI:"Colombo",VRMM:"Malé",OPKC:"Karachi",OPLA:"Lahore",OPRN:"Islamabad",OPPS:"Peshawar",OPQT:"Quetta",VHHH:"Hong Kong",VMMC:"Macau",RCTP:"Taipei",RCSS:"Taipei Songshan",RCKH:"Kaohsiung",WSSS:"Singapore",WMKK:"Kuala Lumpur",VTBS:"Bangkok Suvarnabhumi",VTBD:"Bangkok Don Mueang",WMKP:"Penang",WMKD:"Kota Bahru",WBGG:"Kuching",WBKK:"Kota Kinabalu",WADD:"Bali",WIII:"Jakarta",WIDD:"Jakarta Halim",WRLL:"Balikpapan",WAMM:"Manado",WAPP:"Palu",RPLL:"Manila",RPLC:"Clark",RPMD:"Davao",RPMZ:"Zamboanga",RPLM:"Puerto Princesa",VDPP:"Phnom Penh",VVNB:"Hanoi",VVTS:"Ho Chi Minh City",VVDN:"Da Nang",VLVT:"Vientiane",VYYY:"Yangon",RKSI:"Seoul Incheon",RKSS:"Seoul Gimpo",RKPK:"Busan",RJTT:"Tokyo Haneda",RJAA:"Tokyo Narita",RJOO:"Osaka Itami",RJBB:"Osaka Kansai",RJCC:"Sapporo",RJFF:"Fukuoka",RJKK:"Jeju",RCBS:"Kinmen",ZBAA:"Beijing Capital",ZBAD:"Beijing Daxing",ZSPD:"Shanghai Pudong",ZSSS:"Shanghai Hongqiao",ZGGG:"Guangzhou",ZGSZ:"Shenzhen",ZUCK:"Chongqing",ZUUU:"Chengdu",ZLXY:"Xian",ZSNJ:"Nanjing",ZSHC:"Hangzhou",ZSFZ:"Fuzhou",ZSAM:"Xiamen",ZGHA:"Changsha",ZSQD:"Qingdao",ZYTX:"Shenyang",ZYHB:"Harbin",ZYCC:"Changchun",ZLLL:"Lanzhou",ZWWW:"Ürümqi",ZPPP:"Kunming",ZGNN:"Nanning",ZGOW:"Shantou",ZGZH:"Zhuhai",YSSY:"Sydney",YMML:"Melbourne",YBBN:"Brisbane",YPPH:"Perth",YPAD:"Adelaide",YBCG:"Gold Coast",YMHB:"Hobart",YMEN:"Melbourne Essendon",YCBR:"Canberra",YBCS:"Cairns",YBMK:"Mackay",YBRK:"Rockhampton",YPDN:"Darwin",YBTL:"Townsville",NZAA:"Auckland",NZCH:"Christchurch",NZWN:"Wellington",NZQN:"Queenstown",NFNA:"Suva",NTAA:"Papeete",NWWW:"Nouméa",AGGH:"Honiara",ANYN:"Nauru",PGUM:"Guam",PGSN:"Saipan",PHTO:"Hilo"};function Mf(i){return i&&Mb[i.toUpperCase()]||null}const yb="/api/adsbfi/api/v2",Sb="/api/adsboe/v2",Eb="/api/trace/data/traces",bb=3500,Jp=3e3,yf=100;let hu=40.7128,uu=-74.006,Zp=0,uh=null,dh=null,so=0;const zo=new Map,Tb=6e5,er=new Map,Ab=9e5,wb=18e5,Wr=new Set;function Qp(i,e){hu=i,uu=e}function Jo(){return{lat:hu,lon:uu}}function Cb(i){const e=i.alt_baro;return e==="ground"||e==null||i.lat==null||i.lon==null?null:{icao24:i.hex,callsign:(i.flight||"").trim(),originCountry:null,timePosition:Math.floor(Date.now()/1e3),lastContact:Math.floor(Date.now()/1e3),longitude:i.lon,latitude:i.lat,baroAltitude:typeof e=="number"?e*.3048:null,onGround:e==="ground",velocity:i.gs!=null?i.gs*.514444:null,trueTrack:i.track,verticalRate:i.baro_rate!=null?i.baro_rate*.00508:null,geoAltitude:i.alt_geom!=null?i.alt_geom*.3048:null,category:i.category,registration:i.r,aircraftType:i.t,origin:i.oa||null,destination:i.da||null,operator:i.ownOp||null,year:i.year||null,typeDesc:i.desc||null}}function Rb(i){const e=i.ac||i.aircraft;return!e||!Array.isArray(e)?[]:e.map(Cb).filter(t=>t!=null&&t.baroAltitude!=null&&t.baroAltitude>100)}let Ao=0,Fr=0;async function Sf(i,e,t){const n=new AbortController,s=setTimeout(()=>n.abort(),bb);try{const r=await fetch(i,{cache:"no-store",signal:n.signal});if(r.status===429)throw e.v=Date.now()+12e4,new Error(`${t} 429`);if(!r.ok)throw new Error(`${t} HTTP ${r.status}`);return Rb(await r.json())}finally{clearTimeout(s)}}async function Pb(){const i=hu.toFixed(4),e=uu.toFixed(4),t=Math.floor(Date.now()/1e3),n={v:Fr};if(Date.now()>=Fr)try{const r=await Sf(`${Sb}/point/${i}/${e}/${yf}?_t=${t}`,n,"adsb.one");return Fr=n.v,r}catch{Fr=n.v}const s={v:Ao};if(Date.now()>=Ao){const r=await Sf(`${yb}/lat/${i}/lon/${e}/dist/${yf}?_t=${t}`,s,"adsb.fi");return Ao=s.v,r}throw new Error("all sources rate-limited")}let wr=!1,Ef=0;async function em(i){if(!Wr.has(i)){Wr.add(i);try{const e=i.slice(-2),t=`${Eb}/${e}/trace_full_${i}.json`,n=await fetch(t);if(!n.ok)return;const s=await n.json();if(!s.trace||!Array.isArray(s.trace))return;const r=s.timestamp||0,o=Date.now()/1e3-1800,l=[];for(const c of s.trace){const h=r+c[0];if(h<o)continue;const u=c[1],d=c[2],f=c[3];u==null||d==null||f==null||f==="ground"||l.push({latitude:u,longitude:d,baroAltitude:f*.3048,time:h})}l.length>=1&&er.set(i,{path:l,fetchedAt:Date.now()})}catch{}finally{Wr.delete(i)}}}let Xr=[],ro=null;function Lb(i){if(!(er.has(i)||Wr.has(i))&&!Xr.includes(i)&&(Xr.push(i),!ro)){const e=()=>{const t=Xr.splice(0,8);if(t.length===0){clearInterval(ro),ro=null;return}for(const n of t)em(n)};e(),ro=setInterval(e,200)}}function Db(i){if(!i||Wr.has(i))return;const e=Xr.indexOf(i);e!==-1&&Xr.splice(e,1),em(i)}async function bf(){if(wr&&Date.now()-Ef>5e3&&(wr=!1),!wr&&!(Date.now()<Ao&&Date.now()<Fr)){wr=!0,Ef=Date.now();try{const i=await Pb();so=0,Zp=Date.now(),uh&&uh(i);for(const e of i){const t=e.callsign;if(!t||t.length<3||t===e.icao24||!e.origin&&!e.destination)continue;const n=zo.get(t);n&&(n.originCity||n.destCity)||zo.set(t,{origin:e.origin||null,destination:e.destination||null,originCity:Mf(e.origin),destCity:Mf(e.destination),fetchedAt:Date.now()})}for(const e of i)if(e.icao24){const t=er.get(e.icao24);(!t||Date.now()-t.fetchedAt>Ab)&&Lb(e.icao24)}}catch(i){so++,console.error("[Data] Fetch error:",i.message,`(${so})`),dh&&dh(i,so)}finally{wr=!1}}}function Ib(i,e){uh=i,dh=e,bf(),setInterval(bf,Jp)}function Nb(){return Zp}function Ub(){return Jp}function Tf(i){if(!i)return null;const e=zo.get(i);return e?Date.now()-e.fetchedAt>Tb?(zo.delete(i),null):e:null}function Af(i){if(!i)return null;const e=er.get(i);return!e||!e.path?null:Date.now()-e.fetchedAt>wb?(er.delete(i),null):e.path}function wf(i){if(!i)return 0;const e=er.get(i);return!e||!e.path?0:e.fetchedAt}const Ob={A318:{pax:132,range:3100,mfr:"Airbus",name:"A318"},A319:{pax:156,range:3700,mfr:"Airbus",name:"A319"},A320:{pax:180,range:3300,mfr:"Airbus",name:"A320"},A20N:{pax:194,range:3500,mfr:"Airbus",name:"A320neo"},A321:{pax:220,range:3200,mfr:"Airbus",name:"A321"},A21N:{pax:244,range:4e3,mfr:"Airbus",name:"A321neo"},B737:{pax:162,range:3115,mfr:"Boeing",name:"737-800"},B738:{pax:189,range:3115,mfr:"Boeing",name:"737-800"},B739:{pax:220,range:3200,mfr:"Boeing",name:"737-900ER"},B38M:{pax:210,range:3550,mfr:"Boeing",name:"737 MAX 8"},B39M:{pax:230,range:3550,mfr:"Boeing",name:"737 MAX 9"},B3XM:{pax:230,range:3850,mfr:"Boeing",name:"737 MAX 10"},B752:{pax:200,range:3900,mfr:"Boeing",name:"757-200"},B753:{pax:280,range:3400,mfr:"Boeing",name:"757-300"},BCS1:{pax:133,range:3100,mfr:"Airbus",name:"A220-100"},BCS3:{pax:160,range:3350,mfr:"Airbus",name:"A220-300"},A332:{pax:277,range:6750,mfr:"Airbus",name:"A330-200"},A333:{pax:335,range:5750,mfr:"Airbus",name:"A330-300"},A338:{pax:287,range:7200,mfr:"Airbus",name:"A330-800neo"},A339:{pax:310,range:7200,mfr:"Airbus",name:"A330-900neo"},A359:{pax:325,range:8100,mfr:"Airbus",name:"A350-900"},A35K:{pax:369,range:8700,mfr:"Airbus",name:"A350-1000"},B762:{pax:255,range:6600,mfr:"Boeing",name:"767-200ER"},B763:{pax:290,range:5990,mfr:"Boeing",name:"767-300ER"},B764:{pax:375,range:5625,mfr:"Boeing",name:"767-400ER"},B772:{pax:314,range:5240,mfr:"Boeing",name:"777-200"},B77L:{pax:314,range:7700,mfr:"Boeing",name:"777-200LR"},B77W:{pax:365,range:7370,mfr:"Boeing",name:"777-300ER"},B778:{pax:384,range:8730,mfr:"Boeing",name:"777-8"},B779:{pax:426,range:7285,mfr:"Boeing",name:"777-9"},B788:{pax:242,range:7355,mfr:"Boeing",name:"787-8"},B789:{pax:290,range:7635,mfr:"Boeing",name:"787-9"},B78X:{pax:330,range:7635,mfr:"Boeing",name:"787-10"},A388:{pax:555,range:8e3,mfr:"Airbus",name:"A380-800"},B744:{pax:416,range:7260,mfr:"Boeing",name:"747-400"},B748:{pax:410,range:7730,mfr:"Boeing",name:"747-8i"},A342:{pax:253,range:6700,mfr:"Airbus",name:"A340-200"},A343:{pax:295,range:6700,mfr:"Airbus",name:"A340-300"},A345:{pax:313,range:8500,mfr:"Airbus",name:"A340-500"},A346:{pax:380,range:7900,mfr:"Airbus",name:"A340-600"},CRJ2:{pax:50,range:1700,mfr:"Bombardier",name:"CRJ-200"},CRJ7:{pax:70,range:1600,mfr:"Bombardier",name:"CRJ-700"},CRJ9:{pax:90,range:1550,mfr:"Bombardier",name:"CRJ-900"},CRJX:{pax:104,range:1600,mfr:"Bombardier",name:"CRJ-1000"},E170:{pax:72,range:2100,mfr:"Embraer",name:"E170"},E75L:{pax:88,range:2200,mfr:"Embraer",name:"E175"},E75S:{pax:88,range:2200,mfr:"Embraer",name:"E175"},E190:{pax:100,range:2450,mfr:"Embraer",name:"E190"},E195:{pax:124,range:2300,mfr:"Embraer",name:"E195"},E290:{pax:120,range:2600,mfr:"Embraer",name:"E190-E2"},E295:{pax:146,range:2600,mfr:"Embraer",name:"E195-E2"},AT72:{pax:72,range:825,mfr:"ATR",name:"ATR 72"},AT76:{pax:72,range:825,mfr:"ATR",name:"ATR 72-600"},DH8D:{pax:78,range:1100,mfr:"De Havilland",name:"Dash 8-400"},GL5T:{pax:16,range:5700,mfr:"Bombardier",name:"Global 5500"},GL7T:{pax:19,range:7700,mfr:"Bombardier",name:"Global 7500"},GLEX:{pax:19,range:6150,mfr:"Bombardier",name:"Global Express"},GLF4:{pax:14,range:4350,mfr:"Gulfstream",name:"G450"},GLF5:{pax:16,range:5800,mfr:"Gulfstream",name:"G550"},GLF6:{pax:19,range:6500,mfr:"Gulfstream",name:"G650"},C68A:{pax:12,range:3500,mfr:"Cessna",name:"Citation Longitude"},C700:{pax:12,range:3500,mfr:"Cessna",name:"Citation Latitude"},LJ45:{pax:9,range:2300,mfr:"Learjet",name:"Learjet 45"},B74S:{pax:0,range:4445,mfr:"Boeing",name:"747-400F",cargo:!0},B77F:{pax:0,range:4900,mfr:"Boeing",name:"777F",cargo:!0},A30B:{pax:0,range:2870,mfr:"Airbus",name:"A300-600F",cargo:!0}};function Fb(i){return i&&Ob[i.toUpperCase()]||null}function Bb(){return null}const Xi=3.28084,zb=3.6,Xn=Math.PI/180,ha=40,tm=111e3/ha,du=.06;new Me(16777215);new Me(16751949);new Me(5093631);const kb=[{speed:0,color:new Me(4882431)},{speed:80,color:new Me(4513211)},{speed:140,color:new Me(6745760)},{speed:200,color:new Me(15654229)},{speed:260,color:new Me(15632435)},{speed:310,color:new Me(14500949)}],Cf=1.5,Hb=.3,ao=6e3,Gb=120,Vb=.5,Wb=1,Xb=300,Kb=.25,Yb=3,Ql={};let oo=null,nm=new j(window.innerWidth,window.innerHeight);window.addEventListener("resize",()=>{nm.set(window.innerWidth,window.innerHeight)});const im="regional",Kr="narrow",sm="wideTwin",rm="wideQuad",am="bizjet",om="prop",qb=new Set(["CRJ2","CRJ7","CRJ9","CRJX","E135","E145","E170","E75L","E75S","E190","E195","E290","E295","AT43","AT45","AT72","AT76","DH8A","DH8B","DH8C","DH8D","SF34"]),jb=new Set(["A318","A319","A320","A20N","A321","A21N","B731","B732","B733","B734","B735","B736","B737","B738","B739","B38M","B39M","BCS1","BCS3","B752","B753","MD80","MD81","MD82","MD83","MD87","MD88","MD90","B712","C919"]),$b=new Set(["A332","A333","A338","A339","A359","A35K","B762","B763","B764","B772","B773","B77L","B77W","B788","B789","B78X"]),Jb=new Set(["A380","A388","B741","B742","B743","B744","B748"]),Zb=new Set(["GLF4","GLF5","GLF6","GL5T","GL7T","GLEX","C510","C525","C525","C550","C560","C56X","C680","C68A","C700","LJ35","LJ45","LJ60","LJ75","CL30","CL35","CL60","FA50","FA7X","FA8X","F900","F2TH","E35L","E50P","E545","E55P","H25B","H25C","ASTR","G150","G200","G280","GALX","PC12","PC24","PRM1"]);function Qb(i){if(!i)return Kr;const e=i.toUpperCase();return qb.has(e)?im:jb.has(e)?Kr:$b.has(e)?sm:Jb.has(e)?rm:Zb.has(e)?am:e.startsWith("P")||e.startsWith("C1")||e.startsWith("C2")||e.startsWith("SR2")||e.startsWith("DA")?om:Kr}const fh=.25,eT=new kE,ph={[Kr]:"/airplane_model/Airplane_Model_B737.glb",[sm]:"/airplane_model/Airplane_Model_B777.glb",[rm]:"/airplane_model/Airplane_Model_A340.glb",[im]:"/airplane_model/Airplane_Model_Regional_CRJ.glb",[am]:"/airplane_model/Airplane_Model_Regional_CRJ.glb",[om]:"/airplane_model/Airplane_Model_Regional_CRJ.glb"},mh={A318:"/airplane_model/Airplane_Model_A320.glb",A319:"/airplane_model/Airplane_Model_A320.glb",A320:"/airplane_model/Airplane_Model_A320.glb",A20N:"/airplane_model/Airplane_Model_A320.glb",A321:"/airplane_model/Airplane_Model_A320.glb",A21N:"/airplane_model/Airplane_Model_A320.glb",BCS1:"/airplane_model/Airplane_Model_A320.glb",BCS3:"/airplane_model/Airplane_Model_A320.glb",A332:"/airplane_model/Airplane_Model_A330.glb",A333:"/airplane_model/Airplane_Model_A330.glb",A338:"/airplane_model/Airplane_Model_A330.glb",A339:"/airplane_model/Airplane_Model_A330.glb",A359:"/airplane_model/Airplane_Model_A350.glb",A35K:"/airplane_model/Airplane_Model_A350.glb",A380:"/airplane_model/Airplane_Model_A340.glb",A388:"/airplane_model/Airplane_Model_A340.glb",B741:"/airplane_model/Airplane_Model_A340.glb",B742:"/airplane_model/Airplane_Model_A340.glb",B743:"/airplane_model/Airplane_Model_A340.glb",B744:"/airplane_model/Airplane_Model_A340.glb",B748:"/airplane_model/Airplane_Model_A340.glb",B772:"/airplane_model/Airplane_Model_B777.glb",B773:"/airplane_model/Airplane_Model_B777.glb",B77L:"/airplane_model/Airplane_Model_B777.glb",B77W:"/airplane_model/Airplane_Model_B777.glb",B788:"/airplane_model/Airplane_Model_A350.glb",B789:"/airplane_model/Airplane_Model_A350.glb",B78X:"/airplane_model/Airplane_Model_A350.glb"},lo={},fu={};function lm(i){if(i){const t=i.toUpperCase();if(mh[t])return mh[t]}const e=Qb(i);return ph[e]||ph[Kr]}function cm(i){return lo[i]||(lo[i]=new Promise(e=>{eT.load(i,t=>{const n=t.scene,s=new cn().setFromObject(n),r=new P;s.getSize(r);const a=Math.max(r.x,r.y,r.z),o=fh/a;n.scale.set(o,o,o);const l=new P;s.getCenter(l),n.position.set(-l.x*o,-l.y*o,-l.z*o);const c=new Pn;c.add(n),c.rotation.y=-Math.PI/2,fu[i]=c,console.log(`[STRATUM] Model loaded: ${i} (${r.x.toFixed(1)}x${r.y.toFixed(1)}x${r.z.toFixed(1)})`),e(n)},void 0,t=>{console.warn(`[STRATUM] Model load failed: ${i}`,t),e(null)})})),lo[i]}const hm=new Set(Object.values(ph));for(const i of Object.values(mh))hm.add(i);for(const i of hm)cm(i);function tT(i){const e=lm(i),t=fu[e];if(!t)return null;const n=t.clone();return n.traverse(s=>{s.isMesh&&(s.material=s.material.clone(),s.material.transparent=!0,s.material.opacity=0)}),n}function nT(){if(!Ql._fallback){const i=new jh(.015,.1,8);i.rotateZ(-Math.PI/2),Ql._fallback=i}return Ql._fallback}function iT(){if(oo)return oo;const i=64,e=document.createElement("canvas");e.width=i,e.height=i;const t=e.getContext("2d"),n=t.createRadialGradient(i/2,i/2,0,i/2,i/2,i/2);return n.addColorStop(0,"rgba(255,255,255,1)"),n.addColorStop(.15,"rgba(255,255,255,0.6)"),n.addColorStop(.4,"rgba(255,255,255,0.12)"),n.addColorStop(1,"rgba(255,255,255,0)"),t.fillStyle=n,t.fillRect(0,0,i,i),oo=new ua(e),oo}const co=new Me;new Me;function Cr(i){i==null&&(i=0);const e=kb;if(i<=e[0].speed)return co.copy(e[0].color);if(i>=e[e.length-1].speed)return co.copy(e[e.length-1].color);for(let t=0;t<e.length-1;t++)if(i<=e[t+1].speed){const n=(i-e[t].speed)/(e[t+1].speed-e[t].speed);return co.copy(e[t].color).lerp(e[t+1].color,n)}return co.copy(e[e.length-1].color)}function sT(i){return i==null?"CRUISE":i>Cf?"CLIMBING":i<-Cf?"DESCENDING":"CRUISE"}function Rf(i,e,t,n,s,r){if(e==null||t==null)return r.copy(i),r;const a=t*Xn,o=e/tm;return r.set(i.x+Math.sin(a)*o*s,i.y+(n||0)*Xi/1e3*du*s,i.z-Math.cos(a)*o*s),r}function rT(i,e,t){const n=Math.cos(e*Xn),s=(i.longitude-t)*ha*n,r=-(i.latitude-e)*ha,a=i.baroAltitude*Xi/1e3*du;return new P(s,a,r)}function aT(i,e,t){const n=Math.cos(e*Xn),s=(i.longitude-t)*ha*n,r=-(i.latitude-e)*ha,a=i.baroAltitude!=null?i.baroAltitude*Xi/1e3*du:0;return new P(s,a,r)}class oT{constructor(e,t,n){this.scene=e,this.userLat=t,this.userLon=n,this.aircraft=new Map,this.raycasterTargets=[],this._highlightSet=null}updateUserLocation(e,t){this.userLat=e,this.userLon=t}update(e){const t=new Set;for(const n of e){t.add(n.icao24);const s=rT(n,this.userLat,this.userLon);if(this.aircraft.has(n.icao24))this.aircraft.get(n.icao24).setTarget(s,n);else try{const r=new lT(n,s,this.scene,this.userLat,this.userLon);this.aircraft.set(n.icao24,r),this.raycasterTargets.push(r.hitMesh),this.raycasterTargets.push(r.labelSprite)}catch(r){console.error("[STRATUM] Failed to create aircraft:",n.icao24,r)}}for(const[n,s]of this.aircraft)t.has(n)||s.startFadeOut();for(const[n,s]of this.aircraft)if(s.removed){s.dispose(this.scene),this.aircraft.delete(n);const r=this.raycasterTargets.indexOf(s.hitMesh);r!==-1&&this.raycasterTargets.splice(r,1);const a=this.raycasterTargets.indexOf(s.labelSprite);a!==-1&&this.raycasterTargets.splice(a,1)}}animate(e,t){for(const n of this.aircraft.values())n.animate(e,t,this._highlightSet)}setHighlight(e){this._highlightSet=e}clearHighlight(){this._highlightSet=null}clearAll(e){for(const t of this.aircraft.values())t.dispose(e);this.aircraft.clear(),this.raycasterTargets.length=0,this._highlightSet=null,this._selectedAc=null}getByHitMesh(e){for(const t of this.aircraft.values())if(t.hitMesh===e||t.labelSprite===e)return t;return null}getCount(){let e=0;for(const t of this.aircraft.values())t.fadingOut||e++;return e}getByIcao(e){return this.aircraft.get(e)||null}selectAircraft(e){if(this.deselectAircraft(),!e)return;this._selectedAc=e;const t=new qs(.18,.22,48),n=new yt({color:5942527,transparent:!0,opacity:.7,side:At,depthWrite:!1,blending:Cn});this._selRing=new st(t,n),this._selRing.rotation.x=-Math.PI/2,e.group.add(this._selRing),this._selRingMat=n,this._createPredictionLine(e)}_createPredictionLine(e){this._removePredictionLine();const t=e.data;if(t.trueTrack==null||t.velocity==null)return;const n=t.velocity*60/tm,s=Math.min(n,12);if(s<.3)return;const r=24,a=[];for(let h=0;h<=r;h++){const u=h/r;a.push(u*s,0,0)}const o=new et;o.setAttribute("position",new ze(a,3));const l=new nh({color:5942527,transparent:!0,opacity:.3,dashSize:.15,gapSize:.1,depthWrite:!1,fog:!1}),c=new Yo(o,l);c.computeLineDistances(),e.group.add(c),this._predLine=c,this._predLineMat=l}_removePredictionLine(){this._predLine&&this._selectedAc&&(this._selectedAc.group.remove(this._predLine),this._predLine.geometry.dispose(),this._predLineMat.dispose()),this._predLine=null,this._predLineMat=null}deselectAircraft(){this._removePredictionLine(),this._selRing&&this._selectedAc&&(this._selectedAc.group.remove(this._selRing),this._selRing.geometry.dispose(),this._selRingMat.dispose()),this._selRing=null,this._selRingMat=null,this._selectedAc=null}animateSelection(e){if(this._selRing&&this._selRingMat){const t=.5+.4*Math.sin(e*3);this._selRingMat.opacity=t;const n=1+.15*Math.sin(e*2);this._selRing.scale.set(n,n,1)}this._predLineMat&&(this._predLineMat.opacity=.15+.15*Math.sin(e*2)),this._selectedAc&&e-(this._lastPredRebuild||0)>5&&(this._lastPredRebuild=e,this._createPredictionLine(this._selectedAc))}search(e,t=6){const n=[],s=e.toUpperCase();for(const r of this.aircraft.values()){if(r.fadingOut)continue;const a=r.data,o=(a.callsign||"").toUpperCase(),l=(a.registration||"").toUpperCase(),c=(a.aircraftType||"").toUpperCase(),h=(a.icao24||"").toUpperCase();if((o.includes(s)||l.includes(s)||c.includes(s)||h.includes(s))&&(n.push(r),n.length>=t))break}return n}}class lT{constructor(e,t,n,s,r){this.data=e,this.scene=n,this.userLat=s,this.userLon=r,this.lastApiPos=t.clone(),this.lastApiTime=performance.now()/1e3,this._extrapolatedPos=new P,this.fadingIn=!0,this.fadingOut=!1,this.removed=!1,this.fadeProgress=0,this._createdAt=Date.now(),this.trailPositions=[],this.lastTrailSampleTime=0,this.masterOpacity=0,this.hasRealTrack=!1,this._appliedTrackVersion=0,this._lastTrackCheckTime=0,this._liveStartIndex=0,this._gaps=[],this.group=new Pn,this.group.position.copy(t),this.group.renderOrder=1e3;const a=Cr(e.velocity);this._modelGroup=null,this._useGLB=!1,this._modelMeshes=[];const o=tT(e.aircraftType);if(o)this._modelGroup=o,this._useGLB=!0,this.group.add(o),o.traverse(_=>{_.isMesh&&this._modelMeshes.push(_)}),this._setModelColor(a);else{this.bodyMat=new r_({color:a,emissive:a,emissiveIntensity:1.5,transparent:!0,opacity:0}),this.bodyMesh=new st(nT(),this.bodyMat),this.group.add(this.bodyMesh);const _=lm(e.aircraftType);cm(_).then(()=>{const p=fu[_];if(p&&!this.removed){const m=p.clone();m.traverse(M=>{M.isMesh&&(M.material=M.material.clone(),M.material.transparent=!0,M.material.opacity=this.masterOpacity)}),this.group.remove(this.bodyMesh),this._modelGroup=m,this._useGLB=!0,this._modelMeshes=[],m.traverse(M=>{M.isMesh&&this._modelMeshes.push(M)}),this.group.add(m),this._lastColorR=-1,this._setModelColor(Cr(this.data.velocity))}})}this.labelSprite=this._createInfoLabel(e),this.labelSprite.position.set(0,.18,0),this.group.add(this.labelSprite);const l=new fa(2,8,8),c=new yt({visible:!1});this.hitMesh=new st(l,c),this.hitMesh.userData.icao24=e.icao24,this.group.add(this.hitMesh);const h=iT(),u=fh*.6;this._navLights=[];const d=new Ps(new Gi({map:h,color:16720435,transparent:!0,opacity:0,depthWrite:!1,blending:Cn}));d.scale.set(.06,.06,1),d.position.set(0,0,u),this.group.add(d),this._navLights.push(d);const f=new Ps(new Gi({map:h,color:2293572,transparent:!0,opacity:0,depthWrite:!1,blending:Cn}));f.scale.set(.06,.06,1),f.position.set(0,0,-u),this.group.add(f),this._navLights.push(f);const g=new Ps(new Gi({map:h,color:16777215,transparent:!0,opacity:0,depthWrite:!1,blending:Cn}));g.scale.set(.04,.04,1),g.position.set(-fh*.4,.02,0),this.group.add(g),this._navLights.push(g),this._tailStrobe=g,this._bodyGlowMat=new Gi({map:h,color:new Me(a.r,a.g,a.b),transparent:!0,opacity:0,depthWrite:!1,blending:Cn}),this._bodyGlow=new Ps(this._bodyGlowMat),this._bodyGlow.scale.set(.45,.45,1),this._bodyGlow.position.set(0,.01,0),this.group.add(this._bodyGlow),e.trueTrack!=null&&(this.group.rotation.y=-Math.PI/2-e.trueTrack*Xn),this.trailLine=null,this._trailDirty=!1,this._lastTrailRebuildTime=0,this.trailLineMat=new cu({color:16777215,linewidth:1.5,vertexColors:!0,transparent:!0,opacity:0,depthWrite:!1,depthTest:!1,alphaToCoverage:!0,resolution:nm}),this._dropPosArray=new Float32Array(6),this.dropGeometry=new et,this.dropGeometry.setAttribute("position",new Yt(this._dropPosArray,3)),this.dropMaterial=new nh({color:3828383,transparent:!0,opacity:0,dashSize:.15,gapSize:.25,depthTest:!1,depthWrite:!1}),this.dropLine=new qi(this.dropGeometry,this.dropMaterial),this.dropLine.renderOrder=998,this.dropLine.computeLineDistances(),this._gapLine=null,this.updateDropLine(t),n.add(this.dropLine),n.add(this.group),this._initTrail(t,e),this.rebuildTrail(),e.icao24}_initTrail(e,t){const n=Af(t.icao24);n&&n.length>1?(this._applyRealTrack(n),this._appliedTrackVersion=wf(t.icao24)||Date.now()):this.trailPositions.push({pos:e.clone(),speed:t.velocity}),this._liveStartIndex=this.trailPositions.length}_applyRealTrack(e){const n=Math.floor(Date.now()/1e3)-1800;let s;const r=e.filter(h=>h.time>=n);r.length<2?s=e.slice(-400):s=r;const a=30,o=[];for(let h=0;h<s.length;h++){const u=s[h];let d=null,f=!1;if(h>0){const g=s[h-1],_=u.time-g.time;if(_>a&&(f=!0),_>0){const p=(u.latitude-g.latitude)*111e3,m=(u.longitude-g.longitude)*111e3*Math.cos(u.latitude*Xn);d=Math.sqrt(p*p+m*m)/_}}o.push({pos:aT(u,this.userLat,this.userLon),speed:d,isGapStart:f})}const l=[[]];for(const h of o)h.isGapStart&&l[l.length-1].length>0&&l.push([]),l[l.length-1].push(h);this._gaps=[];for(let h=1;h<l.length;h++){const u=l[h-1],d=l[h];u.length>0&&d.length>0&&this._gaps.push({from:u[u.length-1].pos.clone(),to:d[0].pos.clone()})}const c=4;for(const h of l){if(h.length<2){for(const d of h)this.trailPositions.push(d);continue}const u=h.length;for(let d=0;d<u-1;d++){const f=h[Math.max(d-1,0)].pos,g=h[d].pos,_=h[d+1].pos,p=h[Math.min(d+2,u-1)].pos,m=h[d].speed,M=h[d+1].speed;for(let y=0;y<c;y++){const S=y/c,w=S*S,T=w*S,L=.5*(2*g.x+(-f.x+_.x)*S+(2*f.x-5*g.x+4*_.x-p.x)*w+(-f.x+3*g.x-3*_.x+p.x)*T),x=.5*(2*g.y+(-f.y+_.y)*S+(2*f.y-5*g.y+4*_.y-p.y)*w+(-f.y+3*g.y-3*_.y+p.y)*T),E=.5*(2*g.z+(-f.z+_.z)*S+(2*f.z-5*g.z+4*_.z-p.z)*w+(-f.z+3*g.z-3*_.z+p.z)*T),N=m!=null&&M!=null?m*(1-S)+M*S:m||M;this.trailPositions.push({pos:new P(L,x,E),speed:N})}}this.trailPositions.push(h[u-1])}this.hasRealTrack=!0}_synthesizeBackTrail(e,t){if(t.velocity==null||t.trueTrack==null){this.trailPositions.push({pos:e.clone(),speed:t.velocity});return}for(let n=Gb;n>=0;n-=Vb)this.trailPositions.push({pos:Rf(e,t.velocity,t.trueTrack,t.verticalRate||0,-n),speed:t.velocity});this.trailPositions.push({pos:e.clone(),speed:t.velocity})}_createInfoLabel(e){const t=document.createElement("canvas");t.width=1024,t.height=256,this._labelCanvas=t,this._labelCtx=t.getContext("2d"),this._labelDirty=!1,this._lastLabelUpdate=0,this._drawInfoLabel(e);const n=new ua(t);n.minFilter=_t,n.magFilter=_t,n.anisotropy=4;const s=new Gi({map:n,transparent:!0,opacity:0,depthWrite:!1,sizeAttenuation:!0});this._labelMat=s;const r=new Ps(s);return r.scale.set(2.2,.55,1),r}_drawInfoLabel(e){const t=this._labelCtx,n=this._labelCanvas.width,s=this._labelCanvas.height;t.clearRect(0,0,n,s);const r=e.baroAltitude!=null?Math.round(e.baroAltitude*Xi):null,a=e.velocity!=null?Math.round(e.velocity*1.94384):null,o=e.trueTrack!=null?Math.round(e.trueTrack):null,l=e.verticalRate!=null?Math.round(e.verticalRate*Xi*60):null;t.font="bold 44px JetBrains Mono, monospace",t.fillStyle="#ffffff",t.textAlign="left";let c=e.callsign||e.icao24;e.registration&&e.registration!==c&&(c+=` ${e.registration}`),e.aircraftType&&(c+=` ${e.aircraftType}`),t.fillText(c,16,52),t.font="38px JetBrains Mono, monospace",t.fillStyle="rgba(180,210,255,0.9)";let h="";const u=Tf(e.callsign),d=e.origin||u&&u.origin||null,f=e.destination||u&&u.destination||null;if((d||f)&&(h+=`${d||"?"}→${f||"?"} `),r!=null&&(h+=r>=18e3?`FL${String(Math.round(r/100)).padStart(3,"0")}`:`${r.toLocaleString()}ft`),a!=null&&(h+=` ${a}kt`),o!=null&&(h+=` ${String(o).padStart(3,"0")}°`),t.fillText(h,16,112),l!=null&&Math.abs(l)>100){t.font="38px JetBrains Mono, monospace";const g=l>0?"↑":"↓";t.fillStyle=l>0?"#ff9d4d":"#4db8ff",t.fillText(`${g}${Math.abs(l).toLocaleString()} fpm`,16,168)}}_refreshInfoLabel(){this._drawInfoLabel(this.data),this._labelMat.map.needsUpdate=!0,this._labelDirty=!1}_setModelOpacity(e){if(this._useGLB&&this._modelMeshes.length>0)for(const t of this._modelMeshes)t.material.opacity=e;else this.bodyMat&&(this.bodyMat.opacity=e)}_setModelColor(e){if(!(this._lastColorR===e.r&&this._lastColorG===e.g&&this._lastColorB===e.b))if(this._lastColorR=e.r,this._lastColorG=e.g,this._lastColorB=e.b,this._useGLB&&this._modelMeshes.length>0)for(const t of this._modelMeshes)t.material.emissive=t.material.emissive||new Me,t.material.emissive.copy(e),t.material.emissiveIntensity=1.5,t.material.color.copy(e);else this.bodyMat&&(this.bodyMat.color.copy(e),this.bodyMat.emissive.copy(e))}setTarget(e,t){this.lastApiPos.copy(e),this.lastApiTime=performance.now()/1e3,this.data=t;const n=Cr(t.velocity);this._setModelColor(n),this._labelDirty=!0}_getExtrapolatedTarget(){const t=performance.now()/1e3-this.lastApiTime;return Rf(this.lastApiPos,this.data.velocity,this.data.trueTrack,this.data.verticalRate,t,this._extrapolatedPos)}_checkForTrackUpdate(e){const t=this.hasRealTrack?Xb:Kb;if(e-this._lastTrackCheckTime<t)return;this._lastTrackCheckTime=e;const n=wf(this.data.icao24);if(!n||n<=this._appliedTrackVersion)return;const s=Af(this.data.icao24);if(!s||s.length<2)return;this.trailPositions=[],this._applyRealTrack(s),this._appliedTrackVersion=n;const r=this.trailPositions.length,a=[];for(const o of a)this.trailPositions.push(o);if(this._liveStartIndex=r,this.trailPositions.length>ao){const o=this.trailPositions.length-ao;this.trailPositions.splice(0,o),this._liveStartIndex=Math.max(0,this._liveStartIndex-o)}this._trailDirty=!0}sampleTrailPoint(e,t){if(this.trailPositions.push({pos:e.clone(),speed:t}),this.trailPositions.length>ao){const n=this.trailPositions.length-ao;this.trailPositions.splice(0,n),this._liveStartIndex=Math.max(0,this._liveStartIndex-n)}this._trailDirty=!0}rebuildTrail(){const e=this.trailPositions;if(e.length<2)return;if(!this.hasRealTrack&&e.length<60){this.trailLine&&(this.trailLine.visible=!1);return}this.trailLine&&(this.trailLine.visible=!0);let t;if(e.length>600){t=[];const y=Math.max(Math.floor(e.length/400),1);for(let S=0;S<e.length-1;S+=y)t.push(e[S]);t.push(e[e.length-1])}else t=e;const n=t.length,s=new Array(n),r=this.hasRealTrack?2:5;for(let y=0;y<n;y++){let S=0,w=0,T=0,L=0,x=0;for(let E=Math.max(0,y-r);E<=Math.min(n-1,y+r);E++)S+=t[E].pos.x,w+=t[E].pos.y,T+=t[E].pos.z,t[E].speed!=null&&(L+=t[E].speed),x++;s[y]={pos:new P(S/x,w/x,T/x),speed:L/x}}s[0]=t[0],s[n-1]=t[n-1];let a=new Float64Array(s.length),o=new Float64Array(s.length),l=new Float64Array(s.length),c=new Float64Array(s.length);for(let y=0;y<s.length;y++)a[y]=s[y].pos.x,o[y]=s[y].pos.y,l[y]=s[y].pos.z,c[y]=s[y].speed||0;const h=this.hasRealTrack?2:4;for(let y=0;y<h;y++){const S=a.length;if(S<3||S>3e3)break;const w=(S-1)*2+2,T=new Float64Array(w),L=new Float64Array(w),x=new Float64Array(w),E=new Float64Array(w);T[0]=a[0],L[0]=o[0],x[0]=l[0],E[0]=c[0];for(let C=0;C<S-1;C++){const O=(c[C]+c[C+1])/2,F=C*2+1;T[F]=a[C]*.75+a[C+1]*.25,L[F]=o[C]*.75+o[C+1]*.25,x[F]=l[C]*.75+l[C+1]*.25,E[F]=O,T[F+1]=a[C]*.25+a[C+1]*.75,L[F+1]=o[C]*.25+o[C+1]*.75,x[F+1]=l[C]*.25+l[C+1]*.75,E[F+1]=O}const N=w-1;T[N]=a[S-1],L[N]=o[S-1],x[N]=l[S-1],E[N]=c[S-1],a=T,o=L,l=x,c=E}const u=[];for(let y=0;y<a.length;y++)u.push({pos:new P(a[y],o[y],l[y]),speed:c[y]});const d=u.map(y=>({x:y.pos.x,y:y.pos.y,z:y.pos.z,speed:y.speed})),f=d.length,g=Math.max(Math.floor(f*.06),3),_=new Float32Array(f);for(let y=0;y<f;y++){let S=0,w=0;for(let T=Math.max(0,y-g);T<=Math.min(f-1,y+g);T++)d[T].speed!=null&&(S+=d[T].speed,w++);_[y]=w>0?S/w:0}const p=new Float32Array(f*3),m=new Float32Array(f*3);for(let y=0;y<f;y++){const S=d[y],w=y*3;p[w]=S.x,p[w+1]=S.y,p[w+2]=S.z;const T=y/(f-1),L=.05+.95*(T*T*(3-2*T)),x=Cr(_[y]);m[w]=x.r*L,m[w+1]=x.g*L,m[w+2]=x.b*L}this.trailLine&&(this.scene.remove(this.trailLine),this.trailLine.geometry.dispose());const M=new Yp;M.setPositions(p),M.setColors(m),this.trailLine=new BE(M,this.trailLineMat),this.trailLine.computeLineDistances(),this.trailLine.renderOrder=999,this.trailLine.frustumCulled=!1,this.scene.add(this.trailLine),this._rebuildGapLines()}_rebuildGapLines(){if(this._gapLine&&(this.scene.remove(this._gapLine),this._gapLine.geometry.dispose(),this._gapLine.material.dispose(),this._gapLine=null),!this._gaps||this._gaps.length===0)return;const e=[];for(const s of this._gaps)e.push(s.from.x,s.from.y,s.from.z),e.push(s.to.x,s.to.y,s.to.z);const t=new et;t.setAttribute("position",new ze(e,3));const n=new nh({color:6715272,transparent:!0,opacity:.3,dashSize:.15,gapSize:.2,depthTest:!1,depthWrite:!1});this._gapLine=new qi(t,n),this._gapLine.computeLineDistances(),this._gapLine.renderOrder=998,this._gapLine.frustumCulled=!1,this.scene.add(this._gapLine)}updateDropLine(e){const t=this._dropPosArray;t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.x,t[4]=0,t[5]=e.z,this.dropGeometry.getAttribute("position").needsUpdate=!0}startFadeOut(){this.fadingOut||(this.fadingOut=!0,this.fadeProgress=1)}animate(e,t,n){if(this.fadingIn&&(this.fadeProgress=Math.min(this.fadeProgress+e*1.2,1),this.fadeProgress>=1&&(this.fadingIn=!1)),this.fadingOut&&(this.fadeProgress=Math.max(this.fadeProgress-e*.6,0),this.fadeProgress<=0)){this.removed=!0;return}n&&!n.has(this.data.icao24)?this.masterOpacity=this.fadeProgress*.08:this.masterOpacity=this.fadeProgress,this._setModelOpacity(this.masterOpacity),this._labelMat.opacity=this.masterOpacity*.75,this.trailLineMat.opacity=this.masterOpacity*.85,this.dropMaterial.opacity=this.masterOpacity*.15,this._gapLine&&(this._gapLine.material.opacity=this.masterOpacity*.3);for(const a of this._navLights)a.material.opacity=this.masterOpacity*.8;if(this._tailStrobe){const a=(t*1.2+this.data.icao24.charCodeAt(0)*.1)%1;this._tailStrobe.material.opacity=a<.1?this.masterOpacity:0}const s=Cr(this.data.velocity);this._setModelColor(s),this._bodyGlow&&(this._bodyGlowMat.opacity=this.masterOpacity*.6,this._bodyGlowMat.color.copy(s));const r=this._getExtrapolatedTarget();if(this.group.position.lerp(r,Math.min(e*3,.3)),this.data.trueTrack!=null){const a=-Math.PI/2-this.data.trueTrack*Xn;let o=a-this.group.rotation.y;for(;o>Math.PI;)o-=Math.PI*2;for(;o<-Math.PI;)o+=Math.PI*2;Math.abs(o)<.005?this.group.rotation.y=a:this.group.rotation.y+=o*Math.min(e*3,.25)}this._checkForTrackUpdate(t),t-this.lastTrailSampleTime>=Hb&&(this.lastTrailSampleTime=t,this.sampleTrailPoint(this.group.position,this.data.velocity)),this._trailDirty&&t-this._lastTrailRebuildTime>=Wb&&(this._lastTrailRebuildTime=t,this._trailDirty=!1,this.rebuildTrail()),this._labelDirty&&t-this._lastLabelUpdate>=Yb&&(this._lastLabelUpdate=t,this._refreshInfoLabel()),this.updateDropLine(this.group.position)}dispose(e){e.remove(this.group),this.trailLine&&(e.remove(this.trailLine),this.trailLine.geometry.dispose()),this.trailLineMat.dispose(),e.remove(this.dropLine),this.dropGeometry.dispose(),this.dropMaterial.dispose(),this._gapLine&&(e.remove(this._gapLine),this._gapLine.geometry.dispose(),this._gapLine.material.dispose()),this._useGLB&&this._modelGroup?this._modelGroup.traverse(t=>{t.isMesh&&(t.material.map&&t.material.map.dispose(),t.material.dispose(),t.geometry&&t.geometry.dispose())}):this.bodyMat&&this.bodyMat.dispose(),this._labelMat&&(this._labelMat.map&&this._labelMat.map.dispose(),this._labelMat.dispose());for(const t of this._navLights)t.material.dispose();this._bodyGlowMat&&this._bodyGlowMat.dispose()}getDisplayData(){const e=this.data.baroAltitude!=null?Math.round(this.data.baroAltitude*Xi):null,t=this.data.velocity!=null?Math.round(this.data.velocity*zb):null,n=this.data.verticalRate!=null?Math.round(this.data.verticalRate*Xi*60):null,s=this.data.trueTrack!=null?Math.round(this.data.trueTrack):null,r=Fb(this.data.aircraftType),a=Math.floor((Date.now()-this._createdAt)/6e4),o=Bb(this.data.icao24),l=this.data.year||null;let c=null;l&&(c=new Date().getFullYear()-l);const h=this.data.operator||o&&o.operator||null,u=Tf(this.data.callsign),d=this.data.origin||u&&u.origin||null,f=this.data.destination||u&&u.destination||null,g=u&&u.originCity||null,_=u&&u.destCity||null;return{callsign:this.data.callsign||this.data.icao24,icao24:this.data.icao24,originCountry:this.data.originCountry||"--",aircraftType:this.data.aircraftType||null,registration:this.data.registration||null,origin:d,destination:f,originCity:g,destCity:_,altitude:e!=null?`${e.toLocaleString()} ft`:"--",speed:t!=null?`${t} km/h`:"--",heading:s!=null?`${String(s).padStart(3,"0")}  ${cT(s)}`:"--",verticalSpeed:n!=null?`${n>0?"+":""}${n} ft/min`:"--",status:sT(this.data.verticalRate),latitude:this.data.latitude,longitude:this.data.longitude,specs:r,trackedTime:a<1?"Just now":a<60?`${a}m`:`${Math.floor(a/60)}h ${a%60}m`,operator:h,year:l,age:c,typeDesc:this.data.typeDesc||o&&o.typeName||null,_rawAlt:this.data.baroAltitude,_rawSpd:this.data.velocity}}}function cT(i){return["N","NE","E","SE","S","SW","W","NW"][Math.round(i/45)%8]}function hT(i,e,t,n){const r=(t-i)*Xn,a=(n-e)*Xn,o=Math.sin(r/2)**2+Math.cos(i*Xn)*Math.cos(t*Xn)*Math.sin(a/2)**2;return 6371*2*Math.atan2(Math.sqrt(o),Math.sqrt(1-o))}const uT=document.getElementById("hud-count"),gh=document.getElementById("hud-location"),Pf=document.getElementById("hud-updated"),Lf=document.getElementById("hud-airports"),dT=document.querySelector(".hud-live-text"),Df=document.querySelector(".hud-live-dot");let _h=null;function um(i,e){_h=e?`${e}  ·  ${i}`:i,gh&&(gh.textContent=_h)}let ho=0,ko=0,Ho=null;function dm(){if(ho===ko){Ho=null;return}const i=ko-ho,e=Math.ceil(Math.abs(i)*.2)||1;ho+=i>0?Math.min(e,i):-Math.min(e,-i),uT.textContent=ho,Ho=requestAnimationFrame(dm)}function fm(i,e,t){i!==ko&&(ko=i,Ho||(Ho=requestAnimationFrame(dm))),_h||(gh.textContent=`${e.toFixed(4)}N  ${t.toFixed(4)}${t>=0?"E":"W"}`),dT.textContent="LIVE",Df.style.background="",Df.style.boxShadow=""}function xh(i){Lf&&(Lf.textContent=i>0?i:"--")}function fT(){const i=Nb();if(!i){Pf.textContent="Connecting...";return}const e=Math.floor((Date.now()-i)/1e3);Pf.textContent=e<2?"Just now":`${e}s ago`}function pm(i){const e=document.getElementById("signal-lost");if(i){e.classList.remove("hidden");const t=document.getElementById("signal-lost-retry"),n=Ub();t.textContent=`Retrying every ${Math.ceil(n/1e3)}s...`}else e.classList.add("hidden")}const mm=document.getElementById("detail-panel"),pT=document.getElementById("detail-callsign"),ec=document.getElementById("detail-type"),mT=document.getElementById("detail-alt"),gT=document.getElementById("detail-spd"),_T=document.getElementById("detail-hdg"),uo=document.getElementById("detail-vs"),xT=document.getElementById("detail-icao"),vT=document.getElementById("detail-reg"),If=document.getElementById("detail-distance"),Nf=document.getElementById("detail-status"),MT=document.getElementById("detail-close"),Uf=document.getElementById("detail-operator-row"),yT=document.getElementById("detail-operator"),Of=document.getElementById("detail-age-row"),ST=document.getElementById("detail-age"),tc=document.getElementById("detail-radio"),Ff=document.getElementById("detail-specs"),Bf=document.getElementById("detail-specs-divider"),ET=document.getElementById("detail-aircraft-name"),bT=document.getElementById("detail-mfr"),TT=document.getElementById("detail-pax"),AT=document.getElementById("detail-range"),wT=document.getElementById("detail-tracked");let Yr=null;MT.addEventListener("click",()=>tr());function fo(i,e){i.textContent!==e&&(i.textContent=e,i.classList.remove("flash"),i.offsetWidth,i.classList.add("flash"),i.addEventListener("animationend",()=>i.classList.remove("flash"),{once:!0}))}function Zo(i,e,t){Yr=i;const n=i.getDisplayData();pT.textContent=n.callsign||n.icao24,n.aircraftType?(ec.textContent=n.aircraftType,ec.style.display=""):ec.style.display="none",fo(mT,n.altitude),fo(gT,n.speed),fo(_T,n.heading);const s=n.verticalSpeed;fo(uo,s),n.status==="CLIMBING"?uo.style.color="var(--climb)":n.status==="DESCENDING"?uo.style.color="var(--descend)":uo.style.color="",xT.textContent=n.icao24||"--",vT.textContent=n.registration||"--",n.operator?(Uf.classList.remove("hidden"),yT.textContent=n.operator):Uf.classList.add("hidden"),n.age!=null?(Of.classList.remove("hidden"),ST.textContent=`${n.year} (${n.age}y)`):Of.classList.add("hidden");const r=n.origin||n.destination;if(r&&r.length>=3?(tc.classList.remove("hidden"),tc.onclick=()=>{window.open(`https://www.liveatc.net/search/?icao=${encodeURIComponent(r)}`,"_blank")}):tc.classList.add("hidden"),n.specs?(Ff.classList.remove("hidden"),Bf.classList.remove("hidden"),ET.textContent=n.specs.name,bT.textContent=n.specs.mfr,TT.textContent=n.specs.cargo?"CARGO":`${n.specs.pax} pax`,AT.textContent=`${n.specs.range.toLocaleString()} nm`,wT.textContent=n.trackedTime):(Ff.classList.add("hidden"),Bf.classList.add("hidden")),n.latitude!=null&&n.longitude!=null){const a=hT(e,t,n.latitude,n.longitude);If.textContent=`${Math.round(a)} km away`}else If.textContent="-- km away";Nf.textContent=n.status,Nf.className="detail-status "+n.status.toLowerCase(),mm.classList.remove("hidden")}function tr(){Yr=null,mm.classList.add("hidden")}function CT(i,e,t){if(Yr){if(Yr.removed){tr();return}Zo(Yr,e,t)}}let Ci=null,Br=null,nc=null,Rr=null,ki=!1,qr=0,zf=!1;function RT(){const i=new Date;return`${String(i.getUTCHours()).padStart(2,"0")}${String(i.getUTCMinutes()).padStart(2,"0")}Z`}function gm(i,e){if(!Ci)return;const t=document.createElement("div");t.className="neko-row";const n=document.createElement("span");n.className="neko-zulu",n.textContent=RT();const s=document.createElement("span");s.className=i==="SYS"?"neko-cs neko-cs--sys":"neko-cs",s.textContent=i.slice(0,8);const r=document.createElement("span");r.className="neko-text",r.textContent=e,t.appendChild(n),t.appendChild(s),t.appendChild(r),Ci.appendChild(t),requestAnimationFrame(()=>{t.classList.add("squelch"),Ci.scrollTo({top:Ci.scrollHeight,behavior:"smooth"})}),setTimeout(()=>t.classList.remove("squelch"),700),ki||(qr++,_m())}function _m(){Br&&(qr>0?(Br.textContent=qr>9?"9+":String(qr),Br.classList.remove("hidden")):Br.classList.add("hidden"))}function PT(){zf||(zf=!0,Ci=document.getElementById("neko-log"),Br=document.getElementById("neko-badge"),nc=document.getElementById("neko-panel"),Rr=document.getElementById("neko-toggle"),!(!Rr||!nc)&&(Rr.addEventListener("click",()=>{ki=!ki,nc.classList.toggle("open",ki),Rr.classList.toggle("active",ki),Rr.setAttribute("aria-expanded",String(ki)),ki&&(qr=0,_m(),requestAnimationFrame(()=>{Ci&&(Ci.scrollTop=Ci.scrollHeight)}))}),setTimeout(()=>gm("CTR","Guard frequency 121.500 active. All stations, monitoring."),2e3)))}function LT(i){if(!i)return;const e=(i.callsign||i.icao24||"UNKNWN").trim(),t=i._rawAlt,n=i.status,s=i.originCity||i.origin,r=i.destCity||i.destination;let a;if(s&&r){const o=t!=null?`, ${i.altitude}`:"";a=`Radar contact. ${s} / ${r}${o}.`}else if(t!=null&&t<900&&t>10)a=`Low altitude. ${i.altitude}. Traffic alert.`;else if(n==="CLIMBING")a=`Climbing through ${i.altitude}, ${i.verticalSpeed}.`;else if(n==="DESCENDING")a=`Descending through ${i.altitude}, ${i.verticalSpeed}.`;else{const o=i.speed!=="--"?`, ${i.speed}`:"";a=`Radar contact. ${i.altitude!=="--"?i.altitude:"alt unknown"}${o}.`}gm(e,a)}const DT={name:"CinematicShader",uniforms:{tDiffuse:{value:null},time:{value:0},resolution:{value:new j}},vertexShader:`
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
  `},Kn=document.getElementById("scene"),ts=new VS({canvas:Kn,antialias:!0,alpha:!1});ts.setPixelRatio(Math.min(window.devicePixelRatio,2));ts.setSize(window.innerWidth,window.innerHeight);ts.setClearColor(592140,1);ts.toneMapping=Wo;ts.toneMappingExposure=1.4;const Ht=new r0;Ht.fog=new Ko(592140,.008);const dr=new lE(ts),xm=new cE(Ht,null);dr.addPass(xm);const vm=new Qs(new j(window.innerWidth*.5,window.innerHeight*.5),.65,.4,.82);dr.addPass(vm);const Qo=new kp(DT);Qo.uniforms.resolution.value.set(window.innerWidth,window.innerHeight);dr.addPass(Qo);dr.addPass(new uE);const Rt=new $t(50,window.innerWidth/window.innerHeight,.1,200);Rt.position.set(0,35,.1);Rt.lookAt(0,0,0);xm.camera=Rt;const mt=new XS(Rt,Kn);mt.enableDamping=!0;mt.dampingFactor=.09;mt.target.set(0,0,0);mt.minDistance=.05;mt.maxDistance=60;mt.maxPolarAngle=Math.PI/2-20*Math.PI/180;mt.autoRotate=!1;mt.autoRotateSpeed=.3;mt.enabled=!1;let Mm=!0;const IT=performance.now(),kf=3200,un={x:0,y:35,z:.1,tx:0,ty:0,tz:0},Cs={x:8,y:9,z:12,tx:0,ty:1,tz:0};function NT(i){return i>=1?1:1-Math.pow(2,-10*i)}function ic(i,e,t,n,s){n=Math.max(1e-4,n);const r=2/n,a=r*s,o=1/(1+a+.48*a*a+.235*a*a*a),l=i-e,c=(t+r*l)*s,h=(t-r*c)*o;return{value:e+(l+c)*o,vel:h}}function Hf(i,e,t,n,s){const r=ic(i.x,e.x,t.x,n,s),a=ic(i.y,e.y,t.y,n,s),o=ic(i.z,e.z,t.z,n,s);t.set(r.vel,a.vel,o.vel),i.set(r.value,a.value,o.value)}function UT(){const i=performance.now()-IT,e=NT(Math.min(i/kf,1));Rt.position.set(un.x+(Cs.x-un.x)*e,un.y+(Cs.y-un.y)*e,un.z+(Cs.z-un.z)*e),mt.target.set(un.tx+(Cs.tx-un.tx)*e,un.ty+(Cs.ty-un.ty)*e,un.tz+(Cs.tz-un.tz)*e),mt.update(),i>=kf&&(Mm=!1,mt.enabled=!0)}const OT=7,FT=.28,BT=.45;document.getElementById("speed-lines");let Ri=null,ym=new P,wo=new P,Sm=null,Go=!1;const nr=document.getElementById("follow-indicator"),zT=document.getElementById("follow-callsign");function pu(i){if(Ri=i,ym.set(0,0,0),wo.set(0,0,0),Go=!0,mt.saveState(),mt.reset(),Sm=new P().subVectors(Rt.position,i.group.position).normalize(),nr){const e=i.getDisplayData();zT.textContent=e.callsign||e.icao24,nr.classList.remove("hidden")}}function fr(){Ri=null,Go=!1,nr&&nr.classList.add("hidden")}const Gf=new P,Vf=new P,sc=new P;function kT(i){if(!Ri||Ri.removed){fr();return}const e=Ri.group.position;Gf.copy(mt.target),Hf(mt.target,e,ym,FT,i),Vf.subVectors(mt.target,Gf),Go?(sc.copy(e).addScaledVector(Sm,OT),Hf(Rt.position,sc,wo,BT,i),wo.lengthSq()<4e-4&&(Rt.position.copy(sc),wo.set(0,0,0),Go=!1)):Rt.position.add(Vf),mt.update()}const Wf=document.getElementById("compass-needle"),Xf=document.getElementById("compass-heading");let Kf=0;const rc=new P;function HT(){Rt.getWorldDirection(rc),Kf=Math.atan2(rc.x,rc.z);const i=(-Kf*180/Math.PI+360)%360;Wf&&Wf.setAttribute("transform",`rotate(${i}, 30, 30)`),Xf&&(Xf.textContent=`${Math.round(i)}°`)}SE(Ht);const el=400,Em=new et,Co=new Float32Array(el*3),bm=new Float32Array(el);for(let i=0;i<el;i++)Co[i*3]=(Math.random()-.5)*60,Co[i*3+1]=Math.random()*5,Co[i*3+2]=(Math.random()-.5)*60,bm[i]=.02+Math.random()*.06;Em.setAttribute("position",new ze(Co,3));const Tm=new es({color:12886104,size:.03,transparent:!0,opacity:.1,depthWrite:!1,sizeAttenuation:!0}),Vo=new sr(Em,Tm);Vo.renderOrder=2e3;Ht.add(Vo);const mu=1200,gu=new et,Ro=new Float32Array(mu*3),Am=new Float32Array(mu);for(let i=0;i<mu;i++){const e=Math.random()*Math.PI*2,t=Math.acos(2*Math.random()-1),n=80+Math.random()*40;Ro[i*3]=n*Math.sin(t)*Math.cos(e),Ro[i*3+1]=Math.abs(n*Math.cos(t))+5,Ro[i*3+2]=n*Math.sin(t)*Math.sin(e),Am[i]=.3+Math.random()*.7}gu.setAttribute("position",new ze(Ro,3));gu.setAttribute("size",new ze(Am,1));const wm=new es({color:13687024,size:.15,transparent:!0,opacity:.4,depthWrite:!1,sizeAttenuation:!0,fog:!1}),Cm=new sr(gu,wm);Cm.renderOrder=-1;Ht.add(Cm);let Je=null,vh=Date.now();const GT=3e4;function tl(){vh=Date.now(),mt.autoRotate=!1,ns&&ma()}let Rm=0,Pm=0;Kn.addEventListener("pointerdown",i=>{tl(),Rm=i.clientX,Pm=i.clientY});const Ns=document.getElementById("aircraft-tooltip");function VT(i,e,t){if(!Ns)return;const n=i.callsign||i.icao24||"",s=i.aircraftType||"",r=i.altitude&&i.altitude!=="--"?i.altitude:"";let a=`<span class="ttp-cs">${n}</span>`;s&&(a+=`<span class="ttp-sep">·</span><span class="ttp-type">${s}</span>`),r&&(a+=`<span class="ttp-sep">·</span><span class="ttp-alt">${r}</span>`),Ns.innerHTML=a;const o=14;let l=e+o,c=t-40;l+200>window.innerWidth&&(l=e-o-200),c<8&&(c=t+o+4),Ns.style.transform=`translate(${l}px, ${c}px)`,Ns.classList.remove("hidden")}function po(){Ns&&Ns.classList.add("hidden")}const Hs=new V_,ac=new j,Yf=new j;let qf=0;Kn.addEventListener("pointermove",i=>{i.buttons>0&&tl();const e=performance.now();if(e-qf<16)return;if(qf=e,!Je){po();return}Yf.set(i.clientX/window.innerWidth*2-1,-(i.clientY/window.innerHeight)*2+1),Hs.setFromCamera(Yf,Rt);const t=Hs.intersectObjects(Je.raycasterTargets,!1),n=Xp(),s=n.length>0?Hs.intersectObjects(n,!1):[];if(t.length>0){Kn.style.cursor="pointer";const r=Je.getByHitMesh(t[0].object);r?VT(r.getDisplayData(),i.clientX,i.clientY):po()}else s.length>0?(Kn.style.cursor="pointer",po()):(Kn.style.cursor="",po())});Kn.addEventListener("wheel",()=>{tl()},{passive:!0});let wn=null;function Lm(i){const{lat:e,lon:t}=Jo();Zo(i,e,t),Je.selectAircraft(i),pu(i),LT(i.getDisplayData()),Db(i.data.icao24),wn&&(ur(Ht),Je.clearHighlight(),wn=null)}function Dm(i){ac.x=i.clientX/window.innerWidth*2-1,ac.y=-(i.clientY/window.innerHeight)*2+1,Hs.setFromCamera(ac,Rt);const e=Hs.intersectObjects(Je.raycasterTargets,!1);if(e.length===0)return null;for(const t of e){const n=Je.getByHitMesh(t.object);if(n&&n!==Ri)return n}return Je.getByHitMesh(e[0].object)}Kn.addEventListener("click",i=>{if(!Je)return;const e=i.clientX-Rm,t=i.clientY-Pm;if(e*e+t*t>25)return;const n=Dm(i);if(n){Lm(n);return}const s=Xp();if(s.length>0){const r=Hs.intersectObjects(s);if(r.length>0){const a=r[0].object.userData.airport;if(a){tr(),WT(a);return}}}tr(),Je&&Je.deselectAircraft(),fr(),wn&&(ur(Ht),Je.clearHighlight(),wn=null)});Kn.addEventListener("dblclick",i=>{if(!Je)return;i.preventDefault();const e=Dm(i);e&&Lm(e)});function WT(i){const e=lu();if(!e)return;if(wn&&wn.iata===i.iata&&wn.icao===i.icao){ur(Ht),Je.clearHighlight(),wn=null;return}wn=i,LE(Ht,i);const{arrivals:t,departures:n}=yE(Im,i,e.runways),s=new Set([...t.map(a=>a.icao24),...n.map(a=>a.icao24)]);s.size>0?Je.setHighlight(s):Je.clearHighlight();const r=i.iata||i.icao;console.log(`[STRATUM] ${r}: ${t.length} arrivals, ${n.length} departures`)}let Im=[];function XT(i){if(console.log("[STRATUM] Received",i.length,"aircraft"),pm(!1),Im=i,Je){Je.update(i);const{lat:e,lon:t}=Jo();fm(Je.getCount(),e,t),CT(Je,e,t)}}function KT(i,e){console.warn("[STRATUM] Data error:",i.message,`(${e} consecutive)`),e>=3&&pm(!0)}window.addEventListener("resize",()=>{Rt.aspect=window.innerWidth/window.innerHeight,Rt.updateProjectionMatrix(),ts.setSize(window.innerWidth,window.innerHeight),dr.setSize(window.innerWidth,window.innerHeight),vm.resolution.set(window.innerWidth*.5,window.innerHeight*.5),Qo.uniforms.resolution.value.set(window.innerWidth,window.innerHeight)});setInterval(fT,1e3);const oi=new Set,YT=10,qT=2.5,jT=9,$T=6;let ai=0,nl=!1,ns=!1,Po=null;const JT=6e3;function ZT(){ns=!0,fr(),Nm()}function ma(){ns=!1,Po&&(clearTimeout(Po),Po=null),nr&&nr.classList.add("hidden")}function Nm(){if(!ns||!Je)return;const i=[...Je.aircraft.values()].filter(s=>!s.fadingOut);if(i.length===0){ma();return}const e=i[Math.floor(Math.random()*i.length)],{lat:t,lon:n}=Jo();Zo(e,t,n),Je.selectAircraft(e),pu(e),Po=setTimeout(Nm,JT)}const jr=document.getElementById("help-overlay");function Um(){jr&&jr.classList.toggle("hidden")}jr&&jr.addEventListener("click",i=>{i.target===jr&&Um()});document.addEventListener("keydown",i=>{if(document.activeElement.tagName==="INPUT")return;if(i.key==="?"||i.key==="/"&&i.shiftKey){i.preventDefault(),Um();return}if(i.key.toLowerCase()==="t"&&!i.ctrlKey&&!i.metaKey){ns?ma():ZT();return}if(i.key.toLowerCase()==="c"&&!i.ctrlKey&&!i.metaKey){i.preventDefault(),Mh();return}const e=i.key.toLowerCase();"wasdqe".includes(e)&&oi.add(e),i.key==="Shift"&&(nl=!0)});document.addEventListener("keyup",i=>{oi.delete(i.key.toLowerCase()),i.key==="Shift"&&(nl=!1)});window.addEventListener("blur",()=>{oi.clear(),nl=!1});const Rs=new P,oc=new P,Ei=new P;function Om(){return Rt.getWorldDirection(Rs),Rs.y=0,Rs.normalize(),oc.crossVectors(Rs,Rt.up).normalize(),Ei.set(0,0,0),oi.has("w")&&Ei.add(Rs),oi.has("s")&&Ei.sub(Rs),oi.has("d")&&Ei.add(oc),oi.has("a")&&Ei.sub(oc),oi.has("q")&&(Ei.y-=1),oi.has("e")&&(Ei.y+=1),Ei}function jf(i){const e=Om(),t=e.lengthSq()>0;if(t)ai=Math.min(ai+jT*i,1);else if(ai=Math.max(ai-$T*i,0),ai<.001){ai=0;return}tl();const n=Math.max(.2,Math.min(3,Rt.position.y/8)),s=YT*n*(nl?qT:1),r=ai*ai*(3-2*ai);t&&e.normalize();const a=e.multiplyScalar(s*r*i);Rt.position.add(a),mt.target.add(a)}const $f=new W_;function Fm(){requestAnimationFrame(Fm);const i=$f.getDelta(),e=$f.getElapsedTime();Qo.uniforms.time.value=e,Mm?UT():Ri?Om().lengthSq()>0?(fr(),tr(),Je&&Je.deselectAircraft(),jf(i)):(kT(i),vh=Date.now()):(jf(i),Date.now()-vh>GT&&(mt.autoRotate=!0,mt.autoRotateSpeed=.3),mt.update()),DE(Ht,e),HT();const t=Vo.geometry.attributes.position.array;for(let n=0;n<el;n++)t[n*3+1]+=bm[n]*i,t[n*3+1]>5&&(t[n*3+1]=0,t[n*3]=(Math.random()-.5)*60,t[n*3+2]=(Math.random()-.5)*60);Vo.geometry.attributes.position.needsUpdate=!0,Tm.opacity=.06+.04*Math.sin(e*.4),wm.opacity=.3+.14*Math.sin(e*.3),Je&&(Je.animate(i,e),Je.animateSelection(e)),dr.render()}const fn=[{name:"New York",code:"JFK",lat:40.6413,lon:-73.7781,region:"Americas"},{name:"Los Angeles",code:"LAX",lat:33.9425,lon:-118.4081,region:"Americas"},{name:"Chicago",code:"ORD",lat:41.9742,lon:-87.9073,region:"Americas"},{name:"Miami",code:"MIA",lat:25.7959,lon:-80.287,region:"Americas"},{name:"Dallas",code:"DFW",lat:32.8998,lon:-97.0403,region:"Americas"},{name:"Atlanta",code:"ATL",lat:33.6407,lon:-84.4277,region:"Americas"},{name:"San Francisco",code:"SFO",lat:37.6213,lon:-122.379,region:"Americas"},{name:"Seattle",code:"SEA",lat:47.4502,lon:-122.3088,region:"Americas"},{name:"Denver",code:"DEN",lat:39.8561,lon:-104.6737,region:"Americas"},{name:"Boston",code:"BOS",lat:42.3656,lon:-71.0096,region:"Americas"},{name:"Houston",code:"IAH",lat:29.9902,lon:-95.3368,region:"Americas"},{name:"Toronto",code:"YYZ",lat:43.6777,lon:-79.6248,region:"Americas"},{name:"Vancouver",code:"YVR",lat:49.1947,lon:-123.1792,region:"Americas"},{name:"Montreal",code:"YUL",lat:45.4706,lon:-73.7408,region:"Americas"},{name:"Calgary",code:"YYC",lat:51.1314,lon:-114.0125,region:"Americas"},{name:"Mexico City",code:"MEX",lat:19.4363,lon:-99.0721,region:"Americas"},{name:"Cancun",code:"CUN",lat:21.0365,lon:-86.8771,region:"Americas"},{name:"São Paulo",code:"GRU",lat:-23.4356,lon:-46.4731,region:"Americas"},{name:"Rio de Janeiro",code:"GIG",lat:-22.8099,lon:-43.2505,region:"Americas"},{name:"Buenos Aires",code:"EZE",lat:-34.8222,lon:-58.5358,region:"Americas"},{name:"Bogotá",code:"BOG",lat:4.7016,lon:-74.1469,region:"Americas"},{name:"Lima",code:"LIM",lat:-12.0219,lon:-77.1143,region:"Americas"},{name:"Santiago",code:"SCL",lat:-33.393,lon:-70.7858,region:"Americas"},{name:"London",code:"LHR",lat:51.4775,lon:-.4614,region:"Europe"},{name:"Paris",code:"CDG",lat:49.0097,lon:2.5479,region:"Europe"},{name:"Frankfurt",code:"FRA",lat:50.0379,lon:8.5622,region:"Europe"},{name:"Amsterdam",code:"AMS",lat:52.3105,lon:4.7683,region:"Europe"},{name:"Istanbul",code:"IST",lat:41.2608,lon:28.7418,region:"Europe"},{name:"Madrid",code:"MAD",lat:40.4983,lon:-3.5676,region:"Europe"},{name:"Barcelona",code:"BCN",lat:41.2971,lon:2.0785,region:"Europe"},{name:"Rome",code:"FCO",lat:41.8003,lon:12.2389,region:"Europe"},{name:"Milan",code:"MXP",lat:45.6306,lon:8.7281,region:"Europe"},{name:"Munich",code:"MUC",lat:48.3537,lon:11.775,region:"Europe"},{name:"Zurich",code:"ZRH",lat:47.4647,lon:8.5492,region:"Europe"},{name:"Vienna",code:"VIE",lat:48.1103,lon:16.5697,region:"Europe"},{name:"Brussels",code:"BRU",lat:50.9014,lon:4.4844,region:"Europe"},{name:"Copenhagen",code:"CPH",lat:55.6179,lon:12.656,region:"Europe"},{name:"Stockholm",code:"ARN",lat:59.6519,lon:17.9186,region:"Europe"},{name:"Oslo",code:"OSL",lat:60.1939,lon:11.1004,region:"Europe"},{name:"Helsinki",code:"HEL",lat:60.3172,lon:24.9633,region:"Europe"},{name:"Dublin",code:"DUB",lat:53.4213,lon:-6.2701,region:"Europe"},{name:"Lisbon",code:"LIS",lat:38.7742,lon:-9.1342,region:"Europe"},{name:"Athens",code:"ATH",lat:37.9364,lon:23.9445,region:"Europe"},{name:"Warsaw",code:"WAW",lat:52.1657,lon:20.9671,region:"Europe"},{name:"Prague",code:"PRG",lat:50.1008,lon:14.26,region:"Europe"},{name:"Budapest",code:"BUD",lat:47.4369,lon:19.2556,region:"Europe"},{name:"Bucharest",code:"OTP",lat:44.5722,lon:26.1022,region:"Europe"},{name:"Düsseldorf",code:"DUS",lat:51.2895,lon:6.7668,region:"Europe"},{name:"Hamburg",code:"HAM",lat:53.6304,lon:9.9882,region:"Europe"},{name:"Manchester",code:"MAN",lat:53.365,lon:-2.2729,region:"Europe"},{name:"Edinburgh",code:"EDI",lat:55.95,lon:-3.3725,region:"Europe"},{name:"Geneva",code:"GVA",lat:46.238,lon:6.1089,region:"Europe"},{name:"Nice",code:"NCE",lat:43.6584,lon:7.2159,region:"Europe"},{name:"Reykjavik",code:"KEF",lat:63.985,lon:-22.6056,region:"Europe"},{name:"Belgrade",code:"BEG",lat:44.8184,lon:20.3091,region:"Europe"},{name:"Sofia",code:"SOF",lat:42.6967,lon:23.4114,region:"Europe"},{name:"Riga",code:"RIX",lat:56.9236,lon:23.9711,region:"Europe"},{name:"Dubai",code:"DXB",lat:25.2532,lon:55.3657,region:"Middle East"},{name:"Abu Dhabi",code:"AUH",lat:24.433,lon:54.6511,region:"Middle East"},{name:"Doha",code:"DOH",lat:25.2731,lon:51.608,region:"Middle East"},{name:"Riyadh",code:"RUH",lat:24.9576,lon:46.6988,region:"Middle East"},{name:"Kuwait City",code:"KWI",lat:29.2267,lon:47.9689,region:"Middle East"},{name:"Muscat",code:"MCT",lat:23.5933,lon:58.2844,region:"Middle East"},{name:"Tel Aviv",code:"TLV",lat:32.0114,lon:34.8867,region:"Middle East"},{name:"Amman",code:"AMM",lat:31.7226,lon:35.9932,region:"Middle East"},{name:"Johannesburg",code:"JNB",lat:-26.1367,lon:28.2411,region:"Africa"},{name:"Cape Town",code:"CPT",lat:-33.9648,lon:18.6017,region:"Africa"},{name:"Cairo",code:"CAI",lat:30.1219,lon:31.4056,region:"Africa"},{name:"Casablanca",code:"CMN",lat:33.3675,lon:-7.5897,region:"Africa"},{name:"Nairobi",code:"NBO",lat:-1.3192,lon:36.9275,region:"Africa"},{name:"Addis Ababa",code:"ADD",lat:8.9779,lon:38.7993,region:"Africa"},{name:"Lagos",code:"LOS",lat:6.5774,lon:3.3214,region:"Africa"},{name:"Tunis",code:"TUN",lat:36.851,lon:10.2272,region:"Africa"},{name:"Singapore",code:"SIN",lat:1.3644,lon:103.9915,region:"Asia"},{name:"Hong Kong",code:"HKG",lat:22.308,lon:113.9185,region:"Asia"},{name:"Tokyo",code:"HND",lat:35.5493,lon:139.7798,region:"Asia"},{name:"Seoul",code:"ICN",lat:37.4602,lon:126.4407,region:"Asia"},{name:"Bangkok",code:"BKK",lat:13.6811,lon:100.7472,region:"Asia"},{name:"Taipei",code:"TPE",lat:25.0777,lon:121.2328,region:"Asia"},{name:"Kuala Lumpur",code:"KUL",lat:2.7456,lon:101.7099,region:"Asia"},{name:"Manila",code:"MNL",lat:14.5086,lon:121.0197,region:"Asia"},{name:"Jakarta",code:"CGK",lat:-6.1275,lon:106.6558,region:"Asia"},{name:"Osaka",code:"KIX",lat:34.4347,lon:135.244,region:"Asia"},{name:"Fukuoka",code:"FUK",lat:33.5858,lon:130.4511,region:"Asia"},{name:"Mumbai",code:"BOM",lat:19.0896,lon:72.8656,region:"Asia"},{name:"Delhi",code:"DEL",lat:28.5562,lon:77.1,region:"Asia"},{name:"Bangalore",code:"BLR",lat:13.1986,lon:77.7066,region:"Asia"},{name:"Kolkata",code:"CCU",lat:22.6547,lon:88.4467,region:"Asia"},{name:"Chennai",code:"MAA",lat:12.99,lon:80.1693,region:"Asia"},{name:"Colombo",code:"CMB",lat:7.1808,lon:79.8841,region:"Asia"},{name:"Karachi",code:"KHI",lat:24.9065,lon:67.1608,region:"Asia"},{name:"Islamabad",code:"ISB",lat:33.6169,lon:73.0993,region:"Asia"},{name:"Ho Chi Minh",code:"SGN",lat:10.8188,lon:106.652,region:"Asia"},{name:"Hanoi",code:"HAN",lat:21.2212,lon:105.8072,region:"Asia"},{name:"Dhaka",code:"DAC",lat:23.8433,lon:90.3978,region:"Asia"},{name:"Sydney",code:"SYD",lat:-33.9399,lon:151.1753,region:"Pacific"},{name:"Melbourne",code:"MEL",lat:-37.6733,lon:144.843,region:"Pacific"},{name:"Brisbane",code:"BNE",lat:-27.3842,lon:153.1175,region:"Pacific"},{name:"Perth",code:"PER",lat:-31.9403,lon:115.9669,region:"Pacific"},{name:"Auckland",code:"AKL",lat:-37.0082,lon:174.785,region:"Pacific"},{name:"Phoenix",code:"PHX",lat:33.4373,lon:-112.0078,region:"Americas"},{name:"Las Vegas",code:"LAS",lat:36.084,lon:-115.1537,region:"Americas"},{name:"Minneapolis",code:"MSP",lat:44.8848,lon:-93.2223,region:"Americas"},{name:"Detroit",code:"DTW",lat:42.2124,lon:-83.3534,region:"Americas"},{name:"Philadelphia",code:"PHL",lat:39.8719,lon:-75.2411,region:"Americas"},{name:"Washington DC",code:"IAD",lat:38.9531,lon:-77.4565,region:"Americas"},{name:"Washington DCA",code:"DCA",lat:38.8521,lon:-77.0377,region:"Americas"},{name:"Charlotte",code:"CLT",lat:35.214,lon:-80.9431,region:"Americas"},{name:"Orlando",code:"MCO",lat:28.4294,lon:-81.3089,region:"Americas"},{name:"Tampa",code:"TPA",lat:27.9755,lon:-82.5332,region:"Americas"},{name:"Portland",code:"PDX",lat:45.5898,lon:-122.5951,region:"Americas"},{name:"San Diego",code:"SAN",lat:32.7338,lon:-117.1933,region:"Americas"},{name:"Salt Lake City",code:"SLC",lat:40.7884,lon:-111.9778,region:"Americas"},{name:"Austin",code:"AUS",lat:30.1975,lon:-97.6664,region:"Americas"},{name:"Kansas City",code:"MCI",lat:39.2976,lon:-94.7139,region:"Americas"},{name:"St. Louis",code:"STL",lat:38.7487,lon:-90.37,region:"Americas"},{name:"Nashville",code:"BNA",lat:36.1245,lon:-86.6782,region:"Americas"},{name:"Raleigh",code:"RDU",lat:35.8776,lon:-78.7875,region:"Americas"},{name:"Pittsburgh",code:"PIT",lat:40.4915,lon:-80.2329,region:"Americas"},{name:"New Orleans",code:"MSY",lat:29.9934,lon:-90.258,region:"Americas"},{name:"Honolulu",code:"HNL",lat:21.3187,lon:-157.9224,region:"Americas"},{name:"Anchorage",code:"ANC",lat:61.1743,lon:-149.9963,region:"Americas"},{name:"Edmonton",code:"YEG",lat:53.3097,lon:-113.5797,region:"Americas"},{name:"Ottawa",code:"YOW",lat:45.3225,lon:-75.6692,region:"Americas"},{name:"Halifax",code:"YHZ",lat:44.8808,lon:-63.5086,region:"Americas"},{name:"Winnipeg",code:"YWG",lat:49.91,lon:-97.2398,region:"Americas"},{name:"Guadalajara",code:"GDL",lat:20.5218,lon:-103.3107,region:"Americas"},{name:"Monterrey",code:"MTY",lat:25.7785,lon:-100.1069,region:"Americas"},{name:"Tijuana",code:"TIJ",lat:32.5411,lon:-116.97,region:"Americas"},{name:"Guatemala City",code:"GUA",lat:14.5833,lon:-90.5275,region:"Americas"},{name:"San José",code:"SJO",lat:9.9939,lon:-84.2088,region:"Americas"},{name:"Panama City",code:"PTY",lat:9.0714,lon:-79.3835,region:"Americas"},{name:"San Juan",code:"SJU",lat:18.4394,lon:-66.0018,region:"Americas"},{name:"Santo Domingo",code:"SDQ",lat:18.4297,lon:-69.6689,region:"Americas"},{name:"Havana",code:"HAV",lat:22.9892,lon:-82.4091,region:"Americas"},{name:"Kingston",code:"KIN",lat:17.9357,lon:-76.7875,region:"Americas"},{name:"Montego Bay",code:"MBJ",lat:18.5037,lon:-77.9134,region:"Americas"},{name:"Nassau",code:"NAS",lat:25.039,lon:-77.4662,region:"Americas"},{name:"Bridgetown",code:"BGI",lat:13.0746,lon:-59.4925,region:"Americas"},{name:"Port of Spain",code:"POS",lat:10.5954,lon:-61.3372,region:"Americas"},{name:"Willemstad",code:"CUR",lat:12.1889,lon:-68.9598,region:"Americas"},{name:"Oranjestad",code:"AUA",lat:12.5014,lon:-70.0152,region:"Americas"},{name:"Sint Maarten",code:"SXM",lat:18.041,lon:-63.1089,region:"Americas"},{name:"Belize City",code:"BZE",lat:17.5391,lon:-88.3082,region:"Americas"},{name:"Managua",code:"MGA",lat:12.1415,lon:-86.1682,region:"Americas"},{name:"San Salvador",code:"SAL",lat:13.4409,lon:-89.0558,region:"Americas"},{name:"Tegucigalpa",code:"TGU",lat:14.0608,lon:-87.2172,region:"Americas"},{name:"Martinique",code:"FDF",lat:14.591,lon:-61.0032,region:"Americas"},{name:"Guadeloupe",code:"PTP",lat:16.2653,lon:-61.5318,region:"Americas"},{name:"Quito",code:"UIO",lat:-.1292,lon:-78.3575,region:"Americas"},{name:"Guayaquil",code:"GYE",lat:-2.1574,lon:-79.8836,region:"Americas"},{name:"Montevideo",code:"MVD",lat:-34.8384,lon:-56.0308,region:"Americas"},{name:"Asunción",code:"ASU",lat:-25.2399,lon:-57.5198,region:"Americas"},{name:"Brasília",code:"BSB",lat:-15.8711,lon:-47.9186,region:"Americas"},{name:"Fortaleza",code:"FOR",lat:-3.7762,lon:-38.5326,region:"Americas"},{name:"Recife",code:"REC",lat:-8.1265,lon:-34.9237,region:"Americas"},{name:"Porto Alegre",code:"POA",lat:-29.9944,lon:-51.1714,region:"Americas"},{name:"Medellín",code:"MDE",lat:6.1645,lon:-75.4231,region:"Americas"},{name:"Cartagena",code:"CTG",lat:10.4424,lon:-75.513,region:"Americas"},{name:"Cali",code:"CLO",lat:3.5432,lon:-76.3816,region:"Americas"},{name:"La Paz",code:"LPB",lat:-16.5133,lon:-68.1923,region:"Americas"},{name:"Santa Cruz",code:"VVI",lat:-17.6448,lon:-63.1354,region:"Americas"},{name:"Caracas",code:"CCS",lat:10.6031,lon:-66.9913,region:"Americas"},{name:"Georgetown",code:"GEO",lat:6.4986,lon:-58.2541,region:"Americas"},{name:"Paramaribo",code:"PBM",lat:5.4528,lon:-55.1878,region:"Americas"},{name:"Cayenne",code:"CAY",lat:4.8198,lon:-52.3605,region:"Americas"},{name:"Manaus",code:"MAO",lat:-3.0386,lon:-60.0497,region:"Americas"},{name:"Belém",code:"BEL",lat:-1.3792,lon:-48.4762,region:"Americas"},{name:"Salvador",code:"SSA",lat:-12.9086,lon:-38.3225,region:"Americas"},{name:"Córdoba",code:"COR",lat:-31.3236,lon:-64.208,region:"Americas"},{name:"Mendoza",code:"MDZ",lat:-32.8317,lon:-68.7929,region:"Americas"},{name:"Arequipa",code:"AQP",lat:-16.3411,lon:-71.583,region:"Americas"},{name:"Jacksonville",code:"JAX",lat:30.4941,lon:-81.6879,region:"Americas"},{name:"San Antonio",code:"SAT",lat:29.5337,lon:-98.4698,region:"Americas"},{name:"Indianapolis",code:"IND",lat:39.7173,lon:-86.2944,region:"Americas"},{name:"Berlin",code:"BER",lat:52.3667,lon:13.5033,region:"Europe"},{name:"Stuttgart",code:"STR",lat:48.6899,lon:9.222,region:"Europe"},{name:"Cologne",code:"CGN",lat:50.8659,lon:7.1427,region:"Europe"},{name:"Nuremberg",code:"NUE",lat:49.4987,lon:11.0669,region:"Europe"},{name:"Hannover",code:"HAJ",lat:52.4611,lon:9.685,region:"Europe"},{name:"Bremen",code:"BRE",lat:53.0475,lon:8.7867,region:"Europe"},{name:"Leipzig",code:"LEJ",lat:51.4324,lon:12.2416,region:"Europe"},{name:"Dresden",code:"DRS",lat:51.1328,lon:13.7672,region:"Europe"},{name:"London Gatwick",code:"LGW",lat:51.1537,lon:-.1821,region:"Europe"},{name:"London Stansted",code:"STN",lat:51.885,lon:.235,region:"Europe"},{name:"London Luton",code:"LTN",lat:51.8747,lon:-.3683,region:"Europe"},{name:"Birmingham",code:"BHX",lat:52.4539,lon:-1.748,region:"Europe"},{name:"Bristol",code:"BRS",lat:51.3827,lon:-2.7191,region:"Europe"},{name:"Newcastle",code:"NCL",lat:55.0375,lon:-1.6917,region:"Europe"},{name:"Belfast",code:"BFS",lat:54.6575,lon:-6.2158,region:"Europe"},{name:"East Midlands",code:"EMA",lat:52.8311,lon:-1.3281,region:"Europe"},{name:"Glasgow",code:"GLA",lat:55.8719,lon:-4.4331,region:"Europe"},{name:"Gothenburg",code:"GOT",lat:57.6628,lon:12.2798,region:"Europe"},{name:"Bergen",code:"BGO",lat:60.2934,lon:5.2181,region:"Europe"},{name:"Stavanger",code:"SVG",lat:58.8768,lon:5.6378,region:"Europe"},{name:"Trondheim",code:"TRD",lat:63.4578,lon:10.9239,region:"Europe"},{name:"Tallinn",code:"TLL",lat:59.4133,lon:24.8328,region:"Europe"},{name:"Vilnius",code:"VNO",lat:54.6341,lon:25.2858,region:"Europe"},{name:"Kaunas",code:"KUN",lat:54.9639,lon:24.0848,region:"Europe"},{name:"Wroclaw",code:"WRO",lat:51.1027,lon:16.8858,region:"Europe"},{name:"Kraków",code:"KRK",lat:50.0777,lon:19.7848,region:"Europe"},{name:"Gdansk",code:"GDN",lat:54.3776,lon:18.4662,region:"Europe"},{name:"Poznan",code:"POZ",lat:52.421,lon:16.8263,region:"Europe"},{name:"Eindhoven",code:"EIN",lat:51.4501,lon:5.3745,region:"Europe"},{name:"Rotterdam",code:"RTM",lat:51.9569,lon:4.4372,region:"Europe"},{name:"Luxembourg",code:"LUX",lat:49.6233,lon:6.2044,region:"Europe"},{name:"Bratislava",code:"BTS",lat:48.1702,lon:17.2127,region:"Europe"},{name:"Venice",code:"VCE",lat:45.5053,lon:12.3519,region:"Europe"},{name:"Turin",code:"TRN",lat:45.2008,lon:7.6497,region:"Europe"},{name:"Naples",code:"NAP",lat:40.886,lon:14.2908,region:"Europe"},{name:"Bologna",code:"BLQ",lat:44.5354,lon:11.2887,region:"Europe"},{name:"Florence",code:"FLR",lat:43.81,lon:11.2051,region:"Europe"},{name:"Catania",code:"CTA",lat:37.4668,lon:15.0664,region:"Europe"},{name:"Palermo",code:"PMO",lat:38.176,lon:13.091,region:"Europe"},{name:"Bari",code:"BRI",lat:41.1389,lon:16.7606,region:"Europe"},{name:"Palma Mallorca",code:"PMI",lat:39.5517,lon:2.7388,region:"Europe"},{name:"Seville",code:"SVQ",lat:37.418,lon:-5.8931,region:"Europe"},{name:"Valencia",code:"VLC",lat:39.4893,lon:-.4816,region:"Europe"},{name:"Málaga",code:"AGP",lat:36.6749,lon:-4.4991,region:"Europe"},{name:"Tenerife South",code:"TFS",lat:28.0445,lon:-16.5725,region:"Europe"},{name:"Las Palmas",code:"LPA",lat:27.9319,lon:-15.3866,region:"Europe"},{name:"Porto",code:"OPO",lat:41.2481,lon:-8.6814,region:"Europe"},{name:"Faro",code:"FAO",lat:37.0144,lon:-7.9659,region:"Europe"},{name:"Lyon",code:"LYS",lat:45.7256,lon:5.0811,region:"Europe"},{name:"Marseille",code:"MRS",lat:43.4393,lon:5.2214,region:"Europe"},{name:"Toulouse",code:"TLS",lat:43.6291,lon:1.3638,region:"Europe"},{name:"Bordeaux",code:"BOD",lat:44.8283,lon:-.7156,region:"Europe"},{name:"Nantes",code:"NTE",lat:47.1532,lon:-1.6108,region:"Europe"},{name:"Thessaloniki",code:"SKG",lat:40.5197,lon:22.9709,region:"Europe"},{name:"Heraklion",code:"HER",lat:35.3397,lon:25.1803,region:"Europe"},{name:"Rhodes",code:"RHO",lat:36.4054,lon:28.0862,region:"Europe"},{name:"Larnaca",code:"LCA",lat:34.8751,lon:33.6249,region:"Europe"},{name:"Malta",code:"MLA",lat:35.8574,lon:14.4775,region:"Europe"},{name:"Tirana",code:"TIA",lat:41.4147,lon:19.7206,region:"Europe"},{name:"Skopje",code:"SKP",lat:41.9614,lon:21.6214,region:"Europe"},{name:"Sarajevo",code:"SJJ",lat:43.8246,lon:18.3315,region:"Europe"},{name:"Zagreb",code:"ZAG",lat:45.7429,lon:16.0688,region:"Europe"},{name:"Ljubljana",code:"LJU",lat:46.2237,lon:14.4576,region:"Europe"},{name:"Podgorica",code:"TGD",lat:42.3594,lon:19.2519,region:"Europe"},{name:"Tbilisi",code:"TBS",lat:41.6692,lon:44.9547,region:"Europe"},{name:"Yerevan",code:"EVN",lat:40.1473,lon:44.3959,region:"Europe"},{name:"Baku",code:"GYD",lat:40.4675,lon:50.0467,region:"Europe"},{name:"Chisinau",code:"KIV",lat:46.9277,lon:28.931,region:"Europe"},{name:"Minsk",code:"MSQ",lat:53.8825,lon:28.0307,region:"Europe"},{name:"Moscow SVO",code:"SVO",lat:55.9726,lon:37.4146,region:"Europe"},{name:"Moscow DME",code:"DME",lat:55.4088,lon:37.9063,region:"Europe"},{name:"St Petersburg",code:"LED",lat:59.8003,lon:30.2625,region:"Europe"},{name:"Yekaterinburg",code:"SVX",lat:56.8431,lon:60.8028,region:"Europe"},{name:"Novosibirsk",code:"OVB",lat:54.9663,lon:82.9067,region:"Europe"},{name:"Ufa",code:"UFA",lat:54.5575,lon:55.8744,region:"Europe"},{name:"Kazan",code:"KZN",lat:55.6063,lon:49.2787,region:"Europe"},{name:"Sochi",code:"AER",lat:43.4499,lon:39.9566,region:"Europe"},{name:"Nizhny Novgorod",code:"GOJ",lat:56.2301,lon:43.784,region:"Europe"},{name:"Samara",code:"KUF",lat:53.505,lon:50.1642,region:"Europe"},{name:"Istanbul SAW",code:"SAW",lat:40.8985,lon:29.3092,region:"Europe"},{name:"Krasnoyarsk",code:"KJA",lat:56.173,lon:92.4933,region:"Europe"},{name:"Split",code:"SPU",lat:43.5389,lon:16.298,region:"Europe"},{name:"Dubrovnik",code:"DBV",lat:42.5614,lon:18.2681,region:"Europe"},{name:"Pristina",code:"PRN",lat:42.5728,lon:21.0358,region:"Europe"},{name:"Bahrain",code:"BAH",lat:26.2708,lon:50.6336,region:"Middle East"},{name:"Jeddah",code:"JED",lat:21.6796,lon:39.1565,region:"Middle East"},{name:"Dammam",code:"DMM",lat:26.4712,lon:49.7979,region:"Middle East"},{name:"Medina",code:"MED",lat:24.5534,lon:39.7051,region:"Middle East"},{name:"Sharjah",code:"SHJ",lat:25.3286,lon:55.5172,region:"Middle East"},{name:"Al Ain",code:"AAN",lat:24.2617,lon:55.6092,region:"Middle East"},{name:"Fujairah",code:"FJR",lat:25.1122,lon:56.324,region:"Middle East"},{name:"Beirut",code:"BEY",lat:33.8209,lon:35.4884,region:"Middle East"},{name:"Sharm el-Sheikh",code:"SSH",lat:27.9773,lon:34.395,region:"Middle East"},{name:"Hurghada",code:"HRG",lat:27.1783,lon:33.7994,region:"Middle East"},{name:"Luxor",code:"LXR",lat:25.671,lon:32.7066,region:"Middle East"},{name:"Erbil",code:"EBL",lat:36.2376,lon:43.9632,region:"Middle East"},{name:"Muscat Salalah",code:"SLL",lat:17.0387,lon:54.0913,region:"Middle East"},{name:"Tabuk",code:"TUU",lat:28.3654,lon:36.6189,region:"Middle East"},{name:"Abha",code:"AHB",lat:18.2404,lon:42.6566,region:"Middle East"},{name:"Algiers",code:"ALG",lat:36.691,lon:3.2154,region:"Africa"},{name:"Marrakech",code:"RAK",lat:31.6069,lon:-8.0363,region:"Africa"},{name:"Agadir",code:"AGA",lat:30.325,lon:-9.413,region:"Africa"},{name:"Fes",code:"FEZ",lat:33.9273,lon:-4.9779,region:"Africa"},{name:"Mombasa",code:"MBA",lat:-4.0348,lon:39.5942,region:"Africa"},{name:"Entebbe",code:"EBB",lat:.0424,lon:32.4435,region:"Africa"},{name:"Kigali",code:"KGL",lat:-1.9686,lon:30.1395,region:"Africa"},{name:"Dar es Salaam",code:"DAR",lat:-6.8781,lon:39.2026,region:"Africa"},{name:"Djibouti",code:"JIB",lat:11.5473,lon:43.1595,region:"Africa"},{name:"Harare",code:"HRE",lat:-17.9318,lon:31.0928,region:"Africa"},{name:"Lusaka",code:"LUN",lat:-15.3308,lon:28.4526,region:"Africa"},{name:"Windhoek",code:"WDH",lat:-22.4799,lon:17.4709,region:"Africa"},{name:"Gaborone",code:"GBE",lat:-24.5552,lon:25.9182,region:"Africa"},{name:"Lilongwe",code:"LLW",lat:-13.7894,lon:33.781,region:"Africa"},{name:"Maputo",code:"MPM",lat:-25.9208,lon:32.5726,region:"Africa"},{name:"Victoria Falls",code:"VFA",lat:-18.0959,lon:25.839,region:"Africa"},{name:"Mauritius",code:"MRU",lat:-20.4302,lon:57.6836,region:"Africa"},{name:"Réunion",code:"RUN",lat:-20.8871,lon:55.5103,region:"Africa"},{name:"Seychelles",code:"SEZ",lat:-4.6743,lon:55.5218,region:"Africa"},{name:"Antananarivo",code:"TNR",lat:-18.7969,lon:47.4788,region:"Africa"},{name:"Accra",code:"ACC",lat:5.6052,lon:-.1668,region:"Africa"},{name:"Abidjan",code:"ABJ",lat:5.2613,lon:-3.9262,region:"Africa"},{name:"Dakar",code:"DKR",lat:14.6705,lon:-17.4902,region:"Africa"},{name:"Abuja",code:"ABV",lat:9.0068,lon:7.2632,region:"Africa"},{name:"Monrovia",code:"ROB",lat:6.2328,lon:-10.3623,region:"Africa"},{name:"Freetown",code:"FNA",lat:8.6164,lon:-13.195,region:"Africa"},{name:"Conakry",code:"CKY",lat:9.5769,lon:-13.612,region:"Africa"},{name:"Banjul",code:"BJL",lat:13.338,lon:-16.6522,region:"Africa"},{name:"Kinshasa",code:"FIH",lat:-4.3858,lon:15.4446,region:"Africa"},{name:"Brazzaville",code:"BZV",lat:-4.2517,lon:15.2531,region:"Africa"},{name:"Douala",code:"DLA",lat:4.0061,lon:9.7195,region:"Africa"},{name:"Yaoundé",code:"NSI",lat:3.7226,lon:11.5533,region:"Africa"},{name:"Libreville",code:"LBV",lat:.4586,lon:9.4122,region:"Africa"},{name:"Luanda",code:"LAD",lat:-8.8583,lon:13.2312,region:"Africa"},{name:"Khartoum North",code:"KHN",lat:15.5895,lon:32.5532,region:"Africa"},{name:"Tokyo Narita",code:"NRT",lat:35.7653,lon:140.3856,region:"Asia"},{name:"Sapporo",code:"CTS",lat:42.7752,lon:141.6922,region:"Asia"},{name:"Okinawa",code:"OKA",lat:26.1958,lon:127.6461,region:"Asia"},{name:"Nagoya",code:"NGO",lat:34.8583,lon:136.805,region:"Asia"},{name:"Sendai",code:"SDJ",lat:38.1397,lon:140.917,region:"Asia"},{name:"Hiroshima",code:"HIJ",lat:34.4361,lon:132.9194,region:"Asia"},{name:"Kagoshima",code:"KOJ",lat:31.8034,lon:130.7194,region:"Asia"},{name:"Nagasaki",code:"NGS",lat:32.9169,lon:129.9139,region:"Asia"},{name:"Kumamoto",code:"KMJ",lat:32.8373,lon:130.8553,region:"Asia"},{name:"Takamatsu",code:"TAK",lat:34.2144,lon:134.0155,region:"Asia"},{name:"Seoul Gimpo",code:"GMP",lat:37.5583,lon:126.7906,region:"Asia"},{name:"Busan",code:"PUS",lat:35.1795,lon:128.9382,region:"Asia"},{name:"Jeju",code:"CJU",lat:33.5113,lon:126.493,region:"Asia"},{name:"Bangkok DMK",code:"DMK",lat:13.9126,lon:100.6067,region:"Asia"},{name:"Chiang Mai",code:"CNX",lat:18.7668,lon:98.9628,region:"Asia"},{name:"Phuket",code:"HKT",lat:8.1132,lon:98.3161,region:"Asia"},{name:"Ko Samui",code:"USM",lat:9.5478,lon:100.063,region:"Asia"},{name:"Hat Yai",code:"HDY",lat:6.9332,lon:100.393,region:"Asia"},{name:"Kota Kinabalu",code:"BKI",lat:5.9372,lon:116.0508,region:"Asia"},{name:"Kuching",code:"KCH",lat:1.4847,lon:110.3469,region:"Asia"},{name:"Penang",code:"PEN",lat:5.2972,lon:100.2769,region:"Asia"},{name:"Langkawi",code:"LGK",lat:6.3297,lon:99.7286,region:"Asia"},{name:"Johor Bahru",code:"JHB",lat:1.6413,lon:103.6698,region:"Asia"},{name:"Bali",code:"DPS",lat:-8.7481,lon:115.167,region:"Asia"},{name:"Surabaya",code:"SUB",lat:-7.3798,lon:112.7869,region:"Asia"},{name:"Yogyakarta",code:"JOG",lat:-7.7882,lon:110.4317,region:"Asia"},{name:"Makassar",code:"UPG",lat:-5.0616,lon:119.554,region:"Asia"},{name:"Medan",code:"KNO",lat:3.6422,lon:98.8853,region:"Asia"},{name:"Balikpapan",code:"BPN",lat:1.2683,lon:116.8944,region:"Asia"},{name:"Palembang",code:"PLM",lat:-2.8983,lon:104.6999,region:"Asia"},{name:"Manado",code:"MDC",lat:1.5495,lon:124.926,region:"Asia"},{name:"Batam",code:"BTH",lat:1.1213,lon:104.1192,region:"Asia"},{name:"Cebu",code:"CEB",lat:10.3075,lon:123.9789,region:"Asia"},{name:"Davao",code:"DVO",lat:7.1255,lon:125.6458,region:"Asia"},{name:"Iloilo",code:"ILO",lat:10.833,lon:122.4936,region:"Asia"},{name:"Puerto Princesa",code:"PPS",lat:9.7421,lon:118.759,region:"Asia"},{name:"Kalibo",code:"KLO",lat:11.6795,lon:122.3759,region:"Asia"},{name:"Da Nang",code:"DAD",lat:16.0439,lon:108.1992,region:"Asia"},{name:"Nha Trang",code:"CXR",lat:11.9983,lon:109.2194,region:"Asia"},{name:"Hue",code:"HUI",lat:16.4015,lon:107.7033,region:"Asia"},{name:"Can Tho",code:"VCA",lat:10.0851,lon:105.7119,region:"Asia"},{name:"Phu Quoc",code:"PQC",lat:10.227,lon:103.967,region:"Asia"},{name:"Yangon",code:"RGN",lat:16.9073,lon:96.1332,region:"Asia"},{name:"Vientiane",code:"VTE",lat:17.9883,lon:102.5633,region:"Asia"},{name:"Phnom Penh",code:"PNH",lat:11.5466,lon:104.844,region:"Asia"},{name:"Siem Reap",code:"REP",lat:13.4107,lon:103.8127,region:"Asia"},{name:"Hyderabad",code:"HYD",lat:17.2313,lon:78.4298,region:"Asia"},{name:"Kochi",code:"COK",lat:9.9952,lon:76.2699,region:"Asia"},{name:"Goa",code:"GOI",lat:15.3808,lon:73.8314,region:"Asia"},{name:"Ahmedabad",code:"AMD",lat:23.0772,lon:72.6347,region:"Asia"},{name:"Jaipur",code:"JAI",lat:26.8242,lon:75.8122,region:"Asia"},{name:"Lucknow",code:"LKO",lat:26.7606,lon:80.8893,region:"Asia"},{name:"Chandigarh",code:"IXC",lat:30.6735,lon:76.7885,region:"Asia"},{name:"Guwahati",code:"GAU",lat:26.1061,lon:91.5859,region:"Asia"},{name:"Bhubaneswar",code:"BBI",lat:20.2444,lon:85.8178,region:"Asia"},{name:"Thiruvananthapuram",code:"TRV",lat:8.4821,lon:76.9201,region:"Asia"},{name:"Varanasi",code:"VNS",lat:25.4524,lon:82.8593,region:"Asia"},{name:"Amritsar",code:"ATQ",lat:31.7096,lon:74.7973,region:"Asia"},{name:"Kathmandu",code:"KTM",lat:27.6966,lon:85.3591,region:"Asia"},{name:"Paro",code:"PBH",lat:27.4033,lon:89.4242,region:"Asia"},{name:"Chittagong",code:"CGP",lat:22.2496,lon:91.8133,region:"Asia"},{name:"Malé",code:"MLE",lat:4.1918,lon:73.529,region:"Asia"},{name:"Almaty",code:"ALA",lat:43.3521,lon:77.0405,region:"Asia"},{name:"Astana",code:"TSE",lat:51.0222,lon:71.4669,region:"Asia"},{name:"Tashkent",code:"TAS",lat:41.2579,lon:69.2812,region:"Asia"},{name:"Bishkek",code:"FRU",lat:43.0612,lon:74.4776,region:"Asia"},{name:"Dushanbe",code:"DYU",lat:38.5433,lon:68.775,region:"Asia"},{name:"Ashgabat",code:"ASB",lat:37.9868,lon:58.361,region:"Asia"},{name:"Ulaanbaatar",code:"ULN",lat:47.8431,lon:106.7664,region:"Asia"},{name:"Vladivostok",code:"VVO",lat:43.399,lon:132.1478,region:"Asia"},{name:"Khabarovsk",code:"KHV",lat:48.528,lon:135.1883,region:"Asia"},{name:"Irkutsk",code:"IKT",lat:52.268,lon:104.3889,region:"Asia"},{name:"Yuzhno-Sakhalinsk",code:"UUS",lat:46.8887,lon:142.7183,region:"Asia"},{name:"Nagpur",code:"NAG",lat:21.0922,lon:79.0472,region:"Asia"},{name:"Srinagar",code:"SXR",lat:33.9871,lon:74.7742,region:"Asia"},{name:"Tiruchirappalli",code:"TRZ",lat:10.7654,lon:78.7097,region:"Asia"},{name:"Adelaide",code:"ADL",lat:-34.945,lon:138.5308,region:"Pacific"},{name:"Canberra",code:"CBR",lat:-35.3069,lon:149.195,region:"Pacific"},{name:"Cairns",code:"CNS",lat:-16.8858,lon:145.7551,region:"Pacific"},{name:"Gold Coast",code:"OOL",lat:-28.1644,lon:153.5047,region:"Pacific"},{name:"Darwin",code:"DRW",lat:-12.4147,lon:130.8765,region:"Pacific"},{name:"Hobart",code:"HBA",lat:-42.8361,lon:147.5078,region:"Pacific"},{name:"Townsville",code:"TSV",lat:-19.2525,lon:146.7653,region:"Pacific"},{name:"Alice Springs",code:"ASP",lat:-23.8067,lon:133.9022,region:"Pacific"},{name:"Christchurch",code:"CHC",lat:-43.4894,lon:172.5322,region:"Pacific"},{name:"Wellington",code:"WLG",lat:-41.3272,lon:174.805,region:"Pacific"},{name:"Queenstown",code:"ZQN",lat:-45.0211,lon:168.7392,region:"Pacific"},{name:"Nadi",code:"NAN",lat:-17.7554,lon:177.443,region:"Pacific"},{name:"Papeete",code:"PPT",lat:-17.5534,lon:-149.6067,region:"Pacific"},{name:"Port Moresby",code:"POM",lat:-9.4433,lon:147.22,region:"Pacific"},{name:"Guam",code:"GUM",lat:13.4834,lon:144.7961,region:"Pacific"}];let Lo=null;const Hn=document.getElementById("scene-transition"),Jf=document.getElementById("scene-trans-code"),Zf=document.getElementById("scene-trans-name");async function Qf(i){Lo&&Lo.code===i.code||(Lo=i,Jf&&(Jf.textContent=i.code),Zf&&(Zf.textContent=i.name),Hn&&(Hn.style.transition="opacity 0.28s ease",Hn.style.opacity="1",Hn.style.pointerEvents="all",Hn.classList.add("loading")),await new Promise(e=>setTimeout(e,320)),tr(),fr(),ns&&ma(),wn&&(ur(Ht),Je&&Je.clearHighlight(),wn=null),Je&&Je.clearAll(Ht),IE(Ht),NE(Ht),Qp(i.lat,i.lon),Je&&Je.updateUserLocation(i.lat,i.lon),um(i.name,i.code),xh(0),mt.enabled=!1,Rt.position.set(8,9,12),mt.target.set(0,1,0),mt.update(),mt.enabled=!0,await Hp(i.lat,i.lon),Hn&&(Hn.classList.remove("loading"),Hn.style.transition="opacity 0.9s ease",Hn.style.opacity="0",Hn.style.pointerEvents=""),Wp(Ht,i.lat,i.lon).then(()=>{const e=lu();e&&xh(e.airports.length)}))}class QT{constructor(e,t){this.canvas=e,this.ctx=e.getContext("2d"),this.onSelect=t,this.viewLon=0,this.viewLat=20,this._tLon=0,this._tLat=20,this.activeRegion="All",this.searchQuery="",this.selectedIdx=-1,this.hoveredIdx=-1,this._dragging=!1,this._lastX=0,this._lastY=0,this._autoRotate=!0,this._paused=!0,this._raf=null,this.cx=0,this.cy=0,this.R=0,this._bindEvents()}_resize(){const e=Math.min(window.devicePixelRatio||1,2),t=this.canvas.clientWidth,n=this.canvas.clientHeight;!t||!n||(this.canvas.width=Math.round(t*e),this.canvas.height=Math.round(n*e),this.ctx.setTransform(e,0,0,e,0,0),this.cx=t/2,this.cy=n/2,this.R=Math.min(t,n)*.46)}_proj(e,t){const n=Math.PI/180,s=e*n,r=this.viewLat*n,a=(t-this.viewLon)*n,o=Math.sin(r)*Math.sin(s)+Math.cos(r)*Math.cos(s)*Math.cos(a);return{x:this.cx+this.R*Math.cos(s)*Math.sin(a),y:this.cy-this.R*(Math.cos(r)*Math.sin(s)-Math.sin(r)*Math.cos(s)*Math.cos(a)),visible:o>=0,depth:o}}_draw(){const e=this.ctx,{cx:t,cy:n,R:s}=this;e.clearRect(0,0,this.canvas.clientWidth,this.canvas.clientHeight);const r=e.createRadialGradient(t-s*.25,n-s*.25,0,t,n,s);r.addColorStop(0,"#0e1f3a"),r.addColorStop(.7,"#060e1c"),r.addColorStop(1,"#020509"),e.beginPath(),e.arc(t,n,s,0,Math.PI*2),e.fillStyle=r,e.fill(),e.save(),e.beginPath(),e.arc(t,n,s,0,Math.PI*2),e.clip(),this._drawGrid(),this._drawDots(),e.restore(),e.beginPath(),e.arc(t,n,s,0,Math.PI*2),e.strokeStyle="rgba(196,160,88,0.2)",e.lineWidth=1.5,e.stroke()}_drawGrid(){const e=this.ctx,t=(n,s)=>{if(!(n.length<2)){e.beginPath(),e.moveTo(n[0].x,n[0].y);for(let r=1;r<n.length;r++)e.lineTo(n[r].x,n[r].y);e.strokeStyle=`rgba(30,70,130,${s})`,e.lineWidth=.5,e.stroke()}};for(let n=-60;n<=60;n+=30){const s=[];for(let r=-180;r<=180;r+=3){const a=this._proj(n,r);a.visible?s.push(a):s.length&&(t(s,n===0?.55:.25),s.length=0)}t(s,n===0?.55:.25)}for(let n=-180;n<180;n+=30){const s=[];for(let r=-88;r<=88;r+=3){const a=this._proj(r,n);a.visible?s.push(a):s.length&&(t(s,.2),s.length=0)}t(s,.2)}}_drawDots(){const e=this.ctx,t=this.searchQuery;for(let n=0;n<2;n++)for(let s=0;s<fn.length;s++){const r=fn[s],a=this._proj(r.lat,r.lon);if(!a.visible)continue;const o=s===this.selectedIdx,l=s===this.hoveredIdx;if(n===0&&(o||l)||n===1&&!o&&!l)continue;const c=(this.activeRegion==="All"||r.region===this.activeRegion)&&(!t||r.name.toLowerCase().includes(t)||r.code.toLowerCase().startsWith(t)),h=Math.max(.2,a.depth);if(o){const u=e.createRadialGradient(a.x,a.y,0,a.x,a.y,11);u.addColorStop(0,"rgba(196,160,88,0.6)"),u.addColorStop(1,"rgba(196,160,88,0)"),e.beginPath(),e.arc(a.x,a.y,11,0,Math.PI*2),e.fillStyle=u,e.fill(),e.beginPath(),e.arc(a.x,a.y,3.5,0,Math.PI*2),e.fillStyle=`rgba(255,215,80,${h})`,e.fill(),this._label(e,a,`${r.code}  ${r.name}`,"rgba(255,210,80,0.95)",!0)}else if(l){const u=e.createRadialGradient(a.x,a.y,0,a.x,a.y,8);u.addColorStop(0,"rgba(90,180,255,0.55)"),u.addColorStop(1,"rgba(90,180,255,0)"),e.beginPath(),e.arc(a.x,a.y,8,0,Math.PI*2),e.fillStyle=u,e.fill(),e.beginPath(),e.arc(a.x,a.y,2.5,0,Math.PI*2),e.fillStyle=`rgba(150,220,255,${h})`,e.fill(),this._label(e,a,`${r.code}  ${r.name}`,"rgba(150,220,255,0.9)",!1)}else c?(e.beginPath(),e.arc(a.x,a.y,2,0,Math.PI*2),e.fillStyle=`rgba(196,160,88,${.45*h+.15})`,e.fill()):(e.beginPath(),e.arc(a.x,a.y,1,0,Math.PI*2),e.fillStyle=`rgba(30,50,80,${.5*h})`,e.fill())}}_label(e,t,n,s,r){e.font=`${r?"600":"400"} 10px Inter,JetBrains Mono,monospace`;const a=e.measureText(n).width;let o=t.x+9;o+a+5>this.cx+this.R&&(o=t.x-a-11);const l=t.y-5;e.fillStyle="rgba(4,9,20,0.88)",e.fillRect(o-3,l-12,a+6,16),e.fillStyle=s,e.fillText(n,o,l)}_bindEvents(){const e=this.canvas;e.addEventListener("mousedown",t=>{this._dragging=!0,this._autoRotate=!1,this._lastX=t.clientX,this._lastY=t.clientY,t.preventDefault()}),window.addEventListener("mousemove",t=>{this._paused||this._onMove(t)}),window.addEventListener("mouseup",()=>{this._dragging=!1}),e.addEventListener("mouseleave",()=>{this._dragging||(this.hoveredIdx=-1)}),e.addEventListener("click",()=>{this.hoveredIdx>=0&&(this.selectedIdx=this.hoveredIdx,this.onSelect(this.hoveredIdx))}),e.addEventListener("touchstart",t=>{this._dragging=!0,this._autoRotate=!1,this._lastX=t.touches[0].clientX,this._lastY=t.touches[0].clientY},{passive:!0}),e.addEventListener("touchmove",t=>{if(!this._dragging)return;const n=t.touches[0].clientX-this._lastX,s=t.touches[0].clientY-this._lastY;this.viewLon-=n*.5,this._tLon=this.viewLon,this.viewLat=Math.max(-85,Math.min(85,this.viewLat+s*.3)),this._tLat=this.viewLat,this._lastX=t.touches[0].clientX,this._lastY=t.touches[0].clientY,t.preventDefault()},{passive:!1}),e.addEventListener("touchend",()=>{this._dragging=!1})}_onMove(e){if(this._dragging){const t=e.clientX-this._lastX,n=e.clientY-this._lastY;this.viewLon-=t*.5,this._tLon=this.viewLon,this.viewLat=Math.max(-85,Math.min(85,this.viewLat+n*.3)),this._tLat=this.viewLat,this._lastX=e.clientX,this._lastY=e.clientY,this.hoveredIdx=-1}else{const t=this.canvas.getBoundingClientRect(),n=e.clientX-t.left,s=e.clientY-t.top,r=n-this.cx,a=s-this.cy;if(r*r+a*a>this.R*this.R){this.hoveredIdx=-1;return}let o=-1,l=14;for(let c=0;c<fn.length;c++){const h=this._proj(fn[c].lat,fn[c].lon);if(!h.visible)continue;const u=Math.hypot(h.x-n,h.y-s);u<l&&(l=u,o=c)}o!==this.hoveredIdx&&(this.hoveredIdx=o,this.canvas.style.cursor=o>=0?"pointer":"grab")}}_loop(){this._paused||(this._raf=requestAnimationFrame(()=>this._loop()),this._autoRotate&&!this._dragging&&(this.viewLon+=.05,this._tLon=this.viewLon),this._dragging||(this.viewLon+=(this._tLon-this.viewLon)*.1,this.viewLat+=(this._tLat-this.viewLat)*.1),this._draw())}setFilter(e,t){this.activeRegion=e,this.searchQuery=(t||"").toLowerCase()}flyTo(e,t){this._autoRotate=!1,this._tLat=e;let n=((t-this.viewLon)%360+540)%360-180;this._tLon=this.viewLon+n}setSelected(e){this.selectedIdx=e,e>=0&&this.flyTo(fn[e].lat,fn[e].lon)}resume(){this._paused&&(this._paused=!1,this._resize(),this._loop())}pause(){this._paused=!0,this._raf&&(cancelAnimationFrame(this._raf),this._raf=null)}}let Tn=null;function eA(){const i=document.getElementById("city-overlay"),e=document.getElementById("city-grid"),t=document.getElementById("city-overlay-close"),n=document.getElementById("hud-city-btn");if(!i||!e)return;const s=document.getElementById("city-globe-canvas");s&&(Tn=new QT(s,p=>{const m=fn[p];g(p),i.classList.add("hidden"),Tn.pause(),localStorage.setItem("stratum:city-picked","1"),n&&n.classList.remove("nudge"),Qf(m)}));const r=["All"],a=new Set;for(const p of fn)a.has(p.region)||(a.add(p.region),r.push(p.region));const o=document.createElement("div");o.className="city-controls",o.innerHTML=`<div class="city-search-wrap">
       <input id="city-search-input" class="city-search-input" type="text"
         placeholder="Search city or code..." autocomplete="off" spellcheck="false">
     </div>
     <div class="city-region-tabs" id="city-region-tabs">
       ${r.map(p=>`<button type="button" class="city-tab${p==="All"?" active":""}" data-region="${p}">${p==="All"?"ALL":p.toUpperCase()}</button>`).join("")}
     </div>`,e.parentElement.insertBefore(o,e),e.innerHTML=fn.map((p,m)=>`<button type="button" class="city-card" data-idx="${m}"
         data-region="${p.region}"
         data-name="${p.name.toLowerCase()}"
         data-code="${p.code.toLowerCase()}">
         <span class="city-card-code">${p.code}</span>
         <span class="city-card-name">${p.name}</span>
       </button>`).join("")+'<div class="city-no-results" id="city-no-results" hidden>No results</div>';const l=document.getElementById("city-search-input"),c=document.getElementById("city-region-tabs"),h=document.getElementById("city-no-results");let u="All",d="";function f(){const p=d.trim();let m=0;e.querySelectorAll(".city-card").forEach(M=>{const y=(u==="All"||M.dataset.region===u)&&(!p||M.dataset.name.includes(p)||M.dataset.code.startsWith(p));M.hidden=!y,y&&m++}),h.hidden=m>0,Tn?.setFilter(u,p)}l.addEventListener("input",()=>{d=l.value.toLowerCase(),d&&u!=="All"&&(u="All",c.querySelectorAll(".city-tab").forEach(p=>p.classList.toggle("active",p.dataset.region==="All"))),f()}),c.addEventListener("click",p=>{const m=p.target.closest(".city-tab");m&&(u=m.dataset.region,c.querySelectorAll(".city-tab").forEach(M=>M.classList.toggle("active",M===m)),d="",l.value="",f())});function g(p){e.querySelectorAll(".city-card").forEach(M=>M.classList.remove("active"));const m=e.querySelector(`.city-card[data-idx="${p}"]`);m&&(m.classList.add("active"),m.scrollIntoView({block:"nearest"}))}e.addEventListener("mouseover",p=>{const m=p.target.closest(".city-card");m&&Tn&&(Tn.hoveredIdx=+m.dataset.idx)}),e.addEventListener("mouseleave",()=>{Tn&&(Tn.hoveredIdx=-1)}),e.addEventListener("click",p=>{const m=p.target.closest(".city-card");if(!m)return;const M=+m.dataset.idx,y=fn[M];g(M),Tn?.setSelected(M),i.classList.add("hidden"),Tn?.pause(),localStorage.setItem("stratum:city-picked","1"),n&&n.classList.remove("nudge"),Qf(y)});const _=()=>{i.classList.add("hidden"),Tn?.pause()};t&&t.addEventListener("click",_),i.addEventListener("click",p=>{p.target===i&&_()}),i.addEventListener("keydown",p=>{if(p.key==="Escape"){_();return}if(["ArrowRight","ArrowLeft","ArrowDown","ArrowUp"].includes(p.key)){const m=[...e.querySelectorAll(".city-card:not([hidden])")],M=m.indexOf(document.activeElement);if(M===-1){m[0]?.focus();return}const y=p.key==="ArrowRight"||p.key==="ArrowDown"?Math.min(M+1,m.length-1):Math.max(M-1,0);m[y]?.focus(),p.preventDefault()}}),n&&(n.addEventListener("click",()=>Mh()),localStorage.getItem("stratum:city-picked")||n.classList.add("nudge")),localStorage.getItem("stratum:city-picked")||setTimeout(()=>Mh(),1200)}function Mh(){const i=document.getElementById("city-overlay");i&&(i.classList.remove("hidden"),Tn?.resume(),setTimeout(()=>{const e=document.getElementById("city-search-input");e&&(e.focus(),e.select())},50))}function tA(){const i=document.getElementById("search-input"),e=document.getElementById("search-results");if(!i||!e)return;let t=null,n=-1;function s(){return[...e.querySelectorAll(".search-result")]}function r(l,c){c.forEach((h,u)=>{h.classList.toggle("selected",u===l),u===l&&h.scrollIntoView({block:"nearest"})}),n=l}function a(){e.innerHTML="",e.classList.remove("open"),n=-1}i.addEventListener("input",()=>{clearTimeout(t),t=setTimeout(()=>{const l=i.value.trim().toUpperCase();if(n=-1,l.length<2||!Je){a();return}const c=Je.search(l,8);if(c.length===0){e.innerHTML='<div class="search-result"><span class="search-result-info">No results</span></div>',e.classList.add("open");return}e.innerHTML=c.map(h=>{const u=h.getDisplayData(),d=u.callsign||u.icao24,f=[u.aircraftType,u.registration].filter(Boolean).join(" · ");return`<div class="search-result" role="option" data-icao="${u.icao24}">
          <span class="search-result-callsign">${d}</span>
          <span class="search-result-info">${f||u.icao24}</span>
        </div>`}).join(""),e.classList.add("open"),e.querySelectorAll(".search-result").forEach(h=>{h.addEventListener("click",()=>o(h.dataset.icao))})},150)});function o(l){const c=Je.getByIcao(l);if(c){const{lat:h,lon:u}=Jo();Zo(c,h,u),Je.selectAircraft(c),pu(c),i.value="",a(),i.blur()}}i.addEventListener("keydown",l=>{const c=s();if(l.key==="ArrowDown")l.preventDefault(),r(Math.min(n+1,c.length-1),c);else if(l.key==="ArrowUp")l.preventDefault(),r(Math.max(n-1,0),c);else if(l.key==="Enter"&&(l.preventDefault(),n>=0&&c[n])){const h=c[n].dataset.icao;h&&o(h)}}),i.addEventListener("focus",()=>i.select()),i.addEventListener("blur",()=>{setTimeout(()=>a(),200)}),document.addEventListener("keydown",l=>{if(l.key==="/"&&document.activeElement!==i&&(l.preventDefault(),i.focus()),l.key==="Escape"){const c=document.getElementById("city-overlay");if(c&&!c.classList.contains("hidden")){c.classList.add("hidden");return}document.activeElement===i&&(i.blur(),i.value="",a()),ns&&ma(),Ri&&fr()}})}async function nA(){const i=fn[0];Lo=i,Qp(i.lat,i.lon),um(i.name,i.code),fm(0,i.lat,i.lon),Je=new oT(Ht,i.lat,i.lon),Hp(i.lat,i.lon),Wp(Ht,i.lat,i.lon).then(()=>{const e=lu();e&&xh(e.airports.length)}),Ib(XT,KT),tA(),eA(),PT(),Fm()}nA();
