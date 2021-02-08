describe('Calc', () => {
  beforeAll(async () => {
    await page.goto('http://localhost:5000/dmgcalc')
  })

  it('should calc 160 SpA charmander versus bulbasaur', async () => {
    await page.waitForSelector('#s2id_autogen1')

    await page.click('#s2id_autogen1')
    await page.keyboard.press('c')
    await page.keyboard.press('h')
    await page.keyboard.press('a')
    await page.keyboard.press('r')
    await page.keyboard.press('m')
    await page.keyboard.press('a')
    await page.keyboard.press('n')
    await page.keyboard.press('Enter')

    await page.click('#s2id_autogen3')
    await page.keyboard.press('b')
    await page.keyboard.press('u')
    await page.keyboard.press('l')
    await page.keyboard.press('b')
    await page.keyboard.press('a')
    await page.keyboard.press('s')
    await page.keyboard.press('a')
    await page.keyboard.press('Enter')

    await page.click('#s2id_autogen5')
    await page.keyboard.press('f')
    await page.keyboard.press('l')
    await page.keyboard.press('a')
    await page.keyboard.press('m')
    await page.keyboard.press('e')
    await page.keyboard.press('t')
    await page.keyboard.press('h')
    await page.keyboard.press('r')
    await page.keyboard.press('o')
    await page.keyboard.press('w')
    await page.keyboard.press('Enter')

    await page.click('#p1 .sa .evs')
    await page.keyboard.press('1')
    await page.keyboard.press('6')
    await page.keyboard.press('0')

    await expect(page).toMatch('160 SpA Charmander Flamethrower vs. 0 HP / 0 SpD Bulbasaur: 120-144 (100 - 120%) -- guaranteed OHKO')
  })
})