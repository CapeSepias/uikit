import Video from './video';
import { css, Dimensions, observeResize, parent } from 'uikit-util';

export default {
    mixins: [Video],

    props: {
        width: Number,
        height: Number,
    },

    data: {
        automute: true,
    },

    connected() {
        this.resizeObserver = observeResize(this.$el, () => this.$emit('resize'));
    },

    disconnected() {
        this.resizeObserver.disconnect();
    },

    update: {
        read() {
            const el = this.$el;
            const { offsetHeight: height, offsetWidth: width } =
                getPositionedParent(el) || parent(el);
            const dim = Dimensions.cover(
                {
                    width: this.width || el.naturalWidth || el.videoWidth || el.clientWidth,
                    height: this.height || el.naturalHeight || el.videoHeight || el.clientHeight,
                },
                {
                    width: width + (width % 2 ? 1 : 0),
                    height: height + (height % 2 ? 1 : 0),
                }
            );

            if (!dim.width || !dim.height) {
                return false;
            }

            return dim;
        },

        write({ height, width }) {
            css(this.$el, { height, width });
        },

        events: ['resize'],
    },
};

function getPositionedParent(el) {
    while ((el = parent(el))) {
        if (css(el, 'position') !== 'static') {
            return el;
        }
    }
}
