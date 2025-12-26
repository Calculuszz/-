"use client";

import { useState } from "react";

export default function TestPage() {
  const [staffImage, setStaffImage] = useState<File | null>(null);
  const [searchImage, setSearchImage] = useState<File | null>(null);
  const [result, setResult] = useState<any>(null);

  const EVENT_ID = "fad3dc56-58d1-4846-9d45-9bbf23ec0933"; // ใส่ event_id ที่คุณใช้

  async function uploadStaff() {
    if (!staffImage) return alert("เลือกรูปก่อน");

    const fd = new FormData();
    fd.append("image", staffImage);
    fd.append("event_id", EVENT_ID);
    fd.append("title", "Test Item");

    const res = await fetch("/api/staff/items", {
      method: "POST",
      body: fd,
    });

    const data = await res.json();
    alert("Staff upload success!");
    console.log(data);
  }

  async function searchItem() {
    if (!searchImage) return alert("เลือกรูปก่อน");

    const fd = new FormData();
    fd.append("image", searchImage);
    fd.append("event_id", EVENT_ID);

    const res = await fetch("/api/attendee/search", {
      method: "POST",
      body: fd,
    });

    const data = await res.json();
    setResult(data);
  }

  return (
    <div style={{ padding: 40, maxWidth: 600 }}>
      <h1>Lost & Found AI – Test UI</h1>

      <hr />

      <h2>👮 Staff: Add Lost Item</h2>
      <input
        type="file"
        onChange={(e) => setStaffImage(e.target.files?.[0] || null)}
      />
      <br />
      <button onClick={uploadStaff}>Upload</button>

      <hr />

      <h2>🙋 Attendee: Search Item</h2>
      <input
        type="file"
        onChange={(e) => setSearchImage(e.target.files?.[0] || null)}
      />
      <br />
      <button onClick={searchItem}>Search</button>

      <pre style={{ marginTop: 20 }}>{JSON.stringify(result, null, 2)}</pre>
    </div>
  );
}
