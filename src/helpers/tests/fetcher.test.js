/* eslint-disable no-process-env,no-underscore-dangle */
import fetcher from "../fetcher";

/** @test {fetcher} */
describe("fetcher", () => {
	(() => {
		const OLD_ENV = process.env;

		beforeEach(() => {
			jest.resetModules(); // this is important
			process.env = { ...OLD_ENV };
			delete process.env.NODE_ENV;
		});

		afterEach(() => {
			process.env = OLD_ENV;
		});
	})();

	describe("default", () => {
		let perform = jest.fn(() => {});

		let revert = () => {};

		beforeEach(() => {
			perform = jest.fn((fn) => fn());
			revert = fetcher.__Rewire__("perform", perform);
			fetch.mockResponse(JSON.stringify({
				status: 200,
				data: []
			}));
		});

		afterEach(() => {
			revert();
		});

		it("calls `fetch` by default", () => {
			process.env.NODE_ENV = "test";
			let input = jest.fn();
			let init = jest.fn();

			fetcher(input, init);

			expect(fetch).toHaveBeenCalledWith(input, init);
		});

		it("doesn't fetch when in development with FAKE DATA flag", () => {
			process.env.NODE_ENV = "development";
			process.env.REACT_APP_FAKE_DATA = "true";

			let input = "/foobar";
			let init = jest.fn();

			fetcher(input, init);

			expect(fetch).toHaveBeenCalledWith("/fakeData/foobar/GET.json");
		});

		it("resolves when status < 400", (done) => {
			process.env.NODE_ENV = "development";
			process.env.REACT_APP_FAKE_DATA = "true";

			let input = "/foobar";
			let init = jest.fn();

			fetch.once(JSON.stringify({
				status: 200,
				data: []
			}));

			fetcher(input, init)
				.then(() => {
					expect(perform).toHaveBeenCalled();
					done();
				})
.catch(done.fail);
		});

		it("rejectes when status >= 400", (done) => {
			process.env.NODE_ENV = "development";
			process.env.REACT_APP_FAKE_DATA = "true";

			let input = "/foobar";
			let init = jest.fn();

			fetch.once(JSON.stringify({
				status: 400,
				data: []
			}));

			fetcher(input, init)
				.catch(() => {
					expect(perform).toHaveBeenCalled();
					done();
				});
		});
	});

	describe("perform", () => {
		let perform = () => {};

		beforeEach(() => {
			jest.useFakeTimers();
			perform = fetcher.__get__("perform");
		});

		it("performs immediately if `REACT_APP_SLOW_CONNECTION` is not set", () => {
			process.env.REACT_APP_SLOW_CONNECTION = undefined;

			let fn = jest.fn();
			perform(fn);

			expect(window.setTimeout).not.toHaveBeenCalled();
			expect(fn).toHaveBeenCalled();
		});

		it("performs after a delay if `REACT_APP_SLOW_CONNECTION` is set to true", () => {
			process.env.REACT_APP_SLOW_CONNECTION = true;

			let fn = jest.fn();
			perform(fn);

			expect(window.setTimeout).toHaveBeenCalled();
			jest.runAllTimers();

			expect(fn).toHaveBeenCalled();
		});
	});

	describe("wrapAsResponse", () => {
		let wrapAsResponse = () => {};

		beforeEach(() => {
			wrapAsResponse = fetcher.__get__("wrapAsResponse");
		});

		it("wraps data as an object with a json property", (done) => {
			let data = jest.fn();
			let result = wrapAsResponse(data);

			result.json()
				.then((actualData) => {
					expect(actualData).toBe(data);
					done();
				})
.catch(done.fail);
		});
	});
});
