'use strict';
const Mux = require('@mux/mux-node');


const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::podcast.podcast', ({ strapi }) => ({
    async create(ctx) {
        const { Video, Data } = new Mux(process.env.MUX_TOKEN_ID, process.env.MUX_TOKEN_SECRET);
        const {
            author, title } = ctx.request.body.data;
        try {
            const response = await Video.LiveStreams.create({
                playback_policy: 'public',
                new_asset_settings: { playback_policy: 'public' }
            });
            console.log(response);
            ctx.request.body.data.streamId = response.id;
            ctx.request.body.data.streamKey = response.stream_key;
            const data = super.create(ctx);
            ctx.response.status = 200;
            return data;
        }
        catch (err) {
            ctx.response.status = 500;
            return {
                error: {
                    message: err
                }
            }
        }
    }
}));
