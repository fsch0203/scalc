// Language file
// Use as follows:
// var lg = languages.german;
// alert(lg.book); //Alerts "Speicher"
var languages = {
    us: { //+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
        help_h1: "Mouseless Stack Calculator is an intuitive calculator" +
            " with two modes. A stack mode with innovative data entry." +
            " And RPN mode for Reversed Polish Notation. No brackets needed in both modes." +
            " Keyboard entry, so no time" +
            " consuming mouse clicks. ",
        help_h2: "- Intuitive use of stack<br>" +
            "- Keyboard for all entry<br>" +
            "- Currency conversion<br>" +
            "- Optional notations<br>" +
            "- 30 last answers<br>" +
            "- 30 memories<br>" +
            "- Calculated formula<br>" +
            "- High-precision decimal<br>" +
            "- Multi-level undo<br>" +
            "- Work with hrs, min, sec<br>" +
            "- Math, statistics, finance<br>" +
            "- Constants + conversion<br>",
        help_h3a: "Mouseless Stack Calculator<br>" +
            "by Frans Schrijver<br><br>" +
            "Version ",
        help_h3b: "<br>" +
            "fsch0203@gmail.com<br>" +
            "Copyright ",
        help_h3c: ": GPL<br><br>" +
            "Press <b>b</b> for basic instruction<br>" +
            "Press <b>d</b> for data entry<br>" +
            "Press <b>f</b> for finance functions<br><br>" +
            "Press <b>h</b> for more info",
        help_g1: "You only need the keyboard to do calculations. "+
            "Enter <b>.</b> and <b>,</b> as decimal separators and <b>e</b> for exponent. " +
            "E.g. 10.5e7 or 4.7e-12.<br> "+
            "Choose <b>+-*/</b> to calculate, or select another function from one "+
            "of the submenus, e.g. <b>a</b> algebra",
        help_g2: "In the Options menu you can set your preferences, "+
            "like calculator mode, decimal seperator, etc. "+
            "Use arrows &#8593&#8595 to change #decimal places.<br><br>"+
            "Use <b>Ctrl-c</b> and <b>Ctrl-v</b> to copy and paste from clipboard.",
        help_g3: "Every answer is automatically stored in Last Answers stack. " +
            "Recall by pressing <b>l</b>.<br>" +
            "Press <b>m</b> to store the value from the x-stack to the first free place in Memory block. " +
            "Or press <b>s</b> followed by character to store on specific place. " +
            "Recall by pressing <b>r</b>.",
        help_i1: "Integrated currency conversion: press <b>x</b>. With <b>y</b> you can set your default " +
            "currency. Press <b>z</b> to reverse calculation. <br>" +
            "Exchange rates are refreshed when you load the app. Sources: ECB or Yahoo Finance." +
            "<br>",
        help_i2: "CAGR (Compound Average Growth Rate) and Annuity: " +
            "press <b>f</b> and give 3 out of 4 variables to calculate the unknown variable. <br>" +
            "First press <b>z</b> to set these 3 variables." +
            "<br>",
        help_i3: "Cashflow: " +
            "use the memory block to store cashflows, starting at place 0 for the intital value. " +
            "Use negative values for cash-out and positive for cash-in. " +
            "Press <b>i</b> to calculate the IRR. To calculate the NPV first press <b>z</b> to set the discount rate. " +
            "<br>",
        help_j1: "Stack-Calcuator is very flexible with the entry in different formats and notations. "+
            "Use for example <b>:</b> (or <b>;</b>) to enter min:sec. " +
            "Enter 12:53:18 to get 12.88333. <br>" +
            "To view the result as time choose <b>z</b> Notation, <b>c</b> hr:mn:sc.",
        help_j2: "Enter <b>\\</b> for fractions, e.g. 3\\4 (converted to 0.75). To show the results " +
            "as fractions choose <b>z</b> Notation, <b>\\</b>.<br>" +
            "Enter hex number by starting with 0x e.g. 0x10 (16). "+
            "Octal numbers start with 0o.. and binary numbers with 0b.. <br><br>",
        help_j3: "You can enter complex numbers in the form (a+bi), or [a+bi "+
            "(the closing bracket can be omitted). For polar notation you enter r<φ. " +
            "The angle in radian or degrees (set in <b>o</b> Options). " +
            "By changing the notation you can easily convert polar to/from rectangular.",
        About: "About",
        acceleration_gravity: "acceleration gravity (g)",
        algebra_trig: "algebra/trig",
        Algebra: "Algebra",
        all: "all",
        Angle: "Angle",
        Annuity: "Annuity",
        any_other_key_to_exit: "any other key to exit",
        Assign_value_to_variable: "Assign value to variable",
        atomic_mass: "atomic mass",
        average_memory: "average memory",
        balance_after_payment: "balance after payment",
        barrel: "barrel",
        base_currency: "base currency",
        binary: "binary",
        byTitle:"by",
        CAGR: "CAGR",
        calculate: "calculate",
        calory: "calory",
        Cashflow: "Cashflow",
        cashflows: "cashflows",
        celcius: "celcius",
        change_sign: "change sign",
        clear_copy_paste: "clear/copy/paste",
        clear: "clear",
        combinations: "combinations",
        comma: "comma",
        complex_numbers:"Complex numbers",
        complex_polar: "complex polar",
        complex_rectangular: "complex rectangular",
        Complex: "Complex",
        conjugate: "conjugate",
        constant: "constant",
        constants: "constants",
        convert: "convert",
        Convert: "Convert",
        copy_x_to_clipboard: "copy x to clipboard",
        data_entry:"Data entry",
        Decimal_separator: "Decimal separator",
        decimals: "decimals",
        degrees: "degrees",
        deviation_memory: "deviation memory",
        dot: "dot",
        drop_clearx: "drop (clear x)",
        Dutch: "Dutch",
        engineering: "engineering",
        English: "English",
        error: "Error",
        exchange_rates: "exchange rates",
        Exchange_result: "Exchange result: ",
        exponential: "exponential",
        factorial_gamma: "factorial/gamma",
        fahrenheit: "fahrenheit",
        finance: "finance",
        Finance: "Finance",
        financial_2: "financial (2 dec)",
        first_CF_not_negative: "first CF not negative",
        fixed: "fixed",
        foot: "foot",
        fraction: "fraction",
        future_value: "future value",
        fv: "fv",
        gallon: "gallon",
        golden_ratio: "golden ratio (φ)",
        gram: "gram",
        greatest_common_divisor: "greatest common divisor",
        h_m_s: "hr:mn:sc or dg:mn:sc",
        h_m: "hr:mn or dg:mn",
        help_about: "help/about",
        hexadecimal: "hexadecimal",
        horse_power: "horse power",
        inch: "inch",
        int: "int",
        interest_part_for_payment: "int. part for pmt nr",
        interest_per_period: "interest per period",
        internal_rate_of_return: "internal rate of return",
        inverse: "inverse",
        irr: "irr",
        joule: "joule",
        language_set_to:"language set to English",
        language: "Language",
        last_answers: "last answers",
        last_x:"last x",
        lastanswers_cleared: "lastanswers cleared",
        lastanswers: "lastanswers",
        least_common_multiple: "least common multiple",
        light_year: "light year",
        liter: "liter",
        lqd_ounce: "lqd ounce",
        Main_features: "Main features",
        mass:"mass",
        Math_constants: "Math constants",
        memory_cleared: "memory cleared",
        memory: "memory",
        Memory: "Memory",
        Menu: "Menu",
        meter: "meter",
        mile: "mile",
        mode: "mode",
        modulo: "modulo",
        natural_log_base: "natural log base (e)",
        natural_logarithm: "natural log",
        nautical_mile: "nautical mile",
        negative_cash_out: "- negative: cash out",
        negative_npv: "negative npv",
        net_present_value: "net present value",
        normal: "normal",
        notation: "notation",
        Notation: "Notation",
        nper: "#per",
        npv_of: "npv of",
        number_of_periods: "number of periods",
        octal: "octal",
        open_in_window: "open in window",
        options: "options",
        Options:"Options",
        paste_from_clipboard: "paste from clipboard",
        Paste_from_clipboard:"The browser prohibits direct paste from clipboard.\n\r Paste here and then press Enter",
        payment_number: "payment number",
        payment_per_period: "payment per period",
        payment: "payment",
        per: "per",
        permeability: "permeability in vac. (\u03BC)",
        permittivity: "permittivity in vac. (\u03B5)",
        permutations: "permutations",
        Physical_constants: "Physical constants",
        pi: "pi",
        pmt: "pmt",
        positive_cash_in: "- positive: cash in",
        pound_lb: "pound (lb)",
        Precision: "Precision",
        present_value: "present value",
        press_key_for_function: "press key for function, space to exit",
        press_key_to_convert: "press key to convert, space to exit",
        press_key_to_exchange_rates: "press key to exchange rates, space to exit",
        press_key_to_get_constant: "press key to get constant, space to exit",
        press_key_to_recall: "press key to recall, space to exit",
        press_key_to_store: "press key to store, space to exit",
        Press_y_to_set_base_curr: "Press <b>y</b> to set base curr.",
        press_z_to_reverse_direction: "press <b>z </b>: \u21d0 / \u21d2",
        principal_part_for_payment: "princ. part for pmt. nr",
        principal: "principle",
        pv: "pv",
        radian: "radian",
        random01: "random (0&lt;r&lt;1)",
        rate: "rate",
        recall_memory: "recall memory",
        root: "root",
        scientific: "scientific",
        scroll_stack: "scroll stack",
        select_yellow_box: "select yellow box",
        set_3_out_of_4: "set 3 out of 4",
        Set_base_currency: "Set base currency",
        set_discount_rate: "set discount rate",
        set_finance_variables: "set finance variables",
        set_future_value: "set future value",
        set_interest_rate: "set interest rate",
        Set_notation: "Set notation",
        set_number_of_periods: "set number of periods",
        set_payment_number: "set payment number",
        set_payment_per_period: "set payment per period",
        set_present_value: "set present value",
        set_principal_value: "set principal value",
        set_rate_cagr: "set rate/cagr",
        set_to: "set to",
        set_yx_to: "set y,x to",
        show_cashflows: "show cashflows",
        space: "space",
        speed_of_light: "speed of light in vac. (c)",
        square: "square",
        stack: "stack",
        standard_deviation: "standard deviation",
        statistics: "statistics",
        store_cfs_in_memory: "store cfs in memory",
        store_in_free_mem: "store in free mem",
        store_memory: "store memory",
        stored_in_memory: "stored in memory ",
        sum_memory: "sum memory",
        sum_squares_memory: "sum squares memory",
        support_for_complex_numbers:"support for complex numbers",
        swap: "swap",
        thousands_separator_on: "thousands_separator_on",
        Thousands_separator: "Thousands separator",
        today: "today",
        total_interest_paid: "tot. int. paid for annuity",
        total_payments: "total payments",
        Trigonometric: "Trigonometric",
        undo: "undo",
        unknown_variable: "unknown variable",
        Use_keyboard: "Use keyboard",
        variabes_and_calculate: "variabes and calculate",
        versionTitle:"version",
        watt: "watt",
        What_is_it: "What is it",
        yard: "yard",
        Error_set_notation_to_complex:"Error (set notation to complex)",
        integer:"integer",
    },
    nl: { //+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
        help_h1: "Mouseless Stack Calculator is een intuïtieve rekenmachine" +
            " met twee modi. Een stack modus met innovatieve invoer van gegevens." +
            " En een RPN modus voor Reversed Polish Notation. In beide modi zijn geen haakjes nodig." +
            " Invoer via het toetsenbord, dus geen tijdrovend" +
            " gebruik van de muis. ",
        help_h2: "- Intuïtieve stack<br>" +
            "- Invoer via toetsenbord<br>" +
            "- Wisselkoersconversie<br>" +
            "- Verschillende notaties<br>" +
            "- 30 laatste antwoorden<br>" +
            "- 30 geheugenplaatsen<br>" +
            "- Formule van berekening<br>" +
            "- Hoge nauwkeurigheid<br>" +
            "- Ongedaan maken<br>" +
            "- Werk met uren, min, sec<br>" +
            "- Wisk./statistiek/financ.<br>" +
            "- Constanten + conversie<br>",
        help_h3a: "Mouseless Stack Calculator<br>" +
            "door Frans Schrijver<br><br>" +
            "Versie ",
        help_h3b: "<br>" +
            "fsch0203@gmail.com<br>" +
            "Copyright ",
        help_h3c: ": GPL<br><br>" +
            "<b>b</b> voor basis instructie<br>" +
            "<b>d</b> gegevens invoer<br>" +
            "<b>f</b> financiële functies<br><br>" +
            "<b>h</b> voor meer informatie",
        help_g1: "Om berekeningen te doen, is alleen het toetsenbord nodig. "+
            "Gebruik <b>.</b> en <b>,</b> als decimaaltekens en <b>e</b> als exponent. " +
            "Bijv. 10.5e7 of 4.7e-12.<br> " +
            "Gebruik <b>+-*/</b> om te berekenen, of selecteer een andere functie "+
            "uit een van de submenus, bijv. <b>a</b> algebra",
        help_g2: "In het Opties menu kun je je voorkeuren instellen, "+
            "zoals calculator modus, decimale scheiding, enz. "+
            "Gebruik de pijlen &#8593&#8595 om het # decimalen in te stellen.<br><br>"+
            "<b>Ctrl-c</b> and <b>Ctrl-v</b> om te kopiëren van en naar het clipboard.",
        help_g3: "Elk antwoord wordt automatisch bewaard in Laatste Antwoorden. " +
            "Opvragen: toets <b>l</b>.<br>" +
            "Toets <b>m</b> om een waarde op te slaan in het eerste vrije geheugen. " +
            "Of toets <b>s</b> om op specifieke plaats op te slaan. " +
            "Opvragen via <b>r</b>.",
        help_i1: "Wisselkoersconversie: toets <b>x</b>. Toets daarna <b>y</b> om standaard valuta te kiezen. " +
            "Toets <b>z</b> voor omgekeerde conversie. <br>" +
            "Wisselkoersen worden ververst bij het laden van de app. Bronnen: ECB of Yahoo Finance." +
            "<br>",
        help_i2: "CAGR (Samengestelde jaarlijkse groei) and Annuïteit: " +
            "toets <b>f</b> en geef 3 van de 4 variabelen om de onbekende variabele te berekenen. <br>" +
            "Via <b>z</b> kun je de 3 variabelen instellen." +
            "<br>",
        help_i3: "Cashflow: " +
            "gebruik het geheugenblok om cashflows in te voeren, beginnend bij 0 als initiële waarde. " +
            "Geef negatieve waardes voor cash-out en positieve voor cash-in. " +
            "Toets <b>i</b> om de IRR te berekenen. Om de NPV te berekenen: eerst via <b>z</b> de disconteringsvoet instellen. " +
            "<br>",
        help_j1: "Stack-Calcuator is erg flexibel in formaten en notaties. "+
            "Gebruik bijv. <b>:</b> (of <b>;</b>) voor min:sec. " +
            "Toets 12:53:18 en krijg 12.88333. <br>" +
            "Om het resultaat als tijd te zien: kies <b>z</b> Notatie, <b>c</b> hr:mn:sc.",
        help_j2: "Toets <b>\\</b> voor breuken, bijv. 3\\4 (wordt 0.75). Om het resultaat te zien " +
            "als breuk, kies <b>z</b> Notatie, <b>\\</b>.<br>" +
            "Hexadecimaal getal door te beginnen met " +
            "0x bijv. 0x10 (16). "+
            "Octale getallen beginnen met 0o.. en binaire getallen met 0b.. <br><br>",
        help_j3: "Invoer van complexe getallen in de vorm: (a+bi), or [a+bi "+
            "(het afsluitende haakje is niet nodig). Polaire notatie in de vorm van r<φ. " +
            "Geef de hoek in radialen of graden (instellen via <b>o</b> Opties). " +
            "Door de notatie aan te passen, kun je makkelijk converteren tussen polair en algabraïsch.",
        About: "Over",
        acceleration_gravity: "valversnelling",
        algebra_trig: "algebra/gonio",
        Algebra: "Algebra",
        all: "alles",
        Angle: "Hoek",
        Annuity: "Annuïteit",
        any_other_key_to_exit: "andere toets om af te breken",
        Assign_value_to_variable: "Wijs waarde toe",
        atomic_mass: "atom. massa",
        average_memory: "gemiddelde geheugens",
        balance_after_payment: "balans na termijn nr",
        barrel: "vat (barrel)",
        base_currency: "basis valuta",
        binary: "binair",
        byTitle:"door",
        CAGR: "CAGR",
        calculate: "bereken",
        calory: "calorie",
        Cashflow: "Cashflow",
        cashflows: "cashflows",
        celcius: "celcius",
        change_sign: "maak negatief",
        clear_copy_paste: "wis/kopieer/plak",
        clear: "wis",
        combinations: "combinaties",
        comma: "komma",
        complex_numbers:"Complexe getallen",
        complex_polar: "complex polair",
        complex_rectangular: "complex algabraïsch",
        Complex: "Complex",
        conjugate: "conjugeren",
        constant: "constante",
        constants: "constanten",
        convert: "converteer",
        Convert: "Converteer",
        copy_x_to_clipboard: "kopieer x naar clipboard",
        data_entry:"Invoer",
        Decimal_separator: "Decimale scheiding",
        decimals: "decimalen",
        degrees: "graden",
        deviation_memory: "deviatie geheugens",
        dot: "punt",
        drop_clearx: "drop (wis x)",
        Dutch: "Nederlands",
        engineering: "engineering",
        English: "Engels",
        error: "Error",
        exchange_rates: "wisselkoersen",
        Exchange_result: "Valuta: ",
        exponential: "exponentieel",
        factorial_gamma: "faculteit/gamma",
        fahrenheit: "fahrenheit",
        finance: "financieel",
        Finance: "Financieel",
        financial_2: "financieel (2 dec)",
        first_CF_not_negative: "eerste CF niet negatief",
        fixed: "vast",
        foot: "voet",
        fraction: "fractie",
        future_value: "toekomstige waarde",
        fv: "tw",
        gallon: "gallon",
        golden_ratio: "gulden snede (φ)",
        gram: "gram",
        greatest_common_divisor: "grootste gemene deler",
        h_m_s: "hr:mn:sc or gr:mn:sc",
        h_m: "hr:mn of gr:mn",
        help_about: "help/over",
        hexadecimal: "hexadecimaal",
        horse_power: "paardekracht",
        inch: "duim",
        int: "rente",
        interest_part_for_payment: "rente in termijn nr",
        interest_per_period: "rente per periode",
        internal_rate_of_return: "interne rentabiliteit",
        inverse: "inverse",
        irr: "irr",
        joule: "joule",
        language_set_to:"taal: Nederlands",
        language: "Taal",
        last_answers: "laatste antwoorden",
        last_x:"laatste x",
        lastanswers_cleared: "laatste antwoorden gewist",
        lastanswers: "laatste antwoorden",
        least_common_multiple: "kleinste gem. veelvoud",
        light_year: "lichtjaar",
        liter: "liter",
        lqd_ounce: "lqd ounce",
        Main_features: "Belangrijkste functies",
        mass:"massa",
        Math_constants: "Wiskundige constanten",
        memory_cleared: "geheugen gewist",
        memory: "geheugen",
        Memory: "Geheugen",
        Menu: "Menu",
        meter: "meter",
        mile: "mijl",
        mode: "modus",
        modulo: "modulo",
        natural_log_base: "grondtal e",
        natural_logarithm: "nat. logaritme",
        nautical_mile: "zeemijl",
        negative_cash_out: "- negatief: cash out",
        negative_npv: "negatieve ncw",
        net_present_value: "netto contante waarde",
        normal: "normaal",
        notation: "notatie",
        Notation: "Notatie",
        nper: "#per",
        npv_of: "ncw van",
        number_of_periods: "#per'n",
        octal: "octaal",
        open_in_window: "open in venster",
        options: "opties",
        Options:"Opties",
        paste_from_clipboard: "plak van clipboard",
        Paste_from_clipboard:"The browser prohibits direct paste from clipboard.\n\r Paste here and then press Enter",
        payment_number: "n-de termijn",
        payment_per_period: "betaling per periode",
        payment: "termijnbedr.",
        per: "per",
        permeability: "permeabiliteit in vac. (\u03BC)",
        permittivity: "permittiviteit in vac. (\u03B5)",
        permutations: "permutaties",
        Physical_constants: "Fysieke constanten",
        pi: "pi",
        pmt: "bet",
        positive_cash_in: "- positief: cash in",
        pound_lb: "pond (lb)",
        Precision: "Nauwkeurigheid",
        present_value: "contante waarde",
        press_key_for_function: "toets letter voor functie; spatiebalk terug",
        press_key_to_convert: "toets letter voor conversie; spatiebalk terug",
        press_key_to_exchange_rates: "toets letter voor conversie; spatiebalk terug",
        press_key_to_get_constant: "toets letter voor constante; spatiebalk terug",
        press_key_to_recall: "toets letter om uit geheugen te halen; spatiebalk terug",
        press_key_to_store: "toets letter om op te slaan; spatiebalk terug",
        Press_y_to_set_base_curr: "<b>y</b> voor basis valuta",
        press_z_to_reverse_direction: "toets <b>z </b>: \u21d0 / \u21d2",
        principal_part_for_payment: "aflossing in termijn nr",
        principal: "hfdsom",
        pv: "cw",
        radian: "radialen",
        random01: "random (0&lt;r&lt;1)",
        rate: "rente",
        recall_memory: "haal uit geheugen",
        root: "wortel",
        scientific: "wetenschappelijk",
        scroll_stack: "scroll stack",
        select_yellow_box: "selecteer geel vak",
        set_3_out_of_4: "kies 3 uit 4",
        Set_base_currency: "Kies basis valuta",
        set_discount_rate: "kies disconteringsvoet",
        set_finance_variables: "kies financiële variabelen",
        set_future_value: "kies eindwaarde",
        set_interest_rate: "kies rente",
        Set_notation: "Kies notatie",
        set_number_of_periods: "kies aantal perioden",
        set_payment_number: "kies termijn nr",
        set_payment_per_period: "kies betaling per periode",
        set_present_value: "kies contante waarde",
        set_principal_value: "kies hoofdsom",
        set_rate_cagr: "kies rente",
        set_to: "op",
        set_yx_to: "y,x naar",
        show_cashflows: "laat cashflows zien",
        space: "spatie",
        speed_of_light: "lichtsnelheid in vac. (c)",
        square: "kwadraat",
        stack: "stack",
        standard_deviation: "standaard deviatie",
        statistics: "statistiek",
        store_cfs_in_memory: "plaats cfs in geheugen",
        store_in_free_mem: "opslaan in vrij geh.",
        store_memory: "sla op in geheugen",
        stored_in_memory: "opgeslagen in geheugen ",
        sum_memory: "som geheugens",
        sum_squares_memory: "som kwadraten geheugens",
        support_for_complex_numbers:"ondersteuning voor complexe getallen",
        swap: "wissel",
        thousands_separator_on: "duizend-scheidingsteken aan",
        Thousands_separator: "Duizend-scheidingsteken",
        today: "vandaag",
        total_interest_paid: "totaal betaalde rente",
        total_payments: "totaal betaald",
        Trigonometric: "Goniometrie",
        undo: "undo",
        unknown_variable: "onbekende variabele",
        Use_keyboard: "Gebruik toetsenbord",
        variabes_and_calculate: "variabelen and bereken",
        versionTitle:"versie",
        watt: "watt",
        What_is_it: "Wat is het",
        yard: "yard",
        Error_set_notation_to_complex:"Error (zet notatie op complex)",
        integer:"integer",
    }
};
