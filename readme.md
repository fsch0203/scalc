# Mouseless Stack-Calculator

Mouseless Stack-Calculator is a innovative calculator and currency converter with fast keyboard entry. It has two modes: an RPN-mode and a stack-mode. The well known RPN stands for Reverse Polish Notation and it saves you time as it avoids the use of parenthesis. The only catch is that the entry of data is a bit different to what most people expect, so you have to learn to work with it. The stack-mode of this calculator is new. It's a bit similar to RPN in the way that is also uses a stack an avoids the use of parenthesis. But it's unique in the way that it has no reversed data entry but follows the 'normal' sequence. All calculations can be done by use of the keyboard, so no time consuming mouse clicks. It can handle both real and complex numbers and supports different notations. Mouse Stack-Calculator is available as Chrome and Edge extension, as desktop app and can run in a webbrowser window.

## Resources
- [Website www.stack-calculator.com](https://www.stack-calculator.com)
- [Edge webstore](https://microsoftedge.microsoft.com/addons/detail/mouseless-stackcalculato/lmkclfogilfmkknmgdmnnooeigmillok?hl=en-US)
- [Chrome webstore](https://chrome.google.com/webstore/detail/mouseless-stack-calculato/gioiiinkphfmlagimjfjpamickecbnel?hl=nl)

## Main features

- Flexible and intuitive user interface
- Complete insight in entered expression
- All the advantages of RPN in RPN-mode
- Keyboard for all data entry (as you would expect from a calculator)
- Most frequent used instructions only need 1 key; other instructions 2 keys
- Integrated currency converter with actual rates
- Arbitrary-precision decimal representation (no rounding errors), thanks to MikeMcl
- Multi-level undo
- Support for complex numbers and polar/rectangular conversions
- Flexible number notation: normal, financial, integer, scientific, engineering, h:m:s, h:m, hexadecimal, octal, binary, fractions, complex (rectangular and polar)
- 30 last answers
- 30 memories to store intermediate results
- Stack and memory are saved on your computer for future use
- Copy results to clipboard for use in other programs
- Mathematical calculations
- Works with hours (or degrees), minutes, seconds
- Statistical and probability calculations
- Financial calculations like CAGR, Annuity and CashFlow
- Physical constants and conversions

## Change history

### Version 1.300
- Manifest 3

### Version 1.260
- Minor bugs fixed

#### Version 1.240
- Bug fix: accept entry with negative exponent correctly

#### Version 1.230
- Extension ported to MS-Edge
- Last position of window is saved
- ECB now only provider of daily exchange rates (yahoo removed)
- Minor bugs fixed

#### Version 1.220
- No thousandseparator in case of hexadecimal, octal and binary numbers
- Bug fix: corrected displayed expression in case of inverse function (1/x)
- Extension now standard opens in seperate window; letter [b] no longer used

#### Version 1.210
- Notation integer added
- Bug fix: trig functions now work again with degrees
- Bug fix: entry if digit f in hexadecimal now working
- Minor bugs fixed

#### Version 1.200
- Support for complex numbers
- Support for multiple languages (now English and Dutch)
- Exchange menu feeded with conversion results
- New menu for notations
- Last_x added

#### Version 1.110
- Added ctrl-c and ctrl-v for copy and paste clipboard
- Bug fix: clear stack now really cleared

#### Version 1.100
- Bug fix: activated escape key

#### Version 1.000
- First release for PortableApps
- Added notation for fractions
- Data entry of fractions, e.g. 3\16 (internally calculated as 0.1875)
- Bug fix: correct hex numbers entry
- Bug fix: correct h:m:s numbers entry

#### Version 0.810
- Fixed minor bugs
- Desktop version (based on NodeWebkit) added
- Version 5.01 of decimal.js included
- Option to display, enter and calculate hexadecimal, octal and binary numbers

#### Version 0.800
- Integration of decimal.js that provides arbitrary-precision decimal representation (thanks to MikeMcl)
- Stopped using cookies, now uses local storage (as web-application) and chrome storage (as chrome extension and app)

#### Version 0.724
- Restricted permissions to access only ECB data (currency rates)

#### Version 0.723
- Added compatibility to work as Chrome extension, as packaged app and in webbrowser
- Minor bugs

#### Version 0.710
- Exchange rates added
- Prefixes added to engineering notation
- Uppercase input converted to lowercase
- Improved conversion menu
- Improved financial entry menu
- Remember x-value when switching to stack-mode
- Hide Options menu after selecting option

#### Version 0.700
- Option added to work with hours:minutes:seconds (or degrees:minutes:seconds)
- Changed initial precision to 16 to prevent rounding errors
- Prevent display of e+0 and e-0 in scientific notation

#### Version 0.603
- link to homepage in footer added
- script for google analytics added

#### Version 0.60
- Integration of stack-calculator and rpn-calculator
- Improvement of data entry for financial calculations

#### Version 0.50
- Major revision of layout to make user interface more simple
- History sheet skipped in favor of calculated formulas + lastanswers memory
- Formula of executed calculation in every stack memory
- Lastanswer memory increased to 30 places
- Improved user interface for financial calculations
- Only one memory block (30 places)
- Covariance and correlation functions skipped

#### Version 0.44
- Last Answers as default memory
- Option added to paste clipboard content in x-register
- Corrected rounding in memories and history sheet
- Entry of negative exponent in scientific notation with minus-key
- Added thousands separator as option under [o] notation

#### Version 0.43
- Activated Backspace key
- Added some physical constants

#### Version 0.42
- Option added to open calculator in separate window (press [b])
- Annuity calculations not always correct if historic information was used

#### Version 0.40
- Financial calculations more logical and user friendly (submenus for CAGR, Annuity and Cashflow calculations)
- Extra Memory-block with Last Answers (press [z] twice)
- Scroll direction of History-box corrected
- Some minor bugs

#### Version 0.30
- First release as Chrome extension
