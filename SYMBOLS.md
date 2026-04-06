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
| `/&`      | Igate        | infrastructure | HF/internet gateway — very common  |
| `/k`      | Truck        | vehicles       | Pickup truck                       |
| `/b`      | Bicycle      | vehicles       |                                    |
| `/s`      | Boat/Ship    | vehicles       | Sailing vessel                     |
| `/^`      | Airplane     | vehicles       | Large aircraft                     |
| `/O`      | Balloon      | vehicles       | Weather/hobby balloon              |
| `/;`      | Campground   | infrastructure | Tent / campsite                    |
| `/R`      | Recreational vehicle | vehicles | RV / camper                  |
| `/+`      | Red Cross    | infrastructure | Hospital / medical cross           |
| `/f`      | Fire Station | infrastructure |                                    |

### Tier 2 — Infrastructure (complete the network picture)

| APRS Code | Name          | Category       | Notes                              |
|-----------|---------------|----------------|------------------------------------|
| `/r`      | Antenna       | infrastructure | Radio antenna / repeater           |
| `/Y`      | Yacht         | vehicles       | Larger sailing vessel              |
| `/a`      | Ambulance     | infrastructure |                                    |
| `/h`      | Hospital      | infrastructure | Building with H                    |
| `/u`      | 18-wheeler    | vehicles       | Semi truck                         |
| `/j`      | Jeep          | vehicles       | 4WD vehicle                        |
| `/p`      | Phone         | communications |                                    |
| `/e`      | Eyeball       | people         | "I'm here" event marker            |
| `/X`      | Helicopter    | vehicles       |                                    |
| `/g`      | Glider        | vehicles       |                                    |

### Tier 3 — Specialty (meaningful for APRS power users)

| APRS Code | Name          | Category       | Notes                              |
|-----------|---------------|----------------|------------------------------------|
| `/\'`     | Crash site    | infrastructure | Airplane crash site (alternate)    |
| `/=`      | Railroad      | vehicles       | Train / railroad engine            |
| `/S`      | Satellite     | infrastructure | Space station                      |
| `/`       | Thunderstorm  | weather        |                                    |
| `/`       | Snow          | weather        |                                    |
| `/J`      | Jogger        | people         | Runner on foot                     |
| `/B`      | Blowing snow  | weather        |                                    |
| `/T`      | Tornado       | weather        |                                    |
| `/c`      | Incident command | infrastructure | ICS command post                |

### Alternate Table

Alternate table symbols (prefix `\`) mirror the primary table but carry overlaid identifiers. These will be added after the primary table is substantially complete.
