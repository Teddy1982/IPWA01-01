let data = [];

async function loadJSON() {
    try {
        const response = await fetch("../data/data.json"); // Pfad zur JSON-Datei
        if (!response.ok) {
            throw new Error('Fehler beim Laden der JSON-Datei');
        }
        data = await response.json(); // JSON in ein JavaScript-Objekt umwandeln
        createTableFromJSON();
    } catch (error) {
        console.error('Fehler:', error);
    }
}

let rankSort = true;
let orgSort = false;
let countrySort = false;

function createTableFromJSON() {
    const search = document.getElementById('search').value.toLowerCase();

    if (!data || data.length === 0) {
        console.error("Daten sind leer oder nicht definiert.");
        return;
    }

    const table = document.createElement('table');
    table.border = "1"; // Optional: Tabelle mit Rahmen

    // Tabellenkopf (thead) erstellen
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');
    const keys = Object.keys(data[0]); // Schlüssel des ersten Objekts nehmen

    keys.forEach(key => {
        const th = document.createElement('th');
        th.textContent = key;
        th.style.border = "1px solid black"; // Optional: Rahmen für die Tabellenkopfzellen
        th.style.backgroundColor = "blue"; // Optional: Hintergrundfarbe für die Tabellenkopfzellen
        th.style.color = "white"; // Optional: Textfarbe für die Tabellenkopfzellen
        th.style.padding = "10px"; // Optional: Innenabstand für die Tabellenkopfzellen
        headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);
    table.appendChild(thead);

    // Tabellenkörper (tbody) erstellen
    const tbody = document.createElement('tbody');

    // Daten filtern, die das Suchwort enthalten
    const filteredData = data.filter(item => 
        keys.some(key => 
            String(item[key]).toLowerCase().includes(search)
        )
    );

    let rank1 = false;
    let rank25 = false;
    let rank50 = false;
    let rank75 = false;

    // Gefilterte Daten in die Tabelle einfügen
    filteredData.forEach(item => {
        const row = document.createElement('tr');
        keys.forEach(key => {
            const td = document.createElement('td');         
            td.textContent = item[key];
            td.style.borderLeft = "1px solid black"; // Optional: Rahmen für die Tabellenkopfzellen
            td.style.borderRight = "1px solid black"; // Optional: Rahmen für die Tabellenkopfzellen
            
            if(item.Rank >= 1 && !rank1) {
                row.setAttribute('id', '1');
                rank1 = true;
            }
            if(item.Rank >= 25 &&  !rank25) {
                row.setAttribute('id', '25');
                rank25 = true;
            }
            if(item.Rank >= 50 && !rank50) {
                row.setAttribute('id', '50');
                rank50 = true;
            }
            if(item.Rank >= 75 &&  !rank75) {
                row.setAttribute('id', '75');
                rank75 = true;
            }
            row.appendChild(td);
        });
        tbody.appendChild(row);
    });

    table.appendChild(tbody);

    document.getElementById('table-container').innerHTML = ''; // Alten Inhalt löschen
    
    // Tabelle in das Dokument einfügen
    document.getElementById('table-container').appendChild(table);
}

// Funktion zur Überprüfung, ob das Dokument in einer RTL-Sprache ist
function isRTL() {
    const lang = document.documentElement.getAttribute('lang');
    const rtlLanguages = ['ar', 'he', 'fa', 'ur', 'yi', 'dv', 'ps', 'syr'];
    if (lang) {
        const langCode = lang.split('-')[0].toLowerCase();
        return rtlLanguages.includes(langCode);
    }

    return false;
}

function updateLayout() {
    setInterval(function() {
        if (window.innerWidth > 768) {
            document.getElementById('link1').innerText = 'Platz 1 und aufwärts';
            document.getElementById('link2').innerText = 'Platz 25 und aufwärts';
            document.getElementById('link3').innerText = 'Platz 50 und aufwärts';
            document.getElementById('link4').innerText = 'Platz 75 und aufwärts';
        } else {
            document.getElementById('link1').innerText = '1 >';
            document.getElementById('link2').innerText = '25 >';
            document.getElementById('link3').innerText = '50 >';
            document.getElementById('link4').innerText = '75 >';
        }
    }, 1000);
}

function addEventHandler() {
    document.getElementById('rankSort').addEventListener('click', function() {
        data.sort((a, b) => a["Rank"] - b["Rank"]);
        createTableFromJSON()
    });
    document.getElementById('organisationSort').addEventListener('click', function() {
        data.sort((a, b) => a["Unternehmen"].localeCompare(b["Unternehmen"]));
        createTableFromJSON()
    });
    document.getElementById('countrySort').addEventListener('click', function() {
        data.sort((a, b) => a["Land"].localeCompare(b["Land"]));
        createTableFromJSON()
    });

    document.getElementById('searchdelete').addEventListener('click', function() {
        document.getElementById('search').value = ''; // Leere den Suchbegriff
        createTableFromJSON();
    });

    document.getElementById('search').addEventListener('input', function() {
        createTableFromJSON(); // Ruft die Funktion zur Aktualisierung der Tabelle auf
    });

    document.getElementById('sidebarleft').addEventListener('click', function() {
        document.getElementById('sidebar').className ='sidebar-left';
    });

    document.getElementById('sidebarright').addEventListener('click', function() {
        document.getElementById('sidebar').className = 'sidebar-right';
    });

    document.getElementById('button-datenschutz').addEventListener('click', function() {
        document.getElementsByClassName('datenschutz')[0].classList.toggle('hidden');
    });
     
    document.getElementById('button-impressum').addEventListener('click', function() {
        document.getElementsByClassName('impressum')[0].classList.toggle('hidden');
    });
}



window.addEventListener('load', function() {
    loadJSON();

    addEventHandler();

    if (isRTL()) {
        document.getElementById('sidebar').className = 'sidebar-right';
    } else {
        document.getElementById('sidebar').className ='sidebar-left';
    }

    updateLayout();
});