const SLOT_LIBRARY = {
  arrival: [
    { label: "Late Morning", start: "10:30", end: "12:00", moment: "landing" },
    { label: "Lunch", start: "12:30", end: "14:00", moment: "meal" },
    { label: "Afternoon", start: "15:00", end: "17:00", moment: "anchor" },
    { label: "Evening", start: "18:30", end: "21:00", moment: "sunset" }
  ],
  market: [
    { label: "Breakfast", start: "08:00", end: "09:15", moment: "coffee" },
    { label: "Morning", start: "09:30", end: "11:30", moment: "walk" },
    { label: "Lunch", start: "12:00", end: "13:30", moment: "meal" },
    { label: "Afternoon", start: "14:00", end: "16:30", moment: "anchor" },
    { label: "Evening", start: "18:30", end: "21:30", moment: "night" }
  ],
  culture: [
    { label: "Morning", start: "08:30", end: "10:00", moment: "coffee" },
    { label: "Late Morning", start: "10:30", end: "12:30", moment: "anchor" },
    { label: "Lunch", start: "13:00", end: "14:15", moment: "meal" },
    { label: "Afternoon", start: "14:45", end: "17:15", moment: "walk" },
    { label: "Evening", start: "19:00", end: "21:30", moment: "night" }
  ],
  scenic: [
    { label: "Morning", start: "08:00", end: "09:30", moment: "coffee" },
    { label: "Midday", start: "10:00", end: "12:30", moment: "anchor" },
    { label: "Lunch", start: "13:00", end: "14:15", moment: "meal" },
    { label: "Golden Hour", start: "16:30", end: "18:00", moment: "sunset" },
    { label: "Evening", start: "19:00", end: "21:30", moment: "night" }
  ],
  nightlife: [
    { label: "Late Morning", start: "10:30", end: "12:00", moment: "walk" },
    { label: "Lunch", start: "12:30", end: "14:00", moment: "meal" },
    { label: "Afternoon", start: "15:00", end: "17:00", moment: "anchor" },
    { label: "Dinner", start: "19:00", end: "20:30", moment: "meal" },
    { label: "Late Night", start: "21:00", end: "23:30", moment: "night" }
  ]
};

const ICONS_BY_MOMENT = {
  coffee: "coffee",
  walk: "map",
  anchor: "sparkles",
  meal: "utensils",
  sunset: "camera",
  night: "moon-star",
  landing: "plane"
};

export const DESTINATION_LIBRARY = {
  tokyo: {
    defaultTemplates: ["arrival", "culture", "market", "nightlife", "scenic"],
    areas: ["Asakusa", "Shibuya", "Ginza", "Daikanyama", "Aoyama", "Ueno", "Nakameguro", "Azabudai"],
    themes: {
      Food: ["Tsukiji Outer Market", "Kappabashi Kitchen Street", "Depachika food hall", "Shinjuku Omoide Yokocho"],
      Architecture: ["Tokyo International Forum", "Omotesando Hills", "Azabudai Hills", "Nezu Museum approach"],
      Wellness: ["Hamarikyu Gardens", "Aoyama spa lounge", "Meguro River promenade", "Tokyo rooftop onsen"],
      Art: ["teamLab Borderless", "Mori Art Museum", "21_21 Design Sight", "Watari Museum"],
      Nature: ["Shinjuku Gyoen", "Yoyogi Park", "Imperial Palace East Gardens", "Mount Takao trailhead"],
      History: ["Senso-ji Temple", "Meiji Shrine", "Yanaka district", "Edo heritage quarter"],
      Shopping: ["Ginza Six", "Daikanyama T-Site", "Shibuya Parco", "Nakameguro boutiques"],
      Nightlife: ["Golden Gai", "Shibuya Sky night session", "Ebisu cocktail bars", "Roppongi listening room"]
    }
  },
  seoul: {
    defaultTemplates: ["arrival", "market", "culture", "nightlife", "scenic"],
    areas: ["Myeongdong", "Seongsu", "Insadong", "Gangnam", "Itaewon", "Bukchon", "Yeonnam", "Jamsil"],
    themes: {
      Food: ["Gwangjang Market", "Myeongdong street food lane", "Hanok tea house alley", "Korean barbecue house in Mapo"],
      Architecture: ["DDP", "Starfield Library", "Seoul City Hall design hall", "Lotte World Tower Sky Deck"],
      Wellness: ["Cheonggyecheon stream walk", "Jjimjilbang spa retreat", "Hangang riverside park", "Seoul Forest slow walk"],
      Art: ["Leeum Museum of Art", "MMCA Seoul", "Seongsu gallery block", "Arario Museum"],
      Nature: ["Namsan Park", "Bukhansan entry trail", "Seoul Forest", "Olympic Park"],
      History: ["Gyeongbokgung Palace", "Bukchon Hanok Village", "Changdeokgung", "Jongmyo Shrine"],
      Shopping: ["Seongsu concept stores", "Garosu-gil boutiques", "The Hyundai Seoul", "Myeongdong retail district"],
      Nightlife: ["Hongdae live music streets", "Itaewon rooftop bars", "Apgujeong lounge scene", "Euljiro speakeasy lane"]
    }
  },
  lisbon: {
    defaultTemplates: ["arrival", "scenic", "culture", "market", "nightlife"],
    areas: ["Alfama", "Chiado", "Bairro Alto", "Belém", "Príncipe Real", "Baixa", "Cais do Sodré", "LX Factory"],
    themes: {
      Food: ["Time Out Market", "Pastéis de Belém", "Mercado de Campo de Ourique", "Ribeira wine bar"],
      Architecture: ["MAAT", "Jerónimos Monastery exterior", "Calouste Gulbenkian campus", "Santa Justa area"],
      Wellness: ["Miradouro garden pause", "Tagus riverside promenade", "Príncipe Real quiet garden", "Estrela Park stroll"],
      Art: ["MAAT gallery", "Berardo Collection area", "Underdogs Gallery", "Azulejo art studio"],
      Nature: ["Monsanto Forest Park", "Belém riverside", "Estrela Garden", "Sintra foothills gateway"],
      History: ["São Jorge Castle", "Alfama lanes", "Jerónimos Monastery", "Praça do Comércio"],
      Shopping: ["Embaixada concept gallery", "Chiado boutiques", "LX Factory shops", "A Vida Portuguesa"],
      Nightlife: ["Bairro Alto bar cluster", "Pink Street", "Fado house in Alfama", "Cais do Sodré cocktail lounge"]
    }
  },
  reykjavik: {
    defaultTemplates: ["arrival", "scenic", "culture", "market", "nightlife"],
    areas: ["Miðborg", "Harpa", "Laugavegur", "Grandi", "Perlan", "Old Harbour", "Sky Lagoon coast", "Hlemmur"],
    themes: {
      Food: ["Hlemmur Mathöll", "Old Harbour seafood spot", "Laugavegur bakery stop", "New Nordic tasting room"],
      Architecture: ["Harpa Concert Hall", "Hallgrímskirkja", "Perlan", "Sun Voyager waterfront"],
      Wellness: ["Sky Lagoon", "GeoSea style thermal session", "Tjörnin lakeside walk", "Harbour sauna circuit"],
      Art: ["Reykjavik Art Museum", "Ásmundarsafn", "Marshall House", "Living Art Museum"],
      Nature: ["Grotta lighthouse coast", "Öskjuhlíð trails", "Elliðaárdalur valley", "Harpa waterfront"],
      History: ["National Museum of Iceland", "Árbær Open Air Museum", "Settlement Exhibition", "Old Harbour heritage zone"],
      Shopping: ["Laugavegur design stores", "Skólavörðustígur boutiques", "Local wool studio", "Harpa concept shop"],
      Nightlife: ["Austurstræti bars", "Old Harbour cocktail den", "Live music venue on Laugavegur", "Natural wine bar in Miðborg"]
    }
  },
  paris: {
    defaultTemplates: ["arrival", "culture", "scenic", "market", "nightlife"],
    areas: ["Le Marais", "Saint-Germain", "Montmartre", "Louvre", "Canal Saint-Martin", "Latin Quarter", "Belleville", "Palais Royal"],
    themes: {
      Food: ["Rue Cler food street", "Marché des Enfants Rouges", "Saint-Germain patisserie", "Canal wine bar"],
      Architecture: ["Fondation Louis Vuitton", "Palais Garnier exterior", "Centre Pompidou plaza", "La Samaritaine"],
      Wellness: ["Luxembourg Gardens", "Seine riverside stroll", "Tuileries pause", "Canal Saint-Martin slow walk"],
      Art: ["Musée d'Orsay", "Louvre timed visit", "Musée Rodin gardens", "Bourse de Commerce"],
      Nature: ["Jardin du Luxembourg", "Parc Monceau", "Bois de Boulogne edge", "Seine island walk"],
      History: ["Sainte-Chapelle", "Île de la Cité", "Le Marais historic lanes", "Panthéon quarter"],
      Shopping: ["Le Bon Marché", "Merci concept store", "Palais Royal arcades", "Galeries Lafayette"],
      Nightlife: ["Le Marais cocktail bars", "Pigalle jazz room", "Canal natural wine bar", "Rooftop near Opéra"]
    }
  },
  newyork: {
    defaultTemplates: ["arrival", "market", "culture", "scenic", "nightlife"],
    areas: ["SoHo", "West Village", "Chelsea", "Brooklyn", "Midtown", "Lower East Side", "Upper East Side", "NoMad"],
    themes: {
      Food: ["Chelsea Market", "Essex Market", "West Village brunch room", "Brooklyn waterfront dining"],
      Architecture: ["The Vessel area", "Grand Central", "The High Line design corridor", "The Oculus"],
      Wellness: ["Hudson River Greenway", "Central Park south loop", "Brooklyn Bridge Park", "Spa in NoMad"],
      Art: ["The Met", "MoMA", "Whitney Museum", "Dia Chelsea cluster"],
      Nature: ["Central Park", "The High Line", "Brooklyn Botanic Garden", "Governors Island ferry zone"],
      History: ["Tenement Museum", "Wall Street historic core", "Ellis Island route", "Greenwich Village lanes"],
      Shopping: ["SoHo flagship run", "Fifth Avenue luxury corridor", "Brooklyn concept stores", "NoHo independent shops"],
      Nightlife: ["West Village jazz bar", "Lower East Side cocktail room", "Rooftop in Williamsburg", "NoMad lounge"]
    }
  }
};

export function normalizeInterest(item) {
  const lower = String(item).toLowerCase();
  if (lower.includes("food")) return "Food";
  if (lower.includes("art")) return "Art";
  if (lower.includes("night")) return "Nightlife";
  if (lower.includes("architect")) return "Architecture";
  if (lower.includes("nature")) return "Nature";
  if (lower.includes("well")) return "Wellness";
  if (lower.includes("shop")) return "Shopping";
  if (lower.includes("hist")) return "History";
  return "Food";
}

export function getDestinationProfile(destination) {
  const key = String(destination || "")
    .toLowerCase()
    .replace(/[^a-z]/g, "");

  return DESTINATION_LIBRARY[key] || null;
}

function genericPlace(destination, theme, index) {
  const genericByTheme = {
    Food: ["food market hall", "chef-led bistro", "street food lane", "signature tasting room"],
    Architecture: ["design landmark", "civic hall", "modern cultural center", "skyline viewpoint"],
    Wellness: ["botanical garden", "riverfront promenade", "quiet urban park", "thermal retreat"],
    Art: ["contemporary gallery", "art museum", "design studio quarter", "creative warehouse district"],
    Nature: ["city park", "scenic lookout", "coastal walk", "urban forest trail"],
    History: ["old town quarter", "historic monument", "cathedral district", "heritage museum"],
    Shopping: ["boutique street", "artisan arcade", "concept store district", "shopping boulevard"],
    Nightlife: ["cocktail bar district", "rooftop lounge area", "live music street", "late-night dining strip"]
  };

  const list = genericByTheme[theme] || genericByTheme.Food;
  return `${destination} ${list[index % list.length]}`;
}

function pickPlace(destination, theme, absoluteIndex) {
  const profile = getDestinationProfile(destination);
  const places = profile?.themes?.[theme];
  if (places?.length) {
    return {
      placeName: places[absoluteIndex % places.length],
      area: profile.areas[absoluteIndex % profile.areas.length]
    };
  }

  return {
    placeName: genericPlace(destination, theme, absoluteIndex),
    area: `${destination} central district`
  };
}

function pickUniquePlace(destination, theme, startIndex, usedPlaces) {
  for (let offset = 0; offset < 12; offset += 1) {
    const candidate = pickPlace(destination, theme, startIndex + offset);
    const key = candidate.placeName.toLowerCase();
    if (!usedPlaces.has(key)) {
      usedPlaces.add(key);
      return candidate;
    }
  }

  const profile = getDestinationProfile(destination);
  const area = profile?.areas?.[startIndex % profile.areas.length] || `${destination} central district`;
  const overflow = {
    placeName: genericPlace(destination, theme, startIndex + usedPlaces.size + 5),
    area
  };
  usedPlaces.add(overflow.placeName.toLowerCase());
  return overflow;
}

function buildDayTitle(destination, theme, template, dayNumber) {
  const titles = {
    arrival: `Soft landing and first impressions in ${destination}`,
    market: `${theme}-led local discoveries and neighborhood flavor`,
    culture: `${theme}-focused icons with slower cultural pacing`,
    scenic: `${destination} viewpoints, walks, and cinematic stops`,
    nightlife: `${destination} after-dark rhythm with a strong finish`
  };

  return titles[template] || `${theme} in ${destination} for day ${dayNumber}`;
}

function buildActivityTitle(moment, theme, placeName) {
  const byMoment = {
    landing: `Check-in and orientation around ${placeName}`,
    coffee: `Coffee and easy start near ${placeName}`,
    walk: `${theme} walk through ${placeName}`,
    meal: `Meal stop around ${placeName}`,
    anchor: `Main ${theme.toLowerCase()} visit at ${placeName}`,
    sunset: `Golden-hour pause near ${placeName}`,
    night: `Evening experience around ${placeName}`
  };

  return byMoment[moment] || `Visit ${placeName}`;
}

function buildActivityDescription(moment, destination, theme, area) {
  const byMoment = {
    landing: `Ease into ${destination} without overloading the first block. Stay close to ${area} and keep logistics light.`,
    coffee: `Begin with an easy, local-feeling stop that gives the day a human pace instead of rushing into landmarks.`,
    walk: `Use this stretch to absorb the neighborhood and connect nearby stops without unnecessary backtracking.`,
    meal: `Plan a proper food break here so the itinerary feels usable, not machine-generated.`,
    anchor: `This is the main experience block of the day and should feel worth planning around.`,
    sunset: `Use this time for views, atmosphere, and a little breathing room before the evening.`,
    night: `Close the day with the kind of place people actually remember and talk about afterward.`
  };

  return byMoment[moment] || `A well-paced ${theme.toLowerCase()} stop in ${destination}.`;
}

function createActivity({ destination, dayNumber, activityIndex, style, theme, template, usedPlaces }) {
  const slot = (SLOT_LIBRARY[template] || SLOT_LIBRARY.culture)[activityIndex];
  const absoluteIndex = dayNumber * 7 + activityIndex;
  const { placeName, area } = pickUniquePlace(destination, theme, absoluteIndex, usedPlaces);

  return {
    id: `day-${dayNumber}-activity-${activityIndex + 1}`,
    timeOfDay: slot.label,
    startTime: slot.start,
    endTime: slot.end,
    title: buildActivityTitle(slot.moment, theme, placeName),
    description: buildActivityDescription(slot.moment, destination, theme, area),
    location: destination,
    placeName,
    neighborhood: area,
    cost: ["$12", "$18", "$32", "$28", "$45"][activityIndex] || "$20",
    icon: ICONS_BY_MOMENT[slot.moment] || "sparkles",
    mapHint: `${placeName}, ${area}`,
    bookingNote:
      slot.moment === "anchor" || slot.moment === "night" || slot.moment === "sunset"
        ? "Reserve ahead if you want the smoothest experience."
        : "Usually flexible, but morning entry is the safest option.",
    transitNote:
      activityIndex === 0
        ? `Start from your hotel and target an easy arrival into ${area}.`
        : `Keep the transfer under 20 minutes from the previous stop to maintain pace.`,
    tags: [style, theme, template, area]
  };
}

function chooseTemplate({ profile, theme, dayIndex, isArrival }) {
  if (isArrival) return "arrival";
  if (theme === "Nightlife") return "nightlife";
  if (theme === "Food" || theme === "Shopping") return "market";
  if (theme === "Nature") return "scenic";
  return profile?.defaultTemplates?.[(dayIndex + 1) % profile.defaultTemplates.length] || "culture";
}

function chooseThemeForDay(themes, index) {
  return themes[index % themes.length];
}

export function buildFallbackItinerary(input, mode = "generate", request = "") {
  const destination = input.destination || "Tokyo";
  const interests = input.interests?.length ? input.interests : ["Food", "Art", "History"];
  const travelStyle = input.travelStyle || "Balanced";
  const daysCount = Number(input.tripLength || 4);
  const normalizedInterests = interests
    .map(normalizeInterest)
    .filter((theme) => theme !== "Wellness" || interests.length === 1);
  const uniqueThemes = [...new Set(normalizedInterests)];
  const rotatedThemes =
    uniqueThemes.length >= daysCount
      ? uniqueThemes
      : Array.from({ length: daysCount }, (_, index) => chooseThemeForDay(uniqueThemes, index));

  const profile = getDestinationProfile(destination);
  const days = Array.from({ length: daysCount }).map((_, index) => {
    const theme = rotatedThemes[index % rotatedThemes.length];
    const area = profile?.areas?.[index % profile.areas.length] || `${destination} central district`;
    const template = chooseTemplate({
      profile,
      theme,
      dayIndex: index,
      isArrival: index === 0
    });
    const slotSet = SLOT_LIBRARY[template] || SLOT_LIBRARY.culture;
    const usedPlaces = new Set();

    return {
      id: `day-${index + 1}`,
      dayNumber: index + 1,
      title: buildDayTitle(destination, theme, template, index + 1),
      theme,
      summary:
        template === "arrival"
          ? `A gentle first day in ${area} with enough structure to feel exciting but not exhausting after arrival.`
          : template === "nightlife"
            ? `A later-start day through ${area} that builds naturally toward dinner, bars, live music, or a memorable evening scene.`
            : `A ${theme.toLowerCase()}-driven day centered on ${area}, using a ${template} rhythm instead of a rigid template.`,
      weatherHint:
        theme === "Nature"
          ? `If weather turns, swap the outdoor block for an indoor cultural stop near ${area}.`
          : `Rain plan: replace any exposed walking stretch with nearby cafes, galleries, or covered markets in ${area}.`,
      activities: Array.from({ length: slotSet.length }).map((__, activityIndex) =>
        createActivity({
          destination,
          dayNumber: index + 1,
          activityIndex,
          style: travelStyle,
          theme,
          template,
          usedPlaces
        })
      )
    };
  });

  return {
    title: `${destination} by Iteanary.ai`,
    tripLength: daysCount,
    overview:
      mode === "modify" && request
        ? `Updated for: ${request}`
        : `A destination-aware itinerary for ${destination}, mapped into time-wise days with distinct places, realistic pacing, and a ${travelStyle.toLowerCase()} travel style.`,
    budgetSummary: `${input.budget || 2500} total estimated budget with room for reservations, local transit, and one premium splurge.`,
    travelStyle,
    highlights: [
      `Each day follows a different pacing model and neighborhood logic inside ${destination}.`,
      "Specific place names, usable time ranges, and realistic meal or evening blocks are built into the plan.",
      "The itinerary avoids repeating the same daily shape across every city."
    ],
    aiSuggestions: [
      "Ask the chat to optimize for luxury, weather, or fewer crowded places.",
      "Regenerate a single day if you want a stronger food, art, or nature focus.",
      "Use share or export once the pacing feels right."
    ],
    days
  };
}
