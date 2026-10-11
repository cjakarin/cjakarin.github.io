// ============ C++ source code for all 6 implementations ============
// Each source is { title, fileName, code } where code lines are 1-indexed
// (matching step.codeLines values from the algorithm engines).

// ---------- Linked List — Array Implementation ----------

const CPP_LL_ARRAY = {
  insertHead: {
    title: 'insertAtHead',
    fileName: 'arraylist_insert_head.cpp',
    code: `#include <iostream>
using namespace std;

const int MAX = 100;

class ArrayList {
private:
    int arr[MAX];
    int size;
public:
    ArrayList() : size(0) {}

    // แทรก value ที่ตำแหน่งแรกของ array
    void insertAtHead(int value) {
        if (size >= MAX) return;            // ตรวจ full
        for (int i = size; i > 0; i--) {    // เลื่อนทุกตัวไปทางขวา
            arr[i] = arr[i - 1];            
        }
        arr[0] = value;                     // ใส่ value ที่ index 0
        size++;                             // เพิ่ม size
    }
};`,
  },
  insertTail: {
    title: 'insertAtTail',
    fileName: 'arraylist_insert_tail.cpp',
    code: `#include <iostream>
using namespace std;

const int MAX = 100;

class ArrayList {
private:
    int arr[MAX];
    int size;
public:
    ArrayList() : size(0) {}

    // แทรก value ที่ท้าย array
    void insertAtTail(int value) {
        if (size >= MAX) return;   // ตรวจ full
        arr[size] = value;         // ใส่ที่ตำแหน่ง size
        size++;                    // เพิ่ม size
    }
};`,
  },
  insertAt: {
    title: 'insertAt',
    fileName: 'arraylist_insert_at.cpp',
    code: `#include <iostream>
using namespace std;

const int MAX = 100;

class ArrayList {
private:
    int arr[MAX];
    int size;
public:
    ArrayList() : size(0) {}

    // แทรก value ที่ตำแหน่ง pos (0-indexed)
    void insertAt(int value, int pos) {
        if (size >= MAX || pos < 0 || pos > size) return;  // ตรวจขอบเขต
        for (int i = size; i > pos; i--) {                 // เลื่อนขวา
            arr[i] = arr[i - 1];                           
        }
        arr[pos] = value;                                  // ใส่ value
        size++;                                            // เพิ่ม size
    }
};`,
  },
  deleteAt: {
    title: 'deleteAt',
    fileName: 'arraylist_delete_at.cpp',
    code: `#include <iostream>
using namespace std;

const int MAX = 100;

class ArrayList {
private:
    int arr[MAX];
    int size;
public:
    ArrayList() : size(0) {}

    // ลบ element ที่ตำแหน่ง pos
    void deleteAt(int pos) {
        if (pos < 0 || pos >= size) return;          // ตรวจขอบเขต
        for (int i = pos; i < size - 1; i++) {       // เลื่อนซ้าย
            arr[i] = arr[i + 1];                     
        }
        size--;                                      // ลด size
    }
};`,
  },
  search: {
    title: 'search',
    fileName: 'arraylist_search.cpp',
    code: `#include <iostream>
using namespace std;

const int MAX = 100;

class ArrayList {
private:
    int arr[MAX];
    int size;
public:
    ArrayList() : size(0) {}

    // ค้นหา value — คืน index แรกที่พบ หรือ -1
    int search(int value) {
        for (int i = 0; i < size; i++) {     // วนทุก index
            if (arr[i] == value) {           // ตรงค่า?
                return i;                    // คืน index
            }
        }
        return -1;                           // ไม่พบ
    }
};`,
  },
  traverse: {
    title: 'traverse',
    fileName: 'arraylist_traverse.cpp',
    code: `#include <iostream>
using namespace std;

const int MAX = 100;

class ArrayList {
private:
    int arr[MAX];
    int size;
public:
    ArrayList() : size(0) {}

    // พิมพ์ทุก element
    void traverse() {
        for (int i = 0; i < size; i++) {       // วน 0..size-1
            cout << arr[i] << " -> ";          // พิมพ์แต่ละตัว
        }
        cout << "NULL" << endl;                // ปิดท้าย
    }
};`,
  },
};

// ---------- Linked List — Pointer Implementation ----------

const CPP_LL_POINTER = {
  insertHead: {
    title: 'insertAtHead',
    fileName: 'll_insert_head.cpp',
    code: `#include <iostream>
using namespace std;

struct Node {
    int data;
    Node* next;
    Node(int val) : data(val), next(nullptr) {}
};

class LinkedList {
private:
    Node* head;
public:
    LinkedList() : head(nullptr) {}

    // แทรก Node ใหม่ที่หัวของลิสต์
    void insertAtHead(int value) {
        Node* newNode = new Node(value);   // สร้าง Node ใหม่
        newNode->next = head;              // ชี้ next ไปยัง head เดิม
        head = newNode;                    // ย้าย head มาชี้ newNode
    }
};`,
  },
  insertTail: {
    title: 'insertAtTail',
    fileName: 'll_insert_tail.cpp',
    code: `#include <iostream>
using namespace std;

struct Node {
    int data;
    Node* next;
    Node(int val) : data(val), next(nullptr) {}
};

class LinkedList {
private:
    Node* head;
public:
    LinkedList() : head(nullptr) {}

    // แทรก Node ใหม่ที่ท้ายลิสต์
    void insertAtTail(int value) {
        Node* newNode = new Node(value);   
        if (head == nullptr) {             // ลิสต์ว่าง?
            head = newNode;                
            return;                        
        }
        Node* current = head;              
        while (current->next != nullptr) { // เดินไปท้าย
            current = current->next;       
        }
        current->next = newNode;           // โยงเข้า newNode
    }
};`,
  },
  insertAt: {
    title: 'insertAtPosition',
    fileName: 'll_insert_at.cpp',
    code: `#include <iostream>
using namespace std;

struct Node {
    int data;
    Node* next;
    Node(int val) : data(val), next(nullptr) {}
};

class LinkedList {
private:
    Node* head;
public:
    LinkedList() : head(nullptr) {}

    // แทรกที่ตำแหน่ง pos (0-indexed)
    void insertAtPosition(int value, int pos) {
        if (pos == 0) { insertAtHead(value); return; }   
        Node* newNode = new Node(value);                 
        Node* current = head;                            
        for (int i = 0; i < pos - 1 && current; i++) {   
            current = current->next;                     
        }
        if (!current) return;                            
        newNode->next = current->next;                   
        current->next = newNode;                         
    }
};`,
  },
  deleteAt: {
    title: 'deleteAt',
    fileName: 'll_delete_at.cpp',
    code: `#include <iostream>
using namespace std;

struct Node {
    int data;
    Node* next;
    Node(int val) : data(val), next(nullptr) {}
};

class LinkedList {
private:
    Node* head;
public:
    LinkedList() : head(nullptr) {}

    // ลบ Node ที่ตำแหน่ง pos
    void deleteAt(int pos) {
        if (head == nullptr || pos < 0) return;       
        if (pos == 0) {                                // ลบที่หัว
            Node* temp = head;                         
            head = head->next;                         
            delete temp;                               
            return;                                    
        }
        Node* prev = head;                             
        for (int i = 0; i < pos - 1 && prev->next; i++) { 
            prev = prev->next;                         
        }
        if (!prev->next) return;                       
        Node* temp = prev->next;                       
        prev->next = temp->next;                       
        delete temp;                                   
    }
};`,
  },
  search: {
    title: 'search',
    fileName: 'll_search.cpp',
    code: `#include <iostream>
using namespace std;

struct Node {
    int data;
    Node* next;
    Node(int val) : data(val), next(nullptr) {}
};

class LinkedList {
private:
    Node* head;
public:
    LinkedList() : head(nullptr) {}

    int search(int value) {
        Node* current = head;                 
        int index = 0;                        
        while (current != nullptr) {          
            if (current->data == value)       
                return index;                 
            current = current->next;          
            index++;                          
        }
        return -1;                            
    }
};`,
  },
  traverse: {
    title: 'traverse',
    fileName: 'll_traverse.cpp',
    code: `#include <iostream>
using namespace std;

struct Node {
    int data;
    Node* next;
    Node(int val) : data(val), next(nullptr) {}
};

class LinkedList {
private:
    Node* head;
public:
    LinkedList() : head(nullptr) {}

    void traverse() {
        Node* current = head;             
        while (current != nullptr) {      
            cout << current->data << " -> "; 
            current = current->next;      
        }
        cout << "NULL" << endl;           
    }
};`,
  },
};

// ---------- Stack — Array Implementation ----------

const CPP_STACK_ARRAY = {
  push: {
    title: 'push',
    fileName: 'arraystack_push.cpp',
    code: `#include <iostream>
using namespace std;

const int MAX = 100;

class ArrayStack {
private:
    int arr[MAX];
    int top;
public:
    ArrayStack() : top(-1) {}

    // เพิ่มค่าลงบนสุดของสแต็ก
    void push(int value) {
        if (top >= MAX - 1) {            // ตรวจ overflow
            cout << "Stack Overflow\\n";  
            return;                       
        }
        arr[++top] = value;               // เพิ่ม top แล้วเก็บค่า
    }
};`,
  },
  pop: {
    title: 'pop',
    fileName: 'arraystack_pop.cpp',
    code: `#include <iostream>
using namespace std;

const int MAX = 100;

class ArrayStack {
private:
    int arr[MAX];
    int top;
public:
    ArrayStack() : top(-1) {}

    // เอาค่าบนสุดออก
    int pop() {
        if (top < 0) {                          // ตรวจ underflow
            cout << "Stack Underflow\\n";        
            return -1;                          
        }
        int val = arr[top];                     // อ่านค่าที่ top
        top--;                                  // ลด top
        return val;                             // คืนค่าที่ลบ
    }
};`,
  },
  peek: {
    title: 'peek',
    fileName: 'arraystack_peek.cpp',
    code: `#include <iostream>
using namespace std;

const int MAX = 100;

class ArrayStack {
private:
    int arr[MAX];
    int top;
public:
    ArrayStack() : top(-1) {}

    // ดูค่าบนสุดโดยไม่ลบ
    int peek() {
        if (top < 0) {                    // ตรวจ underflow
            cout << "Stack is empty\\n";   
            return -1;                    
        }
        return arr[top];                  // คืนค่าที่ top
    }
};`,
  },
};

// ---------- Stack — Pointer Implementation ----------

const CPP_STACK_POINTER = {
  push: {
    title: 'push',
    fileName: 'pointerstack_push.cpp',
    code: `#include <iostream>
using namespace std;

struct Node {
    int data;
    Node* next;
    Node(int val) : data(val), next(nullptr) {}
};

class PointerStack {
private:
    Node* top;
public:
    PointerStack() : top(nullptr) {}

    // เพิ่ม Node ใหม่ที่ด้านบน
    void push(int value) {
        Node* newNode = new Node(value);   // สร้าง Node ใหม่
        newNode->next = top;               // ชี้ next ไปยัง top เดิม
        top = newNode;                     // ย้าย top มาชี้ newNode
    }
};`,
  },
  pop: {
    title: 'pop',
    fileName: 'pointerstack_pop.cpp',
    code: `#include <iostream>
using namespace std;

struct Node {
    int data;
    Node* next;
    Node(int val) : data(val), next(nullptr) {}
};

class PointerStack {
private:
    Node* top;
public:
    PointerStack() : top(nullptr) {}

    // เอา Node บนสุดออก
    int pop() {
        if (top == nullptr) {              // ตรวจ underflow
            cout << "Stack Underflow\\n";   
            return -1;                     
        }
        Node* temp = top;                  // เก็บ reference
        int val = temp->data;              // อ่านค่า
        top = top->next;                   // ย้าย top ลง
        delete temp;                       // คืนหน่วยความจำ
        return val;                        
    }
};`,
  },
  peek: {
    title: 'peek',
    fileName: 'pointerstack_peek.cpp',
    code: `#include <iostream>
using namespace std;

struct Node {
    int data;
    Node* next;
    Node(int val) : data(val), next(nullptr) {}
};

class PointerStack {
private:
    Node* top;
public:
    PointerStack() : top(nullptr) {}

    // ดูค่าบนสุดโดยไม่ลบ
    int peek() {
        if (top == nullptr) {              // ตรวจ empty
            cout << "Stack is empty\\n";    
            return -1;                     
        }
        return top->data;                  // คืนค่าที่ top
    }
};`,
  },
};

// ---------- Queue — Array Implementation ----------

const CPP_QUEUE_ARRAY = {
  enqueue: {
    title: 'enqueue',
    fileName: 'arrayqueue_enqueue.cpp',
    code: `#include <iostream>
using namespace std;

const int MAX = 100;

class ArrayQueue {
private:
    int arr[MAX];
    int front;
    int rear;
public:
    ArrayQueue() : front(0), rear(-1) {}

    // เพิ่มค่าที่ท้ายคิว (rear)
    void enqueue(int value) {
        if (rear >= MAX - 1) {            // ตรวจ overflow
            cout << "Queue Overflow\\n";   
            return;                       
        }
        arr[++rear] = value;              // เพิ่ม rear แล้วเก็บค่า
    }
};`,
  },
  dequeue: {
    title: 'dequeue',
    fileName: 'arrayqueue_dequeue.cpp',
    code: `#include <iostream>
using namespace std;

const int MAX = 100;

class ArrayQueue {
private:
    int arr[MAX];
    int front;
    int rear;
public:
    ArrayQueue() : front(0), rear(-1) {}

    // เอาค่าหน้าสุดออก
    int dequeue() {
        if (front > rear) {                       // ตรวจ underflow
            cout << "Queue Underflow\\n";          
            return -1;                            
        }
        int val = arr[front];                     // อ่านค่าหน้าสุด
        for (int i = front; i < rear; i++) {      // compact ไปทางซ้าย
            arr[i] = arr[i + 1];
        }
        rear--;                                   // ลด rear
        front = 0;                                // reset front
        return val;                               // คืนค่าที่ลบ
    }
};`,
  },
  front: {
    title: 'front',
    fileName: 'arrayqueue_front.cpp',
    code: `#include <iostream>
using namespace std;

const int MAX = 100;

class ArrayQueue {
private:
    int arr[MAX];
    int front;
    int rear;
public:
    ArrayQueue() : front(0), rear(-1) {}

    // ดูค่าหน้าสุดโดยไม่ลบ
    int frontElement() {
        if (front > rear) {                 // ตรวจ underflow
            cout << "Queue is empty\\n";     
            return -1;                      
        }
        return arr[front];                  // คืนค่าที่ front
    }
};`,
  },
};

// ---------- Queue — Pointer Implementation ----------

const CPP_QUEUE_POINTER = {
  enqueue: {
    title: 'enqueue',
    fileName: 'pointerqueue_enqueue.cpp',
    code: `#include <iostream>
using namespace std;

struct Node {
    int data;
    Node* next;
    Node(int val) : data(val), next(nullptr) {}
};

class PointerQueue {
private:
    Node* front;
    Node* rear;
public:
    PointerQueue() : front(nullptr), rear(nullptr) {}

    // เพิ่ม Node ใหม่ที่ท้ายคิว
    void enqueue(int value) {
        Node* newNode = new Node(value);          // สร้าง Node
        if (rear == nullptr) {                    // คิวว่าง?
            front = rear = newNode;               // front และ rear ชี้ที่เดียวกัน
            return;                               
        }
        rear->next = newNode;                     // โยง rear เดิมเข้า newNode
        rear = newNode;                           // ย้าย rear ไป newNode
    }
};`,
  },
  dequeue: {
    title: 'dequeue',
    fileName: 'pointerqueue_dequeue.cpp',
    code: `#include <iostream>
using namespace std;

struct Node {
    int data;
    Node* next;
    Node(int val) : data(val), next(nullptr) {}
};

class PointerQueue {
private:
    Node* front;
    Node* rear;
public:
    PointerQueue() : front(nullptr), rear(nullptr) {}

    // เอา Node หน้าสุดออก
    int dequeue() {
        if (front == nullptr) {              // ตรวจ underflow
            cout << "Queue Underflow\\n";     
            return -1;                       
        }
        Node* temp = front;                  // เก็บ reference
        int val = temp->data;                // อ่านค่า
        front = front->next;                 // ย้าย front ไป Node ถัดไป
        if (front == nullptr)                // ถ้า front กลายเป็น nullptr
            rear = nullptr;                  // ให้ rear เป็น nullptr ด้วย
        delete temp;                         // คืนหน่วยความจำ
        return val;                          
    }
};`,
  },
  front: {
    title: 'front',
    fileName: 'pointerqueue_front.cpp',
    code: `#include <iostream>
using namespace std;

struct Node {
    int data;
    Node* next;
    Node(int val) : data(val), next(nullptr) {}
};

class PointerQueue {
private:
    Node* front;
    Node* rear;
public:
    PointerQueue() : front(nullptr), rear(nullptr) {}

    // ดูค่าหน้าสุดโดยไม่ลบ
    int frontElement() {
        if (front == nullptr) {              // ตรวจ empty
            cout << "Queue is empty\\n";      
            return -1;                       
        }
        return front->data;                  // คืนค่าที่ front
    }
};`,
  },
};

// ---------- Hash Table — Separate Chaining ----------

const CPP_HASH_CHAINING = {
  insert: {
    title: 'insert',
    fileName: 'hash_chaining_insert.cpp',
    code: `#include <iostream>
using namespace std;

const int SIZE = 11;

struct Node {
    int key;
    int value;
    Node* next;
    Node(int k, int v) : key(k), value(v), next(nullptr) {}
};

class HashTableChaining {
private:
    Node* table[SIZE];
    int hash(int key) { return (key % SIZE + SIZE) % SIZE; }
public:
    HashTableChaining() { for (int i = 0; i < SIZE; i++) table[i] = nullptr; }

    void insert(int key, int value) {
        int idx = hash(key);                  // คำนวณ hash
        Node* cur = table[idx];               // เริ่มที่ head ของ chain
        while (cur != nullptr) {              // วนตรวจ chain
            if (cur->key == key) {            // พบ key ซ้ำ?
                cur->value = value;           // อัปเดต value
                return;                       
            }
            cur = cur->next;                  // ไป node ถัดไป
        }
        Node* node = new Node(key, value);    // สร้าง node ใหม่
        node->next = table[idx];              // โยงเข้า head เดิม
        table[idx] = node;                    // ย้าย head
    }
};`,
  },
  search: {
    title: 'search',
    fileName: 'hash_chaining_search.cpp',
    code: `#include <iostream>
using namespace std;

const int SIZE = 11;

struct Node { int key; int value; Node* next; Node(int k, int v) : key(k), value(v), next(nullptr) {} };

class HashTableChaining {
private:
    Node* table[SIZE];
    int hash(int key) { return (key % SIZE + SIZE) % SIZE; }
public:
    HashTableChaining() { for (int i = 0; i < SIZE; i++) table[i] = nullptr; }

    bool search(int key, int& outValue) {
        int idx = hash(key);                  // คำนวณ hash
        Node* cur = table[idx];               // เริ่มที่ head ของ chain
        while (cur != nullptr) {              // วนตรวจ
            if (cur->key == key) {            // พบ?
                outValue = cur->value;        // เก็บ value
                return true;                  // คืน true
            }
            cur = cur->next;                  // ไปถัดไป
        }
        return false;                         // ไม่พบ
    }
};`,
  },
  delete: {
    title: 'delete',
    fileName: 'hash_chaining_delete.cpp',
    code: `#include <iostream>
using namespace std;

const int SIZE = 11;

struct Node { int key; int value; Node* next; Node(int k, int v) : key(k), value(v), next(nullptr) {} };

class HashTableChaining {
private:
    Node* table[SIZE];
    int hash(int key) { return (key % SIZE + SIZE) % SIZE; }
public:
    HashTableChaining() { for (int i = 0; i < SIZE; i++) table[i] = nullptr; }

    void remove(int key) {
        int idx = hash(key);                  // คำนวณ hash
        Node* cur = table[idx];               // เริ่มที่ head
        Node* prev = nullptr;                 // prev = nullptr
        while (cur != nullptr) {              // วนตรวจ
            if (cur->key == key) {            // พบ?
                if (prev) prev->next = cur->next; // โยงข้าม cur
                else table[idx] = cur->next;  // ลบที่ head
                delete cur;                   // คืนหน่วยความจำ
                return;                       
            }
            prev = cur;                       // เลื่อน prev
            cur = cur->next;                  // เลื่อน cur
        }
    }
};`,
  },
};

// ---------- Hash Table — Linear Probing ----------

const CPP_HASH_LINEAR = {
  insert: {
    title: 'insert',
    fileName: 'hash_linear_insert.cpp',
    code: `#include <iostream>
using namespace std;

const int SIZE = 11;
const int EMPTY = -1;

class HashTableLinear {
private:
    int keys[SIZE];
    int values[SIZE];
    bool used[SIZE];
    int hash(int key) { return (key % SIZE + SIZE) % SIZE; }
public:
    HashTableLinear() { for (int i = 0; i < SIZE; i++) used[i] = false; }

    void insert(int key, int value) {
        int h = hash(key);                    // คำนวณ hash
        for (int i = 0; i < SIZE; i++) {      // ลอง probe
            int idx = (h + i) % SIZE;         // linear: (h+i) % SIZE
            if (!used[idx]) {                 // ช่องว่าง?
                keys[idx] = key;              // เก็บ key
                values[idx] = value;          // เก็บ value
                used[idx] = true;             // ทำเครื่องหมาย
                return;                       // สำเร็จ
            }
            if (keys[idx] == key) {           // key ซ้ำ?
                values[idx] = value;          // อัปเดต
                return;                       
            }
        }
        cout << "Table Full\\n";              // เต็ม
    }
};`,
  },
  search: {
    title: 'search',
    fileName: 'hash_linear_search.cpp',
    code: `#include <iostream>
using namespace std;

const int SIZE = 11;

class HashTableLinear {
private:
    int keys[SIZE]; int values[SIZE]; bool used[SIZE];
    int hash(int key) { return (key % SIZE + SIZE) % SIZE; }
public:
    HashTableLinear() { for (int i = 0; i < SIZE; i++) used[i] = false; }

    bool search(int key, int& outValue) {
        int h = hash(key);                    // คำนวณ hash
        for (int i = 0; i < SIZE; i++) {      // probe
            int idx = (h + i) % SIZE;         // (h+i) % SIZE
            if (!used[idx]) return false;     // ช่องว่าง → ไม่พบ
            if (keys[idx] == key) {           // พบ key?
                outValue = values[idx];       // เก็บ value
                return true;                  // คืน true
            }
        }
        return false;                         // probe ครบ → ไม่พบ
    }
};`,
  },
  delete: {
    title: 'delete',
    fileName: 'hash_linear_delete.cpp',
    code: `#include <iostream>
using namespace std;

const int SIZE = 11;

class HashTableLinear {
private:
    int keys[SIZE]; int values[SIZE];
    bool used[SIZE]; bool deleted[SIZE];
    int hash(int key) { return (key % SIZE + SIZE) % SIZE; }
public:
    HashTableLinear() { for (int i = 0; i < SIZE; i++) { used[i] = false; deleted[i] = false; } }

    void remove(int key) {
        int h = hash(key);                    // คำนวณ hash
        for (int i = 0; i < SIZE; i++) {      // probe
            int idx = (h + i) % SIZE;         // (h+i) % SIZE
            if (!used[idx]) return;           // ช่องว่าง → ไม่พบ
            if (!deleted[idx] && keys[idx] == key) {  // พบ key?
                deleted[idx] = true;          // mark เป็น tombstone
                return;                       // (ไม่ลบจริง เพื่อรักษา probe chain)
            }
        }
    }
};`,
  },
};

// ---------- Hash Table — Quadratic Probing ----------

const CPP_HASH_QUADRATIC = {
  insert: {
    title: 'insert',
    fileName: 'hash_quadratic_insert.cpp',
    code: `#include <iostream>
using namespace std;

const int SIZE = 11;

class HashTableQuadratic {
private:
    int keys[SIZE]; int values[SIZE]; bool used[SIZE];
    int hash(int key) { return (key % SIZE + SIZE) % SIZE; }
public:
    HashTableQuadratic() { for (int i = 0; i < SIZE; i++) used[i] = false; }

    void insert(int key, int value) {
        int h = hash(key);                          // คำนวณ hash
        for (int i = 0; i < SIZE; i++) {            // probe
            int idx = (h + i * i) % SIZE;           // quadratic: (h+i²) % SIZE
            if (!used[idx]) {                       // ช่องว่าง?
                keys[idx] = key;                    
                values[idx] = value;                
                used[idx] = true;                   
                return;                             
            }
            if (keys[idx] == key) {                 // key ซ้ำ?
                values[idx] = value;                
                return;                             
            }
        }
        cout << "Table Full\\n";                    
    }
};`,
  },
  search: {
    title: 'search',
    fileName: 'hash_quadratic_search.cpp',
    code: `#include <iostream>
using namespace std;

const int SIZE = 11;

class HashTableQuadratic {
private:
    int keys[SIZE]; int values[SIZE]; bool used[SIZE];
    int hash(int key) { return (key % SIZE + SIZE) % SIZE; }
public:
    HashTableQuadratic() { for (int i = 0; i < SIZE; i++) used[i] = false; }

    bool search(int key, int& outValue) {
        int h = hash(key);                          
        for (int i = 0; i < SIZE; i++) {            
            int idx = (h + i * i) % SIZE;           // (h+i²) % SIZE
            if (!used[idx]) return false;           // ช่องว่าง → ไม่พบ
            if (keys[idx] == key) {                 // พบ?
                outValue = values[idx];             
                return true;                        
            }
        }
        return false;                               
    }
};`,
  },
  delete: {
    title: 'delete',
    fileName: 'hash_quadratic_delete.cpp',
    code: `#include <iostream>
using namespace std;

const int SIZE = 11;

class HashTableQuadratic {
private:
    int keys[SIZE]; int values[SIZE];
    bool used[SIZE]; bool deleted[SIZE];
    int hash(int key) { return (key % SIZE + SIZE) % SIZE; }
public:
    HashTableQuadratic() { for (int i = 0; i < SIZE; i++) { used[i] = false; deleted[i] = false; } }

    void remove(int key) {
        int h = hash(key);                          
        for (int i = 0; i < SIZE; i++) {            
            int idx = (h + i * i) % SIZE;           // (h+i²) % SIZE
            if (!used[idx]) return;                 // ช่องว่าง → ไม่พบ
            if (!deleted[idx] && keys[idx] == key) { // พบ?
                deleted[idx] = true;                // mark tombstone
                return;                             
            }
        }
    }
};`,
  },
};

// ---------- Hash Table — Double Hashing ----------

const CPP_HASH_DOUBLE = {
  insert: {
    title: 'insert',
    fileName: 'hash_double_insert.cpp',
    code: `#include <iostream>
using namespace std;

const int SIZE = 11;

class HashTableDouble {
private:
    int keys[SIZE]; int values[SIZE]; bool used[SIZE];
    int hash1(int key) { return (key % SIZE + SIZE) % SIZE; } // h1
    int hash2(int key) { return 7 - ((key % 7 + 7) % 7); }   // h2 (never 0)
public:
    HashTableDouble() { for (int i = 0; i < SIZE; i++) used[i] = false; }

    void insert(int key, int value) {
        int h = hash1(key);                         // h1
        int step = hash2(key);                      // h2 (step size)
        for (int i = 0; i < SIZE; i++) {            // probe
            int idx = (h + i * step) % SIZE;        // (h1 + i·h2) % SIZE
            if (!used[idx]) {                       // ช่องว่าง?
                keys[idx] = key;                    
                values[idx] = value;                
                used[idx] = true;                   
                return;                             
            }
            if (keys[idx] == key) {                 // ซ้ำ?
                values[idx] = value;                
                return;                             
            }
        }
        cout << "Table Full\\n";                    
    }
};`,
  },
  search: {
    title: 'search',
    fileName: 'hash_double_search.cpp',
    code: `#include <iostream>
using namespace std;

const int SIZE = 11;

class HashTableDouble {
private:
    int keys[SIZE]; int values[SIZE]; bool used[SIZE];
    int hash1(int key) { return (key % SIZE + SIZE) % SIZE; }
    int hash2(int key) { return 7 - ((key % 7 + 7) % 7); }
public:
    HashTableDouble() { for (int i = 0; i < SIZE; i++) used[i] = false; }

    bool search(int key, int& outValue) {
        int h = hash1(key);                         
        int step = hash2(key);                      
        for (int i = 0; i < SIZE; i++) {            
            int idx = (h + i * step) % SIZE;        // (h1 + i·h2) % SIZE
            if (!used[idx]) return false;           // ช่องว่าง → ไม่พบ
            if (keys[idx] == key) {                 // พบ?
                outValue = values[idx];             
                return true;                        
            }
        }
        return false;                               
    }
};`,
  },
  delete: {
    title: 'delete',
    fileName: 'hash_double_delete.cpp',
    code: `#include <iostream>
using namespace std;

const int SIZE = 11;

class HashTableDouble {
private:
    int keys[SIZE]; int values[SIZE];
    bool used[SIZE]; bool deleted[SIZE];
    int hash1(int key) { return (key % SIZE + SIZE) % SIZE; }
    int hash2(int key) { return 7 - ((key % 7 + 7) % 7); }
public:
    HashTableDouble() { for (int i = 0; i < SIZE; i++) { used[i] = false; deleted[i] = false; } }

    void remove(int key) {
        int h = hash1(key);                         
        int step = hash2(key);                      
        for (int i = 0; i < SIZE; i++) {            
            int idx = (h + i * step) % SIZE;        // (h1 + i·h2) % SIZE
            if (!used[idx]) return;                 // ช่องว่าง → ไม่พบ
            if (!deleted[idx] && keys[idx] == key) { // พบ?
                deleted[idx] = true;                // mark tombstone
                return;                             
            }
        }
    }
};`,
  },
};

// ---------- Binary Heap / Priority Queue (Min-Heap) ----------

const CPP_HEAP = {
  insert: {
    title: 'insert (heapify-up)',
    fileName: 'heap_insert.cpp',
    code: `#include <iostream>
using namespace std;

const int MAX = 100;

class MinHeap {
private:
    int arr[MAX];
    int size;
    int parent(int i) { return (i - 1) / 2; }
public:
    MinHeap() : size(0) {}

    void insert(int value) {
        if (size >= MAX) return;             // เช็ค full
        arr[size] = value;                   // ใส่ท้าย array
        int i = size++;                      // size++
        while (i > 0 && arr[i] < arr[parent(i)]) {  // heapify-up
            swap(arr[i], arr[parent(i)]);    // สลับกับ parent
            i = parent(i);                   // ขยับ i ขึ้น
        }
    }
};`,
  },
  extractMin: {
    title: 'extractMin (heapify-down)',
    fileName: 'heap_extract.cpp',
    code: `#include <iostream>
using namespace std;

const int MAX = 100;

class MinHeap {
private:
    int arr[MAX];
    int size;
    int left(int i) { return 2 * i + 1; }
    int right(int i) { return 2 * i + 2; }
public:
    MinHeap() : size(0) {}

    int extractMin() {
        if (size == 0) return -1;            // underflow
        int min = arr[0];                    // เก็บ root (min)
        arr[0] = arr[--size];                // ย้าย last → root
        int i = 0;
        while (true) {                       // heapify-down
            int l = left(i), r = right(i);   
            int smallest = i;                
            if (l < size && arr[l] < arr[smallest]) smallest = l;  
            if (r < size && arr[r] < arr[smallest]) smallest = r;  
            if (smallest == i) break;        // หยุดถ้าเรียงแล้ว
            swap(arr[i], arr[smallest]);     // สลับลง
            i = smallest;                    
        }
        return min;                          // คืน min
    }
};`,
  },
};

// ---------- Disjoint Set Union (Union-Find) ----------

const CPP_DSU = {
  find: {
    title: 'find (path compression)',
    fileName: 'dsu_find.cpp',
    code: `#include <iostream>
using namespace std;

const int N = 100;
int parent[N];

// find แบบ path compression — O(α(N)) ~ O(1)
int find(int x) {
    if (parent[x] != x) {                   // ถ้าไม่ใช่ root
        parent[x] = find(parent[x]);        // path compression
    }
    return parent[x];                       // คืน root
}

// แบบ iterative:
// int find(int x) {
//     while (parent[x] != x) {              // ไล่ขึ้น parent
//         parent[x] = parent[parent[x]];   // path halving
//         x = parent[x];                   
//     }
//     return x;                            // คืน root
// }`,
  },
  union_: {
    title: 'union (by rank)',
    fileName: 'dsu_union.cpp',
    code: `#include <iostream>
using namespace std;

const int N = 100;
int parent[N], rnk[N];

int find(int x) {
    if (parent[x] != x) parent[x] = find(parent[x]);
    return parent[x];
}

// union by rank — ต้ไม้ที่สั้นกว่าไปอยู่ใต้ต้นไม้ที่สูงกว่า
bool unite(int x, int y) {
    int rx = find(x);                       // root ของ x
    int ry = find(y);                       // root ของ y
    if (rx == ry) return false;             // อยู่ใน set เดียวกัน
    if (rnk[rx] < rnk[ry]) {                // rank เล็ก → ไปใต้ใหญ่
        parent[rx] = ry;                    
    } else if (rnk[rx] > rnk[ry]) {         
        parent[ry] = rx;                    
    } else {                                // เท่ากัน
        parent[ry] = rx;                    // เลือกฝั่งนึง
        rnk[rx]++;                          // bump rank
    }
    return true;                            // รวมสำเร็จ
}`,
  },
};

// ---------- Dijkstra's Shortest Path ----------

const CPP_DIJKSTRA = {
  dijkstra: {
    title: 'dijkstra',
    fileName: 'dijkstra.cpp',
    code: `#include <iostream>
#include <vector>
#include <climits>
using namespace std;

const int N = 100;
vector<pair<int,int>> adj[N];   // adj[u] = list of {v, weight}
int dist[N], parent[N];
bool visited[N];

void dijkstra(int source) {
    for (int i = 0; i < N; i++) {            // init
        dist[i] = INT_MAX;                   
        visited[i] = false;                  
        parent[i] = -1;
    }
    dist[source] = 0;                        

    for (int cnt = 0; cnt < N; cnt++) {      // ทำ N รอบ
        // หา unvisited ที่ dist น้อยสุด
        int u = -1, minD = INT_MAX;          
        for (int i = 0; i < N; i++) {        
            if (!visited[i] && dist[i] < minD) {  
                minD = dist[i]; u = i;       
            }
        }
        if (u == -1) break;                  // ไม่มีที่ไปต่อ
        visited[u] = true;                   // mark visited

        // relax ทุก edge จาก u
        for (auto& [v, w] : adj[u]) {        // วน neighbors
            if (visited[v]) continue;        // ข้าม visited
            if (dist[u] + w < dist[v]) {     // พบทางสั้นกว่า?
                dist[v] = dist[u] + w;       // อัปเดต dist
                parent[v] = u;               // บันทึกเส้นทาง
            }
        }
    }
}`,
  },
};

// ---------- MST (Prim + Kruskal) ----------

const CPP_MST = {
  prim: {
    title: 'prim',
    fileName: 'mst_prim.cpp',
    code: `#include <iostream>
#include <vector>
#include <climits>
using namespace std;

const int N = 100;
vector<pair<int,int>> adj[N];
int key[N], parent[N];
bool inMST[N];

void prim(int source) {
    for (int i = 0; i < N; i++) {            // init
        key[i] = INT_MAX;
        inMST[i] = false;
        parent[i] = -1;
    }
    key[source] = 0;

    for (int cnt = 0; cnt < N; cnt++) {      // ทำ N รอบ
        int u = -1, minK = INT_MAX;          // หา min key ที่ยังไม่อยู่ใน MST
        for (int i = 0; i < N; i++) {
            if (!inMST[i] && key[i] < minK) {
                minK = key[i]; u = i;
            }
        }
        if (u == -1) break;
        inMST[u] = true;                     // เพิ่ม u ใน MST

        for (auto& [v, w] : adj[u]) {        // วน neighbors
            if (!inMST[v] && w < key[v]) {   // edge เบากว่า?
                key[v] = w;                  // อัปเดต key
                parent[v] = u;               // บันทึก parent
            }
        }
    }
}`,
  },
  kruskal: {
    title: 'kruskal',
    fileName: 'mst_kruskal.cpp',
    code: `#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

const int N = 100;
int parent[N], rnk[N];

int find(int x) {
    if (parent[x] != x) parent[x] = find(parent[x]);
    return parent[x];
}

bool unite(int x, int y) {
    int rx = find(x), ry = find(y);
    if (rx == ry) return false;
    if (rnk[rx] < rnk[ry]) parent[rx] = ry;
    else if (rnk[rx] > rnk[ry]) parent[ry] = rx;
    else { parent[ry] = rx; rnk[rx]++; }
    return true;
}

// edges = list of {weight, u, v}
int kruskal(int n, vector<tuple<int,int,int>>& edges) {
    sort(edges.begin(), edges.end());        // เรียงตาม weight
    for (int i = 0; i < n; i++) { parent[i] = i; rnk[i] = 0; } // init DSU

    int total = 0, count = 0;
    for (auto& [w, u, v] : edges) {          // วนแต่ละ edge
        if (find(u) != find(v)) {            // ไม่เกิด cycle?
            unite(u, v);                     // รวม set
            total += w;                      // บวก weight
            count++;
            if (count == n - 1) break;       // MST ครบ n-1 edges
        }
    }
    return total;                            // คืน total weight
}`,
  },
};

// ---------- Graph Traversal (BFS + DFS) ----------

const CPP_TRAVERSAL = {
  bfs: {
    title: 'bfs',
    fileName: 'bfs.cpp',
    code: `#include <iostream>
#include <vector>
#include <queue>
using namespace std;

const int N = 100;
vector<int> adj[N];
bool visited[N];

// BFS ใช้ queue (FIFO) — เยี่ยมเป็นชั้น ๆ (level by level)
void bfs(int source) {
    queue<int> q;                          // สร้าง queue
    q.push(source);                        // enqueue source
    visited[source] = true;                // mark visited

    while (!q.empty()) {                   // ลูปจนกว่า queue ว่าง
        int u = q.front();                 // ดูตัวหน้า queue
        q.pop();                           // dequeue
        cout << u << " ";                  // ประมวลผล u

        for (int v : adj[u]) {             // วนเพื่อนบ้านทุกตัว
            if (!visited[v]) {             // ถ้ายังไม่ visited
                visited[v] = true;         // mark visited
                q.push(v);                 // enqueue
            }
        }
    }
}`,
  },
  dfs: {
    title: 'dfs',
    fileName: 'dfs.cpp',
    code: `#include <iostream>
#include <vector>
using namespace std;

const int N = 100;
vector<int> adj[N];
bool visited[N];

// DFS แบบ iterative ใช้ stack (LIFO) — ดำลึงเป็น branch
void dfs(int source) {
    vector<int> st;                        // สร้าง stack
    st.push_back(source);                  // push source

    while (!st.empty()) {                  // ลูปจนกว่า stack ว่าง
        int u = st.back();                 // ดูตัวบนสุด
        st.pop_back();                     // pop

        if (visited[u]) continue;          // ถ้า visited แล้ว ข้าม
        visited[u] = true;                 // mark visited
        cout << u << " ";                  // ประมวลผล u

        // push เพื่อนบ้าน (ย้อนลำดับเพื่อให้เยี่ยมเล็กก่อน)
        for (int i = adj[u].size() - 1; i >= 0; i--) {  
            int v = adj[u][i];             
            if (!visited[v]) {             
                st.push_back(v);           // push
            }
        }
    }
}

// แบบ recursive (กระชับกว่า แต่ใช้ call stack):
// void dfs(int u) {
//     visited[u] = true;                   // mark visited
//     cout << u << " ";                    // ประมวลผล
//     for (int v : adj[u]) {               // วนเพื่อนบ้าน
//         if (!visited[v]) dfs(v);         // recurse
//     }
// }`,
  },
};

// ---------- Topological Sort (Kahn's Algorithm) ----------

const CPP_TOPO = {
  topo: {
    title: 'topologicalSort',
    fileName: 'topological_sort.cpp',
    code: `#include <iostream>
#include <vector>
#include <queue>
using namespace std;

const int N = 100;
vector<int> adj[N];
int inDegree[N];

// Topological Sort แบบ Kahn — ใช้ queue + ลด in-degree
vector<int> topologicalSort(int n) {
    queue<int> q;
    for (int i = 0; i < n; i++) {            // หา in-degree ของทุก node
        if (inDegree[i] == 0) q.push(i);     // ใส่ in-deg=0 ลง queue
    }

    vector<int> order;
    while (!q.empty()) {                      // ลูปจนกว่า queue ว่าง
        int u = q.front(); q.pop();           // dequeue
        order.push_back(u);                   // เพิ่มเข้า result

        for (int v : adj[u]) {                // วนเพื่อนบ้าน
            if (--inDegree[v] == 0) {         // ลด in-degree, ถ้าเป็น 0
                q.push(v);                    // enqueue
            }
        }
    }

    // ถ้า order.size() < n → มี cycle (ไม่ใช่ DAG)
    return order;                             // คืน topological order
}`,
  },
};

// ---------- Bellman-Ford (handles negative weights) ----------

const CPP_BELLMAN_FORD = {
  bellmanFord: {
    title: 'bellmanFord',
    fileName: 'bellman_ford.cpp',
    code: `#include <iostream>
#include <vector>
#include <climits>
using namespace std;

const int N = 100;
const int E = 200;
int u[E], v[E], w[E];   // edge list
long long dist[N];

// Bellman-Ford — รองรับ negative weights + ตรวจ negative cycle
bool bellmanFord(int n, int m, int source) {
    for (int i = 0; i < n; i++) dist[i] = LLONG_MAX;  // init dist
    dist[source] = 0;                                  

    // V-1 iterations (relax ทุก edge)
    for (int iter = 0; iter < n - 1; iter++) {         // วน V-1 ครั้ง
        for (int j = 0; j < m; j++) {                  // วนทุก edge
            if (dist[u[j]] != LLONG_MAX &&             // ถ้า source มีค่า
                dist[u[j]] + w[j] < dist[v[j]]) {      // พบทางสั้นกว่า?
                dist[v[j]] = dist[u[j]] + w[j];        // relax
            }
        }
    }

    // รอบที่ V — ตรวจ negative cycle
    for (int j = 0; j < m; j++) {                      // วนทุก edge อีกครั้ง
        if (dist[u[j]] != LLONG_MAX &&                 // ถ้ายัง relax ได้อีก
            dist[u[j]] + w[j] < dist[v[j]]) {
            return false;                              // พบ negative cycle!
        }
    }
    return true;                                       // ไม่มี cycle, dist ถูกต้อง
}`,
  },
};

// ---------- A* Search (heuristic-guided) ----------

const CPP_ASTAR = {
  astar: {
    title: 'aStar',
    fileName: 'astar.cpp',
    code: `#include <iostream>
#include <vector>
#include <queue>
#include <climits>
using namespace std;

const int N = 100;
vector<pair<int,int>> adj[N];  // adj[u] = {v, w}
int h[N];                       // heuristic: estimate cost to goal
long long g[N];                 // g(n): cost from source to n
long long f[N];                 // f(n) = g(n) + h(n)

// A* ใช้ priority queue เรียงตาม f(n) น้อยสุด
// หา shortest path จาก source → goal (ใช้ heuristic เร่งการค้น)
vector<int> aStar(int source, int goal, int n) {
    for (int i = 0; i < n; i++) {               // init g, f
        g[i] = LLONG_MAX;                        
        f[i] = LLONG_MAX;                        
    }
    g[source] = 0;                               
    f[source] = h[source];                       // f = g + h

    // priority queue: (f, node) เรียง f น้อยสุดก่อน
    priority_queue<pair<long long,int>,          
                   vector<pair<long long,int>>,
                   greater<>> pq;
    pq.push({f[source], source});                // push source
    vector<int> parent(n, -1);
    vector<bool> closed(n, false);

    while (!pq.empty()) {                        
        auto [fu, u] = pq.top(); pq.pop();       // pop f น้อยสุด
        if (u == goal) break;                    // ถึง goal → หยุด
        if (closed[u]) continue;                 // ข้ามถ้า closed แล้ว
        closed[u] = true;                        // mark closed

        for (auto& [v, w] : adj[u]) {            // วนเพื่อนบ้าน
            if (closed[v]) continue;             
            long long tentativeG = g[u] + w;     // คำนวณ g ใหม่
            if (tentativeG < g[v]) {             // ดีกว่า?
                parent[v] = u;                   // บันทึก parent
                g[v] = tentativeG;               // อัปเดต g
                f[v] = g[v] + h[v];              // อัปเดต f
                pq.push({f[v], v});              // push ลง pq
            }
        }
    }

    // reconstruct path
    vector<int> path;
    for (int cur = goal; cur != -1; cur = parent[cur])  // ไล่ parent
        path.push_back(cur);
    reverse(path.begin(), path.end());          // กลับด้าน
    return path;                                // คืน path
}`,
  },
};

// ---------- Floyd-Warshall (All-Pairs Shortest Path) ----------

const CPP_FLOYD_WARSHALL = {
  floydWarshall: {
    title: 'floydWarshall',
    fileName: 'floyd_warshall.cpp',
    code: `#include <iostream>
#include <climits>
using namespace std;

const int N = 100;
long long dist[N][N];

void floydWarshall(int n) {
    for (int k = 0; k < n; k++)
        for (int i = 0; i < n; i++)
            for (int j = 0; j < n; j++)
                if (dist[i][k] != LLONG_MAX && dist[k][j] != LLONG_MAX
                    && dist[i][k] + dist[k][j] < dist[i][j])
                    dist[i][j] = dist[i][k] + dist[k][j];

    for (int i = 0; i < n; i++)
        if (dist[i][i] < 0) { cout << "Negative cycle!\\n"; return; }
}`,
  },
};

// ---------- Tarjan's SCC ----------

const CPP_TARJAN_SCC = {
  tarjan: {
    title: 'tarjanSCC',
    fileName: 'tarjan_scc.cpp',
    code: `#include <iostream>
#include <vector>
#include <stack>
using namespace std;

vector<int> adj[100];
int idx[100], low[100], timer = 0;
bool onStack[100];
stack<int> st;
vector<vector<int>> sccs;

void strongconnect(int v) {
    idx[v] = low[v] = timer++;
    st.push(v); onStack[v] = true;
    for (int w : adj[v]) {
        if (idx[w] == -1) { strongconnect(w); low[v] = min(low[v], low[w]); }
        else if (onStack[w]) low[v] = min(low[v], idx[w]);
    }
    if (low[v] == idx[v]) {
        vector<int> scc; int w;
        do { w = st.top(); st.pop(); onStack[w] = false; scc.push_back(w); } while (w != v);
        sccs.push_back(scc);
    }
}`,
  },
};

// ---------- AVL Tree ----------

const CPP_AVL = {
  insert: {
    title: 'avlInsert',
    fileName: 'avl_tree.cpp',
    code: `#include <algorithm>
using namespace std;

struct Node { int value; Node* left; Node* right; int height; };
int height(Node* n) { return n ? n->height : 0; }
int balance(Node* n) { return n ? height(n->left) - height(n->right) : 0; }

Node* rotateRight(Node* y) {
    Node* x = y->left; y->left = x->right; x->right = y;
    y->height = 1 + max(height(y->left), height(y->right));
    x->height = 1 + max(height(x->left), height(x->right));
    return x;
}
Node* rotateLeft(Node* x) {
    Node* y = x->right; x->right = y->left; y->left = x;
    x->height = 1 + max(height(x->left), height(x->right));
    y->height = 1 + max(height(y->left), height(y->right));
    return y;
}

Node* insert(Node* node, int v) {
    if (!node) return new Node{v, nullptr, nullptr, 1};
    if (v < node->value) node->left = insert(node->left, v);
    else if (v > node->value) node->right = insert(node->right, v);
    else return node;
    node->height = 1 + max(height(node->left), height(node->right));
    int bf = balance(node);
    if (bf > 1 && v < node->left->value) return rotateRight(node);
    if (bf < -1 && v > node->right->value) return rotateLeft(node);
    if (bf > 1 && v > node->left->value) { node->left = rotateLeft(node->left); return rotateRight(node); }
    if (bf < -1 && v < node->right->value) { node->right = rotateRight(node->right); return rotateLeft(node); }
    return node;
}`,
  },
};

// ---------- Red-Black Tree ----------

const CPP_RB_TREE = {
  insert: {
    title: 'rbInsert',
    fileName: 'red_black_tree.cpp',
    code: `using namespace std;
enum Color { RED, BLACK };
struct Node { int value; Color color; Node* left; Node* right; Node* parent; };

void rotateLeft(Node*& root, Node* x) {
    Node* y = x->right; x->right = y->left;
    if (y->left) y->left->parent = x;
    y->parent = x->parent;
    if (!x->parent) root = y;
    else if (x == x->parent->left) x->parent->left = y;
    else x->parent->right = y;
    y->left = x; x->parent = y;
}
void rotateRight(Node*& root, Node* x) {
    Node* y = x->left; x->left = y->right;
    if (y->right) y->right->parent = x;
    y->parent = x->parent;
    if (!x->parent) root = y;
    else if (x == x->parent->right) x->parent->right = y;
    else x->parent->left = y;
    y->right = x; x->parent = y;
}

void fixInsert(Node*& root, Node* z) {
    while (z->parent && z->parent->color == RED) {
        Node* gp = z->parent->parent;
        if (z->parent == gp->left) {
            Node* u = gp->right;
            if (u && u->color == RED) { z->parent->color = BLACK; u->color = BLACK; gp->color = RED; z = gp; }
            else {
                if (z == z->parent->right) { z = z->parent; rotateLeft(root, z); }
                z->parent->color = BLACK; gp->color = RED; rotateRight(root, gp);
            }
        } else {
            Node* u = gp->left;
            if (u && u->color == RED) { z->parent->color = BLACK; u->color = BLACK; gp->color = RED; z = gp; }
            else {
                if (z == z->parent->left) { z = z->parent; rotateRight(root, z); }
                z->parent->color = BLACK; gp->color = RED; rotateLeft(root, gp);
            }
        }
    }
    root->color = BLACK;
}`,
  },
};

// ---------- Binary Search Tree (BST) ----------

const CPP_BST = {
  insert: {
    title: 'bstInsert',
    fileName: 'bst.cpp',
    code: `#include <iostream>
using namespace std;

struct Node {
    int value;
    Node* left;
    Node* right;
    Node(int v) : value(v), left(nullptr), right(nullptr) {}
};

// Insert ลง BST — O(h) โดย h = height (worst case O(n))
Node* insert(Node* root, int value) {
    if (root == nullptr) {                  // ถึงจุดว่าง
        return new Node(value);             // สร้าง Node ใหม่
    }
    if (value < root->value) {              // น้อยกว่า → ลงซ้าย
        root->left = insert(root->left, value);
    } else if (value > root->value) {       // มากกว่า → ลงขวา
        root->right = insert(root->right, value);
    }
    // value == root->value → ไม่ insert (ซ้ำ)
    return root;
}

// Search — O(h)
Node* search(Node* root, int value) {
    if (root == nullptr) return nullptr;    // ไม่พบ
    if (value == root->value) return root;  // พบ!
    if (value < root->value)
        return search(root->left, value);   // ลงซ้าย
    return search(root->right, value);      // ลงขวา
}

// In-order traversal → ได้ค่าเรียงจากน้อยไปมาก
void inorder(Node* root) {
    if (root == nullptr) return;
    inorder(root->left);                    // left
    cout << root->value << " ";             // node
    inorder(root->right);                   // right
}`,
  },
};

// ---------- B+ Tree ----------

const CPP_BPTREE = {
  insert: {
    title: 'bptInsert',
    fileName: 'bplustree.cpp',
    code: `#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

const int ORDER = 4;  // max children = 4, max keys = 3

struct BPTNode {
    vector<int> keys;
    vector<BPTNode*> children;
    BPTNode* next;       // leaf linked list
    bool isLeaf;
    BPTNode(bool leaf) : isLeaf(leaf), next(nullptr) {}
};

BPTNode* root = nullptr;

// หา leaf node สำหรับ key
BPTNode* findLeaf(int key) {
    BPTNode* cur = root;
    while (!cur->isLeaf) {
        int i = 0;
        while (i < cur->keys.size() && key >= cur->keys[i]) i++;
        cur = cur->children[i];
    }
    return cur;
}

// แทรก key ลง leaf (เรียงลำดับ)
void insertIntoLeaf(BPTNode* leaf, int key) {
    auto pos = lower_bound(leaf->keys.begin(), leaf->keys.end(), key);
    leaf->keys.insert(pos, key);
}

// แทรก key + rightChild ลง internal node ที่ตำแหน่ง pos
void insertIntoInternal(BPTNode* node, int key, BPTNode* rightChild) {
    auto pos = lower_bound(node->keys.begin(), node->keys.end(), key);
    int idx = pos - node->keys.begin();
    node->keys.insert(pos, key);
    node->children.insert(node->children.begin() + idx + 1, rightChild);
}

// Insert ลง B+ Tree — O(log n)
// คืนค่า: root ใหม่ (ถ้ามี split root) หรือ root เดิม
BPTNode* insert(BPTNode* root, int key) {
    // Case 1: tree ว่าง
    if (root == nullptr) {
        root = new BPTNode(true);
        root->keys.push_back(key);
        return root;
    }

    // Case 2: หา leaf และแทรก key
    BPTNode* leaf = findLeaf(key);
    insertIntoLeaf(leaf, key);

    // ถ้า leaf ไม่เต็ม → เสร็จแล้ว
    if (leaf->keys.size() <= ORDER - 1) return root;

    // Case 3: leaf เต็ม → split leaf (copy up)
    int mid = leaf->keys.size() / 2;
    BPTNode* newLeaf = new BPTNode(true);
    newLeaf->keys.assign(leaf->keys.begin() + mid, leaf->keys.end());
    leaf->keys.erase(leaf->keys.begin() + mid, leaf->keys.end());
    // linked list
    newLeaf->next = leaf->next;
    leaf->next = newLeaf;
    // copy up key แรกของ newLeaf (B+ Tree: copy, ไม่ move)
    int copyUpKey = newLeaf->keys[0];

    // Case 4: แทรก copyUpKey ลง parent — วนซ้ำถ้า parent เต็ม
    BPTNode* leftChild = leaf;
    BPTNode* rightChild = newLeaf;
    int upKey = copyUpKey;

    while (true) {
        // หา parent ของ leftChild
        // (ใน implementation จริงควรเก็บ parent pointer ไว้
        //  ที่นี่ใช้การ traverse จาก root เพื่อหา parent)
        BPTNode* parent = nullptr;
        BPTNode* cur = root;
        while (!cur->isLeaf && cur != leftChild) {
            for (int i = 0; i < cur->children.size(); i++) {
                if (cur->children[i] == leftChild) { parent = cur; break; }
            }
            if (!parent) {
                int i = 0;
                while (i < cur->keys.size() && upKey >= cur->keys[i]) i++;
                cur = cur->children[i];
            }
        }

        // Case 4a: leftChild คือ root → สร้าง root ใหม่
        if (parent == nullptr) {
            BPTNode* newRoot = new BPTNode(false);
            newRoot->keys.push_back(upKey);
            newRoot->children.push_back(leftChild);
            newRoot->children.push_back(rightChild);
            return newRoot;
        }

        // แทรก upKey ลง parent
        insertIntoInternal(parent, upKey, rightChild);

        // ถ้า parent ไม่เต็ม → เสร็จแล้ว
        if (parent->keys.size() <= ORDER - 1) return root;

        // Case 4b: parent เต็ม → split internal (move up)
        int midIdx = parent->keys.size() / 2;
        int moveUpKey = parent->keys[midIdx];
        BPTNode* newInternal = new BPTNode(false);
        // keys: left เก็บ [0..midIdx-1], right เก็บ [midIdx+1..end]
        // moveUpKey ถูก "ย้าย" ขึ้นไป (ไม่ copy เหมือน leaf)
        newInternal->keys.assign(parent->keys.begin() + midIdx + 1, parent->keys.end());
        parent->keys.erase(parent->keys.begin() + midIdx, parent->keys.end());
        // children: แบ่งครึ่งตาม
        newInternal->children.assign(parent->children.begin() + midIdx + 1, parent->children.end());
        parent->children.erase(parent->children.begin() + midIdx + 1, parent->children.end());

        // วนซ้ำ: แทรก moveUpKey ลง grandparent
        leftChild = parent;
        rightChild = newInternal;
        upKey = moveUpKey;
    }
}`,
  },
};

// ---------- Johnson's Algorithm (All-Pairs Shortest Path with negative edges) ----------

const CPP_JOHNSON = {
  johnson: {
    title: 'johnson',
    fileName: 'johnson.cpp',
    code: `#include <iostream>
#include <vector>
#include <queue>
#include <climits>
using namespace std;

const int N = 100;
const long long INF = LLONG_MAX;
vector<pair<int,long long>> adj[N];  // original graph
vector<pair<int,long long>> radj[N]; // reweighted graph
long long h[N];          // Bellman-Ford distances from virtual source
long long dist[N][N];    // final all-pairs shortest paths

// Bellman-Ford from virtual source S (connected to all nodes with w=0)
bool bellmanFord(int n) {
    for (int i = 0; i < n; i++) h[i] = INF;
    h[n] = 0;  // virtual source S = node n

    // V+1 iterations (V real nodes + 1 virtual)
    for (int iter = 0; iter < n; iter++) {
        // Virtual edges S → i (weight 0)
        for (int i = 0; i < n; i++) {
            if (h[n] + 0 < h[i]) h[i] = h[n] + 0;
        }
        // Original edges
        for (int u = 0; u < n; u++) {
            if (h[u] == INF) continue;
            for (auto& [v, w] : adj[u]) {
                if (h[u] + w < h[v]) h[v] = h[u] + w;
            }
        }
    }

    // Check negative cycle
    for (int u = 0; u < n; u++) {
        if (h[u] == INF) continue;
        for (auto& [v, w] : adj[u]) {
            if (h[u] + w < h[v]) return false;  // negative cycle!
        }
    }
    return true;
}

// Dijkstra from source s using reweighted edges
void dijkstra(int s, int n) {
    for (int i = 0; i < n; i++) dist[s][i] = INF;
    dist[s][s] = 0;
    priority_queue<pair<long long,int>, vector<pair<long long,int>>, greater<>> pq;
    pq.push({0, s});

    while (!pq.empty()) {
        auto [d, u] = pq.top(); pq.pop();
        if (d > dist[s][u]) continue;
        for (auto& [v, w] : radj[u]) {
            if (dist[s][u] + w < dist[s][v]) {
                dist[s][v] = dist[s][u] + w;
                pq.push({dist[s][v], v});
            }
        }
    }
}

// Johnson's Algorithm: all-pairs shortest path (รองรับ negative edges)
bool johnson(int n) {
    // เฟส 1: Bellman-Ford จาก virtual source S
    if (!bellmanFord(n)) return false;  // negative cycle

    // เฟส 2: Reweight edges: w'(u,v) = w(u,v) + h(u) - h(v) ≥ 0
    for (int u = 0; u < n; u++) {
        for (auto& [v, w] : adj[u]) {
            long long newW = w + h[u] - h[v];
            radj[u].push_back({v, newW});
        }
    }

    // เฟส 3: Dijkstra จากทุก node + ปรับกลับ
    for (int s = 0; s < n; s++) {
        dijkstra(s, n);
        // ปรับกลับ: dist(u,v) = dist'(u,v) - h(u) + h(v)
        for (int v = 0; v < n; v++) {
            if (dist[s][v] != INF) {
                dist[s][v] = dist[s][v] - h[s] + h[v];
            }
        }
    }
    return true;
}`,
  },
};

// Export
window.CPP_SOURCES = {
  LL_ARRAY: CPP_LL_ARRAY,
  LL_POINTER: CPP_LL_POINTER,
  STACK_ARRAY: CPP_STACK_ARRAY,
  STACK_POINTER: CPP_STACK_POINTER,
  QUEUE_ARRAY: CPP_QUEUE_ARRAY,
  QUEUE_POINTER: CPP_QUEUE_POINTER,
  HASH_CHAINING: CPP_HASH_CHAINING,
  HASH_LINEAR: CPP_HASH_LINEAR,
  HASH_QUADRATIC: CPP_HASH_QUADRATIC,
  HASH_DOUBLE: CPP_HASH_DOUBLE,
  HEAP: CPP_HEAP,
  DSU: CPP_DSU,
  DIJKSTRA: CPP_DIJKSTRA,
  MST: CPP_MST,
  TRAVERSAL: CPP_TRAVERSAL,
  TOPO: CPP_TOPO,
  BELLMAN_FORD: CPP_BELLMAN_FORD,
  ASTAR: CPP_ASTAR,
  FLOYD_WARSHALL: CPP_FLOYD_WARSHALL,
  TARJAN_SCC: CPP_TARJAN_SCC,
  AVL: CPP_AVL,
  RB_TREE: CPP_RB_TREE,
  JOHNSON: CPP_JOHNSON,
  BST: CPP_BST,
  BPTREE: CPP_BPTREE,
};
