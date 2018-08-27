/*!
 * pixi.js - v4.8.1
 * Compiled Wed, 06 Jun 2018 15:37:58 UTC
 *
 * pixi.js is licensed under the MIT License.
 * http://www.opensource.org/licenses/mit-license
 */
(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.PIXI = f()}})(function(){var define,module,exports;return (function(){function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s}return e})()({1:[function(require,module,exports){
"use strict"; "use restrict";
var INT_BITS = 32;
exports.INT_BITS  = INT_BITS;
exports.INT_MAX   =  0x7fffffff;
exports.INT_MIN   = -1<<(INT_BITS-1);
exports.sign = function(v) {
  return (v > 0) - (v < 0);
}
exports.abs = function(v) {
  var mask = v >> (INT_BITS-1);
  return (v ^ mask) - mask;
}
exports.min = function(x, y) {
  return y ^ ((x ^ y) & -(x < y));
}
exports.max = function(x, y) {
  return x ^ ((x ^ y) & -(x < y));
}
exports.isPow2 = function(v) {
  return !(v & (v-1)) && (!!v);
}
exports.log2 = function(v) {
  var r, shift;
  r =     (v > 0xFFFF) << 4; v >>>= r;
  shift = (v > 0xFF  ) << 3; v >>>= shift; r |= shift;
  shift = (v > 0xF   ) << 2; v >>>= shift; r |= shift;
  shift = (v > 0x3   ) << 1; v >>>= shift; r |= shift;
  return r | (v >> 1);
}
exports.log10 = function(v) {
  return  (v >= 1000000000) ? 9 : (v >= 100000000) ? 8 : (v >= 10000000) ? 7 :
          (v >= 1000000) ? 6 : (v >= 100000) ? 5 : (v >= 10000) ? 4 :
          (v >= 1000) ? 3 : (v >= 100) ? 2 : (v >= 10) ? 1 : 0;
}
exports.popCount = function(v) {
  v = v - ((v >>> 1) & 0x55555555);
  v = (v & 0x33333333) + ((v >>> 2) & 0x33333333);
  return ((v + (v >>> 4) & 0xF0F0F0F) * 0x1010101) >>> 24;
}
function countTrailingZeros(v) {
  var c = 32;
  v &= -v;
  if (v) c--;
  if (v & 0x0000FFFF) c -= 16;
  if (v & 0x00FF00FF) c -= 8;
  if (v & 0x0F0F0F0F) c -= 4;
  if (v & 0x33333333) c -= 2;
  if (v & 0x55555555) c -= 1;
  return c;
}
exports.countTrailingZeros = countTrailingZeros;
exports.nextPow2 = function(v) {
  v += v === 0;
  --v;
  v |= v >>> 1;
  v |= v >>> 2;
  v |= v >>> 4;
  v |= v >>> 8;
  v |= v >>> 16;
  return v + 1;
}
exports.prevPow2 = function(v) {
  v |= v >>> 1;
  v |= v >>> 2;
  v |= v >>> 4;
  v |= v >>> 8;
  v |= v >>> 16;
  return v - (v>>>1);
}
exports.parity = function(v) {
  v ^= v >>> 16;
  v ^= v >>> 8;
  v ^= v >>> 4;
  v &= 0xf;
  return (0x6996 >>> v) & 1;
}
var REVERSE_TABLE = new Array(256);
(function(tab) {
  for(var i=0; i<256; ++i) {
    var v = i, r = i, s = 7;
    for (v >>>= 1; v; v >>>= 1) {
      r <<= 1;
      r |= v & 1;
      --s;
    }
    tab[i] = (r << s) & 0xff;
  }
})(REVERSE_TABLE);
exports.reverse = function(v) {
  return  (REVERSE_TABLE[ v         & 0xff] << 24) |
          (REVERSE_TABLE[(v >>> 8)  & 0xff] << 16) |
          (REVERSE_TABLE[(v >>> 16) & 0xff] << 8)  |
           REVERSE_TABLE[(v >>> 24) & 0xff];
}
exports.interleave2 = function(x, y) {
  x &= 0xFFFF;
  x = (x | (x << 8)) & 0x00FF00FF;
  x = (x | (x << 4)) & 0x0F0F0F0F;
  x = (x | (x << 2)) & 0x33333333;
  x = (x | (x << 1)) & 0x55555555;
  y &= 0xFFFF;
  y = (y | (y << 8)) & 0x00FF00FF;
  y = (y | (y << 4)) & 0x0F0F0F0F;
  y = (y | (y << 2)) & 0x33333333;
  y = (y | (y << 1)) & 0x55555555;
  return x | (y << 1);
}
exports.deinterleave2 = function(v, n) {
  v = (v >>> n) & 0x55555555;
  v = (v | (v >>> 1))  & 0x33333333;
  v = (v | (v >>> 2))  & 0x0F0F0F0F;
  v = (v | (v >>> 4))  & 0x00FF00FF;
  v = (v | (v >>> 16)) & 0x000FFFF;
  return (v << 16) >> 16;
}
exports.interleave3 = function(x, y, z) {
  x &= 0x3FF;
  x  = (x | (x<<16)) & 4278190335;
  x  = (x | (x<<8))  & 251719695;
  x  = (x | (x<<4))  & 3272356035;
  x  = (x | (x<<2))  & 1227133513;
  y &= 0x3FF;
  y  = (y | (y<<16)) & 4278190335;
  y  = (y | (y<<8))  & 251719695;
  y  = (y | (y<<4))  & 3272356035;
  y  = (y | (y<<2))  & 1227133513;
  x |= (y << 1);
    z &= 0x3FF;
  z  = (z | (z<<16)) & 4278190335;
  z  = (z | (z<<8))  & 251719695;
  z  = (z | (z<<4))  & 3272356035;
  z  = (z | (z<<2))  & 1227133513;
    return x | (z << 2);
}
exports.deinterleave3 = function(v, n) {
  v = (v >>> n)       & 1227133513;
  v = (v | (v>>>2))   & 3272356035;
  v = (v | (v>>>4))   & 251719695;
  v = (v | (v>>>8))   & 4278190335;
  v = (v | (v>>>16))  & 0x3FF;
  return (v<<22)>>22;
}
exports.nextCombination = function(v) {
  var t = v | (v - 1);
  return (t + 1) | (((~t & -~t) - 1) >>> (countTrailingZeros(v) + 1));
}
},{}],2:[function(require,module,exports){
'use strict';
module.exports = earcut;
module.exports.default = earcut;
function earcut(data, holeIndices, dim) {
    dim = dim || 2;
    var hasHoles = holeIndices && holeIndices.length,
        outerLen = hasHoles ? holeIndices[0] * dim : data.length,
        outerNode = linkedList(data, 0, outerLen, dim, true),
        triangles = [];
    if (!outerNode) return triangles;
    var minX, minY, maxX, maxY, x, y, invSize;
    if (hasHoles) outerNode = eliminateHoles(data, holeIndices, outerNode, dim);
    if (data.length > 80 * dim) {
        minX = maxX = data[0];
        minY = maxY = data[1];
        for (var i = dim; i < outerLen; i += dim) {
            x = data[i];
            y = data[i + 1];
            if (x < minX) minX = x;
            if (y < minY) minY = y;
            if (x > maxX) maxX = x;
            if (y > maxY) maxY = y;
        }
        invSize = Math.max(maxX - minX, maxY - minY);
        invSize = invSize !== 0 ? 1 / invSize : 0;
    }
    earcutLinked(outerNode, triangles, dim, minX, minY, invSize);
    return triangles;
}
function linkedList(data, start, end, dim, clockwise) {
    var i, last;
    if (clockwise === (signedArea(data, start, end, dim) > 0)) {
        for (i = start; i < end; i += dim) last = insertNode(i, data[i], data[i + 1], last);
    } else {
        for (i = end - dim; i >= start; i -= dim) last = insertNode(i, data[i], data[i + 1], last);
    }
    if (last && equals(last, last.next)) {
        removeNode(last);
        last = last.next;
    }
    return last;
}
function filterPoints(start, end) {
    if (!start) return start;
    if (!end) end = start;
    var p = start,
        again;
    do {
        again = false;
        if (!p.steiner && (equals(p, p.next) || area(p.prev, p, p.next) === 0)) {
            removeNode(p);
            p = end = p.prev;
            if (p === p.next) break;
            again = true;
        } else {
            p = p.next;
        }
    } while (again || p !== end);
    return end;
}
function earcutLinked(ear, triangles, dim, minX, minY, invSize, pass) {
    if (!ear) return;
    if (!pass && invSize) indexCurve(ear, minX, minY, invSize);
    var stop = ear,
        prev, next;
    while (ear.prev !== ear.next) {
        prev = ear.prev;
        next = ear.next;
        if (invSize ? isEarHashed(ear, minX, minY, invSize) : isEar(ear)) {
            triangles.push(prev.i / dim);
            triangles.push(ear.i / dim);
            triangles.push(next.i / dim);
            removeNode(ear);
            ear = next.next;
            stop = next.next;
            continue;
        }
        ear = next;
        if (ear === stop) {
            if (!pass) {
                earcutLinked(filterPoints(ear), triangles, dim, minX, minY, invSize, 1);
            } else if (pass === 1) {
                ear = cureLocalIntersections(ear, triangles, dim);
                earcutLinked(ear, triangles, dim, minX, minY, invSize, 2);
            } else if (pass === 2) {
                splitEarcut(ear, triangles, dim, minX, minY, invSize);
            }
            break;
        }
    }
}
function isEar(ear) {
    var a = ear.prev,
        b = ear,
        c = ear.next;
    if (area(a, b, c) >= 0) return false; 
    var p = ear.next.next;
    while (p !== ear.prev) {
        if (pointInTriangle(a.x, a.y, b.x, b.y, c.x, c.y, p.x, p.y) &&
            area(p.prev, p, p.next) >= 0) return false;
        p = p.next;
    }
    return true;
}
function isEarHashed(ear, minX, minY, invSize) {
    var a = ear.prev,
        b = ear,
        c = ear.next;
    if (area(a, b, c) >= 0) return false; 
    var minTX = a.x < b.x ? (a.x < c.x ? a.x : c.x) : (b.x < c.x ? b.x : c.x),
        minTY = a.y < b.y ? (a.y < c.y ? a.y : c.y) : (b.y < c.y ? b.y : c.y),
        maxTX = a.x > b.x ? (a.x > c.x ? a.x : c.x) : (b.x > c.x ? b.x : c.x),
        maxTY = a.y > b.y ? (a.y > c.y ? a.y : c.y) : (b.y > c.y ? b.y : c.y);
    var minZ = zOrder(minTX, minTY, minX, minY, invSize),
        maxZ = zOrder(maxTX, maxTY, minX, minY, invSize);
    var p = ear.prevZ,
        n = ear.nextZ;
    while (p && p.z >= minZ && n && n.z <= maxZ) {
        if (p !== ear.prev && p !== ear.next &&
            pointInTriangle(a.x, a.y, b.x, b.y, c.x, c.y, p.x, p.y) &&
            area(p.prev, p, p.next) >= 0) return false;
        p = p.prevZ;
        if (n !== ear.prev && n !== ear.next &&
            pointInTriangle(a.x, a.y, b.x, b.y, c.x, c.y, n.x, n.y) &&
            area(n.prev, n, n.next) >= 0) return false;
        n = n.nextZ;
    }
    while (p && p.z >= minZ) {
        if (p !== ear.prev && p !== ear.next &&
            pointInTriangle(a.x, a.y, b.x, b.y, c.x, c.y, p.x, p.y) &&
            area(p.prev, p, p.next) >= 0) return false;
        p = p.prevZ;
    }
    while (n && n.z <= maxZ) {
        if (n !== ear.prev && n !== ear.next &&
            pointInTriangle(a.x, a.y, b.x, b.y, c.x, c.y, n.x, n.y) &&
            area(n.prev, n, n.next) >= 0) return false;
        n = n.nextZ;
    }
    return true;
}
function cureLocalIntersections(start, triangles, dim) {
    var p = start;
    do {
        var a = p.prev,
            b = p.next.next;
        if (!equals(a, b) && intersects(a, p, p.next, b) && locallyInside(a, b) && locallyInside(b, a)) {
            triangles.push(a.i / dim);
            triangles.push(p.i / dim);
            triangles.push(b.i / dim);
            removeNode(p);
            removeNode(p.next);
            p = start = b;
        }
        p = p.next;
    } while (p !== start);
    return p;
}
function splitEarcut(start, triangles, dim, minX, minY, invSize) {
    var a = start;
    do {
        var b = a.next.next;
        while (b !== a.prev) {
            if (a.i !== b.i && isValidDiagonal(a, b)) {
                var c = splitPolygon(a, b);
                a = filterPoints(a, a.next);
                c = filterPoints(c, c.next);
                earcutLinked(a, triangles, dim, minX, minY, invSize);
                earcutLinked(c, triangles, dim, minX, minY, invSize);
                return;
            }
            b = b.next;
        }
        a = a.next;
    } while (a !== start);
}
function eliminateHoles(data, holeIndices, outerNode, dim) {
    var queue = [],
        i, len, start, end, list;
    for (i = 0, len = holeIndices.length; i < len; i++) {
        start = holeIndices[i] * dim;
        end = i < len - 1 ? holeIndices[i + 1] * dim : data.length;
        list = linkedList(data, start, end, dim, false);
        if (list === list.next) list.steiner = true;
        queue.push(getLeftmost(list));
    }
    queue.sort(compareX);
    for (i = 0; i < queue.length; i++) {
        eliminateHole(queue[i], outerNode);
        outerNode = filterPoints(outerNode, outerNode.next);
    }
    return outerNode;
}
function compareX(a, b) {
    return a.x - b.x;
}
function eliminateHole(hole, outerNode) {
    outerNode = findHoleBridge(hole, outerNode);
    if (outerNode) {
        var b = splitPolygon(outerNode, hole);
        filterPoints(b, b.next);
    }
}
function findHoleBridge(hole, outerNode) {
    var p = outerNode,
        hx = hole.x,
        hy = hole.y,
        qx = -Infinity,
        m;
    do {
        if (hy <= p.y && hy >= p.next.y && p.next.y !== p.y) {
            var x = p.x + (hy - p.y) * (p.next.x - p.x) / (p.next.y - p.y);
            if (x <= hx && x > qx) {
                qx = x;
                if (x === hx) {
                    if (hy === p.y) return p;
                    if (hy === p.next.y) return p.next;
                }
                m = p.x < p.next.x ? p : p.next;
            }
        }
        p = p.next;
    } while (p !== outerNode);
    if (!m) return null;
    if (hx === qx) return m.prev; 
    var stop = m,
        mx = m.x,
        my = m.y,
        tanMin = Infinity,
        tan;
    p = m.next;
    while (p !== stop) {
        if (hx >= p.x && p.x >= mx && hx !== p.x &&
                pointInTriangle(hy < my ? hx : qx, hy, mx, my, hy < my ? qx : hx, hy, p.x, p.y)) {
            tan = Math.abs(hy - p.y) / (hx - p.x); 
            if ((tan < tanMin || (tan === tanMin && p.x > m.x)) && locallyInside(p, hole)) {
                m = p;
                tanMin = tan;
            }
        }
        p = p.next;
    }
    return m;
}
function indexCurve(start, minX, minY, invSize) {
    var p = start;
    do {
        if (p.z === null) p.z = zOrder(p.x, p.y, minX, minY, invSize);
        p.prevZ = p.prev;
        p.nextZ = p.next;
        p = p.next;
    } while (p !== start);
    p.prevZ.nextZ = null;
    p.prevZ = null;
    sortLinked(p);
}
function sortLinked(list) {
    var i, p, q, e, tail, numMerges, pSize, qSize,
        inSize = 1;
    do {
        p = list;
        list = null;
        tail = null;
        numMerges = 0;
        while (p) {
            numMerges++;
            q = p;
            pSize = 0;
            for (i = 0; i < inSize; i++) {
                pSize++;
                q = q.nextZ;
                if (!q) break;
            }
            qSize = inSize;
            while (pSize > 0 || (qSize > 0 && q)) {
                if (pSize !== 0 && (qSize === 0 || !q || p.z <= q.z)) {
                    e = p;
                    p = p.nextZ;
                    pSize--;
                } else {
                    e = q;
                    q = q.nextZ;
                    qSize--;
                }
                if (tail) tail.nextZ = e;
                else list = e;
                e.prevZ = tail;
                tail = e;
            }
            p = q;
        }
        tail.nextZ = null;
        inSize *= 2;
    } while (numMerges > 1);
    return list;
}
function zOrder(x, y, minX, minY, invSize) {
    x = 32767 * (x - minX) * invSize;
    y = 32767 * (y - minY) * invSize;
    x = (x | (x << 8)) & 0x00FF00FF;
    x = (x | (x << 4)) & 0x0F0F0F0F;
    x = (x | (x << 2)) & 0x33333333;
    x = (x | (x << 1)) & 0x55555555;
    y = (y | (y << 8)) & 0x00FF00FF;
    y = (y | (y << 4)) & 0x0F0F0F0F;
    y = (y | (y << 2)) & 0x33333333;
    y = (y | (y << 1)) & 0x55555555;
    return x | (y << 1);
}
function getLeftmost(start) {
    var p = start,
        leftmost = start;
    do {
        if (p.x < leftmost.x) leftmost = p;
        p = p.next;
    } while (p !== start);
    return leftmost;
}
function pointInTriangle(ax, ay, bx, by, cx, cy, px, py) {
    return (cx - px) * (ay - py) - (ax - px) * (cy - py) >= 0 &&
           (ax - px) * (by - py) - (bx - px) * (ay - py) >= 0 &&
           (bx - px) * (cy - py) - (cx - px) * (by - py) >= 0;
}
function isValidDiagonal(a, b) {
    return a.next.i !== b.i && a.prev.i !== b.i && !intersectsPolygon(a, b) &&
           locallyInside(a, b) && locallyInside(b, a) && middleInside(a, b);
}
function area(p, q, r) {
    return (q.y - p.y) * (r.x - q.x) - (q.x - p.x) * (r.y - q.y);
}
function equals(p1, p2) {
    return p1.x === p2.x && p1.y === p2.y;
}
function intersects(p1, q1, p2, q2) {
    if ((equals(p1, q1) && equals(p2, q2)) ||
        (equals(p1, q2) && equals(p2, q1))) return true;
    return area(p1, q1, p2) > 0 !== area(p1, q1, q2) > 0 &&
           area(p2, q2, p1) > 0 !== area(p2, q2, q1) > 0;
}
function intersectsPolygon(a, b) {
    var p = a;
    do {
        if (p.i !== a.i && p.next.i !== a.i && p.i !== b.i && p.next.i !== b.i &&
                intersects(p, p.next, a, b)) return true;
        p = p.next;
    } while (p !== a);
    return false;
}
function locallyInside(a, b) {
    return area(a.prev, a, a.next) < 0 ?
        area(a, b, a.next) >= 0 && area(a, a.prev, b) >= 0 :
        area(a, b, a.prev) < 0 || area(a, a.next, b) < 0;
}
function middleInside(a, b) {
    var p = a,
        inside = false,
        px = (a.x + b.x) / 2,
        py = (a.y + b.y) / 2;
    do {
        if (((p.y > py) !== (p.next.y > py)) && p.next.y !== p.y &&
                (px < (p.next.x - p.x) * (py - p.y) / (p.next.y - p.y) + p.x))
            inside = !inside;
        p = p.next;
    } while (p !== a);
    return inside;
}
function splitPolygon(a, b) {
    var a2 = new Node(a.i, a.x, a.y),
        b2 = new Node(b.i, b.x, b.y),
        an = a.next,
        bp = b.prev;
    a.next = b;
    b.prev = a;
    a2.next = an;
    an.prev = a2;
    b2.next = a2;
    a2.prev = b2;
    bp.next = b2;
    b2.prev = bp;
    return b2;
}
function insertNode(i, x, y, last) {
    var p = new Node(i, x, y);
    if (!last) {
        p.prev = p;
        p.next = p;
    } else {
        p.next = last.next;
        p.prev = last;
        last.next.prev = p;
        last.next = p;
    }
    return p;
}
function removeNode(p) {
    p.next.prev = p.prev;
    p.prev.next = p.next;
    if (p.prevZ) p.prevZ.nextZ = p.nextZ;
    if (p.nextZ) p.nextZ.prevZ = p.prevZ;
}
function Node(i, x, y) {
    this.i = i;
    this.x = x;
    this.y = y;
    this.prev = null;
    this.next = null;
    this.z = null;
    this.prevZ = null;
    this.nextZ = null;
    this.steiner = false;
}
earcut.deviation = function (data, holeIndices, dim, triangles) {
    var hasHoles = holeIndices && holeIndices.length;
    var outerLen = hasHoles ? holeIndices[0] * dim : data.length;
    var polygonArea = Math.abs(signedArea(data, 0, outerLen, dim));
    if (hasHoles) {
        for (var i = 0, len = holeIndices.length; i < len; i++) {
            var start = holeIndices[i] * dim;
            var end = i < len - 1 ? holeIndices[i + 1] * dim : data.length;
            polygonArea -= Math.abs(signedArea(data, start, end, dim));
        }
    }
    var trianglesArea = 0;
    for (i = 0; i < triangles.length; i += 3) {
        var a = triangles[i] * dim;
        var b = triangles[i + 1] * dim;
        var c = triangles[i + 2] * dim;
        trianglesArea += Math.abs(
            (data[a] - data[c]) * (data[b + 1] - data[a + 1]) -
            (data[a] - data[b]) * (data[c + 1] - data[a + 1]));
    }
    return polygonArea === 0 && trianglesArea === 0 ? 0 :
        Math.abs((trianglesArea - polygonArea) / polygonArea);
};
function signedArea(data, start, end, dim) {
    var sum = 0;
    for (var i = start, j = end - dim; i < end; i += dim) {
        sum += (data[j] - data[i]) * (data[i + 1] + data[j + 1]);
        j = i;
    }
    return sum;
}
earcut.flatten = function (data) {
    var dim = data[0][0].length,
        result = {vertices: [], holes: [], dimensions: dim},
        holeIndex = 0;
    for (var i = 0; i < data.length; i++) {
        for (var j = 0; j < data[i].length; j++) {
            for (var d = 0; d < dim; d++) result.vertices.push(data[i][j][d]);
        }
        if (i > 0) {
            holeIndex += data[i - 1].length;
            result.holes.push(holeIndex);
        }
    }
    return result;
};
},{}],3:[function(require,module,exports){
'use strict';
var has = Object.prototype.hasOwnProperty
  , prefix = '~';
function Events() {}
if (Object.create) {
  Events.prototype = Object.create(null);
  if (!new Events().__proto__) prefix = false;
}
function EE(fn, context, once) {
  this.fn = fn;
  this.context = context;
  this.once = once || false;
}
function EventEmitter() {
  this._events = new Events();
  this._eventsCount = 0;
}
EventEmitter.prototype.eventNames = function eventNames() {
  var names = []
    , events
    , name;
  if (this._eventsCount === 0) return names;
  for (name in (events = this._events)) {
    if (has.call(events, name)) names.push(prefix ? name.slice(1) : name);
  }
  if (Object.getOwnPropertySymbols) {
    return names.concat(Object.getOwnPropertySymbols(events));
  }
  return names;
};
EventEmitter.prototype.listeners = function listeners(event, exists) {
  var evt = prefix ? prefix + event : event
    , available = this._events[evt];
  if (exists) return !!available;
  if (!available) return [];
  if (available.fn) return [available.fn];
  for (var i = 0, l = available.length, ee = new Array(l); i < l; i++) {
    ee[i] = available[i].fn;
  }
  return ee;
};
EventEmitter.prototype.emit = function emit(event, a1, a2, a3, a4, a5) {
  var evt = prefix ? prefix + event : event;
  if (!this._events[evt]) return false;
  var listeners = this._events[evt]
    , len = arguments.length
    , args
    , i;
  if (listeners.fn) {
    if (listeners.once) this.removeListener(event, listeners.fn, undefined, true);
    switch (len) {
      case 1: return listeners.fn.call(listeners.context), true;
      case 2: return listeners.fn.call(listeners.context, a1), true;
      case 3: return listeners.fn.call(listeners.context, a1, a2), true;
      case 4: return listeners.fn.call(listeners.context, a1, a2, a3), true;
      case 5: return listeners.fn.call(listeners.context, a1, a2, a3, a4), true;
      case 6: return listeners.fn.call(listeners.context, a1, a2, a3, a4, a5), true;
    }
    for (i = 1, args = new Array(len -1); i < len; i++) {
      args[i - 1] = arguments[i];
    }
    listeners.fn.apply(listeners.context, args);
  } else {
    var length = listeners.length
      , j;
    for (i = 0; i < length; i++) {
      if (listeners[i].once) this.removeListener(event, listeners[i].fn, undefined, true);
      switch (len) {
        case 1: listeners[i].fn.call(listeners[i].context); break;
        case 2: listeners[i].fn.call(listeners[i].context, a1); break;
        case 3: listeners[i].fn.call(listeners[i].context, a1, a2); break;
        case 4: listeners[i].fn.call(listeners[i].context, a1, a2, a3); break;
        default:
          if (!args) for (j = 1, args = new Array(len -1); j < len; j++) {
            args[j - 1] = arguments[j];
          }
          listeners[i].fn.apply(listeners[i].context, args);
      }
    }
  }
  return true;
};
EventEmitter.prototype.on = function on(event, fn, context) {
  var listener = new EE(fn, context || this)
    , evt = prefix ? prefix + event : event;
  if (!this._events[evt]) this._events[evt] = listener, this._eventsCount++;
  else if (!this._events[evt].fn) this._events[evt].push(listener);
  else this._events[evt] = [this._events[evt], listener];
  return this;
};
EventEmitter.prototype.once = function once(event, fn, context) {
  var listener = new EE(fn, context || this, true)
    , evt = prefix ? prefix + event : event;
  if (!this._events[evt]) this._events[evt] = listener, this._eventsCount++;
  else if (!this._events[evt].fn) this._events[evt].push(listener);
  else this._events[evt] = [this._events[evt], listener];
  return this;
};
EventEmitter.prototype.removeListener = function removeListener(event, fn, context, once) {
  var evt = prefix ? prefix + event : event;
  if (!this._events[evt]) return this;
  if (!fn) {
    if (--this._eventsCount === 0) this._events = new Events();
    else delete this._events[evt];
    return this;
  }
  var listeners = this._events[evt];
  if (listeners.fn) {
    if (
         listeners.fn === fn
      && (!once || listeners.once)
      && (!context || listeners.context === context)
    ) {
      if (--this._eventsCount === 0) this._events = new Events();
      else delete this._events[evt];
    }
  } else {
    for (var i = 0, events = [], length = listeners.length; i < length; i++) {
      if (
           listeners[i].fn !== fn
        || (once && !listeners[i].once)
        || (context && listeners[i].context !== context)
      ) {
        events.push(listeners[i]);
      }
    }
    if (events.length) this._events[evt] = events.length === 1 ? events[0] : events;
    else if (--this._eventsCount === 0) this._events = new Events();
    else delete this._events[evt];
  }
  return this;
};
EventEmitter.prototype.removeAllListeners = function removeAllListeners(event) {
  var evt;
  if (event) {
    evt = prefix ? prefix + event : event;
    if (this._events[evt]) {
      if (--this._eventsCount === 0) this._events = new Events();
      else delete this._events[evt];
    }
  } else {
    this._events = new Events();
    this._eventsCount = 0;
  }
  return this;
};
EventEmitter.prototype.off = EventEmitter.prototype.removeListener;
EventEmitter.prototype.addListener = EventEmitter.prototype.on;
EventEmitter.prototype.setMaxListeners = function setMaxListeners() {
  return this;
};
EventEmitter.prefixed = prefix;
EventEmitter.EventEmitter = EventEmitter;
if ('undefined' !== typeof module) {
  module.exports = EventEmitter;
}
},{}],4:[function(require,module,exports){
(function (global) {
    var apple_phone         = /iPhone/i,
        apple_ipod          = /iPod/i,
        apple_tablet        = /iPad/i,
        android_phone       = /(?=.*\bAndroid\b)(?=.*\bMobile\b)/i, 
        android_tablet      = /Android/i,
        amazon_phone        = /(?=.*\bAndroid\b)(?=.*\bSD4930UR\b)/i,
        amazon_tablet       = /(?=.*\bAndroid\b)(?=.*\b(?:KFOT|KFTT|KFJWI|KFJWA|KFSOWI|KFTHWI|KFTHWA|KFAPWI|KFAPWA|KFARWI|KFASWI|KFSAWI|KFSAWA)\b)/i,
        windows_phone       = /Windows Phone/i,
        windows_tablet      = /(?=.*\bWindows\b)(?=.*\bARM\b)/i, 
        other_blackberry    = /BlackBerry/i,
        other_blackberry_10 = /BB10/i,
        other_opera         = /Opera Mini/i,
        other_chrome        = /(CriOS|Chrome)(?=.*\bMobile\b)/i,
        other_firefox       = /(?=.*\bFirefox\b)(?=.*\bMobile\b)/i, 
        seven_inch = new RegExp(
            '(?:' +         
            'Nexus 7' +     
            '|' +           
            'BNTV250' +     
            '|' +           
            'Kindle Fire' + 
            '|' +           
            'Silk' +        
            '|' +           
            'GT-P1000' +    
            ')',            
            'i');           
    var match = function(regex, userAgent) {
        return regex.test(userAgent);
    };
    var IsMobileClass = function(userAgent) {
        var ua = userAgent || navigator.userAgent;
        var tmp = ua.split('[FBAN');
        if (typeof tmp[1] !== 'undefined') {
            ua = tmp[0];
        }
        tmp = ua.split('Twitter');
        if (typeof tmp[1] !== 'undefined') {
            ua = tmp[0];
        }
        this.apple = {
            phone:  match(apple_phone, ua),
            ipod:   match(apple_ipod, ua),
            tablet: !match(apple_phone, ua) && match(apple_tablet, ua),
            device: match(apple_phone, ua) || match(apple_ipod, ua) || match(apple_tablet, ua)
        };
        this.amazon = {
            phone:  match(amazon_phone, ua),
            tablet: !match(amazon_phone, ua) && match(amazon_tablet, ua),
            device: match(amazon_phone, ua) || match(amazon_tablet, ua)
        };
        this.android = {
            phone:  match(amazon_phone, ua) || match(android_phone, ua),
            tablet: !match(amazon_phone, ua) && !match(android_phone, ua) && (match(amazon_tablet, ua) || match(android_tablet, ua)),
            device: match(amazon_phone, ua) || match(amazon_tablet, ua) || match(android_phone, ua) || match(android_tablet, ua)
        };
        this.windows = {
            phone:  match(windows_phone, ua),
            tablet: match(windows_tablet, ua),
            device: match(windows_phone, ua) || match(windows_tablet, ua)
        };
        this.other = {
            blackberry:   match(other_blackberry, ua),
            blackberry10: match(other_blackberry_10, ua),
            opera:        match(other_opera, ua),
            firefox:      match(other_firefox, ua),
            chrome:       match(other_chrome, ua),
            device:       match(other_blackberry, ua) || match(other_blackberry_10, ua) || match(other_opera, ua) || match(other_firefox, ua) || match(other_chrome, ua)
        };
        this.seven_inch = match(seven_inch, ua);
        this.any = this.apple.device || this.android.device || this.windows.device || this.other.device || this.seven_inch;
        this.phone = this.apple.phone || this.android.phone || this.windows.phone;
        this.tablet = this.apple.tablet || this.android.tablet || this.windows.tablet;
        if (typeof window === 'undefined') {
            return this;
        }
    };
    var instantiate = function() {
        var IM = new IsMobileClass();
        IM.Class = IsMobileClass;
        return IM;
    };
    if (typeof module !== 'undefined' && module.exports && typeof window === 'undefined') {
        module.exports = IsMobileClass;
    } else if (typeof module !== 'undefined' && module.exports && typeof window !== 'undefined') {
        module.exports = instantiate();
    } else if (typeof define === 'function' && define.amd) {
        define('isMobile', [], global.isMobile = instantiate());
    } else {
        global.isMobile = instantiate();
    }
})(this);
},{}],5:[function(require,module,exports){
'use strict';
Object.defineProperty(exports, '__esModule', {
  value: true
});
var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }
var MiniSignalBinding = (function () {
  function MiniSignalBinding(fn, once, thisArg) {
    if (once === undefined) once = false;
    _classCallCheck(this, MiniSignalBinding);
    this._fn = fn;
    this._once = once;
    this._thisArg = thisArg;
    this._next = this._prev = this._owner = null;
  }
  _createClass(MiniSignalBinding, [{
    key: 'detach',
    value: function detach() {
      if (this._owner === null) return false;
      this._owner.detach(this);
      return true;
    }
  }]);
  return MiniSignalBinding;
})();
function _addMiniSignalBinding(self, node) {
  if (!self._head) {
    self._head = node;
    self._tail = node;
  } else {
    self._tail._next = node;
    node._prev = self._tail;
    self._tail = node;
  }
  node._owner = self;
  return node;
}
var MiniSignal = (function () {
  function MiniSignal() {
    _classCallCheck(this, MiniSignal);
    this._head = this._tail = undefined;
  }
  _createClass(MiniSignal, [{
    key: 'handlers',
    value: function handlers() {
      var exists = arguments.length <= 0 || arguments[0] === undefined ? false : arguments[0];
      var node = this._head;
      if (exists) return !!node;
      var ee = [];
      while (node) {
        ee.push(node);
        node = node._next;
      }
      return ee;
    }
  }, {
    key: 'has',
    value: function has(node) {
      if (!(node instanceof MiniSignalBinding)) {
        throw new Error('MiniSignal#has(): First arg must be a MiniSignalBinding object.');
      }
      return node._owner === this;
    }
  }, {
    key: 'dispatch',
    value: function dispatch() {
      var node = this._head;
      if (!node) return false;
      while (node) {
        if (node._once) this.detach(node);
        node._fn.apply(node._thisArg, arguments);
        node = node._next;
      }
      return true;
    }
  }, {
    key: 'add',
    value: function add(fn) {
      var thisArg = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];
      if (typeof fn !== 'function') {
        throw new Error('MiniSignal#add(): First arg must be a Function.');
      }
      return _addMiniSignalBinding(this, new MiniSignalBinding(fn, false, thisArg));
    }
  }, {
    key: 'once',
    value: function once(fn) {
      var thisArg = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];
      if (typeof fn !== 'function') {
        throw new Error('MiniSignal#once(): First arg must be a Function.');
      }
      return _addMiniSignalBinding(this, new MiniSignalBinding(fn, true, thisArg));
    }
  }, {
    key: 'detach',
    value: function detach(node) {
      if (!(node instanceof MiniSignalBinding)) {
        throw new Error('MiniSignal#detach(): First arg must be a MiniSignalBinding object.');
      }
      if (node._owner !== this) return this;
      if (node._prev) node._prev._next = node._next;
      if (node._next) node._next._prev = node._prev;
      if (node === this._head) {
        this._head = node._next;
        if (node._next === null) {
          this._tail = null;
        }
      } else if (node === this._tail) {
        this._tail = node._prev;
        this._tail._next = null;
      }
      node._owner = null;
      return this;
    }
  }, {
    key: 'detachAll',
    value: function detachAll() {
      var node = this._head;
      if (!node) return this;
      this._head = this._tail = null;
      while (node) {
        node._owner = null;
        node = node._next;
      }
      return this;
    }
  }]);
  return MiniSignal;
})();
MiniSignal.MiniSignalBinding = MiniSignalBinding;
exports['default'] = MiniSignal;
module.exports = exports['default'];
},{}],6:[function(require,module,exports){
'use strict';
var getOwnPropertySymbols = Object.getOwnPropertySymbols;
var hasOwnProperty = Object.prototype.hasOwnProperty;
var propIsEnumerable = Object.prototype.propertyIsEnumerable;
function toObject(val) {
	if (val === null || val === undefined) {
		throw new TypeError('Object.assign cannot be called with null or undefined');
	}
	return Object(val);
}
function shouldUseNative() {
	try {
		if (!Object.assign) {
			return false;
		}
		var test1 = new String('abc');  
		test1[5] = 'de';
		if (Object.getOwnPropertyNames(test1)[0] === '5') {
			return false;
		}
		var test2 = {};
		for (var i = 0; i < 10; i++) {
			test2['_' + String.fromCharCode(i)] = i;
		}
		var order2 = Object.getOwnPropertyNames(test2).map(function (n) {
			return test2[n];
		});
		if (order2.join('') !== '0123456789') {
			return false;
		}
		var test3 = {};
		'abcdefghijklmnopqrst'.split('').forEach(function (letter) {
			test3[letter] = letter;
		});
		if (Object.keys(Object.assign({}, test3)).join('') !==
				'abcdefghijklmnopqrst') {
			return false;
		}
		return true;
	} catch (err) {
		return false;
	}
}
module.exports = shouldUseNative() ? Object.assign : function (target, source) {
	var from;
	var to = toObject(target);
	var symbols;
	for (var s = 1; s < arguments.length; s++) {
		from = Object(arguments[s]);
		for (var key in from) {
			if (hasOwnProperty.call(from, key)) {
				to[key] = from[key];
			}
		}
		if (getOwnPropertySymbols) {
			symbols = getOwnPropertySymbols(from);
			for (var i = 0; i < symbols.length; i++) {
				if (propIsEnumerable.call(from, symbols[i])) {
					to[symbols[i]] = from[symbols[i]];
				}
			}
		}
	}
	return to;
};
},{}],7:[function(require,module,exports){
'use strict'
module.exports = function parseURI (str, opts) {
  opts = opts || {}
  var o = {
    key: ['source', 'protocol', 'authority', 'userInfo', 'user', 'password', 'host', 'port', 'relative', 'path', 'directory', 'file', 'query', 'anchor'],
    q: {
      name: 'queryKey',
      parser: /(?:^|&)([^&=]*)=?([^&]*)/g
    },
    parser: {
      strict: /^(?:([^:\/?#]+):)?(?:\/\/((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?))?((((?:[^?#\/]*\/)*)([^?#]*))(?:\?([^#]*))?(?:#(.*))?)/,
      loose: /^(?:(?![^:@]+:[^:@\/]*@)([^:\/?#.]+):)?(?:\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/
    }
  }
  var m = o.parser[opts.strictMode ? 'strict' : 'loose'].exec(str)
  var uri = {}
  var i = 14
  while (i--) uri[o.key[i]] = m[i] || ''
  uri[o.q.name] = {}
  uri[o.key[12]].replace(o.q.parser, function ($0, $1, $2) {
    if ($1) uri[o.q.name][$1] = $2
  })
  return uri
}
},{}],8:[function(require,module,exports){
(function (process){
function normalizeArray(parts, allowAboveRoot) {
  var up = 0;
  for (var i = parts.length - 1; i >= 0; i--) {
    var last = parts[i];
    if (last === '.') {
      parts.splice(i, 1);
    } else if (last === '..') {
      parts.splice(i, 1);
      up++;
    } else if (up) {
      parts.splice(i, 1);
      up--;
    }
  }
  if (allowAboveRoot) {
    for (; up--; up) {
      parts.unshift('..');
    }
  }
  return parts;
}
var splitPathRe =
    /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;
var splitPath = function(filename) {
  return splitPathRe.exec(filename).slice(1);
};
exports.resolve = function() {
  var resolvedPath = '',
      resolvedAbsolute = false;
  for (var i = arguments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
    var path = (i >= 0) ? arguments[i] : process.cwd();
    if (typeof path !== 'string') {
      throw new TypeError('Arguments to path.resolve must be strings');
    } else if (!path) {
      continue;
    }
    resolvedPath = path + '/' + resolvedPath;
    resolvedAbsolute = path.charAt(0) === '/';
  }
  resolvedPath = normalizeArray(filter(resolvedPath.split('/'), function(p) {
    return !!p;
  }), !resolvedAbsolute).join('/');
  return ((resolvedAbsolute ? '/' : '') + resolvedPath) || '.';
};
exports.normalize = function(path) {
  var isAbsolute = exports.isAbsolute(path),
      trailingSlash = substr(path, -1) === '/';
  path = normalizeArray(filter(path.split('/'), function(p) {
    return !!p;
  }), !isAbsolute).join('/');
  if (!path && !isAbsolute) {
    path = '.';
  }
  if (path && trailingSlash) {
    path += '/';
  }
  return (isAbsolute ? '/' : '') + path;
};
exports.isAbsolute = function(path) {
  return path.charAt(0) === '/';
};
exports.join = function() {
  var paths = Array.prototype.slice.call(arguments, 0);
  return exports.normalize(filter(paths, function(p, index) {
    if (typeof p !== 'string') {
      throw new TypeError('Arguments to path.join must be strings');
    }
    return p;
  }).join('/'));
};
exports.relative = function(from, to) {
  from = exports.resolve(from).substr(1);
  to = exports.resolve(to).substr(1);
  function trim(arr) {
    var start = 0;
    for (; start < arr.length; start++) {
      if (arr[start] !== '') break;
    }
    var end = arr.length - 1;
    for (; end >= 0; end--) {
      if (arr[end] !== '') break;
    }
    if (start > end) return [];
    return arr.slice(start, end - start + 1);
  }
  var fromParts = trim(from.split('/'));
  var toParts = trim(to.split('/'));
  var length = Math.min(fromParts.length, toParts.length);
  var samePartsLength = length;
  for (var i = 0; i < length; i++) {
    if (fromParts[i] !== toParts[i]) {
      samePartsLength = i;
      break;
    }
  }
  var outputParts = [];
  for (var i = samePartsLength; i < fromParts.length; i++) {
    outputParts.push('..');
  }
  outputParts = outputParts.concat(toParts.slice(samePartsLength));
  return outputParts.join('/');
};
exports.sep = '/';
exports.delimiter = ':';
exports.dirname = function(path) {
  var result = splitPath(path),
      root = result[0],
      dir = result[1];
  if (!root && !dir) {
    return '.';
  }
  if (dir) {
    dir = dir.substr(0, dir.length - 1);
  }
  return root + dir;
};
exports.basename = function(path, ext) {
  var f = splitPath(path)[2];
  if (ext && f.substr(-1 * ext.length) === ext) {
    f = f.substr(0, f.length - ext.length);
  }
  return f;
};
exports.extname = function(path) {
  return splitPath(path)[3];
};
function filter (xs, f) {
    if (xs.filter) return xs.filter(f);
    var res = [];
    for (var i = 0; i < xs.length; i++) {
        if (f(xs[i], i, xs)) res.push(xs[i]);
    }
    return res;
}
var substr = 'ab'.substr(-1) === 'b'
    ? function (str, start, len) { return str.substr(start, len) }
    : function (str, start, len) {
        if (start < 0) start = str.length + start;
        return str.substr(start, len);
    }
;
}).call(this,require('_process'))
},{"_process":26}],9:[function(require,module,exports){
var EMPTY_ARRAY_BUFFER = new ArrayBuffer(0);
var Buffer = function(gl, type, data, drawType)
{
	this.gl = gl;
	this.buffer = gl.createBuffer();
	this.type = type || gl.ARRAY_BUFFER;
	this.drawType = drawType || gl.STATIC_DRAW;
	this.data = EMPTY_ARRAY_BUFFER;
	if(data)
	{
		this.upload(data);
	}
	this._updateID = 0;
};
Buffer.prototype.upload = function(data, offset, dontBind)
{
	if(!dontBind) this.bind();
	var gl = this.gl;
	data = data || this.data;
	offset = offset || 0;
	if(this.data.byteLength >= data.byteLength)
	{
		gl.bufferSubData(this.type, offset, data);
	}
	else
	{
		gl.bufferData(this.type, data, this.drawType);
	}
	this.data = data;
};
Buffer.prototype.bind = function()
{
	var gl = this.gl;
	gl.bindBuffer(this.type, this.buffer);
};
Buffer.createVertexBuffer = function(gl, data, drawType)
{
	return new Buffer(gl, gl.ARRAY_BUFFER, data, drawType);
};
Buffer.createIndexBuffer = function(gl, data, drawType)
{
	return new Buffer(gl, gl.ELEMENT_ARRAY_BUFFER, data, drawType);
};
Buffer.create = function(gl, type, data, drawType)
{
	return new Buffer(gl, type, data, drawType);
};
Buffer.prototype.destroy = function(){
	this.gl.deleteBuffer(this.buffer);
};
module.exports = Buffer;
},{}],10:[function(require,module,exports){
var Texture = require('./GLTexture');
var Framebuffer = function(gl, width, height)
{
    this.gl = gl;
    this.framebuffer = gl.createFramebuffer();
    this.stencil = null;
    this.texture = null;
    this.width = width || 100;
    this.height = height || 100;
};
Framebuffer.prototype.enableTexture = function(texture)
{
    var gl = this.gl;
    this.texture = texture || new Texture(gl);
    this.texture.bind();
    this.bind();
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.texture.texture, 0);
};
Framebuffer.prototype.enableStencil = function()
{
    if(this.stencil)return;
    var gl = this.gl;
    this.stencil = gl.createRenderbuffer();
    gl.bindRenderbuffer(gl.RENDERBUFFER, this.stencil);
    gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_STENCIL_ATTACHMENT, gl.RENDERBUFFER, this.stencil);
    gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_STENCIL,  this.width  , this.height );
};
Framebuffer.prototype.clear = function( r, g, b, a )
{
    this.bind();
    var gl = this.gl;
    gl.clearColor(r, g, b, a);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
};
Framebuffer.prototype.bind = function()
{
    var gl = this.gl;
    gl.bindFramebuffer(gl.FRAMEBUFFER, this.framebuffer );
};
Framebuffer.prototype.unbind = function()
{
    var gl = this.gl;
    gl.bindFramebuffer(gl.FRAMEBUFFER, null );
};
Framebuffer.prototype.resize = function(width, height)
{
    var gl = this.gl;
    this.width = width;
    this.height = height;
    if ( this.texture )
    {
        this.texture.uploadData(null, width, height);
    }
    if ( this.stencil )
    {
        gl.bindRenderbuffer(gl.RENDERBUFFER, this.stencil);
        gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_STENCIL, width, height);
    }
};
Framebuffer.prototype.destroy = function()
{
    var gl = this.gl;
    if(this.texture)
    {
        this.texture.destroy();
    }
    gl.deleteFramebuffer(this.framebuffer);
    this.gl = null;
    this.stencil = null;
    this.texture = null;
};
Framebuffer.createRGBA = function(gl, width, height, data)
{
    var texture = Texture.fromData(gl, null, width, height);
    texture.enableNearestScaling();
    texture.enableWrapClamp();
    var fbo = new Framebuffer(gl, width, height);
    fbo.enableTexture(texture);
    fbo.unbind();
    return fbo;
};
Framebuffer.createFloat32 = function(gl, width, height, data)
{
    var texture = new Texture.fromData(gl, data, width, height);
    texture.enableNearestScaling();
    texture.enableWrapClamp();
    var fbo = new Framebuffer(gl, width, height);
    fbo.enableTexture(texture);
    fbo.unbind();
    return fbo;
};
module.exports = Framebuffer;
},{"./GLTexture":12}],11:[function(require,module,exports){
var compileProgram = require('./shader/compileProgram'),
	extractAttributes = require('./shader/extractAttributes'),
	extractUniforms = require('./shader/extractUniforms'),
	setPrecision = require('./shader/setPrecision'),
	generateUniformAccessObject = require('./shader/generateUniformAccessObject');
var Shader = function(gl, vertexSrc, fragmentSrc, precision, attributeLocations)
{
	this.gl = gl;
	if(precision)
	{
		vertexSrc = setPrecision(vertexSrc, precision);
		fragmentSrc = setPrecision(fragmentSrc, precision);
	}
	this.program = compileProgram(gl, vertexSrc, fragmentSrc, attributeLocations);
	this.attributes = extractAttributes(gl, this.program);
    this.uniformData = extractUniforms(gl, this.program);
	this.uniforms = generateUniformAccessObject( gl, this.uniformData );
};
Shader.prototype.bind = function()
{
	this.gl.useProgram(this.program);
	return this;
};
Shader.prototype.destroy = function()
{
	this.attributes = null;
	this.uniformData = null;
	this.uniforms = null;
	var gl = this.gl;
	gl.deleteProgram(this.program);
};
module.exports = Shader;
},{"./shader/compileProgram":17,"./shader/extractAttributes":19,"./shader/extractUniforms":20,"./shader/generateUniformAccessObject":21,"./shader/setPrecision":25}],12:[function(require,module,exports){
var Texture = function(gl, width, height, format, type)
{
	this.gl = gl;
	this.texture = gl.createTexture();
	this.mipmap = false;
	this.premultiplyAlpha = false;
	this.width = width || -1;
	this.height = height || -1;
	this.format = format || gl.RGBA;
	this.type = type || gl.UNSIGNED_BYTE;
};
Texture.prototype.upload = function(source)
{
	this.bind();
	var gl = this.gl;
	gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, this.premultiplyAlpha);
	var newWidth = source.videoWidth || source.width;
	var newHeight = source.videoHeight || source.height;
	if(newHeight !== this.height || newWidth !== this.width)
	{
		gl.texImage2D(gl.TEXTURE_2D, 0, this.format, this.format, this.type, source);
	}
	else
	{
    	gl.texSubImage2D(gl.TEXTURE_2D, 0, 0, 0, this.format, this.type, source);
	}
	this.width = newWidth;
	this.height = newHeight;
};
var FLOATING_POINT_AVAILABLE = false;
Texture.prototype.uploadData = function(data, width, height)
{
	this.bind();
	var gl = this.gl;
	if(data instanceof Float32Array)
	{
		if(!FLOATING_POINT_AVAILABLE)
		{
			var ext = gl.getExtension("OES_texture_float");
			if(ext)
			{
				FLOATING_POINT_AVAILABLE = true;
			}
			else
			{
				throw new Error('floating point textures not available');
			}
		}
		this.type = gl.FLOAT;
	}
	else
	{
		this.type = this.type || gl.UNSIGNED_BYTE;
	}
	gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, this.premultiplyAlpha);
	if(width !== this.width || height !== this.height)
	{
		gl.texImage2D(gl.TEXTURE_2D, 0, this.format,  width, height, 0, this.format, this.type, data || null);
	}
	else
	{
		gl.texSubImage2D(gl.TEXTURE_2D, 0, 0, 0, width, height, this.format, this.type, data || null);
	}
	this.width = width;
	this.height = height;
};
Texture.prototype.bind = function(location)
{
	var gl = this.gl;
	if(location !== undefined)
	{
		gl.activeTexture(gl.TEXTURE0 + location);
	}
	gl.bindTexture(gl.TEXTURE_2D, this.texture);
};
Texture.prototype.unbind = function()
{
	var gl = this.gl;
	gl.bindTexture(gl.TEXTURE_2D, null);
};
Texture.prototype.minFilter = function( linear )
{
	var gl = this.gl;
	this.bind();
	if(this.mipmap)
	{
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, linear ? gl.LINEAR_MIPMAP_LINEAR : gl.NEAREST_MIPMAP_NEAREST);
	}
	else
	{
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, linear ? gl.LINEAR : gl.NEAREST);
	}
};
Texture.prototype.magFilter = function( linear )
{
	var gl = this.gl;
	this.bind();
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, linear ? gl.LINEAR : gl.NEAREST);
};
Texture.prototype.enableMipmap = function()
{
	var gl = this.gl;
	this.bind();
	this.mipmap = true;
	gl.generateMipmap(gl.TEXTURE_2D);
};
Texture.prototype.enableLinearScaling = function()
{
	this.minFilter(true);
	this.magFilter(true);
};
Texture.prototype.enableNearestScaling = function()
{
	this.minFilter(false);
	this.magFilter(false);
};
Texture.prototype.enableWrapClamp = function()
{
	var gl = this.gl;
	this.bind();
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
};
Texture.prototype.enableWrapRepeat = function()
{
	var gl = this.gl;
	this.bind();
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
};
Texture.prototype.enableWrapMirrorRepeat = function()
{
	var gl = this.gl;
	this.bind();
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.MIRRORED_REPEAT);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.MIRRORED_REPEAT);
};
Texture.prototype.destroy = function()
{
	var gl = this.gl;
	gl.deleteTexture(this.texture);
};
Texture.fromSource = function(gl, source, premultiplyAlpha)
{
	var texture = new Texture(gl);
	texture.premultiplyAlpha = premultiplyAlpha || false;
	texture.upload(source);
	return texture;
};
Texture.fromData = function(gl, data, width, height)
{
	var texture = new Texture(gl);
	texture.uploadData(data, width, height);
	return texture;
};
module.exports = Texture;
},{}],13:[function(require,module,exports){
var setVertexAttribArrays = require( './setVertexAttribArrays' );
function VertexArrayObject(gl, state)
{
    this.nativeVaoExtension = null;
    if(!VertexArrayObject.FORCE_NATIVE)
    {
        this.nativeVaoExtension = gl.getExtension('OES_vertex_array_object') ||
                                  gl.getExtension('MOZ_OES_vertex_array_object') ||
                                  gl.getExtension('WEBKIT_OES_vertex_array_object');
    }
    this.nativeState = state;
    if(this.nativeVaoExtension)
    {
        this.nativeVao = this.nativeVaoExtension.createVertexArrayOES();
        var maxAttribs = gl.getParameter(gl.MAX_VERTEX_ATTRIBS);
        this.nativeState = {
            tempAttribState: new Array(maxAttribs),
            attribState: new Array(maxAttribs)
        };
    }
    this.gl = gl;
    this.attributes = [];
    this.indexBuffer = null;
    this.dirty = false;
}
VertexArrayObject.prototype.constructor = VertexArrayObject;
module.exports = VertexArrayObject;
VertexArrayObject.FORCE_NATIVE = false;
VertexArrayObject.prototype.bind = function()
{
    if(this.nativeVao)
    {
        this.nativeVaoExtension.bindVertexArrayOES(this.nativeVao);
        if(this.dirty)
        {
            this.dirty = false;
            this.activate();
            return this;
        }
        if (this.indexBuffer)
        {
            this.indexBuffer.bind();
        }
    }
    else
    {
        this.activate();
    }
    return this;
};
VertexArrayObject.prototype.unbind = function()
{
    if(this.nativeVao)
    {
        this.nativeVaoExtension.bindVertexArrayOES(null);
    }
    return this;
};
VertexArrayObject.prototype.activate = function()
{
    var gl = this.gl;
    var lastBuffer = null;
    for (var i = 0; i < this.attributes.length; i++)
    {
        var attrib = this.attributes[i];
        if(lastBuffer !== attrib.buffer)
        {
            attrib.buffer.bind();
            lastBuffer = attrib.buffer;
        }
        gl.vertexAttribPointer(attrib.attribute.location,
                               attrib.attribute.size,
                               attrib.type || gl.FLOAT,
                               attrib.normalized || false,
                               attrib.stride || 0,
                               attrib.start || 0);
    }
    setVertexAttribArrays(gl, this.attributes, this.nativeState);
    if(this.indexBuffer)
    {
        this.indexBuffer.bind();
    }
    return this;
};
VertexArrayObject.prototype.addAttribute = function(buffer, attribute, type, normalized, stride, start)
{
    this.attributes.push({
        buffer:     buffer,
        attribute:  attribute,
        location:   attribute.location,
        type:       type || this.gl.FLOAT,
        normalized: normalized || false,
        stride:     stride || 0,
        start:      start || 0
    });
    this.dirty = true;
    return this;
};
VertexArrayObject.prototype.addIndex = function(buffer)
{
    this.indexBuffer = buffer;
    this.dirty = true;
    return this;
};
VertexArrayObject.prototype.clear = function()
{
    if(this.nativeVao)
    {
        this.nativeVaoExtension.bindVertexArrayOES(this.nativeVao);
    }
    this.attributes.length = 0;
    this.indexBuffer = null;
    return this;
};
VertexArrayObject.prototype.draw = function(type, size, start)
{
    var gl = this.gl;
    if(this.indexBuffer)
    {
        gl.drawElements(type, size || this.indexBuffer.data.length, gl.UNSIGNED_SHORT, (start || 0) * 2 );
    }
    else
    {
        gl.drawArrays(type, start, size || this.getSize());
    }
    return this;
};
VertexArrayObject.prototype.destroy = function()
{
    this.gl = null;
    this.indexBuffer = null;
    this.attributes = null;
    this.nativeState = null;
    if(this.nativeVao)
    {
        this.nativeVaoExtension.deleteVertexArrayOES(this.nativeVao);
    }
    this.nativeVaoExtension = null;
    this.nativeVao = null;
};
VertexArrayObject.prototype.getSize = function()
{
    var attrib = this.attributes[0];
    return attrib.buffer.data.length / (( attrib.stride/4 ) || attrib.attribute.size);
};
},{"./setVertexAttribArrays":16}],14:[function(require,module,exports){
var createContext = function(canvas, options)
{
    var gl = canvas.getContext('webgl', options) || 
         canvas.getContext('experimental-webgl', options);
    if (!gl)
    {
        throw new Error('This browser does not support webGL. Try using the canvas renderer');
    }
    return gl;
};
module.exports = createContext;
},{}],15:[function(require,module,exports){
var gl = {
    createContext:          require('./createContext'),
    setVertexAttribArrays:  require('./setVertexAttribArrays'),
    GLBuffer:               require('./GLBuffer'),
    GLFramebuffer:          require('./GLFramebuffer'),
    GLShader:               require('./GLShader'),
    GLTexture:              require('./GLTexture'),
    VertexArrayObject:      require('./VertexArrayObject'),
    shader:                 require('./shader')
};
if (typeof module !== 'undefined' && module.exports)
{
    module.exports = gl;
}
if (typeof window !== 'undefined')
{
    window.PIXI = window.PIXI || {};
    window.PIXI.glCore = gl;
}
},{"./GLBuffer":9,"./GLFramebuffer":10,"./GLShader":11,"./GLTexture":12,"./VertexArrayObject":13,"./createContext":14,"./setVertexAttribArrays":16,"./shader":22}],16:[function(require,module,exports){
var setVertexAttribArrays = function (gl, attribs, state)
{
    var i;
    if(state)
    {
        var tempAttribState = state.tempAttribState,
            attribState = state.attribState;
        for (i = 0; i < tempAttribState.length; i++)
        {
            tempAttribState[i] = false;
        }
        for (i = 0; i < attribs.length; i++)
        {
            tempAttribState[attribs[i].attribute.location] = true;
        }
        for (i = 0; i < attribState.length; i++)
        {
            if (attribState[i] !== tempAttribState[i])
            {
                attribState[i] = tempAttribState[i];
                if (state.attribState[i])
                {
                    gl.enableVertexAttribArray(i);
                }
                else
                {
                    gl.disableVertexAttribArray(i);
                }
            }
        }
    }
    else
    {
        for (i = 0; i < attribs.length; i++)
        {
            var attrib = attribs[i];
            gl.enableVertexAttribArray(attrib.attribute.location);
        }
    }
};
module.exports = setVertexAttribArrays;
},{}],17:[function(require,module,exports){
var compileProgram = function(gl, vertexSrc, fragmentSrc, attributeLocations)
{
    var glVertShader = compileShader(gl, gl.VERTEX_SHADER, vertexSrc);
    var glFragShader = compileShader(gl, gl.FRAGMENT_SHADER, fragmentSrc);
    var program = gl.createProgram();
    gl.attachShader(program, glVertShader);
    gl.attachShader(program, glFragShader);
    if(attributeLocations)
    {
        for(var i in attributeLocations)
        {
            gl.bindAttribLocation(program, attributeLocations[i], i);
        }
    }
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS))
    {
        console.error('Pixi.js Error: Could not initialize shader.');
        console.error('gl.VALIDATE_STATUS', gl.getProgramParameter(program, gl.VALIDATE_STATUS));
        console.error('gl.getError()', gl.getError());
        if (gl.getProgramInfoLog(program) !== '')
        {
            console.warn('Pixi.js Warning: gl.getProgramInfoLog()', gl.getProgramInfoLog(program));
        }
        gl.deleteProgram(program);
        program = null;
    }
    gl.deleteShader(glVertShader);
    gl.deleteShader(glFragShader);
    return program;
};
var compileShader = function (gl, type, src)
{
    var shader = gl.createShader(type);
    gl.shaderSource(shader, src);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS))
    {
        console.log(gl.getShaderInfoLog(shader));
        return null;
    }
    return shader;
};
module.exports = compileProgram;
},{}],18:[function(require,module,exports){
var defaultValue = function(type, size) 
{
    switch (type)
    {
        case 'float':
            return 0;
        case 'vec2': 
            return new Float32Array(2 * size);
        case 'vec3':
            return new Float32Array(3 * size);
        case 'vec4':     
            return new Float32Array(4 * size);
                    case 'int':
        case 'sampler2D':
            return 0;
        case 'ivec2':   
            return new Int32Array(2 * size);
        case 'ivec3':
            return new Int32Array(3 * size);
        case 'ivec4': 
            return new Int32Array(4 * size);
        case 'bool':     
            return false;
        case 'bvec2':
            return booleanArray( 2 * size);
        case 'bvec3':
            return booleanArray(3 * size);
        case 'bvec4':
            return booleanArray(4 * size);
        case 'mat2':
            return new Float32Array([1, 0,
                                     0, 1]);
        case 'mat3': 
            return new Float32Array([1, 0, 0,
                                     0, 1, 0,
                                     0, 0, 1]);
        case 'mat4':
            return new Float32Array([1, 0, 0, 0,
                                     0, 1, 0, 0,
                                     0, 0, 1, 0,
                                     0, 0, 0, 1]);
    }
};
var booleanArray = function(size)
{
    var array = new Array(size);
    for (var i = 0; i < array.length; i++) 
    {
        array[i] = false;
    }
    return array;
};
module.exports = defaultValue;
},{}],19:[function(require,module,exports){
var mapType = require('./mapType');
var mapSize = require('./mapSize');
var extractAttributes = function(gl, program)
{
    var attributes = {};
    var totalAttributes = gl.getProgramParameter(program, gl.ACTIVE_ATTRIBUTES);
    for (var i = 0; i < totalAttributes; i++)
    {
        var attribData = gl.getActiveAttrib(program, i);
        var type = mapType(gl, attribData.type);
        attributes[attribData.name] = {
            type:type,
            size:mapSize(type),
            location:gl.getAttribLocation(program, attribData.name),
            pointer: pointer
        };
    }
    return attributes;
};
var pointer = function(type, normalized, stride, start){
    gl.vertexAttribPointer(this.location,this.size, type || gl.FLOAT, normalized || false, stride || 0, start || 0);
};
module.exports = extractAttributes;
},{"./mapSize":23,"./mapType":24}],20:[function(require,module,exports){
var mapType = require('./mapType');
var defaultValue = require('./defaultValue');
var extractUniforms = function(gl, program)
{
	var uniforms = {};
    var totalUniforms = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);
    for (var i = 0; i < totalUniforms; i++)
    {
    	var uniformData = gl.getActiveUniform(program, i);
    	var name = uniformData.name.replace(/\[.*?\]/, "");
        var type = mapType(gl, uniformData.type );
    	uniforms[name] = {
    		type:type,
    		size:uniformData.size,
    		location:gl.getUniformLocation(program, name),
    		value:defaultValue(type, uniformData.size)
    	};
    }
	return uniforms;
};
module.exports = extractUniforms;
},{"./defaultValue":18,"./mapType":24}],21:[function(require,module,exports){
var generateUniformAccessObject = function(gl, uniformData)
{
    var uniforms = {data:{}};
    uniforms.gl = gl;
    var uniformKeys= Object.keys(uniformData);
    for (var i = 0; i < uniformKeys.length; i++)
    {
        var fullName = uniformKeys[i];
        var nameTokens = fullName.split('.');
        var name = nameTokens[nameTokens.length - 1];
        var uniformGroup = getUniformGroup(nameTokens, uniforms);
        var uniform =  uniformData[fullName];
        uniformGroup.data[name] = uniform;
        uniformGroup.gl = gl;
        Object.defineProperty(uniformGroup, name, {
            get: generateGetter(name),
            set: generateSetter(name, uniform)
        });
    }
    return uniforms;
};
var generateGetter = function(name)
{
    return function() {
        return this.data[name].value;
    };
};
var GLSL_SINGLE_SETTERS = {
    float: function setSingleFloat(gl, location, value) { gl.uniform1f(location, value); },
    vec2: function setSingleVec2(gl, location, value) { gl.uniform2f(location, value[0], value[1]); },
    vec3: function setSingleVec3(gl, location, value) { gl.uniform3f(location, value[0], value[1], value[2]); },
    vec4: function setSingleVec4(gl, location, value) { gl.uniform4f(location, value[0], value[1], value[2], value[3]); },
    int: function setSingleInt(gl, location, value) { gl.uniform1i(location, value); },
    ivec2: function setSingleIvec2(gl, location, value) { gl.uniform2i(location, value[0], value[1]); },
    ivec3: function setSingleIvec3(gl, location, value) { gl.uniform3i(location, value[0], value[1], value[2]); },
    ivec4: function setSingleIvec4(gl, location, value) { gl.uniform4i(location, value[0], value[1], value[2], value[3]); },
    bool: function setSingleBool(gl, location, value) { gl.uniform1i(location, value); },
    bvec2: function setSingleBvec2(gl, location, value) { gl.uniform2i(location, value[0], value[1]); },
    bvec3: function setSingleBvec3(gl, location, value) { gl.uniform3i(location, value[0], value[1], value[2]); },
    bvec4: function setSingleBvec4(gl, location, value) { gl.uniform4i(location, value[0], value[1], value[2], value[3]); },
    mat2: function setSingleMat2(gl, location, value) { gl.uniformMatrix2fv(location, false, value); },
    mat3: function setSingleMat3(gl, location, value) { gl.uniformMatrix3fv(location, false, value); },
    mat4: function setSingleMat4(gl, location, value) { gl.uniformMatrix4fv(location, false, value); },
    sampler2D: function setSingleSampler2D(gl, location, value) { gl.uniform1i(location, value); },
};
var GLSL_ARRAY_SETTERS = {
    float: function setFloatArray(gl, location, value) { gl.uniform1fv(location, value); },
    vec2: function setVec2Array(gl, location, value) { gl.uniform2fv(location, value); },
    vec3: function setVec3Array(gl, location, value) { gl.uniform3fv(location, value); },
    vec4: function setVec4Array(gl, location, value) { gl.uniform4fv(location, value); },
    int: function setIntArray(gl, location, value) { gl.uniform1iv(location, value); },
    ivec2: function setIvec2Array(gl, location, value) { gl.uniform2iv(location, value); },
    ivec3: function setIvec3Array(gl, location, value) { gl.uniform3iv(location, value); },
    ivec4: function setIvec4Array(gl, location, value) { gl.uniform4iv(location, value); },
    bool: function setBoolArray(gl, location, value) { gl.uniform1iv(location, value); },
    bvec2: function setBvec2Array(gl, location, value) { gl.uniform2iv(location, value); },
    bvec3: function setBvec3Array(gl, location, value) { gl.uniform3iv(location, value); },
    bvec4: function setBvec4Array(gl, location, value) { gl.uniform4iv(location, value); },
    sampler2D: function setSampler2DArray(gl, location, value) { gl.uniform1iv(location, value); },
};
function generateSetter(name, uniform)
{
    return function(value) {
        this.data[name].value = value;
        var location = this.data[name].location;
        if (uniform.size === 1)
        {
            GLSL_SINGLE_SETTERS[uniform.type](this.gl, location, value);
        }
        else
        {
            GLSL_ARRAY_SETTERS[uniform.type](this.gl, location, value);
        }
    };
}
function getUniformGroup(nameTokens, uniform)
{
    var cur = uniform;
    for (var i = 0; i < nameTokens.length - 1; i++)
    {
        var o = cur[nameTokens[i]] || {data:{}};
        cur[nameTokens[i]] = o;
        cur = o;
    }
    return cur;
}
module.exports = generateUniformAccessObject;
},{}],22:[function(require,module,exports){
module.exports = {
    compileProgram: require('./compileProgram'),
    defaultValue: require('./defaultValue'),
    extractAttributes: require('./extractAttributes'),
    extractUniforms: require('./extractUniforms'),
    generateUniformAccessObject: require('./generateUniformAccessObject'),
    setPrecision: require('./setPrecision'),
    mapSize: require('./mapSize'),
    mapType: require('./mapType')
};
},{"./compileProgram":17,"./defaultValue":18,"./extractAttributes":19,"./extractUniforms":20,"./generateUniformAccessObject":21,"./mapSize":23,"./mapType":24,"./setPrecision":25}],23:[function(require,module,exports){
var mapSize = function(type) 
{ 
    return GLSL_TO_SIZE[type];
};
var GLSL_TO_SIZE = {
    'float':    1,
    'vec2':     2,
    'vec3':     3,
    'vec4':     4,
    'int':      1,
    'ivec2':    2,
    'ivec3':    3,
    'ivec4':    4,
    'bool':     1,
    'bvec2':    2,
    'bvec3':    3,
    'bvec4':    4,
    'mat2':     4,
    'mat3':     9,
    'mat4':     16,
    'sampler2D':  1
};
module.exports = mapSize;
},{}],24:[function(require,module,exports){
var mapType = function(gl, type) 
{
    if(!GL_TABLE) 
    {
        var typeNames = Object.keys(GL_TO_GLSL_TYPES);
        GL_TABLE = {};
        for(var i = 0; i < typeNames.length; ++i) 
        {
            var tn = typeNames[i];
            GL_TABLE[ gl[tn] ] = GL_TO_GLSL_TYPES[tn];
        }
    }
  return GL_TABLE[type];
};
var GL_TABLE = null;
var GL_TO_GLSL_TYPES = {
  'FLOAT':       'float',
  'FLOAT_VEC2':  'vec2',
  'FLOAT_VEC3':  'vec3',
  'FLOAT_VEC4':  'vec4',
  'INT':         'int',
  'INT_VEC2':    'ivec2',
  'INT_VEC3':    'ivec3',
  'INT_VEC4':    'ivec4',
    'BOOL':        'bool',
  'BOOL_VEC2':   'bvec2',
  'BOOL_VEC3':   'bvec3',
  'BOOL_VEC4':   'bvec4',
    'FLOAT_MAT2':  'mat2',
  'FLOAT_MAT3':  'mat3',
  'FLOAT_MAT4':  'mat4',
    'SAMPLER_2D':  'sampler2D'  
};
module.exports = mapType;
},{}],25:[function(require,module,exports){
var setPrecision = function(src, precision)
{
    if(src.substring(0, 9) !== 'precision')
    {
        return 'precision ' + precision + ' float;\n' + src;
    }
    return src;
};
module.exports = setPrecision;
},{}],26:[function(require,module,exports){
var process = module.exports = {};
var cachedSetTimeout;
var cachedClearTimeout;
function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        return setTimeout(fun, 0);
    }
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            return cachedSetTimeout.call(this, fun, 0);
        }
    }
}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        return clearTimeout(marker);
    }
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            return cachedClearTimeout.call(this, marker);
        }
    }
}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;
function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}
function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;
    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}
process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; 
process.versions = {};
function noop() {}
process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;
process.listeners = function (name) { return [] }
process.binding = function (name) {
    throw new Error('process.binding is not supported');
};
process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };
},{}],27:[function(require,module,exports){
(function (global){
/*! https://mths.be/punycode v1.4.1 by @mathias */
;(function(root) {
	var freeExports = typeof exports == 'object' && exports &&
		!exports.nodeType && exports;
	var freeModule = typeof module == 'object' && module &&
		!module.nodeType && module;
	var freeGlobal = typeof global == 'object' && global;
	if (
		freeGlobal.global === freeGlobal ||
		freeGlobal.window === freeGlobal ||
		freeGlobal.self === freeGlobal
	) {
		root = freeGlobal;
	}
	var punycode,
	maxInt = 2147483647, 
	base = 36,
	tMin = 1,
	tMax = 26,
	skew = 38,
	damp = 700,
	initialBias = 72,
	initialN = 128, 
	delimiter = '-', 
	regexPunycode = /^xn--/,
	regexNonASCII = /[^\x20-\x7E]/, 
	regexSeparators = /[\x2E\u3002\uFF0E\uFF61]/g, 
	errors = {
		'overflow': 'Overflow: input needs wider integers to process',
		'not-basic': 'Illegal input >= 0x80 (not a basic code point)',
		'invalid-input': 'Invalid input'
	},
	baseMinusTMin = base - tMin,
	floor = Math.floor,
	stringFromCharCode = String.fromCharCode,
	key;
	function error(type) {
		throw new RangeError(errors[type]);
	}
	function map(array, fn) {
		var length = array.length;
		var result = [];
		while (length--) {
			result[length] = fn(array[length]);
		}
		return result;
	}
	function mapDomain(string, fn) {
		var parts = string.split('@');
		var result = '';
		if (parts.length > 1) {
			result = parts[0] + '@';
			string = parts[1];
		}
		string = string.replace(regexSeparators, '\x2E');
		var labels = string.split('.');
		var encoded = map(labels, fn).join('.');
		return result + encoded;
	}
	function ucs2decode(string) {
		var output = [],
		    counter = 0,
		    length = string.length,
		    value,
		    extra;
		while (counter < length) {
			value = string.charCodeAt(counter++);
			if (value >= 0xD800 && value <= 0xDBFF && counter < length) {
				extra = string.charCodeAt(counter++);
				if ((extra & 0xFC00) == 0xDC00) { 
					output.push(((value & 0x3FF) << 10) + (extra & 0x3FF) + 0x10000);
				} else {
					output.push(value);
					counter--;
				}
			} else {
				output.push(value);
			}
		}
		return output;
	}
	function ucs2encode(array) {
		return map(array, function(value) {
			var output = '';
			if (value > 0xFFFF) {
				value -= 0x10000;
				output += stringFromCharCode(value >>> 10 & 0x3FF | 0xD800);
				value = 0xDC00 | value & 0x3FF;
			}
			output += stringFromCharCode(value);
			return output;
		}).join('');
	}
	function basicToDigit(codePoint) {
		if (codePoint - 48 < 10) {
			return codePoint - 22;
		}
		if (codePoint - 65 < 26) {
			return codePoint - 65;
		}
		if (codePoint - 97 < 26) {
			return codePoint - 97;
		}
		return base;
	}
	function digitToBasic(digit, flag) {
		return digit + 22 + 75 * (digit < 26) - ((flag != 0) << 5);
	}
	function adapt(delta, numPoints, firstTime) {
		var k = 0;
		delta = firstTime ? floor(delta / damp) : delta >> 1;
		delta += floor(delta / numPoints);
		for (; delta > baseMinusTMin * tMax >> 1; k += base) {
			delta = floor(delta / baseMinusTMin);
		}
		return floor(k + (baseMinusTMin + 1) * delta / (delta + skew));
	}
	function decode(input) {
		var output = [],
		    inputLength = input.length,
		    out,
		    i = 0,
		    n = initialN,
		    bias = initialBias,
		    basic,
		    j,
		    index,
		    oldi,
		    w,
		    k,
		    digit,
		    t,
		    baseMinusT;
		basic = input.lastIndexOf(delimiter);
		if (basic < 0) {
			basic = 0;
		}
		for (j = 0; j < basic; ++j) {
			if (input.charCodeAt(j) >= 0x80) {
				error('not-basic');
			}
			output.push(input.charCodeAt(j));
		}
		for (index = basic > 0 ? basic + 1 : 0; index < inputLength; ) {
			for (oldi = i, w = 1, k = base; ; k += base) {
				if (index >= inputLength) {
					error('invalid-input');
				}
				digit = basicToDigit(input.charCodeAt(index++));
				if (digit >= base || digit > floor((maxInt - i) / w)) {
					error('overflow');
				}
				i += digit * w;
				t = k <= bias ? tMin : (k >= bias + tMax ? tMax : k - bias);
				if (digit < t) {
					break;
				}
				baseMinusT = base - t;
				if (w > floor(maxInt / baseMinusT)) {
					error('overflow');
				}
				w *= baseMinusT;
			}
			out = output.length + 1;
			bias = adapt(i - oldi, out, oldi == 0);
			if (floor(i / out) > maxInt - n) {
				error('overflow');
			}
			n += floor(i / out);
			i %= out;
			output.splice(i++, 0, n);
		}
		return ucs2encode(output);
	}
	function encode(input) {
		var n,
		    delta,
		    handledCPCount,
		    basicLength,
		    bias,
		    j,
		    m,
		    q,
		    k,
		    t,
		    currentValue,
		    output = [],
		    inputLength,
		    handledCPCountPlusOne,
		    baseMinusT,
		    qMinusT;
		input = ucs2decode(input);
		inputLength = input.length;
		n = initialN;
		delta = 0;
		bias = initialBias;
		for (j = 0; j < inputLength; ++j) {
			currentValue = input[j];
			if (currentValue < 0x80) {
				output.push(stringFromCharCode(currentValue));
			}
		}
		handledCPCount = basicLength = output.length;
		if (basicLength) {
			output.push(delimiter);
		}
		while (handledCPCount < inputLength) {
			for (m = maxInt, j = 0; j < inputLength; ++j) {
				currentValue = input[j];
				if (currentValue >= n && currentValue < m) {
					m = currentValue;
				}
			}
			handledCPCountPlusOne = handledCPCount + 1;
			if (m - n > floor((maxInt - delta) / handledCPCountPlusOne)) {
				error('overflow');
			}
			delta += (m - n) * handledCPCountPlusOne;
			n = m;
			for (j = 0; j < inputLength; ++j) {
				currentValue = input[j];
				if (currentValue < n && ++delta > maxInt) {
					error('overflow');
				}
				if (currentValue == n) {
					for (q = delta, k = base; ; k += base) {
						t = k <= bias ? tMin : (k >= bias + tMax ? tMax : k - bias);
						if (q < t) {
							break;
						}
						qMinusT = q - t;
						baseMinusT = base - t;
						output.push(
							stringFromCharCode(digitToBasic(t + qMinusT % baseMinusT, 0))
						);
						q = floor(qMinusT / baseMinusT);
					}
					output.push(stringFromCharCode(digitToBasic(q, 0)));
					bias = adapt(delta, handledCPCountPlusOne, handledCPCount == basicLength);
					delta = 0;
					++handledCPCount;
				}
			}
			++delta;
			++n;
		}
		return output.join('');
	}
	function toUnicode(input) {
		return mapDomain(input, function(string) {
			return regexPunycode.test(string)
				? decode(string.slice(4).toLowerCase())
				: string;
		});
	}
	function toASCII(input) {
		return mapDomain(input, function(string) {
			return regexNonASCII.test(string)
				? 'xn--' + encode(string)
				: string;
		});
	}
	punycode = {
		'version': '1.4.1',
		'ucs2': {
			'decode': ucs2decode,
			'encode': ucs2encode
		},
		'decode': decode,
		'encode': encode,
		'toASCII': toASCII,
		'toUnicode': toUnicode
	};
	if (
		typeof define == 'function' &&
		typeof define.amd == 'object' &&
		define.amd
	) {
		define('punycode', function() {
			return punycode;
		});
	} else if (freeExports && freeModule) {
		if (module.exports == freeExports) {
			freeModule.exports = punycode;
		} else {
			for (key in punycode) {
				punycode.hasOwnProperty(key) && (freeExports[key] = punycode[key]);
			}
		}
	} else {
		root.punycode = punycode;
	}
}(this));
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],28:[function(require,module,exports){
'use strict';
function hasOwnProperty(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}
module.exports = function(qs, sep, eq, options) {
  sep = sep || '&';
  eq = eq || '=';
  var obj = {};
  if (typeof qs !== 'string' || qs.length === 0) {
    return obj;
  }
  var regexp = /\+/g;
  qs = qs.split(sep);
  var maxKeys = 1000;
  if (options && typeof options.maxKeys === 'number') {
    maxKeys = options.maxKeys;
  }
  var len = qs.length;
  if (maxKeys > 0 && len > maxKeys) {
    len = maxKeys;
  }
  for (var i = 0; i < len; ++i) {
    var x = qs[i].replace(regexp, '%20'),
        idx = x.indexOf(eq),
        kstr, vstr, k, v;
    if (idx >= 0) {
      kstr = x.substr(0, idx);
      vstr = x.substr(idx + 1);
    } else {
      kstr = x;
      vstr = '';
    }
    k = decodeURIComponent(kstr);
    v = decodeURIComponent(vstr);
    if (!hasOwnProperty(obj, k)) {
      obj[k] = v;
    } else if (isArray(obj[k])) {
      obj[k].push(v);
    } else {
      obj[k] = [obj[k], v];
    }
  }
  return obj;
};
var isArray = Array.isArray || function (xs) {
  return Object.prototype.toString.call(xs) === '[object Array]';
};
},{}],29:[function(require,module,exports){
'use strict';
var stringifyPrimitive = function(v) {
  switch (typeof v) {
    case 'string':
      return v;
    case 'boolean':
      return v ? 'true' : 'false';
    case 'number':
      return isFinite(v) ? v : '';
    default:
      return '';
  }
};
module.exports = function(obj, sep, eq, name) {
  sep = sep || '&';
  eq = eq || '=';
  if (obj === null) {
    obj = undefined;
  }
  if (typeof obj === 'object') {
    return map(objectKeys(obj), function(k) {
      var ks = encodeURIComponent(stringifyPrimitive(k)) + eq;
      if (isArray(obj[k])) {
        return map(obj[k], function(v) {
          return ks + encodeURIComponent(stringifyPrimitive(v));
        }).join(sep);
      } else {
        return ks + encodeURIComponent(stringifyPrimitive(obj[k]));
      }
    }).join(sep);
  }
  if (!name) return '';
  return encodeURIComponent(stringifyPrimitive(name)) + eq +
         encodeURIComponent(stringifyPrimitive(obj));
};
var isArray = Array.isArray || function (xs) {
  return Object.prototype.toString.call(xs) === '[object Array]';
};
function map (xs, f) {
  if (xs.map) return xs.map(f);
  var res = [];
  for (var i = 0; i < xs.length; i++) {
    res.push(f(xs[i], i));
  }
  return res;
}
var objectKeys = Object.keys || function (obj) {
  var res = [];
  for (var key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) res.push(key);
  }
  return res;
};
},{}],30:[function(require,module,exports){
'use strict';
exports.decode = exports.parse = require('./decode');
exports.encode = exports.stringify = require('./encode');
},{"./decode":28,"./encode":29}],31:[function(require,module,exports){
'use strict'
module.exports = function removeItems(arr, startIdx, removeCount)
{
  var i, length = arr.length
  if (startIdx >= length || removeCount === 0) {
    return
  }
  removeCount = (startIdx + removeCount > length ? length - startIdx : removeCount)
  var len = length - removeCount
  for (i = startIdx; i < len; ++i) {
    arr[i] = arr[i + removeCount]
  }
  arr.length = len
}
},{}],32:[function(require,module,exports){
'use strict';
exports.__esModule = true;
var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };
var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
var _miniSignals = require('mini-signals');
var _miniSignals2 = _interopRequireDefault(_miniSignals);
var _parseUri = require('parse-uri');
var _parseUri2 = _interopRequireDefault(_parseUri);
var _async = require('./async');
var async = _interopRequireWildcard(_async);
var _Resource = require('./Resource');
var _Resource2 = _interopRequireDefault(_Resource);
function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
var MAX_PROGRESS = 100;
var rgxExtractUrlHash = /(#[\w-]+)?$/;
var Loader = function () {
    function Loader() {
        var _this = this;
        var baseUrl = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
        var concurrency = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 10;
        _classCallCheck(this, Loader);
        this.baseUrl = baseUrl;
        this.progress = 0;
        this.loading = false;
        this.defaultQueryString = '';
        this._beforeMiddleware = [];
        this._afterMiddleware = [];
        this._resourcesParsing = [];
        this._boundLoadResource = function (r, d) {
            return _this._loadResource(r, d);
        };
        this._queue = async.queue(this._boundLoadResource, concurrency);
        this._queue.pause();
        this.resources = {};
        this.onProgress = new _miniSignals2.default();
        this.onError = new _miniSignals2.default();
        this.onLoad = new _miniSignals2.default();
        this.onStart = new _miniSignals2.default();
        this.onComplete = new _miniSignals2.default();
    }
    Loader.prototype.add = function add(name, url, options, cb) {
        if (Array.isArray(name)) {
            for (var i = 0; i < name.length; ++i) {
                this.add(name[i]);
            }
            return this;
        }
        if ((typeof name === 'undefined' ? 'undefined' : _typeof(name)) === 'object') {
            cb = url || name.callback || name.onComplete;
            options = name;
            url = name.url;
            name = name.name || name.key || name.url;
        }
        if (typeof url !== 'string') {
            cb = options;
            options = url;
            url = name;
        }
        if (typeof url !== 'string') {
            throw new Error('No url passed to add resource to loader.');
        }
        if (typeof options === 'function') {
            cb = options;
            options = null;
        }
        if (this.loading && (!options || !options.parentResource)) {
            throw new Error('Cannot add resources while the loader is running.');
        }
        if (this.resources[name]) {
            throw new Error('Resource named "' + name + '" already exists.');
        }
        url = this._prepareUrl(url);
        this.resources[name] = new _Resource2.default(name, url, options);
        if (typeof cb === 'function') {
            this.resources[name].onAfterMiddleware.once(cb);
        }
        if (this.loading) {
            var parent = options.parentResource;
            var incompleteChildren = [];
            for (var _i = 0; _i < parent.children.length; ++_i) {
                if (!parent.children[_i].isComplete) {
                    incompleteChildren.push(parent.children[_i]);
                }
            }
            var fullChunk = parent.progressChunk * (incompleteChildren.length + 1); 
            var eachChunk = fullChunk / (incompleteChildren.length + 2); 
            parent.children.push(this.resources[name]);
            parent.progressChunk = eachChunk;
            for (var _i2 = 0; _i2 < incompleteChildren.length; ++_i2) {
                incompleteChildren[_i2].progressChunk = eachChunk;
            }
            this.resources[name].progressChunk = eachChunk;
        }
        this._queue.push(this.resources[name]);
        return this;
    };
    Loader.prototype.pre = function pre(fn) {
        this._beforeMiddleware.push(fn);
        return this;
    };
    Loader.prototype.use = function use(fn) {
        this._afterMiddleware.push(fn);
        return this;
    };
    Loader.prototype.reset = function reset() {
        this.progress = 0;
        this.loading = false;
        this._queue.kill();
        this._queue.pause();
        for (var k in this.resources) {
            var res = this.resources[k];
            if (res._onLoadBinding) {
                res._onLoadBinding.detach();
            }
            if (res.isLoading) {
                res.abort();
            }
        }
        this.resources = {};
        return this;
    };
    Loader.prototype.load = function load(cb) {
        if (typeof cb === 'function') {
            this.onComplete.once(cb);
        }
        if (this.loading) {
            return this;
        }
        if (this._queue.idle()) {
            this._onStart();
            this._onComplete();
        } else {
            var numTasks = this._queue._tasks.length;
            var chunk = 100 / numTasks;
            for (var i = 0; i < this._queue._tasks.length; ++i) {
                this._queue._tasks[i].data.progressChunk = chunk;
            }
            this._onStart();
            this._queue.resume();
        }
        return this;
    };
    Loader.prototype._prepareUrl = function _prepareUrl(url) {
        var parsedUrl = (0, _parseUri2.default)(url, { strictMode: true });
        var result = void 0;
        if (parsedUrl.protocol || !parsedUrl.path || url.indexOf('//') === 0) {
            result = url;
        }
        else if (this.baseUrl.length && this.baseUrl.lastIndexOf('/') !== this.baseUrl.length - 1 && url.charAt(0) !== '/') {
                result = this.baseUrl + '/' + url;
            } else {
                result = this.baseUrl + url;
            }
        if (this.defaultQueryString) {
            var hash = rgxExtractUrlHash.exec(result)[0];
            result = result.substr(0, result.length - hash.length);
            if (result.indexOf('?') !== -1) {
                result += '&' + this.defaultQueryString;
            } else {
                result += '?' + this.defaultQueryString;
            }
            result += hash;
        }
        return result;
    };
    Loader.prototype._loadResource = function _loadResource(resource, dequeue) {
        var _this2 = this;
        resource._dequeue = dequeue;
        async.eachSeries(this._beforeMiddleware, function (fn, next) {
            fn.call(_this2, resource, function () {
                next(resource.isComplete ? {} : null);
            });
        }, function () {
            if (resource.isComplete) {
                _this2._onLoad(resource);
            } else {
                resource._onLoadBinding = resource.onComplete.once(_this2._onLoad, _this2);
                resource.load();
            }
        }, true);
    };
    Loader.prototype._onStart = function _onStart() {
        this.progress = 0;
        this.loading = true;
        this.onStart.dispatch(this);
    };
    Loader.prototype._onComplete = function _onComplete() {
        this.progress = MAX_PROGRESS;
        this.loading = false;
        this.onComplete.dispatch(this, this.resources);
    };
    Loader.prototype._onLoad = function _onLoad(resource) {
        var _this3 = this;
        resource._onLoadBinding = null;
        this._resourcesParsing.push(resource);
        resource._dequeue();
        async.eachSeries(this._afterMiddleware, function (fn, next) {
            fn.call(_this3, resource, next);
        }, function () {
            resource.onAfterMiddleware.dispatch(resource);
            _this3.progress += resource.progressChunk;
            _this3.onProgress.dispatch(_this3, resource);
            if (resource.error) {
                _this3.onError.dispatch(resource.error, _this3, resource);
            } else {
                _this3.onLoad.dispatch(_this3, resource);
            }
            _this3._resourcesParsing.splice(_this3._resourcesParsing.indexOf(resource), 1);
            if (_this3._queue.idle() && _this3._resourcesParsing.length === 0) {
                _this3._onComplete();
            }
        }, true);
    };
    _createClass(Loader, [{
        key: 'concurrency',
        get: function get() {
            return this._queue.concurrency;
        }
        ,
        set: function set(concurrency) {
            this._queue.concurrency = concurrency;
        }
    }]);
    return Loader;
}();
exports.default = Loader;
},{"./Resource":33,"./async":34,"mini-signals":5,"parse-uri":7}],33:[function(require,module,exports){
'use strict';
exports.__esModule = true;
var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
var _parseUri = require('parse-uri');
var _parseUri2 = _interopRequireDefault(_parseUri);
var _miniSignals = require('mini-signals');
var _miniSignals2 = _interopRequireDefault(_miniSignals);
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
var useXdr = !!(window.XDomainRequest && !('withCredentials' in new XMLHttpRequest()));
var tempAnchor = null;
var STATUS_NONE = 0;
var STATUS_OK = 200;
var STATUS_EMPTY = 204;
var STATUS_IE_BUG_EMPTY = 1223;
var STATUS_TYPE_OK = 2;
function _noop() {} 
var Resource = function () {
    Resource.setExtensionLoadType = function setExtensionLoadType(extname, loadType) {
        setExtMap(Resource._loadTypeMap, extname, loadType);
    };
    Resource.setExtensionXhrType = function setExtensionXhrType(extname, xhrType) {
        setExtMap(Resource._xhrTypeMap, extname, xhrType);
    };
    function Resource(name, url, options) {
        _classCallCheck(this, Resource);
        if (typeof name !== 'string' || typeof url !== 'string') {
            throw new Error('Both name and url are required for constructing a resource.');
        }
        options = options || {};
        this._flags = 0;
        this._setFlag(Resource.STATUS_FLAGS.DATA_URL, url.indexOf('data:') === 0);
        this.name = name;
        this.url = url;
        this.extension = this._getExtension();
        this.data = null;
        this.crossOrigin = options.crossOrigin === true ? 'anonymous' : options.crossOrigin;
        this.loadType = options.loadType || this._determineLoadType();
        this.xhrType = options.xhrType;
        this.metadata = options.metadata || {};
        this.error = null;
        this.xhr = null;
        this.children = [];
        this.type = Resource.TYPE.UNKNOWN;
        this.progressChunk = 0;
        this._dequeue = _noop;
        this._onLoadBinding = null;
        this._boundComplete = this.complete.bind(this);
        this._boundOnError = this._onError.bind(this);
        this._boundOnProgress = this._onProgress.bind(this);
        this._boundXhrOnError = this._xhrOnError.bind(this);
        this._boundXhrOnAbort = this._xhrOnAbort.bind(this);
        this._boundXhrOnLoad = this._xhrOnLoad.bind(this);
        this._boundXdrOnTimeout = this._xdrOnTimeout.bind(this);
        this.onStart = new _miniSignals2.default();
        this.onProgress = new _miniSignals2.default();
        this.onComplete = new _miniSignals2.default();
        this.onAfterMiddleware = new _miniSignals2.default();
    }
    Resource.prototype.complete = function complete() {
        if (this.data && this.data.removeEventListener) {
            this.data.removeEventListener('error', this._boundOnError, false);
            this.data.removeEventListener('load', this._boundComplete, false);
            this.data.removeEventListener('progress', this._boundOnProgress, false);
            this.data.removeEventListener('canplaythrough', this._boundComplete, false);
        }
        if (this.xhr) {
            if (this.xhr.removeEventListener) {
                this.xhr.removeEventListener('error', this._boundXhrOnError, false);
                this.xhr.removeEventListener('abort', this._boundXhrOnAbort, false);
                this.xhr.removeEventListener('progress', this._boundOnProgress, false);
                this.xhr.removeEventListener('load', this._boundXhrOnLoad, false);
            } else {
                this.xhr.onerror = null;
                this.xhr.ontimeout = null;
                this.xhr.onprogress = null;
                this.xhr.onload = null;
            }
        }
        if (this.isComplete) {
            throw new Error('Complete called again for an already completed resource.');
        }
        this._setFlag(Resource.STATUS_FLAGS.COMPLETE, true);
        this._setFlag(Resource.STATUS_FLAGS.LOADING, false);
        this.onComplete.dispatch(this);
    };
    Resource.prototype.abort = function abort(message) {
        if (this.error) {
            return;
        }
        this.error = new Error(message);
        if (this.xhr) {
            this.xhr.abort();
        } else if (this.xdr) {
            this.xdr.abort();
        } else if (this.data) {
            if (this.data.src) {
                this.data.src = Resource.EMPTY_GIF;
            }
            else {
                    while (this.data.firstChild) {
                        this.data.removeChild(this.data.firstChild);
                    }
                }
        }
        this.complete();
    };
    Resource.prototype.load = function load(cb) {
        var _this = this;
        if (this.isLoading) {
            return;
        }
        if (this.isComplete) {
            if (cb) {
                setTimeout(function () {
                    return cb(_this);
                }, 1);
            }
            return;
        } else if (cb) {
            this.onComplete.once(cb);
        }
        this._setFlag(Resource.STATUS_FLAGS.LOADING, true);
        this.onStart.dispatch(this);
        if (this.crossOrigin === false || typeof this.crossOrigin !== 'string') {
            this.crossOrigin = this._determineCrossOrigin(this.url);
        }
        switch (this.loadType) {
            case Resource.LOAD_TYPE.IMAGE:
                this.type = Resource.TYPE.IMAGE;
                this._loadElement('image');
                break;
            case Resource.LOAD_TYPE.AUDIO:
                this.type = Resource.TYPE.AUDIO;
                this._loadSourceElement('audio');
                break;
            case Resource.LOAD_TYPE.VIDEO:
                this.type = Resource.TYPE.VIDEO;
                this._loadSourceElement('video');
                break;
            case Resource.LOAD_TYPE.XHR:
            default:
                if (useXdr && this.crossOrigin) {
                    this._loadXdr();
                } else {
                    this._loadXhr();
                }
                break;
        }
    };
    Resource.prototype._hasFlag = function _hasFlag(flag) {
        return !!(this._flags & flag);
    };
    Resource.prototype._setFlag = function _setFlag(flag, value) {
        this._flags = value ? this._flags | flag : this._flags & ~flag;
    };
    Resource.prototype._loadElement = function _loadElement(type) {
        if (this.metadata.loadElement) {
            this.data = this.metadata.loadElement;
        } else if (type === 'image' && typeof window.Image !== 'undefined') {
            this.data = new Image();
        } else {
            this.data = document.createElement(type);
        }
        if (this.crossOrigin) {
            this.data.crossOrigin = this.crossOrigin;
        }
        if (!this.metadata.skipSource) {
            this.data.src = this.url;
        }
        this.data.addEventListener('error', this._boundOnError, false);
        this.data.addEventListener('load', this._boundComplete, false);
        this.data.addEventListener('progress', this._boundOnProgress, false);
    };
    Resource.prototype._loadSourceElement = function _loadSourceElement(type) {
        if (this.metadata.loadElement) {
            this.data = this.metadata.loadElement;
        } else if (type === 'audio' && typeof window.Audio !== 'undefined') {
            this.data = new Audio();
        } else {
            this.data = document.createElement(type);
        }
        if (this.data === null) {
            this.abort('Unsupported element: ' + type);
            return;
        }
        if (!this.metadata.skipSource) {
            if (navigator.isCocoonJS) {
                this.data.src = Array.isArray(this.url) ? this.url[0] : this.url;
            } else if (Array.isArray(this.url)) {
                var mimeTypes = this.metadata.mimeType;
                for (var i = 0; i < this.url.length; ++i) {
                    this.data.appendChild(this._createSource(type, this.url[i], Array.isArray(mimeTypes) ? mimeTypes[i] : mimeTypes));
                }
            } else {
                var _mimeTypes = this.metadata.mimeType;
                this.data.appendChild(this._createSource(type, this.url, Array.isArray(_mimeTypes) ? _mimeTypes[0] : _mimeTypes));
            }
        }
        this.data.addEventListener('error', this._boundOnError, false);
        this.data.addEventListener('load', this._boundComplete, false);
        this.data.addEventListener('progress', this._boundOnProgress, false);
        this.data.addEventListener('canplaythrough', this._boundComplete, false);
        this.data.load();
    };
    Resource.prototype._loadXhr = function _loadXhr() {
        if (typeof this.xhrType !== 'string') {
            this.xhrType = this._determineXhrType();
        }
        var xhr = this.xhr = new XMLHttpRequest();
        xhr.open('GET', this.url, true);
        if (this.xhrType === Resource.XHR_RESPONSE_TYPE.JSON || this.xhrType === Resource.XHR_RESPONSE_TYPE.DOCUMENT) {
            xhr.responseType = Resource.XHR_RESPONSE_TYPE.TEXT;
        } else {
            xhr.responseType = this.xhrType;
        }
        xhr.addEventListener('error', this._boundXhrOnError, false);
        xhr.addEventListener('abort', this._boundXhrOnAbort, false);
        xhr.addEventListener('progress', this._boundOnProgress, false);
        xhr.addEventListener('load', this._boundXhrOnLoad, false);
        xhr.send();
    };
    Resource.prototype._loadXdr = function _loadXdr() {
        if (typeof this.xhrType !== 'string') {
            this.xhrType = this._determineXhrType();
        }
        var xdr = this.xhr = new XDomainRequest();
        xdr.timeout = 5000;
        xdr.onerror = this._boundXhrOnError;
        xdr.ontimeout = this._boundXdrOnTimeout;
        xdr.onprogress = this._boundOnProgress;
        xdr.onload = this._boundXhrOnLoad;
        xdr.open('GET', this.url, true);
        setTimeout(function () {
            return xdr.send();
        }, 1);
    };
    Resource.prototype._createSource = function _createSource(type, url, mime) {
        if (!mime) {
            mime = type + '/' + this._getExtension(url);
        }
        var source = document.createElement('source');
        source.src = url;
        source.type = mime;
        return source;
    };
    Resource.prototype._onError = function _onError(event) {
        this.abort('Failed to load element using: ' + event.target.nodeName);
    };
    Resource.prototype._onProgress = function _onProgress(event) {
        if (event && event.lengthComputable) {
            this.onProgress.dispatch(this, event.loaded / event.total);
        }
    };
    Resource.prototype._xhrOnError = function _xhrOnError() {
        var xhr = this.xhr;
        this.abort(reqType(xhr) + ' Request failed. Status: ' + xhr.status + ', text: "' + xhr.statusText + '"');
    };
    Resource.prototype._xhrOnAbort = function _xhrOnAbort() {
        this.abort(reqType(this.xhr) + ' Request was aborted by the user.');
    };
    Resource.prototype._xdrOnTimeout = function _xdrOnTimeout() {
        this.abort(reqType(this.xhr) + ' Request timed out.');
    };
    Resource.prototype._xhrOnLoad = function _xhrOnLoad() {
        var xhr = this.xhr;
        var text = '';
        var status = typeof xhr.status === 'undefined' ? STATUS_OK : xhr.status; 
        if (xhr.responseType === '' || xhr.responseType === 'text' || typeof xhr.responseType === 'undefined') {
            text = xhr.responseText;
        }
        if (status === STATUS_NONE && (text.length > 0 || xhr.responseType === Resource.XHR_RESPONSE_TYPE.BUFFER)) {
            status = STATUS_OK;
        }
        else if (status === STATUS_IE_BUG_EMPTY) {
                status = STATUS_EMPTY;
            }
        var statusType = status / 100 | 0;
        if (statusType === STATUS_TYPE_OK) {
            if (this.xhrType === Resource.XHR_RESPONSE_TYPE.TEXT) {
                this.data = text;
                this.type = Resource.TYPE.TEXT;
            }
            else if (this.xhrType === Resource.XHR_RESPONSE_TYPE.JSON) {
                    try {
                        this.data = JSON.parse(text);
                        this.type = Resource.TYPE.JSON;
                    } catch (e) {
                        this.abort('Error trying to parse loaded json: ' + e);
                        return;
                    }
                }
                else if (this.xhrType === Resource.XHR_RESPONSE_TYPE.DOCUMENT) {
                        try {
                            if (window.DOMParser) {
                                var domparser = new DOMParser();
                                this.data = domparser.parseFromString(text, 'text/xml');
                            } else {
                                var div = document.createElement('div');
                                div.innerHTML = text;
                                this.data = div;
                            }
                            this.type = Resource.TYPE.XML;
                        } catch (e) {
                            this.abort('Error trying to parse loaded xml: ' + e);
                            return;
                        }
                    }
                    else {
                            this.data = xhr.response || text;
                        }
        } else {
            this.abort('[' + xhr.status + '] ' + xhr.statusText + ': ' + xhr.responseURL);
            return;
        }
        this.complete();
    };
    Resource.prototype._determineCrossOrigin = function _determineCrossOrigin(url, loc) {
        if (url.indexOf('data:') === 0) {
            return '';
        }
        loc = loc || window.location;
        if (!tempAnchor) {
            tempAnchor = document.createElement('a');
        }
        tempAnchor.href = url;
        url = (0, _parseUri2.default)(tempAnchor.href, { strictMode: true });
        var samePort = !url.port && loc.port === '' || url.port === loc.port;
        var protocol = url.protocol ? url.protocol + ':' : '';
        if (url.host !== loc.hostname || !samePort || protocol !== loc.protocol) {
            return 'anonymous';
        }
        return '';
    };
    Resource.prototype._determineXhrType = function _determineXhrType() {
        return Resource._xhrTypeMap[this.extension] || Resource.XHR_RESPONSE_TYPE.TEXT;
    };
    Resource.prototype._determineLoadType = function _determineLoadType() {
        return Resource._loadTypeMap[this.extension] || Resource.LOAD_TYPE.XHR;
    };
    Resource.prototype._getExtension = function _getExtension() {
        var url = this.url;
        var ext = '';
        if (this.isDataUrl) {
            var slashIndex = url.indexOf('/');
            ext = url.substring(slashIndex + 1, url.indexOf(';', slashIndex));
        } else {
            var queryStart = url.indexOf('?');
            var hashStart = url.indexOf('#');
            var index = Math.min(queryStart > -1 ? queryStart : url.length, hashStart > -1 ? hashStart : url.length);
            url = url.substring(0, index);
            ext = url.substring(url.lastIndexOf('.') + 1);
        }
        return ext.toLowerCase();
    };
    Resource.prototype._getMimeFromXhrType = function _getMimeFromXhrType(type) {
        switch (type) {
            case Resource.XHR_RESPONSE_TYPE.BUFFER:
                return 'application/octet-binary';
            case Resource.XHR_RESPONSE_TYPE.BLOB:
                return 'application/blob';
            case Resource.XHR_RESPONSE_TYPE.DOCUMENT:
                return 'application/xml';
            case Resource.XHR_RESPONSE_TYPE.JSON:
                return 'application/json';
            case Resource.XHR_RESPONSE_TYPE.DEFAULT:
            case Resource.XHR_RESPONSE_TYPE.TEXT:
            default:
                return 'text/plain';
        }
    };
    _createClass(Resource, [{
        key: 'isDataUrl',
        get: function get() {
            return this._hasFlag(Resource.STATUS_FLAGS.DATA_URL);
        }
    }, {
        key: 'isComplete',
        get: function get() {
            return this._hasFlag(Resource.STATUS_FLAGS.COMPLETE);
        }
    }, {
        key: 'isLoading',
        get: function get() {
            return this._hasFlag(Resource.STATUS_FLAGS.LOADING);
        }
    }]);
    return Resource;
}();
exports.default = Resource;
Resource.STATUS_FLAGS = {
    NONE: 0,
    DATA_URL: 1 << 0,
    COMPLETE: 1 << 1,
    LOADING: 1 << 2
};
Resource.TYPE = {
    UNKNOWN: 0,
    JSON: 1,
    XML: 2,
    IMAGE: 3,
    AUDIO: 4,
    VIDEO: 5,
    TEXT: 6
};
Resource.LOAD_TYPE = {
    XHR: 1,
    IMAGE: 2,
    AUDIO: 3,
    VIDEO: 4
};
Resource.XHR_RESPONSE_TYPE = {
    DEFAULT: 'text',
    BUFFER: 'arraybuffer',
    BLOB: 'blob',
    DOCUMENT: 'document',
    JSON: 'json',
    TEXT: 'text'
};
Resource._loadTypeMap = {
    gif: Resource.LOAD_TYPE.IMAGE,
    png: Resource.LOAD_TYPE.IMAGE,
    bmp: Resource.LOAD_TYPE.IMAGE,
    jpg: Resource.LOAD_TYPE.IMAGE,
    jpeg: Resource.LOAD_TYPE.IMAGE,
    tif: Resource.LOAD_TYPE.IMAGE,
    tiff: Resource.LOAD_TYPE.IMAGE,
    webp: Resource.LOAD_TYPE.IMAGE,
    tga: Resource.LOAD_TYPE.IMAGE,
    svg: Resource.LOAD_TYPE.IMAGE,
    'svg+xml': Resource.LOAD_TYPE.IMAGE, 
    mp3: Resource.LOAD_TYPE.AUDIO,
    ogg: Resource.LOAD_TYPE.AUDIO,
    wav: Resource.LOAD_TYPE.AUDIO,
    mp4: Resource.LOAD_TYPE.VIDEO,
    webm: Resource.LOAD_TYPE.VIDEO
};
Resource._xhrTypeMap = {
    xhtml: Resource.XHR_RESPONSE_TYPE.DOCUMENT,
    html: Resource.XHR_RESPONSE_TYPE.DOCUMENT,
    htm: Resource.XHR_RESPONSE_TYPE.DOCUMENT,
    xml: Resource.XHR_RESPONSE_TYPE.DOCUMENT,
    tmx: Resource.XHR_RESPONSE_TYPE.DOCUMENT,
    svg: Resource.XHR_RESPONSE_TYPE.DOCUMENT,
    tsx: Resource.XHR_RESPONSE_TYPE.DOCUMENT,
    gif: Resource.XHR_RESPONSE_TYPE.BLOB,
    png: Resource.XHR_RESPONSE_TYPE.BLOB,
    bmp: Resource.XHR_RESPONSE_TYPE.BLOB,
    jpg: Resource.XHR_RESPONSE_TYPE.BLOB,
    jpeg: Resource.XHR_RESPONSE_TYPE.BLOB,
    tif: Resource.XHR_RESPONSE_TYPE.BLOB,
    tiff: Resource.XHR_RESPONSE_TYPE.BLOB,
    webp: Resource.XHR_RESPONSE_TYPE.BLOB,
    tga: Resource.XHR_RESPONSE_TYPE.BLOB,
    json: Resource.XHR_RESPONSE_TYPE.JSON,
    text: Resource.XHR_RESPONSE_TYPE.TEXT,
    txt: Resource.XHR_RESPONSE_TYPE.TEXT,
    ttf: Resource.XHR_RESPONSE_TYPE.BUFFER,
    otf: Resource.XHR_RESPONSE_TYPE.BUFFER
};
Resource.EMPTY_GIF = 'data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==';
function setExtMap(map, extname, val) {
    if (extname && extname.indexOf('.') === 0) {
        extname = extname.substring(1);
    }
    if (!extname) {
        return;
    }
    map[extname] = val;
}
function reqType(xhr) {
    return xhr.toString().replace('object ', '');
}
},{"mini-signals":5,"parse-uri":7}],34:[function(require,module,exports){
'use strict';
exports.__esModule = true;
exports.eachSeries = eachSeries;
exports.queue = queue;
function _noop() {} 
function eachSeries(array, iterator, callback, deferNext) {
    var i = 0;
    var len = array.length;
    (function next(err) {
        if (err || i === len) {
            if (callback) {
                callback(err);
            }
            return;
        }
        if (deferNext) {
            setTimeout(function () {
                iterator(array[i++], next);
            }, 1);
        } else {
            iterator(array[i++], next);
        }
    })();
}
function onlyOnce(fn) {
    return function onceWrapper() {
        if (fn === null) {
            throw new Error('Callback was already called.');
        }
        var callFn = fn;
        fn = null;
        callFn.apply(this, arguments);
    };
}
function queue(worker, concurrency) {
    if (concurrency == null) {
        concurrency = 1;
    } else if (concurrency === 0) {
        throw new Error('Concurrency must not be zero');
    }
    var workers = 0;
    var q = {
        _tasks: [],
        concurrency: concurrency,
        saturated: _noop,
        unsaturated: _noop,
        buffer: concurrency / 4,
        empty: _noop,
        drain: _noop,
        error: _noop,
        started: false,
        paused: false,
        push: function push(data, callback) {
            _insert(data, false, callback);
        },
        kill: function kill() {
            workers = 0;
            q.drain = _noop;
            q.started = false;
            q._tasks = [];
        },
        unshift: function unshift(data, callback) {
            _insert(data, true, callback);
        },
        process: function process() {
            while (!q.paused && workers < q.concurrency && q._tasks.length) {
                var task = q._tasks.shift();
                if (q._tasks.length === 0) {
                    q.empty();
                }
                workers += 1;
                if (workers === q.concurrency) {
                    q.saturated();
                }
                worker(task.data, onlyOnce(_next(task)));
            }
        },
        length: function length() {
            return q._tasks.length;
        },
        running: function running() {
            return workers;
        },
        idle: function idle() {
            return q._tasks.length + workers === 0;
        },
        pause: function pause() {
            if (q.paused === true) {
                return;
            }
            q.paused = true;
        },
        resume: function resume() {
            if (q.paused === false) {
                return;
            }
            q.paused = false;
            for (var w = 1; w <= q.concurrency; w++) {
                q.process();
            }
        }
    };
    function _insert(data, insertAtFront, callback) {
        if (callback != null && typeof callback !== 'function') {
            throw new Error('task callback must be a function');
        }
        q.started = true;
        if (data == null && q.idle()) {
            setTimeout(function () {
                return q.drain();
            }, 1);
            return;
        }
        var item = {
            data: data,
            callback: typeof callback === 'function' ? callback : _noop
        };
        if (insertAtFront) {
            q._tasks.unshift(item);
        } else {
            q._tasks.push(item);
        }
        setTimeout(function () {
            return q.process();
        }, 1);
    }
    function _next(task) {
        return function next() {
            workers -= 1;
            task.callback.apply(task, arguments);
            if (arguments[0] != null) {
                q.error(arguments[0], task.data);
            }
            if (workers <= q.concurrency - q.buffer) {
                q.unsaturated();
            }
            if (q.idle()) {
                q.drain();
            }
            q.process();
        };
    }
    return q;
}
},{}],35:[function(require,module,exports){
'use strict';
exports.__esModule = true;
exports.encodeBinary = encodeBinary;
var _keyStr = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
function encodeBinary(input) {
    var output = '';
    var inx = 0;
    while (inx < input.length) {
        var bytebuffer = [0, 0, 0];
        var encodedCharIndexes = [0, 0, 0, 0];
        for (var jnx = 0; jnx < bytebuffer.length; ++jnx) {
            if (inx < input.length) {
                bytebuffer[jnx] = input.charCodeAt(inx++) & 0xff;
            } else {
                bytebuffer[jnx] = 0;
            }
        }
        encodedCharIndexes[0] = bytebuffer[0] >> 2;
        encodedCharIndexes[1] = (bytebuffer[0] & 0x3) << 4 | bytebuffer[1] >> 4;
        encodedCharIndexes[2] = (bytebuffer[1] & 0x0f) << 2 | bytebuffer[2] >> 6;
        encodedCharIndexes[3] = bytebuffer[2] & 0x3f;
        var paddingBytes = inx - (input.length - 1);
        switch (paddingBytes) {
            case 2:
                encodedCharIndexes[3] = 64;
                encodedCharIndexes[2] = 64;
                break;
            case 1:
                encodedCharIndexes[3] = 64;
                break;
            default:
                break; 
        }
        for (var _jnx = 0; _jnx < encodedCharIndexes.length; ++_jnx) {
            output += _keyStr.charAt(encodedCharIndexes[_jnx]);
        }
    }
    return output;
}
},{}],36:[function(require,module,exports){
'use strict';
var Loader = require('./Loader').default;
var Resource = require('./Resource').default;
var async = require('./async');
var b64 = require('./b64');
Loader.Resource = Resource;
Loader.async = async;
Loader.base64 = b64;
module.exports = Loader;
module.exports.default = Loader;
},{"./Loader":32,"./Resource":33,"./async":34,"./b64":35}],37:[function(require,module,exports){
'use strict';
exports.__esModule = true;
var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };
exports.blobMiddlewareFactory = blobMiddlewareFactory;
var _Resource = require('../../Resource');
var _Resource2 = _interopRequireDefault(_Resource);
var _b = require('../../b64');
var _b2 = _interopRequireDefault(_b);
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
var Url = window.URL || window.webkitURL;
function blobMiddlewareFactory() {
    return function blobMiddleware(resource, next) {
        if (!resource.data) {
            next();
            return;
        }
        if (resource.xhr && resource.xhrType === _Resource2.default.XHR_RESPONSE_TYPE.BLOB) {
            if (!window.Blob || typeof resource.data === 'string') {
                var type = resource.xhr.getResponseHeader('content-type');
                if (type && type.indexOf('image') === 0) {
                    resource.data = new Image();
                    resource.data.src = 'data:' + type + ';base64,' + _b2.default.encodeBinary(resource.xhr.responseText);
                    resource.type = _Resource2.default.TYPE.IMAGE;
                    resource.data.onload = function () {
                        resource.data.onload = null;
                        next();
                    };
                    return;
                }
            }
            else if (resource.data.type.indexOf('image') === 0) {
                    var _ret = function () {
                        var src = Url.createObjectURL(resource.data);
                        resource.blob = resource.data;
                        resource.data = new Image();
                        resource.data.src = src;
                        resource.type = _Resource2.default.TYPE.IMAGE;
                        resource.data.onload = function () {
                            Url.revokeObjectURL(src);
                            resource.data.onload = null;
                            next();
                        };
                        return {
                            v: void 0
                        };
                    }();
                    if ((typeof _ret === 'undefined' ? 'undefined' : _typeof(_ret)) === "object") return _ret.v;
                }
        }
        next();
    };
}
},{"../../Resource":33,"../../b64":35}],38:[function(require,module,exports){
'use strict';
var punycode = require('punycode');
var util = require('./util');
exports.parse = urlParse;
exports.resolve = urlResolve;
exports.resolveObject = urlResolveObject;
exports.format = urlFormat;
exports.Url = Url;
function Url() {
  this.protocol = null;
  this.slashes = null;
  this.auth = null;
  this.host = null;
  this.port = null;
  this.hostname = null;
  this.hash = null;
  this.search = null;
  this.query = null;
  this.pathname = null;
  this.path = null;
  this.href = null;
}
var protocolPattern = /^([a-z0-9.+-]+:)/i,
    portPattern = /:[0-9]*$/,
    simplePathPattern = /^(\/\/?(?!\/)[^\?\s]*)(\?[^\s]*)?$/,
    delims = ['<', '>', '"', '`', ' ', '\r', '\n', '\t'],
    unwise = ['{', '}', '|', '\\', '^', '`'].concat(delims),
    autoEscape = ['\''].concat(unwise),
    nonHostChars = ['%', '/', '?', ';', '#'].concat(autoEscape),
    hostEndingChars = ['/', '?', '#'],
    hostnameMaxLen = 255,
    hostnamePartPattern = /^[+a-z0-9A-Z_-]{0,63}$/,
    hostnamePartStart = /^([+a-z0-9A-Z_-]{0,63})(.*)$/,
    unsafeProtocol = {
      'javascript': true,
      'javascript:': true
    },
    hostlessProtocol = {
      'javascript': true,
      'javascript:': true
    },
    slashedProtocol = {
      'http': true,
      'https': true,
      'ftp': true,
      'gopher': true,
      'file': true,
      'http:': true,
      'https:': true,
      'ftp:': true,
      'gopher:': true,
      'file:': true
    },
    querystring = require('querystring');
function urlParse(url, parseQueryString, slashesDenoteHost) {
  if (url && util.isObject(url) && url instanceof Url) return url;
  var u = new Url;
  u.parse(url, parseQueryString, slashesDenoteHost);
  return u;
}
Url.prototype.parse = function(url, parseQueryString, slashesDenoteHost) {
  if (!util.isString(url)) {
    throw new TypeError("Parameter 'url' must be a string, not " + typeof url);
  }
  var queryIndex = url.indexOf('?'),
      splitter =
          (queryIndex !== -1 && queryIndex < url.indexOf('#')) ? '?' : '#',
      uSplit = url.split(splitter),
      slashRegex = /\\/g;
  uSplit[0] = uSplit[0].replace(slashRegex, '/');
  url = uSplit.join(splitter);
  var rest = url;
  rest = rest.trim();
  if (!slashesDenoteHost && url.split('#').length === 1) {
    var simplePath = simplePathPattern.exec(rest);
    if (simplePath) {
      this.path = rest;
      this.href = rest;
      this.pathname = simplePath[1];
      if (simplePath[2]) {
        this.search = simplePath[2];
        if (parseQueryString) {
          this.query = querystring.parse(this.search.substr(1));
        } else {
          this.query = this.search.substr(1);
        }
      } else if (parseQueryString) {
        this.search = '';
        this.query = {};
      }
      return this;
    }
  }
  var proto = protocolPattern.exec(rest);
  if (proto) {
    proto = proto[0];
    var lowerProto = proto.toLowerCase();
    this.protocol = lowerProto;
    rest = rest.substr(proto.length);
  }
  if (slashesDenoteHost || proto || rest.match(/^\/\/[^@\/]+@[^@\/]+/)) {
    var slashes = rest.substr(0, 2) === '//';
    if (slashes && !(proto && hostlessProtocol[proto])) {
      rest = rest.substr(2);
      this.slashes = true;
    }
  }
  if (!hostlessProtocol[proto] &&
      (slashes || (proto && !slashedProtocol[proto]))) {
    var hostEnd = -1;
    for (var i = 0; i < hostEndingChars.length; i++) {
      var hec = rest.indexOf(hostEndingChars[i]);
      if (hec !== -1 && (hostEnd === -1 || hec < hostEnd))
        hostEnd = hec;
    }
    var auth, atSign;
    if (hostEnd === -1) {
      atSign = rest.lastIndexOf('@');
    } else {
      atSign = rest.lastIndexOf('@', hostEnd);
    }
    if (atSign !== -1) {
      auth = rest.slice(0, atSign);
      rest = rest.slice(atSign + 1);
      this.auth = decodeURIComponent(auth);
    }
    hostEnd = -1;
    for (var i = 0; i < nonHostChars.length; i++) {
      var hec = rest.indexOf(nonHostChars[i]);
      if (hec !== -1 && (hostEnd === -1 || hec < hostEnd))
        hostEnd = hec;
    }
    if (hostEnd === -1)
      hostEnd = rest.length;
    this.host = rest.slice(0, hostEnd);
    rest = rest.slice(hostEnd);
    this.parseHost();
    this.hostname = this.hostname || '';
    var ipv6Hostname = this.hostname[0] === '[' &&
        this.hostname[this.hostname.length - 1] === ']';
    if (!ipv6Hostname) {
      var hostparts = this.hostname.split(/\./);
      for (var i = 0, l = hostparts.length; i < l; i++) {
        var part = hostparts[i];
        if (!part) continue;
        if (!part.match(hostnamePartPattern)) {
          var newpart = '';
          for (var j = 0, k = part.length; j < k; j++) {
            if (part.charCodeAt(j) > 127) {
              newpart += 'x';
            } else {
              newpart += part[j];
            }
          }
          if (!newpart.match(hostnamePartPattern)) {
            var validParts = hostparts.slice(0, i);
            var notHost = hostparts.slice(i + 1);
            var bit = part.match(hostnamePartStart);
            if (bit) {
              validParts.push(bit[1]);
              notHost.unshift(bit[2]);
            }
            if (notHost.length) {
              rest = '/' + notHost.join('.') + rest;
            }
            this.hostname = validParts.join('.');
            break;
          }
        }
      }
    }
    if (this.hostname.length > hostnameMaxLen) {
      this.hostname = '';
    } else {
      this.hostname = this.hostname.toLowerCase();
    }
    if (!ipv6Hostname) {
      this.hostname = punycode.toASCII(this.hostname);
    }
    var p = this.port ? ':' + this.port : '';
    var h = this.hostname || '';
    this.host = h + p;
    this.href += this.host;
    if (ipv6Hostname) {
      this.hostname = this.hostname.substr(1, this.hostname.length - 2);
      if (rest[0] !== '/') {
        rest = '/' + rest;
      }
    }
  }
  if (!unsafeProtocol[lowerProto]) {
    for (var i = 0, l = autoEscape.length; i < l; i++) {
      var ae = autoEscape[i];
      if (rest.indexOf(ae) === -1)
        continue;
      var esc = encodeURIComponent(ae);
      if (esc === ae) {
        esc = escape(ae);
      }
      rest = rest.split(ae).join(esc);
    }
  }
  var hash = rest.indexOf('#');
  if (hash !== -1) {
    this.hash = rest.substr(hash);
    rest = rest.slice(0, hash);
  }
  var qm = rest.indexOf('?');
  if (qm !== -1) {
    this.search = rest.substr(qm);
    this.query = rest.substr(qm + 1);
    if (parseQueryString) {
      this.query = querystring.parse(this.query);
    }
    rest = rest.slice(0, qm);
  } else if (parseQueryString) {
    this.search = '';
    this.query = {};
  }
  if (rest) this.pathname = rest;
  if (slashedProtocol[lowerProto] &&
      this.hostname && !this.pathname) {
    this.pathname = '/';
  }
  if (this.pathname || this.search) {
    var p = this.pathname || '';
    var s = this.search || '';
    this.path = p + s;
  }
  this.href = this.format();
  return this;
};
function urlFormat(obj) {
  if (util.isString(obj)) obj = urlParse(obj);
  if (!(obj instanceof Url)) return Url.prototype.format.call(obj);
  return obj.format();
}
Url.prototype.format = function() {
  var auth = this.auth || '';
  if (auth) {
    auth = encodeURIComponent(auth);
    auth = auth.replace(/%3A/i, ':');
    auth += '@';
  }
  var protocol = this.protocol || '',
      pathname = this.pathname || '',
      hash = this.hash || '',
      host = false,
      query = '';
  if (this.host) {
    host = auth + this.host;
  } else if (this.hostname) {
    host = auth + (this.hostname.indexOf(':') === -1 ?
        this.hostname :
        '[' + this.hostname + ']');
    if (this.port) {
      host += ':' + this.port;
    }
  }
  if (this.query &&
      util.isObject(this.query) &&
      Object.keys(this.query).length) {
    query = querystring.stringify(this.query);
  }
  var search = this.search || (query && ('?' + query)) || '';
  if (protocol && protocol.substr(-1) !== ':') protocol += ':';
  if (this.slashes ||
      (!protocol || slashedProtocol[protocol]) && host !== false) {
    host = '//' + (host || '');
    if (pathname && pathname.charAt(0) !== '/') pathname = '/' + pathname;
  } else if (!host) {
    host = '';
  }
  if (hash && hash.charAt(0) !== '#') hash = '#' + hash;
  if (search && search.charAt(0) !== '?') search = '?' + search;
  pathname = pathname.replace(/[?#]/g, function(match) {
    return encodeURIComponent(match);
  });
  search = search.replace('#', '%23');
  return protocol + host + pathname + search + hash;
};
function urlResolve(source, relative) {
  return urlParse(source, false, true).resolve(relative);
}
Url.prototype.resolve = function(relative) {
  return this.resolveObject(urlParse(relative, false, true)).format();
};
function urlResolveObject(source, relative) {
  if (!source) return relative;
  return urlParse(source, false, true).resolveObject(relative);
}
Url.prototype.resolveObject = function(relative) {
  if (util.isString(relative)) {
    var rel = new Url();
    rel.parse(relative, false, true);
    relative = rel;
  }
  var result = new Url();
  var tkeys = Object.keys(this);
  for (var tk = 0; tk < tkeys.length; tk++) {
    var tkey = tkeys[tk];
    result[tkey] = this[tkey];
  }
  result.hash = relative.hash;
  if (relative.href === '') {
    result.href = result.format();
    return result;
  }
  if (relative.slashes && !relative.protocol) {
    var rkeys = Object.keys(relative);
    for (var rk = 0; rk < rkeys.length; rk++) {
      var rkey = rkeys[rk];
      if (rkey !== 'protocol')
        result[rkey] = relative[rkey];
    }
    if (slashedProtocol[result.protocol] &&
        result.hostname && !result.pathname) {
      result.path = result.pathname = '/';
    }
    result.href = result.format();
    return result;
  }
  if (relative.protocol && relative.protocol !== result.protocol) {
    if (!slashedProtocol[relative.protocol]) {
      var keys = Object.keys(relative);
      for (var v = 0; v < keys.length; v++) {
        var k = keys[v];
        result[k] = relative[k];
      }
      result.href = result.format();
      return result;
    }
    result.protocol = relative.protocol;
    if (!relative.host && !hostlessProtocol[relative.protocol]) {
      var relPath = (relative.pathname || '').split('/');
      while (relPath.length && !(relative.host = relPath.shift()));
      if (!relative.host) relative.host = '';
      if (!relative.hostname) relative.hostname = '';
      if (relPath[0] !== '') relPath.unshift('');
      if (relPath.length < 2) relPath.unshift('');
      result.pathname = relPath.join('/');
    } else {
      result.pathname = relative.pathname;
    }
    result.search = relative.search;
    result.query = relative.query;
    result.host = relative.host || '';
    result.auth = relative.auth;
    result.hostname = relative.hostname || relative.host;
    result.port = relative.port;
    if (result.pathname || result.search) {
      var p = result.pathname || '';
      var s = result.search || '';
      result.path = p + s;
    }
    result.slashes = result.slashes || relative.slashes;
    result.href = result.format();
    return result;
  }
  var isSourceAbs = (result.pathname && result.pathname.charAt(0) === '/'),
      isRelAbs = (
          relative.host ||
          relative.pathname && relative.pathname.charAt(0) === '/'
      ),
      mustEndAbs = (isRelAbs || isSourceAbs ||
                    (result.host && relative.pathname)),
      removeAllDots = mustEndAbs,
      srcPath = result.pathname && result.pathname.split('/') || [],
      relPath = relative.pathname && relative.pathname.split('/') || [],
      psychotic = result.protocol && !slashedProtocol[result.protocol];
  if (psychotic) {
    result.hostname = '';
    result.port = null;
    if (result.host) {
      if (srcPath[0] === '') srcPath[0] = result.host;
      else srcPath.unshift(result.host);
    }
    result.host = '';
    if (relative.protocol) {
      relative.hostname = null;
      relative.port = null;
      if (relative.host) {
        if (relPath[0] === '') relPath[0] = relative.host;
        else relPath.unshift(relative.host);
      }
      relative.host = null;
    }
    mustEndAbs = mustEndAbs && (relPath[0] === '' || srcPath[0] === '');
  }
  if (isRelAbs) {
    result.host = (relative.host || relative.host === '') ?
                  relative.host : result.host;
    result.hostname = (relative.hostname || relative.hostname === '') ?
                      relative.hostname : result.hostname;
    result.search = relative.search;
    result.query = relative.query;
    srcPath = relPath;
  } else if (relPath.length) {
    if (!srcPath) srcPath = [];
    srcPath.pop();
    srcPath = srcPath.concat(relPath);
    result.search = relative.search;
    result.query = relative.query;
  } else if (!util.isNullOrUndefined(relative.search)) {
    if (psychotic) {
      result.hostname = result.host = srcPath.shift();
      var authInHost = result.host && result.host.indexOf('@') > 0 ?
                       result.host.split('@') : false;
      if (authInHost) {
        result.auth = authInHost.shift();
        result.host = result.hostname = authInHost.shift();
      }
    }
    result.search = relative.search;
    result.query = relative.query;
    if (!util.isNull(result.pathname) || !util.isNull(result.search)) {
      result.path = (result.pathname ? result.pathname : '') +
                    (result.search ? result.search : '');
    }
    result.href = result.format();
    return result;
  }
  if (!srcPath.length) {
    result.pathname = null;
    if (result.search) {
      result.path = '/' + result.search;
    } else {
      result.path = null;
    }
    result.href = result.format();
    return result;
  }
  var last = srcPath.slice(-1)[0];
  var hasTrailingSlash = (
      (result.host || relative.host || srcPath.length > 1) &&
      (last === '.' || last === '..') || last === '');
  var up = 0;
  for (var i = srcPath.length; i >= 0; i--) {
    last = srcPath[i];
    if (last === '.') {
      srcPath.splice(i, 1);
    } else if (last === '..') {
      srcPath.splice(i, 1);
      up++;
    } else if (up) {
      srcPath.splice(i, 1);
      up--;
    }
  }
  if (!mustEndAbs && !removeAllDots) {
    for (; up--; up) {
      srcPath.unshift('..');
    }
  }
  if (mustEndAbs && srcPath[0] !== '' &&
      (!srcPath[0] || srcPath[0].charAt(0) !== '/')) {
    srcPath.unshift('');
  }
  if (hasTrailingSlash && (srcPath.join('/').substr(-1) !== '/')) {
    srcPath.push('');
  }
  var isAbsolute = srcPath[0] === '' ||
      (srcPath[0] && srcPath[0].charAt(0) === '/');
  if (psychotic) {
    result.hostname = result.host = isAbsolute ? '' :
                                    srcPath.length ? srcPath.shift() : '';
    var authInHost = result.host && result.host.indexOf('@') > 0 ?
                     result.host.split('@') : false;
    if (authInHost) {
      result.auth = authInHost.shift();
      result.host = result.hostname = authInHost.shift();
    }
  }
  mustEndAbs = mustEndAbs || (result.host && srcPath.length);
  if (mustEndAbs && !isAbsolute) {
    srcPath.unshift('');
  }
  if (!srcPath.length) {
    result.pathname = null;
    result.path = null;
  } else {
    result.pathname = srcPath.join('/');
  }
  if (!util.isNull(result.pathname) || !util.isNull(result.search)) {
    result.path = (result.pathname ? result.pathname : '') +
                  (result.search ? result.search : '');
  }
  result.auth = relative.auth || result.auth;
  result.slashes = result.slashes || relative.slashes;
  result.href = result.format();
  return result;
};
Url.prototype.parseHost = function() {
  var host = this.host;
  var port = portPattern.exec(host);
  if (port) {
    port = port[0];
    if (port !== ':') {
      this.port = port.substr(1);
    }
    host = host.substr(0, host.length - port.length);
  }
  if (host) this.hostname = host;
};
},{"./util":39,"punycode":27,"querystring":30}],39:[function(require,module,exports){
'use strict';
module.exports = {
  isString: function(arg) {
    return typeof(arg) === 'string';
  },
  isObject: function(arg) {
    return typeof(arg) === 'object' && arg !== null;
  },
  isNull: function(arg) {
    return arg === null;
  },
  isNullOrUndefined: function(arg) {
    return arg == null;
  }
};
},{}],40:[function(require,module,exports){
'use strict';
exports.__esModule = true;
var _core = require('../core');
var core = _interopRequireWildcard(_core);
var _ismobilejs = require('ismobilejs');
var _ismobilejs2 = _interopRequireDefault(_ismobilejs);
var _accessibleTarget = require('./accessibleTarget');
var _accessibleTarget2 = _interopRequireDefault(_accessibleTarget);
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
core.utils.mixins.delayMixin(core.DisplayObject.prototype, _accessibleTarget2.default);
var KEY_CODE_TAB = 9;
var DIV_TOUCH_SIZE = 100;
var DIV_TOUCH_POS_X = 0;
var DIV_TOUCH_POS_Y = 0;
var DIV_TOUCH_ZINDEX = 2;
var DIV_HOOK_SIZE = 1;
var DIV_HOOK_POS_X = -1000;
var DIV_HOOK_POS_Y = -1000;
var DIV_HOOK_ZINDEX = 2;
var AccessibilityManager = function () {
    function AccessibilityManager(renderer) {
        _classCallCheck(this, AccessibilityManager);
        if ((_ismobilejs2.default.tablet || _ismobilejs2.default.phone) && !navigator.isCocoonJS) {
            this.createTouchHook();
        }
        var div = document.createElement('div');
        div.style.width = DIV_TOUCH_SIZE + 'px';
        div.style.height = DIV_TOUCH_SIZE + 'px';
        div.style.position = 'absolute';
        div.style.top = DIV_TOUCH_POS_X + 'px';
        div.style.left = DIV_TOUCH_POS_Y + 'px';
        div.style.zIndex = DIV_TOUCH_ZINDEX;
        this.div = div;
        this.pool = [];
        this.renderId = 0;
        this.debug = false;
        this.renderer = renderer;
        this.children = [];
        this._onKeyDown = this._onKeyDown.bind(this);
        this._onMouseMove = this._onMouseMove.bind(this);
        this.isActive = false;
        this.isMobileAccessabillity = false;
        window.addEventListener('keydown', this._onKeyDown, false);
    }
    AccessibilityManager.prototype.createTouchHook = function createTouchHook() {
        var _this = this;
        var hookDiv = document.createElement('button');
        hookDiv.style.width = DIV_HOOK_SIZE + 'px';
        hookDiv.style.height = DIV_HOOK_SIZE + 'px';
        hookDiv.style.position = 'absolute';
        hookDiv.style.top = DIV_HOOK_POS_X + 'px';
        hookDiv.style.left = DIV_HOOK_POS_Y + 'px';
        hookDiv.style.zIndex = DIV_HOOK_ZINDEX;
        hookDiv.style.backgroundColor = '#FF0000';
        hookDiv.title = 'HOOK DIV';
        hookDiv.addEventListener('focus', function () {
            _this.isMobileAccessabillity = true;
            _this.activate();
            document.body.removeChild(hookDiv);
        });
        document.body.appendChild(hookDiv);
    };
    AccessibilityManager.prototype.activate = function activate() {
        if (this.isActive) {
            return;
        }
        this.isActive = true;
        window.document.addEventListener('mousemove', this._onMouseMove, true);
        window.removeEventListener('keydown', this._onKeyDown, false);
        this.renderer.on('postrender', this.update, this);
        if (this.renderer.view.parentNode) {
            this.renderer.view.parentNode.appendChild(this.div);
        }
    };
    AccessibilityManager.prototype.deactivate = function deactivate() {
        if (!this.isActive || this.isMobileAccessabillity) {
            return;
        }
        this.isActive = false;
        window.document.removeEventListener('mousemove', this._onMouseMove);
        window.addEventListener('keydown', this._onKeyDown, false);
        this.renderer.off('postrender', this.update);
        if (this.div.parentNode) {
            this.div.parentNode.removeChild(this.div);
        }
    };
    AccessibilityManager.prototype.updateAccessibleObjects = function updateAccessibleObjects(displayObject) {
        if (!displayObject.visible) {
            return;
        }
        if (displayObject.accessible && displayObject.interactive) {
            if (!displayObject._accessibleActive) {
                this.addChild(displayObject);
            }
            displayObject.renderId = this.renderId;
        }
        var children = displayObject.children;
        for (var i = 0; i < children.length; i++) {
            this.updateAccessibleObjects(children[i]);
        }
    };
    AccessibilityManager.prototype.update = function update() {
        if (!this.renderer.renderingToScreen) {
            return;
        }
        this.updateAccessibleObjects(this.renderer._lastObjectRendered);
        var rect = this.renderer.view.getBoundingClientRect();
        var sx = rect.width / this.renderer.width;
        var sy = rect.height / this.renderer.height;
        var div = this.div;
        div.style.left = rect.left + 'px';
        div.style.top = rect.top + 'px';
        div.style.width = this.renderer.width + 'px';
        div.style.height = this.renderer.height + 'px';
        for (var i = 0; i < this.children.length; i++) {
            var child = this.children[i];
            if (child.renderId !== this.renderId) {
                child._accessibleActive = false;
                core.utils.removeItems(this.children, i, 1);
                this.div.removeChild(child._accessibleDiv);
                this.pool.push(child._accessibleDiv);
                child._accessibleDiv = null;
                i--;
                if (this.children.length === 0) {
                    this.deactivate();
                }
            } else {
                div = child._accessibleDiv;
                var hitArea = child.hitArea;
                var wt = child.worldTransform;
                if (child.hitArea) {
                    div.style.left = (wt.tx + hitArea.x * wt.a) * sx + 'px';
                    div.style.top = (wt.ty + hitArea.y * wt.d) * sy + 'px';
                    div.style.width = hitArea.width * wt.a * sx + 'px';
                    div.style.height = hitArea.height * wt.d * sy + 'px';
                } else {
                    hitArea = child.getBounds();
                    this.capHitArea(hitArea);
                    div.style.left = hitArea.x * sx + 'px';
                    div.style.top = hitArea.y * sy + 'px';
                    div.style.width = hitArea.width * sx + 'px';
                    div.style.height = hitArea.height * sy + 'px';
                    if (div.title !== child.accessibleTitle && child.accessibleTitle !== null) {
                        div.title = child.accessibleTitle;
                    }
                    if (div.getAttribute('aria-label') !== child.accessibleHint && child.accessibleHint !== null) {
                        div.setAttribute('aria-label', child.accessibleHint);
                    }
                }
            }
        }
        this.renderId++;
    };
    AccessibilityManager.prototype.capHitArea = function capHitArea(hitArea) {
        if (hitArea.x < 0) {
            hitArea.width += hitArea.x;
            hitArea.x = 0;
        }
        if (hitArea.y < 0) {
            hitArea.height += hitArea.y;
            hitArea.y = 0;
        }
        if (hitArea.x + hitArea.width > this.renderer.width) {
            hitArea.width = this.renderer.width - hitArea.x;
        }
        if (hitArea.y + hitArea.height > this.renderer.height) {
            hitArea.height = this.renderer.height - hitArea.y;
        }
    };
    AccessibilityManager.prototype.addChild = function addChild(displayObject) {
        var div = this.pool.pop();
        if (!div) {
            div = document.createElement('button');
            div.style.width = DIV_TOUCH_SIZE + 'px';
            div.style.height = DIV_TOUCH_SIZE + 'px';
            div.style.backgroundColor = this.debug ? 'rgba(255,0,0,0.5)' : 'transparent';
            div.style.position = 'absolute';
            div.style.zIndex = DIV_TOUCH_ZINDEX;
            div.style.borderStyle = 'none';
            if (navigator.userAgent.toLowerCase().indexOf('chrome') > -1) {
                div.setAttribute('aria-live', 'off');
            } else {
                div.setAttribute('aria-live', 'polite');
            }
            if (navigator.userAgent.match(/rv:.*Gecko\//)) {
                div.setAttribute('aria-relevant', 'additions');
            } else {
                div.setAttribute('aria-relevant', 'text');
            }
            div.addEventListener('click', this._onClick.bind(this));
            div.addEventListener('focus', this._onFocus.bind(this));
            div.addEventListener('focusout', this._onFocusOut.bind(this));
        }
        if (displayObject.accessibleTitle && displayObject.accessibleTitle !== null) {
            div.title = displayObject.accessibleTitle;
        } else if (!displayObject.accessibleHint || displayObject.accessibleHint === null) {
            div.title = 'displayObject ' + displayObject.tabIndex;
        }
        if (displayObject.accessibleHint && displayObject.accessibleHint !== null) {
            div.setAttribute('aria-label', displayObject.accessibleHint);
        }
        displayObject._accessibleActive = true;
        displayObject._accessibleDiv = div;
        div.displayObject = displayObject;
        this.children.push(displayObject);
        this.div.appendChild(displayObject._accessibleDiv);
        displayObject._accessibleDiv.tabIndex = displayObject.tabIndex;
    };
    AccessibilityManager.prototype._onClick = function _onClick(e) {
        var interactionManager = this.renderer.plugins.interaction;
        interactionManager.dispatchEvent(e.target.displayObject, 'click', interactionManager.eventData);
    };
    AccessibilityManager.prototype._onFocus = function _onFocus(e) {
        if (!e.target.getAttribute('aria-live', 'off')) {
            e.target.setAttribute('aria-live', 'assertive');
        }
        var interactionManager = this.renderer.plugins.interaction;
        interactionManager.dispatchEvent(e.target.displayObject, 'mouseover', interactionManager.eventData);
    };
    AccessibilityManager.prototype._onFocusOut = function _onFocusOut(e) {
        if (!e.target.getAttribute('aria-live', 'off')) {
            e.target.setAttribute('aria-live', 'polite');
        }
        var interactionManager = this.renderer.plugins.interaction;
        interactionManager.dispatchEvent(e.target.displayObject, 'mouseout', interactionManager.eventData);
    };
    AccessibilityManager.prototype._onKeyDown = function _onKeyDown(e) {
        if (e.keyCode !== KEY_CODE_TAB) {
            return;
        }
        this.activate();
    };
    AccessibilityManager.prototype._onMouseMove = function _onMouseMove(e) {
        if (e.movementX === 0 && e.movementY === 0) {
            return;
        }
        this.deactivate();
    };
    AccessibilityManager.prototype.destroy = function destroy() {
        this.div = null;
        for (var i = 0; i < this.children.length; i++) {
            this.children[i].div = null;
        }
        window.document.removeEventListener('mousemove', this._onMouseMove);
        window.removeEventListener('keydown', this._onKeyDown);
        this.pool = null;
        this.children = null;
        this.renderer = null;
    };
    return AccessibilityManager;
}();
exports.default = AccessibilityManager;
core.WebGLRenderer.registerPlugin('accessibility', AccessibilityManager);
core.CanvasRenderer.registerPlugin('accessibility', AccessibilityManager);
},{"../core":65,"./accessibleTarget":41,"ismobilejs":4}],41:[function(require,module,exports){
"use strict";
exports.__esModule = true;
exports.default = {
  accessible: false,
  accessibleTitle: null,
  accessibleHint: null,
  tabIndex: 0,
  _accessibleActive: false,
  _accessibleDiv: false
};
},{}],42:[function(require,module,exports){
'use strict';
exports.__esModule = true;
var _accessibleTarget = require('./accessibleTarget');
Object.defineProperty(exports, 'accessibleTarget', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_accessibleTarget).default;
  }
});
var _AccessibilityManager = require('./AccessibilityManager');
Object.defineProperty(exports, 'AccessibilityManager', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_AccessibilityManager).default;
  }
});
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
},{"./AccessibilityManager":40,"./accessibleTarget":41}],43:[function(require,module,exports){
'use strict';
exports.__esModule = true;
var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
var _autoDetectRenderer = require('./autoDetectRenderer');
var _Container = require('./display/Container');
var _Container2 = _interopRequireDefault(_Container);
var _ticker = require('./ticker');
var _settings = require('./settings');
var _settings2 = _interopRequireDefault(_settings);
var _const = require('./const');
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
var Application = function () {
    function Application(options, arg2, arg3, arg4, arg5) {
        _classCallCheck(this, Application);
        if (typeof options === 'number') {
            options = Object.assign({
                width: options,
                height: arg2 || _settings2.default.RENDER_OPTIONS.height,
                forceCanvas: !!arg4,
                sharedTicker: !!arg5
            }, arg3);
        }
        this._options = options = Object.assign({
            autoStart: true,
            sharedTicker: false,
            forceCanvas: false,
            sharedLoader: false
        }, options);
        this.renderer = (0, _autoDetectRenderer.autoDetectRenderer)(options);
        this.stage = new _Container2.default();
        this._ticker = null;
        this.ticker = options.sharedTicker ? _ticker.shared : new _ticker.Ticker();
        if (options.autoStart) {
            this.start();
        }
    }
    Application.prototype.render = function render() {
        this.renderer.render(this.stage);
    };
    Application.prototype.stop = function stop() {
        this._ticker.stop();
    };
    Application.prototype.start = function start() {
        this._ticker.start();
    };
    Application.prototype.destroy = function destroy(removeView, stageOptions) {
        if (this._ticker) {
            var oldTicker = this._ticker;
            this.ticker = null;
            oldTicker.destroy();
        }
        this.stage.destroy(stageOptions);
        this.stage = null;
        this.renderer.destroy(removeView);
        this.renderer = null;
        this._options = null;
    };
    _createClass(Application, [{
        key: 'ticker',
        set: function set(ticker) 
        {
            if (this._ticker) {
                this._ticker.remove(this.render, this);
            }
            this._ticker = ticker;
            if (ticker) {
                ticker.add(this.render, this, _const.UPDATE_PRIORITY.LOW);
            }
        },
        get: function get() 
        {
            return this._ticker;
        }
    }, {
        key: 'view',
        get: function get() {
            return this.renderer.view;
        }
    }, {
        key: 'screen',
        get: function get() {
            return this.renderer.screen;
        }
    }]);
    return Application;
}();
exports.default = Application;
},{"./autoDetectRenderer":45,"./const":46,"./display/Container":48,"./settings":101,"./ticker":121}],44:[function(require,module,exports){
'use strict';
exports.__esModule = true;
var _pixiGlCore = require('pixi-gl-core');
var _settings = require('./settings');
var _settings2 = _interopRequireDefault(_settings);
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
function checkPrecision(src, def) {
    if (src instanceof Array) {
        if (src[0].substring(0, 9) !== 'precision') {
            var copy = src.slice(0);
            copy.unshift('precision ' + def + ' float;');
            return copy;
        }
    } else if (src.trim().substring(0, 9) !== 'precision') {
        return 'precision ' + def + ' float;\n' + src;
    }
    return src;
}
var Shader = function (_GLShader) {
    _inherits(Shader, _GLShader);
    function Shader(gl, vertexSrc, fragmentSrc, attributeLocations, precision) {
        _classCallCheck(this, Shader);
        return _possibleConstructorReturn(this, _GLShader.call(this, gl, checkPrecision(vertexSrc, precision || _settings2.default.PRECISION_VERTEX), checkPrecision(fragmentSrc, precision || _settings2.default.PRECISION_FRAGMENT), undefined, attributeLocations));
    }
    return Shader;
}(_pixiGlCore.GLShader);
exports.default = Shader;
},{"./settings":101,"pixi-gl-core":15}],45:[function(require,module,exports){
'use strict';
exports.__esModule = true;
exports.autoDetectRenderer = autoDetectRenderer;
var _utils = require('./utils');
var utils = _interopRequireWildcard(_utils);
var _CanvasRenderer = require('./renderers/canvas/CanvasRenderer');
var _CanvasRenderer2 = _interopRequireDefault(_CanvasRenderer);
var _WebGLRenderer = require('./renderers/webgl/WebGLRenderer');
var _WebGLRenderer2 = _interopRequireDefault(_WebGLRenderer);
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }
function autoDetectRenderer(options, arg1, arg2, arg3) {
    var forceCanvas = options && options.forceCanvas;
    if (arg3 !== undefined) {
        forceCanvas = arg3;
    }
    if (!forceCanvas && utils.isWebGLSupported()) {
        return new _WebGLRenderer2.default(options, arg1, arg2);
    }
    return new _CanvasRenderer2.default(options, arg1, arg2);
}
},{"./renderers/canvas/CanvasRenderer":77,"./renderers/webgl/WebGLRenderer":84,"./utils":125}],46:[function(require,module,exports){
'use strict';
exports.__esModule = true;
var VERSION = exports.VERSION = '4.8.1';
var PI_2 = exports.PI_2 = Math.PI * 2;
var RAD_TO_DEG = exports.RAD_TO_DEG = 180 / Math.PI;
var DEG_TO_RAD = exports.DEG_TO_RAD = Math.PI / 180;
var RENDERER_TYPE = exports.RENDERER_TYPE = {
  UNKNOWN: 0,
  WEBGL: 1,
  CANVAS: 2
};
var BLEND_MODES = exports.BLEND_MODES = {
  NORMAL: 0,
  ADD: 1,
  MULTIPLY: 2,
  SCREEN: 3,
  OVERLAY: 4,
  DARKEN: 5,
  LIGHTEN: 6,
  COLOR_DODGE: 7,
  COLOR_BURN: 8,
  HARD_LIGHT: 9,
  SOFT_LIGHT: 10,
  DIFFERENCE: 11,
  EXCLUSION: 12,
  HUE: 13,
  SATURATION: 14,
  COLOR: 15,
  LUMINOSITY: 16,
  NORMAL_NPM: 17,
  ADD_NPM: 18,
  SCREEN_NPM: 19
};
var DRAW_MODES = exports.DRAW_MODES = {
  POINTS: 0,
  LINES: 1,
  LINE_LOOP: 2,
  LINE_STRIP: 3,
  TRIANGLES: 4,
  TRIANGLE_STRIP: 5,
  TRIANGLE_FAN: 6
};
var SCALE_MODES = exports.SCALE_MODES = {
  LINEAR: 0,
  NEAREST: 1
};
var WRAP_MODES = exports.WRAP_MODES = {
  CLAMP: 0,
  REPEAT: 1,
  MIRRORED_REPEAT: 2
};
var GC_MODES = exports.GC_MODES = {
  AUTO: 0,
  MANUAL: 1
};
var URL_FILE_EXTENSION = exports.URL_FILE_EXTENSION = /\.(\w{3,4})(?:$|\?|#)/i;
var DATA_URI = exports.DATA_URI = /^\s*data:(?:([\w-]+)\/([\w+.-]+))?(?:;charset=([\w-]+))?(?:;(base64))?,(.*)/i;
var SVG_SIZE = exports.SVG_SIZE = /<svg[^>]*(?:\s(width|height)=('|")(\d*(?:\.\d+)?)(?:px)?('|"))[^>]*(?:\s(width|height)=('|")(\d*(?:\.\d+)?)(?:px)?('|"))[^>]*>/i; 
var SHAPES = exports.SHAPES = {
  POLY: 0,
  RECT: 1,
  CIRC: 2,
  ELIP: 3,
  RREC: 4
};
var PRECISION = exports.PRECISION = {
  LOW: 'lowp',
  MEDIUM: 'mediump',
  HIGH: 'highp'
};
var TRANSFORM_MODE = exports.TRANSFORM_MODE = {
  STATIC: 0,
  DYNAMIC: 1
};
var TEXT_GRADIENT = exports.TEXT_GRADIENT = {
  LINEAR_VERTICAL: 0,
  LINEAR_HORIZONTAL: 1
};
var UPDATE_PRIORITY = exports.UPDATE_PRIORITY = {
  INTERACTION: 50,
  HIGH: 25,
  NORMAL: 0,
  LOW: -25,
  UTILITY: -50
};
},{}],47:[function(require,module,exports){
'use strict';
exports.__esModule = true;
var _math = require('../math');
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
var Bounds = function () {
    function Bounds() {
        _classCallCheck(this, Bounds);
        this.minX = Infinity;
        this.minY = Infinity;
        this.maxX = -Infinity;
        this.maxY = -Infinity;
        this.rect = null;
    }
    Bounds.prototype.isEmpty = function isEmpty() {
        return this.minX > this.maxX || this.minY > this.maxY;
    };
    Bounds.prototype.clear = function clear() {
        this.updateID++;
        this.minX = Infinity;
        this.minY = Infinity;
        this.maxX = -Infinity;
        this.maxY = -Infinity;
    };
    Bounds.prototype.getRectangle = function getRectangle(rect) {
        if (this.minX > this.maxX || this.minY > this.maxY) {
            return _math.Rectangle.EMPTY;
        }
        rect = rect || new _math.Rectangle(0, 0, 1, 1);
        rect.x = this.minX;
        rect.y = this.minY;
        rect.width = this.maxX - this.minX;
        rect.height = this.maxY - this.minY;
        return rect;
    };
    Bounds.prototype.addPoint = function addPoint(point) {
        this.minX = Math.min(this.minX, point.x);
        this.maxX = Math.max(this.maxX, point.x);
        this.minY = Math.min(this.minY, point.y);
        this.maxY = Math.max(this.maxY, point.y);
    };
    Bounds.prototype.addQuad = function addQuad(vertices) {
        var minX = this.minX;
        var minY = this.minY;
        var maxX = this.maxX;
        var maxY = this.maxY;
        var x = vertices[0];
        var y = vertices[1];
        minX = x < minX ? x : minX;
        minY = y < minY ? y : minY;
        maxX = x > maxX ? x : maxX;
        maxY = y > maxY ? y : maxY;
        x = vertices[2];
        y = vertices[3];
        minX = x < minX ? x : minX;
        minY = y < minY ? y : minY;
        maxX = x > maxX ? x : maxX;
        maxY = y > maxY ? y : maxY;
        x = vertices[4];
        y = vertices[5];
        minX = x < minX ? x : minX;
        minY = y < minY ? y : minY;
        maxX = x > maxX ? x : maxX;
        maxY = y > maxY ? y : maxY;
        x = vertices[6];
        y = vertices[7];
        minX = x < minX ? x : minX;
        minY = y < minY ? y : minY;
        maxX = x > maxX ? x : maxX;
        maxY = y > maxY ? y : maxY;
        this.minX = minX;
        this.minY = minY;
        this.maxX = maxX;
        this.maxY = maxY;
    };
    Bounds.prototype.addFrame = function addFrame(transform, x0, y0, x1, y1) {
        var matrix = transform.worldTransform;
        var a = matrix.a;
        var b = matrix.b;
        var c = matrix.c;
        var d = matrix.d;
        var tx = matrix.tx;
        var ty = matrix.ty;
        var minX = this.minX;
        var minY = this.minY;
        var maxX = this.maxX;
        var maxY = this.maxY;
        var x = a * x0 + c * y0 + tx;
        var y = b * x0 + d * y0 + ty;
        minX = x < minX ? x : minX;
        minY = y < minY ? y : minY;
        maxX = x > maxX ? x : maxX;
        maxY = y > maxY ? y : maxY;
        x = a * x1 + c * y0 + tx;
        y = b * x1 + d * y0 + ty;
        minX = x < minX ? x : minX;
        minY = y < minY ? y : minY;
        maxX = x > maxX ? x : maxX;
        maxY = y > maxY ? y : maxY;
        x = a * x0 + c * y1 + tx;
        y = b * x0 + d * y1 + ty;
        minX = x < minX ? x : minX;
        minY = y < minY ? y : minY;
        maxX = x > maxX ? x : maxX;
        maxY = y > maxY ? y : maxY;
        x = a * x1 + c * y1 + tx;
        y = b * x1 + d * y1 + ty;
        minX = x < minX ? x : minX;
        minY = y < minY ? y : minY;
        maxX = x > maxX ? x : maxX;
        maxY = y > maxY ? y : maxY;
        this.minX = minX;
        this.minY = minY;
        this.maxX = maxX;
        this.maxY = maxY;
    };
    Bounds.prototype.addVertices = function addVertices(transform, vertices, beginOffset, endOffset) {
        var matrix = transform.worldTransform;
        var a = matrix.a;
        var b = matrix.b;
        var c = matrix.c;
        var d = matrix.d;
        var tx = matrix.tx;
        var ty = matrix.ty;
        var minX = this.minX;
        var minY = this.minY;
        var maxX = this.maxX;
        var maxY = this.maxY;
        for (var i = beginOffset; i < endOffset; i += 2) {
            var rawX = vertices[i];
            var rawY = vertices[i + 1];
            var x = a * rawX + c * rawY + tx;
            var y = d * rawY + b * rawX + ty;
            minX = x < minX ? x : minX;
            minY = y < minY ? y : minY;
            maxX = x > maxX ? x : maxX;
            maxY = y > maxY ? y : maxY;
        }
        this.minX = minX;
        this.minY = minY;
        this.maxX = maxX;
        this.maxY = maxY;
    };
    Bounds.prototype.addBounds = function addBounds(bounds) {
        var minX = this.minX;
        var minY = this.minY;
        var maxX = this.maxX;
        var maxY = this.maxY;
        this.minX = bounds.minX < minX ? bounds.minX : minX;
        this.minY = bounds.minY < minY ? bounds.minY : minY;
        this.maxX = bounds.maxX > maxX ? bounds.maxX : maxX;
        this.maxY = bounds.maxY > maxY ? bounds.maxY : maxY;
    };
    Bounds.prototype.addBoundsMask = function addBoundsMask(bounds, mask) {
        var _minX = bounds.minX > mask.minX ? bounds.minX : mask.minX;
        var _minY = bounds.minY > mask.minY ? bounds.minY : mask.minY;
        var _maxX = bounds.maxX < mask.maxX ? bounds.maxX : mask.maxX;
        var _maxY = bounds.maxY < mask.maxY ? bounds.maxY : mask.maxY;
        if (_minX <= _maxX && _minY <= _maxY) {
            var minX = this.minX;
            var minY = this.minY;
            var maxX = this.maxX;
            var maxY = this.maxY;
            this.minX = _minX < minX ? _minX : minX;
            this.minY = _minY < minY ? _minY : minY;
            this.maxX = _maxX > maxX ? _maxX : maxX;
            this.maxY = _maxY > maxY ? _maxY : maxY;
        }
    };
    Bounds.prototype.addBoundsArea = function addBoundsArea(bounds, area) {
        var _minX = bounds.minX > area.x ? bounds.minX : area.x;
        var _minY = bounds.minY > area.y ? bounds.minY : area.y;
        var _maxX = bounds.maxX < area.x + area.width ? bounds.maxX : area.x + area.width;
        var _maxY = bounds.maxY < area.y + area.height ? bounds.maxY : area.y + area.height;
        if (_minX <= _maxX && _minY <= _maxY) {
            var minX = this.minX;
            var minY = this.minY;
            var maxX = this.maxX;
            var maxY = this.maxY;
            this.minX = _minX < minX ? _minX : minX;
            this.minY = _minY < minY ? _minY : minY;
            this.maxX = _maxX > maxX ? _maxX : maxX;
            this.maxY = _maxY > maxY ? _maxY : maxY;
        }
    };
    return Bounds;
}();
exports.default = Bounds;
},{"../math":70}],48:[function(require,module,exports){
'use strict';
exports.__esModule = true;
var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
var _utils = require('../utils');
var _DisplayObject2 = require('./DisplayObject');
var _DisplayObject3 = _interopRequireDefault(_DisplayObject2);
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
var Container = function (_DisplayObject) {
    _inherits(Container, _DisplayObject);
    function Container() {
        _classCallCheck(this, Container);
        var _this = _possibleConstructorReturn(this, _DisplayObject.call(this));
        _this.children = [];
        return _this;
    }
    Container.prototype.onChildrenChange = function onChildrenChange() {}
    ;
    Container.prototype.addChild = function addChild(child) {
        var argumentsLength = arguments.length;
        if (argumentsLength > 1) {
            for (var i = 0; i < argumentsLength; i++) {
                this.addChild(arguments[i]);
            }
        } else {
            if (child.parent) {
                child.parent.removeChild(child);
            }
            child.parent = this;
            child.transform._parentID = -1;
            this.children.push(child);
            this._boundsID++;
            this.onChildrenChange(this.children.length - 1);
            child.emit('added', this);
        }
        return child;
    };
    Container.prototype.addChildAt = function addChildAt(child, index) {
        if (index < 0 || index > this.children.length) {
            throw new Error(child + 'addChildAt: The index ' + index + ' supplied is out of bounds ' + this.children.length);
        }
        if (child.parent) {
            child.parent.removeChild(child);
        }
        child.parent = this;
        child.transform._parentID = -1;
        this.children.splice(index, 0, child);
        this._boundsID++;
        this.onChildrenChange(index);
        child.emit('added', this);
        return child;
    };
    Container.prototype.swapChildren = function swapChildren(child, child2) {
        if (child === child2) {
            return;
        }
        var index1 = this.getChildIndex(child);
        var index2 = this.getChildIndex(child2);
        this.children[index1] = child2;
        this.children[index2] = child;
        this.onChildrenChange(index1 < index2 ? index1 : index2);
    };
    Container.prototype.getChildIndex = function getChildIndex(child) {
        var index = this.children.indexOf(child);
        if (index === -1) {
            throw new Error('The supplied DisplayObject must be a child of the caller');
        }
        return index;
    };
    Container.prototype.setChildIndex = function setChildIndex(child, index) {
        if (index < 0 || index >= this.children.length) {
            throw new Error('The index ' + index + ' supplied is out of bounds ' + this.children.length);
        }
        var currentIndex = this.getChildIndex(child);
        (0, _utils.removeItems)(this.children, currentIndex, 1); 
        this.children.splice(index, 0, child); 
        this.onChildrenChange(index);
    };
    Container.prototype.getChildAt = function getChildAt(index) {
        if (index < 0 || index >= this.children.length) {
            throw new Error('getChildAt: Index (' + index + ') does not exist.');
        }
        return this.children[index];
    };
    Container.prototype.removeChild = function removeChild(child) {
        var argumentsLength = arguments.length;
        if (argumentsLength > 1) {
            for (var i = 0; i < argumentsLength; i++) {
                this.removeChild(arguments[i]);
            }
        } else {
            var index = this.children.indexOf(child);
            if (index === -1) return null;
            child.parent = null;
            child.transform._parentID = -1;
            (0, _utils.removeItems)(this.children, index, 1);
            this._boundsID++;
            this.onChildrenChange(index);
            child.emit('removed', this);
        }
        return child;
    };
    Container.prototype.removeChildAt = function removeChildAt(index) {
        var child = this.getChildAt(index);
        child.parent = null;
        child.transform._parentID = -1;
        (0, _utils.removeItems)(this.children, index, 1);
        this._boundsID++;
        this.onChildrenChange(index);
        child.emit('removed', this);
        return child;
    };
    Container.prototype.removeChildren = function removeChildren() {
        var beginIndex = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
        var endIndex = arguments[1];
        var begin = beginIndex;
        var end = typeof endIndex === 'number' ? endIndex : this.children.length;
        var range = end - begin;
        var removed = void 0;
        if (range > 0 && range <= end) {
            removed = this.children.splice(begin, range);
            for (var i = 0; i < removed.length; ++i) {
                removed[i].parent = null;
                if (removed[i].transform) {
                    removed[i].transform._parentID = -1;
                }
            }
            this._boundsID++;
            this.onChildrenChange(beginIndex);
            for (var _i = 0; _i < removed.length; ++_i) {
                removed[_i].emit('removed', this);
            }
            return removed;
        } else if (range === 0 && this.children.length === 0) {
            return [];
        }
        throw new RangeError('removeChildren: numeric values are outside the acceptable range.');
    };
    Container.prototype.updateTransform = function updateTransform() {
        this._boundsID++;
        this.transform.updateTransform(this.parent.transform);
        this.worldAlpha = this.alpha * this.parent.worldAlpha;
        for (var i = 0, j = this.children.length; i < j; ++i) {
            var child = this.children[i];
            if (child.visible) {
                child.updateTransform();
            }
        }
    };
    Container.prototype.calculateBounds = function calculateBounds() {
        this._bounds.clear();
        this._calculateBounds();
        for (var i = 0; i < this.children.length; i++) {
            var child = this.children[i];
            if (!child.visible || !child.renderable) {
                continue;
            }
            child.calculateBounds();
            if (child._mask) {
                child._mask.calculateBounds();
                this._bounds.addBoundsMask(child._bounds, child._mask._bounds);
            } else if (child.filterArea) {
                this._bounds.addBoundsArea(child._bounds, child.filterArea);
            } else {
                this._bounds.addBounds(child._bounds);
            }
        }
        this._lastBoundsID = this._boundsID;
    };
    Container.prototype._calculateBounds = function _calculateBounds() {}
    ;
    Container.prototype.renderWebGL = function renderWebGL(renderer) {
        if (!this.visible || this.worldAlpha <= 0 || !this.renderable) {
            return;
        }
        if (this._mask || this._filters) {
            this.renderAdvancedWebGL(renderer);
        } else {
            this._renderWebGL(renderer);
            for (var i = 0, j = this.children.length; i < j; ++i) {
                this.children[i].renderWebGL(renderer);
            }
        }
    };
    Container.prototype.renderAdvancedWebGL = function renderAdvancedWebGL(renderer) {
        renderer.flush();
        var filters = this._filters;
        var mask = this._mask;
        if (filters) {
            if (!this._enabledFilters) {
                this._enabledFilters = [];
            }
            this._enabledFilters.length = 0;
            for (var i = 0; i < filters.length; i++) {
                if (filters[i].enabled) {
                    this._enabledFilters.push(filters[i]);
                }
            }
            if (this._enabledFilters.length) {
                renderer.filterManager.pushFilter(this, this._enabledFilters);
            }
        }
        if (mask) {
            renderer.maskManager.pushMask(this, this._mask);
        }
        this._renderWebGL(renderer);
        for (var _i2 = 0, j = this.children.length; _i2 < j; _i2++) {
            this.children[_i2].renderWebGL(renderer);
        }
        renderer.flush();
        if (mask) {
            renderer.maskManager.popMask(this, this._mask);
        }
        if (filters && this._enabledFilters && this._enabledFilters.length) {
            renderer.filterManager.popFilter();
        }
    };
    Container.prototype._renderWebGL = function _renderWebGL(renderer) 
    {}
    ;
    Container.prototype._renderCanvas = function _renderCanvas(renderer) 
    {}
    ;
    Container.prototype.renderCanvas = function renderCanvas(renderer) {
        if (!this.visible || this.worldAlpha <= 0 || !this.renderable) {
            return;
        }
        if (this._mask) {
            renderer.maskManager.pushMask(this._mask);
        }
        this._renderCanvas(renderer);
        for (var i = 0, j = this.children.length; i < j; ++i) {
            this.children[i].renderCanvas(renderer);
        }
        if (this._mask) {
            renderer.maskManager.popMask(renderer);
        }
    };
    Container.prototype.destroy = function destroy(options) {
        _DisplayObject.prototype.destroy.call(this);
        var destroyChildren = typeof options === 'boolean' ? options : options && options.children;
        var oldChildren = this.removeChildren(0, this.children.length);
        if (destroyChildren) {
            for (var i = 0; i < oldChildren.length; ++i) {
                oldChildren[i].destroy(options);
            }
        }
    };
    _createClass(Container, [{
        key: 'width',
        get: function get() {
            return this.scale.x * this.getLocalBounds().width;
        },
        set: function set(value) 
        {
            var width = this.getLocalBounds().width;
            if (width !== 0) {
                this.scale.x = value / width;
            } else {
                this.scale.x = 1;
            }
            this._width = value;
        }
    }, {
        key: 'height',
        get: function get() {
            return this.scale.y * this.getLocalBounds().height;
        },
        set: function set(value) 
        {
            var height = this.getLocalBounds().height;
            if (height !== 0) {
                this.scale.y = value / height;
            } else {
                this.scale.y = 1;
            }
            this._height = value;
        }
    }]);
    return Container;
}(_DisplayObject3.default);
exports.default = Container;
Container.prototype.containerUpdateTransform = Container.prototype.updateTransform;
},{"../utils":125,"./DisplayObject":49}],49:[function(require,module,exports){
'use strict';
exports.__esModule = true;
var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
var _eventemitter = require('eventemitter3');
var _eventemitter2 = _interopRequireDefault(_eventemitter);
var _const = require('../const');
var _settings = require('../settings');
var _settings2 = _interopRequireDefault(_settings);
var _TransformStatic = require('./TransformStatic');
var _TransformStatic2 = _interopRequireDefault(_TransformStatic);
var _Transform = require('./Transform');
var _Transform2 = _interopRequireDefault(_Transform);
var _Bounds = require('./Bounds');
var _Bounds2 = _interopRequireDefault(_Bounds);
var _math = require('../math');
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
var DisplayObject = function (_EventEmitter) {
    _inherits(DisplayObject, _EventEmitter);
    function DisplayObject() {
        _classCallCheck(this, DisplayObject);
        var _this = _possibleConstructorReturn(this, _EventEmitter.call(this));
        var TransformClass = _settings2.default.TRANSFORM_MODE === _const.TRANSFORM_MODE.STATIC ? _TransformStatic2.default : _Transform2.default;
        _this.tempDisplayObjectParent = null;
        _this.transform = new TransformClass();
        _this.alpha = 1;
        _this.visible = true;
        _this.renderable = true;
        _this.parent = null;
        _this.worldAlpha = 1;
        _this.filterArea = null;
        _this._filters = null;
        _this._enabledFilters = null;
        _this._bounds = new _Bounds2.default();
        _this._boundsID = 0;
        _this._lastBoundsID = -1;
        _this._boundsRect = null;
        _this._localBoundsRect = null;
        _this._mask = null;
        _this._destroyed = false;
        return _this;
    }
    DisplayObject.prototype.updateTransform = function updateTransform() {
        this.transform.updateTransform(this.parent.transform);
        this.worldAlpha = this.alpha * this.parent.worldAlpha;
        this._bounds.updateID++;
    };
    DisplayObject.prototype._recursivePostUpdateTransform = function _recursivePostUpdateTransform() {
        if (this.parent) {
            this.parent._recursivePostUpdateTransform();
            this.transform.updateTransform(this.parent.transform);
        } else {
            this.transform.updateTransform(this._tempDisplayObjectParent.transform);
        }
    };
    DisplayObject.prototype.getBounds = function getBounds(skipUpdate, rect) {
        if (!skipUpdate) {
            if (!this.parent) {
                this.parent = this._tempDisplayObjectParent;
                this.updateTransform();
                this.parent = null;
            } else {
                this._recursivePostUpdateTransform();
                this.updateTransform();
            }
        }
        if (this._boundsID !== this._lastBoundsID) {
            this.calculateBounds();
        }
        if (!rect) {
            if (!this._boundsRect) {
                this._boundsRect = new _math.Rectangle();
            }
            rect = this._boundsRect;
        }
        return this._bounds.getRectangle(rect);
    };
    DisplayObject.prototype.getLocalBounds = function getLocalBounds(rect) {
        var transformRef = this.transform;
        var parentRef = this.parent;
        this.parent = null;
        this.transform = this._tempDisplayObjectParent.transform;
        if (!rect) {
            if (!this._localBoundsRect) {
                this._localBoundsRect = new _math.Rectangle();
            }
            rect = this._localBoundsRect;
        }
        var bounds = this.getBounds(false, rect);
        this.parent = parentRef;
        this.transform = transformRef;
        return bounds;
    };
    DisplayObject.prototype.toGlobal = function toGlobal(position, point) {
        var skipUpdate = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
        if (!skipUpdate) {
            this._recursivePostUpdateTransform();
            if (!this.parent) {
                this.parent = this._tempDisplayObjectParent;
                this.displayObjectUpdateTransform();
                this.parent = null;
            } else {
                this.displayObjectUpdateTransform();
            }
        }
        return this.worldTransform.apply(position, point);
    };
    DisplayObject.prototype.toLocal = function toLocal(position, from, point, skipUpdate) {
        if (from) {
            position = from.toGlobal(position, point, skipUpdate);
        }
        if (!skipUpdate) {
            this._recursivePostUpdateTransform();
            if (!this.parent) {
                this.parent = this._tempDisplayObjectParent;
                this.displayObjectUpdateTransform();
                this.parent = null;
            } else {
                this.displayObjectUpdateTransform();
            }
        }
        return this.worldTransform.applyInverse(position, point);
    };
    DisplayObject.prototype.renderWebGL = function renderWebGL(renderer) 
    {}
    ;
    DisplayObject.prototype.renderCanvas = function renderCanvas(renderer) 
    {}
    ;
    DisplayObject.prototype.setParent = function setParent(container) {
        if (!container || !container.addChild) {
            throw new Error('setParent: Argument must be a Container');
        }
        container.addChild(this);
        return container;
    };
    DisplayObject.prototype.setTransform = function setTransform() {
        var x = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
        var y = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
        var scaleX = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;
        var scaleY = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 1;
        var rotation = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 0;
        var skewX = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : 0;
        var skewY = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : 0;
        var pivotX = arguments.length > 7 && arguments[7] !== undefined ? arguments[7] : 0;
        var pivotY = arguments.length > 8 && arguments[8] !== undefined ? arguments[8] : 0;
        this.position.x = x;
        this.position.y = y;
        this.scale.x = !scaleX ? 1 : scaleX;
        this.scale.y = !scaleY ? 1 : scaleY;
        this.rotation = rotation;
        this.skew.x = skewX;
        this.skew.y = skewY;
        this.pivot.x = pivotX;
        this.pivot.y = pivotY;
        return this;
    };
    DisplayObject.prototype.destroy = function destroy() {
        this.removeAllListeners();
        if (this.parent) {
            this.parent.removeChild(this);
        }
        this.transform = null;
        this.parent = null;
        this._bounds = null;
        this._currentBounds = null;
        this._mask = null;
        this.filterArea = null;
        this.interactive = false;
        this.interactiveChildren = false;
        this._destroyed = true;
    };
    _createClass(DisplayObject, [{
        key: '_tempDisplayObjectParent',
        get: function get() {
            if (this.tempDisplayObjectParent === null) {
                this.tempDisplayObjectParent = new DisplayObject();
            }
            return this.tempDisplayObjectParent;
        }
    }, {
        key: 'x',
        get: function get() {
            return this.position.x;
        },
        set: function set(value) 
        {
            this.transform.position.x = value;
        }
    }, {
        key: 'y',
        get: function get() {
            return this.position.y;
        },
        set: function set(value) 
        {
            this.transform.position.y = value;
        }
    }, {
        key: 'worldTransform',
        get: function get() {
            return this.transform.worldTransform;
        }
    }, {
        key: 'localTransform',
        get: function get() {
            return this.transform.localTransform;
        }
    }, {
        key: 'position',
        get: function get() {
            return this.transform.position;
        },
        set: function set(value) 
        {
            this.transform.position.copy(value);
        }
    }, {
        key: 'scale',
        get: function get() {
            return this.transform.scale;
        },
        set: function set(value) 
        {
            this.transform.scale.copy(value);
        }
    }, {
        key: 'pivot',
        get: function get() {
            return this.transform.pivot;
        },
        set: function set(value) 
        {
            this.transform.pivot.copy(value);
        }
    }, {
        key: 'skew',
        get: function get() {
            return this.transform.skew;
        },
        set: function set(value) 
        {
            this.transform.skew.copy(value);
        }
    }, {
        key: 'rotation',
        get: function get() {
            return this.transform.rotation;
        },
        set: function set(value) 
        {
            this.transform.rotation = value;
        }
    }, {
        key: 'worldVisible',
        get: function get() {
            var item = this;
            do {
                if (!item.visible) {
                    return false;
                }
                item = item.parent;
            } while (item);
            return true;
        }
    }, {
        key: 'mask',
        get: function get() {
            return this._mask;
        },
        set: function set(value) 
        {
            if (this._mask) {
                this._mask.renderable = true;
                this._mask.isMask = false;
            }
            this._mask = value;
            if (this._mask) {
                this._mask.renderable = false;
                this._mask.isMask = true;
            }
        }
    }, {
        key: 'filters',
        get: function get() {
            return this._filters && this._filters.slice();
        },
        set: function set(value) 
        {
            this._filters = value && value.slice();
        }
    }]);
    return DisplayObject;
}(_eventemitter2.default);
exports.default = DisplayObject;
DisplayObject.prototype.displayObjectUpdateTransform = DisplayObject.prototype.updateTransform;
},{"../const":46,"../math":70,"../settings":101,"./Bounds":47,"./Transform":50,"./TransformStatic":52,"eventemitter3":3}],50:[function(require,module,exports){
'use strict';
exports.__esModule = true;
var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
var _math = require('../math');
var _TransformBase2 = require('./TransformBase');
var _TransformBase3 = _interopRequireDefault(_TransformBase2);
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
var Transform = function (_TransformBase) {
  _inherits(Transform, _TransformBase);
  function Transform() {
    _classCallCheck(this, Transform);
    var _this = _possibleConstructorReturn(this, _TransformBase.call(this));
    _this.position = new _math.Point(0, 0);
    _this.scale = new _math.Point(1, 1);
    _this.skew = new _math.ObservablePoint(_this.updateSkew, _this, 0, 0);
    _this.pivot = new _math.Point(0, 0);
    _this._rotation = 0;
    _this._cx = 1; 
    _this._sx = 0; 
    _this._cy = 0; 
    _this._sy = 1; 
    return _this;
  }
  Transform.prototype.updateSkew = function updateSkew() {
    this._cx = Math.cos(this._rotation + this.skew._y);
    this._sx = Math.sin(this._rotation + this.skew._y);
    this._cy = -Math.sin(this._rotation - this.skew._x); 
    this._sy = Math.cos(this._rotation - this.skew._x); 
  };
  Transform.prototype.updateLocalTransform = function updateLocalTransform() {
    var lt = this.localTransform;
    lt.a = this._cx * this.scale.x;
    lt.b = this._sx * this.scale.x;
    lt.c = this._cy * this.scale.y;
    lt.d = this._sy * this.scale.y;
    lt.tx = this.position.x - (this.pivot.x * lt.a + this.pivot.y * lt.c);
    lt.ty = this.position.y - (this.pivot.x * lt.b + this.pivot.y * lt.d);
  };
  Transform.prototype.updateTransform = function updateTransform(parentTransform) {
    var lt = this.localTransform;
    lt.a = this._cx * this.scale.x;
    lt.b = this._sx * this.scale.x;
    lt.c = this._cy * this.scale.y;
    lt.d = this._sy * this.scale.y;
    lt.tx = this.position.x - (this.pivot.x * lt.a + this.pivot.y * lt.c);
    lt.ty = this.position.y - (this.pivot.x * lt.b + this.pivot.y * lt.d);
    var pt = parentTransform.worldTransform;
    var wt = this.worldTransform;
    wt.a = lt.a * pt.a + lt.b * pt.c;
    wt.b = lt.a * pt.b + lt.b * pt.d;
    wt.c = lt.c * pt.a + lt.d * pt.c;
    wt.d = lt.c * pt.b + lt.d * pt.d;
    wt.tx = lt.tx * pt.a + lt.ty * pt.c + pt.tx;
    wt.ty = lt.tx * pt.b + lt.ty * pt.d + pt.ty;
    this._worldID++;
  };
  Transform.prototype.setFromMatrix = function setFromMatrix(matrix) {
    matrix.decompose(this);
  };
  _createClass(Transform, [{
    key: 'rotation',
    get: function get() {
      return this._rotation;
    },
    set: function set(value) 
    {
      this._rotation = value;
      this.updateSkew();
    }
  }]);
  return Transform;
}(_TransformBase3.default);
exports.default = Transform;
},{"../math":70,"./TransformBase":51}],51:[function(require,module,exports){
'use strict';
exports.__esModule = true;
var _math = require('../math');
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
var TransformBase = function () {
  function TransformBase() {
    _classCallCheck(this, TransformBase);
    this.worldTransform = new _math.Matrix();
    this.localTransform = new _math.Matrix();
    this._worldID = 0;
    this._parentID = 0;
  }
  TransformBase.prototype.updateLocalTransform = function updateLocalTransform() {}
  ;
  TransformBase.prototype.updateTransform = function updateTransform(parentTransform) {
    var pt = parentTransform.worldTransform;
    var wt = this.worldTransform;
    var lt = this.localTransform;
    wt.a = lt.a * pt.a + lt.b * pt.c;
    wt.b = lt.a * pt.b + lt.b * pt.d;
    wt.c = lt.c * pt.a + lt.d * pt.c;
    wt.d = lt.c * pt.b + lt.d * pt.d;
    wt.tx = lt.tx * pt.a + lt.ty * pt.c + pt.tx;
    wt.ty = lt.tx * pt.b + lt.ty * pt.d + pt.ty;
    this._worldID++;
  };
  return TransformBase;
}();
exports.default = TransformBase;
TransformBase.prototype.updateWorldTransform = TransformBase.prototype.updateTransform;
TransformBase.IDENTITY = new TransformBase();
},{"../math":70}],52:[function(require,module,exports){
'use strict';
exports.__esModule = true;
var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
var _math = require('../math');
var _TransformBase2 = require('./TransformBase');
var _TransformBase3 = _interopRequireDefault(_TransformBase2);
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
var TransformStatic = function (_TransformBase) {
    _inherits(TransformStatic, _TransformBase);
    function TransformStatic() {
        _classCallCheck(this, TransformStatic);
        var _this = _possibleConstructorReturn(this, _TransformBase.call(this));
        _this.position = new _math.ObservablePoint(_this.onChange, _this, 0, 0);
        _this.scale = new _math.ObservablePoint(_this.onChange, _this, 1, 1);
        _this.pivot = new _math.ObservablePoint(_this.onChange, _this, 0, 0);
        _this.skew = new _math.ObservablePoint(_this.updateSkew, _this, 0, 0);
        _this._rotation = 0;
        _this._cx = 1; 
        _this._sx = 0; 
        _this._cy = 0; 
        _this._sy = 1; 
        _this._localID = 0;
        _this._currentLocalID = 0;
        return _this;
    }
    TransformStatic.prototype.onChange = function onChange() {
        this._localID++;
    };
    TransformStatic.prototype.updateSkew = function updateSkew() {
        this._cx = Math.cos(this._rotation + this.skew._y);
        this._sx = Math.sin(this._rotation + this.skew._y);
        this._cy = -Math.sin(this._rotation - this.skew._x); 
        this._sy = Math.cos(this._rotation - this.skew._x); 
        this._localID++;
    };
    TransformStatic.prototype.updateLocalTransform = function updateLocalTransform() {
        var lt = this.localTransform;
        if (this._localID !== this._currentLocalID) {
            lt.a = this._cx * this.scale._x;
            lt.b = this._sx * this.scale._x;
            lt.c = this._cy * this.scale._y;
            lt.d = this._sy * this.scale._y;
            lt.tx = this.position._x - (this.pivot._x * lt.a + this.pivot._y * lt.c);
            lt.ty = this.position._y - (this.pivot._x * lt.b + this.pivot._y * lt.d);
            this._currentLocalID = this._localID;
            this._parentID = -1;
        }
    };
    TransformStatic.prototype.updateTransform = function updateTransform(parentTransform) {
        var lt = this.localTransform;
        if (this._localID !== this._currentLocalID) {
            lt.a = this._cx * this.scale._x;
            lt.b = this._sx * this.scale._x;
            lt.c = this._cy * this.scale._y;
            lt.d = this._sy * this.scale._y;
            lt.tx = this.position._x - (this.pivot._x * lt.a + this.pivot._y * lt.c);
            lt.ty = this.position._y - (this.pivot._x * lt.b + this.pivot._y * lt.d);
            this._currentLocalID = this._localID;
            this._parentID = -1;
        }
        if (this._parentID !== parentTransform._worldID) {
            var pt = parentTransform.worldTransform;
            var wt = this.worldTransform;
            wt.a = lt.a * pt.a + lt.b * pt.c;
            wt.b = lt.a * pt.b + lt.b * pt.d;
            wt.c = lt.c * pt.a + lt.d * pt.c;
            wt.d = lt.c * pt.b + lt.d * pt.d;
            wt.tx = lt.tx * pt.a + lt.ty * pt.c + pt.tx;
            wt.ty = lt.tx * pt.b + lt.ty * pt.d + pt.ty;
            this._parentID = parentTransform._worldID;
            this._worldID++;
        }
    };
    TransformStatic.prototype.setFromMatrix = function setFromMatrix(matrix) {
        matrix.decompose(this);
        this._localID++;
    };
    _createClass(TransformStatic, [{
        key: 'rotation',
        get: function get() {
            return this._rotation;
        },
        set: function set(value) 
        {
            this._rotation = value;
            this.updateSkew();
        }
    }]);
    return TransformStatic;
}(_TransformBase3.default);
exports.default = TransformStatic;
},{"../math":70,"./TransformBase":51}],53:[function(require,module,exports){
'use strict';
exports.__esModule = true;
var _Container2 = require('../display/Container');
var _Container3 = _interopRequireDefault(_Container2);
var _RenderTexture = require('../textures/RenderTexture');
var _RenderTexture2 = _interopRequireDefault(_RenderTexture);
var _Texture = require('../textures/Texture');
var _Texture2 = _interopRequireDefault(_Texture);
var _GraphicsData = require('./GraphicsData');
var _GraphicsData2 = _interopRequireDefault(_GraphicsData);
var _Sprite = require('../sprites/Sprite');
var _Sprite2 = _interopRequireDefault(_Sprite);
var _math = require('../math');
var _utils = require('../utils');
var _const = require('../const');
var _Bounds = require('../display/Bounds');
var _Bounds2 = _interopRequireDefault(_Bounds);
var _bezierCurveTo2 = require('./utils/bezierCurveTo');
var _bezierCurveTo3 = _interopRequireDefault(_bezierCurveTo2);
var _CanvasRenderer = require('../renderers/canvas/CanvasRenderer');
var _CanvasRenderer2 = _interopRequireDefault(_CanvasRenderer);
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
var canvasRenderer = void 0;
var tempMatrix = new _math.Matrix();
var tempPoint = new _math.Point();
var tempColor1 = new Float32Array(4);
var tempColor2 = new Float32Array(4);
var Graphics = function (_Container) {
    _inherits(Graphics, _Container);
    function Graphics() {
        var nativeLines = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
        _classCallCheck(this, Graphics);
        var _this = _possibleConstructorReturn(this, _Container.call(this));
        _this.fillAlpha = 1;
        _this.lineWidth = 0;
        _this.nativeLines = nativeLines;
        _this.lineColor = 0;
        _this.lineAlignment = 0.5;
        _this.graphicsData = [];
        _this.tint = 0xFFFFFF;
        _this._prevTint = 0xFFFFFF;
        _this.blendMode = _const.BLEND_MODES.NORMAL;
        _this.currentPath = null;
        _this._webGL = {};
        _this.isMask = false;
        _this.boundsPadding = 0;
        _this._localBounds = new _Bounds2.default();
        _this.dirty = 0;
        _this.fastRectDirty = -1;
        _this.clearDirty = 0;
        _this.boundsDirty = -1;
        _this.cachedSpriteDirty = false;
        _this._spriteRect = null;
        _this._fastRect = false;
        return _this;
    }
    Graphics.prototype.clone = function clone() {
        var clone = new Graphics();
        clone.renderable = this.renderable;
        clone.fillAlpha = this.fillAlpha;
        clone.lineWidth = this.lineWidth;
        clone.lineColor = this.lineColor;
        clone.lineAlignment = this.lineAlignment;
        clone.tint = this.tint;
        clone.blendMode = this.blendMode;
        clone.isMask = this.isMask;
        clone.boundsPadding = this.boundsPadding;
        clone.dirty = 0;
        clone.cachedSpriteDirty = this.cachedSpriteDirty;
        for (var i = 0; i < this.graphicsData.length; ++i) {
            clone.graphicsData.push(this.graphicsData[i].clone());
        }
        clone.currentPath = clone.graphicsData[clone.graphicsData.length - 1];
        clone.updateLocalBounds();
        return clone;
    };
    Graphics.prototype._quadraticCurveLength = function _quadraticCurveLength(fromX, fromY, cpX, cpY, toX, toY) {
        var ax = fromX - (2.0 * cpX + toX);
        var ay = fromY - (2.0 * cpY + toY);
        var bx = 2.0 * ((cpX - 2.0) * fromX);
        var by = 2.0 * ((cpY - 2.0) * fromY);
        var a = 4.0 * (ax * ax + ay * ay);
        var b = 4.0 * (ax * bx + ay * by);
        var c = bx * bx + by * by;
        var s = 2.0 * Math.sqrt(a + b + c);
        var a2 = Math.sqrt(a);
        var a32 = 2.0 * a * a2;
        var c2 = 2.0 * Math.sqrt(c);
        var ba = b / a2;
        return (a32 * s + a2 * b * (s - c2) + (4.0 * c * a - b * b) * Math.log((2.0 * a2 + ba + s) / (ba + c2))) / (4.0 * a32);
    };
    Graphics.prototype._bezierCurveLength = function _bezierCurveLength(fromX, fromY, cpX, cpY, cpX2, cpY2, toX, toY) {
        var n = 10;
        var result = 0.0;
        var t = 0.0;
        var t2 = 0.0;
        var t3 = 0.0;
        var nt = 0.0;
        var nt2 = 0.0;
        var nt3 = 0.0;
        var x = 0.0;
        var y = 0.0;
        var dx = 0.0;
        var dy = 0.0;
        var prevX = fromX;
        var prevY = fromY;
        for (var i = 1; i <= n; ++i) {
            t = i / n;
            t2 = t * t;
            t3 = t2 * t;
            nt = 1.0 - t;
            nt2 = nt * nt;
            nt3 = nt2 * nt;
            x = nt3 * fromX + 3.0 * nt2 * t * cpX + 3.0 * nt * t2 * cpX2 + t3 * toX;
            y = nt3 * fromY + 3.0 * nt2 * t * cpY + 3 * nt * t2 * cpY2 + t3 * toY;
            dx = prevX - x;
            dy = prevY - y;
            prevX = x;
            prevY = y;
            result += Math.sqrt(dx * dx + dy * dy);
        }
        return result;
    };
    Graphics.prototype._segmentsCount = function _segmentsCount(length) {
        var result = Math.ceil(length / Graphics.CURVES.maxLength);
        if (result < Graphics.CURVES.minSegments) {
            result = Graphics.CURVES.minSegments;
        } else if (result > Graphics.CURVES.maxSegments) {
            result = Graphics.CURVES.maxSegments;
        }
        return result;
    };
    Graphics.prototype.lineStyle = function lineStyle() {
        var lineWidth = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
        var color = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
        var alpha = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;
        var alignment = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0.5;
        this.lineWidth = lineWidth;
        this.lineColor = color;
        this.lineAlpha = alpha;
        this.lineAlignment = alignment;
        if (this.currentPath) {
            if (this.currentPath.shape.points.length) {
                var shape = new _math.Polygon(this.currentPath.shape.points.slice(-2));
                shape.closed = false;
                this.drawShape(shape);
            } else {
                this.currentPath.lineWidth = this.lineWidth;
                this.currentPath.lineColor = this.lineColor;
                this.currentPath.lineAlpha = this.lineAlpha;
                this.currentPath.lineAlignment = this.lineAlignment;
            }
        }
        return this;
    };
    Graphics.prototype.moveTo = function moveTo(x, y) {
        var shape = new _math.Polygon([x, y]);
        shape.closed = false;
        this.drawShape(shape);
        return this;
    };
    Graphics.prototype.lineTo = function lineTo(x, y) {
        this.currentPath.shape.points.push(x, y);
        this.dirty++;
        return this;
    };
    Graphics.prototype.quadraticCurveTo = function quadraticCurveTo(cpX, cpY, toX, toY) {
        if (this.currentPath) {
            if (this.currentPath.shape.points.length === 0) {
                this.currentPath.shape.points = [0, 0];
            }
        } else {
            this.moveTo(0, 0);
        }
        var points = this.currentPath.shape.points;
        var xa = 0;
        var ya = 0;
        if (points.length === 0) {
            this.moveTo(0, 0);
        }
        var fromX = points[points.length - 2];
        var fromY = points[points.length - 1];
        var n = Graphics.CURVES.adaptive ? this._segmentsCount(this._quadraticCurveLength(fromX, fromY, cpX, cpY, toX, toY)) : 20;
        for (var i = 1; i <= n; ++i) {
            var j = i / n;
            xa = fromX + (cpX - fromX) * j;
            ya = fromY + (cpY - fromY) * j;
            points.push(xa + (cpX + (toX - cpX) * j - xa) * j, ya + (cpY + (toY - cpY) * j - ya) * j);
        }
        this.dirty++;
        return this;
    };
    Graphics.prototype.bezierCurveTo = function bezierCurveTo(cpX, cpY, cpX2, cpY2, toX, toY) {
        if (this.currentPath) {
            if (this.currentPath.shape.points.length === 0) {
                this.currentPath.shape.points = [0, 0];
            }
        } else {
            this.moveTo(0, 0);
        }
        var points = this.currentPath.shape.points;
        var fromX = points[points.length - 2];
        var fromY = points[points.length - 1];
        points.length -= 2;
        var n = Graphics.CURVES.adaptive ? this._segmentsCount(this._bezierCurveLength(fromX, fromY, cpX, cpY, cpX2, cpY2, toX, toY)) : 20;
        (0, _bezierCurveTo3.default)(fromX, fromY, cpX, cpY, cpX2, cpY2, toX, toY, n, points);
        this.dirty++;
        return this;
    };
    Graphics.prototype.arcTo = function arcTo(x1, y1, x2, y2, radius) {
        if (this.currentPath) {
            if (this.currentPath.shape.points.length === 0) {
                this.currentPath.shape.points.push(x1, y1);
            }
        } else {
            this.moveTo(x1, y1);
        }
        var points = this.currentPath.shape.points;
        var fromX = points[points.length - 2];
        var fromY = points[points.length - 1];
        var a1 = fromY - y1;
        var b1 = fromX - x1;
        var a2 = y2 - y1;
        var b2 = x2 - x1;
        var mm = Math.abs(a1 * b2 - b1 * a2);
        if (mm < 1.0e-8 || radius === 0) {
            if (points[points.length - 2] !== x1 || points[points.length - 1] !== y1) {
                points.push(x1, y1);
            }
        } else {
            var dd = a1 * a1 + b1 * b1;
            var cc = a2 * a2 + b2 * b2;
            var tt = a1 * a2 + b1 * b2;
            var k1 = radius * Math.sqrt(dd) / mm;
            var k2 = radius * Math.sqrt(cc) / mm;
            var j1 = k1 * tt / dd;
            var j2 = k2 * tt / cc;
            var cx = k1 * b2 + k2 * b1;
            var cy = k1 * a2 + k2 * a1;
            var px = b1 * (k2 + j1);
            var py = a1 * (k2 + j1);
            var qx = b2 * (k1 + j2);
            var qy = a2 * (k1 + j2);
            var startAngle = Math.atan2(py - cy, px - cx);
            var endAngle = Math.atan2(qy - cy, qx - cx);
            this.arc(cx + x1, cy + y1, radius, startAngle, endAngle, b1 * a2 > b2 * a1);
        }
        this.dirty++;
        return this;
    };
    Graphics.prototype.arc = function arc(cx, cy, radius, startAngle, endAngle) {
        var anticlockwise = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : false;
        if (startAngle === endAngle) {
            return this;
        }
        if (!anticlockwise && endAngle <= startAngle) {
            endAngle += _const.PI_2;
        } else if (anticlockwise && startAngle <= endAngle) {
            startAngle += _const.PI_2;
        }
        var sweep = endAngle - startAngle;
        var segs = Graphics.CURVES.adaptive ? this._segmentsCount(Math.abs(sweep) * radius) : Math.ceil(Math.abs(sweep) / _const.PI_2) * 40;
        if (sweep === 0) {
            return this;
        }
        var startX = cx + Math.cos(startAngle) * radius;
        var startY = cy + Math.sin(startAngle) * radius;
        var points = this.currentPath ? this.currentPath.shape.points : null;
        if (points) {
            if (points[points.length - 2] !== startX || points[points.length - 1] !== startY) {
                points.push(startX, startY);
            }
        } else {
            this.moveTo(startX, startY);
            points = this.currentPath.shape.points;
        }
        var theta = sweep / (segs * 2);
        var theta2 = theta * 2;
        var cTheta = Math.cos(theta);
        var sTheta = Math.sin(theta);
        var segMinus = segs - 1;
        var remainder = segMinus % 1 / segMinus;
        for (var i = 0; i <= segMinus; ++i) {
            var real = i + remainder * i;
            var angle = theta + startAngle + theta2 * real;
            var c = Math.cos(angle);
            var s = -Math.sin(angle);
            points.push((cTheta * c + sTheta * s) * radius + cx, (cTheta * -s + sTheta * c) * radius + cy);
        }
        this.dirty++;
        return this;
    };
    Graphics.prototype.beginFill = function beginFill() {
        var color = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
        var alpha = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
        this.filling = true;
        this.fillColor = color;
        this.fillAlpha = alpha;
        if (this.currentPath) {
            if (this.currentPath.shape.points.length <= 2) {
                this.currentPath.fill = this.filling;
                this.currentPath.fillColor = this.fillColor;
                this.currentPath.fillAlpha = this.fillAlpha;
            }
        }
        return this;
    };
    Graphics.prototype.endFill = function endFill() {
        this.filling = false;
        this.fillColor = null;
        this.fillAlpha = 1;
        return this;
    };
    Graphics.prototype.drawRect = function drawRect(x, y, width, height) {
        this.drawShape(new _math.Rectangle(x, y, width, height));
        return this;
    };
    Graphics.prototype.drawRoundedRect = function drawRoundedRect(x, y, width, height, radius) {
        this.drawShape(new _math.RoundedRectangle(x, y, width, height, radius));
        return this;
    };
    Graphics.prototype.drawCircle = function drawCircle(x, y, radius) {
        this.drawShape(new _math.Circle(x, y, radius));
        return this;
    };
    Graphics.prototype.drawEllipse = function drawEllipse(x, y, width, height) {
        this.drawShape(new _math.Ellipse(x, y, width, height));
        return this;
    };
    Graphics.prototype.drawPolygon = function drawPolygon(path) {
        var points = path;
        var closed = true;
        if (points instanceof _math.Polygon) {
            closed = points.closed;
            points = points.points;
        }
        if (!Array.isArray(points)) {
            points = new Array(arguments.length);
            for (var i = 0; i < points.length; ++i) {
                points[i] = arguments[i]; 
            }
        }
        var shape = new _math.Polygon(points);
        shape.closed = closed;
        this.drawShape(shape);
        return this;
    };
    Graphics.prototype.drawStar = function drawStar(x, y, points, radius, innerRadius) {
        var rotation = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : 0;
        innerRadius = innerRadius || radius / 2;
        var startAngle = -1 * Math.PI / 2 + rotation;
        var len = points * 2;
        var delta = _const.PI_2 / len;
        var polygon = [];
        for (var i = 0; i < len; i++) {
            var r = i % 2 ? innerRadius : radius;
            var angle = i * delta + startAngle;
            polygon.push(x + r * Math.cos(angle), y + r * Math.sin(angle));
        }
        return this.drawPolygon(polygon);
    };
    Graphics.prototype.clear = function clear() {
        if (this.lineWidth || this.filling || this.graphicsData.length > 0) {
            this.lineWidth = 0;
            this.lineAlignment = 0.5;
            this.filling = false;
            this.boundsDirty = -1;
            this.dirty++;
            this.clearDirty++;
            this.graphicsData.length = 0;
        }
        this.currentPath = null;
        this._spriteRect = null;
        return this;
    };
    Graphics.prototype.isFastRect = function isFastRect() {
        return this.graphicsData.length === 1 && this.graphicsData[0].shape.type === _const.SHAPES.RECT && !this.graphicsData[0].lineWidth;
    };
    Graphics.prototype._renderWebGL = function _renderWebGL(renderer) {
        if (this.dirty !== this.fastRectDirty) {
            this.fastRectDirty = this.dirty;
            this._fastRect = this.isFastRect();
        }
        if (this._fastRect) {
            this._renderSpriteRect(renderer);
        } else {
            renderer.setObjectRenderer(renderer.plugins.graphics);
            renderer.plugins.graphics.render(this);
        }
    };
    Graphics.prototype._renderSpriteRect = function _renderSpriteRect(renderer) {
        var rect = this.graphicsData[0].shape;
        if (!this._spriteRect) {
            this._spriteRect = new _Sprite2.default(new _Texture2.default(_Texture2.default.WHITE));
        }
        var sprite = this._spriteRect;
        if (this.tint === 0xffffff) {
            sprite.tint = this.graphicsData[0].fillColor;
        } else {
            var t1 = tempColor1;
            var t2 = tempColor2;
            (0, _utils.hex2rgb)(this.graphicsData[0].fillColor, t1);
            (0, _utils.hex2rgb)(this.tint, t2);
            t1[0] *= t2[0];
            t1[1] *= t2[1];
            t1[2] *= t2[2];
            sprite.tint = (0, _utils.rgb2hex)(t1);
        }
        sprite.alpha = this.graphicsData[0].fillAlpha;
        sprite.worldAlpha = this.worldAlpha * sprite.alpha;
        sprite.blendMode = this.blendMode;
        sprite._texture._frame.width = rect.width;
        sprite._texture._frame.height = rect.height;
        sprite.transform.worldTransform = this.transform.worldTransform;
        sprite.anchor.set(-rect.x / rect.width, -rect.y / rect.height);
        sprite._onAnchorUpdate();
        sprite._renderWebGL(renderer);
    };
    Graphics.prototype._renderCanvas = function _renderCanvas(renderer) {
        if (this.isMask === true) {
            return;
        }
        renderer.plugins.graphics.render(this);
    };
    Graphics.prototype._calculateBounds = function _calculateBounds() {
        if (this.boundsDirty !== this.dirty) {
            this.boundsDirty = this.dirty;
            this.updateLocalBounds();
            this.cachedSpriteDirty = true;
        }
        var lb = this._localBounds;
        this._bounds.addFrame(this.transform, lb.minX, lb.minY, lb.maxX, lb.maxY);
    };
    Graphics.prototype.containsPoint = function containsPoint(point) {
        this.worldTransform.applyInverse(point, tempPoint);
        var graphicsData = this.graphicsData;
        for (var i = 0; i < graphicsData.length; ++i) {
            var data = graphicsData[i];
            if (!data.fill) {
                continue;
            }
            if (data.shape) {
                if (data.shape.contains(tempPoint.x, tempPoint.y)) {
                    if (data.holes) {
                        for (var _i = 0; _i < data.holes.length; _i++) {
                            var hole = data.holes[_i];
                            if (hole.contains(tempPoint.x, tempPoint.y)) {
                                return false;
                            }
                        }
                    }
                    return true;
                }
            }
        }
        return false;
    };
    Graphics.prototype.updateLocalBounds = function updateLocalBounds() {
        var minX = Infinity;
        var maxX = -Infinity;
        var minY = Infinity;
        var maxY = -Infinity;
        if (this.graphicsData.length) {
            var shape = 0;
            var x = 0;
            var y = 0;
            var w = 0;
            var h = 0;
            for (var i = 0; i < this.graphicsData.length; i++) {
                var data = this.graphicsData[i];
                var type = data.type;
                var lineWidth = data.lineWidth;
                shape = data.shape;
                if (type === _const.SHAPES.RECT || type === _const.SHAPES.RREC) {
                    x = shape.x - lineWidth / 2;
                    y = shape.y - lineWidth / 2;
                    w = shape.width + lineWidth;
                    h = shape.height + lineWidth;
                    minX = x < minX ? x : minX;
                    maxX = x + w > maxX ? x + w : maxX;
                    minY = y < minY ? y : minY;
                    maxY = y + h > maxY ? y + h : maxY;
                } else if (type === _const.SHAPES.CIRC) {
                    x = shape.x;
                    y = shape.y;
                    w = shape.radius + lineWidth / 2;
                    h = shape.radius + lineWidth / 2;
                    minX = x - w < minX ? x - w : minX;
                    maxX = x + w > maxX ? x + w : maxX;
                    minY = y - h < minY ? y - h : minY;
                    maxY = y + h > maxY ? y + h : maxY;
                } else if (type === _const.SHAPES.ELIP) {
                    x = shape.x;
                    y = shape.y;
                    w = shape.width + lineWidth / 2;
                    h = shape.height + lineWidth / 2;
                    minX = x - w < minX ? x - w : minX;
                    maxX = x + w > maxX ? x + w : maxX;
                    minY = y - h < minY ? y - h : minY;
                    maxY = y + h > maxY ? y + h : maxY;
                } else {
                    var points = shape.points;
                    var x2 = 0;
                    var y2 = 0;
                    var dx = 0;
                    var dy = 0;
                    var rw = 0;
                    var rh = 0;
                    var cx = 0;
                    var cy = 0;
                    for (var j = 0; j + 2 < points.length; j += 2) {
                        x = points[j];
                        y = points[j + 1];
                        x2 = points[j + 2];
                        y2 = points[j + 3];
                        dx = Math.abs(x2 - x);
                        dy = Math.abs(y2 - y);
                        h = lineWidth;
                        w = Math.sqrt(dx * dx + dy * dy);
                        if (w < 1e-9) {
                            continue;
                        }
                        rw = (h / w * dy + dx) / 2;
                        rh = (h / w * dx + dy) / 2;
                        cx = (x2 + x) / 2;
                        cy = (y2 + y) / 2;
                        minX = cx - rw < minX ? cx - rw : minX;
                        maxX = cx + rw > maxX ? cx + rw : maxX;
                        minY = cy - rh < minY ? cy - rh : minY;
                        maxY = cy + rh > maxY ? cy + rh : maxY;
                    }
                }
            }
        } else {
            minX = 0;
            maxX = 0;
            minY = 0;
            maxY = 0;
        }
        var padding = this.boundsPadding;
        this._localBounds.minX = minX - padding;
        this._localBounds.maxX = maxX + padding;
        this._localBounds.minY = minY - padding;
        this._localBounds.maxY = maxY + padding;
    };
    Graphics.prototype.drawShape = function drawShape(shape) {
        if (this.currentPath) {
            if (this.currentPath.shape.points.length <= 2) {
                this.graphicsData.pop();
            }
        }
        this.currentPath = null;
        var data = new _GraphicsData2.default(this.lineWidth, this.lineColor, this.lineAlpha, this.fillColor, this.fillAlpha, this.filling, this.nativeLines, shape, this.lineAlignment);
        this.graphicsData.push(data);
        if (data.type === _const.SHAPES.POLY) {
            data.shape.closed = data.shape.closed || this.filling;
            this.currentPath = data;
        }
        this.dirty++;
        return data;
    };
    Graphics.prototype.generateCanvasTexture = function generateCanvasTexture(scaleMode) {
        var resolution = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
        var bounds = this.getLocalBounds();
        var canvasBuffer = _RenderTexture2.default.create(bounds.width, bounds.height, scaleMode, resolution);
        if (!canvasRenderer) {
            canvasRenderer = new _CanvasRenderer2.default();
        }
        this.transform.updateLocalTransform();
        this.transform.localTransform.copy(tempMatrix);
        tempMatrix.invert();
        tempMatrix.tx -= bounds.x;
        tempMatrix.ty -= bounds.y;
        canvasRenderer.render(this, canvasBuffer, true, tempMatrix);
        var texture = _Texture2.default.fromCanvas(canvasBuffer.baseTexture._canvasRenderTarget.canvas, scaleMode, 'graphics');
        texture.baseTexture.resolution = resolution;
        texture.baseTexture.update();
        return texture;
    };
    Graphics.prototype.closePath = function closePath() {
        var currentPath = this.currentPath;
        if (currentPath && currentPath.shape) {
            currentPath.shape.close();
        }
        return this;
    };
    Graphics.prototype.addHole = function addHole() {
        var hole = this.graphicsData.pop();
        this.currentPath = this.graphicsData[this.graphicsData.length - 1];
        this.currentPath.addHole(hole.shape);
        this.currentPath = null;
        return this;
    };
    Graphics.prototype.destroy = function destroy(options) {
        _Container.prototype.destroy.call(this, options);
        for (var i = 0; i < this.graphicsData.length; ++i) {
            this.graphicsData[i].destroy();
        }
        for (var id in this._webGL) {
            for (var j = 0; j < this._webGL[id].data.length; ++j) {
                this._webGL[id].data[j].destroy();
            }
        }
        if (this._spriteRect) {
            this._spriteRect.destroy();
        }
        this.graphicsData = null;
        this.currentPath = null;
        this._webGL = null;
        this._localBounds = null;
    };
    return Graphics;
}(_Container3.default);
exports.default = Graphics;
Graphics._SPRITE_TEXTURE = null;
Graphics.CURVES = {
    adaptive: false,
    maxLength: 10,
    minSegments: 8,
    maxSegments: 2048
};
},{"../const":46,"../display/Bounds":47,"../display/Container":48,"../math":70,"../renderers/canvas/CanvasRenderer":77,"../sprites/Sprite":102,"../textures/RenderTexture":113,"../textures/Texture":115,"../utils":125,"./GraphicsData":54,"./utils/bezierCurveTo":56}],54:[function(require,module,exports){
"use strict";
exports.__esModule = true;
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
var GraphicsData = function () {
  function GraphicsData(lineWidth, lineColor, lineAlpha, fillColor, fillAlpha, fill, nativeLines, shape, lineAlignment) {
    _classCallCheck(this, GraphicsData);
    this.lineWidth = lineWidth;
    this.lineAlignment = lineAlignment;
    this.nativeLines = nativeLines;
    this.lineColor = lineColor;
    this.lineAlpha = lineAlpha;
    this._lineTint = lineColor;
    this.fillColor = fillColor;
    this.fillAlpha = fillAlpha;
    this._fillTint = fillColor;
    this.fill = fill;
    this.holes = [];
    this.shape = shape;
    this.type = shape.type;
  }
  GraphicsData.prototype.clone = function clone() {
    return new GraphicsData(this.lineWidth, this.lineColor, this.lineAlpha, this.fillColor, this.fillAlpha, this.fill, this.nativeLines, this.shape);
  };
  GraphicsData.prototype.addHole = function addHole(shape) {
    this.holes.push(shape);
  };
  GraphicsData.prototype.destroy = function destroy() {
    this.shape = null;
    this.holes = null;
  };
  return GraphicsData;
}();
exports.default = GraphicsData;
},{}],55:[function(require,module,exports){
'use strict';
exports.__esModule = true;
var _CanvasRenderer = require('../../renderers/canvas/CanvasRenderer');
var _CanvasRenderer2 = _interopRequireDefault(_CanvasRenderer);
var _const = require('../../const');
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
var CanvasGraphicsRenderer = function () {
    function CanvasGraphicsRenderer(renderer) {
        _classCallCheck(this, CanvasGraphicsRenderer);
        this.renderer = renderer;
    }
    CanvasGraphicsRenderer.prototype.render = function render(graphics) {
        var renderer = this.renderer;
        var context = renderer.context;
        var worldAlpha = graphics.worldAlpha;
        var transform = graphics.transform.worldTransform;
        var resolution = renderer.resolution;
        if (this._prevTint !== this.tint) {
            this.dirty = true;
        }
        context.setTransform(transform.a * resolution, transform.b * resolution, transform.c * resolution, transform.d * resolution, transform.tx * resolution, transform.ty * resolution);
        if (graphics.dirty) {
            this.updateGraphicsTint(graphics);
            graphics.dirty = false;
        }
        renderer.setBlendMode(graphics.blendMode);
        for (var i = 0; i < graphics.graphicsData.length; i++) {
            var data = graphics.graphicsData[i];
            var shape = data.shape;
            var fillColor = data._fillTint;
            var lineColor = data._lineTint;
            context.lineWidth = data.lineWidth;
            if (data.type === _const.SHAPES.POLY) {
                context.beginPath();
                this.renderPolygon(shape.points, shape.closed, context);
                for (var j = 0; j < data.holes.length; j++) {
                    this.renderPolygon(data.holes[j].points, true, context);
                }
                if (data.fill) {
                    context.globalAlpha = data.fillAlpha * worldAlpha;
                    context.fillStyle = '#' + ('00000' + (fillColor | 0).toString(16)).substr(-6);
                    context.fill();
                }
                if (data.lineWidth) {
                    context.globalAlpha = data.lineAlpha * worldAlpha;
                    context.strokeStyle = '#' + ('00000' + (lineColor | 0).toString(16)).substr(-6);
                    context.stroke();
                }
            } else if (data.type === _const.SHAPES.RECT) {
                if (data.fillColor || data.fillColor === 0) {
                    context.globalAlpha = data.fillAlpha * worldAlpha;
                    context.fillStyle = '#' + ('00000' + (fillColor | 0).toString(16)).substr(-6);
                    context.fillRect(shape.x, shape.y, shape.width, shape.height);
                }
                if (data.lineWidth) {
                    context.globalAlpha = data.lineAlpha * worldAlpha;
                    context.strokeStyle = '#' + ('00000' + (lineColor | 0).toString(16)).substr(-6);
                    context.strokeRect(shape.x, shape.y, shape.width, shape.height);
                }
            } else if (data.type === _const.SHAPES.CIRC) {
                context.beginPath();
                context.arc(shape.x, shape.y, shape.radius, 0, 2 * Math.PI);
                context.closePath();
                if (data.fill) {
                    context.globalAlpha = data.fillAlpha * worldAlpha;
                    context.fillStyle = '#' + ('00000' + (fillColor | 0).toString(16)).substr(-6);
                    context.fill();
                }
                if (data.lineWidth) {
                    context.globalAlpha = data.lineAlpha * worldAlpha;
                    context.strokeStyle = '#' + ('00000' + (lineColor | 0).toString(16)).substr(-6);
                    context.stroke();
                }
            } else if (data.type === _const.SHAPES.ELIP) {
                var w = shape.width * 2;
                var h = shape.height * 2;
                var x = shape.x - w / 2;
                var y = shape.y - h / 2;
                context.beginPath();
                var kappa = 0.5522848;
                var ox = w / 2 * kappa; 
                var oy = h / 2 * kappa; 
                var xe = x + w; 
                var ye = y + h; 
                var xm = x + w / 2; 
                var ym = y + h / 2; 
                context.moveTo(x, ym);
                context.bezierCurveTo(x, ym - oy, xm - ox, y, xm, y);
                context.bezierCurveTo(xm + ox, y, xe, ym - oy, xe, ym);
                context.bezierCurveTo(xe, ym + oy, xm + ox, ye, xm, ye);
                context.bezierCurveTo(xm - ox, ye, x, ym + oy, x, ym);
                context.closePath();
                if (data.fill) {
                    context.globalAlpha = data.fillAlpha * worldAlpha;
                    context.fillStyle = '#' + ('00000' + (fillColor | 0).toString(16)).substr(-6);
                    context.fill();
                }
                if (data.lineWidth) {
                    context.globalAlpha = data.lineAlpha * worldAlpha;
                    context.strokeStyle = '#' + ('00000' + (lineColor | 0).toString(16)).substr(-6);
                    context.stroke();
                }
            } else if (data.type === _const.SHAPES.RREC) {
                var rx = shape.x;
                var ry = shape.y;
                var width = shape.width;
                var height = shape.height;
                var radius = shape.radius;
                var maxRadius = Math.min(width, height) / 2 | 0;
                radius = radius > maxRadius ? maxRadius : radius;
                context.beginPath();
                context.moveTo(rx, ry + radius);
                context.lineTo(rx, ry + height - radius);
                context.quadraticCurveTo(rx, ry + height, rx + radius, ry + height);
                context.lineTo(rx + width - radius, ry + height);
                context.quadraticCurveTo(rx + width, ry + height, rx + width, ry + height - radius);
                context.lineTo(rx + width, ry + radius);
                context.quadraticCurveTo(rx + width, ry, rx + width - radius, ry);
                context.lineTo(rx + radius, ry);
                context.quadraticCurveTo(rx, ry, rx, ry + radius);
                context.closePath();
                if (data.fillColor || data.fillColor === 0) {
                    context.globalAlpha = data.fillAlpha * worldAlpha;
                    context.fillStyle = '#' + ('00000' + (fillColor | 0).toString(16)).substr(-6);
                    context.fill();
                }
                if (data.lineWidth) {
                    context.globalAlpha = data.lineAlpha * worldAlpha;
                    context.strokeStyle = '#' + ('00000' + (lineColor | 0).toString(16)).substr(-6);
                    context.stroke();
                }
            }
        }
    };
    CanvasGraphicsRenderer.prototype.updateGraphicsTint = function updateGraphicsTint(graphics) {
        graphics._prevTint = graphics.tint;
        var tintR = (graphics.tint >> 16 & 0xFF) / 255;
        var tintG = (graphics.tint >> 8 & 0xFF) / 255;
        var tintB = (graphics.tint & 0xFF) / 255;
        for (var i = 0; i < graphics.graphicsData.length; ++i) {
            var data = graphics.graphicsData[i];
            var fillColor = data.fillColor | 0;
            var lineColor = data.lineColor | 0;
            data._fillTint = ((fillColor >> 16 & 0xFF) / 255 * tintR * 255 << 16) + ((fillColor >> 8 & 0xFF) / 255 * tintG * 255 << 8) + (fillColor & 0xFF) / 255 * tintB * 255;
            data._lineTint = ((lineColor >> 16 & 0xFF) / 255 * tintR * 255 << 16) + ((lineColor >> 8 & 0xFF) / 255 * tintG * 255 << 8) + (lineColor & 0xFF) / 255 * tintB * 255;
        }
    };
    CanvasGraphicsRenderer.prototype.renderPolygon = function renderPolygon(points, close, context) {
        context.moveTo(points[0], points[1]);
        for (var j = 1; j < points.length / 2; ++j) {
            context.lineTo(points[j * 2], points[j * 2 + 1]);
        }
        if (close) {
            context.closePath();
        }
    };
    CanvasGraphicsRenderer.prototype.destroy = function destroy() {
        this.renderer = null;
    };
    return CanvasGraphicsRenderer;
}();
exports.default = CanvasGraphicsRenderer;
_CanvasRenderer2.default.registerPlugin('graphics', CanvasGraphicsRenderer);
},{"../../const":46,"../../renderers/canvas/CanvasRenderer":77}],56:[function(require,module,exports){
"use strict";
exports.__esModule = true;
exports.default = bezierCurveTo;
function bezierCurveTo(fromX, fromY, cpX, cpY, cpX2, cpY2, toX, toY, n) {
    var path = arguments.length > 9 && arguments[9] !== undefined ? arguments[9] : [];
    var dt = 0;
    var dt2 = 0;
    var dt3 = 0;
    var t2 = 0;
    var t3 = 0;
    path.push(fromX, fromY);
    for (var i = 1, j = 0; i <= n; ++i) {
        j = i / n;
        dt = 1 - j;
        dt2 = dt * dt;
        dt3 = dt2 * dt;
        t2 = j * j;
        t3 = t2 * j;
        path.push(dt3 * fromX + 3 * dt2 * j * cpX + 3 * dt * t2 * cpX2 + t3 * toX, dt3 * fromY + 3 * dt2 * j * cpY + 3 * dt * t2 * cpY2 + t3 * toY);
    }
    return path;
}
},{}],57:[function(require,module,exports){
'use strict';
exports.__esModule = true;
var _utils = require('../../utils');
var _const = require('../../const');
var _ObjectRenderer2 = require('../../renderers/webgl/utils/ObjectRenderer');
var _ObjectRenderer3 = _interopRequireDefault(_ObjectRenderer2);
var _WebGLRenderer = require('../../renderers/webgl/WebGLRenderer');
var _WebGLRenderer2 = _interopRequireDefault(_WebGLRenderer);
var _WebGLGraphicsData = require('./WebGLGraphicsData');
var _WebGLGraphicsData2 = _interopRequireDefault(_WebGLGraphicsData);
var _PrimitiveShader = require('./shaders/PrimitiveShader');
var _PrimitiveShader2 = _interopRequireDefault(_PrimitiveShader);
var _buildPoly = require('./utils/buildPoly');
var _buildPoly2 = _interopRequireDefault(_buildPoly);
var _buildRectangle = require('./utils/buildRectangle');
var _buildRectangle2 = _interopRequireDefault(_buildRectangle);
var _buildRoundedRectangle = require('./utils/buildRoundedRectangle');
var _buildRoundedRectangle2 = _interopRequireDefault(_buildRoundedRectangle);
var _buildCircle = require('./utils/buildCircle');
var _buildCircle2 = _interopRequireDefault(_buildCircle);
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
var GraphicsRenderer = function (_ObjectRenderer) {
    _inherits(GraphicsRenderer, _ObjectRenderer);
    function GraphicsRenderer(renderer) {
        _classCallCheck(this, GraphicsRenderer);
        var _this = _possibleConstructorReturn(this, _ObjectRenderer.call(this, renderer));
        _this.graphicsDataPool = [];
        _this.primitiveShader = null;
        _this.gl = renderer.gl;
        _this.CONTEXT_UID = 0;
        return _this;
    }
    GraphicsRenderer.prototype.onContextChange = function onContextChange() {
        this.gl = this.renderer.gl;
        this.CONTEXT_UID = this.renderer.CONTEXT_UID;
        this.primitiveShader = new _PrimitiveShader2.default(this.gl);
    };
    GraphicsRenderer.prototype.destroy = function destroy() {
        _ObjectRenderer3.default.prototype.destroy.call(this);
        for (var i = 0; i < this.graphicsDataPool.length; ++i) {
            this.graphicsDataPool[i].destroy();
        }
        this.graphicsDataPool = null;
    };
    GraphicsRenderer.prototype.render = function render(graphics) {
        var renderer = this.renderer;
        var gl = renderer.gl;
        var webGLData = void 0;
        var webGL = graphics._webGL[this.CONTEXT_UID];
        if (!webGL || graphics.dirty !== webGL.dirty) {
            this.updateGraphics(graphics);
            webGL = graphics._webGL[this.CONTEXT_UID];
        }
        var shader = this.primitiveShader;
        renderer.bindShader(shader);
        renderer.state.setBlendMode(graphics.blendMode);
        for (var i = 0, n = webGL.data.length; i < n; i++) {
            webGLData = webGL.data[i];
            var shaderTemp = webGLData.shader;
            renderer.bindShader(shaderTemp);
            shaderTemp.uniforms.translationMatrix = graphics.transform.worldTransform.toArray(true);
            shaderTemp.uniforms.tint = (0, _utils.hex2rgb)(graphics.tint);
            shaderTemp.uniforms.alpha = graphics.worldAlpha;
            renderer.bindVao(webGLData.vao);
            if (webGLData.nativeLines) {
                gl.drawArrays(gl.LINES, 0, webGLData.points.length / 6);
            } else {
                webGLData.vao.draw(gl.TRIANGLE_STRIP, webGLData.indices.length);
            }
        }
    };
    GraphicsRenderer.prototype.updateGraphics = function updateGraphics(graphics) {
        var gl = this.renderer.gl;
        var webGL = graphics._webGL[this.CONTEXT_UID];
        if (!webGL) {
            webGL = graphics._webGL[this.CONTEXT_UID] = { lastIndex: 0, data: [], gl: gl, clearDirty: -1, dirty: -1 };
        }
        webGL.dirty = graphics.dirty;
        if (graphics.clearDirty !== webGL.clearDirty) {
            webGL.clearDirty = graphics.clearDirty;
            for (var i = 0; i < webGL.data.length; i++) {
                this.graphicsDataPool.push(webGL.data[i]);
            }
            webGL.data.length = 0;
            webGL.lastIndex = 0;
        }
        var webGLData = void 0;
        var webGLDataNativeLines = void 0;
        for (var _i = webGL.lastIndex; _i < graphics.graphicsData.length; _i++) {
            var data = graphics.graphicsData[_i];
            webGLData = this.getWebGLData(webGL, 0);
            if (data.nativeLines && data.lineWidth) {
                webGLDataNativeLines = this.getWebGLData(webGL, 0, true);
                webGL.lastIndex++;
            }
            if (data.type === _const.SHAPES.POLY) {
                (0, _buildPoly2.default)(data, webGLData, webGLDataNativeLines);
            }
            if (data.type === _const.SHAPES.RECT) {
                (0, _buildRectangle2.default)(data, webGLData, webGLDataNativeLines);
            } else if (data.type === _const.SHAPES.CIRC || data.type === _const.SHAPES.ELIP) {
                (0, _buildCircle2.default)(data, webGLData, webGLDataNativeLines);
            } else if (data.type === _const.SHAPES.RREC) {
                (0, _buildRoundedRectangle2.default)(data, webGLData, webGLDataNativeLines);
            }
            webGL.lastIndex++;
        }
        this.renderer.bindVao(null);
        for (var _i2 = 0; _i2 < webGL.data.length; _i2++) {
            webGLData = webGL.data[_i2];
            if (webGLData.dirty) {
                webGLData.upload();
            }
        }
    };
    GraphicsRenderer.prototype.getWebGLData = function getWebGLData(gl, type, nativeLines) {
        var webGLData = gl.data[gl.data.length - 1];
        if (!webGLData || webGLData.nativeLines !== nativeLines || webGLData.points.length > 320000) {
            webGLData = this.graphicsDataPool.pop() || new _WebGLGraphicsData2.default(this.renderer.gl, this.primitiveShader, this.renderer.state.attribsState);
            webGLData.nativeLines = nativeLines;
            webGLData.reset(type);
            gl.data.push(webGLData);
        }
        webGLData.dirty = true;
        return webGLData;
    };
    return GraphicsRenderer;
}(_ObjectRenderer3.default);
exports.default = GraphicsRenderer;
_WebGLRenderer2.default.registerPlugin('graphics', GraphicsRenderer);
},{"../../const":46,"../../renderers/webgl/WebGLRenderer":84,"../../renderers/webgl/utils/ObjectRenderer":94,"../../utils":125,"./WebGLGraphicsData":58,"./shaders/PrimitiveShader":59,"./utils/buildCircle":60,"./utils/buildPoly":62,"./utils/buildRectangle":63,"./utils/buildRoundedRectangle":64}],58:[function(require,module,exports){
'use strict';
exports.__esModule = true;
var _pixiGlCore = require('pixi-gl-core');
var _pixiGlCore2 = _interopRequireDefault(_pixiGlCore);
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
var WebGLGraphicsData = function () {
  function WebGLGraphicsData(gl, shader, attribsState) {
    _classCallCheck(this, WebGLGraphicsData);
    this.gl = gl;
    this.color = [0, 0, 0]; 
    this.points = [];
    this.indices = [];
    this.buffer = _pixiGlCore2.default.GLBuffer.createVertexBuffer(gl);
    this.indexBuffer = _pixiGlCore2.default.GLBuffer.createIndexBuffer(gl);
    this.dirty = true;
    this.nativeLines = false;
    this.glPoints = null;
    this.glIndices = null;
    this.shader = shader;
    this.vao = new _pixiGlCore2.default.VertexArrayObject(gl, attribsState).addIndex(this.indexBuffer).addAttribute(this.buffer, shader.attributes.aVertexPosition, gl.FLOAT, false, 4 * 6, 0).addAttribute(this.buffer, shader.attributes.aColor, gl.FLOAT, false, 4 * 6, 2 * 4);
  }
  WebGLGraphicsData.prototype.reset = function reset() {
    this.points.length = 0;
    this.indices.length = 0;
  };
  WebGLGraphicsData.prototype.upload = function upload() {
    this.glPoints = new Float32Array(this.points);
    this.buffer.upload(this.glPoints);
    this.glIndices = new Uint16Array(this.indices);
    this.indexBuffer.upload(this.glIndices);
    this.dirty = false;
  };
  WebGLGraphicsData.prototype.destroy = function destroy() {
    this.color = null;
    this.points = null;
    this.indices = null;
    this.vao.destroy();
    this.buffer.destroy();
    this.indexBuffer.destroy();
    this.gl = null;
    this.buffer = null;
    this.indexBuffer = null;
    this.glPoints = null;
    this.glIndices = null;
  };
  return WebGLGraphicsData;
}();
exports.default = WebGLGraphicsData;
},{"pixi-gl-core":15}],59:[function(require,module,exports){
'use strict';
exports.__esModule = true;
var _Shader2 = require('../../../Shader');
var _Shader3 = _interopRequireDefault(_Shader2);
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
var PrimitiveShader = function (_Shader) {
    _inherits(PrimitiveShader, _Shader);
    function PrimitiveShader(gl) {
        _classCallCheck(this, PrimitiveShader);
        return _possibleConstructorReturn(this, _Shader.call(this, gl,
        ['attribute vec2 aVertexPosition;', 'attribute vec4 aColor;', 'uniform mat3 translationMatrix;', 'uniform mat3 projectionMatrix;', 'uniform float alpha;', 'uniform vec3 tint;', 'varying vec4 vColor;', 'void main(void){', '   gl_Position = vec4((projectionMatrix * translationMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);', '   vColor = aColor * vec4(tint * alpha, alpha);', '}'].join('\n'),
        ['varying vec4 vColor;', 'void main(void){', '   gl_FragColor = vColor;', '}'].join('\n')));
    }
    return PrimitiveShader;
}(_Shader3.default);
exports.default = PrimitiveShader;
},{"../../../Shader":44}],60:[function(require,module,exports){
'use strict';
exports.__esModule = true;
exports.default = buildCircle;
var _buildLine = require('./buildLine');
var _buildLine2 = _interopRequireDefault(_buildLine);
var _const = require('../../../const');
var _utils = require('../../../utils');
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function buildCircle(graphicsData, webGLData, webGLDataNativeLines) {
    var circleData = graphicsData.shape;
    var x = circleData.x;
    var y = circleData.y;
    var width = void 0;
    var height = void 0;
    if (graphicsData.type === _const.SHAPES.CIRC) {
        width = circleData.radius;
        height = circleData.radius;
    } else {
        width = circleData.width;
        height = circleData.height;
    }
    if (width === 0 || height === 0) {
        return;
    }
    var totalSegs = Math.floor(30 * Math.sqrt(circleData.radius)) || Math.floor(15 * Math.sqrt(circleData.width + circleData.height));
    var seg = Math.PI * 2 / totalSegs;
    if (graphicsData.fill) {
        var color = (0, _utils.hex2rgb)(graphicsData.fillColor);
        var alpha = graphicsData.fillAlpha;
        var r = color[0] * alpha;
        var g = color[1] * alpha;
        var b = color[2] * alpha;
        var verts = webGLData.points;
        var indices = webGLData.indices;
        var vecPos = verts.length / 6;
        indices.push(vecPos);
        for (var i = 0; i < totalSegs + 1; i++) {
            verts.push(x, y, r, g, b, alpha);
            verts.push(x + Math.sin(seg * i) * width, y + Math.cos(seg * i) * height, r, g, b, alpha);
            indices.push(vecPos++, vecPos++);
        }
        indices.push(vecPos - 1);
    }
    if (graphicsData.lineWidth) {
        var tempPoints = graphicsData.points;
        graphicsData.points = [];
        for (var _i = 0; _i < totalSegs + 1; _i++) {
            graphicsData.points.push(x + Math.sin(seg * -_i) * width, y + Math.cos(seg * -_i) * height);
        }
        (0, _buildLine2.default)(graphicsData, webGLData, webGLDataNativeLines);
        graphicsData.points = tempPoints;
    }
}
},{"../../../const":46,"../../../utils":125,"./buildLine":61}],61:[function(require,module,exports){
'use strict';
exports.__esModule = true;
exports.default = function (graphicsData, webGLData, webGLDataNativeLines) {
    if (graphicsData.nativeLines) {
        buildNativeLine(graphicsData, webGLDataNativeLines);
    } else {
        buildLine(graphicsData, webGLData);
    }
};
var _math = require('../../../math');
var _utils = require('../../../utils');
function buildLine(graphicsData, webGLData) {
    var points = graphicsData.points;
    if (points.length === 0) {
        return;
    }
    var firstPoint = new _math.Point(points[0], points[1]);
    var lastPoint = new _math.Point(points[points.length - 2], points[points.length - 1]);
    if (firstPoint.x === lastPoint.x && firstPoint.y === lastPoint.y) {
        points = points.slice();
        points.pop();
        points.pop();
        lastPoint = new _math.Point(points[points.length - 2], points[points.length - 1]);
        var midPointX = lastPoint.x + (firstPoint.x - lastPoint.x) * 0.5;
        var midPointY = lastPoint.y + (firstPoint.y - lastPoint.y) * 0.5;
        points.unshift(midPointX, midPointY);
        points.push(midPointX, midPointY);
    }
    var verts = webGLData.points;
    var indices = webGLData.indices;
    var length = points.length / 2;
    var indexCount = points.length;
    var indexStart = verts.length / 6;
    var width = graphicsData.lineWidth / 2;
    var color = (0, _utils.hex2rgb)(graphicsData.lineColor);
    var alpha = graphicsData.lineAlpha;
    var r = color[0] * alpha;
    var g = color[1] * alpha;
    var b = color[2] * alpha;
    var p1x = points[0];
    var p1y = points[1];
    var p2x = points[2];
    var p2y = points[3];
    var p3x = 0;
    var p3y = 0;
    var perpx = -(p1y - p2y);
    var perpy = p1x - p2x;
    var perp2x = 0;
    var perp2y = 0;
    var perp3x = 0;
    var perp3y = 0;
    var dist = Math.sqrt(perpx * perpx + perpy * perpy);
    perpx /= dist;
    perpy /= dist;
    perpx *= width;
    perpy *= width;
    var ratio = graphicsData.lineAlignment; 
    var r1 = (1 - ratio) * 2;
    var r2 = ratio * 2;
    verts.push(p1x - perpx * r1, p1y - perpy * r1, r, g, b, alpha);
    verts.push(p1x + perpx * r2, p1y + perpy * r2, r, g, b, alpha);
    for (var i = 1; i < length - 1; ++i) {
        p1x = points[(i - 1) * 2];
        p1y = points[(i - 1) * 2 + 1];
        p2x = points[i * 2];
        p2y = points[i * 2 + 1];
        p3x = points[(i + 1) * 2];
        p3y = points[(i + 1) * 2 + 1];
        perpx = -(p1y - p2y);
        perpy = p1x - p2x;
        dist = Math.sqrt(perpx * perpx + perpy * perpy);
        perpx /= dist;
        perpy /= dist;
        perpx *= width;
        perpy *= width;
        perp2x = -(p2y - p3y);
        perp2y = p2x - p3x;
        dist = Math.sqrt(perp2x * perp2x + perp2y * perp2y);
        perp2x /= dist;
        perp2y /= dist;
        perp2x *= width;
        perp2y *= width;
        var a1 = -perpy + p1y - (-perpy + p2y);
        var b1 = -perpx + p2x - (-perpx + p1x);
        var c1 = (-perpx + p1x) * (-perpy + p2y) - (-perpx + p2x) * (-perpy + p1y);
        var a2 = -perp2y + p3y - (-perp2y + p2y);
        var b2 = -perp2x + p2x - (-perp2x + p3x);
        var c2 = (-perp2x + p3x) * (-perp2y + p2y) - (-perp2x + p2x) * (-perp2y + p3y);
        var denom = a1 * b2 - a2 * b1;
        if (Math.abs(denom) < 0.1) {
            denom += 10.1;
            verts.push(p2x - perpx * r1, p2y - perpy * r1, r, g, b, alpha);
            verts.push(p2x + perpx * r2, p2y + perpy * r2, r, g, b, alpha);
            continue;
        }
        var px = (b1 * c2 - b2 * c1) / denom;
        var py = (a2 * c1 - a1 * c2) / denom;
        var pdist = (px - p2x) * (px - p2x) + (py - p2y) * (py - p2y);
        if (pdist > 196 * width * width) {
            perp3x = perpx - perp2x;
            perp3y = perpy - perp2y;
            dist = Math.sqrt(perp3x * perp3x + perp3y * perp3y);
            perp3x /= dist;
            perp3y /= dist;
            perp3x *= width;
            perp3y *= width;
            verts.push(p2x - perp3x * r1, p2y - perp3y * r1);
            verts.push(r, g, b, alpha);
            verts.push(p2x + perp3x * r2, p2y + perp3y * r2);
            verts.push(r, g, b, alpha);
            verts.push(p2x - perp3x * r2 * r1, p2y - perp3y * r1);
            verts.push(r, g, b, alpha);
            indexCount++;
        } else {
            verts.push(p2x + (px - p2x) * r1, p2y + (py - p2y) * r1);
            verts.push(r, g, b, alpha);
            verts.push(p2x - (px - p2x) * r2, p2y - (py - p2y) * r2);
            verts.push(r, g, b, alpha);
        }
    }
    p1x = points[(length - 2) * 2];
    p1y = points[(length - 2) * 2 + 1];
    p2x = points[(length - 1) * 2];
    p2y = points[(length - 1) * 2 + 1];
    perpx = -(p1y - p2y);
    perpy = p1x - p2x;
    dist = Math.sqrt(perpx * perpx + perpy * perpy);
    perpx /= dist;
    perpy /= dist;
    perpx *= width;
    perpy *= width;
    verts.push(p2x - perpx * r1, p2y - perpy * r1);
    verts.push(r, g, b, alpha);
    verts.push(p2x + perpx * r2, p2y + perpy * r2);
    verts.push(r, g, b, alpha);
    indices.push(indexStart);
    for (var _i = 0; _i < indexCount; ++_i) {
        indices.push(indexStart++);
    }
    indices.push(indexStart - 1);
}
function buildNativeLine(graphicsData, webGLData) {
    var i = 0;
    var points = graphicsData.points;
    if (points.length === 0) return;
    var verts = webGLData.points;
    var length = points.length / 2;
    var color = (0, _utils.hex2rgb)(graphicsData.lineColor);
    var alpha = graphicsData.lineAlpha;
    var r = color[0] * alpha;
    var g = color[1] * alpha;
    var b = color[2] * alpha;
    for (i = 1; i < length; i++) {
        var p1x = points[(i - 1) * 2];
        var p1y = points[(i - 1) * 2 + 1];
        var p2x = points[i * 2];
        var p2y = points[i * 2 + 1];
        verts.push(p1x, p1y);
        verts.push(r, g, b, alpha);
        verts.push(p2x, p2y);
        verts.push(r, g, b, alpha);
    }
}
},{"../../../math":70,"../../../utils":125}],62:[function(require,module,exports){
'use strict';
exports.__esModule = true;
exports.default = buildPoly;
var _buildLine = require('./buildLine');
var _buildLine2 = _interopRequireDefault(_buildLine);
var _utils = require('../../../utils');
var _earcut = require('earcut');
var _earcut2 = _interopRequireDefault(_earcut);
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function buildPoly(graphicsData, webGLData, webGLDataNativeLines) {
    graphicsData.points = graphicsData.shape.points.slice();
    var points = graphicsData.points;
    if (graphicsData.fill && points.length >= 6) {
        var holeArray = [];
        var holes = graphicsData.holes;
        for (var i = 0; i < holes.length; i++) {
            var hole = holes[i];
            holeArray.push(points.length / 2);
            points = points.concat(hole.points);
        }
        var verts = webGLData.points;
        var indices = webGLData.indices;
        var length = points.length / 2;
        var color = (0, _utils.hex2rgb)(graphicsData.fillColor);
        var alpha = graphicsData.fillAlpha;
        var r = color[0] * alpha;
        var g = color[1] * alpha;
        var b = color[2] * alpha;
        var triangles = (0, _earcut2.default)(points, holeArray, 2);
        if (!triangles) {
            return;
        }
        var vertPos = verts.length / 6;
        for (var _i = 0; _i < triangles.length; _i += 3) {
            indices.push(triangles[_i] + vertPos);
            indices.push(triangles[_i] + vertPos);
            indices.push(triangles[_i + 1] + vertPos);
            indices.push(triangles[_i + 2] + vertPos);
            indices.push(triangles[_i + 2] + vertPos);
        }
        for (var _i2 = 0; _i2 < length; _i2++) {
            verts.push(points[_i2 * 2], points[_i2 * 2 + 1], r, g, b, alpha);
        }
    }
    if (graphicsData.lineWidth > 0) {
        (0, _buildLine2.default)(graphicsData, webGLData, webGLDataNativeLines);
    }
}
},{"../../../utils":125,"./buildLine":61,"earcut":2}],63:[function(require,module,exports){
'use strict';
exports.__esModule = true;
exports.default = buildRectangle;
var _buildLine = require('./buildLine');
var _buildLine2 = _interopRequireDefault(_buildLine);
var _utils = require('../../../utils');
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function buildRectangle(graphicsData, webGLData, webGLDataNativeLines) {
    var rectData = graphicsData.shape;
    var x = rectData.x;
    var y = rectData.y;
    var width = rectData.width;
    var height = rectData.height;
    if (graphicsData.fill) {
        var color = (0, _utils.hex2rgb)(graphicsData.fillColor);
        var alpha = graphicsData.fillAlpha;
        var r = color[0] * alpha;
        var g = color[1] * alpha;
        var b = color[2] * alpha;
        var verts = webGLData.points;
        var indices = webGLData.indices;
        var vertPos = verts.length / 6;
        verts.push(x, y);
        verts.push(r, g, b, alpha);
        verts.push(x + width, y);
        verts.push(r, g, b, alpha);
        verts.push(x, y + height);
        verts.push(r, g, b, alpha);
        verts.push(x + width, y + height);
        verts.push(r, g, b, alpha);
        indices.push(vertPos, vertPos, vertPos + 1, vertPos + 2, vertPos + 3, vertPos + 3);
    }
    if (graphicsData.lineWidth) {
        var tempPoints = graphicsData.points;
        graphicsData.points = [x, y, x + width, y, x + width, y + height, x, y + height, x, y];
        (0, _buildLine2.default)(graphicsData, webGLData, webGLDataNativeLines);
        graphicsData.points = tempPoints;
    }
}
},{"../../../utils":125,"./buildLine":61}],64:[function(require,module,exports){
'use strict';
exports.__esModule = true;
exports.default = buildRoundedRectangle;
var _earcut = require('earcut');
var _earcut2 = _interopRequireDefault(_earcut);
var _buildLine = require('./buildLine');
var _buildLine2 = _interopRequireDefault(_buildLine);
var _utils = require('../../../utils');
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function buildRoundedRectangle(graphicsData, webGLData, webGLDataNativeLines) {
    var rrectData = graphicsData.shape;
    var x = rrectData.x;
    var y = rrectData.y;
    var width = rrectData.width;
    var height = rrectData.height;
    var radius = rrectData.radius;
    var recPoints = [];
    recPoints.push(x, y + radius);
    quadraticBezierCurve(x, y + height - radius, x, y + height, x + radius, y + height, recPoints);
    quadraticBezierCurve(x + width - radius, y + height, x + width, y + height, x + width, y + height - radius, recPoints);
    quadraticBezierCurve(x + width, y + radius, x + width, y, x + width - radius, y, recPoints);
    quadraticBezierCurve(x + radius, y, x, y, x, y + radius + 0.0000000001, recPoints);
    if (graphicsData.fill) {
        var color = (0, _utils.hex2rgb)(graphicsData.fillColor);
        var alpha = graphicsData.fillAlpha;
        var r = color[0] * alpha;
        var g = color[1] * alpha;
        var b = color[2] * alpha;
        var verts = webGLData.points;
        var indices = webGLData.indices;
        var vecPos = verts.length / 6;
        var triangles = (0, _earcut2.default)(recPoints, null, 2);
        for (var i = 0, j = triangles.length; i < j; i += 3) {
            indices.push(triangles[i] + vecPos);
            indices.push(triangles[i] + vecPos);
            indices.push(triangles[i + 1] + vecPos);
            indices.push(triangles[i + 2] + vecPos);
            indices.push(triangles[i + 2] + vecPos);
        }
        for (var _i = 0, _j = recPoints.length; _i < _j; _i++) {
            verts.push(recPoints[_i], recPoints[++_i], r, g, b, alpha);
        }
    }
    if (graphicsData.lineWidth) {
        var tempPoints = graphicsData.points;
        graphicsData.points = recPoints;
        (0, _buildLine2.default)(graphicsData, webGLData, webGLDataNativeLines);
        graphicsData.points = tempPoints;
    }
}
function getPt(n1, n2, perc) {
    var diff = n2 - n1;
    return n1 + diff * perc;
}
function quadraticBezierCurve(fromX, fromY, cpX, cpY, toX, toY) {
    var out = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : [];
    var n = 20;
    var points = out;
    var xa = 0;
    var ya = 0;
    var xb = 0;
    var yb = 0;
    var x = 0;
    var y = 0;
    for (var i = 0, j = 0; i <= n; ++i) {
        j = i / n;
        xa = getPt(fromX, cpX, j);
        ya = getPt(fromY, cpY, j);
        xb = getPt(cpX, toX, j);
        yb = getPt(cpY, toY, j);
        x = getPt(xa, xb, j);
        y = getPt(ya, yb, j);
        points.push(x, y);
    }
    return points;
}
},{"../../../utils":125,"./buildLine":61,"earcut":2}],65:[function(require,module,exports){
'use strict';
exports.__esModule = true;
exports.autoDetectRenderer = exports.Application = exports.Filter = exports.SpriteMaskFilter = exports.Quad = exports.RenderTarget = exports.ObjectRenderer = exports.WebGLManager = exports.Shader = exports.CanvasRenderTarget = exports.TextureUvs = exports.VideoBaseTexture = exports.BaseRenderTexture = exports.RenderTexture = exports.BaseTexture = exports.TextureMatrix = exports.Texture = exports.Spritesheet = exports.CanvasGraphicsRenderer = exports.GraphicsRenderer = exports.GraphicsData = exports.Graphics = exports.TextMetrics = exports.TextStyle = exports.Text = exports.SpriteRenderer = exports.CanvasTinter = exports.CanvasSpriteRenderer = exports.Sprite = exports.TransformBase = exports.TransformStatic = exports.Transform = exports.Container = exports.DisplayObject = exports.Bounds = exports.glCore = exports.WebGLRenderer = exports.CanvasRenderer = exports.ticker = exports.utils = exports.settings = undefined;
var _const = require('./const');
Object.keys(_const).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _const[key];
    }
  });
});
var _math = require('./math');
Object.keys(_math).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _math[key];
    }
  });
});
var _pixiGlCore = require('pixi-gl-core');
Object.defineProperty(exports, 'glCore', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_pixiGlCore).default;
  }
});
var _Bounds = require('./display/Bounds');
Object.defineProperty(exports, 'Bounds', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_Bounds).default;
  }
});
var _DisplayObject = require('./display/DisplayObject');
Object.defineProperty(exports, 'DisplayObject', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_DisplayObject).default;
  }
});
var _Container = require('./display/Container');
Object.defineProperty(exports, 'Container', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_Container).default;
  }
});
var _Transform = require('./display/Transform');
Object.defineProperty(exports, 'Transform', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_Transform).default;
  }
});
var _TransformStatic = require('./display/TransformStatic');
Object.defineProperty(exports, 'TransformStatic', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_TransformStatic).default;
  }
});
var _TransformBase = require('./display/TransformBase');
Object.defineProperty(exports, 'TransformBase', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_TransformBase).default;
  }
});
var _Sprite = require('./sprites/Sprite');
Object.defineProperty(exports, 'Sprite', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_Sprite).default;
  }
});
var _CanvasSpriteRenderer = require('./sprites/canvas/CanvasSpriteRenderer');
Object.defineProperty(exports, 'CanvasSpriteRenderer', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_CanvasSpriteRenderer).default;
  }
});
var _CanvasTinter = require('./sprites/canvas/CanvasTinter');
Object.defineProperty(exports, 'CanvasTinter', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_CanvasTinter).default;
  }
});
var _SpriteRenderer = require('./sprites/webgl/SpriteRenderer');
Object.defineProperty(exports, 'SpriteRenderer', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_SpriteRenderer).default;
  }
});
var _Text = require('./text/Text');
Object.defineProperty(exports, 'Text', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_Text).default;
  }
});
var _TextStyle = require('./text/TextStyle');
Object.defineProperty(exports, 'TextStyle', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_TextStyle).default;
  }
});
var _TextMetrics = require('./text/TextMetrics');
Object.defineProperty(exports, 'TextMetrics', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_TextMetrics).default;
  }
});
var _Graphics = require('./graphics/Graphics');
Object.defineProperty(exports, 'Graphics', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_Graphics).default;
  }
});
var _GraphicsData = require('./graphics/GraphicsData');
Object.defineProperty(exports, 'GraphicsData', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_GraphicsData).default;
  }
});
var _GraphicsRenderer = require('./graphics/webgl/GraphicsRenderer');
Object.defineProperty(exports, 'GraphicsRenderer', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_GraphicsRenderer).default;
  }
});
var _CanvasGraphicsRenderer = require('./graphics/canvas/CanvasGraphicsRenderer');
Object.defineProperty(exports, 'CanvasGraphicsRenderer', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_CanvasGraphicsRenderer).default;
  }
});
var _Spritesheet = require('./textures/Spritesheet');
Object.defineProperty(exports, 'Spritesheet', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_Spritesheet).default;
  }
});
var _Texture = require('./textures/Texture');
Object.defineProperty(exports, 'Texture', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_Texture).default;
  }
});
var _TextureMatrix = require('./textures/TextureMatrix');
Object.defineProperty(exports, 'TextureMatrix', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_TextureMatrix).default;
  }
});
var _BaseTexture = require('./textures/BaseTexture');
Object.defineProperty(exports, 'BaseTexture', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_BaseTexture).default;
  }
});
var _RenderTexture = require('./textures/RenderTexture');
Object.defineProperty(exports, 'RenderTexture', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_RenderTexture).default;
  }
});
var _BaseRenderTexture = require('./textures/BaseRenderTexture');
Object.defineProperty(exports, 'BaseRenderTexture', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_BaseRenderTexture).default;
  }
});
var _VideoBaseTexture = require('./textures/VideoBaseTexture');
Object.defineProperty(exports, 'VideoBaseTexture', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_VideoBaseTexture).default;
  }
});
var _TextureUvs = require('./textures/TextureUvs');
Object.defineProperty(exports, 'TextureUvs', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_TextureUvs).default;
  }
});
var _CanvasRenderTarget = require('./renderers/canvas/utils/CanvasRenderTarget');
Object.defineProperty(exports, 'CanvasRenderTarget', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_CanvasRenderTarget).default;
  }
});
var _Shader = require('./Shader');
Object.defineProperty(exports, 'Shader', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_Shader).default;
  }
});
var _WebGLManager = require('./renderers/webgl/managers/WebGLManager');
Object.defineProperty(exports, 'WebGLManager', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_WebGLManager).default;
  }
});
var _ObjectRenderer = require('./renderers/webgl/utils/ObjectRenderer');
Object.defineProperty(exports, 'ObjectRenderer', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_ObjectRenderer).default;
  }
});
var _RenderTarget = require('./renderers/webgl/utils/RenderTarget');
Object.defineProperty(exports, 'RenderTarget', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_RenderTarget).default;
  }
});
var _Quad = require('./renderers/webgl/utils/Quad');
Object.defineProperty(exports, 'Quad', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_Quad).default;
  }
});
var _SpriteMaskFilter = require('./renderers/webgl/filters/spriteMask/SpriteMaskFilter');
Object.defineProperty(exports, 'SpriteMaskFilter', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_SpriteMaskFilter).default;
  }
});
var _Filter = require('./renderers/webgl/filters/Filter');
Object.defineProperty(exports, 'Filter', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_Filter).default;
  }
});
var _Application = require('./Application');
Object.defineProperty(exports, 'Application', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_Application).default;
  }
});
var _autoDetectRenderer = require('./autoDetectRenderer');
Object.defineProperty(exports, 'autoDetectRenderer', {
  enumerable: true,
  get: function get() {
    return _autoDetectRenderer.autoDetectRenderer;
  }
});
var _utils = require('./utils');
var utils = _interopRequireWildcard(_utils);
var _ticker = require('./ticker');
var ticker = _interopRequireWildcard(_ticker);
var _settings = require('./settings');
var _settings2 = _interopRequireDefault(_settings);
var _CanvasRenderer = require('./renderers/canvas/CanvasRenderer');
var _CanvasRenderer2 = _interopRequireDefault(_CanvasRenderer);
var _WebGLRenderer = require('./renderers/webgl/WebGLRenderer');
var _WebGLRenderer2 = _interopRequireDefault(_WebGLRenderer);
function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
exports.settings = _settings2.default;
exports.utils = utils;
exports.ticker = ticker;
exports.CanvasRenderer = _CanvasRenderer2.default;
exports.WebGLRenderer = _WebGLRenderer2.default; 
},{"./Application":43,"./Shader":44,"./autoDetectRenderer":45,"./const":46,"./display/Bounds":47,"./display/Container":48,"./display/DisplayObject":49,"./display/Transform":50,"./display/TransformBase":51,"./display/TransformStatic":52,"./graphics/Graphics":53,"./graphics/GraphicsData":54,"./graphics/canvas/CanvasGraphicsRenderer":55,"./graphics/webgl/GraphicsRenderer":57,"./math":70,"./renderers/canvas/CanvasRenderer":77,"./renderers/canvas/utils/CanvasRenderTarget":79,"./renderers/webgl/WebGLRenderer":84,"./renderers/webgl/filters/Filter":86,"./renderers/webgl/filters/spriteMask/SpriteMaskFilter":89,"./renderers/webgl/managers/WebGLManager":93,"./renderers/webgl/utils/ObjectRenderer":94,"./renderers/webgl/utils/Quad":95,"./renderers/webgl/utils/RenderTarget":96,"./settings":101,"./sprites/Sprite":102,"./sprites/canvas/CanvasSpriteRenderer":103,"./sprites/canvas/CanvasTinter":104,"./sprites/webgl/SpriteRenderer":106,"./text/Text":108,"./text/TextMetrics":109,"./text/TextStyle":110,"./textures/BaseRenderTexture":111,"./textures/BaseTexture":112,"./textures/RenderTexture":113,"./textures/Spritesheet":114,"./textures/Texture":115,"./textures/TextureMatrix":116,"./textures/TextureUvs":117,"./textures/VideoBaseTexture":118,"./ticker":121,"./utils":125,"pixi-gl-core":15}],66:[function(require,module,exports){
'use strict';
exports.__esModule = true;
var _Matrix = require('./Matrix');
var _Matrix2 = _interopRequireDefault(_Matrix);
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
var ux = [1, 1, 0, -1, -1, -1, 0, 1, 1, 1, 0, -1, -1, -1, 0, 1]; 
var uy = [0, 1, 1, 1, 0, -1, -1, -1, 0, 1, 1, 1, 0, -1, -1, -1];
var vx = [0, -1, -1, -1, 0, 1, 1, 1, 0, 1, 1, 1, 0, -1, -1, -1];
var vy = [1, 1, 0, -1, -1, -1, 0, 1, -1, -1, 0, 1, 1, 1, 0, -1];
var tempMatrices = [];
var mul = [];
function signum(x) {
    if (x < 0) {
        return -1;
    }
    if (x > 0) {
        return 1;
    }
    return 0;
}
function init() {
    for (var i = 0; i < 16; i++) {
        var row = [];
        mul.push(row);
        for (var j = 0; j < 16; j++) {
            var _ux = signum(ux[i] * ux[j] + vx[i] * uy[j]);
            var _uy = signum(uy[i] * ux[j] + vy[i] * uy[j]);
            var _vx = signum(ux[i] * vx[j] + vx[i] * vy[j]);
            var _vy = signum(uy[i] * vx[j] + vy[i] * vy[j]);
            for (var k = 0; k < 16; k++) {
                if (ux[k] === _ux && uy[k] === _uy && vx[k] === _vx && vy[k] === _vy) {
                    row.push(k);
                    break;
                }
            }
        }
    }
    for (var _i = 0; _i < 16; _i++) {
        var mat = new _Matrix2.default();
        mat.set(ux[_i], uy[_i], vx[_i], vy[_i], 0, 0);
        tempMatrices.push(mat);
    }
}
init();
var GroupD8 = {
    E: 0,
    SE: 1,
    S: 2,
    SW: 3,
    W: 4,
    NW: 5,
    N: 6,
    NE: 7,
    MIRROR_VERTICAL: 8,
    MIRROR_HORIZONTAL: 12,
    uX: function uX(ind) {
        return ux[ind];
    },
    uY: function uY(ind) {
        return uy[ind];
    },
    vX: function vX(ind) {
        return vx[ind];
    },
    vY: function vY(ind) {
        return vy[ind];
    },
    inv: function inv(rotation) {
        if (rotation & 8) {
            return rotation & 15;
        }
        return -rotation & 7;
    },
    add: function add(rotationSecond, rotationFirst) {
        return mul[rotationSecond][rotationFirst];
    },
    sub: function sub(rotationSecond, rotationFirst) {
        return mul[rotationSecond][GroupD8.inv(rotationFirst)];
    },
    rotate180: function rotate180(rotation) {
        return rotation ^ 4;
    },
    isVertical: function isVertical(rotation) {
        return (rotation & 3) === 2;
    },
    byDirection: function byDirection(dx, dy) {
        if (Math.abs(dx) * 2 <= Math.abs(dy)) {
            if (dy >= 0) {
                return GroupD8.S;
            }
            return GroupD8.N;
        } else if (Math.abs(dy) * 2 <= Math.abs(dx)) {
            if (dx > 0) {
                return GroupD8.E;
            }
            return GroupD8.W;
        } else if (dy > 0) {
            if (dx > 0) {
                return GroupD8.SE;
            }
            return GroupD8.SW;
        } else if (dx > 0) {
            return GroupD8.NE;
        }
        return GroupD8.NW;
    },
    matrixAppendRotationInv: function matrixAppendRotationInv(matrix, rotation) {
        var tx = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
        var ty = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;
        var mat = tempMatrices[GroupD8.inv(rotation)];
        mat.tx = tx;
        mat.ty = ty;
        matrix.append(mat);
    }
};
exports.default = GroupD8;
},{"./Matrix":67}],67:[function(require,module,exports){
'use strict';
exports.__esModule = true;
var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
var _Point = require('./Point');
var _Point2 = _interopRequireDefault(_Point);
var _const = require('../const');
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
var Matrix = function () {
    function Matrix() {
        var a = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
        var b = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
        var c = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
        var d = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 1;
        var tx = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 0;
        var ty = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : 0;
        _classCallCheck(this, Matrix);
        this.a = a;
        this.b = b;
        this.c = c;
        this.d = d;
        this.tx = tx;
        this.ty = ty;
        this.array = null;
    }
    Matrix.prototype.fromArray = function fromArray(array) {
        this.a = array[0];
        this.b = array[1];
        this.c = array[3];
        this.d = array[4];
        this.tx = array[2];
        this.ty = array[5];
    };
    Matrix.prototype.set = function set(a, b, c, d, tx, ty) {
        this.a = a;
        this.b = b;
        this.c = c;
        this.d = d;
        this.tx = tx;
        this.ty = ty;
        return this;
    };
    Matrix.prototype.toArray = function toArray(transpose, out) {
        if (!this.array) {
            this.array = new Float32Array(9);
        }
        var array = out || this.array;
        if (transpose) {
            array[0] = this.a;
            array[1] = this.b;
            array[2] = 0;
            array[3] = this.c;
            array[4] = this.d;
            array[5] = 0;
            array[6] = this.tx;
            array[7] = this.ty;
            array[8] = 1;
        } else {
            array[0] = this.a;
            array[1] = this.c;
            array[2] = this.tx;
            array[3] = this.b;
            array[4] = this.d;
            array[5] = this.ty;
            array[6] = 0;
            array[7] = 0;
            array[8] = 1;
        }
        return array;
    };
    Matrix.prototype.apply = function apply(pos, newPos) {
        newPos = newPos || new _Point2.default();
        var x = pos.x;
        var y = pos.y;
        newPos.x = this.a * x + this.c * y + this.tx;
        newPos.y = this.b * x + this.d * y + this.ty;
        return newPos;
    };
    Matrix.prototype.applyInverse = function applyInverse(pos, newPos) {
        newPos = newPos || new _Point2.default();
        var id = 1 / (this.a * this.d + this.c * -this.b);
        var x = pos.x;
        var y = pos.y;
        newPos.x = this.d * id * x + -this.c * id * y + (this.ty * this.c - this.tx * this.d) * id;
        newPos.y = this.a * id * y + -this.b * id * x + (-this.ty * this.a + this.tx * this.b) * id;
        return newPos;
    };
    Matrix.prototype.translate = function translate(x, y) {
        this.tx += x;
        this.ty += y;
        return this;
    };
    Matrix.prototype.scale = function scale(x, y) {
        this.a *= x;
        this.d *= y;
        this.c *= x;
        this.b *= y;
        this.tx *= x;
        this.ty *= y;
        return this;
    };
    Matrix.prototype.rotate = function rotate(angle) {
        var cos = Math.cos(angle);
        var sin = Math.sin(angle);
        var a1 = this.a;
        var c1 = this.c;
        var tx1 = this.tx;
        this.a = a1 * cos - this.b * sin;
        this.b = a1 * sin + this.b * cos;
        this.c = c1 * cos - this.d * sin;
        this.d = c1 * sin + this.d * cos;
        this.tx = tx1 * cos - this.ty * sin;
        this.ty = tx1 * sin + this.ty * cos;
        return this;
    };
    Matrix.prototype.append = function append(matrix) {
        var a1 = this.a;
        var b1 = this.b;
        var c1 = this.c;
        var d1 = this.d;
        this.a = matrix.a * a1 + matrix.b * c1;
        this.b = matrix.a * b1 + matrix.b * d1;
        this.c = matrix.c * a1 + matrix.d * c1;
        this.d = matrix.c * b1 + matrix.d * d1;
        this.tx = matrix.tx * a1 + matrix.ty * c1 + this.tx;
        this.ty = matrix.tx * b1 + matrix.ty * d1 + this.ty;
        return this;
    };
    Matrix.prototype.setTransform = function setTransform(x, y, pivotX, pivotY, scaleX, scaleY, rotation, skewX, skewY) {
        this.a = Math.cos(rotation + skewY) * scaleX;
        this.b = Math.sin(rotation + skewY) * scaleX;
        this.c = -Math.sin(rotation - skewX) * scaleY;
        this.d = Math.cos(rotation - skewX) * scaleY;
        this.tx = x - (pivotX * this.a + pivotY * this.c);
        this.ty = y - (pivotX * this.b + pivotY * this.d);
        return this;
    };
    Matrix.prototype.prepend = function prepend(matrix) {
        var tx1 = this.tx;
        if (matrix.a !== 1 || matrix.b !== 0 || matrix.c !== 0 || matrix.d !== 1) {
            var a1 = this.a;
            var c1 = this.c;
            this.a = a1 * matrix.a + this.b * matrix.c;
            this.b = a1 * matrix.b + this.b * matrix.d;
            this.c = c1 * matrix.a + this.d * matrix.c;
            this.d = c1 * matrix.b + this.d * matrix.d;
        }
        this.tx = tx1 * matrix.a + this.ty * matrix.c + matrix.tx;
        this.ty = tx1 * matrix.b + this.ty * matrix.d + matrix.ty;
        return this;
    };
    Matrix.prototype.decompose = function decompose(transform) {
        var a = this.a;
        var b = this.b;
        var c = this.c;
        var d = this.d;
        var skewX = -Math.atan2(-c, d);
        var skewY = Math.atan2(b, a);
        var delta = Math.abs(skewX + skewY);
        if (delta < 0.00001 || Math.abs(_const.PI_2 - delta) < 0.00001) {
            transform.rotation = skewY;
            if (a < 0 && d >= 0) {
                transform.rotation += transform.rotation <= 0 ? Math.PI : -Math.PI;
            }
            transform.skew.x = transform.skew.y = 0;
        } else {
            transform.rotation = 0;
            transform.skew.x = skewX;
            transform.skew.y = skewY;
        }
        transform.scale.x = Math.sqrt(a * a + b * b);
        transform.scale.y = Math.sqrt(c * c + d * d);
        transform.position.x = this.tx;
        transform.position.y = this.ty;
        return transform;
    };
    Matrix.prototype.invert = function invert() {
        var a1 = this.a;
        var b1 = this.b;
        var c1 = this.c;
        var d1 = this.d;
        var tx1 = this.tx;
        var n = a1 * d1 - b1 * c1;
        this.a = d1 / n;
        this.b = -b1 / n;
        this.c = -c1 / n;
        this.d = a1 / n;
        this.tx = (c1 * this.ty - d1 * tx1) / n;
        this.ty = -(a1 * this.ty - b1 * tx1) / n;
        return this;
    };
    Matrix.prototype.identity = function identity() {
        this.a = 1;
        this.b = 0;
        this.c = 0;
        this.d = 1;
        this.tx = 0;
        this.ty = 0;
        return this;
    };
    Matrix.prototype.clone = function clone() {
        var matrix = new Matrix();
        matrix.a = this.a;
        matrix.b = this.b;
        matrix.c = this.c;
        matrix.d = this.d;
        matrix.tx = this.tx;
        matrix.ty = this.ty;
        return matrix;
    };
    Matrix.prototype.copy = function copy(matrix) {
        matrix.a = this.a;
        matrix.b = this.b;
        matrix.c = this.c;
        matrix.d = this.d;
        matrix.tx = this.tx;
        matrix.ty = this.ty;
        return matrix;
    };
    _createClass(Matrix, null, [{
        key: 'IDENTITY',
        get: function get() {
            return new Matrix();
        }
    }, {
        key: 'TEMP_MATRIX',
        get: function get() {
            return new Matrix();
        }
    }]);
    return Matrix;
}();
exports.default = Matrix;
},{"../const":46,"./Point":69}],68:[function(require,module,exports){
"use strict";
exports.__esModule = true;
var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
var ObservablePoint = function () {
    function ObservablePoint(cb, scope) {
        var x = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
        var y = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;
        _classCallCheck(this, ObservablePoint);
        this._x = x;
        this._y = y;
        this.cb = cb;
        this.scope = scope;
    }
    ObservablePoint.prototype.set = function set(x, y) {
        var _x = x || 0;
        var _y = y || (y !== 0 ? _x : 0);
        if (this._x !== _x || this._y !== _y) {
            this._x = _x;
            this._y = _y;
            this.cb.call(this.scope);
        }
    };
    ObservablePoint.prototype.copy = function copy(point) {
        if (this._x !== point.x || this._y !== point.y) {
            this._x = point.x;
            this._y = point.y;
            this.cb.call(this.scope);
        }
    };
    _createClass(ObservablePoint, [{
        key: "x",
        get: function get() {
            return this._x;
        },
        set: function set(value) 
        {
            if (this._x !== value) {
                this._x = value;
                this.cb.call(this.scope);
            }
        }
    }, {
        key: "y",
        get: function get() {
            return this._y;
        },
        set: function set(value) 
        {
            if (this._y !== value) {
                this._y = value;
                this.cb.call(this.scope);
            }
        }
    }]);
    return ObservablePoint;
}();
exports.default = ObservablePoint;
},{}],69:[function(require,module,exports){
"use strict";
exports.__esModule = true;
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
var Point = function () {
  function Point() {
    var x = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
    var y = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
    _classCallCheck(this, Point);
    this.x = x;
    this.y = y;
  }
  Point.prototype.clone = function clone() {
    return new Point(this.x, this.y);
  };
  Point.prototype.copy = function copy(p) {
    this.set(p.x, p.y);
  };
  Point.prototype.equals = function equals(p) {
    return p.x === this.x && p.y === this.y;
  };
  Point.prototype.set = function set(x, y) {
    this.x = x || 0;
    this.y = y || (y !== 0 ? this.x : 0);
  };
  return Point;
}();
exports.default = Point;
},{}],70:[function(require,module,exports){
'use strict';
exports.__esModule = true;
var _Point = require('./Point');
Object.defineProperty(exports, 'Point', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_Point).default;
  }
});
var _ObservablePoint = require('./ObservablePoint');
Object.defineProperty(exports, 'ObservablePoint', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_ObservablePoint).default;
  }
});
var _Matrix = require('./Matrix');
Object.defineProperty(exports, 'Matrix', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_Matrix).default;
  }
});
var _GroupD = require('./GroupD8');
Object.defineProperty(exports, 'GroupD8', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_GroupD).default;
  }
});
var _Circle = require('./shapes/Circle');
Object.defineProperty(exports, 'Circle', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_Circle).default;
  }
});
var _Ellipse = require('./shapes/Ellipse');
Object.defineProperty(exports, 'Ellipse', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_Ellipse).default;
  }
});
var _Polygon = require('./shapes/Polygon');
Object.defineProperty(exports, 'Polygon', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_Polygon).default;
  }
});
var _Rectangle = require('./shapes/Rectangle');
Object.defineProperty(exports, 'Rectangle', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_Rectangle).default;
  }
});
var _RoundedRectangle = require('./shapes/RoundedRectangle');
Object.defineProperty(exports, 'RoundedRectangle', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_RoundedRectangle).default;
  }
});
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
},{"./GroupD8":66,"./Matrix":67,"./ObservablePoint":68,"./Point":69,"./shapes/Circle":71,"./shapes/Ellipse":72,"./shapes/Polygon":73,"./shapes/Rectangle":74,"./shapes/RoundedRectangle":75}],71:[function(require,module,exports){
'use strict';
exports.__esModule = true;
var _Rectangle = require('./Rectangle');
var _Rectangle2 = _interopRequireDefault(_Rectangle);
var _const = require('../../const');
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
var Circle = function () {
  function Circle() {
    var x = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
    var y = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
    var radius = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
    _classCallCheck(this, Circle);
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.type = _const.SHAPES.CIRC;
  }
  Circle.prototype.clone = function clone() {
    return new Circle(this.x, this.y, this.radius);
  };
  Circle.prototype.contains = function contains(x, y) {
    if (this.radius <= 0) {
      return false;
    }
    var r2 = this.radius * this.radius;
    var dx = this.x - x;
    var dy = this.y - y;
    dx *= dx;
    dy *= dy;
    return dx + dy <= r2;
  };
  Circle.prototype.getBounds = function getBounds() {
    return new _Rectangle2.default(this.x - this.radius, this.y - this.radius, this.radius * 2, this.radius * 2);
  };
  return Circle;
}();
exports.default = Circle;
},{"../../const":46,"./Rectangle":74}],72:[function(require,module,exports){
'use strict';
exports.__esModule = true;
var _Rectangle = require('./Rectangle');
var _Rectangle2 = _interopRequireDefault(_Rectangle);
var _const = require('../../const');
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
var Ellipse = function () {
  function Ellipse() {
    var x = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
    var y = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
    var width = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
    var height = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;
    _classCallCheck(this, Ellipse);
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.type = _const.SHAPES.ELIP;
  }
  Ellipse.prototype.clone = function clone() {
    return new Ellipse(this.x, this.y, this.width, this.height);
  };
  Ellipse.prototype.contains = function contains(x, y) {
    if (this.width <= 0 || this.height <= 0) {
      return false;
    }
    var normx = (x - this.x) / this.width;
    var normy = (y - this.y) / this.height;
    normx *= normx;
    normy *= normy;
    return normx + normy <= 1;
  };
  Ellipse.prototype.getBounds = function getBounds() {
    return new _Rectangle2.default(this.x - this.width, this.y - this.height, this.width, this.height);
  };
  return Ellipse;
}();
exports.default = Ellipse;
},{"../../const":46,"./Rectangle":74}],73:[function(require,module,exports){
'use strict';
exports.__esModule = true;
var _Point = require('../Point');
var _Point2 = _interopRequireDefault(_Point);
var _const = require('../../const');
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
var Polygon = function () {
    function Polygon() {
        for (var _len = arguments.length, points = Array(_len), _key = 0; _key < _len; _key++) {
            points[_key] = arguments[_key];
        }
        _classCallCheck(this, Polygon);
        if (Array.isArray(points[0])) {
            points = points[0];
        }
        if (points[0] instanceof _Point2.default) {
            var p = [];
            for (var i = 0, il = points.length; i < il; i++) {
                p.push(points[i].x, points[i].y);
            }
            points = p;
        }
        this.closed = true;
        this.points = points;
        this.type = _const.SHAPES.POLY;
    }
    Polygon.prototype.clone = function clone() {
        return new Polygon(this.points.slice());
    };
    Polygon.prototype.close = function close() {
        var points = this.points;
        if (points[0] !== points[points.length - 2] || points[1] !== points[points.length - 1]) {
            points.push(points[0], points[1]);
        }
    };
    Polygon.prototype.contains = function contains(x, y) {
        var inside = false;
        var length = this.points.length / 2;
        for (var i = 0, j = length - 1; i < length; j = i++) {
            var xi = this.points[i * 2];
            var yi = this.points[i * 2 + 1];
            var xj = this.points[j * 2];
            var yj = this.points[j * 2 + 1];
            var intersect = yi > y !== yj > y && x < (xj - xi) * ((y - yi) / (yj - yi)) + xi;
            if (intersect) {
                inside = !inside;
            }
        }
        return inside;
    };
    return Polygon;
}();
exports.default = Polygon;
},{"../../const":46,"../Point":69}],74:[function(require,module,exports){
'use strict';
exports.__esModule = true;
var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
var _const = require('../../const');
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
var Rectangle = function () {
    function Rectangle() {
        var x = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
        var y = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
        var width = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
        var height = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;
        _classCallCheck(this, Rectangle);
        this.x = Number(x);
        this.y = Number(y);
        this.width = Number(width);
        this.height = Number(height);
        this.type = _const.SHAPES.RECT;
    }
    Rectangle.prototype.clone = function clone() {
        return new Rectangle(this.x, this.y, this.width, this.height);
    };
    Rectangle.prototype.copy = function copy(rectangle) {
        this.x = rectangle.x;
        this.y = rectangle.y;
        this.width = rectangle.width;
        this.height = rectangle.height;
        return this;
    };
    Rectangle.prototype.contains = function contains(x, y) {
        if (this.width <= 0 || this.height <= 0) {
            return false;
        }
        if (x >= this.x && x < this.x + this.width) {
            if (y >= this.y && y < this.y + this.height) {
                return true;
            }
        }
        return false;
    };
    Rectangle.prototype.pad = function pad(paddingX, paddingY) {
        paddingX = paddingX || 0;
        paddingY = paddingY || (paddingY !== 0 ? paddingX : 0);
        this.x -= paddingX;
        this.y -= paddingY;
        this.width += paddingX * 2;
        this.height += paddingY * 2;
    };
    Rectangle.prototype.fit = function fit(rectangle) {
        if (this.x < rectangle.x) {
            this.width += this.x;
            if (this.width < 0) {
                this.width = 0;
            }
            this.x = rectangle.x;
        }
        if (this.y < rectangle.y) {
            this.height += this.y;
            if (this.height < 0) {
                this.height = 0;
            }
            this.y = rectangle.y;
        }
        if (this.x + this.width > rectangle.x + rectangle.width) {
            this.width = rectangle.width - this.x;
            if (this.width < 0) {
                this.width = 0;
            }
        }
        if (this.y + this.height > rectangle.y + rectangle.height) {
            this.height = rectangle.height - this.y;
            if (this.height < 0) {
                this.height = 0;
            }
        }
    };
    Rectangle.prototype.enlarge = function enlarge(rectangle) {
        var x1 = Math.min(this.x, rectangle.x);
        var x2 = Math.max(this.x + this.width, rectangle.x + rectangle.width);
        var y1 = Math.min(this.y, rectangle.y);
        var y2 = Math.max(this.y + this.height, rectangle.y + rectangle.height);
        this.x = x1;
        this.width = x2 - x1;
        this.y = y1;
        this.height = y2 - y1;
    };
    _createClass(Rectangle, [{
        key: 'left',
        get: function get() {
            return this.x;
        }
    }, {
        key: 'right',
        get: function get() {
            return this.x + this.width;
        }
    }, {
        key: 'top',
        get: function get() {
            return this.y;
        }
    }, {
        key: 'bottom',
        get: function get() {
            return this.y + this.height;
        }
    }], [{
        key: 'EMPTY',
        get: function get() {
            return new Rectangle(0, 0, 0, 0);
        }
    }]);
    return Rectangle;
}();
exports.default = Rectangle;
},{"../../const":46}],75:[function(require,module,exports){
'use strict';
exports.__esModule = true;
var _const = require('../../const');
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
var RoundedRectangle = function () {
    function RoundedRectangle() {
        var x = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
        var y = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
        var width = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
        var height = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;
        var radius = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 20;
        _classCallCheck(this, RoundedRectangle);
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.radius = radius;
        this.type = _const.SHAPES.RREC;
    }
    RoundedRectangle.prototype.clone = function clone() {
        return new RoundedRectangle(this.x, this.y, this.width, this.height, this.radius);
    };
    RoundedRectangle.prototype.contains = function contains(x, y) {
        if (this.width <= 0 || this.height <= 0) {
            return false;
        }
        if (x >= this.x && x <= this.x + this.width) {
            if (y >= this.y && y <= this.y + this.height) {
                if (y >= this.y + this.radius && y <= this.y + this.height - this.radius || x >= this.x + this.radius && x <= this.x + this.width - this.radius) {
                    return true;
                }
                var dx = x - (this.x + this.radius);
                var dy = y - (this.y + this.radius);
                var radius2 = this.radius * this.radius;
                if (dx * dx + dy * dy <= radius2) {
                    return true;
                }
                dx = x - (this.x + this.width - this.radius);
                if (dx * dx + dy * dy <= radius2) {
                    return true;
                }
                dy = y - (this.y + this.height - this.radius);
                if (dx * dx + dy * dy <= radius2) {
                    return true;
                }
                dx = x - (this.x + this.radius);
                if (dx * dx + dy * dy <= radius2) {
                    return true;
                }
            }
        }
        return false;
    };
    return RoundedRectangle;
}();
exports.default = RoundedRectangle;
},{"../../const":46}],76:[function(require,module,exports){
'use strict';
exports.__esModule = true;
var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
var _utils = require('../utils');
var _math = require('../math');
var _const = require('../const');
var _settings = require('../settings');
var _settings2 = _interopRequireDefault(_settings);
var _Container = require('../display/Container');
var _Container2 = _interopRequireDefault(_Container);
var _RenderTexture = require('../textures/RenderTexture');
var _RenderTexture2 = _interopRequireDefault(_RenderTexture);
var _eventemitter = require('eventemitter3');
var _eventemitter2 = _interopRequireDefault(_eventemitter);
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
var tempMatrix = new _math.Matrix();
var SystemRenderer = function (_EventEmitter) {
  _inherits(SystemRenderer, _EventEmitter);
  function SystemRenderer(system, options, arg2, arg3) {
    _classCallCheck(this, SystemRenderer);
    var _this = _possibleConstructorReturn(this, _EventEmitter.call(this));
    (0, _utils.sayHello)(system);
    if (typeof options === 'number') {
      options = Object.assign({
        width: options,
        height: arg2 || _settings2.default.RENDER_OPTIONS.height
      }, arg3);
    }
    options = Object.assign({}, _settings2.default.RENDER_OPTIONS, options);
    _this.options = options;
    _this.type = _const.RENDERER_TYPE.UNKNOWN;
    _this.screen = new _math.Rectangle(0, 0, options.width, options.height);
    _this.view = options.view || document.createElement('canvas');
    _this.resolution = options.resolution || _settings2.default.RESOLUTION;
    _this.transparent = options.transparent;
    _this.autoResize = options.autoResize || false;
    _this.blendModes = null;
    _this.preserveDrawingBuffer = options.preserveDrawingBuffer;
    _this.clearBeforeRender = options.clearBeforeRender;
    _this.roundPixels = options.roundPixels;
    _this._backgroundColor = 0x000000;
    _this._backgroundColorRgba = [0, 0, 0, 0];
    _this._backgroundColorString = '#000000';
    _this.backgroundColor = options.backgroundColor || _this._backgroundColor; 
    _this._tempDisplayObjectParent = new _Container2.default();
    _this._lastObjectRendered = _this._tempDisplayObjectParent;
    return _this;
  }
  SystemRenderer.prototype.resize = function resize(screenWidth, screenHeight) {
    this.screen.width = screenWidth;
    this.screen.height = screenHeight;
    this.view.width = screenWidth * this.resolution;
    this.view.height = screenHeight * this.resolution;
    if (this.autoResize) {
      this.view.style.width = screenWidth + 'px';
      this.view.style.height = screenHeight + 'px';
    }
  };
  SystemRenderer.prototype.generateTexture = function generateTexture(displayObject, scaleMode, resolution, region) {
    region = region || displayObject.getLocalBounds();
    var renderTexture = _RenderTexture2.default.create(region.width | 0, region.height | 0, scaleMode, resolution);
    tempMatrix.tx = -region.x;
    tempMatrix.ty = -region.y;
    this.render(displayObject, renderTexture, false, tempMatrix, true);
    return renderTexture;
  };
  SystemRenderer.prototype.destroy = function destroy(removeView) {
    if (removeView && this.view.parentNode) {
      this.view.parentNode.removeChild(this.view);
    }
    this.type = _const.RENDERER_TYPE.UNKNOWN;
    this.view = null;
    this.screen = null;
    this.resolution = 0;
    this.transparent = false;
    this.autoResize = false;
    this.blendModes = null;
    this.options = null;
    this.preserveDrawingBuffer = false;
    this.clearBeforeRender = false;
    this.roundPixels = false;
    this._backgroundColor = 0;
    this._backgroundColorRgba = null;
    this._backgroundColorString = null;
    this._tempDisplayObjectParent = null;
    this._lastObjectRendered = null;
  };
  _createClass(SystemRenderer, [{
    key: 'width',
    get: function get() {
      return this.view.width;
    }
  }, {
    key: 'height',
    get: function get() {
      return this.view.height;
    }
  }, {
    key: 'backgroundColor',
    get: function get() {
      return this._backgroundColor;
    },
    set: function set(value) 
    {
      this._backgroundColor = value;
      this._backgroundColorString = (0, _utils.hex2string)(value);
      (0, _utils.hex2rgb)(value, this._backgroundColorRgba);
    }
  }]);
  return SystemRenderer;
}(_eventemitter2.default);
exports.default = SystemRenderer;
},{"../const":46,"../display/Container":48,"../math":70,"../settings":101,"../textures/RenderTexture":113,"../utils":125,"eventemitter3":3}],77:[function(require,module,exports){
'use strict';
exports.__esModule = true;
var _SystemRenderer2 = require('../SystemRenderer');
var _SystemRenderer3 = _interopRequireDefault(_SystemRenderer2);
var _CanvasMaskManager = require('./utils/CanvasMaskManager');
var _CanvasMaskManager2 = _interopRequireDefault(_CanvasMaskManager);
var _CanvasRenderTarget = require('./utils/CanvasRenderTarget');
var _CanvasRenderTarget2 = _interopRequireDefault(_CanvasRenderTarget);
var _mapCanvasBlendModesToPixi = require('./utils/mapCanvasBlendModesToPixi');
var _mapCanvasBlendModesToPixi2 = _interopRequireDefault(_mapCanvasBlendModesToPixi);
var _utils = require('../../utils');
var _const = require('../../const');
var _settings = require('../../settings');
var _settings2 = _interopRequireDefault(_settings);
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
var CanvasRenderer = function (_SystemRenderer) {
    _inherits(CanvasRenderer, _SystemRenderer);
    function CanvasRenderer(options, arg2, arg3) {
        _classCallCheck(this, CanvasRenderer);
        var _this = _possibleConstructorReturn(this, _SystemRenderer.call(this, 'Canvas', options, arg2, arg3));
        _this.type = _const.RENDERER_TYPE.CANVAS;
        _this.rootContext = _this.view.getContext('2d', { alpha: _this.transparent });
        _this.context = _this.rootContext;
        _this.refresh = true;
        _this.maskManager = new _CanvasMaskManager2.default(_this);
        _this.smoothProperty = 'imageSmoothingEnabled';
        if (!_this.rootContext.imageSmoothingEnabled) {
            if (_this.rootContext.webkitImageSmoothingEnabled) {
                _this.smoothProperty = 'webkitImageSmoothingEnabled';
            } else if (_this.rootContext.mozImageSmoothingEnabled) {
                _this.smoothProperty = 'mozImageSmoothingEnabled';
            } else if (_this.rootContext.oImageSmoothingEnabled) {
                _this.smoothProperty = 'oImageSmoothingEnabled';
            } else if (_this.rootContext.msImageSmoothingEnabled) {
                _this.smoothProperty = 'msImageSmoothingEnabled';
            }
        }
        _this.initPlugins();
        _this.blendModes = (0, _mapCanvasBlendModesToPixi2.default)();
        _this._activeBlendMode = null;
        _this.renderingToScreen = false;
        _this.resize(_this.options.width, _this.options.height);
        return _this;
    }
    CanvasRenderer.prototype.render = function render(displayObject, renderTexture, clear, transform, skipUpdateTransform) {
        if (!this.view) {
            return;
        }
        this.renderingToScreen = !renderTexture;
        this.emit('prerender');
        var rootResolution = this.resolution;
        if (renderTexture) {
            renderTexture = renderTexture.baseTexture || renderTexture;
            if (!renderTexture._canvasRenderTarget) {
                renderTexture._canvasRenderTarget = new _CanvasRenderTarget2.default(renderTexture.width, renderTexture.height, renderTexture.resolution);
                renderTexture.source = renderTexture._canvasRenderTarget.canvas;
                renderTexture.valid = true;
            }
            this.context = renderTexture._canvasRenderTarget.context;
            this.resolution = renderTexture._canvasRenderTarget.resolution;
        } else {
            this.context = this.rootContext;
        }
        var context = this.context;
        if (!renderTexture) {
            this._lastObjectRendered = displayObject;
        }
        if (!skipUpdateTransform) {
            var cacheParent = displayObject.parent;
            var tempWt = this._tempDisplayObjectParent.transform.worldTransform;
            if (transform) {
                transform.copy(tempWt);
                this._tempDisplayObjectParent.transform._worldID = -1;
            } else {
                tempWt.identity();
            }
            displayObject.parent = this._tempDisplayObjectParent;
            displayObject.updateTransform();
            displayObject.parent = cacheParent;
        }
        context.save();
        context.setTransform(1, 0, 0, 1, 0, 0);
        context.globalAlpha = 1;
        this._activeBlendMode = _const.BLEND_MODES.NORMAL;
        context.globalCompositeOperation = this.blendModes[_const.BLEND_MODES.NORMAL];
        if (navigator.isCocoonJS && this.view.screencanvas) {
            context.fillStyle = 'black';
            context.clear();
        }
        if (clear !== undefined ? clear : this.clearBeforeRender) {
            if (this.renderingToScreen) {
                if (this.transparent) {
                    context.clearRect(0, 0, this.width, this.height);
                } else {
                    context.fillStyle = this._backgroundColorString;
                    context.fillRect(0, 0, this.width, this.height);
                }
            } 
        }
        var tempContext = this.context;
        this.context = context;
        displayObject.renderCanvas(this);
        this.context = tempContext;
        context.restore();
        this.resolution = rootResolution;
        this.emit('postrender');
    };
    CanvasRenderer.prototype.clear = function clear(clearColor) {
        var context = this.context;
        clearColor = clearColor || this._backgroundColorString;
        if (!this.transparent && clearColor) {
            context.fillStyle = clearColor;
            context.fillRect(0, 0, this.width, this.height);
        } else {
            context.clearRect(0, 0, this.width, this.height);
        }
    };
    CanvasRenderer.prototype.setBlendMode = function setBlendMode(blendMode) {
        if (this._activeBlendMode === blendMode) {
            return;
        }
        this._activeBlendMode = blendMode;
        this.context.globalCompositeOperation = this.blendModes[blendMode];
    };
    CanvasRenderer.prototype.destroy = function destroy(removeView) {
        this.destroyPlugins();
        _SystemRenderer.prototype.destroy.call(this, removeView);
        this.context = null;
        this.refresh = true;
        this.maskManager.destroy();
        this.maskManager = null;
        this.smoothProperty = null;
    };
    CanvasRenderer.prototype.resize = function resize(screenWidth, screenHeight) {
        _SystemRenderer.prototype.resize.call(this, screenWidth, screenHeight);
        if (this.smoothProperty) {
            this.rootContext[this.smoothProperty] = _settings2.default.SCALE_MODE === _const.SCALE_MODES.LINEAR;
        }
    };
    CanvasRenderer.prototype.invalidateBlendMode = function invalidateBlendMode() {
        this._activeBlendMode = this.blendModes.indexOf(this.context.globalCompositeOperation);
    };
    return CanvasRenderer;
}(_SystemRenderer3.default);
exports.default = CanvasRenderer;
_utils.pluginTarget.mixin(CanvasRenderer);
},{"../../const":46,"../../settings":101,"../../utils":125,"../SystemRenderer":76,"./utils/CanvasMaskManager":78,"./utils/CanvasRenderTarget":79,"./utils/mapCanvasBlendModesToPixi":81}],78:[function(require,module,exports){
'use strict';
exports.__esModule = true;
var _const = require('../../../const');
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
var CanvasMaskManager = function () {
    function CanvasMaskManager(renderer) {
        _classCallCheck(this, CanvasMaskManager);
        this.renderer = renderer;
    }
    CanvasMaskManager.prototype.pushMask = function pushMask(maskData) {
        var renderer = this.renderer;
        renderer.context.save();
        var cacheAlpha = maskData.alpha;
        var transform = maskData.transform.worldTransform;
        var resolution = renderer.resolution;
        renderer.context.setTransform(transform.a * resolution, transform.b * resolution, transform.c * resolution, transform.d * resolution, transform.tx * resolution, transform.ty * resolution);
        if (!maskData._texture) {
            this.renderGraphicsShape(maskData);
            renderer.context.clip();
        }
        maskData.worldAlpha = cacheAlpha;
    };
    CanvasMaskManager.prototype.renderGraphicsShape = function renderGraphicsShape(graphics) {
        var context = this.renderer.context;
        var len = graphics.graphicsData.length;
        if (len === 0) {
            return;
        }
        context.beginPath();
        for (var i = 0; i < len; i++) {
            var data = graphics.graphicsData[i];
            var shape = data.shape;
            if (data.type === _const.SHAPES.POLY) {
                var points = shape.points;
                context.moveTo(points[0], points[1]);
                for (var j = 1; j < points.length / 2; j++) {
                    context.lineTo(points[j * 2], points[j * 2 + 1]);
                }
                if (points[0] === points[points.length - 2] && points[1] === points[points.length - 1]) {
                    context.closePath();
                }
            } else if (data.type === _const.SHAPES.RECT) {
                context.rect(shape.x, shape.y, shape.width, shape.height);
                context.closePath();
            } else if (data.type === _const.SHAPES.CIRC) {
                context.arc(shape.x, shape.y, shape.radius, 0, 2 * Math.PI);
                context.closePath();
            } else if (data.type === _const.SHAPES.ELIP) {
                var w = shape.width * 2;
                var h = shape.height * 2;
                var x = shape.x - w / 2;
                var y = shape.y - h / 2;
                var kappa = 0.5522848;
                var ox = w / 2 * kappa; 
                var oy = h / 2 * kappa; 
                var xe = x + w; 
                var ye = y + h; 
                var xm = x + w / 2; 
                var ym = y + h / 2; 
                context.moveTo(x, ym);
                context.bezierCurveTo(x, ym - oy, xm - ox, y, xm, y);
                context.bezierCurveTo(xm + ox, y, xe, ym - oy, xe, ym);
                context.bezierCurveTo(xe, ym + oy, xm + ox, ye, xm, ye);
                context.bezierCurveTo(xm - ox, ye, x, ym + oy, x, ym);
                context.closePath();
            } else if (data.type === _const.SHAPES.RREC) {
                var rx = shape.x;
                var ry = shape.y;
                var width = shape.width;
                var height = shape.height;
                var radius = shape.radius;
                var maxRadius = Math.min(width, height) / 2 | 0;
                radius = radius > maxRadius ? maxRadius : radius;
                context.moveTo(rx, ry + radius);
                context.lineTo(rx, ry + height - radius);
                context.quadraticCurveTo(rx, ry + height, rx + radius, ry + height);
                context.lineTo(rx + width - radius, ry + height);
                context.quadraticCurveTo(rx + width, ry + height, rx + width, ry + height - radius);
                context.lineTo(rx + width, ry + radius);
                context.quadraticCurveTo(rx + width, ry, rx + width - radius, ry);
                context.lineTo(rx + radius, ry);
                context.quadraticCurveTo(rx, ry, rx, ry + radius);
                context.closePath();
            }
        }
    };
    CanvasMaskManager.prototype.popMask = function popMask(renderer) {
        renderer.context.restore();
        renderer.invalidateBlendMode();
    };
    CanvasMaskManager.prototype.destroy = function destroy() {
    };
    return CanvasMaskManager;
}();
exports.default = CanvasMaskManager;
},{"../../../const":46}],79:[function(require,module,exports){
'use strict';
exports.__esModule = true;
var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
var _settings = require('../../../settings');
var _settings2 = _interopRequireDefault(_settings);
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
var CanvasRenderTarget = function () {
  function CanvasRenderTarget(width, height, resolution) {
    _classCallCheck(this, CanvasRenderTarget);
    this.canvas = document.createElement('canvas');
    this.context = this.canvas.getContext('2d');
    this.resolution = resolution || _settings2.default.RESOLUTION;
    this.resize(width, height);
  }
  CanvasRenderTarget.prototype.clear = function clear() {
    this.context.setTransform(1, 0, 0, 1, 0, 0);
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  };
  CanvasRenderTarget.prototype.resize = function resize(width, height) {
    this.canvas.width = width * this.resolution;
    this.canvas.height = height * this.resolution;
  };
  CanvasRenderTarget.prototype.destroy = function destroy() {
    this.context = null;
    this.canvas = null;
  };
  _createClass(CanvasRenderTarget, [{
    key: 'width',
    get: function get() {
      return this.canvas.width;
    },
    set: function set(val) 
    {
      this.canvas.width = val;
    }
  }, {
    key: 'height',
    get: function get() {
      return this.canvas.height;
    },
    set: function set(val) 
    {
      this.canvas.height = val;
    }
  }]);
  return CanvasRenderTarget;
}();
exports.default = CanvasRenderTarget;
},{"../../../settings":101}],80:[function(require,module,exports){
'use strict';
exports.__esModule = true;
exports.default = canUseNewCanvasBlendModes;
function createColoredCanvas(color) {
    var canvas = document.createElement('canvas');
    canvas.width = 6;
    canvas.height = 1;
    var context = canvas.getContext('2d');
    context.fillStyle = color;
    context.fillRect(0, 0, 6, 1);
    return canvas;
}
function canUseNewCanvasBlendModes() {
    if (typeof document === 'undefined') {
        return false;
    }
    var magenta = createColoredCanvas('#ff00ff');
    var yellow = createColoredCanvas('#ffff00');
    var canvas = document.createElement('canvas');
    canvas.width = 6;
    canvas.height = 1;
    var context = canvas.getContext('2d');
    context.globalCompositeOperation = 'multiply';
    context.drawImage(magenta, 0, 0);
    context.drawImage(yellow, 2, 0);
    var imageData = context.getImageData(2, 0, 1, 1);
    if (!imageData) {
        return false;
    }
    var data = imageData.data;
    return data[0] === 255 && data[1] === 0 && data[2] === 0;
}
},{}],81:[function(require,module,exports){
'use strict';
exports.__esModule = true;
exports.default = mapCanvasBlendModesToPixi;
var _const = require('../../../const');
var _canUseNewCanvasBlendModes = require('./canUseNewCanvasBlendModes');
var _canUseNewCanvasBlendModes2 = _interopRequireDefault(_canUseNewCanvasBlendModes);
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function mapCanvasBlendModesToPixi() {
    var array = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
    if ((0, _canUseNewCanvasBlendModes2.default)()) {
        array[_const.BLEND_MODES.NORMAL] = 'source-over';
        array[_const.BLEND_MODES.ADD] = 'lighter'; 
        array[_const.BLEND_MODES.MULTIPLY] = 'multiply';
        array[_const.BLEND_MODES.SCREEN] = 'screen';
        array[_const.BLEND_MODES.OVERLAY] = 'overlay';
        array[_const.BLEND_MODES.DARKEN] = 'darken';
        array[_const.BLEND_MODES.LIGHTEN] = 'lighten';
        array[_const.BLEND_MODES.COLOR_DODGE] = 'color-dodge';
        array[_const.BLEND_MODES.COLOR_BURN] = 'color-burn';
        array[_const.BLEND_MODES.HARD_LIGHT] = 'hard-light';
        array[_const.BLEND_MODES.SOFT_LIGHT] = 'soft-light';
        array[_const.BLEND_MODES.DIFFERENCE] = 'difference';
        array[_const.BLEND_MODES.EXCLUSION] = 'exclusion';
        array[_const.BLEND_MODES.HUE] = 'hue';
        array[_const.BLEND_MODES.SATURATION] = 'saturate';
        array[_const.BLEND_MODES.COLOR] = 'color';
        array[_const.BLEND_MODES.LUMINOSITY] = 'luminosity';
    } else {
        array[_const.BLEND_MODES.NORMAL] = 'source-over';
        array[_const.BLEND_MODES.ADD] = 'lighter'; 
        array[_const.BLEND_MODES.MULTIPLY] = 'source-over';
        array[_const.BLEND_MODES.SCREEN] = 'source-over';
        array[_const.BLEND_MODES.OVERLAY] = 'source-over';
        array[_const.BLEND_MODES.DARKEN] = 'source-over';
        array[_const.BLEND_MODES.LIGHTEN] = 'source-over';
        array[_const.BLEND_MODES.COLOR_DODGE] = 'source-over';
        array[_const.BLEND_MODES.COLOR_BURN] = 'source-over';
        array[_const.BLEND_MODES.HARD_LIGHT] = 'source-over';
        array[_const.BLEND_MODES.SOFT_LIGHT] = 'source-over';
        array[_const.BLEND_MODES.DIFFERENCE] = 'source-over';
        array[_const.BLEND_MODES.EXCLUSION] = 'source-over';
        array[_const.BLEND_MODES.HUE] = 'source-over';
        array[_const.BLEND_MODES.SATURATION] = 'source-over';
        array[_const.BLEND_MODES.COLOR] = 'source-over';
        array[_const.BLEND_MODES.LUMINOSITY] = 'source-over';
    }
    array[_const.BLEND_MODES.NORMAL_NPM] = array[_const.BLEND_MODES.NORMAL];
    array[_const.BLEND_MODES.ADD_NPM] = array[_const.BLEND_MODES.ADD];
    array[_const.BLEND_MODES.SCREEN_NPM] = array[_const.BLEND_MODES.SCREEN];
    return array;
}
},{"../../../const":46,"./canUseNewCanvasBlendModes":80}],82:[function(require,module,exports){
'use strict';
exports.__esModule = true;
var _const = require('../../const');
var _settings = require('../../settings');
var _settings2 = _interopRequireDefault(_settings);
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
var TextureGarbageCollector = function () {
    function TextureGarbageCollector(renderer) {
        _classCallCheck(this, TextureGarbageCollector);
        this.renderer = renderer;
        this.count = 0;
        this.checkCount = 0;
        this.maxIdle = _settings2.default.GC_MAX_IDLE;
        this.checkCountMax = _settings2.default.GC_MAX_CHECK_COUNT;
        this.mode = _settings2.default.GC_MODE;
    }
    TextureGarbageCollector.prototype.update = function update() {
        this.count++;
        if (this.mode === _const.GC_MODES.MANUAL) {
            return;
        }
        this.checkCount++;
        if (this.checkCount > this.checkCountMax) {
            this.checkCount = 0;
            this.run();
        }
    };
    TextureGarbageCollector.prototype.run = function run() {
        var tm = this.renderer.textureManager;
        var managedTextures = tm._managedTextures;
        var wasRemoved = false;
        for (var i = 0; i < managedTextures.length; i++) {
            var texture = managedTextures[i];
            if (!texture._glRenderTargets && this.count - texture.touched > this.maxIdle) {
                tm.destroyTexture(texture, true);
                managedTextures[i] = null;
                wasRemoved = true;
            }
        }
        if (wasRemoved) {
            var j = 0;
            for (var _i = 0; _i < managedTextures.length; _i++) {
                if (managedTextures[_i] !== null) {
                    managedTextures[j++] = managedTextures[_i];
                }
            }
            managedTextures.length = j;
        }
    };
    TextureGarbageCollector.prototype.unload = function unload(displayObject) {
        var tm = this.renderer.textureManager;
        if (displayObject._texture && displayObject._texture._glRenderTargets) {
            tm.destroyTexture(displayObject._texture, true);
        }
        for (var i = displayObject.children.length - 1; i >= 0; i--) {
            this.unload(displayObject.children[i]);
        }
    };
    return TextureGarbageCollector;
}();
exports.default = TextureGarbageCollector;
},{"../../const":46,"../../settings":101}],83:[function(require,module,exports){
'use strict';
exports.__esModule = true;
var _pixiGlCore = require('pixi-gl-core');
var _const = require('../../const');
var _RenderTarget = require('./utils/RenderTarget');
var _RenderTarget2 = _interopRequireDefault(_RenderTarget);
var _utils = require('../../utils');
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
var TextureManager = function () {
    function TextureManager(renderer) {
        _classCallCheck(this, TextureManager);
        this.renderer = renderer;
        this.gl = renderer.gl;
        this._managedTextures = [];
    }
    TextureManager.prototype.bindTexture = function bindTexture() {}
    ;
    TextureManager.prototype.getTexture = function getTexture() {}
    ;
    TextureManager.prototype.updateTexture = function updateTexture(texture, location) {
        var gl = this.gl;
        var isRenderTexture = !!texture._glRenderTargets;
        if (!texture.hasLoaded) {
            return null;
        }
        var boundTextures = this.renderer.boundTextures;
        if (location === undefined) {
            location = 0;
            for (var i = 0; i < boundTextures.length; ++i) {
                if (boundTextures[i] === texture) {
                    location = i;
                    break;
                }
            }
        }
        boundTextures[location] = texture;
        gl.activeTexture(gl.TEXTURE0 + location);
        var glTexture = texture._glTextures[this.renderer.CONTEXT_UID];
        if (!glTexture) {
            if (isRenderTexture) {
                var renderTarget = new _RenderTarget2.default(this.gl, texture.width, texture.height, texture.scaleMode, texture.resolution);
                renderTarget.resize(texture.width, texture.height);
                texture._glRenderTargets[this.renderer.CONTEXT_UID] = renderTarget;
                glTexture = renderTarget.texture;
            } else {
                glTexture = new _pixiGlCore.GLTexture(this.gl, null, null, null, null);
                glTexture.bind(location);
                glTexture.premultiplyAlpha = true;
                glTexture.upload(texture.source);
            }
            texture._glTextures[this.renderer.CONTEXT_UID] = glTexture;
            texture.on('update', this.updateTexture, this);
            texture.on('dispose', this.destroyTexture, this);
            this._managedTextures.push(texture);
            if (texture.isPowerOfTwo) {
                if (texture.mipmap) {
                    glTexture.enableMipmap();
                }
                if (texture.wrapMode === _const.WRAP_MODES.CLAMP) {
                    glTexture.enableWrapClamp();
                } else if (texture.wrapMode === _const.WRAP_MODES.REPEAT) {
                    glTexture.enableWrapRepeat();
                } else {
                    glTexture.enableWrapMirrorRepeat();
                }
            } else {
                glTexture.enableWrapClamp();
            }
            if (texture.scaleMode === _const.SCALE_MODES.NEAREST) {
                glTexture.enableNearestScaling();
            } else {
                glTexture.enableLinearScaling();
            }
        }
        else if (isRenderTexture) {
                texture._glRenderTargets[this.renderer.CONTEXT_UID].resize(texture.width, texture.height);
            } else {
                glTexture.upload(texture.source);
            }
        return glTexture;
    };
    TextureManager.prototype.destroyTexture = function destroyTexture(texture, skipRemove) {
        texture = texture.baseTexture || texture;
        if (!texture.hasLoaded) {
            return;
        }
        var uid = this.renderer.CONTEXT_UID;
        var glTextures = texture._glTextures;
        var glRenderTargets = texture._glRenderTargets;
        if (glTextures[uid]) {
            this.renderer.unbindTexture(texture);
            glTextures[uid].destroy();
            texture.off('update', this.updateTexture, this);
            texture.off('dispose', this.destroyTexture, this);
            delete glTextures[uid];
            if (!skipRemove) {
                var i = this._managedTextures.indexOf(texture);
                if (i !== -1) {
                    (0, _utils.removeItems)(this._managedTextures, i, 1);
                }
            }
        }
        if (glRenderTargets && glRenderTargets[uid]) {
            glRenderTargets[uid].destroy();
            delete glRenderTargets[uid];
        }
    };
    TextureManager.prototype.removeAll = function removeAll() {
        for (var i = 0; i < this._managedTextures.length; ++i) {
            var texture = this._managedTextures[i];
            if (texture._glTextures[this.renderer.CONTEXT_UID]) {
                delete texture._glTextures[this.renderer.CONTEXT_UID];
            }
        }
    };
    TextureManager.prototype.destroy = function destroy() {
        for (var i = 0; i < this._managedTextures.length; ++i) {
            var texture = this._managedTextures[i];
            this.destroyTexture(texture, true);
            texture.off('update', this.updateTexture, this);
            texture.off('dispose', this.destroyTexture, this);
        }
        this._managedTextures = null;
    };
    return TextureManager;
}();
exports.default = TextureManager;
},{"../../const":46,"../../utils":125,"./utils/RenderTarget":96,"pixi-gl-core":15}],84:[function(require,module,exports){
'use strict';
exports.__esModule = true;
var _SystemRenderer2 = require('../SystemRenderer');
var _SystemRenderer3 = _interopRequireDefault(_SystemRenderer2);
var _MaskManager = require('./managers/MaskManager');
var _MaskManager2 = _interopRequireDefault(_MaskManager);
var _StencilManager = require('./managers/StencilManager');
var _StencilManager2 = _interopRequireDefault(_StencilManager);
var _FilterManager = require('./managers/FilterManager');
var _FilterManager2 = _interopRequireDefault(_FilterManager);
var _RenderTarget = require('./utils/RenderTarget');
var _RenderTarget2 = _interopRequireDefault(_RenderTarget);
var _ObjectRenderer = require('./utils/ObjectRenderer');
var _ObjectRenderer2 = _interopRequireDefault(_ObjectRenderer);
var _TextureManager = require('./TextureManager');
var _TextureManager2 = _interopRequireDefault(_TextureManager);
var _BaseTexture = require('../../textures/BaseTexture');
var _BaseTexture2 = _interopRequireDefault(_BaseTexture);
var _TextureGarbageCollector = require('./TextureGarbageCollector');
var _TextureGarbageCollector2 = _interopRequireDefault(_TextureGarbageCollector);
var _WebGLState = require('./WebGLState');
var _WebGLState2 = _interopRequireDefault(_WebGLState);
var _mapWebGLDrawModesToPixi = require('./utils/mapWebGLDrawModesToPixi');
var _mapWebGLDrawModesToPixi2 = _interopRequireDefault(_mapWebGLDrawModesToPixi);
var _validateContext = require('./utils/validateContext');
var _validateContext2 = _interopRequireDefault(_validateContext);
var _utils = require('../../utils');
var _pixiGlCore = require('pixi-gl-core');
var _pixiGlCore2 = _interopRequireDefault(_pixiGlCore);
var _const = require('../../const');
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
var CONTEXT_UID = 0;
var WebGLRenderer = function (_SystemRenderer) {
    _inherits(WebGLRenderer, _SystemRenderer);
    function WebGLRenderer(options, arg2, arg3) {
        _classCallCheck(this, WebGLRenderer);
        var _this = _possibleConstructorReturn(this, _SystemRenderer.call(this, 'WebGL', options, arg2, arg3));
        _this.legacy = _this.options.legacy;
        if (_this.legacy) {
            _pixiGlCore2.default.VertexArrayObject.FORCE_NATIVE = true;
        }
        _this.type = _const.RENDERER_TYPE.WEBGL;
        _this.handleContextLost = _this.handleContextLost.bind(_this);
        _this.handleContextRestored = _this.handleContextRestored.bind(_this);
        _this.view.addEventListener('webglcontextlost', _this.handleContextLost, false);
        _this.view.addEventListener('webglcontextrestored', _this.handleContextRestored, false);
        _this._contextOptions = {
            alpha: _this.transparent,
            antialias: _this.options.antialias,
            premultipliedAlpha: _this.transparent && _this.transparent !== 'notMultiplied',
            stencil: true,
            preserveDrawingBuffer: _this.options.preserveDrawingBuffer,
            powerPreference: _this.options.powerPreference
        };
        _this._backgroundColorRgba[3] = _this.transparent ? 0 : 1;
        _this.maskManager = new _MaskManager2.default(_this);
        _this.stencilManager = new _StencilManager2.default(_this);
        _this.emptyRenderer = new _ObjectRenderer2.default(_this);
        _this.currentRenderer = _this.emptyRenderer;
        _this.textureManager = null;
        _this.filterManager = null;
        _this.initPlugins();
        if (_this.options.context) {
            (0, _validateContext2.default)(_this.options.context);
        }
        _this.gl = _this.options.context || _pixiGlCore2.default.createContext(_this.view, _this._contextOptions);
        _this.CONTEXT_UID = CONTEXT_UID++;
        _this.state = new _WebGLState2.default(_this.gl);
        _this.renderingToScreen = true;
        _this.boundTextures = null;
        _this._activeShader = null;
        _this._activeVao = null;
        _this._activeRenderTarget = null;
        _this._initContext();
        _this.drawModes = (0, _mapWebGLDrawModesToPixi2.default)(_this.gl);
        _this._nextTextureLocation = 0;
        _this.setBlendMode(0);
        return _this;
    }
    WebGLRenderer.prototype._initContext = function _initContext() {
        var gl = this.gl;
        if (gl.isContextLost() && gl.getExtension('WEBGL_lose_context')) {
            gl.getExtension('WEBGL_lose_context').restoreContext();
        }
        var maxTextures = gl.getParameter(gl.MAX_TEXTURE_IMAGE_UNITS);
        this._activeShader = null;
        this._activeVao = null;
        this.boundTextures = new Array(maxTextures);
        this.emptyTextures = new Array(maxTextures);
        this.textureManager = new _TextureManager2.default(this);
        this.filterManager = new _FilterManager2.default(this);
        this.textureGC = new _TextureGarbageCollector2.default(this);
        this.state.resetToDefault();
        this.rootRenderTarget = new _RenderTarget2.default(gl, this.width, this.height, null, this.resolution, true);
        this.rootRenderTarget.clearColor = this._backgroundColorRgba;
        this.bindRenderTarget(this.rootRenderTarget);
        var emptyGLTexture = new _pixiGlCore2.default.GLTexture.fromData(gl, null, 1, 1);
        var tempObj = { _glTextures: {} };
        tempObj._glTextures[this.CONTEXT_UID] = {};
        for (var i = 0; i < maxTextures; i++) {
            var empty = new _BaseTexture2.default();
            empty._glTextures[this.CONTEXT_UID] = emptyGLTexture;
            this.boundTextures[i] = tempObj;
            this.emptyTextures[i] = empty;
            this.bindTexture(null, i);
        }
        this.emit('context', gl);
        this.resize(this.screen.width, this.screen.height);
    };
    WebGLRenderer.prototype.render = function render(displayObject, renderTexture, clear, transform, skipUpdateTransform) {
        this.renderingToScreen = !renderTexture;
        this.emit('prerender');
        if (!this.gl || this.gl.isContextLost()) {
            return;
        }
        this._nextTextureLocation = 0;
        if (!renderTexture) {
            this._lastObjectRendered = displayObject;
        }
        if (!skipUpdateTransform) {
            var cacheParent = displayObject.parent;
            displayObject.parent = this._tempDisplayObjectParent;
            displayObject.updateTransform();
            displayObject.parent = cacheParent;
        }
        this.bindRenderTexture(renderTexture, transform);
        this.currentRenderer.start();
        if (clear !== undefined ? clear : this.clearBeforeRender) {
            this._activeRenderTarget.clear();
        }
        displayObject.renderWebGL(this);
        this.currentRenderer.flush();
        this.textureGC.update();
        this.emit('postrender');
    };
    WebGLRenderer.prototype.setObjectRenderer = function setObjectRenderer(objectRenderer) {
        if (this.currentRenderer === objectRenderer) {
            return;
        }
        this.currentRenderer.stop();
        this.currentRenderer = objectRenderer;
        this.currentRenderer.start();
    };
    WebGLRenderer.prototype.flush = function flush() {
        this.setObjectRenderer(this.emptyRenderer);
    };
    WebGLRenderer.prototype.resize = function resize(screenWidth, screenHeight) {
        _SystemRenderer3.default.prototype.resize.call(this, screenWidth, screenHeight);
        this.rootRenderTarget.resize(screenWidth, screenHeight);
        if (this._activeRenderTarget === this.rootRenderTarget) {
            this.rootRenderTarget.activate();
            if (this._activeShader) {
                this._activeShader.uniforms.projectionMatrix = this.rootRenderTarget.projectionMatrix.toArray(true);
            }
        }
    };
    WebGLRenderer.prototype.setBlendMode = function setBlendMode(blendMode) {
        this.state.setBlendMode(blendMode);
    };
    WebGLRenderer.prototype.clear = function clear(clearColor) {
        this._activeRenderTarget.clear(clearColor);
    };
    WebGLRenderer.prototype.setTransform = function setTransform(matrix) {
        this._activeRenderTarget.transform = matrix;
    };
    WebGLRenderer.prototype.clearRenderTexture = function clearRenderTexture(renderTexture, clearColor) {
        var baseTexture = renderTexture.baseTexture;
        var renderTarget = baseTexture._glRenderTargets[this.CONTEXT_UID];
        if (renderTarget) {
            renderTarget.clear(clearColor);
        }
        return this;
    };
    WebGLRenderer.prototype.bindRenderTexture = function bindRenderTexture(renderTexture, transform) {
        var renderTarget = void 0;
        if (renderTexture) {
            var baseTexture = renderTexture.baseTexture;
            if (!baseTexture._glRenderTargets[this.CONTEXT_UID]) {
                this.textureManager.updateTexture(baseTexture, 0);
            }
            this.unbindTexture(baseTexture);
            renderTarget = baseTexture._glRenderTargets[this.CONTEXT_UID];
            renderTarget.setFrame(renderTexture.frame);
        } else {
            renderTarget = this.rootRenderTarget;
        }
        renderTarget.transform = transform;
        this.bindRenderTarget(renderTarget);
        return this;
    };
    WebGLRenderer.prototype.bindRenderTarget = function bindRenderTarget(renderTarget) {
        if (renderTarget !== this._activeRenderTarget) {
            this._activeRenderTarget = renderTarget;
            renderTarget.activate();
            if (this._activeShader) {
                this._activeShader.uniforms.projectionMatrix = renderTarget.projectionMatrix.toArray(true);
            }
            this.stencilManager.setMaskStack(renderTarget.stencilMaskStack);
        }
        return this;
    };
    WebGLRenderer.prototype.bindShader = function bindShader(shader, autoProject) {
        if (this._activeShader !== shader) {
            this._activeShader = shader;
            shader.bind();
            if (autoProject !== false) {
                shader.uniforms.projectionMatrix = this._activeRenderTarget.projectionMatrix.toArray(true);
            }
        }
        return this;
    };
    WebGLRenderer.prototype.bindTexture = function bindTexture(texture, location, forceLocation) {
        texture = texture || this.emptyTextures[location];
        texture = texture.baseTexture || texture;
        texture.touched = this.textureGC.count;
        if (!forceLocation) {
            for (var i = 0; i < this.boundTextures.length; i++) {
                if (this.boundTextures[i] === texture) {
                    return i;
                }
            }
            if (location === undefined) {
                this._nextTextureLocation++;
                this._nextTextureLocation %= this.boundTextures.length;
                location = this.boundTextures.length - this._nextTextureLocation - 1;
            }
        } else {
            location = location || 0;
        }
        var gl = this.gl;
        var glTexture = texture._glTextures[this.CONTEXT_UID];
        if (!glTexture) {
            this.textureManager.updateTexture(texture, location);
        } else {
            this.boundTextures[location] = texture;
            gl.activeTexture(gl.TEXTURE0 + location);
            gl.bindTexture(gl.TEXTURE_2D, glTexture.texture);
        }
        return location;
    };
    WebGLRenderer.prototype.unbindTexture = function unbindTexture(texture) {
        var gl = this.gl;
        texture = texture.baseTexture || texture;
        for (var i = 0; i < this.boundTextures.length; i++) {
            if (this.boundTextures[i] === texture) {
                this.boundTextures[i] = this.emptyTextures[i];
                gl.activeTexture(gl.TEXTURE0 + i);
                gl.bindTexture(gl.TEXTURE_2D, this.emptyTextures[i]._glTextures[this.CONTEXT_UID].texture);
            }
        }
        return this;
    };
    WebGLRenderer.prototype.createVao = function createVao() {
        return new _pixiGlCore2.default.VertexArrayObject(this.gl, this.state.attribState);
    };
    WebGLRenderer.prototype.bindVao = function bindVao(vao) {
        if (this._activeVao === vao) {
            return this;
        }
        if (vao) {
            vao.bind();
        } else if (this._activeVao) {
            this._activeVao.unbind();
        }
        this._activeVao = vao;
        return this;
    };
    WebGLRenderer.prototype.reset = function reset() {
        this.setObjectRenderer(this.emptyRenderer);
        this.bindVao(null);
        this._activeShader = null;
        this._activeRenderTarget = this.rootRenderTarget;
        for (var i = 0; i < this.boundTextures.length; i++) {
            this.boundTextures[i] = this.emptyTextures[i];
        }
        this.rootRenderTarget.activate();
        this.state.resetToDefault();
        return this;
    };
    WebGLRenderer.prototype.handleContextLost = function handleContextLost(event) {
        event.preventDefault();
    };
    WebGLRenderer.prototype.handleContextRestored = function handleContextRestored() {
        this.textureManager.removeAll();
        this.filterManager.destroy(true);
        this._initContext();
    };
    WebGLRenderer.prototype.destroy = function destroy(removeView) {
        this.destroyPlugins();
        this.view.removeEventListener('webglcontextlost', this.handleContextLost);
        this.view.removeEventListener('webglcontextrestored', this.handleContextRestored);
        this.textureManager.destroy();
        _SystemRenderer.prototype.destroy.call(this, removeView);
        this.uid = 0;
        this.maskManager.destroy();
        this.stencilManager.destroy();
        this.filterManager.destroy();
        this.maskManager = null;
        this.filterManager = null;
        this.textureManager = null;
        this.currentRenderer = null;
        this.handleContextLost = null;
        this.handleContextRestored = null;
        this._contextOptions = null;
        this.gl.useProgram(null);
        if (this.gl.getExtension('WEBGL_lose_context')) {
            this.gl.getExtension('WEBGL_lose_context').loseContext();
        }
        this.gl = null;
    };
    return WebGLRenderer;
}(_SystemRenderer3.default);
exports.default = WebGLRenderer;
_utils.pluginTarget.mixin(WebGLRenderer);
},{"../../const":46,"../../textures/BaseTexture":112,"../../utils":125,"../SystemRenderer":76,"./TextureGarbageCollector":82,"./TextureManager":83,"./WebGLState":85,"./managers/FilterManager":90,"./managers/MaskManager":91,"./managers/StencilManager":92,"./utils/ObjectRenderer":94,"./utils/RenderTarget":96,"./utils/mapWebGLDrawModesToPixi":99,"./utils/validateContext":100,"pixi-gl-core":15}],85:[function(require,module,exports){
'use strict';
exports.__esModule = true;
var _mapWebGLBlendModesToPixi = require('./utils/mapWebGLBlendModesToPixi');
var _mapWebGLBlendModesToPixi2 = _interopRequireDefault(_mapWebGLBlendModesToPixi);
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
var BLEND = 0;
var DEPTH_TEST = 1;
var FRONT_FACE = 2;
var CULL_FACE = 3;
var BLEND_FUNC = 4;
var WebGLState = function () {
    function WebGLState(gl) {
        _classCallCheck(this, WebGLState);
        this.activeState = new Uint8Array(16);
        this.defaultState = new Uint8Array(16);
        this.defaultState[0] = 1;
        this.stackIndex = 0;
        this.stack = [];
        this.gl = gl;
        this.maxAttribs = gl.getParameter(gl.MAX_VERTEX_ATTRIBS);
        this.attribState = {
            tempAttribState: new Array(this.maxAttribs),
            attribState: new Array(this.maxAttribs)
        };
        this.blendModes = (0, _mapWebGLBlendModesToPixi2.default)(gl);
        this.nativeVaoExtension = gl.getExtension('OES_vertex_array_object') || gl.getExtension('MOZ_OES_vertex_array_object') || gl.getExtension('WEBKIT_OES_vertex_array_object');
    }
    WebGLState.prototype.push = function push() {
        var state = this.stack[this.stackIndex];
        if (!state) {
            state = this.stack[this.stackIndex] = new Uint8Array(16);
        }
        ++this.stackIndex;
        for (var i = 0; i < this.activeState.length; i++) {
            state[i] = this.activeState[i];
        }
    };
    WebGLState.prototype.pop = function pop() {
        var state = this.stack[--this.stackIndex];
        this.setState(state);
    };
    WebGLState.prototype.setState = function setState(state) {
        this.setBlend(state[BLEND]);
        this.setDepthTest(state[DEPTH_TEST]);
        this.setFrontFace(state[FRONT_FACE]);
        this.setCullFace(state[CULL_FACE]);
        this.setBlendMode(state[BLEND_FUNC]);
    };
    WebGLState.prototype.setBlend = function setBlend(value) {
        value = value ? 1 : 0;
        if (this.activeState[BLEND] === value) {
            return;
        }
        this.activeState[BLEND] = value;
        this.gl[value ? 'enable' : 'disable'](this.gl.BLEND);
    };
    WebGLState.prototype.setBlendMode = function setBlendMode(value) {
        if (value === this.activeState[BLEND_FUNC]) {
            return;
        }
        this.activeState[BLEND_FUNC] = value;
        var mode = this.blendModes[value];
        if (mode.length === 2) {
            this.gl.blendFunc(mode[0], mode[1]);
        } else {
            this.gl.blendFuncSeparate(mode[0], mode[1], mode[2], mode[3]);
        }
    };
    WebGLState.prototype.setDepthTest = function setDepthTest(value) {
        value = value ? 1 : 0;
        if (this.activeState[DEPTH_TEST] === value) {
            return;
        }
        this.activeState[DEPTH_TEST] = value;
        this.gl[value ? 'enable' : 'disable'](this.gl.DEPTH_TEST);
    };
    WebGLState.prototype.setCullFace = function setCullFace(value) {
        value = value ? 1 : 0;
        if (this.activeState[CULL_FACE] === value) {
            return;
        }
        this.activeState[CULL_FACE] = value;
        this.gl[value ? 'enable' : 'disable'](this.gl.CULL_FACE);
    };
    WebGLState.prototype.setFrontFace = function setFrontFace(value) {
        value = value ? 1 : 0;
        if (this.activeState[FRONT_FACE] === value) {
            return;
        }
        this.activeState[FRONT_FACE] = value;
        this.gl.frontFace(this.gl[value ? 'CW' : 'CCW']);
    };
    WebGLState.prototype.resetAttributes = function resetAttributes() {
        for (var i = 0; i < this.attribState.tempAttribState.length; i++) {
            this.attribState.tempAttribState[i] = 0;
        }
        for (var _i = 0; _i < this.attribState.attribState.length; _i++) {
            this.attribState.attribState[_i] = 0;
        }
        for (var _i2 = 1; _i2 < this.maxAttribs; _i2++) {
            this.gl.disableVertexAttribArray(_i2);
        }
    };
    WebGLState.prototype.resetToDefault = function resetToDefault() {
        if (this.nativeVaoExtension) {
            this.nativeVaoExtension.bindVertexArrayOES(null);
        }
        this.resetAttributes();
        for (var i = 0; i < this.activeState.length; ++i) {
            this.activeState[i] = 32;
        }
        this.gl.pixelStorei(this.gl.UNPACK_FLIP_Y_WEBGL, false);
        this.setState(this.defaultState);
    };
    return WebGLState;
}();
exports.default = WebGLState;
},{"./utils/mapWebGLBlendModesToPixi":98}],86:[function(require,module,exports){
'use strict';
exports.__esModule = true;
var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
var _extractUniformsFromSrc = require('./extractUniformsFromSrc');
var _extractUniformsFromSrc2 = _interopRequireDefault(_extractUniformsFromSrc);
var _utils = require('../../../utils');
var _const = require('../../../const');
var _settings = require('../../../settings');
var _settings2 = _interopRequireDefault(_settings);
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
var SOURCE_KEY_MAP = {};
var Filter = function () {
  function Filter(vertexSrc, fragmentSrc, uniforms) {
    _classCallCheck(this, Filter);
    this.vertexSrc = vertexSrc || Filter.defaultVertexSrc;
    this.fragmentSrc = fragmentSrc || Filter.defaultFragmentSrc;
    this._blendMode = _const.BLEND_MODES.NORMAL;
    this.uniformData = uniforms || (0, _extractUniformsFromSrc2.default)(this.vertexSrc, this.fragmentSrc, 'projectionMatrix|uSampler');
    this.uniforms = {};
    for (var i in this.uniformData) {
      this.uniforms[i] = this.uniformData[i].value;
      if (this.uniformData[i].type) {
        this.uniformData[i].type = this.uniformData[i].type.toLowerCase();
      }
    }
    this.glShaders = {};
    if (!SOURCE_KEY_MAP[this.vertexSrc + this.fragmentSrc]) {
      SOURCE_KEY_MAP[this.vertexSrc + this.fragmentSrc] = (0, _utils.uid)();
    }
    this.glShaderKey = SOURCE_KEY_MAP[this.vertexSrc + this.fragmentSrc];
    this.padding = 4;
    this.resolution = _settings2.default.FILTER_RESOLUTION;
    this.enabled = true;
    this.autoFit = true;
  }
  Filter.prototype.apply = function apply(filterManager, input, output, clear, currentState) 
  {
    filterManager.applyFilter(this, input, output, clear);
  };
  _createClass(Filter, [{
    key: 'blendMode',
    get: function get() {
      return this._blendMode;
    },
    set: function set(value) 
    {
      this._blendMode = value;
    }
  }], [{
    key: 'defaultVertexSrc',
    get: function get() {
      return ['attribute vec2 aVertexPosition;', 'attribute vec2 aTextureCoord;', 'uniform mat3 projectionMatrix;', 'uniform mat3 filterMatrix;', 'varying vec2 vTextureCoord;', 'varying vec2 vFilterCoord;', 'void main(void){', '   gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);', '   vFilterCoord = ( filterMatrix * vec3( aTextureCoord, 1.0)  ).xy;', '   vTextureCoord = aTextureCoord ;', '}'].join('\n');
    }
  }, {
    key: 'defaultFragmentSrc',
    get: function get() {
      return ['varying vec2 vTextureCoord;', 'varying vec2 vFilterCoord;', 'uniform sampler2D uSampler;', 'uniform sampler2D filterSampler;', 'void main(void){', '   vec4 masky = texture2D(filterSampler, vFilterCoord);', '   vec4 sample = texture2D(uSampler, vTextureCoord);', '   vec4 color;', '   if(mod(vFilterCoord.x, 1.0) > 0.5)', '   {', '     color = vec4(1.0, 0.0, 0.0, 1.0);', '   }', '   else', '   {', '     color = vec4(0.0, 1.0, 0.0, 1.0);', '   }',
      '   gl_FragColor = mix(sample, masky, 0.5);', '   gl_FragColor *= sample.a;', '}'].join('\n');
    }
  }]);
  return Filter;
}();
exports.default = Filter;
},{"../../../const":46,"../../../settings":101,"../../../utils":125,"./extractUniformsFromSrc":87}],87:[function(require,module,exports){
'use strict';
exports.__esModule = true;
exports.default = extractUniformsFromSrc;
var _pixiGlCore = require('pixi-gl-core');
var _pixiGlCore2 = _interopRequireDefault(_pixiGlCore);
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
var defaultValue = _pixiGlCore2.default.shader.defaultValue;
function extractUniformsFromSrc(vertexSrc, fragmentSrc, mask) {
    var vertUniforms = extractUniformsFromString(vertexSrc, mask);
    var fragUniforms = extractUniformsFromString(fragmentSrc, mask);
    return Object.assign(vertUniforms, fragUniforms);
}
function extractUniformsFromString(string) {
    var maskRegex = new RegExp('^(projectionMatrix|uSampler|filterArea|filterClamp)$');
    var uniforms = {};
    var nameSplit = void 0;
    var lines = string.replace(/\s+/g, ' ').split(/\s*;\s*/);
    for (var i = 0; i < lines.length; i++) {
        var line = lines[i].trim();
        if (line.indexOf('uniform') > -1) {
            var splitLine = line.split(' ');
            var type = splitLine[1];
            var name = splitLine[2];
            var size = 1;
            if (name.indexOf('[') > -1) {
                nameSplit = name.split(/\[|]/);
                name = nameSplit[0];
                size *= Number(nameSplit[1]);
            }
            if (!name.match(maskRegex)) {
                uniforms[name] = {
                    value: defaultValue(type, size),
                    name: name,
                    type: type
                };
            }
        }
    }
    return uniforms;
}
},{"pixi-gl-core":15}],88:[function(require,module,exports){
'use strict';
exports.__esModule = true;
exports.calculateScreenSpaceMatrix = calculateScreenSpaceMatrix;
exports.calculateNormalizedScreenSpaceMatrix = calculateNormalizedScreenSpaceMatrix;
exports.calculateSpriteMatrix = calculateSpriteMatrix;
var _math = require('../../../math');
function calculateScreenSpaceMatrix(outputMatrix, filterArea, textureSize) {
    var mappedMatrix = outputMatrix.identity();
    mappedMatrix.translate(filterArea.x / textureSize.width, filterArea.y / textureSize.height);
    mappedMatrix.scale(textureSize.width, textureSize.height);
    return mappedMatrix;
}
function calculateNormalizedScreenSpaceMatrix(outputMatrix, filterArea, textureSize) {
    var mappedMatrix = outputMatrix.identity();
    mappedMatrix.translate(filterArea.x / textureSize.width, filterArea.y / textureSize.height);
    var translateScaleX = textureSize.width / filterArea.width;
    var translateScaleY = textureSize.height / filterArea.height;
    mappedMatrix.scale(translateScaleX, translateScaleY);
    return mappedMatrix;
}
function calculateSpriteMatrix(outputMatrix, filterArea, textureSize, sprite) {
    var orig = sprite._texture.orig;
    var mappedMatrix = outputMatrix.set(textureSize.width, 0, 0, textureSize.height, filterArea.x, filterArea.y);
    var worldTransform = sprite.worldTransform.copy(_math.Matrix.TEMP_MATRIX);
    worldTransform.invert();
    mappedMatrix.prepend(worldTransform);
    mappedMatrix.scale(1.0 / orig.width, 1.0 / orig.height);
    mappedMatrix.translate(sprite.anchor.x, sprite.anchor.y);
    return mappedMatrix;
}
},{"../../../math":70}],89:[function(require,module,exports){
'use strict';
exports.__esModule = true;
var _Filter2 = require('../Filter');
var _Filter3 = _interopRequireDefault(_Filter2);
var _math = require('../../../../math');
var _path = require('path');
var _TextureMatrix = require('../../../../textures/TextureMatrix');
var _TextureMatrix2 = _interopRequireDefault(_TextureMatrix);
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
var SpriteMaskFilter = function (_Filter) {
    _inherits(SpriteMaskFilter, _Filter);
    function SpriteMaskFilter(sprite) {
        _classCallCheck(this, SpriteMaskFilter);
        var maskMatrix = new _math.Matrix();
        var _this = _possibleConstructorReturn(this, _Filter.call(this, 'attribute vec2 aVertexPosition;\nattribute vec2 aTextureCoord;\n\nuniform mat3 projectionMatrix;\nuniform mat3 otherMatrix;\n\nvarying vec2 vMaskCoord;\nvarying vec2 vTextureCoord;\n\nvoid main(void)\n{\n    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\n\n    vTextureCoord = aTextureCoord;\n    vMaskCoord = ( otherMatrix * vec3( aTextureCoord, 1.0)  ).xy;\n}\n', 'varying vec2 vMaskCoord;\nvarying vec2 vTextureCoord;\n\nuniform sampler2D uSampler;\nuniform sampler2D mask;\nuniform float alpha;\nuniform vec4 maskClamp;\n\nvoid main(void)\n{\n    float clip = step(3.5,\n        step(maskClamp.x, vMaskCoord.x) +\n        step(maskClamp.y, vMaskCoord.y) +\n        step(vMaskCoord.x, maskClamp.z) +\n        step(vMaskCoord.y, maskClamp.w));\n\n    vec4 original = texture2D(uSampler, vTextureCoord);\n    vec4 masky = texture2D(mask, vMaskCoord);\n\n    original *= (masky.r * masky.a * alpha * clip);\n\n    gl_FragColor = original;\n}\n'));
        sprite.renderable = false;
        _this.maskSprite = sprite;
        _this.maskMatrix = maskMatrix;
        return _this;
    }
    SpriteMaskFilter.prototype.apply = function apply(filterManager, input, output) {
        var maskSprite = this.maskSprite;
        var tex = this.maskSprite.texture;
        if (!tex.valid) {
            return;
        }
        if (!tex.transform) {
            tex.transform = new _TextureMatrix2.default(tex, 0.0);
        }
        tex.transform.update();
        this.uniforms.mask = tex;
        this.uniforms.otherMatrix = filterManager.calculateSpriteMatrix(this.maskMatrix, maskSprite).prepend(tex.transform.mapCoord);
        this.uniforms.alpha = maskSprite.worldAlpha;
        this.uniforms.maskClamp = tex.transform.uClampFrame;
        filterManager.applyFilter(this, input, output);
    };
    return SpriteMaskFilter;
}(_Filter3.default);
exports.default = SpriteMaskFilter;
},{"../../../../math":70,"../../../../textures/TextureMatrix":116,"../Filter":86,"path":8}],90:[function(require,module,exports){
'use strict';
exports.__esModule = true;
var _WebGLManager2 = require('./WebGLManager');
var _WebGLManager3 = _interopRequireDefault(_WebGLManager2);
var _RenderTarget = require('../utils/RenderTarget');
var _RenderTarget2 = _interopRequireDefault(_RenderTarget);
var _Quad = require('../utils/Quad');
var _Quad2 = _interopRequireDefault(_Quad);
var _math = require('../../../math');
var _Shader = require('../../../Shader');
var _Shader2 = _interopRequireDefault(_Shader);
var _filterTransforms = require('../filters/filterTransforms');
var filterTransforms = _interopRequireWildcard(_filterTransforms);
var _bitTwiddle = require('bit-twiddle');
var _bitTwiddle2 = _interopRequireDefault(_bitTwiddle);
function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
var FilterState = function () {
    function FilterState() {
        _classCallCheck(this, FilterState);
        this.renderTarget = null;
        this.target = null;
        this.resolution = 1;
        this.sourceFrame = new _math.Rectangle();
        this.destinationFrame = new _math.Rectangle();
        this.filters = [];
    }
    FilterState.prototype.clear = function clear() {
        this.filters = null;
        this.target = null;
        this.renderTarget = null;
    };
    return FilterState;
}();
var screenKey = 'screen';
var FilterManager = function (_WebGLManager) {
    _inherits(FilterManager, _WebGLManager);
    function FilterManager(renderer) {
        _classCallCheck(this, FilterManager);
        var _this = _possibleConstructorReturn(this, _WebGLManager.call(this, renderer));
        _this.gl = _this.renderer.gl;
        _this.quad = new _Quad2.default(_this.gl, renderer.state.attribState);
        _this.shaderCache = {};
        _this.pool = {};
        _this.filterData = null;
        _this.managedFilters = [];
        _this.renderer.on('prerender', _this.onPrerender, _this);
        _this._screenWidth = renderer.view.width;
        _this._screenHeight = renderer.view.height;
        return _this;
    }
    FilterManager.prototype.pushFilter = function pushFilter(target, filters) {
        var renderer = this.renderer;
        var filterData = this.filterData;
        if (!filterData) {
            filterData = this.renderer._activeRenderTarget.filterStack;
            var filterState = new FilterState();
            filterState.sourceFrame = filterState.destinationFrame = this.renderer._activeRenderTarget.size;
            filterState.renderTarget = renderer._activeRenderTarget;
            this.renderer._activeRenderTarget.filterData = filterData = {
                index: 0,
                stack: [filterState]
            };
            this.filterData = filterData;
        }
        var currentState = filterData.stack[++filterData.index];
        var renderTargetFrame = filterData.stack[0].destinationFrame;
        if (!currentState) {
            currentState = filterData.stack[filterData.index] = new FilterState();
        }
        var fullScreen = target.filterArea && target.filterArea.x === 0 && target.filterArea.y === 0 && target.filterArea.width === renderer.screen.width && target.filterArea.height === renderer.screen.height;
        var resolution = filters[0].resolution;
        var padding = filters[0].padding | 0;
        var targetBounds = fullScreen ? renderer.screen : target.filterArea || target.getBounds(true);
        var sourceFrame = currentState.sourceFrame;
        var destinationFrame = currentState.destinationFrame;
        sourceFrame.x = (targetBounds.x * resolution | 0) / resolution;
        sourceFrame.y = (targetBounds.y * resolution | 0) / resolution;
        sourceFrame.width = (targetBounds.width * resolution | 0) / resolution;
        sourceFrame.height = (targetBounds.height * resolution | 0) / resolution;
        if (!fullScreen) {
            if (filterData.stack[0].renderTarget.transform) {
            } else if (filters[0].autoFit) {
                sourceFrame.fit(renderTargetFrame);
            }
            sourceFrame.pad(padding);
        }
        destinationFrame.width = sourceFrame.width;
        destinationFrame.height = sourceFrame.height;
        var renderTarget = this.getPotRenderTarget(renderer.gl, sourceFrame.width, sourceFrame.height, resolution);
        currentState.target = target;
        currentState.filters = filters;
        currentState.resolution = resolution;
        currentState.renderTarget = renderTarget;
        renderTarget.setFrame(destinationFrame, sourceFrame);
        renderer.bindRenderTarget(renderTarget);
        renderTarget.clear();
    };
    FilterManager.prototype.popFilter = function popFilter() {
        var filterData = this.filterData;
        var lastState = filterData.stack[filterData.index - 1];
        var currentState = filterData.stack[filterData.index];
        this.quad.map(currentState.renderTarget.size, currentState.sourceFrame).upload();
        var filters = currentState.filters;
        if (filters.length === 1) {
            filters[0].apply(this, currentState.renderTarget, lastState.renderTarget, false, currentState);
            this.freePotRenderTarget(currentState.renderTarget);
        } else {
            var flip = currentState.renderTarget;
            var flop = this.getPotRenderTarget(this.renderer.gl, currentState.sourceFrame.width, currentState.sourceFrame.height, currentState.resolution);
            flop.setFrame(currentState.destinationFrame, currentState.sourceFrame);
            flop.clear();
            var i = 0;
            for (i = 0; i < filters.length - 1; ++i) {
                filters[i].apply(this, flip, flop, true, currentState);
                var t = flip;
                flip = flop;
                flop = t;
            }
            filters[i].apply(this, flip, lastState.renderTarget, false, currentState);
            this.freePotRenderTarget(flip);
            this.freePotRenderTarget(flop);
        }
        currentState.clear();
        filterData.index--;
        if (filterData.index === 0) {
            this.filterData = null;
        }
    };
    FilterManager.prototype.applyFilter = function applyFilter(filter, input, output, clear) {
        var renderer = this.renderer;
        var gl = renderer.gl;
        var shader = filter.glShaders[renderer.CONTEXT_UID];
        if (!shader) {
            if (filter.glShaderKey) {
                shader = this.shaderCache[filter.glShaderKey];
                if (!shader) {
                    shader = new _Shader2.default(this.gl, filter.vertexSrc, filter.fragmentSrc);
                    filter.glShaders[renderer.CONTEXT_UID] = this.shaderCache[filter.glShaderKey] = shader;
                    this.managedFilters.push(filter);
                }
            } else {
                shader = filter.glShaders[renderer.CONTEXT_UID] = new _Shader2.default(this.gl, filter.vertexSrc, filter.fragmentSrc);
                this.managedFilters.push(filter);
            }
            renderer.bindVao(null);
            this.quad.initVao(shader);
        }
        renderer.bindVao(this.quad.vao);
        renderer.bindRenderTarget(output);
        if (clear) {
            gl.disable(gl.SCISSOR_TEST);
            renderer.clear(); 
            gl.enable(gl.SCISSOR_TEST);
        }
        if (output === renderer.maskManager.scissorRenderTarget) {
            renderer.maskManager.pushScissorMask(null, renderer.maskManager.scissorData);
        }
        renderer.bindShader(shader);
        var tex = this.renderer.emptyTextures[0];
        this.renderer.boundTextures[0] = tex;
        this.syncUniforms(shader, filter);
        renderer.state.setBlendMode(filter.blendMode);
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, input.texture.texture);
        this.quad.vao.draw(this.renderer.gl.TRIANGLES, 6, 0);
        gl.bindTexture(gl.TEXTURE_2D, tex._glTextures[this.renderer.CONTEXT_UID].texture);
    };
    FilterManager.prototype.syncUniforms = function syncUniforms(shader, filter) {
        var uniformData = filter.uniformData;
        var uniforms = filter.uniforms;
        var textureCount = 1;
        var currentState = void 0;
        if (shader.uniforms.filterArea) {
            currentState = this.filterData.stack[this.filterData.index];
            var filterArea = shader.uniforms.filterArea;
            filterArea[0] = currentState.renderTarget.size.width;
            filterArea[1] = currentState.renderTarget.size.height;
            filterArea[2] = currentState.sourceFrame.x;
            filterArea[3] = currentState.sourceFrame.y;
            shader.uniforms.filterArea = filterArea;
        }
        if (shader.uniforms.filterClamp) {
            currentState = currentState || this.filterData.stack[this.filterData.index];
            var filterClamp = shader.uniforms.filterClamp;
            filterClamp[0] = 0;
            filterClamp[1] = 0;
            filterClamp[2] = (currentState.sourceFrame.width - 1) / currentState.renderTarget.size.width;
            filterClamp[3] = (currentState.sourceFrame.height - 1) / currentState.renderTarget.size.height;
            shader.uniforms.filterClamp = filterClamp;
        }
        for (var i in uniformData) {
            var type = uniformData[i].type;
            if (type === 'sampler2d' && uniforms[i] !== 0) {
                if (uniforms[i].baseTexture) {
                    shader.uniforms[i] = this.renderer.bindTexture(uniforms[i].baseTexture, textureCount);
                } else {
                    shader.uniforms[i] = textureCount;
                    var gl = this.renderer.gl;
                    this.renderer.boundTextures[textureCount] = this.renderer.emptyTextures[textureCount];
                    gl.activeTexture(gl.TEXTURE0 + textureCount);
                    uniforms[i].texture.bind();
                }
                textureCount++;
            } else if (type === 'mat3') {
                if (uniforms[i].a !== undefined) {
                    shader.uniforms[i] = uniforms[i].toArray(true);
                } else {
                    shader.uniforms[i] = uniforms[i];
                }
            } else if (type === 'vec2') {
                if (uniforms[i].x !== undefined) {
                    var val = shader.uniforms[i] || new Float32Array(2);
                    val[0] = uniforms[i].x;
                    val[1] = uniforms[i].y;
                    shader.uniforms[i] = val;
                } else {
                    shader.uniforms[i] = uniforms[i];
                }
            } else if (type === 'float') {
                if (shader.uniforms.data[i].value !== uniformData[i]) {
                    shader.uniforms[i] = uniforms[i];
                }
            } else {
                shader.uniforms[i] = uniforms[i];
            }
        }
    };
    FilterManager.prototype.getRenderTarget = function getRenderTarget(clear, resolution) {
        var currentState = this.filterData.stack[this.filterData.index];
        var renderTarget = this.getPotRenderTarget(this.renderer.gl, currentState.sourceFrame.width, currentState.sourceFrame.height, resolution || currentState.resolution);
        renderTarget.setFrame(currentState.destinationFrame, currentState.sourceFrame);
        return renderTarget;
    };
    FilterManager.prototype.returnRenderTarget = function returnRenderTarget(renderTarget) {
        this.freePotRenderTarget(renderTarget);
    };
    FilterManager.prototype.calculateScreenSpaceMatrix = function calculateScreenSpaceMatrix(outputMatrix) {
        var currentState = this.filterData.stack[this.filterData.index];
        return filterTransforms.calculateScreenSpaceMatrix(outputMatrix, currentState.sourceFrame, currentState.renderTarget.size);
    };
    FilterManager.prototype.calculateNormalizedScreenSpaceMatrix = function calculateNormalizedScreenSpaceMatrix(outputMatrix) {
        var currentState = this.filterData.stack[this.filterData.index];
        return filterTransforms.calculateNormalizedScreenSpaceMatrix(outputMatrix, currentState.sourceFrame, currentState.renderTarget.size, currentState.destinationFrame);
    };
    FilterManager.prototype.calculateSpriteMatrix = function calculateSpriteMatrix(outputMatrix, sprite) {
        var currentState = this.filterData.stack[this.filterData.index];
        return filterTransforms.calculateSpriteMatrix(outputMatrix, currentState.sourceFrame, currentState.renderTarget.size, sprite);
    };
    FilterManager.prototype.destroy = function destroy() {
        var contextLost = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
        var renderer = this.renderer;
        var filters = this.managedFilters;
        renderer.off('prerender', this.onPrerender, this);
        for (var i = 0; i < filters.length; i++) {
            if (!contextLost) {
                filters[i].glShaders[renderer.CONTEXT_UID].destroy();
            }
            delete filters[i].glShaders[renderer.CONTEXT_UID];
        }
        this.shaderCache = {};
        if (!contextLost) {
            this.emptyPool();
        } else {
            this.pool = {};
        }
    };
    FilterManager.prototype.getPotRenderTarget = function getPotRenderTarget(gl, minWidth, minHeight, resolution) {
        var key = screenKey;
        minWidth *= resolution;
        minHeight *= resolution;
        if (minWidth !== this._screenWidth || minHeight !== this._screenHeight) {
            minWidth = _bitTwiddle2.default.nextPow2(minWidth);
            minHeight = _bitTwiddle2.default.nextPow2(minHeight);
            key = (minWidth & 0xFFFF) << 16 | minHeight & 0xFFFF;
        }
        if (!this.pool[key]) {
            this.pool[key] = [];
        }
        var renderTarget = this.pool[key].pop();
        if (!renderTarget) {
            var tex = this.renderer.boundTextures[0];
            gl.activeTexture(gl.TEXTURE0);
            renderTarget = new _RenderTarget2.default(gl, minWidth, minHeight, null, 1);
            gl.bindTexture(gl.TEXTURE_2D, tex._glTextures[this.renderer.CONTEXT_UID].texture);
        }
        renderTarget.resolution = resolution;
        renderTarget.defaultFrame.width = renderTarget.size.width = minWidth / resolution;
        renderTarget.defaultFrame.height = renderTarget.size.height = minHeight / resolution;
        renderTarget.filterPoolKey = key;
        return renderTarget;
    };
    FilterManager.prototype.emptyPool = function emptyPool() {
        for (var i in this.pool) {
            var textures = this.pool[i];
            if (textures) {
                for (var j = 0; j < textures.length; j++) {
                    textures[j].destroy(true);
                }
            }
        }
        this.pool = {};
    };
    FilterManager.prototype.freePotRenderTarget = function freePotRenderTarget(renderTarget) {
        this.pool[renderTarget.filterPoolKey].push(renderTarget);
    };
    FilterManager.prototype.onPrerender = function onPrerender() {
        if (this._screenWidth !== this.renderer.view.width || this._screenHeight !== this.renderer.view.height) {
            this._screenWidth = this.renderer.view.width;
            this._screenHeight = this.renderer.view.height;
            var textures = this.pool[screenKey];
            if (textures) {
                for (var j = 0; j < textures.length; j++) {
                    textures[j].destroy(true);
                }
            }
            this.pool[screenKey] = [];
        }
    };
    return FilterManager;
}(_WebGLManager3.default);
exports.default = FilterManager;
},{"../../../Shader":44,"../../../math":70,"../filters/filterTransforms":88,"../utils/Quad":95,"../utils/RenderTarget":96,"./WebGLManager":93,"bit-twiddle":1}],91:[function(require,module,exports){
'use strict';
exports.__esModule = true;
var _WebGLManager2 = require('./WebGLManager');
var _WebGLManager3 = _interopRequireDefault(_WebGLManager2);
var _SpriteMaskFilter = require('../filters/spriteMask/SpriteMaskFilter');
var _SpriteMaskFilter2 = _interopRequireDefault(_SpriteMaskFilter);
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
var MaskManager = function (_WebGLManager) {
    _inherits(MaskManager, _WebGLManager);
    function MaskManager(renderer) {
        _classCallCheck(this, MaskManager);
        var _this = _possibleConstructorReturn(this, _WebGLManager.call(this, renderer));
        _this.scissor = false;
        _this.scissorData = null;
        _this.scissorRenderTarget = null;
        _this.enableScissor = true;
        _this.alphaMaskPool = [];
        _this.alphaMaskIndex = 0;
        return _this;
    }
    MaskManager.prototype.pushMask = function pushMask(target, maskData) {
        if (maskData.texture) {
            this.pushSpriteMask(target, maskData);
        } else if (this.enableScissor && !this.scissor && this.renderer._activeRenderTarget.root && !this.renderer.stencilManager.stencilMaskStack.length && maskData.isFastRect()) {
            var matrix = maskData.worldTransform;
            var rot = Math.atan2(matrix.b, matrix.a);
            rot = Math.round(rot * (180 / Math.PI));
            if (rot % 90) {
                this.pushStencilMask(maskData);
            } else {
                this.pushScissorMask(target, maskData);
            }
        } else {
            this.pushStencilMask(maskData);
        }
    };
    MaskManager.prototype.popMask = function popMask(target, maskData) {
        if (maskData.texture) {
            this.popSpriteMask(target, maskData);
        } else if (this.enableScissor && !this.renderer.stencilManager.stencilMaskStack.length) {
            this.popScissorMask(target, maskData);
        } else {
            this.popStencilMask(target, maskData);
        }
    };
    MaskManager.prototype.pushSpriteMask = function pushSpriteMask(target, maskData) {
        var alphaMaskFilter = this.alphaMaskPool[this.alphaMaskIndex];
        if (!alphaMaskFilter) {
            alphaMaskFilter = this.alphaMaskPool[this.alphaMaskIndex] = [new _SpriteMaskFilter2.default(maskData)];
        }
        alphaMaskFilter[0].resolution = this.renderer.resolution;
        alphaMaskFilter[0].maskSprite = maskData;
        target.filterArea = maskData.getBounds(true);
        this.renderer.filterManager.pushFilter(target, alphaMaskFilter);
        this.alphaMaskIndex++;
    };
    MaskManager.prototype.popSpriteMask = function popSpriteMask() {
        this.renderer.filterManager.popFilter();
        this.alphaMaskIndex--;
    };
    MaskManager.prototype.pushStencilMask = function pushStencilMask(maskData) {
        this.renderer.currentRenderer.stop();
        this.renderer.stencilManager.pushStencil(maskData);
    };
    MaskManager.prototype.popStencilMask = function popStencilMask() {
        this.renderer.currentRenderer.stop();
        this.renderer.stencilManager.popStencil();
    };
    MaskManager.prototype.pushScissorMask = function pushScissorMask(target, maskData) {
        maskData.renderable = true;
        var renderTarget = this.renderer._activeRenderTarget;
        var bounds = maskData.getBounds();
        bounds.fit(renderTarget.size);
        maskData.renderable = false;
        this.renderer.gl.enable(this.renderer.gl.SCISSOR_TEST);
        var resolution = this.renderer.resolution;
        this.renderer.gl.scissor(bounds.x * resolution, (renderTarget.root ? renderTarget.size.height - bounds.y - bounds.height : bounds.y) * resolution, bounds.width * resolution, bounds.height * resolution);
        this.scissorRenderTarget = renderTarget;
        this.scissorData = maskData;
        this.scissor = true;
    };
    MaskManager.prototype.popScissorMask = function popScissorMask() {
        this.scissorRenderTarget = null;
        this.scissorData = null;
        this.scissor = false;
        var gl = this.renderer.gl;
        gl.disable(gl.SCISSOR_TEST);
    };
    return MaskManager;
}(_WebGLManager3.default);
exports.default = MaskManager;
},{"../filters/spriteMask/SpriteMaskFilter":89,"./WebGLManager":93}],92:[function(require,module,exports){
'use strict';
exports.__esModule = true;
var _WebGLManager2 = require('./WebGLManager');
var _WebGLManager3 = _interopRequireDefault(_WebGLManager2);
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
var StencilManager = function (_WebGLManager) {
    _inherits(StencilManager, _WebGLManager);
    function StencilManager(renderer) {
        _classCallCheck(this, StencilManager);
        var _this = _possibleConstructorReturn(this, _WebGLManager.call(this, renderer));
        _this.stencilMaskStack = null;
        return _this;
    }
    StencilManager.prototype.setMaskStack = function setMaskStack(stencilMaskStack) {
        this.stencilMaskStack = stencilMaskStack;
        var gl = this.renderer.gl;
        if (stencilMaskStack.length === 0) {
            gl.disable(gl.STENCIL_TEST);
        } else {
            gl.enable(gl.STENCIL_TEST);
        }
    };
    StencilManager.prototype.pushStencil = function pushStencil(graphics) {
        this.renderer.setObjectRenderer(this.renderer.plugins.graphics);
        this.renderer._activeRenderTarget.attachStencilBuffer();
        var gl = this.renderer.gl;
        var prevMaskCount = this.stencilMaskStack.length;
        if (prevMaskCount === 0) {
            gl.enable(gl.STENCIL_TEST);
        }
        this.stencilMaskStack.push(graphics);
        gl.colorMask(false, false, false, false);
        gl.stencilFunc(gl.EQUAL, prevMaskCount, this._getBitwiseMask());
        gl.stencilOp(gl.KEEP, gl.KEEP, gl.INCR);
        this.renderer.plugins.graphics.render(graphics);
        this._useCurrent();
    };
    StencilManager.prototype.popStencil = function popStencil() {
        this.renderer.setObjectRenderer(this.renderer.plugins.graphics);
        var gl = this.renderer.gl;
        var graphics = this.stencilMaskStack.pop();
        if (this.stencilMaskStack.length === 0) {
            gl.disable(gl.STENCIL_TEST);
            gl.clear(gl.STENCIL_BUFFER_BIT);
            gl.clearStencil(0);
        } else {
            gl.colorMask(false, false, false, false);
            gl.stencilOp(gl.KEEP, gl.KEEP, gl.DECR);
            this.renderer.plugins.graphics.render(graphics);
            this._useCurrent();
        }
    };
    StencilManager.prototype._useCurrent = function _useCurrent() {
        var gl = this.renderer.gl;
        gl.colorMask(true, true, true, true);
        gl.stencilFunc(gl.EQUAL, this.stencilMaskStack.length, this._getBitwiseMask());
        gl.stencilOp(gl.KEEP, gl.KEEP, gl.KEEP);
    };
    StencilManager.prototype._getBitwiseMask = function _getBitwiseMask() {
        return (1 << this.stencilMaskStack.length) - 1;
    };
    StencilManager.prototype.destroy = function destroy() {
        _WebGLManager3.default.prototype.destroy.call(this);
        this.stencilMaskStack.stencilStack = null;
    };
    return StencilManager;
}(_WebGLManager3.default);
exports.default = StencilManager;
},{"./WebGLManager":93}],93:[function(require,module,exports){
'use strict';
exports.__esModule = true;
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
var WebGLManager = function () {
  function WebGLManager(renderer) {
    _classCallCheck(this, WebGLManager);
    this.renderer = renderer;
    this.renderer.on('context', this.onContextChange, this);
  }
  WebGLManager.prototype.onContextChange = function onContextChange() {}
  ;
  WebGLManager.prototype.destroy = function destroy() {
    this.renderer.off('context', this.onContextChange, this);
    this.renderer = null;
  };
  return WebGLManager;
}();
exports.default = WebGLManager;
},{}],94:[function(require,module,exports){
'use strict';
exports.__esModule = true;
var _WebGLManager2 = require('../managers/WebGLManager');
var _WebGLManager3 = _interopRequireDefault(_WebGLManager2);
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
var ObjectRenderer = function (_WebGLManager) {
  _inherits(ObjectRenderer, _WebGLManager);
  function ObjectRenderer() {
    _classCallCheck(this, ObjectRenderer);
    return _possibleConstructorReturn(this, _WebGLManager.apply(this, arguments));
  }
  ObjectRenderer.prototype.start = function start() {}
  ;
  ObjectRenderer.prototype.stop = function stop() {
    this.flush();
  };
  ObjectRenderer.prototype.flush = function flush() {}
  ;
  ObjectRenderer.prototype.render = function render(object) 
  {
  };
  return ObjectRenderer;
}(_WebGLManager3.default);
exports.default = ObjectRenderer;
},{"../managers/WebGLManager":93}],95:[function(require,module,exports){
'use strict';
exports.__esModule = true;
var _pixiGlCore = require('pixi-gl-core');
var _pixiGlCore2 = _interopRequireDefault(_pixiGlCore);
var _createIndicesForQuads = require('../../../utils/createIndicesForQuads');
var _createIndicesForQuads2 = _interopRequireDefault(_createIndicesForQuads);
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
var Quad = function () {
  function Quad(gl, state) {
    _classCallCheck(this, Quad);
    this.gl = gl;
    this.vertices = new Float32Array([-1, -1, 1, -1, 1, 1, -1, 1]);
    this.uvs = new Float32Array([0, 0, 1, 0, 1, 1, 0, 1]);
    this.interleaved = new Float32Array(8 * 2);
    for (var i = 0; i < 4; i++) {
      this.interleaved[i * 4] = this.vertices[i * 2];
      this.interleaved[i * 4 + 1] = this.vertices[i * 2 + 1];
      this.interleaved[i * 4 + 2] = this.uvs[i * 2];
      this.interleaved[i * 4 + 3] = this.uvs[i * 2 + 1];
    }
    this.indices = (0, _createIndicesForQuads2.default)(1);
    this.vertexBuffer = _pixiGlCore2.default.GLBuffer.createVertexBuffer(gl, this.interleaved, gl.STATIC_DRAW);
    this.indexBuffer = _pixiGlCore2.default.GLBuffer.createIndexBuffer(gl, this.indices, gl.STATIC_DRAW);
    this.vao = new _pixiGlCore2.default.VertexArrayObject(gl, state);
  }
  Quad.prototype.initVao = function initVao(shader) {
    this.vao.clear().addIndex(this.indexBuffer).addAttribute(this.vertexBuffer, shader.attributes.aVertexPosition, this.gl.FLOAT, false, 4 * 4, 0).addAttribute(this.vertexBuffer, shader.attributes.aTextureCoord, this.gl.FLOAT, false, 4 * 4, 2 * 4);
  };
  Quad.prototype.map = function map(targetTextureFrame, destinationFrame) {
    var x = 0; 
    var y = 0; 
    this.uvs[0] = x;
    this.uvs[1] = y;
    this.uvs[2] = x + destinationFrame.width / targetTextureFrame.width;
    this.uvs[3] = y;
    this.uvs[4] = x + destinationFrame.width / targetTextureFrame.width;
    this.uvs[5] = y + destinationFrame.height / targetTextureFrame.height;
    this.uvs[6] = x;
    this.uvs[7] = y + destinationFrame.height / targetTextureFrame.height;
    x = destinationFrame.x;
    y = destinationFrame.y;
    this.vertices[0] = x;
    this.vertices[1] = y;
    this.vertices[2] = x + destinationFrame.width;
    this.vertices[3] = y;
    this.vertices[4] = x + destinationFrame.width;
    this.vertices[5] = y + destinationFrame.height;
    this.vertices[6] = x;
    this.vertices[7] = y + destinationFrame.height;
    return this;
  };
  Quad.prototype.upload = function upload() {
    for (var i = 0; i < 4; i++) {
      this.interleaved[i * 4] = this.vertices[i * 2];
      this.interleaved[i * 4 + 1] = this.vertices[i * 2 + 1];
      this.interleaved[i * 4 + 2] = this.uvs[i * 2];
      this.interleaved[i * 4 + 3] = this.uvs[i * 2 + 1];
    }
    this.vertexBuffer.upload(this.interleaved);
    return this;
  };
  Quad.prototype.destroy = function destroy() {
    var gl = this.gl;
    gl.deleteBuffer(this.vertexBuffer);
    gl.deleteBuffer(this.indexBuffer);
  };
  return Quad;
}();
exports.default = Quad;
},{"../../../utils/createIndicesForQuads":123,"pixi-gl-core":15}],96:[function(require,module,exports){
'use strict';
exports.__esModule = true;
var _math = require('../../../math');
var _const = require('../../../const');
var _settings = require('../../../settings');
var _settings2 = _interopRequireDefault(_settings);
var _pixiGlCore = require('pixi-gl-core');
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
var RenderTarget = function () {
  function RenderTarget(gl, width, height, scaleMode, resolution, root) {
    _classCallCheck(this, RenderTarget);
    this.gl = gl;
    this.frameBuffer = null;
    this.texture = null;
    this.clearColor = [0, 0, 0, 0];
    this.size = new _math.Rectangle(0, 0, 1, 1);
    this.resolution = resolution || _settings2.default.RESOLUTION;
    this.projectionMatrix = new _math.Matrix();
    this.transform = null;
    this.frame = null;
    this.defaultFrame = new _math.Rectangle();
    this.destinationFrame = null;
    this.sourceFrame = null;
    this.stencilBuffer = null;
    this.stencilMaskStack = [];
    this.filterData = null;
    this.filterPoolKey = '';
    this.scaleMode = scaleMode !== undefined ? scaleMode : _settings2.default.SCALE_MODE;
    this.root = root;
    if (!this.root) {
      this.frameBuffer = _pixiGlCore.GLFramebuffer.createRGBA(gl, 100, 100);
      if (this.scaleMode === _const.SCALE_MODES.NEAREST) {
        this.frameBuffer.texture.enableNearestScaling();
      } else {
        this.frameBuffer.texture.enableLinearScaling();
      }
      this.texture = this.frameBuffer.texture;
    } else {
      this.frameBuffer = new _pixiGlCore.GLFramebuffer(gl, 100, 100);
      this.frameBuffer.framebuffer = null;
    }
    this.setFrame();
    this.resize(width, height);
  }
  RenderTarget.prototype.clear = function clear(clearColor) {
    var cc = clearColor || this.clearColor;
    this.frameBuffer.clear(cc[0], cc[1], cc[2], cc[3]); 
  };
  RenderTarget.prototype.attachStencilBuffer = function attachStencilBuffer() {
    if (!this.root) {
      this.frameBuffer.enableStencil();
    }
  };
  RenderTarget.prototype.setFrame = function setFrame(destinationFrame, sourceFrame) {
    this.destinationFrame = destinationFrame || this.destinationFrame || this.defaultFrame;
    this.sourceFrame = sourceFrame || this.sourceFrame || this.destinationFrame;
  };
  RenderTarget.prototype.activate = function activate() {
    var gl = this.gl;
    this.frameBuffer.bind();
    this.calculateProjection(this.destinationFrame, this.sourceFrame);
    if (this.transform) {
      this.projectionMatrix.append(this.transform);
    }
    if (this.destinationFrame !== this.sourceFrame) {
      gl.enable(gl.SCISSOR_TEST);
      gl.scissor(this.destinationFrame.x | 0, this.destinationFrame.y | 0, this.destinationFrame.width * this.resolution | 0, this.destinationFrame.height * this.resolution | 0);
    } else {
      gl.disable(gl.SCISSOR_TEST);
    }
    gl.viewport(this.destinationFrame.x | 0, this.destinationFrame.y | 0, this.destinationFrame.width * this.resolution | 0, this.destinationFrame.height * this.resolution | 0);
  };
  RenderTarget.prototype.calculateProjection = function calculateProjection(destinationFrame, sourceFrame) {
    var pm = this.projectionMatrix;
    sourceFrame = sourceFrame || destinationFrame;
    pm.identity();
    if (!this.root) {
      pm.a = 1 / destinationFrame.width * 2;
      pm.d = 1 / destinationFrame.height * 2;
      pm.tx = -1 - sourceFrame.x * pm.a;
      pm.ty = -1 - sourceFrame.y * pm.d;
    } else {
      pm.a = 1 / destinationFrame.width * 2;
      pm.d = -1 / destinationFrame.height * 2;
      pm.tx = -1 - sourceFrame.x * pm.a;
      pm.ty = 1 - sourceFrame.y * pm.d;
    }
  };
  RenderTarget.prototype.resize = function resize(width, height) {
    width = width | 0;
    height = height | 0;
    if (this.size.width === width && this.size.height === height) {
      return;
    }
    this.size.width = width;
    this.size.height = height;
    this.defaultFrame.width = width;
    this.defaultFrame.height = height;
    this.frameBuffer.resize(width * this.resolution, height * this.resolution);
    var projectionFrame = this.frame || this.size;
    this.calculateProjection(projectionFrame);
  };
  RenderTarget.prototype.destroy = function destroy() {
    this.frameBuffer.destroy();
    this.frameBuffer = null;
    this.texture = null;
  };
  return RenderTarget;
}();
exports.default = RenderTarget;
},{"../../../const":46,"../../../math":70,"../../../settings":101,"pixi-gl-core":15}],97:[function(require,module,exports){
'use strict';
exports.__esModule = true;
exports.default = checkMaxIfStatmentsInShader;
var _pixiGlCore = require('pixi-gl-core');
var _pixiGlCore2 = _interopRequireDefault(_pixiGlCore);
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
var fragTemplate = ['precision mediump float;', 'void main(void){', 'float test = 0.1;', '%forloop%', 'gl_FragColor = vec4(0.0);', '}'].join('\n');
function checkMaxIfStatmentsInShader(maxIfs, gl) {
    var createTempContext = !gl;
    if (maxIfs === 0) {
        throw new Error('Invalid value of `0` passed to `checkMaxIfStatementsInShader`');
    }
    if (createTempContext) {
        var tinyCanvas = document.createElement('canvas');
        tinyCanvas.width = 1;
        tinyCanvas.height = 1;
        gl = _pixiGlCore2.default.createContext(tinyCanvas);
    }
    var shader = gl.createShader(gl.FRAGMENT_SHADER);
    while (true) 
    {
        var fragmentSrc = fragTemplate.replace(/%forloop%/gi, generateIfTestSrc(maxIfs));
        gl.shaderSource(shader, fragmentSrc);
        gl.compileShader(shader);
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            maxIfs = maxIfs / 2 | 0;
        } else {
            break;
        }
    }
    if (createTempContext) {
        if (gl.getExtension('WEBGL_lose_context')) {
            gl.getExtension('WEBGL_lose_context').loseContext();
        }
    }
    return maxIfs;
}
function generateIfTestSrc(maxIfs) {
    var src = '';
    for (var i = 0; i < maxIfs; ++i) {
        if (i > 0) {
            src += '\nelse ';
        }
        if (i < maxIfs - 1) {
            src += 'if(test == ' + i + '.0){}';
        }
    }
    return src;
}
},{"pixi-gl-core":15}],98:[function(require,module,exports){
'use strict';
exports.__esModule = true;
exports.default = mapWebGLBlendModesToPixi;
var _const = require('../../../const');
function mapWebGLBlendModesToPixi(gl) {
    var array = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
    array[_const.BLEND_MODES.NORMAL] = [gl.ONE, gl.ONE_MINUS_SRC_ALPHA];
    array[_const.BLEND_MODES.ADD] = [gl.ONE, gl.DST_ALPHA];
    array[_const.BLEND_MODES.MULTIPLY] = [gl.DST_COLOR, gl.ONE_MINUS_SRC_ALPHA];
    array[_const.BLEND_MODES.SCREEN] = [gl.ONE, gl.ONE_MINUS_SRC_COLOR];
    array[_const.BLEND_MODES.OVERLAY] = [gl.ONE, gl.ONE_MINUS_SRC_ALPHA];
    array[_const.BLEND_MODES.DARKEN] = [gl.ONE, gl.ONE_MINUS_SRC_ALPHA];
    array[_const.BLEND_MODES.LIGHTEN] = [gl.ONE, gl.ONE_MINUS_SRC_ALPHA];
    array[_const.BLEND_MODES.COLOR_DODGE] = [gl.ONE, gl.ONE_MINUS_SRC_ALPHA];
    array[_const.BLEND_MODES.COLOR_BURN] = [gl.ONE, gl.ONE_MINUS_SRC_ALPHA];
    array[_const.BLEND_MODES.HARD_LIGHT] = [gl.ONE, gl.ONE_MINUS_SRC_ALPHA];
    array[_const.BLEND_MODES.SOFT_LIGHT] = [gl.ONE, gl.ONE_MINUS_SRC_ALPHA];
    array[_const.BLEND_MODES.DIFFERENCE] = [gl.ONE, gl.ONE_MINUS_SRC_ALPHA];
    array[_const.BLEND_MODES.EXCLUSION] = [gl.ONE, gl.ONE_MINUS_SRC_ALPHA];
    array[_const.BLEND_MODES.HUE] = [gl.ONE, gl.ONE_MINUS_SRC_ALPHA];
    array[_const.BLEND_MODES.SATURATION] = [gl.ONE, gl.ONE_MINUS_SRC_ALPHA];
    array[_const.BLEND_MODES.COLOR] = [gl.ONE, gl.ONE_MINUS_SRC_ALPHA];
    array[_const.BLEND_MODES.LUMINOSITY] = [gl.ONE, gl.ONE_MINUS_SRC_ALPHA];
    array[_const.BLEND_MODES.NORMAL_NPM] = [gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA, gl.ONE, gl.ONE_MINUS_SRC_ALPHA];
    array[_const.BLEND_MODES.ADD_NPM] = [gl.SRC_ALPHA, gl.DST_ALPHA, gl.ONE, gl.DST_ALPHA];
    array[_const.BLEND_MODES.SCREEN_NPM] = [gl.SRC_ALPHA, gl.ONE_MINUS_SRC_COLOR, gl.ONE, gl.ONE_MINUS_SRC_COLOR];
    return array;
}
},{"../../../const":46}],99:[function(require,module,exports){
'use strict';
exports.__esModule = true;
exports.default = mapWebGLDrawModesToPixi;
var _const = require('../../../const');
function mapWebGLDrawModesToPixi(gl) {
  var object = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  object[_const.DRAW_MODES.POINTS] = gl.POINTS;
  object[_const.DRAW_MODES.LINES] = gl.LINES;
  object[_const.DRAW_MODES.LINE_LOOP] = gl.LINE_LOOP;
  object[_const.DRAW_MODES.LINE_STRIP] = gl.LINE_STRIP;
  object[_const.DRAW_MODES.TRIANGLES] = gl.TRIANGLES;
  object[_const.DRAW_MODES.TRIANGLE_STRIP] = gl.TRIANGLE_STRIP;
  object[_const.DRAW_MODES.TRIANGLE_FAN] = gl.TRIANGLE_FAN;
  return object;
}
},{"../../../const":46}],100:[function(require,module,exports){
'use strict';
exports.__esModule = true;
exports.default = validateContext;
function validateContext(gl) {
    var attributes = gl.getContextAttributes();
    if (!attributes.stencil) {
        console.warn('Provided WebGL context does not have a stencil buffer, masks may not render correctly');
    }
}
},{}],101:[function(require,module,exports){
'use strict';
exports.__esModule = true;
var _maxRecommendedTextures = require('./utils/maxRecommendedTextures');
var _maxRecommendedTextures2 = _interopRequireDefault(_maxRecommendedTextures);
var _canUploadSameBuffer = require('./utils/canUploadSameBuffer');
var _canUploadSameBuffer2 = _interopRequireDefault(_canUploadSameBuffer);
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
exports.default = {
  TARGET_FPMS: 0.06,
  MIPMAP_TEXTURES: true,
  RESOLUTION: 1,
  FILTER_RESOLUTION: 1,
  SPRITE_MAX_TEXTURES: (0, _maxRecommendedTextures2.default)(32),
  SPRITE_BATCH_SIZE: 4096,
  RETINA_PREFIX: /@([0-9\.]+)x/,
  RENDER_OPTIONS: {
    view: null,
    antialias: false,
    forceFXAA: false,
    autoResize: false,
    transparent: false,
    backgroundColor: 0x000000,
    clearBeforeRender: true,
    preserveDrawingBuffer: false,
    roundPixels: false,
    width: 800,
    height: 600,
    legacy: false
  },
  TRANSFORM_MODE: 0,
  GC_MODE: 0,
  GC_MAX_IDLE: 60 * 60,
  GC_MAX_CHECK_COUNT: 60 * 10,
  WRAP_MODE: 0,
  SCALE_MODE: 0,
  PRECISION_VERTEX: 'highp',
  PRECISION_FRAGMENT: 'mediump',
  CAN_UPLOAD_SAME_BUFFER: (0, _canUploadSameBuffer2.default)(),
  MESH_CANVAS_PADDING: 0
};
},{"./utils/canUploadSameBuffer":122,"./utils/maxRecommendedTextures":127}],102:[function(require,module,exports){
'use strict';
exports.__esModule = true;
var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
var _math = require('../math');
var _utils = require('../utils');
var _const = require('../const');
var _Texture = require('../textures/Texture');
var _Texture2 = _interopRequireDefault(_Texture);
var _Container2 = require('../display/Container');
var _Container3 = _interopRequireDefault(_Container2);
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
var tempPoint = new _math.Point();
var Sprite = function (_Container) {
    _inherits(Sprite, _Container);
    function Sprite(texture) {
        _classCallCheck(this, Sprite);
        var _this = _possibleConstructorReturn(this, _Container.call(this));
        _this._anchor = new _math.ObservablePoint(_this._onAnchorUpdate, _this);
        _this._texture = null;
        _this._width = 0;
        _this._height = 0;
        _this._tint = null;
        _this._tintRGB = null;
        _this.tint = 0xFFFFFF;
        _this.blendMode = _const.BLEND_MODES.NORMAL;
        _this.shader = null;
        _this.cachedTint = 0xFFFFFF;
        _this.texture = texture || _Texture2.default.EMPTY;
        _this.vertexData = new Float32Array(8);
        _this.vertexTrimmedData = null;
        _this._transformID = -1;
        _this._textureID = -1;
        _this._transformTrimmedID = -1;
        _this._textureTrimmedID = -1;
        _this.pluginName = 'sprite';
        return _this;
    }
    Sprite.prototype._onTextureUpdate = function _onTextureUpdate() {
        this._textureID = -1;
        this._textureTrimmedID = -1;
        this.cachedTint = 0xFFFFFF;
        if (this._width) {
            this.scale.x = (0, _utils.sign)(this.scale.x) * this._width / this._texture.orig.width;
        }
        if (this._height) {
            this.scale.y = (0, _utils.sign)(this.scale.y) * this._height / this._texture.orig.height;
        }
    };
    Sprite.prototype._onAnchorUpdate = function _onAnchorUpdate() {
        this._transformID = -1;
        this._transformTrimmedID = -1;
    };
    Sprite.prototype.calculateVertices = function calculateVertices() {
        if (this._transformID === this.transform._worldID && this._textureID === this._texture._updateID) {
            return;
        }
        this._transformID = this.transform._worldID;
        this._textureID = this._texture._updateID;
        var texture = this._texture;
        var wt = this.transform.worldTransform;
        var a = wt.a;
        var b = wt.b;
        var c = wt.c;
        var d = wt.d;
        var tx = wt.tx;
        var ty = wt.ty;
        var vertexData = this.vertexData;
        var trim = texture.trim;
        var orig = texture.orig;
        var anchor = this._anchor;
        var w0 = 0;
        var w1 = 0;
        var h0 = 0;
        var h1 = 0;
        if (trim) {
            w1 = trim.x - anchor._x * orig.width;
            w0 = w1 + trim.width;
            h1 = trim.y - anchor._y * orig.height;
            h0 = h1 + trim.height;
        } else {
            w1 = -anchor._x * orig.width;
            w0 = w1 + orig.width;
            h1 = -anchor._y * orig.height;
            h0 = h1 + orig.height;
        }
        vertexData[0] = a * w1 + c * h1 + tx;
        vertexData[1] = d * h1 + b * w1 + ty;
        vertexData[2] = a * w0 + c * h1 + tx;
        vertexData[3] = d * h1 + b * w0 + ty;
        vertexData[4] = a * w0 + c * h0 + tx;
        vertexData[5] = d * h0 + b * w0 + ty;
        vertexData[6] = a * w1 + c * h0 + tx;
        vertexData[7] = d * h0 + b * w1 + ty;
    };
    Sprite.prototype.calculateTrimmedVertices = function calculateTrimmedVertices() {
        if (!this.vertexTrimmedData) {
            this.vertexTrimmedData = new Float32Array(8);
        } else if (this._transformTrimmedID === this.transform._worldID && this._textureTrimmedID === this._texture._updateID) {
            return;
        }
        this._transformTrimmedID = this.transform._worldID;
        this._textureTrimmedID = this._texture._updateID;
        var texture = this._texture;
        var vertexData = this.vertexTrimmedData;
        var orig = texture.orig;
        var anchor = this._anchor;
        var wt = this.transform.worldTransform;
        var a = wt.a;
        var b = wt.b;
        var c = wt.c;
        var d = wt.d;
        var tx = wt.tx;
        var ty = wt.ty;
        var w1 = -anchor._x * orig.width;
        var w0 = w1 + orig.width;
        var h1 = -anchor._y * orig.height;
        var h0 = h1 + orig.height;
        vertexData[0] = a * w1 + c * h1 + tx;
        vertexData[1] = d * h1 + b * w1 + ty;
        vertexData[2] = a * w0 + c * h1 + tx;
        vertexData[3] = d * h1 + b * w0 + ty;
        vertexData[4] = a * w0 + c * h0 + tx;
        vertexData[5] = d * h0 + b * w0 + ty;
        vertexData[6] = a * w1 + c * h0 + tx;
        vertexData[7] = d * h0 + b * w1 + ty;
    };
    Sprite.prototype._renderWebGL = function _renderWebGL(renderer) {
        this.calculateVertices();
        renderer.setObjectRenderer(renderer.plugins[this.pluginName]);
        renderer.plugins[this.pluginName].render(this);
    };
    Sprite.prototype._renderCanvas = function _renderCanvas(renderer) {
        renderer.plugins[this.pluginName].render(this);
    };
    Sprite.prototype._calculateBounds = function _calculateBounds() {
        var trim = this._texture.trim;
        var orig = this._texture.orig;
        if (!trim || trim.width === orig.width && trim.height === orig.height) {
            this.calculateVertices();
            this._bounds.addQuad(this.vertexData);
        } else {
            this.calculateTrimmedVertices();
            this._bounds.addQuad(this.vertexTrimmedData);
        }
    };
    Sprite.prototype.getLocalBounds = function getLocalBounds(rect) {
        if (this.children.length === 0) {
            this._bounds.minX = this._texture.orig.width * -this._anchor._x;
            this._bounds.minY = this._texture.orig.height * -this._anchor._y;
            this._bounds.maxX = this._texture.orig.width * (1 - this._anchor._x);
            this._bounds.maxY = this._texture.orig.height * (1 - this._anchor._y);
            if (!rect) {
                if (!this._localBoundsRect) {
                    this._localBoundsRect = new _math.Rectangle();
                }
                rect = this._localBoundsRect;
            }
            return this._bounds.getRectangle(rect);
        }
        return _Container.prototype.getLocalBounds.call(this, rect);
    };
    Sprite.prototype.containsPoint = function containsPoint(point) {
        this.worldTransform.applyInverse(point, tempPoint);
        var width = this._texture.orig.width;
        var height = this._texture.orig.height;
        var x1 = -width * this.anchor.x;
        var y1 = 0;
        if (tempPoint.x >= x1 && tempPoint.x < x1 + width) {
            y1 = -height * this.anchor.y;
            if (tempPoint.y >= y1 && tempPoint.y < y1 + height) {
                return true;
            }
        }
        return false;
    };
    Sprite.prototype.destroy = function destroy(options) {
        _Container.prototype.destroy.call(this, options);
        this._texture.off('update', this._onTextureUpdate, this);
        this._anchor = null;
        var destroyTexture = typeof options === 'boolean' ? options : options && options.texture;
        if (destroyTexture) {
            var destroyBaseTexture = typeof options === 'boolean' ? options : options && options.baseTexture;
            this._texture.destroy(!!destroyBaseTexture);
        }
        this._texture = null;
        this.shader = null;
    };
    Sprite.from = function from(source) {
        return new Sprite(_Texture2.default.from(source));
    };
    Sprite.fromFrame = function fromFrame(frameId) {
        var texture = _utils.TextureCache[frameId];
        if (!texture) {
            throw new Error('The frameId "' + frameId + '" does not exist in the texture cache');
        }
        return new Sprite(texture);
    };
    Sprite.fromImage = function fromImage(imageId, crossorigin, scaleMode) {
        return new Sprite(_Texture2.default.fromImage(imageId, crossorigin, scaleMode));
    };
    _createClass(Sprite, [{
        key: 'width',
        get: function get() {
            return Math.abs(this.scale.x) * this._texture.orig.width;
        },
        set: function set(value) 
        {
            var s = (0, _utils.sign)(this.scale.x) || 1;
            this.scale.x = s * value / this._texture.orig.width;
            this._width = value;
        }
    }, {
        key: 'height',
        get: function get() {
            return Math.abs(this.scale.y) * this._texture.orig.height;
        },
        set: function set(value) 
        {
            var s = (0, _utils.sign)(this.scale.y) || 1;
            this.scale.y = s * value / this._texture.orig.height;
            this._height = value;
        }
    }, {
        key: 'anchor',
        get: function get() {
            return this._anchor;
        },
        set: function set(value) 
        {
            this._anchor.copy(value);
        }
    }, {
        key: 'tint',
        get: function get() {
            return this._tint;
        },
        set: function set(value) 
        {
            this._tint = value;
            this._tintRGB = (value >> 16) + (value & 0xff00) + ((value & 0xff) << 16);
        }
    }, {
        key: 'texture',
        get: function get() {
            return this._texture;
        },
        set: function set(value) 
        {
            if (this._texture === value) {
                return;
            }
            this._texture = value;
            this.cachedTint = 0xFFFFFF;
            this._textureID = -1;
            this._textureTrimmedID = -1;
            if (value) {
                if (value.baseTexture.hasLoaded) {
                    this._onTextureUpdate();
                } else {
                    value.once('update', this._onTextureUpdate, this);
                }
            }
        }
    }]);
    return Sprite;
}(_Container3.default);
exports.default = Sprite;
},{"../const":46,"../display/Container":48,"../math":70,"../textures/Texture":115,"../utils":125}],103:[function(require,module,exports){
'use strict';
exports.__esModule = true;
var _CanvasRenderer = require('../../renderers/canvas/CanvasRenderer');
var _CanvasRenderer2 = _interopRequireDefault(_CanvasRenderer);
var _const = require('../../const');
var _math = require('../../math');
var _CanvasTinter = require('./CanvasTinter');
var _CanvasTinter2 = _interopRequireDefault(_CanvasTinter);
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
var canvasRenderWorldTransform = new _math.Matrix();
var CanvasSpriteRenderer = function () {
    function CanvasSpriteRenderer(renderer) {
        _classCallCheck(this, CanvasSpriteRenderer);
        this.renderer = renderer;
    }
    CanvasSpriteRenderer.prototype.render = function render(sprite) {
        var texture = sprite._texture;
        var renderer = this.renderer;
        var width = texture._frame.width;
        var height = texture._frame.height;
        var wt = sprite.transform.worldTransform;
        var dx = 0;
        var dy = 0;
        if (texture.orig.width <= 0 || texture.orig.height <= 0 || !texture.baseTexture.source) {
            return;
        }
        renderer.setBlendMode(sprite.blendMode);
        if (texture.valid) {
            renderer.context.globalAlpha = sprite.worldAlpha;
            var smoothingEnabled = texture.baseTexture.scaleMode === _const.SCALE_MODES.LINEAR;
            if (renderer.smoothProperty && renderer.context[renderer.smoothProperty] !== smoothingEnabled) {
                renderer.context[renderer.smoothProperty] = smoothingEnabled;
            }
            if (texture.trim) {
                dx = texture.trim.width / 2 + texture.trim.x - sprite.anchor.x * texture.orig.width;
                dy = texture.trim.height / 2 + texture.trim.y - sprite.anchor.y * texture.orig.height;
            } else {
                dx = (0.5 - sprite.anchor.x) * texture.orig.width;
                dy = (0.5 - sprite.anchor.y) * texture.orig.height;
            }
            if (texture.rotate) {
                wt.copy(canvasRenderWorldTransform);
                wt = canvasRenderWorldTransform;
                _math.GroupD8.matrixAppendRotationInv(wt, texture.rotate, dx, dy);
                dx = 0;
                dy = 0;
            }
            dx -= width / 2;
            dy -= height / 2;
            if (renderer.roundPixels) {
                renderer.context.setTransform(wt.a, wt.b, wt.c, wt.d, wt.tx * renderer.resolution | 0, wt.ty * renderer.resolution | 0);
                dx = dx | 0;
                dy = dy | 0;
            } else {
                renderer.context.setTransform(wt.a, wt.b, wt.c, wt.d, wt.tx * renderer.resolution, wt.ty * renderer.resolution);
            }
            var resolution = texture.baseTexture.resolution;
            if (sprite.tint !== 0xFFFFFF) {
                if (sprite.cachedTint !== sprite.tint || sprite.tintedTexture.tintId !== sprite._texture._updateID) {
                    sprite.cachedTint = sprite.tint;
                    sprite.tintedTexture = _CanvasTinter2.default.getTintedTexture(sprite, sprite.tint);
                }
                renderer.context.drawImage(sprite.tintedTexture, 0, 0, width * resolution, height * resolution, dx * renderer.resolution, dy * renderer.resolution, width * renderer.resolution, height * renderer.resolution);
            } else {
                renderer.context.drawImage(texture.baseTexture.source, texture._frame.x * resolution, texture._frame.y * resolution, width * resolution, height * resolution, dx * renderer.resolution, dy * renderer.resolution, width * renderer.resolution, height * renderer.resolution);
            }
        }
    };
    CanvasSpriteRenderer.prototype.destroy = function destroy() {
        this.renderer = null;
    };
    return CanvasSpriteRenderer;
}();
exports.default = CanvasSpriteRenderer;
_CanvasRenderer2.default.registerPlugin('sprite', CanvasSpriteRenderer);
},{"../../const":46,"../../math":70,"../../renderers/canvas/CanvasRenderer":77,"./CanvasTinter":104}],104:[function(require,module,exports){
'use strict';
exports.__esModule = true;
var _utils = require('../../utils');
var _canUseNewCanvasBlendModes = require('../../renderers/canvas/utils/canUseNewCanvasBlendModes');
var _canUseNewCanvasBlendModes2 = _interopRequireDefault(_canUseNewCanvasBlendModes);
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
var CanvasTinter = {
    getTintedTexture: function getTintedTexture(sprite, color) {
        var texture = sprite._texture;
        color = CanvasTinter.roundColor(color);
        var stringColor = '#' + ('00000' + (color | 0).toString(16)).substr(-6);
        texture.tintCache = texture.tintCache || {};
        var cachedTexture = texture.tintCache[stringColor];
        var canvas = void 0;
        if (cachedTexture) {
            if (cachedTexture.tintId === texture._updateID) {
                return texture.tintCache[stringColor];
            }
            canvas = texture.tintCache[stringColor];
        } else {
            canvas = CanvasTinter.canvas || document.createElement('canvas');
        }
        CanvasTinter.tintMethod(texture, color, canvas);
        canvas.tintId = texture._updateID;
        if (CanvasTinter.convertTintToImage) {
            var tintImage = new Image();
            tintImage.src = canvas.toDataURL();
            texture.tintCache[stringColor] = tintImage;
        } else {
            texture.tintCache[stringColor] = canvas;
            CanvasTinter.canvas = null;
        }
        return canvas;
    },
    tintWithMultiply: function tintWithMultiply(texture, color, canvas) {
        var context = canvas.getContext('2d');
        var crop = texture._frame.clone();
        var resolution = texture.baseTexture.resolution;
        crop.x *= resolution;
        crop.y *= resolution;
        crop.width *= resolution;
        crop.height *= resolution;
        canvas.width = Math.ceil(crop.width);
        canvas.height = Math.ceil(crop.height);
        context.save();
        context.fillStyle = '#' + ('00000' + (color | 0).toString(16)).substr(-6);
        context.fillRect(0, 0, crop.width, crop.height);
        context.globalCompositeOperation = 'multiply';
        context.drawImage(texture.baseTexture.source, crop.x, crop.y, crop.width, crop.height, 0, 0, crop.width, crop.height);
        context.globalCompositeOperation = 'destination-atop';
        context.drawImage(texture.baseTexture.source, crop.x, crop.y, crop.width, crop.height, 0, 0, crop.width, crop.height);
        context.restore();
    },
    tintWithOverlay: function tintWithOverlay(texture, color, canvas) {
        var context = canvas.getContext('2d');
        var crop = texture._frame.clone();
        var resolution = texture.baseTexture.resolution;
        crop.x *= resolution;
        crop.y *= resolution;
        crop.width *= resolution;
        crop.height *= resolution;
        canvas.width = Math.ceil(crop.width);
        canvas.height = Math.ceil(crop.height);
        context.save();
        context.globalCompositeOperation = 'copy';
        context.fillStyle = '#' + ('00000' + (color | 0).toString(16)).substr(-6);
        context.fillRect(0, 0, crop.width, crop.height);
        context.globalCompositeOperation = 'destination-atop';
        context.drawImage(texture.baseTexture.source, crop.x, crop.y, crop.width, crop.height, 0, 0, crop.width, crop.height);
        context.restore();
    },
    tintWithPerPixel: function tintWithPerPixel(texture, color, canvas) {
        var context = canvas.getContext('2d');
        var crop = texture._frame.clone();
        var resolution = texture.baseTexture.resolution;
        crop.x *= resolution;
        crop.y *= resolution;
        crop.width *= resolution;
        crop.height *= resolution;
        canvas.width = Math.ceil(crop.width);
        canvas.height = Math.ceil(crop.height);
        context.save();
        context.globalCompositeOperation = 'copy';
        context.drawImage(texture.baseTexture.source, crop.x, crop.y, crop.width, crop.height, 0, 0, crop.width, crop.height);
        context.restore();
        var rgbValues = (0, _utils.hex2rgb)(color);
        var r = rgbValues[0];
        var g = rgbValues[1];
        var b = rgbValues[2];
        var pixelData = context.getImageData(0, 0, crop.width, crop.height);
        var pixels = pixelData.data;
        for (var i = 0; i < pixels.length; i += 4) {
            pixels[i + 0] *= r;
            pixels[i + 1] *= g;
            pixels[i + 2] *= b;
        }
        context.putImageData(pixelData, 0, 0);
    },
    roundColor: function roundColor(color) {
        var step = CanvasTinter.cacheStepsPerColorChannel;
        var rgbValues = (0, _utils.hex2rgb)(color);
        rgbValues[0] = Math.min(255, rgbValues[0] / step * step);
        rgbValues[1] = Math.min(255, rgbValues[1] / step * step);
        rgbValues[2] = Math.min(255, rgbValues[2] / step * step);
        return (0, _utils.rgb2hex)(rgbValues);
    },
    cacheStepsPerColorChannel: 8,
    convertTintToImage: false,
    canUseMultiply: (0, _canUseNewCanvasBlendModes2.default)(),
    tintMethod: 0
};
CanvasTinter.tintMethod = CanvasTinter.canUseMultiply ? CanvasTinter.tintWithMultiply : CanvasTinter.tintWithPerPixel;
exports.default = CanvasTinter;
},{"../../renderers/canvas/utils/canUseNewCanvasBlendModes":80,"../../utils":125}],105:[function(require,module,exports){
"use strict";
exports.__esModule = true;
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
var Buffer = function () {
  function Buffer(size) {
    _classCallCheck(this, Buffer);
    this.vertices = new ArrayBuffer(size);
    this.float32View = new Float32Array(this.vertices);
    this.uint32View = new Uint32Array(this.vertices);
  }
  Buffer.prototype.destroy = function destroy() {
    this.vertices = null;
    this.positions = null;
    this.uvs = null;
    this.colors = null;
  };
  return Buffer;
}();
exports.default = Buffer;
},{}],106:[function(require,module,exports){
'use strict';
exports.__esModule = true;
var _ObjectRenderer2 = require('../../renderers/webgl/utils/ObjectRenderer');
var _ObjectRenderer3 = _interopRequireDefault(_ObjectRenderer2);
var _WebGLRenderer = require('../../renderers/webgl/WebGLRenderer');
var _WebGLRenderer2 = _interopRequireDefault(_WebGLRenderer);
var _createIndicesForQuads = require('../../utils/createIndicesForQuads');
var _createIndicesForQuads2 = _interopRequireDefault(_createIndicesForQuads);
var _generateMultiTextureShader = require('./generateMultiTextureShader');
var _generateMultiTextureShader2 = _interopRequireDefault(_generateMultiTextureShader);
var _checkMaxIfStatmentsInShader = require('../../renderers/webgl/utils/checkMaxIfStatmentsInShader');
var _checkMaxIfStatmentsInShader2 = _interopRequireDefault(_checkMaxIfStatmentsInShader);
var _BatchBuffer = require('./BatchBuffer');
var _BatchBuffer2 = _interopRequireDefault(_BatchBuffer);
var _settings = require('../../settings');
var _settings2 = _interopRequireDefault(_settings);
var _utils = require('../../utils');
var _pixiGlCore = require('pixi-gl-core');
var _pixiGlCore2 = _interopRequireDefault(_pixiGlCore);
var _bitTwiddle = require('bit-twiddle');
var _bitTwiddle2 = _interopRequireDefault(_bitTwiddle);
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
var TICK = 0;
var TEXTURE_TICK = 0;
var SpriteRenderer = function (_ObjectRenderer) {
    _inherits(SpriteRenderer, _ObjectRenderer);
    function SpriteRenderer(renderer) {
        _classCallCheck(this, SpriteRenderer);
        var _this = _possibleConstructorReturn(this, _ObjectRenderer.call(this, renderer));
        _this.vertSize = 5;
        _this.vertByteSize = _this.vertSize * 4;
        _this.size = _settings2.default.SPRITE_BATCH_SIZE; 
        _this.buffers = [];
        for (var i = 1; i <= _bitTwiddle2.default.nextPow2(_this.size); i *= 2) {
            _this.buffers.push(new _BatchBuffer2.default(i * 4 * _this.vertByteSize));
        }
        _this.indices = (0, _createIndicesForQuads2.default)(_this.size);
        _this.shader = null;
        _this.currentIndex = 0;
        _this.groups = [];
        for (var k = 0; k < _this.size; k++) {
            _this.groups[k] = { textures: [], textureCount: 0, ids: [], size: 0, start: 0, blend: 0 };
        }
        _this.sprites = [];
        _this.vertexBuffers = [];
        _this.vaos = [];
        _this.vaoMax = 2;
        _this.vertexCount = 0;
        _this.renderer.on('prerender', _this.onPrerender, _this);
        return _this;
    }
    SpriteRenderer.prototype.onContextChange = function onContextChange() {
        var gl = this.renderer.gl;
        if (this.renderer.legacy) {
            this.MAX_TEXTURES = 1;
        } else {
            this.MAX_TEXTURES = Math.min(gl.getParameter(gl.MAX_TEXTURE_IMAGE_UNITS), _settings2.default.SPRITE_MAX_TEXTURES);
            this.MAX_TEXTURES = (0, _checkMaxIfStatmentsInShader2.default)(this.MAX_TEXTURES, gl);
        }
        this.shader = (0, _generateMultiTextureShader2.default)(gl, this.MAX_TEXTURES);
        this.indexBuffer = _pixiGlCore2.default.GLBuffer.createIndexBuffer(gl, this.indices, gl.STATIC_DRAW);
        this.renderer.bindVao(null);
        var attrs = this.shader.attributes;
        for (var i = 0; i < this.vaoMax; i++) {
            var vertexBuffer = this.vertexBuffers[i] = _pixiGlCore2.default.GLBuffer.createVertexBuffer(gl, null, gl.STREAM_DRAW);
            var vao = this.renderer.createVao().addIndex(this.indexBuffer).addAttribute(vertexBuffer, attrs.aVertexPosition, gl.FLOAT, false, this.vertByteSize, 0).addAttribute(vertexBuffer, attrs.aTextureCoord, gl.UNSIGNED_SHORT, true, this.vertByteSize, 2 * 4).addAttribute(vertexBuffer, attrs.aColor, gl.UNSIGNED_BYTE, true, this.vertByteSize, 3 * 4);
            if (attrs.aTextureId) {
                vao.addAttribute(vertexBuffer, attrs.aTextureId, gl.FLOAT, false, this.vertByteSize, 4 * 4);
            }
            this.vaos[i] = vao;
        }
        this.vao = this.vaos[0];
        this.currentBlendMode = 99999;
        this.boundTextures = new Array(this.MAX_TEXTURES);
    };
    SpriteRenderer.prototype.onPrerender = function onPrerender() {
        this.vertexCount = 0;
    };
    SpriteRenderer.prototype.render = function render(sprite) {
        if (this.currentIndex >= this.size) {
            this.flush();
        }
        if (!sprite._texture._uvs) {
            return;
        }
        this.sprites[this.currentIndex++] = sprite;
    };
    SpriteRenderer.prototype.flush = function flush() {
        if (this.currentIndex === 0) {
            return;
        }
        var gl = this.renderer.gl;
        var MAX_TEXTURES = this.MAX_TEXTURES;
        var np2 = _bitTwiddle2.default.nextPow2(this.currentIndex);
        var log2 = _bitTwiddle2.default.log2(np2);
        var buffer = this.buffers[log2];
        var sprites = this.sprites;
        var groups = this.groups;
        var float32View = buffer.float32View;
        var uint32View = buffer.uint32View;
        var boundTextures = this.boundTextures;
        var rendererBoundTextures = this.renderer.boundTextures;
        var touch = this.renderer.textureGC.count;
        var index = 0;
        var nextTexture = void 0;
        var currentTexture = void 0;
        var groupCount = 1;
        var textureCount = 0;
        var currentGroup = groups[0];
        var vertexData = void 0;
        var uvs = void 0;
        var blendMode = _utils.premultiplyBlendMode[sprites[0]._texture.baseTexture.premultipliedAlpha ? 1 : 0][sprites[0].blendMode];
        currentGroup.textureCount = 0;
        currentGroup.start = 0;
        currentGroup.blend = blendMode;
        TICK++;
        var i = void 0;
        for (i = 0; i < MAX_TEXTURES; ++i) {
            var bt = rendererBoundTextures[i];
            if (bt._enabled === TICK) {
                boundTextures[i] = this.renderer.emptyTextures[i];
                continue;
            }
            boundTextures[i] = bt;
            bt._virtalBoundId = i;
            bt._enabled = TICK;
        }
        TICK++;
        for (i = 0; i < this.currentIndex; ++i) {
            var sprite = sprites[i];
            sprites[i] = null;
            nextTexture = sprite._texture.baseTexture;
            var spriteBlendMode = _utils.premultiplyBlendMode[Number(nextTexture.premultipliedAlpha)][sprite.blendMode];
            if (blendMode !== spriteBlendMode) {
                blendMode = spriteBlendMode;
                currentTexture = null;
                textureCount = MAX_TEXTURES;
                TICK++;
            }
            if (currentTexture !== nextTexture) {
                currentTexture = nextTexture;
                if (nextTexture._enabled !== TICK) {
                    if (textureCount === MAX_TEXTURES) {
                        TICK++;
                        currentGroup.size = i - currentGroup.start;
                        textureCount = 0;
                        currentGroup = groups[groupCount++];
                        currentGroup.blend = blendMode;
                        currentGroup.textureCount = 0;
                        currentGroup.start = i;
                    }
                    nextTexture.touched = touch;
                    if (nextTexture._virtalBoundId === -1) {
                        for (var j = 0; j < MAX_TEXTURES; ++j) {
                            var tIndex = (j + TEXTURE_TICK) % MAX_TEXTURES;
                            var t = boundTextures[tIndex];
                            if (t._enabled !== TICK) {
                                TEXTURE_TICK++;
                                t._virtalBoundId = -1;
                                nextTexture._virtalBoundId = tIndex;
                                boundTextures[tIndex] = nextTexture;
                                break;
                            }
                        }
                    }
                    nextTexture._enabled = TICK;
                    currentGroup.textureCount++;
                    currentGroup.ids[textureCount] = nextTexture._virtalBoundId;
                    currentGroup.textures[textureCount++] = nextTexture;
                }
            }
            vertexData = sprite.vertexData;
            uvs = sprite._texture._uvs.uvsUint32;
            if (this.renderer.roundPixels) {
                var resolution = this.renderer.resolution;
                float32View[index] = (vertexData[0] * resolution | 0) / resolution;
                float32View[index + 1] = (vertexData[1] * resolution | 0) / resolution;
                float32View[index + 5] = (vertexData[2] * resolution | 0) / resolution;
                float32View[index + 6] = (vertexData[3] * resolution | 0) / resolution;
                float32View[index + 10] = (vertexData[4] * resolution | 0) / resolution;
                float32View[index + 11] = (vertexData[5] * resolution | 0) / resolution;
                float32View[index + 15] = (vertexData[6] * resolution | 0) / resolution;
                float32View[index + 16] = (vertexData[7] * resolution | 0) / resolution;
            } else {
                float32View[index] = vertexData[0];
                float32View[index + 1] = vertexData[1];
                float32View[index + 5] = vertexData[2];
                float32View[index + 6] = vertexData[3];
                float32View[index + 10] = vertexData[4];
                float32View[index + 11] = vertexData[5];
                float32View[index + 15] = vertexData[6];
                float32View[index + 16] = vertexData[7];
            }
            uint32View[index + 2] = uvs[0];
            uint32View[index + 7] = uvs[1];
            uint32View[index + 12] = uvs[2];
            uint32View[index + 17] = uvs[3];
            var alpha = Math.min(sprite.worldAlpha, 1.0);
            var argb = alpha < 1.0 && nextTexture.premultipliedAlpha ? (0, _utils.premultiplyTint)(sprite._tintRGB, alpha) : sprite._tintRGB + (alpha * 255 << 24);
            uint32View[index + 3] = uint32View[index + 8] = uint32View[index + 13] = uint32View[index + 18] = argb;
            float32View[index + 4] = float32View[index + 9] = float32View[index + 14] = float32View[index + 19] = nextTexture._virtalBoundId;
            index += 20;
        }
        currentGroup.size = i - currentGroup.start;
        if (!_settings2.default.CAN_UPLOAD_SAME_BUFFER) {
            if (this.vaoMax <= this.vertexCount) {
                this.vaoMax++;
                var attrs = this.shader.attributes;
                var vertexBuffer = this.vertexBuffers[this.vertexCount] = _pixiGlCore2.default.GLBuffer.createVertexBuffer(gl, null, gl.STREAM_DRAW);
                var vao = this.renderer.createVao().addIndex(this.indexBuffer).addAttribute(vertexBuffer, attrs.aVertexPosition, gl.FLOAT, false, this.vertByteSize, 0).addAttribute(vertexBuffer, attrs.aTextureCoord, gl.UNSIGNED_SHORT, true, this.vertByteSize, 2 * 4).addAttribute(vertexBuffer, attrs.aColor, gl.UNSIGNED_BYTE, true, this.vertByteSize, 3 * 4);
                if (attrs.aTextureId) {
                    vao.addAttribute(vertexBuffer, attrs.aTextureId, gl.FLOAT, false, this.vertByteSize, 4 * 4);
                }
                this.vaos[this.vertexCount] = vao;
            }
            this.renderer.bindVao(this.vaos[this.vertexCount]);
            this.vertexBuffers[this.vertexCount].upload(buffer.vertices, 0, false);
            this.vertexCount++;
        } else {
            this.vertexBuffers[this.vertexCount].upload(buffer.vertices, 0, true);
        }
        for (i = 0; i < MAX_TEXTURES; ++i) {
            rendererBoundTextures[i]._virtalBoundId = -1;
        }
        for (i = 0; i < groupCount; ++i) {
            var group = groups[i];
            var groupTextureCount = group.textureCount;
            for (var _j = 0; _j < groupTextureCount; _j++) {
                currentTexture = group.textures[_j];
                if (rendererBoundTextures[group.ids[_j]] !== currentTexture) {
                    this.renderer.bindTexture(currentTexture, group.ids[_j], true);
                }
                currentTexture._virtalBoundId = -1;
            }
            this.renderer.state.setBlendMode(group.blend);
            gl.drawElements(gl.TRIANGLES, group.size * 6, gl.UNSIGNED_SHORT, group.start * 6 * 2);
        }
        this.currentIndex = 0;
    };
    SpriteRenderer.prototype.start = function start() {
        this.renderer.bindShader(this.shader);
        if (_settings2.default.CAN_UPLOAD_SAME_BUFFER) {
            this.renderer.bindVao(this.vaos[this.vertexCount]);
            this.vertexBuffers[this.vertexCount].bind();
        }
    };
    SpriteRenderer.prototype.stop = function stop() {
        this.flush();
    };
    SpriteRenderer.prototype.destroy = function destroy() {
        for (var i = 0; i < this.vaoMax; i++) {
            if (this.vertexBuffers[i]) {
                this.vertexBuffers[i].destroy();
            }
            if (this.vaos[i]) {
                this.vaos[i].destroy();
            }
        }
        if (this.indexBuffer) {
            this.indexBuffer.destroy();
        }
        this.renderer.off('prerender', this.onPrerender, this);
        _ObjectRenderer.prototype.destroy.call(this);
        if (this.shader) {
            this.shader.destroy();
            this.shader = null;
        }
        this.vertexBuffers = null;
        this.vaos = null;
        this.indexBuffer = null;
        this.indices = null;
        this.sprites = null;
        for (var _i = 0; _i < this.buffers.length; ++_i) {
            this.buffers[_i].destroy();
        }
    };
    return SpriteRenderer;
}(_ObjectRenderer3.default);
exports.default = SpriteRenderer;
_WebGLRenderer2.default.registerPlugin('sprite', SpriteRenderer);
},{"../../renderers/webgl/WebGLRenderer":84,"../../renderers/webgl/utils/ObjectRenderer":94,"../../renderers/webgl/utils/checkMaxIfStatmentsInShader":97,"../../settings":101,"../../utils":125,"../../utils/createIndicesForQuads":123,"./BatchBuffer":105,"./generateMultiTextureShader":107,"bit-twiddle":1,"pixi-gl-core":15}],107:[function(require,module,exports){
'use strict';
exports.__esModule = true;
exports.default = generateMultiTextureShader;
var _Shader = require('../../Shader');
var _Shader2 = _interopRequireDefault(_Shader);
var _path = require('path');
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
var fragTemplate = ['varying vec2 vTextureCoord;', 'varying vec4 vColor;', 'varying float vTextureId;', 'uniform sampler2D uSamplers[%count%];', 'void main(void){', 'vec4 color;', 'float textureId = floor(vTextureId+0.5);', '%forloop%', 'gl_FragColor = color * vColor;', '}'].join('\n');
function generateMultiTextureShader(gl, maxTextures) {
    var vertexSrc = 'precision highp float;\nattribute vec2 aVertexPosition;\nattribute vec2 aTextureCoord;\nattribute vec4 aColor;\nattribute float aTextureId;\n\nuniform mat3 projectionMatrix;\n\nvarying vec2 vTextureCoord;\nvarying vec4 vColor;\nvarying float vTextureId;\n\nvoid main(void){\n    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\n\n    vTextureCoord = aTextureCoord;\n    vTextureId = aTextureId;\n    vColor = aColor;\n}\n';
    var fragmentSrc = fragTemplate;
    fragmentSrc = fragmentSrc.replace(/%count%/gi, maxTextures);
    fragmentSrc = fragmentSrc.replace(/%forloop%/gi, generateSampleSrc(maxTextures));
    var shader = new _Shader2.default(gl, vertexSrc, fragmentSrc);
    var sampleValues = [];
    for (var i = 0; i < maxTextures; i++) {
        sampleValues[i] = i;
    }
    shader.bind();
    shader.uniforms.uSamplers = sampleValues;
    return shader;
}
function generateSampleSrc(maxTextures) {
    var src = '';
    src += '\n';
    src += '\n';
    for (var i = 0; i < maxTextures; i++) {
        if (i > 0) {
            src += '\nelse ';
        }
        if (i < maxTextures - 1) {
            src += 'if(textureId == ' + i + '.0)';
        }
        src += '\n{';
        src += '\n\tcolor = texture2D(uSamplers[' + i + '], vTextureCoord);';
        src += '\n}';
    }
    src += '\n';
    src += '\n';
    return src;
}
},{"../../Shader":44,"path":8}],108:[function(require,module,exports){
'use strict';
exports.__esModule = true;
var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
var _Sprite2 = require('../sprites/Sprite');
var _Sprite3 = _interopRequireDefault(_Sprite2);
var _Texture = require('../textures/Texture');
var _Texture2 = _interopRequireDefault(_Texture);
var _math = require('../math');
var _utils = require('../utils');
var _const = require('../const');
var _settings = require('../settings');
var _settings2 = _interopRequireDefault(_settings);
var _TextStyle = require('./TextStyle');
var _TextStyle2 = _interopRequireDefault(_TextStyle);
var _TextMetrics = require('./TextMetrics');
var _TextMetrics2 = _interopRequireDefault(_TextMetrics);
var _trimCanvas = require('../utils/trimCanvas');
var _trimCanvas2 = _interopRequireDefault(_trimCanvas);
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } 
var defaultDestroyOptions = {
    texture: true,
    children: false,
    baseTexture: true
};
var Text = function (_Sprite) {
    _inherits(Text, _Sprite);
    function Text(text, style, canvas) {
        _classCallCheck(this, Text);
        canvas = canvas || document.createElement('canvas');
        canvas.width = 3;
        canvas.height = 3;
        var texture = _Texture2.default.fromCanvas(canvas, _settings2.default.SCALE_MODE, 'text');
        texture.orig = new _math.Rectangle();
        texture.trim = new _math.Rectangle();
        var _this = _possibleConstructorReturn(this, _Sprite.call(this, texture));
        _Texture2.default.addToCache(_this._texture, _this._texture.baseTexture.textureCacheIds[0]);
        _this.canvas = canvas;
        _this.context = _this.canvas.getContext('2d');
        _this.resolution = _settings2.default.RESOLUTION;
        _this._text = null;
        _this._style = null;
        _this._styleListener = null;
        _this._font = '';
        _this.text = text;
        _this.style = style;
        _this.localStyleID = -1;
        return _this;
    }
    Text.prototype.updateText = function updateText(respectDirty) {
        var style = this._style;
        if (this.localStyleID !== style.styleID) {
            this.dirty = true;
            this.localStyleID = style.styleID;
        }
        if (!this.dirty && respectDirty) {
            return;
        }
        this._font = this._style.toFontString();
        var context = this.context;
        var measured = _TextMetrics2.default.measureText(this._text, this._style, this._style.wordWrap, this.canvas);
        var width = measured.width;
        var height = measured.height;
        var lines = measured.lines;
        var lineHeight = measured.lineHeight;
        var lineWidths = measured.lineWidths;
        var maxLineWidth = measured.maxLineWidth;
        var fontProperties = measured.fontProperties;
        this.canvas.width = Math.ceil((Math.max(1, width) + style.padding * 2) * this.resolution);
        this.canvas.height = Math.ceil((Math.max(1, height) + style.padding * 2) * this.resolution);
        context.scale(this.resolution, this.resolution);
        context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        context.font = this._font;
        context.strokeStyle = style.stroke;
        context.lineWidth = style.strokeThickness;
        context.textBaseline = style.textBaseline;
        context.lineJoin = style.lineJoin;
        context.miterLimit = style.miterLimit;
        var linePositionX = void 0;
        var linePositionY = void 0;
        if (style.dropShadow) {
            context.fillStyle = style.dropShadowColor;
            context.globalAlpha = style.dropShadowAlpha;
            context.shadowBlur = style.dropShadowBlur;
            if (style.dropShadowBlur > 0) {
                context.shadowColor = style.dropShadowColor;
            }
            var xShadowOffset = Math.cos(style.dropShadowAngle) * style.dropShadowDistance;
            var yShadowOffset = Math.sin(style.dropShadowAngle) * style.dropShadowDistance;
            for (var i = 0; i < lines.length; i++) {
                linePositionX = style.strokeThickness / 2;
                linePositionY = style.strokeThickness / 2 + i * lineHeight + fontProperties.ascent;
                if (style.align === 'right') {
                    linePositionX += maxLineWidth - lineWidths[i];
                } else if (style.align === 'center') {
                    linePositionX += (maxLineWidth - lineWidths[i]) / 2;
                }
                if (style.fill) {
                    this.drawLetterSpacing(lines[i], linePositionX + xShadowOffset + style.padding, linePositionY + yShadowOffset + style.padding);
                    if (style.stroke && style.strokeThickness) {
                        context.strokeStyle = style.dropShadowColor;
                        this.drawLetterSpacing(lines[i], linePositionX + xShadowOffset + style.padding, linePositionY + yShadowOffset + style.padding, true);
                        context.strokeStyle = style.stroke;
                    }
                }
            }
        }
        context.shadowBlur = 0;
        context.globalAlpha = 1;
        context.fillStyle = this._generateFillStyle(style, lines);
        for (var _i = 0; _i < lines.length; _i++) {
            linePositionX = style.strokeThickness / 2;
            linePositionY = style.strokeThickness / 2 + _i * lineHeight + fontProperties.ascent;
            if (style.align === 'right') {
                linePositionX += maxLineWidth - lineWidths[_i];
            } else if (style.align === 'center') {
                linePositionX += (maxLineWidth - lineWidths[_i]) / 2;
            }
            if (style.stroke && style.strokeThickness) {
                this.drawLetterSpacing(lines[_i], linePositionX + style.padding, linePositionY + style.padding, true);
            }
            if (style.fill) {
                this.drawLetterSpacing(lines[_i], linePositionX + style.padding, linePositionY + style.padding);
            }
        }
        this.updateTexture();
    };
    Text.prototype.drawLetterSpacing = function drawLetterSpacing(text, x, y) {
        var isStroke = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
        var style = this._style;
        var letterSpacing = style.letterSpacing;
        if (letterSpacing === 0) {
            if (isStroke) {
                this.context.strokeText(text, x, y);
            } else {
                this.context.fillText(text, x, y);
            }
            return;
        }
        var characters = String.prototype.split.call(text, '');
        var currentPosition = x;
        var index = 0;
        var current = '';
        while (index < text.length) {
            current = characters[index++];
            if (isStroke) {
                this.context.strokeText(current, currentPosition, y);
            } else {
                this.context.fillText(current, currentPosition, y);
            }
            currentPosition += this.context.measureText(current).width + letterSpacing;
        }
    };
    Text.prototype.updateTexture = function updateTexture() {
        var canvas = this.canvas;
        if (this._style.trim) {
            var trimmed = (0, _trimCanvas2.default)(canvas);
            canvas.width = trimmed.width;
            canvas.height = trimmed.height;
            this.context.putImageData(trimmed.data, 0, 0);
        }
        var texture = this._texture;
        var style = this._style;
        var padding = style.trim ? 0 : style.padding;
        var baseTexture = texture.baseTexture;
        baseTexture.hasLoaded = true;
        baseTexture.resolution = this.resolution;
        baseTexture.realWidth = canvas.width;
        baseTexture.realHeight = canvas.height;
        baseTexture.width = canvas.width / this.resolution;
        baseTexture.height = canvas.height / this.resolution;
        texture.trim.width = texture._frame.width = canvas.width / this.resolution;
        texture.trim.height = texture._frame.height = canvas.height / this.resolution;
        texture.trim.x = -padding;
        texture.trim.y = -padding;
        texture.orig.width = texture._frame.width - padding * 2;
        texture.orig.height = texture._frame.height - padding * 2;
        this._onTextureUpdate();
        baseTexture.emit('update', baseTexture);
        this.dirty = false;
    };
    Text.prototype.renderWebGL = function renderWebGL(renderer) {
        if (this.resolution !== renderer.resolution) {
            this.resolution = renderer.resolution;
            this.dirty = true;
        }
        this.updateText(true);
        _Sprite.prototype.renderWebGL.call(this, renderer);
    };
    Text.prototype._renderCanvas = function _renderCanvas(renderer) {
        if (this.resolution !== renderer.resolution) {
            this.resolution = renderer.resolution;
            this.dirty = true;
        }
        this.updateText(true);
        _Sprite.prototype._renderCanvas.call(this, renderer);
    };
    Text.prototype.getLocalBounds = function getLocalBounds(rect) {
        this.updateText(true);
        return _Sprite.prototype.getLocalBounds.call(this, rect);
    };
    Text.prototype._calculateBounds = function _calculateBounds() {
        this.updateText(true);
        this.calculateVertices();
        this._bounds.addQuad(this.vertexData);
    };
    Text.prototype._onStyleChange = function _onStyleChange() {
        this.dirty = true;
    };
    Text.prototype._generateFillStyle = function _generateFillStyle(style, lines) {
        if (!Array.isArray(style.fill)) {
            return style.fill;
        }
        if (navigator.isCocoonJS) {
            return style.fill[0];
        }
        var gradient = void 0;
        var totalIterations = void 0;
        var currentIteration = void 0;
        var stop = void 0;
        var width = this.canvas.width / this.resolution;
        var height = this.canvas.height / this.resolution;
        var fill = style.fill.slice();
        var fillGradientStops = style.fillGradientStops.slice();
        if (!fillGradientStops.length) {
            var lengthPlus1 = fill.length + 1;
            for (var i = 1; i < lengthPlus1; ++i) {
                fillGradientStops.push(i / lengthPlus1);
            }
        }
        fill.unshift(style.fill[0]);
        fillGradientStops.unshift(0);
        fill.push(style.fill[style.fill.length - 1]);
        fillGradientStops.push(1);
        if (style.fillGradientType === _const.TEXT_GRADIENT.LINEAR_VERTICAL) {
            gradient = this.context.createLinearGradient(width / 2, 0, width / 2, height);
            totalIterations = (fill.length + 1) * lines.length;
            currentIteration = 0;
            for (var _i2 = 0; _i2 < lines.length; _i2++) {
                currentIteration += 1;
                for (var j = 0; j < fill.length; j++) {
                    if (typeof fillGradientStops[j] === 'number') {
                        stop = fillGradientStops[j] / lines.length + _i2 / lines.length;
                    } else {
                        stop = currentIteration / totalIterations;
                    }
                    gradient.addColorStop(stop, fill[j]);
                    currentIteration++;
                }
            }
        } else {
            gradient = this.context.createLinearGradient(0, height / 2, width, height / 2);
            totalIterations = fill.length + 1;
            currentIteration = 1;
            for (var _i3 = 0; _i3 < fill.length; _i3++) {
                if (typeof fillGradientStops[_i3] === 'number') {
                    stop = fillGradientStops[_i3];
                } else {
                    stop = currentIteration / totalIterations;
                }
                gradient.addColorStop(stop, fill[_i3]);
                currentIteration++;
            }
        }
        return gradient;
    };
    Text.prototype.destroy = function destroy(options) {
        if (typeof options === 'boolean') {
            options = { children: options };
        }
        options = Object.assign({}, defaultDestroyOptions, options);
        _Sprite.prototype.destroy.call(this, options);
        this.context = null;
        this.canvas = null;
        this._style = null;
    };
    _createClass(Text, [{
        key: 'width',
        get: function get() {
            this.updateText(true);
            return Math.abs(this.scale.x) * this._texture.orig.width;
        },
        set: function set(value) 
        {
            this.updateText(true);
            var s = (0, _utils.sign)(this.scale.x) || 1;
            this.scale.x = s * value / this._texture.orig.width;
            this._width = value;
        }
    }, {
        key: 'height',
        get: function get() {
            this.updateText(true);
            return Math.abs(this.scale.y) * this._texture.orig.height;
        },
        set: function set(value) 
        {
            this.updateText(true);
            var s = (0, _utils.sign)(this.scale.y) || 1;
            this.scale.y = s * value / this._texture.orig.height;
            this._height = value;
        }
    }, {
        key: 'style',
        get: function get() {
            return this._style;
        },
        set: function set(style) 
        {
            style = style || {};
            if (style instanceof _TextStyle2.default) {
                this._style = style;
            } else {
                this._style = new _TextStyle2.default(style);
            }
            this.localStyleID = -1;
            this.dirty = true;
        }
    }, {
        key: 'text',
        get: function get() {
            return this._text;
        },
        set: function set(text) 
        {
            text = String(text === '' || text === null || text === undefined ? ' ' : text);
            if (this._text === text) {
                return;
            }
            this._text = text;
            this.dirty = true;
        }
    }]);
    return Text;
}(_Sprite3.default);
exports.default = Text;
},{"../const":46,"../math":70,"../settings":101,"../sprites/Sprite":102,"../textures/Texture":115,"../utils":125,"../utils/trimCanvas":130,"./TextMetrics":109,"./TextStyle":110}],109:[function(require,module,exports){
'use strict';
exports.__esModule = true;
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
var TextMetrics = function () {
    function TextMetrics(text, style, width, height, lines, lineWidths, lineHeight, maxLineWidth, fontProperties) {
        _classCallCheck(this, TextMetrics);
        this.text = text;
        this.style = style;
        this.width = width;
        this.height = height;
        this.lines = lines;
        this.lineWidths = lineWidths;
        this.lineHeight = lineHeight;
        this.maxLineWidth = maxLineWidth;
        this.fontProperties = fontProperties;
    }
    TextMetrics.measureText = function measureText(text, style, wordWrap) {
        var canvas = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : TextMetrics._canvas;
        wordWrap = wordWrap || style.wordWrap;
        var font = style.toFontString();
        var fontProperties = TextMetrics.measureFont(font);
        var context = canvas.getContext('2d');
        context.font = font;
        var outputText = wordWrap ? TextMetrics.wordWrap(text, style, canvas) : text;
        var lines = outputText.split(/(?:\r\n|\r|\n)/);
        var lineWidths = new Array(lines.length);
        var maxLineWidth = 0;
        for (var i = 0; i < lines.length; i++) {
            var lineWidth = context.measureText(lines[i]).width + (lines[i].length - 1) * style.letterSpacing;
            lineWidths[i] = lineWidth;
            maxLineWidth = Math.max(maxLineWidth, lineWidth);
        }
        var width = maxLineWidth + style.strokeThickness;
        if (style.dropShadow) {
            width += style.dropShadowDistance;
        }
        var lineHeight = style.lineHeight || fontProperties.fontSize + style.strokeThickness;
        var height = Math.max(lineHeight, fontProperties.fontSize + style.strokeThickness) + (lines.length - 1) * (lineHeight + style.leading);
        if (style.dropShadow) {
            height += style.dropShadowDistance;
        }
        return new TextMetrics(text, style, width, height, lines, lineWidths, lineHeight + style.leading, maxLineWidth, fontProperties);
    };
    TextMetrics.wordWrap = function wordWrap(text, style) {
        var canvas = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : TextMetrics._canvas;
        var context = canvas.getContext('2d');
        var width = 0;
        var line = '';
        var lines = '';
        var cache = {};
        var letterSpacing = style.letterSpacing,
            whiteSpace = style.whiteSpace;
        var collapseSpaces = TextMetrics.collapseSpaces(whiteSpace);
        var collapseNewlines = TextMetrics.collapseNewlines(whiteSpace);
        var canPrependSpaces = !collapseSpaces;
        var wordWrapWidth = style.wordWrapWidth + letterSpacing;
        var tokens = TextMetrics.tokenize(text);
        for (var i = 0; i < tokens.length; i++) {
            var token = tokens[i];
            if (TextMetrics.isNewline(token)) {
                if (!collapseNewlines) {
                    lines += TextMetrics.addLine(line);
                    canPrependSpaces = !collapseSpaces;
                    line = '';
                    width = 0;
                    continue;
                }
                token = ' ';
            }
            if (collapseSpaces) {
                var currIsBreakingSpace = TextMetrics.isBreakingSpace(token);
                var lastIsBreakingSpace = TextMetrics.isBreakingSpace(line[line.length - 1]);
                if (currIsBreakingSpace && lastIsBreakingSpace) {
                    continue;
                }
            }
            var tokenWidth = TextMetrics.getFromCache(token, letterSpacing, cache, context);
            if (tokenWidth > wordWrapWidth) {
                if (line !== '') {
                    lines += TextMetrics.addLine(line);
                    line = '';
                    width = 0;
                }
                if (TextMetrics.canBreakWords(token, style.breakWords)) {
                    var characters = token.split('');
                    for (var j = 0; j < characters.length; j++) {
                        var char = characters[j];
                        var k = 1;
                        while (characters[j + k]) {
                            var nextChar = characters[j + k];
                            var lastChar = char[char.length - 1];
                            if (!TextMetrics.canBreakChars(lastChar, nextChar, token, j, style.breakWords)) {
                                char += nextChar;
                            } else {
                                break;
                            }
                            k++;
                        }
                        j += char.length - 1;
                        var characterWidth = TextMetrics.getFromCache(char, letterSpacing, cache, context);
                        if (characterWidth + width > wordWrapWidth) {
                            lines += TextMetrics.addLine(line);
                            canPrependSpaces = false;
                            line = '';
                            width = 0;
                        }
                        line += char;
                        width += characterWidth;
                    }
                }
                else {
                        if (line.length > 0) {
                            lines += TextMetrics.addLine(line);
                            line = '';
                            width = 0;
                        }
                        var isLastToken = i === tokens.length - 1;
                        lines += TextMetrics.addLine(token, !isLastToken);
                        canPrependSpaces = false;
                        line = '';
                        width = 0;
                    }
            }
            else {
                    if (tokenWidth + width > wordWrapWidth) {
                        canPrependSpaces = false;
                        lines += TextMetrics.addLine(line);
                        line = '';
                        width = 0;
                    }
                    if (line.length > 0 || !TextMetrics.isBreakingSpace(token) || canPrependSpaces) {
                        line += token;
                        width += tokenWidth;
                    }
                }
        }
        lines += TextMetrics.addLine(line, false);
        return lines;
    };
    TextMetrics.addLine = function addLine(line) {
        var newLine = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
        line = TextMetrics.trimRight(line);
        line = newLine ? line + '\n' : line;
        return line;
    };
    TextMetrics.getFromCache = function getFromCache(key, letterSpacing, cache, context) {
        var width = cache[key];
        if (width === undefined) {
            var spacing = key.length * letterSpacing;
            width = context.measureText(key).width + spacing;
            cache[key] = width;
        }
        return width;
    };
    TextMetrics.collapseSpaces = function collapseSpaces(whiteSpace) {
        return whiteSpace === 'normal' || whiteSpace === 'pre-line';
    };
    TextMetrics.collapseNewlines = function collapseNewlines(whiteSpace) {
        return whiteSpace === 'normal';
    };
    TextMetrics.trimRight = function trimRight(text) {
        if (typeof text !== 'string') {
            return '';
        }
        for (var i = text.length - 1; i >= 0; i--) {
            var char = text[i];
            if (!TextMetrics.isBreakingSpace(char)) {
                break;
            }
            text = text.slice(0, -1);
        }
        return text;
    };
    TextMetrics.isNewline = function isNewline(char) {
        if (typeof char !== 'string') {
            return false;
        }
        return TextMetrics._newlines.indexOf(char.charCodeAt(0)) >= 0;
    };
    TextMetrics.isBreakingSpace = function isBreakingSpace(char) {
        if (typeof char !== 'string') {
            return false;
        }
        return TextMetrics._breakingSpaces.indexOf(char.charCodeAt(0)) >= 0;
    };
    TextMetrics.tokenize = function tokenize(text) {
        var tokens = [];
        var token = '';
        if (typeof text !== 'string') {
            return tokens;
        }
        for (var i = 0; i < text.length; i++) {
            var char = text[i];
            if (TextMetrics.isBreakingSpace(char) || TextMetrics.isNewline(char)) {
                if (token !== '') {
                    tokens.push(token);
                    token = '';
                }
                tokens.push(char);
                continue;
            }
            token += char;
        }
        if (token !== '') {
            tokens.push(token);
        }
        return tokens;
    };
    TextMetrics.canBreakWords = function canBreakWords(token, breakWords) {
        return breakWords;
    };
    TextMetrics.canBreakChars = function canBreakChars(char, nextChar, token, index, breakWords) 
    {
        return true;
    };
    TextMetrics.measureFont = function measureFont(font) {
        if (TextMetrics._fonts[font]) {
            return TextMetrics._fonts[font];
        }
        var properties = {};
        var canvas = TextMetrics._canvas;
        var context = TextMetrics._context;
        context.font = font;
        var metricsString = TextMetrics.METRICS_STRING + TextMetrics.BASELINE_SYMBOL;
        var width = Math.ceil(context.measureText(metricsString).width);
        var baseline = Math.ceil(context.measureText(TextMetrics.BASELINE_SYMBOL).width);
        var height = 2 * baseline;
        baseline = baseline * TextMetrics.BASELINE_MULTIPLIER | 0;
        canvas.width = width;
        canvas.height = height;
        context.fillStyle = '#f00';
        context.fillRect(0, 0, width, height);
        context.font = font;
        context.textBaseline = 'alphabetic';
        context.fillStyle = '#000';
        context.fillText(metricsString, 0, baseline);
        var imagedata = context.getImageData(0, 0, width, height).data;
        var pixels = imagedata.length;
        var line = width * 4;
        var i = 0;
        var idx = 0;
        var stop = false;
        for (i = 0; i < baseline; ++i) {
            for (var j = 0; j < line; j += 4) {
                if (imagedata[idx + j] !== 255) {
                    stop = true;
                    break;
                }
            }
            if (!stop) {
                idx += line;
            } else {
                break;
            }
        }
        properties.ascent = baseline - i;
        idx = pixels - line;
        stop = false;
        for (i = height; i > baseline; --i) {
            for (var _j = 0; _j < line; _j += 4) {
                if (imagedata[idx + _j] !== 255) {
                    stop = true;
                    break;
                }
            }
            if (!stop) {
                idx -= line;
            } else {
                break;
            }
        }
        properties.descent = i - baseline;
        properties.fontSize = properties.ascent + properties.descent;
        TextMetrics._fonts[font] = properties;
        return properties;
    };
    TextMetrics.clearMetrics = function clearMetrics() {
        var font = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
        if (font) {
            delete TextMetrics._fonts[font];
        } else {
            TextMetrics._fonts = {};
        }
    };
    return TextMetrics;
}();
exports.default = TextMetrics;
var canvas = document.createElement('canvas');
canvas.width = canvas.height = 10;
TextMetrics._canvas = canvas;
TextMetrics._context = canvas.getContext('2d');
TextMetrics._fonts = {};
TextMetrics.METRICS_STRING = '|Éq';
TextMetrics.BASELINE_SYMBOL = 'M';
TextMetrics.BASELINE_MULTIPLIER = 1.4;
TextMetrics._newlines = [0x000A, 
0x000D];
TextMetrics._breakingSpaces = [0x0009, 
0x0020, 
0x2000, 
0x2001, 
0x2002, 
0x2003, 
0x2004, 
0x2005, 
0x2006, 
0x2008, 
0x2009, 
0x200A, 
0x205F, 
0x3000];
},{}],110:[function(require,module,exports){
'use strict';
exports.__esModule = true;
var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); 
var _const = require('../const');
var _utils = require('../utils');
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
var defaultStyle = {
    align: 'left',
    breakWords: false,
    dropShadow: false,
    dropShadowAlpha: 1,
    dropShadowAngle: Math.PI / 6,
    dropShadowBlur: 0,
    dropShadowColor: 'black',
    dropShadowDistance: 5,
    fill: 'black',
    fillGradientType: _const.TEXT_GRADIENT.LINEAR_VERTICAL,
    fillGradientStops: [],
    fontFamily: 'Arial',
    fontSize: 26,
    fontStyle: 'normal',
    fontVariant: 'normal',
    fontWeight: 'normal',
    letterSpacing: 0,
    lineHeight: 0,
    lineJoin: 'miter',
    miterLimit: 10,
    padding: 0,
    stroke: 'black',
    strokeThickness: 0,
    textBaseline: 'alphabetic',
    trim: false,
    whiteSpace: 'pre',
    wordWrap: false,
    wordWrapWidth: 100,
    leading: 0
};
var TextStyle = function () {
    function TextStyle(style) {
        _classCallCheck(this, TextStyle);
        this.styleID = 0;
        this.reset();
        deepCopyProperties(this, style, style);
    }
    TextStyle.prototype.clone = function clone() {
        var clonedProperties = {};
        deepCopyProperties(clonedProperties, this, defaultStyle);
        return new TextStyle(clonedProperties);
    };
    TextStyle.prototype.reset = function reset() {
        deepCopyProperties(this, defaultStyle, defaultStyle);
    };
    TextStyle.prototype.toFontString = function toFontString() {
        var fontSizeString = typeof this.fontSize === 'number' ? this.fontSize + 'px' : this.fontSize;
        var fontFamilies = this.fontFamily;
        if (!Array.isArray(this.fontFamily)) {
            fontFamilies = this.fontFamily.split(',');
        }
        for (var i = fontFamilies.length - 1; i >= 0; i--) {
            var fontFamily = fontFamilies[i].trim();
            if (!/([\"\'])[^\'\"]+\1/.test(fontFamily)) {
                fontFamily = '"' + fontFamily + '"';
            }
            fontFamilies[i] = fontFamily;
        }
        return this.fontStyle + ' ' + this.fontVariant + ' ' + this.fontWeight + ' ' + fontSizeString + ' ' + fontFamilies.join(',');
    };
    _createClass(TextStyle, [{
        key: 'align',
        get: function get() {
            return this._align;
        },
        set: function set(align) 
        {
            if (this._align !== align) {
                this._align = align;
                this.styleID++;
            }
        }
    }, {
        key: 'breakWords',
        get: function get() {
            return this._breakWords;
        },
        set: function set(breakWords) 
        {
            if (this._breakWords !== breakWords) {
                this._breakWords = breakWords;
                this.styleID++;
            }
        }
    }, {
        key: 'dropShadow',
        get: function get() {
            return this._dropShadow;
        },
        set: function set(dropShadow) 
        {
            if (this._dropShadow !== dropShadow) {
                this._dropShadow = dropShadow;
                this.styleID++;
            }
        }
    }, {
        key: 'dropShadowAlpha',
        get: function get() {
            return this._dropShadowAlpha;
        },
        set: function set(dropShadowAlpha) 
        {
            if (this._dropShadowAlpha !== dropShadowAlpha) {
                this._dropShadowAlpha = dropShadowAlpha;
                this.styleID++;
            }
        }
    }, {
        key: 'dropShadowAngle',
        get: function get() {
            return this._dropShadowAngle;
        },
        set: function set(dropShadowAngle) 
        {
            if (this._dropShadowAngle !== dropShadowAngle) {
                this._dropShadowAngle = dropShadowAngle;
                this.styleID++;
            }
        }
    }, {
        key: 'dropShadowBlur',
        get: function get() {
            return this._dropShadowBlur;
        },
        set: function set(dropShadowBlur) 
        {
            if (this._dropShadowBlur !== dropShadowBlur) {
                this._dropShadowBlur = dropShadowBlur;
                this.styleID++;
            }
        }
    }, {
        key: 'dropShadowColor',
        get: function get() {
            return this._dropShadowColor;
        },
        set: function set(dropShadowColor) 
        {
            var outputColor = getColor(dropShadowColor);
            if (this._dropShadowColor !== outputColor) {
                this._dropShadowColor = outputColor;
                this.styleID++;
            }
        }
    }, {
        key: 'dropShadowDistance',
        get: function get() {
            return this._dropShadowDistance;
        },
        set: function set(dropShadowDistance) 
        {
            if (this._dropShadowDistance !== dropShadowDistance) {
                this._dropShadowDistance = dropShadowDistance;
                this.styleID++;
            }
        }
    }, {
        key: 'fill',
        get: function get() {
            return this._fill;
        },
        set: function set(fill) 
        {
            var outputColor = getColor(fill);
            if (this._fill !== outputColor) {
                this._fill = outputColor;
                this.styleID++;
            }
        }
    }, {
        key: 'fillGradientType',
        get: function get() {
            return this._fillGradientType;
        },
        set: function set(fillGradientType) 
        {
            if (this._fillGradientType !== fillGradientType) {
                this._fillGradientType = fillGradientType;
                this.styleID++;
            }
        }
    }, {
        key: 'fillGradientStops',
        get: function get() {
            return this._fillGradientStops;
        },
        set: function set(fillGradientStops) 
        {
            if (!areArraysEqual(this._fillGradientStops, fillGradientStops)) {
                this._fillGradientStops = fillGradientStops;
                this.styleID++;
            }
        }
    }, {
        key: 'fontFamily',
        get: function get() {
            return this._fontFamily;
        },
        set: function set(fontFamily) 
        {
            if (this.fontFamily !== fontFamily) {
                this._fontFamily = fontFamily;
                this.styleID++;
            }
        }
    }, {
        key: 'fontSize',
        get: function get() {
            return this._fontSize;
        },
        set: function set(fontSize) 
        {
            if (this._fontSize !== fontSize) {
                this._fontSize = fontSize;
                this.styleID++;
            }
        }
    }, {
        key: 'fontStyle',
        get: function get() {
            return this._fontStyle;
        },
        set: function set(fontStyle) 
        {
            if (this._fontStyle !== fontStyle) {
                this._fontStyle = fontStyle;
                this.styleID++;
            }
        }
    }, {
        key: 'fontVariant',
        get: function get() {
            return this._fontVariant;
        },
        set: function set(fontVariant) 
        {
            if (this._fontVariant !== fontVariant) {
                this._fontVariant = fontVariant;
                this.styleID++;
            }
        }
    }, {
        key: 'fontWeight',
        get: function get() {
            return this._fontWeight;
        },
        set: function set(fontWeight) 
        {
            if (this._fontWeight !== fontWeight) {
                this._fontWeight = fontWeight;
                this.styleID++;
            }
        }
    }, {
        key: 'letterSpacing',
        get: function get() {
            return this._letterSpacing;
        },
        set: function set(letterSpacing) 
        {
            if (this._letterSpacing !== letterSpacing) {
                this._letterSpacing = letterSpacing;
                this.styleID++;
            }
        }
    }, {
        key: 'lineHeight',
        get: function get() {
            return this._lineHeight;
        },
        set: function set(lineHeight) 
        {
            if (this._lineHeight !== lineHeight) {
                this._lineHeight = lineHeight;
                this.styleID++;
            }
        }
    }, {
        key: 'leading',
        get: function get() {
            return this._leading;
        },
        set: function set(leading) 
        {
            if (this._leading !== leading) {
                this._leading = leading;
                this.styleID++;
            }
        }
    }, {
        key: 'lineJoin',
        get: function get() {
            return this._lineJoin;
        },
        set: function set(lineJoin) 
        {
            if (this._lineJoin !== lineJoin) {
                this._lineJoin = lineJoin;
                this.styleID++;
            }
        }
    }, {
        key: 'miterLimit',
        get: function get() {
            return this._miterLimit;
        },
        set: function set(miterLimit) 
        {
            if (this._miterLimit !== miterLimit) {
                this._miterLimit = miterLimit;
                this.styleID++;
            }
        }
    }, {
        key: 'padding',
        get: function get() {
            return this._padding;
        },
        set: function set(padding) 
        {
            if (this._padding !== padding) {
                this._padding = padding;
                this.styleID++;
            }
        }
    }, {
        key: 'stroke',
        get: function get() {
            return this._stroke;
        },
        set: function set(stroke) 
        {
            var outputColor = getColor(stroke);
            if (this._stroke !== outputColor) {
                this._stroke = outputColor;
                this.styleID++;
            }
        }
    }, {
        key: 'strokeThickness',
        get: function get() {
            return this._strokeThickness;
        },
        set: function set(strokeThickness) 
        {
            if (this._strokeThickness !== strokeThickness) {
                this._strokeThickness = strokeThickness;
                this.styleID++;
            }
        }
    }, {
        key: 'textBaseline',
        get: function get() {
            return this._textBaseline;
        },
        set: function set(textBaseline) 
        {
            if (this._textBaseline !== textBaseline) {
                this._textBaseline = textBaseline;
                this.styleID++;
            }
        }
    }, {
        key: 'trim',
        get: function get() {
            return this._trim;
        },
        set: function set(trim) 
        {
            if (this._trim !== trim) {
                this._trim = trim;
                this.styleID++;
            }
        }
    }, {
        key: 'whiteSpace',
        get: function get() {
            return this._whiteSpace;
        },
        set: function set(whiteSpace) 
        {
            if (this._whiteSpace !== whiteSpace) {
                this._whiteSpace = whiteSpace;
                this.styleID++;
            }
        }
    }, {
        key: 'wordWrap',
        get: function get() {
            return this._wordWrap;
        },
        set: function set(wordWrap) 
        {
            if (this._wordWrap !== wordWrap) {
                this._wordWrap = wordWrap;
                this.styleID++;
            }
        }
    }, {
        key: 'wordWrapWidth',
        get: function get() {
            return this._wordWrapWidth;
        },
        set: function set(wordWrapWidth) 
        {
            if (this._wordWrapWidth !== wordWrapWidth) {
                this._wordWrapWidth = wordWrapWidth;
                this.styleID++;
            }
        }
    }]);
    return TextStyle;
}();
exports.default = TextStyle;
function getSingleColor(color) {
    if (typeof color === 'number') {
        return (0, _utils.hex2string)(color);
    } else if (typeof color === 'string') {
        if (color.indexOf('0x') === 0) {
            color = color.replace('0x', '#');
        }
    }
    return color;
}
function getColor(color) {
    if (!Array.isArray(color)) {
        return getSingleColor(color);
    } else {
        for (var i = 0; i < color.length; ++i) {
            color[i] = getSingleColor(color[i]);
        }
        return color;
    }
}
function areArraysEqual(array1, array2) {
    if (!Array.isArray(array1) || !Array.isArray(array2)) {
        return false;
    }
    if (array1.length !== array2.length) {
        return false;
    }
    for (var i = 0; i < array1.length; ++i) {
        if (array1[i] !== array2[i]) {
            return false;
        }
    }
    return true;
}
function deepCopyProperties(target, source, propertyObj) {
    for (var prop in propertyObj) {
        if (Array.isArray(source[prop])) {
            target[prop] = source[prop].slice();
        } else {
            target[prop] = source[prop];
        }
    }
}
},{"../const":46,"../utils":125}],111:[function(require,module,exports){
'use strict';
exports.__esModule = true;
var _BaseTexture2 = require('./BaseTexture');
var _BaseTexture3 = _interopRequireDefault(_BaseTexture2);
var _settings = require('../settings');
var _settings2 = _interopRequireDefault(_settings);
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
var BaseRenderTexture = function (_BaseTexture) {
  _inherits(BaseRenderTexture, _BaseTexture);
  function BaseRenderTexture() {
    var width = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 100;
    var height = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 100;
    var scaleMode = arguments[2];
    var resolution = arguments[3];
    _classCallCheck(this, BaseRenderTexture);
    var _this = _possibleConstructorReturn(this, _BaseTexture.call(this, null, scaleMode));
    _this.resolution = resolution || _settings2.default.RESOLUTION;
    _this.width = Math.ceil(width);
    _this.height = Math.ceil(height);
    _this.realWidth = _this.width * _this.resolution;
    _this.realHeight = _this.height * _this.resolution;
    _this.scaleMode = scaleMode !== undefined ? scaleMode : _settings2.default.SCALE_MODE;
    _this.hasLoaded = true;
    _this._glRenderTargets = {};
    _this._canvasRenderTarget = null;
    _this.valid = false;
    return _this;
  }
  BaseRenderTexture.prototype.resize = function resize(width, height) {
    width = Math.ceil(width);
    height = Math.ceil(height);
    if (width === this.width && height === this.height) {
      return;
    }
    this.valid = width > 0 && height > 0;
    this.width = width;
    this.height = height;
    this.realWidth = this.width * this.resolution;
    this.realHeight = this.height * this.resolution;
    if (!this.valid) {
      return;
    }
    this.emit('update', this);
  };
  BaseRenderTexture.prototype.destroy = function destroy() {
    _BaseTexture.prototype.destroy.call(this, true);
    this.renderer = null;
  };
  return BaseRenderTexture;
}(_BaseTexture3.default);
exports.default = BaseRenderTexture;
},{"../settings":101,"./BaseTexture":112}],112:[function(require,module,exports){
'use strict';
exports.__esModule = true;
var _utils = require('../utils');
var _settings = require('../settings');
var _settings2 = _interopRequireDefault(_settings);
var _eventemitter = require('eventemitter3');
var _eventemitter2 = _interopRequireDefault(_eventemitter);
var _determineCrossOrigin = require('../utils/determineCrossOrigin');
var _determineCrossOrigin2 = _interopRequireDefault(_determineCrossOrigin);
var _bitTwiddle = require('bit-twiddle');
var _bitTwiddle2 = _interopRequireDefault(_bitTwiddle);
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
var BaseTexture = function (_EventEmitter) {
    _inherits(BaseTexture, _EventEmitter);
    function BaseTexture(source, scaleMode, resolution) {
        _classCallCheck(this, BaseTexture);
        var _this = _possibleConstructorReturn(this, _EventEmitter.call(this));
        _this.uid = (0, _utils.uid)();
        _this.touched = 0;
        _this.resolution = resolution || _settings2.default.RESOLUTION;
        _this.width = 100;
        _this.height = 100;
        _this.realWidth = 100;
        _this.realHeight = 100;
        _this.scaleMode = scaleMode !== undefined ? scaleMode : _settings2.default.SCALE_MODE;
        _this.hasLoaded = false;
        _this.isLoading = false;
        _this.source = null; 
        _this.origSource = null; 
        _this.imageType = null; 
        _this.sourceScale = 1.0;
        _this.premultipliedAlpha = true;
        _this.imageUrl = null;
        _this.isPowerOfTwo = false;
        _this.mipmap = _settings2.default.MIPMAP_TEXTURES;
        _this.wrapMode = _settings2.default.WRAP_MODE;
        _this._glTextures = {};
        _this._enabled = 0;
        _this._virtalBoundId = -1;
        _this._destroyed = false;
        _this.textureCacheIds = [];
        if (source) {
            _this.loadSource(source);
        }
        return _this;
    }
    BaseTexture.prototype.update = function update() {
        if (this.imageType !== 'svg') {
            this.realWidth = this.source.naturalWidth || this.source.videoWidth || this.source.width;
            this.realHeight = this.source.naturalHeight || this.source.videoHeight || this.source.height;
            this._updateDimensions();
        }
        this.emit('update', this);
    };
    BaseTexture.prototype._updateDimensions = function _updateDimensions() {
        this.width = this.realWidth / this.resolution;
        this.height = this.realHeight / this.resolution;
        this.isPowerOfTwo = _bitTwiddle2.default.isPow2(this.realWidth) && _bitTwiddle2.default.isPow2(this.realHeight);
    };
    BaseTexture.prototype.loadSource = function loadSource(source) {
        var wasLoading = this.isLoading;
        this.hasLoaded = false;
        this.isLoading = false;
        if (wasLoading && this.source) {
            this.source.onload = null;
            this.source.onerror = null;
        }
        var firstSourceLoaded = !this.source;
        this.source = source;
        if ((source.src && source.complete || source.getContext) && source.width && source.height) {
            this._updateImageType();
            if (this.imageType === 'svg') {
                this._loadSvgSource();
            } else {
                this._sourceLoaded();
            }
            if (firstSourceLoaded) {
                this.emit('loaded', this);
            }
        } else if (!source.getContext) {
            this.isLoading = true;
            var scope = this;
            source.onload = function () {
                scope._updateImageType();
                source.onload = null;
                source.onerror = null;
                if (!scope.isLoading) {
                    return;
                }
                scope.isLoading = false;
                scope._sourceLoaded();
                if (scope.imageType === 'svg') {
                    scope._loadSvgSource();
                    return;
                }
                scope.emit('loaded', scope);
            };
            source.onerror = function () {
                source.onload = null;
                source.onerror = null;
                if (!scope.isLoading) {
                    return;
                }
                scope.isLoading = false;
                scope.emit('error', scope);
            };
            if (source.complete && source.src) {
                source.onload = null;
                source.onerror = null;
                if (scope.imageType === 'svg') {
                    scope._loadSvgSource();
                    return;
                }
                this.isLoading = false;
                if (source.width && source.height) {
                    this._sourceLoaded();
                    if (wasLoading) {
                        this.emit('loaded', this);
                    }
                }
                else if (wasLoading) {
                        this.emit('error', this);
                    }
            }
        }
    };
    BaseTexture.prototype._updateImageType = function _updateImageType() {
        if (!this.imageUrl) {
            return;
        }
        var dataUri = (0, _utils.decomposeDataUri)(this.imageUrl);
        var imageType = void 0;
        if (dataUri && dataUri.mediaType === 'image') {
            var firstSubType = dataUri.subType.split('+')[0];
            imageType = (0, _utils.getUrlFileExtension)('.' + firstSubType);
            if (!imageType) {
                throw new Error('Invalid image type in data URI.');
            }
        } else {
            imageType = (0, _utils.getUrlFileExtension)(this.imageUrl);
            if (!imageType) {
                imageType = 'png';
            }
        }
        this.imageType = imageType;
    };
    BaseTexture.prototype._loadSvgSource = function _loadSvgSource() {
        if (this.imageType !== 'svg') {
            return;
        }
        var dataUri = (0, _utils.decomposeDataUri)(this.imageUrl);
        if (dataUri) {
            this._loadSvgSourceUsingDataUri(dataUri);
        } else {
            this._loadSvgSourceUsingXhr();
        }
    };
    BaseTexture.prototype._loadSvgSourceUsingDataUri = function _loadSvgSourceUsingDataUri(dataUri) {
        var svgString = void 0;
        if (dataUri.encoding === 'base64') {
            if (!atob) {
                throw new Error('Your browser doesn\'t support base64 conversions.');
            }
            svgString = atob(dataUri.data);
        } else {
            svgString = dataUri.data;
        }
        this._loadSvgSourceUsingString(svgString);
    };
    BaseTexture.prototype._loadSvgSourceUsingXhr = function _loadSvgSourceUsingXhr() {
        var _this2 = this;
        var svgXhr = new XMLHttpRequest();
        svgXhr.onload = function () {
            if (svgXhr.readyState !== svgXhr.DONE || svgXhr.status !== 200) {
                throw new Error('Failed to load SVG using XHR.');
            }
            _this2._loadSvgSourceUsingString(svgXhr.response);
        };
        svgXhr.onerror = function () {
            return _this2.emit('error', _this2);
        };
        svgXhr.open('GET', this.imageUrl, true);
        svgXhr.send();
    };
    BaseTexture.prototype._loadSvgSourceUsingString = function _loadSvgSourceUsingString(svgString) {
        var svgSize = (0, _utils.getSvgSize)(svgString);
        var svgWidth = svgSize.width;
        var svgHeight = svgSize.height;
        if (!svgWidth || !svgHeight) {
            throw new Error('The SVG image must have width and height defined (in pixels), canvas API needs them.');
        }
        this.realWidth = Math.round(svgWidth * this.sourceScale);
        this.realHeight = Math.round(svgHeight * this.sourceScale);
        this._updateDimensions();
        var canvas = document.createElement('canvas');
        canvas.width = this.realWidth;
        canvas.height = this.realHeight;
        canvas._pixiId = 'canvas_' + (0, _utils.uid)();
        canvas.getContext('2d').drawImage(this.source, 0, 0, svgWidth, svgHeight, 0, 0, this.realWidth, this.realHeight);
        this.origSource = this.source;
        this.source = canvas;
        BaseTexture.addToCache(this, canvas._pixiId);
        this.isLoading = false;
        this._sourceLoaded();
        this.emit('loaded', this);
    };
    BaseTexture.prototype._sourceLoaded = function _sourceLoaded() {
        this.hasLoaded = true;
        this.update();
    };
    BaseTexture.prototype.destroy = function destroy() {
        if (this.imageUrl) {
            delete _utils.TextureCache[this.imageUrl];
            this.imageUrl = null;
            if (!navigator.isCocoonJS) {
                this.source.src = '';
            }
        }
        this.source = null;
        this.dispose();
        BaseTexture.removeFromCache(this);
        this.textureCacheIds = null;
        this._destroyed = true;
    };
    BaseTexture.prototype.dispose = function dispose() {
        this.emit('dispose', this);
    };
    BaseTexture.prototype.updateSourceImage = function updateSourceImage(newSrc) {
        this.source.src = newSrc;
        this.loadSource(this.source);
    };
    BaseTexture.fromImage = function fromImage(imageUrl, crossorigin, scaleMode, sourceScale) {
        var baseTexture = _utils.BaseTextureCache[imageUrl];
        if (!baseTexture) {
            var image = new Image(); 
            if (crossorigin === undefined && imageUrl.indexOf('data:') !== 0) {
                image.crossOrigin = (0, _determineCrossOrigin2.default)(imageUrl);
            } else if (crossorigin) {
                image.crossOrigin = typeof crossorigin === 'string' ? crossorigin : 'anonymous';
            }
            baseTexture = new BaseTexture(image, scaleMode);
            baseTexture.imageUrl = imageUrl;
            if (sourceScale) {
                baseTexture.sourceScale = sourceScale;
            }
            baseTexture.resolution = (0, _utils.getResolutionOfUrl)(imageUrl);
            image.src = imageUrl; 
            BaseTexture.addToCache(baseTexture, imageUrl);
        }
        return baseTexture;
    };
    BaseTexture.fromCanvas = function fromCanvas(canvas, scaleMode) {
        var origin = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'canvas';
        if (!canvas._pixiId) {
            canvas._pixiId = origin + '_' + (0, _utils.uid)();
        }
        var baseTexture = _utils.BaseTextureCache[canvas._pixiId];
        if (!baseTexture) {
            baseTexture = new BaseTexture(canvas, scaleMode);
            BaseTexture.addToCache(baseTexture, canvas._pixiId);
        }
        return baseTexture;
    };
    BaseTexture.from = function from(source, scaleMode, sourceScale) {
        if (typeof source === 'string') {
            return BaseTexture.fromImage(source, undefined, scaleMode, sourceScale);
        } else if (source instanceof HTMLImageElement) {
            var imageUrl = source.src;
            var baseTexture = _utils.BaseTextureCache[imageUrl];
            if (!baseTexture) {
                baseTexture = new BaseTexture(source, scaleMode);
                baseTexture.imageUrl = imageUrl;
                if (sourceScale) {
                    baseTexture.sourceScale = sourceScale;
                }
                baseTexture.resolution = (0, _utils.getResolutionOfUrl)(imageUrl);
                BaseTexture.addToCache(baseTexture, imageUrl);
            }
            return baseTexture;
        } else if (source instanceof HTMLCanvasElement) {
            return BaseTexture.fromCanvas(source, scaleMode);
        }
        return source;
    };
    BaseTexture.addToCache = function addToCache(baseTexture, id) {
        if (id) {
            if (baseTexture.textureCacheIds.indexOf(id) === -1) {
                baseTexture.textureCacheIds.push(id);
            }
            if (_utils.BaseTextureCache[id]) {
                console.warn('BaseTexture added to the cache with an id [' + id + '] that already had an entry');
            }
            _utils.BaseTextureCache[id] = baseTexture;
        }
    };
    BaseTexture.removeFromCache = function removeFromCache(baseTexture) {
        if (typeof baseTexture === 'string') {
            var baseTextureFromCache = _utils.BaseTextureCache[baseTexture];
            if (baseTextureFromCache) {
                var index = baseTextureFromCache.textureCacheIds.indexOf(baseTexture);
                if (index > -1) {
                    baseTextureFromCache.textureCacheIds.splice(index, 1);
                }
                delete _utils.BaseTextureCache[baseTexture];
                return baseTextureFromCache;
            }
        } else if (baseTexture && baseTexture.textureCacheIds) {
            for (var i = 0; i < baseTexture.textureCacheIds.length; ++i) {
                delete _utils.BaseTextureCache[baseTexture.textureCacheIds[i]];
            }
            baseTexture.textureCacheIds.length = 0;
            return baseTexture;
        }
        return null;
    };
    return BaseTexture;
}(_eventemitter2.default);
exports.default = BaseTexture;
},{"../settings":101,"../utils":125,"../utils/determineCrossOrigin":124,"bit-twiddle":1,"eventemitter3":3}],113:[function(require,module,exports){
'use strict';
exports.__esModule = true;
var _BaseRenderTexture = require('./BaseRenderTexture');
var _BaseRenderTexture2 = _interopRequireDefault(_BaseRenderTexture);
var _Texture2 = require('./Texture');
var _Texture3 = _interopRequireDefault(_Texture2);
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
var RenderTexture = function (_Texture) {
    _inherits(RenderTexture, _Texture);
    function RenderTexture(baseRenderTexture, frame) {
        _classCallCheck(this, RenderTexture);
        var _legacyRenderer = null;
        if (!(baseRenderTexture instanceof _BaseRenderTexture2.default)) {
            var width = arguments[1];
            var height = arguments[2];
            var scaleMode = arguments[3];
            var resolution = arguments[4];
            console.warn('Please use RenderTexture.create(' + width + ', ' + height + ') instead of the ctor directly.');
            _legacyRenderer = arguments[0];
            frame = null;
            baseRenderTexture = new _BaseRenderTexture2.default(width, height, scaleMode, resolution);
        }
        var _this = _possibleConstructorReturn(this, _Texture.call(this, baseRenderTexture, frame));
        _this.legacyRenderer = _legacyRenderer;
        _this.valid = true;
        _this._updateUvs();
        return _this;
    }
    RenderTexture.prototype.resize = function resize(width, height, doNotResizeBaseTexture) {
        width = Math.ceil(width);
        height = Math.ceil(height);
        this.valid = width > 0 && height > 0;
        this._frame.width = this.orig.width = width;
        this._frame.height = this.orig.height = height;
        if (!doNotResizeBaseTexture) {
            this.baseTexture.resize(width, height);
        }
        this._updateUvs();
    };
    RenderTexture.create = function create(width, height, scaleMode, resolution) {
        return new RenderTexture(new _BaseRenderTexture2.default(width, height, scaleMode, resolution));
    };
    return RenderTexture;
}(_Texture3.default);
exports.default = RenderTexture;
},{"./BaseRenderTexture":111,"./Texture":115}],114:[function(require,module,exports){
'use strict';
exports.__esModule = true;
var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
var _ = require('../');
var _utils = require('../utils');
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
var Spritesheet = function () {
    _createClass(Spritesheet, null, [{
        key: 'BATCH_SIZE',
        get: function get() {
            return 1000;
        }
    }]);
    function Spritesheet(baseTexture, data) {
        var resolutionFilename = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
        _classCallCheck(this, Spritesheet);
        this.baseTexture = baseTexture;
        this.textures = {};
        this.data = data;
        this.resolution = this._updateResolution(resolutionFilename || this.baseTexture.imageUrl);
        this._frames = this.data.frames;
        this._frameKeys = Object.keys(this._frames);
        this._batchIndex = 0;
        this._callback = null;
    }
    Spritesheet.prototype._updateResolution = function _updateResolution(resolutionFilename) {
        var scale = this.data.meta.scale;
        var resolution = (0, _utils.getResolutionOfUrl)(resolutionFilename, null);
        if (resolution === null) {
            resolution = scale !== undefined ? parseFloat(scale) : 1;
        }
        if (resolution !== 1) {
            this.baseTexture.resolution = resolution;
            this.baseTexture.update();
        }
        return resolution;
    };
    Spritesheet.prototype.parse = function parse(callback) {
        this._batchIndex = 0;
        this._callback = callback;
        if (this._frameKeys.length <= Spritesheet.BATCH_SIZE) {
            this._processFrames(0);
            this._parseComplete();
        } else {
            this._nextBatch();
        }
    };
    Spritesheet.prototype._processFrames = function _processFrames(initialFrameIndex) {
        var frameIndex = initialFrameIndex;
        var maxFrames = Spritesheet.BATCH_SIZE;
        var sourceScale = this.baseTexture.sourceScale;
        while (frameIndex - initialFrameIndex < maxFrames && frameIndex < this._frameKeys.length) {
            var i = this._frameKeys[frameIndex];
            var data = this._frames[i];
            var rect = data.frame;
            if (rect) {
                var frame = null;
                var trim = null;
                var sourceSize = data.trimmed !== false && data.sourceSize ? data.sourceSize : data.frame;
                var orig = new _.Rectangle(0, 0, Math.floor(sourceSize.w * sourceScale) / this.resolution, Math.floor(sourceSize.h * sourceScale) / this.resolution);
                if (data.rotated) {
                    frame = new _.Rectangle(Math.floor(rect.x * sourceScale) / this.resolution, Math.floor(rect.y * sourceScale) / this.resolution, Math.floor(rect.h * sourceScale) / this.resolution, Math.floor(rect.w * sourceScale) / this.resolution);
                } else {
                    frame = new _.Rectangle(Math.floor(rect.x * sourceScale) / this.resolution, Math.floor(rect.y * sourceScale) / this.resolution, Math.floor(rect.w * sourceScale) / this.resolution, Math.floor(rect.h * sourceScale) / this.resolution);
                }
                if (data.trimmed !== false && data.spriteSourceSize) {
                    trim = new _.Rectangle(Math.floor(data.spriteSourceSize.x * sourceScale) / this.resolution, Math.floor(data.spriteSourceSize.y * sourceScale) / this.resolution, Math.floor(rect.w * sourceScale) / this.resolution, Math.floor(rect.h * sourceScale) / this.resolution);
                }
                this.textures[i] = new _.Texture(this.baseTexture, frame, orig, trim, data.rotated ? 2 : 0);
                _.Texture.addToCache(this.textures[i], i);
            }
            frameIndex++;
        }
    };
    Spritesheet.prototype._parseComplete = function _parseComplete() {
        var callback = this._callback;
        this._callback = null;
        this._batchIndex = 0;
        callback.call(this, this.textures);
    };
    Spritesheet.prototype._nextBatch = function _nextBatch() {
        var _this = this;
        this._processFrames(this._batchIndex * Spritesheet.BATCH_SIZE);
        this._batchIndex++;
        setTimeout(function () {
            if (_this._batchIndex * Spritesheet.BATCH_SIZE < _this._frameKeys.length) {
                _this._nextBatch();
            } else {
                _this._parseComplete();
            }
        }, 0);
    };
    Spritesheet.prototype.destroy = function destroy() {
        var destroyBase = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
        for (var i in this.textures) {
            this.textures[i].destroy();
        }
        this._frames = null;
        this._frameKeys = null;
        this.data = null;
        this.textures = null;
        if (destroyBase) {
            this.baseTexture.destroy();
        }
        this.baseTexture = null;
    };
    return Spritesheet;
}();
exports.default = Spritesheet;
},{"../":65,"../utils":125}],115:[function(require,module,exports){
'use strict';
exports.__esModule = true;
var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
var _BaseTexture = require('./BaseTexture');
var _BaseTexture2 = _interopRequireDefault(_BaseTexture);
var _VideoBaseTexture = require('./VideoBaseTexture');
var _VideoBaseTexture2 = _interopRequireDefault(_VideoBaseTexture);
var _TextureUvs = require('./TextureUvs');
var _TextureUvs2 = _interopRequireDefault(_TextureUvs);
var _eventemitter = require('eventemitter3');
var _eventemitter2 = _interopRequireDefault(_eventemitter);
var _math = require('../math');
var _utils = require('../utils');
var _settings = require('../settings');
var _settings2 = _interopRequireDefault(_settings);
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
var Texture = function (_EventEmitter) {
    _inherits(Texture, _EventEmitter);
    function Texture(baseTexture, frame, orig, trim, rotate) {
        _classCallCheck(this, Texture);
        var _this = _possibleConstructorReturn(this, _EventEmitter.call(this));
        _this.noFrame = false;
        if (!frame) {
            _this.noFrame = true;
            frame = new _math.Rectangle(0, 0, 1, 1);
        }
        if (baseTexture instanceof Texture) {
            baseTexture = baseTexture.baseTexture;
        }
        _this.baseTexture = baseTexture;
        _this._frame = frame;
        _this.trim = trim;
        _this.valid = false;
        _this.requiresUpdate = false;
        _this._uvs = null;
        _this.orig = orig || frame; 
        _this._rotate = Number(rotate || 0);
        if (rotate === true) {
            _this._rotate = 2;
        } else if (_this._rotate % 2 !== 0) {
            throw new Error('attempt to use diamond-shaped UVs. If you are sure, set rotation manually');
        }
        if (baseTexture.hasLoaded) {
            if (_this.noFrame) {
                frame = new _math.Rectangle(0, 0, baseTexture.width, baseTexture.height);
                baseTexture.on('update', _this.onBaseTextureUpdated, _this);
            }
            _this.frame = frame;
        } else {
            baseTexture.once('loaded', _this.onBaseTextureLoaded, _this);
        }
        _this._updateID = 0;
        _this.transform = null;
        _this.textureCacheIds = [];
        return _this;
    }
    Texture.prototype.update = function update() {
        this.baseTexture.update();
    };
    Texture.prototype.onBaseTextureLoaded = function onBaseTextureLoaded(baseTexture) {
        this._updateID++;
        if (this.noFrame) {
            this.frame = new _math.Rectangle(0, 0, baseTexture.width, baseTexture.height);
        } else {
            this.frame = this._frame;
        }
        this.baseTexture.on('update', this.onBaseTextureUpdated, this);
        this.emit('update', this);
    };
    Texture.prototype.onBaseTextureUpdated = function onBaseTextureUpdated(baseTexture) {
        this._updateID++;
        this._frame.width = baseTexture.width;
        this._frame.height = baseTexture.height;
        this.emit('update', this);
    };
    Texture.prototype.destroy = function destroy(destroyBase) {
        if (this.baseTexture) {
            if (destroyBase) {
                if (_utils.TextureCache[this.baseTexture.imageUrl]) {
                    Texture.removeFromCache(this.baseTexture.imageUrl);
                }
                this.baseTexture.destroy();
            }
            this.baseTexture.off('update', this.onBaseTextureUpdated, this);
            this.baseTexture.off('loaded', this.onBaseTextureLoaded, this);
            this.baseTexture = null;
        }
        this._frame = null;
        this._uvs = null;
        this.trim = null;
        this.orig = null;
        this.valid = false;
        Texture.removeFromCache(this);
        this.textureCacheIds = null;
    };
    Texture.prototype.clone = function clone() {
        return new Texture(this.baseTexture, this.frame, this.orig, this.trim, this.rotate);
    };
    Texture.prototype._updateUvs = function _updateUvs() {
        if (!this._uvs) {
            this._uvs = new _TextureUvs2.default();
        }
        this._uvs.set(this._frame, this.baseTexture, this.rotate);
        this._updateID++;
    };
    Texture.fromImage = function fromImage(imageUrl, crossorigin, scaleMode, sourceScale) {
        var texture = _utils.TextureCache[imageUrl];
        if (!texture) {
            texture = new Texture(_BaseTexture2.default.fromImage(imageUrl, crossorigin, scaleMode, sourceScale));
            Texture.addToCache(texture, imageUrl);
        }
        return texture;
    };
    Texture.fromFrame = function fromFrame(frameId) {
        var texture = _utils.TextureCache[frameId];
        if (!texture) {
            throw new Error('The frameId "' + frameId + '" does not exist in the texture cache');
        }
        return texture;
    };
    Texture.fromCanvas = function fromCanvas(canvas, scaleMode) {
        var origin = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'canvas';
        return new Texture(_BaseTexture2.default.fromCanvas(canvas, scaleMode, origin));
    };
    Texture.fromVideo = function fromVideo(video, scaleMode) {
        if (typeof video === 'string') {
            return Texture.fromVideoUrl(video, scaleMode);
        }
        return new Texture(_VideoBaseTexture2.default.fromVideo(video, scaleMode));
    };
    Texture.fromVideoUrl = function fromVideoUrl(videoUrl, scaleMode) {
        return new Texture(_VideoBaseTexture2.default.fromUrl(videoUrl, scaleMode));
    };
    Texture.from = function from(source) {
        if (typeof source === 'string') {
            var texture = _utils.TextureCache[source];
            if (!texture) {
                var isVideo = source.match(/\.(mp4|webm|ogg|h264|avi|mov)$/) !== null;
                if (isVideo) {
                    return Texture.fromVideoUrl(source);
                }
                return Texture.fromImage(source);
            }
            return texture;
        } else if (source instanceof HTMLImageElement) {
            return new Texture(_BaseTexture2.default.from(source));
        } else if (source instanceof HTMLCanvasElement) {
            return Texture.fromCanvas(source, _settings2.default.SCALE_MODE, 'HTMLCanvasElement');
        } else if (source instanceof HTMLVideoElement) {
            return Texture.fromVideo(source);
        } else if (source instanceof _BaseTexture2.default) {
            return new Texture(source);
        }
        return source;
    };
    Texture.fromLoader = function fromLoader(source, imageUrl, name) {
        var baseTexture = new _BaseTexture2.default(source, undefined, (0, _utils.getResolutionOfUrl)(imageUrl));
        var texture = new Texture(baseTexture);
        baseTexture.imageUrl = imageUrl;
        if (!name) {
            name = imageUrl;
        }
        _BaseTexture2.default.addToCache(texture.baseTexture, name);
        Texture.addToCache(texture, name);
        if (name !== imageUrl) {
            _BaseTexture2.default.addToCache(texture.baseTexture, imageUrl);
            Texture.addToCache(texture, imageUrl);
        }
        return texture;
    };
    Texture.addToCache = function addToCache(texture, id) {
        if (id) {
            if (texture.textureCacheIds.indexOf(id) === -1) {
                texture.textureCacheIds.push(id);
            }
            if (_utils.TextureCache[id]) {
                console.warn('Texture added to the cache with an id [' + id + '] that already had an entry');
            }
            _utils.TextureCache[id] = texture;
        }
    };
    Texture.removeFromCache = function removeFromCache(texture) {
        if (typeof texture === 'string') {
            var textureFromCache = _utils.TextureCache[texture];
            if (textureFromCache) {
                var index = textureFromCache.textureCacheIds.indexOf(texture);
                if (index > -1) {
                    textureFromCache.textureCacheIds.splice(index, 1);
                }
                delete _utils.TextureCache[texture];
                return textureFromCache;
            }
        } else if (texture && texture.textureCacheIds) {
            for (var i = 0; i < texture.textureCacheIds.length; ++i) {
                if (_utils.TextureCache[texture.textureCacheIds[i]] === texture) {
                    delete _utils.TextureCache[texture.textureCacheIds[i]];
                }
            }
            texture.textureCacheIds.length = 0;
            return texture;
        }
        return null;
    };
    _createClass(Texture, [{
        key: 'frame',
        get: function get() {
            return this._frame;
        },
        set: function set(frame) 
        {
            this._frame = frame;
            this.noFrame = false;
            var x = frame.x,
                y = frame.y,
                width = frame.width,
                height = frame.height;
            var xNotFit = x + width > this.baseTexture.width;
            var yNotFit = y + height > this.baseTexture.height;
            if (xNotFit || yNotFit) {
                var relationship = xNotFit && yNotFit ? 'and' : 'or';
                var errorX = 'X: ' + x + ' + ' + width + ' = ' + (x + width) + ' > ' + this.baseTexture.width;
                var errorY = 'Y: ' + y + ' + ' + height + ' = ' + (y + height) + ' > ' + this.baseTexture.height;
                throw new Error('Texture Error: frame does not fit inside the base Texture dimensions: ' + (errorX + ' ' + relationship + ' ' + errorY));
            }
            this.valid = width && height && this.baseTexture.hasLoaded;
            if (!this.trim && !this.rotate) {
                this.orig = frame;
            }
            if (this.valid) {
                this._updateUvs();
            }
        }
    }, {
        key: 'rotate',
        get: function get() {
            return this._rotate;
        },
        set: function set(rotate) 
        {
            this._rotate = rotate;
            if (this.valid) {
                this._updateUvs();
            }
        }
    }, {
        key: 'width',
        get: function get() {
            return this.orig.width;
        }
    }, {
        key: 'height',
        get: function get() {
            return this.orig.height;
        }
    }]);
    return Texture;
}(_eventemitter2.default);
exports.default = Texture;
function createWhiteTexture() {
    var canvas = document.createElement('canvas');
    canvas.width = 10;
    canvas.height = 10;
    var context = canvas.getContext('2d');
    context.fillStyle = 'white';
    context.fillRect(0, 0, 10, 10);
    return new Texture(new _BaseTexture2.default(canvas));
}
function removeAllHandlers(tex) {
    tex.destroy = function _emptyDestroy() {};
    tex.on = function _emptyOn() {};
    tex.once = function _emptyOnce() {};
    tex.emit = function _emptyEmit() {};
}
Texture.EMPTY = new Texture(new _BaseTexture2.default());
removeAllHandlers(Texture.EMPTY);
removeAllHandlers(Texture.EMPTY.baseTexture);
Texture.WHITE = createWhiteTexture();
removeAllHandlers(Texture.WHITE);
removeAllHandlers(Texture.WHITE.baseTexture);
},{"../math":70,"../settings":101,"../utils":125,"./BaseTexture":112,"./TextureUvs":117,"./VideoBaseTexture":118,"eventemitter3":3}],116:[function(require,module,exports){
'use strict';
exports.__esModule = true;
var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
var _Matrix = require('../math/Matrix');
var _Matrix2 = _interopRequireDefault(_Matrix);
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
var tempMat = new _Matrix2.default();
var TextureMatrix = function () {
    function TextureMatrix(texture, clampMargin) {
        _classCallCheck(this, TextureMatrix);
        this._texture = texture;
        this.mapCoord = new _Matrix2.default();
        this.uClampFrame = new Float32Array(4);
        this.uClampOffset = new Float32Array(2);
        this._lastTextureID = -1;
        this.clampOffset = 0;
        this.clampMargin = typeof clampMargin === 'undefined' ? 0.5 : clampMargin;
    }
    TextureMatrix.prototype.multiplyUvs = function multiplyUvs(uvs, out) {
        if (out === undefined) {
            out = uvs;
        }
        var mat = this.mapCoord;
        for (var i = 0; i < uvs.length; i += 2) {
            var x = uvs[i];
            var y = uvs[i + 1];
            out[i] = x * mat.a + y * mat.c + mat.tx;
            out[i + 1] = x * mat.b + y * mat.d + mat.ty;
        }
        return out;
    };
    TextureMatrix.prototype.update = function update(forceUpdate) {
        var tex = this._texture;
        if (!tex || !tex.valid) {
            return false;
        }
        if (!forceUpdate && this._lastTextureID === tex._updateID) {
            return false;
        }
        this._lastTextureID = tex._updateID;
        var uvs = tex._uvs;
        this.mapCoord.set(uvs.x1 - uvs.x0, uvs.y1 - uvs.y0, uvs.x3 - uvs.x0, uvs.y3 - uvs.y0, uvs.x0, uvs.y0);
        var orig = tex.orig;
        var trim = tex.trim;
        if (trim) {
            tempMat.set(orig.width / trim.width, 0, 0, orig.height / trim.height, -trim.x / trim.width, -trim.y / trim.height);
            this.mapCoord.append(tempMat);
        }
        var texBase = tex.baseTexture;
        var frame = this.uClampFrame;
        var margin = this.clampMargin / texBase.resolution;
        var offset = this.clampOffset;
        frame[0] = (tex._frame.x + margin + offset) / texBase.width;
        frame[1] = (tex._frame.y + margin + offset) / texBase.height;
        frame[2] = (tex._frame.x + tex._frame.width - margin + offset) / texBase.width;
        frame[3] = (tex._frame.y + tex._frame.height - margin + offset) / texBase.height;
        this.uClampOffset[0] = offset / texBase.realWidth;
        this.uClampOffset[1] = offset / texBase.realHeight;
        return true;
    };
    _createClass(TextureMatrix, [{
        key: 'texture',
        get: function get() {
            return this._texture;
        },
        set: function set(value) 
        {
            this._texture = value;
            this._lastTextureID = -1;
        }
    }]);
    return TextureMatrix;
}();
exports.default = TextureMatrix;
},{"../math/Matrix":67}],117:[function(require,module,exports){
'use strict';
exports.__esModule = true;
var _GroupD = require('../math/GroupD8');
var _GroupD2 = _interopRequireDefault(_GroupD);
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
var TextureUvs = function () {
    function TextureUvs() {
        _classCallCheck(this, TextureUvs);
        this.x0 = 0;
        this.y0 = 0;
        this.x1 = 1;
        this.y1 = 0;
        this.x2 = 1;
        this.y2 = 1;
        this.x3 = 0;
        this.y3 = 1;
        this.uvsUint32 = new Uint32Array(4);
    }
    TextureUvs.prototype.set = function set(frame, baseFrame, rotate) {
        var tw = baseFrame.width;
        var th = baseFrame.height;
        if (rotate) {
            var w2 = frame.width / 2 / tw;
            var h2 = frame.height / 2 / th;
            var cX = frame.x / tw + w2;
            var cY = frame.y / th + h2;
            rotate = _GroupD2.default.add(rotate, _GroupD2.default.NW); 
            this.x0 = cX + w2 * _GroupD2.default.uX(rotate);
            this.y0 = cY + h2 * _GroupD2.default.uY(rotate);
            rotate = _GroupD2.default.add(rotate, 2); 
            this.x1 = cX + w2 * _GroupD2.default.uX(rotate);
            this.y1 = cY + h2 * _GroupD2.default.uY(rotate);
            rotate = _GroupD2.default.add(rotate, 2);
            this.x2 = cX + w2 * _GroupD2.default.uX(rotate);
            this.y2 = cY + h2 * _GroupD2.default.uY(rotate);
            rotate = _GroupD2.default.add(rotate, 2);
            this.x3 = cX + w2 * _GroupD2.default.uX(rotate);
            this.y3 = cY + h2 * _GroupD2.default.uY(rotate);
        } else {
            this.x0 = frame.x / tw;
            this.y0 = frame.y / th;
            this.x1 = (frame.x + frame.width) / tw;
            this.y1 = frame.y / th;
            this.x2 = (frame.x + frame.width) / tw;
            this.y2 = (frame.y + frame.height) / th;
            this.x3 = frame.x / tw;
            this.y3 = (frame.y + frame.height) / th;
        }
        this.uvsUint32[0] = (this.y0 * 65535 & 0xFFFF) << 16 | this.x0 * 65535 & 0xFFFF;
        this.uvsUint32[1] = (this.y1 * 65535 & 0xFFFF) << 16 | this.x1 * 65535 & 0xFFFF;
        this.uvsUint32[2] = (this.y2 * 65535 & 0xFFFF) << 16 | this.x2 * 65535 & 0xFFFF;
        this.uvsUint32[3] = (this.y3 * 65535 & 0xFFFF) << 16 | this.x3 * 65535 & 0xFFFF;
    };
    return TextureUvs;
}();
exports.default = TextureUvs;
},{"../math/GroupD8":66}],118:[function(require,module,exports){
'use strict';
exports.__esModule = true;
var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
var _BaseTexture2 = require('./BaseTexture');
var _BaseTexture3 = _interopRequireDefault(_BaseTexture2);
var _utils = require('../utils');
var _ticker = require('../ticker');
var _const = require('../const');
var _determineCrossOrigin = require('../utils/determineCrossOrigin');
var _determineCrossOrigin2 = _interopRequireDefault(_determineCrossOrigin);
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
var VideoBaseTexture = function (_BaseTexture) {
    _inherits(VideoBaseTexture, _BaseTexture);
    function VideoBaseTexture(source, scaleMode) {
        _classCallCheck(this, VideoBaseTexture);
        if (!source) {
            throw new Error('No video source element specified.');
        }
        if ((source.readyState === source.HAVE_ENOUGH_DATA || source.readyState === source.HAVE_FUTURE_DATA) && source.width && source.height) {
            source.complete = true;
        }
        var _this = _possibleConstructorReturn(this, _BaseTexture.call(this, source, scaleMode));
        _this.width = source.videoWidth;
        _this.height = source.videoHeight;
        _this._autoUpdate = true;
        _this._isAutoUpdating = false;
        _this.autoPlay = true;
        _this.update = _this.update.bind(_this);
        _this._onCanPlay = _this._onCanPlay.bind(_this);
        source.addEventListener('play', _this._onPlayStart.bind(_this));
        source.addEventListener('pause', _this._onPlayStop.bind(_this));
        _this.hasLoaded = false;
        _this.__loaded = false;
        if (!_this._isSourceReady()) {
            source.addEventListener('canplay', _this._onCanPlay);
            source.addEventListener('canplaythrough', _this._onCanPlay);
        } else {
            _this._onCanPlay();
        }
        return _this;
    }
    VideoBaseTexture.prototype._isSourcePlaying = function _isSourcePlaying() {
        var source = this.source;
        return source.currentTime > 0 && source.paused === false && source.ended === false && source.readyState > 2;
    };
    VideoBaseTexture.prototype._isSourceReady = function _isSourceReady() {
        return this.source.readyState === 3 || this.source.readyState === 4;
    };
    VideoBaseTexture.prototype._onPlayStart = function _onPlayStart() {
        if (!this.hasLoaded) {
            this._onCanPlay();
        }
        if (!this._isAutoUpdating && this.autoUpdate) {
            _ticker.shared.add(this.update, this, _const.UPDATE_PRIORITY.HIGH);
            this._isAutoUpdating = true;
        }
    };
    VideoBaseTexture.prototype._onPlayStop = function _onPlayStop() {
        if (this._isAutoUpdating) {
            _ticker.shared.remove(this.update, this);
            this._isAutoUpdating = false;
        }
    };
    VideoBaseTexture.prototype._onCanPlay = function _onCanPlay() {
        this.hasLoaded = true;
        if (this.source) {
            this.source.removeEventListener('canplay', this._onCanPlay);
            this.source.removeEventListener('canplaythrough', this._onCanPlay);
            this.width = this.source.videoWidth;
            this.height = this.source.videoHeight;
            if (!this.__loaded) {
                this.__loaded = true;
                this.emit('loaded', this);
            }
            if (this._isSourcePlaying()) {
                this._onPlayStart();
            } else if (this.autoPlay) {
                this.source.play();
            }
        }
    };
    VideoBaseTexture.prototype.destroy = function destroy() {
        if (this._isAutoUpdating) {
            _ticker.shared.remove(this.update, this);
        }
        if (this.source && this.source._pixiId) {
            _BaseTexture3.default.removeFromCache(this.source._pixiId);
            delete this.source._pixiId;
            this.source.pause();
            this.source.src = '';
            this.source.load();
        }
        _BaseTexture.prototype.destroy.call(this);
    };
    VideoBaseTexture.fromVideo = function fromVideo(video, scaleMode) {
        if (!video._pixiId) {
            video._pixiId = 'video_' + (0, _utils.uid)();
        }
        var baseTexture = _utils.BaseTextureCache[video._pixiId];
        if (!baseTexture) {
            baseTexture = new VideoBaseTexture(video, scaleMode);
            _BaseTexture3.default.addToCache(baseTexture, video._pixiId);
        }
        return baseTexture;
    };
    VideoBaseTexture.fromUrl = function fromUrl(videoSrc, scaleMode, crossorigin) {
        var video = document.createElement('video');
        video.setAttribute('webkit-playsinline', '');
        video.setAttribute('playsinline', '');
        var url = Array.isArray(videoSrc) ? videoSrc[0].src || videoSrc[0] : videoSrc.src || videoSrc;
        if (crossorigin === undefined && url.indexOf('data:') !== 0) {
            video.crossOrigin = (0, _determineCrossOrigin2.default)(url);
        } else if (crossorigin) {
            video.crossOrigin = typeof crossorigin === 'string' ? crossorigin : 'anonymous';
        }
        if (Array.isArray(videoSrc)) {
            for (var i = 0; i < videoSrc.length; ++i) {
                video.appendChild(createSource(videoSrc[i].src || videoSrc[i], videoSrc[i].mime));
            }
        }
        else {
                video.appendChild(createSource(url, videoSrc.mime));
            }
        video.load();
        return VideoBaseTexture.fromVideo(video, scaleMode);
    };
    _createClass(VideoBaseTexture, [{
        key: 'autoUpdate',
        get: function get() {
            return this._autoUpdate;
        },
        set: function set(value) 
        {
            if (value !== this._autoUpdate) {
                this._autoUpdate = value;
                if (!this._autoUpdate && this._isAutoUpdating) {
                    _ticker.shared.remove(this.update, this);
                    this._isAutoUpdating = false;
                } else if (this._autoUpdate && !this._isAutoUpdating) {
                    _ticker.shared.add(this.update, this, _const.UPDATE_PRIORITY.HIGH);
                    this._isAutoUpdating = true;
                }
            }
        }
    }]);
    return VideoBaseTexture;
}(_BaseTexture3.default);
exports.default = VideoBaseTexture;
VideoBaseTexture.fromUrls = VideoBaseTexture.fromUrl;
function createSource(path, type) {
    if (!type) {
        type = 'video/' + path.substr(path.lastIndexOf('.') + 1);
    }
    var source = document.createElement('source');
    source.src = path;
    source.type = type;
    return source;
}
},{"../const":46,"../ticker":121,"../utils":125,"../utils/determineCrossOrigin":124,"./BaseTexture":112}],119:[function(require,module,exports){
'use strict';
exports.__esModule = true;
var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
var _settings = require('../settings');
var _settings2 = _interopRequireDefault(_settings);
var _const = require('../const');
var _TickerListener = require('./TickerListener');
var _TickerListener2 = _interopRequireDefault(_TickerListener);
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
var Ticker = function () {
    function Ticker() {
        var _this = this;
        _classCallCheck(this, Ticker);
        this._head = new _TickerListener2.default(null, null, Infinity);
        this._requestId = null;
        this._maxElapsedMS = 100;
        this.autoStart = false;
        this.deltaTime = 1;
        this.elapsedMS = 1 / _settings2.default.TARGET_FPMS;
        this.lastTime = -1;
        this.speed = 1;
        this.started = false;
        this._tick = function (time) {
            _this._requestId = null;
            if (_this.started) {
                _this.update(time);
                if (_this.started && _this._requestId === null && _this._head.next) {
                    _this._requestId = requestAnimationFrame(_this._tick);
                }
            }
        };
    }
    Ticker.prototype._requestIfNeeded = function _requestIfNeeded() {
        if (this._requestId === null && this._head.next) {
            this.lastTime = performance.now();
            this._requestId = requestAnimationFrame(this._tick);
        }
    };
    Ticker.prototype._cancelIfNeeded = function _cancelIfNeeded() {
        if (this._requestId !== null) {
            cancelAnimationFrame(this._requestId);
            this._requestId = null;
        }
    };
    Ticker.prototype._startIfPossible = function _startIfPossible() {
        if (this.started) {
            this._requestIfNeeded();
        } else if (this.autoStart) {
            this.start();
        }
    };
    Ticker.prototype.add = function add(fn, context) {
        var priority = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : _const.UPDATE_PRIORITY.NORMAL;
        return this._addListener(new _TickerListener2.default(fn, context, priority));
    };
    Ticker.prototype.addOnce = function addOnce(fn, context) {
        var priority = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : _const.UPDATE_PRIORITY.NORMAL;
        return this._addListener(new _TickerListener2.default(fn, context, priority, true));
    };
    Ticker.prototype._addListener = function _addListener(listener) {
        var current = this._head.next;
        var previous = this._head;
        if (!current) {
            listener.connect(previous);
        } else {
            while (current) {
                if (listener.priority > current.priority) {
                    listener.connect(previous);
                    break;
                }
                previous = current;
                current = current.next;
            }
            if (!listener.previous) {
                listener.connect(previous);
            }
        }
        this._startIfPossible();
        return this;
    };
    Ticker.prototype.remove = function remove(fn, context) {
        var listener = this._head.next;
        while (listener) {
            if (listener.match(fn, context)) {
                listener = listener.destroy();
            } else {
                listener = listener.next;
            }
        }
        if (!this._head.next) {
            this._cancelIfNeeded();
        }
        return this;
    };
    Ticker.prototype.start = function start() {
        if (!this.started) {
            this.started = true;
            this._requestIfNeeded();
        }
    };
    Ticker.prototype.stop = function stop() {
        if (this.started) {
            this.started = false;
            this._cancelIfNeeded();
        }
    };
    Ticker.prototype.destroy = function destroy() {
        this.stop();
        var listener = this._head.next;
        while (listener) {
            listener = listener.destroy(true);
        }
        this._head.destroy();
        this._head = null;
    };
    Ticker.prototype.update = function update() {
        var currentTime = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : performance.now();
        var elapsedMS = void 0;
        if (currentTime > this.lastTime) {
            elapsedMS = this.elapsedMS = currentTime - this.lastTime;
            if (elapsedMS > this._maxElapsedMS) {
                elapsedMS = this._maxElapsedMS;
            }
            this.deltaTime = elapsedMS * _settings2.default.TARGET_FPMS * this.speed;
            var head = this._head;
            var listener = head.next;
            while (listener) {
                listener = listener.emit(this.deltaTime);
            }
            if (!head.next) {
                this._cancelIfNeeded();
            }
        } else {
            this.deltaTime = this.elapsedMS = 0;
        }
        this.lastTime = currentTime;
    };
    _createClass(Ticker, [{
        key: 'FPS',
        get: function get() {
            return 1000 / this.elapsedMS;
        }
    }, {
        key: 'minFPS',
        get: function get() {
            return 1000 / this._maxElapsedMS;
        },
        set: function set(fps) 
        {
            var minFPMS = Math.min(Math.max(0, fps) / 1000, _settings2.default.TARGET_FPMS);
            this._maxElapsedMS = 1 / minFPMS;
        }
    }]);
    return Ticker;
}();
exports.default = Ticker;
},{"../const":46,"../settings":101,"./TickerListener":120}],120:[function(require,module,exports){
"use strict";
exports.__esModule = true;
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
var TickerListener = function () {
    function TickerListener(fn) {
        var context = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
        var priority = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
        var once = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
        _classCallCheck(this, TickerListener);
        this.fn = fn;
        this.context = context;
        this.priority = priority;
        this.once = once;
        this.next = null;
        this.previous = null;
        this._destroyed = false;
    }
    TickerListener.prototype.match = function match(fn, context) {
        context = context || null;
        return this.fn === fn && this.context === context;
    };
    TickerListener.prototype.emit = function emit(deltaTime) {
        if (this.fn) {
            if (this.context) {
                this.fn.call(this.context, deltaTime);
            } else {
                this.fn(deltaTime);
            }
        }
        var redirect = this.next;
        if (this.once) {
            this.destroy(true);
        }
        if (this._destroyed) {
            this.next = null;
        }
        return redirect;
    };
    TickerListener.prototype.connect = function connect(previous) {
        this.previous = previous;
        if (previous.next) {
            previous.next.previous = this;
        }
        this.next = previous.next;
        previous.next = this;
    };
    TickerListener.prototype.destroy = function destroy() {
        var hard = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
        this._destroyed = true;
        this.fn = null;
        this.context = null;
        if (this.previous) {
            this.previous.next = this.next;
        }
        if (this.next) {
            this.next.previous = this.previous;
        }
        var redirect = this.next;
        this.next = hard ? null : redirect;
        this.previous = null;
        return redirect;
    };
    return TickerListener;
}();
exports.default = TickerListener;
},{}],121:[function(require,module,exports){
'use strict';
exports.__esModule = true;
exports.Ticker = exports.shared = undefined;
var _Ticker = require('./Ticker');
var _Ticker2 = _interopRequireDefault(_Ticker);
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
var shared = new _Ticker2.default();
shared.autoStart = true;
shared.destroy = function () {
};
exports.shared = shared;
exports.Ticker = _Ticker2.default;
},{"./Ticker":119}],122:[function(require,module,exports){
"use strict";
exports.__esModule = true;
exports.default = canUploadSameBuffer;
function canUploadSameBuffer() {
	var ios = !!navigator.platform && /iPad|iPhone|iPod/.test(navigator.platform);
	return !ios;
}
},{}],123:[function(require,module,exports){
"use strict";
exports.__esModule = true;
exports.default = createIndicesForQuads;
function createIndicesForQuads(size) {
    var totalIndices = size * 6;
    var indices = new Uint16Array(totalIndices);
    for (var i = 0, j = 0; i < totalIndices; i += 6, j += 4) {
        indices[i + 0] = j + 0;
        indices[i + 1] = j + 1;
        indices[i + 2] = j + 2;
        indices[i + 3] = j + 0;
        indices[i + 4] = j + 2;
        indices[i + 5] = j + 3;
    }
    return indices;
}
},{}],124:[function(require,module,exports){
'use strict';
exports.__esModule = true;
exports.default = determineCrossOrigin;
var _url2 = require('url');
var _url3 = _interopRequireDefault(_url2);
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
var tempAnchor = void 0;
function determineCrossOrigin(url) {
    var loc = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : window.location;
    if (url.indexOf('data:') === 0) {
        return '';
    }
    loc = loc || window.location;
    if (!tempAnchor) {
        tempAnchor = document.createElement('a');
    }
    tempAnchor.href = url;
    url = _url3.default.parse(tempAnchor.href);
    var samePort = !url.port && loc.port === '' || url.port === loc.port;
    if (url.hostname !== loc.hostname || !samePort || url.protocol !== loc.protocol) {
        return 'anonymous';
    }
    return '';
}
},{"url":38}],125:[function(require,module,exports){
'use strict';
exports.__esModule = true;
exports.premultiplyBlendMode = exports.BaseTextureCache = exports.TextureCache = exports.earcut = exports.mixins = exports.pluginTarget = exports.EventEmitter = exports.removeItems = exports.isMobile = undefined;
exports.uid = uid;
exports.hex2rgb = hex2rgb;
exports.hex2string = hex2string;
exports.rgb2hex = rgb2hex;
exports.getResolutionOfUrl = getResolutionOfUrl;
exports.decomposeDataUri = decomposeDataUri;
exports.getUrlFileExtension = getUrlFileExtension;
exports.getSvgSize = getSvgSize;
exports.skipHello = skipHello;
exports.sayHello = sayHello;
exports.isWebGLSupported = isWebGLSupported;
exports.sign = sign;
exports.destroyTextureCache = destroyTextureCache;
exports.clearTextureCache = clearTextureCache;
exports.correctBlendMode = correctBlendMode;
exports.premultiplyTint = premultiplyTint;
exports.premultiplyRgba = premultiplyRgba;
exports.premultiplyTintToRgba = premultiplyTintToRgba;
var _const = require('../const');
var _settings = require('../settings');
var _settings2 = _interopRequireDefault(_settings);
var _eventemitter = require('eventemitter3');
var _eventemitter2 = _interopRequireDefault(_eventemitter);
var _pluginTarget = require('./pluginTarget');
var _pluginTarget2 = _interopRequireDefault(_pluginTarget);
var _mixin = require('./mixin');
var mixins = _interopRequireWildcard(_mixin);
var _ismobilejs = require('ismobilejs');
var isMobile = _interopRequireWildcard(_ismobilejs);
var _removeArrayItems = require('remove-array-items');
var _removeArrayItems2 = _interopRequireDefault(_removeArrayItems);
var _mapPremultipliedBlendModes = require('./mapPremultipliedBlendModes');
var _mapPremultipliedBlendModes2 = _interopRequireDefault(_mapPremultipliedBlendModes);
var _earcut = require('earcut');
var _earcut2 = _interopRequireDefault(_earcut);
function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
var nextUid = 0;
var saidHello = false;
exports.isMobile = isMobile;
exports.removeItems = _removeArrayItems2.default;
exports.EventEmitter = _eventemitter2.default;
exports.pluginTarget = _pluginTarget2.default;
exports.mixins = mixins;
exports.earcut = _earcut2.default;
function uid() {
    return ++nextUid;
}
function hex2rgb(hex, out) {
    out = out || [];
    out[0] = (hex >> 16 & 0xFF) / 255;
    out[1] = (hex >> 8 & 0xFF) / 255;
    out[2] = (hex & 0xFF) / 255;
    return out;
}
function hex2string(hex) {
    hex = hex.toString(16);
    hex = '000000'.substr(0, 6 - hex.length) + hex;
    return '#' + hex;
}
function rgb2hex(rgb) {
    return (rgb[0] * 255 << 16) + (rgb[1] * 255 << 8) + (rgb[2] * 255 | 0);
}
function getResolutionOfUrl(url, defaultValue) {
    var resolution = _settings2.default.RETINA_PREFIX.exec(url);
    if (resolution) {
        return parseFloat(resolution[1]);
    }
    return defaultValue !== undefined ? defaultValue : 1;
}
function decomposeDataUri(dataUri) {
    var dataUriMatch = _const.DATA_URI.exec(dataUri);
    if (dataUriMatch) {
        return {
            mediaType: dataUriMatch[1] ? dataUriMatch[1].toLowerCase() : undefined,
            subType: dataUriMatch[2] ? dataUriMatch[2].toLowerCase() : undefined,
            charset: dataUriMatch[3] ? dataUriMatch[3].toLowerCase() : undefined,
            encoding: dataUriMatch[4] ? dataUriMatch[4].toLowerCase() : undefined,
            data: dataUriMatch[5]
        };
    }
    return undefined;
}
function getUrlFileExtension(url) {
    var extension = _const.URL_FILE_EXTENSION.exec(url);
    if (extension) {
        return extension[1].toLowerCase();
    }
    return undefined;
}
function getSvgSize(svgString) {
    var sizeMatch = _const.SVG_SIZE.exec(svgString);
    var size = {};
    if (sizeMatch) {
        size[sizeMatch[1]] = Math.round(parseFloat(sizeMatch[3]));
        size[sizeMatch[5]] = Math.round(parseFloat(sizeMatch[7]));
    }
    return size;
}
function skipHello() {
    saidHello = true;
}
function sayHello(type) {
    if (saidHello) {
        return;
    }
    if (navigator.userAgent.toLowerCase().indexOf('chrome') > -1) {
        var args = ['\n %c %c %c PixiJS ' + _const.VERSION + ' - \u2730 ' + type + ' \u2730  %c  %c  http://www.pixijs.com/  %c %c \u2665%c\u2665%c\u2665 \n\n', 'background: #ff66a5; padding:5px 0;', 'background: #ff66a5; padding:5px 0;', 'color: #ff66a5; background: #030307; padding:5px 0;', 'background: #ff66a5; padding:5px 0;', 'background: #ffc3dc; padding:5px 0;', 'background: #ff66a5; padding:5px 0;', 'color: #ff2424; background: #fff; padding:5px 0;', 'color: #ff2424; background: #fff; padding:5px 0;', 'color: #ff2424; background: #fff; padding:5px 0;'];
        window.console.log.apply(console, args);
    } else if (window.console) {
        window.console.log('PixiJS ' + _const.VERSION + ' - ' + type + ' - http://www.pixijs.com/');
    }
    saidHello = true;
}
function isWebGLSupported() {
    var contextOptions = { stencil: true, failIfMajorPerformanceCaveat: true };
    try {
        if (!window.WebGLRenderingContext) {
            return false;
        }
        var canvas = document.createElement('canvas');
        var gl = canvas.getContext('webgl', contextOptions) || canvas.getContext('experimental-webgl', contextOptions);
        var success = !!(gl && gl.getContextAttributes().stencil);
        if (gl) {
            var loseContext = gl.getExtension('WEBGL_lose_context');
            if (loseContext) {
                loseContext.loseContext();
            }
        }
        gl = null;
        return success;
    } catch (e) {
        return false;
    }
}
function sign(n) {
    if (n === 0) return 0;
    return n < 0 ? -1 : 1;
}
var TextureCache = exports.TextureCache = Object.create(null);
var BaseTextureCache = exports.BaseTextureCache = Object.create(null);
function destroyTextureCache() {
    var key = void 0;
    for (key in TextureCache) {
        TextureCache[key].destroy();
    }
    for (key in BaseTextureCache) {
        BaseTextureCache[key].destroy();
    }
}
function clearTextureCache() {
    var key = void 0;
    for (key in TextureCache) {
        delete TextureCache[key];
    }
    for (key in BaseTextureCache) {
        delete BaseTextureCache[key];
    }
}
var premultiplyBlendMode = exports.premultiplyBlendMode = (0, _mapPremultipliedBlendModes2.default)();
function correctBlendMode(blendMode, premultiplied) {
    return premultiplyBlendMode[premultiplied ? 1 : 0][blendMode];
}
function premultiplyTint(tint, alpha) {
    if (alpha === 1.0) {
        return (alpha * 255 << 24) + tint;
    }
    if (alpha === 0.0) {
        return 0;
    }
    var R = tint >> 16 & 0xFF;
    var G = tint >> 8 & 0xFF;
    var B = tint & 0xFF;
    R = R * alpha + 0.5 | 0;
    G = G * alpha + 0.5 | 0;
    B = B * alpha + 0.5 | 0;
    return (alpha * 255 << 24) + (R << 16) + (G << 8) + B;
}
function premultiplyRgba(rgb, alpha, out, premultiply) {
    out = out || new Float32Array(4);
    if (premultiply || premultiply === undefined) {
        out[0] = rgb[0] * alpha;
        out[1] = rgb[1] * alpha;
        out[2] = rgb[2] * alpha;
    } else {
        out[0] = rgb[0];
        out[1] = rgb[1];
        out[2] = rgb[2];
    }
    out[3] = alpha;
    return out;
}
function premultiplyTintToRgba(tint, alpha, out, premultiply) {
    out = out || new Float32Array(4);
    out[0] = (tint >> 16 & 0xFF) / 255.0;
    out[1] = (tint >> 8 & 0xFF) / 255.0;
    out[2] = (tint & 0xFF) / 255.0;
    if (premultiply || premultiply === undefined) {
        out[0] *= alpha;
        out[1] *= alpha;
        out[2] *= alpha;
    }
    out[3] = alpha;
    return out;
}
},{"../const":46,"../settings":101,"./mapPremultipliedBlendModes":126,"./mixin":128,"./pluginTarget":129,"earcut":2,"eventemitter3":3,"ismobilejs":4,"remove-array-items":31}],126:[function(require,module,exports){
'use strict';
exports.__esModule = true;
exports.default = mapPremultipliedBlendModes;
var _const = require('../const');
function mapPremultipliedBlendModes() {
    var pm = [];
    var npm = [];
    for (var i = 0; i < 32; i++) {
        pm[i] = i;
        npm[i] = i;
    }
    pm[_const.BLEND_MODES.NORMAL_NPM] = _const.BLEND_MODES.NORMAL;
    pm[_const.BLEND_MODES.ADD_NPM] = _const.BLEND_MODES.ADD;
    pm[_const.BLEND_MODES.SCREEN_NPM] = _const.BLEND_MODES.SCREEN;
    npm[_const.BLEND_MODES.NORMAL] = _const.BLEND_MODES.NORMAL_NPM;
    npm[_const.BLEND_MODES.ADD] = _const.BLEND_MODES.ADD_NPM;
    npm[_const.BLEND_MODES.SCREEN] = _const.BLEND_MODES.SCREEN_NPM;
    var array = [];
    array.push(npm);
    array.push(pm);
    return array;
}
},{"../const":46}],127:[function(require,module,exports){
'use strict';
exports.__esModule = true;
exports.default = maxRecommendedTextures;
var _ismobilejs = require('ismobilejs');
var _ismobilejs2 = _interopRequireDefault(_ismobilejs);
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function maxRecommendedTextures(max) {
    if (_ismobilejs2.default.tablet || _ismobilejs2.default.phone) {
        return 4;
    }
    return max;
}
},{"ismobilejs":4}],128:[function(require,module,exports){
"use strict";
exports.__esModule = true;
exports.mixin = mixin;
exports.delayMixin = delayMixin;
exports.performMixins = performMixins;
function mixin(target, source) {
    if (!target || !source) return;
    var keys = Object.keys(source);
    for (var i = 0; i < keys.length; ++i) {
        var propertyName = keys[i];
        Object.defineProperty(target, propertyName, Object.getOwnPropertyDescriptor(source, propertyName));
    }
}
var mixins = [];
function delayMixin(target, source) {
    mixins.push(target, source);
}
function performMixins() {
    for (var i = 0; i < mixins.length; i += 2) {
        mixin(mixins[i], mixins[i + 1]);
    }
    mixins.length = 0;
}
},{}],129:[function(require,module,exports){
"use strict";
exports.__esModule = true;
function pluginTarget(obj) {
    obj.__plugins = {};
    obj.registerPlugin = function registerPlugin(pluginName, ctor) {
        obj.__plugins[pluginName] = ctor;
    };
    obj.prototype.initPlugins = function initPlugins() {
        this.plugins = this.plugins || {};
        for (var o in obj.__plugins) {
            this.plugins[o] = new obj.__plugins[o](this);
        }
    };
    obj.prototype.destroyPlugins = function destroyPlugins() {
        for (var o in this.plugins) {
            this.plugins[o].destroy();
            this.plugins[o] = null;
        }
        this.plugins = null;
    };
}
exports.default = {
    mixin: function mixin(obj) {
        pluginTarget(obj);
    }
};
},{}],130:[function(require,module,exports){
'use strict';
exports.__esModule = true;
exports.default = trimCanvas;
function trimCanvas(canvas) {
    var width = canvas.width;
    var height = canvas.height;
    var context = canvas.getContext('2d');
    var imageData = context.getImageData(0, 0, width, height);
    var pixels = imageData.data;
    var len = pixels.length;
    var bound = {
        top: null,
        left: null,
        right: null,
        bottom: null
    };
    var i = void 0;
    var x = void 0;
    var y = void 0;
    for (i = 0; i < len; i += 4) {
        if (pixels[i + 3] !== 0) {
            x = i / 4 % width;
            y = ~~(i / 4 / width);
            if (bound.top === null) {
                bound.top = y;
            }
            if (bound.left === null) {
                bound.left = x;
            } else if (x < bound.left) {
                bound.left = x;
            }
            if (bound.right === null) {
                bound.right = x + 1;
            } else if (bound.right < x) {
                bound.right = x + 1;
            }
            if (bound.bottom === null) {
                bound.bottom = y;
            } else if (bound.bottom < y) {
                bound.bottom = y;
            }
        }
    }
    width = bound.right - bound.left;
    height = bound.bottom - bound.top + 1;
    var data = context.getImageData(bound.left, bound.top, width, height);
    return {
        height: height,
        width: width,
        data: data
    };
}
},{}],131:[function(require,module,exports){
'use strict';
exports.__esModule = true;
exports.default = deprecation;
var warnings = {};
function warn(msg) {
    if (warnings[msg]) {
        return;
    }
    var stack = new Error().stack;
    if (typeof stack === 'undefined') {
        console.warn('Deprecation Warning: ', msg);
    } else {
        stack = stack.split('\n').splice(3).join('\n');
        if (console.groupCollapsed) {
            console.groupCollapsed('%cDeprecation Warning: %c%s', 'color:#614108;background:#fffbe6', 'font-weight:normal;color:#614108;background:#fffbe6', msg);
            console.warn(stack);
            console.groupEnd();
        } else {
            console.warn('Deprecation Warning: ', msg);
            console.warn(stack);
        }
    }
    warnings[msg] = true;
}
function deprecation(core) {
    var mesh = core.mesh,
        particles = core.particles,
        extras = core.extras,
        filters = core.filters,
        prepare = core.prepare,
        loaders = core.loaders,
        interaction = core.interaction;
    Object.defineProperties(core, {
        SpriteBatch: {
            get: function get() {
                throw new ReferenceError('SpriteBatch does not exist any more, ' + 'please use the new ParticleContainer instead.');
            }
        },
        AssetLoader: {
            get: function get() {
                throw new ReferenceError('The loader system was overhauled in PixiJS v3, ' + 'please see the new PIXI.loaders.Loader class.');
            }
        },
        Stage: {
            get: function get() {
                warn('You do not need to use a PIXI Stage any more, you can simply render any container.');
                return core.Container;
            }
        },
        DisplayObjectContainer: {
            get: function get() {
                warn('DisplayObjectContainer has been shortened to Container, please use Container from now on.');
                return core.Container;
            }
        },
        Strip: {
            get: function get() {
                warn('The Strip class has been renamed to Mesh and moved to mesh.Mesh, please use mesh.Mesh from now on.');
                return mesh.Mesh;
            }
        },
        Rope: {
            get: function get() {
                warn('The Rope class has been moved to mesh.Rope, please use mesh.Rope from now on.');
                return mesh.Rope;
            }
        },
        ParticleContainer: {
            get: function get() {
                warn('The ParticleContainer class has been moved to particles.ParticleContainer, ' + 'please use particles.ParticleContainer from now on.');
                return particles.ParticleContainer;
            }
        },
        MovieClip: {
            get: function get() {
                warn('The MovieClip class has been moved to extras.AnimatedSprite, please use extras.AnimatedSprite.');
                return extras.AnimatedSprite;
            }
        },
        TilingSprite: {
            get: function get() {
                warn('The TilingSprite class has been moved to extras.TilingSprite, ' + 'please use extras.TilingSprite from now on.');
                return extras.TilingSprite;
            }
        },
        BitmapText: {
            get: function get() {
                warn('The BitmapText class has been moved to extras.BitmapText, ' + 'please use extras.BitmapText from now on.');
                return extras.BitmapText;
            }
        },
        blendModes: {
            get: function get() {
                warn('The blendModes has been moved to BLEND_MODES, please use BLEND_MODES from now on.');
                return core.BLEND_MODES;
            }
        },
        scaleModes: {
            get: function get() {
                warn('The scaleModes has been moved to SCALE_MODES, please use SCALE_MODES from now on.');
                return core.SCALE_MODES;
            }
        },
        BaseTextureCache: {
            get: function get() {
                warn('The BaseTextureCache class has been moved to utils.BaseTextureCache, ' + 'please use utils.BaseTextureCache from now on.');
                return core.utils.BaseTextureCache;
            }
        },
        TextureCache: {
            get: function get() {
                warn('The TextureCache class has been moved to utils.TextureCache, ' + 'please use utils.TextureCache from now on.');
                return core.utils.TextureCache;
            }
        },
        math: {
            get: function get() {
                warn('The math namespace is deprecated, please access members already accessible on PIXI.');
                return core;
            }
        },
        AbstractFilter: {
            get: function get() {
                warn('AstractFilter has been renamed to Filter, please use PIXI.Filter');
                return core.Filter;
            }
        },
        TransformManual: {
            get: function get() {
                warn('TransformManual has been renamed to TransformBase, please update your pixi-spine');
                return core.TransformBase;
            }
        },
        TARGET_FPMS: {
            get: function get() {
                warn('PIXI.TARGET_FPMS has been deprecated, please use PIXI.settings.TARGET_FPMS');
                return core.settings.TARGET_FPMS;
            },
            set: function set(value) {
                warn('PIXI.TARGET_FPMS has been deprecated, please use PIXI.settings.TARGET_FPMS');
                core.settings.TARGET_FPMS = value;
            }
        },
        FILTER_RESOLUTION: {
            get: function get() {
                warn('PIXI.FILTER_RESOLUTION has been deprecated, please use PIXI.settings.FILTER_RESOLUTION');
                return core.settings.FILTER_RESOLUTION;
            },
            set: function set(value) {
                warn('PIXI.FILTER_RESOLUTION has been deprecated, please use PIXI.settings.FILTER_RESOLUTION');
                core.settings.FILTER_RESOLUTION = value;
            }
        },
        RESOLUTION: {
            get: function get() {
                warn('PIXI.RESOLUTION has been deprecated, please use PIXI.settings.RESOLUTION');
                return core.settings.RESOLUTION;
            },
            set: function set(value) {
                warn('PIXI.RESOLUTION has been deprecated, please use PIXI.settings.RESOLUTION');
                core.settings.RESOLUTION = value;
            }
        },
        MIPMAP_TEXTURES: {
            get: function get() {
                warn('PIXI.MIPMAP_TEXTURES has been deprecated, please use PIXI.settings.MIPMAP_TEXTURES');
                return core.settings.MIPMAP_TEXTURES;
            },
            set: function set(value) {
                warn('PIXI.MIPMAP_TEXTURES has been deprecated, please use PIXI.settings.MIPMAP_TEXTURES');
                core.settings.MIPMAP_TEXTURES = value;
            }
        },
        SPRITE_BATCH_SIZE: {
            get: function get() {
                warn('PIXI.SPRITE_BATCH_SIZE has been deprecated, please use PIXI.settings.SPRITE_BATCH_SIZE');
                return core.settings.SPRITE_BATCH_SIZE;
            },
            set: function set(value) {
                warn('PIXI.SPRITE_BATCH_SIZE has been deprecated, please use PIXI.settings.SPRITE_BATCH_SIZE');
                core.settings.SPRITE_BATCH_SIZE = value;
            }
        },
        SPRITE_MAX_TEXTURES: {
            get: function get() {
                warn('PIXI.SPRITE_MAX_TEXTURES has been deprecated, please use PIXI.settings.SPRITE_MAX_TEXTURES');
                return core.settings.SPRITE_MAX_TEXTURES;
            },
            set: function set(value) {
                warn('PIXI.SPRITE_MAX_TEXTURES has been deprecated, please use PIXI.settings.SPRITE_MAX_TEXTURES');
                core.settings.SPRITE_MAX_TEXTURES = value;
            }
        },
        RETINA_PREFIX: {
            get: function get() {
                warn('PIXI.RETINA_PREFIX has been deprecated, please use PIXI.settings.RETINA_PREFIX');
                return core.settings.RETINA_PREFIX;
            },
            set: function set(value) {
                warn('PIXI.RETINA_PREFIX has been deprecated, please use PIXI.settings.RETINA_PREFIX');
                core.settings.RETINA_PREFIX = value;
            }
        },
        DEFAULT_RENDER_OPTIONS: {
            get: function get() {
                warn('PIXI.DEFAULT_RENDER_OPTIONS has been deprecated, please use PIXI.settings.DEFAULT_RENDER_OPTIONS');
                return core.settings.RENDER_OPTIONS;
            }
        }
    });
    var defaults = [{ parent: 'TRANSFORM_MODE', target: 'TRANSFORM_MODE' }, { parent: 'GC_MODES', target: 'GC_MODE' }, { parent: 'WRAP_MODES', target: 'WRAP_MODE' }, { parent: 'SCALE_MODES', target: 'SCALE_MODE' }, { parent: 'PRECISION', target: 'PRECISION_FRAGMENT' }];
    var _loop = function _loop(i) {
        var deprecation = defaults[i];
        Object.defineProperty(core[deprecation.parent], 'DEFAULT', {
            get: function get() {
                warn('PIXI.' + deprecation.parent + '.DEFAULT has been deprecated, ' + ('please use PIXI.settings.' + deprecation.target));
                return core.settings[deprecation.target];
            },
            set: function set(value) {
                warn('PIXI.' + deprecation.parent + '.DEFAULT has been deprecated, ' + ('please use PIXI.settings.' + deprecation.target));
                core.settings[deprecation.target] = value;
            }
        });
    };
    for (var i = 0; i < defaults.length; i++) {
        _loop(i);
    }
    Object.defineProperties(core.settings, {
        PRECISION: {
            get: function get() {
                warn('PIXI.settings.PRECISION has been deprecated, please use PIXI.settings.PRECISION_FRAGMENT');
                return core.settings.PRECISION_FRAGMENT;
            },
            set: function set(value) {
                warn('PIXI.settings.PRECISION has been deprecated, please use PIXI.settings.PRECISION_FRAGMENT');
                core.settings.PRECISION_FRAGMENT = value;
            }
        }
    });
    if (extras.AnimatedSprite) {
        Object.defineProperties(extras, {
            MovieClip: {
                get: function get() {
                    warn('The MovieClip class has been renamed to AnimatedSprite, please use AnimatedSprite from now on.');
                    return extras.AnimatedSprite;
                }
            }
        });
    }
    if (extras) {
        Object.defineProperties(extras, {
            TextureTransform: {
                get: function get() {
                    warn('The TextureTransform class has been renamed to TextureMatrix, ' + 'please use PIXI.TextureMatrix from now on.');
                    return core.TextureMatrix;
                }
            }
        });
    }
    core.DisplayObject.prototype.generateTexture = function generateTexture(renderer, scaleMode, resolution) {
        warn('generateTexture has moved to the renderer, please use renderer.generateTexture(displayObject)');
        return renderer.generateTexture(this, scaleMode, resolution);
    };
    core.Graphics.prototype.generateTexture = function generateTexture(scaleMode, resolution) {
        warn('graphics generate texture has moved to the renderer. ' + 'Or to render a graphics to a texture using canvas please use generateCanvasTexture');
        return this.generateCanvasTexture(scaleMode, resolution);
    };
    core.GroupD8.isSwapWidthHeight = function isSwapWidthHeight(rotation) {
        warn('GroupD8.isSwapWidthHeight was renamed to GroupD8.isVertical');
        return core.GroupD8.isVertical(rotation);
    };
    core.RenderTexture.prototype.render = function render(displayObject, matrix, clear, updateTransform) {
        this.legacyRenderer.render(displayObject, this, clear, matrix, !updateTransform);
        warn('RenderTexture.render is now deprecated, please use renderer.render(displayObject, renderTexture)');
    };
    core.RenderTexture.prototype.getImage = function getImage(target) {
        warn('RenderTexture.getImage is now deprecated, please use renderer.extract.image(target)');
        return this.legacyRenderer.extract.image(target);
    };
    core.RenderTexture.prototype.getBase64 = function getBase64(target) {
        warn('RenderTexture.getBase64 is now deprecated, please use renderer.extract.base64(target)');
        return this.legacyRenderer.extract.base64(target);
    };
    core.RenderTexture.prototype.getCanvas = function getCanvas(target) {
        warn('RenderTexture.getCanvas is now deprecated, please use renderer.extract.canvas(target)');
        return this.legacyRenderer.extract.canvas(target);
    };
    core.RenderTexture.prototype.getPixels = function getPixels(target) {
        warn('RenderTexture.getPixels is now deprecated, please use renderer.extract.pixels(target)');
        return this.legacyRenderer.pixels(target);
    };
    core.Sprite.prototype.setTexture = function setTexture(texture) {
        this.texture = texture;
        warn('setTexture is now deprecated, please use the texture property, e.g : sprite.texture = texture;');
    };
    if (extras.BitmapText) {
        extras.BitmapText.prototype.setText = function setText(text) {
            this.text = text;
            warn('setText is now deprecated, please use the text property, e.g : myBitmapText.text = \'my text\';');
        };
    }
    core.Text.prototype.setText = function setText(text) {
        this.text = text;
        warn('setText is now deprecated, please use the text property, e.g : myText.text = \'my text\';');
    };
    core.Text.calculateFontProperties = function calculateFontProperties(font) {
        warn('Text.calculateFontProperties is now deprecated, please use the TextMetrics.measureFont');
        return core.TextMetrics.measureFont(font);
    };
    Object.defineProperties(core.Text, {
        fontPropertiesCache: {
            get: function get() {
                warn('Text.fontPropertiesCache is deprecated');
                return core.TextMetrics._fonts;
            }
        },
        fontPropertiesCanvas: {
            get: function get() {
                warn('Text.fontPropertiesCanvas is deprecated');
                return core.TextMetrics._canvas;
            }
        },
        fontPropertiesContext: {
            get: function get() {
                warn('Text.fontPropertiesContext is deprecated');
                return core.TextMetrics._context;
            }
        }
    });
    core.Text.prototype.setStyle = function setStyle(style) {
        this.style = style;
        warn('setStyle is now deprecated, please use the style property, e.g : myText.style = style;');
    };
    core.Text.prototype.determineFontProperties = function determineFontProperties(fontStyle) {
        warn('determineFontProperties is now deprecated, please use TextMetrics.measureFont method');
        return core.TextMetrics.measureFont(fontStyle);
    };
    core.Text.getFontStyle = function getFontStyle(style) {
        warn('getFontStyle is now deprecated, please use TextStyle.toFontString() instead');
        style = style || {};
        if (!(style instanceof core.TextStyle)) {
            style = new core.TextStyle(style);
        }
        return style.toFontString();
    };
    Object.defineProperties(core.TextStyle.prototype, {
        font: {
            get: function get() {
                warn('text style property \'font\' is now deprecated, please use the ' + '\'fontFamily\', \'fontSize\', \'fontStyle\', \'fontVariant\' and \'fontWeight\' properties from now on');
                var fontSizeString = typeof this._fontSize === 'number' ? this._fontSize + 'px' : this._fontSize;
                return this._fontStyle + ' ' + this._fontVariant + ' ' + this._fontWeight + ' ' + fontSizeString + ' ' + this._fontFamily;
            },
            set: function set(font) {
                warn('text style property \'font\' is now deprecated, please use the ' + '\'fontFamily\',\'fontSize\',fontStyle\',\'fontVariant\' and \'fontWeight\' properties from now on');
                if (font.indexOf('italic') > 1) {
                    this._fontStyle = 'italic';
                } else if (font.indexOf('oblique') > -1) {
                    this._fontStyle = 'oblique';
                } else {
                    this._fontStyle = 'normal';
                }
                if (font.indexOf('small-caps') > -1) {
                    this._fontVariant = 'small-caps';
                } else {
                    this._fontVariant = 'normal';
                }
                var splits = font.split(' ');
                var fontSizeIndex = -1;
                this._fontSize = 26;
                for (var i = 0; i < splits.length; ++i) {
                    if (splits[i].match(/(px|pt|em|%)/)) {
                        fontSizeIndex = i;
                        this._fontSize = splits[i];
                        break;
                    }
                }
                this._fontWeight = 'normal';
                for (var _i = 0; _i < fontSizeIndex; ++_i) {
                    if (splits[_i].match(/(bold|bolder|lighter|100|200|300|400|500|600|700|800|900)/)) {
                        this._fontWeight = splits[_i];
                        break;
                    }
                }
                if (fontSizeIndex > -1 && fontSizeIndex < splits.length - 1) {
                    this._fontFamily = '';
                    for (var _i2 = fontSizeIndex + 1; _i2 < splits.length; ++_i2) {
                        this._fontFamily += splits[_i2] + ' ';
                    }
                    this._fontFamily = this._fontFamily.slice(0, -1);
                } else {
                    this._fontFamily = 'Arial';
                }
                this.styleID++;
            }
        }
    });
    core.Texture.prototype.setFrame = function setFrame(frame) {
        this.frame = frame;
        warn('setFrame is now deprecated, please use the frame property, e.g: myTexture.frame = frame;');
    };
    core.Texture.addTextureToCache = function addTextureToCache(texture, id) {
        core.Texture.addToCache(texture, id);
        warn('Texture.addTextureToCache is deprecated, please use Texture.addToCache from now on.');
    };
    core.Texture.removeTextureFromCache = function removeTextureFromCache(id) {
        warn('Texture.removeTextureFromCache is deprecated, please use Texture.removeFromCache from now on. ' + 'Be aware that Texture.removeFromCache does not automatically its BaseTexture from the BaseTextureCache. ' + 'For that, use BaseTexture.removeFromCache');
        core.BaseTexture.removeFromCache(id);
        return core.Texture.removeFromCache(id);
    };
    Object.defineProperties(filters, {
        AbstractFilter: {
            get: function get() {
                warn('AstractFilter has been renamed to Filter, please use PIXI.Filter');
                return core.AbstractFilter;
            }
        },
        SpriteMaskFilter: {
            get: function get() {
                warn('filters.SpriteMaskFilter is an undocumented alias, please use SpriteMaskFilter from now on.');
                return core.SpriteMaskFilter;
            }
        },
        VoidFilter: {
            get: function get() {
                warn('VoidFilter has been renamed to AlphaFilter, please use PIXI.filters.AlphaFilter');
                return filters.AlphaFilter;
            }
        }
    });
    core.utils.uuid = function () {
        warn('utils.uuid() is deprecated, please use utils.uid() from now on.');
        return core.utils.uid();
    };
    core.utils.canUseNewCanvasBlendModes = function () {
        warn('utils.canUseNewCanvasBlendModes() is deprecated, please use CanvasTinter.canUseMultiply from now on');
        return core.CanvasTinter.canUseMultiply;
    };
    var saidHello = true;
    Object.defineProperty(core.utils, '_saidHello', {
        set: function set(bool) {
            if (bool) {
                warn('PIXI.utils._saidHello is deprecated, please use PIXI.utils.skipHello()');
                this.skipHello();
            }
            saidHello = bool;
        },
        get: function get() {
            return saidHello;
        }
    });
    if (prepare.BasePrepare) {
        prepare.BasePrepare.prototype.register = function register(addHook, uploadHook) {
            warn('renderer.plugins.prepare.register is now deprecated, ' + 'please use renderer.plugins.prepare.registerFindHook & renderer.plugins.prepare.registerUploadHook');
            if (addHook) {
                this.registerFindHook(addHook);
            }
            if (uploadHook) {
                this.registerUploadHook(uploadHook);
            }
            return this;
        };
    }
    if (prepare.canvas) {
        Object.defineProperty(prepare.canvas, 'UPLOADS_PER_FRAME', {
            set: function set() {
                warn('PIXI.CanvasPrepare.UPLOADS_PER_FRAME has been removed. Please set ' + 'renderer.plugins.prepare.limiter.maxItemsPerFrame on your renderer');
            },
            get: function get() {
                warn('PIXI.CanvasPrepare.UPLOADS_PER_FRAME has been removed. Please use ' + 'renderer.plugins.prepare.limiter');
                return NaN;
            }
        });
    }
    if (prepare.webgl) {
        Object.defineProperty(prepare.webgl, 'UPLOADS_PER_FRAME', {
            set: function set() {
                warn('PIXI.WebGLPrepare.UPLOADS_PER_FRAME has been removed. Please set ' + 'renderer.plugins.prepare.limiter.maxItemsPerFrame on your renderer');
            },
            get: function get() {
                warn('PIXI.WebGLPrepare.UPLOADS_PER_FRAME has been removed. Please use ' + 'renderer.plugins.prepare.limiter');
                return NaN;
            }
        });
    }
    if (loaders.Loader) {
        var Resource = loaders.Resource;
        var Loader = loaders.Loader;
        Object.defineProperties(Resource.prototype, {
            isJson: {
                get: function get() {
                    warn('The isJson property is deprecated, please use `resource.type === Resource.TYPE.JSON`.');
                    return this.type === Resource.TYPE.JSON;
                }
            },
            isXml: {
                get: function get() {
                    warn('The isXml property is deprecated, please use `resource.type === Resource.TYPE.XML`.');
                    return this.type === Resource.TYPE.XML;
                }
            },
            isImage: {
                get: function get() {
                    warn('The isImage property is deprecated, please use `resource.type === Resource.TYPE.IMAGE`.');
                    return this.type === Resource.TYPE.IMAGE;
                }
            },
            isAudio: {
                get: function get() {
                    warn('The isAudio property is deprecated, please use `resource.type === Resource.TYPE.AUDIO`.');
                    return this.type === Resource.TYPE.AUDIO;
                }
            },
            isVideo: {
                get: function get() {
                    warn('The isVideo property is deprecated, please use `resource.type === Resource.TYPE.VIDEO`.');
                    return this.type === Resource.TYPE.VIDEO;
                }
            }
        });
        Object.defineProperties(Loader.prototype, {
            before: {
                get: function get() {
                    warn('The before() method is deprecated, please use pre().');
                    return this.pre;
                }
            },
            after: {
                get: function get() {
                    warn('The after() method is deprecated, please use use().');
                    return this.use;
                }
            }
        });
    }
    if (interaction.interactiveTarget) {
        Object.defineProperty(interaction.interactiveTarget, 'defaultCursor', {
            set: function set(value) {
                warn('Property defaultCursor has been replaced with \'cursor\'. ');
                this.cursor = value;
            },
            get: function get() {
                warn('Property defaultCursor has been replaced with \'cursor\'. ');
                return this.cursor;
            }
        });
    }
    if (interaction.InteractionManager) {
        Object.defineProperty(interaction.InteractionManager, 'defaultCursorStyle', {
            set: function set(value) {
                warn('Property defaultCursorStyle has been replaced with \'cursorStyles.default\'. ');
                this.cursorStyles.default = value;
            },
            get: function get() {
                warn('Property defaultCursorStyle has been replaced with \'cursorStyles.default\'. ');
                return this.cursorStyles.default;
            }
        });
        Object.defineProperty(interaction.InteractionManager, 'currentCursorStyle', {
            set: function set(value) {
                warn('Property currentCursorStyle has been removed.' + 'See the currentCursorMode property, which works differently.');
                this.currentCursorMode = value;
            },
            get: function get() {
                warn('Property currentCursorStyle has been removed.' + 'See the currentCursorMode property, which works differently.');
                return this.currentCursorMode;
            }
        });
    }
}
},{}],132:[function(require,module,exports){
'use strict';
exports.__esModule = true;
var _core = require('../../core');
var core = _interopRequireWildcard(_core);
function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
var TEMP_RECT = new core.Rectangle();
var CanvasExtract = function () {
    function CanvasExtract(renderer) {
        _classCallCheck(this, CanvasExtract);
        this.renderer = renderer;
        renderer.extract = this;
    }
    CanvasExtract.prototype.image = function image(target) {
        var image = new Image();
        image.src = this.base64(target);
        return image;
    };
    CanvasExtract.prototype.base64 = function base64(target) {
        return this.canvas(target).toDataURL();
    };
    CanvasExtract.prototype.canvas = function canvas(target) {
        var renderer = this.renderer;
        var context = void 0;
        var resolution = void 0;
        var frame = void 0;
        var renderTexture = void 0;
        if (target) {
            if (target instanceof core.RenderTexture) {
                renderTexture = target;
            } else {
                renderTexture = renderer.generateTexture(target);
            }
        }
        if (renderTexture) {
            context = renderTexture.baseTexture._canvasRenderTarget.context;
            resolution = renderTexture.baseTexture._canvasRenderTarget.resolution;
            frame = renderTexture.frame;
        } else {
            context = renderer.rootContext;
            frame = TEMP_RECT;
            frame.width = this.renderer.width;
            frame.height = this.renderer.height;
        }
        var width = frame.width * resolution;
        var height = frame.height * resolution;
        var canvasBuffer = new core.CanvasRenderTarget(width, height);
        var canvasData = context.getImageData(frame.x * resolution, frame.y * resolution, width, height);
        canvasBuffer.context.putImageData(canvasData, 0, 0);
        return canvasBuffer.canvas;
    };
    CanvasExtract.prototype.pixels = function pixels(target) {
        var renderer = this.renderer;
        var context = void 0;
        var resolution = void 0;
        var frame = void 0;
        var renderTexture = void 0;
        if (target) {
            if (target instanceof core.RenderTexture) {
                renderTexture = target;
            } else {
                renderTexture = renderer.generateTexture(target);
            }
        }
        if (renderTexture) {
            context = renderTexture.baseTexture._canvasRenderTarget.context;
            resolution = renderTexture.baseTexture._canvasRenderTarget.resolution;
            frame = renderTexture.frame;
        } else {
            context = renderer.rootContext;
            frame = TEMP_RECT;
            frame.width = renderer.width;
            frame.height = renderer.height;
        }
        return context.getImageData(0, 0, frame.width * resolution, frame.height * resolution).data;
    };
    CanvasExtract.prototype.destroy = function destroy() {
        this.renderer.extract = null;
        this.renderer = null;
    };
    return CanvasExtract;
}();
exports.default = CanvasExtract;
core.CanvasRenderer.registerPlugin('extract', CanvasExtract);
},{"../../core":65}],133:[function(require,module,exports){
'use strict';
exports.__esModule = true;
var _WebGLExtract = require('./webgl/WebGLExtract');
Object.defineProperty(exports, 'webgl', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_WebGLExtract).default;
  }
});
var _CanvasExtract = require('./canvas/CanvasExtract');
Object.defineProperty(exports, 'canvas', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_CanvasExtract).default;
  }
});
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
},{"./canvas/CanvasExtract":132,"./webgl/WebGLExtract":134}],134:[function(require,module,exports){
'use strict';
exports.__esModule = true;
var _core = require('../../core');
var core = _interopRequireWildcard(_core);
function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
var TEMP_RECT = new core.Rectangle();
var BYTES_PER_PIXEL = 4;
var WebGLExtract = function () {
    function WebGLExtract(renderer) {
        _classCallCheck(this, WebGLExtract);
        this.renderer = renderer;
        renderer.extract = this;
    }
    WebGLExtract.prototype.image = function image(target) {
        var image = new Image();
        image.src = this.base64(target);
        return image;
    };
    WebGLExtract.prototype.base64 = function base64(target) {
        return this.canvas(target).toDataURL();
    };
    WebGLExtract.prototype.canvas = function canvas(target) {
        var renderer = this.renderer;
        var textureBuffer = void 0;
        var resolution = void 0;
        var frame = void 0;
        var flipY = false;
        var renderTexture = void 0;
        var generated = false;
        if (target) {
            if (target instanceof core.RenderTexture) {
                renderTexture = target;
            } else {
                renderTexture = this.renderer.generateTexture(target);
                generated = true;
            }
        }
        if (renderTexture) {
            textureBuffer = renderTexture.baseTexture._glRenderTargets[this.renderer.CONTEXT_UID];
            resolution = textureBuffer.resolution;
            frame = renderTexture.frame;
            flipY = false;
        } else {
            textureBuffer = this.renderer.rootRenderTarget;
            resolution = textureBuffer.resolution;
            flipY = true;
            frame = TEMP_RECT;
            frame.width = textureBuffer.size.width;
            frame.height = textureBuffer.size.height;
        }
        var width = frame.width * resolution;
        var height = frame.height * resolution;
        var canvasBuffer = new core.CanvasRenderTarget(width, height);
        if (textureBuffer) {
            renderer.bindRenderTarget(textureBuffer);
            var webglPixels = new Uint8Array(BYTES_PER_PIXEL * width * height);
            var gl = renderer.gl;
            gl.readPixels(frame.x * resolution, frame.y * resolution, width, height, gl.RGBA, gl.UNSIGNED_BYTE, webglPixels);
            var canvasData = canvasBuffer.context.getImageData(0, 0, width, height);
            canvasData.data.set(webglPixels);
            canvasBuffer.context.putImageData(canvasData, 0, 0);
            if (flipY) {
                canvasBuffer.context.scale(1, -1);
                canvasBuffer.context.drawImage(canvasBuffer.canvas, 0, -height);
            }
        }
        if (generated) {
            renderTexture.destroy(true);
        }
        return canvasBuffer.canvas;
    };
    WebGLExtract.prototype.pixels = function pixels(target) {
        var renderer = this.renderer;
        var textureBuffer = void 0;
        var resolution = void 0;
        var frame = void 0;
        var renderTexture = void 0;
        var generated = false;
        if (target) {
            if (target instanceof core.RenderTexture) {
                renderTexture = target;
            } else {
                renderTexture = this.renderer.generateTexture(target);
                generated = true;
            }
        }
        if (renderTexture) {
            textureBuffer = renderTexture.baseTexture._glRenderTargets[this.renderer.CONTEXT_UID];
            resolution = textureBuffer.resolution;
            frame = renderTexture.frame;
        } else {
            textureBuffer = this.renderer.rootRenderTarget;
            resolution = textureBuffer.resolution;
            frame = TEMP_RECT;
            frame.width = textureBuffer.size.width;
            frame.height = textureBuffer.size.height;
        }
        var width = frame.width * resolution;
        var height = frame.height * resolution;
        var webglPixels = new Uint8Array(BYTES_PER_PIXEL * width * height);
        if (textureBuffer) {
            renderer.bindRenderTarget(textureBuffer);
            var gl = renderer.gl;
            gl.readPixels(frame.x * resolution, frame.y * resolution, width, height, gl.RGBA, gl.UNSIGNED_BYTE, webglPixels);
        }
        if (generated) {
            renderTexture.destroy(true);
        }
        return webglPixels;
    };
    WebGLExtract.prototype.destroy = function destroy() {
        this.renderer.extract = null;
        this.renderer = null;
    };
    return WebGLExtract;
}();
exports.default = WebGLExtract;
core.WebGLRenderer.registerPlugin('extract', WebGLExtract);
},{"../../core":65}],135:[function(require,module,exports){
'use strict';
exports.__esModule = true;
var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
var _core = require('../core');
var core = _interopRequireWildcard(_core);
function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
var AnimatedSprite = function (_core$Sprite) {
    _inherits(AnimatedSprite, _core$Sprite);
    function AnimatedSprite(textures, autoUpdate) {
        _classCallCheck(this, AnimatedSprite);
        var _this = _possibleConstructorReturn(this, _core$Sprite.call(this, textures[0] instanceof core.Texture ? textures[0] : textures[0].texture));
        _this._textures = null;
        _this._durations = null;
        _this.textures = textures;
        _this._autoUpdate = autoUpdate !== false;
        _this.animationSpeed = 1;
        _this.loop = true;
        _this.onComplete = null;
        _this.onFrameChange = null;
        _this.onLoop = null;
        _this._currentTime = 0;
        _this.playing = false;
        return _this;
    }
    AnimatedSprite.prototype.stop = function stop() {
        if (!this.playing) {
            return;
        }
        this.playing = false;
        if (this._autoUpdate) {
            core.ticker.shared.remove(this.update, this);
        }
    };
    AnimatedSprite.prototype.play = function play() {
        if (this.playing) {
            return;
        }
        this.playing = true;
        if (this._autoUpdate) {
            core.ticker.shared.add(this.update, this, core.UPDATE_PRIORITY.HIGH);
        }
    };
    AnimatedSprite.prototype.gotoAndStop = function gotoAndStop(frameNumber) {
        this.stop();
        var previousFrame = this.currentFrame;
        this._currentTime = frameNumber;
        if (previousFrame !== this.currentFrame) {
            this.updateTexture();
        }
    };
    AnimatedSprite.prototype.gotoAndPlay = function gotoAndPlay(frameNumber) {
        var previousFrame = this.currentFrame;
        this._currentTime = frameNumber;
        if (previousFrame !== this.currentFrame) {
            this.updateTexture();
        }
        this.play();
    };
    AnimatedSprite.prototype.update = function update(deltaTime) {
        var elapsed = this.animationSpeed * deltaTime;
        var previousFrame = this.currentFrame;
        if (this._durations !== null) {
            var lag = this._currentTime % 1 * this._durations[this.currentFrame];
            lag += elapsed / 60 * 1000;
            while (lag < 0) {
                this._currentTime--;
                lag += this._durations[this.currentFrame];
            }
            var sign = Math.sign(this.animationSpeed * deltaTime);
            this._currentTime = Math.floor(this._currentTime);
            while (lag >= this._durations[this.currentFrame]) {
                lag -= this._durations[this.currentFrame] * sign;
                this._currentTime += sign;
            }
            this._currentTime += lag / this._durations[this.currentFrame];
        } else {
            this._currentTime += elapsed;
        }
        if (this._currentTime < 0 && !this.loop) {
            this.gotoAndStop(0);
            if (this.onComplete) {
                this.onComplete();
            }
        } else if (this._currentTime >= this._textures.length && !this.loop) {
            this.gotoAndStop(this._textures.length - 1);
            if (this.onComplete) {
                this.onComplete();
            }
        } else if (previousFrame !== this.currentFrame) {
            if (this.loop && this.onLoop) {
                if (this.animationSpeed > 0 && this.currentFrame < previousFrame) {
                    this.onLoop();
                } else if (this.animationSpeed < 0 && this.currentFrame > previousFrame) {
                    this.onLoop();
                }
            }
            this.updateTexture();
        }
    };
    AnimatedSprite.prototype.updateTexture = function updateTexture() {
        this._texture = this._textures[this.currentFrame];
        this._textureID = -1;
        this.cachedTint = 0xFFFFFF;
        if (this.onFrameChange) {
            this.onFrameChange(this.currentFrame);
        }
    };
    AnimatedSprite.prototype.destroy = function destroy(options) {
        this.stop();
        _core$Sprite.prototype.destroy.call(this, options);
    };
    AnimatedSprite.fromFrames = function fromFrames(frames) {
        var textures = [];
        for (var i = 0; i < frames.length; ++i) {
            textures.push(core.Texture.fromFrame(frames[i]));
        }
        return new AnimatedSprite(textures);
    };
    AnimatedSprite.fromImages = function fromImages(images) {
        var textures = [];
        for (var i = 0; i < images.length; ++i) {
            textures.push(core.Texture.fromImage(images[i]));
        }
        return new AnimatedSprite(textures);
    };
    _createClass(AnimatedSprite, [{
        key: 'totalFrames',
        get: function get() {
            return this._textures.length;
        }
    }, {
        key: 'textures',
        get: function get() {
            return this._textures;
        },
        set: function set(value) 
        {
            if (value[0] instanceof core.Texture) {
                this._textures = value;
                this._durations = null;
            } else {
                this._textures = [];
                this._durations = [];
                for (var i = 0; i < value.length; i++) {
                    this._textures.push(value[i].texture);
                    this._durations.push(value[i].time);
                }
            }
            this.gotoAndStop(0);
            this.updateTexture();
        }
    }, {
        key: 'currentFrame',
        get: function get() {
            var currentFrame = Math.floor(this._currentTime) % this._textures.length;
            if (currentFrame < 0) {
                currentFrame += this._textures.length;
            }
            return currentFrame;
        }
    }]);
    return AnimatedSprite;
}(core.Sprite);
exports.default = AnimatedSprite;
},{"../core":65}],136:[function(require,module,exports){
'use strict';
exports.__esModule = true;
var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
var _core = require('../core');
var core = _interopRequireWildcard(_core);
var _ObservablePoint = require('../core/math/ObservablePoint');
var _ObservablePoint2 = _interopRequireDefault(_ObservablePoint);
var _utils = require('../core/utils');
var _settings = require('../core/settings');
var _settings2 = _interopRequireDefault(_settings);
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
var BitmapText = function (_core$Container) {
    _inherits(BitmapText, _core$Container);
    function BitmapText(text) {
        var style = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
        _classCallCheck(this, BitmapText);
        var _this = _possibleConstructorReturn(this, _core$Container.call(this));
        _this._textWidth = 0;
        _this._textHeight = 0;
        _this._glyphs = [];
        _this._font = {
            tint: style.tint !== undefined ? style.tint : 0xFFFFFF,
            align: style.align || 'left',
            name: null,
            size: 0
        };
        _this.font = style.font; 
        _this._text = text;
        _this._maxWidth = 0;
        _this._maxLineHeight = 0;
        _this._letterSpacing = 0;
        _this._anchor = new _ObservablePoint2.default(function () {
            _this.dirty = true;
        }, _this, 0, 0);
        _this.dirty = false;
        _this.updateText();
        return _this;
    }
    BitmapText.prototype.updateText = function updateText() {
        var data = BitmapText.fonts[this._font.name];
        var scale = this._font.size / data.size;
        var pos = new core.Point();
        var chars = [];
        var lineWidths = [];
        var text = this.text.replace(/(?:\r\n|\r)/g, '\n');
        var textLength = text.length;
        var maxWidth = this._maxWidth * data.size / this._font.size;
        var prevCharCode = null;
        var lastLineWidth = 0;
        var maxLineWidth = 0;
        var line = 0;
        var lastBreakPos = -1;
        var lastBreakWidth = 0;
        var spacesRemoved = 0;
        var maxLineHeight = 0;
        for (var i = 0; i < textLength; i++) {
            var charCode = text.charCodeAt(i);
            var char = text.charAt(i);
            if (/(?:\s)/.test(char)) {
                lastBreakPos = i;
                lastBreakWidth = lastLineWidth;
            }
            if (char === '\r' || char === '\n') {
                lineWidths.push(lastLineWidth);
                maxLineWidth = Math.max(maxLineWidth, lastLineWidth);
                ++line;
                ++spacesRemoved;
                pos.x = 0;
                pos.y += data.lineHeight;
                prevCharCode = null;
                continue;
            }
            var charData = data.chars[charCode];
            if (!charData) {
                continue;
            }
            if (prevCharCode && charData.kerning[prevCharCode]) {
                pos.x += charData.kerning[prevCharCode];
            }
            chars.push({
                texture: charData.texture,
                line: line,
                charCode: charCode,
                position: new core.Point(pos.x + charData.xOffset + this._letterSpacing / 2, pos.y + charData.yOffset)
            });
            pos.x += charData.xAdvance + this._letterSpacing;
            lastLineWidth = pos.x;
            maxLineHeight = Math.max(maxLineHeight, charData.yOffset + charData.texture.height);
            prevCharCode = charCode;
            if (lastBreakPos !== -1 && maxWidth > 0 && pos.x > maxWidth) {
                ++spacesRemoved;
                core.utils.removeItems(chars, 1 + lastBreakPos - spacesRemoved, 1 + i - lastBreakPos);
                i = lastBreakPos;
                lastBreakPos = -1;
                lineWidths.push(lastBreakWidth);
                maxLineWidth = Math.max(maxLineWidth, lastBreakWidth);
                line++;
                pos.x = 0;
                pos.y += data.lineHeight;
                prevCharCode = null;
            }
        }
        var lastChar = text.charAt(text.length - 1);
        if (lastChar !== '\r' && lastChar !== '\n') {
            if (/(?:\s)/.test(lastChar)) {
                lastLineWidth = lastBreakWidth;
            }
            lineWidths.push(lastLineWidth);
            maxLineWidth = Math.max(maxLineWidth, lastLineWidth);
        }
        var lineAlignOffsets = [];
        for (var _i = 0; _i <= line; _i++) {
            var alignOffset = 0;
            if (this._font.align === 'right') {
                alignOffset = maxLineWidth - lineWidths[_i];
            } else if (this._font.align === 'center') {
                alignOffset = (maxLineWidth - lineWidths[_i]) / 2;
            }
            lineAlignOffsets.push(alignOffset);
        }
        var lenChars = chars.length;
        var tint = this.tint;
        for (var _i2 = 0; _i2 < lenChars; _i2++) {
            var c = this._glyphs[_i2]; 
            if (c) {
                c.texture = chars[_i2].texture;
            } else {
                c = new core.Sprite(chars[_i2].texture);
                this._glyphs.push(c);
            }
            c.position.x = (chars[_i2].position.x + lineAlignOffsets[chars[_i2].line]) * scale;
            c.position.y = chars[_i2].position.y * scale;
            c.scale.x = c.scale.y = scale;
            c.tint = tint;
            if (!c.parent) {
                this.addChild(c);
            }
        }
        for (var _i3 = lenChars; _i3 < this._glyphs.length; ++_i3) {
            this.removeChild(this._glyphs[_i3]);
        }
        this._textWidth = maxLineWidth * scale;
        this._textHeight = (pos.y + data.lineHeight) * scale;
        if (this.anchor.x !== 0 || this.anchor.y !== 0) {
            for (var _i4 = 0; _i4 < lenChars; _i4++) {
                this._glyphs[_i4].x -= this._textWidth * this.anchor.x;
                this._glyphs[_i4].y -= this._textHeight * this.anchor.y;
            }
        }
        this._maxLineHeight = maxLineHeight * scale;
    };
    BitmapText.prototype.updateTransform = function updateTransform() {
        this.validate();
        this.containerUpdateTransform();
    };
    BitmapText.prototype.getLocalBounds = function getLocalBounds() {
        this.validate();
        return _core$Container.prototype.getLocalBounds.call(this);
    };
    BitmapText.prototype.validate = function validate() {
        if (this.dirty) {
            this.updateText();
            this.dirty = false;
        }
    };
    BitmapText.registerFont = function registerFont(xml, textures) {
        var data = {};
        var info = xml.getElementsByTagName('info')[0];
        var common = xml.getElementsByTagName('common')[0];
        var pages = xml.getElementsByTagName('page');
        var res = (0, _utils.getResolutionOfUrl)(pages[0].getAttribute('file'), _settings2.default.RESOLUTION);
        var pagesTextures = {};
        data.font = info.getAttribute('face');
        data.size = parseInt(info.getAttribute('size'), 10);
        data.lineHeight = parseInt(common.getAttribute('lineHeight'), 10) / res;
        data.chars = {};
        if (textures instanceof core.Texture) {
            textures = [textures];
        }
        for (var i = 0; i < pages.length; i++) {
            var id = pages[i].getAttribute('id');
            var file = pages[i].getAttribute('file');
            pagesTextures[id] = textures instanceof Array ? textures[i] : textures[file];
        }
        var letters = xml.getElementsByTagName('char');
        for (var _i5 = 0; _i5 < letters.length; _i5++) {
            var letter = letters[_i5];
            var charCode = parseInt(letter.getAttribute('id'), 10);
            var page = letter.getAttribute('page') || 0;
            var textureRect = new core.Rectangle(parseInt(letter.getAttribute('x'), 10) / res + pagesTextures[page].frame.x / res, parseInt(letter.getAttribute('y'), 10) / res + pagesTextures[page].frame.y / res, parseInt(letter.getAttribute('width'), 10) / res, parseInt(letter.getAttribute('height'), 10) / res);
            data.chars[charCode] = {
                xOffset: parseInt(letter.getAttribute('xoffset'), 10) / res,
                yOffset: parseInt(letter.getAttribute('yoffset'), 10) / res,
                xAdvance: parseInt(letter.getAttribute('xadvance'), 10) / res,
                kerning: {},
                texture: new core.Texture(pagesTextures[page].baseTexture, textureRect),
                page: page
            };
        }
        var kernings = xml.getElementsByTagName('kerning');
        for (var _i6 = 0; _i6 < kernings.length; _i6++) {
            var kerning = kernings[_i6];
            var first = parseInt(kerning.getAttribute('first'), 10) / res;
            var second = parseInt(kerning.getAttribute('second'), 10) / res;
            var amount = parseInt(kerning.getAttribute('amount'), 10) / res;
            if (data.chars[second]) {
                data.chars[second].kerning[first] = amount;
            }
        }
        BitmapText.fonts[data.font] = data;
        return data;
    };
    _createClass(BitmapText, [{
        key: 'tint',
        get: function get() {
            return this._font.tint;
        },
        set: function set(value) 
        {
            this._font.tint = typeof value === 'number' && value >= 0 ? value : 0xFFFFFF;
            this.dirty = true;
        }
    }, {
        key: 'align',
        get: function get() {
            return this._font.align;
        },
        set: function set(value) 
        {
            this._font.align = value || 'left';
            this.dirty = true;
        }
    }, {
        key: 'anchor',
        get: function get() {
            return this._anchor;
        },
        set: function set(value) 
        {
            if (typeof value === 'number') {
                this._anchor.set(value);
            } else {
                this._anchor.copy(value);
            }
        }
    }, {
        key: 'font',
        get: function get() {
            return this._font;
        },
        set: function set(value) 
        {
            if (!value) {
                return;
            }
            if (typeof value === 'string') {
                value = value.split(' ');
                this._font.name = value.length === 1 ? value[0] : value.slice(1).join(' ');
                this._font.size = value.length >= 2 ? parseInt(value[0], 10) : BitmapText.fonts[this._font.name].size;
            } else {
                this._font.name = value.name;
                this._font.size = typeof value.size === 'number' ? value.size : parseInt(value.size, 10);
            }
            this.dirty = true;
        }
    }, {
        key: 'text',
        get: function get() {
            return this._text;
        },
        set: function set(value) 
        {
            value = value.toString() || ' ';
            if (this._text === value) {
                return;
            }
            this._text = value;
            this.dirty = true;
        }
    }, {
        key: 'maxWidth',
        get: function get() {
            return this._maxWidth;
        },
        set: function set(value) 
        {
            if (this._maxWidth === value) {
                return;
            }
            this._maxWidth = value;
            this.dirty = true;
        }
    }, {
        key: 'maxLineHeight',
        get: function get() {
            this.validate();
            return this._maxLineHeight;
        }
    }, {
        key: 'textWidth',
        get: function get() {
            this.validate();
            return this._textWidth;
        }
    }, {
        key: 'letterSpacing',
        get: function get() {
            return this._letterSpacing;
        },
        set: function set(value) 
        {
            if (this._letterSpacing !== value) {
                this._letterSpacing = value;
                this.dirty = true;
            }
        }
    }, {
        key: 'textHeight',
        get: function get() {
            this.validate();
            return this._textHeight;
        }
    }]);
    return BitmapText;
}(core.Container);
exports.default = BitmapText;
BitmapText.fonts = {};
},{"../core":65,"../core/math/ObservablePoint":68,"../core/settings":101,"../core/utils":125}],137:[function(require,module,exports){
'use strict';
exports.__esModule = true;
var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
var _core = require('../core');
var core = _interopRequireWildcard(_core);
var _CanvasTinter = require('../core/sprites/canvas/CanvasTinter');
var _CanvasTinter2 = _interopRequireDefault(_CanvasTinter);
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
var tempPoint = new core.Point();
var TilingSprite = function (_core$Sprite) {
    _inherits(TilingSprite, _core$Sprite);
    function TilingSprite(texture) {
        var width = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 100;
        var height = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 100;
        _classCallCheck(this, TilingSprite);
        var _this = _possibleConstructorReturn(this, _core$Sprite.call(this, texture));
        _this.tileTransform = new core.TransformStatic();
        _this._width = width;
        _this._height = height;
        _this._canvasPattern = null;
        _this.uvTransform = texture.transform || new core.TextureMatrix(texture);
        _this.pluginName = 'tilingSprite';
        _this.uvRespectAnchor = false;
        return _this;
    }
    TilingSprite.prototype._onTextureUpdate = function _onTextureUpdate() {
        if (this.uvTransform) {
            this.uvTransform.texture = this._texture;
        }
        this.cachedTint = 0xFFFFFF;
    };
    TilingSprite.prototype._renderWebGL = function _renderWebGL(renderer) {
        var texture = this._texture;
        if (!texture || !texture.valid) {
            return;
        }
        this.tileTransform.updateLocalTransform();
        this.uvTransform.update();
        renderer.setObjectRenderer(renderer.plugins[this.pluginName]);
        renderer.plugins[this.pluginName].render(this);
    };
    TilingSprite.prototype._renderCanvas = function _renderCanvas(renderer) {
        var texture = this._texture;
        if (!texture.baseTexture.hasLoaded) {
            return;
        }
        var context = renderer.context;
        var transform = this.worldTransform;
        var resolution = renderer.resolution;
        var baseTexture = texture.baseTexture;
        var baseTextureResolution = baseTexture.resolution;
        var modX = this.tilePosition.x / this.tileScale.x % texture._frame.width * baseTextureResolution;
        var modY = this.tilePosition.y / this.tileScale.y % texture._frame.height * baseTextureResolution;
        if (this._textureID !== this._texture._updateID || this.cachedTint !== this.tint) {
            this._textureID = this._texture._updateID;
            var tempCanvas = new core.CanvasRenderTarget(texture._frame.width, texture._frame.height, baseTextureResolution);
            if (this.tint !== 0xFFFFFF) {
                this.tintedTexture = _CanvasTinter2.default.getTintedTexture(this, this.tint);
                tempCanvas.context.drawImage(this.tintedTexture, 0, 0);
            } else {
                tempCanvas.context.drawImage(baseTexture.source, -texture._frame.x * baseTextureResolution, -texture._frame.y * baseTextureResolution);
            }
            this.cachedTint = this.tint;
            this._canvasPattern = tempCanvas.context.createPattern(tempCanvas.canvas, 'repeat');
        }
        context.globalAlpha = this.worldAlpha;
        context.setTransform(transform.a * resolution, transform.b * resolution, transform.c * resolution, transform.d * resolution, transform.tx * resolution, transform.ty * resolution);
        renderer.setBlendMode(this.blendMode);
        context.fillStyle = this._canvasPattern;
        context.scale(this.tileScale.x / baseTextureResolution, this.tileScale.y / baseTextureResolution);
        var anchorX = this.anchor.x * -this._width;
        var anchorY = this.anchor.y * -this._height;
        if (this.uvRespectAnchor) {
            context.translate(modX, modY);
            context.fillRect(-modX + anchorX, -modY + anchorY, this._width / this.tileScale.x * baseTextureResolution, this._height / this.tileScale.y * baseTextureResolution);
        } else {
            context.translate(modX + anchorX, modY + anchorY);
            context.fillRect(-modX, -modY, this._width / this.tileScale.x * baseTextureResolution, this._height / this.tileScale.y * baseTextureResolution);
        }
    };
    TilingSprite.prototype._calculateBounds = function _calculateBounds() {
        var minX = this._width * -this._anchor._x;
        var minY = this._height * -this._anchor._y;
        var maxX = this._width * (1 - this._anchor._x);
        var maxY = this._height * (1 - this._anchor._y);
        this._bounds.addFrame(this.transform, minX, minY, maxX, maxY);
    };
    TilingSprite.prototype.getLocalBounds = function getLocalBounds(rect) {
        if (this.children.length === 0) {
            this._bounds.minX = this._width * -this._anchor._x;
            this._bounds.minY = this._height * -this._anchor._y;
            this._bounds.maxX = this._width * (1 - this._anchor._x);
            this._bounds.maxY = this._height * (1 - this._anchor._y);
            if (!rect) {
                if (!this._localBoundsRect) {
                    this._localBoundsRect = new core.Rectangle();
                }
                rect = this._localBoundsRect;
            }
            return this._bounds.getRectangle(rect);
        }
        return _core$Sprite.prototype.getLocalBounds.call(this, rect);
    };
    TilingSprite.prototype.containsPoint = function containsPoint(point) {
        this.worldTransform.applyInverse(point, tempPoint);
        var width = this._width;
        var height = this._height;
        var x1 = -width * this.anchor._x;
        if (tempPoint.x >= x1 && tempPoint.x < x1 + width) {
            var y1 = -height * this.anchor._y;
            if (tempPoint.y >= y1 && tempPoint.y < y1 + height) {
                return true;
            }
        }
        return false;
    };
    TilingSprite.prototype.destroy = function destroy(options) {
        _core$Sprite.prototype.destroy.call(this, options);
        this.tileTransform = null;
        this.uvTransform = null;
    };
    TilingSprite.from = function from(source, width, height) {
        return new TilingSprite(core.Texture.from(source), width, height);
    };
    TilingSprite.fromFrame = function fromFrame(frameId, width, height) {
        var texture = core.utils.TextureCache[frameId];
        if (!texture) {
            throw new Error('The frameId "' + frameId + '" does not exist in the texture cache ' + this);
        }
        return new TilingSprite(texture, width, height);
    };
    TilingSprite.fromImage = function fromImage(imageId, width, height, crossorigin, scaleMode) {
        return new TilingSprite(core.Texture.fromImage(imageId, crossorigin, scaleMode), width, height);
    };
    _createClass(TilingSprite, [{
        key: 'clampMargin',
        get: function get() {
            return this.uvTransform.clampMargin;
        },
        set: function set(value) 
        {
            this.uvTransform.clampMargin = value;
            this.uvTransform.update(true);
        }
    }, {
        key: 'tileScale',
        get: function get() {
            return this.tileTransform.scale;
        },
        set: function set(value) 
        {
            this.tileTransform.scale.copy(value);
        }
    }, {
        key: 'tilePosition',
        get: function get() {
            return this.tileTransform.position;
        },
        set: function set(value) 
        {
            this.tileTransform.position.copy(value);
        }
    }, {
        key: 'width',
        get: function get() {
            return this._width;
        },
        set: function set(value) 
        {
            this._width = value;
        }
    }, {
        key: 'height',
        get: function get() {
            return this._height;
        },
        set: function set(value) 
        {
            this._height = value;
        }
    }]);
    return TilingSprite;
}(core.Sprite);
exports.default = TilingSprite;
},{"../core":65,"../core/sprites/canvas/CanvasTinter":104}],138:[function(require,module,exports){
'use strict';
var _core = require('../core');
var core = _interopRequireWildcard(_core);
var _Texture = require('../core/textures/Texture');
var _Texture2 = _interopRequireDefault(_Texture);
var _BaseTexture = require('../core/textures/BaseTexture');
var _BaseTexture2 = _interopRequireDefault(_BaseTexture);
var _utils = require('../core/utils');
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
var DisplayObject = core.DisplayObject;
var _tempMatrix = new core.Matrix();
DisplayObject.prototype._cacheAsBitmap = false;
DisplayObject.prototype._cacheData = false;
var CacheData =
function CacheData() {
    _classCallCheck(this, CacheData);
    this.textureCacheId = null;
    this.originalRenderWebGL = null;
    this.originalRenderCanvas = null;
    this.originalCalculateBounds = null;
    this.originalGetLocalBounds = null;
    this.originalUpdateTransform = null;
    this.originalHitTest = null;
    this.originalDestroy = null;
    this.originalMask = null;
    this.originalFilterArea = null;
    this.sprite = null;
};
Object.defineProperties(DisplayObject.prototype, {
    cacheAsBitmap: {
        get: function get() {
            return this._cacheAsBitmap;
        },
        set: function set(value) {
            if (this._cacheAsBitmap === value) {
                return;
            }
            this._cacheAsBitmap = value;
            var data = void 0;
            if (value) {
                if (!this._cacheData) {
                    this._cacheData = new CacheData();
                }
                data = this._cacheData;
                data.originalRenderWebGL = this.renderWebGL;
                data.originalRenderCanvas = this.renderCanvas;
                data.originalUpdateTransform = this.updateTransform;
                data.originalCalculateBounds = this._calculateBounds;
                data.originalGetLocalBounds = this.getLocalBounds;
                data.originalDestroy = this.destroy;
                data.originalContainsPoint = this.containsPoint;
                data.originalMask = this._mask;
                data.originalFilterArea = this.filterArea;
                this.renderWebGL = this._renderCachedWebGL;
                this.renderCanvas = this._renderCachedCanvas;
                this.destroy = this._cacheAsBitmapDestroy;
            } else {
                data = this._cacheData;
                if (data.sprite) {
                    this._destroyCachedDisplayObject();
                }
                this.renderWebGL = data.originalRenderWebGL;
                this.renderCanvas = data.originalRenderCanvas;
                this._calculateBounds = data.originalCalculateBounds;
                this.getLocalBounds = data.originalGetLocalBounds;
                this.destroy = data.originalDestroy;
                this.updateTransform = data.originalUpdateTransform;
                this.containsPoint = data.originalContainsPoint;
                this._mask = data.originalMask;
                this.filterArea = data.originalFilterArea;
            }
        }
    }
});
DisplayObject.prototype._renderCachedWebGL = function _renderCachedWebGL(renderer) {
    if (!this.visible || this.worldAlpha <= 0 || !this.renderable) {
        return;
    }
    this._initCachedDisplayObject(renderer);
    this._cacheData.sprite._transformID = -1;
    this._cacheData.sprite.worldAlpha = this.worldAlpha;
    this._cacheData.sprite._renderWebGL(renderer);
};
DisplayObject.prototype._initCachedDisplayObject = function _initCachedDisplayObject(renderer) {
    if (this._cacheData && this._cacheData.sprite) {
        return;
    }
    var cacheAlpha = this.alpha;
    this.alpha = 1;
    renderer.currentRenderer.flush();
    var bounds = this.getLocalBounds().clone();
    if (this._filters) {
        var padding = this._filters[0].padding;
        bounds.pad(padding);
    }
    var cachedRenderTarget = renderer._activeRenderTarget;
    var stack = renderer.filterManager.filterStack;
    var renderTexture = core.RenderTexture.create(bounds.width | 0, bounds.height | 0);
    var textureCacheId = 'cacheAsBitmap_' + (0, _utils.uid)();
    this._cacheData.textureCacheId = textureCacheId;
    _BaseTexture2.default.addToCache(renderTexture.baseTexture, textureCacheId);
    _Texture2.default.addToCache(renderTexture, textureCacheId);
    var m = _tempMatrix;
    m.tx = -bounds.x;
    m.ty = -bounds.y;
    this.transform.worldTransform.identity();
    this.renderWebGL = this._cacheData.originalRenderWebGL;
    renderer.render(this, renderTexture, true, m, true);
    renderer.bindRenderTarget(cachedRenderTarget);
    renderer.filterManager.filterStack = stack;
    this.renderWebGL = this._renderCachedWebGL;
    this.updateTransform = this.displayObjectUpdateTransform;
    this._mask = null;
    this.filterArea = null;
    var cachedSprite = new core.Sprite(renderTexture);
    cachedSprite.transform.worldTransform = this.transform.worldTransform;
    cachedSprite.anchor.x = -(bounds.x / bounds.width);
    cachedSprite.anchor.y = -(bounds.y / bounds.height);
    cachedSprite.alpha = cacheAlpha;
    cachedSprite._bounds = this._bounds;
    this._calculateBounds = this._calculateCachedBounds;
    this.getLocalBounds = this._getCachedLocalBounds;
    this._cacheData.sprite = cachedSprite;
    this.transform._parentID = -1;
    if (!this.parent) {
        this.parent = renderer._tempDisplayObjectParent;
        this.updateTransform();
        this.parent = null;
    } else {
        this.updateTransform();
    }
    this.containsPoint = cachedSprite.containsPoint.bind(cachedSprite);
};
DisplayObject.prototype._renderCachedCanvas = function _renderCachedCanvas(renderer) {
    if (!this.visible || this.worldAlpha <= 0 || !this.renderable) {
        return;
    }
    this._initCachedDisplayObjectCanvas(renderer);
    this._cacheData.sprite.worldAlpha = this.worldAlpha;
    this._cacheData.sprite.renderCanvas(renderer);
};
DisplayObject.prototype._initCachedDisplayObjectCanvas = function _initCachedDisplayObjectCanvas(renderer) {
    if (this._cacheData && this._cacheData.sprite) {
        return;
    }
    var bounds = this.getLocalBounds();
    var cacheAlpha = this.alpha;
    this.alpha = 1;
    var cachedRenderTarget = renderer.context;
    var renderTexture = core.RenderTexture.create(bounds.width | 0, bounds.height | 0);
    var textureCacheId = 'cacheAsBitmap_' + (0, _utils.uid)();
    this._cacheData.textureCacheId = textureCacheId;
    _BaseTexture2.default.addToCache(renderTexture.baseTexture, textureCacheId);
    _Texture2.default.addToCache(renderTexture, textureCacheId);
    var m = _tempMatrix;
    this.transform.localTransform.copy(m);
    m.invert();
    m.tx -= bounds.x;
    m.ty -= bounds.y;
    this.renderCanvas = this._cacheData.originalRenderCanvas;
    renderer.render(this, renderTexture, true, m, false);
    renderer.context = cachedRenderTarget;
    this.renderCanvas = this._renderCachedCanvas;
    this._calculateBounds = this._calculateCachedBounds;
    this._mask = null;
    this.filterArea = null;
    var cachedSprite = new core.Sprite(renderTexture);
    cachedSprite.transform.worldTransform = this.transform.worldTransform;
    cachedSprite.anchor.x = -(bounds.x / bounds.width);
    cachedSprite.anchor.y = -(bounds.y / bounds.height);
    cachedSprite._bounds = this._bounds;
    cachedSprite.alpha = cacheAlpha;
    if (!this.parent) {
        this.parent = renderer._tempDisplayObjectParent;
        this.updateTransform();
        this.parent = null;
    } else {
        this.updateTransform();
    }
    this.updateTransform = this.displayObjectUpdateTransform;
    this._cacheData.sprite = cachedSprite;
    this.containsPoint = cachedSprite.containsPoint.bind(cachedSprite);
};
DisplayObject.prototype._calculateCachedBounds = function _calculateCachedBounds() {
    this._cacheData.sprite._calculateBounds();
};
DisplayObject.prototype._getCachedLocalBounds = function _getCachedLocalBounds() {
    return this._cacheData.sprite.getLocalBounds();
};
DisplayObject.prototype._destroyCachedDisplayObject = function _destroyCachedDisplayObject() {
    this._cacheData.sprite._texture.destroy(true);
    this._cacheData.sprite = null;
    _BaseTexture2.default.removeFromCache(this._cacheData.textureCacheId);
    _Texture2.default.removeFromCache(this._cacheData.textureCacheId);
    this._cacheData.textureCacheId = null;
};
DisplayObject.prototype._cacheAsBitmapDestroy = function _cacheAsBitmapDestroy(options) {
    this.cacheAsBitmap = false;
    this.destroy(options);
};
},{"../core":65,"../core/textures/BaseTexture":112,"../core/textures/Texture":115,"../core/utils":125}],139:[function(require,module,exports){
'use strict';
var _core = require('../core');
var core = _interopRequireWildcard(_core);
function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }
core.DisplayObject.prototype.name = null;
core.Container.prototype.getChildByName = function getChildByName(name) {
    for (var i = 0; i < this.children.length; i++) {
        if (this.children[i].name === name) {
            return this.children[i];
        }
    }
    return null;
};
},{"../core":65}],140:[function(require,module,exports){
'use strict';
var _core = require('../core');
var core = _interopRequireWildcard(_core);
function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }
core.DisplayObject.prototype.getGlobalPosition = function getGlobalPosition() {
    var point = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : new core.Point();
    var skipUpdate = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
    if (this.parent) {
        this.parent.toGlobal(this.position, point, skipUpdate);
    } else {
        point.x = this.position.x;
        point.y = this.position.y;
    }
    return point;
};
},{"../core":65}],141:[function(require,module,exports){
'use strict';
exports.__esModule = true;
exports.BitmapText = exports.TilingSpriteRenderer = exports.TilingSprite = exports.AnimatedSprite = undefined;
var _AnimatedSprite = require('./AnimatedSprite');
Object.defineProperty(exports, 'AnimatedSprite', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_AnimatedSprite).default;
  }
});
var _TilingSprite = require('./TilingSprite');
Object.defineProperty(exports, 'TilingSprite', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_TilingSprite).default;
  }
});
var _TilingSpriteRenderer = require('./webgl/TilingSpriteRenderer');
Object.defineProperty(exports, 'TilingSpriteRenderer', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_TilingSpriteRenderer).default;
  }
});
var _BitmapText = require('./BitmapText');
Object.defineProperty(exports, 'BitmapText', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_BitmapText).default;
  }
});
require('./cacheAsBitmap');
require('./getChildByName');
require('./getGlobalPosition');
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
},{"./AnimatedSprite":135,"./BitmapText":136,"./TilingSprite":137,"./cacheAsBitmap":138,"./getChildByName":139,"./getGlobalPosition":140,"./webgl/TilingSpriteRenderer":142}],142:[function(require,module,exports){
'use strict';
exports.__esModule = true;
var _core = require('../../core');
var core = _interopRequireWildcard(_core);
var _const = require('../../core/const');
var _path = require('path');
function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
var tempMat = new core.Matrix();
var TilingSpriteRenderer = function (_core$ObjectRenderer) {
    _inherits(TilingSpriteRenderer, _core$ObjectRenderer);
    function TilingSpriteRenderer(renderer) {
        _classCallCheck(this, TilingSpriteRenderer);
        var _this = _possibleConstructorReturn(this, _core$ObjectRenderer.call(this, renderer));
        _this.shader = null;
        _this.simpleShader = null;
        _this.quad = null;
        return _this;
    }
    TilingSpriteRenderer.prototype.onContextChange = function onContextChange() {
        var gl = this.renderer.gl;
        this.shader = new core.Shader(gl, 'attribute vec2 aVertexPosition;\nattribute vec2 aTextureCoord;\n\nuniform mat3 projectionMatrix;\nuniform mat3 translationMatrix;\nuniform mat3 uTransform;\n\nvarying vec2 vTextureCoord;\n\nvoid main(void)\n{\n    gl_Position = vec4((projectionMatrix * translationMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\n\n    vTextureCoord = (uTransform * vec3(aTextureCoord, 1.0)).xy;\n}\n', 'varying vec2 vTextureCoord;\n\nuniform sampler2D uSampler;\nuniform vec4 uColor;\nuniform mat3 uMapCoord;\nuniform vec4 uClampFrame;\nuniform vec2 uClampOffset;\n\nvoid main(void)\n{\n    vec2 coord = mod(vTextureCoord - uClampOffset, vec2(1.0, 1.0)) + uClampOffset;\n    coord = (uMapCoord * vec3(coord, 1.0)).xy;\n    coord = clamp(coord, uClampFrame.xy, uClampFrame.zw);\n\n    vec4 sample = texture2D(uSampler, coord);\n    gl_FragColor = sample * uColor;\n}\n');
        this.simpleShader = new core.Shader(gl, 'attribute vec2 aVertexPosition;\nattribute vec2 aTextureCoord;\n\nuniform mat3 projectionMatrix;\nuniform mat3 translationMatrix;\nuniform mat3 uTransform;\n\nvarying vec2 vTextureCoord;\n\nvoid main(void)\n{\n    gl_Position = vec4((projectionMatrix * translationMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\n\n    vTextureCoord = (uTransform * vec3(aTextureCoord, 1.0)).xy;\n}\n', 'varying vec2 vTextureCoord;\n\nuniform sampler2D uSampler;\nuniform vec4 uColor;\n\nvoid main(void)\n{\n    vec4 sample = texture2D(uSampler, vTextureCoord);\n    gl_FragColor = sample * uColor;\n}\n');
        this.renderer.bindVao(null);
        this.quad = new core.Quad(gl, this.renderer.state.attribState);
        this.quad.initVao(this.shader);
    };
    TilingSpriteRenderer.prototype.render = function render(ts) {
        var renderer = this.renderer;
        var quad = this.quad;
        renderer.bindVao(quad.vao);
        var vertices = quad.vertices;
        vertices[0] = vertices[6] = ts._width * -ts.anchor.x;
        vertices[1] = vertices[3] = ts._height * -ts.anchor.y;
        vertices[2] = vertices[4] = ts._width * (1.0 - ts.anchor.x);
        vertices[5] = vertices[7] = ts._height * (1.0 - ts.anchor.y);
        if (ts.uvRespectAnchor) {
            vertices = quad.uvs;
            vertices[0] = vertices[6] = -ts.anchor.x;
            vertices[1] = vertices[3] = -ts.anchor.y;
            vertices[2] = vertices[4] = 1.0 - ts.anchor.x;
            vertices[5] = vertices[7] = 1.0 - ts.anchor.y;
        }
        quad.upload();
        var tex = ts._texture;
        var baseTex = tex.baseTexture;
        var lt = ts.tileTransform.localTransform;
        var uv = ts.uvTransform;
        var isSimple = baseTex.isPowerOfTwo && tex.frame.width === baseTex.width && tex.frame.height === baseTex.height;
        if (isSimple) {
            if (!baseTex._glTextures[renderer.CONTEXT_UID]) {
                if (baseTex.wrapMode === _const.WRAP_MODES.CLAMP) {
                    baseTex.wrapMode = _const.WRAP_MODES.REPEAT;
                }
            } else {
                isSimple = baseTex.wrapMode !== _const.WRAP_MODES.CLAMP;
            }
        }
        var shader = isSimple ? this.simpleShader : this.shader;
        renderer.bindShader(shader);
        var w = tex.width;
        var h = tex.height;
        var W = ts._width;
        var H = ts._height;
        tempMat.set(lt.a * w / W, lt.b * w / H, lt.c * h / W, lt.d * h / H, lt.tx / W, lt.ty / H);
        tempMat.invert();
        if (isSimple) {
            tempMat.prepend(uv.mapCoord);
        } else {
            shader.uniforms.uMapCoord = uv.mapCoord.toArray(true);
            shader.uniforms.uClampFrame = uv.uClampFrame;
            shader.uniforms.uClampOffset = uv.uClampOffset;
        }
        shader.uniforms.uTransform = tempMat.toArray(true);
        shader.uniforms.uColor = core.utils.premultiplyTintToRgba(ts.tint, ts.worldAlpha, shader.uniforms.uColor, baseTex.premultipliedAlpha);
        shader.uniforms.translationMatrix = ts.transform.worldTransform.toArray(true);
        shader.uniforms.uSampler = renderer.bindTexture(tex);
        renderer.setBlendMode(core.utils.correctBlendMode(ts.blendMode, baseTex.premultipliedAlpha));
        quad.vao.draw(this.renderer.gl.TRIANGLES, 6, 0);
    };
    return TilingSpriteRenderer;
}(core.ObjectRenderer);
exports.default = TilingSpriteRenderer;
core.WebGLRenderer.registerPlugin('tilingSprite', TilingSpriteRenderer);
},{"../../core":65,"../../core/const":46,"path":8}],143:[function(require,module,exports){
'use strict';
exports.__esModule = true;
var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
var _core = require('../../core');
var core = _interopRequireWildcard(_core);
var _path = require('path');
function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
var AlphaFilter = function (_core$Filter) {
    _inherits(AlphaFilter, _core$Filter);
    function AlphaFilter() {
        var alpha = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1.0;
        _classCallCheck(this, AlphaFilter);
        var _this = _possibleConstructorReturn(this, _core$Filter.call(this,
        'attribute vec2 aVertexPosition;\nattribute vec2 aTextureCoord;\n\nuniform mat3 projectionMatrix;\n\nvarying vec2 vTextureCoord;\n\nvoid main(void)\n{\n    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\n    vTextureCoord = aTextureCoord;\n}',
        'varying vec2 vTextureCoord;\n\nuniform sampler2D uSampler;\nuniform float uAlpha;\n\nvoid main(void)\n{\n   gl_FragColor = texture2D(uSampler, vTextureCoord) * uAlpha;\n}\n'));
        _this.alpha = alpha;
        _this.glShaderKey = 'alpha';
        return _this;
    }
    _createClass(AlphaFilter, [{
        key: 'alpha',
        get: function get() {
            return this.uniforms.uAlpha;
        },
        set: function set(value) 
        {
            this.uniforms.uAlpha = value;
        }
    }]);
    return AlphaFilter;
}(core.Filter);
exports.default = AlphaFilter;
},{"../../core":65,"path":8}],144:[function(require,module,exports){
'use strict';
exports.__esModule = true;
var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
var _core = require('../../core');
var core = _interopRequireWildcard(_core);
var _BlurXFilter = require('./BlurXFilter');
var _BlurXFilter2 = _interopRequireDefault(_BlurXFilter);
var _BlurYFilter = require('./BlurYFilter');
var _BlurYFilter2 = _interopRequireDefault(_BlurYFilter);
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
var BlurFilter = function (_core$Filter) {
    _inherits(BlurFilter, _core$Filter);
    function BlurFilter(strength, quality, resolution, kernelSize) {
        _classCallCheck(this, BlurFilter);
        var _this = _possibleConstructorReturn(this, _core$Filter.call(this));
        _this.blurXFilter = new _BlurXFilter2.default(strength, quality, resolution, kernelSize);
        _this.blurYFilter = new _BlurYFilter2.default(strength, quality, resolution, kernelSize);
        _this.padding = 0;
        _this.resolution = resolution || core.settings.RESOLUTION;
        _this.quality = quality || 4;
        _this.blur = strength || 8;
        return _this;
    }
    BlurFilter.prototype.apply = function apply(filterManager, input, output) {
        var renderTarget = filterManager.getRenderTarget(true);
        this.blurXFilter.apply(filterManager, input, renderTarget, true);
        this.blurYFilter.apply(filterManager, renderTarget, output, false);
        filterManager.returnRenderTarget(renderTarget);
    };
    _createClass(BlurFilter, [{
        key: 'blur',
        get: function get() {
            return this.blurXFilter.blur;
        },
        set: function set(value) 
        {
            this.blurXFilter.blur = this.blurYFilter.blur = value;
            this.padding = Math.max(Math.abs(this.blurXFilter.strength), Math.abs(this.blurYFilter.strength)) * 2;
        }
    }, {
        key: 'quality',
        get: function get() {
            return this.blurXFilter.quality;
        },
        set: function set(value) 
        {
            this.blurXFilter.quality = this.blurYFilter.quality = value;
        }
    }, {
        key: 'blurX',
        get: function get() {
            return this.blurXFilter.blur;
        },
        set: function set(value) 
        {
            this.blurXFilter.blur = value;
            this.padding = Math.max(Math.abs(this.blurXFilter.strength), Math.abs(this.blurYFilter.strength)) * 2;
        }
    }, {
        key: 'blurY',
        get: function get() {
            return this.blurYFilter.blur;
        },
        set: function set(value) 
        {
            this.blurYFilter.blur = value;
            this.padding = Math.max(Math.abs(this.blurXFilter.strength), Math.abs(this.blurYFilter.strength)) * 2;
        }
    }, {
        key: 'blendMode',
        get: function get() {
            return this.blurYFilter._blendMode;
        },
        set: function set(value) 
        {
            this.blurYFilter._blendMode = value;
        }
    }]);
    return BlurFilter;
}(core.Filter);
exports.default = BlurFilter;
},{"../../core":65,"./BlurXFilter":145,"./BlurYFilter":146}],145:[function(require,module,exports){
'use strict';
exports.__esModule = true;
var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
var _core = require('../../core');
var core = _interopRequireWildcard(_core);
var _generateBlurVertSource = require('./generateBlurVertSource');
var _generateBlurVertSource2 = _interopRequireDefault(_generateBlurVertSource);
var _generateBlurFragSource = require('./generateBlurFragSource');
var _generateBlurFragSource2 = _interopRequireDefault(_generateBlurFragSource);
var _getMaxBlurKernelSize = require('./getMaxBlurKernelSize');
var _getMaxBlurKernelSize2 = _interopRequireDefault(_getMaxBlurKernelSize);
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
var BlurXFilter = function (_core$Filter) {
    _inherits(BlurXFilter, _core$Filter);
    function BlurXFilter(strength, quality, resolution, kernelSize) {
        _classCallCheck(this, BlurXFilter);
        kernelSize = kernelSize || 5;
        var vertSrc = (0, _generateBlurVertSource2.default)(kernelSize, true);
        var fragSrc = (0, _generateBlurFragSource2.default)(kernelSize);
        var _this = _possibleConstructorReturn(this, _core$Filter.call(this,
        vertSrc,
        fragSrc));
        _this.resolution = resolution || core.settings.RESOLUTION;
        _this._quality = 0;
        _this.quality = quality || 4;
        _this.strength = strength || 8;
        _this.firstRun = true;
        return _this;
    }
    BlurXFilter.prototype.apply = function apply(filterManager, input, output, clear) {
        if (this.firstRun) {
            var gl = filterManager.renderer.gl;
            var kernelSize = (0, _getMaxBlurKernelSize2.default)(gl);
            this.vertexSrc = (0, _generateBlurVertSource2.default)(kernelSize, true);
            this.fragmentSrc = (0, _generateBlurFragSource2.default)(kernelSize);
            this.firstRun = false;
        }
        this.uniforms.strength = 1 / output.size.width * (output.size.width / input.size.width);
        this.uniforms.strength *= this.strength;
        this.uniforms.strength /= this.passes; 
        if (this.passes === 1) {
            filterManager.applyFilter(this, input, output, clear);
        } else {
            var renderTarget = filterManager.getRenderTarget(true);
            var flip = input;
            var flop = renderTarget;
            for (var i = 0; i < this.passes - 1; i++) {
                filterManager.applyFilter(this, flip, flop, true);
                var temp = flop;
                flop = flip;
                flip = temp;
            }
            filterManager.applyFilter(this, flip, output, clear);
            filterManager.returnRenderTarget(renderTarget);
        }
    };
    _createClass(BlurXFilter, [{
        key: 'blur',
        get: function get() {
            return this.strength;
        },
        set: function set(value) 
        {
            this.padding = Math.abs(value) * 2;
            this.strength = value;
        }
    }, {
        key: 'quality',
        get: function get() {
            return this._quality;
        },
        set: function set(value) 
        {
            this._quality = value;
            this.passes = value;
        }
    }]);
    return BlurXFilter;
}(core.Filter);
exports.default = BlurXFilter;
},{"../../core":65,"./generateBlurFragSource":147,"./generateBlurVertSource":148,"./getMaxBlurKernelSize":149}],146:[function(require,module,exports){
'use strict';
exports.__esModule = true;
var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
var _core = require('../../core');
var core = _interopRequireWildcard(_core);
var _generateBlurVertSource = require('./generateBlurVertSource');
var _generateBlurVertSource2 = _interopRequireDefault(_generateBlurVertSource);
var _generateBlurFragSource = require('./generateBlurFragSource');
var _generateBlurFragSource2 = _interopRequireDefault(_generateBlurFragSource);
var _getMaxBlurKernelSize = require('./getMaxBlurKernelSize');
var _getMaxBlurKernelSize2 = _interopRequireDefault(_getMaxBlurKernelSize);
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
var BlurYFilter = function (_core$Filter) {
    _inherits(BlurYFilter, _core$Filter);
    function BlurYFilter(strength, quality, resolution, kernelSize) {
        _classCallCheck(this, BlurYFilter);
        kernelSize = kernelSize || 5;
        var vertSrc = (0, _generateBlurVertSource2.default)(kernelSize, false);
        var fragSrc = (0, _generateBlurFragSource2.default)(kernelSize);
        var _this = _possibleConstructorReturn(this, _core$Filter.call(this,
        vertSrc,
        fragSrc));
        _this.resolution = resolution || core.settings.RESOLUTION;
        _this._quality = 0;
        _this.quality = quality || 4;
        _this.strength = strength || 8;
        _this.firstRun = true;
        return _this;
    }
    BlurYFilter.prototype.apply = function apply(filterManager, input, output, clear) {
        if (this.firstRun) {
            var gl = filterManager.renderer.gl;
            var kernelSize = (0, _getMaxBlurKernelSize2.default)(gl);
            this.vertexSrc = (0, _generateBlurVertSource2.default)(kernelSize, false);
            this.fragmentSrc = (0, _generateBlurFragSource2.default)(kernelSize);
            this.firstRun = false;
        }
        this.uniforms.strength = 1 / output.size.height * (output.size.height / input.size.height);
        this.uniforms.strength *= this.strength;
        this.uniforms.strength /= this.passes;
        if (this.passes === 1) {
            filterManager.applyFilter(this, input, output, clear);
        } else {
            var renderTarget = filterManager.getRenderTarget(true);
            var flip = input;
            var flop = renderTarget;
            for (var i = 0; i < this.passes - 1; i++) {
                filterManager.applyFilter(this, flip, flop, true);
                var temp = flop;
                flop = flip;
                flip = temp;
            }
            filterManager.applyFilter(this, flip, output, clear);
            filterManager.returnRenderTarget(renderTarget);
        }
    };
    _createClass(BlurYFilter, [{
        key: 'blur',
        get: function get() {
            return this.strength;
        },
        set: function set(value) 
        {
            this.padding = Math.abs(value) * 2;
            this.strength = value;
        }
    }, {
        key: 'quality',
        get: function get() {
            return this._quality;
        },
        set: function set(value) 
        {
            this._quality = value;
            this.passes = value;
        }
    }]);
    return BlurYFilter;
}(core.Filter);
exports.default = BlurYFilter;
},{"../../core":65,"./generateBlurFragSource":147,"./generateBlurVertSource":148,"./getMaxBlurKernelSize":149}],147:[function(require,module,exports){
'use strict';
exports.__esModule = true;
exports.default = generateFragBlurSource;
var GAUSSIAN_VALUES = {
    5: [0.153388, 0.221461, 0.250301],
    7: [0.071303, 0.131514, 0.189879, 0.214607],
    9: [0.028532, 0.067234, 0.124009, 0.179044, 0.20236],
    11: [0.0093, 0.028002, 0.065984, 0.121703, 0.175713, 0.198596],
    13: [0.002406, 0.009255, 0.027867, 0.065666, 0.121117, 0.174868, 0.197641],
    15: [0.000489, 0.002403, 0.009246, 0.02784, 0.065602, 0.120999, 0.174697, 0.197448]
};
var fragTemplate = ['varying vec2 vBlurTexCoords[%size%];', 'uniform sampler2D uSampler;', 'void main(void)', '{', '    gl_FragColor = vec4(0.0);', '    %blur%', '}'].join('\n');
function generateFragBlurSource(kernelSize) {
    var kernel = GAUSSIAN_VALUES[kernelSize];
    var halfLength = kernel.length;
    var fragSource = fragTemplate;
    var blurLoop = '';
    var template = 'gl_FragColor += texture2D(uSampler, vBlurTexCoords[%index%]) * %value%;';
    var value = void 0;
    for (var i = 0; i < kernelSize; i++) {
        var blur = template.replace('%index%', i);
        value = i;
        if (i >= halfLength) {
            value = kernelSize - i - 1;
        }
        blur = blur.replace('%value%', kernel[value]);
        blurLoop += blur;
        blurLoop += '\n';
    }
    fragSource = fragSource.replace('%blur%', blurLoop);
    fragSource = fragSource.replace('%size%', kernelSize);
    return fragSource;
}
},{}],148:[function(require,module,exports){
'use strict';
exports.__esModule = true;
exports.default = generateVertBlurSource;
var vertTemplate = ['attribute vec2 aVertexPosition;', 'attribute vec2 aTextureCoord;', 'uniform float strength;', 'uniform mat3 projectionMatrix;', 'varying vec2 vBlurTexCoords[%size%];', 'void main(void)', '{', 'gl_Position = vec4((projectionMatrix * vec3((aVertexPosition), 1.0)).xy, 0.0, 1.0);', '%blur%', '}'].join('\n');
function generateVertBlurSource(kernelSize, x) {
    var halfLength = Math.ceil(kernelSize / 2);
    var vertSource = vertTemplate;
    var blurLoop = '';
    var template = void 0;
    if (x) {
        template = 'vBlurTexCoords[%index%] = aTextureCoord + vec2(%sampleIndex% * strength, 0.0);';
    } else {
        template = 'vBlurTexCoords[%index%] = aTextureCoord + vec2(0.0, %sampleIndex% * strength);';
    }
    for (var i = 0; i < kernelSize; i++) {
        var blur = template.replace('%index%', i);
        blur = blur.replace('%sampleIndex%', i - (halfLength - 1) + '.0');
        blurLoop += blur;
        blurLoop += '\n';
    }
    vertSource = vertSource.replace('%blur%', blurLoop);
    vertSource = vertSource.replace('%size%', kernelSize);
    return vertSource;
}
},{}],149:[function(require,module,exports){
"use strict";
exports.__esModule = true;
exports.default = getMaxKernelSize;
function getMaxKernelSize(gl) {
    var maxVaryings = gl.getParameter(gl.MAX_VARYING_VECTORS);
    var kernelSize = 15;
    while (kernelSize > maxVaryings) {
        kernelSize -= 2;
    }
    return kernelSize;
}
},{}],150:[function(require,module,exports){
'use strict';
exports.__esModule = true;
var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
var _core = require('../../core');
var core = _interopRequireWildcard(_core);
var _path = require('path');
function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
var ColorMatrixFilter = function (_core$Filter) {
    _inherits(ColorMatrixFilter, _core$Filter);
    function ColorMatrixFilter() {
        _classCallCheck(this, ColorMatrixFilter);
        var _this = _possibleConstructorReturn(this, _core$Filter.call(this,
        'attribute vec2 aVertexPosition;\nattribute vec2 aTextureCoord;\n\nuniform mat3 projectionMatrix;\n\nvarying vec2 vTextureCoord;\n\nvoid main(void)\n{\n    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\n    vTextureCoord = aTextureCoord;\n}',
        'varying vec2 vTextureCoord;\nuniform sampler2D uSampler;\nuniform float m[20];\nuniform float uAlpha;\n\nvoid main(void)\n{\n    vec4 c = texture2D(uSampler, vTextureCoord);\n\n    if (uAlpha == 0.0) {\n        gl_FragColor = c;\n        return;\n    }\n\n    // Un-premultiply alpha before applying the color matrix. See issue #3539.\n    if (c.a > 0.0) {\n      c.rgb /= c.a;\n    }\n\n    vec4 result;\n\n    result.r = (m[0] * c.r);\n        result.r += (m[1] * c.g);\n        result.r += (m[2] * c.b);\n        result.r += (m[3] * c.a);\n        result.r += m[4];\n\n    result.g = (m[5] * c.r);\n        result.g += (m[6] * c.g);\n        result.g += (m[7] * c.b);\n        result.g += (m[8] * c.a);\n        result.g += m[9];\n\n    result.b = (m[10] * c.r);\n       result.b += (m[11] * c.g);\n       result.b += (m[12] * c.b);\n       result.b += (m[13] * c.a);\n       result.b += m[14];\n\n    result.a = (m[15] * c.r);\n       result.a += (m[16] * c.g);\n       result.a += (m[17] * c.b);\n       result.a += (m[18] * c.a);\n       result.a += m[19];\n\n    vec3 rgb = mix(c.rgb, result.rgb, uAlpha);\n\n    // Premultiply alpha again.\n    rgb *= result.a;\n\n    gl_FragColor = vec4(rgb, result.a);\n}\n'));
        _this.uniforms.m = [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0];
        _this.alpha = 1;
        return _this;
    }
    ColorMatrixFilter.prototype._loadMatrix = function _loadMatrix(matrix) {
        var multiply = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
        var newMatrix = matrix;
        if (multiply) {
            this._multiply(newMatrix, this.uniforms.m, matrix);
            newMatrix = this._colorMatrix(newMatrix);
        }
        this.uniforms.m = newMatrix;
    };
    ColorMatrixFilter.prototype._multiply = function _multiply(out, a, b) {
        out[0] = a[0] * b[0] + a[1] * b[5] + a[2] * b[10] + a[3] * b[15];
        out[1] = a[0] * b[1] + a[1] * b[6] + a[2] * b[11] + a[3] * b[16];
        out[2] = a[0] * b[2] + a[1] * b[7] + a[2] * b[12] + a[3] * b[17];
        out[3] = a[0] * b[3] + a[1] * b[8] + a[2] * b[13] + a[3] * b[18];
        out[4] = a[0] * b[4] + a[1] * b[9] + a[2] * b[14] + a[3] * b[19] + a[4];
        out[5] = a[5] * b[0] + a[6] * b[5] + a[7] * b[10] + a[8] * b[15];
        out[6] = a[5] * b[1] + a[6] * b[6] + a[7] * b[11] + a[8] * b[16];
        out[7] = a[5] * b[2] + a[6] * b[7] + a[7] * b[12] + a[8] * b[17];
        out[8] = a[5] * b[3] + a[6] * b[8] + a[7] * b[13] + a[8] * b[18];
        out[9] = a[5] * b[4] + a[6] * b[9] + a[7] * b[14] + a[8] * b[19] + a[9];
        out[10] = a[10] * b[0] + a[11] * b[5] + a[12] * b[10] + a[13] * b[15];
        out[11] = a[10] * b[1] + a[11] * b[6] + a[12] * b[11] + a[13] * b[16];
        out[12] = a[10] * b[2] + a[11] * b[7] + a[12] * b[12] + a[13] * b[17];
        out[13] = a[10] * b[3] + a[11] * b[8] + a[12] * b[13] + a[13] * b[18];
        out[14] = a[10] * b[4] + a[11] * b[9] + a[12] * b[14] + a[13] * b[19] + a[14];
        out[15] = a[15] * b[0] + a[16] * b[5] + a[17] * b[10] + a[18] * b[15];
        out[16] = a[15] * b[1] + a[16] * b[6] + a[17] * b[11] + a[18] * b[16];
        out[17] = a[15] * b[2] + a[16] * b[7] + a[17] * b[12] + a[18] * b[17];
        out[18] = a[15] * b[3] + a[16] * b[8] + a[17] * b[13] + a[18] * b[18];
        out[19] = a[15] * b[4] + a[16] * b[9] + a[17] * b[14] + a[18] * b[19] + a[19];
        return out;
    };
    ColorMatrixFilter.prototype._colorMatrix = function _colorMatrix(matrix) {
        var m = new Float32Array(matrix);
        m[4] /= 255;
        m[9] /= 255;
        m[14] /= 255;
        m[19] /= 255;
        return m;
    };
    ColorMatrixFilter.prototype.brightness = function brightness(b, multiply) {
        var matrix = [b, 0, 0, 0, 0, 0, b, 0, 0, 0, 0, 0, b, 0, 0, 0, 0, 0, 1, 0];
        this._loadMatrix(matrix, multiply);
    };
    ColorMatrixFilter.prototype.greyscale = function greyscale(scale, multiply) {
        var matrix = [scale, scale, scale, 0, 0, scale, scale, scale, 0, 0, scale, scale, scale, 0, 0, 0, 0, 0, 1, 0];
        this._loadMatrix(matrix, multiply);
    };
    ColorMatrixFilter.prototype.blackAndWhite = function blackAndWhite(multiply) {
        var matrix = [0.3, 0.6, 0.1, 0, 0, 0.3, 0.6, 0.1, 0, 0, 0.3, 0.6, 0.1, 0, 0, 0, 0, 0, 1, 0];
        this._loadMatrix(matrix, multiply);
    };
    ColorMatrixFilter.prototype.hue = function hue(rotation, multiply) {
        rotation = (rotation || 0) / 180 * Math.PI;
        var cosR = Math.cos(rotation);
        var sinR = Math.sin(rotation);
        var sqrt = Math.sqrt;
        var w = 1 / 3;
        var sqrW = sqrt(w); 
        var a00 = cosR + (1.0 - cosR) * w;
        var a01 = w * (1.0 - cosR) - sqrW * sinR;
        var a02 = w * (1.0 - cosR) + sqrW * sinR;
        var a10 = w * (1.0 - cosR) + sqrW * sinR;
        var a11 = cosR + w * (1.0 - cosR);
        var a12 = w * (1.0 - cosR) - sqrW * sinR;
        var a20 = w * (1.0 - cosR) - sqrW * sinR;
        var a21 = w * (1.0 - cosR) + sqrW * sinR;
        var a22 = cosR + w * (1.0 - cosR);
        var matrix = [a00, a01, a02, 0, 0, a10, a11, a12, 0, 0, a20, a21, a22, 0, 0, 0, 0, 0, 1, 0];
        this._loadMatrix(matrix, multiply);
    };
    ColorMatrixFilter.prototype.contrast = function contrast(amount, multiply) {
        var v = (amount || 0) + 1;
        var o = -0.5 * (v - 1);
        var matrix = [v, 0, 0, 0, o, 0, v, 0, 0, o, 0, 0, v, 0, o, 0, 0, 0, 1, 0];
        this._loadMatrix(matrix, multiply);
    };
    ColorMatrixFilter.prototype.saturate = function saturate() {
        var amount = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
        var multiply = arguments[1];
        var x = amount * 2 / 3 + 1;
        var y = (x - 1) * -0.5;
        var matrix = [x, y, y, 0, 0, y, x, y, 0, 0, y, y, x, 0, 0, 0, 0, 0, 1, 0];
        this._loadMatrix(matrix, multiply);
    };
    ColorMatrixFilter.prototype.desaturate = function desaturate() 
    {
        this.saturate(-1);
    };
    ColorMatrixFilter.prototype.negative = function negative(multiply) {
        var matrix = [-1, 0, 0, 1, 0, 0, -1, 0, 1, 0, 0, 0, -1, 1, 0, 0, 0, 0, 1, 0];
        this._loadMatrix(matrix, multiply);
    };
    ColorMatrixFilter.prototype.sepia = function sepia(multiply) {
        var matrix = [0.393, 0.7689999, 0.18899999, 0, 0, 0.349, 0.6859999, 0.16799999, 0, 0, 0.272, 0.5339999, 0.13099999, 0, 0, 0, 0, 0, 1, 0];
        this._loadMatrix(matrix, multiply);
    };
    ColorMatrixFilter.prototype.technicolor = function technicolor(multiply) {
        var matrix = [1.9125277891456083, -0.8545344976951645, -0.09155508482755585, 0, 11.793603434377337, -0.3087833385928097, 1.7658908555458428, -0.10601743074722245, 0, -70.35205161461398, -0.231103377548616, -0.7501899197440212, 1.847597816108189, 0, 30.950940869491138, 0, 0, 0, 1, 0];
        this._loadMatrix(matrix, multiply);
    };
    ColorMatrixFilter.prototype.polaroid = function polaroid(multiply) {
        var matrix = [1.438, -0.062, -0.062, 0, 0, -0.122, 1.378, -0.122, 0, 0, -0.016, -0.016, 1.483, 0, 0, 0, 0, 0, 1, 0];
        this._loadMatrix(matrix, multiply);
    };
    ColorMatrixFilter.prototype.toBGR = function toBGR(multiply) {
        var matrix = [0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0];
        this._loadMatrix(matrix, multiply);
    };
    ColorMatrixFilter.prototype.kodachrome = function kodachrome(multiply) {
        var matrix = [1.1285582396593525, -0.3967382283601348, -0.03992559172921793, 0, 63.72958762196502, -0.16404339962244616, 1.0835251566291304, -0.05498805115633132, 0, 24.732407896706203, -0.16786010706155763, -0.5603416277695248, 1.6014850761964943, 0, 35.62982807460946, 0, 0, 0, 1, 0];
        this._loadMatrix(matrix, multiply);
    };
    ColorMatrixFilter.prototype.browni = function browni(multiply) {
        var matrix = [0.5997023498159715, 0.34553243048391263, -0.2708298674538042, 0, 47.43192855600873, -0.037703249837783157, 0.8609577587992641, 0.15059552388459913, 0, -36.96841498319127, 0.24113635128153335, -0.07441037908422492, 0.44972182064877153, 0, -7.562075277591283, 0, 0, 0, 1, 0];
        this._loadMatrix(matrix, multiply);
    };
    ColorMatrixFilter.prototype.vintage = function vintage(multiply) {
        var matrix = [0.6279345635605994, 0.3202183420819367, -0.03965408211312453, 0, 9.651285835294123, 0.02578397704808868, 0.6441188644374771, 0.03259127616149294, 0, 7.462829176470591, 0.0466055556782719, -0.0851232987247891, 0.5241648018700465, 0, 5.159190588235296, 0, 0, 0, 1, 0];
        this._loadMatrix(matrix, multiply);
    };
    ColorMatrixFilter.prototype.colorTone = function colorTone(desaturation, toned, lightColor, darkColor, multiply) {
        desaturation = desaturation || 0.2;
        toned = toned || 0.15;
        lightColor = lightColor || 0xFFE580;
        darkColor = darkColor || 0x338000;
        var lR = (lightColor >> 16 & 0xFF) / 255;
        var lG = (lightColor >> 8 & 0xFF) / 255;
        var lB = (lightColor & 0xFF) / 255;
        var dR = (darkColor >> 16 & 0xFF) / 255;
        var dG = (darkColor >> 8 & 0xFF) / 255;
        var dB = (darkColor & 0xFF) / 255;
        var matrix = [0.3, 0.59, 0.11, 0, 0, lR, lG, lB, desaturation, 0, dR, dG, dB, toned, 0, lR - dR, lG - dG, lB - dB, 0, 0];
        this._loadMatrix(matrix, multiply);
    };
    ColorMatrixFilter.prototype.night = function night(intensity, multiply) {
        intensity = intensity || 0.1;
        var matrix = [intensity * -2.0, -intensity, 0, 0, 0, -intensity, 0, intensity, 0, 0, 0, intensity, intensity * 2.0, 0, 0, 0, 0, 0, 1, 0];
        this._loadMatrix(matrix, multiply);
    };
    ColorMatrixFilter.prototype.predator = function predator(amount, multiply) {
        var matrix = [
        11.224130630493164 * amount, -4.794486999511719 * amount, -2.8746118545532227 * amount, 0 * amount, 0.40342438220977783 * amount,
        -3.6330697536468506 * amount, 9.193157196044922 * amount, -2.951810836791992 * amount, 0 * amount, -1.316135048866272 * amount,
        -3.2184197902679443 * amount, -4.2375030517578125 * amount, 7.476448059082031 * amount, 0 * amount, 0.8044459223747253 * amount,
        0, 0, 0, 1, 0];
        this._loadMatrix(matrix, multiply);
    };
    ColorMatrixFilter.prototype.lsd = function lsd(multiply) {
        var matrix = [2, -0.4, 0.5, 0, 0, -0.5, 2, -0.4, 0, 0, -0.4, -0.5, 3, 0, 0, 0, 0, 0, 1, 0];
        this._loadMatrix(matrix, multiply);
    };
    ColorMatrixFilter.prototype.reset = function reset() {
        var matrix = [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0];
        this._loadMatrix(matrix, false);
    };
    _createClass(ColorMatrixFilter, [{
        key: 'matrix',
        get: function get() {
            return this.uniforms.m;
        },
        set: function set(value) 
        {
            this.uniforms.m = value;
        }
    }, {
        key: 'alpha',
        get: function get() {
            return this.uniforms.uAlpha;
        },
        set: function set(value) 
        {
            this.uniforms.uAlpha = value;
        }
    }]);
    return ColorMatrixFilter;
}(core.Filter);
exports.default = ColorMatrixFilter;
ColorMatrixFilter.prototype.grayscale = ColorMatrixFilter.prototype.greyscale;
},{"../../core":65,"path":8}],151:[function(require,module,exports){
'use strict';
exports.__esModule = true;
var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
var _core = require('../../core');
var core = _interopRequireWildcard(_core);
var _path = require('path');
function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
var DisplacementFilter = function (_core$Filter) {
    _inherits(DisplacementFilter, _core$Filter);
    function DisplacementFilter(sprite, scale) {
        _classCallCheck(this, DisplacementFilter);
        var maskMatrix = new core.Matrix();
        sprite.renderable = false;
        var _this = _possibleConstructorReturn(this, _core$Filter.call(this,
        'attribute vec2 aVertexPosition;\nattribute vec2 aTextureCoord;\n\nuniform mat3 projectionMatrix;\nuniform mat3 filterMatrix;\n\nvarying vec2 vTextureCoord;\nvarying vec2 vFilterCoord;\n\nvoid main(void)\n{\n   gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\n   vFilterCoord = ( filterMatrix * vec3( aTextureCoord, 1.0)  ).xy;\n   vTextureCoord = aTextureCoord;\n}',
        'varying vec2 vFilterCoord;\nvarying vec2 vTextureCoord;\n\nuniform vec2 scale;\n\nuniform sampler2D uSampler;\nuniform sampler2D mapSampler;\n\nuniform vec4 filterArea;\nuniform vec4 filterClamp;\n\nvoid main(void)\n{\n  vec4 map =  texture2D(mapSampler, vFilterCoord);\n\n  map -= 0.5;\n  map.xy *= scale / filterArea.xy;\n\n  gl_FragColor = texture2D(uSampler, clamp(vec2(vTextureCoord.x + map.x, vTextureCoord.y + map.y), filterClamp.xy, filterClamp.zw));\n}\n'));
        _this.maskSprite = sprite;
        _this.maskMatrix = maskMatrix;
        _this.uniforms.mapSampler = sprite._texture;
        _this.uniforms.filterMatrix = maskMatrix;
        _this.uniforms.scale = { x: 1, y: 1 };
        if (scale === null || scale === undefined) {
            scale = 20;
        }
        _this.scale = new core.Point(scale, scale);
        return _this;
    }
    DisplacementFilter.prototype.apply = function apply(filterManager, input, output) {
        this.uniforms.filterMatrix = filterManager.calculateSpriteMatrix(this.maskMatrix, this.maskSprite);
        this.uniforms.scale.x = this.scale.x;
        this.uniforms.scale.y = this.scale.y;
        filterManager.applyFilter(this, input, output);
    };
    _createClass(DisplacementFilter, [{
        key: 'map',
        get: function get() {
            return this.uniforms.mapSampler;
        },
        set: function set(value) 
        {
            this.uniforms.mapSampler = value;
        }
    }]);
    return DisplacementFilter;
}(core.Filter);
exports.default = DisplacementFilter;
},{"../../core":65,"path":8}],152:[function(require,module,exports){
'use strict';
exports.__esModule = true;
var _core = require('../../core');
var core = _interopRequireWildcard(_core);
var _path = require('path');
function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
var FXAAFilter = function (_core$Filter) {
    _inherits(FXAAFilter, _core$Filter);
    function FXAAFilter() {
        _classCallCheck(this, FXAAFilter);
        return _possibleConstructorReturn(this, _core$Filter.call(this,
        '\nattribute vec2 aVertexPosition;\nattribute vec2 aTextureCoord;\n\nuniform mat3 projectionMatrix;\n\nvarying vec2 v_rgbNW;\nvarying vec2 v_rgbNE;\nvarying vec2 v_rgbSW;\nvarying vec2 v_rgbSE;\nvarying vec2 v_rgbM;\n\nuniform vec4 filterArea;\n\nvarying vec2 vTextureCoord;\n\nvec2 mapCoord( vec2 coord )\n{\n    coord *= filterArea.xy;\n    coord += filterArea.zw;\n\n    return coord;\n}\n\nvec2 unmapCoord( vec2 coord )\n{\n    coord -= filterArea.zw;\n    coord /= filterArea.xy;\n\n    return coord;\n}\n\nvoid texcoords(vec2 fragCoord, vec2 resolution,\n               out vec2 v_rgbNW, out vec2 v_rgbNE,\n               out vec2 v_rgbSW, out vec2 v_rgbSE,\n               out vec2 v_rgbM) {\n    vec2 inverseVP = 1.0 / resolution.xy;\n    v_rgbNW = (fragCoord + vec2(-1.0, -1.0)) * inverseVP;\n    v_rgbNE = (fragCoord + vec2(1.0, -1.0)) * inverseVP;\n    v_rgbSW = (fragCoord + vec2(-1.0, 1.0)) * inverseVP;\n    v_rgbSE = (fragCoord + vec2(1.0, 1.0)) * inverseVP;\n    v_rgbM = vec2(fragCoord * inverseVP);\n}\n\nvoid main(void) {\n\n   gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\n\n   vTextureCoord = aTextureCoord;\n\n   vec2 fragCoord = vTextureCoord * filterArea.xy;\n\n   texcoords(fragCoord, filterArea.xy, v_rgbNW, v_rgbNE, v_rgbSW, v_rgbSE, v_rgbM);\n}',
        'varying vec2 v_rgbNW;\nvarying vec2 v_rgbNE;\nvarying vec2 v_rgbSW;\nvarying vec2 v_rgbSE;\nvarying vec2 v_rgbM;\n\nvarying vec2 vTextureCoord;\nuniform sampler2D uSampler;\nuniform vec4 filterArea;\n\n/**\n Basic FXAA implementation based on the code on geeks3d.com with the\n modification that the texture2DLod stuff was removed since it\'s\n unsupported by WebGL.\n \n --\n \n From:\n https://github.com/mitsuhiko/webgl-meincraft\n \n Copyright (c) 2011 by Armin Ronacher.\n \n Some rights reserved.\n \n Redistribution and use in source and binary forms, with or without\n modification, are permitted provided that the following conditions are\n met:\n \n * Redistributions of source code must retain the above copyright\n notice, this list of conditions and the following disclaimer.\n \n * Redistributions in binary form must reproduce the above\n copyright notice, this list of conditions and the following\n disclaimer in the documentation and/or other materials provided\n with the distribution.\n \n * The names of the contributors may not be used to endorse or\n promote products derived from this software without specific\n prior written permission.\n \n THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS\n "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT\n LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR\n A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT\n OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,\n SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT\n LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,\n DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY\n THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT\n (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE\n OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.\n */\n\n#ifndef FXAA_REDUCE_MIN\n#define FXAA_REDUCE_MIN   (1.0/ 128.0)\n#endif\n#ifndef FXAA_REDUCE_MUL\n#define FXAA_REDUCE_MUL   (1.0 / 8.0)\n#endif\n#ifndef FXAA_SPAN_MAX\n#define FXAA_SPAN_MAX     8.0\n#endif\n\n//optimized version for mobile, where dependent\n//texture reads can be a bottleneck\nvec4 fxaa(sampler2D tex, vec2 fragCoord, vec2 resolution,\n          vec2 v_rgbNW, vec2 v_rgbNE,\n          vec2 v_rgbSW, vec2 v_rgbSE,\n          vec2 v_rgbM) {\n    vec4 color;\n    mediump vec2 inverseVP = vec2(1.0 / resolution.x, 1.0 / resolution.y);\n    vec3 rgbNW = texture2D(tex, v_rgbNW).xyz;\n    vec3 rgbNE = texture2D(tex, v_rgbNE).xyz;\n    vec3 rgbSW = texture2D(tex, v_rgbSW).xyz;\n    vec3 rgbSE = texture2D(tex, v_rgbSE).xyz;\n    vec4 texColor = texture2D(tex, v_rgbM);\n    vec3 rgbM  = texColor.xyz;\n    vec3 luma = vec3(0.299, 0.587, 0.114);\n    float lumaNW = dot(rgbNW, luma);\n    float lumaNE = dot(rgbNE, luma);\n    float lumaSW = dot(rgbSW, luma);\n    float lumaSE = dot(rgbSE, luma);\n    float lumaM  = dot(rgbM,  luma);\n    float lumaMin = min(lumaM, min(min(lumaNW, lumaNE), min(lumaSW, lumaSE)));\n    float lumaMax = max(lumaM, max(max(lumaNW, lumaNE), max(lumaSW, lumaSE)));\n    \n    mediump vec2 dir;\n    dir.x = -((lumaNW + lumaNE) - (lumaSW + lumaSE));\n    dir.y =  ((lumaNW + lumaSW) - (lumaNE + lumaSE));\n    \n    float dirReduce = max((lumaNW + lumaNE + lumaSW + lumaSE) *\n                          (0.25 * FXAA_REDUCE_MUL), FXAA_REDUCE_MIN);\n    \n    float rcpDirMin = 1.0 / (min(abs(dir.x), abs(dir.y)) + dirReduce);\n    dir = min(vec2(FXAA_SPAN_MAX, FXAA_SPAN_MAX),\n              max(vec2(-FXAA_SPAN_MAX, -FXAA_SPAN_MAX),\n                  dir * rcpDirMin)) * inverseVP;\n    \n    vec3 rgbA = 0.5 * (\n                       texture2D(tex, fragCoord * inverseVP + dir * (1.0 / 3.0 - 0.5)).xyz +\n                       texture2D(tex, fragCoord * inverseVP + dir * (2.0 / 3.0 - 0.5)).xyz);\n    vec3 rgbB = rgbA * 0.5 + 0.25 * (\n                                     texture2D(tex, fragCoord * inverseVP + dir * -0.5).xyz +\n                                     texture2D(tex, fragCoord * inverseVP + dir * 0.5).xyz);\n    \n    float lumaB = dot(rgbB, luma);\n    if ((lumaB < lumaMin) || (lumaB > lumaMax))\n        color = vec4(rgbA, texColor.a);\n    else\n        color = vec4(rgbB, texColor.a);\n    return color;\n}\n\nvoid main() {\n\n      vec2 fragCoord = vTextureCoord * filterArea.xy;\n\n      vec4 color;\n\n    color = fxaa(uSampler, fragCoord, filterArea.xy, v_rgbNW, v_rgbNE, v_rgbSW, v_rgbSE, v_rgbM);\n\n      gl_FragColor = color;\n}\n'));
    }
    return FXAAFilter;
}(core.Filter);
exports.default = FXAAFilter;
},{"../../core":65,"path":8}],153:[function(require,module,exports){
'use strict';
exports.__esModule = true;
var _FXAAFilter = require('./fxaa/FXAAFilter');
Object.defineProperty(exports, 'FXAAFilter', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_FXAAFilter).default;
  }
});
var _NoiseFilter = require('./noise/NoiseFilter');
Object.defineProperty(exports, 'NoiseFilter', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_NoiseFilter).default;
  }
});
var _DisplacementFilter = require('./displacement/DisplacementFilter');
Object.defineProperty(exports, 'DisplacementFilter', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_DisplacementFilter).default;
  }
});
var _BlurFilter = require('./blur/BlurFilter');
Object.defineProperty(exports, 'BlurFilter', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_BlurFilter).default;
  }
});
var _BlurXFilter = require('./blur/BlurXFilter');
Object.defineProperty(exports, 'BlurXFilter', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_BlurXFilter).default;
  }
});
var _BlurYFilter = require('./blur/BlurYFilter');
Object.defineProperty(exports, 'BlurYFilter', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_BlurYFilter).default;
  }
});
var _ColorMatrixFilter = require('./colormatrix/ColorMatrixFilter');
Object.defineProperty(exports, 'ColorMatrixFilter', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_ColorMatrixFilter).default;
  }
});
var _AlphaFilter = require('./alpha/AlphaFilter');
Object.defineProperty(exports, 'AlphaFilter', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_AlphaFilter).default;
  }
});
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
},{"./alpha/AlphaFilter":143,"./blur/BlurFilter":144,"./blur/BlurXFilter":145,"./blur/BlurYFilter":146,"./colormatrix/ColorMatrixFilter":150,"./displacement/DisplacementFilter":151,"./fxaa/FXAAFilter":152,"./noise/NoiseFilter":154}],154:[function(require,module,exports){
'use strict';
exports.__esModule = true;
var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
var _core = require('../../core');
var core = _interopRequireWildcard(_core);
var _path = require('path');
function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
var NoiseFilter = function (_core$Filter) {
    _inherits(NoiseFilter, _core$Filter);
    function NoiseFilter() {
        var noise = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0.5;
        var seed = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : Math.random();
        _classCallCheck(this, NoiseFilter);
        var _this = _possibleConstructorReturn(this, _core$Filter.call(this,
        'attribute vec2 aVertexPosition;\nattribute vec2 aTextureCoord;\n\nuniform mat3 projectionMatrix;\n\nvarying vec2 vTextureCoord;\n\nvoid main(void)\n{\n    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\n    vTextureCoord = aTextureCoord;\n}',
        'precision highp float;\n\nvarying vec2 vTextureCoord;\nvarying vec4 vColor;\n\nuniform float uNoise;\nuniform float uSeed;\nuniform sampler2D uSampler;\n\nfloat rand(vec2 co)\n{\n    return fract(sin(dot(co.xy, vec2(12.9898, 78.233))) * 43758.5453);\n}\n\nvoid main()\n{\n    vec4 color = texture2D(uSampler, vTextureCoord);\n    float randomValue = rand(gl_FragCoord.xy * uSeed);\n    float diff = (randomValue - 0.5) * uNoise;\n\n    // Un-premultiply alpha before applying the color matrix. See issue #3539.\n    if (color.a > 0.0) {\n        color.rgb /= color.a;\n    }\n\n    color.r += diff;\n    color.g += diff;\n    color.b += diff;\n\n    // Premultiply alpha again.\n    color.rgb *= color.a;\n\n    gl_FragColor = color;\n}\n'));
        _this.noise = noise;
        _this.seed = seed;
        return _this;
    }
    _createClass(NoiseFilter, [{
        key: 'noise',
        get: function get() {
            return this.uniforms.uNoise;
        },
        set: function set(value) 
        {
            this.uniforms.uNoise = value;
        }
    }, {
        key: 'seed',
        get: function get() {
            return this.uniforms.uSeed;
        },
        set: function set(value) 
        {
            this.uniforms.uSeed = value;
        }
    }]);
    return NoiseFilter;
}(core.Filter);
exports.default = NoiseFilter;
},{"../../core":65,"path":8}],155:[function(require,module,exports){
'use strict';
exports.__esModule = true;
var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
var _core = require('../core');
var core = _interopRequireWildcard(_core);
function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
var InteractionData = function () {
  function InteractionData() {
    _classCallCheck(this, InteractionData);
    this.global = new core.Point();
    this.target = null;
    this.originalEvent = null;
    this.identifier = null;
    this.isPrimary = false;
    this.button = 0;
    this.buttons = 0;
    this.width = 0;
    this.height = 0;
    this.tiltX = 0;
    this.tiltY = 0;
    this.pointerType = null;
    this.pressure = 0;
    this.rotationAngle = 0;
    this.twist = 0;
    this.tangentialPressure = 0;
  }
  InteractionData.prototype.getLocalPosition = function getLocalPosition(displayObject, point, globalPos) {
    return displayObject.worldTransform.applyInverse(globalPos || this.global, point);
  };
  InteractionData.prototype.copyEvent = function copyEvent(event) {
    if (event.isPrimary) {
      this.isPrimary = true;
    }
    this.button = event.button;
    this.buttons = Number.isInteger(event.buttons) ? event.buttons : event.which;
    this.width = event.width;
    this.height = event.height;
    this.tiltX = event.tiltX;
    this.tiltY = event.tiltY;
    this.pointerType = event.pointerType;
    this.pressure = event.pressure;
    this.rotationAngle = event.rotationAngle;
    this.twist = event.twist || 0;
    this.tangentialPressure = event.tangentialPressure || 0;
  };
  InteractionData.prototype.reset = function reset() {
    this.isPrimary = false;
  };
  _createClass(InteractionData, [{
    key: 'pointerId',
    get: function get() {
      return this.identifier;
    }
  }]);
  return InteractionData;
}();
exports.default = InteractionData;
},{"../core":65}],156:[function(require,module,exports){
"use strict";
exports.__esModule = true;
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
var InteractionEvent = function () {
  function InteractionEvent() {
    _classCallCheck(this, InteractionEvent);
    this.stopped = false;
    this.target = null;
    this.currentTarget = null;
    this.type = null;
    this.data = null;
  }
  InteractionEvent.prototype.stopPropagation = function stopPropagation() {
    this.stopped = true;
  };
  InteractionEvent.prototype.reset = function reset() {
    this.stopped = false;
    this.currentTarget = null;
    this.target = null;
  };
  return InteractionEvent;
}();
exports.default = InteractionEvent;
},{}],157:[function(require,module,exports){
'use strict';
exports.__esModule = true;
var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };
var _core = require('../core');
var core = _interopRequireWildcard(_core);
var _InteractionData = require('./InteractionData');
var _InteractionData2 = _interopRequireDefault(_InteractionData);
var _InteractionEvent = require('./InteractionEvent');
var _InteractionEvent2 = _interopRequireDefault(_InteractionEvent);
var _InteractionTrackingData = require('./InteractionTrackingData');
var _InteractionTrackingData2 = _interopRequireDefault(_InteractionTrackingData);
var _eventemitter = require('eventemitter3');
var _eventemitter2 = _interopRequireDefault(_eventemitter);
var _interactiveTarget = require('./interactiveTarget');
var _interactiveTarget2 = _interopRequireDefault(_interactiveTarget);
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
core.utils.mixins.delayMixin(core.DisplayObject.prototype, _interactiveTarget2.default);
var MOUSE_POINTER_ID = 1;
var hitTestEvent = {
    target: null,
    data: {
        global: null
    }
};
var InteractionManager = function (_EventEmitter) {
    _inherits(InteractionManager, _EventEmitter);
    function InteractionManager(renderer, options) {
        _classCallCheck(this, InteractionManager);
        var _this = _possibleConstructorReturn(this, _EventEmitter.call(this));
        options = options || {};
        _this.renderer = renderer;
        _this.autoPreventDefault = options.autoPreventDefault !== undefined ? options.autoPreventDefault : true;
        _this.interactionFrequency = options.interactionFrequency || 10;
        _this.mouse = new _InteractionData2.default();
        _this.mouse.identifier = MOUSE_POINTER_ID;
        _this.mouse.global.set(-999999);
        _this.activeInteractionData = {};
        _this.activeInteractionData[MOUSE_POINTER_ID] = _this.mouse;
        _this.interactionDataPool = [];
        _this.eventData = new _InteractionEvent2.default();
        _this.interactionDOMElement = null;
        _this.moveWhenInside = false;
        _this.eventsAdded = false;
        _this.mouseOverRenderer = false;
        _this.supportsTouchEvents = 'ontouchstart' in window;
        _this.supportsPointerEvents = !!window.PointerEvent;
        _this.onPointerUp = _this.onPointerUp.bind(_this);
        _this.processPointerUp = _this.processPointerUp.bind(_this);
        _this.onPointerCancel = _this.onPointerCancel.bind(_this);
        _this.processPointerCancel = _this.processPointerCancel.bind(_this);
        _this.onPointerDown = _this.onPointerDown.bind(_this);
        _this.processPointerDown = _this.processPointerDown.bind(_this);
        _this.onPointerMove = _this.onPointerMove.bind(_this);
        _this.processPointerMove = _this.processPointerMove.bind(_this);
        _this.onPointerOut = _this.onPointerOut.bind(_this);
        _this.processPointerOverOut = _this.processPointerOverOut.bind(_this);
        _this.onPointerOver = _this.onPointerOver.bind(_this);
        _this.cursorStyles = {
            default: 'inherit',
            pointer: 'pointer'
        };
        _this.currentCursorMode = null;
        _this.cursor = null;
        _this._tempPoint = new core.Point();
        _this.resolution = 1;
        _this.setTargetElement(_this.renderer.view, _this.renderer.resolution);
        return _this;
    }
    InteractionManager.prototype.hitTest = function hitTest(globalPoint, root) {
        hitTestEvent.target = null;
        hitTestEvent.data.global = globalPoint;
        if (!root) {
            root = this.renderer._lastObjectRendered;
        }
        this.processInteractive(hitTestEvent, root, null, true);
        return hitTestEvent.target;
    };
    InteractionManager.prototype.setTargetElement = function setTargetElement(element) {
        var resolution = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
        this.removeEvents();
        this.interactionDOMElement = element;
        this.resolution = resolution;
        this.addEvents();
    };
    InteractionManager.prototype.addEvents = function addEvents() {
        if (!this.interactionDOMElement) {
            return;
        }
        core.ticker.shared.add(this.update, this, core.UPDATE_PRIORITY.INTERACTION);
        if (window.navigator.msPointerEnabled) {
            this.interactionDOMElement.style['-ms-content-zooming'] = 'none';
            this.interactionDOMElement.style['-ms-touch-action'] = 'none';
        } else if (this.supportsPointerEvents) {
            this.interactionDOMElement.style['touch-action'] = 'none';
        }
        if (this.supportsPointerEvents) {
            window.document.addEventListener('pointermove', this.onPointerMove, true);
            this.interactionDOMElement.addEventListener('pointerdown', this.onPointerDown, true);
            this.interactionDOMElement.addEventListener('pointerleave', this.onPointerOut, true);
            this.interactionDOMElement.addEventListener('pointerover', this.onPointerOver, true);
            window.addEventListener('pointercancel', this.onPointerCancel, true);
            window.addEventListener('pointerup', this.onPointerUp, true);
        } else {
            window.document.addEventListener('mousemove', this.onPointerMove, true);
            this.interactionDOMElement.addEventListener('mousedown', this.onPointerDown, true);
            this.interactionDOMElement.addEventListener('mouseout', this.onPointerOut, true);
            this.interactionDOMElement.addEventListener('mouseover', this.onPointerOver, true);
            window.addEventListener('mouseup', this.onPointerUp, true);
        }
        if (this.supportsTouchEvents) {
            this.interactionDOMElement.addEventListener('touchstart', this.onPointerDown, true);
            this.interactionDOMElement.addEventListener('touchcancel', this.onPointerCancel, true);
            this.interactionDOMElement.addEventListener('touchend', this.onPointerUp, true);
            this.interactionDOMElement.addEventListener('touchmove', this.onPointerMove, true);
        }
        this.eventsAdded = true;
    };
    InteractionManager.prototype.removeEvents = function removeEvents() {
        if (!this.interactionDOMElement) {
            return;
        }
        core.ticker.shared.remove(this.update, this);
        if (window.navigator.msPointerEnabled) {
            this.interactionDOMElement.style['-ms-content-zooming'] = '';
            this.interactionDOMElement.style['-ms-touch-action'] = '';
        } else if (this.supportsPointerEvents) {
            this.interactionDOMElement.style['touch-action'] = '';
        }
        if (this.supportsPointerEvents) {
            window.document.removeEventListener('pointermove', this.onPointerMove, true);
            this.interactionDOMElement.removeEventListener('pointerdown', this.onPointerDown, true);
            this.interactionDOMElement.removeEventListener('pointerleave', this.onPointerOut, true);
            this.interactionDOMElement.removeEventListener('pointerover', this.onPointerOver, true);
            window.removeEventListener('pointercancel', this.onPointerCancel, true);
            window.removeEventListener('pointerup', this.onPointerUp, true);
        } else {
            window.document.removeEventListener('mousemove', this.onPointerMove, true);
            this.interactionDOMElement.removeEventListener('mousedown', this.onPointerDown, true);
            this.interactionDOMElement.removeEventListener('mouseout', this.onPointerOut, true);
            this.interactionDOMElement.removeEventListener('mouseover', this.onPointerOver, true);
            window.removeEventListener('mouseup', this.onPointerUp, true);
        }
        if (this.supportsTouchEvents) {
            this.interactionDOMElement.removeEventListener('touchstart', this.onPointerDown, true);
            this.interactionDOMElement.removeEventListener('touchcancel', this.onPointerCancel, true);
            this.interactionDOMElement.removeEventListener('touchend', this.onPointerUp, true);
            this.interactionDOMElement.removeEventListener('touchmove', this.onPointerMove, true);
        }
        this.interactionDOMElement = null;
        this.eventsAdded = false;
    };
    InteractionManager.prototype.update = function update(deltaTime) {
        this._deltaTime += deltaTime;
        if (this._deltaTime < this.interactionFrequency) {
            return;
        }
        this._deltaTime = 0;
        if (!this.interactionDOMElement) {
            return;
        }
        if (this.didMove) {
            this.didMove = false;
            return;
        }
        this.cursor = null;
        for (var k in this.activeInteractionData) {
            if (this.activeInteractionData.hasOwnProperty(k)) {
                var interactionData = this.activeInteractionData[k];
                if (interactionData.originalEvent && interactionData.pointerType !== 'touch') {
                    var interactionEvent = this.configureInteractionEventForDOMEvent(this.eventData, interactionData.originalEvent, interactionData);
                    this.processInteractive(interactionEvent, this.renderer._lastObjectRendered, this.processPointerOverOut, true);
                }
            }
        }
        this.setCursorMode(this.cursor);
    };
    InteractionManager.prototype.setCursorMode = function setCursorMode(mode) {
        mode = mode || 'default';
        if (this.currentCursorMode === mode) {
            return;
        }
        this.currentCursorMode = mode;
        var style = this.cursorStyles[mode];
        if (style) {
            switch (typeof style === 'undefined' ? 'undefined' : _typeof(style)) {
                case 'string':
                    this.interactionDOMElement.style.cursor = style;
                    break;
                case 'function':
                    style(mode);
                    break;
                case 'object':
                    Object.assign(this.interactionDOMElement.style, style);
                    break;
            }
        } else if (typeof mode === 'string' && !Object.prototype.hasOwnProperty.call(this.cursorStyles, mode)) {
            this.interactionDOMElement.style.cursor = mode;
        }
    };
    InteractionManager.prototype.dispatchEvent = function dispatchEvent(displayObject, eventString, eventData) {
        if (!eventData.stopped) {
            eventData.currentTarget = displayObject;
            eventData.type = eventString;
            displayObject.emit(eventString, eventData);
            if (displayObject[eventString]) {
                displayObject[eventString](eventData);
            }
        }
    };
    InteractionManager.prototype.mapPositionToPoint = function mapPositionToPoint(point, x, y) {
        var rect = void 0;
        if (!this.interactionDOMElement.parentElement) {
            rect = { x: 0, y: 0, width: 0, height: 0 };
        } else {
            rect = this.interactionDOMElement.getBoundingClientRect();
        }
        var resolutionMultiplier = navigator.isCocoonJS ? this.resolution : 1.0 / this.resolution;
        point.x = (x - rect.left) * (this.interactionDOMElement.width / rect.width) * resolutionMultiplier;
        point.y = (y - rect.top) * (this.interactionDOMElement.height / rect.height) * resolutionMultiplier;
    };
    InteractionManager.prototype.processInteractive = function processInteractive(interactionEvent, displayObject, func, hitTest, interactive) {
        if (!displayObject || !displayObject.visible) {
            return false;
        }
        var point = interactionEvent.data.global;
        interactive = displayObject.interactive || interactive;
        var hit = false;
        var interactiveParent = interactive;
        var hitTestChildren = true;
        if (displayObject.hitArea) {
            if (hitTest) {
                displayObject.worldTransform.applyInverse(point, this._tempPoint);
                if (!displayObject.hitArea.contains(this._tempPoint.x, this._tempPoint.y)) {
                    hitTest = false;
                    hitTestChildren = false;
                } else {
                    hit = true;
                }
            }
            interactiveParent = false;
        }
        else if (displayObject._mask) {
                if (hitTest) {
                    if (!displayObject._mask.containsPoint(point)) {
                        hitTest = false;
                        hitTestChildren = false;
                    }
                }
            }
        if (hitTestChildren && displayObject.interactiveChildren && displayObject.children) {
            var children = displayObject.children;
            for (var i = children.length - 1; i >= 0; i--) {
                var child = children[i];
                var childHit = this.processInteractive(interactionEvent, child, func, hitTest, interactiveParent);
                if (childHit) {
                    if (!child.parent) {
                        continue;
                    }
                    interactiveParent = false;
                    if (childHit) {
                        if (interactionEvent.target) {
                            hitTest = false;
                        }
                        hit = true;
                    }
                }
            }
        }
        if (interactive) {
            if (hitTest && !interactionEvent.target) {
                if (!displayObject.hitArea && displayObject.containsPoint) {
                    if (displayObject.containsPoint(point)) {
                        hit = true;
                    }
                }
            }
            if (displayObject.interactive) {
                if (hit && !interactionEvent.target) {
                    interactionEvent.target = displayObject;
                }
                if (func) {
                    func(interactionEvent, displayObject, !!hit);
                }
            }
        }
        return hit;
    };
    InteractionManager.prototype.onPointerDown = function onPointerDown(originalEvent) {
        if (this.supportsTouchEvents && originalEvent.pointerType === 'touch') return;
        var events = this.normalizeToPointerData(originalEvent);
        if (this.autoPreventDefault && events[0].isNormalized) {
            originalEvent.preventDefault();
        }
        var eventLen = events.length;
        for (var i = 0; i < eventLen; i++) {
            var event = events[i];
            var interactionData = this.getInteractionDataForPointerId(event);
            var interactionEvent = this.configureInteractionEventForDOMEvent(this.eventData, event, interactionData);
            interactionEvent.data.originalEvent = originalEvent;
            this.processInteractive(interactionEvent, this.renderer._lastObjectRendered, this.processPointerDown, true);
            this.emit('pointerdown', interactionEvent);
            if (event.pointerType === 'touch') {
                this.emit('touchstart', interactionEvent);
            }
            else if (event.pointerType === 'mouse' || event.pointerType === 'pen') {
                    var isRightButton = event.button === 2;
                    this.emit(isRightButton ? 'rightdown' : 'mousedown', this.eventData);
                }
        }
    };
    InteractionManager.prototype.processPointerDown = function processPointerDown(interactionEvent, displayObject, hit) {
        var data = interactionEvent.data;
        var id = interactionEvent.data.identifier;
        if (hit) {
            if (!displayObject.trackedPointers[id]) {
                displayObject.trackedPointers[id] = new _InteractionTrackingData2.default(id);
            }
            this.dispatchEvent(displayObject, 'pointerdown', interactionEvent);
            if (data.pointerType === 'touch') {
                this.dispatchEvent(displayObject, 'touchstart', interactionEvent);
            } else if (data.pointerType === 'mouse' || data.pointerType === 'pen') {
                var isRightButton = data.button === 2;
                if (isRightButton) {
                    displayObject.trackedPointers[id].rightDown = true;
                } else {
                    displayObject.trackedPointers[id].leftDown = true;
                }
                this.dispatchEvent(displayObject, isRightButton ? 'rightdown' : 'mousedown', interactionEvent);
            }
        }
    };
    InteractionManager.prototype.onPointerComplete = function onPointerComplete(originalEvent, cancelled, func) {
        var events = this.normalizeToPointerData(originalEvent);
        var eventLen = events.length;
        var eventAppend = originalEvent.target !== this.interactionDOMElement ? 'outside' : '';
        for (var i = 0; i < eventLen; i++) {
            var event = events[i];
            var interactionData = this.getInteractionDataForPointerId(event);
            var interactionEvent = this.configureInteractionEventForDOMEvent(this.eventData, event, interactionData);
            interactionEvent.data.originalEvent = originalEvent;
            this.processInteractive(interactionEvent, this.renderer._lastObjectRendered, func, cancelled || !eventAppend);
            this.emit(cancelled ? 'pointercancel' : 'pointerup' + eventAppend, interactionEvent);
            if (event.pointerType === 'mouse' || event.pointerType === 'pen') {
                var isRightButton = event.button === 2;
                this.emit(isRightButton ? 'rightup' + eventAppend : 'mouseup' + eventAppend, interactionEvent);
            } else if (event.pointerType === 'touch') {
                this.emit(cancelled ? 'touchcancel' : 'touchend' + eventAppend, interactionEvent);
                this.releaseInteractionDataForPointerId(event.pointerId, interactionData);
            }
        }
    };
    InteractionManager.prototype.onPointerCancel = function onPointerCancel(event) {
        if (this.supportsTouchEvents && event.pointerType === 'touch') return;
        this.onPointerComplete(event, true, this.processPointerCancel);
    };
    InteractionManager.prototype.processPointerCancel = function processPointerCancel(interactionEvent, displayObject) {
        var data = interactionEvent.data;
        var id = interactionEvent.data.identifier;
        if (displayObject.trackedPointers[id] !== undefined) {
            delete displayObject.trackedPointers[id];
            this.dispatchEvent(displayObject, 'pointercancel', interactionEvent);
            if (data.pointerType === 'touch') {
                this.dispatchEvent(displayObject, 'touchcancel', interactionEvent);
            }
        }
    };
    InteractionManager.prototype.onPointerUp = function onPointerUp(event) {
        if (this.supportsTouchEvents && event.pointerType === 'touch') return;
        this.onPointerComplete(event, false, this.processPointerUp);
    };
    InteractionManager.prototype.processPointerUp = function processPointerUp(interactionEvent, displayObject, hit) {
        var data = interactionEvent.data;
        var id = interactionEvent.data.identifier;
        var trackingData = displayObject.trackedPointers[id];
        var isTouch = data.pointerType === 'touch';
        var isMouse = data.pointerType === 'mouse' || data.pointerType === 'pen';
        var isMouseTap = false;
        if (isMouse) {
            var isRightButton = data.button === 2;
            var flags = _InteractionTrackingData2.default.FLAGS;
            var test = isRightButton ? flags.RIGHT_DOWN : flags.LEFT_DOWN;
            var isDown = trackingData !== undefined && trackingData.flags & test;
            if (hit) {
                this.dispatchEvent(displayObject, isRightButton ? 'rightup' : 'mouseup', interactionEvent);
                if (isDown) {
                    this.dispatchEvent(displayObject, isRightButton ? 'rightclick' : 'click', interactionEvent);
                    isMouseTap = true;
                }
            } else if (isDown) {
                this.dispatchEvent(displayObject, isRightButton ? 'rightupoutside' : 'mouseupoutside', interactionEvent);
            }
            if (trackingData) {
                if (isRightButton) {
                    trackingData.rightDown = false;
                } else {
                    trackingData.leftDown = false;
                }
            }
        }
        if (hit) {
            this.dispatchEvent(displayObject, 'pointerup', interactionEvent);
            if (isTouch) this.dispatchEvent(displayObject, 'touchend', interactionEvent);
            if (trackingData) {
                if (!isMouse || isMouseTap) {
                    this.dispatchEvent(displayObject, 'pointertap', interactionEvent);
                }
                if (isTouch) {
                    this.dispatchEvent(displayObject, 'tap', interactionEvent);
                    trackingData.over = false;
                }
            }
        } else if (trackingData) {
            this.dispatchEvent(displayObject, 'pointerupoutside', interactionEvent);
            if (isTouch) this.dispatchEvent(displayObject, 'touchendoutside', interactionEvent);
        }
        if (trackingData && trackingData.none) {
            delete displayObject.trackedPointers[id];
        }
    };
    InteractionManager.prototype.onPointerMove = function onPointerMove(originalEvent) {
        if (this.supportsTouchEvents && originalEvent.pointerType === 'touch') return;
        var events = this.normalizeToPointerData(originalEvent);
        if (events[0].pointerType === 'mouse' || events[0].pointerType === 'pen') {
            this.didMove = true;
            this.cursor = null;
        }
        var eventLen = events.length;
        for (var i = 0; i < eventLen; i++) {
            var event = events[i];
            var interactionData = this.getInteractionDataForPointerId(event);
            var interactionEvent = this.configureInteractionEventForDOMEvent(this.eventData, event, interactionData);
            interactionEvent.data.originalEvent = originalEvent;
            var interactive = event.pointerType === 'touch' ? this.moveWhenInside : true;
            this.processInteractive(interactionEvent, this.renderer._lastObjectRendered, this.processPointerMove, interactive);
            this.emit('pointermove', interactionEvent);
            if (event.pointerType === 'touch') this.emit('touchmove', interactionEvent);
            if (event.pointerType === 'mouse' || event.pointerType === 'pen') this.emit('mousemove', interactionEvent);
        }
        if (events[0].pointerType === 'mouse') {
            this.setCursorMode(this.cursor);
        }
    };
    InteractionManager.prototype.processPointerMove = function processPointerMove(interactionEvent, displayObject, hit) {
        var data = interactionEvent.data;
        var isTouch = data.pointerType === 'touch';
        var isMouse = data.pointerType === 'mouse' || data.pointerType === 'pen';
        if (isMouse) {
            this.processPointerOverOut(interactionEvent, displayObject, hit);
        }
        if (!this.moveWhenInside || hit) {
            this.dispatchEvent(displayObject, 'pointermove', interactionEvent);
            if (isTouch) this.dispatchEvent(displayObject, 'touchmove', interactionEvent);
            if (isMouse) this.dispatchEvent(displayObject, 'mousemove', interactionEvent);
        }
    };
    InteractionManager.prototype.onPointerOut = function onPointerOut(originalEvent) {
        if (this.supportsTouchEvents && originalEvent.pointerType === 'touch') return;
        var events = this.normalizeToPointerData(originalEvent);
        var event = events[0];
        if (event.pointerType === 'mouse') {
            this.mouseOverRenderer = false;
            this.setCursorMode(null);
        }
        var interactionData = this.getInteractionDataForPointerId(event);
        var interactionEvent = this.configureInteractionEventForDOMEvent(this.eventData, event, interactionData);
        interactionEvent.data.originalEvent = event;
        this.processInteractive(interactionEvent, this.renderer._lastObjectRendered, this.processPointerOverOut, false);
        this.emit('pointerout', interactionEvent);
        if (event.pointerType === 'mouse' || event.pointerType === 'pen') {
            this.emit('mouseout', interactionEvent);
        } else {
            this.releaseInteractionDataForPointerId(interactionData.identifier);
        }
    };
    InteractionManager.prototype.processPointerOverOut = function processPointerOverOut(interactionEvent, displayObject, hit) {
        var data = interactionEvent.data;
        var id = interactionEvent.data.identifier;
        var isMouse = data.pointerType === 'mouse' || data.pointerType === 'pen';
        var trackingData = displayObject.trackedPointers[id];
        if (hit && !trackingData) {
            trackingData = displayObject.trackedPointers[id] = new _InteractionTrackingData2.default(id);
        }
        if (trackingData === undefined) return;
        if (hit && this.mouseOverRenderer) {
            if (!trackingData.over) {
                trackingData.over = true;
                this.dispatchEvent(displayObject, 'pointerover', interactionEvent);
                if (isMouse) {
                    this.dispatchEvent(displayObject, 'mouseover', interactionEvent);
                }
            }
            if (isMouse && this.cursor === null) {
                this.cursor = displayObject.cursor;
            }
        } else if (trackingData.over) {
            trackingData.over = false;
            this.dispatchEvent(displayObject, 'pointerout', this.eventData);
            if (isMouse) {
                this.dispatchEvent(displayObject, 'mouseout', interactionEvent);
            }
            if (trackingData.none) {
                delete displayObject.trackedPointers[id];
            }
        }
    };
    InteractionManager.prototype.onPointerOver = function onPointerOver(originalEvent) {
        var events = this.normalizeToPointerData(originalEvent);
        var event = events[0];
        var interactionData = this.getInteractionDataForPointerId(event);
        var interactionEvent = this.configureInteractionEventForDOMEvent(this.eventData, event, interactionData);
        interactionEvent.data.originalEvent = event;
        if (event.pointerType === 'mouse') {
            this.mouseOverRenderer = true;
        }
        this.emit('pointerover', interactionEvent);
        if (event.pointerType === 'mouse' || event.pointerType === 'pen') {
            this.emit('mouseover', interactionEvent);
        }
    };
    InteractionManager.prototype.getInteractionDataForPointerId = function getInteractionDataForPointerId(event) {
        var pointerId = event.pointerId;
        var interactionData = void 0;
        if (pointerId === MOUSE_POINTER_ID || event.pointerType === 'mouse') {
            interactionData = this.mouse;
        } else if (this.activeInteractionData[pointerId]) {
            interactionData = this.activeInteractionData[pointerId];
        } else {
            interactionData = this.interactionDataPool.pop() || new _InteractionData2.default();
            interactionData.identifier = pointerId;
            this.activeInteractionData[pointerId] = interactionData;
        }
        interactionData.copyEvent(event);
        return interactionData;
    };
    InteractionManager.prototype.releaseInteractionDataForPointerId = function releaseInteractionDataForPointerId(pointerId) {
        var interactionData = this.activeInteractionData[pointerId];
        if (interactionData) {
            delete this.activeInteractionData[pointerId];
            interactionData.reset();
            this.interactionDataPool.push(interactionData);
        }
    };
    InteractionManager.prototype.configureInteractionEventForDOMEvent = function configureInteractionEventForDOMEvent(interactionEvent, pointerEvent, interactionData) {
        interactionEvent.data = interactionData;
        this.mapPositionToPoint(interactionData.global, pointerEvent.clientX, pointerEvent.clientY);
        if (navigator.isCocoonJS && pointerEvent.pointerType === 'touch') {
            interactionData.global.x = interactionData.global.x / this.resolution;
            interactionData.global.y = interactionData.global.y / this.resolution;
        }
        if (pointerEvent.pointerType === 'touch') {
            pointerEvent.globalX = interactionData.global.x;
            pointerEvent.globalY = interactionData.global.y;
        }
        interactionData.originalEvent = pointerEvent;
        interactionEvent.reset();
        return interactionEvent;
    };
    InteractionManager.prototype.normalizeToPointerData = function normalizeToPointerData(event) {
        var normalizedEvents = [];
        if (this.supportsTouchEvents && event instanceof TouchEvent) {
            for (var i = 0, li = event.changedTouches.length; i < li; i++) {
                var touch = event.changedTouches[i];
                if (typeof touch.button === 'undefined') touch.button = event.touches.length ? 1 : 0;
                if (typeof touch.buttons === 'undefined') touch.buttons = event.touches.length ? 1 : 0;
                if (typeof touch.isPrimary === 'undefined') {
                    touch.isPrimary = event.touches.length === 1 && event.type === 'touchstart';
                }
                if (typeof touch.width === 'undefined') touch.width = touch.radiusX || 1;
                if (typeof touch.height === 'undefined') touch.height = touch.radiusY || 1;
                if (typeof touch.tiltX === 'undefined') touch.tiltX = 0;
                if (typeof touch.tiltY === 'undefined') touch.tiltY = 0;
                if (typeof touch.pointerType === 'undefined') touch.pointerType = 'touch';
                if (typeof touch.pointerId === 'undefined') touch.pointerId = touch.identifier || 0;
                if (typeof touch.pressure === 'undefined') touch.pressure = touch.force || 0.5;
                touch.twist = 0;
                touch.tangentialPressure = 0;
                if (typeof touch.layerX === 'undefined') touch.layerX = touch.offsetX = touch.clientX;
                if (typeof touch.layerY === 'undefined') touch.layerY = touch.offsetY = touch.clientY;
                touch.isNormalized = true;
                normalizedEvents.push(touch);
            }
        }
        else if (event instanceof MouseEvent && (!this.supportsPointerEvents || !(event instanceof window.PointerEvent))) {
                if (typeof event.isPrimary === 'undefined') event.isPrimary = true;
                if (typeof event.width === 'undefined') event.width = 1;
                if (typeof event.height === 'undefined') event.height = 1;
                if (typeof event.tiltX === 'undefined') event.tiltX = 0;
                if (typeof event.tiltY === 'undefined') event.tiltY = 0;
                if (typeof event.pointerType === 'undefined') event.pointerType = 'mouse';
                if (typeof event.pointerId === 'undefined') event.pointerId = MOUSE_POINTER_ID;
                if (typeof event.pressure === 'undefined') event.pressure = 0.5;
                event.twist = 0;
                event.tangentialPressure = 0;
                event.isNormalized = true;
                normalizedEvents.push(event);
            } else {
                normalizedEvents.push(event);
            }
        return normalizedEvents;
    };
    InteractionManager.prototype.destroy = function destroy() {
        this.removeEvents();
        this.removeAllListeners();
        this.renderer = null;
        this.mouse = null;
        this.eventData = null;
        this.interactionDOMElement = null;
        this.onPointerDown = null;
        this.processPointerDown = null;
        this.onPointerUp = null;
        this.processPointerUp = null;
        this.onPointerCancel = null;
        this.processPointerCancel = null;
        this.onPointerMove = null;
        this.processPointerMove = null;
        this.onPointerOut = null;
        this.processPointerOverOut = null;
        this.onPointerOver = null;
        this._tempPoint = null;
    };
    return InteractionManager;
}(_eventemitter2.default);
exports.default = InteractionManager;
core.WebGLRenderer.registerPlugin('interaction', InteractionManager);
core.CanvasRenderer.registerPlugin('interaction', InteractionManager);
},{"../core":65,"./InteractionData":155,"./InteractionEvent":156,"./InteractionTrackingData":158,"./interactiveTarget":160,"eventemitter3":3}],158:[function(require,module,exports){
"use strict";
exports.__esModule = true;
var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
var InteractionTrackingData = function () {
    function InteractionTrackingData(pointerId) {
        _classCallCheck(this, InteractionTrackingData);
        this._pointerId = pointerId;
        this._flags = InteractionTrackingData.FLAGS.NONE;
    }
    InteractionTrackingData.prototype._doSet = function _doSet(flag, yn) {
        if (yn) {
            this._flags = this._flags | flag;
        } else {
            this._flags = this._flags & ~flag;
        }
    };
    _createClass(InteractionTrackingData, [{
        key: "pointerId",
        get: function get() {
            return this._pointerId;
        }
    }, {
        key: "flags",
        get: function get() {
            return this._flags;
        }
        ,
        set: function set(flags) {
            this._flags = flags;
        }
    }, {
        key: "none",
        get: function get() {
            return this._flags === this.constructor.FLAGS.NONE;
        }
    }, {
        key: "over",
        get: function get() {
            return (this._flags & this.constructor.FLAGS.OVER) !== 0;
        }
        ,
        set: function set(yn) {
            this._doSet(this.constructor.FLAGS.OVER, yn);
        }
    }, {
        key: "rightDown",
        get: function get() {
            return (this._flags & this.constructor.FLAGS.RIGHT_DOWN) !== 0;
        }
        ,
        set: function set(yn) {
            this._doSet(this.constructor.FLAGS.RIGHT_DOWN, yn);
        }
    }, {
        key: "leftDown",
        get: function get() {
            return (this._flags & this.constructor.FLAGS.LEFT_DOWN) !== 0;
        }
        ,
        set: function set(yn) {
            this._doSet(this.constructor.FLAGS.LEFT_DOWN, yn);
        }
    }]);
    return InteractionTrackingData;
}();
exports.default = InteractionTrackingData;
InteractionTrackingData.FLAGS = Object.freeze({
    NONE: 0,
    OVER: 1 << 0,
    LEFT_DOWN: 1 << 1,
    RIGHT_DOWN: 1 << 2
});
},{}],159:[function(require,module,exports){
'use strict';
exports.__esModule = true;
var _InteractionData = require('./InteractionData');
Object.defineProperty(exports, 'InteractionData', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_InteractionData).default;
  }
});
var _InteractionManager = require('./InteractionManager');
Object.defineProperty(exports, 'InteractionManager', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_InteractionManager).default;
  }
});
var _interactiveTarget = require('./interactiveTarget');
Object.defineProperty(exports, 'interactiveTarget', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_interactiveTarget).default;
  }
});
var _InteractionTrackingData = require('./InteractionTrackingData');
Object.defineProperty(exports, 'InteractionTrackingData', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_InteractionTrackingData).default;
  }
});
var _InteractionEvent = require('./InteractionEvent');
Object.defineProperty(exports, 'InteractionEvent', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_InteractionEvent).default;
  }
});
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
},{"./InteractionData":155,"./InteractionEvent":156,"./InteractionManager":157,"./InteractionTrackingData":158,"./interactiveTarget":160}],160:[function(require,module,exports){
'use strict';
exports.__esModule = true;
exports.default = {
  interactive: false,
  interactiveChildren: true,
  hitArea: null,
  get buttonMode() {
    return this.cursor === 'pointer';
  },
  set buttonMode(value) {
    if (value) {
      this.cursor = 'pointer';
    } else if (this.cursor === 'pointer') {
      this.cursor = null;
    }
  },
  cursor: null,
  get trackedPointers() {
    if (this._trackedPointers === undefined) this._trackedPointers = {};
    return this._trackedPointers;
  },
  _trackedPointers: undefined
};
},{}],161:[function(require,module,exports){
'use strict';
exports.__esModule = true;
exports.parse = parse;
exports.default = function () {
    return function bitmapFontParser(resource, next) {
        if (!resource.data || resource.type !== _resourceLoader.Resource.TYPE.XML) {
            next();
            return;
        }
        if (resource.data.getElementsByTagName('page').length === 0 || resource.data.getElementsByTagName('info').length === 0 || resource.data.getElementsByTagName('info')[0].getAttribute('face') === null) {
            next();
            return;
        }
        var xmlUrl = !resource.isDataUrl ? path.dirname(resource.url) : '';
        if (resource.isDataUrl) {
            if (xmlUrl === '.') {
                xmlUrl = '';
            }
            if (this.baseUrl && xmlUrl) {
                if (this.baseUrl.charAt(this.baseUrl.length - 1) === '/') {
                    xmlUrl += '/';
                }
            }
        }
        xmlUrl = xmlUrl.replace(this.baseUrl, '');
        if (xmlUrl && xmlUrl.charAt(xmlUrl.length - 1) !== '/') {
            xmlUrl += '/';
        }
        var pages = resource.data.getElementsByTagName('page');
        var textures = {};
        var completed = function completed(page) {
            textures[page.metadata.pageFile] = page.texture;
            if (Object.keys(textures).length === pages.length) {
                parse(resource, textures);
                next();
            }
        };
        for (var i = 0; i < pages.length; ++i) {
            var pageFile = pages[i].getAttribute('file');
            var url = xmlUrl + pageFile;
            var exists = false;
            for (var name in this.resources) {
                if (this.resources[name].url === url) {
                    this.resources[name].metadata.pageFile = pageFile;
                    completed(this.resources[name]);
                    exists = true;
                    break;
                }
            }
            if (!exists) {
                var options = {
                    crossOrigin: resource.crossOrigin,
                    loadType: _resourceLoader.Resource.LOAD_TYPE.IMAGE,
                    metadata: Object.assign({ pageFile: pageFile }, resource.metadata.imageMetadata),
                    parentResource: resource
                };
                this.add(url, options, completed);
            }
        }
    };
};
var _path = require('path');
var path = _interopRequireWildcard(_path);
var _resourceLoader = require('resource-loader');
var _extras = require('../extras');
function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }
function parse(resource, textures) {
    resource.bitmapFont = _extras.BitmapText.registerFont(resource.data, textures);
}
},{"../extras":141,"path":8,"resource-loader":36}],162:[function(require,module,exports){
'use strict';
exports.__esModule = true;
exports.shared = exports.Resource = exports.textureParser = exports.getResourcePath = exports.spritesheetParser = exports.parseBitmapFontData = exports.bitmapFontParser = exports.Loader = undefined;
var _bitmapFontParser = require('./bitmapFontParser');
Object.defineProperty(exports, 'bitmapFontParser', {
    enumerable: true,
    get: function get() {
        return _interopRequireDefault(_bitmapFontParser).default;
    }
});
Object.defineProperty(exports, 'parseBitmapFontData', {
    enumerable: true,
    get: function get() {
        return _bitmapFontParser.parse;
    }
});
var _spritesheetParser = require('./spritesheetParser');
Object.defineProperty(exports, 'spritesheetParser', {
    enumerable: true,
    get: function get() {
        return _interopRequireDefault(_spritesheetParser).default;
    }
});
Object.defineProperty(exports, 'getResourcePath', {
    enumerable: true,
    get: function get() {
        return _spritesheetParser.getResourcePath;
    }
});
var _textureParser = require('./textureParser');
Object.defineProperty(exports, 'textureParser', {
    enumerable: true,
    get: function get() {
        return _interopRequireDefault(_textureParser).default;
    }
});
var _resourceLoader = require('resource-loader');
Object.defineProperty(exports, 'Resource', {
    enumerable: true,
    get: function get() {
        return _resourceLoader.Resource;
    }
});
var _Application = require('../core/Application');
var _Application2 = _interopRequireDefault(_Application);
var _loader = require('./loader');
var _loader2 = _interopRequireDefault(_loader);
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
exports.Loader = _loader2.default;
var shared = new _loader2.default();
shared.destroy = function () {
};
exports.shared = shared;
var AppPrototype = _Application2.default.prototype;
AppPrototype._loader = null;
Object.defineProperty(AppPrototype, 'loader', {
    get: function get() {
        if (!this._loader) {
            var sharedLoader = this._options.sharedLoader;
            this._loader = sharedLoader ? shared : new _loader2.default();
        }
        return this._loader;
    }
});
AppPrototype._parentDestroy = AppPrototype.destroy;
AppPrototype.destroy = function destroy(removeView, stageOptions) {
    if (this._loader) {
        this._loader.destroy();
        this._loader = null;
    }
    this._parentDestroy(removeView, stageOptions);
};
},{"../core/Application":43,"./bitmapFontParser":161,"./loader":163,"./spritesheetParser":164,"./textureParser":165,"resource-loader":36}],163:[function(require,module,exports){
'use strict';
exports.__esModule = true;
var _resourceLoader = require('resource-loader');
var _resourceLoader2 = _interopRequireDefault(_resourceLoader);
var _blob = require('resource-loader/lib/middlewares/parsing/blob');
var _eventemitter = require('eventemitter3');
var _eventemitter2 = _interopRequireDefault(_eventemitter);
var _textureParser = require('./textureParser');
var _textureParser2 = _interopRequireDefault(_textureParser);
var _spritesheetParser = require('./spritesheetParser');
var _spritesheetParser2 = _interopRequireDefault(_spritesheetParser);
var _bitmapFontParser = require('./bitmapFontParser');
var _bitmapFontParser2 = _interopRequireDefault(_bitmapFontParser);
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
var Loader = function (_ResourceLoader) {
    _inherits(Loader, _ResourceLoader);
    function Loader(baseUrl, concurrency) {
        _classCallCheck(this, Loader);
        var _this = _possibleConstructorReturn(this, _ResourceLoader.call(this, baseUrl, concurrency));
        _eventemitter2.default.call(_this);
        for (var i = 0; i < Loader._pixiMiddleware.length; ++i) {
            _this.use(Loader._pixiMiddleware[i]());
        }
        _this.onStart.add(function (l) {
            return _this.emit('start', l);
        });
        _this.onProgress.add(function (l, r) {
            return _this.emit('progress', l, r);
        });
        _this.onError.add(function (e, l, r) {
            return _this.emit('error', e, l, r);
        });
        _this.onLoad.add(function (l, r) {
            return _this.emit('load', l, r);
        });
        _this.onComplete.add(function (l, r) {
            return _this.emit('complete', l, r);
        });
        return _this;
    }
    Loader.addPixiMiddleware = function addPixiMiddleware(fn) {
        Loader._pixiMiddleware.push(fn);
    };
    Loader.prototype.destroy = function destroy() {
        this.removeAllListeners();
        this.reset();
    };
    return Loader;
}(_resourceLoader2.default);
exports.default = Loader;
for (var k in _eventemitter2.default.prototype) {
    Loader.prototype[k] = _eventemitter2.default.prototype[k];
}
Loader._pixiMiddleware = [
_blob.blobMiddlewareFactory,
_textureParser2.default,
_spritesheetParser2.default,
_bitmapFontParser2.default];
var Resource = _resourceLoader2.default.Resource;
Resource.setExtensionXhrType('fnt', Resource.XHR_RESPONSE_TYPE.DOCUMENT);
},{"./bitmapFontParser":161,"./spritesheetParser":164,"./textureParser":165,"eventemitter3":3,"resource-loader":36,"resource-loader/lib/middlewares/parsing/blob":37}],164:[function(require,module,exports){
'use strict';
exports.__esModule = true;
exports.default = function () {
    return function spritesheetParser(resource, next) {
        var imageResourceName = resource.name + '_image';
        if (!resource.data || resource.type !== _resourceLoader.Resource.TYPE.JSON || !resource.data.frames || this.resources[imageResourceName]) {
            next();
            return;
        }
        var loadOptions = {
            crossOrigin: resource.crossOrigin,
            metadata: resource.metadata.imageMetadata,
            parentResource: resource
        };
        var resourcePath = getResourcePath(resource, this.baseUrl);
        this.add(imageResourceName, resourcePath, loadOptions, function onImageLoad(res) {
            if (res.error) {
                next(res.error);
                return;
            }
            var spritesheet = new _core.Spritesheet(res.texture.baseTexture, resource.data, resource.url);
            spritesheet.parse(function () {
                resource.spritesheet = spritesheet;
                resource.textures = spritesheet.textures;
                next();
            });
        });
    };
};
exports.getResourcePath = getResourcePath;
var _resourceLoader = require('resource-loader');
var _url = require('url');
var _url2 = _interopRequireDefault(_url);
var _core = require('../core');
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function getResourcePath(resource, baseUrl) {
    if (resource.isDataUrl) {
        return resource.data.meta.image;
    }
    return _url2.default.resolve(resource.url.replace(baseUrl, ''), resource.data.meta.image);
}
},{"../core":65,"resource-loader":36,"url":38}],165:[function(require,module,exports){
'use strict';
exports.__esModule = true;
exports.default = function () {
    return function textureParser(resource, next) {
        if (resource.data && resource.type === _resourceLoader.Resource.TYPE.IMAGE) {
            resource.texture = _Texture2.default.fromLoader(resource.data, resource.url, resource.name);
        }
        next();
    };
};
var _resourceLoader = require('resource-loader');
var _Texture = require('../core/textures/Texture');
var _Texture2 = _interopRequireDefault(_Texture);
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
},{"../core/textures/Texture":115,"resource-loader":36}],166:[function(require,module,exports){
'use strict';
exports.__esModule = true;
var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
var _core = require('../core');
var core = _interopRequireWildcard(_core);
var _Texture = require('../core/textures/Texture');
var _Texture2 = _interopRequireDefault(_Texture);
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
var tempPoint = new core.Point();
var tempPolygon = new core.Polygon();
var Mesh = function (_core$Container) {
    _inherits(Mesh, _core$Container);
    function Mesh(texture, vertices, uvs, indices, drawMode) {
        _classCallCheck(this, Mesh);
        var _this = _possibleConstructorReturn(this, _core$Container.call(this));
        _this._texture = texture || _Texture2.default.EMPTY;
        _this.uvs = uvs || new Float32Array([0, 0, 1, 0, 1, 1, 0, 1]);
        _this.vertices = vertices || new Float32Array([0, 0, 100, 0, 100, 100, 0, 100]);
        _this.indices = indices || new Uint16Array([0, 1, 3, 2]);
        _this.dirty = 0;
        _this.indexDirty = 0;
        _this.vertexDirty = 0;
        _this.autoUpdate = true;
        _this.blendMode = core.BLEND_MODES.NORMAL;
        _this.canvasPadding = core.settings.MESH_CANVAS_PADDING;
        _this.drawMode = drawMode || Mesh.DRAW_MODES.TRIANGLE_MESH;
        _this.shader = null;
        _this.tintRgb = new Float32Array([1, 1, 1]);
        _this._glDatas = {};
        _this._uvTransform = new core.TextureMatrix(_this._texture);
        _this.uploadUvTransform = false;
        _this.pluginName = 'mesh';
        return _this;
    }
    Mesh.prototype._renderWebGL = function _renderWebGL(renderer) {
        this.refresh();
        renderer.setObjectRenderer(renderer.plugins[this.pluginName]);
        renderer.plugins[this.pluginName].render(this);
    };
    Mesh.prototype._renderCanvas = function _renderCanvas(renderer) {
        this.refresh();
        renderer.plugins[this.pluginName].render(this);
    };
    Mesh.prototype._onTextureUpdate = function _onTextureUpdate() {
        this._uvTransform.texture = this._texture;
        this.refresh();
    };
    Mesh.prototype.multiplyUvs = function multiplyUvs() {
        if (!this.uploadUvTransform) {
            this._uvTransform.multiplyUvs(this.uvs);
        }
    };
    Mesh.prototype.refresh = function refresh(forceUpdate) {
        if (this.autoUpdate) {
            this.vertexDirty++;
        }
        if (this._uvTransform.update(forceUpdate)) {
            this._refresh();
        }
    };
    Mesh.prototype._refresh = function _refresh() {}
    ;
    Mesh.prototype._calculateBounds = function _calculateBounds() {
        this._bounds.addVertices(this.transform, this.vertices, 0, this.vertices.length);
    };
    Mesh.prototype.containsPoint = function containsPoint(point) {
        if (!this.getBounds().contains(point.x, point.y)) {
            return false;
        }
        this.worldTransform.applyInverse(point, tempPoint);
        var vertices = this.vertices;
        var points = tempPolygon.points;
        var indices = this.indices;
        var len = this.indices.length;
        var step = this.drawMode === Mesh.DRAW_MODES.TRIANGLES ? 3 : 1;
        for (var i = 0; i + 2 < len; i += step) {
            var ind0 = indices[i] * 2;
            var ind1 = indices[i + 1] * 2;
            var ind2 = indices[i + 2] * 2;
            points[0] = vertices[ind0];
            points[1] = vertices[ind0 + 1];
            points[2] = vertices[ind1];
            points[3] = vertices[ind1 + 1];
            points[4] = vertices[ind2];
            points[5] = vertices[ind2 + 1];
            if (tempPolygon.contains(tempPoint.x, tempPoint.y)) {
                return true;
            }
        }
        return false;
    };
    Mesh.prototype.destroy = function destroy(options) {
        for (var id in this._glDatas) {
            var data = this._glDatas[id];
            if (data.destroy) {
                data.destroy();
            } else {
                if (data.vertexBuffer) {
                    data.vertexBuffer.destroy();
                    data.vertexBuffer = null;
                }
                if (data.indexBuffer) {
                    data.indexBuffer.destroy();
                    data.indexBuffer = null;
                }
                if (data.uvBuffer) {
                    data.uvBuffer.destroy();
                    data.uvBuffer = null;
                }
                if (data.vao) {
                    data.vao.destroy();
                    data.vao = null;
                }
            }
        }
        this._glDatas = null;
        _core$Container.prototype.destroy.call(this, options);
    };
    _createClass(Mesh, [{
        key: 'texture',
        get: function get() {
            return this._texture;
        },
        set: function set(value) 
        {
            if (this._texture === value) {
                return;
            }
            this._texture = value;
            if (value) {
                if (value.baseTexture.hasLoaded) {
                    this._onTextureUpdate();
                } else {
                    value.once('update', this._onTextureUpdate, this);
                }
            }
        }
    }, {
        key: 'tint',
        get: function get() {
            return core.utils.rgb2hex(this.tintRgb);
        },
        set: function set(value) 
        {
            this.tintRgb = core.utils.hex2rgb(value, this.tintRgb);
        }
    }]);
    return Mesh;
}(core.Container);
exports.default = Mesh;
Mesh.DRAW_MODES = {
    TRIANGLE_MESH: 0,
    TRIANGLES: 1
};
},{"../core":65,"../core/textures/Texture":115}],167:[function(require,module,exports){
'use strict';
exports.__esModule = true;
var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
var _Plane2 = require('./Plane');
var _Plane3 = _interopRequireDefault(_Plane2);
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
var DEFAULT_BORDER_SIZE = 10;
var NineSlicePlane = function (_Plane) {
    _inherits(NineSlicePlane, _Plane);
    function NineSlicePlane(texture, leftWidth, topHeight, rightWidth, bottomHeight) {
        _classCallCheck(this, NineSlicePlane);
        var _this = _possibleConstructorReturn(this, _Plane.call(this, texture, 4, 4));
        _this._origWidth = texture.orig.width;
        _this._origHeight = texture.orig.height;
        _this._width = _this._origWidth;
        _this._height = _this._origHeight;
        _this._leftWidth = typeof leftWidth !== 'undefined' ? leftWidth : DEFAULT_BORDER_SIZE;
        _this._rightWidth = typeof rightWidth !== 'undefined' ? rightWidth : DEFAULT_BORDER_SIZE;
        _this._topHeight = typeof topHeight !== 'undefined' ? topHeight : DEFAULT_BORDER_SIZE;
        _this._bottomHeight = typeof bottomHeight !== 'undefined' ? bottomHeight : DEFAULT_BORDER_SIZE;
        _this.refresh(true);
        return _this;
    }
    NineSlicePlane.prototype.updateHorizontalVertices = function updateHorizontalVertices() {
        var vertices = this.vertices;
        var h = this._topHeight + this._bottomHeight;
        var scale = this._height > h ? 1.0 : this._height / h;
        vertices[9] = vertices[11] = vertices[13] = vertices[15] = this._topHeight * scale;
        vertices[17] = vertices[19] = vertices[21] = vertices[23] = this._height - this._bottomHeight * scale;
        vertices[25] = vertices[27] = vertices[29] = vertices[31] = this._height;
    };
    NineSlicePlane.prototype.updateVerticalVertices = function updateVerticalVertices() {
        var vertices = this.vertices;
        var w = this._leftWidth + this._rightWidth;
        var scale = this._width > w ? 1.0 : this._width / w;
        vertices[2] = vertices[10] = vertices[18] = vertices[26] = this._leftWidth * scale;
        vertices[4] = vertices[12] = vertices[20] = vertices[28] = this._width - this._rightWidth * scale;
        vertices[6] = vertices[14] = vertices[22] = vertices[30] = this._width;
    };
    NineSlicePlane.prototype._renderCanvas = function _renderCanvas(renderer) {
        var context = renderer.context;
        context.globalAlpha = this.worldAlpha;
        renderer.setBlendMode(this.blendMode);
        var transform = this.worldTransform;
        var res = renderer.resolution;
        if (renderer.roundPixels) {
            context.setTransform(transform.a * res, transform.b * res, transform.c * res, transform.d * res, transform.tx * res | 0, transform.ty * res | 0);
        } else {
            context.setTransform(transform.a * res, transform.b * res, transform.c * res, transform.d * res, transform.tx * res, transform.ty * res);
        }
        var base = this._texture.baseTexture;
        var textureSource = base.source;
        var w = base.width * base.resolution;
        var h = base.height * base.resolution;
        this.drawSegment(context, textureSource, w, h, 0, 1, 10, 11);
        this.drawSegment(context, textureSource, w, h, 2, 3, 12, 13);
        this.drawSegment(context, textureSource, w, h, 4, 5, 14, 15);
        this.drawSegment(context, textureSource, w, h, 8, 9, 18, 19);
        this.drawSegment(context, textureSource, w, h, 10, 11, 20, 21);
        this.drawSegment(context, textureSource, w, h, 12, 13, 22, 23);
        this.drawSegment(context, textureSource, w, h, 16, 17, 26, 27);
        this.drawSegment(context, textureSource, w, h, 18, 19, 28, 29);
        this.drawSegment(context, textureSource, w, h, 20, 21, 30, 31);
    };
    NineSlicePlane.prototype.drawSegment = function drawSegment(context, textureSource, w, h, x1, y1, x2, y2) {
        var uvs = this.uvs;
        var vertices = this.vertices;
        var sw = (uvs[x2] - uvs[x1]) * w;
        var sh = (uvs[y2] - uvs[y1]) * h;
        var dw = vertices[x2] - vertices[x1];
        var dh = vertices[y2] - vertices[y1];
        if (sw < 1) {
            sw = 1;
        }
        if (sh < 1) {
            sh = 1;
        }
        if (dw < 1) {
            dw = 1;
        }
        if (dh < 1) {
            dh = 1;
        }
        context.drawImage(textureSource, uvs[x1] * w, uvs[y1] * h, sw, sh, vertices[x1], vertices[y1], dw, dh);
    };
    NineSlicePlane.prototype._refresh = function _refresh() {
        _Plane.prototype._refresh.call(this);
        var uvs = this.uvs;
        var texture = this._texture;
        this._origWidth = texture.orig.width;
        this._origHeight = texture.orig.height;
        var _uvw = 1.0 / this._origWidth;
        var _uvh = 1.0 / this._origHeight;
        uvs[0] = uvs[8] = uvs[16] = uvs[24] = 0;
        uvs[1] = uvs[3] = uvs[5] = uvs[7] = 0;
        uvs[6] = uvs[14] = uvs[22] = uvs[30] = 1;
        uvs[25] = uvs[27] = uvs[29] = uvs[31] = 1;
        uvs[2] = uvs[10] = uvs[18] = uvs[26] = _uvw * this._leftWidth;
        uvs[4] = uvs[12] = uvs[20] = uvs[28] = 1 - _uvw * this._rightWidth;
        uvs[9] = uvs[11] = uvs[13] = uvs[15] = _uvh * this._topHeight;
        uvs[17] = uvs[19] = uvs[21] = uvs[23] = 1 - _uvh * this._bottomHeight;
        this.updateHorizontalVertices();
        this.updateVerticalVertices();
        this.dirty++;
        this.multiplyUvs();
    };
    _createClass(NineSlicePlane, [{
        key: 'width',
        get: function get() {
            return this._width;
        },
        set: function set(value) 
        {
            this._width = value;
            this._refresh();
        }
    }, {
        key: 'height',
        get: function get() {
            return this._height;
        },
        set: function set(value) 
        {
            this._height = value;
            this._refresh();
        }
    }, {
        key: 'leftWidth',
        get: function get() {
            return this._leftWidth;
        },
        set: function set(value) 
        {
            this._leftWidth = value;
            this._refresh();
        }
    }, {
        key: 'rightWidth',
        get: function get() {
            return this._rightWidth;
        },
        set: function set(value) 
        {
            this._rightWidth = value;
            this._refresh();
        }
    }, {
        key: 'topHeight',
        get: function get() {
            return this._topHeight;
        },
        set: function set(value) 
        {
            this._topHeight = value;
            this._refresh();
        }
    }, {
        key: 'bottomHeight',
        get: function get() {
            return this._bottomHeight;
        },
        set: function set(value) 
        {
            this._bottomHeight = value;
            this._refresh();
        }
    }]);
    return NineSlicePlane;
}(_Plane3.default);
exports.default = NineSlicePlane;
},{"./Plane":168}],168:[function(require,module,exports){
'use strict';
exports.__esModule = true;
var _Mesh2 = require('./Mesh');
var _Mesh3 = _interopRequireDefault(_Mesh2);
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
var Plane = function (_Mesh) {
    _inherits(Plane, _Mesh);
    function Plane(texture, verticesX, verticesY) {
        _classCallCheck(this, Plane);
        var _this = _possibleConstructorReturn(this, _Mesh.call(this, texture));
        _this._ready = true;
        _this.verticesX = verticesX || 10;
        _this.verticesY = verticesY || 10;
        _this.drawMode = _Mesh3.default.DRAW_MODES.TRIANGLES;
        _this.refresh();
        return _this;
    }
    Plane.prototype._refresh = function _refresh() {
        var texture = this._texture;
        var total = this.verticesX * this.verticesY;
        var verts = [];
        var colors = [];
        var uvs = [];
        var indices = [];
        var segmentsX = this.verticesX - 1;
        var segmentsY = this.verticesY - 1;
        var sizeX = texture.width / segmentsX;
        var sizeY = texture.height / segmentsY;
        for (var i = 0; i < total; i++) {
            var x = i % this.verticesX;
            var y = i / this.verticesX | 0;
            verts.push(x * sizeX, y * sizeY);
            uvs.push(x / segmentsX, y / segmentsY);
        }
        var totalSub = segmentsX * segmentsY;
        for (var _i = 0; _i < totalSub; _i++) {
            var xpos = _i % segmentsX;
            var ypos = _i / segmentsX | 0;
            var value = ypos * this.verticesX + xpos;
            var value2 = ypos * this.verticesX + xpos + 1;
            var value3 = (ypos + 1) * this.verticesX + xpos;
            var value4 = (ypos + 1) * this.verticesX + xpos + 1;
            indices.push(value, value2, value3);
            indices.push(value2, value4, value3);
        }
        this.vertices = new Float32Array(verts);
        this.uvs = new Float32Array(uvs);
        this.colors = new Float32Array(colors);
        this.indices = new Uint16Array(indices);
        this.dirty++;
        this.indexDirty++;
        this.multiplyUvs();
    };
    Plane.prototype._onTextureUpdate = function _onTextureUpdate() {
        _Mesh3.default.prototype._onTextureUpdate.call(this);
        if (this._ready) {
            this.refresh();
        }
    };
    return Plane;
}(_Mesh3.default);
exports.default = Plane;
},{"./Mesh":166}],169:[function(require,module,exports){
'use strict';
exports.__esModule = true;
var _Mesh2 = require('./Mesh');
var _Mesh3 = _interopRequireDefault(_Mesh2);
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
var Rope = function (_Mesh) {
    _inherits(Rope, _Mesh);
    function Rope(texture, points) {
        _classCallCheck(this, Rope);
        var _this = _possibleConstructorReturn(this, _Mesh.call(this, texture));
        _this.points = points;
        _this.vertices = new Float32Array(points.length * 4);
        _this.uvs = new Float32Array(points.length * 4);
        _this.colors = new Float32Array(points.length * 2);
        _this.indices = new Uint16Array(points.length * 2);
        _this.autoUpdate = true;
        _this.refresh();
        return _this;
    }
    Rope.prototype._refresh = function _refresh() {
        var points = this.points;
        if (points.length < 1 || !this._texture._uvs) {
            return;
        }
        if (this.vertices.length / 4 !== points.length) {
            this.vertices = new Float32Array(points.length * 4);
            this.uvs = new Float32Array(points.length * 4);
            this.colors = new Float32Array(points.length * 2);
            this.indices = new Uint16Array(points.length * 2);
        }
        var uvs = this.uvs;
        var indices = this.indices;
        var colors = this.colors;
        uvs[0] = 0;
        uvs[1] = 0;
        uvs[2] = 0;
        uvs[3] = 1;
        colors[0] = 1;
        colors[1] = 1;
        indices[0] = 0;
        indices[1] = 1;
        var total = points.length;
        for (var i = 1; i < total; i++) {
            var index = i * 4;
            var amount = i / (total - 1);
            uvs[index] = amount;
            uvs[index + 1] = 0;
            uvs[index + 2] = amount;
            uvs[index + 3] = 1;
            index = i * 2;
            colors[index] = 1;
            colors[index + 1] = 1;
            index = i * 2;
            indices[index] = index;
            indices[index + 1] = index + 1;
        }
        this.dirty++;
        this.indexDirty++;
        this.multiplyUvs();
        this.refreshVertices();
    };
    Rope.prototype.refreshVertices = function refreshVertices() {
        var points = this.points;
        if (points.length < 1) {
            return;
        }
        var lastPoint = points[0];
        var nextPoint = void 0;
        var perpX = 0;
        var perpY = 0;
        var vertices = this.vertices;
        var total = points.length;
        for (var i = 0; i < total; i++) {
            var point = points[i];
            var index = i * 4;
            if (i < points.length - 1) {
                nextPoint = points[i + 1];
            } else {
                nextPoint = point;
            }
            perpY = -(nextPoint.x - lastPoint.x);
            perpX = nextPoint.y - lastPoint.y;
            var ratio = (1 - i / (total - 1)) * 10;
            if (ratio > 1) {
                ratio = 1;
            }
            var perpLength = Math.sqrt(perpX * perpX + perpY * perpY);
            var num = this._texture.height / 2; 
            perpX /= perpLength;
            perpY /= perpLength;
            perpX *= num;
            perpY *= num;
            vertices[index] = point.x + perpX;
            vertices[index + 1] = point.y + perpY;
            vertices[index + 2] = point.x - perpX;
            vertices[index + 3] = point.y - perpY;
            lastPoint = point;
        }
    };
    Rope.prototype.updateTransform = function updateTransform() {
        if (this.autoUpdate) {
            this.refreshVertices();
        }
        this.containerUpdateTransform();
    };
    return Rope;
}(_Mesh3.default);
exports.default = Rope;
},{"./Mesh":166}],170:[function(require,module,exports){
'use strict';
exports.__esModule = true;
var _core = require('../../core');
var core = _interopRequireWildcard(_core);
var _Mesh = require('../Mesh');
var _Mesh2 = _interopRequireDefault(_Mesh);
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
var MeshSpriteRenderer = function () {
    function MeshSpriteRenderer(renderer) {
        _classCallCheck(this, MeshSpriteRenderer);
        this.renderer = renderer;
    }
    MeshSpriteRenderer.prototype.render = function render(mesh) {
        var renderer = this.renderer;
        var context = renderer.context;
        var transform = mesh.worldTransform;
        var res = renderer.resolution;
        if (renderer.roundPixels) {
            context.setTransform(transform.a * res, transform.b * res, transform.c * res, transform.d * res, transform.tx * res | 0, transform.ty * res | 0);
        } else {
            context.setTransform(transform.a * res, transform.b * res, transform.c * res, transform.d * res, transform.tx * res, transform.ty * res);
        }
        renderer.context.globalAlpha = mesh.worldAlpha;
        renderer.setBlendMode(mesh.blendMode);
        if (mesh.drawMode === _Mesh2.default.DRAW_MODES.TRIANGLE_MESH) {
            this._renderTriangleMesh(mesh);
        } else {
            this._renderTriangles(mesh);
        }
    };
    MeshSpriteRenderer.prototype._renderTriangleMesh = function _renderTriangleMesh(mesh) {
        var length = mesh.vertices.length / 2;
        for (var i = 0; i < length - 2; i++) {
            var index = i * 2;
            this._renderDrawTriangle(mesh, index, index + 2, index + 4);
        }
    };
    MeshSpriteRenderer.prototype._renderTriangles = function _renderTriangles(mesh) {
        var indices = mesh.indices;
        var length = indices.length;
        for (var i = 0; i < length; i += 3) {
            var index0 = indices[i] * 2;
            var index1 = indices[i + 1] * 2;
            var index2 = indices[i + 2] * 2;
            this._renderDrawTriangle(mesh, index0, index1, index2);
        }
    };
    MeshSpriteRenderer.prototype._renderDrawTriangle = function _renderDrawTriangle(mesh, index0, index1, index2) {
        var context = this.renderer.context;
        var uvs = mesh.uvs;
        var vertices = mesh.vertices;
        var texture = mesh._texture;
        if (!texture.valid) {
            return;
        }
        var base = texture.baseTexture;
        var textureSource = base.source;
        var textureWidth = base.width;
        var textureHeight = base.height;
        var u0 = void 0;
        var u1 = void 0;
        var u2 = void 0;
        var v0 = void 0;
        var v1 = void 0;
        var v2 = void 0;
        if (mesh.uploadUvTransform) {
            var ut = mesh._uvTransform.mapCoord;
            u0 = (uvs[index0] * ut.a + uvs[index0 + 1] * ut.c + ut.tx) * base.width;
            u1 = (uvs[index1] * ut.a + uvs[index1 + 1] * ut.c + ut.tx) * base.width;
            u2 = (uvs[index2] * ut.a + uvs[index2 + 1] * ut.c + ut.tx) * base.width;
            v0 = (uvs[index0] * ut.b + uvs[index0 + 1] * ut.d + ut.ty) * base.height;
            v1 = (uvs[index1] * ut.b + uvs[index1 + 1] * ut.d + ut.ty) * base.height;
            v2 = (uvs[index2] * ut.b + uvs[index2 + 1] * ut.d + ut.ty) * base.height;
        } else {
            u0 = uvs[index0] * base.width;
            u1 = uvs[index1] * base.width;
            u2 = uvs[index2] * base.width;
            v0 = uvs[index0 + 1] * base.height;
            v1 = uvs[index1 + 1] * base.height;
            v2 = uvs[index2 + 1] * base.height;
        }
        var x0 = vertices[index0];
        var x1 = vertices[index1];
        var x2 = vertices[index2];
        var y0 = vertices[index0 + 1];
        var y1 = vertices[index1 + 1];
        var y2 = vertices[index2 + 1];
        var canvasPadding = mesh.canvasPadding / this.renderer.resolution;
        if (canvasPadding > 0) {
            var paddingX = canvasPadding / Math.abs(mesh.worldTransform.a);
            var paddingY = canvasPadding / Math.abs(mesh.worldTransform.d);
            var centerX = (x0 + x1 + x2) / 3;
            var centerY = (y0 + y1 + y2) / 3;
            var normX = x0 - centerX;
            var normY = y0 - centerY;
            var dist = Math.sqrt(normX * normX + normY * normY);
            x0 = centerX + normX / dist * (dist + paddingX);
            y0 = centerY + normY / dist * (dist + paddingY);
            normX = x1 - centerX;
            normY = y1 - centerY;
            dist = Math.sqrt(normX * normX + normY * normY);
            x1 = centerX + normX / dist * (dist + paddingX);
            y1 = centerY + normY / dist * (dist + paddingY);
            normX = x2 - centerX;
            normY = y2 - centerY;
            dist = Math.sqrt(normX * normX + normY * normY);
            x2 = centerX + normX / dist * (dist + paddingX);
            y2 = centerY + normY / dist * (dist + paddingY);
        }
        context.save();
        context.beginPath();
        context.moveTo(x0, y0);
        context.lineTo(x1, y1);
        context.lineTo(x2, y2);
        context.closePath();
        context.clip();
        var delta = u0 * v1 + v0 * u2 + u1 * v2 - v1 * u2 - v0 * u1 - u0 * v2;
        var deltaA = x0 * v1 + v0 * x2 + x1 * v2 - v1 * x2 - v0 * x1 - x0 * v2;
        var deltaB = u0 * x1 + x0 * u2 + u1 * x2 - x1 * u2 - x0 * u1 - u0 * x2;
        var deltaC = u0 * v1 * x2 + v0 * x1 * u2 + x0 * u1 * v2 - x0 * v1 * u2 - v0 * u1 * x2 - u0 * x1 * v2;
        var deltaD = y0 * v1 + v0 * y2 + y1 * v2 - v1 * y2 - v0 * y1 - y0 * v2;
        var deltaE = u0 * y1 + y0 * u2 + u1 * y2 - y1 * u2 - y0 * u1 - u0 * y2;
        var deltaF = u0 * v1 * y2 + v0 * y1 * u2 + y0 * u1 * v2 - y0 * v1 * u2 - v0 * u1 * y2 - u0 * y1 * v2;
        context.transform(deltaA / delta, deltaD / delta, deltaB / delta, deltaE / delta, deltaC / delta, deltaF / delta);
        context.drawImage(textureSource, 0, 0, textureWidth * base.resolution, textureHeight * base.resolution, 0, 0, textureWidth, textureHeight);
        context.restore();
        this.renderer.invalidateBlendMode();
    };
    MeshSpriteRenderer.prototype.renderMeshFlat = function renderMeshFlat(mesh) {
        var context = this.renderer.context;
        var vertices = mesh.vertices;
        var length = vertices.length / 2;
        context.beginPath();
        for (var i = 1; i < length - 2; ++i) {
            var index = i * 2;
            var x0 = vertices[index];
            var y0 = vertices[index + 1];
            var x1 = vertices[index + 2];
            var y1 = vertices[index + 3];
            var x2 = vertices[index + 4];
            var y2 = vertices[index + 5];
            context.moveTo(x0, y0);
            context.lineTo(x1, y1);
            context.lineTo(x2, y2);
        }
        context.fillStyle = '#FF0000';
        context.fill();
        context.closePath();
    };
    MeshSpriteRenderer.prototype.destroy = function destroy() {
        this.renderer = null;
    };
    return MeshSpriteRenderer;
}();
exports.default = MeshSpriteRenderer;
core.CanvasRenderer.registerPlugin('mesh', MeshSpriteRenderer);
},{"../../core":65,"../Mesh":166}],171:[function(require,module,exports){
'use strict';
exports.__esModule = true;
var _Mesh = require('./Mesh');
Object.defineProperty(exports, 'Mesh', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_Mesh).default;
  }
});
var _MeshRenderer = require('./webgl/MeshRenderer');
Object.defineProperty(exports, 'MeshRenderer', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_MeshRenderer).default;
  }
});
var _CanvasMeshRenderer = require('./canvas/CanvasMeshRenderer');
Object.defineProperty(exports, 'CanvasMeshRenderer', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_CanvasMeshRenderer).default;
  }
});
var _Plane = require('./Plane');
Object.defineProperty(exports, 'Plane', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_Plane).default;
  }
});
var _NineSlicePlane = require('./NineSlicePlane');
Object.defineProperty(exports, 'NineSlicePlane', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_NineSlicePlane).default;
  }
});
var _Rope = require('./Rope');
Object.defineProperty(exports, 'Rope', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_Rope).default;
  }
});
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
},{"./Mesh":166,"./NineSlicePlane":167,"./Plane":168,"./Rope":169,"./canvas/CanvasMeshRenderer":170,"./webgl/MeshRenderer":172}],172:[function(require,module,exports){
'use strict';
exports.__esModule = true;
var _core = require('../../core');
var core = _interopRequireWildcard(_core);
var _pixiGlCore = require('pixi-gl-core');
var _pixiGlCore2 = _interopRequireDefault(_pixiGlCore);
var _Mesh = require('../Mesh');
var _Mesh2 = _interopRequireDefault(_Mesh);
var _path = require('path');
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
var matrixIdentity = core.Matrix.IDENTITY;
var MeshRenderer = function (_core$ObjectRenderer) {
    _inherits(MeshRenderer, _core$ObjectRenderer);
    function MeshRenderer(renderer) {
        _classCallCheck(this, MeshRenderer);
        var _this = _possibleConstructorReturn(this, _core$ObjectRenderer.call(this, renderer));
        _this.shader = null;
        return _this;
    }
    MeshRenderer.prototype.onContextChange = function onContextChange() {
        var gl = this.renderer.gl;
        this.shader = new core.Shader(gl, 'attribute vec2 aVertexPosition;\nattribute vec2 aTextureCoord;\n\nuniform mat3 projectionMatrix;\nuniform mat3 translationMatrix;\nuniform mat3 uTransform;\n\nvarying vec2 vTextureCoord;\n\nvoid main(void)\n{\n    gl_Position = vec4((projectionMatrix * translationMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\n\n    vTextureCoord = (uTransform * vec3(aTextureCoord, 1.0)).xy;\n}\n', 'varying vec2 vTextureCoord;\nuniform vec4 uColor;\n\nuniform sampler2D uSampler;\n\nvoid main(void)\n{\n    gl_FragColor = texture2D(uSampler, vTextureCoord) * uColor;\n}\n');
    };
    MeshRenderer.prototype.render = function render(mesh) {
        var renderer = this.renderer;
        var gl = renderer.gl;
        var texture = mesh._texture;
        if (!texture.valid) {
            return;
        }
        var glData = mesh._glDatas[renderer.CONTEXT_UID];
        if (!glData) {
            renderer.bindVao(null);
            glData = {
                shader: this.shader,
                vertexBuffer: _pixiGlCore2.default.GLBuffer.createVertexBuffer(gl, mesh.vertices, gl.STREAM_DRAW),
                uvBuffer: _pixiGlCore2.default.GLBuffer.createVertexBuffer(gl, mesh.uvs, gl.STREAM_DRAW),
                indexBuffer: _pixiGlCore2.default.GLBuffer.createIndexBuffer(gl, mesh.indices, gl.STATIC_DRAW),
                vao: null,
                dirty: mesh.dirty,
                indexDirty: mesh.indexDirty,
                vertexDirty: mesh.vertexDirty
            };
            glData.vao = new _pixiGlCore2.default.VertexArrayObject(gl).addIndex(glData.indexBuffer).addAttribute(glData.vertexBuffer, glData.shader.attributes.aVertexPosition, gl.FLOAT, false, 2 * 4, 0).addAttribute(glData.uvBuffer, glData.shader.attributes.aTextureCoord, gl.FLOAT, false, 2 * 4, 0);
            mesh._glDatas[renderer.CONTEXT_UID] = glData;
        }
        renderer.bindVao(glData.vao);
        if (mesh.dirty !== glData.dirty) {
            glData.dirty = mesh.dirty;
            glData.uvBuffer.upload(mesh.uvs);
        }
        if (mesh.indexDirty !== glData.indexDirty) {
            glData.indexDirty = mesh.indexDirty;
            glData.indexBuffer.upload(mesh.indices);
        }
        if (mesh.vertexDirty !== glData.vertexDirty) {
            glData.vertexDirty = mesh.vertexDirty;
            glData.vertexBuffer.upload(mesh.vertices);
        }
        renderer.bindShader(glData.shader);
        glData.shader.uniforms.uSampler = renderer.bindTexture(texture);
        renderer.state.setBlendMode(core.utils.correctBlendMode(mesh.blendMode, texture.baseTexture.premultipliedAlpha));
        if (glData.shader.uniforms.uTransform) {
            if (mesh.uploadUvTransform) {
                glData.shader.uniforms.uTransform = mesh._uvTransform.mapCoord.toArray(true);
            } else {
                glData.shader.uniforms.uTransform = matrixIdentity.toArray(true);
            }
        }
        glData.shader.uniforms.translationMatrix = mesh.worldTransform.toArray(true);
        glData.shader.uniforms.uColor = core.utils.premultiplyRgba(mesh.tintRgb, mesh.worldAlpha, glData.shader.uniforms.uColor, texture.baseTexture.premultipliedAlpha);
        var drawMode = mesh.drawMode === _Mesh2.default.DRAW_MODES.TRIANGLE_MESH ? gl.TRIANGLE_STRIP : gl.TRIANGLES;
        glData.vao.draw(drawMode, mesh.indices.length, 0);
    };
    return MeshRenderer;
}(core.ObjectRenderer);
exports.default = MeshRenderer;
core.WebGLRenderer.registerPlugin('mesh', MeshRenderer);
},{"../../core":65,"../Mesh":166,"path":8,"pixi-gl-core":15}],173:[function(require,module,exports){
'use strict';
exports.__esModule = true;
var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
var _core = require('../core');
var core = _interopRequireWildcard(_core);
var _utils = require('../core/utils');
function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
var ParticleContainer = function (_core$Container) {
    _inherits(ParticleContainer, _core$Container);
    function ParticleContainer() {
        var maxSize = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1500;
        var properties = arguments[1];
        var batchSize = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 16384;
        var autoResize = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
        _classCallCheck(this, ParticleContainer);
        var _this = _possibleConstructorReturn(this, _core$Container.call(this));
        var maxBatchSize = 16384;
        if (batchSize > maxBatchSize) {
            batchSize = maxBatchSize;
        }
        if (batchSize > maxSize) {
            batchSize = maxSize;
        }
        _this._properties = [false, true, false, false, false];
        _this._maxSize = maxSize;
        _this._batchSize = batchSize;
        _this._glBuffers = {};
        _this._bufferUpdateIDs = [];
        _this._updateID = 0;
        _this.interactiveChildren = false;
        _this.blendMode = core.BLEND_MODES.NORMAL;
        _this.autoResize = autoResize;
        _this.roundPixels = true;
        _this.baseTexture = null;
        _this.setProperties(properties);
        _this._tint = 0;
        _this.tintRgb = new Float32Array(4);
        _this.tint = 0xFFFFFF;
        return _this;
    }
    ParticleContainer.prototype.setProperties = function setProperties(properties) {
        if (properties) {
            this._properties[0] = 'vertices' in properties || 'scale' in properties ? !!properties.vertices || !!properties.scale : this._properties[0];
            this._properties[1] = 'position' in properties ? !!properties.position : this._properties[1];
            this._properties[2] = 'rotation' in properties ? !!properties.rotation : this._properties[2];
            this._properties[3] = 'uvs' in properties ? !!properties.uvs : this._properties[3];
            this._properties[4] = 'tint' in properties || 'alpha' in properties ? !!properties.tint || !!properties.alpha : this._properties[4];
        }
    };
    ParticleContainer.prototype.updateTransform = function updateTransform() {
        this.displayObjectUpdateTransform();
    };
    ParticleContainer.prototype.renderWebGL = function renderWebGL(renderer) {
        var _this2 = this;
        if (!this.visible || this.worldAlpha <= 0 || !this.children.length || !this.renderable) {
            return;
        }
        if (!this.baseTexture) {
            this.baseTexture = this.children[0]._texture.baseTexture;
            if (!this.baseTexture.hasLoaded) {
                this.baseTexture.once('update', function () {
                    return _this2.onChildrenChange(0);
                });
            }
        }
        renderer.setObjectRenderer(renderer.plugins.particle);
        renderer.plugins.particle.render(this);
    };
    ParticleContainer.prototype.onChildrenChange = function onChildrenChange(smallestChildIndex) {
        var bufferIndex = Math.floor(smallestChildIndex / this._batchSize);
        while (this._bufferUpdateIDs.length < bufferIndex) {
            this._bufferUpdateIDs.push(0);
        }
        this._bufferUpdateIDs[bufferIndex] = ++this._updateID;
    };
    ParticleContainer.prototype.renderCanvas = function renderCanvas(renderer) {
        if (!this.visible || this.worldAlpha <= 0 || !this.children.length || !this.renderable) {
            return;
        }
        var context = renderer.context;
        var transform = this.worldTransform;
        var isRotated = true;
        var positionX = 0;
        var positionY = 0;
        var finalWidth = 0;
        var finalHeight = 0;
        renderer.setBlendMode(this.blendMode);
        context.globalAlpha = this.worldAlpha;
        this.displayObjectUpdateTransform();
        for (var i = 0; i < this.children.length; ++i) {
            var child = this.children[i];
            if (!child.visible) {
                continue;
            }
            var frame = child._texture.frame;
            context.globalAlpha = this.worldAlpha * child.alpha;
            if (child.rotation % (Math.PI * 2) === 0) {
                if (isRotated) {
                    context.setTransform(transform.a, transform.b, transform.c, transform.d, transform.tx * renderer.resolution, transform.ty * renderer.resolution);
                    isRotated = false;
                }
                positionX = child.anchor.x * (-frame.width * child.scale.x) + child.position.x + 0.5;
                positionY = child.anchor.y * (-frame.height * child.scale.y) + child.position.y + 0.5;
                finalWidth = frame.width * child.scale.x;
                finalHeight = frame.height * child.scale.y;
            } else {
                if (!isRotated) {
                    isRotated = true;
                }
                child.displayObjectUpdateTransform();
                var childTransform = child.worldTransform;
                if (renderer.roundPixels) {
                    context.setTransform(childTransform.a, childTransform.b, childTransform.c, childTransform.d, childTransform.tx * renderer.resolution | 0, childTransform.ty * renderer.resolution | 0);
                } else {
                    context.setTransform(childTransform.a, childTransform.b, childTransform.c, childTransform.d, childTransform.tx * renderer.resolution, childTransform.ty * renderer.resolution);
                }
                positionX = child.anchor.x * -frame.width + 0.5;
                positionY = child.anchor.y * -frame.height + 0.5;
                finalWidth = frame.width;
                finalHeight = frame.height;
            }
            var resolution = child._texture.baseTexture.resolution;
            context.drawImage(child._texture.baseTexture.source, frame.x * resolution, frame.y * resolution, frame.width * resolution, frame.height * resolution, positionX * renderer.resolution, positionY * renderer.resolution, finalWidth * renderer.resolution, finalHeight * renderer.resolution);
        }
    };
    ParticleContainer.prototype.destroy = function destroy(options) {
        _core$Container.prototype.destroy.call(this, options);
        if (this._buffers) {
            for (var i = 0; i < this._buffers.length; ++i) {
                this._buffers[i].destroy();
            }
        }
        this._properties = null;
        this._buffers = null;
        this._bufferUpdateIDs = null;
    };
    _createClass(ParticleContainer, [{
        key: 'tint',
        get: function get() {
            return this._tint;
        },
        set: function set(value) 
        {
            this._tint = value;
            (0, _utils.hex2rgb)(value, this.tintRgb);
        }
    }]);
    return ParticleContainer;
}(core.Container);
exports.default = ParticleContainer;
},{"../core":65,"../core/utils":125}],174:[function(require,module,exports){
'use strict';
exports.__esModule = true;
var _ParticleContainer = require('./ParticleContainer');
Object.defineProperty(exports, 'ParticleContainer', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_ParticleContainer).default;
  }
});
var _ParticleRenderer = require('./webgl/ParticleRenderer');
Object.defineProperty(exports, 'ParticleRenderer', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_ParticleRenderer).default;
  }
});
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
},{"./ParticleContainer":173,"./webgl/ParticleRenderer":176}],175:[function(require,module,exports){
'use strict';
exports.__esModule = true;
var _pixiGlCore = require('pixi-gl-core');
var _pixiGlCore2 = _interopRequireDefault(_pixiGlCore);
var _createIndicesForQuads = require('../../core/utils/createIndicesForQuads');
var _createIndicesForQuads2 = _interopRequireDefault(_createIndicesForQuads);
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
var ParticleBuffer = function () {
    function ParticleBuffer(gl, properties, dynamicPropertyFlags, size) {
        _classCallCheck(this, ParticleBuffer);
        this.gl = gl;
        this.size = size;
        this.dynamicProperties = [];
        this.staticProperties = [];
        for (var i = 0; i < properties.length; ++i) {
            var property = properties[i];
            property = {
                attribute: property.attribute,
                size: property.size,
                uploadFunction: property.uploadFunction,
                unsignedByte: property.unsignedByte,
                offset: property.offset
            };
            if (dynamicPropertyFlags[i]) {
                this.dynamicProperties.push(property);
            } else {
                this.staticProperties.push(property);
            }
        }
        this.staticStride = 0;
        this.staticBuffer = null;
        this.staticData = null;
        this.staticDataUint32 = null;
        this.dynamicStride = 0;
        this.dynamicBuffer = null;
        this.dynamicData = null;
        this.dynamicDataUint32 = null;
        this._updateID = 0;
        this.initBuffers();
    }
    ParticleBuffer.prototype.initBuffers = function initBuffers() {
        var gl = this.gl;
        var dynamicOffset = 0;
        this.indices = (0, _createIndicesForQuads2.default)(this.size);
        this.indexBuffer = _pixiGlCore2.default.GLBuffer.createIndexBuffer(gl, this.indices, gl.STATIC_DRAW);
        this.dynamicStride = 0;
        for (var i = 0; i < this.dynamicProperties.length; ++i) {
            var property = this.dynamicProperties[i];
            property.offset = dynamicOffset;
            dynamicOffset += property.size;
            this.dynamicStride += property.size;
        }
        var dynBuffer = new ArrayBuffer(this.size * this.dynamicStride * 4 * 4);
        this.dynamicData = new Float32Array(dynBuffer);
        this.dynamicDataUint32 = new Uint32Array(dynBuffer);
        this.dynamicBuffer = _pixiGlCore2.default.GLBuffer.createVertexBuffer(gl, dynBuffer, gl.STREAM_DRAW);
        var staticOffset = 0;
        this.staticStride = 0;
        for (var _i = 0; _i < this.staticProperties.length; ++_i) {
            var _property = this.staticProperties[_i];
            _property.offset = staticOffset;
            staticOffset += _property.size;
            this.staticStride += _property.size;
        }
        var statBuffer = new ArrayBuffer(this.size * this.staticStride * 4 * 4);
        this.staticData = new Float32Array(statBuffer);
        this.staticDataUint32 = new Uint32Array(statBuffer);
        this.staticBuffer = _pixiGlCore2.default.GLBuffer.createVertexBuffer(gl, statBuffer, gl.STATIC_DRAW);
        this.vao = new _pixiGlCore2.default.VertexArrayObject(gl).addIndex(this.indexBuffer);
        for (var _i2 = 0; _i2 < this.dynamicProperties.length; ++_i2) {
            var _property2 = this.dynamicProperties[_i2];
            if (_property2.unsignedByte) {
                this.vao.addAttribute(this.dynamicBuffer, _property2.attribute, gl.UNSIGNED_BYTE, true, this.dynamicStride * 4, _property2.offset * 4);
            } else {
                this.vao.addAttribute(this.dynamicBuffer, _property2.attribute, gl.FLOAT, false, this.dynamicStride * 4, _property2.offset * 4);
            }
        }
        for (var _i3 = 0; _i3 < this.staticProperties.length; ++_i3) {
            var _property3 = this.staticProperties[_i3];
            if (_property3.unsignedByte) {
                this.vao.addAttribute(this.staticBuffer, _property3.attribute, gl.UNSIGNED_BYTE, true, this.staticStride * 4, _property3.offset * 4);
            } else {
                this.vao.addAttribute(this.staticBuffer, _property3.attribute, gl.FLOAT, false, this.staticStride * 4, _property3.offset * 4);
            }
        }
    };
    ParticleBuffer.prototype.uploadDynamic = function uploadDynamic(children, startIndex, amount) {
        for (var i = 0; i < this.dynamicProperties.length; i++) {
            var property = this.dynamicProperties[i];
            property.uploadFunction(children, startIndex, amount, property.unsignedByte ? this.dynamicDataUint32 : this.dynamicData, this.dynamicStride, property.offset);
        }
        this.dynamicBuffer.upload();
    };
    ParticleBuffer.prototype.uploadStatic = function uploadStatic(children, startIndex, amount) {
        for (var i = 0; i < this.staticProperties.length; i++) {
            var property = this.staticProperties[i];
            property.uploadFunction(children, startIndex, amount, property.unsignedByte ? this.staticDataUint32 : this.staticData, this.staticStride, property.offset);
        }
        this.staticBuffer.upload();
    };
    ParticleBuffer.prototype.destroy = function destroy() {
        this.dynamicProperties = null;
        this.dynamicBuffer.destroy();
        this.dynamicBuffer = null;
        this.dynamicData = null;
        this.dynamicDataUint32 = null;
        this.staticProperties = null;
        this.staticBuffer.destroy();
        this.staticBuffer = null;
        this.staticData = null;
        this.staticDataUint32 = null;
    };
    return ParticleBuffer;
}();
exports.default = ParticleBuffer;
},{"../../core/utils/createIndicesForQuads":123,"pixi-gl-core":15}],176:[function(require,module,exports){
'use strict';
exports.__esModule = true;
var _core = require('../../core');
var core = _interopRequireWildcard(_core);
var _ParticleShader = require('./ParticleShader');
var _ParticleShader2 = _interopRequireDefault(_ParticleShader);
var _ParticleBuffer = require('./ParticleBuffer');
var _ParticleBuffer2 = _interopRequireDefault(_ParticleBuffer);
var _utils = require('../../core/utils');
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
var ParticleRenderer = function (_core$ObjectRenderer) {
    _inherits(ParticleRenderer, _core$ObjectRenderer);
    function ParticleRenderer(renderer) {
        _classCallCheck(this, ParticleRenderer);
        var _this = _possibleConstructorReturn(this, _core$ObjectRenderer.call(this, renderer));
        _this.shader = null;
        _this.indexBuffer = null;
        _this.properties = null;
        _this.tempMatrix = new core.Matrix();
        _this.CONTEXT_UID = 0;
        return _this;
    }
    ParticleRenderer.prototype.onContextChange = function onContextChange() {
        var gl = this.renderer.gl;
        this.CONTEXT_UID = this.renderer.CONTEXT_UID;
        this.shader = new _ParticleShader2.default(gl);
        this.properties = [
        {
            attribute: this.shader.attributes.aVertexPosition,
            size: 2,
            uploadFunction: this.uploadVertices,
            offset: 0
        },
        {
            attribute: this.shader.attributes.aPositionCoord,
            size: 2,
            uploadFunction: this.uploadPosition,
            offset: 0
        },
        {
            attribute: this.shader.attributes.aRotation,
            size: 1,
            uploadFunction: this.uploadRotation,
            offset: 0
        },
        {
            attribute: this.shader.attributes.aTextureCoord,
            size: 2,
            uploadFunction: this.uploadUvs,
            offset: 0
        },
        {
            attribute: this.shader.attributes.aColor,
            size: 1,
            unsignedByte: true,
            uploadFunction: this.uploadTint,
            offset: 0
        }];
    };
    ParticleRenderer.prototype.start = function start() {
        this.renderer.bindShader(this.shader);
    };
    ParticleRenderer.prototype.render = function render(container) {
        var children = container.children;
        var maxSize = container._maxSize;
        var batchSize = container._batchSize;
        var renderer = this.renderer;
        var totalChildren = children.length;
        if (totalChildren === 0) {
            return;
        } else if (totalChildren > maxSize) {
            totalChildren = maxSize;
        }
        var buffers = container._glBuffers[renderer.CONTEXT_UID];
        if (!buffers) {
            buffers = container._glBuffers[renderer.CONTEXT_UID] = this.generateBuffers(container);
        }
        var baseTexture = children[0]._texture.baseTexture;
        this.renderer.setBlendMode(core.utils.correctBlendMode(container.blendMode, baseTexture.premultipliedAlpha));
        var gl = renderer.gl;
        var m = container.worldTransform.copy(this.tempMatrix);
        m.prepend(renderer._activeRenderTarget.projectionMatrix);
        this.shader.uniforms.projectionMatrix = m.toArray(true);
        this.shader.uniforms.uColor = core.utils.premultiplyRgba(container.tintRgb, container.worldAlpha, this.shader.uniforms.uColor, baseTexture.premultipliedAlpha);
        this.shader.uniforms.uSampler = renderer.bindTexture(baseTexture);
        var updateStatic = false;
        for (var i = 0, j = 0; i < totalChildren; i += batchSize, j += 1) {
            var amount = totalChildren - i;
            if (amount > batchSize) {
                amount = batchSize;
            }
            if (j >= buffers.length) {
                if (!container.autoResize) {
                    break;
                }
                buffers.push(this._generateOneMoreBuffer(container));
            }
            var buffer = buffers[j];
            buffer.uploadDynamic(children, i, amount);
            var bid = container._bufferUpdateIDs[j] || 0;
            updateStatic = updateStatic || buffer._updateID < bid;
            if (updateStatic) {
                buffer._updateID = container._updateID;
                buffer.uploadStatic(children, i, amount);
            }
            renderer.bindVao(buffer.vao);
            buffer.vao.draw(gl.TRIANGLES, amount * 6);
        }
    };
    ParticleRenderer.prototype.generateBuffers = function generateBuffers(container) {
        var gl = this.renderer.gl;
        var buffers = [];
        var size = container._maxSize;
        var batchSize = container._batchSize;
        var dynamicPropertyFlags = container._properties;
        for (var i = 0; i < size; i += batchSize) {
            buffers.push(new _ParticleBuffer2.default(gl, this.properties, dynamicPropertyFlags, batchSize));
        }
        return buffers;
    };
    ParticleRenderer.prototype._generateOneMoreBuffer = function _generateOneMoreBuffer(container) {
        var gl = this.renderer.gl;
        var batchSize = container._batchSize;
        var dynamicPropertyFlags = container._properties;
        return new _ParticleBuffer2.default(gl, this.properties, dynamicPropertyFlags, batchSize);
    };
    ParticleRenderer.prototype.uploadVertices = function uploadVertices(children, startIndex, amount, array, stride, offset) {
        var w0 = 0;
        var w1 = 0;
        var h0 = 0;
        var h1 = 0;
        for (var i = 0; i < amount; ++i) {
            var sprite = children[startIndex + i];
            var texture = sprite._texture;
            var sx = sprite.scale.x;
            var sy = sprite.scale.y;
            var trim = texture.trim;
            var orig = texture.orig;
            if (trim) {
                w1 = trim.x - sprite.anchor.x * orig.width;
                w0 = w1 + trim.width;
                h1 = trim.y - sprite.anchor.y * orig.height;
                h0 = h1 + trim.height;
            } else {
                w0 = orig.width * (1 - sprite.anchor.x);
                w1 = orig.width * -sprite.anchor.x;
                h0 = orig.height * (1 - sprite.anchor.y);
                h1 = orig.height * -sprite.anchor.y;
            }
            array[offset] = w1 * sx;
            array[offset + 1] = h1 * sy;
            array[offset + stride] = w0 * sx;
            array[offset + stride + 1] = h1 * sy;
            array[offset + stride * 2] = w0 * sx;
            array[offset + stride * 2 + 1] = h0 * sy;
            array[offset + stride * 3] = w1 * sx;
            array[offset + stride * 3 + 1] = h0 * sy;
            offset += stride * 4;
        }
    };
    ParticleRenderer.prototype.uploadPosition = function uploadPosition(children, startIndex, amount, array, stride, offset) {
        for (var i = 0; i < amount; i++) {
            var spritePosition = children[startIndex + i].position;
            array[offset] = spritePosition.x;
            array[offset + 1] = spritePosition.y;
            array[offset + stride] = spritePosition.x;
            array[offset + stride + 1] = spritePosition.y;
            array[offset + stride * 2] = spritePosition.x;
            array[offset + stride * 2 + 1] = spritePosition.y;
            array[offset + stride * 3] = spritePosition.x;
            array[offset + stride * 3 + 1] = spritePosition.y;
            offset += stride * 4;
        }
    };
    ParticleRenderer.prototype.uploadRotation = function uploadRotation(children, startIndex, amount, array, stride, offset) {
        for (var i = 0; i < amount; i++) {
            var spriteRotation = children[startIndex + i].rotation;
            array[offset] = spriteRotation;
            array[offset + stride] = spriteRotation;
            array[offset + stride * 2] = spriteRotation;
            array[offset + stride * 3] = spriteRotation;
            offset += stride * 4;
        }
    };
    ParticleRenderer.prototype.uploadUvs = function uploadUvs(children, startIndex, amount, array, stride, offset) {
        for (var i = 0; i < amount; ++i) {
            var textureUvs = children[startIndex + i]._texture._uvs;
            if (textureUvs) {
                array[offset] = textureUvs.x0;
                array[offset + 1] = textureUvs.y0;
                array[offset + stride] = textureUvs.x1;
                array[offset + stride + 1] = textureUvs.y1;
                array[offset + stride * 2] = textureUvs.x2;
                array[offset + stride * 2 + 1] = textureUvs.y2;
                array[offset + stride * 3] = textureUvs.x3;
                array[offset + stride * 3 + 1] = textureUvs.y3;
                offset += stride * 4;
            } else {
                array[offset] = 0;
                array[offset + 1] = 0;
                array[offset + stride] = 0;
                array[offset + stride + 1] = 0;
                array[offset + stride * 2] = 0;
                array[offset + stride * 2 + 1] = 0;
                array[offset + stride * 3] = 0;
                array[offset + stride * 3 + 1] = 0;
                offset += stride * 4;
            }
        }
    };
    ParticleRenderer.prototype.uploadTint = function uploadTint(children, startIndex, amount, array, stride, offset) {
        for (var i = 0; i < amount; ++i) {
            var sprite = children[startIndex + i];
            var premultiplied = sprite._texture.baseTexture.premultipliedAlpha;
            var alpha = sprite.alpha;
            var argb = alpha < 1.0 && premultiplied ? (0, _utils.premultiplyTint)(sprite._tintRGB, alpha) : sprite._tintRGB + (alpha * 255 << 24);
            array[offset] = argb;
            array[offset + stride] = argb;
            array[offset + stride * 2] = argb;
            array[offset + stride * 3] = argb;
            offset += stride * 4;
        }
    };
    ParticleRenderer.prototype.destroy = function destroy() {
        if (this.renderer.gl) {
            this.renderer.gl.deleteBuffer(this.indexBuffer);
        }
        _core$ObjectRenderer.prototype.destroy.call(this);
        this.shader.destroy();
        this.indices = null;
        this.tempMatrix = null;
    };
    return ParticleRenderer;
}(core.ObjectRenderer);
exports.default = ParticleRenderer;
core.WebGLRenderer.registerPlugin('particle', ParticleRenderer);
},{"../../core":65,"../../core/utils":125,"./ParticleBuffer":175,"./ParticleShader":177}],177:[function(require,module,exports){
'use strict';
exports.__esModule = true;
var _Shader2 = require('../../core/Shader');
var _Shader3 = _interopRequireDefault(_Shader2);
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
var ParticleShader = function (_Shader) {
    _inherits(ParticleShader, _Shader);
    function ParticleShader(gl) {
        _classCallCheck(this, ParticleShader);
        return _possibleConstructorReturn(this, _Shader.call(this, gl,
        ['attribute vec2 aVertexPosition;', 'attribute vec2 aTextureCoord;', 'attribute vec4 aColor;', 'attribute vec2 aPositionCoord;', 'attribute float aRotation;', 'uniform mat3 projectionMatrix;', 'uniform vec4 uColor;', 'varying vec2 vTextureCoord;', 'varying vec4 vColor;', 'void main(void){', '   float x = (aVertexPosition.x) * cos(aRotation) - (aVertexPosition.y) * sin(aRotation);', '   float y = (aVertexPosition.x) * sin(aRotation) + (aVertexPosition.y) * cos(aRotation);', '   vec2 v = vec2(x, y);', '   v = v + aPositionCoord;', '   gl_Position = vec4((projectionMatrix * vec3(v, 1.0)).xy, 0.0, 1.0);', '   vTextureCoord = aTextureCoord;', '   vColor = aColor * uColor;', '}'].join('\n'),
        ['varying vec2 vTextureCoord;', 'varying vec4 vColor;', 'uniform sampler2D uSampler;', 'void main(void){', '  vec4 color = texture2D(uSampler, vTextureCoord) * vColor;', '  gl_FragColor = color;', '}'].join('\n')));
    }
    return ParticleShader;
}(_Shader3.default);
exports.default = ParticleShader;
},{"../../core/Shader":44}],178:[function(require,module,exports){
"use strict";
if (!Math.sign) {
    Math.sign = function mathSign(x) {
        x = Number(x);
        if (x === 0 || isNaN(x)) {
            return x;
        }
        return x > 0 ? 1 : -1;
    };
}
},{}],179:[function(require,module,exports){
'use strict';
if (!Number.isInteger) {
    Number.isInteger = function numberIsInteger(value) {
        return typeof value === 'number' && isFinite(value) && Math.floor(value) === value;
    };
}
},{}],180:[function(require,module,exports){
'use strict';
var _objectAssign = require('object-assign');
var _objectAssign2 = _interopRequireDefault(_objectAssign);
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
if (!Object.assign) {
    Object.assign = _objectAssign2.default;
} 
},{"object-assign":6}],181:[function(require,module,exports){
'use strict';
require('./Object.assign');
require('./requestAnimationFrame');
require('./Math.sign');
require('./Number.isInteger');
if (!window.ArrayBuffer) {
    window.ArrayBuffer = Array;
}
if (!window.Float32Array) {
    window.Float32Array = Array;
}
if (!window.Uint32Array) {
    window.Uint32Array = Array;
}
if (!window.Uint16Array) {
    window.Uint16Array = Array;
}
},{"./Math.sign":178,"./Number.isInteger":179,"./Object.assign":180,"./requestAnimationFrame":182}],182:[function(require,module,exports){
(function (global){
'use strict';
var ONE_FRAME_TIME = 16;
if (!(Date.now && Date.prototype.getTime)) {
    Date.now = function now() {
        return new Date().getTime();
    };
}
if (!(global.performance && global.performance.now)) {
    var startTime = Date.now();
    if (!global.performance) {
        global.performance = {};
    }
    global.performance.now = function () {
        return Date.now() - startTime;
    };
}
var lastTime = Date.now();
var vendors = ['ms', 'moz', 'webkit', 'o'];
for (var x = 0; x < vendors.length && !global.requestAnimationFrame; ++x) {
    var p = vendors[x];
    global.requestAnimationFrame = global[p + 'RequestAnimationFrame'];
    global.cancelAnimationFrame = global[p + 'CancelAnimationFrame'] || global[p + 'CancelRequestAnimationFrame'];
}
if (!global.requestAnimationFrame) {
    global.requestAnimationFrame = function (callback) {
        if (typeof callback !== 'function') {
            throw new TypeError(callback + 'is not a function');
        }
        var currentTime = Date.now();
        var delay = ONE_FRAME_TIME + lastTime - currentTime;
        if (delay < 0) {
            delay = 0;
        }
        lastTime = currentTime;
        return setTimeout(function () {
            lastTime = Date.now();
            callback(performance.now());
        }, delay);
    };
}
if (!global.cancelAnimationFrame) {
    global.cancelAnimationFrame = function (id) {
        return clearTimeout(id);
    };
}
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],183:[function(require,module,exports){
'use strict';
exports.__esModule = true;
var _core = require('../core');
var core = _interopRequireWildcard(_core);
var _CountLimiter = require('./limiters/CountLimiter');
var _CountLimiter2 = _interopRequireDefault(_CountLimiter);
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
var SharedTicker = core.ticker.shared;
core.settings.UPLOADS_PER_FRAME = 4;
var BasePrepare = function () {
    function BasePrepare(renderer) {
        var _this = this;
        _classCallCheck(this, BasePrepare);
        this.limiter = new _CountLimiter2.default(core.settings.UPLOADS_PER_FRAME);
        this.renderer = renderer;
        this.uploadHookHelper = null;
        this.queue = [];
        this.addHooks = [];
        this.uploadHooks = [];
        this.completes = [];
        this.ticking = false;
        this.delayedTick = function () {
            if (!_this.queue) {
                return;
            }
            _this.prepareItems();
        };
        this.registerFindHook(findText);
        this.registerFindHook(findTextStyle);
        this.registerFindHook(findMultipleBaseTextures);
        this.registerFindHook(findBaseTexture);
        this.registerFindHook(findTexture);
        this.registerUploadHook(drawText);
        this.registerUploadHook(calculateTextStyle);
    }
    BasePrepare.prototype.upload = function upload(item, done) {
        if (typeof item === 'function') {
            done = item;
            item = null;
        }
        if (item) {
            this.add(item);
        }
        if (this.queue.length) {
            if (done) {
                this.completes.push(done);
            }
            if (!this.ticking) {
                this.ticking = true;
                SharedTicker.addOnce(this.tick, this, core.UPDATE_PRIORITY.UTILITY);
            }
        } else if (done) {
            done();
        }
    };
    BasePrepare.prototype.tick = function tick() {
        setTimeout(this.delayedTick, 0);
    };
    BasePrepare.prototype.prepareItems = function prepareItems() {
        this.limiter.beginFrame();
        while (this.queue.length && this.limiter.allowedToUpload()) {
            var item = this.queue[0];
            var uploaded = false;
            if (item && !item._destroyed) {
                for (var i = 0, len = this.uploadHooks.length; i < len; i++) {
                    if (this.uploadHooks[i](this.uploadHookHelper, item)) {
                        this.queue.shift();
                        uploaded = true;
                        break;
                    }
                }
            }
            if (!uploaded) {
                this.queue.shift();
            }
        }
        if (!this.queue.length) {
            this.ticking = false;
            var completes = this.completes.slice(0);
            this.completes.length = 0;
            for (var _i = 0, _len = completes.length; _i < _len; _i++) {
                completes[_i]();
            }
        } else {
            SharedTicker.addOnce(this.tick, this, core.UPDATE_PRIORITY.UTILITY);
        }
    };
    BasePrepare.prototype.registerFindHook = function registerFindHook(addHook) {
        if (addHook) {
            this.addHooks.push(addHook);
        }
        return this;
    };
    BasePrepare.prototype.registerUploadHook = function registerUploadHook(uploadHook) {
        if (uploadHook) {
            this.uploadHooks.push(uploadHook);
        }
        return this;
    };
    BasePrepare.prototype.add = function add(item) {
        for (var i = 0, len = this.addHooks.length; i < len; i++) {
            if (this.addHooks[i](item, this.queue)) {
                break;
            }
        }
        if (item instanceof core.Container) {
            for (var _i2 = item.children.length - 1; _i2 >= 0; _i2--) {
                this.add(item.children[_i2]);
            }
        }
        return this;
    };
    BasePrepare.prototype.destroy = function destroy() {
        if (this.ticking) {
            SharedTicker.remove(this.tick, this);
        }
        this.ticking = false;
        this.addHooks = null;
        this.uploadHooks = null;
        this.renderer = null;
        this.completes = null;
        this.queue = null;
        this.limiter = null;
        this.uploadHookHelper = null;
    };
    return BasePrepare;
}();
exports.default = BasePrepare;
function findMultipleBaseTextures(item, queue) {
    var result = false;
    if (item && item._textures && item._textures.length) {
        for (var i = 0; i < item._textures.length; i++) {
            if (item._textures[i] instanceof core.Texture) {
                var baseTexture = item._textures[i].baseTexture;
                if (queue.indexOf(baseTexture) === -1) {
                    queue.push(baseTexture);
                    result = true;
                }
            }
        }
    }
    return result;
}
function findBaseTexture(item, queue) {
    if (item instanceof core.BaseTexture) {
        if (queue.indexOf(item) === -1) {
            queue.push(item);
        }
        return true;
    }
    return false;
}
function findTexture(item, queue) {
    if (item._texture && item._texture instanceof core.Texture) {
        var texture = item._texture.baseTexture;
        if (queue.indexOf(texture) === -1) {
            queue.push(texture);
        }
        return true;
    }
    return false;
}
function drawText(helper, item) {
    if (item instanceof core.Text) {
        item.updateText(true);
        return true;
    }
    return false;
}
function calculateTextStyle(helper, item) {
    if (item instanceof core.TextStyle) {
        var font = item.toFontString();
        core.TextMetrics.measureFont(font);
        return true;
    }
    return false;
}
function findText(item, queue) {
    if (item instanceof core.Text) {
        if (queue.indexOf(item.style) === -1) {
            queue.push(item.style);
        }
        if (queue.indexOf(item) === -1) {
            queue.push(item);
        }
        var texture = item._texture.baseTexture;
        if (queue.indexOf(texture) === -1) {
            queue.push(texture);
        }
        return true;
    }
    return false;
}
function findTextStyle(item, queue) {
    if (item instanceof core.TextStyle) {
        if (queue.indexOf(item) === -1) {
            queue.push(item);
        }
        return true;
    }
    return false;
}
},{"../core":65,"./limiters/CountLimiter":186}],184:[function(require,module,exports){
'use strict';
exports.__esModule = true;
var _core = require('../../core');
var core = _interopRequireWildcard(_core);
var _BasePrepare2 = require('../BasePrepare');
var _BasePrepare3 = _interopRequireDefault(_BasePrepare2);
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
var CANVAS_START_SIZE = 16;
var CanvasPrepare = function (_BasePrepare) {
    _inherits(CanvasPrepare, _BasePrepare);
    function CanvasPrepare(renderer) {
        _classCallCheck(this, CanvasPrepare);
        var _this = _possibleConstructorReturn(this, _BasePrepare.call(this, renderer));
        _this.uploadHookHelper = _this;
        _this.canvas = document.createElement('canvas');
        _this.canvas.width = CANVAS_START_SIZE;
        _this.canvas.height = CANVAS_START_SIZE;
        _this.ctx = _this.canvas.getContext('2d');
        _this.registerUploadHook(uploadBaseTextures);
        return _this;
    }
    CanvasPrepare.prototype.destroy = function destroy() {
        _BasePrepare.prototype.destroy.call(this);
        this.ctx = null;
        this.canvas = null;
    };
    return CanvasPrepare;
}(_BasePrepare3.default);
exports.default = CanvasPrepare;
function uploadBaseTextures(prepare, item) {
    if (item instanceof core.BaseTexture) {
        var image = item.source;
        var imageWidth = image.width === 0 ? prepare.canvas.width : Math.min(prepare.canvas.width, image.width);
        var imageHeight = image.height === 0 ? prepare.canvas.height : Math.min(prepare.canvas.height, image.height);
        prepare.ctx.drawImage(image, 0, 0, imageWidth, imageHeight, 0, 0, prepare.canvas.width, prepare.canvas.height);
        return true;
    }
    return false;
}
core.CanvasRenderer.registerPlugin('prepare', CanvasPrepare);
},{"../../core":65,"../BasePrepare":183}],185:[function(require,module,exports){
'use strict';
exports.__esModule = true;
var _WebGLPrepare = require('./webgl/WebGLPrepare');
Object.defineProperty(exports, 'webgl', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_WebGLPrepare).default;
  }
});
var _CanvasPrepare = require('./canvas/CanvasPrepare');
Object.defineProperty(exports, 'canvas', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_CanvasPrepare).default;
  }
});
var _BasePrepare = require('./BasePrepare');
Object.defineProperty(exports, 'BasePrepare', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_BasePrepare).default;
  }
});
var _CountLimiter = require('./limiters/CountLimiter');
Object.defineProperty(exports, 'CountLimiter', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_CountLimiter).default;
  }
});
var _TimeLimiter = require('./limiters/TimeLimiter');
Object.defineProperty(exports, 'TimeLimiter', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_TimeLimiter).default;
  }
});
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
},{"./BasePrepare":183,"./canvas/CanvasPrepare":184,"./limiters/CountLimiter":186,"./limiters/TimeLimiter":187,"./webgl/WebGLPrepare":188}],186:[function(require,module,exports){
"use strict";
exports.__esModule = true;
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
var CountLimiter = function () {
  function CountLimiter(maxItemsPerFrame) {
    _classCallCheck(this, CountLimiter);
    this.maxItemsPerFrame = maxItemsPerFrame;
    this.itemsLeft = 0;
  }
  CountLimiter.prototype.beginFrame = function beginFrame() {
    this.itemsLeft = this.maxItemsPerFrame;
  };
  CountLimiter.prototype.allowedToUpload = function allowedToUpload() {
    return this.itemsLeft-- > 0;
  };
  return CountLimiter;
}();
exports.default = CountLimiter;
},{}],187:[function(require,module,exports){
"use strict";
exports.__esModule = true;
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
var TimeLimiter = function () {
  function TimeLimiter(maxMilliseconds) {
    _classCallCheck(this, TimeLimiter);
    this.maxMilliseconds = maxMilliseconds;
    this.frameStart = 0;
  }
  TimeLimiter.prototype.beginFrame = function beginFrame() {
    this.frameStart = Date.now();
  };
  TimeLimiter.prototype.allowedToUpload = function allowedToUpload() {
    return Date.now() - this.frameStart < this.maxMilliseconds;
  };
  return TimeLimiter;
}();
exports.default = TimeLimiter;
},{}],188:[function(require,module,exports){
'use strict';
exports.__esModule = true;
var _core = require('../../core');
var core = _interopRequireWildcard(_core);
var _BasePrepare2 = require('../BasePrepare');
var _BasePrepare3 = _interopRequireDefault(_BasePrepare2);
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
var WebGLPrepare = function (_BasePrepare) {
    _inherits(WebGLPrepare, _BasePrepare);
    function WebGLPrepare(renderer) {
        _classCallCheck(this, WebGLPrepare);
        var _this = _possibleConstructorReturn(this, _BasePrepare.call(this, renderer));
        _this.uploadHookHelper = _this.renderer;
        _this.registerFindHook(findGraphics);
        _this.registerUploadHook(uploadBaseTextures);
        _this.registerUploadHook(uploadGraphics);
        return _this;
    }
    return WebGLPrepare;
}(_BasePrepare3.default);
exports.default = WebGLPrepare;
function uploadBaseTextures(renderer, item) {
    if (item instanceof core.BaseTexture) {
        if (!item._glTextures[renderer.CONTEXT_UID]) {
            renderer.textureManager.updateTexture(item);
        }
        return true;
    }
    return false;
}
function uploadGraphics(renderer, item) {
    if (item instanceof core.Graphics) {
        if (item.dirty || item.clearDirty || !item._webGL[renderer.plugins.graphics.CONTEXT_UID]) {
            renderer.plugins.graphics.updateGraphics(item);
        }
        return true;
    }
    return false;
}
function findGraphics(item, queue) {
    if (item instanceof core.Graphics) {
        queue.push(item);
        return true;
    }
    return false;
}
core.WebGLRenderer.registerPlugin('prepare', WebGLPrepare);
},{"../../core":65,"../BasePrepare":183}],189:[function(require,module,exports){
(function (global){
'use strict';
exports.__esModule = true;
exports.loader = exports.prepare = exports.particles = exports.mesh = exports.loaders = exports.interaction = exports.filters = exports.extras = exports.extract = exports.accessibility = undefined;
var _polyfill = require('./polyfill');
Object.keys(_polyfill).forEach(function (key) {
    if (key === "default" || key === "__esModule") return;
    Object.defineProperty(exports, key, {
        enumerable: true,
        get: function get() {
            return _polyfill[key];
        }
    });
});
var _core = require('./core');
Object.keys(_core).forEach(function (key) {
    if (key === "default" || key === "__esModule") return;
    Object.defineProperty(exports, key, {
        enumerable: true,
        get: function get() {
            return _core[key];
        }
    });
});
var _deprecation = require('./deprecation');
var _deprecation2 = _interopRequireDefault(_deprecation);
var _accessibility = require('./accessibility');
var accessibility = _interopRequireWildcard(_accessibility);
var _extract = require('./extract');
var extract = _interopRequireWildcard(_extract);
var _extras = require('./extras');
var extras = _interopRequireWildcard(_extras);
var _filters = require('./filters');
var filters = _interopRequireWildcard(_filters);
var _interaction = require('./interaction');
var interaction = _interopRequireWildcard(_interaction);
var _loaders = require('./loaders');
var loaders = _interopRequireWildcard(_loaders);
var _mesh = require('./mesh');
var mesh = _interopRequireWildcard(_mesh);
var _particles = require('./particles');
var particles = _interopRequireWildcard(_particles);
var _prepare = require('./prepare');
var prepare = _interopRequireWildcard(_prepare);
function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
_core.utils.mixins.performMixins();
var loader = loaders.shared || null;
exports.accessibility = accessibility;
exports.extract = extract;
exports.extras = extras;
exports.filters = filters;
exports.interaction = interaction;
exports.loaders = loaders;
exports.mesh = mesh;
exports.particles = particles;
exports.prepare = prepare;
exports.loader = loader;
if (typeof _deprecation2.default === 'function') {
    (0, _deprecation2.default)(exports);
}
global.PIXI = exports; 
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./accessibility":42,"./core":65,"./deprecation":131,"./extract":133,"./extras":141,"./filters":153,"./interaction":159,"./loaders":162,"./mesh":171,"./particles":174,"./polyfill":181,"./prepare":185}]},{},[189])(189)
});
