import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import Globe from 'three-globe';
import countries from '../countriesgeo.json'; // Adjust the path as needed

const GlobeComponent = () => {
  const mountRef = useRef(null);
  const [hoveredCountry, setHoveredCountry] = useState(null);

  useEffect(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    mountRef.current.appendChild(renderer.domElement);

    const globe = new Globe()
      .globeImageUrl('//unpkg.com/three-globe/example/img/earth-dark.jpg')
      .bumpImageUrl('//unpkg.com/three-globe/example/img/earth-topology.png')
      .polygonsData(countries.features)
      .polygonAltitude(0.06)
      .polygonCapColor(() => 'rgba(200, 0, 0, 0.6)')
      .polygonSideColor(() => 'rgba(0, 100, 0, 0.15)')
      .polygonStrokeColor(() => '#111')
      .polygonLabel(({ properties: d }) => `
        <b>${d.name}</b> <br />
        ${d.description}
      `)
      .onPolygonClick(({ properties: d }) => {
        setHoveredCountry(d);
      });

    scene.add(globe);
    camera.position.z = 400;

    const animate = () => {
      requestAnimationFrame(animate);
      globe.rotateY(0.002);
      renderer.render(scene, camera);
    };

    animate();

    const onWindowResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', onWindowResize, false);

    return () => {
      window.removeEventListener('resize', onWindowResize);
      mountRef.current.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div>
      <div ref={mountRef}></div>
      {hoveredCountry && (
        <div className="info-box">
          <h2>{hoveredCountry.name}</h2>
          <p>{hoveredCountry.description}</p>
        </div>
      )}
    </div>
  );
};

export default GlobeComponent;
