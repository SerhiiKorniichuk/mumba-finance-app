import React from 'react';
import {connect} from "react-redux";
import Loader from 'react-loader-spinner';
import BraftEditor from 'braft-editor';
import {Button, Modal, Alert, Form, FormGroup, InputGroup, Input, Label} from 'reactstrap';
import {QUERY_STATIC_PAGE, MUTATION_SET_STATIC_PAGE, MUTATION_UPLOAD_PHOTO} from '../../../helpers/Api/Schema';
import {Mutation, Query} from "react-apollo";

import Skeleton from "react-loading-skeleton";

import {client} from '../../../helpers/Api/Provider';

class PageEdit extends React.Component {
    state = {
        title: null,
        content: null,
        metaTitle: null,
        metaDescription: null,
        metaKeywords: null,
        editorState: null,
        inited: false,
    };

    prepareOpen = () => {
        this.setState({
            title: null,
            content: null,
            metaTitle: null,
            metaDescription: null,
            metaKeywords: null,
            inited: false,
            editorState: null,
        });
    };

    componentWillUpdate(nextProps, nextState, nextContext) {
        if (nextProps.page && this.props.page === '') {
            this.prepareOpen();
        }
    }
    onChange = (e) => {
        const { name, value } = e.currentTarget;
        this.setState({ [name]: value });
    };

    onClose = () => {

        this.props.onClose();
    };

    handleEditorChange = (editorState) => {
        this.setState({ editorState })
    };

    render() {
        let {title, content, metaDescription, metaKeywords, metaTitle, editorState} = this.state;
        const {page} = this.props;
        const UploadFn = (param) => {
            client.mutate({
                variables: {file: param.file},
                mutation: MUTATION_UPLOAD_PHOTO
            }).then(({data}) => {
                if (data && data.uploadPhoto) {
                    param.success({
                        url: data.uploadPhoto,
                    });
                    param.progress(100);
                }
            }).catch((error) => {
                console.log(error);
                param.error({
                    msg: error.graphQLErrors.map(({ message }, i) => message).join(' '),
                });
            });
        };
        return (
            <Modal isOpen={page !== ''} toggle={this.onClose} className={this.props.className} size="lg">
                <div className="m-3">
                    <Query query={QUERY_STATIC_PAGE} variables={{page: page}}>
                        {({loading, error, data, fetchMore, refetch}) => {
                            const queryLoading = loading;
                            if (!queryLoading && data &&  data.getStaticPage) {
                                const Page = data.getStaticPage;
                                if (title === null) {
                                    title = Page.title;
                                }
                                if (metaDescription === null) {
                                    metaDescription = Page.metaDescription;
                                }
                                if (metaKeywords === null) {
                                    metaKeywords = Page.metaKeywords;
                                }
                                if (metaTitle === null) {
                                    metaTitle = Page.metaTitle;
                                }
                                if (content === null) {
                                    content = Page.content;
                                }
                            }
                            if (editorState === null && !queryLoading) {
                                this.setState({
                                   editorState: BraftEditor.createEditorState(content || null),
                                });
                            }
                            return (<>
                                    <Mutation mutation={MUTATION_SET_STATIC_PAGE} >
                                            {(mutate, {data, loading}) => {
                                                const processMutate = () => mutate({variables: {page, title, metaDescription, metaKeywords, metaTitle, content: this.state.editorState.toHTML()}});
                                                return (<Form role="form" onSubmit={e => {
                                                    e.preventDefault();
                                                    processMutate();
                                                }}>
                                                    {error && error.graphQLErrors.map(({ message }, i) => (
                                                        <Alert color="danger" key={i}>
                                                            {message}
                                                        </Alert>
                                                    ))}
                                                    {data && data.setStaticPage ? <Alert color="success" key={1223}>
                                                        Page has been updated!
                                                    </Alert> : ''}
                                                    <FormGroup className="mb-3">
                                                        <Label>Title</Label>
                                                        {queryLoading ? <Skeleton height={50}/> : <InputGroup>
                                                            <Input
                                                                type="text"
                                                                name="title"
                                                                placeholder="Title"
                                                                value={title || ''}
                                                                onChange={this.onChange}
                                                            />
                                                        </InputGroup>}
                                                    </FormGroup>
                                                    <FormGroup className="mb-3">
                                                        <Label>Meta title</Label>
                                                        {queryLoading ? <Skeleton height={50}/> : <InputGroup>
                                                            <Input
                                                                type="text"
                                                                name="metaTitle"
                                                                placeholder="Enter meta title here"
                                                                value={metaTitle || ''}
                                                                onChange={this.onChange}
                                                            />
                                                        </InputGroup>}
                                                    </FormGroup>
                                                    <FormGroup className="mb-3">
                                                        <Label>Meta description</Label>
                                                        {queryLoading ? <Skeleton height={50}/> : <InputGroup>
                                                            <Input
                                                                type="text"
                                                                name="metaDescription"
                                                                placeholder="Enter meta description here"
                                                                value={metaDescription || ''}
                                                                onChange={this.onChange}
                                                            />
                                                        </InputGroup>}
                                                    </FormGroup>
                                                    <FormGroup className="mb-3">
                                                        <Label>Meta keywords</Label>
                                                        {queryLoading ? <Skeleton height={50}/> : <InputGroup>
                                                            <Input
                                                                type="text"
                                                                name="metaKeywords"
                                                                placeholder="Enter meta keywords here"
                                                                value={metaKeywords || ''}
                                                                onChange={this.onChange}
                                                            />
                                                        </InputGroup>}
                                                    </FormGroup>
                                                    <FormGroup className="mb-3">
                                                        <Label>Content</Label>
                                                        {queryLoading ? <Skeleton height={200} /> : <InputGroup>
                                                            <div className="form-control" style={{height: 'auto'}}>
                                                                <BraftEditor
                                                                    media={{uploadFn: UploadFn}}
                                                                    language="en"
                                                                    value={editorState}
                                                                    onChange={this.handleEditorChange}
                                                                    onSave={processMutate}
                                                                />
                                                            </div>
                                                        </InputGroup>}
                                                    </FormGroup>
                                                    <FormGroup className="mt-2">
                                                        {queryLoading ? <Skeleton height={40} width={100}/> : <Button disabled={loading} color="success">
                                                            {loading ? <Loader
                                                                type="ThreeDots"
                                                                color="#fff"
                                                                height={7}
                                                                width={45}
                                                            /> : 'Save page'}
                                                        </Button>}
                                                    </FormGroup>
                                                </Form>);
                                            }}
                                        </Mutation>
                            </>);
                        }}
                    </Query>
                </div>
            </Modal>
        );
    }
}

const mapStateToProps = ({auth}) => ({
    userId: auth.userId
});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(PageEdit);
