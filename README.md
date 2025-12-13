# MemoDex – aplicație web pentru gestionarea notițelor

## 📌 Descriere
**MemoDex** este o aplicație web tip **Single Page Application (SPA)** care permite studenților să își organizeze notițele de curs și seminar.  
Platforma oferă un editor Markdown, suport pentru atașamente, organizare pe materii și tag-uri, funcții de partajare și gestionare a grupurilor de studiu.

---

## 🎯 Obiectiv
Oferirea unei soluții simple și eficiente pentru:
- luarea de notițe în timpul cursurilor/seminarelor  
- organizarea materialelor pe materii  
- colaborarea cu alți colegi și lucrul în grupuri de studiu  

---

# ✅ Funcționalități principale

### 🔐 Autentificare
- Login cu cont instituțional **@stud.ase.ro**

### 📝 CRUD complet
- Creare, Citire, editare, ștergere
- Editor **Markdown** cu preview

### 📎 Atașamente
- Încărcare imagini și documente
- Previzualizare în notiță

### 🗂 Organizare
- Materii  
- Tag-uri  
- Căutare după cuvinte-cheie  

### 🤝 Partajare & colaborare
- Share cu alți utilizatori

### 👥 Grupuri de studiu
- Creare grupuri
- Invitare membri
- Spațiu comun de notițe partajate

### 🌐 Conținut extern
- Embed YouTube și alte referințe la surse externe

---

# 🏗 Arhitectură tehnică

- **Frontend:** React (SPA)
- **Backend:** Node.js (Express/Nest)
- **Bază de date:** PostgreSQL
- **API:** REST
- **Autentificare:** OAuth2 / OpenID Connect

---

# 📚 Structură principală a datelor (simplificat)

- **User** – id, email, nume  
- **Note** – id, user_id, titlu, conținut_markdown, curs, data  
- **Tag** + **NoteTag**  
- **Attachment** – URL fișier  
- **Group** + **GroupMember**  
- **SharedNote** – permisiuni view/edit  

---

# 🛡 Cerințe non-funcționale
- Responsive (desktop / mobil / tabletă)
- Performanță ridicată (<1.5s)
- Securitate: protecție XSS/CSRF
- Backup zilnic și salvare periodică

---

# 📄 Licență
Acest proiect va fi utilizat ca temă de curs și proiect academic.
