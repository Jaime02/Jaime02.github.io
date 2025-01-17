import * as THREE from "three";
import * as BufferGeometryUtils from 'three/addons/utils/BufferGeometryUtils.js';

export default function RoundEdgedBox(
  width: number,
  height: number,
  depth: number,
  radius: number,
  widthSegments: number,
  heightSegments: number,
  depthSegments: number,
  smoothness: number
) {
  width = width || 1;
  height = height || 1;
  depth = depth || 1;
  radius = radius || Math.min(Math.min(width, height), depth) * 0.25;
  widthSegments = Math.floor(widthSegments) || 1;
  heightSegments = Math.floor(heightSegments) || 1;
  depthSegments = Math.floor(depthSegments) || 1;
  smoothness = Math.max(3, Math.floor(smoothness) || 3);

  const halfWidth = width * 0.5 - radius;
  const halfHeight = height * 0.5 - radius;
  const halfDepth = depth * 0.5 - radius;

  const geometries: THREE.BufferGeometry[] = [];

  // Corners - 4 eighths of a sphere
  const corner1 = new THREE.SphereGeometry(radius, smoothness, smoothness, 0, Math.PI * 0.5, 0, Math.PI * 0.5);
  corner1.translate(-halfWidth, halfHeight, halfDepth);
  geometries.push(corner1);

  const corner2 = new THREE.SphereGeometry(radius, smoothness, smoothness, Math.PI * 0.5, Math.PI * 0.5, 0, Math.PI * 0.5);
  corner2.translate(halfWidth, halfHeight, halfDepth);
  geometries.push(corner2);

  const corner3 = new THREE.SphereGeometry(radius, smoothness, smoothness, 0, Math.PI * 0.5, Math.PI * 0.5, Math.PI * 0.5);
  corner3.translate(-halfWidth, -halfHeight, halfDepth);
  geometries.push(corner3);

  const corner4 = new THREE.SphereGeometry(radius, smoothness, smoothness, Math.PI * 0.5, Math.PI * 0.5, Math.PI * 0.5, Math.PI * 0.5);
  corner4.translate(halfWidth, -halfHeight, halfDepth);
  geometries.push(corner4);

  // Edges
  const edge1 = new THREE.CylinderGeometry(radius, radius, width - radius * 2, smoothness, widthSegments, true, 0, Math.PI * 0.5);
  edge1.rotateZ(Math.PI * 0.5);
  edge1.translate(0, halfHeight, halfDepth);
  geometries.push(edge1);

  const edge2 = new THREE.CylinderGeometry(radius, radius, width - radius * 2, smoothness, widthSegments, true, Math.PI * 1.5, Math.PI * 0.5);
  edge2.rotateZ(Math.PI * 0.5);
  edge2.translate(0, -halfHeight, halfDepth);
  geometries.push(edge2);

  const edge3 = new THREE.CylinderGeometry(radius, radius, height - radius * 2, smoothness, heightSegments, true, 0, Math.PI * 0.5);
  edge3.translate(halfWidth, 0, halfDepth);
  geometries.push(edge3);

  const edge4 = new THREE.CylinderGeometry(radius, radius, height - radius * 2, smoothness, heightSegments, true, Math.PI * 1.5, Math.PI * 0.5);
  edge4.translate(-halfWidth, 0, halfDepth);
  geometries.push(edge4);

  const edge5 = new THREE.CylinderGeometry(radius, radius, depth - radius * 2, smoothness, depthSegments, true, 0, Math.PI * 0.5);
  edge5.rotateX(-Math.PI * 0.5);
  edge5.translate(halfWidth, halfHeight, 0);
  geometries.push(edge5);

  const edge6 = new THREE.CylinderGeometry(radius, radius, depth - radius * 2, smoothness, depthSegments, true, Math.PI * 0.5, Math.PI * 0.5);
  edge6.rotateX(-Math.PI * 0.5);
  edge6.translate(halfWidth, -halfHeight, 0);
  geometries.push(edge6);

  // Sides
  const side1 = new THREE.PlaneGeometry(width - radius * 2, height - radius * 2, widthSegments, heightSegments);
  side1.translate(0, 0, depth * 0.5);
  geometries.push(side1);

  const side2 = new THREE.PlaneGeometry(depth - radius * 2, height - radius * 2, depthSegments, heightSegments);
  side2.rotateY(Math.PI * 0.5);
  side2.translate(width * 0.5, 0, 0);
  geometries.push(side2);

  const side3 = side1.clone();
  side3.rotateY(Math.PI);
  geometries.push(side3);

  // Top and bottom
  const top = new THREE.PlaneGeometry(width - radius * 2, depth - radius * 2, widthSegments, depthSegments);
  top.rotateX(-Math.PI * 0.5);
  top.translate(0, height * 0.5, 0);
  geometries.push(top);

  const bottom = new THREE.PlaneGeometry(width - radius * 2, depth - radius * 2, widthSegments, depthSegments);
  bottom.rotateX(Math.PI * 0.5);
  bottom.translate(0, -height * 0.5, 0);
  geometries.push(bottom);

  // Merge all geometries
  const mergedGeometry = THREE.BufferGeometryUtils.mergeBufferGeometries(geometries, true);

  return mergedGeometry;
}
