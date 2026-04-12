import json
import os

DATA_FILE = "data.json"


def kysy_mista(nimi: str) -> str:
    while True:
        vastaus = input(
            f"Lääke '{nimi}': mistä? (a/asema, s/sairaala): "
        ).strip().lower()

        if vastaus in ("a", "asema"):
            return "asema"
        if vastaus in ("s", "sairaala"):
            return "sairaala"

        print("Virheellinen syöte. Anna a, asema, s tai sairaala.")


def lataa_json(polku: str) -> dict:
    if not os.path.exists(polku):
        raise FileNotFoundError(f"Tiedostoa ei löytynyt: {polku}")

    with open(polku, "r", encoding="utf-8") as f:
        return json.load(f)


def tallenna_json(polku: str, data: dict) -> None:
    with open(polku, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)


def main() -> None:
    try:
        data = lataa_json(DATA_FILE)
    except Exception as e:
        print(f"Virhe tiedostoa luettaessa: {e}")
        return

    if "Laakkeet" not in data or not isinstance(data["Laakkeet"], list):
        print("Virhe: 'Laakkeet' puuttuu tai ei ole lista.")
        return

    for laake in data["Laakkeet"]:
        if not isinstance(laake, dict):
            continue

        nimi = laake.get("nimi", "tuntematon")

        # kysy mistä
        laake["mistä"] = kysy_mista(nimi)

        # lisää exp tyhjänä (jos ei jo ole)
        laake["exp"] = ""

    try:
        tallenna_json(DATA_FILE, data)
        print("Muutokset tallennettu.")
    except Exception as e:
        print(f"Tallennus epäonnistui: {e}")


if __name__ == "__main__":
    main()
