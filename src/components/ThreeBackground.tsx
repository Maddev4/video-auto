import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

interface ThreeBackgroundProps {
  className?: string;
}

const ThreeBackground: React.FC<ThreeBackgroundProps> = ({ className = '' }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene>();
  const rendererRef = useRef<THREE.WebGLRenderer>();
  const cameraRef = useRef<THREE.PerspectiveCamera>();
  const frameRef = useRef<number>();
  const mouseRef = useRef({ x: 0, y: 0 });
  const targetRotationRef = useRef({ x: 0, y: 0 });
  const currentRotationRef = useRef({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(true);

  // Main 3D objects
  const planetsRef = useRef<THREE.Group>();
  const starsRef = useRef<THREE.Points>();
  const orbitsRef = useRef<THREE.Group>();

  const createPlanet = (
    radius: number,
    color: number,
    emissive: number,
    position: THREE.Vector3,
    rotationSpeed: number,
    orbitalSpeed: number,
    isSun: boolean = false,
    hasSatellites: boolean = false
  ) => {
    const group = new THREE.Group();
    
    // Create base geometry with more segments for better detail
    const geometry = new THREE.SphereGeometry(radius, 128, 128);
    
    // Create detailed textures
    const textureLoader = new THREE.TextureLoader();
    const bumpMap = textureLoader.load(
      isSun ? '/textures/sun_bump.jpg' : '/textures/planet_bump.jpg'
    );
    const normalMap = textureLoader.load(
      isSun ? '/textures/sun_normal.jpg' : '/textures/planet_normal.jpg'
    );
    const roughnessMap = textureLoader.load(
      isSun ? '/textures/sun_roughness.jpg' : '/textures/planet_roughness.jpg'
    );
    const displacementMap = textureLoader.load(
      isSun ? '/textures/sun_displacement.jpg' : '/textures/planet_displacement.jpg'
    );

    // Create material with enhanced properties
    const material = new THREE.MeshStandardMaterial({
      color: color,
      emissive: emissive,
      emissiveIntensity: isSun ? 0.5 : 0.2,
      roughness: isSun ? 0.2 : 0.8,
      metalness: isSun ? 0.8 : 0.2,
      transparent: true,
      opacity: 0.9,
      bumpMap: bumpMap,
      bumpScale: isSun ? 0.1 : 0.05,
      normalMap: normalMap,
      normalScale: new THREE.Vector2(0.5, 0.5),
      roughnessMap: roughnessMap,
      displacementMap: displacementMap,
      displacementScale: isSun ? 0.1 : 0.05,
      envMapIntensity: 1.0
    });

    const planet = new THREE.Mesh(geometry, material);
    group.add(planet);

    // Enhanced atmosphere glow with multiple layers
    const atmosphereLayers = [
      { radius: 1.1, opacity: 0.3, color: color },
      { radius: 1.2, opacity: 0.2, color: emissive },
      { radius: 1.3, opacity: 0.1, color: 0xffffff }
    ];

    atmosphereLayers.forEach(layer => {
      const atmosphereGeometry = new THREE.SphereGeometry(radius * layer.radius, 128, 128);
      const atmosphereMaterial = new THREE.MeshPhongMaterial({
        color: layer.color,
        emissive: layer.color,
        emissiveIntensity: 0.1,
        transparent: true,
        opacity: layer.opacity,
        side: THREE.BackSide,
        blending: THREE.AdditiveBlending
      });
      const atmosphere = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
      group.add(atmosphere);
    });

    // Add rings for non-sun planets with enhanced detail
    if (!isSun) {
      const ringSegments = 128;
      const ringGeometry = new THREE.RingGeometry(radius * 1.5, radius * 2.5, ringSegments);
      const ringMaterial = new THREE.MeshPhongMaterial({
        color: color,
        transparent: true,
        opacity: 0.3,
        side: THREE.DoubleSide,
        blending: THREE.AdditiveBlending,
        bumpMap: bumpMap,
        bumpScale: 0.05,
        normalMap: normalMap,
        normalScale: new THREE.Vector2(0.3, 0.3)
      });
      const ring = new THREE.Mesh(ringGeometry, ringMaterial);
      ring.rotation.x = Math.PI / 2;
      group.add(ring);
    }

    // Add satellites with enhanced detail
    if (hasSatellites) {
      const satelliteCount = Math.floor(Math.random() * 3) + 1;
      for (let i = 0; i < satelliteCount; i++) {
        const satelliteRadius = radius * 0.2;
        const satelliteGeometry = new THREE.SphereGeometry(satelliteRadius, 64, 64);
        const satelliteMaterial = new THREE.MeshStandardMaterial({
          color: 0xcccccc,
          emissive: 0x333333,
          roughness: 0.7,
          metalness: 0.3,
          bumpMap: bumpMap,
          bumpScale: 0.05,
          normalMap: normalMap,
          normalScale: new THREE.Vector2(0.3, 0.3)
        });
        const satellite = new THREE.Mesh(satelliteGeometry, satelliteMaterial);
        
        const satelliteOrbitRadius = radius * 3;
        const angle = (i / satelliteCount) * Math.PI * 2;
        satellite.position.set(
          Math.cos(angle) * satelliteOrbitRadius,
          Math.sin(angle) * satelliteOrbitRadius,
          0
        );
        
        // Add satellite orbit visualization with glow
        const orbitGeometry = new THREE.RingGeometry(
          satelliteOrbitRadius - 0.1,
          satelliteOrbitRadius + 0.1,
          128
        );
        const orbitMaterial = new THREE.MeshBasicMaterial({
          color: 0x666666,
          transparent: true,
          opacity: 0.2,
          side: THREE.DoubleSide,
          blending: THREE.AdditiveBlending
        });
        const orbit = new THREE.Mesh(orbitGeometry, orbitMaterial);
        orbit.rotation.x = Math.PI / 2;
        group.add(orbit);
        group.add(satellite);
        
        satellite.userData = {
          orbitRadius: satelliteOrbitRadius,
          orbitSpeed: 0.02 + Math.random() * 0.02,
          initialAngle: angle
        };
      }
    }

    group.position.copy(position);
    group.userData = {
      rotationSpeed,
      orbitalSpeed,
      initialPosition: position.clone()
    };

    return group;
  };

  const createStars = () => {
    const starCount = 3000; // Increased star count
    const positions = new Float32Array(starCount * 3);
    const colors = new Float32Array(starCount * 3);
    const sizes = new Float32Array(starCount);

    for (let i = 0; i < starCount; i++) {
      const i3 = i * 3;
      positions[i3] = (Math.random() - 0.5) * 300; // Increased spread
      positions[i3 + 1] = (Math.random() - 0.5) * 300;
      positions[i3 + 2] = (Math.random() - 0.5) * 300;

      const color = new THREE.Color();
      const hue = Math.random() * 0.1 + 0.6;
      const saturation = Math.random() * 0.2 + 0.8;
      const lightness = Math.random() * 0.2 + 0.8;
      color.setHSL(hue, saturation, lightness);
      
      colors[i3] = color.r;
      colors[i3 + 1] = color.g;
      colors[i3 + 2] = color.b;

      sizes[i] = Math.random() * 2 + 0.5;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    const material = new THREE.PointsMaterial({
      size: 0.1,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true
    });

    return new THREE.Points(geometry, material);
  };

  const createOrbits = () => {
    const group = new THREE.Group();
    const orbitCount = 7;
    const orbitRadiuses = [10, 15, 20, 25, 30, 35, 40];

    for (let i = 0; i < orbitCount; i++) {
      const geometry = new THREE.RingGeometry(orbitRadiuses[i] - 0.1, orbitRadiuses[i] + 0.1, 128);
      const material = new THREE.MeshBasicMaterial({
        color: 0x8b5cf6,
        transparent: true,
        opacity: 0.1,
        side: THREE.DoubleSide,
        blending: THREE.AdditiveBlending
      });
      const orbit = new THREE.Mesh(geometry, material);
      orbit.rotation.x = Math.PI / 2;
      group.add(orbit);
    }

    return group;
  };

  const setupScene = () => {
    if (!mountRef.current) return;

    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x000000, 50, 150); // Increased fog distance
    sceneRef.current = scene;

    // Add environment map for better reflections
    const cubeTextureLoader = new THREE.CubeTextureLoader();
    const envMap = cubeTextureLoader.load([
      '/textures/space/px.jpg',
      '/textures/space/nx.jpg',
      '/textures/space/py.jpg',
      '/textures/space/ny.jpg',
      '/textures/space/pz.jpg',
      '/textures/space/nz.jpg'
    ]);
    scene.environment = envMap;
    scene.background = new THREE.Color(0x000000);

    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(0, 50, 80);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0.1);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.0;
    rendererRef.current = renderer;

    mountRef.current.appendChild(renderer.domElement);

    // Enhanced lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 0.4);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(10, 10, 5);
    directionalLight.castShadow = true;
    scene.add(directionalLight);

    // Add multiple point lights for better planet illumination
    const pointLights = [
      { color: 0x8b5cf6, intensity: 0.5, position: [-20, 10, 20] },
      { color: 0x3b82f6, intensity: 0.5, position: [20, -10, -20] },
      { color: 0xffd700, intensity: 0.3, position: [0, 20, 0] },
      { color: 0xffffff, intensity: 0.2, position: [0, -20, 0] }
    ];

    pointLights.forEach(light => {
      const pointLight = new THREE.PointLight(light.color, light.intensity, 50);
      pointLight.position.set(light.position[0], light.position[1], light.position[2]);
      scene.add(pointLight);
    });

    // Create planets
    const planets = new THREE.Group();
    
    // Sun (central star)
    const sun = createPlanet(
      5,
      0xffd700,
      0xffd700,
      new THREE.Vector3(0, 0, 0),
      0.001,
      0,
      true
    );
    planets.add(sun);

    // Seven planets with different properties
    const planetConfigs = [
      { radius: 1.5, color: 0x3b82f6, emissive: 0x1e40af, orbitalSpeed: 0.02, hasSatellites: true },
      { radius: 2, color: 0x8b5cf6, emissive: 0x4c1d95, orbitalSpeed: 0.015, hasSatellites: true },
      { radius: 1.8, color: 0x60a5fa, emissive: 0x1e40af, orbitalSpeed: 0.01, hasSatellites: true },
      { radius: 1.2, color: 0xef4444, emissive: 0x7f1d1d, orbitalSpeed: 0.008, hasSatellites: false },
      { radius: 2.5, color: 0xf59e0b, emissive: 0x78350f, orbitalSpeed: 0.006, hasSatellites: true },
      { radius: 2.2, color: 0x10b981, emissive: 0x064e3b, orbitalSpeed: 0.004, hasSatellites: true },
      { radius: 1.7, color: 0x6366f1, emissive: 0x312e81, orbitalSpeed: 0.003, hasSatellites: true }
    ];

    planetConfigs.forEach((config, index) => {
      const radius = 10 + index * 5;
      const planet = createPlanet(
        config.radius,
        config.color,
        config.emissive,
        new THREE.Vector3(radius, 0, 0),
        0.02,
        config.orbitalSpeed,
        false,
        config.hasSatellites
      );
      planets.add(planet);
    });

    planetsRef.current = planets;
    scene.add(planets);

    const stars = createStars();
    starsRef.current = stars;
    scene.add(stars);

    const orbits = createOrbits();
    orbitsRef.current = orbits;
    scene.add(orbits);
  };

  const animate = () => {
    if (!isVisible || !sceneRef.current || !rendererRef.current || !cameraRef.current) return;

    const time = Date.now() * 0.001;

    currentRotationRef.current.x += (targetRotationRef.current.x - currentRotationRef.current.x) * 0.05;
    currentRotationRef.current.y += (targetRotationRef.current.y - currentRotationRef.current.y) * 0.05;

    if (planetsRef.current) {
      planetsRef.current.rotation.y = time * 0.1 + currentRotationRef.current.x * 0.5;
      planetsRef.current.rotation.x = Math.sin(time * 0.1) * 0.2 + currentRotationRef.current.y * 0.3;

      planetsRef.current.children.forEach((planet, index) => {
        if (index === 0) {
          // Sun rotation and pulsing
          planet.rotation.y = time * 0.5;
          const scale = 1 + Math.sin(time * 2) * 0.05;
          planet.scale.set(scale, scale, scale);
        } else {
          // Planet rotation and orbit
          const angle = time * planet.userData.orbitalSpeed;
          const radius = 10 + (index - 1) * 5;
          planet.position.x = Math.cos(angle) * radius;
          planet.position.z = Math.sin(angle) * radius;
          planet.rotation.y = time * 2;

          // Animate rings
          if (planet.children[2]) {
            planet.children[2].rotation.z = time * 0.5;
          }

          // Animate satellites
          for (let i = 3; i < planet.children.length; i += 2) {
            const satellite = planet.children[i];
            if (satellite.userData) {
              const satelliteAngle = time * satellite.userData.orbitSpeed + satellite.userData.initialAngle;
              satellite.position.x = Math.cos(satelliteAngle) * satellite.userData.orbitRadius;
              satellite.position.z = Math.sin(satelliteAngle) * satellite.userData.orbitRadius;
              satellite.rotation.y = time * 2;
            }
          }
        }
      });
    }

    if (starsRef.current) {
      starsRef.current.rotation.y = time * 0.05;
      const positions = starsRef.current.geometry.attributes.position.array as Float32Array;
      const sizes = starsRef.current.geometry.attributes.size.array as Float32Array;
      
      for (let i = 0; i < positions.length; i += 3) {
        positions[i + 1] += Math.sin(time + i) * 0.01;
        sizes[i / 3] = Math.sin(time * 2 + i) * 0.5 + 1.5;
      }
      
      starsRef.current.geometry.attributes.position.needsUpdate = true;
      starsRef.current.geometry.attributes.size.needsUpdate = true;
    }

    if (orbitsRef.current) {
      orbitsRef.current.rotation.y = time * 0.02;
      orbitsRef.current.rotation.x = Math.sin(time * 0.1) * 0.1;
    }

    cameraRef.current.position.x = Math.sin(time * 0.1) * 2;
    cameraRef.current.position.y = 50 + Math.cos(time * 0.15) * 2;
    cameraRef.current.lookAt(0, 0, 0);

    rendererRef.current.render(sceneRef.current, cameraRef.current);
    frameRef.current = requestAnimationFrame(animate);
  };

  const handleResize = () => {
    if (!cameraRef.current || !rendererRef.current) return;

    cameraRef.current.aspect = window.innerWidth / window.innerHeight;
    cameraRef.current.updateProjectionMatrix();
    rendererRef.current.setSize(window.innerWidth, window.innerHeight);
  };

  const handleMouseMove = (event: MouseEvent) => {
    targetRotationRef.current.x = (event.clientX / window.innerWidth - 0.5) * 2;
    targetRotationRef.current.y = (event.clientY / window.innerHeight - 0.5) * 2;
  };

  const handleVisibilityChange = () => {
    setIsVisible(!document.hidden);
  };

  useEffect(() => {
    setupScene();

    // Event listeners
    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Start animation
    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('visibilitychange', handleVisibilityChange);

      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }

      if (rendererRef.current && mountRef.current) {
        mountRef.current.removeChild(rendererRef.current.domElement);
        rendererRef.current.dispose();
      }
    };
  }, []);

  useEffect(() => {
    if (isVisible) {
      animate();
    } else if (frameRef.current) {
      cancelAnimationFrame(frameRef.current);
    }
  }, [isVisible]);

  return (
    <div
      ref={mountRef}
      className={`fixed inset-0 pointer-events-none ${className}`}
      style={{
        zIndex: -1,
        background: 'radial-gradient(circle at center, rgba(138, 43, 226, 0.6) 0%, rgba(0, 191, 255, 0.6) 100%)',
        backdropFilter: 'blur(50px) saturate(200%) brightness(120%)'
      }}
    />
  );
};

export default ThreeBackground;