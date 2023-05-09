To run app
npm install
npm install -g ts-node
npm install -g typescript
tsc
npm run start

Dokumentacja
Aplikacja umożliwia zarządzanie bazą szkoleń oraz użytkowników.

1. Applikacja pozwala na założenie konta użytkownika.
2. Użytkownik może zalogować się podając prawidłowe hasło i nazwę użytkownika tylko po wcześniejszej rejestracji.
3. Udane logowanie jest zapisane po stronie serwera jako sesja. Użytkownik otrzymuje jedynie identyfikator sesji, który będzie przechowywany w ciasteczku
4. Po udanym zalogowaniu użytkownik będzie miał dostęp do kolejnych zasobów takich jak - zmiana hasła, lista szkoleń, szeczegóły jednego szkolenia, dodawanie nowego szkolenia, aktualizowanie jednego szkolenia, usuwanie szkolenia.
5. Szkolenie składa się z następujących atrybutów: nazwa, data, instruktor, poziom szkolenia
    - Nazwa szkolenia jest dowolna
    - Data szkolenia to łańcuch znaków w formacie rrrr-mm-dd
    - Instruktor to Imię i Nazwisko instruktora
    - Poziom szkolenia: Dwie dopuszczalne wartości BASIC, ADVANCED
6. Jeden instruktor nie może prowadzić dwóch szkoleń w tym samym dniu.
7. Nie może istnieć szkolene ADVANCED, jeśli nie było wcześniej stworzonego szkolenia BASIC