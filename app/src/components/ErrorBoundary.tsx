import { Component, type ReactNode } from 'react';

/**
 * Если какой-то экран сломался, человек не должен остаться с белой
 * страницей: показываем спокойное сообщение и кнопку на главную.
 */
export class ErrorBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  private home = () => {
    window.location.replace('#/home');
    this.setState({ failed: false });
  };

  render() {
    if (!this.state.failed) return this.props.children;
    return (
      <div className="app">
        <main className="app__body" style={{ display: 'grid', placeContent: 'center', gap: 16, textAlign: 'center', padding: 24 }}>
          <h1 style={{ fontSize: 22, margin: 0 }}>Что-то пошло не так</h1>
          <p style={{ margin: 0 }}>Это не ты виноват(а). Вернёмся на главную?</p>
          <button className="btn btn--primary" onClick={this.home}>
            На главную
          </button>
        </main>
      </div>
    );
  }
}
