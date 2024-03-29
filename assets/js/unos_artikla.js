$(document).ready(() => {

    const barkod = $("#barkod");
    const errBarkod = $("#errBarkod");
    const naziv = $("#naziv");
    const errNaziv = $("#errNaziv");
    const opis = $("#opis");
    const errOpis = $("#errOpis");
    const vrsta = $("#vrsta");
    const osCena = $("#cena");
    const errCena = $("#errCena");
    const pdvCena = $("#pdv");
    const slika = $("#slika");
    const prikaz_slike = $("#prikaz_slike");
    const errSlika = $("#errSlika");
    const tabela = $('#tabela tbody');
    const pretraga = $('#pretraga');
    const obrisiBtn = $('#obrisi');


    function checkLocalStorage() {
        return localStorage.getItem('artikli') ? JSON.parse(localStorage.getItem('artikli')) : [];
    }

    function obaveznaPolja() {
        if (!barkod.val()) {
            errBarkod.text("Barkod je obavezan");
            barkod.addClass("bad-input");
        }
        if (!naziv.val()) {
            errNaziv.text("Naziv je obavezan");
            naziv.addClass("bad-input");
        }
    }

    //Prikaz slike
    function prikazSlike(input) {
        if (input.files && input.files[0]) {

            //uzimamo naziv slike
            let nazivSlike = input.files[0].name;
            //delimo string po "."
            let split = nazivSlike.split(".");
            //uzimamo poslednji deo jer se tu nalazi ekstenzija
            let ext = split[split.length - 1];

            if (ext.toLowerCase() === "png") {
                errSlika.text(nazivSlike);
                errSlika.removeClass("text-danger bad-input");
                slika.removeClass("bad-input");

                //FileReader objekat asinhrono cita sadrzaj fajla skoji se nalazi na korisnickom kompjuteru
                let reader = new FileReader();
                //kad je uspesno zavrseno citanje upisuje u src
                reader.onload = function (e) {
                    prikaz_slike.attr('src', e.target.result);
                }
                //cita sadrzaj fajla
                reader.readAsDataURL(input.files[0]);
            } else {
                errSlika.text("Slika mora da bude u png formatu");
                errSlika.addClass("text-danger bad-input");
                slika.addClass("bad-input");
            }
        }
    }

    //funkcija za dodavanje artikla u localstorage
    function addToLocalStorage() {

        let artikli = checkLocalStorage();
        //kreiramo novi artikl
        let artikl = new Artikl(barkod.val(), naziv.val(), opis.val(), vrsta.val(), osCena.val(), pdvCena.val(), prikaz_slike.attr("src"));
        artikli.push(artikl);
        localStorage.setItem('artikli', JSON.stringify(artikli));

    }

    //funkcija za ispis artikla
    function ispisArtikla(broj) {

        let artikli = checkLocalStorage();
        jQuery.each(artikli, function (index, artikl) {
            //proverava da li se ispisuju svi artikli ili samo jedan novi
            if (broj === 1 ? index == artikli.length - 1 : true) {
                let datum = new Date(artikl.datum);
                let cena = artikl.osCena ? parseInt(artikl.osCena).toFixed(2) : "";
                tabela.append(` <tr>
                            <td>${artikl.barkod}</td>
                            <td>${artikl.naziv}</td>
                            <td>${artikl.opis}</td>
                            <td>${artikl.vrsta}</td>
                            <td>${cena}</td>
                            <td>${artikl.pdvCena}</td>
                            <td><img class="td-slika" src="${artikl.slika}"></td>
                            <td>${datum.toLocaleString()}</td>
                            </tr>`
                );
            }
        })

    }
    //kreiranje klase za pravljenje objekata artikl
    class Artikl {

        constructor(barkod, naziv, opis, vrsta, osCena, pdvCena, slika) {
            this.barkod = barkod,
                this.naziv = naziv,
                this.opis = opis,
                this.vrsta = vrsta,
                this.osCena = osCena,
                this.pdvCena = pdvCena,
                this.slika = slika,
                this.datum = new Date()
        }
    }

    //Validacija podataka

    //ispisuje obavezna polja na pocetku    
    obaveznaPolja();

    //validacija polja u toku kucanja
    barkod.keyup(() => {
        if (!barkod.val()) {
            barkod.addClass("bad-input");
            errBarkod.text("Barkod je obavezan");
        } else if ($.isNumeric(barkod.val())) {
            barkod.removeClass("bad-input");
            errBarkod.text("");
        } else {
            barkod.addClass("bad-input");
            errBarkod.text("Barkod može da sadrži samo cifre");
        }
    });

    naziv.keyup(() => {
        if (!naziv.val()) {
            naziv.addClass("bad-input");
            errNaziv.text("Naziv je obavezan");
        } else {
            naziv.removeClass("bad-input");
            errNaziv.text("");
        }
    });

    opis.keyup(() => {
        if (opis.val().length > 200) {
            opis.addClass("bad-input");
            errOpis.text("Maksimalan broj karaktera je 200");
        } else {
            opis.removeClass("bad-input");
            errOpis.text("");
        }
    });

    osCena.keyup(() => {
        //proverava da li je unet broj intiger i number ili da li je prazno polje
        //stavio sam da pretrava u String jer .val() je vec string i ako se ukuca 12.000 nece biti isto kao 12, nece dozvoljavati ni 0 da se upisu kao decimale       
        if ((String(parseInt(osCena.val())) === osCena.val() && $.isNumeric(osCena.val())) || !osCena.val() || !vrsta.val()) {
            osCena.removeClass("bad-input");
            errCena.text("");
            //racuna cenu sa pdv i zaokruzuje na 2 decimale
            //proverava da li je prazna vrednost cene, ako jeste brise cenu sa pdv
            if (osCena.val() !== "") {
                let cenaSaPdv = (parseInt(osCena.val()) * 1.2).toFixed(2);
                pdvCena.val(cenaSaPdv);
            } else pdvCena.val("");
        } else {
            osCena.addClass("bad-input");
            errCena.text("Cena može da bude samo ceo broj, bez decimala");
        }
    });


    //prikaz slike
    $("#slika").change(function () {
        prikazSlike(this);
    });
    //ispisuje kad se ucitava stranica
    ispisArtikla();

    // kad se pritisne dugme za unos artikla
    $("#unos_artikla").submit(function (e) {
        e.preventDefault();
        //i ako su polje required, ovo je dodatna provera
        if (barkod.hasClass("bad-input") || naziv.hasClass("bad-input") || !barkod.val() || !naziv.val() || slika.hasClass("bad-input")) {
            alert("Niste uneli sve obavezne podatke");
            return;
        }

        //dodaje u localstorage
        addToLocalStorage();
        //ispisuje samo 1 artikl, onaj koji se sad napravio
        ispisArtikla(1);
        //resetovanje formulara
        $("#unos_artikla")[0].reset();
        prikaz_slike.attr('src', "");
        errSlika.text("");
        obaveznaPolja();
    });

    //filtriranje po nazivu
    pretraga.keyup(() => {

        let nazivPretraga = pretraga.val();
        let artikli = checkLocalStorage();

        let filter = artikli.filter((artikl) => {
            if ((artikl.naziv).toLowerCase().includes(nazivPretraga.toLowerCase())) {
                return artikl;
            }

        });
        //prazni tabelu da se ne bi redovi duplirali
        tabela.empty();
        jQuery.each(filter, function (index, artikl) {
            let datum = new Date(artikl.datum);
            let cena = artikl.osCena ? parseInt(artikl.osCena).toFixed(2) : "";
            tabela.append(` <tr>
                            <td>${artikl.barkod}</td>
                            <td>${artikl.naziv}</td>
                            <td>${artikl.opis}</td>
                            <td>${artikl.vrsta}</td>
                            <td>${cena}</td>
                            <td>${artikl.pdvCena}</td>
                            <td><img class="td-slika" src="${artikl.slika}"></td>
                            <td>${datum.toLocaleString()}</td>
                            </tr>`
            );
        })
    });

    obrisiBtn.click(function () {
        localStorage.removeItem('artikli');
        tabela.empty();
    });
});