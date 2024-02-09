# APP
   
 GymPass Style app.
     
## RFs (Requesitos funcionais)

-[x] Deve ser possivel se cadastrar;;
-[x] Deve ser possivel se autenticar;
-[x] Deve ser possivel obter o perfil de um usuário logado;
-[x] Deve ser possivel obter o numero de check-ins realizados pelo usário logado;
-[x] Deve ser possivel o usário obter seu histórico de check-ins;
-[x] Deve ser possivel o usario buscar academias proximas (até 10km);
-[x] Deve ser possivel o usuário buscar academia pelo nome;
-[x] Deve ser possivel o usuário realizar check-in em uma academia;
-[x] Deve ser possivel validar o check-in de um usario;
-[x] Deve ser possivel cadastrar uma academia; 
   	
## RNs (Regras de negócio)

-[x] O usuário não deve se cadastrar com um email duplicado;
-[x] O uauário não pode fazer 2 check-in no mesmo dia;
-[x] O usuário não pode fazer check-in se não estiver perto (100m) da academia;
-[x] O check-in só pode ser validado ate 20 minutos apos criado;
-[] O check-in so pode ser validado por administradores;
-[] A academia só pode ser cadastrada por administradores;
    	 
## RNFs (Requisitos não-funcionais)
       
-[x] A senha do usuario precisa estar criptografada;
-[x] Os dados da aplicação precisam estar persistidos em um banco PostgressSQL;
-[x] Todas listas de dados precisam estar paginadas com 20 item por página;
-[] O usuário deve ser identificado por um JWT (JSON Web Token);

## Setup
- run "docker compose up -d"