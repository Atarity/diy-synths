---
layout: page
title: About
permalink: /about/
---

Hey, I'm [Misha](https://github.com/Atarity) 👋. I have quite a bit of experience building open-source synthesizers based on schematics found in the depths of the internet. I created this site to compile dozens of open-source designs into kind a database, making it easier for anyone looking to build their first synthesizer to choose a suitable project without additional research.

The list is constantly expanding with projects that I curate. If a project is listed on the site, it doesn't necessarily mean I've built it (though I've assembled more than two dozen of them), but it does mean I've verified that all the necessary build files are available, published by their authors, and accessible to everyone.

>Search, sort, check video. Find your next weekend project. Have fun!

## Updates and RSS
The best way to stay updated is to subscribe to the [RSS feed]({{ site.baseurl }}/feed.xml). If you're a GitHub rat, you can also follow the [repository](https://github.com/Atarity/diy-synths) updates.

## How to submit a design, report a mistake or suggest an edit?
Write about it in the repo [discussions](https://github.com/Atarity/diy-synths/discussions) or just in comments section below. Or make a [repo](https://github.com/Atarity/diy-synths) fork, create a file in the `_posts/` directory then submit a PR. Maybe I'll make a form for submission later. But not today 😀.

## Why project "X" not in the list?
You can find some of the projects was checked but not in the list due to different reasons. I'm trying to track such a projects on the [Watchlist page](/watchlist).

Not all projects in the database are synthesizers: there are also arpeggiators, sequencers, MIDI controllers, and more. Almost all devices are **standalone** units, meaning they
- have their own physical interface (pots, buttons, faders, etc) or at least MIDI interface.
- have their own power supply
- don’t require external control voltage to function.

The minimum criteria for adding to the database are:
- The project must have published schematics. For simple synths hand-drawn schematics, or Fritzing-like diagrams/photos is ok.
- For digital devices with a microcontroller, a firmware source code must be available.
- Video demonstration is a must.

❌ Please NO:
- Eurorack modules. Eurorack are a bottomless rabbit hole, and maintaining such a massive list would take a lot of time.
- Hardware "platforms" with no physical interfaces but with tons of software tools to do smth fun.
- "Buy 10 modules on Aliexpress and connect with breadboard" designs. Using noname modules with no declared EoL might be good for prototyping, but not for open designs. I see low value in such a designs even if they packed with a great software.
- Projects with no PCB layout source **and** with no Gerbers published at a same time. It is not meaning they'll be declined immediately, but c'mon: that is not how to cook open-source hardware.

✅ Hell YES:
- "Everything in one GitHub repo" projects. Files telling more than fancy websites.
- Projects with Mouser (or any other components reseller) cart published. It saves a lot of time and money for the beginners.
- Modern recreations of old hardware.
- Unusual, fun to build, to interact, to explore or to learn projects. I'm talking about things like [Norns Studies](https://monome.org/docs/norns/studies/) for [Norns Shield](/synths/norns-shield), exhausting yet rewarding 6 analog voices design of [Ambika](/synths/ambika), absolute joy of strumming with [Le Strum](/synths/le-strum), or deeply scientific architecture of [Hypjolin](/synths/hypjolin).

While above rules is the core for my decision making, there is always exceptions.
 
{% include comments.html %}