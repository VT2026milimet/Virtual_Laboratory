/* ============================================================
   REAGENTS MANAGER V1.4 - FIXED DISPLAY
   ============================================================ */

const Reagents = {
    inventory: [
        { id: "hcl", name: "Axit Clohidric", formula: "HCl", file: "hcl.jpg" }
    ],

    render: function(id) {
        const item = this.inventory.find(i => i.id === id);
        if (!item) return "";
        // Lưu ý: Hãy đảm bảo file hcl.jpg nằm trong assets/chemicals/
        const imagePath = `assets/chemicals/${item.file}`;

        return `
            <div class="reagent-bottle" id="reagent-${id}">
                <img src="${imagePath}" 
                     alt="${item.name}"
                     style="width: 200px; height: 250px; object-fit: contain; display: block;"
                     onerror="this.src='https://cdn-icons-png.flaticon.com/512/1048/1048953.png'; this.style.width='100px';">
            </div>`;
    }
};