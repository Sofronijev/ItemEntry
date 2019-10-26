$(document).ready(() => {

    let barkod = $("#barkod");
    let errBarkod = $("#errBarkod");
    let naziv = $("#naziv");
    let errNaziv = $("#errNaziv");
    let opis = $("#opis");
    let errOpis = $("#errOpis");
    let vrsta = $("#vrsta");
    let osCena = $("#cena");
    let errCena = $("#errCena");
    let pdvCena = $("#pdv");
    let slika = $("#slika");
    let errSlika = $("#errSlika");


    function checkLocalStorage() {
        return localStorage.getItem('artikli') ? JSON.parse(localStorage.getItem('artikli')) : [];
    }


    //Proverava da li postoji nesto u localstorige, ako ima cuva podatke ako je prazno pravi prazan niz
    let artikli = checkLocalStorage();
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
    if (!barkod.val()) {
        errBarkod.text("Barkod je obavezan");
        barkod.addClass("bad-input");
    }
    if (!naziv.val()) {
        errNaziv.text("Naziv je obavezan");
        naziv.addClass("bad-input");
    }

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
        if ((String(parseInt(osCena.val())) === osCena.val() && $.isNumeric(osCena.val())) || !osCena.val()) {
            osCena.removeClass("bad-input");
            errCena.text("");
            //racuna cenu sa pdv i zaokruzuje na 2 decimale
            //proverava da li je prazna vrednost cene, ako jeste brise cenu sa pdv
            if (osCena.val() !== "") {
                let cenaSaPdv = (parseInt(osCena.val()) * 1.2).toFixed(2);
                console.log(typeof (cenaSaPdv));
                pdvCena.val(cenaSaPdv);
            } else pdvCena.val("");
        } else {
            osCena.addClass("bad-input");
            errCena.text("Cena može da bude samo ceo broj, bez decimala");
        }
    });

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
                errSlika.removeClass("text-danger");
                var reader = new FileReader();

                reader.onload = function (e) {
                    $('#prikaz-slike').attr('src', e.target.result);
                }

                reader.readAsDataURL(input.files[0]);
            } else {
                errSlika.text("Slika mora da bude u png formatu");
                errSlika.addClass("text-danger");
            }
        }
    }

    $("#slika").change(function () {
        prikazSlike(this);
    });



    $("#unos_artikla").submit(function (e) {
        e.preventDefault();

        console.log(slika);

    });

});