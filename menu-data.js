const BAGO_VENUE = {
  "name": "Bago Sushi & Asian",
  "heroImage": "https://tb-static.uber.com/prod/image-proc/processed_images/fa5cd9dd636a53eed3f9ee50e5bc9686/5283d81c664b43c5f57a3a186d273063.jpeg",
  "logoImage": "assets/bago-logo.jpg",
  "address": "Luftgasse 1, 85049 Ingolstadt",
  "pickupLat": 48.76340717227785,
  "pickupLng": 11.42234503860289,
  "orderMinimum": 12,
  "preparationTime": "25-35 Min",
  "serviceFeePercent": 0,
  "serviceFeeMin": 0,
  "serviceFeeMax": 0,
  "whatsappNumber": "+491774675823",
  "paypalEmail": "bagosushi123@gmail.com"
};

const BAGO_MOST_ORDERED = [
  {
    "id": "9d135ded-3718-4855-aeb1-e88606e31a64",
    "name": "Crunchyroll Vegetarisch",
    "fallbackId": "dfa7d813-04b1-4c41-95b9-1154d6689fe4"
  },
  {
    "id": "0f172b10-4dfa-484b-a2be-5932602b756e",
    "name": "L1 Futo Lachs Menü",
    "fallbackId": "6006d85c-d298-4963-921c-4d5e800b0ca4"
  },
  {
    "id": "e91dd37f-442c-4b87-9559-55dc81dae93d",
    "name": "Rainbow Avocado",
    "fallbackId": "1b87c2d3-bad3-4657-a3b5-e8e6558f70e7"
  },
  {
    "id": "0868f950-f4d0-40be-a887-1785788a136b",
    "name": "L6 Lachs Tunfisch Menü",
    "fallbackId": "01de9501-dafd-47c4-8af6-a89bfd6a8447"
  },
  {
    "id": "9f137685-756b-449f-9c4a-515e5e621247",
    "name": "B2 Burrito Chicken",
    "fallbackId": "b36da041-1226-4ee9-aefe-cfa52fb5cfb3"
  },
  {
    "id": "d32dbff6-e00d-4d2a-a2e1-727514ad043a",
    "name": "Mini Frühlingsrollen",
    "fallbackId": "59e7496f-75d6-4af3-b0ac-53155c82a5fd"
  }
];

const BAGO_CATEGORIES = [
  {
    "id": "burger-menus-2",
    "name": "Burger-Menüs 🍔🍟🥤",
    "description": "",
    "items": [
      {
        "id": "e93c271a-e8a7-43c8-8bbb-a877eefd6a0a",
        "name": "Vegan Burger Menü",
        "description": "1x veganer burger 1x pommes frites 1x getränk nach wahl.",
        "price": 6.65,
        "image": ""
      }
    ]
  },
  {
    "id": "sushi-menu-3",
    "name": "Sushi Menü 🍱",
    "description": "",
    "items": [
      {
        "id": "6006d85c-d298-4963-921c-4d5e800b0ca4",
        "name": "L1 Futo Lachs Menü",
        "description": "8x futo Lachs mit Frischkäse 2x nigiri Lachs.",
        "price": 11.5,
        "image": "https://tb-static.uber.com/prod/image-proc/processed_images/23998dee149d08657566f477b1a28b0d/70aa2a4db7f990373ca9c376323e3dea.jpeg"
      },
      {
        "id": "3bbaa933-b768-4758-a52e-38398e2b3f19",
        "name": "L2 California Futo Menü",
        "description": "4x California 4x futo Lachs-Avocado 3x nigiri Lachs.",
        "price": 13.8,
        "image": "https://tb-static.uber.com/prod/image-proc/processed_images/1de54c89b72baa79db1d2c70aa759075/70aa2a4db7f990373ca9c376323e3dea.jpeg"
      },
      {
        "id": "c515ad6c-3f27-434a-909c-75a9fdcecb5c",
        "name": "L3 Lachs Menü",
        "description": "8x maki Lachs 6x nigiri Lachs.",
        "price": 16.1,
        "image": "https://tb-static.uber.com/prod/image-proc/processed_images/70b0c3e11d49f387fa8227ab4b17af6d/70aa2a4db7f990373ca9c376323e3dea.jpeg"
      },
      {
        "id": "47dfff63-fe6e-4433-81cd-5b38a5b9d532",
        "name": "L5 Maki Fisch Menü",
        "description": "12x maki Lachs 8x maki Gurke 8x maki Avocado.",
        "price": 13.8,
        "image": "https://tb-static.uber.com/prod/image-proc/processed_images/4b1edd3a1b0678d3af5ded8a8a962ea4/70aa2a4db7f990373ca9c376323e3dea.jpeg"
      },
      {
        "id": "01de9501-dafd-47c4-8af6-a89bfd6a8447",
        "name": "L6 Lachs Tunfisch Menü",
        "description": "8x futo Lachs, Thunfisch und Avocado 2x nigiri Lachs 2x nigiri Thunfisch.",
        "price": 16.1,
        "image": "https://tb-static.uber.com/prod/image-proc/processed_images/8f3f6d4d122c245ce76c201d0b877abc/70aa2a4db7f990373ca9c376323e3dea.jpeg"
      },
      {
        "id": "ee44e4ba-5d33-41ef-bec5-9784481e9db4",
        "name": "L7 Lachs Sashimi Avocado Menü",
        "description": "6x sashimi Lachs 6x Avocado.",
        "price": 17.3,
        "image": "https://tb-static.uber.com/prod/image-proc/processed_images/eb6a084cbdcbfac2405c1d5c5acef868/70aa2a4db7f990373ca9c376323e3dea.jpeg"
      },
      {
        "id": "6e66668a-f74e-49db-8f49-e5531f061610",
        "name": "L8 Rainbow Mix Box",
        "description": "8x California Lachs und Thunfisch Avocado 2x nigiri Lachs 2x nigiri Thunfisch 2x nigiri ebil.",
        "price": 18,
        "image": "https://tb-static.uber.com/prod/image-proc/processed_images/9e3710065690c6cab5778beca4ead3d3/a1681d67ebe55c76c3af5f401619c278.jpeg"
      },
      {
        "id": "0ee0d5e5-5561-4d36-b8d9-dc68555e2044",
        "name": "L4 Maki Vegan Menü",
        "description": "8x maki Gurke 8x maki Avocado 8x maki Paprika 8x maki Rettich.",
        "price": 11.5,
        "image": ""
      },
      {
        "id": "8416d6f4-9682-4cc3-ae43-3ce30e1e17ad",
        "name": "L9 Vegan Menü",
        "description": "8x California vegan 6x maki Gurke 6x maki Avocado 1x nigiri tofu und wakame.",
        "price": 15,
        "image": ""
      }
    ]
  },
  {
    "id": "vorspeisen-4",
    "name": "Vorspeisen 🧀",
    "description": "",
    "items": [
      {
        "id": "59e7496f-75d6-4af3-b0ac-53155c82a5fd",
        "name": "Mini Frühlingsrollen",
        "description": "6 stück.",
        "price": 3.5,
        "image": "https://tb-static.uber.com/prod/image-proc/processed_images/d724eb510368d6ceb55d9bd0196fd6bd/70aa2a4db7f990373ca9c376323e3dea.jpeg"
      },
      {
        "id": "577808d7-bab0-4a49-b607-7d178b81d73e",
        "name": "Vegetarische Samosa",
        "description": "6 stück.",
        "price": 4,
        "image": "https://tb-static.uber.com/prod/image-proc/processed_images/5b91b68b3b4278bf03e7fd0d65ffe50c/70aa2a4db7f990373ca9c376323e3dea.jpeg"
      },
      {
        "id": "19a88eb4-5d45-49a0-a43a-31eca3dcf21a",
        "name": "Teriyaki Chicken",
        "description": "3 stück.",
        "price": 3.5,
        "image": ""
      },
      {
        "id": "769e931c-3199-4a98-af1c-a6ac61dd4f8b",
        "name": "Gyoza mit Chicken",
        "description": "5 stück.",
        "price": 6.9,
        "image": ""
      }
    ]
  },
  {
    "id": "salate-5",
    "name": "Salate 🥗",
    "description": "",
    "items": [
      {
        "id": "65cbff55-51a3-4e26-9de6-2ddae0e4a817",
        "name": "Wakame Salat",
        "description": "",
        "price": 3.5,
        "image": "https://tb-static.uber.com/prod/image-proc/processed_images/7d8ae61bcebec597ce7e54115b10ece1/70aa2a4db7f990373ca9c376323e3dea.jpeg"
      }
    ]
  },
  {
    "id": "maki-6",
    "name": "Maki 🍣",
    "description": "",
    "items": [
      {
        "id": "be5a6d26-fcf6-435b-a016-e108d5bd2750",
        "name": "Kappa Maki",
        "description": "Mit Gurken. Es werden jeweils 6 stück servier (außer 122. Paprika maki).",
        "price": 2.9,
        "image": "https://tb-static.uber.com/prod/image-proc/processed_images/dc3a946e26df3ae6dc37becff9fee0a3/70aa2a4db7f990373ca9c376323e3dea.jpeg"
      },
      {
        "id": "90557aab-b0c9-4251-acd4-940173c8d99c",
        "name": "Avocado Maki",
        "description": "Mit Avocado. Es werden jeweils 6 stück servier (außer 122. Paprika maki).",
        "price": 4,
        "image": "https://tb-static.uber.com/prod/image-proc/processed_images/1e5351a77ea0ede45d250fca76a5d0ed/70aa2a4db7f990373ca9c376323e3dea.jpeg"
      },
      {
        "id": "41e5f30d-db76-43a3-a4ae-533d6472d22c",
        "name": "Sake Maki",
        "description": "Mit Lachs. Es werden jeweils 6 stück servier (außer 122. Paprika maki).",
        "price": 4.6,
        "image": "https://tb-static.uber.com/prod/image-proc/processed_images/92bc2fce2625a48da6bffeae8a88969a/70aa2a4db7f990373ca9c376323e3dea.jpeg"
      },
      {
        "id": "ca3a6399-8763-45ec-8857-eb6a5ec2bcf6",
        "name": "Paprika Maki",
        "description": "Mit paprikal. Es werden jeweils 6 stück servier (außer 122. Paprika maki).",
        "price": 4,
        "image": ""
      },
      {
        "id": "bac1ea09-7c6d-4e36-aec9-28fd99336d57",
        "name": "Oshinko Maki",
        "description": "Mit eingelegten Rettich. Es werden jeweils 6 stück servier (außer 122. Paprika maki).",
        "price": 4,
        "image": ""
      },
      {
        "id": "02182322-d3f2-4c34-87b8-c8b2fb930248",
        "name": "Tamago Maki",
        "description": "Mit Eier omelett. Es werden jeweils 6 stück servier (außer 122. Paprika maki).",
        "price": 4,
        "image": ""
      },
      {
        "id": "823f3bb1-11a5-4748-aa01-823cf800f128",
        "name": "Kani Maki",
        "description": "Mit surimi (krabbenfleisch). Es werden jeweils 6 stück servier (außer 122. Paprika maki).",
        "price": 4,
        "image": ""
      },
      {
        "id": "cc47cc25-a216-4b3b-b4da-e631d20992a3",
        "name": "Tuna Maki",
        "description": "Mit thunfischcreme. Es werden jeweils 6 stück servier (außer 122. Paprika maki).",
        "price": 4.6,
        "image": ""
      },
      {
        "id": "f82cd8ad-e10f-4596-b306-71d9d3ec5fa3",
        "name": "Tekka Maki",
        "description": "Mit Thunfisch. Es werden jeweils 6 stück servier (außer 122. Paprika maki).",
        "price": 4.6,
        "image": ""
      },
      {
        "id": "94f6f56e-87da-49e1-bdba-2dd4251e5ba5",
        "name": "Ebi Maki",
        "description": "Mit kleinen Garnelen. Es werden jeweils 6 stück servier (außer 122. Paprika maki).",
        "price": 4.6,
        "image": ""
      },
      {
        "id": "ba0325f8-2b1c-42a2-ad51-72b393589de1",
        "name": "Avocado Lachs Maki",
        "description": "Mit Avocado und Lachs. Es werden jeweils 6 stück servier (außer 122. Paprika maki).",
        "price": 5.2,
        "image": ""
      },
      {
        "id": "332f1865-faa3-4993-9033-6b0108bfe7c2",
        "name": "Spicy Tuna Maki",
        "description": "Mit pikant gewürzten Thunfisch. Es werden jeweils 6 stück servier (außer 122. Paprika maki).",
        "price": 5.2,
        "image": ""
      },
      {
        "id": "231e6dc8-bcf4-4723-b4b3-ed167480446f",
        "name": "Spicy Sake Maki",
        "description": "Mit pikant gewürzten Lachs. Es werden jeweils 6 stück servier (außer 122. Paprika maki).",
        "price": 5.2,
        "image": ""
      },
      {
        "id": "7ce814da-ba1e-417d-a8d3-09bd9c44259f",
        "name": "Frischkäse Maki",
        "description": "Mit Frischkäse. Es werden jeweils 6 stück servier (außer 122. Paprika maki).",
        "price": 3.5,
        "image": ""
      }
    ]
  },
  {
    "id": "sushi-burrito-7",
    "name": "Sushi Burrito 🍣",
    "description": "",
    "items": [
      {
        "id": "b36da041-1226-4ee9-aefe-cfa52fb5cfb3",
        "name": "B2 Burrito Chicken",
        "description": "",
        "price": 10.9,
        "image": "https://tb-static.uber.com/prod/image-proc/processed_images/93601717ff9d2a1c5d3b2e73f4ecc1c7/70aa2a4db7f990373ca9c376323e3dea.jpeg"
      },
      {
        "id": "6680e427-bf43-40fd-85d8-c8311fc63e4f",
        "name": "B4 Burrito Thunfisch",
        "description": "Mit Thunfisch, Lachs, Frischkäse, Gurken und gemischtem salat. Es werden jeweils 2 stück serviert.",
        "price": 10.9,
        "image": ""
      },
      {
        "id": "ad8e00ac-8f00-4bbc-8159-ede2b2e22da1",
        "name": "B1 Burrito Veggie",
        "description": "Mit Frischkäse, Edamame, gemischter salat und Mango. Es werden jeweils 2 stück serviert.",
        "price": 8.1,
        "image": ""
      },
      {
        "id": "4ff91690-31dd-42eb-8c0f-f10130727c9c",
        "name": "B3 Burrito Lachs",
        "description": "Mit Lachs, Frischkäse, Mango und gemischter salat. Es werden jeweils 2 stück serviert.",
        "price": 10.4,
        "image": ""
      }
    ]
  },
  {
    "id": "rainbow-rolls-8",
    "name": "Rainbow Rolls 🍣",
    "description": "",
    "items": [
      {
        "id": "8b77010d-f3be-433d-a6ba-2515146d160b",
        "name": "R1 Rainbow Lachs",
        "description": "Mit Lachs, Avocado und Frischkäse. Es werden jeweils 8 stück serviert.",
        "price": 11,
        "image": "https://tb-static.uber.com/prod/image-proc/processed_images/d7b1c5f5bb46a5a3e12ea8caa9235d35/a1681d67ebe55c76c3af5f401619c278.jpeg"
      },
      {
        "id": "1b87c2d3-bad3-4657-a3b5-e8e6558f70e7",
        "name": "R2 Rainbow Avocado",
        "description": "Mit Avocado, Lachs, Gurken und Frischkäse. Es werden jeweils 8 stück serviert.",
        "price": 10,
        "image": "https://tb-static.uber.com/prod/image-proc/processed_images/d1270a1c5f1a3f4b48fba7b51747f304/70aa2a4db7f990373ca9c376323e3dea.jpeg"
      },
      {
        "id": "c4770ca8-16e8-4221-a194-73531b6cf671",
        "name": "R3 Rainbow Mango",
        "description": "Mit Mango, Avocado, Gurken, Lachs und Frischkäse. Es werden jeweils 8 stück serviert.",
        "price": 9.2,
        "image": ""
      },
      {
        "id": "d4f41fb5-612e-4c91-a6a4-5cd0fb6199d4",
        "name": "R4 Rainbow Mix",
        "description": "Mit surimi (krabbenfleisch), Frischkäse, Avocado, Gurken und Mango. Es werden jeweils 8 stück serviert.",
        "price": 10.4,
        "image": ""
      }
    ]
  },
  {
    "id": "futo-maki-9",
    "name": "Futo Maki 🍣",
    "description": "",
    "items": [
      {
        "id": "ee407e97-7c3a-4362-acba-3e6ce2186a00",
        "name": "F2 Futo Veggie",
        "description": "Mit Frischkäse, Paprika, Avocado und Gurken. Es werden jeweils 8 stück serviert.",
        "price": 6.9,
        "image": "https://tb-static.uber.com/prod/image-proc/processed_images/4cb5a05f090478af0ee78acd15325604/70aa2a4db7f990373ca9c376323e3dea.jpeg"
      },
      {
        "id": "5589c18d-0f6a-421a-9403-46473e103022",
        "name": "F3 Futo Lachs und Avocado",
        "description": "Mit Lachs, Avocado und Frischkäse. Es werden jeweils 8 stück serviert.",
        "price": 8.1,
        "image": "https://tb-static.uber.com/prod/image-proc/processed_images/29b1f70d6b218b8ed3fbcd7b3e77cc83/70aa2a4db7f990373ca9c376323e3dea.jpeg"
      },
      {
        "id": "16211323-0930-4c70-9b71-a701da4e71e0",
        "name": "F1 Futo Eier Roll",
        "description": "Mit Eier und Frischkäse. Es werden jeweils 8 stück serviert.",
        "price": 5.8,
        "image": ""
      }
    ]
  },
  {
    "id": "california-rolls-10",
    "name": "California Rolls 🍣",
    "description": "",
    "items": [
      {
        "id": "c7c5631a-e33d-4090-9b3a-79d377ee16a3",
        "name": "C1 California Gurke",
        "description": "Mit Gurke, Frischkäse und als topping Sesam. Es werden jeweils 8 stück serviert.",
        "price": 5.8,
        "image": ""
      },
      {
        "id": "6988b694-c58d-4d32-9454-7e201842b3ee",
        "name": "C2 California Avocado",
        "description": "Mit Avocado und als topping Sesam. Es werden jeweils 8 stück serviert.",
        "price": 6.9,
        "image": ""
      },
      {
        "id": "bf1813c7-fad9-47ac-a719-b17a5439862e",
        "name": "C3 California Avocado, Gurke",
        "description": "Mit Avocado und Gurken und als topping Sesam. Es werden jeweils 8 stück serviert.",
        "price": 7.5,
        "image": ""
      },
      {
        "id": "b3dd5c1a-0606-4c25-8444-3c534f3bcaa7",
        "name": "C4 California Lachs",
        "description": "Mit Lachs, Avocado und Frischkäse und Sesam topping. Es werden jeweils 8 stück serviert.",
        "price": 8.1,
        "image": ""
      },
      {
        "id": "66451b4b-f740-4c93-97cd-ca288b4cc131",
        "name": "C5 California Surimi",
        "description": "Mit surimi (krabbenfleisch), Avocado, Gurken und Frischkäse und topping mit Sesam. Es werden jeweils 8 stück serviert.",
        "price": 8.1,
        "image": ""
      },
      {
        "id": "71f250a4-8e65-4ef8-8ace-2ad94bc8499e",
        "name": "C6 California Veggie Roll",
        "description": "Mit salat, Frischkäse und Avocado. Es werden jeweils 8 stück serviert.",
        "price": 6.9,
        "image": ""
      },
      {
        "id": "52f58a5f-955e-4450-af89-3e937f6f7434",
        "name": "C7 California Lachs, Gurke",
        "description": "Mit Lachs, Gurke und Frischkäse und topping mit Sesam. Es werden jeweils 8 stück serviert.",
        "price": 8.1,
        "image": ""
      },
      {
        "id": "b3f16bf8-5f18-443f-86d2-81879466d78d",
        "name": "C8 California Lachs Rucola",
        "description": "Mit Lachs, Rucola und Frischkäse, topping mit Sesam und . Es werden jeweils 8 stück serviert.",
        "price": 8.6,
        "image": ""
      },
      {
        "id": "54850222-fc7a-4271-8da1-af5fe1b807e3",
        "name": "C9 California Masago",
        "description": "Mit masago (roter kavier), Frischkäse, Avocado und Lachs. Es werden jeweils 8 stück serviert.",
        "price": 8.6,
        "image": ""
      },
      {
        "id": "8d6d50ef-2c01-4d96-a3b3-754855950b64",
        "name": "C10 California Crispy Lachs",
        "description": "Mit gekochtem Lachs, Frischkäse, Gurken und zwiebeln. Es werden jeweils 8 stück serviert.",
        "price": 9.2,
        "image": ""
      },
      {
        "id": "e04d5fc9-dfed-49bc-bb01-5223be89b869",
        "name": "C12 California Tempura Shrimp",
        "description": "Mit tempura shrimp, Frischkäse und Avocado. Es werden jeweils 8 stück serviert.",
        "price": 11.5,
        "image": ""
      }
    ]
  },
  {
    "id": "nigiri-sushi-11",
    "name": "Nigiri Sushi 🍣",
    "description": "",
    "items": [
      {
        "id": "abe26158-73ff-4bfd-b763-c5c2d5aa1c19",
        "name": "N2 Nigiri Avocado",
        "description": "Mit Avocado. Es werden jeweils 2 stück serviert.",
        "price": 4,
        "image": "https://tb-static.uber.com/prod/image-proc/processed_images/efa8a7b18ebd9821046d21e7b52cb905/70aa2a4db7f990373ca9c376323e3dea.jpeg"
      },
      {
        "id": "a011dc89-a558-4499-96fb-8ec8c387ae18",
        "name": "N4 Nigiri Inari",
        "description": "Mit tofu. Es werden jeweils 2 stück serviert.",
        "price": 4.6,
        "image": "https://tb-static.uber.com/prod/image-proc/processed_images/2c918b34b38a7d70d3a4fecb44f89537/70aa2a4db7f990373ca9c376323e3dea.jpeg"
      },
      {
        "id": "30764b96-c7f9-4bd5-a74e-e627d7b89f3f",
        "name": "N6 Nigiri Lachs",
        "description": "Mit Lachs. Es werden jeweils 2 stück serviert.",
        "price": 5.2,
        "image": "https://tb-static.uber.com/prod/image-proc/processed_images/6182c1eb074bbcf31fbb122b19afaf23/70aa2a4db7f990373ca9c376323e3dea.jpeg"
      },
      {
        "id": "f6a3a11a-6113-4199-a487-b4a6b66d3b7f",
        "name": "N9 Nigiri Thunfisch",
        "description": "Mit Thunfisch. Es werden jeweils 2 stück serviert.",
        "price": 5.8,
        "image": "https://tb-static.uber.com/prod/image-proc/processed_images/0ad80f568214c4ad68b6906446ff9861/70aa2a4db7f990373ca9c376323e3dea.jpeg"
      },
      {
        "id": "72b30016-e274-47c3-a611-8369a102fb93",
        "name": "N1 Nigiri Gurke",
        "description": "Mit Gurke. Es werden jeweils 2 stück serviert.",
        "price": 4,
        "image": ""
      },
      {
        "id": "9860cdfc-abaf-41fc-899f-025dd8d76f7a",
        "name": "N3 Nigiri Tamago",
        "description": "Mit Eier. Es werden jeweils 2 stück serviert.",
        "price": 3.5,
        "image": ""
      },
      {
        "id": "07b73b9f-cca8-4b47-b284-0e8b6a25d3d0",
        "name": "N7 Nigiri Saba",
        "description": "Mit mackarele. Es werden jeweils 2 stück serviert.",
        "price": 5.8,
        "image": ""
      },
      {
        "id": "76ae345d-f6b2-40ff-8130-8525bd38a1e6",
        "name": "N8 Nigiri Tako",
        "description": "Mit Oktopus. Es werden jeweils 2 stück serviert.",
        "price": 5.8,
        "image": ""
      }
    ]
  },
  {
    "id": "crunchy-rolls-12",
    "name": "Crunchy Rolls 🍣",
    "description": "",
    "items": [
      {
        "id": "dfa7d813-04b1-4c41-95b9-1154d6689fe4",
        "name": "Vegetarisch Crunchy Roll",
        "description": "7 stück mit salat, Avocado, Mango und Gurke und topping mit Sesam.",
        "price": 8.1,
        "image": "https://tb-static.uber.com/prod/image-proc/processed_images/9bc38f9444ca705bfa1ef896bf85c56a/70aa2a4db7f990373ca9c376323e3dea.jpeg"
      },
      {
        "id": "b0fa7045-b6b3-4b85-b21e-9d29dd55419e",
        "name": "Crunchy roll Lachs",
        "description": "Mit Lachs, Frischkäse, Avocado und Sesam.",
        "price": 10.9,
        "image": ""
      },
      {
        "id": "23e6e321-a084-48ef-b694-a2f6d474a630",
        "name": "Crunchy roll Tuna",
        "description": "Mit tuna, Frischkäse, Avocado und Sesam.",
        "price": 10.9,
        "image": ""
      },
      {
        "id": "efcaaf80-e352-4944-9375-1c8dc7d97640",
        "name": "Crunchy roll Garnelen",
        "description": "7 stück mit Garnelen, Avocado und Frischkäse.",
        "price": 10.4,
        "image": ""
      },
      {
        "id": "de23663b-4da9-476a-8543-24271f321610",
        "name": "Crunchy roll Surimi",
        "description": "7 stück mit surimi (krabbenfleisch) Eier und Avocado und topping mit Sesam.",
        "price": 9.2,
        "image": ""
      }
    ]
  },
  {
    "id": "sushi-rice-bowls-13",
    "name": "Sushi Rice Bowls 🍚",
    "description": "",
    "items": [
      {
        "id": "ab842878-c948-4b58-942b-14cc7d108e06",
        "name": "Yakitori Chicken Rice Bowl",
        "description": "Mit yakitori hühnchen, Avocados, Rettich, Edamame und gekochten Ei.",
        "price": 11.5,
        "image": ""
      },
      {
        "id": "1bf9220e-6a4a-45f4-ba82-46e2430564ef",
        "name": "Poke Bowl Lachs",
        "description": "Mit sushi rice, masago (roter kavier), Mango, Avocado, Gurken, Edamame und Sesam.",
        "price": 11.5,
        "image": ""
      },
      {
        "id": "8a3713c7-9c23-466a-8208-ee77d9da566f",
        "name": "Poke Bowl Vegan",
        "description": "Sushi rice, tofu, Edamame, Gurken, Mango, Avocado, roter salat, wakame und Sesam.",
        "price": 10.4,
        "image": ""
      }
    ]
  },
  {
    "id": "gebratener-reis-14",
    "name": "Gebratener Reis 🍚",
    "description": "",
    "items": [
      {
        "id": "bbc0897e-fba2-4a16-9e1a-ddec436ff3a9",
        "name": "Gebratener Eier Reis",
        "description": "Gebratener Reis mit Ei und Erbsen.",
        "price": 6.9,
        "image": ""
      }
    ]
  },
  {
    "id": "burger-und-pommes-frites-15",
    "name": "Burger und Pommes Frites🍔",
    "description": "",
    "items": [
      {
        "id": "91d349c2-6945-4f38-a7f7-add81f6e1c83",
        "name": "Veganer Burger",
        "description": "",
        "price": 4,
        "image": ""
      },
      {
        "id": "1e5831a1-5461-4d5a-9f66-cfb63a4c4d27",
        "name": "Pommes Frites",
        "description": "",
        "price": 4.6,
        "image": ""
      }
    ]
  },
  {
    "id": "alkoholfreie-getranke-16",
    "name": "Alkoholfreie Getränke 🥤",
    "description": "",
    "items": [
      {
        "id": "1a660f5e-0230-40fa-b716-f79c73c6898b",
        "name": "Coca-Cola® 0,5 L (EINWEG)",
        "description": "Koffeinhaltiges erfrischungsgetränk mit pflanzenextrakten, Zucker und mit kohlensäure.",
        "price": 4,
        "image": "https://tb-static.uber.com/prod/image-proc/processed_images/9f1b0562f786a639f2dfe7c30f1950a5/70aa2a4db7f990373ca9c376323e3dea.jpeg"
      },
      {
        "id": "603aff36-08aa-4565-9f5c-e115e6883cbe",
        "name": "Sprite 0,5 L (EINWEG)",
        "description": "Zitronenlimonade, gesüßt, Zucker und mit kohlensäure.",
        "price": 4,
        "image": "https://tb-static.uber.com/prod/image-proc/processed_images/8e36f5c5dd178b99c6357fbde5a119a4/70aa2a4db7f990373ca9c376323e3dea.jpeg"
      }
    ]
  },
  {
    "id": "besteck-17",
    "name": "Besteck",
    "description": "",
    "items": [
      {
        "id": "fdcdd832-4440-47c6-a26c-2601b8c24296",
        "name": "Besteck",
        "description": "Das restaurant fügt besteck wie messer, löffel, gabeln usw. Hinzu und falls vorhanden.",
        "price": 0,
        "image": ""
      }
    ]
  }
];
