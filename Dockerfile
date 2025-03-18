FROM ubuntu:24.04

ENV RUBY_VERSION=3.3.3

# "#################################################"
# "Install Ubuntu prerequisites for Ruby and GitHub Pages (Jekyll)"
# "Partially based on https://gist.github.com/jhonnymoreira/777555ea809fd2f7c2ddf71540090526"
RUN apt-get update && apt-get -y install git \
    curl \
    autoconf \
    bison \
    build-essential \
    libssl-dev \
    libyaml-dev \
    libreadline6-dev \
    zlib1g-dev \
    libncurses5-dev \
    libffi-dev \
    libgdbm6 \
    libgdbm-dev \
    libdb-dev \
    apt-utils \
    nano \
    html-xml-utils \
    locales \
    python3 \
    python3-pip

# "#################################################"
# "Generating locales"
RUN dpkg-reconfigure locales \
  && locale-gen C.UTF-8 \
  && /usr/sbin/update-locale LANG=C.UTF-8
RUN echo 'en_US.UTF-8 UTF-8' >> /etc/locale.gen && locale-gen
ENV LC_ALL=C.UTF-8
ENV LANG=en_US.UTF-8
ENV LANGUAGE=en_US.UTF-8

# "#################################################"
# "Set Ruby's version and path"
# "Based on: https://talk.jekyllrb.com/t/liquid-4-0-3-tainted/7946/12"
ENV RBENV_ROOT=/usr/local/src/rbenv
ENV PATH="${RBENV_ROOT}/bin:${RBENV_ROOT}/shims:$PATH"

# "#################################################"
# "Install rbenv to manage Ruby versions"
RUN git clone https://github.com/rbenv/rbenv.git ${RBENV_ROOT} \
  && git clone https://github.com/rbenv/ruby-build.git \
    ${RBENV_ROOT}/plugins/ruby-build \
  && ${RBENV_ROOT}/plugins/ruby-build/install.sh \
  && echo 'eval "$(rbenv init -)"' >> /etc/profile.d/rbenv.sh

# "#################################################"
# "Install Ruby and set the global version"
RUN rbenv install ${RUBY_VERSION} \
  && rbenv global ${RUBY_VERSION}