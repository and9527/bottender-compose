const delay = require('delay');

const parallel = require('../parallel');
const { sendText } = require('../');

it('should create action that will run in parallel', () => {
  const haha = async context => {
    await sendText('haha')(context);
    await delay(1000);
  };
  const wow = async context => {
    await sendText('wow')(context);
    await delay(3000);
  };
  const cool = async context => {
    await sendText('cool')(context);
    await delay(5000);
  };

  const action = parallel([haha, wow, cool]);

  const context = {
    sendText: jest.fn(),
  };

  action(context);

  expect(context.sendText.mock.calls).toContainEqual(['cool']);
  expect(context.sendText.mock.calls).toContainEqual(['wow']);
  expect(context.sendText.mock.calls).toContainEqual(['haha']);
});

it('should pass extra args to underlying action', async () => {
  const haha = jest.fn();
  const wow = jest.fn();

  const action = parallel([haha, wow]);

  const context = {
    sendText: jest.fn(),
  };

  const extraArg = {};

  await action(context, extraArg);

  expect(haha).toBeCalledWith(context, extraArg);
  expect(wow).toBeCalledWith(context, extraArg);
});
