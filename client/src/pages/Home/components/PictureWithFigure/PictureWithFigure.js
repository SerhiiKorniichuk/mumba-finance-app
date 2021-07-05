import React, {Component} from 'react'
import './PictureWithFigure.scss'


class PictureWithFigure extends Component {
    render() {
        return (
            <div className="picture-with-figure">
                <div className="picture-with-figure__inner">
                    { this.props.image &&
                        <img src={ this.props.image } alt="SomePicture" />
                    }
                </div>
            </div>
        )
    }
}

export default PictureWithFigure