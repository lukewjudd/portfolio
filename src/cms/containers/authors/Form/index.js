import React, { Component, PropTypes } from 'react';
import { fetchAuthor, updateAuthor } from '../../../actions/authors';
import { updateSocialAccount } from '../../../actions/socialAccounts';
import { connect } from 'react-redux';
import { reduxForm } from 'redux-form';
import DropzoneImage from '../../../components/shared/DropzoneImage/index';
import TextField from 'material-ui/TextField';
import TextEditor from '../../../components/shared/TextEditor/Editor/index'
import SocialAccount from '../../../components/authors/forms/SocialAccount/index';
import RaisedButton from 'material-ui/RaisedButton';
import styles from './styles.scss';


const propTypes = {
  fields: PropTypes.object.isRequired,
  socialAccounts: PropTypes.arrayOf(
    PropTypes.shape({
      accountType: PropTypes.string.isRequired,
      url: PropTypes.string,
      id: PropTypes.number,
      authorId: PropTypes.number
    })),
  params: PropTypes.object,
  fetchAuthor: PropTypes.func.isRequired,
  updateAuthor: PropTypes.func.isRequired,
  updateSocialAccount: PropTypes.func.isRequired
};


const inlineStyles = {
  submitButton: {
    position: 'absolute',
    bottom: 10,
    right: 15
  },
  indicator: {
    display: 'inline-block',
    position: 'relative'
  }
};

class AuthorForm extends Component {
  constructor(props) {
    super(props);

    this.handleSubmit               = this.handleSubmit.bind(this);
    this.handleUpdateSocialAccount  = this.handleUpdateSocialAccount.bind(this);

  }

  componentWillMount() {
    this.props.fetchAuthor()
  }

  handleSubmit(props) {
    this.props.updateAuthor(
      {
        author: {
          ...props,
          socialAccountsAttributes: this.props.socialAccounts
        }
      }
    );
  }
 
  handleUpdateSocialAccount(sortRank, url) {
    this.props.updateSocialAccount(sortRank, url)
  }

  renderSocialAccounts() {
    return(
      this.props.socialAccounts.map((account, index) => {
        return (
          <SocialAccount
            key={index}
            sortRank={index}
            accountType={account.accountType}
            url={account.url}
            handleUpdate={this.handleUpdateSocialAccount}
          />
        )
      })
    );
  }

  render() {
    const { handleSubmit, submitting, fields: { name, image, description, introduction } } = this.props;
    
    return (
      <form className={styles.root} onSubmit={handleSubmit(this.handleSubmit)}>
        <h2 className={styles.heading}>Update About</h2>
        <TextField
          {...name}
          floatingLabelText="name"
          hintText="Enter name"
          fullWidth={true}
          errorText={name.touched && name.error ? name.error : ''}
        />
        <br/>
        <TextEditor
          key="description"
          {...description}
          handleUpdate={ (value) => { description.onChange(value) }}
        />
        <TextEditor
          key="introduction"
          {...introduction}
          handleUpdate={ (value) => { introduction.onChange(value) }}
        />
        <br/>
        <br />
        <DropzoneImage
          {...image}
          handleUpdate={ (file) => image.onChange(file) }
        />
        <br />
        <br />
        {this.renderSocialAccounts()}
        <RaisedButton
          type="submit"
          label="Update"
          secondary={true}
          submitting={submitting}
          style={inlineStyles.submitButton}
        />
      </form>

    );
  }
}


function validate(values) {
  const errors = {};
  if(!values.name) {
    errors.name = "Entry name"
  }

  return errors;
}

const fields = [
  "id", "name", "image", "description", "introduction"
];

function mapStateToProps(state) {
  return {
    initialValues: state.authors.author,
    socialAccounts: state.socialAccounts
  }
}

AuthorForm.propTypes = propTypes;

export default reduxForm({
  form: "AuthorForm",
  fields,
  validate
}, mapStateToProps, {
  fetchAuthor,
  updateAuthor,
  updateSocialAccount
})(AuthorForm);