# Model 3D hero (public/assets/skeleton.glb)

Jak powstał obecny plik z poprzedniej wersji (Draco, 86 tys. trójkątów, 262 KB):

```
npm i --prefix /tmp/gt @gltf-transform/cli@4
gt=/tmp/gt/node_modules/.bin/gltf-transform
$gt simplify skeleton-stary.glb tmp.glb --ratio 0.5 --error 0.001
$gt meshopt tmp.glb skeleton.glb --level high
```

- Uproszczenie siatki do 50% trójkątów (przy rozmiarze czaszki w hero na ekranie różnicy nie widać).
- Kompresja **meshopt zamiast Draco**: plik jest o ok. 25 KB większy po gzip, ale strona nie pobiera już dekodera Draco (wasm 286 KB + wrapper 59 KB). Dekoder meshopt jest już w bundlu `three-stdlib`, którego używa `useGLTF` z drei.
- Poprzednia wersja jest w historii gita (`git log -- public/assets/skeleton.glb`).
- Katalog `public/vendor/three@0.161.0/.../draco/` nie jest już pobierany przez stronę główną; usunięcie go to osobna decyzja (sprawdź najpierw, czy coś innego go nie używa).
