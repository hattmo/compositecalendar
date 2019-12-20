export default async (time: number) => new Promise((res) => {
    setTimeout(res, time);
});
