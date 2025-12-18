document.addEventListener('DOMContentLoaded', async () => {
    
    // 1. INITIALISATION DE LA "BASE DE DONNÉES"
    let usersDB = localStorage.getItem('travelo_utilisateur_donnees');

    if (!usersDB) {
        // Si pas de données en mémoire, on charge le fichier JSON initial
        try {
            const response = await fetch('../destinations/utilisateurs.json'); 
            const data = await response.json();
            
            localStorage.setItem('travelo_utilisateur_donnees', JSON.stringify(data));
            usersDB = data;
        } catch (error) {
            console.error("Erreur chargement utlisateurs.json", error);
            usersDB = [];
        }
    } else {
        usersDB = JSON.parse(usersDB);
    }

    // 2. VÉRIFICATION DE LA SESSION
    const connectedUserEmail = localStorage.getItem('travelo_utilisateur_actuel');
    
    if (connectedUserEmail) {
        const currentUser = usersDB.find(u => u.email === connectedUserEmail);
        if (currentUser) {
            afficherProfil(currentUser);
        } else {
            afficherLogin();
        }
    } else {
        afficherLogin();
    }

    // 3. GESTION DU LOGIN
    const loginForm = document.getElementById('login-form');
    const errorMsg = document.getElementById('login-error');
    
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const emailInput = document.getElementById('email').value;
            const passInput = document.getElementById('password').value;

            // On recharge la DB pour être sûr d'avoir les dernières infos
            const currentDB = JSON.parse(localStorage.getItem('travelo_utilisateur_donnees') || '[]');
            const userFound = currentDB.find(u => u.email === emailInput && u.password === passInput);

            if (userFound) {
                // SUCCÈS
                localStorage.setItem('travelo_utilisateur_actuel', userFound.email);
                
                // On cache l'erreur si elle était visible
                if(errorMsg) errorMsg.classList.add('hidden');
                
                afficherProfil(userFound);
            } else {
                // On affiche l'erreur
                if(errorMsg) errorMsg.classList.remove('hidden');
            }
        });
    }

    // 4. GESTION DU LOGOUT
    const btnLogout = document.getElementById('btn-logout');
    if (btnLogout) {
        btnLogout.addEventListener('click', () => {
            localStorage.removeItem('travelo_utilisateur_actuel');
            location.reload(); 
        });
    }
});

// FONCTIONS D'AFFICHAGE 

function afficherLogin() {
    document.getElementById('login-view').classList.remove('hidden');
    document.getElementById('profile-view').classList.add('hidden');
}

function afficherProfil(user) {
    document.getElementById('login-view').classList.add('hidden');
    document.getElementById('profile-view').classList.remove('hidden');

    document.getElementById('user-name').innerText = user.nom;
    document.getElementById('user-email').innerText = user.email;

    const container = document.getElementById('historique-container');
    container.innerHTML = '';

    // Gestion de l'affichage de l'historique
    if (user.historique && user.historique.length > 0) {
        document.getElementById('no-history').classList.add('hidden');

        [...user.historique].reverse().forEach(voyage => {
            const div = document.createElement('div');
            div.className = 'recap_box'; 
    
            // Formatage de la date si nécessaire
            let dateAffiche = voyage.date; 
            
            div.innerHTML = `
                <h3>${voyage.destination}</h3>
                <p>Départ le : ${dateAffiche}</p>
                <div class="prix-article">${voyage.prix} €</div>
            `;
            container.appendChild(div);
        });
    } else {
        document.getElementById('no-history').classList.remove('hidden');
    }
}