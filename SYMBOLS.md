# APRS Symbol Index

All symbols in the `meridian-aprs-symbols` icon set. The full APRS set (~200 symbols) will be added incrementally — see the roadmap below for implementation order.

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

---

## Implementation Roadmap

Symbols are prioritized by how commonly they appear on live APRS maps. Tier 1 provides enough coverage to integrate into Meridian APRS for real-world testing.

### Tier 1 — Core (show up on every map)

| APRS Code | Name         | Category       | Notes                              |
|-----------|--------------|----------------|------------------------------------|
| `/&`      | Igate        | infrastructure | Internet gateway — very common     |
| `/k`      | Truck        | vehicles       |                                    |
| `/b`      | Bicycle      | vehicles       |                                    |
| `/s`      | Boat/Ship    | vehicles       | Sailboat                           |
| `/^`      | Airplane     | vehicles       | Light aircraft                     |
| `/O`      | Balloon      | vehicles       | Weather/hobby balloon              |
| `/`       | Motorcycle   | vehicles       |                                    |
| `/R`      | RV/Camper    | vehicles       | Recreational vehicle               |
| `/+`      | Hospital     | infrastructure | Cross / medical                    |
| `/f`      | Fire Station | infrastructure |                                    |

### Tier 2 — Infrastructure (complete the network picture)

| APRS Code | Name          | Category       | Notes                              |
|-----------|---------------|----------------|------------------------------------|
| `/I`      | APRS-IS Server| infrastructure | Internet server node               |
| `/T`      | Antenna/Tower | infrastructure | Relay tower                        |
| `/r`      | Antenna       | infrastructure | Radio antenna                      |
| `/Y`      | Yacht         | vehicles       | Larger boat                        |
| `/p`      | Shelter       | infrastructure | Emergency shelter                  |
| `/!`      | Police        | infrastructure |                                    |
| `/E`      | Eyeball       | people         | "I'm here" event marker            |
| `/`       | Gateway       | communications | RF-to-internet gateway             |

### Tier 3 — Specialty (meaningful for APRS power users)

| APRS Code | Name        | Category       | Notes                              |
|-----------|-------------|----------------|------------------------------------|
| `/X`      | Helicopter  | vehicles       |                                    |
| `/'`      | Small Plane | vehicles       |                                    |
| `/u`      | Bus         | vehicles       |                                    |
| `/=`      | Train       | vehicles       | Railroad engine                    |
| `/g`      | Drone/UAV   | vehicles       |                                    |
| `/S`      | Satellite   | infrastructure |                                    |
| `/`       | Thunderstorm| weather        |                                    |
| `/`       | Snow        | weather        |                                    |
| `/`       | Earthquake  | weather        |                                    |

### Alternate Table

Alternate table symbols (prefix `\`) mirror the primary table but carry overlaid identifiers. These will be added after the primary table is substantially complete.
