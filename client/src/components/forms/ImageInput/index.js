import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import './style.scss';

/* eslint-disable */

const WIDGET_SETTINGS = {
    cloudName: 'hackjunction',
    uploadPreset: 'projectplatform',
    cropping: true,
    croppingAspectRatio: 16 / 9,
    maxImageWidth: 1080,
    multiple: false,
    maxFiles: 1,
}

class ImageInput extends Component {
    static propTypes = {
        onChange: PropTypes.func.isRequired,
        value: PropTypes.string.isRequired,
        required: PropTypes.bool,
        editable: PropTypes.bool,
    };

    static defaultProps = {
        editable: true
    };

    constructor(props) {
        super(props);

        this.onWidgetResult = this.onWidgetResult.bind(this);
        this.openWidget = this.openWidget.bind(this);
        this.clear = this.clear.bind(this);
    }

    validate() {
        return null;
    }

    clear() {
        this.props.onChange(null);
    }

    getResultUrl(path) {
        return 'https://res.cloudinary.com/hackjunction/image/upload/c_crop,g_custom/' + path;
    }

    onWidgetResult(error, result) {
        if (error) {
            console.log('ERROR', error);
        }

        if (result && result.event === 'success') {
            const url = this.getResultUrl(result.info.path);

            this.props.onChange(url);
        }
    }

    openWidget() {
        cloudinary.openUploadWidget(WIDGET_SETTINGS, this.onWidgetResult)
    }

    renderButton(text) {
        if (this.props.editable) {
            return (
                <button className="ImageInput--Image_button" onClick={this.openWidget}>{text}</button>
            );
        } else {
            return (
                <i className="ImageInput--Image_lock fa fa-lock fa-2x" />
            );
        }
    }

    renderImage() {
        return (
            <div className="ImageInput--Image">
                <img src={this.props.value} />
                <div className="ImageInput--Image_overlay">
                    {this.renderButton('Change Image')}
                    <div className="ImageInput--Image_remove" onClick={this.clear}>
                        <i className="ImageInput--Image_remove-icon fas fa-times"></i>
                    </div>
                </div>
            </div>
        );
    }

    renderEmpty() {
        return (
            <div className="ImageInput--Image">
                <img src={require('../../../assets/default_img.png')} />
                <div className="ImageInput--Image_overlay">
                    {this.renderButton('Choose Image')}
                </div>
            </div>
        );
    }

    render() {

        return (
            <div className="ImageInput">
                {this.props.value ? (
                    this.renderImage()
                ) : this.renderEmpty()}
            </div>
        );
    }
}

export default ImageInput;
