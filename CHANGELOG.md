# Change Log

## Middle Kingdom - v10 -> main branch

### 2.21.1 - April 20, 2025 - Config Settings fix for Foundry 13
- [BUGFIX] Adapted to support HTML changes in config settings for Foundry 13 while still supporting Foundry 12.

### 2.21.0 - April 12, 2025 - Updates for Spanish and CoC7
- [FEATURE] Updated Spanish translations - thanks, lozonje!
- [FEATURE] CoC7 light sources - thanks again, lozonje!

### 2.20.2 - March 26, 2025 - Foundry 13 readiness 
- [BUGFIX] Provided translation for Torch tooltip on HUD
- [INTERNAL] Bumped support to include all builds of Foundry 13
- [BUGFIX] Included "Produce Flame" cantrip in DnD5e set of predefined light sources

### 2.20.1 - January 25, 2025 - Config changes for fallback now immediately honored
- [BUGFIX] Fallback light source no longer requires a system reload to update  (#100)

### 2.20.0 - January 19, 2025 - Added hook for torch changes
- [FEATURE] Added hooks "torch.changed" and "torch.selected" so macros can respond to torch changes.

### 2.19.0 - January 18, 2025 - Updated German translation
- [FEATURE] German translation updated with 8 strings - thanks, MKBraun!

### 2.18.0 - January 12, 2025 - Dim/Bright config is now purely fallback
- [FEATURE] Eliminated confusing name/bright/dim override setting.
  * On systems that have no sources configured, a source with this name and those light values becomes the sole source.
  * On systems that have sources configured, the name specifies which source to use by default, rather than "just picking one." (The dim/bright values are completely ignored on these systems.)

### 2.17.0 - January 11, 2025 - Ignore Equipment flag
- [FEATURE] New config flag to completely ignore user equipment. Users can turn on any light source defined for the system.
- [FEATURE] Rearranged config settings in preparation for give the last three settings a clearer role.
- [INTERNAL] Tested and adjusted to work both with v12 and with early builds of v13.

### 2.16.0 - October 20, 2024 - Token HUD light source tooltips
- [FEATURE] Tooltips for the light sources are now much easier to read (and they don't disappear altogether in v13 proto 1. Now using standard Foundry tooltips.)
- [INTERNAL] This module appears to work fine in v13.332, but is likely to break and need adjustment when Token HUD becomes a v2 app later in the v13 development cycle. The maximum version has been set accordingly. 

### 2.15.1 - September 2, 2024 - Better error message for missing user sources file
- [BUGFIX] The error message for a missing user sources file was cryptic - now just tells you
- [BUGFIX] The fallbacks for lights as object to array and for missing states property weren't working

### 2.15.0 - September 2, 2024 - Worlds Without Number support and OSE cleanups
- [FEATURE] Now supports Worlds Without Number (thanks, @fuzzymuzzi)
- [FEATURE] Now supports Everyday Heroes
- [BUGFIX] Adjustment to sources list for OSE light sources (thanks, @Andrew-Staggs)

### 2.14.0 - August 10, 2024 - Italian translation added
- [FEATURE] Italian translation provided (Thanks, @GregoryWarn)

### 2.13.1 - May 25, 2024 - Brazilian Portuguese updated
- [FEATURE] Completed Brazilian Portuguese translation

### 2.13.0 - May 12, 2024 - User light sources UX improvements
- [FEATURE] Using JSON5 for looser rules - comments, trailing commas, whitespace, continuation
- [FEATURE] Validating light source JSON against schema
- [FEATURE] Feedback you can act upon when light source JSON is invalid 
- [FEATURE] Added support for light sources in YAML format

### 2.12.0 - April 20, 2024
- [FEATURE] Verified on V12 developer release but still works fine in V11.
- [BUGFIX] Cleaned up V12 deprecation on Dancing Lights implementation.

### 2.11.1 - February 3, 2024
- [BUGFIX] (StormDarkwood) Fixed Dragonbane lighting *back* to what it should be. (It's in meters, not grids.)
- [BUGFIX] (spikedshrike) Flashlight angle on SWADE was bugged - 3 degrees shipped should be 6 degrees (for 10:1 beam) or possible 53 degrees (for cone) - seeking clarification.
- [BUGFIX] (Lupestro) After consultation with others, fixed GURPS beam angles from 3 to 6 degrees as well.
- [INTERNAL] Adding build and release automation to make process of delivering a new version closer to "pull the lever"

### 2.11.0 - October 8, 2023
- [FEATURE] (brantai) Added support for demonlord system
- [BUGFIX] (dataCobra) Dragonbane lighting fixes
- [BUGFIX] (Lupestro) Fix typo in additional light sources sample in README.md

### 2.10.0 - Sept 30, 2023
- [FEATURE] (Beff42) German translation now complete - plus Close button now localized
- [FEATURE] (Beff42) Corrections to dimensions of Paizo cones and Dancing Lights for Starfinder. Many thanks to Beff42 for all the things!
- [FEATURE] (WallaceMcGregor) Spanish translation now complete. Many thanks!
- [FEATURE] (dataCobra) Light sources now supplied for Dragonbane

### 2.9.0 - Sept 17, 2023
- [FEATURE] (doumoku) Japanese translation now provided. Many thanks, doumoku!
- [BUGFIX] (Lupestro) The light sources delivered with the module are now all reflected accurately in the README.

### 2.8.0 - August 12, 2023
- [FEATURE] (Daverd-GM) Provided light sources for "Reclaiming the Wild".
- [FEATURE] (Lupestro) When user has no light sources, a question mark icon comes up instead of the flame icon, opening a dialog explaining what to do.
- [FEATURE] (Lupestro) When a light source is exhausted, clicking the slashed out flame opens a dialog that describes what to do.
- [FEATURE] (Lupestro) Supplied an API of async functions that can be used by macros. Many thanks to Tarubain for the suggestion.
- [BUGFIX] (Lupestro) Fixed problem with unlinked tokens, which no longer have an actor property at all.
- [BUGFIX] (Feldherren) Corrected light source name for "Torches" for OSE.

### 2.7.0 - June 2, 2023
- [FEATURE] (Lupestro) Bumped to install on FoundryVTT 11

### 2.6.0 - February 26, 2023
- [FEATURE] (amir-arad) Added support for Old School Essentials (ose) and for quantities within objects. (PR #46 Thanks!)
- [BUGFIX] (Lupestro) GM escalation is now only invoked for the named light source on the intended game system. The only implemented example of this to date is token creation/deletion for Dancing Lights on dnd5e. (Behavior when aliasing the name of one of these _in the same game system_ to be used for something else is undefined.) (Issue #40)

### 2.5.0 - February 18, 2023
- [FEATURE] (Unomagan) Added light sources for Starfinder

### 2.4.0 - January 2, 2023
- [FEATURE] (Aymeeric) Updated French translation (now at 100%)

### 2.3.0 - December 10, 2022
- [FEATURE] (Lupestro) Now supporting Dungeon Crawl Classics. Many thanks to marcusadmortati for supplying the data and testing. 

### 2.2.2 - December 9, 2022
- [BUGFIX] (MrPrimate) Didn't load light sources properly if 
Foundry was not at root of site. (Thanks MrPrimate for the PR!)

### 2.2.1 - December 8, 2022
- [BUGFIX] (Lupestro) Fixed URLs in manifest to point to /main/ not /v10/. (Thanks ckdragons for heads-up.)

### 2.2.0 - December 6, 2022
- [FEATURE] (Lupestro) Updated README for clarity in creating user settings. (Issue #27 - many participants)
- [FEATURE] (Lupestro) Improved and simplified source JSON syntax with defaults for most fields. (Issue #27 - many participants)
  * This change shouldn't invalidate any existing light source JSON files.
- [FEATURE] (Lupestro) Introduced aliases to JSON to give new names to light sources defined elsewhere.
  * Using this in a very simple custom JSON will make this module more useful to those who play in a non-English language.
- [FEATURE] (Lupestro) Provided aliases for dnd5e light sources that should provide smoother integration with ddb-importer. (Issues raised by MrPrimate and emmoth)
- [FEATURE] (Lupestro) Improved name and description of options for consuming torches, candles, etc. to avoid confusion. (In response to comments by vgeirnaert)

I'm looking at loading localized language JSON files for the out-of-the-box sources on startup in a future release. This will need the actual (i.e. matching letter-by-letter) light source names used in various games when played in different languages. Contact me if you play with light sources in another language and you're interested in helping out.

### 2.1.4 - December 4, 2022
  - [BUGFIX] (Lupestro) DnD5e Bullseye Lantern had wrong dim/bright ranges due to copy/paste error. (Issue reported by Fragmenri. Thanks!)
  - [BUGFIX] (Lupestro) Bullseye lanterns in all systems that had 53 degree radius, now have 57 degree radius.
     * 53 degrees is technically correct for a cone (n units wide at center distance n, per rules).
     * 57 degrees (1 radian) would be correct for a (spherical) sector of radius n and arc length n.
     * Foundry projects light radially, so you get a spherical sector, regardless of the game rules.
     * Using 57 degrees is the fairest solution available within Foundry's constraints.
       * The extra beam width compensates for what you lose in the corners that radial light won't reach.
     * You can always reduce it back to 53 degrees with a custom JSON, of course, if you feel strongly about it.

### 2.1.3 - October 8, 2022
  - [BUGFIX] (Lupestro) Corrected issue (found by vkdolea) where user-supplied sources for new systems weren't processing properly.
  - [BUGFIX] (Lupestro) Now pulling non-dim/bright light properties for the light source configured in settings from the prototype token. (Issue reported by Jensenator360)
  - [BUGFIX] (Lupestro) Fixed the translation files for several languages.

### 2.1.2 - September 14, 2022
  - [BUGFIX] (Lupestro) Fixed image used for dancing lights
  - [BUGFIX] (Lupestro) Reset precedence order to user-supplied light sources first, then the source in config settings, then module-provided defaults based on game rules.

### 2.1.1 - September 6, 2022
  - [BUGFIX] (Lupestro) Fixed issue where unlinked tokens were adjusting inventory on source token.
  - [BUGFIX] (Lupestro) Fixed designation of which stock light sources are consumable in GURPS
  - [BUGFIX] (Lupestro) Adjusted manifest to use strings for minimumCoreVersion and compatibility values.
  
### 2.1.0 - July 24, 2022
  - [BUGFIX] (Lupestro) Context menu wasn't opening in HUD after exhausting a source - had to reopen HUD.
  - [BUGFIX] (Lupestro) Making Dancing Lights respond to configured settings.
  - [FEATURE] (ToGreedy) German translation. 

### 2.0.0 - July 23, 2022
   - [BREAKING] (Lupestro) This release supports v10 of Foundry, and not v0.7, v0.8, or v9.
   - [FEATURE] (Lupestro) Now supports selection among a variety of light sources on right-click menu from torch button - a long time coming, I know.
     * Bullseye Lantern has cone beam on token facing.
     * Hooded Lantern toggles on-dim-off on click.
     * Candle and Torch consume inventory, indicate when exhausted.
     * Limitations:
       * Aside from existing Dancing Lights behavior in dnd5e, light sources remain carried by the actor 
       * One actor may have only one light source active per scene at a time. 
       * No support for setting a light source down and stepping away. 
       * We probably won't get too deep into spells beyond the two cantrips we support  
         - The PHB only lists 7 other spells with explicit light effects
         - All the spells except Continual Flame and Daylight have other effects - weapon, damage, etc - that you'd want a more sophisticated module to deliver.
         - We could offer the Produce Flame cantrip as a half-sized Light cantrip without its thrown weapon effect, but would that be satisfying?
         - Anything that consumes spell slots (including Continual Flame and Daylight) should probably be invoked as a normal spell rather than a light source anyway.
   - [FEATURE] (Lupestro) Now supports specific light sources for a modest variety of systems, with extensibility to override settings or add light sources through a JSON file.
   - [INTERNAL] (Lupestro) Separated concerns into multiple js files and a CSS file
      * The additional UI and the more complex state finally made it necessary.
      * Separate root, hud, token, settings, light sources, topologies, and socket comms are much easier to follow.
      * This will make planned future work much easier as well.
      * The mere thimbleful of HTML needed is fine sitting in the top of the hud.js for now.

## Intermediate period - master -> v9 branch

### 1.4.4 - March 19, 2022
  - [BUGFIX] (Lupestro) Dancing Lights now work better for players - sends entire create / remove cycle to GM when users lack permissions on tokens.
### 1.4.3 - December 17, 2021
  - [CLEANUP] (Lupestro) Bumped official compatibility to Foundry 9, after testing with final test version. No code change.
### 1.4.2 - October 31, 2021 
  - [FEATURE] (Lupestro) Now works in Foundry 9, but still works in Foundry 7 and 8.
  - [BUGFIX] (Lupestro) Function in Foundry 7 is restored - it had broken in restructuring.
  - [INTERNAL] (Lupestro) Established test foundation - explicit cases, worlds, automation, fluid dev->test. 
### 1.4.1 - October 23, 2021 
  - [BUGFIX] (Lupestro) Fixed bug in restructuring that broke features for non-DnD5e.
### 1.4.0 - October 23, 2021
  - [BUGFIX] (C-S-McFarland) Fix for bug when you have torch and light spell.
  - [INTERNAL] (Lupestro) Major restructuring with cleanup of race conditions.
### 1.3.2 - June 29, 2021 
  - [FEATURE] (Lupestro, zarmstrong, lozalojo) Spanish updates and URL in module.json
### 1.3.1 - June 29, 2021 
  - [FEATURE] (Lupestro) Updated zh-tw translation from zeteticl and pt-br translation from rinnocenti to 100% of strings. Thanks y'all!
### 1.3.0 - June 25, 2021 
  - [FEATURE] (Lupestro) Incorporated pending Taiwan Chinese and Brazilian Portuguese translations from zeteticl and rinnocenti.
### 1.2.1 - June 11, 2021 
  - [CLEANUP] (Lupestro) Cleaned up console logging noise I had created
### 1.2.0 - June 10, 2021 - 
  - [FEATURE] (Lupestro) Updated for 0.8.6, but ensured it still functions in 0.7.x.

## Old Kingdom - master branch

Everything from here down has needed to be pieced together from unearthed inscriptions (the GIT history.)

* 1.1.4 - October 21, 2020 - (Stephen Hurd) Marked as 0.7.5 compatible.
* 1.1.3 - October 18, 2020 - (Stephen Hurd) Fix spelling.
* 1.1.2 - October 18, 2020 - (Stephen Hurd) Fix JSON syntax.
* 1.1.1 - October 18, 2020 - (Stephen Hurd) Name adjustment.
* 1.1.0 - October 18, 2020 - (Jose E Lozano) Add Spanish, 
                             (Stephen Hurd) Fix bright/dim radius of Dancing Lights.
* 1.0.9 - May 28, 2020 - (Stephen Hurd) Marked as 0.6.0 compatible.
* 1.0.8 - May 19, 2020 - (Aymeric DeMoura) Add French, Marked as 0.5.8 compatible.
* 1.0.7 - April 29, 2020 - (Stephen Hurd) Add Chinese, fix torch inventory usage.
* 1.0.6 - April 18, 2020 - (Stephen Hurd) Fix dancing lights removal.
* 1.0.5 - April 18, 2020 - (Stephen Hurd) Remove socket code for dancing lights removal.
* 1.0.4 - April 18, 2020 - (Stephen Hurd) Update to mark as 0.5.4 compatible.
* 1.0.3 - April 15, 2020 - (MtnTiger) - Updated with API changes.
* 1.0.2 - January 22, 2020 - (Stephen Hurd) Update for 0.4.4.
* 1.0.1 - November 26, 2019 - (Stephen Hurd) - Use await on all promises.
* 1.0.0 - November 25, 2019 - (Stephen Hurd) - Add support for Dancing Lights.

