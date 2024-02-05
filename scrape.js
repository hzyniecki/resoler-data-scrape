const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({headless: 'new'});
  const page = await browser.newPage();

  // Navigate to the website
  await page.goto('https://www.westcoastresoles.com/');

  // Extract all paragraphs from the page
  const divsOnSite = await page.evaluate(() => {
  
    const divNodes = document.querySelectorAll('div');
    const title = document.querySelector('h1').innerText;

    const titleContainer = [];
    const divContainer = [];
    
    titleContainer.push(title);
    divNodes.forEach(node => {
        let divText = node.innerText.trim();
        if (divText.includes('week') ) {
            if (!divContainer.some(item => item.returnWindow === divText)) {
                divContainer.push({returnWindow : divText});
            }
        }
    });
    return {title: titleContainer, returnWindow: divContainer};
  });

  const paragraphsOnSite = await page.evaluate(() => {
    const paragraphNodes = document.querySelectorAll('p');
    const paragraphContainer = [];
    const titleContainer = [];


  paragraphNodes.forEach(node => {
      let paragraphText = node.innerText.trim();
      if (paragraphText.includes('week') ) {
          if (!paragraphContainer.some(item => item.returnWindow === paragraphText)) {
            paragraphContainer.push({returnWindow : paragraphText});
          }
      }
  });
  return {title: titleContainer, ReturnWindow: paragraphContainer};
});

  const contactInfo = await page.evaluate(() => {
    const textContent = document.body.innerText;
    const phoneNumbers = textContent.match(/(?:\+\d{1,2}\s*)?(?:\(?\d{3}\)?[\s.-]?)?\d{3}[\s.-]?\d{4}/g); // Regular expression for phone numbers
    const emails = textContent.match(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g); // Regular expression for email addresses
    return { phoneNumbers, emails };
  });

  const address = await page.evaluate(() => {
    const possibleAddressElements = document.querySelectorAll('div, p, span'); // You can adjust this selector based on where the address might be located
    let foundAddress = null;
    possibleAddressElements.forEach(element => {
      // Check if the element's text content contains common patterns indicative of an address
      if (element.innerText.includes('Street') || element.innerText.includes('Avenue') || element.innerText.includes('City')) {
        foundAddress = element.innerText.trim();
      }
    });
    return foundAddress;
  });



  console.log(divsOnSite, contactInfo, paragraphsOnSite, address);

  // Close the browser
  await browser.close();
})();






