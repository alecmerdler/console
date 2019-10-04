import { browser, ExpectedConditions as until, $, $$, ElementFinder } from 'protractor';
import * as fs from 'fs';

import { appHost, testName } from '../protractor.conf';
import * as crudView from '../views/crud.view';

const BROWSER_TIMEOUT = 15000;

xdescribe('Create a test namespace', () => {
  it(`creates test namespace ${testName} if necessary`, async () => {
    // Use projects if OpenShift so non-admin users can run tests.
    const resource = browser.params.openshift === 'true' ? 'projects' : 'namespaces';
    await browser.get(`${appHost}/k8s/cluster/${resource}`);
    await crudView.isLoaded();
    const exists = await crudView.rowForName(testName).isPresent();
    if (!exists) {
      await crudView.createYAMLButton.click();
      await browser.wait(until.presenceOf($('.modal-body__field')));
      await $$('.modal-body__field')
        .get(0)
        .$('input')
        .sendKeys(testName);
      await $$('.modal-body__field')
        .get(1)
        .$('input')
        .sendKeys(`test-name=${testName}`);
      await $('.modal-content')
        .$('#confirm-action')
        .click();
      await browser.wait(until.urlContains(`/${testName}`), BROWSER_TIMEOUT);
    }
    expect(browser.getCurrentUrl()).toContain(appHost);
  });
});

describe('Scraping bbb.org', () => {
  type BBBRecord = {
    phone: string;
    businessName: string;
    zip: string;
    id: number;
  };

  const searchURL = (page: number, state: string) => 
    `https://www.bbb.org/search?find_country=USA&find_text=roofing&find_type=Category&page=${page}&sort=Distance&state=${state}`;
  const records = new Set<BBBRecord>();
  const maxPages = 100;
  const state = 'tx';
  const phoneSelector = '.MuiTypography-root.MuiTypography-body1';
  const nameSelector = '.Name__Link-sc-1srnbh5-1.iLgCPH';

  const resultItems = $$('.styles__ResultItem-sc-7wrkzl-0');
  // FIXME(alecmerdler): Add a check some companies don't have a phone number
  const phoneFor = async(result: ElementFinder) => result.$$(phoneSelector).get(0).getText();
  const businessNameFor = async(result: ElementFinder) => result.$(nameSelector).getText();
  const zipFor = async(result: ElementFinder) => {
    const all = (await result.$('strong').getText()).slice(-10);
    return all[5] === '-' ? all.slice(0, 5) : all.slice(-5); 
  };
  const idFor = async(result: ElementFinder) => parseInt((await result.$(nameSelector).getAttribute('href'))
    .split('-')
    .slice(-1)[0]);

  afterAll(() => {
    console.log(JSON.stringify([...records]));
    // TODO(alecmerdler): Find the highest ID for this region
    const highestID = [...records].reduce((highestID, record) => record.id > highestID ? record.id : highestID, 0)
    // TODO(alecmerdler): Duplicate records caused by ads, filter them out
    fs.writeFileSync('/home/alec/projects/bbb/records.json', JSON.stringify([...records], null, 4));
  });

  Array.from(new Array(maxPages)).forEach((_, i) => {
    describe(`for result page ${i}`, () => {
      it(`downloads the search results`, async() => {
        await browser.get(searchURL(i + 1, state));
        
        expect(resultItems.count()).toBeGreaterThan(0);
    
        resultItems.each(async(e) => {
          const phone = await phoneFor(e);
          const businessName = await businessNameFor(e);
          const zip = await zipFor(e);
          const id = await idFor(e);
    
          records.add({phone, businessName, zip, id});
        });
      });
    });
  });
});
