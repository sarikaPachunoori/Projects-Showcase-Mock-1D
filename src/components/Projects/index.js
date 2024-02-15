import {Component} from 'react'
import Loader from 'react-loader-spinner'

import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css'

import './index.css'

const categoriesList = [
  {id: 'ALL', displayText: 'All'},
  {id: 'STATIC', displayText: 'Static'},
  {id: 'RESPONSIVE', displayText: 'Responsive'},
  {id: 'DYNAMIC', displayText: 'Dynamic'},
  {id: 'REACT', displayText: 'React'},
]

const listStatus = {
  initial: 'INITIAL',
  loading: 'LOADING',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

class Projects extends Component {
  state = {
    list: [],
    status: listStatus.initial,
    selectedId: 'ALL',
  }

  componentDidMount() {
    this.getProjects()
  }

  getProjects = async () => {
    this.setState({status: listStatus.loading})
    const {selectedId} = this.state

    const response = await fetch(
      `https://apis.ccbp.in/ps/projects?category=${selectedId}`,
    )

    if (response.ok === true) {
      const data = await response.json()
      const updatedData = data.projects.map(eachOne => ({
        id: eachOne.id,
        imageUrl: eachOne.image_url,
        name: eachOne.name,
      }))
      this.setState({list: updatedData, status: listStatus.success})
    } else {
      this.setState({status: listStatus.failure})
    }
  }

  renderSuccessView = () => {
    const {list} = this.state

    return (
      <ul className="proj-cont">
        {list.map(proj => (
          <li key={proj.id} className="proj-item-cont">
            <img src={proj.imageUrl} alt={proj.name} className="proj-img" />
            <p className="proj-name">{proj.name}</p>
          </li>
        ))}
      </ul>
    )
  }

  onClickRetry = () => {
    this.getProjects()
  }

  renderFailureView = () => (
    <div className="failure-cont">
      <img
        src="https://assets.ccbp.in/frontend/react-js/projects-showcase/failure-img.png"
        alt="failure view"
        className="failure-img"
      />
      <h1 className="oops"> Oops! Something Went Wrong</h1>
      <p className="para">
        We cannot seem to find the page you are looking for
      </p>
      <button className="button" type="button" onClick={this.onClickRetry}>
        Retry
      </button>
    </div>
  )

  renderLoadingView = () => (
    <div className="loader-cont" data-testid="loader">
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </div>
  )

  changeOptions = event => {
    this.setState({selectedId: event.target.value}, this.getProjects)
  }

  showProjects = () => {
    const {status} = this.state

    switch (status) {
      case listStatus.success:
        return this.renderSuccessView()
      case listStatus.failure:
        return this.renderFailureView()
      case listStatus.loading:
        return this.renderLoadingView()
      default:
        return null
    }
  }

  render() {
    const {selectedId} = this.state

    return (
      <div className="main-cont">
        <div className="header-cont">
          <img
            src="https://assets.ccbp.in/frontend/react-js/projects-showcase/website-logo-img.png"
            alt="website logo"
            className="logo"
          />
          <div className="bottom-cont">
            <select
              id="mySelect"
              className="select-cont"
              onChange={this.changeOptions}
              value={selectedId}
            >
              {categoriesList.map(each => (
                <option value={each.id} key={each.id}>
                  {each.displayText}
                </option>
              ))}
            </select>
            {this.showProjects()}
          </div>
        </div>
      </div>
    )
  }
}
export default Projects
