---
layout: post
date: 2025-03-24 07:12:46 +0000
categories: synths
title: "PicoStepSeq"
author: "Tod Kurt"
link: https://github.com/todbot/picostepseq
demo: https://www.youtube.com/watch?v=jm5V9wdTMXQ
pic: ../pics/picostepseq.jpg
description: "8-step MIDI sequencer"
ata-rating: 5
artifacts:
  - Schematic: true
  - PCB: true
  - BOM: true
  - FW: true
  - Docs: false
  - Enclosure: true
tags: [MIDI,PiPico,Sequencer]
level: Intermediate
---

RP2040-based sequencer made with CircuitPython. In use, PicoStepSeq has two states: Play and Pause. It is designed so you never have to stop playing to edit and save/load a sequence. It has 8 sequence slots that can be edited and are persistently saved to flash.

Other projects from Tod:
- [Picotouch synth](https://github.com/todbot/picotouch_synth)
- [Qtpy synth](https://github.com/todbot/qtpy_synth)