let scene, camera, renderer;
let platforms = [], holoplants = [], energyOrbs = [], floatingCrystals = [], neonTowers = [];

function init() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 2000);
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    createSky();
    createObjects();
    
    camera.position.set(0, 50, 200);
    camera.lookAt(0, 0, 0);

    animate();
}

function createSky() {
    const skyGeometry = new THREE.SphereGeometry(1000, 32, 32);
    const skyMaterial = new THREE.ShaderMaterial({
        uniforms: {
            time: { value: 0 }
        },
        vertexShader: `
            varying vec2 vUV;
            void main() {
                vUV = uv;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `,
        fragmentShader: `
            uniform float time;
            varying vec2 vUV;
            void main() {
                vec3 color = vec3(0.1, 0.2, 0.3);
                color += 0.1 * sin(vUV.x * 10.0 + time);
                color += 0.1 * cos(vUV.y * 15.0 - time * 0.5);
                gl_FragColor = vec4(color, 1.0);
            }
        `,
        side: THREE.BackSide
    });
    const sky = new THREE.Mesh(skyGeometry, skyMaterial);
    scene.add(sky);
}

function createObjects() {
    for (let i = 0; i < 15; i++) createPlatform();
    for (let i = 0; i < 50; i++) createHoloplant();
    for (let i = 0; i < 40; i++) createEnergyOrb();
    for (let i = 0; i < 20; i++) createFloatingCrystal();
    for (let i = 0; i < 10; i++) createNeonTower();
}

function createPlatform() {
    const geometry = new THREE.CylinderGeometry(10, 8, 3, 8);
    const material = new THREE.MeshPhongMaterial({
        color: 0x00ffff,
        emissive: 0x0088ff,
        shininess: 100,
        transparent: true,
        opacity: 0.7
    });
    const platform = new THREE.Mesh(geometry, material);
    setPosition(platform);
    scene.add(platform);
    platforms.push(platform);

    gsap.to(platform.position, {
        y: platform.position.y + Math.random() * 20 - 10,
        duration: 4 + Math.random() * 4,
        repeat: -1,
        yoyo: true,
        ease: "power1.inOut"
    });
}

function createHoloplant() {
    const geometry = new THREE.ConeGeometry(2, 8, 4);
    const material = new THREE.ShaderMaterial({
        uniforms: {
            time: { value: 0 }
        },
        vertexShader: `
            varying vec2 vUV;
            void main() {
                vUV = uv;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `,
        fragmentShader: `
            uniform float time;
            varying vec2 vUV;
            void main() {
                vec3 color = vec3(0.0, 1.0, 0.5);
                color += 0.2 * sin(vUV.y * 20.0 + time * 2.0);
                float alpha = 0.7 + 0.3 * sin(vUV.x * 10.0 - time);
                gl_FragColor = vec4(color, alpha);
            }
        `,
        transparent: true
    });
    const plant = new THREE.Mesh(geometry, material);
    setPosition(plant);
    scene.add(plant);
    holoplants.push(plant);

    gsap.to(plant.rotation, {
        y: Math.PI * 2,
        duration: 4 + Math.random() * 4,
        repeat: -1,
        ease: "none"
    });
}

function createEnergyOrb() {
    const geometry = new THREE.SphereGeometry(3, 32, 32);
    const material = new THREE.ShaderMaterial({
        uniforms: {
            time: { value: 0 }
        },
        vertexShader: `
            varying vec3 vNormal;
            void main() {
                vNormal = normal;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `,
        fragmentShader: `
            uniform float time;
            varying vec3 vNormal;
            void main() {
                vec3 color = vec3(0.5, 0.8, 1.0);
                color += 0.2 * sin(vNormal.x * 10.0 + time * 3.0);
                color += 0.2 * cos(vNormal.y * 8.0 - time * 2.0);
                float alpha = 0.6 + 0.4 * sin(vNormal.z * 5.0 + time);
                gl_FragColor = vec4(color, alpha);
            }
        `,
        transparent: true
    });
    const orb = new THREE.Mesh(geometry, material);
    setPosition(orb);
    scene.add(orb);
    energyOrbs.push(orb);

    gsap.to(orb.position, {
        x: orb.position.x + Math.random() * 40 - 20,
        y: orb.position.y + Math.random() * 40 - 20,
        z: orb.position.z + Math.random() * 40 - 20,
        duration: 6 + Math.random() * 6,
        repeat: -1,
        yoyo: true,
        ease: "power1.inOut"
    });
}

function createFloatingCrystal() {
    const geometry = new THREE.OctahedronGeometry(5);
    const material = new THREE.MeshPhongMaterial({
        color: 0xff00ff,
        emissive: 0x880088,
        shininess: 100,
        transparent: true,
        opacity: 0.8
    });
    const crystal = new THREE.Mesh(geometry, material);
    setPosition(crystal);
    scene.add(crystal);
    floatingCrystals.push(crystal);

    gsap.to(crystal.rotation, {
        x: Math.PI * 2,
        y: Math.PI * 2,
        duration: 10 + Math.random() * 10,
        repeat: -1,
        ease: "none"
    });

    gsap.to(crystal.position, {
        y: crystal.position.y + Math.random() * 20 - 10,
        duration: 5 + Math.random() * 5,
        repeat: -1,
        yoyo: true,
        ease: "power1.inOut"
    });
}

function createNeonTower() {
    const geometry = new THREE.BoxGeometry(10, 100, 10);
    const material = new THREE.ShaderMaterial({
        uniforms: {
            time: { value: 0 }
        },
        vertexShader: `
            varying vec2 vUV;
            void main() {
                vUV = uv;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `,
        fragmentShader: `
            uniform float time;
            varying vec2 vUV;
            void main() {
                vec3 color = vec3(0.8, 0.2, 1.0);
                color += 0.2 * sin(vUV.y * 50.0 + time * 5.0);
                gl_FragColor = vec4(color, 1.0);
            }
        `
    });
    const tower = new THREE.Mesh(geometry, material);
    tower.position.set(
        Math.random() * 300 - 150,
        -50,
        Math.random() * 300 - 150
    );
    scene.add(tower);
    neonTowers.push(tower);

    gsap.to(tower.scale, {
        y: 1.2,
        duration: 2 + Math.random() * 2,
        repeat: -1,
        yoyo: true,
        ease: "power1.inOut"
    });
}

function setPosition(object) {
    object.position.set(
        Math.random() * 300 - 150,
        Math.random() * 100 - 50,
        Math.random() * 300 - 150
    );
}

function animate() {
    requestAnimationFrame(animate);

    const time = performance.now() * 0.001;

    scene.children[0].material.uniforms.time.value = time;

    holoplants.forEach(plant => {
        plant.material.uniforms.time.value = time;
        plant.rotation.y += 0.01;
    });

    energyOrbs.forEach(orb => {
        orb.material.uniforms.time.value = time;
        orb.rotation.x += 0.02;
        orb.rotation.y += 0.03;
    });

    floatingCrystals.forEach(crystal => {
        crystal.rotation.x += 0.01;
        crystal.rotation.y += 0.015;
    });

    neonTowers.forEach(tower => {
        tower.material.uniforms.time.value = time;
    });

    camera.position.x = Math.sin(time * 0.1) * 200;
    camera.position.z = Math.cos(time * 0.1) * 200;
    camera.lookAt(0, 0, 0);

    renderer.render(scene, camera);
}

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

init();
