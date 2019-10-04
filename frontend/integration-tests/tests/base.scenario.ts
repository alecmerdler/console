import { browser, ExpectedConditions as until, $, $$, ElementFinder } from 'protractor';

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
  };

  const records = new Set<BBBRecord>();

  const resultItems = $$('.styles__ResultItem-sc-7wrkzl-0');
  const phoneFor = async(result: ElementFinder) => result.$$('.MuiTypography-root.MuiTypography-body1').get(0).getText();
  const businessNameFor = async(result: ElementFinder) => result.$('.Name__Link-sc-1srnbh5-1').getText();
  const zipFor = async(result: ElementFinder) => {
    const all = (await result.$('strong').getText()).slice(-10);
    return all[5] === '-' ? all.slice(0, 5) : all.slice(-5); 
  };

  afterAll(() => {
    console.log([...records]);
    // console.log(JSON.stringify([...records]));
  });

  it('downloads the search results', async() => {
    await browser.get(`https://www.bbb.org/search?find_country=USA&find_entity=10126-000&find_id=10126-000&find_text=roofing&find_type=Category&page=1&sort=Distance`);
    
    expect(resultItems.count()).toBeGreaterThan(0);

    // await browser.sleep(100000);
    resultItems.each(async(e) => {
      const phone = await phoneFor(e);
      const businessName = await businessNameFor(e);
      const zip = await zipFor(e);

      records.add({phone, businessName, zip});
    });
  });
});
