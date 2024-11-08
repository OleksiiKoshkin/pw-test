import { expect, test } from '@playwright/test';
import { ScenarioRunContext } from '../../types';
import { Sidebar } from '../../models/sidebar/sidebar';
import { VersionsPage } from '../../models/versions-page';

export function testVersionPerf(params: ScenarioRunContext) {
  test('Loading performance', async () => {
    test.fail(!params.page, 'No Page to process!');

    const startPrep = Date.now();

    await params.navigate?.('board'); // should be 404

    const sidebar = new Sidebar(params.page!);
    await sidebar.getSidebar();

    const endPrep = Date.now();
    console.log(`Preparation time: ${endPrep - startPrep} ms`);

    const startExec = Date.now();

    await sidebar.versionsButton.click();
    const versionsPage = new VersionsPage(params.page!);
    await versionsPage.waitVersionPageVisibility();

    const endExec = Date.now();

    console.log(`Page visibility time: ${endExec - startExec} ms`);

    expect(endExec - startExec).toBeLessThan(3000);
  });
}
