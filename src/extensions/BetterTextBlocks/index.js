const BlockType = require('../../extension-support/block-type');
const ArgumentType = require('../../extension-support/argument-type');
const Scratch3LooksBlocks = require('../../blocks/scratch3_looks');
const Clone = require('../../util/clone');  

class text {
    constructor (runtime){
        /**
         * The runtime instantiating this block package.
         * @type {Runtime}
         */ 
        this.runtime = runtime;
        this.defaults = runtime.renderer.getBubbleDefaults()
        console.log(this)
    }

    _getLineHeight(size, font) {
        var temp = document.createElement('span'), ret;
        temp.setAttribute("style", `
            margin:0; 
            padding:0;
            font-family: ${font};
            font-size: ${size}`);
        temp.innerHTML = "A";
        temp.style.display = 'none'
    
        ret = temp.clientHeight;
        temp.remove()
        return ret;
    }
    _doesFontSuport(size, font) {
        const check = size+'px '+font
        return document.fonts.check(check)
    }
    _getBubbleState (target) {
        let bubbleState = target.getCustomState(Scratch3LooksBlocks.STATE_KEY);
        if (!bubbleState) {
            bubbleState = Clone.simple(Scratch3LooksBlocks.DEFAULT_BUBBLE_STATE);
            target.setCustomState(Scratch3LooksBlocks.STATE_KEY, bubbleState);
        }
        return bubbleState;
    }

    getInfo () {
        return {
            id: 'text',
            name: 'text bubble control',
            blocks: [
                { 
                    opcode: 'setFont',
                    text: 'set font to [font]',
                    blockType: BlockType.COMMAND,
                    arguments: {
                        font: {
                            type: ArgumentType.STRING,
                            menu: 'FONT',
                            defaultValue: this.defaults.FONT
                        }
                    }
                },
                {
                    opcode: 'setSize',
                    text: 'set the text size to [size]',
                    blockType: BlockType.COMMAND,
                    arguments: {
                        size: {
                            type: ArgumentType.NUMBER,
                            defaultValue: this.defaults.FONT_SIZE
                        }
                    }
                }
            ],
            menus: {
                FONT: {
                    items: this.getAllFonts(),
                    acceptReporters: true
                }
            }
        };
    }

    getAllFonts() {
        let fonts = document.fonts.values()
        let res = []
        let font = fonts.next()
        while (!font.done) {
            res.push({
                text: font.value.family,
                value: font.value.family
            })
            console.log(font.value)
            font = fonts.next()
        }

        return res
    }
    setFont(args, util) {
        const state = this._getBubbleState(util.target)
        if (!this._doesFontSuport(state.props.FONT_SIZE, args.font)) return
        state.props.LINE_HIEGHT = this._getLineHeight(state.props.FONT_SIZE, args.font)
        state.props.FONT = args.font
        util.target.setCustomState(Scratch3LooksBlocks.STATE_KEY, state);
    }
    setSize(args, util) {
        const state = this._getBubbleState(util.target)
        if (!this._doesFontSuport(args.size, state.props.FONT)) return
        state.props.LINE_HIEGHT = this._getLineHeight(args.size, state.props.FONT)
        state.props.FONT_SIZE = args.size
        util.target.setCustomState(Scratch3LooksBlocks.STATE_KEY, state);
    }
}

module.exports = text
