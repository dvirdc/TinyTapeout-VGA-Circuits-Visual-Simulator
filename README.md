# TinyTapeout Circuits Visual Simulator (Generic GDS)

This fork extends the original VGA-focused simulator to support any GDS design. You can now load a `.bin` exported from `parse_gds.py` and optionally provide a JSON configuration to define clock/reset pins, inputs, VGA mapping (if present), and on-screen probes.

## Usage

- Place your exported `project.bin` in `gds/` (see exporter below).
- Optionally place `gds/project.config.json` or add an entry to `gds/config.json`.
- Open `index.html` and select your project.

## Configuration

Per-project config file: `gds/<project>.config.json` (or a global `gds/config.json` mapping from project name to config).

Example (VGA design):

```
{
  "visualization": "vga",
  "pins": { "clock": "clk", "reset_n": "rst_n", "enable": "ena" },
  "vga": {
    "r1": "uo_out[0]", "g1": "uo_out[1]", "b1": "uo_out[2]",
    "vsync": "uo_out[3]", "r0": "uo_out[4]", "g0": "uo_out[5]",
    "b0": "uo_out[6]", "hsync": "uo_out[7]"
  },
  "inputPins": ["ui_in[0]", "ui_in[1]"],
  "probes": ["uo_out[0]", "uo_out[7]"]
}
```

Example (generic design):

```
{
  "visualization": "generic",
  "pins": { "clock": "clk", "reset_n": "rst_n" },
  "inputPins": ["A", "B", "C"],
  "probes": ["SUM", "COUT"]
}
```

Notes:
- `visualization` can be `generic` (only circuit heatmap) or `vga` (adds VGA scanline view).
- `inputPins` creates checkboxes to toggle digital inputs at runtime.
- `probes` shows live 0/1 values for listed pins.

## Exporting from GDS

Use `parse_gds.py` to produce the `.bin` asset. This script tries to infer gates and wires from geometry and labels.

```
python3 parse_gds.py
```

It now exports all labeled pins except power rails, so you can reference them in configs.

# TinyTapeout VGA Circuits Simulator

[znah.net/tt09](https://znah.net/tt09)
