# APRS Symbol Index

All symbols in the `meridian-aprs-symbols` icon set. The full APRS set (~200 symbols) will be added in a future release.

| APRS Code | Name       | Category       | Filename    | Description                        |
|-----------|------------|----------------|-------------|------------------------------------|
| `/-`      | House      | infrastructure | house       | Fixed station / home               |
| `/>`      | Car        | vehicles       | car         | Mobile station / vehicle           |
| `/[`      | Person     | people         | person      | Portable station / person on foot  |
| `/#`      | Digipeater | infrastructure | digipeater  | APRS digipeater / repeater node    |
| `/_`      | Weather    | weather        | weather     | Weather station                    |
| `/W`      | Winlink    | communications | winlink     | Winlink gateway / email node       |

## Notes

- All symbols in this release are from the **primary** APRS symbol table (prefix `/`).
- Alternate table symbols (prefix `\`) will be added in a future release.
- APRS codes follow the two-character convention: table prefix + symbol character.
- Source SVGs are in `src/primary/` and `src/alternate/`.
- Machine-readable index: `symbols.json`
