# Data Structure Visualizer

เว็บแอป Interactive Data Structure & Algorithm Visualizer พร้อม C++ code แบบ step-by-step

## ฟีเจอร์

- **25 visualizers** ครอบคลุม Data Structures และ Algorithms ที่สำคัญ
- **Animation step-by-step** พร้อม C++ code ที่ไฮไลต์บรรทัดตามจังหวะ
- **Playback controls** — Play/Pause/Step Forward/Step Back + ปรับความเร็ว
- **Responsive** — ใช้งานได้ทั้งมือถือและเดสก์ท็อป
- **Pure HTML + JavaScript** — ไม่ต้อง build, ไม่ต้องติดตั้ง dependencies

## โครงสร้างข้อมูลที่มี

| กลุ่ม | หน้า |
|------|------|
| **Linked List** | Array · Pointer |
| **Stack** | Array · Pointer |
| **Queue** | Array · Pointer |
| **Hash Table** | Separate Chaining · Linear Probing · Quadratic Probing · Double Hashing |
| **Heap** | Binary Heap / Priority Queue |
| **DSU** | Union-Find (Path Compression + Union by Rank) |
| **Graph** | Dijkstra · MST · BFS+DFS · Topological Sort · Bellman-Ford · A* · Floyd-Warshall · Johnson · Tarjan SCC |
| **Tree** | BST · AVL · Red-Black Tree · B+ Tree |

## วิธีใช้งาน (Local)

1. ดาวน์โหลดและแตก zip
2. เปิดไฟล์ `index.html` ใน browser (ดับเบิ้ลคลิก)
3. ไม่ต้องติดตั้งอะไรเพิ่ม — ทำงานได้ทันที

หรือถ้าจะรันผ่าน local server:

```bash
cd ds-visualizer
python3 -m http.server 8000
# เปิด http://localhost:8000 ใน browser
```

ตรวจสอบความถูกต้องก่อน upload (ต้องมี Node.js แต่ไม่ต้อง `npm install`):

```bash
npm test
```

ชุดทดสอบตรวจผลลัพธ์และ invariant ของอัลกอริทึม, syntax JavaScript,
ลิงก์ภายใน, path สำหรับ GitHub Pages และตำแหน่ง highlight ของ C++

## Deploy บน GitHub Pages

### ขั้นตอนที่ 1: สร้าง GitHub repo

```bash
# สร้าง repo ใหม่บน GitHub ก่อน (ผ่านเว็บ)
# แล้ว clone ลงเครื่อง
git clone https://github.com/<username>/<repo-name>.git
cd <repo-name>

# คัดลอกไฟล์จาก ds-visualizer มาใส่ใน repo
cp -r /path/to/ds-visualizer/* .

# commit และ push
git add .
git commit -m "Add Data Structure Visualizer"
git push origin main
```

### ขั้นตอนที่ 2: เปิด GitHub Pages

1. ไปที่หน้า repo บน GitHub
2. คลิก **Settings** → **Pages** (เมนูซ้าย)
3. ในส่วน **Build and deployment**:
   - **Source**: Deploy from a branch
   - **Branch**: `main` / `(root)` → คลิก **Save**
4. รอ 1-2 นาที — GitHub จะ build ให้อัตโนมัติ
5. กลับไปดูที่หน้า Pages จะมีลิงก์ `https://<username>.github.io/<repo-name>/`

### ขั้นตอนที่ 3: ทดสอบ

เปิดลิงก์ใน browser — เว็บจะแสดงหน้า index พร้อมเมนูเลือก visualizer

## โครงสร้างไฟล์

```
ds-visualizer/
├── index.html              (เมนูหลัก 25 การ์ด)
├── 404.html                (หน้าสำรองสำหรับ GitHub Pages)
├── favicon.svg
├── linkedlist-array.html
├── linkedlist-pointer.html
├── stack-array.html
├── stack-pointer.html
├── queue-array.html
├── queue-pointer.html
├── hash-chaining.html
├── hash-linear.html
├── hash-quadratic.html
├── hash-double.html
├── heap.html
├── dsu.html
├── shortest-path.html      (Dijkstra)
├── mst.html                (Prim + Kruskal)
├── traversal.html          (BFS + DFS)
├── topo.html               (Topological Sort)
├── bellman-ford.html
├── astar.html
├── floyd-warshall.html
├── johnson.html
├── tarjan-scc.html
├── bst.html
├── avl.html
├── red-black.html
├── bplustree.html
├── css/style.css
└── js/
    ├── common.js           (utilities + playback engine + code highlight)
    ├── cpp-sources.js      (C++ code ทั้งหมด)
    ├── view-builder.js     (layout builder สำหรับ view pages)
    ├── linkedlist-array.js
    ├── linkedlist-pointer.js
    ├── stack.js
    ├── queue.js
    ├── hash.js
    ├── heap.js
    ├── dsu.js
    ├── graph.js            (Dijkstra, MST, BFS/DFS, Topo, Bellman-Ford, A*)
    ├── floyd-warshall.js
    ├── johnson.js
    ├── tarjan-scc.js
    ├── bst.js
    ├── avl.js
    ├── red-black.js
    └── bplustree.js
└── tests/                  (algorithm invariants + deployment checks)
```

## เทคโนโลยี

- **HTML5** + **CSS3** (custom properties, flexbox, grid)
- **Vanilla JavaScript** (ไม่มี framework, ไม่มี build step)
- **SVG** สำหรับวาด graph และ tree

## License

เนื้อหาเพื่อการศึกษา — ใช้ฟรี, แก้ไขได้, แจกจ่ายได้

## หมายเหตุทางอัลกอริทึม

- A* ใช้ heuristic ที่คำนวณสำหรับ goal `G` จึงล็อก goal ไว้ที่ `G`
- Quadratic probing ใช้ `(h+i²) % SIZE`; การรับประกันว่าจะพบช่องว่างต้องรักษา load factor ต่ำกว่า 0.5
- Queue แบบ array ใช้โมเดล compact: หลัง dequeue จะเลื่อนสมาชิกที่เหลือไปซ้ายหนึ่งช่อง
