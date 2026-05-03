(function () {
  // Canonical genealogy dataset:
  // - people are the single source of truth for character records
  // - unions represent marriages / family units and can be ordered
  // - views are filtered projections over the same shared dataset
  window.FAMILY_TREE_DATA = Object.freeze({
    defaults: Object.freeze({
      initialView: "aragorn_lineage"
    }),

    people: Object.freeze({
      elwing: Object.freeze({
        id: "elwing",
        name: "Elwing",
        sex: "female",
        kindred: "Elf / Half-elven",
        groups: Object.freeze(["elves", "half-elven"]),
        title: "Elwing the White",
        house: "House of Elwe",
        realm: "Gondolin",
        born: "F.A. 503",
        died: "Elwing was given a white tower in Valinor northward upon the borders of the Sundering Seas, and there she helped seabirds that came to her windows. ",
        image: "assets/elwing.png",
        bio: "Earendil was descended from all Three Houses of the Edain, he was the first known person to reach Aman in the First Age after the Noldor went into exile. ",
        order: 4
      }),

      earendil: Object.freeze({
        id: "earendil",
        name: "Earendil",
        sex: "male",
        kindred: "Elf / Half-elven",
        groups: Object.freeze(["elves", "half-elven"]),
        title: "Mariner",
        house: "House of Earendil",
        realm: "Gondolin",
        born: "F.A. 532",
        died: "Sailed West in T.A. 3021",
        image: "assets/earendil.png",
        bio: "Earendil was descended from all Three Houses of the Edain, he was the first known person to reach Aman in the First Age after the Noldor went into exile. ",
        order: 4
      }),

      elrond: Object.freeze({
        id: "elrond",
        name: "Elrond",
        sex: "male",
        kindred: "Elf / Half-elven",
        groups: Object.freeze(["elves", "half-elven"]),
        title: "Lord of Rivendell",
        house: "House of Earendil",
        realm: "Rivendell",
        born: "F.A. 532",
        died: "Sailed West in T.A. 3021",
        image: "assets/elrond.png",
        bio: "Elrond is the loremaster and lord of Rivendell, one of the key keepers of the Elder Days within Middle-earth.",
        order: 5
      }),

      elros: Object.freeze({
        id: "elros",
        name: "Elros",
        sex: "male",
        kindred: "Man",
        groups: Object.freeze(["men"]),
        title: "First Lord of Numenor",
        house: "House of Earendil",
        realm: "Numenor",
        born: "F.A. 532",
        died: "S.A. 442",
        image: "assets/elros.png",
        bio: "Elros founded the realm of Numenor and was its first king.",
        order: 5
      }),

      celeborn: Object.freeze({
        id: "celeborn",
        name: "Celeborn",
        sex: "female",
        kindred: "Elf",
        groups: Object.freeze(["elves"]),
        title: "Lord of Lothlorien",
        house: "House of the Noldor",
        realm: "Lothlorien",
        born: "Sometime during the Years of the Trees",
        died: "Sailed West in T.A. 3021",
        image: "assets/celeborn.png",
        bio: "Celeborn is the Lord of Lothlorien. He rules Lothlorien with his wife Galadriel.",
        order: 4
      }),

      galadriel: Object.freeze({
        id: "galadriel",
        name: "Galadriel",
        sex: "female",
        kindred: "Elf",
        groups: Object.freeze(["elves"]),
        title: "Lady of Lothlorien",
        house: "House of the Noldor",
        realm: "Lothlorien",
        born: "Around 1362 of the Years of the Trees",
        died: "Sailed West in T.A. 3021",
        image: "assets/galadriel.png",
        bio: "Galadriel is the oldest elf in Middle-earth at the time of the War of the Ring. She rules Lothlorien with her husband Celeborn.",
        order: 5
      }),

      celebrian: Object.freeze({
        id: "celebrian",
        name: "Celebrian",
        sex: "female",
        kindred: "Elf",
        groups: Object.freeze(["elves"]),
        title: "Lady of Rivendell",
        house: "House of Galadriel",
        realm: "Rivendell",
        born: "Second Age",
        died: "Sailed West in T.A. 2510",
        image: "assets/celebrian.png",
        bio: "Celebrian is the daughter of Galadriel and Celeborn, and the wife of Elrond.",
        order: 6
      }),

      arador: Object.freeze({
        id: "arador",
        name: "Arador",
        sex: "male",
        kindred: "Man",
        groups: Object.freeze(["men", "dunedain"]),
        title: "Chieftain of the Dunedain",
        house: "House of Isildur",
        realm: "Dunedain of the North",
        born: "T.A. 2700",
        died: "T.A. 2930",
        bio: "Arador is the father of Arathorn II and part of the northern heir line of Isildur.",
        order: 10
      }),

      gilraen: Object.freeze({
        id: "gilraen",
        name: "Gilraen",
        sex: "female",
        kindred: "Woman",
        groups: Object.freeze(["men", "dunedain"]),
        title: "Gilraen the Fair",
        house: "House of Isildur",
        realm: "Dunedain of the North",
        born: "T.A. 2873",
        died: "T.A. 2933",
        image: "assets/gilraen.png",
        bio: "Gilraen the Fair was a Dúnadan of the North, the daughter of Dírhael and Ivorwen, and a descendant of the first chieftain, Aranarth.",
        order: 20
      }),

      arathorn: Object.freeze({
        id: "arathorn_second",
        name: "Arathorn II",
        sex: "male",
        kindred: "Man",
        groups: Object.freeze(["men", "dunedain"]),
        title: "K15th Chieftain of the Dunedain, father to Aragorn II Elessar",
        house: "House of Isildur",
        realm: "Remnant of Arthedain",
        born: "T.A. 2873",
        died: "T.A. 2933",
        image: "assets/arathorn_second.png",
        bio: "Arathorn II was the fifteenth Chieftain of the Dúnedain and succeeded his father, Arador, when he was killed in 2930.",
        order: 30
      }),

      aragorn: Object.freeze({
        id: "aragorn_second",
        name: "Aragorn II Elessar",
        sex: "male",
        kindred: "Man",
        groups: Object.freeze(["men", "dunedain"]),
        title: "King of the Reunited Kingdom",
        house: "House of Isildur",
        realm: "Gondor and Arnor",
        born: "T.A. 2931",
        died: "F.A. 120",
        image: "assets/aragorn_second.png",
        bio: "Aragorn, son of Arathorn, is the heir of Isildur and becomes King Elessar after the War of the Ring.",
        order: 30
      }),

      arwen: Object.freeze({
        id: "arwen",
        name: "Arwen Undomiel",
        sex: "female",
        kindred: "Elf / Half-elven",
        groups: Object.freeze(["elves", "half-elven"]),
        title: "Queen of the Reunited Kingdom",
        house: "House of Elrond",
        realm: "Rivendell and Gondor",
        born: "T.A. 241",
        died: "F.A. 121",
        image: "assets/arwen.png",
        bio: "Arwen, daughter of Elrond and Celebrian, chooses a mortal life and becomes queen beside Aragorn.",
        order: 35
      }),

      eldarion: Object.freeze({
        id: "eldarion",
        name: "Eldarion",
        sex: "male",
        kindred: "Half-elven",
        groups: Object.freeze(["men", "elves", "half-elven"]),
        title: "Heir of Aragorn and Arwen",
        house: "House of Isildur",
        realm: "Reunited Kingdom",
        born: "Fourth Age",
        died: "Unknown",
        image: "assets/eldarion.png",
        bio: "Eldarion is the son and heir of Aragorn and Arwen, continuing the reunited royal line into the Fourth Age.",
        order: 40
      }),

      unknown_daughters: Object.freeze({
        id: "unknown_daughters",
        name: "Unknown Daughters",
        sex: "female",
        kindred: "Half-elven",
        groups: Object.freeze(["men", "elves", "half-elven"]),
        title: "Unnamed daughters of Aragorn and Arwen",
        house: "House of Isildur",
        realm: "Reunited Kingdom",
        born: "Fourth Age",
        died: "Unknown",
        bio: "This aggregate record stands in for Aragorn and Arwen's daughters, who are mentioned but not named in the published legendarium.",
        recordType: "aggregate",
        isPlaceholder: true,
        order: 41
      }),
    }),

    unions: Object.freeze([


      Object.freeze({
        id: "union-celeborn-galadriel",
        partners: Object.freeze(["celeborn", "galadriel"]),
        children: Object.freeze(["celebrian"]),
        label: "Marriage",
        order: 10
      }),

      Object.freeze({
        id: "union-elrond-celebrian",
        partners: Object.freeze(["elrond", "celebrian"]),
        children: Object.freeze(["arwen"]),
        label: "Marriage",
        order: 10
      }),

      Object.freeze({
        id: "union-earendil-elwing",
        partners: Object.freeze(["earendil", "elwing"]),
        children: Object.freeze(["elros", "elrond"]),
        label: "Marriage",
        order: 10
      }),

      Object.freeze({
        id: "union-elros",
        partners: Object.freeze(["elros"]),
        children: Object.freeze(["arathorn_second"]),
        label: "Issue",
        order: 10
      }),

      Object.freeze({
        id: "union-arathorn_second-gilraen",
        partners: Object.freeze(["arathorn_second", "gilraen"]),
        children: Object.freeze(["aragorn_second"]),
        label: "Marriage",
        order: 10
      }),

      Object.freeze({
        id: "union-aragorn-arwen",
        partners: Object.freeze(["aragorn_second", "arwen"]),
        children: Object.freeze(["eldarion", "unknown_daughters"]),
        label: "Marriage",
        order: 20
      }),
    ]),

    views: Object.freeze({
      aragorn_lineage: Object.freeze({
        label: "Aragorn Lineage",
        description: "The direct House of Isildur line around Aragorn, including ancestors, descendants, and direct spouses.",
        seeds: Object.freeze(["aragorn_second"]),
        roots: Object.freeze(["arador"]),
        generationsUp: 10,
        generationsDown: 10,
        includeSpouses: true,
        includeSpouseLineage: false
      }),

      all_lineages: Object.freeze({
        label: "All Current Lineages",
        description: "The combined Men and Elven branches currently modeled around Aragorn, Arwen, and Elrond's house.",
        seeds: Object.freeze(["eldarion"]),
        roots: Object.freeze(["galadriel"]),
        generationsUp: 10,
        generationsDown: 10,
        includeSpouses: true,
        includeSpouseLineage: false,
        includeSiblingBranches: true
      }),

      men_of_the_west: Object.freeze({
        label: "Men of the West",
        description: "The Dunedain and royal human branch, while still keeping direct spouses visible for context.",
        seeds: Object.freeze(["arador"]),
        roots: Object.freeze(["arador"]),
        generationsUp: 10,
        generationsDown: 10,
        includeSpouses: true,
        includeSpouseLineage: false,
        filters: Object.freeze({
          includeGroupsAny: Object.freeze(["men", "dunedain"]),
          preserveAncestors: true,
          preserveDescendants: true,
          preserveSpouses: true
        })
      }),

      elves_and_half_elven: Object.freeze({
        label: "Elves and Half-elven",
        description: "Elrond's household and its immediate ties into the royal house through Arwen.",
        seeds: Object.freeze(["eldarion"]),
        roots: Object.freeze(["galadriel"]),
        generationsUp: 10,
        generationsDown: 10,
        includeSpouses: true,
        includeSpouseLineage: false,
        filters: Object.freeze({
          includeGroupsAny: Object.freeze(["elves", "half-elven"]),
          preserveAncestors: true,
          preserveDescendants: true,
          preserveSpouses: true
        })
      }),

      dwarves: Object.freeze({
        label: "Dwarves",
        description: "Reserved for the Dwarven houses and dynasties.",
        emptyState: Object.freeze({
          title: "Dwarf tree planned",
          body: "This view is ready for Durin's line, Erebor, the Longbeards, and the other houses once you start adding them."
        })
      }),

      hobbits: Object.freeze({
        label: "Hobbits",
        description: "Reserved for Hobbit genealogies such as the Baggins, Brandybucks, Tooks, and Gamgees.",
        emptyState: Object.freeze({
          title: "Hobbit tree planned",
          body: "This view is ready for the Shire family lines once you start adding Hobbit records to the canonical dataset."
        })
      })
    })
  });
})();
