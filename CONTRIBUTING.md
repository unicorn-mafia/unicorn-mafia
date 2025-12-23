# Contributing to Unicorn Mafia

We love your input! We want to make contributing to the Unicorn Mafia project as easy and transparent as possible, whether it's:

- Adding your company to our member showcase
- Reporting a bug
- Discussing the current state of the community
- Submitting a fix
- Proposing new features

## Member Company Submissions

To add your company to our member showcase, please ensure it meets our criteria:

### Eligibility Criteria

- Company must have at least one founder or key team member who is part of the Unicorn Mafia community
- Company should be actively building or have built a technology product
- Company information should be publicly verifiable

### How to Submit Your Company

1. **Fork the repository**
2. **Edit the `public/companies-data.yaml` file**
3. **Add your company information** following the format below:
4. **Submit a Pull Request**

### Company Information Format

```yaml
- name: "Your Company Name"
  website_url: "https://yourcompany.com"
  logo_url: "https://yourcompany.com/logo.svg"
```

That's it! Just 3 simple fields required:
- **name**: Your company name
- **website_url**: Your company website
- **logo_url**: Full URL to your company logo (must be SVG or PNG)

### Logo Guidelines

Your logo will be displayed in a **128px × 30px** area (wide rectangle). Please follow these guidelines:

<img src="public/logo-area.png" width="215" alt="Logo Area Guide">

#### Dimensions & Format
- **Display area**: 128px wide × 30px tall
- **Aspect ratio**: ~4:1 (wide horizontal logos work best)
- **Format**: SVG preferred, PNG also works
- **File size**: Under 100KB

#### Do's
- Use a **horizontal/wordmark** version of your logo
- Export your logo **without extra padding or margins**
- Make sure the logo fills the width OR height of your artboard
- Use transparent backgrounds

#### Don'ts
- Don't use square logos with large margins (they'll appear tiny)
- Don't include excessive whitespace around the logo
- Don't use very tall/vertical logos
- Don't use `.ico` files (favicon.ico) - they render poorly and may display as a black box

#### Quick Test
Before submitting, check: if your logo SVG/PNG has lots of empty space around it, crop it! The logo should fill most of its artboard.

#### Easy Option
A direct link to your logo works fine:
```
logo_url: "https://yoursite.com/logo.svg"
```

## Development Process

We use GitHub flow, so all code changes happen through Pull Requests:

1. Fork the repo and create your branch from `main`
2. If you've added code that should be tested, add tests
3. If you've changed APIs or added features, update the documentation
4. Ensure the test suite passes
5. Make sure your code lints
6. Issue that Pull Request!

## Pull Request Process

1. **Clear Description**: Provide a clear description of what you're changing and why
2. **Testing**: Ensure any new features are properly tested
3. **Documentation**: Update relevant documentation
4. **Code Style**: Follow the existing code style and conventions

## Issues

We use GitHub issues to track public bugs. Report a bug by [opening a new issue](https://github.com/unicornmafia/website/issues).

### Bug Reports

**Great Bug Reports** tend to have:

- A quick summary and/or background
- Steps to reproduce
  - Be specific!
  - Give sample code if you can
- What you expected would happen
- What actually happens
- Notes (possibly including why you think this might be happening, or stuff you tried that didn't work)

## Feature Requests

We welcome feature requests! Please:

1. **Search first**: Check if someone has already suggested it
2. **Be specific**: Clearly describe the feature and its use case
3. **Consider the scope**: Think about how it fits with the project's goals

## Code of Conduct

### Our Pledge

We are committed to making participation in our project a harassment-free experience for everyone, regardless of age, body size, disability, ethnicity, gender identity and expression, level of experience, nationality, personal appearance, race, religion, or sexual identity and orientation.

### Our Standards

Examples of behavior that contributes to creating a positive environment include:

- Using welcoming and inclusive language
- Being respectful of differing viewpoints and experiences
- Gracefully accepting constructive criticism
- Focusing on what is best for the community
- Showing empathy towards other community members

### Enforcement

Project maintainers have the right and responsibility to remove, edit, or reject comments, commits, code, issues, and other contributions that are not aligned with this Code of Conduct.

## Getting Help

- **Documentation**: Check our README and existing issues first
- **Community**: Join our community discussions
- **Contact**: Reach out to the maintainers if you need direct assistance

## Recognition

Contributors will be recognized in our README and on our website. We appreciate all forms of contribution, from code to documentation to community building.

## License

By contributing, you agree that your contributions will be licensed under the same license as the project.

---

Thank you for contributing to Unicorn Mafia! 🦄