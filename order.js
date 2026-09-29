/* Tandoor on-site ordering: cart, Stripe checkout, Clover POS + kitchen.
   The customer pays exactly menu + 9% tax + tip via Stripe's Payment Element
   (a 6% fee pool is taken from the order total server-side: Stripe's 2.9%+30c
   plus the RockMill Social Co application fee). After Stripe captures payment,
   the backend creates the Clover v3 order, records an external payment, fires
   the kitchen printer, and emails/texts the staff. Raw card numbers never
   touch this site or its servers.
   NOTE: the Clover hosted-iframe code below is kept intact but unused. */
(function () {
'use strict';
var MENU_PRICES = {"Tomato Soup":799,"Lentil Soup":699,"Sweetcorn Soup (VEG.)":699,"Monchow Soup":699,"Chef Special Chicken Soup":899,"Chicken Monchow Soup":899,"Chef Special Lamb Soup":899,"Sweetcorn Soup (CHICKEN)":799,"Samosa":899,"Mixed Pakora":1299,"Masala Papad (2)":699,"Chilli Paneer":1599,"Samosa Chaat":1199,"Onion Pakora":1299,"Gobi Manchurian":1599,"Papad":399,"Soy Chaap Masala":1599,"Paneer Darbar":1699,"Baby Corn Darbar":1599,"Gobi 65":1499,"Corn Patta Chaat":1299,"Bombay Bhel":1299,"Pani Puri":1299,"Makhmali Paneer Angara":1799,"Harabhara Paneer Kebab":1799,"Paneer Manchurian":1599,"Chicken Chukka":1799,"Chicken 65":1599,"Chilli Chicken":1599,"Chicken Manchurian":1599,"Fish Manchurian":1599,"Lamb Chukka":1899,"Goat Ghee Roast":1899,"Shrimp 65":1599,"Chicken Darbar":1699,"Chicken Lollipop":1499,"Chicken Tikka":1799,"Malai Chicken (Mild)":1799,"Haryali Chicken (MEDIUM)":1799,"Tandoori Chicken":1799,"Lamb Chops":2599,"Assorted Kebabas":2099,"Tandoori Pompano":2299,"Tandoori Chicken Full":2999,"Tandoori Wings":1199,"Paneer Butter Masala":1899,"Paneer Tikka Masala":1899,"Matar Paneer":1799,"Kadai Corn Mushroom":1799,"Malai Koftha":1799,"Navratan Korma":1899,"Dal Makhni":1799,"Amritsari Chole Masala":1699,"Bhindi Do Pyaza":1799,"Aloo Gobi Masala":1799,"Tofu Tikka Masala":1799,"Mushroom Tikka Masala":1799,"Veg. Malabar":1799,"Dal Palak":1699,"Dal Tadka":1799,"Veg. Chettinad":1799,"Kaju Kasuri Methi":1899,"Palak Paneer":1899,"Amritsari Paneer Bhurji":1899,"Baingan Curry":1799,"Paneer Methi Malai":1899,"Veg. Jalfrezi":1899,"Tofu Chole Curry":1799,"Balti Paneer":1999,"Sham Savera":1899,"Mushroom Butter Masala":1899,"Chicken Korma":1899,"Butter Chicken":1899,"Chicken Tikka Masala":1999,"Chicken Malabar":1899,"Chicken RoganJosh":1999,"Chicken Saagwala":1999,"Chicken Vindalloo":1999,"Kadai Chicken":2099,"Lamb Saagwala":2099,"Lamb RoganJosh":1999,"Lamb Vindalloo":2099,"Lamb Jalfrezi":1999,"Lamb Tikka Masala":2099,"Shrimp Korma":1999,"Goat Curry":2099,"Goat Saagwala":2099,"Methi Malai Chicken":2099,"Mango Chicken Curry":1999,"Chicken Chettinad":1999,"Achari Chicken Curry":1999,"The Sweet Cashew Chicken Curry":2199,"Lamb Chettinad":2099,"Lamb Gongura":2099,"Lamb Korma":2099,"Fish Malabar":1899,"Chicken Gongura":1999,"Chef Special Chicken Curry":1999,"Plain Rice":499,"Jeera Rice":799,"Ghee Rice":799,"Masala Rice":799,"Veg. Biryani":1699,"Paneer Biryani":1799,"Vijaywada Boneless Chicken Biryani":1799,"Chicken Biryani with bone":1899,"Lamb Biryani":1999,"Goat Biryani":1999,"Chicken Tikka Biryani":1999,"Family Pack Biryani":0,"Chicken Nuggets & Fries":699,"Mozzarella Sticks & Fries":699,"French Fries":699,"Plain Warm Milk":299,"Jr. Butter Chicken":1099,"Jr. Paneer Butter Masala":1099,"Gulab Jamun":599,"Rasmalai":599,"Carrot Halwa":699,"Mung Daal Halwo":599,"Vegan Lentil Soup":699,"Vegan Sweetcorn Soup":699,"Vegan Samosa":899,"Vegan Panipuri":1299,"Vegan Samosa Chaat":1199,"Vegan Bombay Bhel":1299,"Vegan Corn Patta Chaat":1299,"Vegan Onion Pakora":1299,"Vegan Mixed Pakora":1299,"Vegan Papad":399,"Vegan Masala Papad":699,"Vegan Kadai Corn Mushroom":1899,"Vegan Baingan Curry":1899,"Vegan Veg Jalfrezi":1999,"Vegan Amritsari Chole Masala":1699,"Vegan Bhindi Do Pyaza":1899,"Vegan Aloo Gobi Masala":1799,"Vegan Tofu Tikka Masala":1799,"Vegan Mushroom Tikka Masala":1799,"Vegan Veg. Malabar":1799,"Vegan Dal Palak":1699,"Vegan Dal Tadka":1799,"Vegan Veg Chettinad":1799,"Vegan Plain Roti":449,"Onion Kulcha":599,"Malabar Paratha (2Pc)":699,"Haryali Naan (Mint - Cilantro)":449,"Plain Naan (NO BUTTER)":399,"Butter Naan":499,"Garlic Butter Naan":549,"Chilli Garlic Naan":649,"Cheese Naan":699,"Bullet Naan (CHILLI)":599,"Chilli Cheese Naan":699,"Masala Naan":499,"Chilli Cheese Garlic Naan":699,"Peshwari Naan":699,"Assorted Bread Basket Naan":1499,"Plain Roti (NO BUTTER)":449,"Butter Roti Tandoori":499,"Cheese Garlic Naan":699,"Raita":299,"Onion, Lemon, Chilli":299,"Tikka Sauce":499,"Malai Sauce":499,"Masala Papad":699,"Pickle":199,"Mango Chutney":199,"Mint Chutney":299,"Tamarind Chutney":299,"Veg. Fried Rice":1699,"Paneer Fried Rice":1699,"Chicken Fried Rice":1799,"Shrimp Fried Rice":1799,"Street Style Veg. Fried Rice":1799,"Street Style Paneer Fried Rice":1799,"Street style Chicken Fried Rice":1899,"Street style Shrimp Fried Rice":1899,"Hakka Noodles VEG":1599,"Hakka Noodles Paneer":1599,"Hakka Noodles Chicken":1699,"Hakka Noodles Shrimp":1699,"Street Style Hakka Noodles VEG":1699,"Street Style Hakka Noodles PANEER":1699,"Street Style Hakka Noodles Chicken":1799,"Street Style Hakka Noodles Shrimp":1799,"Family Pack Hakka Noodles (58 Oz)":0,"Family Pack Fried Rice (58 Oz)":0,"Veg. Tikka Pasta":1599,"Paneer Tikka Pasta":1599,"Chef. Sp Veg Pasta":1699,"Chef Sp. Paneer Pasta":1699,"Butter Chicken Pasta":1699,"Chicken Tikka Pasta":1699,"Chef Sp. Chicken Pasta":1799,"Water":50,"Mango Lassi":549,"Buttermilk MASALA":499,"Rosemilk":499,"Redbull 12oz":399,"Ginger Masala Tea":499,"Madras Hot Coffee":499,"Fiji Water 500 Ml":399,"Fiji Water 1L":599,"Sweet Tea With Lemon":299,"Fountain Drink":300,"Unsweet Tea":299,"Half & Half Tea":299,"Frootie":300,"Lemonade":299,"Spellegrino Sparkling Water":399,"Orange Juice":300,"Corona Non Alcoholic":500,"Can Soda":300,"Rupee NON ALC":600,"Bottle Water":249};
var CLOVER_PK = 'ad2f8be87c9d3351c43532727f62abaf';
var TAX_RATE = 0.09;

/* ---------- catering mode ----------
   The catering menu is a SEPARATE tray menu (embedded below from
   site/catering_menu.json - same static-embed pattern as MENU_PRICES, no
   fetch dependency). Regular-menu prices NEVER change; delivery is ONLY
   offered on catering orders ($100 flat within 20 miles); the regular menu
   is pickup-only. Catering has its own cart (catCart); switching modes
   never mixes the two carts. */
var CATERING_MENU = [{"name":"Samosa","cat":"Veg Appetizers","type":"pack","options":[{"qty":20,"unit":300},{"qty":30,"unit":275},{"qty":50,"unit":200}]},{"name":"Samosa Chaat","cat":"Veg Appetizers","type":"tray","small":5200,"medium":8400,"large":14600},{"name":"Chilli Paneer","cat":"Veg Appetizers","type":"tray","small":6300,"medium":9400,"large":18200},{"name":"Chilli Gobi","cat":"Veg Appetizers","type":"tray","small":6300,"medium":9400,"large":18200},{"name":"Chilli Baby Corn","cat":"Veg Appetizers","type":"tray","small":6300,"medium":9400,"large":18200},{"name":"Chilli Mushroom","cat":"Veg Appetizers","type":"tray","small":6300,"medium":9400,"large":18200},{"name":"Babycorn Manchurian","cat":"Veg Appetizers","type":"tray","small":6300,"medium":9400,"large":18200},{"name":"Gobi Manchurian","cat":"Veg Appetizers","type":"tray","small":6300,"medium":9400,"large":18200},{"name":"Mushroom Manchurian","cat":"Veg Appetizers","type":"tray","small":6300,"medium":9400,"large":18200},{"name":"Paneer Manchurian","cat":"Veg Appetizers","type":"tray","small":6300,"medium":9400,"large":18200},{"name":"Mushroom 65","cat":"Veg Appetizers","type":"tray","small":6300,"medium":9400,"large":18200},{"name":"Baby Corn 65","cat":"Veg Appetizers","type":"tray","small":6300,"medium":9400,"large":18200},{"name":"Paneer 65","cat":"Veg Appetizers","type":"tray","small":6300,"medium":9400,"large":18200},{"name":"Gobi 65","cat":"Veg Appetizers","type":"tray","small":6300,"medium":9400,"large":18200},{"name":"Mixed Pakora","cat":"Veg Appetizers","type":"tray","small":5200,"medium":7800,"large":12500},{"name":"Makhmali Paneer Angara","cat":"Veg Appetizers","type":"tray","small":8400,"medium":12500,"large":18800},{"name":"Haryali Paneer Kebab","cat":"Veg Appetizers","type":"tray","small":8400,"medium":12500,"large":18800},{"name":"Chicken Chukka","cat":"Non-Veg Appetizers","type":"tray","small":8400,"medium":14600,"large":19800},{"name":"Lamb Chukka","cat":"Non-Veg Appetizers","type":"tray","small":8400,"medium":15600,"large":22900},{"name":"Goat Chukka","cat":"Non-Veg Appetizers","type":"tray","small":8400,"medium":15600,"large":20800},{"name":"Chilli Fish","cat":"Non-Veg Appetizers","type":"tray","small":8400,"medium":14600,"large":19800},{"name":"Chilli Chicken","cat":"Non-Veg Appetizers","type":"tray","small":7300,"medium":12500,"large":16700},{"name":"Chilli Shrimp","cat":"Non-Veg Appetizers","type":"tray","small":7300,"medium":12500,"large":16700},{"name":"Chicken Darbar","cat":"Non-Veg Appetizers","type":"tray","small":7300,"medium":12500,"large":16700},{"name":"Chicken Manchurian","cat":"Non-Veg Appetizers","type":"tray","small":7300,"medium":12500,"large":16700},{"name":"Shrimp Manchurian","cat":"Non-Veg Appetizers","type":"tray","small":7300,"medium":12500,"large":16700},{"name":"Fish Manchurian","cat":"Non-Veg Appetizers","type":"tray","small":7300,"medium":12500,"large":16700},{"name":"Chicken 65","cat":"Non-Veg Appetizers","type":"tray","small":7300,"medium":12500,"large":16700},{"name":"Fish 65","cat":"Non-Veg Appetizers","type":"tray","small":7300,"medium":12500,"large":16700},{"name":"Shrimp 65","cat":"Non-Veg Appetizers","type":"tray","small":7300,"medium":12500,"large":16700},{"name":"Chicken 555","cat":"Non-Veg Appetizers","type":"tray","small":7300,"medium":12500,"large":16700},{"name":"Fish 555","cat":"Non-Veg Appetizers","type":"tray","small":7300,"medium":12500,"large":16700},{"name":"Shrimp 555","cat":"Non-Veg Appetizers","type":"tray","small":7300,"medium":12500,"large":16700},{"name":"Chicken Ghee Roast","cat":"Non-Veg Appetizers","type":"tray","small":8400,"medium":14600,"large":18800},{"name":"Goat Ghee Roast","cat":"Non-Veg Appetizers","type":"tray","small":8400,"medium":15600,"large":20800},{"name":"Lamb Ghee Roast","cat":"Non-Veg Appetizers","type":"tray","small":8400,"medium":15600,"large":22900},{"name":"Chicken Wings","cat":"Non-Veg Appetizers","type":"tray","small":8400,"medium":14600,"large":19800},{"name":"Tandoori Chicken","cat":"Non-Veg Appetizers","type":"tray","small":8400,"medium":14600,"large":19800},{"name":"Dal Palak","cat":"Veg Entrees","type":"tray","small":5200,"medium":8400,"large":13600},{"name":"Dal Tadka","cat":"Veg Entrees","type":"tray","small":5200,"medium":8400,"large":13600},{"name":"Dal Makhni","cat":"Veg Entrees","type":"tray","small":6300,"medium":9400,"large":15600},{"name":"Baingan Curry","cat":"Veg Entrees","type":"tray","small":7300,"medium":12500,"large":15600},{"name":"Bhindi Masala","cat":"Veg Entrees","type":"tray","small":7300,"medium":12500,"large":15600},{"name":"Balti Paneer","cat":"Veg Entrees","type":"tray","small":7300,"medium":12500,"large":15600},{"name":"Tofu Chole Curry","cat":"Veg Entrees","type":"tray","small":7300,"medium":12500,"large":15600},{"name":"Paneer Methi Malai","cat":"Veg Entrees","type":"tray","small":7300,"medium":12500,"large":15600},{"name":"Matar Paneer Masala","cat":"Veg Entrees","type":"tray","small":7300,"medium":12500,"large":15600},{"name":"Mushroom Butter Masala","cat":"Veg Entrees","type":"tray","small":7300,"medium":12500,"large":15600},{"name":"Paneer Butter Masala","cat":"Veg Entrees","type":"tray","small":7300,"medium":12500,"large":15600},{"name":"Tofu Butter Masala","cat":"Veg Entrees","type":"tray","small":7300,"medium":12500,"large":15600},{"name":"Kadai Corn Mushroom","cat":"Veg Entrees","type":"tray","small":7300,"medium":12500,"large":15600},{"name":"Kadai Veg","cat":"Veg Entrees","type":"tray","small":7300,"medium":12500,"large":15600},{"name":"Veg Tikka Masala","cat":"Veg Entrees","type":"tray","small":7300,"medium":12500,"large":15600},{"name":"Mushroom Tikka Masala","cat":"Veg Entrees","type":"tray","small":7300,"medium":12500,"large":15600},{"name":"Veg Jalfrezi","cat":"Veg Entrees","type":"tray","small":7300,"medium":12500,"large":15600},{"name":"Paneer Jalfrezi","cat":"Veg Entrees","type":"tray","small":7300,"medium":12500,"large":15600},{"name":"Veg Malabar","cat":"Veg Entrees","type":"tray","small":7300,"medium":12500,"large":15600},{"name":"Paneer Korma","cat":"Veg Entrees","type":"tray","small":7300,"medium":12500,"large":15600},{"name":"Kaju Kasuri Methi","cat":"Veg Entrees","type":"tray","small":8400,"medium":13600,"large":20300},{"name":"Chole Saag Curry","cat":"Veg Entrees","type":"tray","small":6800,"medium":12000,"large":15600},{"name":"Amritsari Chole Masala","cat":"Veg Entrees","type":"tray","small":6800,"medium":12000,"large":15600},{"name":"Aloo Gobi Masala","cat":"Veg Entrees","type":"tray","small":6800,"medium":12000,"large":15600},{"name":"Matar Mushroom Masala","cat":"Veg Entrees","type":"tray","small":6800,"medium":12000,"large":15600},{"name":"Veg Chettinad","cat":"Veg Entrees","type":"tray","small":6800,"medium":12000,"large":15600},{"name":"Paneer Chettinad","cat":"Veg Entrees","type":"tray","small":6800,"medium":12000,"large":15600},{"name":"Malai Koftha","cat":"Veg Entrees","type":"tray","small":7800,"medium":14100,"large":16700},{"name":"Palak Koftha","cat":"Veg Entrees","type":"tray","small":7800,"medium":14100,"large":16700},{"name":"Palak Paneer","cat":"Veg Entrees","type":"tray","small":7800,"medium":14100,"large":16700},{"name":"Amritsari Paneer Bhurji","cat":"Veg Entrees","type":"tray","small":8400,"medium":14100,"large":17700},{"name":"Amul Cheese Paneer Butter Masala","cat":"Veg Entrees","type":"tray","small":9400,"medium":14600,"large":20800},{"name":"Kadai Paneer","cat":"Veg Entrees","type":"tray","small":7800,"medium":13600,"large":16700},{"name":"Tofu Tikka Masala","cat":"Veg Entrees","type":"tray","small":7800,"medium":13600,"large":16700},{"name":"Paneer Tikka Masala","cat":"Veg Entrees","type":"tray","small":7800,"medium":13600,"large":16700},{"name":"Navratan Korma","cat":"Veg Entrees","type":"tray","small":7800,"medium":13600,"large":16700},{"name":"Paneer Gongura","cat":"Veg Entrees","type":"tray","small":7800,"medium":13600,"large":16700},{"name":"Veg Gongura","cat":"Veg Entrees","type":"tray","small":7800,"medium":13000,"large":15600},{"name":"Butter Chicken","cat":"Non-Veg Entrees","type":"tray","small":7300,"medium":13600,"large":16700},{"name":"Chicken Tikka Masala","cat":"Non-Veg Entrees","type":"tray","small":7300,"medium":13600,"large":16700},{"name":"Methi Malai Chicken","cat":"Non-Veg Entrees","type":"tray","small":7300,"medium":13600,"large":16700},{"name":"Kadai Chicken","cat":"Non-Veg Entrees","type":"tray","small":7300,"medium":13600,"large":16700},{"name":"Chicken Vindaloo","cat":"Non-Veg Entrees","type":"tray","small":7300,"medium":13600,"large":16700},{"name":"Chicken Malabar","cat":"Non-Veg Entrees","type":"tray","small":7300,"medium":13600,"large":16700},{"name":"Chef Special Chicken Curry","cat":"Non-Veg Entrees","type":"tray","small":7300,"medium":13600,"large":16700},{"name":"Chicken Chettinad","cat":"Non-Veg Entrees","type":"tray","small":7300,"medium":13600,"large":16700},{"name":"Chicken Gongura","cat":"Non-Veg Entrees","type":"tray","small":7300,"medium":13600,"large":16700},{"name":"Chicken Rogan Josh","cat":"Non-Veg Entrees","type":"tray","small":7300,"medium":13600,"large":16700},{"name":"Chicken Korma","cat":"Non-Veg Entrees","type":"tray","small":7300,"medium":13600,"large":16700},{"name":"Lamb Rogan Josh","cat":"Non-Veg Entrees","type":"tray","small":8400,"medium":14600,"large":20800},{"name":"Goat Saag","cat":"Non-Veg Entrees","type":"tray","small":8400,"medium":14600,"large":20800},{"name":"Lamb Vindaloo","cat":"Non-Veg Entrees","type":"tray","small":8400,"medium":14600,"large":20800},{"name":"Lamb Gongura","cat":"Non-Veg Entrees","type":"tray","small":8400,"medium":14600,"large":20800},{"name":"Goat Gongura","cat":"Non-Veg Entrees","type":"tray","small":8400,"medium":14600,"large":20800},{"name":"Shrimp Gongura","cat":"Non-Veg Entrees","type":"tray","small":8400,"medium":14600,"large":20800},{"name":"Lamb Butter Masala","cat":"Non-Veg Entrees","type":"tray","small":8400,"medium":14600,"large":20800},{"name":"Goat Butter Masala","cat":"Non-Veg Entrees","type":"tray","small":8400,"medium":14600,"large":20800},{"name":"Shrimp Butter Masala","cat":"Non-Veg Entrees","type":"tray","small":8400,"medium":14600,"large":20800},{"name":"Lamb Tikka Masala","cat":"Non-Veg Entrees","type":"tray","small":8400,"medium":14600,"large":20800},{"name":"Shrimp Tikka Masala","cat":"Non-Veg Entrees","type":"tray","small":8400,"medium":14600,"large":20800},{"name":"Goat Tikka Masala","cat":"Non-Veg Entrees","type":"tray","small":8400,"medium":14600,"large":20800},{"name":"Lamb Curry","cat":"Non-Veg Entrees","type":"tray","small":8400,"medium":14600,"large":20800},{"name":"Goat Curry","cat":"Non-Veg Entrees","type":"tray","small":8400,"medium":14600,"large":20800},{"name":"Lamb Saagwala","cat":"Non-Veg Entrees","type":"tray","small":8400,"medium":14600,"large":20800},{"name":"Shrimp Saagwala","cat":"Non-Veg Entrees","type":"tray","small":8400,"medium":14600,"large":20800},{"name":"Goat Rogan Josh","cat":"Non-Veg Entrees","type":"tray","small":8400,"medium":14600,"large":20800},{"name":"Lamb Chettinad","cat":"Non-Veg Entrees","type":"tray","small":8400,"medium":14600,"large":20800},{"name":"Goat Chettinad","cat":"Non-Veg Entrees","type":"tray","small":8400,"medium":14600,"large":20800},{"name":"Shrimp Chettinad","cat":"Non-Veg Entrees","type":"tray","small":8400,"medium":14600,"large":20800},{"name":"Fish Chettinad","cat":"Non-Veg Entrees","type":"tray","small":8400,"medium":14600,"large":20800},{"name":"Shrimp Vindaloo","cat":"Non-Veg Entrees","type":"tray","small":8400,"medium":14600,"large":20800},{"name":"Lamb Malabar","cat":"Non-Veg Entrees","type":"tray","small":8400,"medium":14600,"large":20800},{"name":"Shrimp Malabar","cat":"Non-Veg Entrees","type":"tray","small":8400,"medium":14600,"large":20800},{"name":"Lamb Korma","cat":"Non-Veg Entrees","type":"tray","small":8400,"medium":14600,"large":20800},{"name":"Goat Korma","cat":"Non-Veg Entrees","type":"tray","small":8400,"medium":14600,"large":20800},{"name":"Shrimp Korma","cat":"Non-Veg Entrees","type":"tray","small":8400,"medium":14600,"large":20800},{"name":"Mango Chicken Curry","cat":"Non-Veg Entrees","type":"tray","small":8400,"medium":14600,"large":18800},{"name":"Chicken Saagwala","cat":"Non-Veg Entrees","type":"tray","small":7800,"medium":14100,"large":18200},{"name":"Fish Vindaloo","cat":"Non-Veg Entrees","type":"tray","small":8400,"medium":14600,"large":19800},{"name":"Fish Malabar","cat":"Non-Veg Entrees","type":"tray","small":8400,"medium":14600,"large":19800},{"name":"Kadai Lamb","cat":"Non-Veg Entrees","type":"tray","small":8400,"medium":14600,"large":21900},{"name":"Kadai Goat","cat":"Non-Veg Entrees","type":"tray","small":8400,"medium":14600,"large":21900},{"name":"Egg Curry","cat":"Non-Veg Entrees","type":"tray","small":8400,"medium":14600,"large":18800},{"name":"Veg Biryani","cat":"Biryani & Rice","type":"tray","small":7300,"medium":12500,"large":14600},{"name":"Paneer Biryani","cat":"Biryani & Rice","type":"tray","small":7300,"medium":12500,"large":15600},{"name":"Chicken Biryani (with Bone)","cat":"Biryani & Rice","type":"tray","small":8400,"medium":14100,"large":17700},{"name":"Vijaywada Chicken Biryani (Boneless)","cat":"Biryani & Rice","type":"tray","small":8400,"medium":14100,"large":17700},{"name":"Chicken Tikka Biryani","cat":"Biryani & Rice","type":"tray","small":8400,"medium":14100,"large":17700},{"name":"Fish Biryani","cat":"Biryani & Rice","type":"tray","small":8400,"medium":14100,"large":17700},{"name":"Goat Biryani","cat":"Biryani & Rice","type":"tray","small":8400,"medium":14100,"large":17700},{"name":"Lamb Biryani","cat":"Biryani & Rice","type":"tray","small":8400,"medium":14100,"large":17700},{"name":"Shrimp Biryani","cat":"Biryani & Rice","type":"tray","small":8400,"medium":14100,"large":17700},{"name":"Egg Biryani","cat":"Biryani & Rice","type":"tray","small":7300,"medium":13000,"large":15600},{"name":"Plain Rice","cat":"Biryani & Rice","type":"tray","small":3200,"medium":5200,"large":8400},{"name":"Ghee Rice with Nuts","cat":"Biryani & Rice","type":"tray","small":4200,"medium":6300,"large":10400},{"name":"Jeera Rice","cat":"Biryani & Rice","type":"tray","small":4200,"medium":6300,"large":10400},{"name":"Masala Rice","cat":"Biryani & Rice","type":"tray","small":4200,"medium":6300,"large":10400},{"name":"Naan / Roti","cat":"Breads","type":"each","unit":400,"min":20},{"name":"Garlic Naan","cat":"Breads","type":"each","unit":500,"min":20},{"name":"Onion, Lemon & Chilli","cat":"Sides","type":"tray","small":3200,"medium":5200,"large":7800},{"name":"Mint Sauce (32 oz)","cat":"Sides","type":"fixed","price":2100},{"name":"Tamarind Sauce (32 oz)","cat":"Sides","type":"fixed","price":2100},{"name":"Raitha (32 oz)","cat":"Sides","type":"fixed","price":2600},{"name":"Papad","cat":"Sides","type":"each","unit":200,"min":20},{"name":"Gulab Jamun","cat":"Desserts","type":"pack","options":[{"qty":20,"unit":300},{"qty":30,"unit":200},{"qty":50,"unit":200}]},{"name":"Rasmalai","cat":"Desserts","type":"pack","options":[{"qty":21,"unit":300},{"qty":30,"unit":200},{"qty":50,"unit":200}]},{"name":"Carrot Halwa","cat":"Desserts","type":"tray","small":7800,"medium":11500,"large":15600},{"name":"Moong Dal Halwa","cat":"Desserts","type":"tray","small":7800,"medium":11500,"large":15600},{"name":"Pineapple Halwa","cat":"Desserts","type":"tray","small":7800,"medium":11500,"large":15600}];
var CATERING_CATS = ['Veg Appetizers', 'Non-Veg Appetizers', 'Veg Entrees', 'Non-Veg Entrees', 'Biryani & Rice', 'Breads', 'Sides', 'Desserts'];
var TRAY_LABEL = { small: 'Small Tray', medium: 'Medium Tray', large: 'Large Tray' };
var TRAY_SERVES = { small: 'Serves 8\u201310', medium: 'Serves 16\u201318', large: 'Serves 23\u201325' };
var orderMode = 'pickup'; // 'pickup' | 'catering'
var CATERING_SLOTS = ['11:30','12:00','12:30','13:00','13:30','14:00','14:30',
                      '15:00','15:30','16:00','16:30','17:00','17:30','18:00',
                      '18:30','19:00','19:30','20:00'];
var CATERING_FEE = 10000; // $100 flat catering delivery fee, in cents
var cateringFulfillment = 'pickup'; // fulfillment choice on the catering form

/* ---------- catering cart: { key: { name, kind, option, qty } } ----------
   kind: 'tray' | 'pack' | 'each' | 'fixed'. option: tray size
   ('small'|'medium'|'large'), pack piece-count as a string, or '' for
   each/fixed. Mirrors netlify/functions/lib/pricing.js cateringLine. */
var catCart = {};
try { catCart = JSON.parse(localStorage.getItem('tandoor_cat_cart') || '{}'); } catch (e) { catCart = {}; }
function catMenuItem(name) {
  for (var i = 0; i < CATERING_MENU.length; i++) {
    if (CATERING_MENU[i].name === name) return CATERING_MENU[i];
  }
  return null;
}
function catCartKey(name, kind, option) {
  return JSON.stringify([name, kind, String(option || '')]);
}
/* Display name mirrors the backend: tray -> "Name (Large Tray)",
   pack -> "Name (30 pc)", each/fixed -> name as-is. */
function catDisplayName(e) {
  var m = catMenuItem(e.name);
  var base = m ? m.name : e.name;
  if (e.kind === 'tray' && TRAY_LABEL[e.option]) return base + ' (' + TRAY_LABEL[e.option] + ')';
  if (e.kind === 'pack') return base + ' (' + e.option + ' pc)';
  return base;
}
/* Unit price in cents, validated against the menu. Null when invalid. */
function catUnitPrice(e) {
  var m = catMenuItem(e.name);
  if (!m || m.type !== e.kind) return null;
  if (e.kind === 'tray') {
    return TRAY_LABEL[e.option] ? m[e.option] : null;
  }
  if (e.kind === 'pack') {
    for (var i = 0; i < m.options.length; i++) {
      if (String(m.options[i].qty) === String(e.option)) return m.options[i].qty * m.options[i].unit;
    }
    return null;
  }
  if (e.kind === 'each') return m.unit;
  if (e.kind === 'fixed') return m.price;
  return null;
}
// Drop stored lines that no longer match the menu.
Object.keys(catCart).forEach(function (k) {
  var e = catCart[k];
  var u = e && catUnitPrice(e);
  var cap = e && { tray: 20, pack: 10, each: 1000, fixed: 20 }[e.kind];
  var minQ = e && e.kind === 'each' ? ((catMenuItem(e.name) || {}).min || 1) : 1;
  if (u == null || !(e.qty >= minQ && e.qty <= cap)) delete catCart[k];
});
function catDefaultOption(it) {
  if (it.type === 'tray') return 'small';
  if (it.type === 'pack') return String(it.options[0].qty);
  return '';
}
function catDefaultQty(it) {
  return it.type === 'each' ? it.min : 1;
}
function addToCatCart(name, kind, option, qty) {
  var m = catMenuItem(name);
  if (!m || m.type !== kind) return;
  var caps = { tray: [1, 20], pack: [1, 10], each: [m.min, 1000], fixed: [1, 20] };
  var lo = caps[kind][0], hi = caps[kind][1];
  qty = parseInt(qty, 10);
  if (!(qty >= lo && qty <= hi)) return;
  if (kind === 'tray' && !TRAY_LABEL[option]) return;
  if (kind === 'pack') {
    var okPack = false;
    m.options.forEach(function (o) { if (String(o.qty) === String(option)) okPack = true; });
    if (!okPack) return;
  }
  var key = catCartKey(name, kind, option);
  var e = catCart[key] || { name: name, kind: kind, option: String(option || ''), qty: 0 };
  e.qty = Math.min(hi, e.qty + qty);
  catCart[key] = e;
  saveCatCart(); renderCartBtn();
}
function saveCatCart() { try { localStorage.setItem('tandoor_cat_cart', JSON.stringify(catCart)); } catch (e) {} }
function catCartCount() { return Object.keys(catCart).reduce(function (a, k) { return a + catCart[k].qty; }, 0); }
function catCartSubtotal() {
  return Object.keys(catCart).reduce(function (a, k) {
    var u = catUnitPrice(catCart[k]) || 0;
    return a + u * catCart[k].qty;
  }, 0);
}
function cateringMath() {
  // Display-only math; the server recomputes authoritatively.
  var sub = catCartSubtotal();
  var fee = cateringFulfillment === 'delivery' ? CATERING_FEE : 0;
  // Decided 2026-09-28 (Simit): no sales tax on the catering delivery fee.
  var tax = Math.round(sub * TAX_RATE);
  return { sub: sub, reward: 0, effSub: sub, fee: fee, tax: tax, tip: 0, total: sub + fee + tax };
}
function fmtDateInput(d) {
  var m = '' + (d.getMonth() + 1), day = '' + d.getDate();
  return d.getFullYear() + '-' + (m.length < 2 ? '0' + m : m) + '-' + (day.length < 2 ? '0' + day : day);
}
function fmtLongDate(ymd) {
  var parts = String(ymd).split('-');
  var d = new Date(+parts[0], +parts[1] - 1, +parts[2]);
  var days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
  var months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  return days[d.getDay()] + ', ' + months[d.getMonth()] + ' ' + d.getDate();
}
function fmtTime12(hhmm) {
  var p = String(hhmm).split(':'), h = +p[0], m = p[1];
  var ap = h >= 12 ? 'PM' : 'AM';
  h = h % 12; if (h === 0) h = 12;
  return h + ':' + m + ' ' + ap;
}
function fmtDateInput(d) {
  var m = '' + (d.getMonth() + 1), day = '' + d.getDate();
  return d.getFullYear() + '-' + (m.length < 2 ? '0' + m : m) + '-' + (day.length < 2 ? '0' + day : day);
}
function fmtLongDate(ymd) {
  var parts = String(ymd).split('-');
  var d = new Date(+parts[0], +parts[1] - 1, +parts[2]);
  var days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
  var months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  return days[d.getDay()] + ', ' + months[d.getMonth()] + ' ' + d.getDate();
}
function fmtTime12(hhmm) {
  var p = String(hhmm).split(':'), h = +p[0], m = p[1];
  var ap = h >= 12 ? 'PM' : 'AM';
  h = h % 12; if (h === 0) h = 12;
  return h + ':' + m + ' ' + ap;
}

/* ---------- modifiers: questions asked before a dish goes in the cart ----------
   Verified against the Clover modifier setup on 2026-09-24.
   Spice Level / No Mild / No Spicy, Sauce, Fountain Drink, Can Soda, Papad,
   Ghee Rice and Bowl Of Rice are REQUIRED pick-one. Add-on is OPTIONAL pick-one.
   Family packs (2026-09-29): $0 base, price from required choice; the biryani
   pack also asks the required Free Appetizer question. Kids menu: no questions
   (per Simit). */
var MOD_QUESTIONS = {
  spice:    { title: 'How spicy?', required: true, multi: false,
              options: ['Very Mild', 'Mild', 'Medium', 'Spicy', '911 FIRE'] },
  nomild:   { title: 'How spicy?', required: true, multi: false,
              options: ['Medium', 'Spicy', '911 FIRE'] },
  nospicy:  { title: 'How spicy?', required: true, multi: false,
              options: ['Very Mild', 'Mild', 'Medium'] },
  addon:    { title: 'Add-on (optional, pick one)', required: false, multi: false,
              options: [['Add Veggies', 400], ['Add Tofu', 400], ['Add Amul Cheese', 400],
                         ['Extra Shot Of Garlic', 300], ['Add Paneer', 400], ['Add Extra Meat', 600]] },
  sauce:    { title: 'Pick a sauce', required: true, multi: false,
              options: ['Tikka Sauce', 'Malai Sauce', 'Mint & Tamarind Sauce'] },
  fountain: { title: 'Pick your fountain drink', required: true, multi: false,
              options: ['Coke', 'Sprite', 'Diet Coke', 'Fanta', 'Ginger Ale', 'Tonic Water', 'Club Soda'] },
  cansoda:  { title: 'Pick your soda', required: true, multi: false,
              options: ['Thums Up', 'Limca', 'Kashmira Jeera Soda', 'Coke', 'Diet Coke', 'Coke Zero',
                         'Pepsi', 'Sprite', 'Root Beer', 'Ginger Beer', 'Dr. Pepper', 'Fanta', 'Sosyo'] },
  papad:    { title: 'Roasted or fried?', required: true, multi: false, options: ['Roasted', 'Fried'] },
  gheerice: { title: 'With or without nuts?', required: true, multi: false,
              options: [['Without Nuts', 0], ['With Nuts', 100]] },
  bowlrice: { title: 'Pick your rice', required: true, multi: false,
              options: [['Basmati Rice', 300], ['Masala Rice', 400]] },
  // Family packs (verified against Clover 2026-09-29): $0 base item, the
  // price comes from the required choice below. All three are required
  // pick-one, exactly like the Clover modifier groups.
  fambiryani: { title: 'Pick your biryani', required: true, multi: false,
              options: [['Veg Biryani', 3500], ['Paneer Biryani', 3500],
                         ['Boneless Chicken Biryani', 4000], ['Lamb Biryani', 4200],
                         ['Goat Biryani', 4200], ['With Bone Chicken Biryani', 4000],
                         ['Chicken Lollipop Biryani', 4000]] },
  famnoodles: { title: 'Pick your noodles', required: true, multi: false,
              options: [['Chicken', 3500], ['Veg', 2800], ['Paneer', 3200], ['Shrimp', 3500]] },
  famfriedrice: { title: 'Pick your fried rice', required: true, multi: false,
              options: [['Veg', 2800], ['Paneer', 3200], ['Chicken', 3500], ['Shrimp', 3500]] },
  freeapp:   { title: 'Pick your free appetizer', required: true, multi: false,
              options: ['Chicken 65', 'Chicken 555', 'Gobi Manchurian', 'Gobi 65'] },
};

// Dish questions, verified against the Clover modifier setup on 2026-09-24.
// Key: website dish name -> question keys. Spice Level/No Mild/No Spicy and
// Sauce/Fountain/Can Soda/Papad/Ghee Rice/Bowl Of Rice are required pick-one;
// Add-on is optional pick-one. Kids menu: no questions (per Simit).
const DISH_MODS = {
  'Achari Chicken Curry': ['nomild','addon'],
  'Aloo Gobi Masala': ['spice','addon'],
  'Amritsari Chole Masala': ['spice','addon'],
  'Amritsari Paneer Bhurji': ['spice','addon'],
  'Baby Corn Darbar': ['spice'],
  'Baingan Curry': ['spice','addon'],
  'Balti Paneer': ['spice','addon'],
  'Bhindi Do Pyaza': ['spice','addon'],
  'Butter Chicken': ['spice','addon'],
  'Butter Chicken Pasta': ['spice'],
  'Can Soda': ['cansoda'],
  'Chef Sp. Chicken Pasta': ['spice'],
  'Chef Sp. Paneer Pasta': ['spice'],
  'Chef Special Chicken Curry': ['nomild','addon'],
  'Chef. Sp Veg Pasta': ['spice'],
  'Chicken 65': ['spice'],
  'Chicken Biryani with bone': ['spice'],
  'Chicken Chettinad': ['nomild'],
  'Chicken Chukka': ['nomild'],
  'Chicken Darbar': ['spice'],
  'Chicken Fried Rice': ['spice'],
  'Chicken Gongura': ['nomild','addon'],
  'Chicken Korma': ['spice','addon'],
  'Chicken Lollipop': ['spice'],
  'Chicken Malabar': ['spice','addon'],
  'Chicken Manchurian': ['spice'],
  'Chicken RoganJosh': ['spice','addon'],
  'Chicken Saagwala': ['spice','addon'],
  'Chicken Tikka': ['spice'],
  'Chicken Tikka Biryani': ['spice'],
  'Chicken Tikka Masala': ['spice','addon'],
  'Chicken Tikka Pasta': ['spice'],
  'Chicken Vindalloo': ['nomild','addon'],
  'Chilli Chicken': ['nomild'],
  'Chilli Paneer': ['nomild'],
  'Corn Patta Chaat': ['spice'],
  'Dal Makhni': ['spice','addon'],
  'Dal Palak': ['spice','addon'],
  'Dal Tadka': ['spice'],
  'Family Pack Biryani': ['spice','fambiryani','freeapp'],
  'Family Pack Fried Rice (58 Oz)': ['spice','famfriedrice'],
  'Family Pack Hakka Noodles (58 Oz)': ['spice','famnoodles'],
  'Fish Malabar': ['spice','addon'],
  'Fish Manchurian': ['spice'],
  'Fountain Drink': ['fountain'],
  'Ghee Rice': ['gheerice'],
  'Goat Biryani': ['spice'],
  'Goat Curry': ['spice','addon'],
  'Goat Ghee Roast': ['nomild'],
  'Goat Saagwala': ['spice','addon'],
  'Gobi 65': ['spice'],
  'Gobi Manchurian': ['spice'],
  'Hakka Noodles Chicken': ['spice'],
  'Hakka Noodles Paneer': ['spice'],
  'Hakka Noodles Shrimp': ['spice'],
  'Hakka Noodles VEG': ['spice'],
  'Harabhara Paneer Kebab': ['spice'],
  'Jeera Rice': ['gheerice'],
  'Kadai Chicken': ['spice','addon'],
  'Kadai Corn Mushroom': ['spice','addon'],
  'Kaju Kasuri Methi': ['spice','addon'],
  'Lamb Biryani': ['spice'],
  'Lamb Chettinad': ['nomild'],
  'Lamb Chops': ['spice'],
  'Lamb Chukka': ['nomild'],
  'Lamb Gongura': ['nomild','addon'],
  'Lamb Jalfrezi': ['spice','addon'],
  'Lamb Korma': ['spice','addon'],
  'Lamb RoganJosh': ['spice','addon'],
  'Lamb Saagwala': ['spice','addon'],
  'Lamb Tikka Masala': ['spice','addon'],
  'Lamb Vindalloo': ['nomild','addon'],
  'Makhmali Paneer Angara': ['spice'],
  'Malai Koftha': ['spice','addon'],
  'Mango Chicken Curry': ['nospicy','addon'],
  'Masala Papad (2)': ['spice','papad'],
  'Matar Paneer': ['spice','addon'],
  'Methi Malai Chicken': ['spice','addon'],
  'Mushroom Butter Masala': ['spice','addon'],
  'Mushroom Tikka Masala': ['spice','addon'],
  'Navratan Korma': ['spice','addon'],
  'Palak Paneer': ['spice','addon'],
  'Paneer Biryani': ['spice'],
  'Paneer Butter Masala': ['spice','addon'],
  'Paneer Darbar': ['spice'],
  'Paneer Fried Rice': ['spice'],
  'Paneer Manchurian': ['spice'],
  'Paneer Methi Malai': ['spice','addon'],
  'Paneer Tikka Masala': ['spice','addon'],
  'Paneer Tikka Pasta': ['spice'],
  'Papad': ['papad'],
  'Samosa Chaat': ['spice'],
  'Sham Savera': ['spice','addon'],
  'Shrimp 65': ['spice'],
  'Shrimp Fried Rice': ['spice'],
  'Shrimp Korma': ['spice','addon'],
  'Soy Chaap Masala': ['spice'],
  'Street Style Hakka Noodles Chicken': ['spice'],
  'Street Style Hakka Noodles PANEER': ['spice'],
  'Street Style Hakka Noodles Shrimp': ['spice'],
  'Street Style Hakka Noodles VEG': ['spice'],
  'Street Style Paneer Fried Rice': ['spice'],
  'Street Style Veg. Fried Rice': ['spice'],
  'Street style Chicken Fried Rice': ['spice'],
  'Street style Shrimp Fried Rice': ['spice'],
  'Tandoori Chicken': ['spice'],
  'Tandoori Chicken Full': ['spice'],
  'Tandoori Pompano': ['spice'],
  'Tofu Chole Curry': ['spice','addon'],
  'Tofu Tikka Masala': ['spice','addon'],
  'Veg. Biryani': ['spice'],
  'Veg. Chettinad': ['nomild','addon'],
  'Veg. Fried Rice': ['spice'],
  'Veg. Jalfrezi': ['spice','addon'],
  'Veg. Malabar': ['spice','addon'],
  'Veg. Tikka Pasta': ['spice'],
  'Vegan Aloo Gobi Masala': ['spice'],
  'Vegan Amritsari Chole Masala': ['spice','addon'],
  'Vegan Baingan Curry': ['spice'],
  'Vegan Bhindi Do Pyaza': ['spice'],
  'Vegan Dal Palak': ['spice'],
  'Vegan Dal Tadka': ['spice'],
  'Vegan Kadai Corn Mushroom': ['spice'],
  'Vegan Masala Papad': ['spice'],
  'Vegan Mushroom Tikka Masala': ['spice'],
  'Vegan Samosa Chaat': ['spice'],
  'Vegan Tofu Tikka Masala': ['spice'],
  'Vegan Veg Chettinad': ['spice'],
  'Vegan Veg Jalfrezi': ['spice'],
  'Vegan Veg. Malabar': ['spice'],
  'Vijaywada Boneless Chicken Biryani': ['spice'],
};
// dishes with questions: 129

function questionsFor(name) {
  var ids = DISH_MODS[name] || [];
  return ids.map(function (id) {
    if (!MOD_QUESTIONS[id]) return null;
    var q = { id: id, title: MOD_QUESTIONS[id].title, required: MOD_QUESTIONS[id].required,
              multi: MOD_QUESTIONS[id].multi, options: MOD_QUESTIONS[id].options };
    return q;
  }).filter(Boolean);
}

function modPrice(qid, optName) {
  var q = MOD_QUESTIONS[qid];
  if (!q) return null;
  for (var i = 0; i < q.options.length; i++) {
    var o = q.options[i];
    if (typeof o === 'string') { if (o === optName) return 0; }
    else if (o[0] === optName) return o[1];
  }
  return null;
}

function money(cents) { return '$' + (cents / 100).toFixed(2); }
function esc(s) { return String(s).replace(/[&<>"']/g, function (m) { return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]; }); }

/* ---------- cart state: { key: { name, qty, mods: [{g, o}] } } ---------- */
var cart = {};
try { cart = JSON.parse(localStorage.getItem('tandoor_cart') || '{}'); } catch (e) { cart = {}; }
// Migrate legacy carts shaped {name: qty}.
Object.keys(cart).forEach(function (k) {
  if (typeof cart[k] === 'number') {
    var q = cart[k];
    delete cart[k];
    if (MENU_PRICES[k] !== undefined && q >= 1) cart[cartKey(k, [])] = { name: k, qty: Math.min(20, q), mods: [] };
  } else if (cart[k] && typeof cart[k] === 'object') {
    if (MENU_PRICES[cart[k].name] === undefined) delete cart[k];
    if (!Array.isArray(cart[k].mods)) cart[k].mods = [];
  } else {
    delete cart[k];
  }
});
function cartKey(name, mods) {
  return JSON.stringify([name, mods.map(function (m) { return [m.g, m.o]; })]);
}
function lineUnit(entry) {
  var u = MENU_PRICES[entry.name] || 0;
  (entry.mods || []).forEach(function (m) { u += modPrice(m.g, m.o) || 0; });
  return u;
}
function addToCart(name, mods) {
  var key = cartKey(name, mods);
  if (cart[key]) cart[key].qty = Math.min(20, cart[key].qty + 1);
  else cart[key] = { name: name, qty: 1, mods: mods };
  save(); renderCartBtn();
}
function save() { try { localStorage.setItem('tandoor_cart', JSON.stringify(cart)); } catch (e) {} }
function cartCount() { return Object.keys(cart).reduce(function (a, k) { return a + cart[k].qty; }, 0); }
function cartSubtotal() { return Object.keys(cart).reduce(function (a, k) { return a + lineUnit(cart[k]) * cart[k].qty; }, 0); }

/* ---------- drawer UI ---------- */
var drawer, scrim, cartBtn, body, foot, headTitle;
function buildChrome() {
  cartBtn = document.createElement('button');
  cartBtn.id = 't-cart-btn';
  cartBtn.type = 'button';
  cartBtn.innerHTML = 'View Order <span class="t-count">0</span>';
  cartBtn.addEventListener('click', function () { openDrawer('cart'); });
  document.body.appendChild(cartBtn);

  scrim = document.createElement('div');
  scrim.id = 't-scrim';
  scrim.addEventListener('click', closeDrawer);
  document.body.appendChild(scrim);

  drawer = document.createElement('div');
  drawer.id = 't-drawer';
  drawer.setAttribute('role', 'dialog');
  drawer.setAttribute('aria-label', 'Your order');
  drawer.innerHTML =
    '<div class="t-d-head"><h2 id="t-d-title">Your Order</h2>' +
    '<button class="t-d-close" type="button" aria-label="Close">&times;</button></div>' +
    '<div class="t-d-body" id="t-d-body"></div>' +
    '<div class="t-d-foot" id="t-d-foot"></div>';
  drawer.querySelector('.t-d-close').addEventListener('click', closeDrawer);
  document.body.appendChild(drawer);
  body = drawer.querySelector('#t-d-body');
  foot = drawer.querySelector('#t-d-foot');
  headTitle = drawer.querySelector('#t-d-title');
  renderCartBtn();
}
function renderCartBtn() {
  var n = orderMode === 'catering' ? catCartCount() : cartCount();
  cartBtn.querySelector('.t-count').textContent = n;
  cartBtn.classList.toggle('hidden', n === 0 && !drawer.classList.contains('open'));
}
function openDrawer(view) {
  drawer.classList.add('open');
  scrim.classList.add('open');
  document.body.style.overflow = 'hidden';
  showView(view || 'cart');
  renderCartBtn();
}
function closeDrawer() {
  drawer.classList.remove('open');
  scrim.classList.remove('open');
  document.body.style.overflow = '';
  renderCartBtn();
}

var currentView = 'cart';
function showView(view) {
  currentView = view;
  if (view === 'cart') renderCartView();
  else if (view === 'checkout') renderCheckoutView();
}

/* ---------- pickup / catering mode toggle (cart is shared; switching never loses it) ---------- */
function modeToggleHtml() {
  // Regular menu (pickup) mode: no toggle — customers can't accidentally
  // switch to catering mid-order. Catering lives on catering.html.
  if (orderMode !== 'catering') return '';
  return '<div class="t-tips" style="margin-bottom:10px">' +
    '<button type="button" class="t-tip active" data-mode="catering">Catering</button></div>' +
    '<div style="font-size:.82rem;color:var(--muted);margin:-2px 0 10px">Catering menu: tray prices (Small serves 8\u201310, Medium 16\u201318, Large 23\u201325). Pickup free \u00B7 delivery $100 within 20 miles.</div>';
}
function setOrderMode(mode) {
  if (mode !== 'pickup' && mode !== 'catering') return;
  if (orderMode === mode) return;
  var keep = (currentView === 'checkout') ? captureCheckoutFields() : null;
  orderMode = mode;
  cateringFulfillment = 'pickup';
  if (typeof window.render === 'function') { try { window.render(); } catch (e) {} }
  if (currentView === 'checkout') { renderCheckoutView(); restoreCheckoutFields(keep); }
  else renderCartView();
}
function bindModeToggle() {
  Array.prototype.forEach.call(body.querySelectorAll('.t-tip[data-mode]'), function (b) {
    b.addEventListener('click', function () { setOrderMode(b.getAttribute('data-mode')); });
  });
}
function captureCheckoutFields() {
  var g = function (id) { var el = body.querySelector('#' + id); return el ? el.value : ''; };
  return {
    name: g('t-name'), phone: g('t-phone'), email: g('t-email'), note: g('t-note'),
    date: g('t-cat-date'), time: g('t-cat-time'), spice: g('t-spice'),
    street: g('t-addr-street'), city: g('t-addr-city'), state: g('t-addr-state'), zip: g('t-addr-zip'),
    fulfillment: cateringFulfillment
  };
}
function restoreCheckoutFields(f) {
  if (!f) return;
  var s = function (id, v) { var el = body.querySelector('#' + id); if (el && v) el.value = v; };
  s('t-name', f.name); s('t-phone', f.phone); s('t-email', f.email); s('t-note', f.note);
  // A saved catering date may have aged into the 48-hour window (or past 3 months)
  // since it was picked. Programmatic restore bypasses the input's min/max, so
  // clamp here — never restore a date that is no longer bookable.
  (function () {
    var el = body.querySelector('#t-cat-date');
    if (el && f.date) {
      var mn = el.getAttribute('min'), mx = el.getAttribute('max');
      if ((!mn || f.date >= mn) && (!mx || f.date <= mx)) el.value = f.date;
    }
  })();
  s('t-cat-time', f.time); s('t-spice', f.spice);
  s('t-addr-street', f.street); s('t-addr-city', f.city); s('t-addr-state', f.state); s('t-addr-zip', f.zip);
  if (orderMode === 'catering' && (f.fulfillment === 'delivery' || f.fulfillment === 'pickup')) {
    cateringFulfillment = f.fulfillment;
    var r = body.querySelector('input[name="t-cat-ful"][value="' + f.fulfillment + '"]');
    if (r) { r.checked = true; }
    catFulChanged();
  }
}
function catFulChanged() {
  var r = body.querySelector('input[name="t-cat-ful"]:checked');
  cateringFulfillment = r ? r.value : 'pickup';
  Array.prototype.forEach.call(body.querySelectorAll('input[name="t-cat-ful"]'), function (x) {
    var lab = x.closest('label');
    if (lab) lab.classList.toggle('sel', x.checked);
  });
  var addr = body.querySelector('#t-cat-addr');
  if (addr) addr.style.display = cateringFulfillment === 'delivery' ? '' : 'none';
  paintCateringTotals();
}
function paintCateringTotals() {
  if (orderMode !== 'catering') return;
  var m = cateringMath();
  // Totals live in the drawer FOOT (same as the pickup checkout).
  var set = function (id, v) { var el = foot.querySelector('#' + id); if (el) el.textContent = v; };
  set('t-cat-sub', money(m.sub));
  set('t-cat-fee', money(m.fee));
  set('t-cat-tax', money(m.tax));
  set('t-cat-total', money(m.total));
  var btn = foot.querySelector('#t-continue');
  if (btn && !btn.disabled) btn.textContent = 'Continue to payment \u2014 ' + money(m.total);
}
/* ---------- catering menu rendering ----------
   menu.html owns window.render; we wrap it so catering mode renders the
   CATERING MENU (tray menu) while pickup mode keeps the regular menu
   untouched. The page's own search box, result count and empty state are
   reused; the category chips are swapped (the originals are hidden, never
   destroyed, so their listeners survive the round-trip). */
var catActiveCat = 'All';
var catChipsEl = null;
function ensureCatChips() {
  if (catChipsEl) return catChipsEl;
  var chips = document.getElementById('categoryChips');
  catChipsEl = document.createElement('div');
  catChipsEl.className = 'category-chips';
  catChipsEl.id = 't-cat-chips';
  if (chips && chips.parentNode) chips.parentNode.insertBefore(catChipsEl, chips.nextSibling);
  return catChipsEl;
}
function makeCatChip(label) {
  var b = document.createElement('button');
  b.className = 'chip' + (label === catActiveCat ? ' active' : '');
  b.type = 'button';
  b.textContent = label;
  b.setAttribute('aria-pressed', label === catActiveCat);
  b.addEventListener('click', function () {
    catActiveCat = label;
    if (typeof window.render === 'function') { try { window.render(); } catch (e) {} }
  });
  return b;
}
/* One dish card: price-option selector + qty stepper + Add button. */
/* Interactive controls for one catering dish: price-option selector + qty
   stepper + Add button. Shared by menu.html catering mode (catDishCard)
   and catering.html (enhanceCateringPage); both write to the same
   catering cart (tandoor_cat_cart). */
function catDishControls(it) {
  var wrap = document.createElement('div');
  wrap.className = 't-cat-controls';
  var st = { kind: it.type, option: catDefaultOption(it), qty: catDefaultQty(it) };
  var optBox = document.createElement('div');
  optBox.className = 't-cat-opts';
  wrap.appendChild(optBox);

  function paintOpts() {
    optBox.innerHTML = '';
    if (it.type === 'tray') {
      ['small', 'medium', 'large'].forEach(function (s) {
        var b = document.createElement('button');
        b.type = 'button';
        b.className = 't-cat-opt' + (st.option === s ? ' sel' : '');
        var sz = document.createElement('span'); sz.className = 't-cat-size'; sz.textContent = TRAY_LABEL[s];
        var pr = document.createElement('span'); pr.className = 't-cat-price'; pr.textContent = money(it[s]);
        var sv = document.createElement('span'); sv.className = 't-cat-serves'; sv.textContent = TRAY_SERVES[s];
        b.appendChild(sz); b.appendChild(pr); b.appendChild(sv);
        b.setAttribute('aria-label', TRAY_LABEL[s] + ' tray ' + money(it[s]) + ', ' + TRAY_SERVES[s]);
        b.addEventListener('click', (function (size) { return function () { st.option = size; paintOpts(); }; })(s));
        optBox.appendChild(b);
      });
    } else if (it.type === 'pack') {
      it.options.forEach(function (o) {
        var key = String(o.qty);
        var b = document.createElement('button');
        b.type = 'button';
        b.className = 't-cat-opt' + (st.option === key ? ' sel' : '');
        var sz = document.createElement('span'); sz.className = 't-cat-size'; sz.textContent = o.qty + ' pc';
        var pr = document.createElement('span'); pr.className = 't-cat-price'; pr.textContent = money(o.qty * o.unit);
        var sv = document.createElement('span'); sv.className = 't-cat-serves'; sv.textContent = money(o.unit) + ' each';
        b.appendChild(sz); b.appendChild(pr); b.appendChild(sv);
        b.setAttribute('aria-label', o.qty + ' pieces for ' + money(o.qty * o.unit));
        b.addEventListener('click', (function (k) { return function () { st.option = k; paintOpts(); }; })(key));
        optBox.appendChild(b);
      });
    } else {
      var info = document.createElement('div');
      info.className = 't-cat-eachinfo';
      info.textContent = it.type === 'each'
        ? money(it.unit) + ' each \u00B7 min ' + it.min + ' pieces'
        : money(it.price) + ' each';
      optBox.appendChild(info);
    }
  }
  paintOpts();

  var row = document.createElement('div');
  row.className = 't-cat-addrow';
  var qtyBox = document.createElement('div');
  qtyBox.className = 't-qty';
  var caps = { tray: 20, pack: 10, each: 1000, fixed: 20 };
  var minQ = it.type === 'each' ? it.min : 1;
  var qMinus = document.createElement('button');
  qMinus.type = 'button'; qMinus.textContent = '\u2212'; qMinus.setAttribute('aria-label', 'Less');
  var qSpan = document.createElement('span'); qSpan.textContent = String(st.qty);
  var qPlus = document.createElement('button');
  qPlus.type = 'button'; qPlus.textContent = '+'; qPlus.setAttribute('aria-label', 'More');
  var qLabel = document.createElement('span');
  qLabel.className = 't-cat-qlabel';
  qLabel.textContent = it.type === 'tray' ? 'trays' : it.type === 'pack' ? 'packs' : it.type === 'each' ? 'pcs' : 'qty';
  qMinus.addEventListener('click', function () {
    st.qty = Math.max(minQ, st.qty - 1);
    qSpan.textContent = String(st.qty);
  });
  qPlus.addEventListener('click', function () {
    st.qty = Math.min(caps[it.type], st.qty + 1);
    qSpan.textContent = String(st.qty);
  });
  qtyBox.appendChild(qMinus); qtyBox.appendChild(qSpan); qtyBox.appendChild(qPlus); qtyBox.appendChild(qLabel);
  row.appendChild(qtyBox);

  var addBtn = document.createElement('button');
  addBtn.type = 'button';
  addBtn.className = 'add-btn';
  addBtn.textContent = 'Add';
  addBtn.setAttribute('aria-label', 'Add ' + it.name + ' to catering order');
  addBtn.addEventListener('click', function () {
    addToCatCart(it.name, st.kind, st.option, st.qty);
    addBtn.textContent = 'Added \u2713';
    setTimeout(function () { addBtn.textContent = 'Add'; }, 1200);
  });
  row.appendChild(addBtn);
  wrap.appendChild(row);
  return wrap;
}
/* One dish card: name + shared controls (menu.html catering mode). */
function catDishCard(it) {
  var d = document.createElement('article');
  d.className = 'dish';
  var n = document.createElement('div');
  n.className = 'dish-name';
  n.textContent = it.name;
  d.appendChild(n);
  d.appendChild(catDishControls(it));
  return d;
}
/* catering.html ("the tray menu") enhancement: its static sections already
   carry the raised prices; every orderable dish gets the same selectors +
   Add button as menu.html catering mode, wired to the shared catering cart.
   Dishes with no menu match (e.g. "call for price") stay static. */
/* catering.html: turn each static category section into a collapsible dropdown.
   Tapping a category header (e.g. "Desserts") expands it to show that category's
   dishes with their Add buttons. Exclusive accordion: opening one closes the rest. */
function foldCateringSections() {
  var host = document.getElementById('cateringMenuSections');
  if (!host) return;
  var secs = host.querySelectorAll('section.menu-category');
  for (var i = 0; i < secs.length; i++) {
    (function (sec) {
      if (sec.tagName === 'DETAILS') return;
      var h = sec.querySelector('h3');
      var grid = sec.querySelector('.dish-grid');
      if (!h || !grid) return;
      var det = document.createElement('details');
      det.className = sec.className + ' cat-fold';
      det.setAttribute('name', 'catmenu');
      var sum = document.createElement('summary');
      sum.className = 'cat-fold-head';
      var title = document.createElement('span');
      title.className = 'cat-fold-title';
      title.textContent = h.textContent.trim();
      var count = document.createElement('span');
      count.className = 'cat-fold-count';
      var n = grid.querySelectorAll('article.dish').length;
      count.textContent = n + (n === 1 ? ' item' : ' items');
      var chev = document.createElement('span');
      chev.className = 'cat-fold-chev';
      chev.setAttribute('aria-hidden', 'true');
      sum.appendChild(title);
      sum.appendChild(count);
      sum.appendChild(chev);
      det.appendChild(sum);
      det.appendChild(grid);
      sec.parentNode.replaceChild(det, sec);
    })(secs[i]);
  }
}
function enhanceCateringPage() {
  var host = document.getElementById('cateringMenuSections');
  if (!host) return;
  foldCateringSections();
  var cards = host.querySelectorAll('article.dish[data-cat-name]');
  for (var i = 0; i < cards.length; i++) {
    var card = cards[i];
    if (card.querySelector('.t-cat-controls')) continue;
    var it = catMenuItem(card.getAttribute('data-cat-name'));
    if (!it) continue;
    card.appendChild(catDishControls(it));
  }
}
function renderCateringMenu() {
  var list = document.getElementById('menuList');
  if (!list) return;
  var searchEl = document.getElementById('dishSearch');
  var chips = document.getElementById('categoryChips');
  var count = document.getElementById('resultCount');
  var activeLabel = document.getElementById('activeLabel');
  var empty = document.getElementById('emptyState');
  var clear = document.getElementById('clearSearch');
  if (chips) chips.style.display = 'none';
  var cc = ensureCatChips();
  if (cc) {
    cc.style.display = '';
    cc.innerHTML = '';
    ['All'].concat(CATERING_CATS).forEach(function (c) { cc.appendChild(makeCatChip(c)); });
  }
  if (searchEl) searchEl.placeholder = 'Find samosa trays, biryani, naan\u2026';
  var q = searchEl ? searchEl.value.trim().toLowerCase() : '';
  var shown = 0;
  list.innerHTML = '';
  CATERING_CATS.forEach(function (cat) {
    if (catActiveCat !== 'All' && cat !== catActiveCat) return;
    var items = [];
    CATERING_MENU.forEach(function (i) {
      if (i.cat === cat && (!q || i.name.toLowerCase().indexOf(q) >= 0)) items.push(i);
    });
    if (!items.length) return;
    shown += items.length;
    var section = document.createElement('section');
    section.className = 'menu-category';
    var h = document.createElement('h3');
    h.textContent = cat;
    section.appendChild(h);
    var grid = document.createElement('div');
    grid.className = 'dish-grid';
    items.forEach(function (i) { grid.appendChild(catDishCard(i)); });
    section.appendChild(grid);
    list.appendChild(section);
  });
  if (count) count.textContent = shown + ' ' + (shown === 1 ? 'item' : 'items');
  if (activeLabel) activeLabel.textContent = catActiveCat === 'All' ? 'All categories' : catActiveCat;
  if (empty) empty.style.display = shown ? 'none' : 'block';
  if (clear && searchEl) clear.style.display = q ? 'block' : 'none';
}
/* ---------- catering cart view (drawer) ---------- */
function renderCatCartView() {
  headTitle.textContent = 'Your Order';
  var keys = Object.keys(catCart);
  if (!keys.length) {
    body.innerHTML = modeToggleHtml() + '<div class="t-empty"><h3>Your catering cart is empty</h3><p>Browse the catering menu and tap <strong>Add</strong> on any tray.</p></div>';
    foot.innerHTML = '';
    bindModeToggle();
    return;
  }
  var html = modeToggleHtml();
  keys.forEach(function (k) {
    var e = catCart[k], unit = catUnitPrice(e) || 0;
    var per = e.kind === 'tray' ? TRAY_LABEL[e.option] + ' \u00B7 ' + money(unit) + ' each'
      : e.kind === 'pack' ? e.option + ' pc pack \u00B7 ' + money(unit) + ' each'
      : money(unit) + ' each';
    html += '<div class="t-line" data-key="' + esc(k) + '">' +
      '<div style="flex:1"><div class="t-lname">' + esc(catDisplayName(e)) + '</div>' +
      '<div class="t-lprice">' + esc(per) + '</div></div>' +
      '<div class="t-qty"><button type="button" data-act="dec" aria-label="Less">&minus;</button>' +
      '<span>' + e.qty + '</span>' +
      '<button type="button" data-act="inc" aria-label="More">+</button></div>' +
      '<div class="t-lsum">' + money(unit * e.qty) + '</div></div>';
  });
  body.innerHTML = html;
  body.querySelectorAll('.t-line').forEach(function (row) {
    var k = row.getAttribute('data-key');
    var e = catCart[k];
    if (!e) return;
    var caps = { tray: 20, pack: 10, each: 1000, fixed: 20 };
    var minQ = e.kind === 'each' ? ((catMenuItem(e.name) || {}).min || 1) : 1;
    row.querySelector('[data-act="inc"]').addEventListener('click', function () {
      e.qty = Math.min(caps[e.kind] || 20, e.qty + 1); saveCatCart(); renderCatCartView(); renderCartBtn();
    });
    row.querySelector('[data-act="dec"]').addEventListener('click', function () {
      e.qty--;
      if (e.qty < minQ) delete catCart[k];
      saveCatCart(); renderCatCartView(); renderCartBtn();
    });
  });
  bindModeToggle();
  var sub = catCartSubtotal(), tax = Math.round(sub * TAX_RATE);
  foot.innerHTML =
    '<div class="t-totals">' +
    '<div class="t-row"><span>Subtotal</span><span>' + money(sub) + '</span></div>' +
    '<div class="t-row"><span>Tax (9%)</span><span>' + money(tax) + '</span></div>' +
    '<div class="t-row grand"><span>Total</span><span>' + money(sub + tax) + '</span></div></div>' +
    '<button class="t-btn" type="button" id="t-to-checkout">Checkout</button>' +
    '<div class="t-secure">Catering is paid now. Pickup is free; delivery is $100 within 20 miles (chosen at checkout).</div>';
  foot.querySelector('#t-to-checkout').addEventListener('click', function () { showView('checkout'); });
}
function hookMenuRender() {
  if (typeof window.render !== 'function' || window.render.__tcHooked) return;
  var orig = window.render;
  var wrapped = function () {
    if (orderMode === 'catering') { renderCateringMenu(); }
    else {
      var chips = document.getElementById('categoryChips');
      if (chips) chips.style.display = '';
      if (catChipsEl) catChipsEl.style.display = 'none';
      var searchEl = document.getElementById('dishSearch');
      if (searchEl) searchEl.placeholder = 'Find butter chicken, naan, vegan\u2026';
      orig();
    }
  };
  wrapped.__tcHooked = true;
  window.render = wrapped;
  // menu.html binds its search box and clear button to its own render
  // (captured before the wrap). In catering mode those must re-render the
  // catering menu instead, so intercept at capture phase.
  document.addEventListener('input', function (e) {
    if (orderMode === 'catering' && e.target && e.target.id === 'dishSearch') {
      e.stopImmediatePropagation();
      renderCateringMenu();
    }
  }, true);
  document.addEventListener('click', function (e) {
    var t = e.target;
    if (orderMode === 'catering' && t && t.id === 'clearSearch') {
      e.stopImmediatePropagation();
      var searchEl = document.getElementById('dishSearch');
      if (searchEl) searchEl.value = '';
      renderCateringMenu();
    }
  }, true);
}

/* ---------- cart view ---------- */
function renderCartView() {
  if (orderMode === 'catering') { renderCatCartView(); return; }
  headTitle.textContent = 'Your Order';
  var keys = Object.keys(cart);
  if (!keys.length) {
    body.innerHTML = modeToggleHtml() + '<div class="t-empty"><h3>Your cart is empty</h3><p><a href="menu.html" style="color:inherit;text-decoration:underline">Browse the menu</a> to add something tasty.</p></div>';
    foot.innerHTML = '';
    bindModeToggle();
    return;
  }
  var html = modeToggleHtml();
  keys.forEach(function (k) {
    var e = cart[k], unit = lineUnit(e);
    var modHtml = (e.mods && e.mods.length)
      ? '<div class="t-lmods">' + esc(e.mods.map(function (m) { return m.o; }).join(' \u2022 ')) + '</div>' : '';
    html += '<div class="t-line" data-key="' + esc(k) + '">' +
      '<div style="flex:1"><div class="t-lname">' + esc(e.name) + '</div>' + modHtml +
      '<div class="t-lprice">' + money(unit) + ' each</div></div>' +
      '<div class="t-qty"><button type="button" data-act="dec" aria-label="Less">&minus;</button>' +
      '<span>' + e.qty + '</span>' +
      '<button type="button" data-act="inc" aria-label="More">+</button></div>' +
      '<div class="t-lsum">' + money(unit * e.qty) + '</div></div>';
  });
  body.innerHTML = html;
  body.querySelectorAll('.t-line').forEach(function (row) {
    var k = row.getAttribute('data-key');
    row.querySelector('[data-act="inc"]').addEventListener('click', function () {
      cart[k].qty = Math.min(20, cart[k].qty + 1); save(); renderCartView(); renderCartBtn();
    });
    row.querySelector('[data-act="dec"]').addEventListener('click', function () {
      cart[k].qty--; if (cart[k].qty <= 0) delete cart[k]; save(); renderCartView(); renderCartBtn();
    });
  });
  bindModeToggle();
  var sub = cartSubtotal(), tax = Math.round(sub * TAX_RATE);
  foot.innerHTML =
    '<div class="t-totals">' +
    '<div class="t-row"><span>Subtotal</span><span>' + money(sub) + '</span></div>' +
    '<div class="t-row"><span>Tax (9%)</span><span>' + money(tax) + '</span></div>' +
    '<div class="t-row grand"><span>Total</span><span>' + money(sub + tax) + '</span></div></div>' +
    '<button class="t-btn" type="button" id="t-to-checkout">Checkout</button>' +
    '<div class="t-secure">Secure checkout \u2014 pay by card right here.</div>';
  foot.querySelector('#t-to-checkout').addEventListener('click', function () { showView('checkout'); });
}

/* ---------- checkout view ---------- */
var clover = null, cloverEls = null, cloverReady = false;
function ensureClover() {
  if (cloverReady || typeof Clover === 'undefined') return;
  try {
    clover = new Clover(CLOVER_PK);
    var elements = clover.elements();
    var style = { input: { 'font-size': '16px', 'font-family': 'inherit', color: '#201a16' } };
    cloverEls = {
      number: elements.create('CARD_NUMBER', style),
      date: elements.create('CARD_DATE', style),
      cvv: elements.create('CARD_CVV', style),
      postal: elements.create('CARD_POSTAL_CODE', style)
    };
    cloverReady = true;
  } catch (e) { cloverReady = false; }
}
function mountClover() {
  ensureClover();
  if (!cloverReady) return false;
  try {
    cloverEls.number.mount('#t-cc-number');
    cloverEls.date.mount('#t-cc-date');
    cloverEls.cvv.mount('#t-cc-cvv');
    cloverEls.postal.mount('#t-cc-postal');
    return true;
  } catch (e) { return true; } // already mounted
}

/* ---------- tip + loyalty state ---------- */
var tipCents = 0;
var rewBalance = 0;       // verified server-side rewards balance, cents
var rewApplied = 0;       // rewards the customer chose to apply, cents
var rewPhoneChecked = ''; // phone number the balance was checked for
function checkoutMath() {
  var sub = cartSubtotal();
  var eff = Math.max(0, sub - rewApplied); // rewards cut the food subtotal first
  var tax = Math.round(eff * TAX_RATE);
  return { sub: sub, reward: rewApplied, effSub: eff, tax: tax, tip: tipCents, total: eff + tax + tipCents };
}
function paintTotals() {
  // If the cart shrank after rewards were applied, clamp to what still applies.
  var maxR = Math.min(rewBalance, Math.floor(cartSubtotal() / 500) * 500);
  if (rewApplied > maxR) rewApplied = maxR;
  var m = checkoutMath();
  var tipLine = foot.querySelector('#t-tip-line');
  var totalLine = foot.querySelector('#t-total-line');
  var payBtn = foot.querySelector('#t-continue');
  var rewRow = foot.querySelector('#t-rew-row');
  var rewLine = foot.querySelector('#t-rew-line');
  var appliedEl = body.querySelector('#t-rew-applied');
  if (tipLine) tipLine.textContent = money(m.tip);
  if (totalLine) totalLine.textContent = money(m.total);
  if (payBtn && !payBtn.disabled) payBtn.textContent = 'Continue to payment \u2014 ' + money(m.total);
  if (rewRow) rewRow.style.display = m.reward > 0 ? '' : 'none';
  if (rewLine) rewLine.textContent = '-' + money(m.reward);
  if (appliedEl) appliedEl.textContent = money(m.reward);
}
function setTip(cents) {
  tipCents = Math.max(0, Math.round(cents) || 0);
  paintTotals();
}

/* ---------- checkout: step 1 (details + tip) ---------- */
function renderCheckoutView() {
  tipCents = 0;
  rewBalance = 0; rewApplied = 0; rewPhoneChecked = '';
  cateringFulfillment = 'pickup';
  headTitle.textContent = 'Checkout';
  if (orderMode === 'catering') { renderCateringCheckout(); return; }
  var m = checkoutMath();
  body.innerHTML =
    '<div id="t-err"></div>' +
    modeToggleHtml() +
    '<div class="t-field"><label for="t-name">Name <span class="t-star" aria-hidden="true">*</span></label><input id="t-name" autocomplete="name" placeholder="Your name"></div>' +
    '<div class="t-field"><label for="t-phone">Phone <span class="t-star" aria-hidden="true">*</span></label><input id="t-phone" inputmode="tel" autocomplete="tel" placeholder="(803) 555-0100"></div>' +
    '<div class="t-field"><label>Rewards</label>' +
    '<div class="t-rew-row"><button type="button" class="t-btn secondary t-small" id="t-rew-check">Check my rewards</button><span id="t-rew-msg" class="t-rew-msg"></span></div>' +
    '<div id="t-rew-apply" style="display:none">' +
    '<div class="t-rew-have" id="t-rew-have"></div>' +
    '<div class="t-stepper"><button type="button" id="t-rew-minus" aria-label="Use fewer rewards">\u2212</button><span id="t-rew-applied">$0.00</span><button type="button" id="t-rew-plus" aria-label="Use more rewards">+</button></div>' +
    '<div class="t-rew-hint">Earn $5 for every $50 you spend on food. Rewards apply in $5 increments, up to your food subtotal.</div>' +
    '</div></div>' +
    '<div class="t-field"><label for="t-email">Email <span style="font-weight:400;color:var(--muted)">(receipt)</span> <span class="t-star" aria-hidden="true">*</span></label><input id="t-email" inputmode="email" autocomplete="email" placeholder="you@example.com"></div>' +
    '<div class="t-fulfill"><label class="sel" style="cursor:default"><input type="radio" checked disabled>Pickup</label>' +
    '<span style="font-size:.85rem;color:var(--muted)">Pickup only &mdash; for delivery, find us on DoorDash, Uber Eats, or Grubhub.</span></div>' +
    '<div class="t-field"><label>When do you want to pick up?</label>' +
    '<div class="t-fulfill">' +
    '<label class="sel"><input type="radio" name="t-pickup-type" value="asap" checked>ASAP &mdash; ready in about 30 mins</label>' +
    '<label><input type="radio" name="t-pickup-type" value="scheduled">Schedule for later</label>' +
    '</div></div>' +
    '<div id="t-pickup-sched" style="display:none">' +
    '<div class="t-field"><label for="t-pickup-date">Pickup date <span class="t-star" aria-hidden="true">*</span></label>' +
    '<input type="date" id="t-pickup-date">' +
    '<div style="font-size:.82rem;color:var(--muted);margin-top:4px">We\u2019re closed on Mondays.</div></div>' +
    '<div class="t-field"><label for="t-pickup-time">Pickup time <span class="t-star" aria-hidden="true">*</span></label>' +
    '<select id="t-pickup-time"><option value="">Choose a date first</option></select>' +
    '<div style="font-size:.82rem;color:var(--muted);margin-top:4px">11:15 AM \u2013 2:45 PM & 5:10 \u2013 9:00 PM. Closed 2:45 \u2013 5:10 PM daily.</div></div>' +
    '</div>' +
    '<div class="t-field"><label for="t-note">Note for the kitchen <span style="font-weight:400;color:var(--muted)">(optional)</span></label><textarea id="t-note" placeholder="e.g. extra spicy, no onions"></textarea></div>' +
    '<div class="t-field"><label>Add a tip <span style="font-weight:400;color:var(--muted)">(optional)</span></label>' +
    '<div class="t-tips">' +
    '<button type="button" class="t-tip" data-pct="10">10%</button>' +
    '<button type="button" class="t-tip" data-pct="15">15%</button>' +
    '<button type="button" class="t-tip" data-pct="20">20%</button>' +
    '<button type="button" class="t-tip" data-pct="custom">Custom</button>' +
    '</div>' +
    '<input id="t-tip-custom" inputmode="decimal" placeholder="Custom tip amount ($)" style="display:none;margin-top:8px"></div>' +
    '<div style="font-size:.8rem;color:var(--muted);margin-top:2px"><span class="t-star" aria-hidden="true">*</span> Required</div>';
  foot.innerHTML =
    '<div class="t-totals">' +
    '<div class="t-row"><span>Subtotal</span><span>' + money(m.sub) + '</span></div>' +
    '<div class="t-row" id="t-rew-row" style="display:none"><span>Rewards</span><span id="t-rew-line">-$0.00</span></div>' +
    '<div class="t-row"><span>Tax (9%)</span><span>' + money(m.tax) + '</span></div>' +
    '<div class="t-row"><span>Tip</span><span id="t-tip-line">' + money(m.tip) + '</span></div>' +
    '<div class="t-row grand"><span>Total</span><span id="t-total-line">' + money(m.total) + '</span></div></div>' +
    '<button class="t-btn" type="button" id="t-continue">Continue to payment \u2014 ' + money(m.total) + '</button>' +
    '<button class="t-btn secondary" type="button" id="t-back">Back to order</button>' +
    '<div class="t-secure">You pay exactly this total. Card details are entered on the next step into Stripe\u2019s secure fields and never touch this website.</div>';

  foot.querySelector('#t-back').addEventListener('click', function () { showView('cart'); });

  bindPickupScheduler();

  var tipBtns = body.querySelectorAll('.t-tip');
  var customInput = body.querySelector('#t-tip-custom');
  function markActive(btn) {
    Array.prototype.forEach.call(tipBtns, function (b) { b.classList.remove('active'); });
    if (btn) btn.classList.add('active');
  }
  Array.prototype.forEach.call(tipBtns, function (b) {
    b.addEventListener('click', function () {
      var pct = b.getAttribute('data-pct');
      if (pct === 'custom') {
        markActive(b);
        customInput.style.display = '';
        customInput.focus();
        setTip(0);
        return;
      }
      customInput.style.display = 'none';
      customInput.value = '';
      if (b.classList.contains('active')) { markActive(null); setTip(0); return; } // toggle off
      markActive(b);
      var base = checkoutMath();
      setTip(Math.round((base.sub + base.tax) * parseInt(pct, 10) / 100));
    });
  });
  customInput.addEventListener('input', function () {
    var v = parseFloat(customInput.value.replace(/[^0-9.]/g, ''));
    setTip(isNaN(v) ? 0 : Math.round(v * 100));
  });

  /* ---------- loyalty: check balance + stepper ---------- */
  function rewMaxApplicable() {
    return Math.min(rewBalance, Math.floor(checkoutMath().sub / 500) * 500);
  }
  body.querySelector('#t-rew-check').addEventListener('click', function () {
    var phone = body.querySelector('#t-phone').value;
    var msg = body.querySelector('#t-rew-msg');
    var applyBox = body.querySelector('#t-rew-apply');
    var have = body.querySelector('#t-rew-have');
    msg.textContent = 'Checking...';
    applyBox.style.display = 'none';
    fetch('/.netlify/functions/loyalty-balance?phone=' + encodeURIComponent(phone))
      .then(function (r) { return r.json().then(function (j) { return { ok: r.ok, j: j }; }); })
      .then(function (res) {
        if (!res.ok) throw new Error(res.j.error || 'Could not check rewards.');
        rewBalance = res.j.balance_cents || 0;
        rewPhoneChecked = phone;
        rewApplied = 0;
        msg.textContent = '';
        if (rewBalance > 0) {
          have.textContent = 'You have ' + money(rewBalance) + ' in rewards.' +
            (res.j.next_reward_in_cents > 0
              ? ' Spend ' + money(res.j.next_reward_in_cents) + ' more on food to earn your next $5.'
              : '');
          applyBox.style.display = '';
        } else {
          have.textContent = '';
          msg.textContent = 'No rewards yet — ' + money(res.j.next_reward_in_cents) +
            ' more in food spending earns $5.';
        }
        paintTotals();
      })
      .catch(function (err) {
        msg.textContent = err.message || 'Could not check rewards.';
      });
  });
  body.querySelector('#t-rew-minus').addEventListener('click', function () {
    rewApplied = Math.max(0, rewApplied - 500);
    paintTotals();
  });
  body.querySelector('#t-rew-plus').addEventListener('click', function () {
    rewApplied = Math.min(rewMaxApplicable(), rewApplied + 500);
    paintTotals();
  });
  bindModeToggle();

  foot.querySelector('#t-continue').addEventListener('click', startStripePayment);
}

/* ---------- checkout: catering (no tip, no rewards; 48h-3mo scheduling) ---------- */
function renderCateringCheckout() {
  var now = new Date();
  var minD = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 2);
  var maxD = new Date(now.getFullYear(), now.getMonth() + 3, now.getDate());
  var slotOpts = '<option value="">Choose a time\u2026</option>' + CATERING_SLOTS.map(function (s) {
    return '<option value="' + s + '">' + fmtTime12(s) + '</option>';
  }).join('');
  body.innerHTML =
    '<div id="t-err"></div>' +
    modeToggleHtml() +
    '<div class="t-field"><label for="t-name">Name <span class="t-star" aria-hidden="true">*</span></label><input id="t-name" autocomplete="name" placeholder="Your name"></div>' +
    '<div class="t-field"><label for="t-phone">Phone <span class="t-star" aria-hidden="true">*</span></label><input id="t-phone" inputmode="tel" autocomplete="tel" placeholder="(803) 555-0100"></div>' +
    '<div class="t-field"><label for="t-email">Email <span style="font-weight:400;color:var(--muted)">(receipt)</span> <span class="t-star" aria-hidden="true">*</span></label><input id="t-email" inputmode="email" autocomplete="email" placeholder="you@example.com"></div>' +
    '<div class="t-cat-explain">Tray prices are our catering menu prices \u2014 Small serves 8\u201310, Medium 16\u201318, Large 23\u201325. You pay now; your ticket prints in the kitchen right away and again the day before.</div>' +
    '<div class="t-field"><label for="t-cat-date">Date <span class="t-star" aria-hidden="true">*</span></label>' +
    '<input type="date" id="t-cat-date" min="' + fmtDateInput(minD) + '" max="' + fmtDateInput(maxD) + '">' +
    '<div style="font-size:.82rem;color:var(--muted);margin-top:4px">48 hours notice required. We\u2019re closed on Mondays.</div></div>' +
    '<div class="t-field"><label for="t-cat-time">Time <span class="t-star" aria-hidden="true">*</span></label>' +
    '<select id="t-cat-time">' + slotOpts + '</select></div>' +
    '<div class="t-field"><label>Pickup or delivery <span class="t-star" aria-hidden="true">*</span></label>' +
    '<div class="t-fulfill">' +
    '<label class="sel"><input type="radio" name="t-cat-ful" value="pickup" checked>Pickup \u2014 free</label>' +
    '<label><input type="radio" name="t-cat-ful" value="delivery">Delivery \u2014 $100 <span style="font-weight:400;font-size:.85rem">(within 20 miles)</span></label>' +
    '</div></div>' +
    '<div id="t-cat-addr" style="display:none">' +
    '<div class="t-field"><label for="t-addr-street">Street address <span class="t-star" aria-hidden="true">*</span></label><input id="t-addr-street" autocomplete="street-address" placeholder="123 Main St"></div>' +
    '<div class="t-field"><label for="t-addr-city">City <span class="t-star" aria-hidden="true">*</span></label><input id="t-addr-city" autocomplete="address-level2" placeholder="Rock Hill"></div>' +
    '<div class="t-field"><label for="t-addr-state">State <span class="t-star" aria-hidden="true">*</span></label><input id="t-addr-state" autocomplete="address-level1" value="SC"></div>' +
    '<div class="t-field"><label for="t-addr-zip">ZIP <span class="t-star" aria-hidden="true">*</span></label><input id="t-addr-zip" inputmode="numeric" autocomplete="postal-code" placeholder="29730"></div>' +
    '</div>' +
    '<div class="t-field"><label for="t-spice">Spice preference</label><input id="t-spice" value="Not spicy"></div>' +
    '<div class="t-field"><label for="t-note">Note for the kitchen <span style="font-weight:400;color:var(--muted)">(optional)</span></label><textarea id="t-note" placeholder="e.g. serving for 20, extra napkins"></textarea></div>' +
    '<div style="font-size:.8rem;color:var(--muted);margin-top:2px"><span class="t-star" aria-hidden="true">*</span> Required</div>';
  var m = cateringMath();
  foot.innerHTML =
    '<div class="t-totals">' +
    '<div class="t-row"><span>Subtotal</span><span id="t-cat-sub">' + money(m.sub) + '</span></div>' +
    '<div class="t-row"><span>Delivery fee</span><span id="t-cat-fee">' + money(m.fee) + '</span></div>' +
    '<div class="t-row"><span>Tax (9%)</span><span id="t-cat-tax">' + money(m.tax) + '</span></div>' +
    '<div class="t-row grand"><span>Total</span><span id="t-cat-total">' + money(m.total) + '</span></div></div>' +
    '<button class="t-btn" type="button" id="t-continue">Continue to payment \u2014 ' + money(m.total) + '</button>' +
    '<button class="t-btn secondary" type="button" id="t-back">Back to order</button>' +
    '<div class="t-secure">You pay exactly this total. Card details are entered on the next step into Stripe\u2019s secure fields and never touch this website. No rewards are earned on catering orders.</div>';

  bindModeToggle();
  foot.querySelector('#t-back').addEventListener('click', function () { showView('cart'); });
  Array.prototype.forEach.call(body.querySelectorAll('input[name="t-cat-ful"]'), function (r) {
    r.addEventListener('change', catFulChanged);
  });
  body.querySelector('#t-cat-date').addEventListener('change', function () {
    var dateEl = body.querySelector('#t-cat-date');
    var v = dateEl.value;
    if (!v) return;
    var errBox = body.querySelector('#t-err');
    var mn = dateEl.getAttribute('min'), mx = dateEl.getAttribute('max');
    if ((mn && v < mn) || (mx && v > mx)) {
      dateEl.value = '';
      showErr('Catering needs at least 48 hours notice and can be booked up to 3 months out \u2014 please pick a date in that window.');
      return;
    }
    if (new Date(v + 'T00:00:00').getDay() === 1) {
      showErr('We\u2019re closed on Mondays \u2014 please pick another day.');
    } else if (errBox) {
      errBox.innerHTML = '';
    }
  });
  foot.querySelector('#t-continue').addEventListener('click', startStripePayment);
}

function validCateringFields() {
  var dateEl = body.querySelector('#t-cat-date');
  var dateStr = dateEl ? dateEl.value : '';
  if (!dateStr) { showErr('Please choose a date for your catering order.'); return null; }
  if (new Date(dateStr + 'T00:00:00').getDay() === 1) {
    showErr('We\u2019re closed on Mondays \u2014 please pick another day.');
    return null;
  }
  var timeEl = body.querySelector('#t-cat-time');
  var timeStr = timeEl ? timeEl.value : '';
  if (!timeStr || CATERING_SLOTS.indexOf(timeStr) < 0) {
    showErr('Please choose a pickup/delivery time.');
    return null;
  }
  var dt = new Date(dateStr + 'T' + timeStr + ':00');
  if (isNaN(dt.getTime()) || dt.getTime() < Date.now() + 48 * 3600 * 1000) {
    showErr('Catering needs at least 48 hours notice \u2014 please pick a later date or time.');
    return null;
  }
  var now = new Date();
  var maxD = new Date(now.getFullYear(), now.getMonth() + 3, now.getDate());
  if (dateStr > fmtDateInput(maxD)) {
    showErr('Catering can be booked up to 3 months out.');
    return null;
  }
  var r = body.querySelector('input[name="t-cat-ful"]:checked');
  var ful = r ? r.value : 'pickup';
  var address = '';
  if (ful === 'delivery') {
    var st = body.querySelector('#t-addr-street').value.trim();
    var ci = body.querySelector('#t-addr-city').value.trim();
    var sa = body.querySelector('#t-addr-state').value.trim();
    var zp = body.querySelector('#t-addr-zip').value.trim();
    if (!st || !ci || !sa || !zp) { showErr('Please enter the full delivery address.'); return null; }
    address = st + ', ' + ci + ', ' + sa + ' ' + zp;
  }
  var spiceEl = body.querySelector('#t-spice');
  var spice = spiceEl ? spiceEl.value.trim() : '';
  if (!spice) spice = 'Not spicy';
  return { date: dateStr, time: timeStr, fulfillment: ful, address: address, spice: spice };
}

/* ---------- checkout: step 2 (Stripe Payment Element) ---------- */
var stripeObj = null, stripeElements = null;

function startStripePayment() {
  var form = validForm();
  if (!form) return;
  // Loyalty guard: rewards may only be applied for the phone number whose
  // balance was actually checked (server re-verifies anyway).
  if (rewApplied > 0) {
    var dNow = String(form.phone).replace(/\D/g, '');
    var dChecked = String(rewPhoneChecked).replace(/\D/g, '');
    if (dNow !== dChecked) {
      showErr('Your phone number changed \u2014 please tap "Check my rewards" again.');
      return;
    }
  }
  if (typeof Stripe === 'undefined') {
    showErr('Payment could not load. Check your connection and try again, or call (803) 659-3434.');
    return;
  }
  var isCatering = orderMode === 'catering';
  var m = isCatering ? cateringMath() : checkoutMath();
  var btn = foot.querySelector('#t-continue');
  btn.disabled = true;
  btn.textContent = 'Preparing secure payment...';
  showErr('');

  var items;
  if (isCatering) {
    // Catering lines: tray-menu items priced server-side from catering_menu.json.
    items = Object.keys(catCart).map(function (k) {
      var e = catCart[k];
      return { name: e.name, kind: e.kind, option: e.option, qty: e.qty };
    });
  } else {
    items = Object.keys(cart).map(function (k) {
      var e = cart[k];
      return { name: e.name, qty: e.qty,
               mods: (e.mods || []).map(function (m2) { return { g: m2.g, o: m2.o }; }) };
    });
  }
  var idemKey = 'tandoor-' + Date.now() + '-' + Math.random().toString(36).slice(2, 10);

  var payload = {
    items: items,
    customer: { name: form.name, phone: form.phone, email: form.email },
    tip_cents: m.tip,
    reward_cents: rewApplied,
    note: form.note,
    pickup: form.pickup,
    idemKey: idemKey
  };
  if (isCatering) {
    // Catering: no tip, no rewards. Server is authoritative on pricing.
    var c = form.catering;
    payload = {
      orderType: 'catering',
      items: items,
      customer: { name: form.name, phone: form.phone, email: form.email },
      tip_cents: 0,
      reward_cents: 0,
      note: form.note,
      catering: { date: c.date, time: c.time, fulfillment: c.fulfillment,
                  address: c.address, spice: c.spice },
      idemKey: idemKey
    };
  }
  fetch('/.netlify/functions/create-payment-intent', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  }).then(function (r) { return r.json().then(function (j) { return { ok: r.ok, j: j }; }); })
  .then(function (res) {
    if (!res.ok) throw new Error(res.j.error || 'Could not start checkout.');
    renderPaymentStep(res.j, form, m);
  })
  .catch(function (err) {
    btn.disabled = false;
    btn.textContent = 'Continue to payment \u2014 ' + money(m.total);
    showErr(err.message || 'Something went wrong. Please try again or call (803) 659-3434.');
  });
}

function renderPaymentStep(piData, form, m) {
  headTitle.textContent = 'Payment';
  var serverTotal = piData.totals.total; // authoritative total from the backend
  var isC = orderMode === 'catering' && form.catering;
  var kindText = isC
    ? 'catering ' + (form.catering.fulfillment === 'delivery' ? 'delivery' : 'pickup') +
      ' on ' + fmtLongDate(form.catering.date) + ' at ' + fmtTime12(form.catering.time)
    : 'pickup order';
  body.innerHTML =
    '<div id="t-err"></div>' +
    '<div class="t-field"><label>Card details <span class="t-star" aria-hidden="true">*</span></label>' +
    '<div id="t-stripe-pe" class="t-pe"></div></div>' +
    '<div style="font-size:.85rem;color:var(--muted)">Paying ' + esc(form.name) + ' \u2014 ' + kindText + '. A receipt will be emailed to ' + esc(form.email) + '.</div>';
  foot.innerHTML =
    '<div class="t-totals">' +
    '<div class="t-row"><span>Subtotal</span><span>' + money(piData.totals.subtotalBeforeReward || piData.totals.subtotal) + '</span></div>' +
    (piData.totals.reward > 0 ? '<div class="t-row"><span>Rewards</span><span>-' + money(piData.totals.reward) + '</span></div>' : '') +
    (isC && (piData.totals.deliveryFee || 0) > 0 ? '<div class="t-row"><span>Delivery fee</span><span>' + money(piData.totals.deliveryFee) + '</span></div>' : '') +
    '<div class="t-row"><span>Tax (9%)</span><span>' + money(piData.totals.tax) + '</span></div>' +
    (piData.totals.tip > 0 ? '<div class="t-row"><span>Tip</span><span>' + money(piData.totals.tip) + '</span></div>' : '') +
    '<div class="t-row grand"><span>Total</span><span>' + money(serverTotal) + '</span></div></div>' +
    '<button class="t-btn" type="button" id="t-pay">Pay ' + money(serverTotal) + '</button>' +
    '<button class="t-btn secondary" type="button" id="t-back2">Back</button>' +
    '<div class="t-secure">Payments are processed securely by Stripe. Card details never touch this website.</div>';

  foot.querySelector('#t-back2').addEventListener('click', function () {
    if (stripeElements) { try { stripeElements.getElement('payment').unmount(); } catch (e) {} }
    stripeElements = null;
    renderCheckoutView();
  });

  try {
    stripeObj = Stripe(piData.publishableKey);
    stripeElements = stripeObj.elements({ clientSecret: piData.clientSecret });
    var pe = stripeElements.create('payment');
    pe.mount('#t-stripe-pe');
  } catch (e) {
    showErr('Payment fields could not load. Check your connection and try again, or call (803) 659-3434.');
    foot.querySelector('#t-pay').disabled = true;
    return;
  }

  foot.querySelector('#t-pay').addEventListener('click', function () {
    var payBtn = foot.querySelector('#t-pay');
    payBtn.disabled = true;
    payBtn.textContent = 'Processing payment...';
    showErr('');
    stripeObj.confirmPayment({
      elements: stripeElements,
      confirmParams: { return_url: window.location.href.split('#')[0] },
      redirect: 'if_required'
    }).then(function (result) {
      if (result.error) {
        payBtn.disabled = false;
        payBtn.textContent = 'Pay ' + money(serverTotal);
        showErr(result.error.message || 'Payment did not go through. Please try again.');
      } else if (result.paymentIntent && result.paymentIntent.status === 'succeeded') {
        showStripeSuccess(result.paymentIntent, piData.totals, form.phone,
          orderMode === 'catering' ? form.catering : null);
      } else {
        payBtn.disabled = false;
        payBtn.textContent = 'Pay ' + money(serverTotal);
        showErr('Your payment is processing. You will receive a receipt by email shortly.');
      }
    });
  });
}

function showStripeSuccess(pi, totals, phone, catering) {
  headTitle.textContent = 'Order confirmed';
  var catHtml;
  if (catering) {
    var whenText = (catering.fulfillment === 'delivery' ? 'Delivery' : 'Pickup') + ': ' +
      fmtLongDate(catering.date) + ' at ' + fmtTime12(catering.time);
    catHtml =
      '<p><strong>' + esc(whenText) + '</strong></p>' +
      '<p>Payment confirmed. Your ticket is already with our kitchen. We\u2019ll fire it again the day before.</p>' +
      '<p>A receipt was emailed to you.</p>' +
      '<p>No rewards are earned on catering orders.</p>';
  } else {
    catHtml =
      '<p>Payment confirmed. Your order is on its way to our kitchen &mdash; we&rsquo;ll have it ready for pickup.</p>' +
      '<p>A receipt was emailed to you.</p>' +
      (totals.reward > 0
        ? '<p>You used ' + money(totals.reward) + ' in rewards on this order.</p>'
        : '<p>You earn $5 in rewards for every $50 you spend on food.</p>') +
      '<p id="t-rew-newbal" class="t-rew-newbal"></p>';
  }
  body.innerHTML =
    '<div class="t-success"><div class="t-check">\u2705</div><h3>Thank you!</h3>' +
    catHtml +
    '<div class="t-ref">Order ref: ' + esc(pi.id) + '<br>Total: ' + money(totals.total) + '</div></div>';
  // Rewards are settled by the backend webhook a few seconds after payment;
  // refresh the balance display once it has had time to land.
  if (phone && !catering) {
    setTimeout(function () {
      fetch('/.netlify/functions/loyalty-balance?phone=' + encodeURIComponent(phone))
        .then(function (r) { return r.ok ? r.json() : null; })
        .then(function (j) {
          var el = document.getElementById('t-rew-newbal');
          if (el && j && typeof j.balance_cents === 'number') {
            el.textContent = 'Your rewards balance is now ' + money(j.balance_cents) + '.';
          }
        })
        .catch(function () {});
    }, 8000);
  }
  foot.innerHTML = '<button class="t-btn" type="button" id="t-done">Done</button>';
  foot.querySelector('#t-done').addEventListener('click', function () {
    if (catering) { catCart = {}; saveCatCart(); } else { cart = {}; save(); }
    renderCartBtn(); closeDrawer();
  });
  renderCartBtn();
}

function showErr(msg) {
  var e = body.querySelector('#t-err');
  if (e) e.innerHTML = '<div class="t-err">' + esc(msg) + '</div>';
  body.scrollTop = 0;
}
function fulfillment() {
  return { type: 'pickup', address: '' };
}

/* ---------- regular pickup scheduling ---------- */
// Hours: lunch 11:15 AM - 2:45 PM, evening 5:10 PM - 9:00 PM (both endpoints
// are real slots). Closed 2:45 - 5:10 PM daily, closed Mondays.
// ASAP = ~30 mins from now. Keep PICKUP_SLOTS in sync with the backend
// (netlify/functions/lib/pickup.js slotList()).
var PICKUP_SLOTS = ['11:15','11:30','11:45','12:00','12:15','12:30','12:45',
  '13:00','13:15','13:30','13:45','14:00','14:15','14:30','14:45',
  '17:10','17:25','17:40','17:55','18:10','18:25','18:40','18:55',
  '19:10','19:25','19:40','19:55','20:10','20:25','20:40','20:55','21:00'];

function pickupSlotsForDate(dateStr) {
  // Returns the "HH:MM" (24h) slots valid for the given date (YYYY-MM-DD).
  // Same-day choices need at least 30 mins lead; Mondays return [].
  var d = new Date(dateStr + 'T00:00:00');
  if (isNaN(d.getTime()) || d.getDay() === 1) return []; // closed Mondays
  var now = new Date();
  var isToday = dateStr === fmtDateInput(now);
  if (!isToday) return PICKUP_SLOTS.slice();
  return PICKUP_SLOTS.filter(function (hhmm) {
    var p = hhmm.split(':');
    var slotTime = new Date(now);
    slotTime.setHours(parseInt(p[0], 10), parseInt(p[1], 10), 0, 0);
    return slotTime.getTime() >= now.getTime() + 30 * 60 * 1000;
  });
}

function fmtSlot12h(hhmm) {
  var parts = hhmm.split(':');
  var h = parseInt(parts[0], 10), m = parts[1];
  var ap = h >= 12 ? 'PM' : 'AM';
  var h12 = h % 12; if (h12 === 0) h12 = 12;
  return h12 + ':' + m + ' ' + ap;
}

function bindPickupScheduler() {
  var typeRadios = body.querySelectorAll('input[name="t-pickup-type"]');
  var schedDiv = body.querySelector('#t-pickup-sched');
  var dateEl = body.querySelector('#t-pickup-date');
  var timeEl = body.querySelector('#t-pickup-time');
  if (!typeRadios.length || !schedDiv) return;

  // Set date min/max: today to +7 days
  var now = new Date();
  dateEl.setAttribute('min', fmtDateInput(now));
  var maxD = new Date(now); maxD.setDate(maxD.getDate() + 7);
  dateEl.setAttribute('max', fmtDateInput(maxD));

  function updateType() {
    var sel = body.querySelector('input[name="t-pickup-type"]:checked');
    var isSched = sel && sel.value === 'scheduled';
    schedDiv.style.display = isSched ? '' : 'none';
    Array.prototype.forEach.call(typeRadios, function (r) {
      var lab = r.closest('label');
      if (lab) lab.classList.toggle('sel', r.checked);
    });
  }
  Array.prototype.forEach.call(typeRadios, function (r) {
    r.addEventListener('change', updateType);
  });

  dateEl.addEventListener('change', function () {
    var v = dateEl.value;
    timeEl.innerHTML = '';
    if (!v) {
      timeEl.innerHTML = '<option value="">Choose a date first</option>';
      return;
    }
    if (new Date(v + 'T00:00:00').getDay() === 1) {
      showErr('We\u2019re closed on Mondays \u2014 please pick another day.');
      timeEl.innerHTML = '<option value="">Closed on Mondays</option>';
      return;
    }
    showErr('');
    var slots = pickupSlotsForDate(v);
    if (!slots.length) {
      timeEl.innerHTML = '<option value="">No slots available this date</option>';
      return;
    }
    timeEl.innerHTML = '<option value="">Select a time</option>' +
      slots.map(function (s) { return '<option value="' + s + '">' + fmtSlot12h(s) + '</option>'; }).join('');
  });
  updateType();
}

function validPickupFields() {
  var sel = body.querySelector('input[name="t-pickup-type"]:checked');
  var type = sel ? sel.value : 'asap';
  if (type === 'asap') return { type: 'asap' };
  var dateEl = body.querySelector('#t-pickup-date');
  var dateStr = dateEl ? dateEl.value : '';
  if (!dateStr) { showErr('Please choose a pickup date.'); return null; }
  if (new Date(dateStr + 'T00:00:00').getDay() === 1) {
    showErr('We\u2019re closed on Mondays \u2014 please pick another day.');
    return null;
  }
  var timeEl = body.querySelector('#t-pickup-time');
  var timeStr = timeEl ? timeEl.value : '';
  if (!timeStr) { showErr('Please choose a pickup time.'); return null; }
  var slots = pickupSlotsForDate(dateStr);
  if (slots.indexOf(timeStr) < 0) {
    showErr('That pickup time is not available \u2014 please choose another.');
    return null;
  }
  return { type: 'scheduled', date: dateStr, time: timeStr };
}

function fmtDateInput(d) {
  return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
}

function validForm() {
  var name = body.querySelector('#t-name').value.trim();
  var phone = body.querySelector('#t-phone').value.replace(/\D/g, '');
  var email = body.querySelector('#t-email').value.trim();
  if (!name) { showErr('Please enter your name.'); return null; }
  if (phone.length < 7) { showErr('Please enter a valid phone number.'); return null; }
  if (!/^\S+@\S+\.\S+$/.test(email)) { showErr('Please enter a valid email for your receipt.'); return null; }
  if (orderMode === 'catering') {
    var c = validCateringFields();
    if (!c) return null;
    return { name: name, phone: body.querySelector('#t-phone').value.trim(), email: email,
             fulfillment: { type: c.fulfillment, address: c.address },
             note: body.querySelector('#t-note').value.trim(), catering: c };
  }
  var f = fulfillment();
  var pickup = validPickupFields();
  if (!pickup) return null;
  return { name: name, phone: body.querySelector('#t-phone').value.trim(), email: email,
           fulfillment: f, note: body.querySelector('#t-note').value.trim(), pickup: pickup };
}

/* ---------- modifier popup ---------- */
var modModal = null;
function closeModModal() {
  if (modModal && modModal.parentNode) modModal.parentNode.removeChild(modModal);
  modModal = null;
}
function openModModal(name, qids) {
  closeModModal();
  modModal = document.createElement('div');
  modModal.id = 't-mod-modal';
  var html = '<div class="t-mm-card" role="dialog" aria-label="Customize ' + esc(name) + '">' +
    '<div class="t-mm-head"><h3>' + esc(name) + '</h3>' +
    '<button class="t-d-close" type="button" id="t-mm-x" aria-label="Close">&times;</button></div>' +
    '<div class="t-mm-body">';
  qids.forEach(function (q, qi) {
    if (!q || !MOD_QUESTIONS[q.id]) return;
    var qid = q.id;
    html += '<div class="t-mm-q"><div class="t-mm-qt">' + esc(q.title) +
      (q.required ? ' <span class="t-req">Required</span>' : '') + '</div>';
    q.options.forEach(function (o, oi) {
      var on = typeof o === 'string' ? o : o[0];
      var op = typeof o === 'string' ? 0 : o[1];
      var type = q.multi ? 'checkbox' : 'radio';
      html += '<label class="t-mm-opt"><input type="' + type + '" name="t-mm-' + qi + '" value="' + esc(on) + '">' +
        '<span>' + esc(on) + '</span>' +
        (op ? '<span class="t-mm-price">+' + money(op) + '</span>' : '') + '</label>';
    });
    html += '</div>';
  });
  html += '</div><div class="t-mm-err" id="t-mm-err"></div>' +
    '<div class="t-mm-foot"><button class="t-btn secondary" type="button" id="t-mm-cancel">Cancel</button>' +
    '<button class="t-btn" type="button" id="t-mm-add">Add to order</button></div></div>';
  modModal.innerHTML = html;
  document.body.appendChild(modModal);
  modModal.querySelector('#t-mm-x').addEventListener('click', closeModModal);
  modModal.querySelector('#t-mm-cancel').addEventListener('click', closeModModal);
  modModal.addEventListener('click', function (e) { if (e.target === modModal) closeModModal(); });
  modModal.querySelector('#t-mm-add').addEventListener('click', function () {
    var mods = [], errEl = modModal.querySelector('#t-mm-err'), errMsg = '';
    qids.forEach(function (q, qi) {
      if (!q || !MOD_QUESTIONS[q.id]) return;
      var qid = q.id;
      var checked = modModal.querySelectorAll('input[name="t-mm-' + qi + '"]:checked');
      if (q.required && !checked.length) errMsg = 'Please choose: ' + q.title;
      Array.prototype.forEach.call(checked, function (c) { mods.push({ g: qid, o: c.value }); });
    });
    if (errMsg) { errEl.textContent = errMsg; return; }
    addToCart(name, mods);
    closeModModal();
  });
}

/* ---------- public API (only when the ordering backend is live) ---------- */
function enableOrdering() {
  window.TandoorCart = {
    add: function (name) {
      if (!(name in MENU_PRICES)) return;
      var qids = questionsFor(name);
      if (!qids.length) { addToCart(name, []); }
      else openModModal(name, qids);
    }
  };
  // catering.html IS the tray menu: force catering mode so the shared
  // catering cart, drawer totals and catering checkout apply here too.
  if (document.getElementById('cateringMenuSections')) orderMode = 'catering';
  buildChrome();
  // Wrap the menu's render: in catering mode it renders the CATERING MENU
  // (tray menu with per-dish Add buttons); pickup mode keeps the regular menu.
  hookMenuRender();
  enhanceCateringPage();
  // The menu renders before this script runs, so re-render it now that the
  // cart exists — this adds the "Add" buttons next to each dish.
  if (typeof window.render === 'function') { try { window.render(); } catch (e) {} }
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') { closeModModal(); closeDrawer(); }
  });
  // "Order Online" / "Start an Order" buttons anywhere on the page open the cart.
  document.addEventListener('click', function (e) {
    var b = e.target && e.target.closest ? e.target.closest('[data-open-cart]') : null;
    if (b) { e.preventDefault(); openDrawer('cart'); }
  });
}

// On-site ordering is live for all visitors.
enableOrdering();
})();