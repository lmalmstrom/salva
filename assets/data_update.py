import json

# Ladataan tiedosto
with open("data.json", "r", encoding="utf-8") as f:
    data = json.load(f)

# Käydään lääkkeet läpi
for laake in data["Lääkkeet"]:
    nimi = laake.get("nimi", "tuntematon")

    while True:
        vastaus = input(f"Mistä lääke '{nimi}' tulee? (s = sairaala, a = asema): ").strip().lower()

        if vastaus == "s":
            laake["mistä"] = "sairaala"
            break
        elif vastaus == "a":
            laake["mistä"] = "asema"
            break
        else:
            print("Virheellinen vastaus. Kirjoita s tai a.")

# Tallennetaan muutokset takaisin tiedostoon
with open("data.json", "w", encoding="utf-8") as f:
    json.dump(data, f, ensure_ascii=False, indent=4)

print("Tiedot päivitetty onnistuneesti.")

